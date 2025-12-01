import type { TrackingInfo } from '../types';

// Re-export the type for convenience
export type { TrackingInfo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const trackingService = {
  /**
   * Obtiene la información de tracking de un pedido (público, no requiere auth)
   */
  async getOrderTracking(orderId: string): Promise<TrackingInfo> {
    const response = await fetch(`${API_BASE_URL}/public/tracking/${orderId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Pedido no encontrado');
      }
      throw new Error('Error al obtener información del seguimiento');
    }

    return response.json();
  },

  /**
   * Verifica si hay actualizaciones en el tracking (para polling)
   */
  async checkForUpdates(orderId: string, lastUpdated: string): Promise<{ hasUpdates: boolean; tracking?: TrackingInfo }> {
    try {
      const tracking = await this.getOrderTracking(orderId);
      const hasUpdates = tracking.lastUpdated !== lastUpdated;
      
      return {
        hasUpdates,
        tracking: hasUpdates ? tracking : undefined
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return { hasUpdates: false };
    }
  }
};