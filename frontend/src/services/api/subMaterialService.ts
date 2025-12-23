// src/services/api/subMaterialService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

export interface SubMaterialItem {
  id: number;
  materialId: number;
  title: string;
  videoUrl: string;
  content: string;
  isDelete?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface SubMaterialFormData {
  title: string;
  videoUrl: string;
  content: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Service untuk mengelola API calls terkait sub material management
 */
class SubMaterialService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/admin`;
  }

  /**
   * Mengambil semua data sub materials berdasarkan material ID
   */
  async getAllSubMaterials(materialId: number): Promise<ApiResponse<SubMaterialItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data sub materi');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil data sub material berdasarkan ID
   */
  async getSubMaterialById(materialId: number, subMaterialId: number): Promise<ApiResponse<SubMaterialItem>> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material/${subMaterialId}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data sub materi');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menambah sub material baru
   */
  async createSubMaterial(materialId: number, subMaterialData: SubMaterialFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subMaterialData)
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
   * Mengupdate data sub material
   */
  async updateSubMaterial(materialId: number, subMaterialId: number, subMaterialData: SubMaterialFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material/${subMaterialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subMaterialData)
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
   * Menghapus sub material
   */
  async deleteSubMaterial(materialId: number, subMaterialId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material/${subMaterialId}`, {
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
export const subMaterialService = new SubMaterialService();