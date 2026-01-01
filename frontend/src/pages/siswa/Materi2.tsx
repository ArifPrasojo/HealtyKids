import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
// Import komponen UI yang sebelumnya hilang
import { Button } from '../../components/ui/Button'; 

// --- KONFIGURASI ID MATERI ---
const MATERI_ID = 2; 

interface ModuleItem {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  emoji: string;
  description: string;
  content: string;
}

const Materi2: React.FC = () => {
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- LOGIKA PROGRESS (LocalStorage) ---
  // Membaca progress awal dari LocalStorage saat halaman dimuat
  const [completedVideos, setCompletedVideos] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('materi_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed[MATERI_ID] || [];
      }
    } catch (e) {
      return [];
    }
    return [];
  });

  // --- DATA KONTEN (Sesuaikan isi materi di sini) ---
  const sections: { id: number; items: ModuleItem[]; icon: string }[] = [
    {
      id: 1,
      icon: '⭕',
      items: [
        { 
          id: 1, title: 'Pengertian', duration: '5 min', completed: false, emoji: '📘', description: 'Definisi Perilaku Seksual',
          content: 'Perilaku seksual mencakup semua tindakan yang dipengaruhi oleh dorongan keinginan seksual, baik terhadap lawan jenis maupun sesama jenis. Bentuk-bentuk tindakan ini sangat beragam, mulai dari perasaan tertarik hingga tindakan berkencan, bercium, dan berhubungan intim.'
        },
        { 
          id: 2, title: 'Pacaran - Sentuhan', duration: '8 min', completed: false, emoji: '📜', description: 'Tahap Awal Pacaran',
          content: 'Pacaran sebenarnya tidak berbahaya. Namun, jika pacaran tersebut tidak dibatasi oleh norma, maka pacaran dapat menjadi berisiko.\n\na) Berawal dari sentuhan\nKebiasaan sentuhan seperti berpegangan tangan dan berpelukan menjadi hal pertama yang dilakukan saat pacaran. Namun, dari berpegangan tangan inilah munculah tindakan lain.\n\nb) Berciuman\nSebagai cara mengekspresikan cinta, ciuman di pipi ataupun kecupan di bibir merupakan cara mengekspresikan betapa besarnya rasa cinta mereka kepada pasangannya. Mulai dari sini adalah tanda lampu kuning yang berkedip. Kok bisa? Dari ciuman ini dapat meningkatkan hasrat seksual remaja dan ingin melakukan tindakan yang lebih.'
        },
        { 
          id: 3, title: 'Necking & Petting', duration: '6 min', completed: false, emoji: '🎮', description: 'Tahap Lanjutan Pacaran',
          content: 'c) Necking\nApa itu? Necking merupakan bentuk ekspresi dari pelukan dan ciuman yang lebih intens dibandingkan ciuman biasa. Dilihat dari namanya, necking dilakukan di area leher dan dapat meningkatkan hasrat seksual.\n\nd) Petting\nSelanjutnya, apabila remaja sudah tidak bisa lagi menahan hasrat seksualnya, maka mereka akan melakukan hal yang namanya petting. Petting adalah gabungan dari 3 perilaku yang sudah kita bahas tadi (touching, kissing, necking) tapi ditambah dengan sentuhan di area sensitif dan intensitasnya lebih dalam dan intens.'
        },
        { 
          id: 4, title: 'LGBT', duration: '5 min', completed: false, emoji: '🏳️', description: 'Lesbian, Gay, Biseksual, Transgender',
          content: 'Tentunya bagi remaja zaman sekarang tidak asing dengan yang namanya LGBT. LGBT adalah sebuah singkatan yaitu lesbian, gay, biseksual dan transgender.\n\nGay dan Lesbian merupakan seseorang laki-laki atau perempuan yang menyukai jenis kelamin yang sama dan biseksual merupakan seseorang yang menyukai 2 jenis kelamin.\n\nLGBT selain dilarang oleh agama, juga dapat menjadi perilaku seksual berisiko. Mengapa? Karena mereka mempunyai aktivitas seksual yang tidak seharusnya dilakukan dan tidak pada tempat yang seharusnya.'
        },
        { 
          id: 5, title: 'Cyber Sex', duration: '6 min', completed: false, emoji: '💻', description: 'Aktivitas Seksual Online',
          content: 'Era digital memungkinkan kegiatan seks dilakukan secara online. Salah satu bentuk aktivitas seksual di media sosial adalah "Video Call Sex (VCS)". Aktivitas ini dapat mencakup berbagai bentuk, seperti berbicara tentang hal-hal seksual, melakukan tindakan eksplisit, atau menampilkan bagian tubuh yang bersifat intim.'
        },
        { 
          id: 6, title: 'Oral Seks', duration: '7 min', completed: false, emoji: '⚠️', description: 'Hubungan Seksual - Oral',
          content: 'Oral seks merupakan perilaku seksual yang melibatkan mulut dan bagian genital pasangan. Cara yang satu ini sering dilakukan remaja karena mereka menganggap oral seks lebih aman karena tidak melibatkan langsung 2 bagian kelamin namun tetap memberikan rasa kepuasan.'
        },
        { 
          id: 7, title: 'Intercourse Sex', duration: '8 min', completed: false, emoji: '🚫', description: 'Hubungan Seksual - Intercourse',
          content: 'Intercourse sex merupakan perilaku seksual yang lebih intim dimana sudah melibatkan 2 bagian kelamin. Intercourse sex dilakukan dengan memasukkan penis ke dalam vagina untuk mencapai kepuasan seksual. Hal ini seharusnya dilakukan oleh pasangan suami istri yang sudah sah dalam hukum negara. Namun, karena rasa penasaran remaja yang besar, remaja terkadang tidak terkontrol dan akhirnya berawal pacaran lanjut ke tahap ini.'
        },
        { 
          id: 8, title: 'Anal Sex', duration: '7 min', completed: false, emoji: '❌', description: 'Hubungan Seksual - Anal',
          content: 'Anal sex merupakan hubungan seksual yang dilakukan melalui jalur belakang (anus). Anal sex sangat berbahaya karena anus tidak didesain untuk berhubungan seksual sehingga dinding anus sangat sensitif dan mudah robek serta dalam anus terdapat banyak sekali bakteri sumber penyakit.'
        }
      ]
    },
  ];

  const flatModules: ModuleItem[] = sections.flatMap(s => s.items);
  const currentModule = flatModules[currentVideo];

  // --- FUNGSI SAVE PROGRESS ---
  const saveProgress = (videoIndex: number) => {
    if (!completedVideos.includes(videoIndex)) {
      const newCompleted = [...completedVideos, videoIndex];
      setCompletedVideos(newCompleted);

      // Simpan ke LocalStorage
      const saved = localStorage.getItem('materi_progress');
      const parsed = saved ? JSON.parse(saved) : {};
      parsed[MATERI_ID] = newCompleted;
      localStorage.setItem('materi_progress', JSON.stringify(parsed));
    }
  };

  const handleNextLesson = () => {
    saveProgress(currentVideo); // Simpan progress saat klik lanjut
    if (currentVideo < flatModules.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setIsPlaying(false);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePreviousLesson = () => {
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
      setIsPlaying(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/materihome');
  };

  return (
    <Layout hideLogoMobile={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        
        {/* --- MODAL KONFIRMASI --- */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 lg:p-8 transform transition-all">
              <div className="text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
                  Selamat! 🎉
                </h3>
                <p className="text-base lg:text-lg text-gray-600 mb-6">
                  Apakah semua materi sudah Anda pahami?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition-all"
                  >
                    Belum, Review Lagi
                  </button>
                  <button
                    onClick={() => {
                        saveProgress(currentVideo);
                        navigate('/materihome');
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold transition-all shadow-lg"
                  >
                    Ya, Sudah Paham
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full px-4 md:px-6 py-4 md:py-8">
          {/* Hamburger Button Mobile */}
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
              
              {/* --- LEFT SIDEBAR --- */}
              {isSidebarOpen && (
                <div className="lg:col-span-1 fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto bg-black/50 lg:bg-transparent" onClick={(e) => {
                  if (e.target === e.currentTarget && window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}>
                  <div className="absolute lg:relative left-0 lg:left-auto top-0 bottom-0 w-80 lg:w-auto bg-green-50 lg:bg-green-50 rounded-r-3xl lg:rounded-3xl shadow-2xl lg:shadow-xl border border-green-200 overflow-hidden lg:sticky lg:top-6">
                    {/* Header Title with Close Button */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
                      <h2 className="text-white font-bold text-base lg:text-lg">Perilaku Seksual</h2>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-white hover:bg-white/20 rounded-full p-1 transition-colors lg:hidden"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* List Items */}
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
                                        <div className="text-xs lg:text-sm text-gray-500 mt-1">
                                          {item.duration} • {item.description}
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

                      {/* Tombol Kembali ke Dashboard Sidebar */}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- RIGHT CONTENT AREA --- */}
              <div className={`${isSidebarOpen ? 'lg:col-span-3' : 'col-span-1'}`}>
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                  
                  {/* Content Header */}
                  <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-lg lg:text-2xl font-bold text-gray-800 flex-1 pr-2">{currentModule.title}</h1>
                    
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

                  {/* Video/Image Player Area */}
                  <div className="p-5 md:p-5 bg-gray-100">
                    <img 
                      src="/src/assets/images/foto.png"
                      alt="Ilustrasi Materi"
                      className="rounded-xl mx-auto"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '400px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Note/Reminder Section */}
                  <div className="p-4 lg:p-6 bg-yellow-50 border-b border-yellow-200">
                    <p className="text-center text-gray-700 font-medium text-xs lg:text-base">
                      <span className="text-yellow-600">⚠️</span> Ingat: Sebagai remaja yang cerdas, batasi tindakan supaya tidak merugikan diri sendiri!
                    </p>
                  </div>

                  {/* Description Content */}
                  <div className="p-4 lg:p-6">
                    <p className="text-gray-700 leading-relaxed mb-3 lg:mb-4 text-xs lg:text-base whitespace-pre-line text-justify">
                      {currentModule.content}
                    </p>
                  </div>

                  {/* Bottom Navigation Buttons (Sesuai Asset Asli) */}
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

export default Materi2;