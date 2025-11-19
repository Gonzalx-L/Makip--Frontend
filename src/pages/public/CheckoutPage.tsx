import React from 'react';
import { CartDetails } from '../../components/features/cart';

export const CartPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛒 Tu Carrito de Compras
          </h1>
          <p className="text-gray-600 text-lg">
            Revisa tus productos y procede con la compra
          </p>
        </div>

        {/* Componente principal del carrito */}
        <CartDetails />

        {/* Información adicional */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🛒 Información de Compra
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">⏱️</span>
              </div>
              <h4 className="font-semibold text-gray-900">Entrega Rápida</h4>
              <p className="text-sm text-gray-600">3-5 días hábiles</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">🔒</span>
              </div>
              <h4 className="font-semibold text-gray-900">Pago Seguro</h4>
              <p className="text-sm text-gray-600">Transacciones protegidas</p>
            </div>
          </div>
        </div>

        {/* Footer de ayuda */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            ¿Necesitas ayuda con tu pedido?
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors">
              💬 Chat en vivo
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
              📞 Llamar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};