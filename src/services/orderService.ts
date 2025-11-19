import { apiClient } from './api';
import type { Product } from '../types';

export interface CreateOrderRequest {
  customer_info: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code?: string;
    reference?: string;
  };
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number; // En soles
    personalization?: {
      text: string;
      cost: number;
    };
  }>;
  total_amount: number; // En soles
  payment_method: string;
}

export interface Order {
  order_id: number;
  client_id?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method: string;
  payment_proof_url?: string;
  customer_info: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code?: string;
    reference?: string;
  };
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
    personalization?: {
      text: string;
      cost: number;
    };
  }>;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: Order;
}

export const orderService = {
  // Crear nueva orden (ruta autenticada para clientes registrados)
  createOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>('/orders', orderData);
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