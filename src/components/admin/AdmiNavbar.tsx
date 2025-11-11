import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
// 1. Importa el hook de autenticación que creamos
import { useAdminAuth } from "../../contexts/AdminAuthContext";

// (Ya no necesitas el 'USER' hardcodeado)
// const USER = { ... };

const AdmiNavbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 2. Trae el usuario y la función de logout del contexto
  const { adminUser, logout } = useAdminAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-end space-x-4'>
        <span className='text-gray-700 text-sm'>
          {/* 3. Usa el nombre del usuario real */}
          Hola, <b>{adminUser?.name || "Admin"}</b>
        </span>

        {/* (Aquí podrías poner el avatar del admin si lo tuvieras) */}
        {/* <img ... /> */}

        <div className='relative' ref={menuRef}>
          <button
            className='flex items-center text-gray-500 hover:text-gray-700 transition-colors'
            onClick={() => setOpen((v) => !v)}>
            <FaChevronDown />
          </button>
          {open && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50'>
              {/* 4. Conecta el botón de logout */}
              <button
                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2'
                onClick={logout} // ¡AQUÍ ESTÁ LA MAGIA!
              >
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
