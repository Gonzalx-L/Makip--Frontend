import React, { useState, useEffect } from 'react';
// 1. Importa el Layout general (Header/Footer)

// 2. Importa nuestro componente "feature" y los datos mock
import { OrderTrackingTimeline, mockTrackingData } from '../../components/features/tracking/OrderTrackingTimeline';
// 3. Importa el tipo (para TypeScript)
import type { TrackingInfo } from '../../types/tracking';
// 4. (Opcional) Importa el hook para leer la URL
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { orderService, type Order } from '../../services/orderService';
import { ORDER_STATE_LABELS } from '../../constants/orderStates';
import { FaBox, FaCheckCircle, FaClock, FaSpinner, FaTimesCircle } from 'react-icons/fa'; 

const TrackingPage: React.FC = () => {
  // Obtenemos el ID del pedido desde la URL (ej: /tracking/MKP123456)
  const { orderId: paramOrderId } = useParams(); 
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const queryOrderId = searchParams.get('order');
  
  // Usar el ID de los parámetros de la URL o de la query string
  const orderId = paramOrderId || queryOrderId;
  
  // Estados para manejar los datos del pedido
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener datos del pedido si vienen del estado de navegación
  const orderFromState = location.state?.order as Order | undefined;
  
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setTrackingInfo(mockTrackingData);
        setLoading(false);
        return;
      }

      // Si tenemos datos del estado de navegación, usarlos primero
      if (orderFromState) {
        console.log('Usando datos del estado de navegación:', orderFromState);
        setOrderData(orderFromState);
        
        // Si es delivery, generar datos de tracking
        if (orderFromState.delivery_type === 'DELIVERY') {
          const mappedTracking = mapOrderToTracking(orderFromState);
          setTrackingInfo(mappedTracking);
        }
        
        setLoading(false);
        return;
      }

      // Si no hay datos del estado y no está autenticado, mostrar error
      if (!isAuthenticated) {
        setError('Necesitas iniciar sesión para ver los detalles del pedido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Usar el servicio de órdenes
        const order = await orderService.getMyOrders();
        const foundOrder = order.find(o => o.order_id.toString() === orderId);
        
        if (foundOrder) {
          setOrderData(foundOrder);
          
          // Si es delivery, generar datos de tracking
          if (foundOrder.delivery_type === 'DELIVERY') {
            const mappedTracking = mapOrderToTracking(foundOrder);
            setTrackingInfo(mappedTracking);
          }
        } else {
          setError('Pedido no encontrado');
        }
        
      } catch (err: any) {
        console.error('Error al obtener orden:', err);
        setError('No se pudo cargar la información del pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, orderFromState, isAuthenticated]);

  // Función para obtener el icono del estado
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NO_PAGADO':
        return <FaClock className="text-gray-500" />;
      case 'PAGO_EN_VERIFICACION':
        return <FaSpinner className="text-orange-500 animate-spin" />;
      case 'PENDIENTE':
        return <FaCheckCircle className="text-green-500" />;
      case 'EN_EJECUCION':
        return <FaSpinner className="text-blue-500 animate-spin" />;
      case 'TERMINADO':
        return <FaBox className="text-purple-500" />;
      case 'COMPLETADO':
        return <FaCheckCircle className="text-green-600" />;
      case 'CANCELADO':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Renderizado simplificado para recojo en tienda
  const renderPickupView = () => {
    if (!orderData) return null;

    const statusLabel = ORDER_STATE_LABELS[orderData.status as keyof typeof ORDER_STATE_LABELS] || orderData.status;

    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-teal-50 px-6 py-4 border-b border-teal-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-teal-900">
                Pedido #{orderData.order_id}
              </h2>
              <span className="text-sm text-teal-600 font-medium">Recojo en Tienda</span>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6 space-y-6">
            {/* Estado actual */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <div className="text-4xl">
                    {getStatusIcon(orderData.status)}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado Actual</h3>
              <p className="text-xl font-bold text-teal-600">{statusLabel}</p>
            </div>

            {/* Código de recojo */}
            {orderData.pickup_code && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h4 className="text-lg font-semibold text-green-900 mb-3">
                  Código de Recojo
                </h4>
                <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-3">
                  <p className="text-3xl font-bold font-mono text-green-800">
                    {orderData.pickup_code}
                  </p>
                </div>
                <p className="text-sm text-green-700">
                  Presenta este código en la tienda para recoger tu pedido
                </p>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="ml-2 font-bold text-gray-900">
                    S/ {typeof orderData.total_price === 'number' ? orderData.total_price.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fecha:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(orderData.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="text-center text-sm text-gray-600">
              <p className="font-medium mb-1">Horario de atención:</p>
              <p>Lunes a Sábado: 9:00 AM - 6:00 PM</p>
              <p className="mt-2">📞 +51 981 266 608</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        
        {/* Contenido principal */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando información del pedido...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <FaTimesCircle className="mx-auto text-4xl text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : orderData?.delivery_type === 'PICKUP' ? (
          renderPickupView()
        ) : orderData?.delivery_type === 'DELIVERY' ? (
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Envío en proceso...</h2>
              <OrderTrackingTimeline trackingInfo={trackingInfo || mockTrackingData} />
            </div>
          </div>
        ) : trackingInfo ? (
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
            </div>
          </div>
        )}

      </div>
  );
};

export default TrackingPage;