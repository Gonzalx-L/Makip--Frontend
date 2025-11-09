import React from 'react';
import { CartDetails } from '../../components/features/cart/CartDetails';

const CartPage: React.FC = () => {
  return (
    // Usamos 'bg-gray-100' para que el fondo haga juego con la página de productos
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Importamos la "feature" que hace todo el trabajo */}
        <CartDetails />

      </div>
    </div>
  );
};

export default CartPage;