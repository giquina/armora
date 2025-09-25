import React from 'react';
import { SparklineChart } from './MicroVisualizations/SparklineChart';
import styles from '../NavigationCards.module.css';

interface AnalyticsCardData {
  monthlySpend: number;
  spendTrend: number;
  sparklineData: number[];
  topStat: string;
  spendingLabel: string;
  reportStatus: 'Ready' | 'Generate';
  lastUpdated: string;
  hasNewReport: boolean;
}

interface AnalyticsCardProps {
  data: AnalyticsCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
  tabId?: string;
  ariaControls?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  data,
  isActive,
  onClick,
  screenWidth = 375,
  tabId,
  ariaControls
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
      role="tab"
      aria-selected={isActive}
      aria-controls={ariaControls}
      id={tabId}
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
        {/* Header */}
        <div className={styles.analyticsHeader}>
          <div className={styles.statusSection}>
            <span className={styles.analyticsIcon}>📊</span>
            <span className={styles.statusText}>PROTECTION INSIGHTS</span>
          </div>
          <div className={styles.periodSelector}>Last 30 Days</div>
        </div>

        {/* Primary Metrics - Protection Focus */}
        <div className={styles.primaryMetrics}>
          <div className={styles.metricItem}>
            <span className={styles.metricNumber}>127</span>
            <span className={styles.metricLabel}>Hours of Protection Coverage</span>
          </div>
          <div className={styles.investmentMetric}>
            <span className={styles.investmentAmount}>£2,450</span>
            <span className={styles.investmentLabel}>Security Investment</span>
          </div>
          <div className={styles.trendIndicator}>
            <span
              className={styles.trendIcon}
              style={{ color: getTrendColor(data.spendTrend) }}
            >
              {getTrendIcon(data.spendTrend)}
            </span>
            <span className={styles.trendText}>18% increase in coverage</span>
          </div>
        </div>

        {/* Protection Calendar Heat Map Concept */}
        <div className={styles.heatMapSection}>
          <div className={styles.heatMapLabel}>Protection Calendar</div>
          <div className={styles.heatMapGrid}>
            {/* Simplified heat map representation */}
            <div className={styles.heatMapRow}>
              <div className={styles.heatMapDay}></div>
              <div className={`${styles.heatMapDay} ${styles.protected}`}></div>
              <div className={styles.heatMapDay}></div>
              <div className={`${styles.heatMapDay} ${styles.protected}`}></div>
              <div className={`${styles.heatMapDay} ${styles.protected}`}></div>
              <div className={styles.heatMapDay}></div>
              <div className={styles.heatMapDay}></div>
            </div>
            <div className={styles.heatMapRow}>
              <div className={styles.heatMapDay}></div>
              <div className={styles.heatMapDay}></div>
              <div className={`${styles.heatMapDay} ${styles.protected}`}></div>
              <div className={styles.heatMapDay}></div>
              <div className={`${styles.heatMapDay} ${styles.protected}`}></div>
              <div className={`${styles.heatMapDay} ${styles.protected}`}></div>
              <div className={styles.heatMapDay}></div>
            </div>
          </div>
          <div className={styles.heatMapLegend}>
            <span className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.protected}`}></div>
              Protected
            </span>
            <span className={styles.legendItem}>
              <div className={styles.legendColor}></div>
              Unprotected
            </span>
          </div>
        </div>

        {/* Insights */}
        <div className={styles.insights}>
          <div className={styles.insightItem}>Most protected routes: Home ↔ Office</div>
          <div className={styles.insightItem}>Peak protection: Weekday evenings</div>
          <div className={styles.recommendation}>Recommended: Add weekend coverage</div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Optimize coverage');
            }}
          >
            <span className={styles.buttonIcon}>⚡</span>
            <span className={styles.buttonLabel}>Optimize Coverage</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              console.log('View full analytics');
            }}
          >
            <span className={styles.buttonIcon}>📊</span>
            <span className={styles.buttonLabel}>View Full Analytics</span>
          </button>
        </div>
      </div>
    </button>
  );
};