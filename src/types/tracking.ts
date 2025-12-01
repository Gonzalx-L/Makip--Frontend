// Estados del pedido según el backend
export type OrderStatus = 
  | 'NO_PAGADO'
  | 'PAGO_EN_VERIFICACION'
  | 'PENDIENTE'
  | 'EN_EJECUCION'
  | 'TERMINADO'
  | 'COMPLETADO'
  | 'CANCELADO';

// Define cómo se ve un solo paso de la línea de tiempo
export interface TrackingUpdate {
  status: string; // Ej: "En Camino" o "Centro de Reparto"
  description: string;
  date: string;
  isComplete: boolean;
  icon?: string; // Ícono opcional para cada estado
  color?: string; // Color específico para el estado
}

// Define el objeto completo de Seguimiento que necesita la página
export interface TrackingInfo {
  id: string; // El ID del pedido
  statusBanner: string; // "En Camino: Llega 27 OCT."
  carrier: string; // "MKPAG00780PER"
  carrierTrackingId: string;
  updates: TrackingUpdate[]; // La lista de pasos
  productName: string;   // Nombre del producto a mostrar
  productImage?: string; // Hacemos la imagen opcional (por si no hay)
  delivery_type?: string; // Tipo de entrega: DELIVERY o PICKUP
  pickup_code?: string; // Código de recojo si es PICKUP
  currentStatus: OrderStatus; // Estado actual del pedido en el backend
  lastUpdated?: string; // Timestamp de la última actualización
  totalPrice?: number; // Precio total del pedido
  clientName?: string; // Nombre del cliente
}