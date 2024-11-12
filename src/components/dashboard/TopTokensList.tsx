import React from 'react';
import { Token } from '../../types/token';
import { ArrowUpRight, ArrowDownRight, Activity, Wallet, BarChart2 } from 'lucide-react';
import { formatUSDPrice, formatNumber, formatPercentage, shortenAddress } from '../../utils/formatters';
import { useMobileView } from '../../context/MobileContext';

interface TopTokensListProps {
  tokens: Token[];
  sortBy: 'volume24h' | 'marketCap';
  title: string;
  onTokenClick?: (token: Token) => void;
}

export const TopTokensList: React.FC<TopTokensListProps> = ({
  tokens,
  sortBy,
  title,
  onTokenClick
}) => {
  const { isMobileView } = useMobileView();
  const sortedTokens = [...tokens]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, 10);

  const StatBox = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center text-gray-500 dark:text-gray-400">
        <Icon className="h-4 w-4 mr-2" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );

  if (isMobileView) {
    return (
      <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-4 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
        <div className="space-y-4">
          {sortedTokens.map((token, index) => (
            <div
              key={token.id}
              onClick={() => onTokenClick?.(token)}
              className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200 cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 space-x-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                    #{index + 1}
                  </div>
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
                      {shortenAddress(token.issuer)}
                    </div>
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

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <StatBox
                  label="Market Cap"
                  value={formatUSDPrice(token.marketCap)}
                  icon={Wallet}
                />
                <StatBox
                  label="Volume 24h"
                  value={formatUSDPrice(token.volume24h)}
                  icon={BarChart2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-xl">
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
              <th className="pb-4 font-medium text-right">Market Cap</th>
              <th className="pb-4 font-medium text-right">Volume (24h)</th>
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
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {shortenAddress(token.issuer)}
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
                    {formatUSDPrice(token.marketCap)}
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatUSDPrice(token.volume24h)}
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