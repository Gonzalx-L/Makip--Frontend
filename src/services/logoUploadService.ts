// Servicio para subir logos a Google Cloud Storage
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export interface LogoUploadResponse {
  message: string;
  publicUrl: string;
}

/**
 * Sube un logo en formato PNG a Google Cloud Storage
 * @param file - Archivo PNG a subir
 * @returns Objeto con la URL pública del logo
 */
export const uploadLogo = async (file: File): Promise<LogoUploadResponse> => {
  try {
    // Validar que el archivo sea PNG
    if (!file.type.includes('png') && !file.name.toLowerCase().endsWith('.png')) {
      throw new Error('Solo se permiten archivos PNG');
    }

    // Validar tamaño máximo (5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > MAX_SIZE) {
      throw new Error('El archivo debe ser menor a 5MB');
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('file', file);

    // Enviar al backend
    const response = await axios.post<LogoUploadResponse>(
      `${API_BASE_URL}/upload/logos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error('Error al subir logo:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error al subir el logo';
    throw new Error(errorMessage);
  }
};

/**
 * Valida que un archivo sea PNG y tenga el tamaño correcto
 * @param file - Archivo a validar
 * @returns Objeto con resultado de validación
 */
export const validateLogoFile = (file: File): { valid: boolean; error?: string } => {
  // Validar formato PNG
  if (!file.type.includes('png') && !file.name.toLowerCase().endsWith('.png')) {
    return { valid: false, error: 'Solo se permiten archivos PNG' };
  }

  // Validar tamaño máximo (5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'El archivo debe ser menor a 5MB' };
  }

  return { valid: true };
};
