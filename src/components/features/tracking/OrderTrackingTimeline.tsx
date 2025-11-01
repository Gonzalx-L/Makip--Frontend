import React from 'react';
import type { TrackingInfo, TrackingUpdate } from '../../../types/tracking';
import { FaTruck, FaWarehouse, FaClipboardCheck, FaCircleCheck } from 'react-icons/fa6';

// 1. IMPORTA EL NUEVO COMPONENTE DE PASOS
import { TrackingStepIndicator } from '../../ui/tracking/TrackingStepIndicator';

// 2. IMPORTA UNA IMAGEN DE EJEMPLO (¡Ajusta esta ruta!)
import productoEjemplo from '../../../assets/02.png'; // O la imagen que quieras


// 3. --- DATOS DE EJEMPLO (ACTUALIZADOS) ---
const mockTrackingData: TrackingInfo = {
    id: "MKP123456",
    statusBanner: "En Camino: Llega 27 OCT.",
    carrier: "MKPAG00780PER",
    carrierTrackingId: "MKPAG00780PER",
    updates: [
        // (Asegúrate de que el orden sea cronológico, de viejo a nuevo)
        { status: "Confirmado", description: "Pedido confirmado y en producción", date: "25 OCT, 18:00 (GMT-5)", isComplete: true },
        { status: "Producción", description: "Producción finalizada y empaquetado", date: "26 OCT, 18:05 (GMT-5)", isComplete: true },
        { status: "Centro de Reparto", description: "Paquete en el centro de reparto", date: "26 OCT, 14:00 (GMT-5)", isComplete: true },
        { status: "En Camino", description: "Paquete en ruta a tu dirección", date: "26 OCT, 14:30 (GMT-5)", isComplete: false },
    ],
    // 4. AÑADE LOS DATOS DEL PRODUCTO
    productName: 'POLERA PERSONALIZADA',
    productImage: productoEjemplo,
};
// --- FIN DE DATOS DE EJEMPLO ---


// --- COMPONENTE PRINCIPAL ---
interface OrderTrackingTimelineProps {
    trackingInfo: TrackingInfo;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ trackingInfo }) => {

    // 5. OBTÉN EL ESTADO MÁS RECIENTE
    // (Asumimos que el último item en el array 'updates' es el estado actual)
    const currentStatus = trackingInfo.updates[trackingInfo.updates.length - 1].status;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">

            {/* --- 1. Indicador de Pasos (se queda igual) --- */}
            <TrackingStepIndicator currentStatus={currentStatus} />

            <h1 className="text-3xl font-bold text-gray-800 my-6 text-center lg:text-left">
                Seguimiento de Pedido # {trackingInfo.id}
            </h1>
            {/* --- 2. Banner de Estado (se queda igual) --- */}
            <div className="bg-green-100 text-green-800 font-semibold p-4 rounded-lg flex items-center gap-3 mb-8">
                <FaTruck className="w-6 h-6" />
                <span>{trackingInfo.statusBanner}</span>
            </div>

            {/* --- 3. NUEVO LAYOUT: UNA SOLA TARJETA BLANCA --- */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                {/* Fila Superior: Info y Timeline (Grid de 2 columnas) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Columna 1: Información del Envío (Centrada) */}
                    <div className="self-center"> {/* <-- 4. ¡AQUÍ CENTRAMOS VERTICALMENTE! */}
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
                    {/* Columna 2: Línea de Tiempo */}
                    <div>
                        {trackingInfo.updates.map((update, index) => (
                            <TimelineStep
                                key={index}
                                update={update}
                                isLast={index === trackingInfo.updates.length - 1}
                            />
                        ))}
                    </div>
                </div>
                {/* Fila Inferior: Imagen del Producto (Centrada y más grande) */}
                <div className="w-full max-w-lg mx-auto">
                    {trackingInfo.productImage && (
                        <div>
                            {/* --- 1. ESTE ES EL MARCO --- */}
                            {/* Le damos la altura (h-60) y el overflow-hidden */}
                            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden h-130">
                                <img
                                    src={trackingInfo.productImage}
                                    alt={trackingInfo.productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-center font-semibold text-gray-700 mt-4">
                                {trackingInfo.productName}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Sub-Componente Interno (Sin cambios) ---
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
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full 
            ${update.isComplete ? 'bg-blue-500' : 'bg-blue-100'} 
            ${update.isComplete ? 'text-white' : 'text-gray-600'} 
            z-10 transition-colors duration-200`}>
                    {getIcon()}
                </div>
                {!isLast && (
                    <div className="w-0.5 h-full bg-gray-300 absolute top-10 left-5" />
                )}
            </div>
            <div className="pb-8 pt-2">
                <p className={`font-semibold text-lg ${update.isComplete ? 'text-gray-800' : 'text-gray-500'}`}>
                    {update.description}
                </p>
                <p className="text-sm text-gray-500">{update.date}</p>
            </div>
        </div>
    );
};

export { mockTrackingData };