import React, { useState, useEffect } from 'react';
import { useXRPLWebSocket } from '../../hooks/useXRPLWebSocket';
import { NetworkMetricsChart } from '../network/NetworkMetricsChart';
import { Activity, TrendingUp, Database, Zap } from 'lucide-react';

export const RealtimeCharts: React.FC = () => {
  const metrics = useXRPLWebSocket();
  const [chartData, setChartData] = useState({
    tps: [] as { time: number; value: number }[],
    ledger: [] as { time: number; value: number }[],
    activity: [] as { time: number; value: number }[]
  });

  // Update chart data when new metrics arrive
  useEffect(() => {
    const now = Date.now() / 1000;
    
    setChartData(prev => {
      // Keep last 60 data points (1 minute of data)
      const keepLast = (arr: typeof prev.tps) => 
        [...arr.slice(-59), { time: now, value: 0 }].slice(-60);

      return {
        tps: keepLast([...prev.tps, { 
          time: now, 
          value: metrics.tps 
        }]),
        ledger: keepLast([...prev.ledger, { 
          time: now, 
          value: metrics.ledgerIndex 
        }]),
        activity: keepLast([...prev.activity, { 
          time: now, 
          value: metrics.networkLoad * 100 
        }])
      };
    });
  }, [metrics]);

  const ChartCard = ({ 
    title, 
    data, 
    icon: Icon, 
    color, 
    subtitle 
  }: { 
    title: string;
    data: { time: number; value: number }[];
    icon: any;
    color: string;
    subtitle: string;
  }) => (
    <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {data.length > 0 ? data[data.length - 1].value.toFixed(2) : '0.00'}
        </div>
      </div>
      <NetworkMetricsChart
        data={data}
        title=""
        height={200}
        color={color.replace('text-', '#')}
        showMinMax={true}
        animate={true}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ChartCard
        title="Transactions Per Second"
        data={chartData.tps}
        icon={Zap}
        color="text-blue-500"
        subtitle="Real-time TPS"
      />
      <ChartCard
        title="Network Activity"
        data={chartData.activity}
        icon={Activity}
        color="text-emerald-500"
        subtitle="Current network load (%)"
      />
      <ChartCard
        title="Ledger Progress"
        data={chartData.ledger}
        icon={Database}
        color="text-purple-500"
        subtitle="Latest validated ledger"
      />
    </div>
  );
};