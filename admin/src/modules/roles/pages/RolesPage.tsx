import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Loader2 } from 'lucide-react';
import { UserService } from '../../../services/users.service';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [activeRole, setActiveRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await UserService.getRoles();
      setRoles(data || []);
      if (data && data.length > 0) {
        setActiveRole(data[0]);
      }
    } catch (error) {
      console.error('Failed to load roles', error);
    } finally {
      setLoading(false);
    }
  };

  const permissionsMatrix = [
    { module: 'Products', resource: 'products', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'Categories', resource: 'categories', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'Inventory', resource: 'inventory', actions: ['view', 'update'] },
    { module: 'Orders', resource: 'orders', actions: ['view', 'update', 'refund'] },
    { module: 'Customers', resource: 'customers', actions: ['view', 'update'] },
    { module: 'Coupons', resource: 'coupons', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'Users', resource: 'users', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'Media', resource: 'media', actions: ['view', 'create', 'delete'] },
    { module: 'Settings', resource: 'settings', actions: ['manage'] },
  ];

  const hasPermission = (role: any, resource: string, action: string) => {
    if (role?.name === 'Super Admin') return true;
    if (!role?.permissions) return false;
    // Format is "resource.action" e.g., "products.create"
    return role.permissions.includes(`${resource}.${action}`);
  };

  if (loading && roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage RBAC (Role Based Access Control) boundaries</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium">
          <Plus size={18} />
          <span>Create Role</span>
        </button>
      </div>

      <div className="flex space-x-6">
        {/* Roles Sidebar */}
        <div className="w-64 space-y-2">
          <h3 className="font-semibold text-gray-900 mb-4 px-2">Defined Roles</h3>
          {roles.map(role => (
            <button
              key={role._id}
              onClick={() => setActiveRole(role)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeRole?._id === role._id ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">{activeRole?.name || 'Select a Role'} Permissions</h3>
            {activeRole?.name !== 'Super Admin' && (
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">
                Edit Permissions
              </button>
            )}
          </div>
          
          {activeRole?.name === 'Super Admin' ? (
            <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500">
              Super Admin has implicit override access to all modules and actions. Permissions cannot be edited.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm font-semibold text-gray-600">
                  <th className="py-3">Module</th>
                  <th className="py-3 text-center">View</th>
                  <th className="py-3 text-center">Create</th>
                  <th className="py-3 text-center">Edit / Update</th>
                  <th className="py-3 text-center">Delete</th>
                  <th className="py-3 text-center">Special Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permissionsMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-4 text-sm font-medium text-gray-900">{row.module}</td>
                    <td className="py-4 text-center">
                      {hasPermission(activeRole, row.resource, 'view') ? <Check size={18} className="mx-auto text-green-600" /> : <X size={18} className="mx-auto text-gray-300" />}
                    </td>
                    <td className="py-4 text-center">
                      {row.actions.includes('create') ? (
                        hasPermission(activeRole, row.resource, 'create') ? <Check size={18} className="mx-auto text-green-600" /> : <X size={18} className="mx-auto text-gray-300" />
                      ) : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="py-4 text-center">
                      {row.actions.includes('update') ? (
                        hasPermission(activeRole, row.resource, 'update') ? <Check size={18} className="mx-auto text-green-600" /> : <X size={18} className="mx-auto text-gray-300" />
                      ) : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="py-4 text-center">
                      {row.actions.includes('delete') ? (
                        hasPermission(activeRole, row.resource, 'delete') ? <Check size={18} className="mx-auto text-green-600" /> : <X size={18} className="mx-auto text-gray-300" />
                      ) : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="py-4 text-center text-xs text-gray-500">
                      {row.actions.filter(a => !['view', 'create', 'update', 'delete'].includes(a)).map(action => (
                        <span key={action} className="mr-2">
                          {action}: {hasPermission(activeRole, row.resource, action) ? <Check size={14} className="inline text-green-600" /> : <X size={14} className="inline text-gray-300" />}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
