import { useState, useEffect, useCallback, useRef } from 'react';
import type { TrackingInfo } from '../types';
import { trackingService } from '../services/trackingService';

interface TrackingNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface UseTrackingReturn {
  trackingInfo: TrackingInfo | null;
  loading: boolean;
  error: string | null;
  refreshTracking: () => void;
  isPolling: boolean;
  setPolling: (enabled: boolean) => void;
  notifications: TrackingNotification[];
  removeNotification: (id: string) => void;
}

export const useTracking = (orderId: string | null, pollInterval: number = 30000): UseTrackingReturn => {
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [notifications, setNotifications] = useState<TrackingNotification[]>([]);
  
  const pollIntervalRef = useRef<number | null>(null);
  const lastUpdatedRef = useRef<string>('');

  const addNotification = useCallback((message: string, type: TrackingNotification['type']) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const fetchTrackingData = useCallback(async (showLoading: boolean = true) => {
    if (!orderId) return;

    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const data = await trackingService.getOrderTracking(orderId);
      setTrackingInfo(data);
      lastUpdatedRef.current = data.lastUpdated || '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al obtener tracking:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [orderId]);

  const checkForUpdates = useCallback(async () => {
    if (!orderId || !lastUpdatedRef.current) return;

    try {
      const { hasUpdates, tracking } = await trackingService.checkForUpdates(
        orderId, 
        lastUpdatedRef.current
      );

      if (hasUpdates && tracking) {
        setTrackingInfo(tracking);
        lastUpdatedRef.current = tracking.lastUpdated || '';
        
        // Mostrar notificación de actualización en la UI
        addNotification(
          `Pedido actualizado: ${tracking.statusBanner}`,
          'info'
        );
        
        // Mostrar notificación del navegador si está permitido
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Actualización de Pedido', {
            body: `Tu pedido #${orderId} ha sido actualizado: ${tracking.statusBanner}`,
            icon: '/favicon.ico'
          });
        }
      }
    } catch (err) {
      console.error('Error al verificar actualizaciones:', err);
    }
  }, [orderId, addNotification]);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    setIsPolling(true);
    pollIntervalRef.current = setInterval(checkForUpdates, pollInterval);
    addNotification('Actualizaciones automáticas activadas', 'success');
  }, [checkForUpdates, pollInterval, addNotification]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const setPolling = useCallback((enabled: boolean) => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
      addNotification('Actualizaciones automáticas desactivadas', 'info');
    }
  }, [startPolling, stopPolling, addNotification]);

  const refreshTracking = useCallback(() => {
    fetchTrackingData(true);
    addNotification('Información actualizada manualmente', 'success');
  }, [fetchTrackingData, addNotification]);

  // Initial fetch
  useEffect(() => {
    if (orderId) {
      fetchTrackingData();
    }
  }, [orderId, fetchTrackingData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    trackingInfo,
    loading,
    error,
    refreshTracking,
    isPolling,
    setPolling,
    notifications,
    removeNotification
  };
};