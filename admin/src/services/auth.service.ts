import { api } from './api';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      email: string;
      roles: Array<{
        name: string;
        permissions: string[];
      }>;
    };
    accessToken: string;
  };
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword: password });
  }
};
