import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: LucideIcon;
  colorTheme: 'blue' | 'green' | 'orange' | 'purple' | 'rose' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  colorTheme
}) => {
  const themeClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden transition-all hover:shadow-md group">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
          <div className={`p-2.5 rounded-xl ${themeClasses[colorTheme]} transition-transform group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{value}</h3>
        <p className="text-slate-400 text-xs font-medium">{subValue}</p>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none transform rotate-12 group-hover:rotate-0 transition-transform duration-500`}>
         <Icon className="w-32 h-32" />
      </div>
    </div>
  );
};