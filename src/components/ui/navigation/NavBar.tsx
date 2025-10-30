import { Link, useLocation } from 'react-router-dom';

export const NavBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/src/assets/Makip-logo.png" 
                alt="Makip" 
                className="h-16 w-auto object-contain" 
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
            <Link to="/carrito" className="text-white hover:text-blue-200 relative">
              <i className="fas fa-shopping-cart text-xl"></i>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                0
              </span>
            </Link>

            {/* Login button */}
            <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
              Iniciar sesión
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;