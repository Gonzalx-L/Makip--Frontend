import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/admi/apiClient';

export interface AdminSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordLastChanged: string;
  };
  notifications: {
    emailNotifications: boolean;
    orderAlerts: boolean;
    lowStockAlerts: boolean;
    newCustomerAlerts: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: 'es' | 'en';
    timezone: string;
  };
  business: {
    businessName: string;
    businessPhone: string;
    businessAddress: string;
    businessEmail: string;
    whatsappNumber: string;
  };
}

export interface UseAdminConfigReturn {
  config: AdminSettings | null;
  isLoading: boolean;
  error: string | null;
  updateConfig: (newConfig: Partial<AdminSettings>) => Promise<void>;
  refreshConfig: () => Promise<void>;
  testConnection: (service: string) => Promise<boolean>;
}

export const useAdminConfig = (): UseAdminConfigReturn => {
  const [config, setConfig] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<AdminSettings>('/admin/configuration');
      setConfig(response.data);
    } catch (err) {
      console.error('Error fetching admin configuration:', err);
      setError('Error al cargar la configuración');
      // Establecer configuración por defecto si no existe
      setConfig({
        profile: {
          name: '',
          email: '',
          phone: '',
        },
        security: {
          twoFactorEnabled: false,
          sessionTimeout: 30,
          passwordLastChanged: new Date().toISOString(),
        },
        notifications: {
          emailNotifications: true,
          orderAlerts: true,
          lowStockAlerts: true,
          newCustomerAlerts: false,
        },
        appearance: {
          theme: 'light',
          language: 'es',
          timezone: 'America/Lima',
        },
        business: {
          businessName: 'MAKIP',
          businessPhone: '',
          businessAddress: '',
          businessEmail: '',
          whatsappNumber: '',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (newConfig: Partial<AdminSettings>) => {
    if (!config) return;

    try {
      setError(null);
      const updatedConfig = {
        ...config,
        ...newConfig,
      };

      await apiClient.put('/admin/configuration', updatedConfig);
      setConfig(updatedConfig);
    } catch (err) {
      console.error('Error updating admin configuration:', err);
      setError('Error al actualizar la configuración');
      throw err;
    }
  }, [config]);

  const refreshConfig = useCallback(async () => {
    await fetchConfig();
  }, [fetchConfig]);

  const testConnection = useCallback(async (service: string): Promise<boolean> => {
    try {
      const response = await apiClient.post(`/admin/test-connection/${service}`);
      return response.data.success;
    } catch (err) {
      console.error(`Error testing ${service} connection:`, err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    isLoading,
    error,
    updateConfig,
    refreshConfig,
    testConnection,
  };
};