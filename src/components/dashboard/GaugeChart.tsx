import React, { useEffect, useRef } from 'react';

interface GaugeChartProps {
  value: number;
  maxValue: number;
  title: string;
  subtitle: string;
  color: string;
  size?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  maxValue,
  title,
  subtitle,
  color,
  size = 120
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Calculate the percentage
    const percentage = Math.min(Math.max(value / maxValue, 0), 1);

    // Configuration
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.8;
    const lineWidth = size * 0.1;
    const startAngle = Math.PI * 0.8;
    const endAngle = Math.PI * 2.2;
    const valueAngle = startAngle + (endAngle - startAngle) * percentage;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw value arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, valueAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Add gradient glow effect
    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.8,
      centerX, centerY, radius * 1.2
    );
    gradient.addColorStop(0, `${color}20`);
    gradient.addColorStop(1, `${color}00`);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.1, startAngle, valueAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = lineWidth * 0.5;
    ctx.lineCap = 'round';
    ctx.stroke();

  }, [value, maxValue, size, color]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas ref={canvasRef} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round((value / maxValue) * 100)}%
          </span>
        </div>
      </div>
      <div className="text-center mt-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
};