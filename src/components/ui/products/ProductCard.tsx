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

  // 3. Lógica de imagen actualizada para el backend
  const productImage = product.base_image_url || '/src/assets/producto-placeholder.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl group">
      
      {/* Imagen del producto */}
      <Link to={`/productos/${product.product_id}`} className="block overflow-hidden">
        {product.base_image_url ? (
          <img
            src={product.base_image_url} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
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
        <p className="text-sm text-gray-600 mb-2">
          {product.category_name}
        </p>
        
        {/* Descripción truncada */}
        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
          {product.description}
        </p>
        
        {/* Precio desde */}
        <p className="text-xl font-bold text-gray-900 my-2">
          Desde S/ {((typeof product.base_price === 'number' ? product.base_price : parseFloat(product.base_price)) / 100).toFixed(2)}
        </p>
        
        {/* Información adicional */}
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>Mín: {product.min_order_quantity}</span>
          {product.variants && Object.keys(product.variants).length > 0 && (
            <span className="text-blue-600">✨ Personalizable</span>
          )}
        </div>
      </div>
    </div>
  );
};