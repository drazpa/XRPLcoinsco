import React, { useState, useEffect } from 'react';
import { TokenList } from '../components/TokenList';
import { useAllTokens } from '../hooks/useAllTokens';
import { XRPLMetaWebSocket } from '../services/websocket';
import { Token } from '../types/token';
import { Activity, Database } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export const AllCoins: React.FC = () => {
  const { 
    tokens, 
    loading, 
    error, 
    refetch,
    isRefreshing,
    toggleFavorite,
    isFavorite,
    searchTerm,
    setSearchTerm,
    totalTokens,
    searchableTokens
  } = useAllTokens();

  const [metrics, setMetrics] = useState({
    totalVolume: 0,
    totalMarketCap: 0,
    totalTrustlines: 0,
    totalHolders: 0
  });

  // Calculate metrics whenever tokens change
  useEffect(() => {
    if (!tokens.length) return;

    setMetrics({
      totalVolume: tokens.reduce((sum, token) => sum + token.volume24h, 0),
      totalMarketCap: tokens.reduce((sum, token) => sum + token.marketCap, 0),
      totalTrustlines: tokens.reduce((sum, token) => sum + token.trustlines, 0),
      totalHolders: tokens.reduce((sum, token) => sum + token.holders, 0)
    });
  }, [tokens]);

  const MetricCard = ({ title, value, icon: Icon }: any) => (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-4 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(37,99,235,0.1)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Network Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Volume (24h)"
          value={`$${formatNumber(metrics.totalVolume)}`}
          icon={Activity}
        />
        <MetricCard
          title="Total Market Cap"
          value={`$${formatNumber(metrics.totalMarketCap)}`}
          icon={Database}
        />
        <MetricCard
          title="Total Trustlines"
          value={formatNumber(metrics.totalTrustlines)}
          icon={Activity}
        />
        <MetricCard
          title="Total Holders"
          value={formatNumber(metrics.totalHolders)}
          icon={Database}
        />
      </div>

      {/* Token List */}
      <TokenList 
        tokens={tokens} 
        loading={loading} 
        error={error} 
        onRefresh={refetch}
        isRefreshing={isRefreshing}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {!loading && !error && tokens.length > 0 && searchTerm === '' && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing top {tokens.length} tokens by volume out of {totalTokens.toLocaleString()} total tokens.
          <br />
          Use the search to explore the top {searchableTokens.toLocaleString()} tokens by volume.
        </div>
      )}
    </div>
  );
};