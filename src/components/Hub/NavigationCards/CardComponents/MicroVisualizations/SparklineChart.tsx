import { FC } from 'react';

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  className?: string;
}

export const SparklineChart: FC<SparklineChartProps> = ({
  data,
  color = '#FF6B6B',
  height = 30,
  width = 80,
  className
}) => {
  if (!data || data.length < 2) {
    return null;
  }

  // Find min and max values for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  // Create SVG path
  const pathData = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className={className} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        style={{ display: 'block' }}
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Fill area under the line */}
        <path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#sparklineGradient)"
        />

        {/* Sparkline path */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Last point indicator */}
        {data.length > 0 && (
          <circle
            cx={(width * (data.length - 1)) / (data.length - 1)}
            cy={height - ((data[data.length - 1] - minValue) / range) * height}
            r={2}
            fill={color}
          />
        )}
      </svg>

      {/* CSS animations will be handled via inline styles */}
    </div>
  );
};