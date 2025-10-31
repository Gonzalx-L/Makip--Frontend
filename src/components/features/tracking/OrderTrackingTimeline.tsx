import React from 'react';
// 1. Importa los NUEVOS tipos que acabamos de definir
import type { TrackingInfo, TrackingUpdate } from '../../../types/tracking'; 

// 2. Importa los íconos (si no los tienes, ejecuta: npm install react-icons)
import { 
  FaTruck, 
  FaWarehouse, 
  FaClipboardCheck, 
  FaCircleCheck 
} from 'react-icons/fa6';

// 3. --- DATOS DE EJEMPLO ---
//    Usamos esto por ahora para construir la interfaz
const mockTrackingData: TrackingInfo = {
  id: "MKP123456",
  statusBanner: "En Camino: Llega 27 OCT.",
  carrier: "MKPAG00780PER",
  carrierTrackingId: "MKPAG00780PER",
  updates: [
    { status: "Confirmado", description: "Pedido confirmado y en producción", date: "25 OCT, 18:00 (GMT-5)", isComplete: true },
    { status: "Producción", description: "Producción finalizada y empaquetado", date: "26 OCT, 18:05 (GMT-5)", isComplete: true },
    { status: "Centro de Reparto", description: "Paquete en el centro de reparto", date: "26 OCT, 14:00 (GMT-5)", isComplete: true },
    { status: "En Camino", description: "Paquete en ruta a tu dirección", date: "26 OCT, 14:30 (GMT-5)", isComplete: false }, // El último está incompleto
  ],
};
// 4. --- FIN DE DATOS DE EJEMPLO ---


// --- COMPONENTE PRINCIPAL ---
// Este componente recibe la info de seguimiento y la muestra
interface OrderTrackingTimelineProps {
  trackingInfo: TrackingInfo;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ trackingInfo }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Seguimiento de Pedido # {trackingInfo.id}
      </h1>
      
      <div className="bg-green-100 text-green-800 font-semibold p-4 rounded-lg flex items-center gap-3 mb-8">
        <FaTruck className="w-6 h-6" />
        <span>{trackingInfo.statusBanner}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información de Envío */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md self-start">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Información del Envío</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Carrieres:</h3>
              <p className="text-lg font-semibold text-gray-800">{trackingInfo.carrier}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Makip Express</h3>
              <p className="text-lg font-semibold text-gray-800">{trackingInfo.carrierTrackingId}</p>
            </div>
            <button className="text-base font-medium text-blue-600 hover:text-blue-800">
              Contactar transportista
            </button>
          </div>
        </div>

        {/* Columna Derecha: Línea de Tiempo */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-lg shadow-md">
          {trackingInfo.updates.map((update, index) => (
            <TimelineStep
              key={index}
              update={update}
              isLast={index === trackingInfo.updates.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTE INTERNO ---
// Un componente pequeño que solo se usa aquí
interface TimelineStepProps {
  update: TrackingUpdate;
  isLast: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ update, isLast }) => {
  const getIcon = () => {
    if (update.status.includes("Camino")) return <FaTruck className="w-5 h-5" />;
    if (update.status.includes("Centro de Reparto")) return <FaWarehouse className="w-5 h-5" />;
    if (update.status.includes("Producción")) return <FaClipboardCheck className="w-5 h-5" />;
    if (update.status.includes("Confirmado")) return <FaCircleCheck className="w-5 h-5" />;
    return <FaCircleCheck className="w-5 h-5" />;
  };

  return (
    <div className="flex gap-4 relative">
      {/* Icono y Línea Vertical */}
      <div className="flex flex-col items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${update.isComplete ? 'bg-green-500' : 'bg-gray-300'} text-white z-10`}>
          {getIcon()}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gray-300 absolute top-10 left-5" />
        )}
      </div>
      
      {/* Info del Paso */}
      <div className="pb-8 pt-2">
        <p className={`font-semibold text-lg ${update.isComplete ? 'text-gray-800' : 'text-gray-500'}`}>
          {update.description}
        </p>
        <p className="text-sm text-gray-500">{update.date}</p>
      </div>
    </div>
  );
};

// Exportamos el componente y el mock (para usarlo en la página)
export { mockTrackingData };