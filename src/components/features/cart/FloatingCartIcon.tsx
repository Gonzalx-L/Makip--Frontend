import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import { useAuthContext } from '../../../contexts/AuthContext';
import { FaShoppingCart } from 'react-icons/fa'; // (Asegúrate de tener react-icons)

export const FloatingCartIcon: React.FC = () => {
  // 1. "Escucha" los cambios en el store y usa la función getTotalPrice
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const { isAuthenticated } = useAuthContext();

  // 2. Calcula el total de productos y usa la función del store para el precio
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPriceInCents = getTotalPrice();
  
  // Helper para formatear precios (soles)
  const formatPrice = (priceInSoles: number) => {
    return priceInSoles.toFixed(2);
  };

  // 3. Si no hay items o no está autenticado, no muestra nada
  if (totalItems === 0 || !isAuthenticated) {
    return null;
  }

  // 4. Si hay items, muestra la burbuja
  return (
    <Link
      to="/cart" // (Esta será la futura página del carrito)
      className="fixed bottom-25 right-4 z-50 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-500 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <FaShoppingCart className="w-6 h-6" />
          {/* Burbuja de cantidad */}
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        {/* Precio Total */}
        <span className="text-lg font-bold">
          S/ {formatPrice(totalPriceInCents)}
        </span>
      </div>
    </Link>
  );
};