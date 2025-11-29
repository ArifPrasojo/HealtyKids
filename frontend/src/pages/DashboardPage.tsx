import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import { Button } from '../components/ui/Button';
import ModuleCard from '../components/ui/ModuleCard';
import StatsCard from '../components/ui/StatsCard';

const DashboardPage: React.FC = () => {
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
      title: "Streak Harian",
      subtitle: "Hari berturut-turut",
      value: "7 Hari",
      description: "Keep it up! 💪",
      icon: "🔥",
      gradient: "bg-gradient-to-r from-orange-400 to-red-500"
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
      difficulty: "Mudah",
      players: "1.2k",
      rating: 4.8
    },
    {
      id: 2,
      title: "Teka Teki Silang Kesehatan",
      description: "Asah pengetahuan kesehatan dengan teka-teki silang yang menantang!",
      icon: "🧩",
      background: "bg-gradient-to-br from-blue-500 to-purple-600",
      difficulty: "Menengah",
      players: "856",
      rating: 4.6
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
      navigate('/game/crossword'); // Ini akan mengarah ke GameCrossword.tsx
    }
  };

  return (
    <Layout className="px-6 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Halo, Learners! 👋
          </h1>
          <p className="text-gray-600 text-lg">Siap belajar kesehatan dengan cara yang seru hari ini?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {miniGames.map((game) => (
              <div key={game.id} className="group bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Game Header with Background */}
                <div className={`${game.background} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-20 transform rotate-12 translate-x-6 -translate-y-6">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <span className="text-4xl">{game.icon}</span>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">{game.icon}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold bg-white bg-opacity-20 rounded-full px-2 py-1">
                          {game.difficulty}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                      {game.title}
                    </h3>
                  </div>
                </div>

                {/* Game Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {game.description}
                  </p>

                  {/* Game Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <span className="mr-1">👥</span>
                        {game.players} players
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">⭐</span>
                        {game.rating}
                      </span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <Button 
                    variant="primary"
                    size="lg"
                    className="w-full font-semibold bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 text-white border-0 transition-all duration-300"
                    onClick={() => handleGameClick(game.id)}
                  >
                    🎮 Mainkan Sekarang
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