// src/services/api/profileService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL;

export interface ProfileData {
  name: string;
  username: string;
}

export const profileService = {
  getProfile: async (role: string): Promise<ProfileData | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      // Logika penentuan endpoint dipindah ke sini agar Component bersih
      const endpoint = role.toLowerCase().includes('admin') 
        ? `${API_BASE_URL}/admin/profile` 
        : `${API_BASE_URL}/profile`;

      console.log(`🔍 [Service] Fetching profile sebagai ${role}`);

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
        console.warn("Service: Gagal mengambil data profile", response.status);
        return null;
      }
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
};