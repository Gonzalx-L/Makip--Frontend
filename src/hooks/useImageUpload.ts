import { useState } from 'react';
import apiClient from '../services/admi/apiClient';

interface UseImageUploadReturn {
  uploadImage: (file: File, folder?: string) => Promise<string>;
  isUploading: boolean;
  uploadError: string | null;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File, folder: string = 'personalization'): Promise<string> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Formato de archivo no válido. Solo se permiten JPG, PNG y GIF.');
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 5MB.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await apiClient.post<{ imageUrl: string }>('/upload/personalization-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.imageUrl;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al subir la imagen';
      setUploadError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    uploadError,
  };
};