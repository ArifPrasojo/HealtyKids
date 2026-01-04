import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import CloudBackground from '../../components/layouts/CloudBackground';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(25).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTimeRemaining, setPauseTimeRemaining] = useState(300);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isPaused]);

  // Pause timer effect - countdown waktu jeda
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    if (pauseTimeRemaining > 0) {
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "Masa remaja dikenal sebagai masa transisi. Transisi apakah yang sedang dialami remaja?",
      options: [
        "Dari suka main game ke suka belajar",
        "Dari masa anak-anak menuju masa dewasa",
        "Dari sekolah dasar ke sekolah menengah",
        "Dari bergantung orang tua menjadi serba mandiri"
      ],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Apa yang terjadi pada masa pubertas?",
      options: [
        "Remaja mulai suka berpacaran",
        "Terjadi proses kematangan seksual secara pesat",
        "Remaja lebih suka menyendiri",
        "Emosi menjadi sangat stabil"
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "Apa yang dimaksud dengan perilaku seksual?",
      options: [
        "Segala tindakan yang dilakukan karena dorongan keinginan seksual",
        "Hanya hubungan intim antara suami istri",
        "Kegiatan pacaran biasa seperti jalan bersama",
        "Perasaan suka terhadap lawan jenis"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Dalam pacaran, sentuhan seperti pegangan tangan bisa menjadi berisiko karena…",
      options: [
        "Melanggar aturan agama",
        "Dapat memicu keinginan untuk sentuhan yang lebih intim",
        "Bisa membuat pasangan jadi malu",
        " Dapat menimbulkan cemburu dari teman"
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      question: "Apa itu necking?",
      options: [
        "Berciuman di pipi sebagai salam",
        "Ciuman dan sentuhan intens di area leher",
        "Berpelukan erat di tempat umum",
        "Berbisik-bisik dengan pasangan"
      ],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "Apa yang dilakukan dalam petting?",
      options: [
        "Hanya berpegangan tangan dan berpelukan",
        "Mengobrol tentang masa depan",
        "Sentuhan yang sudah melibatkan area sensitif tubuh",
        "Memberi hadiah kejutan untuk pasangan"
      ],
      correctAnswer: 3
    },
    {
      id: 7,
      question: "Apa kepanjangan dari LGBT?",
      options: [
        "Liga, Grup, Bakat, Tim",
        "Lesbian, Gay, Biseksual, Transgender",
        " Lingkungan, Gabungan, Bersama, Teman",
        "Lawan, Gender, Bebas, Terbuka"
      ],
      correctAnswer: 2
    },
    {
      id: 8,
      question: "Mengapa perilaku seksual dalam konteks LGBT dianggap berisiko?",
      options: [
        "Karena sering dianggap aneh oleh masyarakat",
        "Karena dapat melibatkan aktivitas seksual tidak aman dan berisiko IMS",
        "Karena tidak akan pernah diterima keluarga",
        "Karena hanya dilakukan oleh orang dewasa"
      ],
      correctAnswer: 2
    },
    {
      id: 9,
      question: "Salah satu contoh cyber sex adalah…",
      options: [
        "Mengirim pesan 'Good Morning' setiap hari",
        "Video Call Sex (VCS) dengan konten eksplisit",
        "Mengirim foto selfie ke pacar",
        "Update status romantis di media sosial"
      ],
      correctAnswer: 2
    },
    {
      id: 10,
      question: "Hubungan seksual yang melibatkan mulut dan alat kelamin disebut…",
      options: [
        "Intercourse sex",
        "Anal sex",
        "Oral sex",
        "Petting"
      ],
      correctAnswer: 3
    },
    {
      id: 11,
      question: "Mengapa anal sex berbahaya untuk kesehatan?",
      options: [
        "Karena tidak akan menyebabkan kehamilan",
        "Karena dinding anus sensitif, mudah robek, dan penuh bakteri",
        "Karena hanya dilakukan oleh pasangan menikah",
        "darena bisa menyebabkan bau tidak sedap"
      ],
      correctAnswer: 2
    },
    {
      id: 12,
      question: "Infeksi Menular Seksual (IMS) bisa menular melalui cara berikut, kecuali…",
      options: [
        "Hubungan seks vaginal",
        "Hubungan seks oral",
        "Berjabat tangan dengan penderita",
        "Hubungan seks anal"

      ],
      correctAnswer: 3
    },
    {
      id: 13,
      question: "IMS yang dapat menyebabkan kutil di area genital dan berisiko kanker serviks adalah…",
      options: [
        "Gonore",
        "Sifilis",
        "HPV (Human Papilloma Virus",
        "Herpes Genital"
      ],
      correctAnswer: 3
    },
    {
      id: 14,
      question: "HIV/AIDS TIDAK menular melalui",
      options: [
        "Darah",
        "Sperma",
        "Keringat",
        "Cairan vagina"
      ],
      correctAnswer: 3
    },
    {
      id: 15,
      question: "Apa itu \"periode jendela\" pada infeksi HIV?",
      options: [
        "Masa di mana penderita sudah parah dan harus dirawat",
        "Masa setelah terpapar di mana virus sudah ada tapi tes mungkin belum mendeteks",
        "Masa di mana penderita bebas beraktivitas tanpa gejala",
        "Masa penyembuhan total dari HIV"
      ],
      correctAnswer: 2
    },
    {
      id: 16,
      question: "Mengapa kehamilan di luar nikah pada remaja berisiko menyebabkan depresi?",
      options: [
        "Karena harus berhenti sekolah",
        "Karena tubuhnya berubah menjadi gemuk",
        "Karena mendapat stigma negatif dari masyaraka",
        "Karena tidak bisa lagi main dengan teman"
      ],
      correctAnswer: 3
    },
    {
      id: 17,
      question: "Perilaku seksual bisa menyebabkan kecanduan. Mengapa hal itu bisa terjadi?",
      options: [
        "Karena dipaksa oleh pasangan",
        "Karena otak mengulangi aktivitas yang melepaskan dopamin (rasa senang) ",
        "Karena melihat iklan di televisi",
        "Karena kurangnya kegiatan lain"
      ],
      correctAnswer: 2
    },
    {
      id: 18,
      question: "Faktor eksternal yang paling kuat memengaruhi remaja melakukan perilaku seksual berisiko adalah……",
      options: [
        "Tayangan di media sosial",
        "Pengaruh atau tekanan dari teman sebaya",
        "Kurang perhatian orang tua",
        "Banyak waktu luang"
      ],
      correctAnswer: 2
    },
    {
      id: 19,
      question: "Manakah cara pencegahan perilaku seksual berisiko yang tepat?",
      options: [
        "Tidak bergaul dengan lawan jenis sama sekali",
        "Menghabiskan waktu hanya untuk belajar",
        "Membuat batasan diri dan melakukan kegiatan positif ",
        "Memutuskan untuk pacaran serius agar tidak salah pergaulan"
      ],
      correctAnswer: 3
    },
    {
      id: 20,
      question: "Sebaiknya kita mencari informasi tentang kesehatan reproduksi dari…",
      options: [
        "Cerita teman yang sudah berpengalaman",
        "Grup media sosial tanpa moderator ahli",
        "Sumber valid seperti tenaga kesehatan atau fasilitas kesehatan",
        "Film atau sinetron yang mengandung edukasi"
      ],
      correctAnswer: 3
    },
    {
      id: 21,
      question: "Apa alasan utama dari dalam diri remaja yang mendorong perilaku seksual berisiko?",
      options: [
        "Ingin terlihat keren dan modern di mata teman-teman.",
        "Kurangnya pengetahuan dan adanya rasa penasaran yang besar",
        "Adanya program acara televisi yang tidak mendidik",
        "Karena tidak ada larangan yang jelas dari orang tua."
      ],
      correctAnswer: 2
    },
    {
      id: 22,
      question: "Bagaimana sebaiknya sikap kita jika melihat teman melakukan perilaku berisiko?",
      options: [
        "Ikut melakukan agar tidak dianggap ketinggalan zaman.",
        "Menjauhi teman tersebut sepenuhnya.",
        "Menegur dengan baik dan menjaga diri sendiri untuk tidak ikut-ikutan",
        "Pura-pura tidak melihat dan tidak peduli."
      ],
      correctAnswer: 3
    },
    {
      id: 23,
      question: "Apa dampak emosional yang mungkin dialami remaja setelah melakukan perilaku seksual berisiko?",
      options: [
        "Merasa lebih percaya diri dan dewasa.",
        "Emosi menjadi tidak stabil, seperti mudah merasa bersalah dan depresi",
        "Menjalin hubungan yang lebih erat dengan pasangan.",
        "Tidak merasakan dampak apa-apa."
      ],
      correctAnswer: 2
    },
    {
      id: 24,
      question: "Mengapa jejak digital dari aktivitas seksual online seperti berbagi foto intim sangat berbahaya?",
      options: [
        "Karena bisa membuat baterai handphone cepat habis",
        "Karena dapat tersebar luas di internet dan sulit dihapus, merusak reputasi",
        "Karena melanggar hak cipta fotografi.",
        "Karena akan memenuhi memori penyimpanan."
      ],
      correctAnswer: 2
    },
    {
      id: 25,
      question: "Bagaimana cara terbaik untuk memenuhi rasa penasaran tentang seksualitas yang wajar?",
      options: [
        "Mencoba sendiri bersama pacar",
        "Mencari informasi dari sumber yang valid dan terpercaya",
        "Hanya bertanya kepada teman sebaya.",
        "Menonton video-video di internet secara sembunyi-sembunyi"
      ],
      correctAnswer: 2
    }
  ];

  const currentQuiz = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = selectedAnswers.every(answer => answer !== -1);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    let xpEarned = 0;
    
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const results = {
      score: correctCount,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      totalXP: xpEarned,
      selectedAnswers,
      questions,
      timeTaken: 600 - timeLeft
    };

    localStorage.setItem('quizResults', JSON.stringify(results));
    navigate('/result');
  };

  return (
    <div className="min-h-screen py-4 md:py-8 px-4 md:px-6 relative">
      <CloudBackground />
      
      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
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
              
              {/* Timer dan Soal Dijawab di Samping */}
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

              {/* Pause Info */}
              <div className="flex items-center justify-end mt-2">
                <div className="text-[10px] md:text-xs text-gray-500">
                  Waktu jeda tersisa: {formatTime(pauseTimeRemaining)}
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            {/* Question Navigation */}
            <div className="md:ml-8">
              <h3 className="text-xs md:text-sm font-bold text-gray-700 mb-2 text-center md:text-left">
                Question Navigation
              </h3>
              <div className="space-y-3">
                {/* Grid soal 1-10 */}
                <div className="overflow-x-auto max-w-full pb-2 md:pb-0">
                  <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 justify-items-center min-w-max md:min-w-0 mx-auto">
                    {questions.slice(0, 10).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
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
                
                {/* Dropdown untuk soal 11-25 */}
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
          {/* Badge */}
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

          {/* Question */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              {currentQuiz.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {currentQuiz.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswers[currentQuestion] === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full flex items-center p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                  }`}
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

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              Kembali
            </Button>

            <Button
              onClick={handlePause}
              disabled={pauseTimeRemaining === 0}
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
                disabled={!allAnswered}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="success"
                size="lg"
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg text-sm md:text-base"
              >
                Lanjut
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;