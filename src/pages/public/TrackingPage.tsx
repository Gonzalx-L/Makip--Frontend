import React, { useState, useEffect } from 'react';
// 1. Importa el Layout general (Header/Footer)

// 2. Importa nuestro componente "feature" y los datos mock
import { OrderTrackingTimeline, mockTrackingData } from '../../components/features/tracking/OrderTrackingTimeline';
// 3. Importa el tipo (para TypeScript)
import type { TrackingInfo } from '../../types/tracking';
// 4. (Opcional) Importa el hook para leer la URL
import { useParams, useSearchParams } from 'react-router-dom'; 

const TrackingPage: React.FC = () => {
  // Obtenemos el ID del pedido desde la URL (ej: /tracking/MKP123456)
  const { orderId: paramOrderId } = useParams(); 
  const [searchParams] = useSearchParams();
  const queryOrderId = searchParams.get('order');
  
  // Usar el ID de los parámetros de la URL o de la query string
  const orderId = paramOrderId || queryOrderId;
  
  // Por ahora, usamos los datos MOCK.
  // En el futuro, aquí harías un fetch a tu API para obtener
  // los datos de seguimiento reales usando el 'orderId'
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  
  useEffect(() => {
    console.log('TrackingPage - orderId:', orderId);
    console.log('TrackingPage - mockTrackingData:', mockTrackingData);
    
    if (orderId) {
      // Simular carga de datos del pedido específico
      const updatedTrackingData = {
        ...mockTrackingData,
        id: orderId
      };
      console.log('TrackingPage - updatedTrackingData:', updatedTrackingData);
      setTrackingInfo(updatedTrackingData);
    } else {
      console.log('TrackingPage - usando mockTrackingData directo');
      setTrackingInfo(mockTrackingData);
    }
  }, [orderId]);

  console.log('TrackingPage - trackingInfo final:', trackingInfo);

  return (
      <div className="pt-20 bg-indigo-100 min-h-screen"> {/* pt-20 para el navbar */}
        
        {/* Mensaje de bienvenida si viene del checkout */}
        {queryOrderId && (
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎉</span>
                <div>
                  <h3 className="font-bold text-lg">¡Pedido Confirmado!</h3>
                  <p className="text-sm">Tu pedido #{queryOrderId} ha sido procesado exitosamente.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 2. Muestra el componente "feature" */}
        {trackingInfo ? (
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">🚀 Tracking Component Loading...</h2>
              <OrderTrackingTimeline trackingInfo={trackingInfo} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando seguimiento...</p>
              <p className="text-gray-500 text-sm">orderId: {orderId || 'no orderId'}</p>
            </div>
          </div>
        )}

      </div>
  );
};

export default TrackingPage;