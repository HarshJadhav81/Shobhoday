import { api } from './api';

export const UserService = {
  getUsers: async (params?: Record<string, any>): Promise<any> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/users?${query}`);
    return response.data;
  },

  getUserById: async (id: string): Promise<any> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  updateUserStatus: async (id: string, isActive: boolean): Promise<any> => {
    const response = await api.patch(`/users/${id}`, { isActive });
    return response.data.data;
  },

  updateUserRole: async (id: string, roleId: string): Promise<any> => {
    const response = await api.patch(`/users/${id}`, { role: roleId });
    return response.data.data;
  },

  getRoles: async (): Promise<any> => {
    const response = await api.get('/roles');
    return response.data.data;
  },
  
  createRole: async (data: any): Promise<any> => {
    const response = await api.post('/roles', data);
    return response.data.data;
  },
  
  updateRole: async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`/roles/${id}`, data);
    return response.data.data;
  }
};
