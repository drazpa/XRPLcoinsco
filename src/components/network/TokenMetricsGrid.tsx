import React from 'react';
import { Token } from '../../types/token';
import { formatNumber, formatUSDPrice } from '../../utils/formatters';
import { CircleDollarSign, TrendingUp, Users, Activity } from 'lucide-react';

interface TokenMetricsGridProps {
  tokens: Token[];
}

export const TokenMetricsGrid: React.FC<TokenMetricsGridProps> = ({ tokens }) => {
  const totalMarketCap = tokens.reduce((sum, token) => sum + token.marketCap, 0);
  const total24hVolume = tokens.reduce((sum, token) => sum + token.volume24h, 0);
  const totalHolders = tokens.reduce((sum, token) => sum + token.holders, 0);
  const totalTrustlines = tokens.reduce((sum, token) => sum + token.trustlines, 0);

  const MetricCard = ({ title, value, icon: Icon, subtitle }: any) => (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_25px_rgba(37,99,235,0.2)] transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Market Cap"
        value={formatUSDPrice(totalMarketCap)}
        icon={CircleDollarSign}
        subtitle="All tracked tokens"
      />
      <MetricCard
        title="24h Volume"
        value={formatUSDPrice(total24hVolume)}
        icon={TrendingUp}
        subtitle="Global trading volume"
      />
      <MetricCard
        title="Total Holders"
        value={formatNumber(totalHolders)}
        icon={Users}
        subtitle="Unique addresses"
      />
      <MetricCard
        title="Total Trustlines"
        value={formatNumber(totalTrustlines)}
        icon={Activity}
        subtitle="Active connections"
      />
    </div>
  );
};