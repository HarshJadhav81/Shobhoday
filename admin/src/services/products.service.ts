import { api } from './api';

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  vendor: string;
  brand: string;
  category: any;
  tags: string[];
  status: string;
  price?: number; // Might come from variants depending on the backend response
  inventory?: number;
  variants?: any[];
  media?: any[];
}

export const ProductService = {
  getAll: async (params?: Record<string, any>): Promise<any> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/products?${query}`);
    return response.data; // { data: Product[], pagination: {} }
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  create: async (data: any): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data.data;
  },

  update: async (id: string, data: any): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  }
};
