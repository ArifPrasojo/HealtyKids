// src/services/api/quizService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

export interface QuizItem {
  id: number;
  duration: number;
  title: string;
  description: string;
  isActive: boolean;
  isDelete?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface QuizFormData {
  duration: number;
  title: string;
  description: string;
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Service untuk mengelola API calls terkait quiz management
 */
class QuizService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}`;
  }

  /**
   * Mengambil semua data quizzes
   */
  async getAllQuizzes(): Promise<ApiResponse<QuizItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz`);
      
      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        throw new Error(`Gagal mengambil data quiz: ${response.status}`);
      }
      
      const text = await response.text();
      
      // Check if response is empty
      if (!text) {
        return { success: true, data: [] };
      }
      
      // Try to parse JSON
      try {
        const result = JSON.parse(text);
        // Filter out deleted quizzes
        if (result.success && Array.isArray(result.data)) {
          result.data = result.data.filter((quiz: QuizItem) => !quiz.isDelete);
        }
        return result;
      } catch (parseError) {
        console.error('JSON Parse Error:', text);
        throw new Error('Response bukan format JSON yang valid');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil data quiz berdasarkan ID
   */
  async getQuizById(quizId: number): Promise<ApiResponse<QuizItem>> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/${quizId}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data quiz');
      }
      
      const text = await response.text();
      
      if (!text) {
        throw new Error('Response kosong dari server');
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', text);
        throw new Error('Response bukan format JSON yang valid');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menambah quiz baru
   */
  async createQuiz(quizData: QuizFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData)
      });

      const text = await response.text();
      
      if (!text) {
        throw new Error('Response kosong dari server');
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', text);
        throw new Error('Response bukan format JSON yang valid');
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengupdate data quiz
   */
  async updateQuiz(quizId: number, quizData: QuizFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData)
      });

      const text = await response.text();
      
      if (!text) {
        throw new Error('Response kosong dari server');
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', text);
        throw new Error('Response bukan format JSON yang valid');
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus quiz
   */
  async deleteQuiz(quizId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const text = await response.text();
      
      if (!text) {
        throw new Error('Response kosong dari server');
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', text);
        throw new Error('Response bukan format JSON yang valid');
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const quizService = new QuizService();