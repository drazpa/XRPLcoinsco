import React from 'react';
import { Token } from '../../types/token';
import { NetworkMetricsChart } from '../network/NetworkMetricsChart';
import { Activity, TrendingUp } from 'lucide-react';

interface TokenComparisonChartsProps {
  tokens: Token[];
}

export const TokenComparisonCharts: React.FC<TokenComparisonChartsProps> = ({ tokens }) => {
  // Generate volume comparison data
  const volumeData = tokens.slice(0, 10).map((token, index) => ({
    time: index,
    value: token.volume24h
  }));

  // Generate market cap comparison data
  const marketCapData = tokens.slice(0, 10).map((token, index) => ({
    time: index,
    value: token.marketCap
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Volume Distribution (Top 10)
          </h3>
        </div>
        <NetworkMetricsChart
          data={volumeData}
          title=""
          height={300}
          color="#3B82F6"
        />
      </div>

      <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Market Cap Distribution (Top 10)
          </h3>
        </div>
        <NetworkMetricsChart
          data={marketCapData}
          title=""
          height={300}
          color="#10B981"
        />
      </div>
    </div>
  );
};