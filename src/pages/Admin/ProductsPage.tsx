// src/pages/Admin/ProductsPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../services/admi/apiClient";
import {
  Loader2,
  AlertCircle,
  PlusCircle,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  product_id: number;
  name: string;
  category_name: string;
  category_id: number;
  base_price: string;
  is_active: boolean;
  min_order_quantity: number;
  base_image_url: string | null;
  description: string;
}

// El nombre del componente puede ser cualquiera; App.tsx lo importa como default
const ProductsPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const navigate = useNavigate();

  //-------------------------------------------------------
  // Cargar productos
  //-------------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<Product[]>("/products");
        setAllProducts(response.data);

        // Extraer categorías únicas
        const uniqueCategories = [
          ...new Set(response.data.map((p) => p.category_name)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //-------------------------------------------------------
  // Filtrado con useMemo
  //-------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) =>
        selectedCategory === ""
          ? true
          : product.category_name === selectedCategory
      );
  }, [allProducts, searchTerm, selectedCategory]);

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
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres desactivar este producto? (Esto lo ocultará de la tienda)"
    );
    if (!confirmDelete) return;

    try {
      // Backend: DELETE (que probablemente hace un UPDATE is_active = false)
      await apiClient.delete(`/products/${id}`);

      // Actualiza el estado local
      setAllProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.product_id === id ? { ...p, is_active: false } : p
        )
      );
    } catch (err) {
      console.error("Error al desactivar producto:", err);
      setError("Error al desactivar el producto.");
    }
  };

  const handleCreate = () => {
    navigate("/admin/productos/nuevo");
  };

  //-------------------------------------------------------
  // Loading / Error
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
  // UI
  //-------------------------------------------------------
  return (
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Header */}
      <div className='mb-6 flex flex-col md:flex-row items-center justify-between gap-4'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Gestión de Productos
        </h1>
        <button
          onClick={handleCreate}
          className='flex w-full md:w-auto items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700'>
          <PlusCircle size={18} />
          <span>Crear Producto</span>
        </button>
      </div>

      {/* Filtros */}
      <div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Filtro por Nombre */}
        <div className='relative'>
          <label htmlFor='search-product' className='sr-only'>
            Buscar producto
          </label>
          <input
            type='text'
            id='search-product'
            placeholder='Buscar por nombre...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
        </div>

        {/* Filtro por Categoría */}
        <div>
          <label htmlFor='search-category' className='sr-only'>
            Filtrar por categoría
          </label>
          <select
            id='search-category'
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'>
            <option value=''>Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
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
                    No se encontraron productos que coincidan con la búsqueda.
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

export default ProductsPage;
