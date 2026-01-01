import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';

// ID Materi Utama untuk penyimpanan progress
const MATERI_ID = 4; 

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
  const [isPlaying, setIsPlaying] = useState(false);
  
  // State UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- INTEGRASI PROGRESS (LocalStorage) ---
  const [completedVideos, setCompletedVideos] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('materi_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed[MATERI_ID] || [];
      }
    } catch (e) {
      console.error("Gagal membaca progress", e);
    }
    return [];
  });

  // --- DATA SIDEBAR (3 Poin Utama) ---
  const sections: { id: number; items: ModuleItem[]; icon: string }[] = [
    {
      id: 1,
      icon: '⭕',
      items: [
        { id: 1, title: 'Pengaruh Teman', duration: '5 min', completed: false, emoji: '👥', description: 'Tekanan teman sebaya' },
        { id: 2, title: 'Rasa Penasaran', duration: '5 min', completed: false, emoji: '🤔', description: 'Keingintahuan tinggi' },
        { id: 3, title: 'Kurangnya Pengetahuan', duration: '5 min', completed: false, emoji: '📚', description: 'Informasi yang salah' }
      ]
    },
  ];

  const flatModules = sections.flatMap(s => s.items);
  const currentModule = flatModules[currentVideo];

  // Simpan Progress
  const saveProgress = (videoIndex: number) => {
    if (!completedVideos.includes(videoIndex)) {
      const newCompleted = [...completedVideos, videoIndex];
      setCompletedVideos(newCompleted);

      const saved = localStorage.getItem('materi_progress');
      const parsed = saved ? JSON.parse(saved) : {};
      
      parsed[MATERI_ID] = newCompleted;
      localStorage.setItem('materi_progress', JSON.stringify(parsed));
    }
  };

  // Navigasi Next
  const handleNextLesson = () => {
    saveProgress(currentVideo);
    if (currentVideo < flatModules.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setIsPlaying(false);
    } else {
      setShowConfirmModal(true);
    }
  };

  // Navigasi Back
  const handlePreviousLesson = () => {
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
      setIsPlaying(false);
    }
  };

  // --- RENDER CONTENT DINAMIS ---
  const renderContent = () => {
    switch (currentModule.id) {
      
      // BLOK 1: PENGARUH TEMAN SEBAYA
      case 1: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">1. Pengaruh Teman Sebaya</h3>
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6 flex flex-col items-center text-center">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base text-justify">
                Lingkungan pergaulan yang diikuti oleh seorang remaja dapat memberikan pengaruh besar terhadap perilaku teman sebayanya.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-blue-800 mb-2">Mengapa pengaruh teman begitu kuat?</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded mr-3 text-xs mt-1">Fakta</span>
                  <span className="text-gray-700 text-sm lg:text-base">
                    Remaja umumnya merasa bahwa <strong>tekanan dari teman sebaya lebih besar</strong> dibandingkan tekanan yang diberikan oleh pasangan.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded mr-3 text-xs mt-1">Alasan</span>
                  <span className="text-gray-700 text-sm lg:text-base">
                    Hal ini terjadi karena kebutuhan untuk <strong>diterima dan diakui</strong> dalam kelompok pergaulan memiliki pengaruh yang lebih kuat dibandingkan pengaruh dari individu lain.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        );

      // BLOK 2: RASA PENASARAN
      case 2: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">2. Rasa Penasaran</h3>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex-1">
                <div className="text-4xl mb-3">🔍</div>
                <h4 className="font-bold text-orange-800 mb-2">Keingintahuan Tinggi</h4>
                <p className="text-gray-700 text-sm lg:text-base text-justify">
                  Remaja yang memiliki rasa penasaran yang sangat tinggi, akan mencari berbagai cara untuk memenuhi rasa ingin tahunya tersebut.
                </p>
              </div>
            </div>

            <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-2xl">⚠️</div>
                <h4 className="font-bold text-red-800">Bahaya Tanpa Sadar</h4>
              </div>
              <p className="text-gray-700 text-sm lg:text-base text-justify">
                Mereka mungkin melakukan hal itu meskipun ia <strong>tidak tahu</strong> atau bahkan <strong>tidak menyadari dampak</strong> dari tindakan seksual pranikah yang dilakukannya. Rasa ingin tahu tanpa bekal pengetahuan adalah risiko besar.
              </p>
            </div>
          </div>
        );

      // BLOK 3: KURANGNYA PENGETAHUAN
      case 3: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">3. Kurangnya Pengetahuan</h3>
            
            <p className="text-gray-700 leading-relaxed text-sm lg:text-base text-justify mb-6">
              Kurangnya pengetahuan dan pemahaman remaja tentang kesehatan reproduksi seksual seringkali disebabkan oleh adanya <strong>sumber informasi yang tidak tepat</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box Kiri: Masalah */}
              <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                <div className="text-4xl mb-2 text-center">❌</div>
                <h4 className="font-bold text-gray-800 text-center mb-2">Info Salah</h4>
                <p className="text-xs lg:text-sm text-gray-600 text-center">
                  Informasi dari teman yang salah atau internet yang tidak valid dapat menjerumuskan.
                </p>
              </div>

              {/* Box Kanan: Solusi */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="text-4xl mb-2 text-center">✅</div>
                <h4 className="font-bold text-green-800 text-center mb-2">Pentingnya Edukasi</h4>
                <p className="text-xs lg:text-sm text-gray-700 text-center">
                  Remaja yang memiliki pengetahuan yang baik serta kemampuan mengendalikan diri cenderung <strong>tidak melakukan</strong> perilaku seksual sebelum menikah.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Konten tidak ditemukan</div>;
    }
  };

  return (
    <Layout hideLogoMobile={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        
        {/* --- MODAL KONFIRMASI --- */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 lg:p-8 transform transition-all animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
                  Selamat! 🎉
                </h3>
                <p className="text-base lg:text-lg text-gray-600 mb-6">
                  Anda telah mempelajari faktor penyebab perilaku seksual remaja.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition-all"
                  >
                    Ulangi
                  </button>
                  <button
                    onClick={() => {
                      saveProgress(currentVideo); 
                      navigate('/materihome');
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    Ya, Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full px-4 md:px-6 py-4 md:py-8">
          {/* Hamburger Button (Mobile) */}
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

          <div className="w-full">
            <div className={`grid ${isSidebarOpen ? 'lg:grid-cols-4' : 'grid-cols-1'} gap-4 md:gap-6 transition-all duration-300`}>
              
              {/* --- LEFT SIDEBAR (Daftar Menu) --- */}
              {isSidebarOpen && (
                <div className="lg:col-span-1 fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto bg-black/50 lg:bg-transparent" onClick={(e) => {
                  if (e.target === e.currentTarget && window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}>
                  <div className="absolute lg:relative left-0 lg:left-auto top-0 bottom-0 w-80 lg:w-auto bg-green-50 lg:bg-green-50 rounded-r-3xl lg:rounded-3xl shadow-2xl lg:shadow-xl border border-green-200 overflow-hidden lg:sticky lg:top-6">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
                      <h2 className="text-white font-bold text-base lg:text-lg">Faktor Penyebab</h2>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-white hover:bg-white/20 rounded-full p-1 transition-colors lg:hidden"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                      <div className="space-y-3">
                        {sections.map(section => (
                          <div key={section.id}>
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
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
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
                                          <span className="text-xs lg:text-sm">{item.emoji}</span>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className={`text-sm lg:text-base font-semibold truncate transition-colors ${
                                          active ? 'text-green-700' : 'text-gray-700'
                                        }`}>
                                          {item.title}
                                        </div>
                                        <div className="text-xs lg:text-sm text-gray-500 mt-1 truncate">
                                          {item.description}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 lg:p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer group shadow-sm" onClick={() => navigate('/materihome')}>
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm lg:text-base font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                              Kembali ke Home
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- RIGHT CONTENT AREA --- */}
              <div className={`${isSidebarOpen ? 'lg:col-span-3' : 'col-span-1'}`}>
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
                  
                  {/* Content Header */}
                  <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white z-10">
                    <h1 className="text-lg lg:text-2xl font-bold text-gray-800 flex-1 pr-2">{currentModule.title}</h1>
                    {!isSidebarOpen && (
                      <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="hidden lg:flex bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full font-bold transition-all shadow-lg items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>Menu</span>
                      </button>
                    )}
                  </div>

                  {/* Reminder Box */}
                  <div className="p-3 lg:p-4 bg-yellow-50 border-b border-yellow-200 shrink-0">
                    <p className="text-center text-gray-700 font-medium text-xs lg:text-sm">
                      <span className="text-yellow-600">💡</span> Pelajari faktor ini untuk meningkatkan kesadaran diri.
                    </p>
                  </div>

                  {/* DYNAMIC CONTENT AREA */}
                  <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {renderContent()}
                  </div>

                  {/* Footer Navigation */}
                  <div className="p-4 lg:p-6 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0 bg-gray-50">
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
                      className="hover:scale-105 transition-transform"
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