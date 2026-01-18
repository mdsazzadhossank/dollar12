import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  iconColorClass,
  iconBgClass
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-400 text-xs">{subValue}</p>
      </div>
      <div className={`p-3 rounded-lg ${iconBgClass}`}>
        <Icon className={`w-6 h-6 ${iconColorClass}`} />
      </div>
    </div>
  );
};