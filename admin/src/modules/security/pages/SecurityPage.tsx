import React from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { ShieldCheck, LogOut, Smartphone } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const sessionColumns = [
    { key: 'device', header: 'Device', render: (val: string) => <div className="flex items-center"><Smartphone size={16} className="mr-2 text-gray-400" />{val}</div> },
    { key: 'browser', header: 'Browser' },
    { key: 'ip', header: 'IP Address' },
    { key: 'lastActive', header: 'Last Active' },
    { key: 'action', header: 'Action', render: () => <button className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"><LogOut size={14} className="mr-1" /> Revoke</button> }
  ];

  const sessionData = [
    { id: 1, device: 'MacBook Pro (macOS)', browser: 'Chrome 120.0', ip: '192.168.1.1', lastActive: 'Current Session' },
    { id: 2, device: 'iPhone 14 Pro (iOS)', browser: 'Safari 17.1', ip: '45.22.11.9', lastActive: '2 days ago' },
  ];

  const auditColumns = [
    { key: 'timestamp', header: 'Time' },
    { key: 'user', header: 'User' },
    { key: 'action', header: 'Action', render: (val: string) => <span className="font-mono text-xs bg-gray-100 px-1 rounded">{val}</span> },
    { key: 'module', header: 'Module' },
    { key: 'ip', header: 'IP' },
  ];

  const auditData = [
    { id: 1, timestamp: '2026-06-04 14:32:11', user: 'Harsh Admin', action: 'LOGIN', module: 'AUTH', ip: '192.168.1.1' },
    { id: 2, timestamp: '2026-06-04 12:10:05', user: 'Harsh Admin', action: 'UPDATE_PRODUCT', module: 'PRODUCTS', ip: '192.168.1.1' },
    { id: 3, timestamp: '2026-06-03 09:45:22', user: 'John Ops', action: 'REFUND_ORDER', module: 'ORDERS', ip: '10.0.0.45' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Security & Audit</h1>
        <p className="text-sm text-gray-500 mt-1">Manage active sessions, security policies, and system audit logs</p>
      </div>

      {/* Security Policies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><ShieldCheck className="mr-2" /> Global Security Settings</h3>
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Require 2FA for all Staff</h4>
              <p className="text-sm text-gray-500">Enforce Two-Factor Authentication via Authenticator app.</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-black focus:ring-black rounded cursor-pointer" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Session Timeout (Idle)</h4>
              <p className="text-sm text-gray-500">Automatically logout users after inactivity.</p>
            </div>
            <select className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white">
              <option>15 Minutes</option>
              <option>30 Minutes</option>
              <option>1 Hour</option>
              <option>Never</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Max Login Attempts</h4>
              <p className="text-sm text-gray-500">Lock account after consecutive failed attempts.</p>
            </div>
            <input type="number" defaultValue={5} className="w-16 px-3 py-1.5 border border-gray-300 rounded text-sm" />
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Active Sessions</h3>
          <button className="text-sm text-red-600 font-medium hover:text-red-800">Revoke All Other Devices</button>
        </div>
        <DataTable columns={sessionColumns} data={sessionData} />
      </div>

      {/* Audit Logs */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">System Audit Logs</h3>
        <DataTable columns={auditColumns} data={auditData} />
      </div>
    </div>
  );
};
