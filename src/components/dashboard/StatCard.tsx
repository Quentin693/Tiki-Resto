"use client"

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  const trendColor = trend.startsWith('+') ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#1a1a1a] p-3 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${trendColor}`}>{trend}</span>
      </div>
      <h3 className="text-lg font-medium text-gray-200 mb-1">{title}</h3>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-400">{subtitle}</div>
      )}
    </div>
  );
} 