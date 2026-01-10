// src/pages/admin/ManageQuestions.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, AlertCircle, 
  ArrowLeft, Image as ImageIcon, FileText, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { questionService, API_BASE_URL } from '../../services/api/questionService';
import type { Question, QuestionPayload } from '../../services/api/questionService';
import CloudBackground from '../../components/layouts/CloudBackground';

const ManageQuestions: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Notifikasi (Sukses/Gagal)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    question: '',
    explanation: '',
    photo: '' 
  });

  // --- FETCH DATA ---
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const result = await questionService.getQuestions();
      
      // Cek result.success dan pastikan result.data ada
      if (result.success && result.data) {
        setQuestions(result.data);
      }
    } catch (err: any) {
      // Menangkap error dari service (termasuk 401 Unauthorized)
      const errorMsg = err instanceof Error ? err.message : "Gagal mengambil data soal dari server.";
      setStatusMessage({ type: 'error', text: errorMsg });
      
      // Opsional: Jika sesi berakhir, bisa redirect (uncomment jika perlu)
      // if (errorMsg.includes("Sesi berakhir")) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [questions, searchQuery]);

  // --- HANDLERS ---
  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({ question: '', explanation: '', photo: '' });
    setFormErrors({});
    setStatusMessage(null); // Reset pesan saat buka modal baru
    setIsModalOpen(true);
  };

  const handleEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      question: q.question,
      explanation: q.explanation,
      photo: '' // Reset input file visual, gambar lama tetap ada di server
    });
    setFormErrors({});
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim()) {
        setFormErrors({ question: "Teks pertanyaan wajib diisi" });
        return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const payload: QuestionPayload = {
      question: formData.question,
      explanation: formData.explanation,
    };

    // Hanya kirim photo jika ada perubahan (string base64)
    if (formData.photo && formData.photo.startsWith('data:image')) {
      payload.photo = formData.photo;
    }

    try {
      const result = editingQuestion 
        ? await questionService.updateQuestion(editingQuestion.id, payload)
        : await questionService.createQuestion(payload);

      if (result.success) {
        setIsModalOpen(false);
        setStatusMessage({ 
            type: 'success', 
            text: editingQuestion ? "Pertanyaan berhasil diperbarui!" : "Pertanyaan baru berhasil ditambahkan!" 
        });
        fetchQuestions();
      } else {
        setStatusMessage({ type: 'error', text: result.message || "Gagal menyimpan data." });
      }
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan sistem.";
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const result = await questionService.deleteQuestion(questionToDelete.id);
      
      if (result.success) {
        setIsDeleteModalOpen(false);
        setStatusMessage({ type: 'success', text: "Pertanyaan berhasil dihapus secara permanen!" });
        fetchQuestions();
      } else {
        setStatusMessage({ type: 'error', text: result.message || "Gagal menghapus soal." });
      }
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Kesalahan saat menghapus data.";
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <CloudBackground 
        cloudImage="./src/assets/images/awanhijau.png"
        showCityBottom={true}
        showPlane={true}
        planeSize="medium"
        planeCount={2}
      />

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors mb-6 text-sm font-medium w-fit hover:bg-blue-50 px-3 py-2 rounded-lg">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bank Soal</h1>
              <p className="text-gray-600 text-base">Kelola daftar pertanyaan dan kunci jawaban kuis</p>
            </div>
            <button onClick={handleAddQuestion} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <Plus size={22} />
              <span>Tambah Pertanyaan</span>
            </button>
          </div>

          {/* --- NOTIFIKASI BERHASIL / GAGAL --- */}
          {statusMessage && (
            <div className={`mb-8 p-5 border-l-4 rounded-xl flex items-start gap-4 animate-fade-in shadow-sm ${
              statusMessage.type === 'success' 
                ? 'bg-green-50 border-green-500 text-green-800' 
                : 'bg-red-50 border-red-500 text-red-800'
            }`}>
              {statusMessage.type === 'success' 
                ? <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" /> 
                : <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              }
              <div className="flex-1">
                <h3 className="text-base font-bold">
                  {statusMessage.type === 'success' ? 'Berhasil' : 'Terjadi Kesalahan'}
                </h3>
                <p className="text-sm mt-1">{statusMessage.text}</p>
              </div>
              <button onClick={() => setStatusMessage(null)} className="p-1 rounded-full hover:bg-black/5 transition-colors">
                <X size={20} />
              </button>
            </div>
          )}

          {/* TABLE DATA */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center">
                <Loader size={48} className="mx-auto text-blue-600 animate-spin mb-6" />
                <p className="text-gray-600 font-medium text-lg">Memuat data soal...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left hidden md:table">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="px-8 py-5">Isi Pertanyaan</th>
                      <th className="px-8 py-5">Gambar</th>
                      <th className="px-8 py-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="font-semibold text-gray-900 text-base line-clamp-1">{q.question}</p>
                          <p className="text-gray-500 text-xs mt-1 italic line-clamp-1">{q.explanation || 'Tanpa penjelasan'}</p>
                        </td>
                        <td className="px-8 py-5">
                          {q.photo ? (
                            <img src={`${API_BASE_URL}${q.photo}`} className="w-12 h-12 object-cover rounded-lg border border-gray-200" alt="img" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/admin/questions/${q.id}/answers`)}
                              className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors text-xs font-bold mr-2 border border-green-200"
                            >
                              Jawaban
                            </button>
                            <button onClick={() => handleEditQuestion(q)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => { setQuestionToDelete(q); setIsDeleteModalOpen(true); }} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* --- MODAL FORM --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingQuestion ? "Edit Pertanyaan" : "Tambah Pertanyaan Baru"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FileText size={18} className="text-blue-500" /> Teks Pertanyaan
                  </label>
                  <textarea
                    required
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all min-h-[100px] ${
                      formErrors.question ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    placeholder="Tuliskan pertanyaan..."
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Penjelasan (Opsional)</label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[80px]"
                    placeholder="Penjelasan untuk siswa..."
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Gambar</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-4 justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium">
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting && <Loader size={18} className="animate-spin" />}
                    {editingQuestion ? "Simpan Perubahan" : "Simpan Soal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL DELETE --- */}
        {isDeleteModalOpen && questionToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hapus Soal?</h3>
              <p className="text-gray-600 mb-8 text-sm">Tindakan ini permanen dan akan menghapus semua jawaban terkait.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="flex-1 py-3 border border-gray-300 rounded-xl font-medium">Batal</button>
                <button onClick={confirmDelete} disabled={isSubmitting} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                   {isSubmitting && <Loader size={18} className="animate-spin" />}
                   Hapus
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageQuestions;