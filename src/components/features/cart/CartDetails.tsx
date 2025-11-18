import React, { useState } from 'react';
import { useCartStore } from '../../../store/cartStore';
import type { CartItem } from '../../../types';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { CheckoutModal, PaymentSuccessModal } from '../checkout';

// Componente "hijo" para una sola fila del carrito
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { decreaseQuantity, removeFromCart, increaseQuantity } = useCartStore();
  
  // Helper para formatear precios (soles)
  const formatPrice = (priceInSoles: number) => {
    return priceInSoles.toFixed(2);
  };

  // Usar calculated_price si existe, sino usar base_price
  const unitPrice = item.calculated_price || item.product.base_price;
  const totalPrice = unitPrice * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b">
      {/* Imagen */}
      <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
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
      <div className="flex-grow min-w-0">
        <h3 className="text-base sm:text-lg font-semibold truncate">{item.product.name}</h3>
        <p className="text-sm sm:text-base text-gray-600">S/ {formatPrice(unitPrice)}</p>
        
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

      {/* Controles de Cantidad y Total - Mobile Stack */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Controles de Cantidad */}
        <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-1">
          <button 
            onClick={() => decreaseQuantity(item.product.product_id)}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 w-8 h-8 flex items-center justify-center"
            disabled={item.quantity <= item.product.min_order_quantity}
          >
            <FaMinus className="w-3 h-3" />
          </button>
          <span className="text-base sm:text-lg font-bold w-8 text-center">{item.quantity}</span>
          <button 
            onClick={() => increaseQuantity(item.product.product_id)}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 w-8 h-8 flex items-center justify-center"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        </div>
        
        {/* Total de Fila y Botón de Eliminar */}
        <div className="flex items-center gap-3 sm:gap-4 order-1 sm:order-2">
          <span className="text-base sm:text-lg font-bold text-right min-w-16">
            S/ {formatPrice(totalPrice)}
          </span>
          <button 
            onClick={() => removeFromCart(item.product.product_id)}
            className="text-red-500 hover:text-red-700 p-2"
            aria-label="Eliminar producto"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


// Componente "Padre" principal
export const CartDetails: React.FC = () => {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Helper para formatear precios (soles)
  const formatPrice = (priceInSoles: number) => {
    return priceInSoles.toFixed(2);
  };

  // Calcular totales usando la función del store
  const subtotalInSoles = getTotalPrice();
  const totalInSoles = subtotalInSoles; // Sin costos de envío

  const handleCheckout = () => {
    // Removida la validación - permite checkout siempre para demo visual
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (newOrderId: string) => {
    setOrderId(newOrderId);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      
      {/* Columna Izquierda: Lista de Items */}
      <div className="xl:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-xl md:text-2xl font-bold">Tu Carrito ({items.length} productos)</h2>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-red-500 hover:underline text-sm md:text-base">
              Vaciar Carrito
            </button>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
            <Link to="/productos" className="inline-block bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors">
              ¡Ve a comprar!
            </Link>
          </div>
        ) : (
          <div>
            {items.map(item => (
              <CartItemRow key={item.product.product_id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Columna Derecha: Resumen de Pago */}
      <div className="xl:col-span-1">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md sticky top-20 md:top-28">
          <h2 className="text-xl md:text-2xl font-bold mb-4 border-b pb-3">Resumen del Pago</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">S/ {formatPrice(subtotalInSoles)}</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg md:text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>S/ {formatPrice(totalInSoles)}</span>
            </div>
          </div>
          {items.length > 0 && (
            <button 
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 md:py-4 rounded-lg mt-6 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
      </div>
      
      {/* Modales */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <PaymentSuccessModal
        isOpen={isSuccessOpen}
        orderId={orderId}
        onClose={() => setIsSuccessOpen(false)}
      />
    </>
  );
};