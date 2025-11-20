import { apiClient } from './api';

export interface PaymentProofResponse {
  message: string;
  order: {
    order_id: number;
    status: string;
    payment_proof_url: string;
  };
  isApproved: boolean;
  info?: {
    fecha?: string;
    codigoOperacion?: string;
    codVerificacion?: string;
  };
  errors?: string[];
}

/**
 * Subir comprobante de pago para una orden específica (cliente autenticado)
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
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: { message?: string } } };
    console.error('Error uploading payment proof:', err);

    if (err.response?.status === 401) {
      throw new Error('Debes iniciar sesión para subir comprobantes');
    } else if (err.response?.status === 404) {
      throw new Error('Orden no encontrada o no te pertenece');
    } else if (err.response?.status === 400) {
      throw new Error('Archivo inválido. Solo se permiten imágenes y PDFs');
    } else {
      throw new Error(err.response?.data?.message || 'Error al subir comprobante');
    }
  }
}

/**
 * Subir comprobante de pago para una orden pública (sin autenticación)
 * Para órdenes de clientes no registrados
 */
export async function uploadPaymentProofPublic(
  orderId: string | number, 
  file: File
): Promise<PaymentProofResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await apiClient.post<PaymentProofResponse>(
      `/public/orders/${orderId}/upload-proof`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: { message?: string } } };
    console.error('Error uploading payment proof (public):', err);

    if (err.response?.status === 404) {
      throw new Error('Orden no encontrada. Verifica el código de orden.');
    } else if (err.response?.status === 400) {
      throw new Error('Archivo inválido. Solo se permiten imágenes y PDFs');
    } else if (err.response?.status === 403) {
      throw new Error('Esta orden ya fue procesada o no permite cambios');
    } else {
      throw new Error(err.response?.data?.message || 'Error al subir comprobante');
    }
  }
}