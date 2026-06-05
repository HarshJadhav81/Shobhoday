import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  guestId: string;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
}

const generateGuestId = () => {
  return 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      guestId: generateGuestId(),
      isCartOpen: false,
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: 'shobhoday-cart-storage',
      // Only persist guestId, don't persist UI state like isCartOpen
      partialize: (state) => ({ guestId: state.guestId }),
    }
  )
);
