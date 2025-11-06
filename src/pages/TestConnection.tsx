import React from 'react';
import { useApi } from '../hooks/useApi';
import { productService } from '../services/productService';

export const TestConnection: React.FC = () => {
  const { data: products, loading, error } = useApi(() => productService.getAll(), []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Prueba de Conexión Backend</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Estado:</h2>
        {loading && <p className="text-blue-600">⏳ Conectando al backend...</p>}
        {error && (
          <div className="text-red-600">
            <p>❌ Error de conexión:</p>
            <pre className="bg-red-50 p-2 rounded text-sm">{error}</pre>
          </div>
        )}
        {products && (
          <p className="text-green-600">✅ ¡Conexión exitosa! Se encontraron {products.length} productos</p>
        )}
      </div>

      {products && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Productos desde Backend:</h2>
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.product_id} className="border p-3 rounded">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-semibold">S/ {product.base_price}</p>
                <p className="text-sm text-gray-500">Categoría: {product.category_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>🔗 URL del backend: http://localhost:4000/api/v1</p>
        <p>📡 Endpoint: GET /public/products</p>
      </div>
    </div>
  );
};