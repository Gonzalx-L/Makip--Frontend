// Define cómo se ve un solo paso de la línea de tiempo
export interface TrackingUpdate {
  status: string; // Ej: "En Camino" o "Centro de Reparto"
  description: string;
  date: string;
  isComplete: boolean;
}

// Define el objeto completo de Seguimiento que necesita la página
export interface TrackingInfo {
  id: string; // El ID del pedido
  statusBanner: string; // "En Camino: Llega 27 OCT."
  carrier: string; // "MKPAG00780PER"
  carrierTrackingId: string;
  updates: TrackingUpdate[]; // La lista de pasos
}