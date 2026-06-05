import React from 'react';
import { UploadCloud, Image as ImageIcon, Film } from 'lucide-react';

export const MediaTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Global Media */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Global Product Media</h3>
        <p className="text-sm text-gray-500 mb-4">These images appear as the primary display and are shared across all variants unless overridden.</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <UploadCloud size={40} className="text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-900">Click or drag files here to upload</p>
          <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP, MP4</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mt-6">
          {/* Placeholder uploaded images */}
          <div className="aspect-square bg-gray-200 rounded-lg flex flex-col items-center justify-center border-2 border-black relative">
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-0.5 rounded">MAIN</span>
            <ImageIcon className="text-gray-400" />
          </div>
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
            <ImageIcon className="text-gray-400" />
          </div>
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
            <Film className="text-gray-400" />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Variant Specific Media */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Variant Specific Media</h3>
            <p className="text-sm text-gray-500">Group images by color. These swap automatically on the storefront.</p>
          </div>
          <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 font-medium">Add Color Group</button>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-black ring-1 ring-gray-300"></div>
                <span className="font-medium text-sm">Black Variants</span>
              </div>
            </div>
            <div className="flex space-x-4 overflow-x-auto">
              <div className="w-24 h-24 shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer">
                <UploadCloud size={20} className="text-gray-400" />
              </div>
              <div className="w-24 h-24 shrink-0 bg-gray-200 rounded-lg border border-gray-300"></div>
              <div className="w-24 h-24 shrink-0 bg-gray-200 rounded-lg border border-gray-300"></div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-white ring-1 ring-gray-300"></div>
                <span className="font-medium text-sm">White Variants</span>
              </div>
            </div>
            <div className="flex space-x-4 overflow-x-auto">
              <div className="w-24 h-24 shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer">
                <UploadCloud size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
