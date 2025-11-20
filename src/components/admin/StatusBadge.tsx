// src/components/admin/StatusBadge.tsx
import React from "react";

// 🔹 Define exactamente los estados permitidos (basado en tu backend)
export type OrderStatus =
  | "NO_PAGADO"
  | "PAGO_EN_VERIFICACION" 
  | "PENDIENTE"
  | "EN_EJECUCION"
  | "TERMINADO"
  | "COMPLETADO"
  | "CANCELADO"
  // Variaciones para compatibilidad
  | "Completado" | "Pendiente" | "Procesando";

interface StatusBadgeProps {
  status: OrderStatus | string;
}

// 🔹 Mapa de estilos en un solo lugar (limpio y escalable)
const STATUS_STYLES: Record<
  OrderStatus,
  { bg: string; text: string; label?: string }
> = {
  Completado: {
    bg: "bg-green-100",
    text: "text-green-800",
  },
  COMPLETADO: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Completado",
  },
  Pendiente: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  PENDIENTE: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Pendiente",
  },
  Procesando: {
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  EN_EJECUCION: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "En Ejecución",
  },
  TERMINADO: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    label: "Terminado",
  },
  PAGO_EN_VERIFICACION: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    label: "Verificando Pago",
  },
  NO_PAGADO: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "No Pagado",
  },
  CANCELADO: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Cancelado",
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_STYLES[status as OrderStatus];

  // Si no existe la configuración para este estado, usar valores por defecto
  if (!config) {
    console.warn(`Estado no reconocido en StatusBadge: ${status}`);
    return (
      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        {status?.replace?.(/_/g, " ") || "Desconocido"}
      </span>
    );
  }

  // Si no existe label personalizado, reemplaza todos los "_" por espacios
  const label = config.label ?? status.replace(/_/g, " ");

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
