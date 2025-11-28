import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaWhatsapp, FaDownload, FaEye, FaUpload, FaSpinner } from 'react-icons/fa';
import { uploadPaymentProofPublic, uploadPaymentProof } from '../../../services/paymentProofService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { orderService, type Order } from '../../../services/orderService';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ 
  isOpen, 
  orderId, 
  onClose 
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [confetti, setConfetti] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadErrorCode, setUploadErrorCode] = useState<number | null>(null);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Al abrir el modal, traer la información completa de la orden
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(orderId);
        setOrderData(data);
      } catch (err) {
        console.warn('No se pudo obtener la orden:', err);
        setOrderData(null);
      }
    };

    if (orderId) fetchOrder();

    // Countdown para redirección automática
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleGoToTracking();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Quitar confetti después de 5 segundos
    const confettiTimer = setTimeout(() => setConfetti(false), 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(confettiTimer);
    };
  }, [isOpen]);

  const handleGoToTracking = () => {
    onClose();
    
    // Si es un pedido de recojo (PICKUP), ir al inicio en lugar de tracking
    if (orderData?.delivery_type === 'PICKUP') {
      navigate('/');
    } else {
      // Solo para delivery ir al tracking
      navigate(`/tracking?order=${orderId}`);
    }
  };

  const handleWhatsAppShare = () => {
    const message = `¡Mi pedido ${orderId} fue confirmado! 🎉 Puedes seguir el estado aquí: ${window.location.origin}/tracking?order=${orderId}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadReceipt = () => {
    // Simular descarga de comprobante
    alert('Comprobante descargado (simulación)');
  };

  const handleUploadProof = () => {
    fileInputRef.current?.click();
  };

  const { isAuthenticated } = useAuthContext();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    setUploadMessage('Subiendo comprobante...');

    try {
      let result;
      if (isAuthenticated) {
        result = await uploadPaymentProof(orderId, file);
      } else {
        result = await uploadPaymentProofPublic(orderId, file);
      }
      // actualizar info de la orden por si el backend devuelve cambios
      if (result.order) {
        try {
          const refreshed = await orderService.getOrderById(orderId);
          setOrderData(refreshed);
        } catch (refreshErr) {
          console.warn('No se pudo refrescar orden tras upload:', refreshErr);
        }
      }
      setUploadStatus('success');
      setUploadMessage(result.message);
      
      if (result.isApproved) {
        setUploadMessage('¡Pago verificado automáticamente! 🎉');
      }
    } catch (error: any) {
      setUploadStatus('error');
      const status = error?.response?.status;
      setUploadErrorCode(status || null);

      let errorMessage = error.message || 'Error al subir comprobante';

      if (status === 401) {
        errorMessage = 'Necesitas iniciar sesión para subir este comprobante.';
      } else if (status === 404) {
        errorMessage = 'No se encontró la orden. Verifica el número de pedido.';
      } else if (status === 400) {
        errorMessage = 'Archivo inválido. Sube una imagen o PDF válido.';
      } else if (error.message?.includes('token')) {
        errorMessage = 'Problema de autenticación. Inicia sesión e inténtalo de nuevo.';
      }

      setUploadMessage(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Efecto confetti */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full ${
                ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-red-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
              }`} />
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-500 scale-100">
        {/* Header con checkmark animado */}
        <div className="text-center p-8 pb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <FaCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h2>
          <p className="text-gray-600 text-lg">
            Tu pedido ha sido confirmado
          </p>
        </div>

        {/* Información del pedido */}
        <div className="px-8 pb-6">
          <div className="bg-linear-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
            <div className="text-center space-y-3">
              <div>
                <p className="text-sm text-gray-600">Número de Pedido</p>
                <p className="text-2xl font-bold text-gray-900">#{orderId}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                <div>
                  <p className="text-xs text-gray-500">Estado</p>
                  <p className="font-semibold text-green-600">{orderData?.status || 'Confirmado'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estimado</p>
                  <p className="font-semibold text-gray-700">3-5 días</p>
                </div>
                {orderData?.delivery_type && (
                  <div>
                    <p className="text-xs text-gray-500">Método</p>
                    <p className="font-semibold text-gray-700">{orderData.delivery_type === 'PICKUP' ? 'Recojo en tienda' : 'Delivery'}</p>
                  </div>
                )}
                {orderData?.pickup_code && (
                  <div>
                    <p className="text-xs text-gray-500">Código de Recojo</p>
                    <p className="font-mono text-gray-900">{orderData.pickup_code}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subir comprobante */}
        <div className="px-8 pb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <FaUpload className="mr-2 text-yellow-600" />
              Subir Comprobante de Pago
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Sube tu comprobante para acelerar la verificación del pago
            </p>
            
            {uploadStatus === 'idle' && (
              <button
                onClick={handleUploadProof}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                <FaUpload className="inline mr-2" />
                Seleccionar Comprobante
              </button>
            )}

            {uploadStatus === 'uploading' && (
              <div className="text-center py-3">
                <FaSpinner className="animate-spin inline mr-2" />
                <span className="text-gray-700">Subiendo comprobante...</span>
              </div>
            )}

            {(uploadStatus === 'success' || uploadStatus === 'error') && (
              <div className={`p-3 rounded-lg ${
                uploadStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <p className="text-sm">{uploadMessage}</p>
                {uploadStatus === 'error' && (
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleUploadProof}
                        className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Intentar de nuevo
                      </button>
                      <button
                        onClick={() => window.open(`https://wa.me/51999999999?text=${encodeURIComponent('Necesito ayuda con mi pedido ' + orderId)}`,'_blank')}
                        className="text-sm bg-transparent underline text-blue-800 ml-2"
                      >
                        Contactar soporte
                      </button>
                    </div>
                    {uploadErrorCode === 401 && (
                      <div>
                        <button
                          onClick={() => navigate('/login')}
                          className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                        >
                          Iniciar sesión
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Qué sigue */}
        <div className="px-8 pb-6">
          <h3 className="font-semibold text-gray-900 mb-4">¿Qué sigue?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">1</span>
              </div>
              <span className="text-gray-700">Sube tu comprobante de pago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">2</span>
              </div>
              <span className="text-gray-700">Verificamos el pago (automático)</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">3</span>
              </div>
              <span className="text-gray-700">Preparamos y enviamos tu pedido</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="px-8 pb-8 space-y-3">
          {/* Botón principal */}
          <button
            onClick={handleGoToTracking}
            className="w-full bg-linear-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 shadow-lg"
          >
            <FaEye className="inline mr-2" />
            {orderData?.delivery_type === 'PICKUP' ? 'Continuar Comprando' : 'Ver Estado del Pedido'}
          </button>

          {/* Botones secundarios */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <FaWhatsapp className="inline mr-2" />
              Compartir
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <FaDownload className="inline mr-2" />
              Comprobante
            </button>
          </div>

          {/* Countdown */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Redirigiendo al tracking en <span className="font-bold text-teal-600">{countdown}s</span>
            </p>
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-gray-600 underline mt-2"
            >
              Cerrar y continuar comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};