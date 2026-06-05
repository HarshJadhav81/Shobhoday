import { api } from './api';
import { useAuthStore } from '../store/useAuthStore';

export const AuthService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    const { user, accessToken } = response.data.data;
    useAuthStore.getState().setAuth({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }, accessToken);
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    const { user, accessToken } = response.data.data;
    useAuthStore.getState().setAuth({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }, accessToken);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    useAuthStore.getState().logout();
  },

  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data.data;
  }
};
