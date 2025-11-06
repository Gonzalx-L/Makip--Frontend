import React, { useState } from 'react';
import { ProductList } from '../../components/features/products/ProductList';
import bannerImage from '../../assets/banner1.jpg';

const ProductsPage: React.FC = () => {
  const [maxPrice, setMaxPrice] = useState(500); 

  return (
    <div className="bg-gray-100 min-h-screen">
      
      {/* --- BANNER PLACEHOLDER --- */}
      <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
          <img src={bannerImage} 
          alt="Banner de Productos" 
          className="w-full h-64 object-fit group-hover:scale-105 transition-transform duration-300" 
          />
      </div>

      {/* --- CONTENIDO DE LA PÁGINA --- */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Nuestros Productos
        </h1>

        {/* --- Sección de Filtros (Corregida) --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow">
          
          {/* Filtro de Precio */}
          <div className="flex-1">
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
              Precio (Hasta S/ {maxPrice})
            </label>
            <input 
              type="range" 
              id="precio" 
              className="w-full"
              min="0"
              max="500" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
            />
          </div>
          
          {/* Filtro de Categoría */}
          <div className="flex-1">
            <label htmlFor="categoria1" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select id="categoria1" className="w-full p-2 border border-gray-300 rounded-md">
              <option>Todas</option>
              <option>Ropa</option>
              <option>Tejidos</option>
              <option>Tazas</option>
            </select>
          </div>
          
        </div>
        
        {/* --- Grid de Productos --- */}
        <ProductList />

      </div>
    </div>
  );
};

export default ProductsPage;