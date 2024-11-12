import React from 'react';
import { Token } from '../types/token';
import { TokenPriceChart } from './TokenPriceChart';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Users } from 'lucide-react';
import { formatUSDPrice, formatNumber, formatPercentage } from '../utils/formatters';

interface MobileTokenCardProps {
  token: Token;
  onTokenClick?: () => void;
}

export const MobileTokenCard: React.FC<MobileTokenCardProps> = ({ token, onTokenClick }) => {
  const handleTrustlineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const hexCode = token.currency.length === 40 ? token.currency : '';
    window.open(`https://xrpl.services/?issuer=${token.issuer}&currency=${hexCode || token.currency}&limit=1000000000`, '_blank');
  };

  const handleTradeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://xmagnetic.org/dex/${token.currency}+${token.issuer}_XRP+XRP?network=mainnet`, '_blank');
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      onClick={onTokenClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {token.currency.slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {token.currency}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
              {token.issuer}
            </p>
          </div>
        </div>
        <div className={`flex items-center ${
          token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {token.change24h >= 0 ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm font-medium">
            {formatPercentage(token.change24h)}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {formatUSDPrice(token.priceUSD)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Vol: ${formatNumber(token.volume24h)}
        </div>
      </div>

      <div className="h-[100px] mb-3">
        <TokenPriceChart 
          token={token} 
          height={100}
          showVolume={false}
          isPremium={false}
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleTradeClick}
          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Trade
        </button>
        <button
          onClick={handleTrustlineClick}
          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <Users className="h-4 w-4 mx-auto" />
        </button>
      </div>
    </div>
  );
};