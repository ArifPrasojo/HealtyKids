import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Loader, AlertCircle, FileQuestion, Clock, List, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/api/quizService';
import type { QuizItem, QuizFormData } from '../../services/api/quizService';
import CloudBackground from '../../components/layouts/CloudBackground'; // Import CloudBackground

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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* CloudBackground sebagai background */}
      <CloudBackground 
        cloudImage="./src/assets/images/awanhijau.png"
        showCityBottom={true}
        showPlane={true}
        planeSize="medium"
        planeCount={2}
      />
      
      {/* Konten utama di atas background */}
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Container */}
          <div className="mb-8">
            
            {/* Tombol Kembali */}
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors mb-6 text-sm font-medium w-fit hover:bg-blue-50 px-3 py-2 rounded-lg"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Quiz</h1>
                <p className="text-gray-600 text-base">Kelola data quiz dan pertanyaan dengan mudah dan efisien</p>
              </div>
              <button
                onClick={handleAddQuiz}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={22} />
                <span>Tambah Quiz</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-4 animate-fade-in shadow-sm">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-900 text-base font-semibold">Terjadi Kesalahan</h3>
                <p className="text-red-800 text-sm mt-1">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                <X size={20} />
              </button>
            </div>
          )}

          {/* Search & Content Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari judul atau deskripsi quiz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all text-base shadow-sm"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader size={48} className="mx-auto text-blue-600 animate-spin mb-6" />
                <p className="text-gray-600 font-medium text-lg">Memuat data quiz...</p>
              </div>
            ) : filteredQuizzes.length === 0 ? (
              // Empty State
              <div className="py-24 text-center bg-gray-50/50">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileQuestion size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h3>
                <p className="text-gray-600 text-base max-w-md mx-auto">
                  {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada quiz yang ditambahkan. Mulai dengan menambahkan quiz baru."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop View - Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg">{quiz.title}</h3>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {quiz.isActive ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{quiz.description}</p>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Clock size={16} />
                          <span>{quiz.duration} menit</span>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/admin/quiz/${quiz.id}/questions`)}
                            className="flex-1 px-4 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-medium transition-colors border border-indigo-200 shadow-sm flex items-center justify-center gap-2"
                          >
                            <List size={16} />
                            Soal
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditQuiz(quiz)}
                              disabled={isSubmitting}
                              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuiz(quiz)}
                              disabled={isSubmitting}
                              className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
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
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden transform transition-all scale-100">
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3">Judul Quiz</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base shadow-sm"
            placeholder="Masukkan judul quiz"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3">Deskripsi</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base min-h-[100px] resize-y shadow-sm"
            placeholder="Masukkan deskripsi quiz"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3">Durasi (menit)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base shadow-sm"
            placeholder="60"
            min="1"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <label htmlFor="isActive" className="text-base font-semibold text-gray-800">
            Quiz Aktif
          </label>
        </div>

        <div className="flex gap-4 justify-end pt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 text-base font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            {isSubmitting && <Loader size={18} className="animate-spin" />}
            {submitText}
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

const ModalDelete: React.FC<ModalDeleteProps> = ({ 
  quizTitle, 
  onConfirm, 
  onClose, 
  isSubmitting 
}) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden text-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
        <Trash2 size={32} />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Hapus Quiz?</h3>
      <p className="text-gray-600 text-base mb-8 leading-relaxed">
        Anda yakin ingin menghapus quiz <strong>"{quizTitle}"</strong>? <br/>
        Data yang dihapus tidak dapat dikembalikan.
      </p>

      <div className="flex gap-4">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-base transition-colors shadow-sm"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium text-base transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          {isSubmitting && <Loader size={18} className="animate-spin" />}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

export default ManageQuiz;