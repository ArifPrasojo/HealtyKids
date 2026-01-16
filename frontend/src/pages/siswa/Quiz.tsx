// src/pages/siswa/Quiz.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import CloudBackground from '../../components/layouts/CloudBackground';
import { userQuizService } from '../../services/api/userQuizService';

// Base URL API (Hanya disimpan untuk keperluan FILE_BASE_URL gambar)
const API_BASE_URL = import.meta.env.VITE_API_URL;
const FILE_BASE_URL = API_BASE_URL?.replace('/api', ''); 

interface QuizQuestion {
  id: number;
  question: string;
  photo: string | null;
  options: string[];
  answerIds: number[]; 
  correctAnswer: number; 
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE (LOGIC) ---
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); 
  
  // Logic Waktu
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0); 

  const [isPaused, setIsPaused] = useState(false);
  const [pauseTimeRemaining, setPauseTimeRemaining] = useState(300);

  // --- STATE BARU: Konfirmasi Mulai ---
  const [showStartConfirmation, setShowStartConfirmation] = useState(false);

  // State untuk Modal Error
  const [errorModal, setErrorModal] = useState<{ show: boolean; message: string }>({
    show: false,
    message: ''
  });

  // --- FETCHING DATA API (UPDATED) ---
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const token = localStorage.getItem('token'); 

        if (!token) {
          navigate('/login');
          return;
        }

        // MENGGUNAKAN SERVICE
        const response = await userQuizService.getQuizData(token);

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        // Handle jika materi belum selesai (403)
        if (response.status === 403) {
          const errorData = await response.json();
          setErrorModal({
            show: true,
            message: errorData.error || errorData.message || "Selesaikan semua materi terlebih dahulu"
          });
          setIsLoading(false); 
          return;
        }

        // Handle jika Quiz Dinonaktifkan/Tidak Ditemukan (404)
        if (response.status === 404) {
            setErrorModal({
              show: true,
              message: "Quiz sedang dinonaktifkan, hubungi admin untuk mengaktifkan"
            });
            setIsLoading(false);
            return;
        }

        if (!response.ok) throw new Error("Gagal mengambil data quiz");

        const responseData = await response.json();

        if (responseData.success && responseData.data) {
          const apiData = responseData.data;

          // MAPPING DATA
          const mappedQuestions: QuizQuestion[] = apiData.questions.map((q: any) => {
            const correctIndex = q.answers.findIndex((a: any) => 
                a.is_correct === 1 || a.is_correct === true || a.isCorrect === true
            );
            
            return {
              id: q.id, 
              question: q.question,
              photo: q.photo, 
              options: q.answers.map((a: any) => a.answer), 
              answerIds: q.answers.map((a: any) => a.id), 
              correctAnswer: correctIndex !== -1 ? correctIndex : 0
            };
          });

          setQuestions(mappedQuestions);
          setSelectedAnswers(new Array(mappedQuestions.length).fill(-1));
          
          // Set Waktu
          const durationInSeconds = apiData.duration ? apiData.duration * 60 : 1200;
          setTotalDuration(durationInSeconds);
          setTimeLeft(durationInSeconds);

          // --- LOGIC TAMBAHAN: Tampilkan Konfirmasi setelah data siap ---
          setShowStartConfirmation(true);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        if (!errorModal.show) {
              setIsLoading(false);
        }
      }
    };

    fetchQuizData();
  }, [navigate]);

  // --- TIMER LOGIC (MODIFIED) ---
  // Timer tidak jalan jika showStartConfirmation masih true
  useEffect(() => {
    if (timeLeft > 0 && !isPaused && !isLoading && !errorModal.show && !isSubmitting && !showStartConfirmation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isLoading && questions.length > 0 && !errorModal.show && !isSubmitting && !showStartConfirmation) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isPaused, isLoading, questions, errorModal.show, isSubmitting, showStartConfirmation]);

  // --- PAUSE LOGIC ---
  useEffect(() => {
    if (isPaused && pauseTimeRemaining > 0) {
      const interval = setInterval(() => {
        setPauseTimeRemaining(prev => {
          if (prev <= 1) {
            handleResume();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, pauseTimeRemaining]);

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => { if (pauseTimeRemaining > 0) setIsPaused(true); };
  const handleResume = () => { setIsPaused(false); };
  
  // Fungsi untuk memulai Quiz (setelah konfirmasi)
  const handleStartQuiz = () => {
    setShowStartConfirmation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // --- FUNGSI SUBMIT ---
  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    // Hitung waktu terpakai
    const timeSpent = Math.max(0, totalDuration - timeLeft);

    const formattedResult = questions.map((q, index) => {
        const selectedOptionIndex = selectedAnswers[index];
        const answerId = selectedOptionIndex !== -1 ? q.answerIds[selectedOptionIndex] : null;

        return {
            questionId: q.id,
            answerId: answerId
        };
    }).filter(item => item.answerId !== null) as { questionId: number; answerId: number }[];

    const payload = {
        result: formattedResult
    };

    try {
      const token = localStorage.getItem('token');
      
      if (token) {
         const response = await userQuizService.submitQuizResult(token, payload);
         const responseJson = await response.json();
   
         if (!response.ok) {
           throw new Error(responseJson.message || "Gagal menyimpan ke database");
         }
      }

    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      let correctCount = 0;
      selectedAnswers.forEach((answer, index) => {
        if (questions[index] && answer === questions[index].correctAnswer) {
          correctCount++;
        }
      });
      
      const resultsForUI = {
        score: Math.floor((correctCount / questions.length) * 100),
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        incorrectAnswers: questions.length - correctCount,
        selectedAnswers,
        questions,
        timeTaken: timeSpent 
      };

      localStorage.setItem('quizResults', JSON.stringify(resultsForUI));
      setIsSubmitting(false);
      navigate('/result');
    }
  };

  const currentQuiz = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const allAnswered = selectedAnswers.length > 0 && selectedAnswers.every(answer => answer !== -1);

  // --- LOADING STATE ---
  if ((isLoading || isSubmitting) && !errorModal.show) {
    return (
      <div className="min-h-screen py-8 px-6 relative flex items-center justify-center">
        <CloudBackground />
        <div className="bg-white p-8 rounded-3xl shadow-xl z-10 text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
           <p className="text-gray-600 font-bold">
             {isSubmitting ? "Menyimpan Jawaban ke Database..." : "Memuat Data Quiz..."}
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-8 px-4 md:px-6 relative">
      <CloudBackground />
      
      {/* --- MODAL ERROR --- */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-red-100">
            <div className="mb-6 bg-red-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Dibatasi</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {errorModal.message}
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-bold shadow-lg text-lg w-full transition-all hover:scale-105"
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI MULAI (BARU) --- */}
      {showStartConfirmation && !errorModal.show && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-blue-100">
            <div className="mb-6 bg-blue-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Persiapan Quiz</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Apakah anda sudah memahami semua materi sebelum mengerjakan?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-bold"
              >
                Kembali
              </Button>
              <Button
                onClick={handleStartQuiz}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-full font-bold shadow-lg"
              >
                Ya, Mulai Quiz
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL PAUSE --- */}
      {isPaused && (
        <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Dijeda</h2>
            <p className="text-gray-600 mb-6">
              Quiz sedang dijeda. Klik tombol lanjutkan untuk melanjutkan quiz.
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800 font-semibold mb-2">Waktu Jeda Tersisa:</p>
              <p className="text-3xl font-bold text-yellow-600">{formatTime(pauseTimeRemaining)}</p>
            </div>
            <Button
              onClick={handleResume}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-lg text-lg w-full"
            >
              Lanjutkan Quiz
            </Button>
          </div>
        </div>
      )}

      {/* Konten Utama Quiz (Hanya tampil jika tidak ada error & sudah konfirmasi mulai) */}
      {!errorModal.show && !showStartConfirmation && questions.length > 0 && (
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Quiz Progress */}
            <div className="flex-1">
              <h3 className="text-xs md:text-sm font-bold text-gray-700 mb-2">Quiz Progress</h3>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs md:text-sm font-bold text-green-600">
                  {currentQuestion + 1}/{questions.length}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] md:text-xs text-gray-500">
                  {selectedAnswers.filter(a => a !== -1).length} dari {questions.length} soal dijawab
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs md:text-sm font-bold text-gray-700">Waktu Tersisa:</span>
                  <div className={`text-sm md:text-lg font-bold px-2 py-1 rounded-lg ${
                    timeLeft > 300 ? 'text-green-600 bg-green-50' : 
                    timeLeft > 60 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end mt-2">
                <div className="text-[10px] md:text-xs text-gray-500">
                  Waktu jeda tersisa: {formatTime(pauseTimeRemaining)}
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="md:ml-8">
               <h3 className="text-xs md:text-sm font-bold text-gray-700 mb-2 text-center md:text-left">
                Question Navigation
              </h3>
              <div className="space-y-3">
                <div className="overflow-x-auto max-w-full pb-2 md:pb-0">
                  <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 justify-items-center min-w-max md:min-w-0 mx-auto">
                    {questions.slice(0, 10).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        disabled={isSubmitting}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 flex items-center justify-center ${
                          currentQuestion === index
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg transform scale-110 z-10'
                            : selectedAnswers[index] !== -1
                            ? 'bg-blue-400 text-white'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
                
                {questions.length > 10 && (
                  <details className="group flex flex-col-reverse">
                    <summary className="cursor-pointer list-none flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 md:px-4 py-2 rounded-lg transition-colors w-full">
                      <span className="text-xs md:text-sm font-semibold text-gray-700">
                        Soal 11-{questions.length}
                      </span>
                      <svg className="w-4 h-4 text-gray-600 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="mb-3 overflow-x-auto max-w-full pb-2 md:pb-0">
                      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 justify-items-center min-w-max md:min-w-0 mx-auto">
                        {questions.slice(10).map((_, index) => {
                          const actualIndex = index + 10;
                          return (
                            <button
                              key={actualIndex}
                              onClick={() => setCurrentQuestion(actualIndex)}
                              disabled={isSubmitting}
                              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 flex items-center justify-center ${
                                currentQuestion === actualIndex
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg transform scale-110 z-10'
                                  : selectedAnswers[actualIndex] !== -1
                                  ? 'bg-blue-400 text-white'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              {actualIndex + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 md:px-4 py-2 rounded-full border border-green-200">
              <span className="text-green-600 font-bold text-xs md:text-sm">Soal {currentQuestion + 1} dari {questions.length}</span>
            </div>
            
            {selectedAnswers[currentQuestion] !== -1 && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 md:px-4 py-2 rounded-full border border-blue-200">
                <span className="text-blue-600 font-bold text-xs md:text-sm">Sudah dijawab</span>
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <div className="mb-6 md:mb-8">
            {/* UI RENDER GAMBAR */}
            {currentQuiz?.photo && (
                <div className="mb-4 flex justify-center bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <img 
                        src={`${FILE_BASE_URL}${currentQuiz.photo}`} 
                        alt="Question Visual"
                        className="rounded-lg object-contain max-h-64 md:max-h-80 w-auto"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}
            
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              {currentQuiz?.question}
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {currentQuiz?.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswers[currentQuestion] === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isSubmitting}
                  className={`w-full flex items-center p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-bold text-sm md:text-lg ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {optionLetter}
                    </div>
                    <span className={`text-sm md:text-lg font-medium ${
                      isSelected ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <div className="ml-2 md:ml-4">
                      <svg className="w-5 h-5 md:w-7 md:h-7 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3">
             <Button
              variant="secondary"
              size="lg"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0 || isSubmitting}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              Kembali
            </Button>

            <Button
              onClick={handlePause}
              disabled={pauseTimeRemaining === 0 || isSubmitting}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Pause</span>
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="success"
                size="lg"
                onClick={handleSubmitQuiz}
                disabled={!allAnswered || isSubmitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isSubmitting ? 'Menyimpan...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button
                variant="success"
                size="lg"
                onClick={handleNextQuestion}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg text-sm md:text-base"
              >
                Lanjut
              </Button>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Quiz;