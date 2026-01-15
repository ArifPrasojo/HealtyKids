// src/services/api/subMaterialService.ts

export const API_BASE_URL = import.meta.env?.VITE_API_URL;

export interface SubMaterialItem {
  id: number;
  materialId: number;
  title: string;
  contentCategory: 'video' | 'photo';
  contentUrl: string;
  content: string;
  isDelete?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface SubMaterialFormData {
  title: string;
  contentCategory: 'video' | 'photo';
  contentUrl: string; 
  content: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

class SubMaterialService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/admin`;
  }

  private getHeaders() {
    const token = localStorage.getItem('token'); 
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '', 
    };
  }

  async getAllSubMaterials(materialId: number): Promise<ApiResponse<SubMaterialItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) throw new Error('Sesi berakhir (Unauthorized). Silakan login kembali.');
        throw new Error(data.message || 'Gagal mengambil data sub-materi');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createSubMaterial(materialId: number, data: SubMaterialFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      const resJson = await response.json();
      if (!response.ok) {
        if (response.status === 401) throw new Error('Sesi berakhir (Unauthorized).');
        throw new Error(resJson.message || 'Gagal menyimpan sub-materi');
      }
      return resJson;
    } catch (error) {
      throw error;
    }
  }

  // --- PERBAIKAN DI SINI: Menggunakan Partial<SubMaterialFormData> ---
  async updateSubMaterial(materialId: number, subId: number, data: Partial<SubMaterialFormData>): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material/${subId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      const resJson = await response.json();
      if (!response.ok) {
        if (response.status === 401) throw new Error('Sesi berakhir (Unauthorized).');
        throw new Error(resJson.message || 'Gagal update sub-materi');
      }
      return resJson;
    } catch (error) {
      throw error;
    }
  }

  async deleteSubMaterial(materialId: number, subId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material/${subId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      if (response.status === 204) return { success: true, message: "Berhasil dihapus" };
      
      const resJson = await response.json();
      if (!response.ok) {
        if (response.status === 401) throw new Error('Sesi berakhir (Unauthorized).');
        throw new Error(resJson.message || 'Gagal hapus sub-materi');
      }
      return resJson;
    } catch (error) {
      throw error;
    }
  }
}

export const subMaterialService = new SubMaterialService();