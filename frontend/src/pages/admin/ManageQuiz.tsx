import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Loader,
  AlertCircle,
  FileQuestion,
  Clock,
  List,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { quizService } from '../../services/api/quizService';
import type { QuizItem, QuizFormData } from '../../services/api/quizService';

const ManageQuiz = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<QuizItem | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState: QuizFormData = {
    title: '',
    description: '',
    duration: 60,
    isActive: true
  };

  const [formData, setFormData] = useState<QuizFormData>(initialFormState);

  // ================= FETCH =================
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await quizService.getAllQuizzes();
      if (res.success && Array.isArray(res.data)) {
        setQuizList(res.data);
      } else {
        setQuizList([]);
      }
    } catch {
      setGlobalError('Gagal menghubungkan ke server');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = useMemo(() => {
    return quizList.filter(q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quizList, searchQuery]);

  // ================= HANDLER =================
  const handleAddQuiz = () => {
    setEditingQuiz(null);
    setFormData(initialFormState);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditQuiz = (quiz: QuizItem) => {
    setEditingQuiz(quiz);
    setFormData(quiz);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteQuiz = (quiz: QuizItem) => {
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Judul wajib diisi';
    if (!formData.description.trim()) errors.description = 'Deskripsi wajib diisi';
    if (formData.duration <= 0) errors.duration = 'Durasi harus > 0';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = editingQuiz
        ? await quizService.updateQuiz(editingQuiz.id, formData)
        : await quizService.createQuiz(formData);

      if (res.success) {
        setIsModalOpen(false);
        fetchQuizzes();
      } else {
        setGlobalError(res.message || 'Gagal menyimpan data');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;
    setIsSubmitting(true);
    try {
      await quizService.deleteQuiz(quizToDelete.id);
      setIsDeleteModalOpen(false);
      fetchQuizzes();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={18} /> Kembali
        </button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Quiz</h1>
            <p className="text-gray-500 text-sm">Kelola quiz dan ujian</p>
          </div>
          <button
            onClick={handleAddQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Tambah Quiz
          </button>
        </div>

        {globalError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {globalError}
          </div>
        )}

        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            placeholder="Cari quiz..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto" />
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileQuestion size={48} className="mx-auto mb-2" />
            Belum ada quiz
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(q => (
              <div key={q.id} className="bg-white p-5 rounded-xl border">
                <h3 className="font-semibold text-lg">{q.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{q.description}</p>
                <div className="text-sm text-gray-500 flex items-center gap-2 mb-3">
                  <Clock size={14} /> {q.duration} menit
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/quiz/${q.id}/questions`)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <List size={16} /> Soal
                  </button>
                  <button onClick={() => handleEditQuiz(q)} className="p-2 border rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteQuiz(q)} className="p-2 border rounded-lg text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="font-bold text-lg mb-4">
              {editingQuiz ? 'Edit Quiz' : 'Tambah Quiz'}
            </h2>

            <input
              className="w-full border rounded-lg px-3 py-2 mb-3"
              placeholder="Judul"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />

            <textarea
              className="w-full border rounded-lg px-3 py-2 mb-3"
              placeholder="Deskripsi"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: +e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DELETE */}
      {isDeleteModalOpen && quizToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center">
            <p>Hapus quiz <strong>{quizToDelete.title}</strong>?</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setIsDeleteModalOpen(false)}>Batal</button>
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuiz;
