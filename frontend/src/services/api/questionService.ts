// src/services/api/questionService.ts

export const API_BASE_URL = import.meta.env?.VITE_API_URL;

export interface Question {
  id: number;
  question: string;
  explanation: string;
  photo: string | null;
}

export interface QuestionPayload {
  question: string;
  explanation: string;
  photo?: string; // Base64 string
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class QuestionService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/admin/quiz/questions`;
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
   * Ambil semua pertanyaan
   */
  async getQuestions(): Promise<ApiResponse<Question[]>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized). Silakan login kembali.');
        }
        throw new Error(data.message || 'Gagal mengambil data pertanyaan');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tambah pertanyaan baru
   */
  async createQuestion(payload: QuestionPayload): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || 'Gagal membuat pertanyaan');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update pertanyaan (dengan ID)
   */
  async updateQuestion(id: number, payload: QuestionPayload): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || 'Gagal mengupdate pertanyaan');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Hapus pertanyaan
   */
  async deleteQuestion(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        // Body dihapus sesuai instruksi (GET/DELETE biasanya tidak butuh body)
      });

      // Handle jika server mengembalikan 204 No Content
      if (response.status === 204) {
        return { success: true, message: "Pertanyaan berhasil dihapus" };
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || 'Gagal menghapus pertanyaan');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const questionService = new QuestionService();