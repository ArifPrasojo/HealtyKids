// src/services/userService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL;

export interface UserItem {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
}

export interface UserFormData {
  name: string;
  username: string;
  password: string;
  role: string;
}

export interface UpdateUserDTO {
  name: string;
  username: string;
  role: string;
  password?: string; // Tanda tanya (?) membuatnya opsional
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Service untuk mengelola API calls terkait user management
 */
class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/admin`;
  }

  /**
   * Helper private untuk mendapatkan headers termasuk Token Authorization
   * Ini memastikan setiap request membawa token "kunci" akses
   */
  private getHeaders() {
    const token = localStorage.getItem('token'); // Mengambil token yang disimpan di Login.tsx
    
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  /**
   * Mengambil semua data users
   */
  async getAllUsers(): Promise<ApiResponse<UserItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'GET',
        headers: this.getHeaders() // Menggunakan header dengan token
      });
      
      const data = await response.json();

      if (!response.ok) {
        // Handle jika token expired atau invalid (401)
        if (response.status === 401) {
          throw new Error('Sesi berakhir. Silakan login kembali.');
        }
        throw new Error(data.message || 'Gagal mengambil data pengguna');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menambah user baru
   */
  async createUser(userData: UserFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: this.getHeaders(), // Menggunakan header dengan token
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized: Anda tidak memiliki akses untuk menambah user.');
        }
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengupdate data user
   */
  async updateUser(userId: number, userData: UpdateUserDTO): Promise<ApiResponse> {
    try {
      const payload: any = {
        name: userData.name,
        username: userData.username,
        role: userData.role 
      };

      if (userData.password && userData.password.trim() !== "") {
        payload.password = userData.password;
      }

      console.log("Payload Update yang dikirim:", payload);

      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Gagal update user: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus user
   */
  async deleteUser(userId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: this.getHeaders() // Menggunakan header dengan token
      });

      // Beberapa API delete kadang tidak mengembalikan body JSON jika sukses (204 No Content)
      // Kita cek dulu content-type atau statusnya
      let data = {};
      if (response.status !== 204) {
          data = await response.json();
      }
      
      if (!response.ok) {
        throw new Error((data as any).message || `HTTP Error: ${response.status}`);
      }
      
      return data as ApiResponse;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();