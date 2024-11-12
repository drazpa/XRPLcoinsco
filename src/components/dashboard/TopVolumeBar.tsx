import React from 'react';
import { Token } from '../../types/token';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';
import { formatUSDPrice, formatPercentage, shortenAddress } from '../../utils/formatters';
import { useMobileView } from '../../context/MobileContext';

interface TopVolumeBarProps {
  tokens: Token[];
}

export const TopVolumeBar: React.FC<TopVolumeBarProps> = ({ tokens }) => {
  const { isMobileView } = useMobileView();
  const top5Tokens = [...tokens]
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 5);

  const handleTradeClick = (e: React.MouseEvent, token: Token) => {
    e.stopPropagation();
    window.open(`https://xmagnetic.org/dex/${token.currency}+${token.issuer}_XRP+XRP?network=mainnet`, '_blank');
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 border-b border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl py-2">
      <div className="container mx-auto px-4">
        <div className={`grid ${isMobileView ? 'grid-cols-1 gap-2' : 'grid-cols-5 gap-4'}`}>
          {top5Tokens.map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {token.currency.slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {token.currency}
                    </span>
                    <div className={`flex items-center ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {token.change24h >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span className="text-xs font-medium">
                        {formatPercentage(token.change24h)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatUSDPrice(token.priceUSD)}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Vol: {formatUSDPrice(token.volume24h)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => handleTradeClick(e, token)}
                className="ml-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-1 flex-shrink-0"
              >
                <ArrowRightLeft className="h-3 w-3" />
                <span>Trade</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};