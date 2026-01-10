// src/services/api/profileService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL;

export interface ProfileData {
  name: string;
  username: string;
}

export const profileService = {
  // --- EXISTING GET FUNCTION ---
  getProfile: async (role: string): Promise<ProfileData | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

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
  },

  // --- NEW UPDATE FUNCTION (Berdasarkan Postman) ---
  updateProfile: async (role: string, profileData: ProfileData): Promise<ProfileData | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      // Logika endpoint sama dengan getProfile (Admin vs User)
      const endpoint = role.toLowerCase().includes('admin') 
        ? `${API_BASE_URL}/admin/profile` 
        : `${API_BASE_URL}/profile`;

      console.log(`📝 [Service] Updating profile sebagai ${role}`, profileData);

      const response = await fetch(endpoint, {
        method: 'PUT', // Sesuai gambar Postman
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json' // Wajib ada saat mengirim Body JSON
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      // Cek response sesuai struktur di Postman: { success: true, message: "...", data: {...} }
      if (response.ok && data.success && data.data) {
        return {
          name: data.data.name,
          username: data.data.username
        };
      } else {
        console.warn("Service: Gagal update profile", data.message || response.status);
        throw new Error(data.message || "Gagal mengupdate profil");
      }
    } catch (error) {
      console.error("Service Error (Update):", error);
      throw error;
    }
  }
};