import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <-- ¡NUEVO!
import { logoutAdmin } from "../../../services/auth.admin.service"; // <-- ¡NUEVO! (Ajusta la ruta)

const USER = {
  name: "Gonzalo",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const AdmiNavbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // <-- ¡NUEVO!

  // --- Tu Lógica para cerrar el dropdown (perfecta, sin cambios) ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Lógica de Logout (NUEVA) ---
  const handleLogout = () => {
    logoutAdmin(); // Borra el token
    navigate("/admin/login"); // Redirige al login
  };

  return (
    <div className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-end space-x-4'>
        <span className='text-gray-700 text-sm'>
          Hola, <b>{USER.name}</b>
        </span>
        <img
          className='w-8 h-8 rounded-full object-cover'
          src={USER.avatar}
          alt={USER.name}
        />
        <div className='relative' ref={menuRef}>
          <button
            className='flex items-center text-gray-500 hover:text-gray-700 transition-colors'
            onClick={() => setOpen((v) => !v)}>
            <FaChevronDown />
          </button>
          {open && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50'>
              <button
                onClick={handleLogout} // <-- ¡LÓGICA CONECTADA!
                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2'>
                <FaSignOutAlt className='text-gray-400' />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmiNavbar;
