import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    direction: 'up' | 'down';
    value: number;
  };
}

export function MetricCard({ title, value, color, icon: Icon, trend }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center">
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="ml-4 flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`ml-2 text-xs font-medium ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}