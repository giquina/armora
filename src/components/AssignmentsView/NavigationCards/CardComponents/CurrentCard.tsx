import React from 'react';
import { ProgressRing } from './MicroVisualizations/ProgressRing';
import styles from '../NavigationCards.module.css';

interface CurrentCardData {
  status: string;
  timeRemaining: string;
  officerName: string;
  officerStatus: 'online' | 'offline';
  currentLocation: string;
  serviceTier: 'Essential' | 'Executive' | 'Shadow';
  runningFare: string;
  progressPercent: number;
  eta: string;
  count: number;
}

interface CurrentCardProps {
  data: CurrentCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
}

export const CurrentCard: React.FC<CurrentCardProps> = ({
  data,
  isActive,
  onClick,
  screenWidth = 375
}) => {
  // With 1-per-row layout, we have full width to show all data
  const showFullData = true;
  const showVisuals = screenWidth >= 320;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Essential': return '#00D4FF';
      case 'Executive': return '#FFD700';
      case 'Shadow': return '#FF6B6B';
      default: return '#A0A0A0';
    }
  };

  const quickActions = [
    { icon: '📞', label: 'Call', handler: () => console.log('Call officer') },
    { icon: '📍', label: 'Track', handler: () => console.log('Open tracking') }
  ];

  return (
    <button
      className={`${styles.navCard} ${styles.current} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      {/* Left accent bar applied via CSS */}

      {/* Header */}
      <div className={styles.navCardHeader}>
        <div className={styles.navCardLeft}>
          <span className={styles.navCardIcon}>📋</span>
          <span className={styles.navCardTitle}>Current</span>
          <span className={styles.navCardCount}>({data.count})</span>
        </div>
        {isActive && <span className={styles.activeIndicator}>●</span>}
      </div>

      {/* Enhanced Content */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Primary Status */}
          <div className={styles.primaryStatus}>
            <span className={styles.statusText}>{data.status}</span>
            <div className={styles.liveIndicator}>
              <span className={`${styles.statusDot} ${styles[data.officerStatus]}`} />
              <span className={styles.statusLabel}>Live</span>
            </div>
          </div>

          {/* Time & Progress Row */}
          <div className={styles.progressRow}>
            <div className={styles.timeInfo}>
              <div className={styles.timeRemaining}>{data.timeRemaining}</div>
              <div className={styles.eta}>ETA {data.eta}</div>
            </div>
            {showVisuals && (
              <ProgressRing
                percent={data.progressPercent}
                color={getTierColor(data.serviceTier)}
                size={32}
                strokeWidth={2}
                className={styles.progressRing}
              />
            )}
          </div>

          {/* Officer & Location */}
          {showFullData && (
            <div className={styles.officerInfo}>
              <div className={styles.officerName}>{data.officerName}</div>
              <div className={styles.currentLocation}>{data.currentLocation}</div>
            </div>
          )}

          {/* Service Tier & Fare */}
          <div className={styles.bottomRow}>
            <div
              className={styles.serviceTier}
              style={{
                color: getTierColor(data.serviceTier),
                backgroundColor: `${getTierColor(data.serviceTier)}20`
              }}
            >
              {data.serviceTier}
            </div>
            <div className={styles.runningFare}>
              {data.runningFare}
              <span className={styles.fareIcon}>↗</span>
            </div>
          </div>

          {/* Quick Actions - Show on hover for larger screens */}
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
              On track to arrive 5 min early
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {data.count === 0 && (
        <div className={styles.emptyCardState}>
          <div className={styles.emptyText}>No active protection</div>
          <div className={styles.emptySubtext}>Request immediate service</div>
        </div>
      )}
    </button>
  );
};