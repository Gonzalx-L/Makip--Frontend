import React, { useState } from 'react';
// 1. Importa el Layout general (Header/Footer)

// 2. Importa nuestro componente "feature" y los datos mock
import { OrderTrackingTimeline, mockTrackingData } from '../../components/features/tracking/OrderTrackingTimeline';
// 3. Importa el tipo (para TypeScript)
import type { TrackingInfo } from '../../types/tracking';
// 4. (Opcional) Importa el hook para leer la URL
import { useParams } from 'react-router-dom'; 

const TrackingPage: React.FC = () => {
  // Obtenemos el ID del pedido desde la URL (ej: /tracking/MKP123456)
  const { orderId } = useParams(); 
  
  // Por ahora, usamos los datos MOCK.
  // En el futuro, aquí harías un fetch a tu API para obtener
  // los datos de seguimiento reales usando el 'orderId'
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(mockTrackingData);
  
  // (Aquí iría un useEffect para cargar los datos reales)

  return (
      <div className="pt-20 bg-indigo-100 min-h-screen"> {/* pt-20 para el navbar */}
        
        {/* 2. Muestra el componente "feature" */}
        {trackingInfo ? (
          <OrderTrackingTimeline trackingInfo={trackingInfo} />
        ) : (
          <p>Cargando seguimiento...</p> 
        )}

      </div>
  );
};

export default TrackingPage;