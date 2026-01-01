import React, { useState, useEffect } from 'react';
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
}

const Materi3: React.FC = () => {
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

  // --- DATA SIDEBAR (Diupdate sesuai materi baru: 7 Sub-bab) ---
  const sections: { id: number; items: ModuleItem[]; icon: string }[] = [
    {
      id: 1,
      icon: '⭕',
      items: [
        { id: 1, title: 'IMS: Gonore', duration: '3 min', completed: false, emoji: '🦠', description: 'Infeksi Gonore (Kencing Nanah)' },
        { id: 2, title: 'IMS: Sifilis', duration: '3 min', completed: false, emoji: '✋', description: 'Infeksi Sifilis (Raja Singa)' },
        { id: 3, title: 'IMS: Herpes Genital', duration: '3 min', completed: false, emoji: '🤕', description: 'Infeksi Herpes pada area genital' },
        { id: 4, title: 'IMS: HPV', duration: '3 min', completed: false, emoji: '🏵️', description: 'Virus Kutil & Kanker Serviks' },
        { id: 5, title: 'HIV/AIDS', duration: '5 min', completed: false, emoji: '🎗️', description: 'Definisi dan cara penularan' },
        { id: 6, title: 'Periode Jendela HIV', duration: '4 min', completed: false, emoji: '⏳', description: 'Tahapan infeksi HIV' },
        { id: 7, title: 'Dampak Lainnya', duration: '5 min', completed: false, emoji: '🧠', description: 'KTD, Kecanduan, & Emosi' }
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
      
      // BLOK 1: IMS & GONORE
      case 1: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">A. Infeksi Menular Seksual (IMS)</h3>
            <p className="text-gray-700 leading-relaxed text-sm lg:text-base text-justify mb-4">
              Infeksi menular seksual adalah jenis infeksi yang dapat menyebar melalui berbagai jenis hubungan seksual, yaitu vaginal, oral, dan anal. Salah satu contohnya adalah Gonore.
            </p>
            
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
              <h4 className="font-bold text-red-700 mb-2">🦠 Gonore (Kencing Nanah)</h4>
              <p className="text-gray-700 text-sm lg:text-base">
                Gonore dapat menyebabkan infeksi di uretra, serviks, anus, atau tenggorokan, tergantung pada jenis hubungan seks yang dilakukan.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img 
                src="/src/assets/images/image_2a0aed.png" // Ganti path sesuai lokasi file Anda
                alt="Ilustrasi Gonore"
                className="rounded-xl shadow-md max-w-full h-auto max-h-[300px] object-contain"
              />
              <span className="text-xs text-gray-500 mt-2 italic">Ilustrasi gejala dan bakteri Gonore</span>
            </div>
          </div>
        );

      // BLOK 2: SIFILIS
      case 2: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">B. Sifilis (Raja Singa)</h3>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base text-justify">
                Sifilis dapat menyerang berbagai bagian tubuh seperti selaput lendir, anus, bibir, lidah, dan mulut. Penyebaran sifilis terutama terjadi melalui hubungan seksual, baik secara genital, oral maupun anal, dan dapat menyerang baik pria maupun wanita.
              </p>
            </div>

            <div className="flex flex-col items-center mt-6">
              <img 
                src="/src/assets/images/image_2a0daf.png" // Ganti path sesuai lokasi file Anda
                alt="Ilustrasi Sifilis"
                className="rounded-xl shadow-md max-w-full h-auto max-h-[350px] object-contain"
              />
              <span className="text-xs text-gray-500 mt-2 italic">Contoh gejala bercak merah pada tangan akibat Sifilis</span>
            </div>
          </div>
        );

      // BLOK 3: HERPES GENITAL
      case 3: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">C. Herpes Genital</h3>
            <p className="text-gray-700 leading-relaxed text-sm lg:text-base text-justify mb-4">
              Herpes genital merupakan bintil-bintil berisi cairan dan terasa nyeri di area kemaluan.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6">
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm lg:text-base">
                <li>Dapat menular melalui hubungan seksual secara berlebihan.</li>
                <li><strong>Catatan:</strong> Tidak semua herpes disebabkan karena perilaku seksual, namun herpes genital spesifik menyerang area kelamin.</li>
              </ul>
            </div>

            <div className="flex flex-col items-center">
              <img 
                src="/src/assets/images/image_2a0dcd.png" // Ganti path sesuai lokasi file Anda
                alt="Ilustrasi Herpes Genital"
                className="rounded-xl shadow-md max-w-full h-auto max-h-[350px] object-contain"
              />
              <span className="text-xs text-gray-500 mt-2 italic">Ilustrasi virus dan gejala Herpes Genital</span>
            </div>
          </div>
        );

      // BLOK 4: HPV
      case 4: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">D. HPV (Human Papilloma Virus)</h3>
            <p className="text-gray-700 leading-relaxed text-sm lg:text-base text-justify mb-4">
              HPV merupakan virus yang menyerang kulit yang dapat menyebabkan munculnya <strong>kutil pada area genital</strong>.
            </p>

            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-6">
              <h4 className="font-bold text-pink-700 mb-2">⚠️ Bahaya Kanker Serviks</h4>
              <p className="text-gray-700 text-sm lg:text-base mb-2">
                HPV menjadi penyebab utama dari kanker serviks pada wanita.
              </p>
              <p className="text-gray-600 text-sm italic">
                Saat ini, Kemenkes RI sedang menggalakkan program eliminasi kanker serviks akibat banyak kasus yang terdeteksi setiap tahunnya.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img 
                src="/src/assets/images/image_2a0dd5.png" // Ganti path sesuai lokasi file Anda
                alt="Ilustrasi HPV"
                className="rounded-xl shadow-md max-w-full h-auto max-h-[350px] object-contain"
              />
              <span className="text-xs text-gray-500 mt-2 italic">Ilustrasi Kutil Kelamin akibat HPV</span>
            </div>
          </div>
        );

      // BLOK 5: HIV/AIDS (INTRO)
      case 5: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">E. HIV/AIDS</h3>
            <div className="space-y-4 text-sm lg:text-base text-gray-700 text-justify">
              <p>
                <strong>HIV (Human Immunodeficiency Virus)</strong> adalah virus yang menyerang sistem kekebalan tubuh. Infeksi ini menyebabkan tubuh kehilangan daya tahan, sehingga rentan terhadap berbagai penyakit lain yang disebut <strong>AIDS (Acquired Immunodeficiency Syndrome)</strong>.
              </p>
              
              <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">🩸 Cara Penularan:</h4>
                <p className="mb-2">Melalui cairan tubuh seperti:</p>
                <ul className="list-disc list-inside ml-2 mb-3 font-medium text-red-600">
                  <li>Darah</li>
                  <li>Sperma</li>
                  <li>Cairan Vagina</li>
                  <li>Cairan dalam Anus</li>
                </ul>
                <p className="text-xs lg:text-sm text-gray-600">
                  Dapat menular melalui perilaku seksual tidak aman (tanpa kondom) atau penggunaan <strong>jarum suntik bergantian</strong> (narkoba suntik).
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                <span className="font-bold text-blue-700">❗ Fakta:</span> Kasus HIV/AIDS di Indonesia diprediksi mencapai 564.000 pada tahun 2025, dan remaja termasuk di dalamnya.
              </div>
            </div>
          </div>
        );

      // BLOK 6: PERIODE JENDELA HIV
      case 6: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">Tahapan Penularan (Periode Jendela)</h3>
            <p className="mb-4 text-sm lg:text-base text-gray-600">Proses perjalanan virus HIV dalam tubuh:</p>

            <div className="space-y-4">
              {/* Tahap 1 */}
              <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg text-sm whitespace-nowrap">Awal</div>
                <div>
                  <h4 className="font-bold text-gray-800">2 Minggu - 6 Bulan</h4>
                  <p className="text-sm text-gray-600">Periode jendela. 2-3 minggu awal muncul gejala seperti <strong>flu biasa</strong>.</p>
                </div>
              </div>

              {/* Gambar Flu */}
              <div className="flex justify-center my-2">
                 <img 
                  src="/src/assets/images/image_2a0e0c.png" // Ganti path sesuai lokasi file Anda
                  alt="Gejala seperti flu"
                  className="rounded-lg max-w-[200px] h-auto object-contain border border-gray-200"
                />
              </div>

              {/* Tahap 2 */}
              <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="bg-yellow-100 text-yellow-600 font-bold px-3 py-1 rounded-lg text-sm whitespace-nowrap">HIV +</div>
                <div>
                  <h4 className="font-bold text-gray-800">3 - 10 Tahun</h4>
                  <p className="text-sm text-gray-600">Tampak sehat dan dapat beraktivitas seperti biasa tanpa gejala (Masa Inkubasi).</p>
                </div>
              </div>

              {/* Tahap 3 */}
              <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-red-500">
                <div className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm whitespace-nowrap">AIDS</div>
                <div>
                  <h4 className="font-bold text-gray-800">1 - 2 Tahun Akhir</h4>
                  <p className="text-sm text-gray-600">Timbul infeksi oportunistik. Gejala: diare kronis, berat badan turun drastis, demam berkepanjangan, gangguan saraf.</p>
                </div>
              </div>
            </div>
          </div>
        );

      // BLOK 7: DAMPAK LAINNYA
      case 7: 
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="font-bold text-gray-800 mb-4 text-lg lg:text-xl">F. Dampak Psikologis & Sosial</h3>
            
            <div className="grid grid-cols-1 gap-4">
              
              {/* KTD */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-800 mb-1">1. Kehamilan Tidak Diinginkan (KTD)</h4>
                <p className="text-sm text-gray-700 text-justify">
                  Remaja di bawah 20 tahun belum memiliki sistem reproduksi yang sempurna. Kehamilan di luar nikah berisiko medis dan dapat menyebabkan depresi.
                </p>
              </div>

              {/* Kecanduan */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-1">2. Kecanduan (Efek Dopamin)</h4>
                <p className="text-sm text-gray-700 text-justify">
                  Aktivitas seksual atau pornografi memicu otak mengeluarkan <em>dopamin</em> (rasa senang). Jika dilakukan berulang, otak akan "mencatat" kegiatan itu dan memicu kecanduan.
                </p>
              </div>

              {/* Emosi & Jejak Digital */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                   <h4 className="font-bold text-red-800 mb-1">3. Emosi Tidak Stabil</h4>
                   <p className="text-xs text-gray-700">Rasa bersalah, mudah marah, dan depresi berlebihan.</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                   <h4 className="font-bold text-gray-800 mb-1">4. Jejak Digital</h4>
                   <p className="text-xs text-gray-700">VCS atau foto syur yang tersebar sulit dihapus dan bisa menjadi viral.</p>
                </div>
              </div>

               {/* Stigma */}
               <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h4 className="font-bold text-orange-800 mb-1">5. Stigma Negatif Masyarakat</h4>
                <p className="text-sm text-gray-700">
                   Dianggap tabu, dikucilkan, hingga risiko putus sekolah karena melanggar aturan.
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
                  Anda telah mempelajari dampak perilaku seksual. Lanjut ke menu utama?
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

export default Materi3;