// src/pages/Admin/InicioAdm.tsx
import React from "react";
// 1. Importa el hook para saber quién está logueado
import { useAdminAuth } from "../../contexts/AdminAuthContext";

// ¡No importes AdmiSiderbar, AdmiNavbar, ni AdmiBody aquí!
// Este componente se renderiza DENTRO del layout que ya existe.

const InicioAdm: React.FC = () => {
  // 2. Trae los datos del admin que inició sesión
  const { adminUser } = useAdminAuth();

  return (
    // Esto es lo único que se renderizará dentro del <AdmiBody>
    <div className='container mx-auto px-4 py-8'>
      {/* 3. El Mensaje de Bienvenida Personalizado */}
      <h1 className='text-3xl font-bold text-gray-900'>
        ¡Bienvenido, {adminUser?.name || "Admin"}!
      </h1>

      <p className='mt-2 text-lg text-gray-600'>
        Has iniciado sesión correctamente. Desde aquí podrás gestionar toda la
        tienda.
      </p>

      {/* Aquí es donde, más adelante, pondremos las tarjetas (Cards) con:
        - Ventas Totales
        - Nuevas Órdense
        - Gráfico de últimos 7 días
      */}
    </div>
  );
};

export default InicioAdm;
