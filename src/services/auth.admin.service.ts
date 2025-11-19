import axios from "axios";

// 1. Apuntamos a la API de tu backend (que corre en el puerto 4000)
const API_URL = "http://localhost:4000/api/v1/admin";

/**
 * Llama al endpoint /login de tu backend
 */
export const loginAdmin = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    // 2. Si el login es exitoso, guardamos el "token"
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
    }
    return response.data.token;
  } catch (error: unknown) {
    // <-- El 'unknown' es correcto
    let errorMessage = "Error al iniciar sesión";

    // Esta verificación de tipo soluciona los otros errores
    if (axios.isAxiosError(error)) {
      // Si es un error de Axios (ej: 401, 404, 500)
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      // Si es un error genérico
      errorMessage = error.message;
    }

    console.error("Error en el login:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Cierra la sesión del admin (borra el token)
 */
export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};

/**
 * Revisa si hay un token guardado
 */
export const getAdminToken = (): string | null => {
  return localStorage.getItem("adminToken");
};
