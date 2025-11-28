import React from 'react';
import { Button } from './Button';

interface ModuleCardProps {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  status: 'continue' | 'start';
  color: string;
  difficulty: 'Mudah' | 'Menengah' | 'Sulit';
  lessons?: number;
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  progress,
  status,
  color,
  difficulty,
  lessons,
  onClick
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-700 border-green-200';
      case 'Menengah': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Sulit': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAccentColor = (color: string) => {
    return `bg-gradient-to-r ${color}`;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      {/* Color Strip */}
      <div className={`h-1.5 w-full ${getAccentColor(color)}`}></div>
      
      <div className="p-6">
        {/* Module Header */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">{icon}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{description}</p>
          {lessons && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">📚</span>
              <span>{lessons} lessons</span>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`${getAccentColor(color)} h-2 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {progress > 0 && (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <span className="mr-1">{progress < 100 ? '🚀' : '✅'}</span>
              {progress < 100 ? 'Lanjutkan belajar!' : 'Selesai!'}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button 
          variant={status === 'continue' ? 'primary' : 'secondary'}
          size="lg"
          className={`w-full font-semibold transition-all duration-300 ${
            status === 'continue' 
              ? 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 text-white border-0' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md transform hover:scale-105 border border-gray-200'
          }`}
          onClick={onClick}
        >
          {status === 'continue' ? '📖 Lanjutkan' : '🚀 Mulai Belajar'}
        </Button>
      </div>
    </div>
  );
};

export default ModuleCard;