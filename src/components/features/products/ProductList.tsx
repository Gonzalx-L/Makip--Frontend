import React from 'react';
// 1. Importamos la 'Product' interface
import type { Product } from '../../../types'; // <-- Ajusta esta ruta si es necesario
import { ProductCard } from '../../ui/products/ProductCard';

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mockProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};