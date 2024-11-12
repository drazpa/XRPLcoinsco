import React, { useEffect, useRef } from 'react';
import { Token } from '../../types/token';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatUSDPrice, formatPercentage } from '../../utils/formatters';

interface VolumeTickerProps {
  tokens: Token[];
}

export const VolumeTicker: React.FC<VolumeTickerProps> = ({ tokens }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const top10Tokens = [...tokens]
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 10);

  useEffect(() => {
    const scroll = () => {
      if (!scrollRef.current) return;
      
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      let scrollLeft = scrollRef.current.scrollLeft;

      scrollLeft += 1; // Adjust speed by changing this value
      if (scrollLeft >= scrollWidth - clientWidth) {
        scrollLeft = 0;
      }

      scrollRef.current.scrollLeft = scrollLeft;
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  const TickerItem = ({ token }: { token: Token }) => (
    <div className="flex items-center space-x-4 px-6 border-r border-gray-200 dark:border-gray-700 last:border-0">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {token.currency}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {formatUSDPrice(token.priceUSD)}
        </span>
      </div>
      <div className={`flex items-center ${
        token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
      }`}>
        {token.change24h >= 0 ? (
          <ArrowUpRight className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 mr-1" />
        )}
        <span className="font-medium">
          {formatPercentage(token.change24h)}
        </span>
      </div>
      <div className="text-blue-600 dark:text-blue-400">
        Vol: {formatUSDPrice(token.volume24h)}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto overflow-hidden whitespace-nowrap py-2">
        <div 
          ref={scrollRef}
          className="flex items-center space-x-6 animate-scroll"
          style={{ 
            width: 'max-content',
            animation: 'scroll 60s linear infinite'
          }}
        >
          {/* Duplicate items for seamless scrolling */}
          {[...top10Tokens, ...top10Tokens].map((token, index) => (
            <TickerItem key={`${token.id}-${index}`} token={token} />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};