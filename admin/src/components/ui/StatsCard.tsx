import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-start">
        <div className="text-gray-500 font-medium text-sm">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="mt-4 text-3xl font-bold text-black">{value}</div>
      {trend && (
        <div className="mt-2 text-sm">
          <span className={trend.isPositive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};
