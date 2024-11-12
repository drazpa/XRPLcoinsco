import React, { useEffect, useState } from 'react';
import { Activity, Zap, Clock, Database } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

interface RealtimeMetricsProps {
  lastLedgerTime: number;
  tps: number;
  ledgerIndex: number;
  consensusPhase: string;
}

export const RealtimeMetrics: React.FC<RealtimeMetricsProps> = ({
  lastLedgerTime,
  tps,
  ledgerIndex,
  consensusPhase
}) => {
  const [timeSinceLastLedger, setTimeSinceLastLedger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceLastLedger(Math.floor((Date.now() - lastLedgerTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastLedgerTime]);

  const MetricCard = ({ title, value, icon: Icon, subtitle }: any) => (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_25px_rgba(37,99,235,0.2)] transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      {subtitle && (
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Time Since Last Ledger"
        value={`${timeSinceLastLedger}s`}
        subtitle="Target: 3-4 seconds"
        icon={Clock}
      />
      <MetricCard
        title="Current TPS"
        value={formatNumber(tps)}
        subtitle="Transactions per second"
        icon={Zap}
      />
      <MetricCard
        title="Current Ledger"
        value={formatNumber(ledgerIndex)}
        subtitle="Latest validated"
        icon={Database}
      />
      <MetricCard
        title="Consensus Phase"
        value={consensusPhase}
        subtitle="Network status"
        icon={Activity}
      />
    </div>
  );
};