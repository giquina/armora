import { FC } from 'react';
import styles from './MicroVisualizations.module.css';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showTrend?: boolean;
  className?: string;
}

export const SparklineChart: FC<SparklineChartProps> = ({
  data,
  width = 60,
  height = 24,
  color = '#00FF88',
  strokeWidth = 2,
  showTrend = false,
  className = ''
}) => {
  if (!data || data.length < 2) {
    return <div className={`${styles.sparklineEmpty} ${className}`} />;
  }

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  // Create path string for SVG
  const pathData = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Calculate trend
  const trend = data[data.length - 1] - data[0];
  const trendColor = trend > 0 ? '#00FF88' : trend < 0 ? '#FF6B6B' : '#FFD700';

  return (
    <div className={`${styles.sparklineContainer} ${className}`}>
      <svg width={width} height={height} className={styles.sparklineSvg}>
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Add gradient fill */}
        <defs>
          <linearGradient id={`gradient-${Date.now()}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#gradient-${Date.now()})`}
        />
      </svg>
      {showTrend && (
        <span className={styles.trendIndicator} style={{ color: trendColor }}>
          {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
        </span>
      )}
    </div>
  );
};