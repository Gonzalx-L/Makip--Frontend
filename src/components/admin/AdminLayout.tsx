// src/components/admin/AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

// Importa TUS componentes de layout
import AdmiSiderbar from "./AdmiSiderbar";
import AdmiNavbar from "./AdmiNavbar";
import AdmiBody from "./AdmiBody";

const AdminLayout: React.FC = () => {
  return (
    // Contenedor principal (Sidebar + Contenido)
    <div className='flex h-screen bg-gray-50'>
      {/* 1. Tu Sidebar (el blanco) */}
      <AdmiSiderbar />

      {/* 2. Área de Contenido Principal */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* 3. Tu Navbar (el de "Hola, Gonzalo") */}
        <AdmiNavbar />

        {/* 4. Tu Body que renderiza la página (InicioAdm, etc.) */}
        <AdmiBody>
          {/* Aquí se renderiza la página actual (InicioAdm, etc.) */}
          <Outlet />
        </AdmiBody>
      </div>
    </div>
  );
};

export default AdminLayout;
