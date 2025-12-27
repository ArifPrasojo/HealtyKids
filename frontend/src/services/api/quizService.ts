// src/services/api/quizService.ts
import axios from 'axios';

// --- PERUBAHAN KERAS (HARDCODE) ---
// Kita hapus "import.meta.env..." supaya kodingan dipaksa ke URL yang benar.
// Berdasarkan Postman Anda, path yang benar harus ada '/admin'
const API_BASE_URL = 'http://localhost:3000/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export interface QuizItem {
  id: number;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface QuizFormData {
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const quizService = {
  // Get All Quizzes
  getAllQuizzes: async (): Promise<ApiResponse<QuizItem[]>> => {
    try {
      // Axios menggabung: 'http://localhost:3000/admin' + '/quiz'
      // JADI: http://localhost:3000/admin/quiz
      const response = await api.get('/quiz'); 
      return response.data;
    } catch (error: any) {
      console.error("FULL ERROR:", error);
      throw new Error(error.response?.data?.message || 'Gagal memuat data quiz');
    }
  },

  // Create Quiz
  createQuiz: async (data: QuizFormData): Promise<ApiResponse<QuizItem>> => {
    try {
      const response = await api.post('/quiz', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal membuat quiz');
    }
  },

  // Update Quiz
  updateQuiz: async (id: number, data: QuizFormData): Promise<ApiResponse<QuizItem>> => {
    try {
      const response = await api.put(`/quiz/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengupdate quiz');
    }
  },

  // Delete Quiz
  deleteQuiz: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete(`/quiz/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal menghapus quiz');
    }
  }
};