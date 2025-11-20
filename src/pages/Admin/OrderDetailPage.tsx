import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../services/admi/apiClient";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Package,
} from "lucide-react";
import axios from "axios";

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
}

interface ErrorResponse {
  message?: string;
}

// Estados válidos para el admin
const statusOptions: OrderStatus[] = [
  "NO_PAGADO",
  "PAGO_EN_VERIFICACION",
  "PENDIENTE",
  "EN_EJECUCION",
  "TERMINADO",
  "CANCELADO",
];

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
