import { create } from 'zustand';
import type { Product } from '../types'; // Importa tu tipo de Producto

// Define cómo se verá un artículo en el carrito
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define el estado y las acciones del store
interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

// --- Lógica del Store ---
export const useCartStore = create<CartState>((set) => ({
  // Estado inicial (un carrito vacío)
  items: [],

  // Acción para agregar al carrito
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Si el producto ya existe, solo aumenta la cantidad
        const updatedItems = state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { items: updatedItems };
      } else {
        // Si es un producto nuevo, lo agrega a la lista
        return { items: [...state.items, { product, quantity: 1 }] };
      }
    }),

  // (Las dejaremos aquí para el futuro)
  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  clearCart: () => set({ items: [] }),
}));