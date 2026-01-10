// src/services/api/quizService.ts

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface QuizData {
  id: number;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class QuizService {
  private apiUrl: string;

  constructor() {
    // Endpoint langsung mengarah ke /admin/quiz
    this.apiUrl = `${API_BASE_URL}/admin/quiz`;
  }

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
   * Mengambil data quiz (Single Quiz Configuration)
   */
  async getQuiz(): Promise<ApiResponse<QuizData>> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: this.getHeaders(), // Inject Token
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized). Silakan login kembali.');
        }
        throw new Error(data.message || 'Gagal mengambil data quiz');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengupdate data quiz
   */
  async updateQuiz(quiz: QuizData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: this.getHeaders(), // Inject Token
        body: JSON.stringify({
          title: quiz.title,
          description: quiz.description,
          duration: Number(quiz.duration),
          isActive: quiz.isActive
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || 'Gagal mengupdate quiz');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance agar mudah dipanggil di halaman
export const quizService = new QuizService();