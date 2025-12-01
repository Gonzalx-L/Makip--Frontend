import React from 'react';
import { OrderTrackingTimeline, mockTrackingData } from '../../components/features/tracking/OrderTrackingTimeline';
import { useParams, useSearchParams } from 'react-router-dom'; 
import { useTracking } from '../../hooks/useTracking';
import TrackingNotification from '../../components/common/TrackingNotification';

const TrackingPage: React.FC = () => {
  const { orderId: paramOrderId } = useParams(); 
  const [searchParams] = useSearchParams();
  const queryOrderId = searchParams.get('order');
  
  // Usar el ID de los parámetros de la URL o de la query string
  const orderId = paramOrderId || queryOrderId;
  
  // Usar el hook personalizado de tracking
  const { 
    trackingInfo, 
    loading, 
    error, 
    refreshTracking, 
    isPolling, 
    setPolling,
    notifications,
    removeNotification
  } = useTracking(orderId);

  // Si no hay orderId, usar datos mock
  const finalTrackingInfo = trackingInfo || (orderId ? null : mockTrackingData);

  console.log('TrackingPage - orderId:', orderId);
  console.log('TrackingPage - trackingInfo:', finalTrackingInfo);

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
                <button
                  onClick={refreshTracking}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main tracking content */}
        {finalTrackingInfo && !loading && !error && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
              {/* Header with controls */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Seguimiento del Pedido</h2>
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
              </div>
              
              <OrderTrackingTimeline trackingInfo={finalTrackingInfo} />
              
              {/* Status info */}
              {finalTrackingInfo.lastUpdated && (
                <div className="mt-4 text-xs sm:text-sm text-gray-500 text-center">
                  Última actualización: {new Date(finalTrackingInfo.lastUpdated).toLocaleString('es-ES')}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
  );
};

export default TrackingPage;