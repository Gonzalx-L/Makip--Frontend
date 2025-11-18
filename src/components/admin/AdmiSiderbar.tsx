import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // 💡 Importa NavLink
import {
  FaRegChartBar,
  FaCog,
  FaTh, // Para Productos
  FaFolder, // Para Órdenes
} from "react-icons/fa";
import logoMakip from '../../assets/Makip-logo.png';
import { MdOutlineDashboard } from "react-icons/md";
import { LuUsers } from "react-icons/lu"; // Para Clientes
import { useAdminAuth } from "../../contexts/AdminAuthContext"; // 💡 Para el Perfil

// 💡 NAV_OPTIONS actualizado para tu proyecto
const NAV_OPTIONS = [
  {
    icon: <MdOutlineDashboard />,
    label: "Dashboard",
    to: "/admin/dashboard",
  },
  {
    icon: <FaTh />,
    label: "Productos",
    to: "/admin/productos",
  },
  {
    icon: <FaFolder />,
    label: "Órdenes",
    to: "/admin/ordenes",
  },
  {
    icon: <LuUsers />,
    label: "Clientes",
    to: "/admin/clientes",
  },
  { divider: true },
  {
    icon: <FaRegChartBar />,
    label: "Reportes",
    to: "/admin/reportes",
  },
  {
    icon: <FaCog />,
    label: "Configuración",
    to: "/admin/configuracion",
  },
];

const AdmiSiderbar: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { adminUser } = useAdminAuth(); // 💡 Trae el usuario

  // 💡 Estilos para los enlaces activos/inactivos
  const baseLinkClass =
    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150";
  const activeClassName = `${baseLinkClass} bg-blue-600 text-white`;
  const inactiveClassName = `${baseLinkClass} text-gray-300 hover:bg-gray-700 hover:text-white`;

  return (
    <>
      <button
        className='md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md flex flex-col justify-center items-center w-8 h-8 space-y-1'
        onClick={() => setShowSidebar(!showSidebar)}>
        <span className='block h-0.5 w-4 bg-white' />
        <span className='block h-0.5 w-4 bg-white' />
        <span className='block h-0.5 w-4 bg-white' />
      </button>

      {/* 💡 1. Contenedor del Sidebar ahora es oscuro */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white flex flex-col shadow-lg border-r border-gray-700 transition-transform duration-300 z-40 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } w-64 md:translate-x-0 md:relative md:w-64`}>
        {/* Header */}
        <div className='p-6 border-b border-gray-700 flex items-center space-x-3'>
          <img src={logoMakip} alt="Makip" className="w-10 h-10 object-cover" />
          <span className='text-xl font-bold text-white'>MAKIP Admin</span>
        </div>

        {/* Search */}
        <div className='p-4 relative'>
          <input
            className='w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Buscar...'
          />
          {/* (Icono de búsqueda SVG) */}
          <span className='absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'>
            <svg width='16' height='16' fill='none'>
              <path
                d='M12.5 12.5L10 10M11 6.5A4.5 4.5 0 1 1 2 6.5a4.5 4.5 0 0 1 9 0Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </span>
        </div>

        {/* Nav */}
        <ul className='px-4 space-y-1 flex-1 overflow-y-auto'>
          {NAV_OPTIONS.map((item, i) =>
            item.divider ? (
              <li className='border-t border-gray-700 my-2' key={i} />
            ) : (
              <li className='group' key={i}>
                <NavLink
                  to={item.to || "#"}
                  className={({ isActive }) =>
                    isActive ? activeClassName : inactiveClassName
                  }
                  end // Asegura que solo el 'dashboard' esté activo en la ruta base
                >
                  <span className='text-gray-400 group-hover:text-white'>
                    {item.icon}
                  </span>
                  <span className='text-sm font-medium'>{item.label}</span>
                </NavLink>
              </li>
            )
          )}
        </ul>

        {/* User */}
        <div className='p-4 border-t border-gray-700 bg-gray-900'>
          <div className='flex items-center space-x-3'>
            <img
              src='https://ui-avatars.com/api/?name=A&background=random' // Placeholder
              alt={adminUser?.name || "Admin"}
              className='w-10 h-10 rounded-full object-cover'
            />
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium text-white truncate'>
                {adminUser?.name || "Admin"}
              </div>
              <div className='text-sm text-gray-400 truncate'>
                {adminUser?.email || "..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmiSiderbar;
