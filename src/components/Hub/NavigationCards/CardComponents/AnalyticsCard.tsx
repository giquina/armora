import { FC, memo, useState } from 'react';
import styles from '../NavigationCards.module.css';
import { SparklineChart, BarChart, ProgressRing, TrendIndicator } from '../../../UI/MicroVisualizations';

interface AnalyticsCardData {
  monthlySpend: number;
  spendTrend: number;
  sparklineData: number[];
  topStat: string;
  spendingLabel: string;
  reportStatus: 'Ready' | 'Generate';
  lastUpdated: string;
  hasNewReport: boolean;
  // Enhanced analytics data
  totalHours: number;
  totalInvestment: number;
  avgRating: number;
  statusProgress: number;
  weeklyData: { label: string; value: number }[];
  monthlyTrend: number;
  favoriteRoutes: { route: string; frequency: number }[];
  peakTimes: { time: string; percentage: number }[];
  protectionPatterns: {
    mostUsedTier: string;
    averageAssignmentDuration: number;
    frequentDestinations: string[];
    weekdayVsWeekend: { weekday: number; weekend: number };
  };
}

interface AnalyticsCardProps {
  data: AnalyticsCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
  tabId?: string;
  ariaControls?: string;
}

export const AnalyticsCard: FC<AnalyticsCardProps> = memo(({
  data,
  isActive,
  onClick,
  screenWidth = 375,
  tabId,
  ariaControls
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [showingExport, setShowingExport] = useState(false);
  const showVisuals = screenWidth >= 320;
  const isMobile = screenWidth <= 414;

  const getTrendColor = (trend: number) => {
    // For spending, negative is good (green), positive is bad (red)
    return trend < 0 ? '#00FF88' : trend > 0 ? '#FF6B6B' : '#FFD700';
  };

  const getTrendIcon = (trend: number) => {
    return trend < 0 ? '↓' : trend > 0 ? '↑' : '→';
  };


  return (
    <div
      className={`${styles.navCard} ${styles.analytics} ${isActive ? styles.active : ''}`}
      data-type="analytics"
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

      {/* Compact Content - Always Visible */}
      <div className={styles.cardContent}>
        {/* Essential Info Row - Improved Typography */}
        <div className={styles.essentialInfo}>
          <div className={styles.statusRow}>
            <div className={styles.statusSection}>
              <span className={styles.analyticsIcon}>📊</span>
              <span className={styles.statusText}>INSIGHTS</span>
            </div>
            <button
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
          <div className={styles.keyStats}>
            <span className={styles.coverageHours}>127h coverage</span>
            <span className={styles.bullet}>•</span>
            <span className={styles.investmentAmount}>£2,450</span>
            <span className={styles.bullet}>•</span>
            <span className={styles.trendIndicator} style={{ color: getTrendColor(data.spendTrend) }}>
              {getTrendIcon(data.spendTrend)} 18%
            </span>
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className={styles.expandedDetails}>
            {/* Time Range Filters */}
            <div className={styles.timeRangeFilters}>
              {(['week', 'month', 'all'] as const).map((range) => (
                <button
                  key={range}
                  className={`${styles.timeRangeBtn} ${selectedTimeRange === range ? styles.active : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTimeRange(range);
                  }}
                >
                  {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
                </button>
              ))}
            </div>

            {/* Enhanced Primary Metrics with Trends */}
            <div className={styles.enhancedMetricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricNumber}>{data.totalHours}</span>
                  <TrendIndicator value={23} size="small" />
                </div>
                <span className={styles.metricLabel}>Hours Protected</span>
                <SparklineChart
                  data={data.sparklineData}
                  width={50}
                  height={16}
                  color="#00FF88"
                />
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricNumber}>£{data.totalInvestment.toLocaleString()}</span>
                  <TrendIndicator value={data.monthlyTrend} size="small" />
                </div>
                <span className={styles.metricLabel}>Security Investment</span>
                <BarChart
                  data={data.weeklyData}
                  width={50}
                  height={16}
                  showLabels={false}
                />
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricNumber}>{data.avgRating}★</span>
                  <span className={styles.ratingCount}>(15 reviews)</span>
                </div>
                <span className={styles.metricLabel}>Service Rating</span>
                <ProgressRing
                  value={data.avgRating * 20}
                  size={24}
                  showPercentage={false}
                  color="#FFD700"
                />
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricNumber}>Gold</span>
                  <span className={styles.statusPoints}>230 pts to Platinum</span>
                </div>
                <span className={styles.metricLabel}>Status</span>
                <ProgressRing
                  value={data.statusProgress}
                  size={24}
                  color="#FFD700"
                  showPercentage={false}
                />
              </div>
            </div>

            {/* Protection Calendar Heat Map */}
            {showVisuals && (
              <div className={styles.heatMapSection}>
                <div className={styles.heatMapLabel}>Protection Calendar (Last 2 weeks)</div>
                <div className={styles.heatMapGrid}>
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
                    Standard
                  </span>
                </div>
              </div>
            )}

            {/* Protection Patterns Insights */}
            <div className={styles.protectionPatternsSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Your Protection Patterns</span>
              </div>

              <div className={styles.patternsGrid}>
                <div className={styles.patternInsight}>
                  <span className={styles.patternIcon}>🎯</span>
                  <div className={styles.patternContent}>
                    <span className={styles.patternLabel}>Preferred Tier</span>
                    <span className={styles.patternValue}>{data.protectionPatterns.mostUsedTier}</span>
                  </div>
                </div>

                <div className={styles.patternInsight}>
                  <span className={styles.patternIcon}>⏱️</span>
                  <div className={styles.patternContent}>
                    <span className={styles.patternLabel}>Avg Duration</span>
                    <span className={styles.patternValue}>{data.protectionPatterns.averageAssignmentDuration}h</span>
                  </div>
                </div>

                <div className={styles.patternInsight}>
                  <span className={styles.patternIcon}>📅</span>
                  <div className={styles.patternContent}>
                    <span className={styles.patternLabel}>Peak Usage</span>
                    <span className={styles.patternValue}>Weekday evenings</span>
                  </div>
                </div>
              </div>

              <div className={styles.behavioralInsights}>
                <div className={styles.insightItem}>
                  🏠↔🏢 Most protected route: {data.favoriteRoutes[0]?.route || 'Home ↔ Office'}
                </div>
                <div className={styles.insightItem}>
                  📊 Weekday vs Weekend: {data.protectionPatterns.weekdayVsWeekend.weekday}% / {data.protectionPatterns.weekdayVsWeekend.weekend}%
                </div>
                <div className={styles.recommendation}>
                  💡 Optimization: Consider weekend coverage packages for 15% savings
                </div>
              </div>
            </div>

            {/* Interactive Actions */}
            <div className={styles.interactiveActions}>
              <button
                className={styles.primaryActionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowingExport(!showingExport);
                }}
              >
                📊 Export Report
              </button>

              <div className={styles.secondaryActions}>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  ⚡ Optimize
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📈 Trends
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  🔍 Deep Dive
                </button>
              </div>
            </div>

            {/* Export Options */}
            {showingExport && (
              <div className={styles.exportOptions}>
                <div className={styles.exportHeader}>Export Analytics Report</div>
                <div className={styles.exportButtons}>
                  <button className={styles.exportBtn} onClick={(e) => e.stopPropagation()}>
                    📄 PDF Summary
                  </button>
                  <button className={styles.exportBtn} onClick={(e) => e.stopPropagation()}>
                    📊 Excel Data
                  </button>
                  <button className={styles.exportBtn} onClick={(e) => e.stopPropagation()}>
                    📧 Email Report
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});