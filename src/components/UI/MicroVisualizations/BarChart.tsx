import { FC } from 'react';
import styles from './MicroVisualizations.module.css';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

export const BarChart: FC<BarChartProps> = ({
  data,
  width = 120,
  height = 60,
  showLabels = true,
  showValues = false,
  className = ''
}) => {
  if (!data || data.length === 0) {
    return <div className={`${styles.chartEmpty} ${className}`} />;
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = width / data.length * 0.8;
  const barSpacing = width / data.length * 0.2;

  return (
    <div className={`${styles.barChartContainer} ${className}`}>
      <svg width={width} height={height} className={styles.barChartSvg}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 20);
          const x = index * (barWidth + barSpacing) + barSpacing / 2;
          const y = height - barHeight - (showLabels ? 15 : 5);

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || '#00FF88'}
                className={styles.barRect}
                rx={2}
              />
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 2}
                  textAnchor="middle"
                  className={styles.barValue}
                  fontSize="10"
                  fill="#fff"
                >
                  {item.value}
                </text>
              )}
              {showLabels && (
                <text
                  x={x + barWidth / 2}
                  y={height - 2}
                  textAnchor="middle"
                  className={styles.barLabel}
                  fontSize="9"
                  fill="#888"
                >
                  {item.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};