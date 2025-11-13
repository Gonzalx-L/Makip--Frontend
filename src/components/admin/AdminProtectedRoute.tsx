// src/components/admin/AdminProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext"; // Asegúrate que la ruta sea correcta

const AdminProtectedRoute: React.FC = () => {
  const { isAdminAuthenticated, isLoading } = useAdminAuth(); // 1. Esperar si aún estamos cargando el estado desde localStorage

  if (isLoading) {
    return <div>Cargando...</div>;
  } // 2. Si NO está autenticado, redirigir al login de admin

  if (!isAdminAuthenticated) {
    // 💡 CORREGIDO: Redirigir a la ruta de login correcta
    return <Navigate to='/admin/login' replace />;
  } // 3. Si está autenticado, mostrar la página que se pidió

  return <Outlet />;
};

export default AdminProtectedRoute;
