import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import { Button } from '../components/ui/Button';
import ModuleCard from '../components/ui/ModuleCard';
import StatsCard from '../components/ui/StatsCard';

interface DashboardPageProps {
  onLogout?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: "Bahaya Pacaran",
      description: "Pelajari bahaya dari pacaran dan dampaknya pada kesehatan mental dan fisik remaja",
      icon: "💔",
      progress: 75,
      status: "continue" as const,
      color: "from-red-400 to-pink-500",
      difficulty: "Menengah" as const,
      lessons: 8
    },
    {
      id: 2,
      title: "Perkembangan Pertumbuhan Sehat",
      description: "Jaga kesehatan fisik dan mental di masa remaja dengan baik dan benar",
      icon: "🌱",
      progress: 60,
      status: "continue" as const,
      color: "from-green-400 to-emerald-500",
      difficulty: "Mudah" as const,
      lessons: 6
    },
    {
      id: 3,
      title: "LGBT dan Orientasi",
      description: "Memahami keberagaman dan toleransi dengan bijak dalam perspektif kesehatan",
      icon: "🏳️‍🌈",
      progress: 0,
      status: "start" as const,
      color: "from-purple-400 to-indigo-500",
      difficulty: "Sulit" as const,
      lessons: 12
    },
    {
      id: 4,
      title: "Kesehatan Mental",
      description: "Tips mengelola stress dan emosi di sekolah untuk kesehatan mental optimal",
      icon: "🧠",
      progress: 45,
      status: "continue" as const,
      color: "from-blue-400 to-cyan-500",
      difficulty: "Menengah" as const,
      lessons: 10
    },
    {
      id: 5,
      title: "Nutrisi untuk Remaja",
      description: "Pola makan sehat untuk mendukung aktivitas belajar dan pertumbuhan",
      icon: "🥗",
      progress: 30,
      status: "continue" as const,
      color: "from-orange-400 to-yellow-500",
      difficulty: "Mudah" as const,
      lessons: 7
    },
    {
      id: 6,
      title: "Bullying dan Pertemanan",
      description: "Cara menghadapi bullying dan membangun persahabatan yang sehat",
      icon: "🤝",
      progress: 0,
      status: "start" as const,
      color: "from-teal-400 to-green-500",
      difficulty: "Sulit" as const,
      lessons: 9
    }
  ];

  const statsData = [
    {
      title: "Progress Belajar",
      subtitle: "Total kemajuan kamu",
      value: "65%",
      icon: "📚",
      gradient: "bg-gradient-to-r from-purple-500 to-indigo-600"
    },
    {
      title: "Pencapaian",
      subtitle: "Badge terbaru",
      value: "Health Explorer",
      description: "Selesaikan 3 modul!",
      icon: "🏆",
      gradient: "bg-gradient-to-r from-emerald-400 to-teal-500"
    }
  ];

  const miniGames = [
    {
      id: 1,
      title: "Game Mencocokkan Istilah",
      description: "Cocokkan istilah kesehatan dengan definisi menggunakan garis penghubung!",
      icon: "🎯",
      background: "bg-gradient-to-br from-blue-500 to-purple-500",
      difficulty: "Mudah"
    },
    {
      id: 2,
      title: "Teka Teki Silang Kesehatan",
      description: "Asah pengetahuan kesehatan dengan teka-teki silang yang menantang!",
      icon: "🧩",
      background: "bg-gradient-to-br from-blue-500 to-purple-600",
      difficulty: "Menengah"
    }
  ];

  const handleModuleClick = () => {
    navigate('/materi');
  };

  const handleQuizClick = () => {
    navigate('/quiz');
  };

  const handleGameClick = (gameId: number) => {
    if (gameId === 1) {
      navigate('/game/matching');
    } else if (gameId === 2) {
      navigate('/game/crossword');
    }
  };

  return (
    <Layout className="px-6 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" onLogout={onLogout}>
      <div className="w-full">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Halo, Learners! 👋
          </h1>
          <p className="text-gray-600 text-lg">Siap belajar kesehatan dengan cara yang seru hari ini?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              subtitle={stat.subtitle}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              gradient={stat.gradient}
            />
          ))}
        </div>

        {/* Learning Modules Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🎓 Modul Pembelajaran</h2>
            <p className="text-gray-600">Pilih topik yang ingin kamu pelajari hari ini</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                progress={module.progress}
                status={module.status}
                color={module.color}
                difficulty={module.difficulty}
                lessons={module.lessons}
                onClick={handleModuleClick}
              />
            ))}
          </div>
        </div>


        {/* Mini Games Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🎮 Mini Games</h2>
            <p className="text-gray-600">Belajar sambil bermain dengan game edukatif yang seru!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-8xl mx-auto">
            {miniGames.map((game) => (
              <div key={game.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                {/* Colored Top Border */}
                <div className={`h-2 ${game.id === 1 ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-purple-400 to-indigo-500'}`}></div>
                
                {/* Game Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${game.id === 1 ? 'bg-blue-100' : 'bg-purple-100'}`}>
                        <span className="text-2xl">{game.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {game.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {game.description}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      game.difficulty === 'Mudah' ? 'bg-green-100 text-green-700' :
                      game.difficulty === 'Menengah' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {game.difficulty}
                    </div>
                  </div>

                  {/* Progress Section (Optional - you can remove this if not needed) */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-gray-600">
                        {game.id === 1 ? '3' : '2'}/{game.id === 1 ? '5' : '4'} levels
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${game.id === 1 ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-purple-400 to-indigo-500'}`}
                        style={{ width: game.id === 1 ? '60%' : '50%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Status */}
                  <div className="flex items-center mb-6">
                    <span className="text-sm text-gray-600 flex items-center">
                      <span className="mr-2">📚</span>
                      Lanjutkan belajar
                    </span>
                  </div>

                  {/* Play Button */}
                  <Button 
                    variant="primary"
                    size="lg"
                    className="w-full font-semibold bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 text-white border-0 transition-all duration-300 rounded-2xl py-3"
                    onClick={() => handleGameClick(game.id)}
                  >
                    <span className="mr-2">📖</span>
                    Mainkan Sekarang
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-purple-500"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">💡 Tahukah Kamu?</h3>
            <p className="text-gray-700 text-lg mb-4">
              "Belajar tentang kesehatan sejak dini dapat membantu kamu membuat keputusan yang lebih baik untuk masa depan!"
            </p>
            <div className="flex justify-center space-x-2">
              <span className="text-2xl">🌟</span>
              <span className="text-2xl">🎯</span>
              <span className="text-2xl">💪</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;