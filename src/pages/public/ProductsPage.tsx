import React, { useState, useEffect } from 'react';
import { ProductList } from '../../components/features/products/ProductList';
import bannerImage from '../../assets/banner1.jpg';
import { productService } from '../../services/productService';

const ProductsPage: React.FC = () => {
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState<string[]>(['Todas']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const products = await productService.getAll();
        const uniqueCategories: string[] = [
          'Todas',
          ...new Set(products.filter(p => p.category_name).map(p => p.category_name!))
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        // En caso de error, usar categorías por defecto
        setCategories(['Todas', 'Camisetas', 'Accesorios', 'Tazas', 'Tejidos']);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      
      {/* --- BANNER PLACEHOLDER --- */}
      <div className="w-full h-48 md:h-64 bg-gray-300 flex items-center justify-center overflow-hidden">
          <img src={bannerImage} 
          alt="Banner de Productos" 
          className="w-full h-full object-fit hover:scale-105 transition-transform duration-300" 
          />
      </div>

      {/* --- CONTENIDO DE LA PÁGINA --- */}
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Título */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center md:text-left">
          Nuestros Productos
        </h1>

        {/* --- Sección de Filtros (Corregida) --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow">
  
          {/* Filtro de Precio */}
          <div className="flex-1">
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
              Precio (Hasta S/ {maxPrice})
            </label>
            <div className="relative">
              <input 
                type="range" 
                id="precio" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                min="0"
                max="500" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))} 
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(maxPrice/500)*100}%, #E5E7EB ${(maxPrice/500)*100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>S/ 0</span>
                <span>S/ 100</span>
                <span>S/ 200</span>
                <span>S/ 300</span>
                <span>S/ 400</span>
                <span>S/ 500</span>
              </div>
            </div>
          </div>
          
          {/* Filtro de Categoría */}
          <div className="flex-1">
            <label htmlFor="categoria1" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select 
              id="categoria1" 
              className="w-full p-2.5 border border-gray-300 rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div className="flex items-end justify-center md:justify-start">
            <button
              onClick={() => {
                setMaxPrice(500);
                setSelectedCategory('Todas');
              }}
              className="w-full md:w-auto px-6 py-2.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Limpiar Filtros
            </button>
          </div>
          
        </div>
        
        {/* --- Grid de Productos --- */}
        <ProductList maxPrice={maxPrice} selectedCategory={selectedCategory} />

      </div>
    </div>
  );
};

export default ProductsPage;