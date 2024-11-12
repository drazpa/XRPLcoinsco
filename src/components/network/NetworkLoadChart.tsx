import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { useTheme } from '../../context/ThemeContext';

interface NetworkLoadChartProps {
  data: { time: number; value: number }[];
  height?: number;
}

export const NetworkLoadChart: React.FC<NetworkLoadChartProps> = ({
  data,
  height = 300
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const chartRef = useRef<any>(null);

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
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addAreaSeries({
      lineColor: '#EC4899',
      topColor: '#EC489940',
      bottomColor: '#EC489900',
      lineWidth: 2,
      priceFormat: {
        type: 'value',
        precision: 2,
      },
    });

    series.setData(data);
    chart.timeScale().fitContent();

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
        chartRef.current.timeScale().fitContent();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [theme, height, data]);

  return <div ref={chartContainerRef} />;
};