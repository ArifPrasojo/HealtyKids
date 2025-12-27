// src/pages/admin/ManageQuiz.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, AlertCircle, 
  FileQuestion, Clock, List, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Pastikan path import ini benar sesuai struktur folder Anda
import { quizService } from '../../services/api/quizService'; 
import type { QuizItem, QuizFormData } from '../../services/api/quizService';

const ManageQuiz = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Error & Validation
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<QuizItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data Default
  const initialFormState: QuizFormData = {
    title: '',
    description: '',
    duration: 60,
    isActive: true
  };
  const [formData, setFormData] = useState<QuizFormData>(initialFormState);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setGlobalError(null);
      // Ini akan memanggil service yang sudah diperbaiki URL-nya
      const response = await quizService.getAllQuizzes();
      
      // Handle jika response.data berbentuk array
      if (response.success && Array.isArray(response.data)) {
        setQuizList(response.data);
      } else {
        // Fallback jika format data berbeda
        setQuizList([]); 
      }
    } catch (err) {
      console.error(err);
      setGlobalError('Gagal menghubungkan ke server. Pastikan backend menyala.');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = useMemo(() => {
    return quizList.filter(quiz => 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quizList, searchQuery]);

  // --- HANDLERS ---

  const handleAddQuiz = () => {
    setEditingQuiz(null); 
    setFormData(initialFormState);
    setFormErrors({});
    setGlobalError(null);
    setIsModalOpen(true);
  };

  const handleEditQuiz = (quiz: QuizItem) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      isActive: quiz.isActive
    });
    setFormErrors({});
    setGlobalError(null);
    setIsModalOpen(true);
  };

  const handleDeleteQuiz = (quiz: QuizItem) => {
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  // --- VALIDASI ---
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Judul quiz wajib diisi';
      isValid = false;
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Deskripsi wajib diisi';
      isValid = false;
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Durasi harus lebih dari 0 menit';
      isValid = false;
    }

    setFormErrors(newErrors);
    if (!isValid) setGlobalError(null);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGlobalError(null);

    try {
      let response;
      if (editingQuiz) {
        response = await quizService.updateQuiz(editingQuiz.id, formData);
      } else {
        response = await quizService.createQuiz(formData);
      }

      if (response.success) {
        setIsModalOpen(false);
        setEditingQuiz(null);
        fetchQuizzes(); // Refresh data setelah simpan
      } else {
        setGlobalError(response.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await quizService.deleteQuiz(quizToDelete.id);
      if (response.success) {
        setIsDeleteModalOpen(false);
        setQuizToDelete(null);
        fetchQuizzes(); // Refresh data setelah hapus
      } else {
        setGlobalError(response.message || 'Gagal menghapus quiz');
      }
    } catch (err) {
      setGlobalError('Terjadi kesalahan saat menghapus');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (fieldName: string) => `
    w-full px-4 py-2 border rounded-lg outline-none transition-all text-sm
    ${formErrors[fieldName]
      ? 'border-red-500 bg-red-50 focus:ring-red-200 placeholder-red-300' 
      : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'
    }
  `;

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 text-sm font-medium">
            <ArrowLeft size={18} /> Kembali
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Quiz</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola data quiz dan ujian</p>
          </div>
          <button onClick={handleAddQuiz} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm whitespace-nowrap">
            <Plus size={20} /> Tambah Quiz
          </button>
        </div>

        {globalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-fade-in">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{globalError}</span>
            <button onClick={() => setGlobalError(null)} className="ml-auto"><X size={18} /></button>
          </div>
        )}

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari judul quiz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              />
            </div>
        </div>

        {/* CONTENT */}
        {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                <Loader className="animate-spin mb-2 text-blue-600" size={30} />
                <span className="text-sm">Memuat data quiz...</span>
            </div>
        ) : filteredQuizzes.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <FileQuestion size={48} className="mb-3 opacity-50" />
                <p className="text-gray-500 font-medium">Belum ada data quiz</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="p-5 flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{quiz.title}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    quiz.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {quiz.isActive ? 'Aktif' : 'Draft'}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{quiz.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <Clock size={16} className="text-blue-500" />
                                <span className="font-medium">{quiz.duration} Menit</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex gap-2">
                              {/* Pastikan route ini sesuai dengan route di App.tsx Anda */}
                             <button
                                onClick={() => navigate(`/admin/quiz/${quiz.id}/questions`)}
                                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                              >
                                <List size={16} /> Soal
                              </button>
                              <button onClick={() => handleEditQuiz(quiz)} className="p-2 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg" title="Edit">
                                <Edit size={18} />
                              </button>
                              <button onClick={() => handleDeleteQuiz(quiz)} className="p-2 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg" title="Hapus">
                                <Trash2 size={18} />
                              </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-800">
                {editingQuiz ? "Edit Quiz" : "Tambah Quiz Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="quizForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Quiz <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={getInputClass('title')}
                    placeholder="Contoh: Ujian Matematika Dasar"
                  />
                  {formErrors.title && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi <span className="text-red-500">*</span></label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`${getInputClass('description')} resize-none`}
                    rows={3}
                    placeholder="Deskripsi singkat tentang quiz..."
                  />
                  {formErrors.description && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.description}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Durasi (Menit) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input
                                type="number"
                                min="1"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                className={`${getInputClass('duration')} pl-10`}
                                placeholder="60"
                            />
                        </div>
                        {formErrors.duration && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.duration}</p>}
                    </div>
                    <div className="flex-1 flex items-center h-full pt-6">
                        <label className="flex items-center cursor-pointer gap-3 p-2 rounded-lg hover:bg-gray-50 w-full border border-transparent hover:border-gray-200 transition-all">
                            <div className="relative inline-flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 select-none">Quiz Aktif</span>
                        </label>
                    </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
              <button type="submit" form="quizForm" disabled={isSubmitting} className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-sm transition-colors font-medium">
                {isSubmitting && <Loader size={14} className="animate-spin" />}
                {editingQuiz ? "Simpan Perubahan" : "Buat Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {isDeleteModalOpen && quizToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><Trash2 size={24} /></div>
            <h3 className="text-lg font-bold text-gray-900">Hapus Quiz?</h3>
            <p className="text-gray-500 text-sm mb-6">Quiz <strong>{quizToDelete.title}</strong> akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">Batal</button>
              <button onClick={confirmDelete} disabled={isSubmitting} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex justify-center gap-2">
                {isSubmitting && <Loader size={14} className="animate-spin" />} Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuiz;