import React from 'react';
import { Token } from '../../types/token';
import { TokenPriceChart } from '../TokenPriceChart';
import { 
  ArrowUpRight, ArrowDownRight, ExternalLink, Users, Activity, 
  Wallet, BarChart2, CircleDollarSign, ArrowRightLeft, Globe 
} from 'lucide-react';
import { formatUSDPrice, formatNumber, formatPercentage, shortenAddress } from '../../utils/formatters';

interface TopTokenCardProps {
  token: Token;
}

export const TopTokenCard: React.FC<TopTokenCardProps> = ({ token }) => {
  const handleTrustlineClick = () => {
    const hexCode = token.currency.length === 40 ? token.currency : '';
    window.open(`https://xrpl.services/?issuer=${token.issuer}&currency=${hexCode || token.currency}&limit=1000000000`, '_blank');
  };

  const handleTradeClick = () => {
    window.open(`https://xmagnetic.org/dex/${token.currency}+${token.issuer}_XRP+XRP?network=mainnet`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                {token.currency.slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {token.currency}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {shortenAddress(token.issuer)}
                </span>
                <a
                  href={`https://xrpscan.com/account/${token.issuer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 lg:mt-0 text-right">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {formatUSDPrice(token.priceUSD)}
          </div>
          <div className={`flex items-center justify-end mt-2 ${
            token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {token.change24h >= 0 ? (
              <ArrowUpRight className="h-5 w-5 mr-1" />
            ) : (
              <ArrowDownRight className="h-5 w-5 mr-1" />
            )}
            <span className="text-lg font-medium">
              {formatPercentage(token.change24h)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatBox 
          title="Market Cap" 
          value={formatUSDPrice(token.marketCap)}
          icon={CircleDollarSign}
        />
        <StatBox 
          title="24h Volume" 
          value={formatUSDPrice(token.volume24h)}
          icon={BarChart2}
        />
        <StatBox 
          title="Total Holders" 
          value={formatNumber(token.holders)}
          icon={Users}
        />
        <StatBox 
          title="24h Trades" 
          value={formatNumber(token.exchanges24h)}
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Price Chart */}
        <div className="lg:col-span-2 h-[200px]">
          <TokenPriceChart 
            token={token} 
            height="100%"
            showVolume={false}
            isPremium={true}
          />
        </div>

        {/* Trading Activity */}
        <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-4 backdrop-blur-sm border border-blue-100/50 dark:border-blue-900/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
            Trading Activity
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">7d Volume</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatUSDPrice(token.volume7d)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">7d Trades</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatNumber(token.exchanges7d)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">7d Change</span>
              <span className={`text-sm font-medium ${
                token.change7d >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatPercentage(token.change7d)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Trustlines</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatNumber(token.trustlines)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleTradeClick}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Trade Now</span>
        </button>
        <button
          onClick={handleTrustlineClick}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Users className="h-4 w-4" />
          <span>Add Trustline</span>
        </button>
      </div>
    </div>
  );
};

const StatBox = ({ title, value, icon: Icon }: { title: string; value: string; icon: any }) => (
  <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-4 backdrop-blur-sm border border-blue-100/50 dark:border-blue-900/50">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </div>
  </div>
);