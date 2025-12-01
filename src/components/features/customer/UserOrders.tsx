import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { orderService, type Order } from '../../../services/orderService';
import { FaEye, FaBox, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export const UserOrders: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userOrders = await orderService.getMyOrders();
        setOrders(userOrders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('No se pudieron cargar tus pedidos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const formatPrice = (price: number | string | undefined) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(String(price || 0));
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'confirmado':
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'en_proceso':
      case 'processing':
        return <FaSpinner className="text-blue-500 animate-spin" />;
      case 'enviado':
      case 'shipped':
        return <FaBox className="text-purple-500" />;
      case 'entregado':
      case 'delivered':
        return <FaCheckCircle className="text-green-600" />;
      case 'cancelado':
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
      case 'pending':
        return 'Pendiente';
      case 'confirmado':
      case 'confirmed':
        return 'Confirmado';
      case 'en_proceso':
      case 'processing':
        return 'En Proceso';
      case 'enviado':
      case 'shipped':
        return 'Enviado';
      case 'entregado':
      case 'delivered':
        return 'Entregado';
      case 'cancelado':
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Inicia sesión para ver tus pedidos</h3>
        <p className="text-gray-600 mb-6">Necesitas estar autenticado para acceder a tu historial de pedidos.</p>
        <Link 
          to="/login" 
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FaSpinner className="mx-auto text-4xl text-teal-600 animate-spin mb-4" />
        <p className="text-gray-600">Cargando tus pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FaTimesCircle className="mx-auto text-4xl text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes pedidos aún</h3>
        <p className="text-gray-600 mb-6">Cuando realices tu primer pedido, aparecerá aquí.</p>
        <Link 
          to="/productos" 
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.order_id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {/* Header del pedido */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <span className="text-lg font-semibold text-gray-900">
                  Pedido #{order.order_id}
                </span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(order.created_at)}
              </div>
            </div>

            {/* Información del pedido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-lg font-bold text-teal-600">S/ {formatPrice(order.total_price || 0)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Tipo de Entrega</p>
                <p className="text-sm text-gray-600">
                  {order.delivery_type === 'PICKUP' ? 'Recojo en Tienda' : 'Delivery'}
                </p>
              </div>
              {order.pickup_code && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Código de Recojo</p>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {order.pickup_code}
                  </p>
                </div>
              )}
            </div>

            {/* Botón de ver detalles */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/tracking/${order.order_id}`, { 
                  state: { order: order }
                })}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
              >
                <FaEye className="text-sm" />
                <span>Ver Detalles</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};