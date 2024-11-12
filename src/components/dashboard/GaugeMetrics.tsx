import React from 'react';
import { Token } from '../../types/token';
import { GaugeChart } from './GaugeChart';
import { TrendingUp, Users, Activity, Wallet } from 'lucide-react';

interface GaugeMetricsProps {
  tokens: Token[];
}

export const GaugeMetrics: React.FC<GaugeMetricsProps> = ({ tokens }) => {
  // Calculate metrics
  const totalVolume = tokens.reduce((sum, t) => sum + t.volume24h, 0);
  const maxVolume = Math.max(...tokens.map(token => token.volume24h));
  const avgVolume = totalVolume / tokens.length;

  const totalMarketCap = tokens.reduce((sum, t) => sum + t.marketCap, 0);
  const maxMarketCap = Math.max(...tokens.map(token => token.marketCap));

  const avgChange = tokens.reduce((sum, t) => sum + t.change24h, 0) / tokens.length;
  const maxChange = Math.max(...tokens.map(token => Math.abs(token.change24h)));

  const gauges = [
    {
      title: 'Market Activity',
      subtitle: 'Overall Volume',
      value: 85,
      maxValue: 100,
      color: '#10B981', // Green
      icon: Activity
    },
    {
      title: 'Market Cap',
      subtitle: 'Total Value',
      value: 78,
      maxValue: 100,
      color: '#3B82F6', // Blue
      icon: Wallet
    },
    {
      title: 'Token Growth',
      subtitle: 'New Listings',
      value: 92,
      maxValue: 100,
      color: '#8B5CF6', // Purple
      icon: TrendingUp
    },
    {
      title: 'User Activity',
      subtitle: 'Active Holders',
      value: 88,
      maxValue: 100,
      color: '#F59E0B', // Orange
      icon: Users
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {gauges.map((gauge, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {gauge.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {gauge.subtitle}
              </p>
            </div>
            <gauge.icon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex justify-center">
            <GaugeChart
              value={gauge.value}
              maxValue={gauge.maxValue}
              title=""
              subtitle=""
              color={gauge.color}
              size={140}
            />
          </div>
        </div>
      ))}
    </div>
  );
};