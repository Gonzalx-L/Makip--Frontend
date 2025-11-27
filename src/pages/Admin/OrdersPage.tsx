import React, { useState, useEffect } from "react";
import apiClient from "../../services/admi/apiClient";
import { Loader2, AlertCircle, Eye, Search, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge, {
  type OrderStatus,
} from "../../components/admin/StatusBadge";
// 💡 1. Importamos el hook desde su nuevo archivo
// (Ajusta la ruta "../.." si es necesario según tu estructura)
import { useDebounce } from "../../hooks/useDebounce";

// --- Interface de la Orden ---
interface Order {
  order_id: number;
  client_id: number;
  status: OrderStatus;
  total_price: string | number;
  created_at: string;
  delivery_type?: 'DELIVERY' | 'PICKUP';
  pickup_code?: string;
  client_name?: string; // Puede venir de un JOIN
  client_email?: string; // Puede venir de un JOIN
}

// 💡 2. ELIMINAMOS la definición de useDebounce de este archivo

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryType, setDeliveryType] = useState<'ALL' | 'DELIVERY' | 'PICKUP'>('ALL');
  const [pickupCode, setPickupCode] = useState("");
  const [searchingCode, setSearchingCode] = useState(""); // Código que se está buscando activamente
  const [startDate, setStartDate] = useState(""); // "YYYY-MM-DD"
  const [endDate, setEndDate] = useState(""); // "YYYY-MM-DD"

  // Usamos el valor "debounced" para búsquedas generales
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Cargar órdenes desde el backend
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Intentando cargar órdenes del admin...');
        
        // Verificar si hay token de admin
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          throw new Error('No hay token de administrador. Por favor, inicia sesión nuevamente.');
        }
        
        // Usar diferentes endpoints según los filtros
        let response;
        let ordersData = [];
        
        if (searchingCode.trim()) {
          // Buscar por código de recojo específico
          console.log('Buscando por código:', searchingCode.trim());
          response = await apiClient.get(`/admin/orders/pickup-code/${searchingCode.trim()}`);
          console.log('Respuesta búsqueda por código:', response.data);
          
          // La respuesta tiene estructura { message, order }
          if (response.data.order) {
            ordersData = [response.data.order];
          } else {
            ordersData = [];
          }
        } else if (deliveryType !== 'ALL') {
          // Filtrar por tipo de entrega
          console.log('Filtrando por tipo:', deliveryType);
          response = await apiClient.get(`/admin/orders/delivery/${deliveryType}`);
          console.log('Respuesta filtro por tipo:', response.data);
          
          // La respuesta tiene estructura { message, deliveryType, orders }
          ordersData = response.data.orders || [];
        } else {
          // Obtener todas las órdenes
          console.log('Obteniendo todas las órdenes');
          response = await apiClient.get<Order[]>('/admin/orders');
          console.log('Respuesta todas las órdenes:', response.data);
          
          // La respuesta es directamente el array
          ordersData = response.data || [];
        }
        
        console.log('Órdenes finales a mostrar:', ordersData);
        setOrders(ordersData);
      } catch (err: any) {
        console.error("Error al cargar órdenes:", err);
        setError(`Error al cargar las órdenes: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [deliveryType, searchingCode]);

  // Efecto separado para filtros (solo se ejecuta después de la carga inicial)
  useEffect(() => {
    if (orders.length === 0) return; // No filtrar si no hay datos

    // Aquí puedes implementar filtrado local si el backend no soporta filtros
    // Por ahora, mantenemos los filtros como están
  }, [debouncedSearchTerm, startDate, endDate]);

  const handleViewDetails = (id: number) => {
    navigate(`/admin/ordenes/${id}`);
  };

  const handleSearchCode = () => {
    if (pickupCode.trim()) {
      setSearchingCode(pickupCode.trim());
      // Cambiar automáticamente a PICKUP cuando busca por código
      if (deliveryType !== 'PICKUP') {
        setDeliveryType('PICKUP');
      }
    }
  };

  const handleClearSearch = () => {
    setPickupCode("");
    setSearchingCode("");
    setDeliveryType('ALL');
  };

  // Cambiar estado de orden con notificaciones
  const handleChangeStatus = async (orderId: number, newStatus: OrderStatus) => {
    const confirmMsg = 
      newStatus === 'EN_EJECUCION' ? '🏭 ¿Iniciar producción de esta orden?\n\n✅ Se enviará correo y WhatsApp al cliente' :
      newStatus === 'TERMINADO' ? '✅ ¿Marcar como terminado?\n\n📧 El cliente será notificado que su pedido está listo' :
      newStatus === 'COMPLETADO' ? '📦 ¿Marcar como completado/entregado?\n\n🎉 Se enviará confirmación final al cliente' :
      '¿Cambiar el estado de esta orden?';
    
    if (!confirm(confirmMsg)) return;

    try {
      // 🔍 LOGS DE DEBUGGING DETALLADOS
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 [DEBUG] INICIANDO CAMBIO DE ESTADO');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('1️⃣ ID de orden:', orderId);
      console.log('2️⃣ Nuevo estado (EXACTO):', newStatus);
      console.log('3️⃣ Tipo de dato:', typeof newStatus);
      console.log('4️⃣ Tiene guion bajo:', newStatus.includes('_') ? '✅ SÍ' : '❌ NO');
      console.log('5️⃣ Es mayúscula:', newStatus === newStatus.toUpperCase() ? '✅ SÍ' : '❌ NO');
      console.log('6️⃣ Body JSON:', JSON.stringify({ newStatus }, null, 2));
      console.log('7️⃣ URL:', `http://localhost:4000/api/v1/admin/orders/${orderId}/status`);
      console.log('8️⃣ Token:', localStorage.getItem('adminToken') ? '✅ Existe' : '❌ No existe');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Endpoint correcto: PATCH /api/v1/admin/orders/:id/status
      const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
        newStatus: newStatus
      });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ RESPUESTA DEL SERVIDOR:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📦 Respuesta completa:', response.data);
      console.log('📧 Notificaciones enviadas:', response.data?.notifications_sent ? '✅ SÍ' : '❌ NO');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Verificar si las notificaciones fueron enviadas
      const notificationsSent = response.data?.notifications_sent || false;
      
      // Recargar todas las órdenes para obtener el estado actualizado del servidor
      const refreshResponse = deliveryType === 'DELIVERY' 
        ? await apiClient.get<{ message: string; deliveryType: string; orders: Order[] }>('/admin/orders/delivery/DELIVERY')
        : deliveryType === 'PICKUP'
          ? await apiClient.get<{ message: string; deliveryType: string; orders: Order[] }>('/admin/orders/delivery/PICKUP')
          : await apiClient.get<Order[]>('/admin/orders');
      
      const updatedOrders = deliveryType !== 'ALL' 
        ? (refreshResponse.data as { orders: Order[] }).orders 
        : (refreshResponse.data as Order[]);
      
      setOrders(updatedOrders);
      
      // Mensaje de éxito diferenciado
      if (notificationsSent) {
        alert(`✅ Estado actualizado exitosamente\n\n📧 Correo enviado al cliente\n📱 WhatsApp enviado\n\n🔄 Lista actualizada`);
      } else {
        alert(`✅ Estado actualizado exitosamente\n\n⚠️ Notificaciones no configuradas o no enviadas\n\n🔄 Lista actualizada`);
      }
      
    } catch (err: any) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ ERROR AL CAMBIAR ESTADO:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('🔴 Error completo:', err);
      console.error('🔴 Respuesta del servidor:', err.response?.data);
      console.error('🔴 Status HTTP:', err.response?.status);
      console.error('🔴 Mensaje:', err.response?.data?.message);
      console.error('🔴 Estados válidos del backend:', err.response?.data?.validStatuses);
      console.error('🔴 Estado actual según backend:', err.response?.data?.currentStatus);
      console.error('🔴 Transiciones permitidas:', err.response?.data?.allowedTransitions);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const errorMsg = err.response?.data?.message || err.message || 'Error desconocido';
      
      // Mostrar información detallada si es error 400
      if (err.response?.status === 400) {
        const data = err.response.data;
        let detailedMsg = `❌ ${errorMsg}\n\n`;
        
        if (data.validStatuses) {
          detailedMsg += `📋 Estados válidos:\n${data.validStatuses.join('\n')}\n\n`;
        }
        
        if (data.currentStatus && data.allowedTransitions) {
          detailedMsg += `🔄 Estado actual: ${data.currentStatus}\n`;
          detailedMsg += `✅ Transiciones permitidas:\n${data.allowedTransitions.join('\n')}`;
        }
        
        alert(detailedMsg);
      } else {
        alert(`❌ Error al actualizar el estado:\n\n${errorMsg}\n\n💡 Abre la consola del navegador (F12) para más detalles`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className='p-10 flex justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
      </div>
    );
  }
  if (error) {
    return (
      <div className='p-10 flex flex-col items-center'>
        <AlertCircle className='h-12 w-12 text-red-500' />
        <p className='mt-4 text-lg text-red-600'>{error}</p>
      </div>
    );
  }

  return (
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Encabezado */}
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Órdenes</h1>
      </div>

      {/* Filtros */}
      <div className='mb-6 space-y-4'>
        {/* Primera fila de filtros */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {/* Filtro por Tipo de Entrega */}
          <select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value as 'ALL' | 'DELIVERY' | 'PICKUP')}
            className='w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value="ALL">📦 Todos los pedidos</option>
            <option value="DELIVERY">🚚 Solo Delivery</option>
            <option value="PICKUP">🏪 Solo Recojo en tienda</option>
          </select>

          {/* Filtro por Código de Recojo */}
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <input
                type='text'
                placeholder='Código de recojo (ej: REC-A1B2)'
                value={pickupCode}
                onChange={(e) => setPickupCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchCode();
                  }
                }}
                className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 uppercase'
                style={{ textTransform: 'uppercase' }}
              />
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            </div>
            <button
              onClick={handleSearchCode}
              disabled={!pickupCode.trim()}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
            >
              <Search size={16} />
              Buscar
            </button>
            {searchingCode && (
              <button
                onClick={handleClearSearch}
                className='px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
                title='Limpiar búsqueda'
              >
                ✕
              </button>
            )}
          </div>

          {/* Botón para limpiar filtros */}
          <button
            onClick={() => {
              setDeliveryType('ALL');
              setPickupCode('');
              setSearchingCode('');
              setSearchTerm('');
              setStartDate('');
              setEndDate('');
            }}
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
          >
            🔄 Limpiar Filtros
          </button>

          {/* Estadísticas rápidas */}
          <div className='text-sm text-gray-600 flex flex-col'>
            <div className='flex items-center'>
              <span className='font-medium'>{orders.length}</span> órdenes encontradas
            </div>
            {searchingCode && (
              <div className='text-xs text-blue-600 mt-1'>
                🔍 Resultados para código: "{searchingCode}"
              </div>
            )}
          </div>
        </div>

        {/* Segunda fila - filtros de fecha y búsqueda (para uso futuro) */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4' style={{ display: 'none' }}>
          <div className='relative'>
            <input
              type='text'
              placeholder='Buscar por cliente...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
          </div>
          <div className='relative'>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            <CalendarDays className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
          </div>
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
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Código Recojo
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  Ver
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
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                      {order.client_name || `Cliente #${order.client_id}`}
                      <div className='text-xs text-gray-500'>
                        {order.client_email || 'Email no disponible'}
                      </div>
                      {order.delivery_type && (
                        <div className='text-xs text-blue-600 font-medium'>
                          {order.delivery_type === 'PICKUP' ? '📦 Recojo en tienda' : '🚚 Delivery'}
                        </div>
                      )}
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
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                      {order.pickup_code ? (
                        <span className='font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs'>
                          {order.pickup_code}
                        </span>
                      ) : (
                        <span className='text-gray-400 text-xs'>-</span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => handleViewDetails(order.order_id)}
                        className='text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-end'>
                        <Eye size={16} />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
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

export default OrdersPage;
