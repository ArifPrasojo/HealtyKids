// src/services/api/subMaterialService.ts

// Ganti http://localhost:3000 dengan URL backend Anda yang sebenarnya jika berbeda
export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

export interface SubMaterialItem {
  id: number;
  materialId: number;
  title: string;
  contentCategory: 'video' | 'photo';
  contentUrl: string; // Bisa berupa URL Youtube atau Path gambar (/uploads/...)
  content: string;
  isDelete?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface SubMaterialFormData {
  title: string;
  contentCategory: 'video' | 'photo';
  contentUrl: string; // Kirim string Base64 di sini saat upload foto
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

  // Helper untuk Header (tambahkan token jika perlu)
  private getHeaders() {
    const token = localStorage.getItem('token'); 
    return {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` 
    };
  }

  async getAllSubMaterials(materialId: number): Promise<ApiResponse<SubMaterialItem[]>> {
    const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material`, {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Gagal mengambil data');
    return await response.json();
  }

  async createSubMaterial(materialId: number, data: SubMaterialFormData): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    const resJson = await response.json();
    if (!response.ok) throw new Error(resJson.message || 'Gagal menyimpan');
    return resJson;
  }

  async updateSubMaterial(materialId: number, subId: number, data: SubMaterialFormData): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material/${subId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    const resJson = await response.json();
    if (!response.ok) throw new Error(resJson.message || 'Gagal update');
    return resJson;
  }

  async deleteSubMaterial(materialId: number, subId: number): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/materials/${materialId}/sub-material/${subId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    const resJson = await response.json();
    if (!response.ok) throw new Error(resJson.message || 'Gagal hapus');
    return resJson;
  }
}

export const subMaterialService = new SubMaterialService();