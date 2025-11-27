// ============================================================
// CONSTANTES DE ESTADOS DE ÓRDENES
// IMPORTANTE: Estos valores DEBEN coincidir EXACTAMENTE con el backend
// El backend usa SNAKE_CASE en MAYÚSCULAS
// ============================================================

export const ORDER_STATES = {
  NO_PAGADO: "NO_PAGADO",
  PAGO_EN_VERIFICACION: "PAGO_EN_VERIFICACION",
  PENDIENTE: "PENDIENTE",
  EN_EJECUCION: "EN_EJECUCION",
  TERMINADO: "TERMINADO",
  COMPLETADO: "COMPLETADO",
  CANCELADO: "CANCELADO",
} as const;

// Type derivado automáticamente de las constantes
export type OrderStatus = typeof ORDER_STATES[keyof typeof ORDER_STATES];

// Labels en español para mostrar en la UI (NO enviar al backend)
export const ORDER_STATE_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATES.NO_PAGADO]: "No Pagado",
  [ORDER_STATES.PAGO_EN_VERIFICACION]: "Verificando Pago",
  [ORDER_STATES.PENDIENTE]: "✅ Pago Validado",
  [ORDER_STATES.EN_EJECUCION]: "En Ejecución",
  [ORDER_STATES.TERMINADO]: "Terminado",
  [ORDER_STATES.COMPLETADO]: "Completado",
  [ORDER_STATES.CANCELADO]: "Cancelado",
};

// Transiciones válidas entre estados (según backend)
export const VALID_STATE_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_STATES.NO_PAGADO]: [ORDER_STATES.PAGO_EN_VERIFICACION, ORDER_STATES.CANCELADO],
  [ORDER_STATES.PAGO_EN_VERIFICACION]: [ORDER_STATES.PENDIENTE, ORDER_STATES.NO_PAGADO, ORDER_STATES.CANCELADO],
  [ORDER_STATES.PENDIENTE]: [ORDER_STATES.EN_EJECUCION, ORDER_STATES.CANCELADO],
  [ORDER_STATES.EN_EJECUCION]: [ORDER_STATES.TERMINADO, ORDER_STATES.CANCELADO],
  [ORDER_STATES.TERMINADO]: [ORDER_STATES.COMPLETADO],
  [ORDER_STATES.COMPLETADO]: [],
  [ORDER_STATES.CANCELADO]: [],
};

// Función helper para verificar si una transición es válida
export const isValidTransition = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
  const allowedTransitions = VALID_STATE_TRANSITIONS[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

// Colores para cada estado (para badges y UI)
export const ORDER_STATE_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  [ORDER_STATES.NO_PAGADO]: { bg: "bg-gray-100", text: "text-gray-800" },
  [ORDER_STATES.PAGO_EN_VERIFICACION]: { bg: "bg-orange-100", text: "text-orange-800" },
  [ORDER_STATES.PENDIENTE]: { bg: "bg-green-100", text: "text-green-800" },
  [ORDER_STATES.EN_EJECUCION]: { bg: "bg-blue-100", text: "text-blue-800" },
  [ORDER_STATES.TERMINADO]: { bg: "bg-purple-100", text: "text-purple-800" },
  [ORDER_STATES.COMPLETADO]: { bg: "bg-green-100", text: "text-green-800" },
  [ORDER_STATES.CANCELADO]: { bg: "bg-red-100", text: "text-red-800" },
};
