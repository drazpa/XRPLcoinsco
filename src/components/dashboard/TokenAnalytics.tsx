import React from 'react';
import { Token } from '../../types/token';
import { formatNumber, formatPercentage } from '../../utils/formatters';
import { TrendingUp, Users, Activity, Wallet } from 'lucide-react';

interface TokenAnalyticsProps {
  tokens: Token[];
}

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({ tokens }) => {
  // Calculate advanced metrics
  const avgTrustlines = tokens.reduce((sum, t) => sum + t.trustlines, 0) / tokens.length;
  const avgHolders = tokens.reduce((sum, t) => sum + t.holders, 0) / tokens.length;
  const totalTrades24h = tokens.reduce((sum, t) => sum + t.exchanges24h, 0);
  const avgTrades24h = totalTrades24h / tokens.length;
  const avgVolPerTrade = tokens.reduce((sum, t) => sum + t.volume24h, 0) / totalTrades24h;

  const MetricCard = ({ title, value, change, icon: Icon }: any) => (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(37,99,235,0.1)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      {change && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {change}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Average Trustlines"
        value={formatNumber(avgTrustlines)}
        change="Per token"
        icon={Activity}
      />
      <MetricCard
        title="Average Holders"
        value={formatNumber(avgHolders)}
        change="Per token"
        icon={Users}
      />
      <MetricCard
        title="24h Trades"
        value={formatNumber(totalTrades24h)}
        change={`${formatNumber(avgTrades24h)} avg per token`}
        icon={TrendingUp}
      />
      <MetricCard
        title="Avg Volume/Trade"
        value={`$${formatNumber(avgVolPerTrade)}`}
        change="Per transaction"
        icon={Wallet}
      />
    </div>
  );
};