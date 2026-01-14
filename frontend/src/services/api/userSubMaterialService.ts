// src/services/api/userSubMaterialService.ts

export const API_BASE_URL = import.meta.env?.VITE_API_URL;
export interface SubMaterialAPI {
  id: number;
  title: string;
  contentCategory: string;
  contentUrl: string;
  content: string;
  isDone: boolean;
}

// Helper untuk mendapatkan token
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access_token');
};

/**
 * Mengambil daftar sub-materi berdasarkan ID materi
 */
export const getSubMaterials = async (id: string) => {
  const token = getAuthToken();
  if (!token) throw new Error("NO_TOKEN");

  const response = await fetch(`${API_BASE_URL}/material/${id}/sub-material`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error('Gagal mengambil data materi.');
  }

  const result = await response.json();
  
  // Normalisasi respon data
  if (result.success && Array.isArray(result.data)) {
    return result.data as SubMaterialAPI[];
  } else {
    return (result.data?.materials || []) as SubMaterialAPI[];
  }
};

/**
 * Menandai sub-materi sebagai selesai (Progress)
 */
export const updateSubMaterialProgress = async (materialId: string, subMaterialId: number) => {
  const token = getAuthToken();
  if (!token) return false;

  const response = await fetch(`${API_BASE_URL}/material/${materialId}/sub-material/${subMaterialId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.ok;
};