import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useTheme } from '../../context/ThemeContext';

interface NetworkMetricsChartProps {
  data: { time: number; value: number }[];
  title: string;
  height?: number;
  color?: string;
  showMinMax?: boolean;
  animate?: boolean;
}

export const NetworkMetricsChart: React.FC<NetworkMetricsChartProps> = ({
  data,
  title,
  height = 300,
  color = '#3B82F6',
  showMinMax = false,
  animate = false
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDarkTheme = theme === 'dark';
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: isDarkTheme ? '#D1D5DB' : '#4B5563',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: isDarkTheme ? '#374151' : '#E5E7EB' },
        horzLines: { color: isDarkTheme ? '#374151' : '#E5E7EB' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: true,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString();
        },
      },
      crosshair: {
        vertLine: {
          color: isDarkTheme ? '#6B7280' : '#9CA3AF',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: isDarkTheme ? '#6B7280' : '#9CA3AF',
          width: 1,
          style: 2,
        },
      },
      handleScale: false,
      handleScroll: false,
    });

    const series = chart.addAreaSeries({
      lineColor: color,
      topColor: `${color}40`,
      bottomColor: `${color}00`,
      lineWidth: 2,
      priceFormat: {
        type: 'value',
        precision: 2,
      },
    });

    if (showMinMax && data.length > 0) {
      const values = data.map(d => d.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      chart.applyOptions({
        rightPriceScale: {
          autoScale: false,
          scaleMargins: {
            top: 0.2,
            bottom: 0.2,
          },
        },
      });

      series.applyOptions({
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: minValue * 0.95,
            maxValue: maxValue * 1.05,
          },
        }),
      });
    }

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
        chartRef.current.timeScale().fitContent();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme, height, color, showMinMax]);

  // Update data and animate if needed
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;

    if (animate) {
      const animate = () => {
        seriesRef.current.setData(data);
        chartRef.current.timeScale().fitContent();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      seriesRef.current.setData(data);
      chartRef.current.timeScale().fitContent();
    }
  }, [data, animate]);

  return (
    <div>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <div ref={chartContainerRef} className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-gray-800/5 pointer-events-none" />
      </div>
    </div>
  );
};