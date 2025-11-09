import React, { useState } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { FaCreditCard, FaLock, FaTimes, FaSpinner } from 'react-icons/fa';
import { CheckoutLoading } from './CheckoutLoading';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess 
}) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'processing' | 'validating' | 'completing'>('processing');
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  
  // Estados del formulario - Prellenados para demo visual
  const [shippingData, setShippingData] = useState({
    fullName: 'Juan Pérez Demo',
    email: 'juan@demo.com',
    phone: '+51 999 123 456',
    address: 'Av. Principal 123, Miraflores',
    city: 'Lima',
    postalCode: '15074',
    reference: 'Casa azul, segundo piso'
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '4532 1234 5678 9012',
    expiryDate: '12/28',
    cvv: '123',
    cardName: 'JUAN PEREZ'
  });

  // Helper para formatear precios
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const subtotalInCents = getTotalPrice() || 8500; // Demo: S/ 85.00 si no hay productos
  const envioInCents = 1000; // Demo: S/ 10.00 siempre
  const totalInCents = subtotalInCents + envioInCents;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ir directo al paso de pago sin validación para demo
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Paso 1: Procesando pago
      setLoadingStep('processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Paso 2: Validando transacción
      setLoadingStep('validating');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Paso 3: Completando pedido
      setLoadingStep('completing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar ID de pedido simulado
      const orderId = `MKP${Date.now().toString().slice(-6)}`;
      
      // NO limpiar carrito en modo demo para poder probar múltiples veces
      // clearCart();
      
      // Notificar éxito
      onPaymentSuccess(orderId);
      
    } catch (error) {
      console.error('Error en el pago:', error);
      alert('Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Mostrar CheckoutLoading cuando está procesando el pago
  if (loading) {
    return <CheckoutLoading step={loadingStep} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'shipping' ? '📦 Información de Envío' : '💳 Método de Pago'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'shipping' ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'shipping' ? 'bg-teal-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Envío</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'payment' ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-teal-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Pago</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 'shipping' ? (
            /* Formulario de Envío - DEMO VERSION */
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              {/* Mensaje de demo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm font-medium">
                  🎭 <strong>MODO DEMO</strong> - Los campos están prellenados para facilitar la prueba visual
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📧 Email
                  </label>
                  <input
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📱 Teléfono
                </label>
                <input
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="+51 999 999 999"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏠 Dirección Completa
                </label>
                <input
                  type="text"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Av. Principal 123, Distrito"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🏙️ Ciudad
                  </label>
                  <input
                    type="text"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Lima"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📮 Código Postal
                  </label>
                  <input
                    type="text"
                    value={shippingData.postalCode}
                    onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="15001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Referencia (Opcional)
                </label>
                <textarea
                  value={shippingData.reference}
                  onChange={(e) => setShippingData({...shippingData, reference: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                  rows={3}
                  placeholder="Portón azul, segundo piso, etc."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
              >
                Continuar al Pago 💳
              </button>
            </form>
          ) : (
            /* Formulario de Pago - DEMO VERSION */
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Mensaje de demo */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm font-medium">
                  💳 <strong>PAGO DEMO</strong> - Usa cualquier información, el proceso es simulado
                </p>
              </div>
              {/* Resumen del Pedido */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen del Pedido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length || 3} productos)</span>
                    <span>S/ {formatPrice(subtotalInCents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>S/ {formatPrice(envioInCents)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>S/ {formatPrice(totalInCents)}</span>
                  </div>
                </div>
              </div>

              {/* Información de la Tarjeta */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💳 Número de Tarjeta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none pl-12"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    <FaCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📅 Fecha de Vencimiento
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🔒 CVV
                    </label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Nombre en la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="JUAN PÉREZ"
                  />
                </div>
              </div>

              {/* Mensaje de Seguridad */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <FaLock className="text-blue-600" />
                <span>Tu información está protegida con encriptación SSL</span>
              </div>

              {/* Botones */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gray-300"
                  disabled={loading}
                >
                  ← Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Procesando Pago...
                    </div>
                  ) : (
                    `💰 Pagar S/ ${formatPrice(totalInCents)}`
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};