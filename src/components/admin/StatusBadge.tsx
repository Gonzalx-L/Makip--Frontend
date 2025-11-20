// src/components/admin/StatusBadge.tsx
import React from "react";

// 🔹 Define exactamente los estados permitidos (DEBEN COINCIDIR CON BACKEND)
export type OrderStatus =
  | "NO_PAGADO"
  | "PAGO_EN_VERIFICACION" 
  | "PENDIENTE"
  | "EN_EJECUCION"
  | "TERMINADO"
  | "COMPLETADO"
  | "CANCELADO";

interface StatusBadgeProps {
  status: OrderStatus | string;
}

// 🔹 Mapa de estilos - SOLO estados válidos del backend (SNAKE_CASE MAYÚSCULAS)
const STATUS_STYLES: Record<
  OrderStatus,
  { bg: string; text: string; label?: string }
> = {
  NO_PAGADO: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "No Pagado",
  },
  PAGO_EN_VERIFICACION: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    label: "Verificando Pago",
  },
  PENDIENTE: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "✅ Pago Validado",
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
  COMPLETADO: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Completado",
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
