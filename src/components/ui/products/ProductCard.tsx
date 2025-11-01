import React from 'react';
// Importamos el tipo 'Product' desde tu archivo principal
import type { Product } from '../../../types'; 
import { Link } from 'react-router-dom';

// 1. IMPORTAMOS EL STORE DEL CARRITO
import { useCartStore } from '../../../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // 2. OBTENEMOS LA ACCIÓN 'addToCart'
  const addToCart = useCartStore((state) => state.addToCart);

  // 3. ¡AQUÍ ESTÁ LA LÓGICA DE LA IMAGEN QUE FALTABA!
  const hasImages = product.images && product.images.length > 0;
  const firstImage = hasImages ? product.images[0] : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl group">
      
      {/* 4. ESTE ES EL BLOQUE DE LA IMAGEN QUE FALTABA */}
      <Link to={`/productos/${product.id}`} className="block overflow-hidden">
        {hasImages ? (
          // Si SÍ hay imagen:
          <img
            src={firstImage!} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Si NO hay imagen (tu caso):
          <div className="w-full h-48 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-sm">Sin imagen</span>
          </div>
        )}
      </Link>

      {/* Contenido de la Tarjeta */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-gray-900 my-2">
          S/ {product.price.toFixed(2)}
        </p>

        {/* 5. Y AQUÍ ESTÁ EL BOTÓN ACTUALIZADO */}
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-500 transition-colors duration-200"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};