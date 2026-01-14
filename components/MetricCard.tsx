import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, positive, icon, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
        {change && (
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${positive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {positive ? '+' : ''}{change}
          </div>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {description && <p className="text-slate-400 text-xs mt-2">{description}</p>}
    </div>
  );
};

export default MetricCard;