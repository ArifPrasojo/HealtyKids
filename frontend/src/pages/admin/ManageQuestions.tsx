import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Gunakan import type untuk interface dan ../../ untuk path yang benar
import { questionService, API_BASE_URL } from '../../services/api/questionService';
import type { Question, QuestionPayload } from '../../services/api/questionService';

const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ question: '', explanation: '', photo: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const result = await questionService.getQuestions();
      if (result.success) setQuestions(result.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: QuestionPayload = {
      question: form.question,
      explanation: form.explanation,
    };

    // Hanya kirim foto jika ada perubahan (format Base64)
    if (form.photo && form.photo.startsWith('data:image')) {
      payload.photo = form.photo;
    }

    try {
      let result;
      if (editingId) {
        result = await questionService.updateQuestion(editingId, payload);
      } else {
        result = await questionService.createQuestion(payload);
      }

      if (result.success) {
        alert("Berhasil!");
        resetForm();
        loadQuestions();
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan pada server");
    }
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({ question: q.question, explanation: q.explanation, photo: '' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ question: '', explanation: '', photo: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Question' : 'Add New Question'}</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 border p-4 rounded bg-white shadow">
        <div className="grid gap-4">
          <input 
            placeholder="Question text" className="p-2 border rounded" required
            value={form.question} onChange={e => setForm({...form, question: e.target.value})}
          />
          <textarea 
            placeholder="Explanation" className="p-2 border rounded"
            value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})}
          />
          <div>
            <label className="text-sm text-gray-500">Photo (Opsional - Biarkan kosong jika tidak diubah)</label>
            <input type="file" accept="image/*" className="block w-full text-sm mt-1" onChange={handleFileChange} />
          </div>
          <div className="flex gap-2">
            <button className={`px-4 py-2 rounded text-white ${editingId ? 'bg-orange-500' : 'bg-blue-600'}`}>
              {editingId ? 'Update Question' : 'Submit Question'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
          </div>
        </div>
      </form>

      <div className="grid gap-4">
        {questions.map(q => (
          <div key={q.id} className="border p-4 rounded flex justify-between items-center bg-gray-50">
            <div className="flex gap-4 items-center">
              {q.photo && <img src={`${API_BASE_URL}${q.photo}`} className="w-16 h-16 object-cover rounded" alt="quiz" />}
              <div>
                <p className="font-medium">{q.question}</p>
                <p className="text-xs text-gray-500">{q.explanation}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(q)} className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm">Edit</button>
              <button 
                onClick={() => navigate(`/admin/questions/${q.id}/answers`)} 
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Manage Answers
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageQuestions;