import React from 'react';
import { FaCheck, FaTruck, FaCommentDots, FaCreditCard, FaGear, FaBox, FaXmark } from 'react-icons/fa6';
import type { OrderStatus } from '../../../types/tracking';

// Definimos los estados visuales que puede tener un paso
type StepStatus = 'completo' | 'activo' | 'pendiente' | 'error';

// Este componente recibe el *estado actual* del pedido
interface TrackingStepIndicatorProps {
  currentStatus: OrderStatus;
  deliveryType?: string;
}

export const TrackingStepIndicator: React.FC<TrackingStepIndicatorProps> = ({ currentStatus, deliveryType }) => {
  
  // 1. Lógica para "traducir" el estado detallado a los pasos visuales
  const getStepStatus = (stepName: 'Pago' | 'Produccion' | 'Finalizado' | 'Entregado'): StepStatus => {
    // Si está cancelado, marcar error
    if (currentStatus === 'CANCELADO') return 'error';
    
    // Lógica para "Pago"
    if (stepName === 'Pago') {
      if (currentStatus === 'NO_PAGADO') return 'pendiente';
      if (currentStatus === 'PAGO_EN_VERIFICACION') return 'activo';
      if (['PENDIENTE', 'EN_EJECUCION', 'TERMINADO', 'COMPLETADO'].includes(currentStatus)) return 'completo';
      return 'pendiente';
    }
    
    // Lógica para "Produccion"
    if (stepName === 'Produccion') {
      if (['NO_PAGADO', 'PAGO_EN_VERIFICACION'].includes(currentStatus)) return 'pendiente';
      if (currentStatus === 'PENDIENTE') return 'activo';
      if (currentStatus === 'EN_EJECUCION') return 'activo';
      if (['TERMINADO', 'COMPLETADO'].includes(currentStatus)) return 'completo';
      return 'pendiente';
    }
    
    // Lógica para "Finalizado"
    if (stepName === 'Finalizado') {
      if (['NO_PAGADO', 'PAGO_EN_VERIFICACION', 'PENDIENTE', 'EN_EJECUCION'].includes(currentStatus)) return 'pendiente';
      if (currentStatus === 'TERMINADO') return 'activo';
      if (currentStatus === 'COMPLETADO') return 'completo';
      return 'pendiente';
    }
    
    // Lógica para "Entregado"
    if (stepName === 'Entregado') {
      if (currentStatus === 'COMPLETADO') return 'completo';
      return 'pendiente';
    }

    return 'pendiente';
  };

  // Obtenemos el estado de cada uno de nuestros pasos
  const pagoStatus = getStepStatus('Pago');
  const produccionStatus = getStepStatus('Produccion');
  const finalizadoStatus = getStepStatus('Finalizado');
  const entregadoStatus = getStepStatus('Entregado');

  // Determinar la etiqueta del último paso según el tipo de entrega
  const finalStepLabel = deliveryType === 'PICKUP' ? 'Listo para Recojo' : 'Entregado';

  // --- JSX ---
  return (
    <div className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mb-8 sm:mb-12 p-3 sm:p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        
        {/* Paso 1: Pago */}
        <StepNode 
          icon={<FaCreditCard />} 
          label="Pago" 
          status={pagoStatus} 
        />
        
        {/* Conector 1 */}
        <StepConnector active={pagoStatus === 'completo'} status={pagoStatus} />

        {/* Paso 2: Producción */}
        <StepNode 
          icon={<FaGear />} 
          label="Producción" 
          status={produccionStatus} 
        />
        
        {/* Conector 2 */}
        <StepConnector active={produccionStatus === 'activo' || produccionStatus === 'completo'} status={produccionStatus} />

        {/* Paso 3: Finalizado */}
        <StepNode 
          icon={<FaBox />} 
          label="Finalizado" 
          status={finalizadoStatus} 
        />
        
        {/* Conector 3 */}
        <StepConnector active={finalizadoStatus === 'completo'} status={finalizadoStatus} />

        {/* Paso 4: Entregado/Listo */}
        <StepNode 
          icon={deliveryType === 'PICKUP' ? <FaCommentDots /> : <FaTruck />} 
          label={finalStepLabel} 
          status={entregadoStatus} 
        />
        
      </div>
    </div>
  );
};

// --- Sub-Componentes Internos ---

interface StepNodeProps {
  icon: React.ReactElement;
  label: string;
  status: StepStatus;
}

// El Círculo con el ícono
const StepNode: React.FC<StepNodeProps> = ({ icon, label, status }) => {
  const circleClass = {
    completo: 'bg-green-500 text-white shadow-lg',
    activo: 'bg-blue-600 text-white shadow-lg animate-pulse',
    pendiente: 'bg-gray-200 text-gray-400',
    error: 'bg-red-500 text-white shadow-lg'
  }[status];

  const textClass = {
    completo: 'text-green-600 font-bold',
    activo: 'text-blue-600 font-bold',
    pendiente: 'text-gray-400',
    error: 'text-red-600 font-bold'
  }[status];

  const displayIcon = status === 'error' ? <FaXmark /> : icon;

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center ${circleClass} transition-all duration-300`}>
        <div className="text-sm sm:text-lg md:text-xl lg:text-2xl">
          {displayIcon}
        </div>
      </div>
      <span className={`mt-2 text-xs sm:text-sm font-semibold ${textClass} transition-all duration-300 text-center max-w-16 sm:max-w-20 leading-tight`}>
        {label}
      </span>
    </div>
  );
};

// La Línea conectora
interface StepConnectorProps {
  active: boolean;
  status?: StepStatus;
}

const StepConnector: React.FC<StepConnectorProps> = ({ active, status }) => {
  let lineClass = 'bg-gray-200';
  
  if (active) {
    lineClass = 'bg-green-500';
  } else if (status === 'error') {
    lineClass = 'bg-red-500';
  }
  
  return <div className={`flex-1 h-1 mx-2 ${lineClass} transition-all duration-300`} />;
};