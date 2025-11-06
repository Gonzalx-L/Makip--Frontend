import React from 'react';
import type { Product } from '../../../types';
import { ProductCard } from '../../ui/products/ProductCard';
import { useApi } from '../../../hooks/useApi';
import { productService } from '../../../services/productService';

// --- NUESTROS DATOS "MOCK" ACTUALIZADOS ---
// Ahora coinciden con tu 'Product interface'
const mockProducts: Product[] = [
  { 
    id: '1', 
    name: 'Muñeca Tejida', 
    description: 'Linda muñeca tejida a mano.',
    price: 39.00, 
    images: [], // <-- Dejamos el array vacío, como pediste
    category: 'tejidos',
    stock: 10,
    featured: true,
    createdAt: new Date()
  },
  { 
    id: '2', 
    name: 'Llaveros Personalizados', 
    description: 'Llaveros con tu nombre o logo.',
    price: 35.00, 
    images: [], 
    category: 'accesorios',
    stock: 20,
    featured: true,
    createdAt: new Date()
  },
  { 
    id: '3', 
    name: 'Polos Estilosos', 
    description: 'Polos de algodón con diseños únicos.',
    price: 37.00, 
    images: [], 
    category: 'ropa',
    stock: 15,
    featured: false,
    createdAt: new Date()
  },
  { 
    id: '4', 
    name: 'Polos Estampados', 
    description: 'Estampa lo que quieras en tu polo.',
    price: 29.00, 
    images: [], 
    category: 'ropa',
    stock: 30,
    featured: true,
    createdAt: new Date()
  },
];
// --- FIN DE DATOS MOCK ---


export const ProductList: React.FC = () => {
  // Usar el servicio real cuando esté disponible el backend
  const { data: products, loading, error } = useApi(() => productService.getAll(), []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error al cargar productos: {error}</p>
        <p className="text-gray-600">Mostrando productos de ejemplo:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  // Usar productos del backend si están disponibles, sino usar mock
  const productsToShow = products || mockProducts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {productsToShow.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};