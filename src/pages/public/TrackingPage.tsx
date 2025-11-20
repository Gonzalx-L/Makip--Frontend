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
    
    if (orderId) {
      // TODO: Aquí deberías hacer un fetch real al backend
      // Por ahora usamos datos mock pero con el ID correcto
      fetch(`/api/v1/orders/${orderId}`)
        .then(res => res.json())
        .then(orderData => {
          // Mapear el estado real del backend a los pasos del tracking
          const mappedTracking = mapOrderToTracking(orderData);
          setTrackingInfo(mappedTracking);
        })
        .catch(err => {
          console.error('Error al obtener orden:', err);
          // Fallback a datos mock
          const updatedTrackingData = {
            ...mockTrackingData,
            id: orderId
          };
          setTrackingInfo(updatedTrackingData);
        });
    } else {
      setTrackingInfo(mockTrackingData);
    }
  }, [orderId]);

  // Función para mapear la orden del backend al formato de tracking
  const mapOrderToTracking = (order: any): TrackingInfo => {
    const updates: any[] = [];
    const status = order.status;

    // Paso 1: Pedido Confirmado (siempre mostrar si existe)
    if (status !== 'NO_PAGADO' && status !== 'PAGO_EN_VERIFICACION') {
      updates.push({
        status: 'Confirmado',
        description: 'Pedido confirmado y pago aprobado',
        date: new Date(order.created_at).toLocaleString('es-ES'),
        isComplete: true
      });
    }

    // Paso 2: En Producción
    if (status === 'EN_EJECUCION' || status === 'TERMINADO' || status === 'COMPLETADO') {
      updates.push({
        status: 'En Producción',
        description: 'Tu pedido está en producción',
        date: new Date(order.updated_at).toLocaleString('es-ES'),
        isComplete: true
      });
    }

    // Paso 3: Producción Terminada
    if (status === 'TERMINADO' || status === 'COMPLETADO') {
      updates.push({
        status: 'Producción Finalizada',
        description: 'Producción finalizada y empaquetado',
        date: new Date(order.updated_at).toLocaleString('es-ES'),
        isComplete: true
      });
    }

    // Paso 4: Entregado/Listo para Recojo
    if (status === 'COMPLETADO') {
      if (order.delivery_type === 'PICKUP') {
        updates.push({
          status: 'Listo para Recojo',
          description: `Usa tu código: ${order.pickup_code || 'N/A'}`,
          date: new Date(order.updated_at).toLocaleString('es-ES'),
          isComplete: true
        });
      } else {
        updates.push({
          status: 'Entregado',
          description: 'Pedido entregado exitosamente',
          date: new Date(order.updated_at).toLocaleString('es-ES'),
          isComplete: true
        });
      }
    }

    // Determinar el banner según el estado
    let statusBanner = '';
    if (status === 'PENDIENTE') statusBanner = 'Pedido Confirmado';
    else if (status === 'EN_EJECUCION') statusBanner = 'En Producción';
    else if (status === 'TERMINADO') statusBanner = 'Producción Finalizada';
    else if (status === 'COMPLETADO' && order.delivery_type === 'PICKUP') {
      statusBanner = `Listo para Recojo - Código: ${order.pickup_code}`;
    } else if (status === 'COMPLETADO') statusBanner = 'Entregado';
    else statusBanner = 'En Proceso';

    return {
      id: order.order_id.toString(),
      statusBanner,
      carrier: 'Makip Express',
      carrierTrackingId: `MKP${order.order_id.toString().padStart(6, '0')}`,
      updates,
      productName: order.items?.[0]?.product_name || 'Producto Personalizado',
      productImage: order.items?.[0]?.personalization_data?.image_url
    };
  };

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
              <h2 className="text-2xl font-bold mb-4">Envío en proceso...</h2>
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