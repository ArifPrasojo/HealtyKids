// src/services/api/loginService.ts

const API_BASE_URL = import.meta.env?.VITE_API_URL;

// Definisi Tipe Data agar Type Safe
export interface LoginPayload {
  username: string;
  password: string;
}

export interface UserData {
  role: string;
  [key: string]: any; // menampung property lain user
}

export interface LoginResponse {
  access_token: string;
  user: UserData;
  message?: string;
}

export const loginService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.access_token) {
        throw new Error(data.message || 'Login gagal. Periksa username dan password.');
      }

      return data;
    } catch (error: any) {
      throw error; // Lempar error agar bisa ditangkap di UI
    }
  }
};