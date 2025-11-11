import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext"; // Asegúrate que la ruta sea correcta

const AdminProtectedRoute: React.FC = () => {
  const { isAdminAuthenticated, isLoading } = useAdminAuth();

  // 1. Esperar si aún estamos cargando el estado desde localStorage
  if (isLoading) {
    // Aquí podrías poner un spinner de carga
    return <div>Cargando...</div>;
  }

  // 2. Si NO está autenticado, redirigir al login de admin
  if (!isAdminAuthenticated) {
    // 'replace' evita que pueda volver atrás con el botón del navegador
    return <Navigate to='/login-admin' replace />;
  }

  // 3. Si está autenticado, mostrar la página que se pidió
  // <Outlet /> renderiza el componente hijo (en App.tsx será el AdminLayout)
  return <Outlet />;
};

export default AdminProtectedRoute;
