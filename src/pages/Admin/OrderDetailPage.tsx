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
// Si quieres centralizar, colócalo en /types/OrderStatus.ts y exporta desde ahí
export type OrderStatus =
  | "NO_PAGADO"
  | "PAGO_EN_VERIFICACION"
  | "PENDIENTE"
  | "EN_EJECUCION"
  | "TERMINADO"
  | "CANCELADO";

// Etiquetas legibles para mostrar en el select
// eslint-disable-next-line react-refresh/only-export-components
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NO_PAGADO: "No pagado",
  PAGO_EN_VERIFICACION: "Pago en verificación",
  PENDIENTE: "Pendiente",
  EN_EJECUCION: "En ejecución",
  TERMINADO: "Terminado",
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
  client_name: string;
  client_email: string;
  status: OrderStatus;
  total_price: string | number;
  created_at: string;
  payment_proof_url: string | null;
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

  // Inicializa con "" para el select, pero el tipo ahora es OrderStatus | ""
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- Cargar Datos del Pedido ---
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<OrderDetails>(
          `/admin/orders/${id}`
        );
        setOrder(response.data);
        setSelectedStatus(response.data.status); // Setea el dropdown al estado actual
      } catch (err) {
        console.error("Error al cargar detalle de orden:", err);
        setError("Error al cargar el detalle de la orden.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // --- Guardar el nuevo estado ---
  const handleStatusChange = async () => {
    if (!order) return;
    if (!selectedStatus || selectedStatus === order.status) {
      return; // No hacer nada si no hay cambio
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      await apiClient.patch(`/admin/orders/${id}/status`, {
        status: selectedStatus,
      });

      // Actualiza el estado localmente
      setOrder({ ...order, status: selectedStatus as OrderStatus });
      setSaveSuccess(true);

      // Oculta el "Guardado" después de 2s
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: unknown) {
      console.error("Error al actualizar estado:", err);
      let msg = "Error al guardar.";
      if (axios.isAxiosError(err) && err.response) {
        msg =
          (err.response.data as ErrorResponse)?.message ||
          `Error: ${err.response.status}`;
      }
      setError(msg);
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
              Acciones
            </h2>

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='order_status'
                  className='block text-sm font-medium text-gray-700'>
                  Cambiar Estado del Pedido
                </label>
                <select
                  id='order_status'
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as OrderStatus)
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'>
                  <option value='' disabled>
                    Selecciona un estado
                  </option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {ORDER_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleStatusChange}
                disabled={
                  isSaving || !selectedStatus || selectedStatus === order.status
                }
                className='w-full flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 disabled:opacity-50'>
                {isSaving ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : saveSuccess ? (
                  <CheckCircle className='h-5 w-5' />
                ) : (
                  <Package className='h-5 w-5 mr-2' />
                )}
                <span className='ml-2'>
                  {isSaving
                    ? "Guardando..."
                    : saveSuccess
                    ? "Guardado"
                    : "Guardar Cambios"}
                </span>
              </button>

              {error && <p className='text-sm text-red-600'>{error}</p>}

              {/* Aviso contextual */}
              {selectedStatus === "EN_EJECUCION" &&
                order.status !== "EN_EJECUCION" && (
                  <p className='text-sm text-blue-600'>
                    Al pasar a "En ejecución" puedes coordinar la generación del
                    mockup y contacto con el cliente.
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
