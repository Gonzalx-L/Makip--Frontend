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
  email: string;
  name: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  client: Client;
  token?: string;
}

export const authService = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    const { client, token } = response.data;
    
    // Guardar token en localStorage
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('client', JSON.stringify(client));
    
    return response.data;
  },

  // Registrar nuevo usuario
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    const { client, token } = response.data;
    
    // Guardar token en localStorage
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('client', JSON.stringify(client));
    
    return response.data;
  },

  // Cerrar sesión
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('client');
  },

  // Obtener cliente actual
  getCurrentUser: (): Client | null => {
    const clientStr = localStorage.getItem('client');
    return clientStr ? JSON.parse(clientStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Verificar token (si tienes endpoint para esto)
  verifyToken: async (): Promise<Client> => {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  }
};