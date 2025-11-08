import React from 'react';
import { useCartStore } from '../../../store/cartStore';
import type { CartItem } from '../../../types';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

// Componente "hijo" para una sola fila del carrito
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { decreaseQuantity, removeFromCart, increaseQuantity } = useCartStore();
  
  // Helper para formatear precios (centavos a soles)
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  // Usar calculated_price si existe, sino usar base_price
  const unitPrice = item.calculated_price || item.product.base_price;
  const totalPrice = unitPrice * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b">
      {/* Imagen */}
      <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
        {item.product.base_image_url ? (
          <img 
            src={item.product.base_image_url} 
            alt={item.product.name} 
            className="w-full h-full object-cover rounded-md" 
          />
        ) : (
          <span className="text-xs text-gray-500">Sin imagen</span>
        )}
      </div>

      {/* Nombre, Precio y Variantes */}
      <div className="flex-grow text-center sm:text-left">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">S/ {formatPrice(unitPrice)}</p>
        
        {/* Mostrar variantes seleccionadas */}
        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(item.selectedVariants).map(([key, value]) => (
              <span key={key} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
        
        {/* Mostrar personalización */}
        {item.personalization?.text && (
          <p className="text-xs text-gray-500 mt-1">
            Personalizado: "{item.personalization.text}"
          </p>
        )}
      </div>

      {/* Controles de Cantidad */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => decreaseQuantity(item.product.product_id)}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          disabled={item.quantity <= item.product.min_order_quantity}
        >
          <FaMinus className="w-3 h-3" />
        </button>
        <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
        <button 
          onClick={() => increaseQuantity(item.product.product_id)}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <FaPlus className="w-3 h-3" />
        </button>
      </div>
      
      {/* Total de Fila y Botón de Eliminar */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold w-20 text-right">
          S/ {formatPrice(totalPrice)}
        </span>
        <button 
          onClick={() => removeFromCart(item.product.product_id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


// Componente "Padre" principal
export const CartDetails: React.FC = () => {
  const { items, clearCart, getTotalPrice } = useCartStore();

  // Helper para formatear precios (centavos a soles)
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  // Calcular totales usando la función del store
  const subtotalInCents = getTotalPrice();
  const envioInCents = subtotalInCents > 0 ? 1000 : 0; // Envío de S/ 10 (1000 centavos)
  const totalInCents = subtotalInCents + envioInCents;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Columna Izquierda: Lista de Items */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tu Carrito ({items.length} productos)</h2>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-red-500 hover:underline">
              Vaciar Carrito
            </button>
          )}
        </div>
        
        {items.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío. <Link to="/productos" className="text-blue-600">¡Ve a comprar!</Link></p>
        ) : (
          <div>
            {items.map(item => (
              <CartItemRow key={item.product.product_id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Columna Derecha: Resumen de Pago */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
          <h2 className="text-2xl font-bold mb-4 border-b pb-3">Resumen del Pago</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">S/ {formatPrice(subtotalInCents)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Envío</span>
              <span className="font-medium">S/ {formatPrice(envioInCents)}</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>S/ {formatPrice(totalInCents)}</span>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors">
            Continuar con la Compra
          </button>
        </div>
      </div>
    </div>
  );
};