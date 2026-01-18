import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import CloudBackground from '../../components/layouts/CloudBackground';

// Interface disesuaikan dengan data yang disimpan dari Quiz.tsx
interface QuestionData {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index jawaban benar
}

interface QuizResult {
  score: number; // Nilai skala 0-100
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: number;
  selectedAnswers: number[]; // Array index jawaban user
  questions: QuestionData[];
}

const Result: React.FC = () => {
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    const results = localStorage.getItem('quizResults');
    if (results) {
      try {
        setQuizResults(JSON.parse(results));
      } catch (error) {
        console.error("Gagal memparsing hasil quiz", error);
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  if (!quizResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
              <CloudBackground />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  const handleBackToDashboard = () => {
    // Hapus hasil dari local storage agar tidak bisa diakses lagi via back button nanti (opsional)
    localStorage.removeItem('quizResults'); 
    navigate('/dashboard');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  // --- LOGIKA LINGKARAN SKOR ---
  const scorePercentage = quizResults.score; 

  // Responsive circle size
  const circleSize = window.innerWidth < 640 ? 120 : 140; 
  const radius = circleSize / 2 - 10; 
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <CloudBackground />
      <div className="max-w-4xl w-full relative z-10"> 
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* --- KARTU UTAMA (SKOR & STATISTIK) --- */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl p-3 md:p-6 flex-1 h-fit">
            {/* Header with Success Icon */}
            <div className="text-center mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <div className="w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Quiz Selesai!</h1>
              <p className="text-sm md:text-base text-gray-600">Selamat, Anda telah menyelesaikan quiz ini.</p>
            </div>

            {/* Score Circle using SVG */}
            <div className="text-center mb-4 md:mb-6">
              <div className="relative inline-block mb-4 md:mb-6">
                <svg width={circleSize} height={circleSize} className="transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={radius}
                    stroke="#f3f4f6"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={radius}
                    stroke={getScoreStroke(scorePercentage)}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl md:text-4xl font-bold ${getScoreColor(scorePercentage)}`}>
                    {Math.round(scorePercentage)}
                  </span>
                </div>
              </div>
              
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
                {scorePercentage >= 80 ? "Luar Biasa!" : scorePercentage >= 60 ? "Cukup Bagus!" : "Tetap Semangat!"}
              </h2>
              <p className="text-xs md:text-sm text-gray-600">
                {scorePercentage >= 60 
                  ? "Kamu telah memahami materi dengan baik." 
                  : "Jangan menyerah, coba pelajari materi lagi."}
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
              {/* Correct Answers */}
              <div className="text-center p-2 md:p-3 bg-green-50 rounded-xl md:rounded-2xl border border-green-200">
                <div className="flex items-center justify-center mb-2 md:mb-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Benar</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-600">{quizResults.correctAnswers}</div>
                <div className="text-xs md:text-sm text-gray-500">/{quizResults.totalQuestions}</div>
              </div>

              {/* Incorrect Answers */}
              <div className="text-center p-2 md:p-3 bg-red-50 rounded-xl md:rounded-2xl border border-red-200">
                <div className="flex items-center justify-center mb-2 md:mb-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Salah</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-red-600">{quizResults.incorrectAnswers}</div>
                <div className="text-xs md:text-sm text-gray-500">/{quizResults.totalQuestions}</div>
              </div>

              {/* Time Taken */}
              <div className="text-center p-2 md:p-3 bg-blue-50 rounded-xl md:rounded-2xl border border-blue-200 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-center mb-2 md:mb-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Waktu</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  {formatTime(quizResults.timeTaken)}
                </div>
                <div className="text-xs md:text-sm text-gray-500">menit</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleBackToDashboard}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg px-6 md:px-8 py-2 md:py-3 text-sm md:text-base w-full sm:w-auto"
              >
                Kembali ke Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;