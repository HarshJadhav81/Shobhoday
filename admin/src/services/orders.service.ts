import { api } from './api';

export const OrderService = {
  getOrders: async (params?: Record<string, any>): Promise<any> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/orders?${query}`);
    return response.data;
  },

  getOrderById: async (id: string): Promise<any> => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  updateOrderStatus: async (id: string, status: string, notes?: string): Promise<any> => {
    const response = await api.patch(`/orders/${id}`, { status, notes });
    return response.data.data;
  }
};
