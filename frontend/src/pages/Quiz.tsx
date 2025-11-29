import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  emoji: string;
  category: string;
}

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60 + 37); // 15:37 in seconds

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "Berapa gelas air yang sebaiknya diminum anak setiap hari?",
      options: [
        "A) 4-6 gelas",
        "B) 8-10 gelas", 
        "C) 2-3 gelas",
        "D) 12-15 gelas"
      ],
      correctAnswer: 1,
      emoji: "💧",
      category: "Hidrasi"
    },
    {
      id: 2,
      question: "Apa yang harus dilakukan sebelum makan?",
      options: [
        "A) Bermain game",
        "B) Mencuci tangan dengan sabun",
        "C) Menonton TV",
        "D) Tidur sebentar"
      ],
      correctAnswer: 1,
      emoji: "🧼",
      category: "Kebersihan"
    },
    {
      id: 3,
      question: "Berapa lama waktu tidur yang ideal untuk anak usia sekolah?",
      options: [
        "A) 6-7 jam",
        "B) 4-5 jam",
        "C) 9-11 jam",
        "D) 12-14 jam"
      ],
      correctAnswer: 2,
      emoji: "😴",
      category: "Istirahat"
    },
    {
      id: 4,
      question: "Makanan mana yang paling baik untuk sarapan?",
      options: [
        "A) Permen dan cokelat",
        "B) Nasi, telur, dan sayuran",
        "C) Keripik dan soda",
        "D) Es krim"
      ],
      correctAnswer: 1,
      emoji: "🍳",
      category: "Nutrisi"
    },
    {
      id: 5,
      question: "Berapa kali sebaiknya menggosok gigi dalam sehari?",
      options: [
        "A) 1 kali",
        "B) 2 kali",
        "C) 5 kali",
        "D) Tidak perlu"
      ],
      correctAnswer: 1,
      emoji: "🦷",
      category: "Kebersihan"
    }
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null && !answeredQuestions.includes(currentQuestion)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const currentQuiz = questions[currentQuestion];
  const progressPercentage = ((answeredQuestions.length / questions.length) * 100).toFixed(0);

  // Timer effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex">
      {/* Left Sidebar - Quiz Progress */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white h-full p-6 shadow-lg border-r border-gray-200 rounded-r-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl">🏥</span>
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Health Quiz</h3>
            <p className="text-sm text-gray-500">Tes Pengetahuan Kesehatan</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-purple-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {answeredQuestions.length} dari {questions.length} soal selesai
            </p>
          </div>
          
          {/* Question Navigation */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Navigasi Soal</h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentQuestion === index
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-110'
                      : answeredQuestions.includes(index)
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="text-xs text-gray-600 space-y-2 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              <span>Soal Saat Ini</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
              <span>Sudah Dijawab</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span>Belum Dijawab</span>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-xl">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">⏰</span>
                Waktu Tersisa
              </h4>
              <div className="text-2xl font-bold text-orange-600">
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Quiz Question */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white h-full flex flex-col shadow-lg rounded-l-2xl">
          {/* Quiz Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-6 text-white rounded-tl-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{currentQuiz.emoji}</span>
                <div>
                  <h1 className="text-2xl font-bold">Quiz Kesehatan Anak</h1>
                  <p className="text-blue-100">Kategori: {currentQuiz.category}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-blue-100">
                  <span>📋</span>
                  <span>Soal {currentQuestion + 1} dari {questions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 p-8 flex flex-col">
            <div className="flex-1">
              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-3">{currentQuiz.emoji}</span>
                    {currentQuiz.question}
                  </h2>
                  <p className="text-blue-600 flex items-center">
                    <span className="mr-2">💭</span>
                    Pilih jawaban yang paling tepat dari pilihan di bawah ini
                  </p>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-4 max-w-4xl">
                {currentQuiz.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`group flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                      selectedAnswer === index
                        ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                      selectedAnswer === index 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-300 group-hover:border-purple-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-lg font-medium transition-colors ${
                      selectedAnswer === index ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                size="lg"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="px-8 flex items-center space-x-2 hover:shadow-md transition-shadow"
              >
                <span>←</span>
                <span>Sebelumnya</span>
              </Button>

              <div className="text-lg text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <span className="font-semibold text-purple-600">{currentQuestion + 1}</span>
                <span> / {questions.length}</span>
              </div>

              <Button
                variant={currentQuestion === questions.length - 1 ? 'success' : 'primary'}
                size="lg"
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="px-8 flex items-center space-x-2 hover:shadow-md transition-shadow"
              >
                <span>{currentQuestion === questions.length - 1 ? 'Selesai' : 'Selanjutnya'}</span>
                <span>{currentQuestion === questions.length - 1 ? '✓' : '→'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;