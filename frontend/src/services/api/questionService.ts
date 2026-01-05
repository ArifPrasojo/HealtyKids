// src/services/api/questionService.ts

export const API_BASE_URL = import.meta.env?.VITE_API_URL;
const BASE_URL = `${API_BASE_URL}/admin/quiz/questions`;

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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const questionService = {
  // Ambil semua pertanyaan
  getQuestions: async (): Promise<ApiResponse<Question[]>> => {
    const res = await fetch(BASE_URL);
    return await res.json();
  },

  // Tambah pertanyaan baru
  createQuestion: async (payload: QuestionPayload): Promise<ApiResponse<any>> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  // Update pertanyaan (dengan ID)
  updateQuestion: async (id: number, payload: QuestionPayload): Promise<ApiResponse<any>> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  deleteQuestion: async (id: number): Promise<ApiResponse<any>> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      // Tidak memerlukan body sesuai tampilan Postman "This request does not have a body"
    });
    return await res.json();
  }

};