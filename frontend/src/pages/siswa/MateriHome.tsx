import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout'; // Pastikan path ini benar
import CloudBackground from '../../components/layouts/CloudBackground'; // Pastikan path ini benar
import { Button } from '../../components/ui/Button'; // Pastikan path ini benar

// Base URL (fallback ke localhost jika env tidak ada)
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

interface MateriHomeProps {
  onLogout?: () => void;
}

// Interface sesuai struktur data backend Anda
interface MaterialAPI {
  id: number;
  title: string;
  description: string;
  totalSubMaterial: string | number; 
  totalSubMaterialRead: string | number; 
}

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

      // 1. SMART TOKEN DETECTION
      // Coba cari token dengan beberapa kemungkinan nama key
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access_token');
      
      console.log("Token ditemukan:", token ? "YA" : "TIDAK"); // Debugging aman (jangan log full token di production)

      if (!token) {
        console.warn("Token kosong, mengarahkan ke login...");
        navigate('/login', { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/material`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // 2. Handling 401 (Unauthorized)
        if (response.status === 401) {
           console.error("401 Unauthorized: Token kadaluarsa atau tidak valid.");
           localStorage.clear(); // Bersihkan semua storage agar bersih
           navigate('/login', { replace: true });
           return;
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // 3. Validasi Struktur Data
        // Sesuaikan dengan respon backend Anda. Kode ini mencoba menangani format { data: [...] } atau { data: { materials: [...] } }
        let materialsArray: MaterialAPI[] = [];
        
        if (Array.isArray(result.data)) {
            materialsArray = result.data;
        } else if (result.data && Array.isArray(result.data.materials)) {
            materialsArray = result.data.materials;
        } else if (Array.isArray(result)) {
            materialsArray = result;
        }

        if (materialsArray) {
          const formattedData = materialsArray.map((item: MaterialAPI, index: number) => {
            const style = styleAssets[index % styleAssets.length];
            return {
              ...item,
              ...style,
              // PERBAIKAN DI SINI: Hapus '/siswa', jadi langsung ke /materi
              route: `/materi/${item.id}`
            };
          });
          setMateriData(formattedData);
        } else {
          setErrorMessage("Format data dari server tidak dikenali.");
          console.error("Format data aneh:", result);
        }

      } catch (error: any) {
        console.error("Gagal mengambil materi:", error);
        setErrorMessage(error.message || "Terjadi kesalahan koneksi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependency array kosong agar hanya jalan sekali saat mount

const handleMateriClick = (materi: MateriCard) => {
    navigate(materi.route, { 
      state: { 
        title: materi.title, 
        description: materi.description 
      } 
    });
};

  const renderProgressBars = (totalStr: string | number, completedStr: string | number, bgColor: string) => {
    const total = Number(totalStr) || 0;
    const completed = Number(completedStr) || 0;

    return (
      <div className="flex gap-1">
        {Array.from({ length: Math.max(total, 1) }).map((_, index) => (
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
      {/* Tombol Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed bottom-6 left-6 z-50 bg-white/80 backdrop-blur text-purple-700 px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all flex items-center space-x-2 border border-purple-200"
      >
        <span>⬅ Dashboard</span>
      </button>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-x-hidden">
        <CloudBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Materi Pembelajaran</h1>
            <p className="text-gray-600 text-lg">Pilih materi untuk mulai belajar.</p>
          </div>

          {/* Handling Loading & Error UI */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
               <p className="text-gray-500">Memuat materi...</p>
            </div>
          ) : errorMessage ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center">
                <p className="font-bold">Gagal memuat data</p>
                <p className="text-sm">{errorMessage}</p>
                <Button variant="secondary" onClick={() => window.location.reload()} className="mt-4">
                    Coba Lagi
                </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materiData.length > 0 ? materiData.map((materi) => (
                <div
                  key={materi.id}
                  className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/40 flex flex-col"
                >
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${materi.color} rounded-2xl flex items-center justify-center shadow-lg text-2xl`}>
                        {materi.icon}
                      </div> 
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{materi.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{materi.description}</p>

                    <div className="mt-auto pt-4">
                      <div className="mb-2">
                        {renderProgressBars(materi.totalSubMaterial, materi.totalSubMaterialRead, materi.bgColor)}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-4">
                        <span>{materi.totalSubMaterialRead} selesai</span>
                        <span>Total {materi.totalSubMaterial}</span>
                      </div>

                      <Button
                        variant="primary"
                        onClick={() => handleMateriClick(materi)}
                        className={`w-full bg-gradient-to-r ${materi.color} border-none shadow-md`}
                      >
                        Mulai Belajar
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-10 text-gray-500 bg-white/50 rounded-xl">
                  Tidak ada materi tersedia saat ini.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MateriHome;