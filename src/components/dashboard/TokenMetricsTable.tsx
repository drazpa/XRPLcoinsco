import React from 'react';
import { Token } from '../../types/token';
import { formatUSDPrice, formatNumber, formatPercentage } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Users } from 'lucide-react';

interface TokenMetricsTableProps {
  tokens: Token[];
  title: string;
  sortBy: keyof Token;
  limit?: number;
  onTokenClick?: (token: Token) => void;
}

export const TokenMetricsTable: React.FC<TokenMetricsTableProps> = ({
  tokens,
  title,
  sortBy,
  limit = 10,
  onTokenClick
}) => {
  const sortedTokens = [...tokens]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, limit);

  const handleTrustlineClick = (e: React.MouseEvent, token: Token) => {
    e.stopPropagation();
    const hexCode = token.currency.length === 40 ? token.currency : '';
    window.open(`https://xrpl.services/?issuer=${token.issuer}&currency=${hexCode || token.currency}&limit=1000000000`, '_blank');
  };

  const handleTradeClick = (e: React.MouseEvent, token: Token) => {
    e.stopPropagation();
    window.open(`https://xmagnetic.org/dex/${token.currency}+${token.issuer}_XRP+XRP?network=mainnet`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(37,99,235,0.1)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="pb-4 font-medium">#</th>
              <th className="pb-4 font-medium">Token</th>
              <th className="pb-4 font-medium text-right">Price</th>
              <th className="pb-4 font-medium text-right">24h Change</th>
              <th className="pb-4 font-medium text-right">Volume (24h)</th>
              <th className="pb-4 font-medium text-right">Market Cap</th>
              <th className="pb-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTokens.map((token, index) => (
              <tr 
                key={token.id}
                onClick={() => onTokenClick?.(token)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="py-4">
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
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {token.issuer}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatUSDPrice(token.priceUSD)}
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className={`flex items-center justify-end ${
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
                </td>
                <td className="py-4 text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${formatNumber(token.volume24h)}
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${formatNumber(token.marketCap)}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={(e) => handleTradeClick(e, token)}
                      className="px-2 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70 transition-colors"
                    >
                      Trade
                    </button>
                    <button
                      onClick={(e) => handleTrustlineClick(e, token)}
                      className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700/70 transition-colors"
                    >
                      <Users className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};