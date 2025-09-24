import React, { useState, useEffect } from 'react';
import { Booking, UserStats } from '../utils/mockData';
import styles from './AnalyticsDashboard.module.css';

interface AnalyticsDashboardProps {
  bookings: Booking[];
  userStats: UserStats;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface TrendData {
  month: string;
  protectionDetails: number;
  spending: number;
}

export function AnalyticsDashboard({ bookings, userStats }: AnalyticsDashboardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate service type distribution
  const getServiceDistribution = (): ChartData[] => {
    const distribution = bookings.reduce((acc, booking) => {
      acc[booking.serviceType] = (acc[booking.serviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'Standard', value: distribution.standard || 0, color: '#10B981' },
      { label: 'Executive', value: distribution.executive || 0, color: '#FFD700' },
      { label: 'Shadow', value: distribution.shadow || 0, color: '#8B45DB' }
    ];
  };

  // Calculate monthly trends
  const getMonthlyTrends = (): TrendData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      protectionDetails: Math.floor(Math.random() * 10) + 3,
      spending: Math.floor(Math.random() * 500) + 200
    }));
  };

  // Calculate time distribution
  const getTimeDistribution = (): ChartData[] => {
    return [
      { label: 'Morning (6-12)', value: 35, color: '#FFD700' },
      { label: 'Afternoon (12-18)', value: 25, color: '#10B981' },
      { label: 'Evening (18-24)', value: 40, color: '#8B45DB' }
    ];
  };

  const serviceData = getServiceDistribution();
  const trendData = getMonthlyTrends();
  const timeData = getTimeDistribution();

  const totalServices = serviceData.reduce((sum, item) => sum + item.value, 0);
  const averageServicesPerMonth = Math.floor(totalServices / 6);
  const topService = serviceData.reduce((max, item) => item.value > max.value ? item : max);

  return (
    <div className={`${styles.analyticsContainer} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.analyticsHeader}>
        <h2 className={styles.analyticsTitle}>📊 Your Service Analytics</h2>
        <div className={styles.timeframeSelector}>
          {(['week', 'month', 'year'] as const).map((timeframe) => (
            <button
              key={timeframe}
              className={`${styles.timeframeButton} ${selectedTimeframe === timeframe ? styles.active : ''}`}
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.analyticsGrid}>
        {/* Key Metrics */}
        <div className={styles.metricsCard}>
          <h3 className={styles.cardTitle}>Key Insights</h3>
          <div className={styles.metricsList}>
            <div className={styles.metricItem}>
              <span className={styles.metricIcon}>🎯</span>
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>Favorite Service</span>
                <span className={styles.metricValue}>{topService.label} ({topService.value} Protection Details)</span>
              </div>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricIcon}>📈</span>
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>Monthly Average</span>
                <span className={styles.metricValue}>{averageServicesPerMonth} services</span>
              </div>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricIcon}>💰</span>
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>Money Saved</span>
                <span className={styles.metricValue}>£{userStats.totalSaved.toLocaleString()}</span>
              </div>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricIcon}>⭐</span>
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>Average Rating</span>
                <span className={styles.metricValue}>{userStats.averageRating}/5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Distribution Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Service Type Distribution</h3>
          <div className={styles.pieChart}>
            <div className={styles.chartContainer}>
              {serviceData.map((item, index) => (
                <div
                  key={item.label}
                  className={styles.chartSegment}
                  style={{
                    '--percentage': `${totalServices > 0 ? (item.value / totalServices) * 100 : 0}%`,
                    '--color': item.color,
                    '--rotation': `${index * 120}deg`
                  } as React.CSSProperties}
                >
                  <div className={styles.segmentValue}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className={styles.chartLegend}>
              {serviceData.map((item) => (
                <div key={item.label} className={styles.legendItem}>
                  <div
                    className={styles.legendColor}
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className={styles.legendLabel}>{item.label}</span>
                  <span className={styles.legendValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Monthly Trends</h3>
          <div className={styles.barChart}>
            <div className={styles.chartBars}>
              {trendData.map((item, index) => (
                <div key={item.month} className={styles.barGroup}>
                  <div className={styles.barContainer}>
                    <div
                      className={styles.tripsBar}
                      style={{
                        height: `${(item.protectionDetails / 15) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    ></div>
                    <div
                      className={styles.spendingBar}
                      style={{
                        height: `${(item.spending / 700) * 100}%`,
                        animationDelay: `${index * 0.1 + 0.05}s`
                      }}
                    ></div>
                  </div>
                  <span className={styles.barLabel}>{item.month}</span>
                </div>
              ))}
            </div>
            <div className={styles.chartAxes}>
              <div className={styles.yAxisLabel}>Services / Spending (£100s)</div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#10B981' }}></div>
                  <span className={styles.legendLabel}>Services</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#FFD700' }}></div>
                  <span className={styles.legendLabel}>Spending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Usage by Time of Day</h3>
          <div className={styles.timeChart}>
            {timeData.map((item, index) => (
              <div key={item.label} className={styles.timeSlot}>
                <div className={styles.timeSlotHeader}>
                  <span className={styles.timeLabel}>{item.label}</span>
                  <span className={styles.timePercentage}>{item.value}%</span>
                </div>
                <div className={styles.timeBar}>
                  <div
                    className={styles.timeBarFill}
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                      animationDelay: `${index * 0.2}s`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Score */}
        <div className={styles.scoreCard}>
          <h3 className={styles.cardTitle}>🛡️ Safety Score</h3>
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreCircle}>
              <div className={styles.scoreValue}>98%</div>
              <div className={styles.scoreLabel}>Excellent</div>
            </div>
            <div className={styles.scoreDetails}>
              <div className={styles.scoreItem}>
                <span className={styles.scoreIcon}>✅</span>
                <span className={styles.scoreText}>All Protection Details completed safely</span>
              </div>
              <div className={styles.scoreItem}>
                <span className={styles.scoreIcon}>🚫</span>
                <span className={styles.scoreText}>Zero security incidents</span>
              </div>
              <div className={styles.scoreItem}>
                <span className={styles.scoreIcon}>⭐</span>
                <span className={styles.scoreText}>High Protection Officer ratings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className={styles.impactCard}>
          <h3 className={styles.cardTitle}>🌱 Environmental Impact</h3>
          <div className={styles.impactStats}>
            <div className={styles.impactItem}>
              <div className={styles.impactValue}>127kg</div>
              <div className={styles.impactLabel}>CO₂ Reduced</div>
              <div className={styles.impactDescription}>vs. multiple individual cars</div>
            </div>
            <div className={styles.impactItem}>
              <div className={styles.impactValue}>85%</div>
              <div className={styles.impactLabel}>Efficiency</div>
              <div className={styles.impactDescription}>optimized route planning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}