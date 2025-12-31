import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: 'good' | 'warning' | 'neutral';
  subtitle?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  status = 'neutral', 
  subtitle,
  className = ''
}: StatCardProps) {
  const statusColors = {
    good: 'bg-emerald-100/80 text-emerald-700',
    warning: 'bg-orange-100/80 text-orange-700',
    neutral: 'bg-gray-100/80 text-gray-700'
  };

  const iconBgColors = {
    good: 'bg-green-100 text-green-700',
    warning: 'bg-green-100 text-green-700',
    neutral: 'bg-green-100 text-green-700'
  };

  const statusDots = {
    good: 'bg-emerald-500',
    warning: 'bg-orange-500',
    neutral: 'bg-gray-400'
  };

  return (
    <div className={`bg-white/60 backdrop-blur-md dark:bg-gray-800/60 rounded-2xl p-5 shadow-sm border border-green-100 dark:border-gray-700 hover:shadow-md transition-all ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3.5 rounded-full ${iconBgColors[status]}`}>
          {icon}
        </div>
        {status !== 'neutral' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/50 backdrop-blur-sm">
            <div className={`w-2 h-2 rounded-full ${statusDots[status]} animate-pulse`}></div>
            <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">{status}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-emerald-700 dark:text-gray-400 mb-2 uppercase tracking-widest">{title}</p>
        <p className="text-3xl text-gray-900 dark:text-white mb-1.5 tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-600 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}