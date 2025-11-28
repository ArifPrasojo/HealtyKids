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

  const handleModuleClick = () => {
    navigate('/materi');
  };

  const handleQuizClick = () => {
    navigate('/quiz');
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
        <div className="mb-8">
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