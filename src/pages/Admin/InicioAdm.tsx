// src/pages/Admin/InicioAdm.tsx

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import apiClient from "../../services/admi/apiClient";
import { DollarSign, Users, Package, Loader2, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// --- Interfaces (iguales que antes) ---
interface KpiData {
  salesToday: number;
  pendingOrders: number;
  processingOrders: number;
  newClients: number;
}
interface ChartData {
  name: string;
  sales: number;
}
interface RecentOrder {
  id: string;
  clientName: string;
  status:
    | "Completado"
    | "Pendiente"
    | "Procesando"
    | "PAGO_EN_VERIFICACION"
    | "NO_PAGADO"
    | "CANCELADO";
  total: number;
  date: string;
}
interface DashboardData {
  kpis: KpiData;
  chartData: ChartData[];
  recentOrders: RecentOrder[];
}

const InicioAdm: React.FC = () => {
  const { adminUser } = useAdminAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<DashboardData>(
          "/admin/dashboard-summary"
        );
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos del dashboard.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // --- Estados de Carga y Error ---
  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center p-10'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-full flex-col items-center justify-center p-10'>
        <AlertCircle className='h-12 w-12 text-red-500' />
        <p className='mt-4 text-lg text-red-600'>{error}</p>
        <p className='text-gray-500'>
          Asegúrate de que el servidor backend esté corriendo.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex h-full items-center justify-center p-10'>
        <p className='text-gray-500'>No se encontraron datos.</p>
      </div>
    );
  }

  // --- Contenido del Dashboard (Tema Claro) ---
  return (
    // 💡 1. El padding está aquí (en la página)
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Encabezado */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Resumen General</h1>
        <p className='text-gray-500 mt-1'>
          Hola {adminUser?.name || "Admin"}, bienvenido de vuelta.
        </p>
      </div>

      {/* 2. Tarjetas de KPIs (Tema Claro) */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <KpiCard
          title='Ingresos de Hoy'
          value={`S/ ${data.kpis.salesToday.toFixed(2)}`}
          icon={<DollarSign className='h-6 w-6 text-green-600' />}
        />
        <KpiCard
          title='Órdenes Pendientes'
          value={data.kpis.pendingOrders.toString()}
          icon={<Package className='h-6 w-6 text-yellow-600' />}
        />
        <KpiCard
          title='En Ejecución'
          value={data.kpis.processingOrders.toString()}
          icon={<Loader2 className='h-6 w-6 text-blue-600' />}
        />
        <KpiCard
          title='Nuevos Clientes (Hoy)'
          value={data.kpis.newClients.toString()}
          icon={<Users className='h-6 w-6 text-teal-600' />}
        />
      </div>

      {/* 3. Gráfico y Órdenes (Tema Claro) */}
      <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Gráfico de Ventas (Tema Claro) */}
        <div className='lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>
            Ventas (Últimos 7 Días)
          </h2>
          <div className='h-80 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={data.chartData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                <XAxis dataKey='name' stroke='#6b7280' />
                <YAxis
                  stroke='#6b7280'
                  tickFormatter={(value) => `S/${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#111827" }}
                  itemStyle={{ color: "#1E63FF" }}
                  formatter={(value: number) => `S/ ${value.toFixed(2)}`}
                />
                <Legend wrapperStyle={{ color: "#374151" }} />
                <Line
                  type='monotone'
                  dataKey='sales'
                  stroke='#1E63FF'
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Órdenes Recientes (Tema Claro) */}
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800'>
            Órdenes Recientes
          </h2>
          <div className='overflow-y-auto h-80'>
            <table className='min-w-full'>
              <thead className='sticky top-0 bg-gray-50'>
                <tr>
                  <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    ID
                  </th>
                  <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Cliente
                  </th>
                  <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Estado
                  </th>
                  <th className='py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className='py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        #{order.id}
                      </td>
                      <td className='py-4 whitespace-nowrap text-sm text-gray-700'>
                        {order.clientName}
                      </td>
                      <td className='py-4 whitespace-nowrap text-sm'>
                        <StatusBadge status={order.status} />
                      </td>
                      <td className='py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900'>
                        S/ {order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className='py-4 text-center text-sm text-gray-500'>
                      No hay órdenes recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componentes Internos (Tema Claro) ---

const KpiCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-5 shadow-sm'>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-sm font-medium text-gray-600'>{title}</p>
        {/* 💡 Icono con fondo claro */}
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
          {icon}
        </div>
      </div>
      <span className='text-3xl font-bold text-gray-900'>{value}</span>
    </div>
  );
};

const StatusBadge: React.FC<{ status: RecentOrder["status"] }> = ({
  status,
}) => {
  let className = "px-3 py-1 inline-flex text-xs font-semibold rounded-full ";
  let text = status.replace("_", " ");

  // 💡 Badges con colores claros
  switch (status) {
    case "Completado":
      className += "bg-green-100 text-green-800";
      break;
    case "Pendiente":
      className += "bg-yellow-100 text-yellow-800";
      break;
    case "Procesando":
      className += "bg-blue-100 text-blue-800";
      break;
    case "PAGO_EN_VERIFICACION":
      className += "bg-orange-100 text-orange-800";
      text = "VERIFICANDO";
      break;
    case "NO_PAGADO":
      className += "bg-gray-100 text-gray-800";
      break;
    case "CANCELADO":
      className += "bg-red-100 text-red-800";
      break;
    default:
      className += "bg-gray-100 text-gray-800";
  }
  return <span className={className}>{text}</span>;
};

export default InicioAdm;
