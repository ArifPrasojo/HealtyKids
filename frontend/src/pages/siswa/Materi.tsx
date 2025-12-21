import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import { Button } from '../../components/ui/Button';

interface ModuleItem {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  emoji: string;
  description: string;
}

const Materi: React.FC = () => {
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Tambahkan state untuk toggle sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // grouped sections (accordion)
  const sections: { id: number; items: ModuleItem[]; icon: string }[] = [
    {
      id: 1,
      icon: '⭕',
      items: [
        { id: 1, title: 'Definisi Remaja', duration: '5 min', completed: true, emoji: '📘', description: 'Definisi Remaja' },
        { id: 2, title: 'Definisi Pubertas', duration: '8 min', completed: false, emoji: '📜', description: 'Definisi Pubertas' },
        { id: 3, title: 'Tanda Pubertas pada Remaja', duration: '6 min', completed: false, emoji: '🎮', description: 'Tanda Pubertas pada Remaja' }
      ]
    },
  ];

  // flat list for indexing content area
  const flatModules: ModuleItem[] = sections.flatMap(s => s.items);

  const handleVideoComplete = () => {
    if (!completedVideos.includes(currentVideo)) {
      setCompletedVideos([...completedVideos, currentVideo]);
    }
  };

  const handleNextLesson = () => {
    if (currentVideo < flatModules.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setIsPlaying(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
      setIsPlaying(false);
    }
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleBackToDashboard = () => {
    navigate('/materihome');
  };

  const progressPercentage = (
    (flatModules.filter((_, idx) => {
      const m = flatModules[idx];
      return m.completed || completedVideos.includes(idx);
    }).length / flatModules.length) * 100
  ).toFixed(0);

  const currentModule = flatModules[currentVideo];

  return (
    <Layout hideLogoMobile={true}> {/* Tambah prop */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full px-4 md:px-6 py-4 md:py-8">
          {/* Hamburger Button - Fixed Top Left (hanya muncul di mobile ketika sidebar closed) */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-4 left-4 z-50 lg:hidden bg-white p-3 rounded-full shadow-xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Main grid: conditional based on sidebar state */}
          <div className="w-full">
            <div className={`grid ${isSidebarOpen ? 'lg:grid-cols-4' : 'grid-cols-1'} gap-4 md:gap-6 transition-all duration-300`}>
              {/* Left Sidebar - Accordion Panel - conditional render */}
              {isSidebarOpen && (
                <div className="lg:col-span-1 fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto bg-black/50 lg:bg-transparent" onClick={(e) => {
                  // Close sidebar when clicking backdrop on mobile
                  if (e.target === e.currentTarget && window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}>
                  {/* Ubah dari right-0 ke left-0 dan rounded-l-3xl ke rounded-r-3xl */}
                  <div className="absolute lg:relative left-0 lg:left-auto top-0 bottom-0 w-80 lg:w-auto bg-green-50 lg:bg-green-50 rounded-r-3xl lg:rounded-3xl shadow-2xl lg:shadow-xl border border-green-200 overflow-hidden lg:sticky lg:top-6">
                    {/* Header Title with Close Button (X icon untuk close) */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
                      <h2 className="text-white font-bold text-base lg:text-lg">Masa Remaja dan Pubertas</h2>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-white hover:bg-white/20 rounded-full p-1 transition-colors lg:hidden"
                      >
                        {/* X Icon untuk close di mobile */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* List Items - Tanpa Accordion/Dropdown */}
                    <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                      <div className="space-y-3">
                        {sections.map(section => {
                          return (
                            <div key={section.id}>
                              {/* Items */}
                              <div className="bg-white px-3 py-3 rounded-2xl border border-green-200">
                                <div className="space-y-2">
                                  {section.items.map((item) => {
                                    const flatIndex = flatModules.findIndex(m => m.id === item.id);
                                    const active = flatIndex === currentVideo;
                                    const done = item.completed || completedVideos.includes(flatIndex);
                                    return (
                                      <div
                                        key={item.id}
                                        onClick={() => { 
                                          setCurrentVideo(flatIndex); 
                                          setIsPlaying(false);
                                          // Close sidebar on mobile after selection
                                          if (window.innerWidth < 1024) {
                                            setIsSidebarOpen(false);
                                          }
                                        }}
                                        className={`flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                                          active 
                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 shadow-md' 
                                            : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-2 border-transparent hover:border-green-200'
                                        }`}
                                      >
                                        <div className={`w-6 h-6 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                          done 
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' 
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}>
                                          {done ? (
                                            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                          ) : (
                                            <span className="text-xs lg:text-sm">📄</span>
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className={`text-sm lg:text-base font-semibold truncate transition-colors ${
                                            active ? 'text-green-700' : 'text-gray-700'
                                          }`}>
                                            {item.title}
                                          </div>
                                          <div className="text-xs lg:text-sm text-gray-500 mt-1">
                                            {item.duration} • {item.description}
                                          </div>
                                        </div>
                                        {active && (
                                          <div className="flex-shrink-0">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Card untuk kembali ke Materi Home */}
                      <div className="mt-6 p-4 lg:p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer group shadow-sm" onClick={() => navigate('/materihome')}>
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm lg:text-base font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                              Kembali ke Materi Home
                            </div>
                            <div className="text-xs lg:text-sm text-gray-600">
                              Pilih materi lainnya
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Content Area */}
              <div className={`${isSidebarOpen ? 'lg:col-span-3' : 'col-span-1'}`}>
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* Content Header - Tanpa hamburger button di desktop, hanya di mobile via fixed button */}
                  <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-lg lg:text-2xl font-bold text-gray-800 flex-1 pr-2">{currentModule.title}</h1>
                    
                    {/* Hamburger button untuk desktop ketika sidebar closed */}
                    {!isSidebarOpen && (
                      <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="hidden lg:flex bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full font-bold transition-all shadow-lg items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>Materi</span>
                      </button>
                    )}
                  </div>

                  {/* Video Player Area */}
                  <div className="p-5 md:p-5 bg-gray-100">
                    {/* <div className="bg-gradient-to-br from-gray-900 to-gray-800 relative aspect-video rounded-xl overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!isPlaying ? (
                          <button
                            onClick={handlePlayVideo}
                            className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                          >
                            <svg className="w-6 h-6 lg:w-8 lg:h-8 ml-1 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                            </svg>
                          </button>
                        // ) : (
                        //   <iframe
                        //     width="100%"
                        //     height="100%"
                        //     src=""
                        //     title="YouTube video player"  
                        //     frameBorder="0"
                        //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        //     allowFullScreen
                        //     className="rounded-xl"
                        //   ></iframe>
                        // )}
                      </div>
                    </div> */}
                            <img 
                            src="/src/assets/images/foto.png"
                            alt="Video Content"
                            className="rounded-xl"
                            style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain'
                            }}
                          />
                  </div>

                  {/* Note/Reminder Section */}
                  <div className="p-4 lg:p-6 bg-yellow-50 border-b border-yellow-200">
                    <p className="text-center text-gray-700 font-medium text-xs lg:text-base">
                      <span className="text-yellow-600">⚠️</span> Ingat: Tanda negatif bertemu negatif menjadi positif!
                    </p>
                  </div>

                  {/* Description Content */}
                  <div className="p-4 lg:p-6">
                    <p className="text-gray-700 leading-relaxed mb-3 lg:mb-4 text-xs lg:text-base">
                     1. Definisi Remaja
                    Remaja adalah masa peralihan atau masa transisi dari anak menuju masa dewasa. Ini adalah fase di mana individu mengalami pertumbuhan dan perkembangan fisik maupun mental yang sangat pesat.
                    Secara psikologis, masa remaja ditandai dengan:
                    Pengembangan Proses Berpikir: Mulai mengembangkan proses berpikir operasional formal dan berpikir abstrak.
                    Pengambilan Keputusan: Belajar membayangkan dan mempertimbangkan konsekuensi dari tindakannya.
                    Pembentukan Diri: Munculnya rasa identitas.
                    Aspek Sosial: Meningkatnya keterlibatan sosial dan interaksi dengan teman sebaya.
                    Kesadaran Seksual: Mulai adanya kesadaran akan seksualitasnya.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-xs lg:text-base">
                    2. Definisi Pubertas
                    Pubertas adalah tahapan dalam perkembangan yang dialami anak-anak, di mana mereka mengalami perubahan dari makhluk aseksual menjadi makhluk seksual.
                    Pada tahap ini, remaja mengalami proses kematangan seksual secara pesat, yang ditandai dengan munculnya Tanda Pubertas.
                    </p>
                  </div>

                  {/* Bottom Navigation Buttons */}
                  <div className="p-4 lg:p-6 border-t border-gray-200 flex items-center justify-between gap-3">
                  <button 
                      onClick={handlePreviousLesson}
                      disabled={currentVideo === 0}
                      className="disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                    >
                      <img 
                        src="/src/assets/icons/kembali.svg" 
                        alt="Kembali" 
                        className="h-12 lg:h-14 w-auto"
                      />
                    </button>

                    <button 
                      onClick={handleNextLesson}
                      disabled={currentVideo === flatModules.length - 1}
                      className="disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                    >
                      <img 
                        src="/src/assets/icons/lanjut.svg" 
                        alt="Lanjut" 
                        className="h-12 lg:h-14 w-auto"
                      />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Materi;