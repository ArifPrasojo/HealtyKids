// src/services/api/quizService.ts

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/admin/quiz`;

export interface QuizData {
  id: number;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const quizService = {
  // Mengambil data quiz
  getQuiz: async (): Promise<ApiResponse<QuizData>> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch quiz');
    return await response.json();
  },

  // Mengupdate data quiz
  updateQuiz: async (quiz: QuizData): Promise<ApiResponse<any>> => {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: quiz.title,
        description: quiz.description,
        duration: Number(quiz.duration),
        isActive: quiz.isActive
      }),
    });
    if (!response.ok) throw new Error('Failed to update quiz');
    return await response.json();
  }
};