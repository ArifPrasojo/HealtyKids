import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import { Button } from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: "Bahaya Pacaran",
      description: "Pelajari bahaya dari pacaran dan dampaknya",
      icon: "💔",
      progress: 75,
      status: "continue",
      color: "from-red-400 to-pink-500",
      difficulty: "Menengah"
    },
    {
      id: 2,
      title: "Perkembangan Pertumbuhan Sehat",
      description: "Jaga kesehatan fisik dan mental di masa remaja",
      icon: "🌱",
      progress: 60,
      status: "continue",
      color: "from-green-400 to-emerald-500",
      difficulty: "Mudah"
    },
    {
      id: 3,
      title: "LGBT dan Orientasi",
      description: "Memahami keberagaman dan toleransi dengan bijak",
      icon: "🏳️‍🌈",
      progress: 0,
      status: "start",
      color: "from-purple-400 to-indigo-500",
      difficulty: "Sulit"
    },
    {
      id: 4,
      title: "Kesehatan Mental",
      description: "Tips mengelola stress dan emosi di sekolah",
      icon: "🧠",
      progress: 45,
      status: "continue",
      color: "from-blue-400 to-cyan-500",
      difficulty: "Menengah"
    },
    {
      id: 5,
      title: "Nutrisi untuk Remaja",
      description: "Pola makan sehat untuk mendukung aktivitas belajar",
      icon: "🥗",
      progress: 30,
      status: "continue",
      color: "from-orange-400 to-yellow-500",
      difficulty: "Mudah"
    },
    {
      id: 6,
      title: "Bullying dan Pertemanan",
      description: "Cara menghadapi bullying dan membangun persahabatan",
      icon: "🤝",
      progress: 0,
      status: "start",
      color: "from-teal-400 to-green-500",
      difficulty: "Sulit"
    }
  ];

  const handleModuleClick = () => {
    navigate('/materi');
  };

  const handleQuizClick = () => {
    navigate('/quiz');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800';
      case 'Menengah': return 'bg-yellow-100 text-yellow-800';
      case 'Sulit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout className="px-6 py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Halo, Learners! 👋
          </h1>
          <p className="text-gray-600 text-lg">Siap belajar kesehatan dengan cara yang seru hari ini?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Progress Card */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📚</span>
                <div>
                  <h3 className="text-lg font-bold">Progress Belajar</h3>
                  <p className="text-purple-100 text-sm">Total kemajuan kamu</p>
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">65%</div>
              <div className="w-full bg-purple-300 rounded-full h-2">
                <div className="bg-white h-2 rounded-full w-2/3"></div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-6 text-white relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🔥</span>
                <div>
                  <h3 className="text-lg font-bold">Streak Harian</h3>
                  <p className="text-orange-100 text-sm">Hari berturut-turut</p>
                </div>
              </div>
              <div className="text-3xl font-bold">7 Hari</div>
              <p className="text-orange-100 text-sm">Keep it up! 💪</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </div>

          {/* Achievement Card */}
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl p-6 text-white relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🏆</span>
                <div>
                  <h3 className="text-lg font-bold">Pencapaian</h3>
                  <p className="text-emerald-100 text-sm">Badge terbaru</p>
                </div>
              </div>
              <div className="text-lg font-bold">Health Explorer</div>
              <p className="text-emerald-100 text-sm">Selesaikan 3 modul!</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </div>
        </div>

        {/* Learning Modules Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🎓 Modul Pembelajaran</h2>
            <p className="text-gray-600">Pilih topik yang ingin kamu pelajari hari ini</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module) => (
              <div key={module.id} className="group bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Module Header */}
                <div className="relative mb-6">
                  <div className={`w-full h-24 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <span className="text-4xl filter drop-shadow-lg">{module.icon}</span>
                  </div>
                  <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </div>
                </div>

                {/* Module Content */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{module.description}</p>
                </div>

                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-purple-600">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${module.color} h-3 rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                  {module.progress > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {module.progress < 100 ? '🚀 Lanjutkan belajar!' : '✅ Selesai!'}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  variant={module.status === 'continue' ? 'primary' : 'secondary'}
                  size="lg"
                  className={`w-full font-semibold transition-all duration-300 ${
                    module.status === 'continue' 
                      ? `bg-gradient-to-r ${module.color} hover:shadow-lg transform hover:scale-105 text-white border-0` 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md transform hover:scale-105'
                  }`}
                  onClick={handleModuleClick}
                >
                  {module.status === 'continue' ? '📖 Lanjutkan' : '🚀 Mulai Belajar'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-8 text-center">
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
    </Layout>
  );
};

export default DashboardPage;