import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Assuming backend runs on 5001 locally as per previous phases
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for refresh token cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 token refreshes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a public storefront request that shouldn't trigger a refresh
    const isPublicCatalogRequest = 
      originalRequest.url?.includes('/products') || 
      originalRequest.url?.includes('/categories');
    
    // If error is 401 and we haven't retried yet, and it's not a public request
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicCatalogRequest) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        // The refresh endpoint uses the httpOnly cookie automatically because of withCredentials
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        const newAccessToken = res.data.data.accessToken;
        
        // Update global store
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user!,
          newAccessToken
        );
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed (e.g. refresh token expired)
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
