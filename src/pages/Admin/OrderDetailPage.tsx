import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../services/admi/apiClient";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Upload,
  Truck,
  Eye,
  Mail,
  X,
} from "lucide-react";
import { uploadShippingReceipt, resendShippingEmail } from "../../services/shippingReceiptService";

// --- Type: OrderStatus ---
// IMPORTANTE: Usar EXACTAMENTE los mismos valores que el backend (SNAKE_CASE MAYÚSCULAS)
export type OrderStatus =
  | "NO_PAGADO"
  | "PAGO_EN_VERIFICACION"
  | "PENDIENTE"
  | "EN_EJECUCION"
  | "TERMINADO"
  | "COMPLETADO"
  | "CANCELADO";

// Etiquetas legibles para mostrar en el select (SOLO PARA UI)
// eslint-disable-next-line react-refresh/only-export-components
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NO_PAGADO: "No pagado",
  PAGO_EN_VERIFICACION: "Pago en verificación",
  PENDIENTE: "Pendiente",
  EN_EJECUCION: "En ejecución",
  TERMINADO: "Terminado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

// --- Interfaces de Datos (basadas en tu backend) ---
interface OrderItem {
  order_item_id: number;
  product_name: string;
  quantity: number;
  item_price: string;
  personalization_data: {
    image_url?: string;
    text?: string;
  } | null;
}

interface OrderDetails {
  order_id: number;
  client_id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: OrderStatus;
  total_price: string | number;
  created_at: string;
  updated_at: string;
  payment_proof_url: string | null;
  invoice_pdf_url: string | null;
  due_date: string | null;
  delivery_type: 'DELIVERY' | 'PICKUP';
  pickup_code: string | null;
  items: OrderItem[];
  // Datos de envío
  shipping_receipt_url?: string | null;
  shipping_tracking_number?: string | null;
  shipping_company?: string | null;
  shipping_destination?: string | null;
  shipping_date?: string | null;
}

// interface ErrorResponse {
//   message?: string;
// }

// Estados válidos para el admin
// const statusOptions: OrderStatus[] = [
//   "NO_PAGADO",
//   "PAGO_EN_VERIFICACION",
//   "PENDIENTE",
//   "EN_EJECUCION",
//   "TERMINADO",
//   "CANCELADO",
// ];

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Estados para la boleta de envío
  const [shippingFile, setShippingFile] = useState<File | null>(null);
  const [shippingPreview, setShippingPreview] = useState<string>('');
  const [isUploadingShipping, setIsUploadingShipping] = useState(false);
  const [shippingUploadSuccess, setShippingUploadSuccess] = useState(false);
  const [shippingUploadError, setShippingUploadError] = useState<string>('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendEmailMessage, setResendEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- Cargar Datos del Pedido ---
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`🔍 Cargando orden #${id}...`);
        const response = await apiClient.get(`/admin/orders/${id}`);
        
        console.log('📦 Respuesta completa del backend:', response.data);
        
        // Manejar diferentes formatos de respuesta del backend
        let orderData: OrderDetails;
        
        if (response.data.order && response.data.items) {
          // Formato: { order: {...}, items: [...] }
          orderData = {
            ...response.data.order,
            items: response.data.items
          };
          console.log('✅ Formato detectado: { order, items }');
        } else if (response.data.items) {
          // Formato: { ...orderFields, items: [...] }
          orderData = response.data;
          console.log('✅ Formato detectado: orden directa con items');
        } else {
          // Formato: orden directa sin items
          orderData = {
            ...response.data,
            items: []
          };
          console.log('⚠️ Formato detectado: orden sin items array');
        }
        
        console.log('✅ Orden procesada:', orderData);
        console.log('📋 Estado:', orderData.status);
        console.log('👤 Cliente:', orderData.client_name);
        console.log('📦 Items:', orderData.items?.length || 0);
        
        setOrder(orderData);
      } catch (err: any) {
        console.error("❌ Error al cargar detalle de orden:", err);
        console.error("❌ Status:", err.response?.status);
        console.error("❌ Respuesta:", err.response?.data);
        setError(err.response?.data?.message || "Error al cargar el detalle de la orden.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // 🔥 TRANSICIONES VÁLIDAS (deben coincidir con el backend)
  const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    'NO_PAGADO': ['PAGO_EN_VERIFICACION', 'CANCELADO'],
    'PAGO_EN_VERIFICACION': ['PENDIENTE', 'NO_PAGADO', 'CANCELADO'],
    'PENDIENTE': ['EN_EJECUCION', 'CANCELADO'],
    'EN_EJECUCION': ['TERMINADO', 'CANCELADO'],
    'TERMINADO': ['COMPLETADO'],
    'COMPLETADO': [],
    'CANCELADO': []
  };

  // Obtener transiciones permitidas para el estado actual
  const getAllowedTransitions = (): OrderStatus[] => {
    if (!order) return [];
    return VALID_TRANSITIONS[order.status] || [];
  };

  // --- Guardar el nuevo estado ---
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    const allowedTransitions = getAllowedTransitions();
    if (!allowedTransitions.includes(newStatus)) {
      setError(`No se puede cambiar de "${ORDER_STATUS_LABELS[order.status]}" a "${ORDER_STATUS_LABELS[newStatus]}"`);
      return;
    }

    const confirmMsg = 
      newStatus === 'EN_EJECUCION' ? '🏭 ¿Iniciar producción?\n\n✅ Se enviará email al cliente' :
      newStatus === 'TERMINADO' ? '✅ ¿Marcar como terminado?\n\n📧 El cliente será notificado' :
      newStatus === 'COMPLETADO' ? '📦 ¿Marcar como completado?\n\n🎉 Se enviará confirmación final' :
      newStatus === 'CANCELADO' ? '❌ ¿Cancelar esta orden?' :
      '¿Cambiar el estado?';
    
    if (!confirm(confirmMsg)) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 ENVIANDO CAMBIO DE ESTADO');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🆔 Order ID:', id);
      console.log('📊 Nuevo estado:', newStatus);
      console.log('📦 Body JSON:', JSON.stringify({ newStatus }, null, 2));
      console.log('🌐 URL:', `/admin/orders/${id}/status`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const response = await apiClient.patch(`/admin/orders/${id}/status`, {
        newStatus: newStatus
      });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ RESPUESTA EXITOSA:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📦 Response data:', response.data);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Actualiza el estado localmente
      setOrder({ ...order, status: newStatus });
      setSaveSuccess(true);
      
      const notificationsSent = response.data?.notifications_sent || false;
      if (notificationsSent) {
        alert('✅ Estado actualizado\n\n📧 Correo enviado al cliente');
      }

      // Oculta el "Guardado" después de 2s
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("❌ ERROR AL CAMBIAR ESTADO");
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("🔴 Status:", err.response?.status);
      console.error("🔴 Mensaje:", err.response?.data?.message);
      console.error("🔴 Data completa:", err.response?.data);
      console.error("🔴 Config enviado:", err.config?.data);
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      const msg = err.response?.data?.message || "Error al actualizar estado";
      setError(msg);
      alert(`❌ ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Funciones para Boleta de Envío ---
  const handleShippingFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setShippingUploadError('Solo se permiten archivos JPG, PNG o JPEG');
      return;
    }

    // Validar tamaño (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setShippingUploadError('El archivo debe ser menor a 10MB');
      return;
    }

    // Guardar archivo y crear preview
    setShippingFile(file);
    const previewUrl = URL.createObjectURL(file);
    setShippingPreview(previewUrl);
    setShippingUploadError('');
  };

  const handleUploadShippingReceipt = async () => {
    if (!shippingFile || !order) return;

    const confirmUpload = confirm(
      '📦 ¿Subir boleta de envío?\n\n' +
      '✅ Se extraerán los datos automáticamente con OCR\n' +
      '📧 Se enviará un email al cliente con la boleta adjunta'
    );

    if (!confirmUpload) return;

    setIsUploadingShipping(true);
    setShippingUploadError('');
    setShippingUploadSuccess(false);

    try {
      const response = await uploadShippingReceipt(order.order_id, shippingFile);
      
      // Actualizar la orden con los nuevos datos
      setOrder({
        ...order,
        shipping_receipt_url: response.shippingReceiptUrl,
        shipping_tracking_number: response.shippingData.trackingNumber,
        shipping_company: response.shippingData.company,
        shipping_destination: response.shippingData.destination,
        shipping_date: response.shippingData.shippingDate,
      });

      setShippingUploadSuccess(true);
      setShippingFile(null);
      setShippingPreview('');
      
      alert('✅ Boleta subida exitosamente\n\n📧 Email enviado al cliente');
      
      setTimeout(() => setShippingUploadSuccess(false), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al subir la boleta';
      setShippingUploadError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsUploadingShipping(false);
    }
  };

  const handleCancelShippingUpload = () => {
    setShippingFile(null);
    setShippingPreview('');
    setShippingUploadError('');
  };

  const handleResendShippingEmail = async () => {
    if (!order) return;

    const confirmResend = confirm('📧 ¿Reenviar el email de envío al cliente?');
    if (!confirmResend) return;

    setIsResendingEmail(true);
    setResendEmailMessage(null);

    try {
      const response = await resendShippingEmail(order.order_id);
      setResendEmailMessage({ 
        type: 'success', 
        text: `✅ ${response.message || 'Email reenviado exitosamente'}` 
      });
      
      // Auto-limpiar mensaje después de 3 segundos
      setTimeout(() => setResendEmailMessage(null), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al reenviar el email';
      setResendEmailMessage({ 
        type: 'error', 
        text: `❌ ${errorMessage}` 
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  // --- Estados de Carga y Error ---
  if (isLoading) {
    return (
      <div className='p-10 flex justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className='p-10 flex flex-col items-center'>
        <AlertCircle className='h-12 w-12 text-red-500' />
        <p className='text-red-600 mt-2'>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='p-10 text-center text-gray-500'>Orden no encontrada.</div>
    );
  }

  // --- Contenido Principal de la Página ---
  return (
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Botón de Volver */}
      <button
        onClick={() => navigate("/admin/ordenes")}
        className='flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mb-4'>
        <ArrowLeft size={16} />
        <span>Volver a Órdenes</span>
      </button>

      {/* Encabezado */}
      <div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Orden #{order.order_id}
          </h1>
          <p className='text-gray-500 mt-1'>
            Cliente: {order.client_name} ({order.client_email})
          </p>
          <p className='text-gray-400 text-sm mt-1'>
            Fecha:{" "}
            {new Date(order.created_at).toLocaleString("es-ES", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className='mt-4 md:mt-0'>
          {/* Aquí puedes mostrar un StatusBadge bonito */}
          <span className='inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium'>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      {/* Grid Principal */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Columna Izquierda */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Comprobante de Pago */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Comprobante de Pago
            </h2>
            {order.payment_proof_url ? (
              <a
                href={order.payment_proof_url}
                target='_blank'
                rel='noopener noreferrer'>
                <img
                  src={order.payment_proof_url}
                  alt='Comprobante de pago'
                  className='w-full max-w-sm rounded-md border'
                />
              </a>
            ) : (
              <p className='text-gray-500'>
                El cliente aún no ha subido el comprobante.
              </p>
            )}
          </div>

          {/* Artículos del Pedido */}
          <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
            <h2 className='text-xl font-semibold text-gray-800 p-6'>
              Artículos del Pedido
            </h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Producto
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Personalización
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Cant.
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {order.items.map((item) => (
                    <tr key={item.order_item_id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {item.product_name}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-700'>
                        {item.personalization_data?.image_url ? (
                          <a
                            href={item.personalization_data.image_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'>
                            Ver Logo
                          </a>
                        ) : (
                          <span className='text-gray-400'>N/A</span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        {item.quantity}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        S/ {parseFloat(item.item_price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Acciones */}
        <div className='lg:col-span-1 space-y-6'>
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm sticky top-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Gestión de Estado
            </h2>

            <div className='space-y-4'>
              {/* Estado actual */}
              <div className='p-3 bg-gray-50 rounded-md'>
                <p className='text-xs text-gray-500 mb-1'>Estado actual:</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {ORDER_STATUS_LABELS[order.status]}
                </p>
              </div>

              {/* Botones de acción según estado actual */}
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-700 mb-2'>
                  Acciones disponibles:
                </p>

                {getAllowedTransitions().length === 0 ? (
                  <p className='text-sm text-gray-500 italic'>
                    {order.status === 'COMPLETADO' 
                      ? '✅ Orden completada. No hay más acciones disponibles.'
                      : 'No hay transiciones disponibles para este estado.'}
                  </p>
                ) : (
                  getAllowedTransitions().map((nextStatus) => (
                    <button
                      key={nextStatus}
                      onClick={() => handleStatusChange(nextStatus)}
                      disabled={isSaving}
                      className={`w-full flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-white shadow-md transition-colors disabled:opacity-50
                        ${nextStatus === 'EN_EJECUCION' ? 'bg-blue-600 hover:bg-blue-700' :
                          nextStatus === 'TERMINADO' ? 'bg-green-600 hover:bg-green-700' :
                          nextStatus === 'COMPLETADO' ? 'bg-purple-600 hover:bg-purple-700' :
                          nextStatus === 'CANCELADO' ? 'bg-red-600 hover:bg-red-700' :
                          'bg-gray-600 hover:bg-gray-700'}`}>
                      {isSaving ? (
                        <Loader2 className='h-5 w-5 animate-spin' />
                      ) : (
                        <>
                          {nextStatus === 'EN_EJECUCION' && '🏭 Iniciar Producción'}
                          {nextStatus === 'TERMINADO' && '✅ Marcar Terminado'}
                          {nextStatus === 'COMPLETADO' && '📦 Marcar Completado'}
                          {nextStatus === 'CANCELADO' && '❌ Cancelar Orden'}
                          {nextStatus === 'PENDIENTE' && '✅ Aprobar Pago'}
                          {nextStatus === 'PAGO_EN_VERIFICACION' && '⏳ Enviar a Verificación'}
                          {nextStatus === 'NO_PAGADO' && '❌ Rechazar Pago'}
                        </>
                      )}
                    </button>
                  ))
                )}
              </div>

              {saveSuccess && (
                <div className='flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md'>
                  <CheckCircle size={16} />
                  <span className='text-sm'>Estado actualizado correctamente</span>
                </div>
              )}

              {error && (
                <div className='p-3 bg-red-50 text-red-700 rounded-md'>
                  <p className='text-sm whitespace-pre-line'>{error}</p>
                </div>
              )}

              {/* Información de ayuda */}
              <div className='mt-4 p-3 bg-blue-50 rounded-md'>
                <p className='text-xs text-blue-700'>
                  <strong>ℹ️ Nota:</strong> Solo se muestran las transiciones permitidas según el estado actual.
                </p>
              </div>
            </div>
          </div>

          {/* Sección de Boleta de Envío - Solo visible si la orden está COMPLETADA */}
          {order.status === 'COMPLETADO' && (
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <Truck className='w-5 h-5' />
                📦 Envío de la Orden
              </h2>

              {!order.shipping_receipt_url ? (
                // NO HAY BOLETA SUBIDA - Mostrar formulario de upload
                <div className='space-y-4'>
                  {!shippingFile ? (
                    <>
                      <input
                        type='file'
                        accept='image/jpeg,image/jpg,image/png'
                        onChange={handleShippingFileSelect}
                        className='hidden'
                        id='shipping-receipt-upload'
                      />
                      <label
                        htmlFor='shipping-receipt-upload'
                        className='border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors'>
                        <Upload className='w-12 h-12 text-gray-400 mb-3' />
                        <p className='text-sm font-medium text-gray-700 mb-1'>
                          📤 Subir Boleta de Envío
                        </p>
                        <p className='text-xs text-gray-500 text-center'>
                          Arrastra la imagen aquí o haz clic para seleccionar
                        </p>
                        <p className='text-xs text-gray-400 mt-2'>
                          Formatos: JPG, PNG, JPEG - Máx. 10MB
                        </p>
                      </label>
                    </>
                  ) : (
                    // Preview del archivo seleccionado
                    <div className='space-y-3'>
                      <div className='border rounded-lg p-4 bg-gray-50'>
                        <div className='flex items-start gap-4'>
                          <img
                            src={shippingPreview}
                            alt='Preview de boleta'
                            className='w-24 h-24 object-cover rounded border'
                          />
                          <div className='flex-1'>
                            <p className='text-sm font-medium text-gray-900'>
                              {shippingFile.name}
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>
                              {(shippingFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <button
                              onClick={handleCancelShippingUpload}
                              className='mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1'>
                              <X className='w-4 h-4' />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleUploadShippingReceipt}
                        disabled={isUploadingShipping}
                        className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                        {isUploadingShipping ? (
                          <>
                            <Loader2 className='w-5 h-5 animate-spin' />
                            Procesando...
                          </>
                        ) : (
                          <>
                            🚀 Subir y Enviar Email
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {shippingUploadError && (
                    <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                      <p className='text-sm text-red-700 flex items-center gap-2'>
                        <AlertCircle className='w-4 h-4' />
                        {shippingUploadError}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // YA HAY BOLETA SUBIDA - Mostrar información
                <div className='space-y-4'>
                  <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                    <p className='text-sm font-medium text-green-800 flex items-center gap-2 mb-3'>
                      <CheckCircle className='w-5 h-5' />
                      ✅ Boleta de Envío Registrada
                    </p>
                    <div className='space-y-2 text-sm'>
                      {order.shipping_company && (
                        <p className='text-gray-700'>
                          <strong>🚚 Empresa:</strong> {order.shipping_company}
                        </p>
                      )}
                      {order.shipping_tracking_number && (
                        <p className='text-gray-700'>
                          <strong>📦 N° de Guía:</strong> {order.shipping_tracking_number}
                        </p>
                      )}
                      {order.shipping_destination && (
                        <p className='text-gray-700'>
                          <strong>📍 Destino:</strong> {order.shipping_destination}
                        </p>
                      )}
                      {order.shipping_date && (
                        <p className='text-gray-700'>
                          <strong>📅 Fecha de Envío:</strong>{' '}
                          {new Date(order.shipping_date).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <a
                      href={order.shipping_receipt_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center gap-2 text-sm'>
                      <Eye className='w-4 h-4' />
                      Ver Boleta
                    </a>
                    <button
                      onClick={handleResendShippingEmail}
                      disabled={isResendingEmail}
                      className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed'>
                      {isResendingEmail ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Mail className='w-4 h-4' />
                      )}
                      {isResendingEmail ? 'Enviando...' : 'Reenviar Email'}
                    </button>
                  </div>

                  {resendEmailMessage && (
                    <div
                      className={`mt-3 p-3 rounded-lg border flex items-start gap-2 ${
                        resendEmailMessage.type === 'success'
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                      {resendEmailMessage.type === 'success' ? (
                        <CheckCircle className='w-5 h-5 flex-shrink-0 mt-0.5' />
                      ) : (
                        <AlertCircle className='w-5 h-5 flex-shrink-0 mt-0.5' />
                      )}
                      <p className='text-sm'>{resendEmailMessage.text}</p>
                    </div>
                  )}

                  {shippingUploadSuccess && (
                    <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                      <p className='text-sm text-green-700 flex items-center gap-2'>
                        <CheckCircle className='w-4 h-4' />
                        Boleta actualizada exitosamente
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
