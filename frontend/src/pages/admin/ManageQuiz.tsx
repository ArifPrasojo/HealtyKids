// src/pages/admin/ManageQuiz.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader,
  LayoutDashboard
} from 'lucide-react';

// Service Imports
import { quizService } from '../../services/api/quizService';
// Pastikan path import type sesuai dengan struktur project Anda
import type { QuizData } from '../../services/api/quizService'; 
import CloudBackground from '../../components/layouts/CloudBackground';

const ManageQuiz: React.FC = () => {
  // State
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const navigate = useNavigate();

  // Load Data saat component di-mount
  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const result = await quizService.getQuiz();
      
      if (result.success && result.data) {
        setQuiz(result.data);
      } else {
        // Jika success false tapi tidak throw error
        setMessage({ type: 'error', text: result.message || "Gagal memuat data kuis" });
      }
    } catch (error: any) {
      console.error("Error fetching quiz:", error);
      // Menangkap pesan error dari Service (misal: "Sesi berakhir")
      const errMsg = error instanceof Error ? error.message : "Gagal terhubung ke server";
      setMessage({ type: 'error', text: errMsg });
      
      // Opsional: Jika sesi berakhir, redirect ke login (tergantung kebutuhan)
      if (errMsg.includes("Sesi berakhir")) {
        // navigate('/login'); 
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await quizService.updateQuiz(quiz);
      
      if (result.success) {
        setMessage({ type: 'success', text: "Pengaturan kuis berhasil diperbarui!" });
      } else {
        setMessage({ type: 'error', text: result.message || "Gagal memperbarui kuis." });
      }
    } catch (error: any) {
      console.error(error);
      // Menangkap pesan error spesifik dari Service
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan sistem.";
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk styling input yang konsisten dengan ManageUsers
  const inputClass = "w-full px-5 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base shadow-sm";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Background Decor */}
      <CloudBackground 
        cloudImage="./src/assets/images/awanhijau.png"
        showCityBottom={true}
        showPlane={true}
        planeSize="medium"
        planeCount={2}
      />

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Tombol Kembali */}
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors mb-6 text-sm font-medium w-fit hover:bg-blue-50 px-3 py-2 rounded-lg"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pengaturan Kuis</h1>
              <p className="text-gray-600 text-base">Konfigurasi judul, durasi, dan status kuis Anda</p>
            </div>
            <button 
              onClick={() => navigate(`/admin/managequiz/${quiz?.id}/questions`)}
              // Disable tombol jika data quiz belum ada/loading
              disabled={loading || !quiz}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Settings size={22} />
              <span>Kelola Pertanyaan</span>
            </button>
          </div>

          {/* Feedback Message */}
          {message && (
            <div className={`mb-8 p-5 rounded-xl flex items-start gap-4 animate-fade-in shadow-sm border-l-4 ${
              message.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={24} className="text-green-600" /> : <AlertCircle size={24} className="text-red-600" />}
              <div className="flex-1">
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
            </div>
          )}

          {/* Main Card Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            {loading ? (
              <div className="py-24 text-center">
                <Loader size={48} className="mx-auto text-blue-600 animate-spin mb-6" />
                <p className="text-gray-600 font-medium text-lg">Memuat data kuis...</p>
              </div>
            ) : (
              <form onSubmit={handleUpdateQuiz} className="p-8 space-y-6">
                
                {/* Field: Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-800">
                    <LayoutDashboard size={18} className="text-blue-500" />
                    Judul Kuis
                  </label>
                  <input 
                    type="text" 
                    className={inputClass}
                    placeholder="Contoh: Ujian Tengah Semester Matematika"
                    value={quiz?.title || ''} 
                    onChange={e => setQuiz(prev => prev ? {...prev, title: e.target.value} : null)}
                    required
                  />
                </div>

                {/* Field: Duration */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-800">
                    <Clock size={18} className="text-blue-500" />
                    Durasi (Menit)
                  </label>
                  <input 
                    type="number" 
                    className={inputClass}
                    placeholder="Masukkan durasi dalam menit"
                    value={quiz?.duration || 0} 
                    onChange={e => setQuiz(prev => prev ? {...prev, duration: parseInt(e.target.value)} : null)}
                    required
                  />
                </div>

                {/* Field: Status Active */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:bg-blue-50/50">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={quiz?.isActive || false} 
                      onChange={e => setQuiz(prev => prev ? {...prev, isActive: e.target.checked} : null)}
                      id="status-toggle"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <label htmlFor="status-toggle" className="text-base font-medium text-gray-700 cursor-pointer">
                    Status Kuis Aktif (Siswa dapat mengerjakan)
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-fit bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <Loader size={20} className="animate-spin" />
                    ) : (
                      <Save size={20} />
                    )}
                    <span>Simpan Perubahan</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageQuiz;