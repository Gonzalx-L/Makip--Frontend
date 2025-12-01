import React, { useState, useEffect } from 'react';
import { OrderTrackingTimeline, mockTrackingData } from '../../components/features/tracking/OrderTrackingTimeline';
import { useParams, useSearchParams, useLocation } from 'react-router-dom'; 
import { useTracking } from '../../hooks/useTracking';
import TrackingNotification from '../../components/common/TrackingNotification';
import type { TrackingInfo } from '../../types/tracking';
import { useAuthContext } from '../../contexts/AuthContext';
import { orderService, type Order } from '../../services/orderService';
import { ORDER_STATE_LABELS } from '../../constants/orderStates';
import { FaBox, FaCheckCircle, FaClock, FaSpinner, FaTimesCircle } from 'react-icons/fa';

// Función para mapear orden a tracking
const mapOrderToTracking = (order: Order): TrackingInfo => {
  const updates = [];
  const status = order.status;
  const isPickup = order.delivery_type === 'PICKUP';
  
  // Paso 1: Estado de Pago
  if (status === 'NO_PAGADO') {
    updates.push({
      status: 'Esperando Pago',
      description: isPickup ? 'Pendiente: Subir comprobante de pago' : 'Pendiente: Confirmar pago para proceder',
      date: new Date(order.created_at).toLocaleString('es-ES'),
      isComplete: false,
      icon: 'payment',
      color: 'orange'
    });
  } else if (status === 'PAGO_EN_VERIFICACION') {
    updates.push({
      status: 'Verificando Pago',
      description: 'Comprobante recibido, verificando pago automáticamente',
      date: new Date(order.updated_at || order.created_at).toLocaleString('es-ES'),
      isComplete: false,
      icon: 'payment',
      color: 'blue'
    });
  } else if (status !== 'NO_PAGADO' && status !== 'PAGO_EN_VERIFICACION') {
    updates.push({
      status: 'Pago Confirmado',
      description: 'Pago verificado y aprobado exitosamente',
      date: new Date(order.created_at).toLocaleString('es-ES'),
      isComplete: true,
      icon: 'payment',
      color: 'green'
    });
  }

  // Para PICKUP: Solo hasta aquí si no está en producción
  if (isPickup && (status === 'NO_PAGADO' || status === 'PAGO_EN_VERIFICACION' || status === 'PENDIENTE')) {
    // Para pickup, después del pago solo queda esperar o recoger
    if (status === 'PENDIENTE') {
      updates.push({
        status: 'Listo para Recojo',
        description: `Tu pedido está listo para recoger. Código: ${order.pickup_code || 'Por generar'}`,
        date: new Date(order.updated_at || order.created_at).toLocaleString('es-ES'),
        isComplete: status === 'COMPLETADO',
        icon: 'pickup',
        color: status === 'COMPLETADO' ? 'green' : 'blue'
      });
    }
  } else {
    // Para DELIVERY o PICKUP en estados avanzados: Agregar pasos de producción

    // Paso 2: En Producción (solo si ya está pagado)
    if (status === 'EN_EJECUCION' || status === 'TERMINADO' || status === 'COMPLETADO') {
      updates.push({
        status: 'En Producción',
        description: 'Tu pedido personalizado está siendo creado',
        date: new Date(order.updated_at || order.created_at).toLocaleString('es-ES'),
        isComplete: true,
        icon: 'production',
        color: 'blue'
      });
    }

    // Paso 3: Producción Terminada
    if (status === 'TERMINADO' || status === 'COMPLETADO') {
      updates.push({
        status: 'Producción Finalizada',
        description: 'Tu pedido ha sido completado y está listo',
        date: new Date(order.updated_at || order.created_at).toLocaleString('es-ES'),
        isComplete: true,
        icon: 'packaging',
        color: 'green'
      });
    }

    // Paso 4: Entregado/Listo para Recojo
    if (status === 'COMPLETADO') {
      if (isPickup) {
        updates.push({
          status: 'Listo para Recojo',
          description: `Tu pedido está listo. Código: ${order.pickup_code || 'N/A'}`,
          date: new Date(order.updated_at || order.created_at).toLocaleString('es-ES'),
          isComplete: true,
          icon: 'pickup',
          color: 'green'
        });
      } else {
        updates.push({
          status: 'Entregado',
          description: 'Pedido entregado exitosamente',
          date: new Date(order.updated_at || order.created_at).toLocaleString('es-ES'),
          isComplete: true,
          icon: 'delivery',
          color: 'green'
        });
      }
    }
  }

  // Determinar el estado del banner principal
  let statusBanner = '';
  switch (status) {
    case 'NO_PAGADO':
      statusBanner = isPickup ? 'Esperando Pago - Subir comprobante' : 'Esperando Confirmación de Pago';
      break;
    case 'PAGO_EN_VERIFICACION':
      statusBanner = 'Verificando Pago Automáticamente...';
      break;
    case 'PENDIENTE':
      statusBanner = isPickup ? `Listo para Recojo - Código: ${order.pickup_code || 'Por generar'}` : 'Pedido Confirmado - Iniciando Producción';
      break;
    case 'EN_EJECUCION':
      statusBanner = 'En Producción - Estimado 2-3 días';
      break;
    case 'TERMINADO':
      statusBanner = isPickup ? 'Producción Finalizada - Listo para Recojo' : 'Producción Finalizada - Preparando Envío';
      break;
    case 'COMPLETADO':
      if (isPickup) {
        statusBanner = `Listo para Recojo - Código: ${order.pickup_code}`;
      } else {
        statusBanner = 'Entregado Exitosamente';
      }
      break;
    case 'CANCELADO':
      statusBanner = 'Pedido Cancelado';
      break;
    default:
      statusBanner = 'En Proceso';
  }

  return {
    id: order.order_id.toString(),
    statusBanner,
    carrier: 'Makip Express',
    carrierTrackingId: `MKP${order.order_id.toString().padStart(6, '0')}`,
    updates,
    productName: 'Producto Personalizado',
    productImage: undefined,
    delivery_type: order.delivery_type,
    pickup_code: order.pickup_code,
    currentStatus: status as any,
    lastUpdated: order.updated_at || order.created_at,
    totalPrice: typeof order.total_price === 'number' ? order.total_price : undefined,
    clientName: undefined
  };
};

const TrackingPage: React.FC = () => {
  const { orderId: paramOrderId } = useParams(); 
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const queryOrderId = searchParams.get('order');
  
  // Usar el ID de los parámetros de la URL o de la query string
  const orderId = paramOrderId || queryOrderId;
  
  // Estados para manejar los datos del pedido
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [manualTrackingInfo, setManualTrackingInfo] = useState<TrackingInfo | null>(null);
  
  // Usar el hook personalizado de tracking (para órdenes con tracking API)
  const { 
    trackingInfo: apiTrackingInfo, 
    loading: apiLoading, 
    error: apiError, 
    refreshTracking, 
    notifications,
    removeNotification
  } = useTracking(orderId);
  
  // Estados locales
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Obtener datos del pedido si vienen del estado de navegación
  const orderFromState = location.state?.order as Order | undefined;
  
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setManualTrackingInfo(mockTrackingData);
        setLocalLoading(false);
        return;
      }

      // Si tenemos datos del estado de navegación, usarlos primero
      if (orderFromState) {
        console.log('Usando datos del estado de navegación:', orderFromState);
        setOrderData(orderFromState);
        
        // Si es delivery, generar datos de tracking
        if (orderFromState.delivery_type === 'DELIVERY') {
          const mappedTracking = mapOrderToTracking(orderFromState);
          setManualTrackingInfo(mappedTracking);
        }
        
        setLocalLoading(false);
        return;
      }

      // Si no hay datos del estado y no está autenticado, intentar API de tracking
      if (!isAuthenticated) {
        setLocalLoading(false);
        return; // El hook useTracking manejará esto
      }

      try {
        setLocalLoading(true);
        setLocalError(null);
        
        // Usar el servicio de órdenes
        const orders = await orderService.getMyOrders();
        const foundOrder = orders.find(o => o.order_id.toString() === orderId);
        
        if (foundOrder) {
          setOrderData(foundOrder);
          
          // Si es delivery, generar datos de tracking
          if (foundOrder.delivery_type === 'DELIVERY') {
            const mappedTracking = mapOrderToTracking(foundOrder);
            setManualTrackingInfo(mappedTracking);
          }
        } else {
          setLocalError('Pedido no encontrado');
        }
        
      } catch (err: any) {
        console.error('Error al obtener orden:', err);
        setLocalError('No se pudo cargar la información del pedido');
      } finally {
        setLocalLoading(false);
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-teal-50 px-4 sm:px-6 py-4 border-b border-teal-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-teal-900 text-center sm:text-left">
                Pedido #{orderData.order_id}
              </h2>
              <span className="text-xs sm:text-sm text-teal-600 font-medium text-center sm:text-right">Recojo en Tienda</span>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Estado actual */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <div className="text-3xl sm:text-4xl">
                    {getStatusIcon(orderData.status)}
                  </div>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Estado Actual</h3>
              <p className="text-lg sm:text-xl font-bold text-teal-600">{statusLabel}</p>
            </div>

            {/* Código de recojo */}
            {orderData.pickup_code && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center">
                <h4 className="text-base sm:text-lg font-semibold text-green-900 mb-3">
                  Código de Recojo
                </h4>
                <div className="bg-white border-2 border-green-300 rounded-lg p-3 sm:p-4 mb-3">
                  <p className="text-2xl sm:text-3xl font-bold font-mono text-green-800">
                    {orderData.pickup_code}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-green-700">
                  Presenta este código en la tienda para recoger tu pedido
                </p>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="text-center sm:text-left">
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="ml-2 font-bold text-gray-900">
                    S/ {typeof orderData.total_price === 'number' ? orderData.total_price.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-medium text-gray-700">Fecha:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(orderData.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="text-center text-xs sm:text-sm text-gray-600">
              <p className="font-medium mb-1">Horario de atención:</p>
              <p>Lunes a Sábado: 9:00 AM - 6:00 PM</p>
              <p className="mt-2">📞 +51 981 266 608</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Determinar qué información usar
  const finalTrackingInfo = apiTrackingInfo || manualTrackingInfo || (orderId ? null : mockTrackingData);
  const loading = apiLoading || localLoading;
  const error = apiError || localError;

  console.log('TrackingPage - orderId:', orderId);
  console.log('TrackingPage - finalTrackingInfo:', finalTrackingInfo);

  return (
      <div className="pt-20 bg-indigo-100 min-h-screen">
        
        {/* Notificaciones */}
        {notifications.map((notification) => (
          <TrackingNotification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
        
        {/* Mensaje de bienvenida si viene del checkout */}
        {queryOrderId && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 sm:px-6 py-4 rounded-lg mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-2xl mb-2 sm:mb-0 sm:mr-3 text-center sm:text-left">🎉</span>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-base sm:text-lg">¡Pedido Confirmado!</h3>
                  <p className="text-xs sm:text-sm">Tu pedido #{queryOrderId} ha sido procesado exitosamente.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center min-h-[50vh] px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Cargando seguimiento...</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">orderId: {orderId || 'no orderId'}</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 sm:px-6 py-4 rounded-lg mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                  <span className="text-2xl mb-2 sm:mb-0 sm:mr-3">❌</span>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">Error al obtener seguimiento</h3>
                    <p className="text-xs sm:text-sm mt-1">{error}</p>
                  </div>
                </div>
                {refreshTracking && (
                  <button
                    onClick={refreshTracking}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                  >
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Contenido principal */}
        {!loading && !error && orderData?.delivery_type === 'PICKUP' ? (
          renderPickupView()
        ) : finalTrackingInfo && !loading && !error && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
              {/* Header with controls */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Seguimiento del Pedido</h2>
                {refreshTracking && (
                  <div className="flex justify-center sm:justify-end">
                    {/* Manual refresh button */}
                    <button
                      onClick={refreshTracking}
                      className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                      disabled={loading}
                    >
                      <svg 
                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                      </svg>
                      Actualizar
                    </button>
                  </div>
                )}
              </div>
              
              <OrderTrackingTimeline trackingInfo={finalTrackingInfo} />
              
              {/* Status info */}
              {finalTrackingInfo.lastUpdated && (
                <div className="mt-4 text-xs sm:text-sm text-gray-500 text-center">
                  Última actualización: {new Date(finalTrackingInfo.lastUpdated).toLocaleString('es-ES')}
                </div>
              )}

              {/* Debug info for development */}
              {import.meta.env.DEV && finalTrackingInfo.currentStatus && (
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs sm:text-sm">
                  <strong>Debug:</strong> Estado actual del backend: <code className="text-xs">{finalTrackingInfo.currentStatus}</code>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
  );
};

export default TrackingPage;