import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // ... other fields
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, permissions: string[]) => void;
  updateToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      permissions: [],
      isAuthenticated: false,

      setAuth: (user, token, permissions) =>
        set({
          user,
          accessToken: token,
          permissions,
          isAuthenticated: true,
        }),

      updateToken: (token) =>
        set({
          accessToken: token,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          permissions: [],
          isAuthenticated: false,
        }),
    }),
    {
      name: 'shobhoday-auth-storage', // key in localStorage
    }
  )
);
