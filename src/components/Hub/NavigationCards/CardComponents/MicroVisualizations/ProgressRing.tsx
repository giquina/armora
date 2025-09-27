import { FC } from 'react';

interface ProgressRingProps {
  percent: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ProgressRing: FC<ProgressRingProps> = ({
  percent,
  color = '#FFD700',
  size = 40,
  strokeWidth = 3,
  className
}) => {
  // Ensure percent is between 0 and 100
  const normalizedPercent = Math.min(100, Math.max(0, percent));

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedPercent / 100) * circumference;

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </svg>

      {/* Percentage text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: size > 30 ? '10px' : '8px',
          fontWeight: 600,
          color: color,
          lineHeight: 1
        }}
      >
        {Math.round(normalizedPercent)}%
      </div>
    </div>
  );
};