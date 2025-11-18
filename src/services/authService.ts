import { apiClient } from "./api";

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
  token?: string; // por si luego decides devolver token también en Google
}

export interface AuthResponse {
  message: string;
  client: Client;
  token?: string;
}

export interface BasicMessageResponse {
  message: string;
}

export const authService = {
  // ==========================
  // Autenticación con Google
  // ==========================
  loginWithGoogle: async (googleToken: string): Promise<GoogleAuthResponse> => {
    const response = await apiClient.post("/auth/google", {
      token: googleToken,
    });
    const { client, token } = response.data;

    // Guardar token si lo envías desde el backend
    if (token) {
      localStorage.setItem("token", token);
    }

    // Guardar datos del cliente en localStorage
    localStorage.setItem("client", JSON.stringify(client));
    localStorage.setItem("isAuthenticated", "true");

    return response.data;
  },

  // ==========================
  // Login tradicional
  // ==========================
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials);
    const { client, token } = response.data;

    // Guardar token en localStorage
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("client", JSON.stringify(client));
    localStorage.setItem("isAuthenticated", "true");

    return response.data;
  },

  // ==========================
  // Registro de usuario
  // ==========================
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", userData);
    const { client, token } = response.data;

    if (token) localStorage.setItem("token", token);
    localStorage.setItem("client", JSON.stringify(client));
    localStorage.setItem("isAuthenticated", "true");

    return response.data;
  },

  // ==========================
  // Forgot / Reset Password
  // ==========================
  // Enviar correo de recuperación
  requestPasswordReset: async (
    email: string
  ): Promise<BasicMessageResponse> => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data; // { message: string }
  },

  // Cambiar contraseña usando token del correo
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<BasicMessageResponse> => {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data; // { message: string }
  },

  // ==========================
  // Logout
  // ==========================
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("client");
    localStorage.removeItem("isAuthenticated");
  },

  // ==========================
  // Utilidades
  // ==========================
  getCurrentUser: (): Client | null => {
    const clientStr = localStorage.getItem("client");
    return clientStr ? JSON.parse(clientStr) : null;
  },

  isAuthenticated: (): boolean => {
    return (
      localStorage.getItem("isAuthenticated") === "true" ||
      !!localStorage.getItem("token")
    );
  },

  verifyToken: async (): Promise<Client> => {
    const response = await apiClient.get("/auth/verify");
    return response.data;
  },
};
