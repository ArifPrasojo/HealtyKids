// src/services/api/userQuizService.ts

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Tipe data untuk payload submit (opsional, agar lebih rapi)
interface QuizSubmissionPayload {
  result: {
    questionId: number;
    answerId: number;
  }[];
}

export const userQuizService = {
  /**
   * Mengambil data quiz (GET)
   */
  getQuizData: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

  /**
   * Mengirim jawaban quiz (POST)
   */
  submitQuizResult: async (token: string, payload: QuizSubmissionPayload) => {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response;
  },
};