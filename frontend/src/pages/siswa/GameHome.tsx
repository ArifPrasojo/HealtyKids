import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import CloudBackground from '../../components/layouts/CloudBackground';
import { Button } from '../../components/ui/Button';

interface GameHomeProps {
  onLogout?: () => void;
}

interface GameCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  route: string;
  difficulty: 'Mudah' | 'Sedang';
}

const GameHome: React.FC<GameHomeProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const gameData: GameCard[] = [
    {
      id: 1,
      title: 'Health Matching Game',
      description: 'Cocokkan gambar dengan kata yang tepat untuk belajar kesehatan reproduksi',
      icon: '🧩',
      route: '/game/matching',
      difficulty: 'Mudah'
    },
    {
      id: 2,
      title: 'Teka Teki Silang Kesehatan',
      description: 'Isi kotak kosong dengan kata-kata kesehatan yang benar',
      icon: '📝',
      route: '/game/crossword',
      difficulty: 'Sedang'
    },
    {
      id: 3,
      title: 'Health Word Search',
      description: 'Temukan kata-kata kesehatan tersembunyi dalam kotak huruf',
      icon: '🔍',
      route: '/game/wordsearch',
      difficulty: 'Mudah'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah':
        return 'from-blue-400 to-indigo-600';
      case 'Sedang':
        return 'from-purple-400 to-pink-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-x-hidden overflow-y-auto">
        <CloudBackground />

        {/* Main Content */}
        <div className="relative z-10 max-w-full mx-auto px-4 md:px-8 lg:px-20 py-12">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Game Kesehatan
            </h1>
            <p className="text-gray-600 text-lg">
              Mainkan game interaktif untuk belajar kesehatan reproduksi dengan cara yang menyenangkan
            </p>
          </div>

          {/* Game Cards Grid - 3 kolom */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {gameData.map((game) => (
              <div
                key={game.id}
                className="bg-transparent backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/20 group flex flex-col cursor-pointer flex-1"
                onClick={() => navigate(game.route)}
              >
                {/* Content Area - Padding sesuai QuizHome */}
                <div className="p-8 flex-grow flex flex-col">
                  {/* Icon - Ukuran sesuai QuizHome */}
                  <div className="mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getDifficultyColor(game.difficulty)} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{game.icon}</span>
                    </div>
                  </div>

                  {/* Content - Ukuran sesuai QuizHome */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {game.description}
                  </p>

                  {/* Game Info */}
                  <div className="space-y-3 mb-6 mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Kesulitan: {game.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Button - Ukuran sesuai QuizHome */}
                  <Button
                    variant="primary"
                    size="md"
                    className={`w-full bg-gradient-to-r ${getDifficultyColor(game.difficulty)} hover:opacity-90 transform group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Mainkan Game</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                </div>

                {/* Bottom Accent Line */}
                <div className={`h-1 bg-gradient-to-r ${getDifficultyColor(game.difficulty)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Decoration - Responsive */}
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 lg:h-20 bg-gradient-to-t from-blue-100 to-transparent"></div>
      </div>
    </Layout>
  );
};

export default GameHome;