import { useState, useEffect } from 'react';
import { authService, type Client } from '../services/authService';
import { useCartStore } from '../store/cartStore';

export const useAuth = () => {
  const [user, setUser] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Verificar si hay usuario guardado al cargar la aplicación
    const checkAuth = () => {
      try {
        const savedUser = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        console.log('Verificando autenticación:', { savedUser, isAuthenticated });

        if (isAuthenticated && savedUser) {
          setUser(savedUser);
          console.log('Usuario autenticado encontrado:', savedUser);
        } else {
          console.log('No hay usuario autenticado');
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
    // Asegurar que la información también esté en localStorage
    localStorage.setItem('client', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    clearCart(); // Limpiar carrito al cerrar sesión
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  };
};