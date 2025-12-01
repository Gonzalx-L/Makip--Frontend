import React from 'react';
import type { TrackingInfo, TrackingUpdate, OrderStatus } from '../../../types/tracking';
import { 
  FaTruck, 
  FaCircleCheck, 
  FaCreditCard, 
  FaGear,
  FaBox,
  FaXmark,
  FaEye,
  FaLocationDot
} from 'react-icons/fa6';

// 1. IMPORTA EL NUEVO COMPONENTE DE PASOS
import { TrackingStepIndicator } from '../../ui/tracking/TrackingStepIndicator';

// 3. --- DATOS DE EJEMPLO (ACTUALIZADOS CON TODOS LOS ESTADOS) ---
const mockTrackingData: TrackingInfo = {
    id: "MKP123456",
    statusBanner: "En Producción: Estimado 2-3 días",
    carrier: "Makip Express",
    carrierTrackingId: "MKPAG00780PER",
    currentStatus: "EN_EJECUCION",
    updates: [
        { 
          status: "Pago Confirmado", 
          description: "Pago verificado y aprobado automáticamente", 
          date: "25 OCT, 18:00 (GMT-5)", 
          isComplete: true, 
          icon: "payment", 
          color: "green" 
        },
        { 
          status: "Pedido en Cola", 
          description: "Pedido agregado a la cola de producción", 
          date: "26 OCT, 09:00 (GMT-5)", 
          isComplete: true, 
          icon: "completed", 
          color: "blue" 
        },
        { 
          status: "Iniciando Producción", 
          description: "Tu pedido personalizado está siendo creado", 
          date: "26 OCT, 14:30 (GMT-5)", 
          isComplete: true, 
          icon: "production", 
          color: "blue" 
        },
        { 
          status: "Control de Calidad", 
          description: "Verificando calidad del producto terminado", 
          date: "Pendiente", 
          isComplete: false, 
          icon: "quality", 
          color: "orange" 
        },
    ],
    productName: 'POLERA PERSONALIZADA CON DISEÑO CUSTOM',
    productImage: undefined,
    delivery_type: 'DELIVERY',
    totalPrice: 45.90,
    clientName: 'Cliente Demo',
    lastUpdated: new Date().toISOString()
};
// --- FIN DE DATOS DE EJEMPLO ---


// --- COMPONENTE PRINCIPAL ---
interface OrderTrackingTimelineProps {
    trackingInfo: TrackingInfo;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ trackingInfo }) => {

    console.log('OrderTrackingTimeline - Rendering with trackingInfo:', trackingInfo);

    // 5. OBTÉN EL ESTADO ACTUAL DEL BACKEND
    const currentStatus = trackingInfo.currentStatus;
    
    console.log('OrderTrackingTimeline - currentStatus from backend:', currentStatus);

    // Función para obtener el color del banner según el estado
    const getBannerStyle = (status: OrderStatus) => {
      switch (status) {
        case 'NO_PAGADO':
          return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'PAGO_EN_VERIFICACION':
          return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'PENDIENTE':
        case 'EN_EJECUCION':
          return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'TERMINADO':
          return 'bg-green-100 text-green-800 border-green-300';
        case 'COMPLETADO':
          return 'bg-green-100 text-green-800 border-green-300';
        case 'CANCELADO':
          return 'bg-red-100 text-red-800 border-red-300';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-300';
      }
    };

    // Función para obtener el ícono del banner
    const getBannerIcon = (status: OrderStatus) => {
      switch (status) {
        case 'NO_PAGADO':
          return <FaCreditCard className="w-6 h-6" />;
        case 'PAGO_EN_VERIFICACION':
          return <FaEye className="w-6 h-6" />;
        case 'PENDIENTE':
          return <FaCircleCheck className="w-6 h-6" />;
        case 'EN_EJECUCION':
          return <FaGear className="w-6 h-6 animate-spin" />;
        case 'TERMINADO':
          return <FaBox className="w-6 h-6" />;
        case 'COMPLETADO':
          return trackingInfo.delivery_type === 'PICKUP' ? <FaLocationDot className="w-6 h-6" /> : <FaTruck className="w-6 h-6" />;
        case 'CANCELADO':
          return <FaXmark className="w-6 h-6" />;
        default:
          return <FaCircleCheck className="w-6 h-6" />;
      }
    };

    return (
        <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-8">

            {/* --- 1. Indicador de Pasos Actualizado --- */}
            <TrackingStepIndicator currentStatus={currentStatus} deliveryType={trackingInfo.delivery_type} />

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 my-4 sm:my-6 text-center">
                Seguimiento de Pedido # {trackingInfo.id}
            </h1>
            
            {/* --- 2. Banner de Estado Dinámico --- */}
            <div className={`font-semibold p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row items-center gap-3 mb-6 sm:mb-8 border ${getBannerStyle(currentStatus)}`}>
                {getBannerIcon(currentStatus)}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-base sm:text-lg">{trackingInfo.statusBanner}</span>
                  {trackingInfo.pickup_code && currentStatus === 'COMPLETADO' && (
                    <div className="text-xs sm:text-sm mt-1 font-mono bg-white/20 px-2 py-1 rounded inline-block sm:ml-3">
                      Código: {trackingInfo.pickup_code}
                    </div>
                  )}
                </div>
            </div>

            {/* --- 3. NUEVO LAYOUT: UNA SOLA TARJETA BLANCA --- */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
                {/* Fila Superior: Info y Timeline (Stack en móvil, Grid en desktop) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Columna 1: Información del Pedido */}
                    <div className="order-2 lg:order-1 lg:self-center">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center lg:text-left">Información del Pedido</h2>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="text-center lg:text-left">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Transportista:</h3>
                                <p className="text-sm sm:text-lg font-semibold text-gray-800">{trackingInfo.carrier}</p>
                            </div>
                            <div className="text-center lg:text-left">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Código de Seguimiento:</h3>
                                <p className="text-sm sm:text-lg font-semibold text-gray-800">{trackingInfo.carrierTrackingId}</p>
                            </div>
                            <button className="text-sm sm:text-base font-medium text-blue-600 hover:text-blue-800 w-full lg:w-auto">
                                Contactar transportista
                            </button>
                        </div>
                    </div>
                    {/* Columna 2: Línea de Tiempo */}
                    <div className="order-1 lg:order-2">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center lg:hidden">Historial de Estados</h3>
                        {trackingInfo.updates.map((update, index) => (
                            <TimelineStep
                                key={index}
                                update={update}
                                isLast={index === trackingInfo.updates.length - 1}
                            />
                        ))}
                    </div>
                </div>
                {/* Fila Inferior: Imagen del Producto (Centrada y responsiva) */}
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto mt-6 sm:mt-8">
                    <div>
                        {/* Marco de la imagen responsivo */}
                        <div className="rounded-lg border border-gray-200 bg-gray-100 overflow-hidden h-48 sm:h-56 md:h-60 flex items-center justify-center">
                            {trackingInfo.productImage ? (
                                <img
                                    src={trackingInfo.productImage}
                                    alt={trackingInfo.productName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <div className="text-4xl sm:text-5xl md:text-6xl text-gray-400 mb-2">📦</div>
                                    <p className="text-gray-500 text-xs sm:text-sm">Producto</p>
                                </div>
                            )}
                        </div>
                        <p className="text-center font-semibold text-gray-700 mt-3 sm:mt-4 text-sm sm:text-base px-2">
                            {trackingInfo.productName}
                        </p>
                    </div>
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
        // Usar el ícono específico si está definido en el update
        if (update.icon) {
          switch (update.icon) {
            case 'payment': return <FaCreditCard className="w-5 h-5" />;
            case 'production': return <FaGear className="w-5 h-5" />;
            case 'quality': return <FaEye className="w-5 h-5" />;
            case 'packaging': return <FaBox className="w-5 h-5" />;
            case 'delivery': return <FaTruck className="w-5 h-5" />;
            case 'pickup': return <FaLocationDot className="w-5 h-5" />;
            case 'completed': return <FaCircleCheck className="w-5 h-5" />;
            case 'cancelled': return <FaXmark className="w-5 h-5" />;
          }
        }
        
        // Fallback a la lógica anterior si no hay ícono específico
        if (update.status.includes("Pago") || update.status.includes("Confirmado")) return <FaCreditCard className="w-5 h-5" />;
        if (update.status.includes("Producción") || update.status.includes("Ejecución")) return <FaGear className="w-5 h-5" />;
        if (update.status.includes("Finalizada") || update.status.includes("Terminado")) return <FaBox className="w-5 h-5" />;
        if (update.status.includes("Entregado") || update.status.includes("Completado")) return <FaTruck className="w-5 h-5" />;
        if (update.status.includes("Recojo") || update.status.includes("Listo")) return <FaLocationDot className="w-5 h-5" />;
        if (update.status.includes("Cancelado")) return <FaXmark className="w-5 h-5" />;
        return <FaCircleCheck className="w-5 h-5" />;
    };
    
    // Obtener color personalizado si está definido
    const getColor = () => {
      if (update.color) {
        switch (update.color) {
          case 'green': return update.isComplete ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600';
          case 'blue': return update.isComplete ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600';
          case 'orange': return update.isComplete ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600';
          case 'red': return update.isComplete ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600';
        }
      }
      return update.isComplete ? 'bg-blue-500 text-white' : 'bg-blue-100 text-gray-600';
    };

    return (
        <div className="flex gap-3 sm:gap-4 relative">
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full 
            ${getColor()} 
            z-10 transition-all duration-300 shadow-md`}>
                    <div className="text-sm sm:text-base">
                        {getIcon()}
                    </div>
                </div>
                {!isLast && (
                    <div className={`w-0.5 h-full absolute top-8 sm:top-10 left-4 sm:left-5 transition-colors duration-300 ${
                      update.isComplete ? 'bg-blue-300' : 'bg-gray-300'
                    }`} />
                )}
            </div>
            <div className="pb-6 sm:pb-8 pt-1 sm:pt-2 flex-1">
                <p className={`font-semibold text-sm sm:text-lg ${update.isComplete ? 'text-gray-800' : 'text-gray-500'} transition-colors duration-300`}>
                    {update.status}
                </p>
                <p className={`text-xs sm:text-base ${update.isComplete ? 'text-gray-600' : 'text-gray-500'} mt-1`}>
                    {update.description}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{update.date}</p>
            </div>
        </div>
    );
};

export { mockTrackingData };