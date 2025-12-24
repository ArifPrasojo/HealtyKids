// src/pages/admin/ManageQuiz.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Loader, AlertCircle, FileQuestion, Clock, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/api/quizService';
import type { QuizItem, QuizFormData } from '../../services/api/quizService';

const ManageQuiz = () => {
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<QuizItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuiz, setExpandedQuiz] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<QuizFormData>({
    duration: 60,
    title: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await quizService.getAllQuizzes();
      
      if (response.success && Array.isArray(response.data)) {
        setQuizList(response.data);
      } else {
        setQuizList([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = useMemo(() => {
    return quizList.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [quizList, searchQuery]);

  const resetForm = () => {
    setFormData({ 
      duration: 60,
      title: '', 
      description: '',
      isActive: true
    });
  };

  const handleAddQuiz = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditQuiz = (quiz: QuizItem) => {
    setEditingQuiz(quiz);
    setFormData({
      duration: quiz.duration,
      title: quiz.title,
      description: quiz.description,
      isActive: quiz.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteQuiz = (quiz: QuizItem) => {
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  const validateForm = (): boolean => {
    if (!formData.title || !formData.description) {
      setError('Judul dan deskripsi harus diisi');
      return false;
    }
    if (formData.duration <= 0) {
      setError('Durasi harus lebih dari 0 menit');
      return false;
    }
    return true;
  };

  const handleSubmitAdd = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await quizService.createQuiz(formData);

      if (response.success) {
        setIsAddModalOpen(false);
        resetForm();
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchQuizzes();
      } else {
        setError(response.message || 'Gagal menambah quiz');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Add error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!validateForm() || !editingQuiz) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await quizService.updateQuiz(editingQuiz.id, formData);

      if (response.success) {
        setIsEditModalOpen(false);
        setEditingQuiz(null);
        resetForm();
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchQuizzes();
      } else {
        setError(response.message || 'Gagal mengubah quiz');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Edit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await quizService.deleteQuiz(quizToDelete.id);
      
      if (response.success) {
        setIsDeleteModalOpen(false);
        setQuizToDelete(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchQuizzes();
      } else {
        setError(response.message || 'Gagal menghapus quiz');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus');
      console.error('Delete error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 md:py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Quiz</h1>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Kelola data quiz dan pertanyaan</p>
            </div>
            <button
              onClick={handleAddQuiz}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Quiz</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium">Error</p>
                <p className="text-red-700 text-xs md:text-sm">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Search */}
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari judul atau deskripsi quiz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 py-8 md:py-12 text-center">
            <Loader size={32} className="mx-auto mb-3 text-blue-600 animate-spin" />
            <p className="text-gray-600 text-base md:text-lg">Memuat data quiz...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-8 md:py-12 text-center">
            <FileQuestion size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 text-base md:text-lg">Tidak ada quiz yang ditemukan</p>
          </div>
        ) : (
          <>
            {/* Desktop View - Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 text-base md:text-lg">{quiz.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {quiz.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock size={16} />
                      <span>{quiz.duration} menit</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/quiz/${quiz.id}/questions`)}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <List size={16} />
                        Soal
                      </button>
                      <button
                        onClick={() => handleEditQuiz(quiz)}
                        disabled={isSubmitting}
                        className="p-2 text-blue-600 hover:bg-blue-50 disabled:text-gray-400 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz)}
                        disabled={isSubmitting}
                        className="p-2 text-red-600 hover:bg-red-50 disabled:text-gray-400 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Info */}
        <div className="mt-4 text-xs md:text-sm text-gray-600">
          Menampilkan {filteredQuizzes.length} dari {quizList.length} quiz
        </div>
      </div>

      {/* Modal Tambah Quiz */}
      {isAddModalOpen && (
        <ModalForm
          title="Tambah Quiz Baru"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitAdd}
          onClose={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
          submitText="Tambah"
        />
      )}

      {/* Modal Edit Quiz */}
      {isEditModalOpen && editingQuiz && (
        <ModalForm
          title="Edit Quiz"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitEdit}
          onClose={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
          submitText="Simpan"
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && quizToDelete && (
        <ModalDelete
          quizTitle={quizToDelete.title}
          onConfirm={confirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

// Component untuk Modal Form (Add/Edit)
interface ModalFormProps {
  title: string;
  formData: QuizFormData;
  setFormData: React.Dispatch<React.SetStateAction<QuizFormData>>;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
  submitText: string;
}

const ModalForm: React.FC<ModalFormProps> = ({ 
  title, 
  formData, 
  setFormData, 
  onSubmit, 
  onClose, 
  isSubmitting, 
  submitText 
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 disabled:text-gray-300">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Judul Quiz</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Masukkan judul quiz"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder="Masukkan deskripsi quiz"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="60"
            min="1"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <label htmlFor="isActive" className="text-xs md:text-sm font-medium text-gray-700">
            Quiz Aktif
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader size={16} className="animate-spin" /> : null}
            {isSubmitting ? 'Menyimpan...' : submitText}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Component untuk Modal Delete
interface ModalDeleteProps {
  quizTitle: string;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ quizTitle, onConfirm, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Konfirmasi Hapus</h2>
        <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 disabled:text-gray-300">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div className="text-center">
          <Trash2 size={32} className="text-red-600 mx-auto mb-3" />
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">Hapus Quiz?</h3>
          <p className="text-gray-600 text-xs md:text-sm">
            Apakah Anda yakin ingin menghapus quiz "<strong>{quizTitle}</strong>"? Semua pertanyaan terkait juga akan terhapus. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader size={16} className="animate-spin" /> : null}
            {isSubmitting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ManageQuiz;