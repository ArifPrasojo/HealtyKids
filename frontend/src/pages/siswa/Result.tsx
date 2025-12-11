import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: number;
  selectedAnswers: number[];
  questions: any[];
}

const Result: React.FC = () => {
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    const results = localStorage.getItem('quizResults');
    if (results) {
      setQuizResults(JSON.parse(results));
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  if (!quizResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  // Responsive circle size
  const circleSize = window.innerWidth < 640 ? 120 : 160; // 120px mobile, 160px desktop
  const radius = circleSize / 2 - 10; // Adjust for stroke width
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - ((quizResults.score / quizResults.totalQuestions) * 100 / 100) * circumference;

  // Format time from seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-6xl w-full"> {/* Ubah max-w agar muat dua card */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Main Results Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 flex-1">
            {/* Header with Success Icon */}
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <div className="w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
              <p className="text-sm md:text-base text-gray-600">Congratulations on completing the quiz</p>
            </div>

            {/* Score Circle using SVG */}
            <div className="text-center mb-6 md:mb-8">
              <div className="relative inline-block mb-4 md:mb-6">
                <svg width={circleSize} height={circleSize} className="transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={radius}
                    stroke="#f3f4f6"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={radius}
                    stroke={getScoreStroke((quizResults.score / quizResults.totalQuestions) * 100)}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl md:text-4xl font-bold ${getScoreColor((quizResults.score / quizResults.totalQuestions) * 100)}`}>
                    {Math.round((quizResults.score / quizResults.totalQuestions) * 100)}%
                  </span>
                </div>
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">Excellent Work!</h2>
              <p className="text-xs md:text-sm text-gray-600">You've done a great job answering most of the questions!</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Correct Answers */}
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-xl md:rounded-2xl border border-green-200">
                <div className="flex items-center justify-center mb-2 md:mb-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Correct Answers</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-600">{quizResults.correctAnswers}</div>
                <div className="text-xs md:text-sm text-gray-500">/{quizResults.totalQuestions}</div>
              </div>

              {/* Incorrect Answers */}
              <div className="text-center p-3 md:p-4 bg-red-50 rounded-xl md:rounded-2xl border border-red-200">
                <div className="flex items-center justify-center mb-2 md:mb-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Incorrect Answers</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-red-600">{quizResults.incorrectAnswers}</div>
                <div className="text-xs md:text-sm text-gray-500">/{quizResults.totalQuestions}</div>
              </div>

              {/* Time Taken */}
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl md:rounded-2xl border border-blue-200 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-center mb-2 md:mb-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Time Taken</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  {formatTime(quizResults.timeTaken)}
                </div>
                <div className="text-xs md:text-sm text-gray-500">minutes</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleBackToDashboard}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Review Answers Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Review Jawaban</h3>
            <div className="space-y-4 max-h-96 md:max-h-[600px] lg:max-h-[700px] overflow-y-auto">
              {quizResults.questions.map((question, index) => {
                const selectedAnswer = quizResults.selectedAnswers[index];
                const isCorrect = selectedAnswer === question.correctAnswer;
                const selectedOption = question.options[selectedAnswer];
                const correctOption = question.options[question.correctAnswer];

                return (
                  <div key={index} className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-medium text-gray-800 mb-2">{question.question}</p>
                        <div className="space-y-1">
                          <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            <strong>Jawaban Anda:</strong> {selectedAnswer !== -1 ? selectedOption : 'Tidak dijawab'}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-700">
                              <strong>Jawaban Benar:</strong> {correctOption}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;