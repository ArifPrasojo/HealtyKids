// src/services/api/answerService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL;

export interface Answer {
  id: number;
  answer: string;
  isCorrect: boolean;
}

export interface UpdateAnswerItem {
  answerId: number;
  answer: string;
  isCorrect: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const answerService = {
  // Mengambil semua jawaban berdasarkan ID Pertanyaan
  getAnswers: async (questionId: string | number): Promise<ApiResponse<Answer[]>> => {
    const res = await fetch(`${API_BASE_URL}/admin/quiz/questions/${questionId}/answer`);
    if (!res.ok) throw new Error('Gagal mengambil jawaban');
    return await res.json();
  },

  // Memperbarui semua jawaban sekaligus (Bulk Update)
  updateAnswers: async (questionId: string | number, answers: Answer[]): Promise<ApiResponse<any>> => {
    const payload = {
      answer: answers.map(ans => ({
        answerId: ans.id,
        answer: ans.answer,
        isCorrect: ans.isCorrect
      }))
    };

    const res = await fetch(`${API_BASE_URL}/admin/quiz/questions/${questionId}/answer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error('Gagal memperbarui jawaban');
    return await res.json();
  }
};