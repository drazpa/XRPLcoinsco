import React from 'react';
import { Code2, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Amendment {
  name: string;
  status: 'enabled' | 'pending' | 'failed';
  supportPercentage: number;
  eta?: string;
}

interface AmendmentStatusProps {
  amendments: Amendment[];
}

export const AmendmentStatus: React.FC<AmendmentStatusProps> = ({ amendments }) => {
  const getStatusIcon = (status: Amendment['status']) => {
    switch (status) {
      case 'enabled':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Amendment['status']) => {
    switch (status) {
      case 'enabled':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
      <div className="flex items-center space-x-2 mb-4">
        <Code2 className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Amendment Status
        </h3>
      </div>

      <div className="space-y-4">
        {amendments.map((amendment) => (
          <div key={amendment.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(amendment.status)}
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {amendment.name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    amendment.status === 'enabled' ? 'bg-green-500' :
                    amendment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${amendment.supportPercentage}%` }}
                />
              </div>
              <span className={`text-sm ${getStatusColor(amendment.status)}`}>
                {amendment.supportPercentage}%
              </span>
              {amendment.eta && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ETA: {amendment.eta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};