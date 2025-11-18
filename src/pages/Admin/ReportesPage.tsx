import React, { useState, useEffect } from "react";
// 💡 1. Corrigiendo las rutas de importación (ahora absolutas)
import apiClient from "../../services/admi/apiClient";
import StatusBadge, {
  type OrderStatus,
} from "../../components/admin/StatusBadge";
import { useDebounce } from "../../hooks/useDebounce";

// 💡 2. Corrigiendo el icono
import {
  Loader2,
  AlertCircle,
  Eye,
  Search,
  CalendarDays,
  FileText, // 👈 Este es el icono correcto
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Interface de la Orden (devuelta por el endpoint /admin/reports)
interface Order {
  order_id: number;
  client_name: string;
  client_email: string;
  status: OrderStatus;
  total_price: string | number;
  created_at: string;
}

const ReportesPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Estado para el loading del PDF
  const [isPdfLoading, setIsPdfLoading] = useState<number | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) {
          params.append("clientName", debouncedSearchTerm);
        }
        if (startDate) {
          params.append("startDate", startDate);
        }
        if (endDate) {
          params.append("endDate", endDate);
        }

        const response = await apiClient.get<Order[]>(
          `/admin/reports?${params.toString()}`
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Error al cargar el reporte de órdenes:", err);
        setError("Error al cargar los reportes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [debouncedSearchTerm, startDate, endDate]);

  // Navega a la página de detalle
  const handleViewDetails = (id: number) => {
    navigate(`/admin/ordenes/${id}`);
  };

  // Función para descargar y previsualizar el PDF
  const handlePreviewPdf = async (orderId: number) => {
    setIsPdfLoading(orderId);
    try {
      const response = await apiClient.get(`/admin/orders/${orderId}/pdf`, {
        responseType: "blob",
      });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("Error al previsualizar el PDF:", err);
      setError(`No se pudo cargar el PDF para la orden #${orderId}.`);
    } finally {
      setIsPdfLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className='p-10 flex justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Encabezado */}
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Reportes de Órdenes
        </h1>
      </div>

      {/* Muestra un error de PDF si ocurre */}
      {error && (
        <div className='mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center gap-2'>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Filtros */}
      <div className='mb-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Filtro por Cliente/ID */}
        <div className='relative'>
          <input
            type='text'
            placeholder='Buscar por Cliente o ID de Orden...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
        </div>
        {/* Filtro Desde */}
        <div className='relative'>
          <input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
          <CalendarDays className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
        </div>
        {/* Filtro Hasta */}
        <div className='relative'>
          <input
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
          <CalendarDays className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
        </div>
      </div>

      {/* Tabla */}
      <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  ID Orden
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Cliente
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Fecha
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Estado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Total
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      #{order.order_id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowcrap text-sm text-gray-700'>
                      {order.client_name}
                      <div className='text-xs text-gray-500'>
                        {order.client_email}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                      {new Date(order.created_at).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>
                      S/ {Number(order.total_price).toFixed(2)}
                    </td>

                    {/* Acciones (PDF y Ver Detalle) */}
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4'>
                      {/* Botón de PDF */}
                      <button
                        onClick={() => handlePreviewPdf(order.order_id)}
                        disabled={isPdfLoading === order.order_id}
                        className='text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50'>
                        {isPdfLoading === order.order_id ? (
                          <Loader2 size={16} className='animate-spin' />
                        ) : (
                          // 💡 3. Usando el icono corregido
                          <FileText size={16} />
                        )}
                        Ver PDF
                      </button>

                      {/* Botón de Ver Detalles */}
                      <button
                        onClick={() => handleViewDetails(order.order_id)}
                        className='text-blue-600 hover:text-blue-800 flex items-center gap-1'>
                        <Eye size={16} />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-4 text-center text-sm text-gray-500'>
                    No se encontraron órdenes con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
