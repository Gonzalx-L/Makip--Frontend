import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Este componente no dibuja nada, solo contiene lógica
const ScrollToTop = () => {
  // "useLocation" nos da la URL actual
  const { pathname } = useLocation();

  // "useEffect" se ejecuta CADA VEZ que el 'pathname' (la URL) cambia
  useEffect(() => {
    // Le da la orden al navegador de ir al pixel 0, 0 (arriba de todo)
    window.scrollTo(0, 0);
  }, [pathname]); // El 'array de dependencias' que lo dispara

  // No devuelve nada para dibujar
  return null;
};

export default ScrollToTop;