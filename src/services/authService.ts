import { apiClient } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  dni?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface Client {
  client_id: number;
  google_uid?: string | null;
  email: string;
  name: string;
  phone?: string;
  dni?: string;
  address?: string;
  password_hash?: string;
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
  isNewUser?: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const authService = {
  // Autenticación con Google
  loginWithGoogle: async (googleToken: string): Promise<GoogleAuthResponse> => {
    const response = await apiClient.post('/auth/google', { token: googleToken });
    // Huber usaba 'token' aquí, lo cambiamos a 'jwtToken' para evitar conflicto de nombres
    // y lo guardamos como 'authToken' para mantener consistencia con tu app.
    const { client, token: jwtToken, isNewUser } = response.data;
    
    if (jwtToken) localStorage.setItem('authToken', jwtToken); // CORREGIDO: Usamos 'authToken'
    localStorage.setItem('client', JSON.stringify(client));
    localStorage.setItem('isAuthenticated', 'true');
    
    return response.data;
  },

  // Iniciar sesión tradicional
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    const { client, token, isNewUser } = response.data;
    
    // RESUELTO EL CONFLICTO: Usamos 'authToken'
    if (token) localStorage.setItem('authToken', token);
    
    localStorage.setItem('client', JSON.stringify(client));
    localStorage.setItem('isAuthenticated', 'true');
    
    return response.data;
  },

  // Registrar nuevo usuario
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    const { client, token, isNewUser } = response.data;
    
    // RESUELTO EL CONFLICTO: Usamos 'authToken'
    if (token) localStorage.setItem('authToken', token);

    localStorage.setItem('client', JSON.stringify(client));
    localStorage.setItem('isAuthenticated', 'true');
    
    return response.data;
  },

  // Cerrar sesión
  logout: (): void => {
    // Aquí es crucial que coincida. Como borras 'authToken', el login debe guardar 'authToken'.
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

  // Solicitar recuperación de contraseña
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Resetear contraseña con token
  resetPassword: async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // Verificar token (si tienes endpoint para esto)
  verifyToken: async (): Promise<Client> => {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  }
};