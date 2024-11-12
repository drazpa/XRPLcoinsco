import React, { useState } from 'react';
import { useTokens } from '../hooks/useTokens';
import { useServerInfo } from '../hooks/useServerInfo';
import { TokenAnalytics } from '../components/dashboard/TokenAnalytics';
import { TokenMetricsGrid } from '../components/network/TokenMetricsGrid';
import { TopTokenCard } from '../components/dashboard/TopTokenCard';
import { TokenModal } from '../components/TokenModal';
import { useMobileView } from '../context/MobileContext';
import { GaugeMetrics } from '../components/dashboard/GaugeMetrics';
import { TopTokensList } from '../components/dashboard/TopTokensList';
import { WinnersLosersChart } from '../components/dashboard/WinnersLosersChart';

export const Dashboard: React.FC = () => {
  const { tokens, loading } = useTokens();
  const { serverInfo } = useServerInfo();
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const { isMobileView } = useMobileView();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get top token by volume
  const topToken = tokens.length > 0 ? tokens[0] : null;

  if (isMobileView) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">XRPL</span>
          <span className="text-gray-900 dark:text-white">Coins.co</span>
        </h1>

        <GaugeMetrics tokens={tokens} />

        {topToken && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Top Token
            </h2>
            <TopTokenCard token={topToken} />
          </section>
        )}

        <section>
          <TopTokensList 
            tokens={tokens} 
            sortBy="volume24h" 
            title="Top 10 by Volume"
            onTokenClick={setSelectedToken}
          />
        </section>

        <section>
          <TopTokensList 
            tokens={tokens} 
            sortBy="marketCap" 
            title="Top 10 by Market Cap"
            onTokenClick={setSelectedToken}
          />
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            Token Analytics
          </h2>
          <TokenAnalytics tokens={tokens} />
        </section>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">XRPL</span>
          <span className="text-gray-900 dark:text-white">Coins.co</span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">Dashboard</span>
        </h1>
      </div>

      <GaugeMetrics tokens={tokens} />

      <div className="space-y-8">
        {topToken && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Top Token by Volume
            </h2>
            <TopTokenCard token={topToken} />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopTokensList 
            tokens={tokens} 
            sortBy="volume24h" 
            title="Top 10 by Volume"
            onTokenClick={setSelectedToken}
          />
          <TopTokensList 
            tokens={tokens} 
            sortBy="marketCap" 
            title="Top 10 by Market Cap"
            onTokenClick={setSelectedToken}
          />
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Network Status
          </h2>
          <TokenMetricsGrid tokens={tokens} />
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Token Analytics
          </h2>
          <TokenAnalytics tokens={tokens} />
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Market Movers
          </h2>
          <WinnersLosersChart tokens={tokens} />
        </section>
      </div>

      {selectedToken && (
        <TokenModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
};