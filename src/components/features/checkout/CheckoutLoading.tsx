import React from 'react';

interface CheckoutLoadingProps {
  step: 'processing' | 'validating' | 'completing';
  message?: string;
}

export const CheckoutLoading: React.FC<CheckoutLoadingProps> = ({ 
  step, 
  message 
}) => {
  const getStepInfo = () => {
    switch (step) {
      case 'processing':
        return {
          title: 'Procesando Pago',
          description: 'Validando información de la tarjeta...'
        };
      case 'validating':
        return {
          title: 'Validando Transacción',
          description: 'Verificando con el banco...'
        };
      case 'completing':
        return {
          title: 'Completando Pedido',
          description: 'Generando confirmación...'
        };
      default:
        return {
          title: 'Procesando',
          description: 'Por favor espera...'
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          
          {/* Spinner de carga */}
          <div className="mb-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-teal-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
          
          {/* Título y descripción */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {stepInfo.title}
          </h2>
          <p className="text-gray-600 mb-4">
            {message || stepInfo.description}
          </p>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-linear-to-r from-teal-600 to-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: step === 'processing' ? '33%' : step === 'validating' ? '66%' : '100%' 
              }}
            ></div>
          </div>
          
          {/* Mensaje de seguridad */}
          <p className="text-xs text-gray-500">
            Transacción segura - No cierres esta ventana
          </p>
        </div>
      </div>
    </div>
  );
};