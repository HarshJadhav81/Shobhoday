import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router';
import { type Role, type Module, type Action, hasPermission } from './permissions';

interface PermissionGuardProps {
  userRole: Role;
  requiredModule: Module;
  requiredAction: Action;
  children: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ userRole, requiredModule, requiredAction, children }) => {
  if (!hasPermission(userRole, requiredModule, requiredAction)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};
