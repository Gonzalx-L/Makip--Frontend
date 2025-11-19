import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '../types';

// Define el estado y las acciones del store
interface CartState {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  decreaseQuantity: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  getTotalPrice: () => number;
}

// --- Lógica del Store con Persistencia ---
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
  // Estado inicial (un carrito vacío)
  items: [],

  // Acción para agregar al carrito
  addToCart: (product) =>
    set((state) => {
      // Use product.product_id as unique identifier
      const existingItem = state.items.find(
        (item) => item.product.product_id === product.product.product_id
      );

      if (existingItem) {
        // Si el producto ya existe, solo aumenta la cantidad
        const updatedItems = state.items.map((item) =>
          item.product.product_id === product.product.product_id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
        return { items: updatedItems };
      } else {
        // Si es un producto nuevo, lo agrega a la lista
        return { items: [...state.items, product] };
      }
    }),

  // Acción para disminuir la cantidad de un producto
  decreaseQuantity: (productId) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.product.product_id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
        .filter((item) => item.quantity > 0); // Filtra los items que lleguen a 0

      return { items: updatedItems };
    }),

  // Acción para aumentar la cantidad de un producto
  increaseQuantity: (productId) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.product.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { items: updatedItems };
    }),

  // Acción para eliminar un producto del carrito
  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.product_id !== productId),
    })),
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    const items = get().items || [];
    return items.reduce((acc, item) => {
      const unit =
        typeof item.calculated_price === 'number'
          ? item.calculated_price
          : // fallback to product base_price or 0
            (item.product && (item.product.base_price as number)) || 0;
      return acc + unit * item.quantity;
    }, 0);
  },
    }),
    {
      name: 'makip-cart-storage', // nombre único para la clave en localStorage
      storage: createJSONStorage(() => localStorage), // usar localStorage
      // Solo persistir los items, no las funciones
      partialize: (state) => ({ items: state.items }),
    }
  )
);