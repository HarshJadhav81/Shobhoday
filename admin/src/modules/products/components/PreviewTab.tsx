import React from 'react';

export const PreviewTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-100 p-8 rounded-xl border border-gray-200 flex items-center justify-center min-h-[500px]">
        <div className="bg-white p-6 shadow-2xl rounded-lg w-full max-w-sm">
          <div className="aspect-4/5 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400">
            Primary Image
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Shobhoday Originals</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Oversized Heavyweight T-Shirt</h2>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl font-bold">₹999</span>
            <span className="text-sm text-gray-400 line-through">₹1,499</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-2">Color: Black</div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 ring-black"></div>
                <div className="w-8 h-8 rounded-full bg-white border border-gray-300"></div>
                <div className="w-8 h-8 rounded-full bg-blue-900"></div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Size</div>
              <div className="flex space-x-2">
                <div className="border border-gray-300 text-sm w-10 h-10 flex items-center justify-center rounded">S</div>
                <div className="border-2 border-black font-semibold text-sm w-10 h-10 flex items-center justify-center rounded">M</div>
                <div className="border border-gray-300 text-sm w-10 h-10 flex items-center justify-center rounded">L</div>
                <div className="border border-gray-300 text-sm w-10 h-10 flex items-center justify-center rounded">XL</div>
              </div>
            </div>
            <button className="w-full py-3 bg-black text-white font-medium rounded-md mt-4">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
