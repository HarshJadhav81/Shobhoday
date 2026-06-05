import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission }) => {
  const { isAuthenticated, permissions } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
