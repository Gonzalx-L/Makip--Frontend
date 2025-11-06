// Tipos de datos para el e-commerce

// Usuario
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

// Producto - Actualizado para coincidir con tu backend
export interface Product {
  product_id: number;
  category_id: number;
  name: string;
  description: string;
  base_price: number;
  min_order_quantity: number;
  base_image_url?: string;
  variants?: any; // JSON con las variantes
  personalization_metadata?: any; // JSON con metadatos de personalización
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string; // Viene del JOIN con categories
}

// Interface para crear productos (DTO)
export interface CreateProductDTO {
  category_id: number;
  name: string;
  description: string;
  base_price: number;
  min_order_quantity: number;
  variants?: any;
  personalization_metadata?: any;
}

// Interface para actualizar productos (DTO)
export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  is_active?: boolean;
}

// Carrito
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Orden
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

// Estados de autenticación
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Métricas para admin
export interface SalesMetrics {
  totalSales: number;
  totalOrders: number;
  topProducts: Product[];
  dailySales: { date: string; sales: number }[];
}