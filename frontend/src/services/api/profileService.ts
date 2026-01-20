const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface ProfileData {
  name: string;
  username: string;
  password?: string; 
}

export interface QuizResultData {
  quizName: string;
  quizDescription: string;
  score: number;
  finishedAt: string;
}

export interface AdminQuizResultData {
  studentName: string;
  quizName: string;
  score: number;
  finishedAt: string;
}

export const profileService = {

  getProfile: async (role: string): Promise<ProfileData | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const endpoint = role.toLowerCase().includes('admin') 
        ? `${API_BASE_URL}/admin/profile` 
        : `${API_BASE_URL}/profile`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        return {
          name: data.data.name,
          username: data.data.username
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  },


  updateProfile: async (role: string, profileData: ProfileData): Promise<ProfileData | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const endpoint = role.toLowerCase().includes('admin') 
        ? `${API_BASE_URL}/admin/profile` 
        : `${API_BASE_URL}/profile`;

      const payload: any = {
        name: profileData.name,
        username: profileData.username
      };

      if (profileData.password && profileData.password.trim() !== '') {
        payload.password = profileData.password;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        return {
          name: data.data.name,
          username: data.data.username
        };
      } else {
        throw new Error(data.message || "Gagal mengupdate profil");
      }
    } catch (error) {
      console.error("Service Error (Update):", error);
      throw error;
    }
  },


  getQuizHistory: async (role: string): Promise<(QuizResultData | AdminQuizResultData)[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];

      const isAdmin = role.toLowerCase().includes('admin');

      // Tentukan endpoint berdasarkan Role
      const endpoint = isAdmin 
        ? `${API_BASE_URL}/admin/quiz/result` 
        : `${API_BASE_URL}/quiz/result`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.data) {
        return data.data;
      } else {
        console.warn("Gagal mengambil history quiz");
        return [];
      }
    } catch (error) {
      console.error("Service Error (Quiz History):", error);
      return [];
    }
  }
};