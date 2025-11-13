// src/pages/Admin/OrdersPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../services/admi/apiClient";
import { Loader2, AlertCircle, Eye, Search, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge, {
  type OrderStatus,
} from "../../components/admin/StatusBadge";

// --- Interface de la Orden ---
interface Order {
  order_id: number;
  client_name: string;
  client_email: string;
  status: OrderStatus;
  total_price: string | number;
  created_at: string;
}

const OrdersPage: React.FC = () => {
  // Lista maestra
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(""); // "YYYY-MM-DD"
  const [endDate, setEndDate] = useState(""); // "YYYY-MM-DD"

  // --- Cargar Órdenes ---
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<Order[]>("/admin/orders");
        setAllOrders(response.data);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
        setError("Error al cargar las órdenes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- Lógica de Filtrado ---
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // Filtro por nombre de cliente
      if (
        searchTerm &&
        !order.client_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      const orderDate = new Date(order.created_at);

      // Filtro desde
      if (startDate) {
        const fromDate = new Date(startDate);
        fromDate.setHours(0, 0, 0, 0);
        if (orderDate < fromDate) {
          return false;
        }
      }

      // Filtro hasta
      if (endDate) {
        const toDate = new Date(endDate);
        toDate.setHours(23, 59, 59, 999);
        if (orderDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [allOrders, searchTerm, startDate, endDate]);

  const handleViewDetails = (id: number) => {
    navigate(`/admin/ordenes/${id}`);
  };

  // --- Loading / Error ---
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

  // --- UI principal ---
  return (
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Encabezado */}
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Gestión de Órdenes</h1>
      </div>

      {/* Filtros */}
      <div className='mb-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Filtro por Cliente */}
        <div className='relative'>
          <label htmlFor='search-client' className='sr-only'>
            Buscar cliente
          </label>
          <input
            type='text'
            id='search-client'
            placeholder='Buscar por cliente...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
        </div>

        {/* Filtro Desde */}
        <div className='relative'>
          <label
            htmlFor='start-date'
            className='block text-xs font-medium text-gray-500 absolute -top-2 left-2 bg-white px-1'>
            Desde
          </label>
          <input
            type='date'
            id='start-date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
          <CalendarDays className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
        </div>

        {/* Filtro Hasta */}
        <div className='relative'>
          <label
            htmlFor='end-date'
            className='block text-xs font-medium text-gray-500 absolute -top-2 left-2 bg-white px-1'>
            Hasta
          </label>
          <input
            type='date'
            id='end-date'
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      #{order.order_id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
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
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
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

export default OrdersPage;
