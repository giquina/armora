import React from 'react';
import { SparklineChart } from './MicroVisualizations/SparklineChart';
import styles from '../NavigationCards.module.css';

interface AnalyticsCardData {
  monthlySpend: number;
  spendTrend: number;
  sparklineData: number[];
  topStat: string;
  savingsAchieved: number;
  reportStatus: 'Ready' | 'Generate';
  lastUpdated: string;
  hasNewReport: boolean;
}

interface AnalyticsCardProps {
  data: AnalyticsCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  data,
  isActive,
  onClick,
  screenWidth = 375
}) => {
  // With 1-per-row layout, we have full width to show all data
  const showFullData = true;
  const showVisuals = screenWidth >= 320;

  const getTrendColor = (trend: number) => {
    // For spending, negative is good (green), positive is bad (red)
    return trend < 0 ? '#00FF88' : trend > 0 ? '#FF6B6B' : '#FFD700';
  };

  const getTrendIcon = (trend: number) => {
    return trend < 0 ? '↓' : trend > 0 ? '↑' : '→';
  };

  const quickActions = [
    { icon: '📊', label: 'Full Report', handler: () => console.log('Open full report') },
    { icon: '📤', label: 'Export', handler: () => console.log('Export data') }
  ];

  return (
    <button
      className={`${styles.navCard} ${styles.analytics} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className={styles.navCardHeader}>
        <div className={styles.navCardLeft}>
          <span className={styles.navCardIcon}>📊</span>
          <span className={styles.navCardTitle}>Analytics</span>
          {data.hasNewReport && (
            <span className={styles.newBadge}>NEW</span>
          )}
        </div>
        {isActive && <span className={styles.activeIndicator}>●</span>}
      </div>

      {/* Enhanced Content */}
      <div className={styles.cardContent}>
        {/* Monthly Spend & Trend */}
        <div className={styles.spendSection}>
          <div className={styles.monthlySpend}>
            <span className={styles.spendAmount}>£{data.monthlySpend.toLocaleString()}</span>
            <div
              className={styles.spendTrend}
              style={{ color: getTrendColor(data.spendTrend) }}
            >
              <span className={styles.trendIcon}>{getTrendIcon(data.spendTrend)}</span>
              <span className={styles.trendPercent}>{Math.abs(data.spendTrend)}%</span>
            </div>
          </div>
          <div className={styles.spendLabel}>vs last month</div>
        </div>

        {/* Sparkline Chart */}
        {showVisuals && data.sparklineData.length > 0 && (
          <div className={styles.chartSection}>
            <div className={styles.chartLabel}>Last 30 days</div>
            <SparklineChart
              data={data.sparklineData}
              color="#FF6B6B"
              height={25}
              width={70}
              className={styles.sparkline}
            />
          </div>
        )}

        {/* Top Stat */}
        <div className={styles.topStat}>
          <span className={styles.statHighlight}>{data.topStat}</span>
        </div>

        {/* Savings Achieved */}
        {showFullData && (
          <div className={styles.savingsSection}>
            <div className={styles.savingsAmount}>£{data.savingsAchieved} saved</div>
            <div className={styles.savingsLabel}>this month</div>
          </div>
        )}

        {/* Report Status */}
        <div className={styles.reportSection}>
          <div className={styles.reportStatus}>
            <span
              className={styles.statusDot}
              style={{
                backgroundColor: data.reportStatus === 'Ready' ? '#00FF88' : '#FFD700'
              }}
            />
            <span className={styles.statusText}>Report {data.reportStatus}</span>
          </div>
          {showFullData && (
            <div className={styles.lastUpdated}>Updated {data.lastUpdated}</div>
          )}
        </div>

        {/* Quick Actions */}
        {showVisuals && (
          <div className={styles.quickActions}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={styles.quickAction}
                onClick={(e) => {
                  e.stopPropagation();
                  action.handler();
                }}
                title={action.label}
              >
                <span className={styles.actionIcon}>{action.icon}</span>
              </button>
            ))}
          </div>
        )}

        {/* Smart Insight */}
        {showFullData && (
          <div className={styles.smartInsight}>
            You save most with Executive tier
          </div>
        )}
      </div>
    </button>
  );
};