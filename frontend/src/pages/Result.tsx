import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const Result: React.FC = () => {
  const navigate = useNavigate();

  // Sample quiz result data
  const quizResults = {
    score: 85,
    totalQuestions: 20,
    correctAnswers: 17,
    incorrectAnswers: 3,
    timeSpent: "12:45"
  };

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

  // Calculate circle parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (quizResults.score / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Results Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Header with Success Icon */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
              <p className="text-gray-600">Congratulations on completing the quiz</p>
            </div>

            {/* Score Circle using SVG */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <svg width="160" height="160" className="transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#f3f4f6"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={getScoreStroke(quizResults.score)}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(quizResults.score)}`}>
                    {quizResults.score}%
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Excellent Work!</h2>
              <p className="text-gray-600">You've done a great job answering most of the questions!</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {/* Correct Answers */}
              <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-semibold text-gray-700">Correct Answers</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{quizResults.correctAnswers}</div>
                <div className="text-sm text-gray-500">/{quizResults.totalQuestions}</div>
              </div>

              {/* Incorrect Answers */}
              <div className="text-center p-4 bg-red-50 rounded-2xl border border-red-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm font-semibold text-gray-700">Incorrect Answers</span>
                </div>
                <div className="text-3xl font-bold text-red-600">{quizResults.incorrectAnswers}</div>
                <div className="text-sm text-gray-500">/{quizResults.totalQuestions}</div>
              </div>

              {/* Time Spent */}
              <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm font-semibold text-gray-700">Time Spent</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{quizResults.timeSpent}</div>
                <div className="text-sm text-gray-500">minutes</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleBackToDashboard}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg px-8"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;