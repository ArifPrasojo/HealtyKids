import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import CloudBackground from '../components/layouts/CloudBackground';
import { Button } from '../components/ui/Button';

interface QuizHomeProps {
  onLogout?: () => void;
}

interface QuizCard {
  id: number;
  title: string;
  description: string;
  questions: number;
  duration: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  icon: string;
  completed: number;
  total: number;
}

const QuizHome: React.FC<QuizHomeProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<QuizCard | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const quizData: QuizCard[] = [
    {
      id: 1,
      title: 'Quiz Kesehatan Reproduksi',
      description: 'Pelajari tentang kesehatan reproduksi dan menjaga kebersihan organ intim',
      questions: 10,
      duration: '15 menit',
      difficulty: 'Mudah',
      icon: '🩺',
      completed: 0,
      total: 10
    },
    {
      id: 2,
      title: 'Quiz Pubertas',
      description: 'Mengenal perubahan tubuh saat pubertas dan cara mengatasinya',
      questions: 8,
      duration: '12 menit',
      difficulty: 'Mudah',
      icon: '🌱',
      completed: 0,
      total: 8
    },
    {
      id: 3,
      title: 'Quiz Keamanan Diri',
      description: 'Pelajari tentang sentuhan yang baik dan buruk, serta cara melindungi diri',
      questions: 12,
      duration: '18 menit',
      difficulty: 'Sedang',
      icon: '🛡️',
      completed: 0,
      total: 12
    },
    {
      id: 4,
      title: 'Quiz Mitigasi Risiko',
      description: 'Mengenal risiko kesehatan reproduksi dan cara pencegahannya',
      questions: 15,
      duration: '20 menit',
      difficulty: 'Sulit',
      icon: '⚠️',
      completed: 0,
      total: 15
    }
  ];

  const handleStartQuiz = (quiz: QuizCard) => {
    setSelectedQuiz(quiz);
    setShowConfirmModal(true);
  };

  const confirmStartQuiz = () => {
    setShowConfirmModal(false);
    navigate('/quiz');
  };

  const cancelStartQuiz = () => {
    setShowConfirmModal(false);
    setSelectedQuiz(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah':
        return 'from-green-400 to-green-600';
      case 'Sedang':
        return 'from-yellow-400 to-yellow-600';
      case 'Sulit':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const renderProgressBars = (total: number, completed: number, bgColor: string) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full flex-1 ${
              index < completed ? bgColor : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout onLogout={onLogout}>
      {/* Floating Back Button - All Devices */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-purple-500/20 to-blue-600/20 backdrop-blur-sm border border-purple-300/30 text-purple-700 hover:from-purple-500/30 hover:to-blue-600/30 hover:border-purple-400/50 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-x-hidden">
        <CloudBackground />

        {/* Main Content */}
        <div className="relative z-10 max-w-full mx-auto px-4 md:px-8 lg:px-20 py-12">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Quiz Kesehatan
            </h1>
            <p className="text-gray-600 text-lg">
              Klik quiz untuk mulai mengerjakan dan dapatkan XP
            </p>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizData.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-transparent backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/20 group flex flex-col"
              >
                {/* Content Area */}
                <div className="p-8 flex-grow flex flex-col">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getDifficultyColor(quiz.difficulty)} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{quiz.icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {quiz.description}
                  </p>

                  {/* Quiz Info */}
                  <div className="space-y-3 mb-6 mt-auto">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{quiz.questions} Soal</span>
                      <span>{quiz.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Kesulitan: {quiz.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleStartQuiz(quiz)}
                    className={`w-full bg-gradient-to-r ${getDifficultyColor(quiz.difficulty)} hover:opacity-90 transform group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Mulai Quiz</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                </div>

                {/* Bottom Accent Line */}
                <div className={`h-1 bg-gradient-to-r ${getDifficultyColor(quiz.difficulty)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="h-16 bg-gradient-to-t from-green-100 to-transparent mt-12"></div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Mulai Quiz
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin memulai quiz "{selectedQuiz.title}"? 
                Quiz ini terdiri dari {selectedQuiz.questions} soal dengan waktu {selectedQuiz.duration}.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={cancelStartQuiz}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={confirmStartQuiz}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  Ya, Mulai
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QuizHome;