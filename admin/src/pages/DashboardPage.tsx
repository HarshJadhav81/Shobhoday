import React, { useState, useEffect } from 'react';
import { StatsCard } from '../components/ui/StatsCard';
import { DataTable } from '../components/ui/DataTable';
import { DollarSign, ShoppingCart, Users, Package, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { OrderService } from '../services/orders.service';
import { ProductService } from '../services/products.service';
import { UserService } from '../services/users.service';
import { InventoryService } from '../services/inventory.service';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  const [metrics, setMetrics] = useState({
    revenue: 0,
    ordersCount: 0,
    usersCount: 0,
    productsCount: 0,
    inventoryAlerts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // We keep mock chart data since there's no backend endpoint for historical 7-day revenue aggregates yet.
  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, usersRes, inventoryRes] = await Promise.all([
        OrderService.getOrders({ limit: 5 }),
        ProductService.getAll({ limit: 1 }), // We just need totalCount from pagination
        UserService.getUsers({ limit: 1 }), // Just need totalCount
        InventoryService.getInventory({ limit: 1000 }) // To calculate low stock
      ]);

      // Process Orders
      const ordersData = ordersRes.data || [];
      setRecentOrders(ordersData.slice(0, 5));
      
      const ordersTotalCount = ordersRes.pagination?.totalCount || ordersData.length;
      
      // Calculate revenue (this would ideally be done on the backend)
      let totalRevenue = 0;
      if (ordersRes.data) {
        // Just summing the returned orders for this mock integration
        // A real dashboard needs an aggregate endpoint.
        totalRevenue = ordersRes.data.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0);
      }

      // Process Inventory Alerts
      let lowStock = 0;
      if (inventoryRes.data) {
        inventoryRes.data.forEach((item: any) => {
          if ((item.quantity || 0) < 10) lowStock++;
        });
      }

      setMetrics({
        revenue: totalRevenue,
        ordersCount: ordersTotalCount,
        usersCount: usersRes.pagination?.totalCount || (usersRes.data || []).length,
        productsCount: productsRes.pagination?.totalCount || (productsRes.data || []).length,
        inventoryAlerts: lowStock,
      });

    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'orderId', header: 'Order ID', render: (_val: any, row: any) => <span className="font-medium text-gray-900">{row.orderNumber}</span> },
    { key: 'customer', header: 'Customer', render: (_val: any, row: any) => row.user?.name || 'Guest' },
    { key: 'total', header: 'Total', render: (_val: any, row: any) => `₹${row.totalAmount}` },
    { key: 'status', header: 'Status', render: (_val: any, row: any) => (
      <span className={`px-2 py-1 text-xs rounded-full ${row.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {row.status.toUpperCase()}
      </span>
    )}
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Live API Data</div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard title="Total Revenue" value={`₹${metrics.revenue.toLocaleString()}`} icon={<DollarSign size={24} />} />
        <StatsCard title="Total Orders" value={metrics.ordersCount.toString()} icon={<ShoppingCart size={24} />} />
        <StatsCard title="Total Users" value={metrics.usersCount.toString()} icon={<Users size={24} />} />
        <StatsCard title="Total Products" value={metrics.productsCount.toString()} icon={<Package size={24} />} />
        <StatsCard title="Inventory Alerts" value={metrics.inventoryAlerts.toString()} icon={<AlertCircle size={24} className="text-red-500" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp size={20} className="text-gray-500" />
            <h2 className="text-lg font-semibold">Revenue Trend (Mocked)</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 pb-2 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="flex-1 p-0 overflow-auto">
            {recentOrders.length > 0 ? (
              <DataTable columns={columns} data={recentOrders} />
            ) : (
              <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                <Package size={40} className="mb-2 opacity-50" />
                <p>No recent orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
