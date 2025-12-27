import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  explanation: string;
  photo: string | null;
}

const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ question: '', explanation: '', photo: '' });
  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:3000/admin/quiz/questions';

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    const res = await fetch(BASE_URL);
    const result = await res.json();
    if (result.success) setQuestions(result.data);
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

  // Membangun payload dasar
  const payload: any = {
    question: form.question,
    explanation: form.explanation,
  };

  // Hanya tambahkan photo jika user memilih file baru (Base64)
  // Sesuai image_2cb7f5.jpg & image_2cb7f9.png
  if (form.photo && form.photo.startsWith('data:image')) {
    payload.photo = form.photo;
  }

  const url = editingId 
    ? `http://localhost:3000/admin/quiz/questions/${editingId}` // Sesuai image_2cb7f9.png
    : `http://localhost:3000/admin/quiz/questions`; // Sesuai image_2cb7f5.jpg
  
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok) {
      alert("Berhasil!");
      resetForm();
      fetchQuestions();
    } else {
      alert(`Gagal: ${result.message || "Cek konsol"}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({ question: q.question, explanation: q.explanation, photo: '' }); // photo dikosongkan jika tidak ingin ganti
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
              {q.photo && <img src={`http://localhost:3000${q.photo}`} className="w-16 h-16 object-cover rounded" alt="quiz" />}
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