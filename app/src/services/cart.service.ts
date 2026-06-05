import { api } from './api';

export const CartService = {
  getCart: async (guestId?: string) => {
    const url = guestId ? `/cart?guestId=${guestId}` : '/cart';
    const response = await api.get(url);
    return response.data.data;
  },

  addItem: async (payload: { variantId: string, quantity: number, guestId?: string }) => {
    const response = await api.post('/cart/items', payload);
    return response.data.data;
  },

  updateItem: async (itemId: string, payload: { quantity: number, guestId?: string }) => {
    const response = await api.patch(`/cart/items/${itemId}`, payload);
    return response.data.data;
  },

  removeItem: async (itemId: string, guestId?: string) => {
    const url = guestId ? `/cart/items/${itemId}?guestId=${guestId}` : `/cart/items/${itemId}`;
    const response = await api.delete(url);
    return response.data.data;
  },
  
  mergeCart: async (guestId: string) => {
    const response = await api.post('/cart/merge', { guestId });
    return response.data.data;
  }
};
