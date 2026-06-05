import React, { useState, useEffect } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ProductService } from '../../../services/products.service';
import type { Product } from '../../../services/products.service';

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ total: 0, lowStock: 0, outOfStock: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAll({ limit: 100 });
      const data = response.data;
      setProducts(data);
      
      // Compute metrics locally since this is just an admin dashboard phase
      let low = 0;
      let out = 0;
      data.forEach((p: any) => {
        // Find total inventory across all variants
        let totalInv = 0;
        if (p.variants && p.variants.length > 0) {
          totalInv = p.variants.reduce((acc: number, v: any) => acc + (v.inventoryQuantity || 0), 0);
        } else {
          totalInv = p.inventory || 0;
        }

        if (totalInv === 0) out++;
        else if (totalInv < 10) low++;
      });

      setMetrics({
        total: response.pagination?.totalCount || data.length,
        lowStock: low,
        outOfStock: out
      });

    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'product', 
      header: 'Product',
      render: (_val: any, row: any) => {
        const imageUrl = row.media && row.media.length > 0 ? row.media[0].secureUrl : null;
        return (
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(`/products/edit/${row._id}`)}>
            {imageUrl ? (
              <img src={imageUrl} alt={row.title} className="w-10 h-10 bg-gray-200 rounded object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded object-cover flex-shrink-0" />
            )}
            <div>
              <div className="font-medium text-gray-900">{row.title}</div>
              <div className="text-xs text-gray-500">{row.variants?.length || 0} variants</div>
            </div>
          </div>
        );
      }
    },
    { key: 'category', header: 'Category', render: (_val: any, row: any) => row.category?.name || 'Uncategorized' },
    { 
      key: 'inventory', 
      header: 'Inventory', 
      render: (_val: any, row: any) => {
        let totalInv = 0;
        if (row.variants && row.variants.length > 0) {
          totalInv = row.variants.reduce((acc: number, v: any) => acc + (v.inventoryQuantity || 0), 0);
        } else {
          totalInv = row.inventory || 0;
        }
        return <span className={totalInv < 10 ? 'text-red-600 font-medium' : ''}>{totalInv} in stock</span>;
      }
    },
    { key: 'status', header: 'Status', render: (val: string) => (
      <span className={`px-2 py-1 text-xs rounded-full ${val === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {val}
      </span>
    )},
    { 
      key: 'price', 
      header: 'Price', 
      render: (_val: any, row: any) => {
        if (row.variants && row.variants.length > 0) {
          const prices = row.variants.map((v: any) => v.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          return <span className="font-medium">₹{min === max ? min : `${min} - ₹${max}`}</span>;
        }
        return <span className="font-medium">₹{row.price || 0}</span>;
      } 
    },
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store's inventory and catalog</p>
        </div>
        <button 
          onClick={() => navigate('/products/create')}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Products</div>
          <div className="text-2xl font-bold">{metrics.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Low Stock Alerts</div>
          <div className="text-2xl font-bold text-yellow-600">{metrics.lowStock}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">{metrics.outOfStock}</div>
        </div>
      </div>

      <DataTable columns={columns} data={products} />
    </div>
  );
};
