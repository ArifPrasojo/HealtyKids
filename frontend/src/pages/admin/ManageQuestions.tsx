/// src/pages/admin/ManageQuestions.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, AlertCircle, 
  ArrowLeft, Image as ImageIcon, FileText, CheckCircle2, ChevronRight 
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
  
  // State Notifikasi
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
      if (result.success && result.data) {
        setQuestions(result.data);
      }
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Gagal mengambil data soal.";
      setStatusMessage({ type: 'error', text: errorMsg });
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
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      question: q.question,
      explanation: q.explanation,
      photo: ''
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
    const errors: Record<string, string> = {};
    
    if (!formData.question.trim()) errors.question = "Teks pertanyaan wajib diisi.";
    if (!formData.explanation.trim()) errors.explanation = "Penjelasan wajib diisi.";

    if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return; 
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setFormErrors({});

    const payload: QuestionPayload = {
      question: formData.question,
      explanation: formData.explanation,
    };

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
      setStatusMessage({ type: 'error', text: err.message || "Terjadi kesalahan sistem." });
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
      setStatusMessage({ type: 'error', text: err.message || "Kesalahan saat menghapus data." });
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

      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors mb-6 text-sm font-medium w-fit hover:bg-blue-50 px-3 py-2 rounded-lg">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bank Soal</h1>
              <p className="text-gray-600 text-sm md:text-base">Kelola daftar pertanyaan dan kunci jawaban kuis</p>
            </div>
            <button onClick={handleAddQuestion} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold flex items-center gap-2 md:gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base">
              <Plus size={20} />
              <span>Tambah Pertanyaan</span>
            </button>
          </div>

          {/* --- NOTIFIKASI --- */}
          {statusMessage && !isModalOpen && (
            <div className={`mb-6 p-4 border-l-4 rounded-xl flex items-start gap-3 shadow-sm ${
              statusMessage.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <div className="flex-1 text-sm md:text-base">
                <span className="font-bold block">{statusMessage.type === 'success' ? 'Berhasil' : 'Error'}</span>
                {statusMessage.text}
              </div>
              <button onClick={() => setStatusMessage(null)}><X size={18} /></button>
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden flex flex-col min-h-[400px]">
            
            {/* SEARCH BAR */}
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white sticky top-0 z-20">
              <div className="relative max-w-lg w-full">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-base shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <Loader size={40} className="text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Memuat data...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                    <p>Tidak ada pertanyaan ditemukan.</p>
                </div>
            ) : (
              <>
                {/* --- TAMPILAN DESKTOP (TABEL) --- */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase">
                        <th className="px-6 py-4 w-16 text-center">No</th>
                        <th className="px-6 py-4">Isi Pertanyaan</th>
                        <th className="px-6 py-4">Gambar</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredQuestions.map((q, index) => (
                        <tr key={q.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-4 text-center font-medium text-gray-400">{index + 1}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900 line-clamp-2 mb-1">{q.question}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 italic">{q.explanation}</p>
                          </td>
                          <td className="px-6 py-4">
                            {q.photo ? (
                              <img src={`${API_BASE_URL}${q.photo}`} className="w-12 h-12 object-cover rounded-lg border border-gray-200" alt="soal" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => navigate(`/admin/questions/${q.id}/answers`)}
                                className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold border border-green-200 mr-2"
                              >
                                Jawaban
                              </button>
                              <button onClick={() => handleEditQuestion(q)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                              <button onClick={() => { setQuestionToDelete(q); setIsDeleteModalOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* --- TAMPILAN MOBILE (CARD VIEW) --- */}
                {/* Menggantikan tabel pada layar kecil */}
                <div className="md:hidden flex flex-col divide-y divide-gray-100 bg-gray-50/50">
                   {filteredQuestions.map((q, index) => (
                      <div key={q.id} className="p-4 bg-white hover:bg-gray-50 transition-colors">
                         {/* Header Card: Nomor & Action Menu */}
                         <div className="flex justify-between items-start mb-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                {index + 1}
                            </span>
                            <div className="flex gap-1">
                                <button onClick={() => handleEditQuestion(q)} className="p-2 text-gray-400 hover:text-blue-600"><Edit size={18} /></button>
                                <button onClick={() => { setQuestionToDelete(q); setIsDeleteModalOpen(true); }} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                            </div>
                         </div>

                         {/* Content Card */}
                         <div className="flex gap-4">
                            {/* Gambar (Jika ada) */}
                            {q.photo && (
                                <img src={`${API_BASE_URL}${q.photo}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0 bg-gray-100" alt="soal" />
                            )}
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{q.question}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{q.explanation || "Tidak ada penjelasan"}</p>
                                
                                <button 
                                  onClick={() => navigate(`/admin/questions/${q.id}/answers`)}
                                  className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full w-fit hover:bg-green-100 border border-green-200 transition-colors"
                                >
                                   Lihat Jawaban <ChevronRight size={14} />
                                </button>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- MODAL FORM (RESPONSIVE FIXES) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center z-50 p-0 md:p-4 animate-fade-in">
            {/* max-h-[90vh] dan overflow-y-auto agar modal bisa di-scroll di HP kecil */}
            <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {editingQuestion ? "Edit Pertanyaan" : "Tambah Baru"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2"><X size={24} /></button>
              </div>

              <div className="overflow-y-auto p-6 md:p-8 space-y-5">
                <form id="questionForm" onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <FileText size={18} className="text-blue-500" /> Teks Pertanyaan
                        </label>
                        
                        {(formErrors.question || formErrors.explanation) && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            <ul className="list-disc list-inside">
                                {formErrors.question && <li>{formErrors.question}</li>}
                                {formErrors.explanation && <li>{formErrors.explanation}</li>}
                            </ul>
                            </div>
                        )}

                        <textarea
                            value={formData.question}
                            onChange={(e) => {
                                setFormData({ ...formData, question: e.target.value });
                                if(formErrors.question) setFormErrors({...formErrors, question: ''});
                            }}
                            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all min-h-[100px] text-sm md:text-base ${
                            formErrors.question ? 'border-red-500 bg-red-50/10' : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20'
                            }`}
                            placeholder="Tuliskan pertanyaan..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2">Penjelasan</label>
                        <textarea
                            value={formData.explanation}
                            onChange={(e) => {
                                setFormData({ ...formData, explanation: e.target.value });
                                if(formErrors.explanation) setFormErrors({...formErrors, explanation: ''});
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[80px] text-sm md:text-base"
                            placeholder="Penjelasan untuk siswa..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2">Gambar</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                </form>
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50 flex-shrink-0">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-xl text-sm font-medium">Batal</button>
                  <button 
                    type="submit" 
                    form="questionForm"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg text-sm"
                  >
                    {isSubmitting && <Loader size={16} className="animate-spin" />}
                    Simpan
                  </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DELETE (CENTERED) --- */}
        {isDeleteModalOpen && questionToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Soal?</h3>
              <p className="text-gray-500 mb-6 text-sm">Data akan dihapus permanen. Lanjutkan?</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium text-sm">Batal</button>
                <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-lg text-sm">Hapus</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageQuestions;