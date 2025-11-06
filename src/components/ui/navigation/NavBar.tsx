import { Link, useLocation } from 'react-router-dom';
import logoMakip from '../../../assets/Makip-logo.png';
import { useCartStore } from '../../../store/cartStore'; 
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuthContext } from '../../../contexts/AuthContext'; 

export const NavBar = () => {
  const location = useLocation();
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const { user, isAuthenticated, logout } = useAuthContext();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    // Opcional: redirigir a home después del logout
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img 
                src={logoMakip} 
                alt="Makip" 
                className="w-40 h-auto object-contain" 
              />
            </Link>
          </div>
          
          {/* Navigation links */}
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className={isActive('/') 
                ? "text-white px-3 py-2 border-b-2 border-white font-medium" 
                : "text-blue-100 px-3 py-2 hover:text-white"
              }
            >
              INICIO
            </Link>
            <Link 
              to="/productos" 
              className={isActive('/productos') 
                ? "text-white px-3 py-2 border-b-2 border-white font-medium" 
                : "text-blue-100 px-3 py-2 hover:text-white"
              }
            >
              PRODUCTOS
            </Link>
            <Link 
              to="/nosotros" 
              className={isActive('/nosotros') 
                ? "text-white px-3 py-2 border-b-2 border-white font-medium" 
                : "text-blue-100 px-3 py-2 hover:text-white"
              }
            >
              NOSOTROS
            </Link>
            <Link 
              to="/contacto" 
              className={isActive('/contacto') 
                ? "text-white px-3 py-2 border-b-2 border-white font-medium" 
                : "text-blue-100 px-3 py-2 hover:text-white"
              }
            >
              CONTACTO
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="text-white hover:text-blue-200 relative">
              <FaShoppingCart className="text-xl" />
              {/* Muestra la burbuja SÓLO si hay items */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
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
                  <span className="hidden sm:block text-sm font-medium">
                    ¡Hola, {user.name.split(' ')[0]}!
                  </span>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 flex items-center space-x-1 text-sm"
                  title="Cerrar sesión"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span className="hidden sm:block">Salir</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
                Iniciar sesión
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;