import React, { useState, useEffect, useMemo } from 'react';
import type { Product } from '../../../types';
import { ProductCard } from '../../ui/products/ProductCard';
import { productService } from '../../../services/productService';
import { Loader2, AlertCircle } from 'lucide-react';

// --- DATOS MOCK ACTUALIZADOS PARA NUEVA ESTRUCTURA BD ---
const mockProducts: Product[] = [
  { 
    product_id: 1, 
    category_id: 1,
    name: 'Muñeca Tejida', 
    description: 'Linda muñeca tejida a mano con materiales de alta calidad.',
    base_price: 39.00, // En soles
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
    category_name: 'Camisetas'
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
    category_name: 'Tazas'
  },
];
// --- FIN DE DATOS MOCK ---


interface ProductListProps {
  maxPrice?: number;
  selectedCategory?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  maxPrice = 500, 
  selectedCategory = 'Todas' 
}) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Intentar cargar productos reales del backend
        const products = await productService.getAll();
        setAllProducts(products);
        
      } catch (err) {
        console.error('Error al cargar productos:', err);
        // En caso de error, usar productos mock como fallback
        setError('No se pudieron cargar los productos del servidor');
        setAllProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar productos usando useMemo para optimizar rendimiento
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Filtro de precio - convertir a número si es string
      const priceInSoles = typeof product.base_price === 'string' 
        ? parseFloat(product.base_price) 
        : product.base_price;
      const meetsPriceFilter = priceInSoles <= maxPrice;
      
      // Filtro de categoría
      const meetsCategoryFilter = 
        selectedCategory === 'Todas' || 
        product.category_name === selectedCategory;
      
      // Solo mostrar productos activos
      const isActiveProduct = product.is_active !== false;
      
      return meetsPriceFilter && meetsCategoryFilter && isActiveProduct;
    });
  }, [allProducts, maxPrice, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Mostrar mensaje de error si existe, pero seguir mostrando productos */}
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">
              {error}. Mostrando productos de ejemplo.
            </p>
          </div>
        </div>
      )}
      
      {/* Mostrar información de filtros aplicados */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {filteredProducts.length} productos de {allProducts.length}
        {maxPrice < 500 && ` con precio hasta S/ ${maxPrice}`}
        {selectedCategory !== 'Todas' && ` en la categoría "${selectedCategory}"`}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con los filtros seleccionados.</p>
            <p className="text-gray-400 text-sm mt-2">Intenta ajustar el precio máximo o cambiar la categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};