// src/services/api/materialService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

export interface MaterialAPI {
  id: number;
  title: string;
  description: string;
  totalSubMaterial: string | number;
  totalSubMaterialRead: string | number;
}

export const materialService = {
  /**
   * Mengambil semua data materi dari backend
   */
  getAllMaterials: async (): Promise<MaterialAPI[]> => {
    // Ambil token dari storage
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('access_token');

    if (!token) {
      throw new Error("UNAUTHORIZED_NO_TOKEN");
    }

    const response = await fetch(`${API_BASE_URL}/material`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Handling 401 Unauthorized
    if (response.status === 401) {
      localStorage.clear();
      throw new Error("UNAUTHORIZED_EXPIRED");
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    // Validasi Struktur Data
    let materialsArray: MaterialAPI[] = [];
    if (Array.isArray(result.data)) {
      materialsArray = result.data;
    } else if (result.data && Array.isArray(result.data.materials)) {
      materialsArray = result.data.materials;
    } else if (Array.isArray(result)) {
      materialsArray = result;
    } else {
      throw new Error("INVALID_DATA_FORMAT");
    }

    return materialsArray;
  }
};