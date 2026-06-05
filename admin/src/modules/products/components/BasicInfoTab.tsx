import React from 'react';

export const BasicInfoTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Product Title</label>
        <input type="text" placeholder="e.g. Oversized Heavyweight T-Shirt" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <input type="text" placeholder="e.g. Shobhoday Originals" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none bg-white">
            <option>Unisex</option>
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none bg-white">
            <option>T-Shirts</option>
            <option>Hoodies</option>
            <option>Bottoms</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Sub-Category</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none bg-white">
            <option>Oversized</option>
            <option>Regular Fit</option>
            <option>Drop Shoulder</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Short Description</label>
        <textarea rows={2} placeholder="A brief summary..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none"></textarea>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rich Text Description</label>
        {/* Placeholder for rich text editor */}
        <div className="border border-gray-300 rounded-md p-2 bg-gray-50 h-48 flex items-center justify-center text-gray-400">
          Rich Text Editor (e.g. Quill / TipTap) Placeholder
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Material</label>
          <input type="text" placeholder="e.g. 100% Cotton" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Fit Type</label>
          <input type="text" placeholder="e.g. Oversized" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <input type="text" placeholder="summer, casual, street" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
      </div>
    </div>
  );
};
