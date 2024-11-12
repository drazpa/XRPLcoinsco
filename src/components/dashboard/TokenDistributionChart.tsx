import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { useTheme } from '../../context/ThemeContext';
import { Token } from '../../types/token';

interface TokenDistributionChartProps {
  tokens: Token[];
  type: 'marketCap' | 'volume' | 'holders';
  title: string;
}

export const TokenDistributionChart: React.FC<TokenDistributionChartProps> = ({
  tokens,
  type,
  title
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDarkTheme = theme === 'dark';
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: isDarkTheme ? '#1F2937' : '#ffffff' },
        textColor: isDarkTheme ? '#D1D5DB' : '#4B5563',
      },
      grid: {
        vertLines: { color: isDarkTheme ? '#374151' : '#E5E7EB' },
        horzLines: { color: isDarkTheme ? '#374151' : '#E5E7EB' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    const series = chart.addAreaSeries({
      lineColor: '#3B82F6',
      topColor: '#3B82F640',
      bottomColor: '#3B82F600',
      lineWidth: 2,
    });

    // Process data based on type
    const data = tokens
      .sort((a, b) => b[type] - a[type])
      .slice(0, 20)
      .map((token, index) => ({
        time: index,
        value: token[type],
      }));

    series.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [tokens, type, theme]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <div ref={chartContainerRef} />
    </div>
  );
};