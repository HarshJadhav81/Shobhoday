import React from 'react';

export const SEOTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
        <h3 className="text-sm font-semibold text-blue-800">Search Engine Optimization</h3>
        <p className="text-sm text-blue-600 mt-1">Configure how this product appears in Google search results.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">URL Slug</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            shobhoday.com/product/
          </span>
          <input type="text" placeholder="oversized-heavyweight-tshirt" className="flex-1 block w-full px-4 py-2 min-w-0 rounded-none rounded-r-md border border-gray-300 focus:ring-1 focus:ring-black focus:outline-none" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Meta Title</label>
        <input type="text" placeholder="Buy Oversized Heavyweight T-Shirt | Shobhoday" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
        <p className="text-xs text-gray-500">Keep it between 50-60 characters for best results.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Meta Description</label>
        <textarea rows={3} placeholder="Discover the ultimate comfort with our..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none"></textarea>
        <p className="text-xs text-gray-500">Keep it between 150-160 characters.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Keywords (Comma separated)</label>
        <input type="text" placeholder="oversized tshirt, streetwear, heavy cotton" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Canonical URL (Optional)</label>
        <input type="url" placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
      </div>
    </div>
  );
};
