import { apiClient } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Client {
  client_id: number;
  google_uid: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleAuthResponse {
  message: string;
  client: Client;
  isNewUser: boolean;
}

export interface AuthResponse {
  message: string;
  client: Client;
  token?: string;
}

export const authService = {
  // Autenticación con Google
  loginWithGoogle: async (googleToken: string): Promise<GoogleAuthResponse> => {
    const response = await apiClient.post('/auth/google', { token: googleToken });
    const { client, isNewUser } = response.data;
    
    // Guardar datos del cliente en localStorage
    localStorage.setItem('client', JSON.stringify(client));
    localStorage.setItem('isAuthenticated', 'true');
    
    return response.data;
  },

  // Iniciar sesión (endpoint tradicional - si lo tienes)
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    const { client, token } = response.data;
    
    // Guardar token en localStorage (usar 'authToken' para consistencia)
    if (token) localStorage.setItem('authToken', token);
    localStorage.setItem('client', JSON.stringify(client));
    localStorage.setItem('isAuthenticated', 'true');
    
    return response.data;
  },

  // Registrar nuevo usuario
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    const { client, token } = response.data;
    
    // Guardar token en localStorage (usar 'authToken' para consistencia)
    if (token) localStorage.setItem('authToken', token);
    localStorage.setItem('client', JSON.stringify(client));
    localStorage.setItem('isAuthenticated', 'true');
    
    return response.data;
  },

  // Cerrar sesión
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('client');
    localStorage.removeItem('isAuthenticated');
  },

  // Obtener cliente actual
  getCurrentUser: (): Client | null => {
    const clientStr = localStorage.getItem('client');
    return clientStr ? JSON.parse(clientStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true' || !!localStorage.getItem('authToken');
  },

  // Verificar token (si tienes endpoint para esto)
  verifyToken: async (): Promise<Client> => {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  }
};