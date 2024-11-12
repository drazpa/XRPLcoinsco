import React from 'react';
import { useServerInfo } from '../hooks/useServerInfo';
import { useXRPLWebSocket } from '../hooks/useXRPLWebSocket';
import { useXRPPrice } from '../hooks/useXRPPrice';
import { NetworkMetricsChart } from '../components/network/NetworkMetricsChart';
import { ConsensusChart } from '../components/network/ConsensusChart';
import { NetworkLoadChart } from '../components/network/NetworkLoadChart';
import { RealtimeMetrics } from '../components/network/RealtimeMetrics';
import { ConsensusPhaseIndicator } from '../components/network/ConsensusPhaseIndicator';
import { ValidatorMap } from '../components/network/ValidatorMap';
import { AmendmentStatus } from '../components/network/AmendmentStatus';
import { NetworkHealthIndicator } from '../components/network/NetworkHealthIndicator';
import { TokenPriceChart } from '../components/TokenPriceChart';
import { 
  Activity, Server, Database, Clock, 
  TrendingUp, BarChart2, CircleDollarSign,
  Users, ArrowUpRight, ArrowDownRight,
  Zap, Globe, Shield, Cpu, Wallet,
  Network, Lock, GitBranch
} from 'lucide-react';
import { formatNumber, formatUSDPrice } from '../utils/formatters';

const StatCard = ({ title, value, change, icon: Icon }: any) => (
  <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </div>
    {change && (
      <div className={`flex items-center mt-2 ${
        parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500'
      }`}>
        {parseFloat(change) >= 0 ? (
          <ArrowUpRight className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 mr-1" />
        )}
        <span className="text-sm font-medium">{change}</span>
      </div>
    )}
  </div>
);

export const NetworkStats: React.FC = () => {
  const { serverInfo } = useServerInfo();
  const networkMetrics = useXRPLWebSocket();
  const { price, loading: priceLoading } = useXRPPrice();

  // Mock data for demonstration
  const mockAmendments = [
    { name: 'fixQualityUpperBound', status: 'enabled' as const, supportPercentage: 100 },
    { name: 'fixTrustLinesToSelf', status: 'pending' as const, supportPercentage: 85, eta: '~2 days' },
    { name: 'fixRemoveNFTokenAutoTrustLine', status: 'enabled' as const, supportPercentage: 100 },
    { name: 'fixTokenFreeze', status: 'pending' as const, supportPercentage: 75, eta: '~5 days' }
  ];

  const mockValidators = [
    { region: 'North America', count: 45, health: 98 },
    { region: 'Europe', count: 35, health: 97 },
    { region: 'Asia Pacific', count: 25, health: 96 },
    { region: 'South America', count: 15, health: 95 }
  ];

  // Mock token data for price chart
  const mockToken = {
    currency: 'XRP',
    priceUSD: price || 0,
    change24h: 2.5,
    volume24h: 1000000000,
    marketCap: 50000000000,
    holders: 1000000
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          XRPL Network Status
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive real-time metrics and analytics for the XRP Ledger
        </p>
      </div>

      {/* XRP Price Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          XRP Price
        </h2>
        <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {formatUSDPrice(price || 0)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                XRP/USD
              </p>
            </div>
            <CircleDollarSign className="h-8 w-8 text-blue-500" />
          </div>
          <div className="h-[200px]">
            <TokenPriceChart 
              token={mockToken}
              height="100%"
              showVolume={false}
              isPremium={true}
            />
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Network TPS"
          value={networkMetrics.tps.toFixed(1)}
          change={`${((networkMetrics.tps / 50) * 100).toFixed(1)}% capacity`}
          icon={Zap}
        />
        <StatCard
          title="Current Ledger"
          value={formatNumber(networkMetrics.ledgerIndex)}
          change={`${networkMetrics.validationTime.toFixed(1)}s close time`}
          icon={Database}
        />
        <StatCard
          title="Network Load"
          value={`${(networkMetrics.networkLoad * 100).toFixed(1)}%`}
          change={`${networkMetrics.feeStats.avgFee.toFixed(6)} XRP avg fee`}
          icon={Activity}
        />
        <StatCard
          title="Active Validators"
          value={networkMetrics.validatorCount}
          change={`${networkMetrics.peerCount} connected peers`}
          icon={Shield}
        />
      </section>

      {/* Rest of the sections remain unchanged */}
      {/* Consensus Status */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsensusPhaseIndicator
          phase={networkMetrics.consensusRound.phase}
          proposers={networkMetrics.consensusRound.proposers}
          validations={networkMetrics.consensusRound.validations}
          roundTime={networkMetrics.consensusRound.roundTime}
        />
        <div className="space-y-4">
          <NetworkHealthIndicator
            label="Network Health"
            health={98.5}
          />
          <NetworkHealthIndicator
            label="Validator Agreement"
            health={99.2}
          />
          <NetworkHealthIndicator
            label="Amendment Support"
            health={95.8}
          />
        </div>
      </section>

      {/* Performance Charts */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Network Performance
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Activity className="h-5 w-5 text-blue-500 mr-2" />
              Transactions Per Second
            </h3>
            <NetworkMetricsChart
              data={networkMetrics.tpsHistory}
              title=""
              height={300}
              color="#3B82F6"
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <GitBranch className="h-5 w-5 text-pink-500 mr-2" />
              Network Load
            </h3>
            <NetworkLoadChart
              data={networkMetrics.loadHistory}
              height={300}
            />
          </div>
        </div>
      </section>

      {/* Consensus Metrics */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Consensus Metrics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Lock className="h-5 w-5 text-purple-500 mr-2" />
              Consensus Time
            </h3>
            <ConsensusChart
              data={networkMetrics.consensusHistory}
              height={300}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-emerald-500 mr-2" />
              Ledger Close Time
            </h3>
            <NetworkMetricsChart
              data={networkMetrics.ledgerHistory}
              title=""
              height={300}
              color="#10B981"
            />
          </div>
        </div>
      </section>

      {/* Network Infrastructure */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Network Infrastructure
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ValidatorMap validators={mockValidators} />
          <AmendmentStatus amendments={mockAmendments} />
        </div>
      </section>

      {/* Fee Statistics */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Fee Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Average Fee"
            value={`${networkMetrics.feeStats.avgFee.toFixed(6)} XRP`}
            icon={Wallet}
          />
          <StatCard
            title="Minimum Fee"
            value={`${networkMetrics.feeStats.minFee.toFixed(6)} XRP`}
            icon={TrendingUp}
          />
          <StatCard
            title="Maximum Fee"
            value={`${networkMetrics.feeStats.maxFee.toFixed(6)} XRP`}
            icon={BarChart2}
          />
        </div>
      </section>

      {/* Network Requirements */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Network Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Base Reserve"
            value={`${networkMetrics.reserveBase} XRP`}
            change="Required minimum balance"
            icon={Lock}
          />
          <StatCard
            title="Owner Reserve"
            value={`${networkMetrics.reserveInc} XRP`}
            change="Per owned object"
            icon={Database}
          />
        </div>
      </section>
    </div>
  );
};