import { FC } from 'react';
import styles from './MicroVisualizations.module.css';

interface TrendIndicatorProps {
  value: number; // Percentage change
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const TrendIndicator: FC<TrendIndicatorProps> = ({
  value,
  showValue = true,
  size = 'medium',
  className = ''
}) => {
  const getTrendColor = (trend: number) => {
    if (trend > 0) return '#00FF88'; // Green for positive
    if (trend < 0) return '#FF6B6B'; // Red for negative
    return '#FFD700'; // Yellow for neutral
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return '↗'; // Strong upward
    if (trend > 0) return '↑'; // Upward
    if (trend < -5) return '↘'; // Strong downward
    if (trend < 0) return '↓'; // Downward
    return '→'; // Neutral
  };

  const formatValue = (val: number) => {
    const absValue = Math.abs(val);
    if (absValue >= 100) return `${Math.round(absValue)}%`;
    if (absValue >= 10) return `${absValue.toFixed(0)}%`;
    return `${absValue.toFixed(1)}%`;
  };

  const trendColor = getTrendColor(value);
  const trendIcon = getTrendIcon(value);

  return (
    <span
      className={`${styles.trendIndicator} ${styles[size]} ${className}`}
      style={{ color: trendColor }}
    >
      <span className={styles.trendIcon}>{trendIcon}</span>
      {showValue && (
        <span className={styles.trendValue}>
          {formatValue(value)}
        </span>
      )}
    </span>
  );
};