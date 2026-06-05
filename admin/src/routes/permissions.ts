export type Role = 'Staff' | 'Manager' | 'Admin' | 'SuperAdmin';
export type Action = 'view' | 'create' | 'edit' | 'delete' | 'manage' | 'refund';
export type Module = 'dashboard' | 'products' | 'categories' | 'inventory' | 'orders' | 'customers' | 'coupons' | 'reviews' | 'blogs' | 'banners' | 'analytics' | 'settings';

type PermissionMatrix = Record<Module, Record<Action, Role[]>>;

export const PERMISSIONS: PermissionMatrix = {
  dashboard: {
    view: ['Staff', 'Manager', 'Admin', 'SuperAdmin'],
    create: [], edit: [], delete: [], manage: [], refund: []
  },
  products: {
    view: ['Staff', 'Manager', 'Admin', 'SuperAdmin'],
    create: ['Manager', 'Admin', 'SuperAdmin'],
    edit: ['Manager', 'Admin', 'SuperAdmin'],
    delete: ['Admin', 'SuperAdmin'],
    manage: [], refund: []
  },
  categories: {
    view: ['Staff', 'Manager', 'Admin', 'SuperAdmin'],
    manage: ['Manager', 'Admin', 'SuperAdmin'],
    create: [], edit: [], delete: [], refund: []
  },
  inventory: {
    view: ['Staff', 'Manager', 'Admin', 'SuperAdmin'],
    edit: ['Staff', 'Manager', 'Admin', 'SuperAdmin'], // stock update
    manage: ['Admin', 'SuperAdmin'], // manage warehouses
    create: [], delete: [], refund: []
  },
  orders: {
    view: ['Staff', 'Manager', 'Admin', 'SuperAdmin'],
    edit: ['Staff', 'Manager', 'Admin', 'SuperAdmin'], // status update
    refund: ['Manager', 'Admin', 'SuperAdmin'],
    delete: ['SuperAdmin'],
    manage: [], create: []
  },
  customers: {
    view: ['Manager', 'Admin', 'SuperAdmin'],
    edit: ['Admin', 'SuperAdmin'], // edit points
    manage: ['Admin', 'SuperAdmin'], // ban/suspend
    create: [], delete: [], refund: []
  },
  coupons: {
    manage: ['Manager', 'Admin', 'SuperAdmin'],
    view: [], create: [], edit: [], delete: [], refund: []
  },
  reviews: {
    manage: ['Staff', 'Manager', 'Admin', 'SuperAdmin'], // moderate
    view: [], create: [], edit: [], delete: [], refund: []
  },
  blogs: {
    manage: ['Manager', 'Admin', 'SuperAdmin'],
    view: [], create: [], edit: [], delete: [], refund: []
  },
  banners: {
    manage: ['Manager', 'Admin', 'SuperAdmin'],
    view: [], create: [], edit: [], delete: [], refund: []
  },
  analytics: {
    view: ['Manager', 'Admin', 'SuperAdmin'],
    create: [], edit: [], delete: [], manage: [], refund: []
  },
  settings: {
    manage: ['Admin', 'SuperAdmin'],
    view: [], create: [], edit: [], delete: [], refund: []
  }
};

export const hasPermission = (userRole: Role, module: Module, action: Action): boolean => {
  const allowedRoles = PERMISSIONS[module]?.[action] || [];
  return allowedRoles.includes(userRole);
};
