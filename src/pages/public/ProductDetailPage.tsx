import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { productService } from '../../services/productService';
import { useCartStore } from '../../store/cartStore';
import { useAuthContext } from '../../contexts/AuthContext';
import { uploadLogo, validateLogoFile } from '../../services/logoUploadService';
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PersonalizationData, Product } from '../../types';

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
      max_text_length: 15,
      allows_image: true,
      allowed_formats: ['png']
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
  const { data: backendProduct, loading } = useApi(
    () => productService.getById(Number(id || '0')), 
    [id]
  );

  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [personalization, setPersonalization] = useState<PersonalizationData>({});
  const [quantity, setQuantity] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Estados para el upload de logos
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoUploadStatus, setLogoUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [logoUploadError, setLogoUploadError] = useState<string>('');
  
  // Hook de efecto para validar campos al cargar el producto
  useEffect(() => {
    // La validación se ejecutará cuando el usuario haga clic en "Agregar al carrito"
    // Por ahora solo observamos los cambios del ID
  }, [id]);

  // Hook de efecto para establecer la cantidad mínima cuando se carga el producto
  useEffect(() => {
    const currentProduct = backendProduct || mockProducts.find(p => p.product_id === Number(id));
    if (currentProduct && currentProduct.min_order_quantity) {
      setQuantity(currentProduct.min_order_quantity);
    }
  }, [backendProduct, id]);
  
  // AHORA sí podemos hacer validaciones condicionales
  // Test rápido: Si no hay ID, redirigir
  if (!id) {
    console.log('ProductDetailPage - No hay ID, redirigiendo a productos');
    navigate('/productos');
    return null;
  }

  // Usar producto del backend si existe, sino usar mock
  const product = backendProduct || mockProducts.find(p => p.product_id === Number(id));
  
  // Debug: Ver qué datos tiene el producto
  useEffect(() => {
    if (product) {
      console.log('📦 Datos del producto:', product);
      console.log('🎨 Personalization metadata:', product.personalization_metadata);
    }
  }, [product]);

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

  // Manejar selección de archivo de logo
  const handleLogoFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar el archivo
    const validation = validateLogoFile(file);
    if (!validation.valid) {
      setLogoUploadError(validation.error || 'Archivo inválido');
      setLogoUploadStatus('error');
      return;
    }

    // Guardar el archivo y crear preview
    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    
    // Subir automáticamente
    await uploadLogoToCloud(file);
  };

  // Subir logo a Google Cloud Storage
  const uploadLogoToCloud = async (file: File) => {
    setLogoUploadStatus('uploading');
    setLogoUploadError('');

    try {
      const response = await uploadLogo(file);
      
      // Guardar la URL en personalization_data
      setPersonalization(prev => ({
        ...prev,
        image_url: response.publicUrl
      }));
      
      setLogoUploadStatus('success');
      
      // Limpiar errores de validación
      if (validationErrors.includes('Logo personalizado')) {
        setValidationErrors(prev => prev.filter(e => e !== 'Logo personalizado'));
      }
    } catch (error: any) {
      setLogoUploadError(error.message);
      setLogoUploadStatus('error');
    }
  };

  // Eliminar logo seleccionado
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setLogoUploadStatus('idle');
    setLogoUploadError('');
    setPersonalization(prev => {
      const { image_url, ...rest } = prev;
      return rest;
    });
  };

  // Función helper para formatear precios (soles)
  const formatPrice = (priceInSoles: number) => {
    return priceInSoles.toFixed(2);
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

  // Función para calcular precio por unidad (para el carrito)
  const calculateUnitPrice = () => {
    const basePrice = typeof product.base_price === 'number' ? product.base_price : parseFloat(product.base_price);
    let unitPrice = basePrice;
    
    // Agregar costo de personalización si existe
    if (product.personalization_metadata?.cost && Object.keys(personalization).length > 0) {
      const personalizationCost = typeof product.personalization_metadata.cost === 'number' 
        ? product.personalization_metadata.cost 
        : parseFloat(product.personalization_metadata.cost);
      unitPrice += personalizationCost;
    }
    
    return unitPrice;
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
    if (product.personalization_metadata) {
      // Validar texto personalizado
      if (product.personalization_metadata.max_text_length && 
          product.personalization_metadata.max_text_length > 0) {
        if (!personalization.text || personalization.text.trim() === '') {
          missingFields.push('Texto personalizado');
        }
      }
      
      // Validar logo si allows_image está habilitado
      if (product.personalization_metadata.allows_image && !personalization.image_url) {
        missingFields.push('Logo personalizado');
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
      calculated_price: calculateUnitPrice()
    };

    addToCart(cartItem);
    
    // Mostrar confirmación
    alert(`✅ ¡${product.name} agregado al carrito exitosamente!`);
  };

  console.log('ProductDetailPage - Renderizando producto:', product.name);
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Imagen del producto */}
        <div className="order-2 lg:order-1">
          {product.base_image_url ? (
            <img
              src={product.base_image_url}
              alt={product.name}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Sin imagen disponible</span>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
          <div>
            <span className="text-sm text-teal-600 font-medium">{product.category_name}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{product.name}</h1>
            <p className="text-gray-600 mt-3 md:mt-4 text-sm md:text-base">{product.description}</p>
          </div>

          {/* Precio */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              S/ {formatPrice(calculatePrice())}
            </span>
            {quantity > 1 && (
              <span className="text-xs sm:text-sm text-gray-500 ml-2 block sm:inline">
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
                <label className={`block text-sm font-medium mb-2 ${hasError ? 'text-teal-700' : 'text-gray-700'}`}>
                  {spanishLabel}: <span className="text-teal-500">*</span>
                  {hasError && <span className="text-teal-600 text-xs ml-1">(Requerido)</span>}
                </label>
                <div className={`flex flex-wrap gap-2 p-2 rounded-lg ${hasError ? 'bg-teal-50 border border-teal-200' : ''}`}>
                  {Array.isArray(values) && values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleVariantChange(variantKey, value)}
                      className={`px-3 md:px-4 py-2 rounded-lg border text-sm md:text-base ${
                        selectedVariants[variantKey] === value
                          ? 'bg-teal-500 text-white border-teal-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
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
            <div className="border-t pt-4 md:pt-6">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Personalización</h3>
              
              {/* Texto personalizado */}
              {product.personalization_metadata.max_text_length && product.personalization_metadata.max_text_length > 0 && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${validationErrors.includes('Texto personalizado') ? 'text-red-700' : 'text-gray-700'}`}>
                    Texto personalizado: <span className="text-teal-500">*</span>
                    {validationErrors.includes('Texto personalizado') && <span className="text-teal-600 text-xs ml-1">(Requerido)</span>}
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
              )}

              {/* Upload de logo PNG */}
              {product.personalization_metadata.allows_image && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${validationErrors.includes('Logo personalizado') ? 'text-red-700' : 'text-gray-700'}`}>
                    🎨 Sube tu logo (PNG): <span className="text-teal-500">*</span>
                    {validationErrors.includes('Logo personalizado') && <span className="text-teal-600 text-xs ml-1">(Requerido)</span>}
                  </label>
                  
                  {!logoFile ? (
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      validationErrors.includes('Logo personalizado')
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-teal-400 bg-gray-50'
                    }`}>
                      <input
                        type="file"
                        accept=".png,image/png"
                        onChange={handleLogoFileSelect}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Haz clic para seleccionar un archivo PNG
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          Solo archivos PNG • Máx. 5MB
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-white">
                      {/* Estado de carga */}
                      {logoUploadStatus === 'uploading' && (
                        <div className="flex items-center gap-3 mb-3 p-3 bg-blue-50 rounded-lg">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-sm text-blue-700">Subiendo logo...</span>
                        </div>
                      )}
                      
                      {/* Estado de éxito */}
                      {logoUploadStatus === 'success' && (
                        <div className="flex items-center gap-3 mb-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700">¡Logo subido exitosamente!</span>
                        </div>
                      )}
                      
                      {/* Estado de error */}
                      {logoUploadStatus === 'error' && (
                        <div className="flex items-center gap-3 mb-3 p-3 bg-red-50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-sm text-red-700">{logoUploadError}</span>
                        </div>
                      )}
                      
                      {/* Preview del logo */}
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={logoPreview}
                            alt="Preview del logo"
                            className="w-32 h-32 object-contain border border-gray-200 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {logoFile.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(logoFile.size / 1024).toFixed(2)} KB
                          </p>
                          <button
                            onClick={handleRemoveLogo}
                            className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    📌 Tu logo se subirá automáticamente a Google Cloud Storage
                  </p>
                </div>
              )}
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
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 w-10 h-10 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-base md:text-lg font-semibold px-3 md:px-4 min-w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 w-10 h-10 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Mensaje de campos requeridos */}
          {validationErrors.length > 0 && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-700 font-medium mb-2">
                Completa los siguientes campos para continuar:
              </p>
              <ul className="text-sm text-teal-600 list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-4 md:px-6 rounded-lg font-semibold transition-colors text-sm md:text-base ${
              isAuthenticated
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            {isAuthenticated ? (
              <span className="block sm:inline">
                <span className="block sm:inline">Agregar al Carrito</span>
                <span className="block sm:inline sm:ml-1">- S/ {formatPrice(calculatePrice())}</span>
              </span>
            ) : (
              <span className="block sm:inline">
                <span className="block sm:inline">Inicia Sesión para Comprar</span>
                <span className="block sm:inline sm:ml-1">- S/ {formatPrice(calculatePrice())}</span>
              </span>
            )}
          </button>

          {!isAuthenticated && (
            <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-black text-center">
                <strong>¿No tienes cuenta?</strong> 
                <button 
                  onClick={() => navigate('/login')} 
                  className="text-teal-500 hover:underline ml-1"
                >
                  Inicia sesión
                </button> 
                {' '}o{' '}
                <button 
                  onClick={() => navigate('/registro')} 
                  className="text-teal-500 hover:underline"
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