// src/services/api/questionService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

export interface AnswerItem {
  answerId: number;
  answer: string;
  isCorrect: boolean;
}

export interface QuestionItem {
  id: number;
  quizId: number;
  question: string;
  explanation: string;
  photo: string;
  isDelete?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  answers?: AnswerItem[];
}

export interface QuestionFormData {
  question: string;
  explanation: string;
  photo: string;
}

export interface AnswerFormData {
  answerId: number;
  answer: string;
  isCorrect: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Service untuk mengelola API calls terkait question management
 */
class QuestionService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/admin`;
  }

  /**
   * Mengambil semua data questions
   */
  async getAllQuestions(): Promise<ApiResponse<QuestionItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/questions`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data pertanyaan');
      }
      
      const text = await response.text();
      
      if (!text) {
        return { success: true, data: [] };
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
   * Mengambil data question berdasarkan ID
   */
  async getQuestionById(questionId: number): Promise<ApiResponse<QuestionItem>> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/questions/${questionId}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data pertanyaan');
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
   * Mengambil answers berdasarkan question ID
   */
  async getAnswersByQuestionId(questionId: number): Promise<ApiResponse<AnswerItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/questions/${questionId}/answer`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data jawaban');
      }
      
      const text = await response.text();
      
      if (!text) {
        return { success: true, data: [] };
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
   * Menambah question baru
   */
  async createQuestion(questionData: QuestionFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData)
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
   * Mengupdate data question
   */
  async updateQuestion(questionId: number, questionData: QuestionFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData)
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
   * Update answers untuk question
   */
  async updateAnswers(questionId: number, answers: AnswerFormData[]): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/questions/${questionId}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answers })
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
   * Menghapus question
   */
  async deleteQuestion(questionId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quiz/questions/${questionId}`, {
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
export const questionService = new QuestionService();