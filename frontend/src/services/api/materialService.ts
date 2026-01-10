// src/services/materialService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL;

export interface MaterialItem {
  id: number;
  title: string;
  description: string;
  isDelete?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface MaterialFormData {
  title: string;
  description: string;
}

// Tambahkan properti id opsional untuk jaga-jaga jika API mengembalikan id di root object
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  id?: number; 
}

/**
 * Service untuk mengelola API calls terkait material management
 * Updated: Support Authentication Token
 */
class MaterialService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/admin`;
  }

  /**
   * Helper untuk mendapatkan headers dengan Token Authentication
   */
  private getHeaders() {
    const token = localStorage.getItem('token'); // Pastikan key 'token' sesuai dengan saat Login
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  /**
   * Mengambil semua data materials
   */
  async getAllMaterials(): Promise<ApiResponse<MaterialItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/materials`, {
        method: 'GET',
        headers: this.getHeaders(), // Inject Token
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized). Silakan login kembali.');
        }
        throw new Error(data.message || 'Gagal mengambil data materi');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil data material berdasarkan ID
   */
  async getMaterialById(materialId: number): Promise<ApiResponse<MaterialItem>> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}`, {
        method: 'GET',
        headers: this.getHeaders(), // Inject Token
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || 'Gagal mengambil data materi');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menambah material baru
   */
  async createMaterial(materialData: MaterialFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials`, {
        method: 'POST',
        headers: this.getHeaders(), // Inject Token
        body: JSON.stringify(materialData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengupdate data material
   */
  async updateMaterial(materialId: number, materialData: MaterialFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}`, {
        method: 'PUT',
        headers: this.getHeaders(), // Inject Token
        body: JSON.stringify(materialData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus material
   */
  async deleteMaterial(materialId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}`, {
        method: 'DELETE',
        headers: this.getHeaders(), // Inject Token
      });

      // Handle jika response delete kosong (204 No Content)
      if (response.status === 204) {
          return { success: true, message: "Berhasil dihapus" };
      }

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sesi berakhir (Unauthorized).');
        }
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const materialService = new MaterialService();