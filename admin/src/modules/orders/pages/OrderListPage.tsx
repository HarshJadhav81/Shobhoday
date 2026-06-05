import React, { useState, useEffect } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Loader2 } from 'lucide-react';
import { OrderService } from '../../../services/orders.service';

export const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getOrders({ limit: 100 });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'orderId', header: 'Order ID', render: (_val: any, row: any) => <span className="font-medium text-gray-900">{row.orderNumber}</span> },
    { key: 'customer', header: 'Customer', render: (_val: any, row: any) => row.user?.name || 'Guest' },
    { key: 'date', header: 'Date', render: (_val: any, row: any) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'total', header: 'Total', render: (_val: any, row: any) => `₹${row.totalAmount}` },
    { key: 'status', header: 'Status', render: (_val: any, row: any) => (
      <span className={`px-2 py-1 text-xs rounded-full ${row.status === 'delivered' ? 'bg-green-100 text-green-800' : row.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {row.status.toUpperCase()}
      </span>
    )},
    { key: 'payment', header: 'Payment', render: (_val: any, row: any) => (
      <span className={`px-2 py-1 text-xs rounded-full ${row.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {row.paymentStatus.toUpperCase()}
      </span>
    )},
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
      </div>

      <DataTable columns={columns} data={orders} />
    </div>
  );
};
