import { api } from './api';

export const ProductService = {
  getAll: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/products?${query}`);
    return response.data; // { data: [...], pagination: {...} }
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data.data;
  }
};
