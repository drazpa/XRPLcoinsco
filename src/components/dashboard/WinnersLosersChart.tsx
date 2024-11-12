import React from 'react';
import { Token } from '../../types/token';
import { TokenPriceChart } from '../TokenPriceChart';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatUSDPrice, formatPercentage } from '../../utils/formatters';

interface WinnersLosersChartProps {
  tokens: Token[];
}

export const WinnersLosersChart: React.FC<WinnersLosersChartProps> = ({ tokens }) => {
  // Get top 5 winners and losers based on 24h change
  const sortedTokens = [...tokens].sort((a, b) => b.change24h - a.change24h);
  const winners = sortedTokens.slice(0, 5);
  const losers = sortedTokens.slice(-5).reverse();

  const TokenCard = ({ token, isWinner }: { token: Token; isWinner: boolean }) => (
    <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {token.currency.slice(0, 2)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {token.currency}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatUSDPrice(token.priceUSD)}
            </div>
          </div>
        </div>
        <div className={`flex items-center ${
          isWinner ? 'text-green-500' : 'text-red-500'
        }`}>
          {isWinner ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm font-medium">
            {formatPercentage(token.change24h)}
          </span>
        </div>
      </div>
      <div className="h-[100px]">
        <TokenPriceChart 
          token={token} 
          height={100}
          showVolume={false}
          isPremium={false}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Winners Section */}
      <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-green-100/50 dark:border-green-900/50 backdrop-blur-xl">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Top Gainers
          </h3>
        </div>
        <div className="space-y-4">
          {winners.map((token) => (
            <TokenCard key={token.id} token={token} isWinner={true} />
          ))}
        </div>
      </div>

      {/* Losers Section */}
      <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-red-100/50 dark:border-red-900/50 backdrop-blur-xl">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingDown className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Top Losers
          </h3>
        </div>
        <div className="space-y-4">
          {losers.map((token) => (
            <TokenCard key={token.id} token={token} isWinner={false} />
          ))}
        </div>
      </div>
    </div>
  );
};