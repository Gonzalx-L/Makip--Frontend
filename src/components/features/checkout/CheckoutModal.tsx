import React, { useState } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { CheckoutLoading } from './CheckoutLoading';
import { orderService, type CreateOrderRequest } from '../../../services/orderService';
import { uploadPaymentProofPublic } from '../../../services/paymentProofService';
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
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'processing' | 'validating' | 'completing'>('processing');
  const [step, setStep] = useState<'shipping' | 'image'>('shipping');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Estados del formulario - Vacíos para que el usuario los rellene
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    reference: ''
  });

  // Helper para formatear precios (los precios ya están en soles, no centavos)
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const subtotal = getTotalPrice() || 0; // Precio real del carrito
  const total = subtotal; // Sin costos de envío

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que todos los campos requeridos estén completos
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !shippingData[field as keyof typeof shippingData]);
    
    if (missingFields.length > 0) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    // Ir al paso de pago QR
    setStep('image');
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
        customer_info: {
          full_name: shippingData.fullName,
          email: shippingData.email,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          postal_code: shippingData.postalCode || undefined,
          reference: shippingData.reference || undefined
        },
        items: items.map(item => ({
          product_id: item.product.product_id,
          quantity: item.quantity,
          unit_price: item.product.base_price,
          personalization: item.personalization ? {
            text: item.personalization.text,
            cost: item.personalization.cost || 0
          } : undefined
        })),
        total_amount: total,
        payment_method: 'QR'
      };
      
      // Crear orden en el backend
      const response = await orderService.createOrder(orderData);
      
      setLoadingStep('validating');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular procesamiento
      
      if (response.success) {
        setLoadingStep('completing');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Subir comprobante de pago si hay imagen
        if (selectedImage) {
          try {
            await uploadPaymentProofPublic(response.order.order_id, selectedImage);
          } catch (uploadError) {
            console.warn('Error uploading payment proof:', uploadError);
            // Continuar aunque falle la subida del comprobante
          }
        }
        
        onPaymentSuccess(response.order.order_id.toString());
      } else {
        throw new Error(response.message || 'Error al crear la orden');
      }
      
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
            {step === 'shipping' ? 'Información de Cliente' : 'Pago con QR - Yape/Plin'}
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
              <span className="ml-2 font-medium">Información de Cliente</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'image' ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'image' ? 'bg-teal-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Pago con Yape/Plin</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 'shipping' ? (
            /* Formulario de Cliente - DEMO VERSION */
            <form onSubmit={handleShippingSubmit} className="space-y-4"> 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="+51 999 999 999"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección Completa
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
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Lima"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código Postal
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
                  Referencia (Opcional)
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
                Continuar al Pago
              </button>
            </form>
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
                  <div><strong>Ciudad:</strong> {shippingData.city}</div>
                  <div className="md:col-span-2"><strong>Dirección:</strong> {shippingData.address}</div>
                  {shippingData.postalCode && (
                    <div><strong>Código Postal:</strong> {shippingData.postalCode}</div>
                  )}
                  {shippingData.reference && (
                    <div className="md:col-span-2"><strong>Referencia:</strong> {shippingData.reference}</div>
                  )}
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
                      <div className="flex justify-between border-t border-purple-200 pt-2">
                        <span>Subtotal</span>
                        <span>S/ {formatPrice(subtotal)}</span>
                      </div>
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
                  onClick={() => setStep('shipping')}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gray-300"
                >
                  ← Volver
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