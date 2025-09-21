import React from 'react';
import { RatingStars } from './MicroVisualizations/RatingStars';
import styles from '../NavigationCards.module.css';

interface CompletedCardData {
  monthProgress: number;
  totalCompleted: number;
  averageRating: number;
  lastAssignment: string;
  pendingRatings: number;
  loyaltyPoints: number;
  pointsToNextTier: number;
  savedThisMonth: string;
  count: number;
}

interface CompletedCardProps {
  data: CompletedCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
}

export const CompletedCard: React.FC<CompletedCardProps> = ({
  data,
  isActive,
  onClick,
  screenWidth = 375
}) => {
  // With 1-per-row layout, we have full width to show all data
  const showFullData = true;
  const showVisuals = screenWidth >= 320;

  // Calculate month progress percentage
  const monthProgressPercent = (data.monthProgress / 31) * 100;
  const loyaltyProgressPercent = ((data.loyaltyPoints % 1000) / 1000) * 100;

  const quickActions = [
    { icon: '⭐', label: 'Rate', handler: () => console.log('Open rating') },
    { icon: '📄', label: 'Invoice', handler: () => console.log('Download invoice') }
  ];

  return (
    <button
      className={`${styles.navCard} ${styles.completed} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className={styles.navCardHeader}>
        <div className={styles.navCardLeft}>
          <span className={styles.navCardIcon}>✅</span>
          <span className={styles.navCardTitle}>Completed</span>
          <span className={styles.navCardCount}>({data.count})</span>
        </div>
        {isActive && <span className={styles.activeIndicator}>●</span>}
        {data.pendingRatings > 0 && (
          <div className={styles.pendingBadge}>{data.pendingRatings}</div>
        )}
      </div>

      {/* Enhanced Content */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Month Progress */}
          <div className={styles.monthProgress}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>This month</span>
              <span className={styles.progressValue}>{data.monthProgress}/31 days</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${monthProgressPercent}%`,
                  backgroundColor: '#00FF88'
                }}
              />
            </div>
          </div>

          {/* Total & Rating */}
          <div className={styles.statsRow}>
            <div className={styles.totalCompleted}>
              <span className={styles.statNumber}>{data.totalCompleted}</span>
              <span className={styles.statLabel}>total</span>
            </div>
            {showVisuals && (
              <div className={styles.ratingSection}>
                <RatingStars
                  rating={data.averageRating}
                  size="small"
                  showNumber={true}
                  className={styles.averageRating}
                />
              </div>
            )}
          </div>

          {/* Last Assignment & Savings */}
          {showFullData && (
            <div className={styles.recentInfo}>
              <div className={styles.lastAssignment}>Last: {data.lastAssignment}</div>
              <div className={styles.monthlySavings}>Saved: {data.savedThisMonth}</div>
            </div>
          )}

          {/* Loyalty Points Progress */}
          {showVisuals && (
            <div className={styles.loyaltySection}>
              <div className={styles.loyaltyHeader}>
                <span className={styles.loyaltyPoints}>{data.loyaltyPoints} pts</span>
                <span className={styles.loyaltyNext}>{data.pointsToNextTier} to next tier</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${loyaltyProgressPercent}%`,
                    backgroundColor: '#FFD700'
                  }}
                />
              </div>
            </div>
          )}

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
          {showFullData && data.pendingRatings > 0 && (
            <div className={styles.smartInsight}>
              Rate {data.pendingRatings} assignments for £50 credit
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {data.count === 0 && (
        <div className={styles.emptyCardState}>
          <div className={styles.emptyText}>No completed assignments</div>
          <div className={styles.emptySubtext}>History will appear here</div>
        </div>
      )}
    </button>
  );
};