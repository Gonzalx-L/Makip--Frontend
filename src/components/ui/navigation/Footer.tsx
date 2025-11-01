import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12" style={{ fontFamily: 'Montserrat, sans-serif'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <img src="/src/assets/Makip-logo.png" alt="Makip" className="w-20 h-20 -translate-x-24" />
            <p className="text-gray-300 -translate-x-24">
              Crea, diseña, mánchate, inspírate... Se tú!... libérate con MAKIP TE CREA!
            </p>
          </div>
          
          {/* Enlaces */}
          <div className="space-y-2 text-right translate-x-24">
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">Acerca de</Link>
            <Link to="/driver" className="block text-gray-300 hover:text-white transition-colors">Conductor</Link>
            <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">Contacto</Link>
          </div>
          
          {/* Copyright */}
          <div className="-translate-x-24 text-gray-400 text-sm mt-8">
            <p>© 2025 Makip te crea. Todos los derechos reservados.</p>
            <p>ToriGO! es un servicio informativo y no se constituye como proveedor de transporte ni de servicios de taxi. Los servicios de transporte están a cargo de terceros.</p>
          </div>

          <div className="flex justify-end -translate-x-20">
            <a 
              href="/documents/terminos-y-condiciones.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              title="Términos y Condiciones"
            >
              <img src="/src/assets/libro.png" alt="Términos y Condiciones" className="w-20 h-10 hover:opacity-80 transition-opacity" />      
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};