import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { CheckoutLoading } from './CheckoutLoading';
import { orderService, type CreateOrderRequest, type Order } from '../../../services/orderService';
import { uploadPaymentProofPublic } from '../../../services/paymentProofService';
import { authService } from '../../../services/authService';
import { useAuthContext } from '../../../contexts/AuthContext';
import QRImage from '../../../assets/QR.png';

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
  const { items, getTotalPrice } = useCartStore();
  const { user, isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'processing' | 'validating' | 'completing'>('processing');
  const [step, setStep] = useState<'shipping' | 'delivery-method' | 'image' | 'store-pickup-confirmation'>('shipping');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery' | 'store_pickup' | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<Order | null>(null);
  
  // Estados del formulario - Vacíos para que el usuario los rellene
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    reference: ''
  });

  // Helper para formatear precios (los precios ya están en soles, no centavos)
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const subtotal = getTotalPrice() || 0; // Precio real del carrito
  const total = subtotal; // Sin costo de delivery

  // Efecto para autorellenar datos del usuario autenticado
  useEffect(() => {
    if (isAuthenticated && user && isOpen) {
      setShippingData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        // Mantener otros campos como estaban para que el usuario los complete
      }));
    }
  }, [isAuthenticated, user, isOpen]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos requeridos estén completos
    const requiredFields = ['fullName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingData[field as keyof typeof shippingData]);
    
    if (missingFields.length > 0) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    // Ir al paso de selección de método de entrega
    setStep('delivery-method');
  };

  const handleDeliveryMethodSelect = (method: 'pickup' | 'delivery' | 'store_pickup') => {
    setDeliveryMethod(method);
    
    if (method === 'pickup') {
      // Si es recojo en tienda, ir directamente al pago
      setStep('image');
    } else if (method === 'store_pickup') {
      // Si es recojo en tienda, procesar directamente sin necesidad de comprobante
      handleStorePickupOrder();
    } else {
      // Si es delivery, ir directamente al pago (se coordina por WhatsApp)
      setStep('image');
    }
  };

  const handleDeliveryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos de delivery estén completos
    const requiredFields = ['address', 'city'];
    const missingFields = requiredFields.filter(field => !shippingData[field as keyof typeof shippingData]);
    
    if (missingFields.length > 0) {
      alert('Por favor, completa todos los campos de dirección');
      return;
    }
    
    // Ir al paso de pago
    setStep('image');
  };

  const handleStorePickupOrder = async () => {
    setLoading(true);
    try {
      setLoadingStep('processing');
      
      // Preparar datos de la orden para recojo en tienda
      const orderData: CreateOrderRequest = {
        items: items.map(item => ({
          product_id: item.product.product_id,
          quantity: item.quantity,
          item_price: item.product.base_price,
          personalization_data: item.personalization || null
        })),
        delivery_type: 'PICKUP',
        // Incluir datos del cliente para usuarios no autenticados
        ...(!isAuthenticated && {
          client_data: {
            full_name: shippingData.fullName,
            email: shippingData.email,
            phone: shippingData.phone,
            address: shippingData.address,
            city: shippingData.city,
            district: shippingData.district,
            reference: shippingData.reference
          }
        })
      };
      
      setLoadingStep('validating');
      
      // Usar endpoint correcto según el estado de autenticación
      const response = isAuthenticated 
        ? await orderService.createOrder(orderData)
        : await orderService.createPublicOrder(orderData);
      
      setLoadingStep('completing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Establecer la orden creada para mostrar la pantalla de confirmación
      setOrderResult(response);
      
      // Mostrar confirmación de recojo en tienda con código
      setStep('store-pickup-confirmation');
      
      // También notificar éxito para limpiar carrito
      onPaymentSuccess(response.order_id.toString());
      
    } catch (error: any) {
      console.error('Error creating store pickup order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al procesar la orden';
      alert(`Error: ${errorMessage}. Inténtalo de nuevo.`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      alert('Por favor, sube el comprobante de pago');
      return;
    }

    // Procesar el pago QR con los datos del cliente
    setLoading(true);
    try {
      setLoadingStep('processing');
      
      // Preparar datos de la orden para el backend
      const orderData: CreateOrderRequest = {
        items: items.map(item => ({
          product_id: item.product.product_id,
          quantity: item.quantity,
          item_price: item.product.base_price,
          personalization_data: item.personalization || null
        })),
        delivery_type: 'DELIVERY',
        // Incluir datos del cliente para usuarios no autenticados
        ...(!isAuthenticated && {
          client_data: {
            full_name: shippingData.fullName,
            email: shippingData.email,
            phone: shippingData.phone,
            address: shippingData.address,
            city: shippingData.city,
            district: shippingData.district,
            reference: shippingData.reference
          }
        })
      };
      
      // Usar endpoint correcto según el estado de autenticación
      const response = isAuthenticated 
        ? await orderService.createOrder(orderData)
        : await orderService.createPublicOrder(orderData);
      
      setLoadingStep('validating');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular procesamiento
      
      setLoadingStep('completing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Subir comprobante de pago si hay imagen
      if (selectedImage) {
        try {
          await uploadPaymentProofPublic(response.order_id, selectedImage);
        } catch (uploadError) {
          console.warn('Error uploading payment proof:', uploadError);
          // Continuar aunque falle la subida del comprobante
        }
      }
      
      onPaymentSuccess(response.order_id.toString());
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al procesar la orden';
      alert(`Error: ${errorMessage}. Inténtalo de nuevo.`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
            {step === 'shipping' ? 'Información de Cliente' : 
             step === 'delivery-method' ? 'Método de Entrega' :
             step === 'store-pickup-confirmation' ? 'Recojo en Tienda - Confirmación' :
             'Pago con QR - Yape/Plin'}
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
              <span className="ml-2 font-medium">Información</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'delivery-method' ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'delivery-method' ? 'bg-teal-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Entrega</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'image' ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'image' ? 'bg-teal-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Pago</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 'shipping' ? (
            <div>
              {/* Formulario de Cliente - DEMO VERSION */}
              {/* Indicador de datos autocompletados */}
              {isAuthenticated && user && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">¡Datos autocompletados!</span> Hemos rellenado tu información desde tu cuenta. Puedes modificar cualquier campo si es necesario.
                    </p>
                  </div>
                </div>
              )}

            <form onSubmit={handleShippingSubmit} className="space-y-4"> 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo
                    {isAuthenticated && user?.name && (
                      <span className="ml-2 text-xs text-green-600 font-normal">✓ Autocompletado</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none ${
                      isAuthenticated && user?.name ? 'border-green-300 bg-green-50' : 'border-gray-300'
                    }`}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                    {isAuthenticated && user?.email && (
                      <span className="ml-2 text-xs text-green-600 font-normal">✓ Autocompletado</span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none ${
                      isAuthenticated && user?.email ? 'border-green-300 bg-green-50' : 'border-gray-300'
                    }`}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                  {isAuthenticated && user?.phone && (
                    <span className="ml-2 text-xs text-green-600 font-normal">✓ Autocompletado</span>
                  )}
                </label>
                <input
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none ${
                    isAuthenticated && user?.phone ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="+51 999 999 999"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
              >
                Continuar
              </button>
            </form>
            </div>
          ) : step === 'delivery-method' ? (
            /* Selección de Método de Entrega */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Cómo deseas recibir tu pedido?</h3>
                <p className="text-gray-600">Selecciona el método de entrega que prefieras</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Botón Recojo en Tienda - Pago en Tienda */}
                <button
                  onClick={() => handleDeliveryMethodSelect('store_pickup')}
                  className="p-6 border-2 border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-left group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="bg-green-100 group-hover:bg-green-200 p-3 rounded-full transition-colors">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-1">Recojo en Tienda</h4>
                      <p className="text-sm text-gray-600 mb-2">Paga al recoger tu pedido</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Sin pago adelantado</p>
                        <p>• Lunes a sábado</p>
                        <p>• 9:00 AM - 6:00 PM</p>
                      </div>
                      <div className="mt-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                        PAGO AL RECOGER
                      </div>
                    </div>
                  </div>
                </button>

                {/* Botón Recojo en Tienda - Con Pago Previo */}
                <button
                  onClick={() => handleDeliveryMethodSelect('pickup')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all duration-300 text-left group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="bg-teal-100 group-hover:bg-teal-200 p-3 rounded-full transition-colors">
                      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-1">Recojo + Pago YaPe</h4>
                      <p className="text-sm text-gray-600 mb-2">Paga ahora, recoge después</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Pago con QR</p>
                        <p>• Lunes a sábado</p>
                        <p>• 9:00 AM - 6:00 PM</p>
                      </div>
                      <div className="mt-3 text-lg font-bold text-teal-600">GRATIS</div>
                    </div>
                  </div>
                </button>

                {/* Botón Delivery */}
                <button
                  onClick={() => handleDeliveryMethodSelect('delivery')}
                  className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="bg-blue-100 group-hover:bg-blue-200 p-3 rounded-full transition-colors">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-1">Delivery</h4>
                      <p className="text-sm text-gray-600 mb-2">Envío a Lima y provincias</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Cobertura nacional</p>
                        <p>• Coordinar por WhatsApp</p>
                        <p>• Según ubicación</p>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-blue-600">COSTO VARIABLE</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Mostrar formulario de dirección si seleccionó delivery */}
              {deliveryMethod === 'delivery' && (
                <div className="bg-white p-6 rounded-lg border border-gray-400">
                  <h4 className="font-semibold text-teal-800 mb-4">Información de Envío</h4>
                  <form onSubmit={handleDeliveryFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dirección Completa *
                      </label>
                      <input
                        type="text"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="Av. Principal 123, Distrito"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ciudad/Provincia *
                        </label>
                        <input
                          type="text"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                          placeholder="Lima, Arequipa, etc."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Distrito
                        </label>
                        <input
                          type="text"
                          value={shippingData.district}
                          onChange={(e) => setShippingData({...shippingData, district: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                          placeholder="Sanan, Miraflores, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Referencia
                      </label>
                      <textarea
                        value={shippingData.reference}
                        onChange={(e) => setShippingData({...shippingData, reference: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                        rows={3}
                        placeholder="Portón azul, segundo piso, etc."
                      />
                    </div>

                    <div className="bg-teal-100 p-4 rounded-lg">
                      <p className="text-sm text-teal-700">
                        <strong>Nota:</strong> El costo de envío se coordinará por WhatsApp según tu ubicación.
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod(null)}
                        className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gray-300"
                      >
                        Cambiar método
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Continuar al Pago
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Botón para volver */}
              {!deliveryMethod && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setStep('shipping')}
                    className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gray-300"
                  >
                    Volver a información del cliente
                  </button>
                </div>
              )}
            </div>
          ) : step === 'store-pickup-confirmation' ? (
            /* Pantalla de Confirmación de Recojo en Tienda */
            <div className="space-y-6">
              {/* Encabezado con icono de éxito */}
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h3>
                <p className="text-gray-600 mb-6">Tu pedido ha sido registrado exitosamente</p>
              </div>

              {/* Información del pedido */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h4 className="text-lg font-semibold text-green-800">Recojo en Tienda</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código de Recojo:</span>
                    <span className="font-mono text-gray-900 bg-white px-3 py-1 rounded border font-bold text-lg">
                      {orderResult?.pickup_code || 'Generando...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de Pedido:</span>
                    <span className="font-mono text-gray-900 bg-white px-3 py-1 rounded border">
                      #{orderResult?.order_id || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total a Pagar:</span>
                    <span className="font-bold text-green-700">S/ {orderResult?.total_price?.toFixed(2) || formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {orderResult?.status || 'PENDIENTE'} - Esperando Recojo
                    </span>
                  </div>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h5 className="font-semibold text-blue-800 mb-3">📋 Instrucciones para el Recojo:</h5>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• <strong>Presenta tu código</strong> de pedido al llegar a la tienda</p>
                  <p>• <strong>Horario de atención:</strong> Lunes a Sábado, 9:00 AM - 6:00 PM</p>
                  <p>• <strong>Ubicación:</strong> [Dirección de tu tienda]</p>
                  <p>• <strong>Pago:</strong> Efectivo, Yape o tarjeta en tienda</p>
                  <p>• <strong>Tiempo de preparación:</strong> 24-48 horas hábiles</p>
                </div>
              </div>

              {/* Resumen de productos */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3">Productos a Recoger:</h5>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-gray-500">Cantidad: {item.quantity}</p>
                        {item.personalization?.text && (
                          <p className="text-gray-500 text-xs">
                            Personalización: "{item.personalization.text}"
                          </p>
                        )}
                      </div>
                      <span className="font-medium">
                        S/ {formatPrice(item.product.base_price * item.quantity + (item.personalization?.cost || 0))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => window.open('https://wa.me/51999999999?text=Hola%2C%20tengo%20un%20pedido%20para%20recojo%20en%20tienda', '_blank')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.348"/>
                  </svg>
                  <span>Contactar por WhatsApp</span>
                </button>
              </div>
            </div>
          ) : step === 'image' ? (
            /* Método de Pago con QR - Yape/Plin */
            <form onSubmit={handleImageSubmit} className="space-y-6">
              {/* Información del Cliente */}
              <div className="bg-linear-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200 mb-4">
                <h4 className="font-semibold text-teal-800 mb-3">Datos del Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-teal-700">
                  <div><strong>Nombre:</strong> {shippingData.fullName}</div>
                  <div><strong>Email:</strong> {shippingData.email}</div>
                  <div><strong>Teléfono:</strong> {shippingData.phone}</div>
                  {deliveryMethod === 'delivery' && (
                    <>
                      <div><strong>Ciudad:</strong> {shippingData.city}</div>
                      <div className="md:col-span-2"><strong>Dirección:</strong> {shippingData.address}</div>
                      {shippingData.district && (
                        <div><strong>Distrito:</strong> {shippingData.district}</div>
                      )}
                      {shippingData.reference && (
                        <div className="md:col-span-2"><strong>Referencia:</strong> {shippingData.reference}</div>
                      )}
                    </>
                  )}
                  <div className="md:col-span-2">
                    <strong>Método de Entrega:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      deliveryMethod === 'pickup' 
                        ? 'bg-teal-200 text-teal-800' 
                        : 'bg-teal-200 text-teal-800'
                    }`}>
                      {deliveryMethod === 'pickup' ? 'Recojo en Tienda' : 'Delivery'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumen del Pedido */}
              <div className="bg-linear-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  Pago con Yape/Plin
                  <span className="ml-2 text-sm bg-teal-200 text-teal-800 px-2 py-1 rounded-full">Método preferido</span>
                </h3>
                <div className="space-y-2 text-sm">
                  {items.length > 0 ? (
                    <>
                      {items.map((item) => (
                        <div key={item.product.product_id} className="flex justify-between">
                          <span>{item.product.name} x{item.quantity}</span>
                          <span>S/ {formatPrice(item.calculated_price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-teal-200 pt-2">
                        <span>Subtotal</span>
                        <span>S/ {formatPrice(subtotal)}</span>
                      </div>
                      {deliveryMethod === 'delivery' && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Delivery</span>
                          <span>Por coordinar</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span>No hay productos en el carrito</span>
                      <span>S/ 0.00</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-teal-200">
                    <span>Total a Pagar</span>
                    <span className="text-teal-700">S/ {formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Instrucciones de Pago */}
              <div className="bg-teal-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div>
                    <h4 className="font-semibold text-teal-800 mb-2">Instrucciones para el pago:</h4>
                    <ol className="text-sm text-teal-700 space-y-1">
                      <li>1. Escanea el código QR con tu app Yape o Plin</li>
                      <li>2. Transfiere exactamente <strong>S/ {formatPrice(total)}</strong></li>
                      <li>3. Toma captura del comprobante de pago</li>
                      <li>4. Sube la imagen del comprobante abajo</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Código QR de Pago */}
              <div className="flex justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200">
                  <div className="text-center mb-4">
                    <h4 className="font-bold text-gray-800 mb-2">Escanea para pagar</h4>
                    <p className="text-sm text-gray-600">S/ {formatPrice(total)}</p>
                  </div>
                  
                  {/* Código QR protegido - Imagen más grande y notoria */}
                  <div className="flex items-center justify-center">
                    <img 
                      src={QRImage} 
                      alt="Código QR de Pago" 
                      className="w-70 h-70 mx-auto object-cover select-none pointer-events-none rounded-lg shadow-lg" 
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      style={{ 
                        userSelect: 'none', 
                        WebkitUserSelect: 'none',
                        WebkitTouchCallout: 'none'
                      } as React.CSSProperties}
                    />
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">Gloria E. Inquillay C.</p>
                    <p className="text-xs font-mono text-gray-400">923 119 167</p>
                  </div>
                </div>
              </div>

              {/* Subir Comprobante de Pago */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Subir Comprobante de Pago</h4>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Comprobante de pago" 
                        className="mx-auto max-w-full max-h-48 rounded-lg shadow-lg"
                      />
                      <p className="text-sm text-gray-600">
                        {selectedImage?.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Cambiar comprobante
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FaUpload className="mx-auto text-4xl text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Arrastra tu comprobante aquí
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Captura de pantalla del pago exitoso
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de subir comprobante */}
                <div className="flex justify-center">
                  <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                    <FaUpload className="w-4 h-4" />
                    <span>{imagePreview ? 'Cambiar comprobante' : 'Subir comprobante'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('delivery-method')}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gray-300"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={!selectedImage}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {selectedImage ? 'Confirmar Pago' : 'Sube tu comprobante'}
                </button>
              </div>
            </form>
          ) : (
            /* Este else nunca se ejecutará ya que solo tenemos 2 pasos ahora */
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};