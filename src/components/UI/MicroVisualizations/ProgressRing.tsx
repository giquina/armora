import { FC } from 'react';
import styles from './MicroVisualizations.module.css';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export const ProgressRing: FC<ProgressRingProps> = ({
  value,
  size = 40,
  strokeWidth = 3,
  color = '#00FF88',
  backgroundColor = '#333',
  showPercentage = true,
  label,
  className = ''
}) => {
  const normalizedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const center = size / 2;

  return (
    <div className={`${styles.progressRingContainer} ${className}`}>
      <svg width={size} height={size} className={styles.progressRingSvg}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          className={styles.progressRingBackground}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={styles.progressRingProgress}
          transform={`rotate(-90 ${center} ${center})`}
        />
        {/* Center text */}
        {showPercentage && (
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className={styles.progressRingText}
            fontSize={size > 30 ? '10' : '8'}
            fill="#fff"
          >
            {Math.round(normalizedValue)}%
          </text>
        )}
      </svg>
      {label && <span className={styles.progressRingLabel}>{label}</span>}
    </div>
  );
};