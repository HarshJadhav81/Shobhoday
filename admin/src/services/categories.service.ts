import { api } from './api';
import type { Media } from './media.service';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailMedia?: Media;
  bannerMedia?: Media;
  parent?: string | Category;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  thumbnailMedia?: string;
  bannerMedia?: string;
  isActive?: boolean;
}

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    // Assuming backend uses ApiFeatures that responds with { data: [...] }
    const response = await api.get('/categories?limit=1000');
    return response.data.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  create: async (data: CategoryInput): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CategoryInput>): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};
