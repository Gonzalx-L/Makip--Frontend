import { Link } from 'react-router-dom';
import logoMakip from '../../../assets/Makip-logo.png'; // <-- ¡Importa el logo!

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Usamos un grid de 4 columnas en desktop para más control */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Columna 1: Logo y descripción (ocupa 2 columnas) */}
          <div className="md:col-span-2 space-y-4">
            {/* Importamos el logo en lugar de usar la ruta estática */}
            <img src={logoMakip} alt="Makip" className="w-20 h-auto" />
            <p className="text-gray-300">
              Crea, diseña, mánchate, inspírate... Se tú!... libérate con MAKIP TE CREA!
            </p>
          </div>
          {/* Columna 2: Enlaces (alineada a la derecha en desktop) */}
          <div className="space-y-2 md:text-right">
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">Acerca de</Link>
            <Link to="/driver" className="block text-gray-300 hover:text-white transition-colors">Conductor</Link>
            <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">Contacto</Link>
          </div>
          {/* Columna 3: Libro (alineada a la derecha en desktop) */}
          <div className="flex md:justify-end">
            <a
              href="/documentos/terminos-y-condiciones.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="Términos y Condiciones"
            >
              {/* Esta importación de /src/assets/libro.png también debe ser 'import' */}
              <img src="/src/assets/libro.png" alt="Términos y Condiciones" className="w-20 h-10" />
            </a>
          </div>
        </div>

        {/* Fila de Copyright (separada del grid) */}
        <div className="text-gray-400 text-sm mt-8 pt-8 border-t border-gray-700">
          <p>© 2025 Makip te crea. Todos los derechos reservados.</p>
          <p>Makip te crea es una empresa de merchandising</p>
        </div>

      </div>
    </footer>
  );
};

// ¡No olvides exportar!
export default Footer;