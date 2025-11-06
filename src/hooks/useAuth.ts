import { useState, useEffect } from 'react';
import { authService, type Client } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario guardado al cargar la aplicación
    const checkAuth = () => {
      try {
        const savedUser = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        
        if (isAuthenticated && savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: Client) => {
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  };
};