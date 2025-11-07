import React from 'react';
import type { Product } from '../../../types';
import { ProductCard } from '../../ui/products/ProductCard';
import { useApi } from '../../../hooks/useApi';
import { productService } from '../../../services/productService';

// --- DATOS MOCK ACTUALIZADOS PARA NUEVA ESTRUCTURA BD ---
const mockProducts: Product[] = [
  { 
    product_id: 1, 
    category_id: 1,
    name: 'Muñeca Tejida', 
    description: 'Linda muñeca tejida a mano con materiales de alta calidad.',
    base_price: 39000, // En centavos (39.00 soles)
    min_order_quantity: 1,
    base_image_url: 'https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Muñeca+Tejida',
    variants: {
      colores: ['Rosado', 'Azul', 'Amarillo'],
      tamaños: ['Pequeña', 'Mediana']
    },
    personalization_metadata: {
      cost: 5000, // 5 soles adicionales
      max_text_length: 20
    },
    is_active: true,
    category_name: 'Tejidos'
  },
  { 
    product_id: 2,
    category_id: 2, 
    name: 'Llaveros Personalizados', 
    description: 'Llaveros acrílicos con tu nombre o logo personalizado.',
    base_price: 8000, // 8 soles
    min_order_quantity: 5,
    base_image_url: 'https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Llavero',
    variants: {
      formas: ['Circular', 'Cuadrado', 'Corazón'],
      colores: ['Transparente', 'Blanco', 'Negro']
    },
    personalization_metadata: {
      cost: 2000, // 2 soles adicionales
      max_text_length: 15
    },
    is_active: true,
    category_name: 'Accesorios'
  },
  { 
    product_id: 3,
    category_id: 3,
    name: 'Camisetas Personalizadas', 
    description: 'Camisetas de algodón 100% con estampado personalizable.',
    base_price: 25000, // 25 soles
    min_order_quantity: 1,
    base_image_url: 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=Camiseta',
    variants: {
      tallas: ['S', 'M', 'L', 'XL'],
      colores: ['Blanco', 'Negro', 'Azul', 'Rojo']
    },
    personalization_metadata: {
      cost: 8000, // 8 soles adicionales
      max_text_length: 30
    },
    is_active: true,
    category_name: 'Ropa'
  },
  { 
    product_id: 4,
    category_id: 2,
    name: 'Tazas Sublimadas', 
    description: 'Tazas de cerámica con sublimación de alta calidad.',
    base_price: 15000, // 15 soles
    min_order_quantity: 2,
    base_image_url: 'https://via.placeholder.com/400x400/EF4444/FFFFFF?text=Taza',
    variants: {
      colores: ['Blanco', 'Negro'],
      tamaños: ['11oz', '15oz']
    },
    personalization_metadata: {
      cost: 5000, // 5 soles adicionales
      max_text_length: 25
    },
    is_active: true,
    category_name: 'Accesorios'
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
            <ProductCard key={product.product_id} product={product} />
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
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};