import React from 'react';
import { Outlet, NavLink } from 'react-router';
import { LayoutDashboard, ShoppingBag, Box, Users, Settings, Tag, MessageSquare, BarChart, Bell } from 'lucide-react';
import clsx from 'clsx';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold tracking-tight text-black">Shobhoday Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/products" icon={<ShoppingBag size={20} />} label="Products" />
          <NavItem to="/inventory" icon={<Box size={20} />} label="Inventory" />
          <NavItem to="/orders" icon={<ShoppingBag size={20} />} label="Orders" />
          <NavItem to="/customers" icon={<Users size={20} />} label="Customers" />
          <NavItem to="/coupons" icon={<Tag size={20} />} label="Coupons" />
          <NavItem to="/reviews" icon={<MessageSquare size={20} />} label="Reviews" />
          <NavItem to="/analytics" icon={<BarChart size={20} />} label="Analytics" />
        </nav>
        <div className="p-4 border-t border-gray-200">
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="text-sm text-gray-500">Breadcrumbs / Current Page</div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      clsx(
        'flex items-center space-x-3 px-3 py-2 rounded-md transition-colors font-medium text-sm',
        isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
      )
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);
