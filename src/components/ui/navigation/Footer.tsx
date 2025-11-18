import { Link } from 'react-router-dom';
import logoMakip from '../../../assets/Makip-logo.png'; // <-- ¡Importa el logo!

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 md:py-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Grid responsive para móviles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

          {/* Columna 1: Logo y descripción (ocupa 2 columnas en lg+) */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3 md:space-y-4 text-center sm:text-left">
            {/* Logo responsive */}
            <img src={logoMakip} alt="Makip" className="w-16 md:w-20 h-auto mx-auto sm:mx-0" />
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Crea, diseña, mánchate, inspírate... Se tú!... libérate con MAKIP TE CREA!
            </p>
          </div>
          
          {/* Columna 2: Enlaces */}
          <div className="space-y-2 text-center sm:text-left lg:text-right">
            <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">Enlaces</h3>
            <Link to="/about" className="block text-gray-300 hover:text-white transition-colors text-sm md:text-base">Acerca de</Link>
            <Link to="/driver" className="block text-gray-300 hover:text-white transition-colors text-sm md:text-base">Conductor</Link>
            <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm md:text-base">Contacto</Link>
          </div>
          
          {/* Columna 3: Términos y Condiciones */}
          <div className="flex justify-center sm:justify-start lg:justify-end">
            <a
              href="/documentos/terminos-y-condiciones.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="Términos y Condiciones"
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <img 
                src="/src/assets/libro.png" 
                alt="Términos y Condiciones" 
                className="w-16 md:w-20 h-8 md:h-10" 
              />
            </a>
          </div>
        </div>

        {/* Fila de Copyright (separada del grid) */}
        <div className="text-gray-400 text-xs md:text-sm mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700 text-center sm:text-left">
          <p className="mb-2">© 2025 Makip te crea. Todos los derechos reservados.</p>
          <p>Makip te crea es una empresa de merchandising</p>
        </div>

      </div>
    </footer>
  );
};

// ¡No olvides exportar!
export default Footer;