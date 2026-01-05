import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import service dan type
import { answerService } from '../../services/api/answerService';
import type { Answer } from '../../services/api/answerService';

const ManageAnswers: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (questionId) {
      fetchAnswersData();
    }
  }, [questionId]);

  const fetchAnswersData = async () => {
    try {
      setLoading(true);
      const result = await answerService.getAnswers(questionId!);
      if (result.success) {
        setAnswers(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memuat data jawaban.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAll = async () => {
    if (!questionId) return;

    try {
      const result = await answerService.updateAnswers(questionId, answers);
      if (result.success || result) { // Tergantung response backend
        alert("Semua jawaban berhasil diperbarui!");
        fetchAnswersData();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui jawaban. Cek koneksi atau struktur data.");
    }
  };

  const updateLocalState = (id: number, field: keyof Answer, value: any) => {
    setAnswers(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  if (loading) return <div className="p-6 text-center">Loading answers...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:underline">
        ← Kembali ke Pertanyaan
      </button>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Jawaban (Q-ID: {questionId})</h2>
        <button 
          onClick={handleUpdateAll}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-orange-600 transition-colors"
        >
          SIMPAN PERUBAHAN
        </button>
      </div>

      <div className="space-y-4">
        {answers.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Tidak ada jawaban ditemukan.</p>
        ) : (
          answers.map((ans) => (
            <div key={ans.id} className="p-4 border rounded-xl bg-white flex gap-4 items-center shadow-sm">
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">ID Jawab: {ans.id}</label>
                <input 
                  className="w-full border-b focus:border-blue-500 outline-none p-1 transition-colors"
                  value={ans.answer}
                  onChange={(e) => updateLocalState(ans.id, 'answer', e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs mb-1">Benar?</label>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 cursor-pointer accent-blue-600"
                  checked={ans.isCorrect}
                  onChange={(e) => updateLocalState(ans.id, 'isCorrect', e.target.checked)}
                />
              </div>
            </div>
          ))
        )}
      </div>
      
      <p className="mt-6 text-sm text-gray-500 italic">
        * Ubah teks atau status benar lalu tekan tombol "SIMPAN PERUBAHAN" di atas.
      </p>
    </div>
  );
};

export default ManageAnswers;