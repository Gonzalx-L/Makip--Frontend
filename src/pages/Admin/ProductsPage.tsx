import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/admi/apiClient";
import { Loader2, AlertCircle, PlusCircle, Edit, Trash2 } from "lucide-react";

interface Product {
  product_id: number;
  name: string;
  category_name: string;
  base_price: string;
  is_active: boolean;
  min_order_quantity: number;
}

const ProductsPageAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  //-------------------------------------------------------
  // Cargar productos
  //-------------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<Product[]>("/products");
        setProducts(response.data);
      } catch {
        setError("Error al cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //-------------------------------------------------------
  // Editar
  //-------------------------------------------------------
  const handleEdit = (product: Product) => {
    navigate(`/admin/productos/editar/${product.product_id}`, {
      state: { product },
    });
  };

  //-------------------------------------------------------
  // Eliminar / desactivar
  //-------------------------------------------------------
  const handleDelete = async (id: number) => {
    console.log("Desactivar producto:", id);
    // Aquí puedes llamar: await apiClient.patch(`/products/${id}/disable`)
  };

  //-------------------------------------------------------
  // Crear nuevo
  //-------------------------------------------------------
  const handleCreate = () => {
    navigate("/admin/productos/nuevo");
  };

  //-------------------------------------------------------
  // Mostrar estados de carga o error
  //-------------------------------------------------------
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
        <p className='text-red-600 mt-2'>{error}</p>
      </div>
    );
  }

  //-------------------------------------------------------
  // CONTENIDO PRINCIPAL
  //-------------------------------------------------------
  return (
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Gestión de Productos
        </h1>

        <button
          onClick={handleCreate}
          className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700'>
          <PlusCircle size={18} />
          <span>Crear Producto</span>
        </button>
      </div>

      {/* Tabla */}
      <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Nombre
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Categoría
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Precio Base
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Estado
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className='bg-white divide-y divide-gray-200'>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.product_id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {product.name}
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                      {product.category_name}
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                      S/ {parseFloat(product.base_price).toFixed(2)}
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      {product.is_active ? (
                        <span className='inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800'>
                          Activo
                        </span>
                      ) : (
                        <span className='inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700'>
                          Inactivo
                        </span>
                      )}
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4'>
                      <button
                        onClick={() => handleEdit(product)}
                        className='text-blue-600 hover:text-blue-800'>
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(product.product_id)}
                        className='text-red-600 hover:text-red-800'>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-4 text-center text-sm text-gray-500'>
                    No se encontraron productos.
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

export default ProductsPageAdmin;
