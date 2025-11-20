import { apiClient } from './api';
import type { Product } from '../types';

export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
    item_price: number;
    personalization_data?: any;
  }>;
  delivery_type: 'DELIVERY' | 'PICKUP';
  // Datos del cliente para órdenes públicas (usuarios no autenticados)
  client_data?: {
    full_name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    district?: string;
    reference?: string;
  };
}

export interface Order {
  order_id: number;
  client_id: number;
  status: string;
  total_price: number;
  created_at: string;
  due_date?: string;
  payment_proof_url?: string;
  invoice_pdf_url?: string;
  delivery_type: 'DELIVERY' | 'PICKUP';
  pickup_code?: string;
}

export interface CreateOrderResponse extends Order {}

export const orderService = {
  // Crear nueva orden (ruta autenticada para clientes registrados)
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', orderData);
    return response.data;
  },

  // Crear nueva orden pública (sin autenticación para clientes invitados)
  createPublicOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>('/public/orders', orderData);
    return response.data;
  },

  // Obtener orden por ID (ruta pública con código de orden)
  getOrderById: async (orderId: number | string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },
  // Obtener 
  // Obtener órdenes del cliente autenticado
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/my-orders');
    return response.data;
  },

  // Actualizar estado de orden (admin)
  updateOrderStatus: async (orderId: number, status: Order['status']): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Subir comprobante de pago (ya existe en paymentProofService)
  uploadPaymentProof: async (orderId: number | string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/orders/${orderId}/upload-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
};