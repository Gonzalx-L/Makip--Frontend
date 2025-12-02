import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import apiClient from "../../services/admi/apiClient";
import { DollarSign, Users, Package, Loader2 } from "lucide-react";

// 1. IMPORTACIONES DE POWER BI
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

// --- Interfaces ---
interface KpiData {
  salesToday: number;
  pendingOrders: number;
  processingOrders: number;
  newClients: number;
}

// Interface para la configuración de Power BI
interface EmbedConfig {
  accessToken: string;
  embedUrl: string;
  reportId: string;
}

// (Eliminamos ChartData y RecentOrder porque Power BI los reemplaza)

interface DashboardData {
  kpis: KpiData;
  // chartData y recentOrders ya no son estrictamente necesarios si el backend falla,
  // pero los dejamos por si acaso tu API los envía igual.
  chartData?: any[];
  recentOrders?: any[];
}

const InicioAdm: React.FC = () => {
  const { adminUser } = useAdminAuth();

  // Estado para los KPIs (Nativo)
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoadingKpis, setIsLoadingKpis] = useState(true);

  // Estado para Power BI
  const [embedConfig, setEmbedConfig] = useState<EmbedConfig | null>(null);
  const [pbiError, setPbiError] = useState<string | null>(null);

  // 1. EFECTO: Cargar KPIs (Datos nativos rápidos)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get<DashboardData>("/admin/dashboard-summary");
        setData(response.data);
      } catch (err) {
        console.error("Error cargando KPIs", err);
      } finally {
        setIsLoadingKpis(false);
      }
    };
    fetchDashboardData();
  }, []);

  // 2. EFECTO: Cargar Token de Power BI (CON API CLIENT - CORRECTO)
  useEffect(() => {
    const fetchEmbedToken = async () => {
      try {
        const response = await apiClient.get<EmbedConfig>('/dashboard/token');
        setEmbedConfig(response.data);
      } catch (err: any) {
        console.error("Error cargando PBI Token:", err);
        setPbiError(err.response?.data?.message || 'Error al conectar con Power BI');
      }
    };
    fetchEmbedToken();
  }, []);

  // --- Renderizado ---
  return (
    <div className='p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen'>

      {/* 1. Encabezado */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard General</h1>
        <p className='text-gray-500 mt-1'>
          Hola {adminUser?.name || "Admin"}, aquí tienes el reporte en tiempo real.
        </p>
      </div>

      {/* 2. Tarjetas de KPIs (Si están cargando, mostramos esqueletos) */}
      {isLoadingKpis || !data ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>)}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
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
            title='Nuevos Clientes'
            value={data.kpis.newClients.toString()}
            icon={<Users className='h-6 w-6 text-teal-600' />}
          />
        </div>
      )}

      {/* 3. SECCIÓN DE POWER BI (Reemplaza a los gráficos manuales) */}
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className='text-xl font-semibold text-gray-800'>Análisis Detallado (Power BI)</h2>
          <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">En vivo</span>
        </div>

        <div className='w-full h-[600px] bg-gray-50'>
          {pbiError ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {pbiError}
            </div>
          ) : embedConfig ? (
            <PowerBIEmbed
              embedConfig={{
                type: 'report',
                id: embedConfig.reportId,
                embedUrl: embedConfig.embedUrl,
                accessToken: embedConfig.accessToken,
                tokenType: models.TokenType.Embed,
                settings: {
                  panes: {
                    filters: { expanded: false, visible: false },
                    pageNavigation: { visible: true }
                  },
                  background: models.BackgroundType.Transparent,
                }
              }}
              cssClassName="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className='h-10 w-10 animate-spin text-blue-600' />
              <span className="ml-3 text-gray-500">Cargando reporte...</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

// --- Componente KpiCard (Se mantiene igual) ---
const KpiCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md'>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-sm font-medium text-gray-600'>{title}</p>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-50'>
          {icon}
        </div>
      </div>
      <span className='text-3xl font-bold text-gray-900'>{value}</span>
    </div>
  );
};

export default InicioAdm;