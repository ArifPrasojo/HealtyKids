import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import CloudBackground from '../../components/layouts/CloudBackground';
import { Button } from '../../components/ui/Button';

interface MateriHomeProps {
  onLogout?: () => void;
}

interface MateriCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  levels: number;
  completedLevels: number;
  route: string;
}

const MateriHome: React.FC<MateriHomeProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const materiData: MateriCard[] = [
    {
      id: 1,
      title: 'Masa Remaja dan Pubertas',
      description: 'Materi ini membahas definisi masa remaja sebagai masa transisi penting dalam kehidupan seseorang, serta menjelaskan tahap pubertas yang menyertainya.',
      icon: '🧑‍🤝‍🧑',
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-500',
      textColor: 'text-pink-500',
      levels: 8,
      completedLevels: 2,
      route: '/materi'
    },
    {
      id: 2,
      title: 'Pengertian dan Bentuk Perilaku Seksual Berisiko',
      description: 'Mencakup semua tindakan yang dipengaruhi oleh dorongan keinginan seksual',
      icon: '🔤',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-500',
      levels: 10,
      completedLevels: 1,
      route: '/materi'
    },
    {
      id: 3,
      title: 'Akibat Perilaku Seksual Berisiko',
      description: 'Jenis infeksi yang menyebar melalui hubungan seksual',
      icon: '🔬',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500',
      textColor: 'text-green-500',
      levels: 12,
      completedLevels: 3,
      route: '/materi'
    },
    {
      id: 4,
      title: 'Cara Mencegah Perilaku Seksual Berisiko',
      description: 'Manfaatkan waktu luang untuk olahraga, hobi, belajar, atau aktivitas positif di luar rumah',
      icon: '🎨',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      levels: 6,
      completedLevels: 2,
      route: '/materi'
    },
    {
      id: 5,
      title: 'Faktor Pendorong Perilaku Seksual',
      description: 'Tekanan dari lingkungan pergaulan lebih besar dibandingkan dari pasangan',
      icon: '🌍',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-500',
      levels: 9,
      completedLevels: 3,
      route: '/materi'
    },
    {
      id: 6,
      title: 'Cara Mencegah Perilaku Seksual Berisiko',
      description: 'Manfaatkan waktu luang untuk olahraga, hobi, belajar, atau aktivitas positif di luar rumah.',
      icon: '🎵',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-500',
      levels: 7,
      completedLevels: 1,
      route: '/materi'
    }
  ];

  const handleMateriClick = (route: string) => {
    navigate(route);
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
        {/* Cloud Background */}
        <CloudBackground />

        {/* Main Content - px-20 untuk desktop, ubah untuk mobile */}
        <div className="relative z-10 max-w-full mx-auto px-4 md:px-8 lg:px-20 py-12">
          {/* Header Section - Simple */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Materi Pembelajaran
            </h1>
            <p className="text-gray-600 text-lg">
              Klik materi untuk mulai belajar dan bermain
            </p>
          </div>

          {/* Materi Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materiData.map((materi) => (
              <div
                key={materi.id}
                className="bg-transparent backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/20 group flex flex-col"
              >
                {/* Content Area - flex-grow untuk push button ke bawah */}
                <div className="p-8 flex-grow flex flex-col">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${materi.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{materi.icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {materi.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {materi.description}
                  </p>

                  {/* Progress Section */}
                  <div className="space-y-3 mb-6 mt-auto">
                    {/* Progress Bars */}
                    <div>
                      {renderProgressBars(materi.levels, materi.completedLevels, materi.bgColor)}
                    </div>

                    {/* Level Info */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {materi.completedLevels} dari {materi.levels} level
                      </span>
                      <span className={`text-sm font-semibold ${materi.textColor}`}>
                        {materi.levels} Level
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleMateriClick(materi.route)}
                    className={`w-full bg-gradient-to-r ${materi.color} hover:opacity-90 transform group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg`}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Mulai Belajar</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                </div>

                {/* Bottom Accent Line - di luar content area */}
                <div className={`h-1 bg-gradient-to-r ${materi.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="h-16 bg-gradient-to-t from-green-100 to-transparent mt-12"></div>
      </div>
    </Layout>
  );
};

export default MateriHome;