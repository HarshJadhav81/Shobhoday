import { api } from './api';

export const InventoryService = {
  getInventory: async (params?: Record<string, any>): Promise<any> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/inventory?${query}`);
    return response.data;
  },

  updateStock: async (id: string, data: { quantity: number, notes?: string, type?: string }): Promise<any> => {
    const response = await api.patch(`/inventory/${id}`, data);
    return response.data.data;
  }
};
