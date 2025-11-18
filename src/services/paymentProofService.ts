import { apiClient } from './api';

export interface PaymentProofResponse {
  message: string;
  order: {
    order_id: number;
    status: string;
    payment_proof_url: string;
  };
  isApproved: boolean;
}

/**
 * Subir comprobante de pago para una orden específica
 */
export async function uploadPaymentProof(
  orderId: string | number, 
  file: File
): Promise<PaymentProofResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await apiClient.post<PaymentProofResponse>(
      `/orders/${orderId}/upload-proof`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error uploading payment proof:', error);
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      throw new Error('Debes iniciar sesión para subir comprobantes');
    } else if (error.response?.status === 404) {
      throw new Error('Orden no encontrada o no te pertenece');
    } else if (error.response?.status === 400) {
      throw new Error('Archivo inválido. Solo se permiten imágenes y PDFs');
    } else {
      throw new Error(error.response?.data?.message || 'Error al subir comprobante');
    }
  }
}