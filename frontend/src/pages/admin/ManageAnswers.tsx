import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ManageAnswers: React.FC = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => { fetchAnswers(); }, [questionId]);

  const fetchAnswers = async () => {
    // Sesuai image_2cba9e.jpg
    const res = await fetch(`http://localhost:3000/admin/quiz/questions/${questionId}/answer`);
    const result = await res.json();
    if (result.success) setAnswers(result.data);
  };

  const handleUpdateAll = async () => {
    // SESUAI STRUKTUR RAW image_2e1420.png
    const payload = {
      answer: answers.map(ans => ({
        answerId: ans.id, // Backend menggunakan id asli sebagai answerId di payload
        answer: ans.answer,
        isCorrect: ans.isCorrect
      }))
    };

    try {
      const res = await fetch(`http://localhost:3000/admin/quiz/questions/${questionId}/answer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Semua jawaban berhasil diperbarui!");
        fetchAnswers();
      } else {
        alert("Gagal memperbarui jawaban. Cek struktur data.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateLocalState = (id: number, field: string, value: any) => {
    setAnswers(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500">← Kembali ke Pertanyaan</button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Jawaban (Q-ID: {questionId})</h2>
        <button 
          onClick={handleUpdateAll}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-orange-600"
        >
          SIMPAN PERUBAHAN
        </button>
      </div>

      <div className="space-y-4">
        {answers.map((ans) => (
          <div key={ans.id} className="p-4 border rounded-xl bg-white flex gap-4 items-center shadow-sm">
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">ID: {ans.id}</label>
              <input 
                className="w-full border-b focus:border-blue-500 outline-none p-1"
                value={ans.answer}
                onChange={(e) => updateLocalState(ans.id, 'answer', e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs mb-1">Benar?</label>
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-pointer"
                checked={ans.isCorrect}
                onChange={(e) => updateLocalState(ans.id, 'isCorrect', e.target.checked)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <p className="mt-6 text-sm text-gray-500 italic">
        * Ubah teks atau status benar lalu tekan tombol "SIMPAN PERUBAHAN" di atas.
      </p>
    </div>
  );
};

export default ManageAnswers;