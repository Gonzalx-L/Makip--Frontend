// src/components/admin/AdmiNavbar.tsx
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const AdmiNavbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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
    <div className='bg-gray-900 text-white border-b border-gray-700 px-4 md:px-6 py-4 md:py-5'>
      <div className='flex items-center justify-between md:justify-end space-x-3 md:space-x-4'>
        {/* Mobile: Show admin info more prominently */}
        <div className="md:hidden">
          <span className='text-white text-sm font-medium'>
            <b>{adminUser?.name || "Admin"}</b>
          </span>
        </div>

        {/* Desktop: Normal admin greeting */}
        <div className="hidden md:block">
          <span className='text-gray-300 text-sm'>
            Hola, <b>{adminUser?.name || "Admin"}</b>
          </span>
        </div>

        <div className='relative' ref={menuRef}>
          <button
            className='flex items-center text-gray-400 hover:text-white transition-colors p-1'
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu de usuario"
          >
            <FaChevronDown />
          </button>
          {open && (
            <div className='absolute right-0 mt-2 w-40 md:w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-50'>
              <button
                className='w-full text-left px-3 md:px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2'
                onClick={logout}
              >
                <FaSignOutAlt className='text-gray-500' />
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
