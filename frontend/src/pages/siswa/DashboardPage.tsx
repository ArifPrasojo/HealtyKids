import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import CloudBackground from '../../components/layouts/CloudBackground';
import { BookOpen, Target, Gamepad } from 'lucide-react';

interface DashboardPageProps {
  onLogout?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'MATERI',
      description: 'Pelajari konsep-konsep menarik dengan cara yang mudah dipahami',
      icon: BookOpen,
      bgColor: 'from-blue-50 via-blue-100/50 to-indigo-50',
      borderColor: 'border-blue-300/50',
      textColor: 'text-blue-700',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      accentColor: 'bg-blue-500',
      route: '/materi'
    },
    {
      title: 'QUIZ',
      description: 'Uji pemahamanmu dengan kuis yang seru dan menantang',
      icon: Target,
      bgColor: 'from-green-50 via-emerald-100/50 to-teal-50',
      borderColor: 'border-green-300/50',
      textColor: 'text-green-700',
      iconBg: 'bg-gradient-to-br from-green-400 to-emerald-600',
      accentColor: 'bg-green-500',
      route: '/Quiz'
    },
    {
      title: 'MINI GAMES',
      description: 'Bermain sambil belajar dengan permainan edukatif yang menyenangkan',
      icon: Gamepad,
      bgColor: 'from-purple-50 via-violet-100/50 to-fuchsia-50',
      borderColor: 'border-purple-300/50',
      textColor: 'text-purple-700',
      iconBg: 'bg-gradient-to-br from-purple-400 to-fuchsia-600',
      accentColor: 'bg-purple-500',
      route: '/GameHome'
    }
  ];

  // Fungsi navigasi langsung tanpa modal
  const handleMenuClick = (route: string) => {
    navigate(route);
  };

  return (
    <Layout onLogout={onLogout}>
      <div className="min-h-screen lg:h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-x-hidden lg:overflow-hidden flex flex-col">
        {/* Cloud Background */}
        <CloudBackground />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-20 flex-1 flex flex-col lg:justify-center overflow-y-auto lg:overflow-visible">
          {/* Welcome Section */}
          <div className="text-center mb-6 md:mb-8 space-y-4 md:space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="relative">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-gray-800 tracking-tight leading-tight">
                  Selamat Datang
                </h1>
              </div>
              
              <div className="relative inline-block">
                <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-gray-800 tracking-tight">
                  <span className="relative">
                    di{' '}
                    <span className="bg-gradient-to-t from-green-500 via-teal-400 to-slate-100 bg-clip-text text-transparent">
                      Sex
                    </span>
                    <span className="bg-gradient-to-t from-green-500 via-teal-400 to-slate-100 bg-clip-text text-transparent relative font-extrabold text-1xl">
                      ♂
                    </span>
                    <span className="bg-gradient-to-t from-green-500 via-teal-400 to-slate-100 bg-clip-text text-transparent">
                      ph
                    </span>
                    <span className="bg-gradient-to-t from-green-500 via-teal-400 to-slate-100 bg-clip-text text-transparent relative font-extrabold text-1xl">
                      ♀
                    </span>
                    <span className="bg-gradient-to-t from-green-500 via-teal-400 to-slate-100 bg-clip-text text-transparent">
                      ne
                    </span>
                    <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M2 10C40 3 80 1 120 5C160 9 180 10 198 10" 
                        stroke="url(#gradient)" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        className="animate-draw-line"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="50%" stopColor="#2DD4BF" />
                          <stop offset="100%" stopColor="#F1F5F9" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h2>
              </div>
            </div>

            {/* Description */}
            <div className="max-w-4xl mx-auto space-y-4 md:space-y-20">
              <p className="text-gray-600 text-lg md:text-3xl lg:text-4xl leading-relaxed font-light px-4">
                <span className="relative inline-block">
                  <span className="relative z-10 font-bold text-indigo-600"> Sex Education </span>
                  <span className="absolute bottom-1 left-0 w-full h-2 md:h-3 bg-indigo-200/50 -rotate-1"></span>
                </span>
                {' '}
                <span className="relative inline-block">
                  <span className="relative z-10 font-bold text-purple-600"> On Phone</span>
                  <span className="absolute bottom-1 left-0 w-full h-2 md:h-3 bg-purple-200/50 rotate-1"></span>
                </span>
              </p>
            </div>
          </div>

          {/* Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pb-6 md:pb-0">
            {menuItems.map((item, index) => (
              <div
                key={item.title}
                onClick={() => handleMenuClick(item.route)}
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`relative bg-gradient-to-br ${item.bgColor} rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 ${item.borderColor} hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 h-full overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-20">
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 md:w-24 md:h-24 opacity-20">
                    <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-14 h-14 md:w-16 md:h-16 bg-white rounded-full"></div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 mb-4 md:mb-6">
                    <div className={`${item.iconBg} rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl w-12 h-12 md:w-16 md:h-16`}>
                      <item.icon size={24} className="text-white md:w-8 md:h-8" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 md:space-y-4">
                    <h3 className={`text-xl md:text-2xl font-bold ${item.textColor} tracking-wide`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.accentColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl md:rounded-b-3xl`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom decoration */}
        <div className="h-12 md:h-16 bg-gradient-to-t from-green-100 to-transparent"></div>
      </div>
    </Layout>
  );
};

export default DashboardPage;