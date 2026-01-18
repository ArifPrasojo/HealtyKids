import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import CloudBackground from '../../components/layouts/CloudBackground';
import { Button } from '../../components/ui/Button';

// IMPORT SERVICE
import { materialService } from '../../services/api/userMaterialService';
import type { MaterialAPI } from '../../services/api/userMaterialService';

interface MateriHomeProps {
  onLogout?: () => void;
}

// Tambahkan properti UI ke interface API
interface MateriCard extends MaterialAPI {
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  route: string;
}

const MateriHome: React.FC<MateriHomeProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [materiData, setMateriData] = useState<MateriCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const styleAssets = [
    { icon: '🧑‍🤝‍🧑', color: 'from-pink-400 to-pink-600', bgColor: 'bg-pink-500', textColor: 'text-pink-500' },
    { icon: '🔤', color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-500', textColor: 'text-blue-500' },
    { icon: '🔬', color: 'from-green-400 to-green-600', bgColor: 'bg-green-500', textColor: 'text-green-500' },
    { icon: '🎨', color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { icon: '🌍', color: 'from-purple-400 to-purple-600', bgColor: 'bg-purple-500', textColor: 'text-purple-500' },
  ];

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await materialService.getAllMaterials();
        
        // Transformasi data untuk kebutuhan UI (styling)
        const formattedData = data.map((item, index) => {
          const style = styleAssets[index % styleAssets.length];
          return {
            ...item,
            ...style,
            route: `/materi/${item.id}`
          };
        });

        setMateriData(formattedData);
      } catch (error: any) {
        if (error.message === "UNAUTHORIZED_NO_TOKEN" || error.message === "UNAUTHORIZED_EXPIRED") {
          navigate('/login', { replace: true });
        } else {
          setErrorMessage(error.message || "Terjadi kesalahan koneksi.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ... (Sisa fungsi renderProgressBars, handleMateriClick, dan return JSX tetap sama)
  
  const handleMateriClick = (materi: MateriCard) => {
    navigate(materi.route, { 
      state: { title: materi.title, description: materi.description } 
    });
  };

  const renderProgressBars = (totalStr: string | number, completedStr: string | number, bgColor: string) => {
    const total = Number(totalStr) || 0;
    const completed = Number(completedStr) || 0;
    return (
      <div className="flex gap-1">
        {Array.from({ length: Math.max(total, 1) }).map((_, index) => (
          <div key={index} className={`h-1.5 rounded-full flex-1 ${index < completed ? bgColor : 'bg-gray-200'}`} />
        ))}
      </div>
    );
  };

  return (
    <Layout onLogout={onLogout}>
      {/* Konten Anda tetap sama */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-purple-500/20 to-blue-600/20 backdrop-blur-sm border border-purple-300/30 text-purple-700 hover:from-purple-500/30 hover:to-blue-600/30 hover:border-purple-400/50 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-x-hidden">
        <CloudBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Materi Pembelajaran</h1>
            <p className="text-gray-600 text-lg">Pilih materi untuk mulai belajar.</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
               <p className="text-gray-500">Memuat materi...</p>
            </div>
          ) : errorMessage ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center">
                <p className="font-bold">Gagal memuat data</p>
                <p className="text-sm">{errorMessage}</p>
                <Button variant="secondary" onClick={() => window.location.reload()} className="mt-4">Coba Lagi</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materiData.map((materi) => (
                <div key={materi.id} className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/40 flex flex-col">
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${materi.color} rounded-2xl flex items-center justify-center shadow-lg text-2xl`}>
                        {materi.icon}
                      </div> 
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{materi.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{materi.description}</p>
                    <div className="mt-auto pt-4">
                      <div className="mb-2">{renderProgressBars(materi.totalSubMaterial, materi.totalSubMaterialRead, materi.bgColor)}</div>
                      <div className="flex justify-between text-xs text-gray-500 mb-4">
                        <span>{materi.totalSubMaterialRead} selesai</span>
                        <span>Total {materi.totalSubMaterial}</span>
                      </div>
                      <Button variant="primary" onClick={() => handleMateriClick(materi)} className={`w-full bg-gradient-to-r ${materi.color} border-none shadow-md`}>
                        Mulai Belajar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MateriHome;