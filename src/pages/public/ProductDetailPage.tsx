import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { productService } from '../../services/productService';
import { useCartStore } from '../../store/cartStore';
import { useAuthContext } from '../../contexts/AuthContext';
import type { ProductVariants, PersonalizationData, Product } from '../../types';

// Datos mock para cuando no hay productos en la BD
const mockProducts: Product[] = [
  { 
    product_id: 1, 
    category_id: 1,
    name: 'Muñeca Tejida', 
    description: 'Linda muñeca tejida a mano con materiales de alta calidad.',
    base_price: 39000,
    min_order_quantity: 1,
    base_image_url: 'https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Muñeca+Tejida',
    variants: {
      colores: ['Rosado', 'Azul', 'Amarillo'],
      tamaños: ['Pequeña', 'Mediana']
    },
    personalization_metadata: {
      cost: 5000,
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
    base_price: 8000,
    min_order_quantity: 5,
    base_image_url: 'https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Llavero',
    variants: {
      formas: ['Circular', 'Cuadrado', 'Corazón'],
      colores: ['Transparente', 'Blanco', 'Negro']
    },
    personalization_metadata: {
      cost: 2000,
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
    base_price: 25000,
    min_order_quantity: 1,
    base_image_url: 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=Camiseta',
    variants: {
      tallas: ['S', 'M', 'L', 'XL'],
      colores: ['Blanco', 'Negro', 'Azul', 'Rojo']
    },
    personalization_metadata: {
      cost: 8000,
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
    base_price: 15000,
    min_order_quantity: 2,
    base_image_url: 'https://via.placeholder.com/400x400/EF4444/FFFFFF?text=Taza',
    variants: {
      colores: ['Blanco', 'Negro'],
      tamaños: ['11oz', '15oz']
    },
    personalization_metadata: {
      cost: 5000,
      max_text_length: 25
    },
    is_active: true,
    category_name: 'Accesorios'
  },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { isAuthenticated } = useAuthContext();
  
  // Todos los hooks ANTES de cualquier lógica condicional
  const { data: backendProduct, loading, error } = useApi(
    () => productService.getById(Number(id || '0')), 
    [id]
  );

  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [personalization, setPersonalization] = useState<PersonalizationData>({});
  const [quantity, setQuantity] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Hook de efecto para validar campos al cargar el producto
  useEffect(() => {
    // La validación se ejecutará cuando el usuario haga clic en "Agregar al carrito"
    // Por ahora solo observamos los cambios del ID
  }, [id]);
  
  // AHORA sí podemos hacer validaciones condicionales
  // Test rápido: Si no hay ID, redirigir
  if (!id) {
    console.log('ProductDetailPage - No hay ID, redirigiendo a productos');
    navigate('/productos');
    return null;
  }

  // Usar producto del backend si existe, sino usar mock
  const product = backendProduct || mockProducts.find(p => p.product_id === Number(id));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-8 rounded"></div>
              <div className="bg-gray-300 h-4 rounded"></div>
              <div className="bg-gray-300 h-6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Early return si no hay producto y no está cargando
  if (!product && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-4">
            El producto con ID {id} no existe.
          </p>
          <button 
            onClick={() => navigate('/productos')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Ver todos los productos
          </button>
        </div>
      </div>
    );
  }

  // Early return si aún está cargando o no hay producto
  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-8 rounded"></div>
              <div className="bg-gray-300 h-4 rounded"></div>
              <div className="bg-gray-300 h-6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleVariantChange = (variantKey: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantKey]: value
    }));
    // Limpiar errores de validación al seleccionar una variante
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handlePersonalizationChange = (key: string, value: string) => {
    setPersonalization(prev => ({
      ...prev,
      [key]: value
    }));
    // Limpiar errores de validación al escribir texto personalizado
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Función helper para formatear precios (convierte centavos a soles)
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const calculatePrice = () => {
    // Asegurar que base_price es un número
    const basePrice = typeof product.base_price === 'number' ? product.base_price : parseFloat(product.base_price);
    let totalPrice = basePrice * quantity;
    
    // Agregar costo de personalización si existe
    if (product.personalization_metadata?.cost && Object.keys(personalization).length > 0) {
      const personalizationCost = typeof product.personalization_metadata.cost === 'number' 
        ? product.personalization_metadata.cost 
        : parseFloat(product.personalization_metadata.cost);
      totalPrice += personalizationCost * quantity;
    }
    
    return totalPrice;
  };

  const validateRequiredFields = () => {
    const missingFields: string[] = [];
    
    // Validar variantes requeridas
    if (product.variants) {
      Object.entries(product.variants).forEach(([variantKey, variantOptions]) => {
        if (variantOptions && variantOptions.length > 0) {
          if (!selectedVariants[variantKey]) {
            // Convertir el nombre de la variante a español
            const spanishName = variantKey === 'tallas' ? 'Talla' : 
                               variantKey === 'colores' ? 'Color' : 
                               variantKey === 'tamaños' ? 'Tamaño' : 
                               variantKey === 'formas' ? 'Forma' : 
                               variantKey.charAt(0).toUpperCase() + variantKey.slice(1);
            missingFields.push(spanishName);
          }
        }
      });
    }
    
    // Validar personalización si está disponible
    if (product.personalization_metadata && 
        product.personalization_metadata.max_text_length && 
        product.personalization_metadata.max_text_length > 0) {
      if (!personalization.text || personalization.text.trim() === '') {
        missingFields.push('Texto personalizado');
      }
    }
    
    // Actualizar el estado de errores
    setValidationErrors(missingFields);
    
    return missingFields;
  };

  const handleAddToCart = () => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      // Mostrar mensaje y redirigir al login
      const userConfirmed = confirm(
        '🔐 Necesitas iniciar sesión para agregar productos al carrito.\n\n¿Quieres ir a la página de login ahora?'
      );
      
      if (userConfirmed) {
        navigate('/login');
      }
      return;
    }

    // Validar campos requeridos
    const missingFields = validateRequiredFields();
    if (missingFields.length > 0) {
      // Los errores ya se muestran en la interfaz, simplemente evitar agregar al carrito
      return;
    }

    // Si está autenticado y todos los campos están completos, proceder normalmente
    const cartItem = {
      product,
      quantity,
      selectedVariants,
      personalization,
      calculated_price: calculatePrice()
    };

    addToCart(cartItem);
    
    // Mostrar confirmación
    alert(`✅ ¡${product.name} agregado al carrito exitosamente!`);
  };

  console.log('ProductDetailPage - Renderizando producto:', product.name);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div>
          {product.base_image_url ? (
            <img
              src={product.base_image_url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Sin imagen disponible</span>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-blue-600 font-medium">{product.category_name}</span>
            <h1 className="text-3xl font-bold text-gray-800 mt-1">{product.name}</h1>
            <p className="text-gray-600 mt-4">{product.description}</p>
          </div>

          {/* Precio */}
          <div>
            <span className="text-3xl font-bold text-gray-900">
              S/ {formatPrice(calculatePrice())}
            </span>
            {quantity > 1 && (
              <span className="text-sm text-gray-500 ml-2">
                (S/ {formatPrice(typeof product.base_price === 'number' ? product.base_price : parseFloat(product.base_price))} c/u)
              </span>
            )}
          </div>

          {/* Variantes */}
          {product.variants && Object.entries(product.variants).map(([variantKey, values]) => {
            const spanishLabel = variantKey === 'tallas' ? 'Tallas' : 
                                variantKey === 'colores' ? 'Colores' : 
                                variantKey === 'tamaños' ? 'Tamaños' : 
                                variantKey === 'formas' ? 'Formas' : 
                                variantKey.charAt(0).toUpperCase() + variantKey.slice(1);
            
            const hasError = validationErrors.includes(spanishLabel.slice(0, -1)); // Quitar la 's' final para comparar
            
            return (
              <div key={variantKey}>
                <label className={`block text-sm font-medium mb-2 ${hasError ? 'text-red-700' : 'text-gray-700'}`}>
                  {spanishLabel}: <span className="text-red-500">*</span>
                  {hasError && <span className="text-red-600 text-xs ml-1">(Requerido)</span>}
                </label>
                <div className={`flex flex-wrap gap-2 p-2 rounded-lg ${hasError ? 'bg-red-50 border border-red-200' : ''}`}>
                  {Array.isArray(values) && values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleVariantChange(variantKey, value)}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedVariants[variantKey] === value
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Personalización */}
          {product.personalization_metadata && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Personalización</h3>
              
              {/* Texto personalizado */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${validationErrors.includes('Texto personalizado') ? 'text-red-700' : 'text-gray-700'}`}>
                  Texto personalizado: <span className="text-red-500">*</span>
                  {validationErrors.includes('Texto personalizado') && <span className="text-red-600 text-xs ml-1">(Requerido)</span>}
                </label>
                <input
                  type="text"
                  value={personalization.text || ''}
                  onChange={(e) => handlePersonalizationChange('text', e.target.value)}
                  maxLength={product.personalization_metadata.max_text_length || 50}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                    validationErrors.includes('Texto personalizado')
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Ingresa tu texto aquí..."
                />
                {product.personalization_metadata.cost && (
                  <p className="text-sm text-gray-500 mt-1">
                    Costo adicional: +S/ {formatPrice(typeof product.personalization_metadata.cost === 'number' ? product.personalization_metadata.cost : parseFloat(product.personalization_metadata.cost))}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad (mínimo {product.min_order_quantity}):
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - 1))}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-lg font-semibold px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Mensaje de campos requeridos */}
          {validationErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium mb-2">
                ⚠️ Completa los siguientes campos para continuar:
              </p>
              <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isAuthenticated
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isAuthenticated ? (
              <>Agregar al Carrito - S/ {formatPrice(calculatePrice())}</>
            ) : (
              <>🔐 Inicia Sesión para Comprar - S/ {formatPrice(calculatePrice())}</>
            )}
          </button>

          {!isAuthenticated && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 text-center">
                ℹ️ <strong>¿No tienes cuenta?</strong> 
                <button 
                  onClick={() => navigate('/login')} 
                  className="text-blue-600 hover:underline ml-1"
                >
                  Inicia sesión
                </button> 
                {' '}o{' '}
                <button 
                  onClick={() => navigate('/registro')} 
                  className="text-blue-600 hover:underline"
                >
                  regístrate
                </button> 
                {' '}para realizar compras.
              </p>
            </div>
          )}

          {/* Información adicional */}
          <div className="border-t pt-6 text-sm text-gray-600">
            <p>• Precio base: S/ {formatPrice(typeof product.base_price === 'number' ? product.base_price : parseFloat(product.base_price))}</p>
            <p>• Cantidad mínima: {product.min_order_quantity} unidades</p>
            {product.personalization_metadata && (
              <p>• Personalización disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;