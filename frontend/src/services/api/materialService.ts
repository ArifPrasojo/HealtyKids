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

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Service untuk mengelola API calls terkait material management
 */
class MaterialService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/admin`;
  }

  /**
   * Mengambil semua data materials
   */
  async getAllMaterials(): Promise<ApiResponse<MaterialItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/materials`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data materi');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil data material berdasarkan ID
   */
  async getMaterialById(materialId: number): Promise<ApiResponse<MaterialItem>> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data materi');
      }
      
      return await response.json();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData)
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
   * Mengupdate data material
   */
  async updateMaterial(materialId: number, materialData: MaterialFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData)
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
   * Menghapus material
   */
  async deleteMaterial(materialId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}`, {
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
export const materialService = new MaterialService();