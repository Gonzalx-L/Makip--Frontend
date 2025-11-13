// src/components/admin/StatusBadge.tsx
import React from "react";

// 🔹 Define exactamente los estados permitidos
export type OrderStatus =
  | "Completado"
  | "Pendiente"
  | "Procesando"
  | "PAGO_EN_VERIFICACION"
  | "NO_PAGADO"
  | "CANCELADO";

interface StatusBadgeProps {
  status: OrderStatus;
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
  Pendiente: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  Procesando: {
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  PAGO_EN_VERIFICACION: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    label: "VERIFICANDO", // texto personalizado
  },
  NO_PAGADO: {
    bg: "bg-gray-100",
    text: "text-gray-800",
  },
  CANCELADO: {
    bg: "bg-red-100",
    text: "text-red-800",
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_STYLES[status];

  // Si no existe label personalizado, reemplaza todos los "_" por espacios
  const label = config.label ?? status.replace(/_/g, " "); // <-- mejor regex

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
