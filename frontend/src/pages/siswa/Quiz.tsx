import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Tambah import
import { Button } from '../../components/ui/Button';
import CloudBackground from '../../components/layouts/CloudBackground';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  tip: string;
  xpReward: number;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate(); // Tambah navigate

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(10).fill(-1)); // -1 berarti belum dijawab
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 menit dalam detik

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Waktu habis, submit quiz otomatis
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  // Format waktu ke MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "Apa yang dimaksud dengan pubertas?",
      options: [
        "Masa pertumbuhan tinggi badan",
        "Masa perubahan dari anak-anak menjadi dewasa",
        "Masa belajar di sekolah",
        "Masa bermain dengan teman"
      ],
      correctAnswer: 1,
      tip: "Pubertas adalah masa transisi dari anak-anak menuju dewasa dengan perubahan fisik dan emosional",
      xpReward: 10
    },
    {
      id: 2,
      question: "Pada usia berapa biasanya anak perempuan mengalami menstruasi pertama?",
      options: [
        "8-10 tahun",
        "10-15 tahun",
        "16-18 tahun",
        "18-20 tahun"
      ],
      correctAnswer: 1,
      tip: "Menstruasi pertama (menarche) biasanya terjadi antara usia 10-15 tahun",
      xpReward: 10
    },
    {
      id: 3,
      question: "Apa yang harus dilakukan untuk menjaga kebersihan organ reproduksi?",
      options: [
        "Mandi 1 kali seminggu",
        "Menggunakan celana ketat terus menerus",
        "Membersihkan dengan air bersih setiap hari",
        "Tidak perlu dibersihkan"
      ],
      correctAnswer: 2,
      tip: "Kebersihan organ reproduksi sangat penting dengan membersihkan menggunakan air bersih setiap hari",
      xpReward: 10
    },
    {
      id: 4,
      question: "Mengapa penting untuk mengganti pakaian dalam setiap hari?",
      options: [
        "Agar terlihat rapi",
        "Mencegah infeksi dan menjaga kebersihan",
        "Supaya tidak berbau",
        "Karena disuruh orang tua"
      ],
      correctAnswer: 1,
      tip: "Mengganti pakaian dalam setiap hari mencegah pertumbuhan bakteri dan infeksi",
      xpReward: 10
    },
    {
      id: 5,
      question: "Apa yang sebaiknya dilakukan jika mengalami perubahan tubuh yang membingungkan?",
      options: [
        "Menyimpannya sendiri",
        "Bertanya pada teman saja",
        "Berbicara dengan orang tua atau guru yang dipercaya",
        "Mencari informasi di internet tanpa bimbingan"
      ],
      correctAnswer: 2,
      tip: "Selalu bertanya pada orang tua, guru, atau orang dewasa yang dipercaya tentang perubahan tubuh",
      xpReward: 10
    },
    {
      id: 6,
      question: "Bagaimana cara yang benar membersihkan organ intim untuk anak perempuan?",
      options: [
        "Dari belakang ke depan",
        "Dari depan ke belakang",
        "Tidak ada aturan khusus",
        "Menggunakan sabun wangi"
      ],
      correctAnswer: 1,
      tip: "Membersihkan dari depan ke belakang mencegah bakteri dari anus masuk ke organ intim",
      xpReward: 10
    },
    {
      id: 7,
      question: "Apa yang dimaksud dengan sentuhan yang tidak baik (bad touch)?",
      options: [
        "Sentuhan saat bermain dengan teman",
        "Pelukan dari orang tua",
        "Sentuhan pada area pribadi yang membuatmu tidak nyaman",
        "Berjabat tangan dengan guru"
      ],
      correctAnswer: 2,
      tip: "Sentuhan yang tidak baik adalah sentuhan yang membuatmu tidak nyaman, terutama di area pribadi",
      xpReward: 10
    },
    {
      id: 8,
      question: "Apa yang harus dilakukan jika ada orang yang menyentuh area pribadimu dengan tidak pantas?",
      options: [
        "Diam saja",
        "Segera pergi dan beritahu orang tua atau guru",
        "Tertawa saja",
        "Menyimpannya sendiri"
      ],
      correctAnswer: 1,
      tip: "Segera lapor ke orang tua, guru, atau orang dewasa yang dipercaya jika ada sentuhan tidak pantas",
      xpReward: 10
    },
    {
      id: 9,
      question: "Bagian tubuh mana yang termasuk area pribadi yang harus dijaga?",
      options: [
        "Hanya wajah",
        "Dada, organ intim, dan pantat",
        "Hanya tangan dan kaki",
        "Semua bagian tubuh boleh disentuh siapa saja"
      ],
      correctAnswer: 1,
      tip: "Area pribadi adalah bagian yang tertutup pakaian dalam dan harus dijaga dengan baik",
      xpReward: 10
    },
    {
      id: 10,
      question: "Mengapa penting untuk mengetahui tentang kesehatan reproduksi sejak dini?",
      options: [
        "Untuk pamer kepada teman",
        "Agar bisa menjaga diri dan tumbuh sehat",
        "Tidak penting",
        "Hanya untuk orang dewasa"
      ],
      correctAnswer: 1,
      tip: "Pengetahuan kesehatan reproduksi membantu menjaga diri dan tumbuh dengan sehat",
      xpReward: 10
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
        xpEarned += questions[index].xpReward;
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
      timeTaken: 600 - timeLeft // Waktu yang digunakan
    };

    // Simpan ke localStorage
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    // Arahkan ke halaman Result
    navigate('/result');
  };

  return (
    <div className="min-h-screen py-4 md:py-8 px-4 md:px-6 relative">
      <CloudBackground />
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
            </div>

            {/* Question Navigation */}
            <div className="md:ml-8">
              <h3 className="text-xs md:text-sm font-bold text-gray-700 mb-2 text-center">Question Navigation</h3>
              <div className="overflow-x-auto max-w-full">
                <div className="grid grid-cols-5 md:flex md:flex-wrap md:justify-center gap-2 md:gap-2 min-w-max md:min-w-0">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 flex-shrink-0 ${
                        currentQuestion === index
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg transform scale-110'
                          : selectedAnswers[index] !== -1
                          ? 'bg-blue-400 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
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
              <span className="text-lg md:text-xl">🎯</span>
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
            
            {/* Tip Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-3 md:p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-lg md:text-xl">💡</span>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-700">
                    {currentQuiz.tip}
                  </p>
                </div>
              </div>
            </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              Kembali
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