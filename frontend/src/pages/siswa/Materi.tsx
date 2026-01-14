import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import 'react-quill-new/dist/quill.snow.css'; 

import { 
  getSubMaterials, 
  updateSubMaterialProgress,
  API_BASE_URL 
} from '../../services/api/userSubMaterialService';
import type { SubMaterialAPI } from '../../services/api/userSubMaterialService';

const Materi: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subMaterials, setSubMaterials] = useState<SubMaterialAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- 1. FETCH DATA (GET) ---
  useEffect(() => {
    const fetchDetailMateri = async () => {
      if (!id) return;

      try {
        const data = await getSubMaterials(id);
        setSubMaterials(data);
      } catch (err: any) {
        console.error(err);
        if (err.message === "NO_TOKEN" || err.message === "UNAUTHORIZED") {
          localStorage.clear();
          navigate('/login');
          return;
        }
        setError("Terjadi kesalahan saat memuat materi.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetailMateri();
  }, [id, navigate]);

  // --- 2. FUNGSI POST PROGRESS ---
  const markSubMaterialAsDone = async (subMaterialId: number) => {
    if (!id) return;
    try {
      const isSuccess = await updateSubMaterialProgress(id, subMaterialId);
      if (isSuccess) {
        setSubMaterials(prev => prev.map(item => 
          item.id === subMaterialId ? { ...item, isDone: true } : item
        ));
      } 
    } catch (err) {
      console.error("Error posting progress:", err);
    }
  };

  const currentItem = subMaterials[currentIndex] || { 
      id: 0, title: '', content: '', contentUrl: '', contentCategory: '', isDone: false
  };

  // --- LOGIKA URL GAMBAR & YOUTUBE ---
  
  const getFullImageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('https')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // Helper: Cek apakah URL adalah YouTube
  const isYouTubeUrl = (url: string | null) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Helper: Konversi Link YouTube biasa ke Link Embed
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    // Regex untuk mengambil ID video dari berbagai format link YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url; // Kembalikan url asli jika gagal parse (fallback)
  };

  const mainImageUrl = getFullImageUrl(currentItem.contentUrl);

  // Perbaikan Link Gambar di dalam Text Editor HTML
  const processedContent = currentItem.content 
    ? currentItem.content.replace(/src="\/([^"]+)"/g, `src="${API_BASE_URL}/$1"`)
    : '<p class="text-gray-400 italic">Tidak ada konten teks.</p>';


  // --- NAVIGASI ---
  const handleNextLesson = async () => {
    if (currentItem.id !== 0 && !currentItem.isDone) {
       await markSubMaterialAsDone(currentItem.id);
    }
    if (currentIndex < subMaterials.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const contentArea = document.getElementById('content-area');
      if(contentArea) contentArea.scrollTop = 0;
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleFinishCourse = async () => {
    if (currentItem.id !== 0 && !currentItem.isDone) {
        await markSubMaterialAsDone(currentItem.id);
    }
    setShowConfirmModal(false);
    navigate('/materi');
  };

  const handlePreviousLesson = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const contentArea = document.getElementById('content-area');
      if(contentArea) contentArea.scrollTop = 0;
    }
  };

  if (loading) return <Layout><div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500"></div></div></Layout>;
  if (error) return <Layout><div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div></Layout>;

  return (
    <Layout hideLogoMobile={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        
        {/* MODAL KONFIRMASI */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 lg:p-8 transform transition-all animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">Selamat! 🎉</h3>
                <p className="text-base lg:text-lg text-gray-600 mb-6">Anda telah menyelesaikan bab materi ini.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition-all">Ulangi</button>
                  <button onClick={handleFinishCourse} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold transition-all shadow-lg">Selesai</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full px-4 md:px-6 py-4 md:py-8">
          {/* Hamburger (Mobile) */}
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="fixed top-4 left-4 z-50 lg:hidden bg-white p-3 rounded-full shadow-xl border border-gray-200 hover:bg-gray-50 transition-all">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          )}

          <div className="w-full">
            <div className={`grid ${isSidebarOpen ? 'lg:grid-cols-4' : 'grid-cols-1'} gap-4 md:gap-6 transition-all duration-300`}>
              
              {/* LEFT SIDEBAR */}
              {isSidebarOpen && (
                <div className="lg:col-span-1 fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto bg-black/50 lg:bg-transparent" onClick={(e) => {
                  if (e.target === e.currentTarget && window.innerWidth < 1024) setIsSidebarOpen(false);
                }}>
                  <div className="absolute lg:relative left-0 lg:left-auto top-0 bottom-0 w-80 lg:w-auto bg-green-50 rounded-r-3xl lg:rounded-3xl shadow-2xl lg:shadow-xl border border-green-200 overflow-hidden lg:sticky lg:top-6">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
                      <h2 className="text-white font-bold text-base lg:text-lg">Daftar Materi</h2>
                      <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1 lg:hidden">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                      <div className="space-y-3">
                        <div className="bg-white px-3 py-3 rounded-2xl border border-green-200">
                           <div className="space-y-2">
                              {subMaterials.map((item, index) => {
                                const active = index === currentIndex;
                                return (
                                  <div key={item.id} onClick={() => { setCurrentIndex(index); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} className={`flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 shadow-md' : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-2 border-transparent'}`}>
                                    <div className={`w-6 h-6 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${item.isDone ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                      {item.isDone ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <span className="text-xs">{index + 1}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`text-sm lg:text-base font-semibold truncate ${active ? 'text-green-700' : 'text-gray-700'}`}>{item.title}</div>
                                      <div className="text-xs lg:text-sm text-gray-500 mt-1 truncate uppercase">{item.contentCategory}</div>
                                    </div>
                                  </div>
                                );
                              })}
                           </div>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 cursor-pointer" onClick={() => navigate('/materi')}>
                        <div className="flex items-center space-x-3 font-bold text-gray-800">
                          <span className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center">←</span>
                          <span>Kembali ke Daftar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RIGHT CONTENT AREA */}
              <div className={`${isSidebarOpen ? 'lg:col-span-3' : 'col-span-1'}`}>
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[80vh]">
                  
                  {/* Header */}
                  <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                    <h1 className="text-lg lg:text-2xl font-bold text-gray-800 flex-1 pr-2">{currentItem.title}</h1>
                    {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="hidden lg:block px-4 py-2 bg-green-600 text-white rounded-full">Menu</button>}
                  </div>

                  {/* Info Box */}
                  <div className="p-3 lg:p-4 bg-yellow-50 border-b border-yellow-200">
                    <p className="text-center text-gray-700 font-medium text-xs lg:text-sm"><span className="text-yellow-600">💡</span> Info: Baca materi dengan seksama sebelum lanjut.</p>
                  </div>

                  {/* CONTENT BODY */}
                  <div id="content-area" className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-50/50">
                    <div className="animate-in fade-in duration-500 w-full max-w-none">
                      
                      {/* --- MEDIA UTAMA (GAMBAR ATAU VIDEO YOUTUBE) --- */}
                      {currentItem.contentUrl && !currentItem.content.includes(currentItem.contentUrl) && (
                        <div className="mb-8 grid gap-6">
                            <div className="w-full bg-gray-100 rounded-2xl p-2 border border-gray-200 shadow-inner overflow-hidden">
                               
                               {/* LOGIKA SWITCH: Jika YouTube tampilkan Iframe, jika bukan tampilkan Image */}
                               {isYouTubeUrl(currentItem.contentUrl) ? (
                                 <div className="relative w-full pb-[56.25%] h-0">
                                   <iframe 
                                     src={getYouTubeEmbedUrl(currentItem.contentUrl)}
                                     title="Video Materi"
                                     className="absolute top-0 left-0 w-full h-full rounded-xl"
                                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                     allowFullScreen
                                   />
                                 </div>
                               ) : (
                                 <img 
                                   src={mainImageUrl}
                                   alt={currentItem.title}
                                   className="rounded-xl mx-auto shadow-sm hover:scale-[1.02] transition-transform duration-500 object-contain max-h-[400px] w-full"
                                   onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                 />
                               )}

                            </div>
                        </div>
                      )}

                      {/* TEXT CONTENT - QUILL RENDERER */}
                      <div className="ql-snow">
                        <div
                          // Tambahkan class Tailwind [&_iframe]... agar video di dalam teks juga responsif
                          className="ql-editor !p-0 !overflow-visible prose prose-lg prose-slate max-w-none 
                          prose-headings:text-gray-800 
                          prose-p:text-gray-700 prose-p:leading-loose
                          prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto prose-img:max-h-[500px]
                          prose-li:text-gray-700
                          prose-strong:text-gray-900 prose-strong:font-bold
                          [&_.ql-video]:w-full [&_.ql-video]:aspect-video [&_.ql-video]:rounded-xl
                          [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl
                          [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify"
                          
                          dangerouslySetInnerHTML={{ __html: processedContent }}
                        />
                      </div>

                    </div>
                  </div>

                  {/* Footer Navigation */}
                  <div className="p-4 lg:p-6 border-t border-gray-200 flex items-center justify-between gap-3 bg-white">
                    <button onClick={handlePreviousLesson} disabled={currentIndex === 0} className="disabled:opacity-50 hover:scale-105 transition-transform">
                      <img src="/src/assets/icons/kembali.svg" alt="Kembali" className="h-12 lg:h-14 w-auto" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = "⬅ Kembali"; }} />
                    </button>
                    <button onClick={handleNextLesson} className="hover:scale-105 transition-transform">
                      <img src="/src/assets/icons/lanjut.svg" alt="Lanjut" className="h-12 lg:h-14 w-auto" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerText = "Lanjut ➡"; }} />
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