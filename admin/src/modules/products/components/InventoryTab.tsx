import React from 'react';

export const InventoryTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
        <h3 className="text-sm font-semibold text-yellow-800">Advanced Inventory</h3>
        <p className="text-sm text-yellow-700 mt-1">
          Detailed variant-level inventory is managed in the Variant Matrix. Use this tab for global product inventory rules.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Track Quantity</h4>
            <p className="text-sm text-gray-500">Automatically decrease stock when orders are placed.</p>
          </div>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-black transition-all duration-200" />
            <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Continue selling when out of stock</h4>
            <p className="text-sm text-gray-500">Allow customers to place backorders.</p>
          </div>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-black transition-all duration-200" />
            <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Global Reorder Level</label>
          <input type="number" defaultValue={10} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
          <p className="text-xs text-gray-500">Alert me when stock falls below this number.</p>
        </div>
      </div>
    </div>
  );
};
