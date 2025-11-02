import React from 'react';
import { useCartStore, type CartItem } from '../../../store/cartStore';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

// Componente "hijo" para una sola fila del carrito
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { addToCart, decreaseQuantity, removeFromCart } = useCartStore();
  const firstImage = item.product.images && item.product.images.length > 0
    ? item.product.images[0]
    : null; // (Aquí puedes poner una imagen placeholder)

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b">
      {/* Imagen */}
      <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
        {firstImage ? (
          <img src={firstImage} alt={item.product.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-xs text-gray-500">Sin imagen</span>
        )}
      </div>

      {/* Nombre y Precio */}
      <div className="flex-grow text-center sm:text-left">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">S/ {item.product.price.toFixed(2)}</p>
      </div>

      {/* Controles de Cantidad */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => decreaseQuantity(item.product.id)}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <FaMinus className="w-3 h-3" />
        </button>
        <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
        <button 
          onClick={() => addToCart(item.product)}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <FaPlus className="w-3 h-3" />
        </button>
      </div>
      
      {/* Total de Fila y Botón de Eliminar */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold w-20 text-right">
          S/ {(item.product.price * item.quantity).toFixed(2)}
        </span>
        <button 
          onClick={() => removeFromCart(item.product.id)}
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
  const { items, clearCart } = useCartStore();

  // Calcular totales
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const envio = subtotal > 0 ? 10.00 : 0; // Envío de S/ 10 (o 0 si está vacío)
  const total = subtotal + envio;

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
              <CartItemRow key={item.product.id} item={item} />
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
              <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Envío</span>
              <span className="font-medium">S/ {envio.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
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