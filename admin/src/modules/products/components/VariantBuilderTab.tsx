import React, { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Plus, Trash2, Wand2 } from 'lucide-react';

export const VariantBuilderTab: React.FC = () => {
  const [colors] = useState(['Black', 'White', 'Navy']);
  const [sizes] = useState(['S', 'M', 'L', 'XL']);
  const [variants, setVariants] = useState<any[]>([]);
  const [bulkPrice, setBulkPrice] = useState('');

  const handleGenerate = () => {
    const generated = [];
    for (const color of colors) {
      for (const size of sizes) {
        const cCode = color.substring(0, 3).toUpperCase();
        generated.push({
          id: `${cCode}-${size}`,
          sku: `OVT-${cCode}-${size}`,
          color,
          size,
          price: 999,
          comparePrice: 1499,
          costPrice: 400,
          stock: 0,
          status: 'Active'
        });
      }
    }
    setVariants(generated);
  };

  const handleBulkUpdate = () => {
    if (!bulkPrice) return;
    setVariants(variants.map(v => ({ ...v, price: parseInt(bulkPrice) })));
  };

  const columns = [
    { key: 'sku', header: 'SKU', render: (val: string) => <input type="text" defaultValue={val} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" /> },
    { key: 'color', header: 'Color' },
    { key: 'size', header: 'Size' },
    { key: 'price', header: 'Price (₹)', render: (val: number) => <input type="number" defaultValue={val} className="w-24 px-2 py-1 border border-gray-300 rounded text-sm" /> },
    { key: 'comparePrice', header: 'Compare at (₹)', render: (val: number) => <input type="number" defaultValue={val} className="w-24 px-2 py-1 border border-gray-300 rounded text-sm" /> },
    { key: 'stock', header: 'Stock', render: (val: number) => <input type="number" defaultValue={val} className="w-20 px-2 py-1 border border-gray-300 rounded text-sm" /> },
    { key: 'status', header: 'Status', render: (val: string) => (
      <select defaultValue={val} className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">
        <option>Active</option>
        <option>Draft</option>
      </select>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Variant Matrix Generator</h3>
        
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Option 1: Color</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {colors.map(c => (
                <div key={c} className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {c} <button className="ml-2 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input type="text" placeholder="Add color..." className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm" />
              <button className="px-3 py-1.5 bg-gray-200 rounded-md hover:bg-gray-300"><Plus size={16} /></button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Option 2: Size</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {sizes.map(s => (
                <div key={s} className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {s} <button className="ml-2 text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input type="text" placeholder="Add size..." className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm" />
              <button className="px-3 py-1.5 bg-gray-200 rounded-md hover:bg-gray-300"><Plus size={16} /></button>
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium w-full justify-center">
          <Wand2 size={18} />
          <span>Generate {colors.length * sizes.length} Variants</span>
        </button>
      </div>

      {variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="text-sm font-medium">Bulk Operations (Apply to all)</div>
            <div className="flex space-x-2 items-center">
              <span className="text-sm text-gray-500">Price:</span>
              <input type="number" placeholder="₹999" value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} className="w-24 px-2 py-1 border border-gray-300 rounded text-sm" />
              <button onClick={handleBulkUpdate} className="px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800">Apply</button>
            </div>
          </div>
          
          <DataTable columns={columns} data={variants} />
        </div>
      )}
    </div>
  );
};
