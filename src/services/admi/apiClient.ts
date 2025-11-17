// src/services/apiClient.ts
import axios from "axios";

// 1. Define la URL base de tu backend (¡ajusta si es necesario!)
const API_BASE_URL = "http://localhost:4000/api/v1";

// 2. Crea la instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. --- ¡LA MAGIA! ---
// Usamos un "interceptor" para añadir el token de Admin a CADA petición
apiClient.interceptors.request.use(
  (config) => {
    // Busca el token de admin guardado en localStorage
    const token = localStorage.getItem("adminToken");

    // Si el token existe Y la petición es para el admin...
    // (Ajusta la lógica si el mismo apiClient se usa para clientes)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // NOTA: Podrías hacer lo mismo para el token del CLIENTE ('clientToken')
    // si esta instancia de axios la usan ambos.

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (Opcional pero recomendado: Interceptor de respuestas para 401/403)
// Aquí podrías, por ejemplo, llamar a 'logout()' si el token expira.
apiClient.interceptors.response.use(
  (response) => response, // Pasa la respuesta si todo está OK
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 = No autorizado (token inválido o expirado)
      console.error("¡Token no autorizado o expirado!", error.response.data);

      // Aquí podrías forzar el logout del admin
      // localStorage.removeItem('adminToken');
      // localStorage.removeItem('adminUser');
      // window.location.href = '/login-admin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
