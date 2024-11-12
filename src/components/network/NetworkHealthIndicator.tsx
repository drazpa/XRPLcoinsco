import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface NetworkHealthIndicatorProps {
  label: string;
  health: number;
}

export const NetworkHealthIndicator: React.FC<NetworkHealthIndicatorProps> = ({ label, health }) => {
  const getHealthColor = () => {
    if (health >= 95) return 'text-green-500';
    if (health >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthIcon = () => {
    if (health >= 95) return <CheckCircle className="h-4 w-4" />;
    if (health >= 80) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-lg border border-blue-100 dark:border-blue-800 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
      <div className="flex items-center space-x-3">
        {getHealthIcon()}
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className={`flex items-center space-x-2 ${getHealthColor()}`}>
        <span className="text-sm font-medium">{health.toFixed(2)}%</span>
      </div>
    </div>
  );
};