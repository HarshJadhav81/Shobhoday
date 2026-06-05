import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // Product IDs
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => set((state) => {
        if (state.items.includes(productId)) {
          return { items: state.items.filter((id) => id !== productId) };
        }
        return { items: [...state.items, productId] };
      }),
      isInWishlist: (productId) => get().items.includes(productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'wishlist-storage' }
  )
);
