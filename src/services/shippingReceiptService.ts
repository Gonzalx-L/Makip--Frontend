// Servicio para subir boletas de envío
import apiClient from './admi/apiClient';

export interface ShippingData {
  trackingNumber: string;
  company: string;
  destination: string;
  shippingDate: string;
}

export interface ShippingReceiptResponse {
  message: string;
  shippingData: ShippingData;
  shippingReceiptUrl: string;
}

/**
 * Sube una boleta de envío para una orden COMPLETADA
 * @param orderId - ID de la orden
 * @param file - Archivo de imagen de la boleta (JPG, PNG, JPEG)
 * @returns Datos extraídos por OCR y URL de la boleta
 */
export const uploadShippingReceipt = async (
  orderId: number,
  file: File
): Promise<ShippingReceiptResponse> => {
  try {
    // Validar que el archivo sea una imagen
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Solo se permiten archivos JPG, PNG o JPEG');
    }

    // Validar tamaño máximo (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('El archivo debe ser menor a 10MB');
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('receipt', file);

    // Enviar al backend
    const response = await apiClient.post<ShippingReceiptResponse>(
      `/admin/orders/${orderId}/shipping-receipt`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error('Error al subir boleta de envío:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error al subir la boleta de envío';
    throw new Error(errorMessage);
  }
};

/**
 * Reenvía el email con la boleta de envío al cliente
 * @param orderId - ID de la orden
 */
export const resendShippingEmail = async (orderId: number): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>(
      `/admin/orders/${orderId}/resend-shipping-email`
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Error al reenviar email:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error al reenviar el email';
    throw new Error(errorMessage);
  }
};

// Importar axios para el manejo de errores
import axios from 'axios';
