// src/services/userService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

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
   * Mengambil semua data users
   */
  async getAllUsers(): Promise<ApiResponse<UserItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/users`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data pengguna');
      }
      
      return await response.json();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
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
  async updateUser(userId: number, userData: UserFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
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
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
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
export const userService = new UserService();