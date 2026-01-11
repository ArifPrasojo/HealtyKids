import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';

// ID Materi Utama untuk penyimpanan progress
const MATERI_ID = 3;

interface ModuleItem {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  emoji: string;
  description: string;
  content: string; // Isi materi dalam bentuk text (support \n untuk baris baru)
  images: string[]; // Array URL gambar
}

const Materi3: React.FC = () => {
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // --- DATA KONTEN (Dikonversi dari switch-case lama) ---
  const sections: { id: number; items: ModuleItem[]; icon: string }[] = [
    {
      id: 1,
      icon: '⭕',
      items: [
        { 
          id: 1, 
          title: 'IMS: Gonore', 
          duration: '3 min', 
          completed: false, 
          emoji: '🦠', 
          description: 'Infeksi Gonore (Kencing Nanah)',
          images: ['/src/assets/images/Gonore.jpg'],
          content: `A. Infeksi Menular Seksual (IMS)\nInfeksi menular seksual adalah jenis infeksi yang dapat menyebar melalui berbagai jenis hubungan seksual, yaitu vaginal, oral, dan anal.\n\nGonore (Kencing Nanah)\nGonore dapat menyebabkan infeksi di uretra, serviks, anus, atau tenggorokan, tergantung pada jenis hubungan seks yang dilakukan.`
        },
        { 
          id: 2, 
          title: 'IMS: Sifilis', 
          duration: '3 min', 
          completed: false, 
          emoji: '✋', 
          description: 'Infeksi Sifilis (Raja Singa)',
          images: ['/src/assets/images/Sifilis.jpg'],
          content: `B. Sifilis (Raja Singa)\nSifilis dapat menyerang berbagai bagian tubuh seperti selaput lendir, anus, bibir, lidah, dan mulut.\n\nPenyebaran sifilis terutama terjadi melalui hubungan seksual, baik secara genital, oral maupun anal, dan dapat menyerang baik pria maupun wanita.`
        },
        { 
          id: 3, 
          title: 'IMS: Herpes Genital', 
          duration: '3 min', 
          completed: false, 
          emoji: '🤕', 
          description: 'Infeksi Herpes pada area genital',
          images: ['/src/assets/images/Genital.jpg'],
          content: `C. Herpes Genital\nHerpes genital merupakan bintil-bintil berisi cairan dan terasa nyeri di area kemaluan.\n\n• Dapat menular melalui hubungan seksual secara berlebihan.\n• Catatan: Tidak semua herpes disebabkan karena perilaku seksual, namun herpes genital spesifik menyerang area kelamin.`
        },
        { 
          id: 4, 
          title: 'IMS: HPV', 
          duration: '3 min', 
          completed: false, 
          emoji: '🏵️', 
          description: 'Virus Kutil & Kanker Serviks',
          images: ['/src/assets/images/hpv.jpg'],
          content: `D. HPV (Human Papilloma Virus)\nHPV merupakan virus yang menyerang kulit yang dapat menyebabkan munculnya kutil pada area genital.\n\nBahaya Kanker Serviks:\nHPV menjadi penyebab utama dari kanker serviks pada wanita. Saat ini, Kemenkes RI sedang menggalakkan program eliminasi kanker serviks akibat banyak kasus yang terdeteksi setiap tahunnya.`
        },
        { 
          id: 5, 
          title: 'HIV/AIDS', 
          duration: '5 min', 
          completed: false, 
          emoji: '🎗️', 
          description: 'Definisi dan cara penularan',
          images: [], // Tidak ada gambar di slide ini
          content: `E. HIV/AIDS\nHIV (Human Immunodeficiency Virus) adalah virus yang menyerang sistem kekebalan tubuh. Infeksi ini menyebabkan tubuh kehilangan daya tahan, sehingga rentan terhadap berbagai penyakit lain yang disebut AIDS (Acquired Immunodeficiency Syndrome).\n\nCara Penularan Melalui cairan tubuh seperti:\n• Darah\n• Sperma\n• Cairan Vagina\n• Cairan dalam Anus\n\nDapat menular melalui perilaku seksual tidak aman (tanpa kondom) atau penggunaan jarum suntik bergantian (narkoba suntik).`
        },
        { 
          id: 6, 
          title: 'Periode Jendela HIV', 
          duration: '4 min', 
          completed: false, 
          emoji: '⏳', 
          description: 'Tahapan infeksi HIV',
          images: ['/src/assets/images/HIV.jpg'],
          content: `Tahapan Penularan (Periode Jendela)\nProses perjalanan virus HIV dalam tubuh:\n\n1. Tahap Awal (2 Minggu - 6 Bulan)\nPeriode jendela. Pada 2-3 minggu awal, muncul gejala seperti flu biasa.\n\n2. Tahap HIV+ (3 - 10 Tahun)\nTampak sehat dan dapat beraktivitas seperti biasa tanpa gejala (Masa Inkubasi).\n\n3. Tahap AIDS (1 - 2 Tahun Akhir)\nTimbul infeksi oportunistik. Gejala: diare kronis, berat badan turun drastis, demam berkepanjangan, gangguan saraf.`
        },
        { 
          id: 7, 
          title: 'Dampak Lainnya', 
          duration: '5 min', 
          completed: false, 
          emoji: '🧠', 
          description: 'KTD, Kecanduan, & Emosi',
          images: [], // Tidak ada gambar di slide ini
          content: `F. Dampak Psikologis & Sosial\n\n1. Kehamilan Tidak Diinginkan (KTD)\nRemaja di bawah 20 tahun belum memiliki sistem reproduksi yang sempurna. Kehamilan di luar nikah berisiko medis dan dapat menyebabkan depresi.\n\n2. Kecanduan (Efek Dopamin)\nAktivitas seksual atau pornografi memicu otak mengeluarkan dopamin (rasa senang). Jika dilakukan berulang, otak akan "mencatat" kegiatan itu dan memicu kecanduan.\n\n3. Emosi Tidak Stabil\nRasa bersalah, mudah marah, dan depresi berlebihan.\n\n4. Jejak Digital\nVCS atau foto syur yang tersebar sulit dihapus dan bisa menjadi viral.\n\n5. Stigma Negatif Masyarakat\nDianggap tabu, dikucilkan, hingga risiko putus sekolah karena melanggar aturan.`
        }
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
                  Anda telah mempelajari dampak perilaku seksual.
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
                    Selesai
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
                      <h2 className="text-white font-bold text-base lg:text-lg">Materi Akibat</h2>
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
                                      className={`flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-300 ${active
                                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 shadow-md'
                                          : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-2 border-transparent hover:border-green-200'
                                        }`}
                                    >
                                      <div className={`w-6 h-6 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${done
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
                                        <div className={`text-sm lg:text-base font-semibold truncate transition-colors ${active ? 'text-green-700' : 'text-gray-700'
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
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">

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
                      <span className="text-yellow-600">💡</span> Pelajari bahaya dan akibat perilaku seksual agar bisa menghindarinya.
                    </p>
                  </div>

                  {/* DYNAMIC CONTENT DISPLAY */}
                  <div className="flex-1 p-6 lg:p-8 overflow-y-auto animate-in fade-in duration-500">
                    
                    {/* Render Images (Jika ada) */}
                    {currentModule.images && currentModule.images.length > 0 && (
                      <div className={`grid gap-4 mb-6 ${currentModule.images.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 flex justify-center'}`}>
                        {currentModule.images.map((imgSrc, index) => (
                          <div key={index} className="flex justify-center">
                            <img
                              src={imgSrc}
                              alt={`Ilustrasi ${currentModule.title} ${index + 1}`}
                              className="rounded-xl shadow-md max-w-full h-auto max-h-[350px] object-contain border border-gray-100"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render Text Content */}
                    <div className="text-slate-700 leading-loose mb-6 text-base md:text-lg lg:text-xl font-serif tracking-wide whitespace-pre-line text-justify selection:bg-green-100 selection:text-green-800   ">
                      {currentModule.content}
                    </div>

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

export default Materi3;