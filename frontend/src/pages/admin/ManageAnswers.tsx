// src/pages/admin/ManageAnswers.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader, 
  X, 
  Hash,
  Info
} from 'lucide-react';

// Service & Types
import { answerService } from '../../services/api/answerService';
import type { Answer } from '../../services/api/answerService';
import CloudBackground from '../../components/layouts/CloudBackground';

const ManageAnswers: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  // --- STATE ---
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (questionId) {
      fetchAnswersData();
    }
  }, [questionId]);

  const fetchAnswersData = async () => {
    try {
      setLoading(true);
      const result = await answerService.getAnswers(questionId!);
      
      if (result.success && result.data) {
        // --- PERBAIKAN DI SINI ---
        // Kita urutkan manual berdasarkan ID agar posisinya tidak lompat-lompat setelah update
        const sortedAnswers = result.data.sort((a, b) => a.id - b.id);
        setAnswers(sortedAnswers);
      }
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Gagal memuat data jawaban dari server.";
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAll = async () => {
    if (!questionId) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const result = await answerService.updateAnswers(questionId, answers);

      if (result.success) {
        setStatusMessage({ type: 'success', text: "Semua perubahan jawaban berhasil disimpan!" });
        // Refresh data untuk memastikan sinkronisasi
        fetchAnswersData();
      } else {
        setStatusMessage({ type: 'error', text: result.message || "Gagal memperbarui jawaban." });
      }
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi server.";
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLocalState = (id: number, field: keyof Answer, value: any) => {
    setAnswers(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <CloudBackground 
        cloudImage="./src/assets/images/awanhijau.png"
        showCityBottom={true}
        showPlane={true}
        planeSize="medium"
        planeCount={1}
      />

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors mb-6 text-sm font-medium w-fit hover:bg-white/50 px-3 py-2 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Soal
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Q-ID: {questionId}</span>
                <h1 className="text-3xl font-bold text-gray-900">Kelola Jawaban</h1>
              </div>
              <p className="text-gray-600 text-base">Tentukan pilihan jawaban dan tandai jawaban yang benar</p>
            </div>
            
            <button 
              onClick={handleUpdateAll}
              disabled={isSubmitting || loading}
              className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
              <span>SIMPAN PERUBAHAN</span>
            </button>
          </div>

          {/* Feedback Message */}
          {statusMessage && (
            <div className={`mb-8 p-5 border-l-4 rounded-xl flex items-start gap-4 animate-fade-in shadow-md backdrop-blur-sm ${
              statusMessage.type === 'success' 
                ? 'bg-green-50/90 border-green-500 text-green-800' 
                : 'bg-red-50/90 border-red-500 text-red-800'
            }`}>
              {statusMessage.type === 'success' 
                ? <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" /> 
                : <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              }
              <div className="flex-1">
                <h3 className="text-base font-bold">
                  {statusMessage.type === 'success' ? 'Berhasil' : 'Kesalahan'}
                </h3>
                <p className="text-sm mt-1">{statusMessage.text}</p>
              </div>
              <button onClick={() => setStatusMessage(null)} className="p-1 rounded-full hover:bg-black/5 transition-colors">
                <X size={20} />
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {loading ? (
              <div className="py-24 text-center">
                <Loader size={48} className="mx-auto text-blue-600 animate-spin mb-6" />
                <p className="text-gray-600 font-medium text-lg font-poppins">Memuat pilihan jawaban...</p>
              </div>
            ) : (
              <div className="p-8">
                <div className="space-y-4">
                {/* Legend/Info */}
                <div className="mt-1 flex items-start gap-1 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <Info size={20} className="text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>Petunjuk:</strong> Anda dapat mengubah teks jawaban dan mengganti status <strong>Benar</strong>. Pastikan setidaknya satu jawaban ditandai sebagai benar sebelum menekan tombol simpan.
                  </p>
                </div>                  
                  {answers.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                       <p className="text-gray-500 font-medium italic text-lg">Tidak ada data jawaban ditemukan.</p>
                    </div>
                  ) : (
                    answers.map((ans, index) => (
                      <div 
                        key={ans.id} 
                        className={`group p-6 border rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center transition-all ${
                          ans.isCorrect 
                            ? 'bg-green-50 border-green-200 ring-1 ring-green-100' 
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        {/* ID Label & Badge */}
                        <div className="flex flex-row md:flex-col items-center gap-2 md:gap-1">
                          <div className="bg-gray-100 text-gray-500 p-2 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                             <Hash size={20} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">ID: {ans.id}</span>
                        </div>

                        {/* Input Answer */}
                        <div className="flex-1 w-full">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">Teks Jawaban {index + 1}</label>
                          <input 
                            className="w-full bg-transparent border-b-2 border-gray-200 focus:border-blue-500 outline-none py-2 text-lg font-medium transition-all text-gray-800 placeholder:text-gray-300"
                            placeholder="Masukkan pilihan jawaban..."
                            value={ans.answer}
                            onChange={(e) => updateLocalState(ans.id, 'answer', e.target.value)}
                          />
                        </div>

                        {/* Checkbox Benar? */}
                        <div className="flex flex-row md:flex-col items-center gap-3 bg-white/50 px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                          <span className={`text-xs font-bold uppercase tracking-tighter ${ans.isCorrect ? 'text-green-600' : 'text-gray-400'}`}>
                            {ans.isCorrect ? 'Benar' : 'Salah'}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={ans.isCorrect}
                              onChange={(e) => updateLocalState(ans.id, 'isCorrect', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="text-center mt-10 text-gray-500 text-sm italic font-medium">
            Sistem Bank Soal &copy; 2026 Healthy-Kids Admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageAnswers;