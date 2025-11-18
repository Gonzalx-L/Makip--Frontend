import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logoMakip from '../../../assets/Makip-logo.png';
import { useCartStore } from '../../../store/cartStore'; 
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuthContext } from '../../../contexts/AuthContext'; 

export const NavBar = () => {
  const location = useLocation();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const { user, isAuthenticated, logout } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black shadow-lg relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
              <img 
                src={logoMakip} 
                alt="Makip" 
                className="w-32 md:w-40 h-auto object-contain" 
              />
            </Link>
          </div>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={isActive('/') 
                ? "text-white px-3 py-2 border-b-2 border-white font-medium" 
                : "text-blue-100 px-3 py-2 hover:text-white transition-colors"
              }
            >
              INICIO
            </Link>
            <Link 
              to="/productos" 
              className={isActive('/productos') 
                ? "text-white px-3 py-2 border-b-2 border-white font-medium" 
                : "text-blue-100 px-3 py-2 hover:text-white transition-colors"
              }
            >
              PRODUCTOS
            </Link>
            <Link 
              to="/nosotros" 
              className={isActive('/nosotros') 
                ? "text-white px-3 py-2 border-b-2 border-white font-medium" 
                : "text-blue-100 px-3 py-2 hover:text-white transition-colors"
              }
            >
              NOSOTROS
            </Link>
            <Link 
              to="/contacto" 
              className={isActive('/contacto') 
                ? "text-white px-3 py-2 border-b-2 border-white font-medium" 
                : "text-blue-100 px-3 py-2 hover:text-white transition-colors"
              }
            >
              CONTACTO
            </Link>
          </div>

          {/* Desktop Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="text-white hover:text-blue-200 relative transition-colors">
              <FaShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold min-w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Authentication Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="flex items-center space-x-2 text-white">
                  <FaUser className="text-sm" />
                  <span className="text-sm font-medium">
                    ¡Hola, {user.name.split(' ')[0]}!
                  </span>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 flex items-center space-x-1 text-sm transition-colors"
                  title="Cerrar sesión"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button and cart */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile Cart */}
            <Link to="/cart" className="text-white hover:text-blue-200 relative transition-colors" onClick={closeMobileMenu}>
              <FaShoppingCart className="text-lg" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[18px] h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-200 focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-6 space-y-1 border-t border-gray-700">
            {/* Mobile Navigation Links */}
            <Link 
              to="/" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/') 
                  ? "text-white bg-gray-800" 
                  : "text-blue-100 hover:text-white hover:bg-gray-700"
              }`}
            >
              INICIO
            </Link>
            <Link 
              to="/productos" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/productos') 
                  ? "text-white bg-gray-800" 
                  : "text-blue-100 hover:text-white hover:bg-gray-700"
              }`}
            >
              PRODUCTOS
            </Link>
            <Link 
              to="/nosotros" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/nosotros') 
                  ? "text-white bg-gray-800" 
                  : "text-blue-100 hover:text-white hover:bg-gray-700"
              }`}
            >
              NOSOTROS
            </Link>
            <Link 
              to="/contacto" 
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/contacto') 
                  ? "text-white bg-gray-800" 
                  : "text-blue-100 hover:text-white hover:bg-gray-700"
              }`}
            >
              CONTACTO
            </Link>

            {/* Mobile User Authentication Section */}
            <div className="pt-4 border-t border-gray-700 mt-4">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-2 text-white px-3 py-2">
                    <FaUser className="text-sm" />
                    <span className="text-sm font-medium">
                      ¡Hola, {user.name.split(' ')[0]}!
                    </span>
                  </div>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 flex items-center justify-center space-x-1 text-sm transition-colors"
                  >
                    <FaSignOutAlt className="text-xs" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={closeMobileMenu}
                  className="block w-full bg-white text-teal-600 px-4 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;