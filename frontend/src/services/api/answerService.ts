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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class AnswerService {
  /**
   * Helper untuk mendapatkan headers dengan Token Authentication
   */
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  /**
   * Mengambil semua jawaban berdasarkan ID Pertanyaan
   */
  async getAnswers(questionId: string | number): Promise<ApiResponse<Answer[]>> {
    try {
      const url = `${API_BASE_URL}/admin/quiz/questions/${questionId}/answer`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized). Silakan login kembali.');
        }
        throw new Error(data.message || 'Gagal mengambil jawaban');
      }

      // --- PERBAIKAN DI SERVICE ---
      // Memastikan data diurutkan berdasarkan ID sebelum dikembalikan ke component
      if (data.data && Array.isArray(data.data)) {
        data.data.sort((a: Answer, b: Answer) => a.id - b.id);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui semua jawaban sekaligus (Bulk Update)
   */
  async updateAnswers(questionId: string | number, answers: Answer[]): Promise<ApiResponse<any>> {
    try {
      const url = `${API_BASE_URL}/admin/quiz/questions/${questionId}/answer`;

      // Transformasi data sesuai format payload backend
      const payload = {
        answer: answers.map(ans => ({
          answerId: ans.id,
          answer: ans.answer,
          isCorrect: ans.isCorrect
        }))
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || 'Gagal memperbarui jawaban');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const answerService = new AnswerService();