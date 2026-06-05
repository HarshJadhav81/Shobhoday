import { api } from './api';

export const CategoryService = {
  getAll: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/categories?${query}`);
    return response.data.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data.data;
  }
};
