import React, { useState, useEffect } from 'react';
import { StatsCard } from '../../../components/ui/StatsCard';
import { DataTable } from '../../../components/ui/DataTable';
import { Package, AlertTriangle, XCircle, MapPin, Loader2 } from 'lucide-react';
import { InventoryService } from '../../../services/inventory.service';

export const InventoryDashboardPage: React.FC = () => {
  const [warehouse, setWarehouse] = useState('all');
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, low: 0, out: 0 });

  useEffect(() => {
    fetchInventory();
  }, [warehouse]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = warehouse !== 'all' ? { warehouse } : {};
      const response = await InventoryService.getInventory({ ...params, limit: 100 });
      const data = response.data || [];
      
      let total = 0, low = 0, out = 0;
      data.forEach((item: any) => {
        const qty = item.quantity || 0;
        total += qty;
        if (qty === 0) out++;
        else if (qty < 10) low++;
      });
      
      setInventory(data);
      setMetrics({ total, low, out });
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'sku', header: 'SKU', render: (_val: any, row: any) => row.variant?.sku || 'N/A' },
    { key: 'product', header: 'Product', render: (_val: any, row: any) => row.product?.title || 'Unknown' },
    { key: 'warehouse', header: 'Location', render: (_val: any, row: any) => row.warehouse || 'Main Warehouse' },
    { key: 'quantity', header: 'Available', render: (val: number) => <span className={val < 10 ? 'text-red-600 font-bold' : ''}>{val}</span> },
    { key: 'status', header: 'Status', render: (_val: any, row: any) => {
      const qty = row.quantity || 0;
      const status = qty === 0 ? 'Out of Stock' : qty < 10 ? 'Low Stock' : 'In Stock';
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${status === 'In Stock' ? 'bg-green-100 text-green-800' : status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
          {status}
        </span>
      );
    }},
  ];

  if (loading && inventory.length === 0) {
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventory Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor stock levels across all locations</p>
        </div>
        <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2">
          <MapPin size={18} className="text-gray-500" />
          <select 
            value={warehouse} 
            onChange={(e) => setWarehouse(e.target.value)}
            className="bg-transparent font-medium text-sm focus:outline-none"
          >
            <option value="all">All Warehouses</option>
            <option value="Pune Hub">Pune Hub</option>
            <option value="Mumbai DC">Mumbai DC</option>
            <option value="Delhi DC">Delhi DC</option>
          </select>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Total Available Stock" value={metrics.total.toString()} icon={<Package size={24} />} />
        <StatsCard title="Low Stock Items" value={metrics.low.toString()} icon={<AlertTriangle size={24} className="text-yellow-500" />} />
        <StatsCard title="Out of Stock Items" value={metrics.out.toString()} icon={<XCircle size={24} className="text-red-500" />} />
      </div>

      {/* Alerts Table */}
      <div className="pt-4">
        <DataTable columns={columns} data={inventory} title="Inventory Levels" />
      </div>
    </div>
  );
};
