import { api } from './api';

export const OrderService = {
  getOrders: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/orders?${query}`);
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  }
};
