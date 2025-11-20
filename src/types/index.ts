// Tipos de datos para el e-commerce

// Usuario
export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  createdAt: Date;
}

// Categoría
export interface Category {
  category_id: number;
  name: string;
  is_active: boolean;
}

// Variantes del producto (JSON)
export interface ProductVariants {
  tallas?: string[];
  colores?: string[];
  materiales?: string[];
  [key: string]: string[] | undefined;
}

// Metadata de personalización (JSON)
export interface PersonalizationMetadata {
  cost?: number;
  coords_x?: number;
  coords_y?: number;
  max_text_length?: number;
  allows_image?: boolean;
  allowed_formats?: string[];
  [key: string]: any;
}

// Producto completo
export interface Product {
  product_id: number;
  category_id: number;
  name: string;
  description: string;
  base_price: number;
  min_order_quantity: number;
  base_image_url?: string;
  variants?: ProductVariants;
  personalization_metadata?: PersonalizationMetadata;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  category_name?: string; // Viene del JOIN con categories
}

// 💡 NUEVO: Tipo para el método de entrega
export type DeliveryMethod = 'DELIVERY' | 'PICKUP';

// Estados de pedido (ENUM) - Deben coincidir EXACTAMENTE con el backend
export type OrderStatus =
  | "NO_PAGADO"
  | "PAGO_EN_VERIFICACION"
  | "PENDIENTE"
  | "EN_EJECUCION"
  | "TERMINADO"
  | "COMPLETADO"
  | "CANCELADO";

// Datos de personalización por item (JSON)
export interface PersonalizationData {
  text?: string;
  image_url?: string;
  color?: string;
  size?: string;
  material?: string;
  [key: string]: any;
}

// Item del pedido
export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  item_price: number;
  personalization_data?: PersonalizationData;
  product?: Product; // Para mostrar datos del producto
  // 💡 SUGERENCIA: Podrías agregar aquí 'selected_variant' si lo quieres mostrar
  selected_variant?: any;
}

// Pedido completo
export interface Order {
  order_id: number;
  client_id: number;
  status: OrderStatus;
  total_price: number;
  payment_proof_url?: string;
  invoice_pdf_url?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[]; // Items del pedido
  // 💡 NUEVOS CAMPOS (Backend v1.5)
  delivery_type: DeliveryMethod;
  pickup_code?: string; // Puede venir undefined o null si es DELIVERY
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

// Carrito (actualizado)
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: { [key: string]: string }; // ej: { "talla": "M", "color": "Rojo" }
  personalization?: PersonalizationData;
  calculated_price: number; // precio base + personalizaciones
}

export interface Cart {
  items: CartItem[];
  total: number;
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
// src/types/index.ts

// Datos para iniciar sesión
export interface LoginCredentials {
  email: string;
  password: string;
}

// Datos para registrarse (Coincide con tu backend: name, email, password, phone, dni)
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  dni: string;
}

// Respuesta de autenticación del backend
export interface AuthResponse {
  message: string;
  token: string;
  client: User; // Asumiendo que ya tienes una interfaz User definida
  isNewUser?: boolean;
}
