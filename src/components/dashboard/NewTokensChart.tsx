import React from 'react';
import { Token } from '../../types/token';
import { formatUSDPrice, formatNumber } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { TokenPriceChart } from '../TokenPriceChart';

interface NewTokensChartProps {
  tokens: Token[];
}

export const NewTokensChart: React.FC<NewTokensChartProps> = ({ tokens }) => {
  return (
    <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Recently Added Tokens
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart View */}
        <div className="h-[300px]">
          <TokenPriceChart 
            token={tokens[0]} 
            height="100%"
            showVolume={true}
            isPremium={true}
          />
        </div>

        {/* Token List */}
        <div className="space-y-4">
          {tokens.map((token, index) => (
            <div 
              key={token.id}
              className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200"
            >
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
              <div className="text-right">
                <div className={`flex items-center justify-end ${
                  token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {token.change24h >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {token.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Vol: ${formatNumber(token.volume24h)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};