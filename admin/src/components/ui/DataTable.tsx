import React from 'react';
import { ChevronDown, Search, Filter, Download, MoreHorizontal } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onRowClick?: (row: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, title }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="p-4 w-12"><input type="checkbox" className="rounded text-black focus:ring-black" /></th>
              {columns.map(col => (
                <th key={col.key} className="p-4">
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-black">
                    <span>{col.header}</span>
                    <ChevronDown size={14} />
                  </div>
                </th>
              ))}
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="p-8 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4"><input type="checkbox" className="rounded text-black focus:ring-black" /></td>
                  {columns.map(col => (
                    <td key={col.key} className="p-4 text-gray-800">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600 bg-gray-50">
        <div>Showing 1 to 10 of {data.length} results</div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50">Prev</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-black text-white">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
};
