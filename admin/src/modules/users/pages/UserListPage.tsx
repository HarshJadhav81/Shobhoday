import React, { useState, useEffect } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Plus, Shield, ShieldOff, Key, Loader2 } from 'lucide-react';
import { UserService } from '../../../services/users.service';

export const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers({ limit: 100 });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    if (!confirm(`Are you sure you want to ${user.isActive ? 'suspend' : 'activate'} ${user.name}?`)) return;
    try {
      await UserService.updateUserStatus(user._id, !user.isActive);
      fetchUsers();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const columns = [
    { 
      key: 'user', 
      header: 'Admin User',
      render: (_val: any, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
            {row.name?.substring(0, 2).toUpperCase() || 'NA'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'role', 
      header: 'Role',
      render: (_val: any, row: any) => (
        <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-medium text-gray-700">
          {row.role?.name || 'No Role'}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (_val: any, row: any) => (
        <span className={`px-2 py-1 text-xs rounded-full ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.isActive ? 'Active' : 'Suspended'}
        </span>
      )
    },
    { key: 'lastLogin', header: 'Last Login', render: (_val: any, row: any) => <span className="text-gray-500 text-sm">{row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : 'Never'}</span> },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_val: any, row: any) => (
        <div className="flex space-x-2">
          <button className="p-1 text-gray-400 hover:text-black" title="Reset Password"><Key size={16} /></button>
          <button 
            onClick={() => handleToggleStatus(row)}
            className={`p-1 ${row.isActive ? 'text-gray-400 hover:text-red-600' : 'text-red-600 hover:text-green-600'}`} 
            title={row.isActive ? 'Suspend' : 'Activate'}
          >
            {row.isActive ? <ShieldOff size={16} /> : <Shield size={16} />}
          </button>
        </div>
      )
    }
  ];

  if (loading && users.length === 0) {
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform access for staff and managers</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium">
          <Plus size={18} />
          <span>Invite User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable columns={columns} data={users} />
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
        <h4 className="font-semibold mb-1 flex items-center"><Shield size={16} className="mr-2" /> Architecture Note</h4>
        <p>Creation, Editing, Suspension, and Password Resets are handled via API calls.</p>
      </div>
    </div>
  );
};
