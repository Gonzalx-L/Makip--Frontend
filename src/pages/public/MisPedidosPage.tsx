import React from 'react';
import { UserOrders } from '../../components/features/customer/UserOrders';

const MisPedidosPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-gray-600 mt-2">Aquí puedes ver el historial y estado de todos tus pedidos</p>
        </div>
        
        {/* Componente de pedidos del usuario */}
        <UserOrders />
      </div>
    </div>
  );
};

export default MisPedidosPage;