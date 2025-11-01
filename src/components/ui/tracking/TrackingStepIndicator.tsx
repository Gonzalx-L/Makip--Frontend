import React from 'react';
import { FaCheck, FaTruck, FaCommentDots } from 'react-icons/fa6';

// Definimos los 3 estados visuales que puede tener un paso
type StepStatus = 'completo' | 'activo' | 'pendiente';

// Este componente recibe el *estado actual* del pedido
interface TrackingStepIndicatorProps {
  currentStatus: string; // Ej: "Confirmado", "En Camino", "Entregado"
}

export const TrackingStepIndicator: React.FC<TrackingStepIndicatorProps> = ({ currentStatus }) => {
  
  // 1. Lógica para "traducir" el estado detallado a los 3 pasos visuales
  const getStepStatus = (stepName: 'Procesando' | 'Enviado' | 'Entregado'): StepStatus => {
    // Si ya fue entregado, todos están completos
    if (currentStatus === 'Entregado') return 'completo';

    // Lógica para "Procesando"
    if (stepName === 'Procesando') {
      if (currentStatus === 'Confirmado' || currentStatus === 'Producción' || currentStatus === 'En Camino') {
        return 'completo';
      }
      return 'pendiente'; 
    }
    
    // Lógica para "Enviado"
    if (stepName === 'Enviado') {
      if (currentStatus === 'En Camino' || currentStatus === 'Centro de Reparto') {
        return 'completo'; // Activo porque está *en* camino
      }
      if (currentStatus === 'Confirmado' || currentStatus === 'Producción') {
        return 'pendiente';
      }
    }
    
    // Lógica para "Entregado"
    if (stepName === 'Entregado') {
      return 'pendiente'; // Solo se marca "completo" si el estado es 'Entregado'
    }

    return 'pendiente';
  };

  // Obtenemos el estado de cada uno de nuestros 3 pasos
  const procesandoStatus = getStepStatus('Procesando');
  const enviadoStatus = getStepStatus('Enviado');
  const entregadoStatus = getStepStatus('Entregado');

  // --- JSX ---
  return (
    <div className="w-full max-w-2xl mx-auto mb-12 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        
        {/* Paso 1: Procesando */}
        <StepNode 
          icon={<FaCheck />} 
          label="Procesando" 
          status={procesandoStatus} 
        />
        
        {/* Conector 1 */}
        <StepConnector active={procesandoStatus === 'completo'} />

        {/* Paso 2: Enviado */}
        <StepNode 
          icon={<FaTruck />} 
          label="Enviado" 
          status={enviadoStatus} 
        />
        
        {/* Conector 2 */}
        <StepConnector active={enviadoStatus === 'activo' || enviadoStatus === 'completo'} />

        {/* Paso 3: Entregado */}
        <StepNode 
          icon={<FaCommentDots />} 
          label="Entregado" 
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
    completo: 'bg-green-500 text-white',
    activo: 'bg-blue-600 text-white',
    pendiente: 'bg-gray-200 text-gray-400',
  }[status];

  const textClass = {
    completo: 'text-green-600',
    activo: 'text-blue-600',
    pendiente: 'text-gray-400',
  }[status];

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${circleClass} transition-all duration-300`}>
        <div className="text-3xl">
          {icon}
        </div>
      </div>
      {/* 3. Usamos '`' (backticks) para ${textClass} */}
      <span className={`mt-2 text-sm font-semibold ${textClass} transition-all duration-300`}>
        {label}
      </span>
    </div>
  );
};

// La Línea conectora
const StepConnector: React.FC<{ active: boolean }> = ({ active }) => {
  const lineClass = active ? 'bg-green-500' : 'bg-gray-200';
  return <div className={`flex-1 h-1 ${lineClass} transition-all duration-300`} />;
};