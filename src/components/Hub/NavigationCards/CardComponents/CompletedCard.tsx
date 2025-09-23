import React from 'react';
import { RatingStars } from './MicroVisualizations/RatingStars';
import styles from '../NavigationCards.module.css';

interface CompletedCardData {
  monthLabel: string;
  totalCompleted: number;
  averageRating: number;
  lastAssignment: string;
  pendingRatings: number;
  loyaltyPoints: number;
  pointsToNextTier: number;
  spentThisMonth: string;
  count: number;
}

interface CompletedCardProps {
  data: CompletedCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
  tabId?: string;
  ariaControls?: string;
}

export const CompletedCard: React.FC<CompletedCardProps> = ({
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

  // Calculate loyalty progress percentage
  const loyaltyProgressPercent = ((data.loyaltyPoints % 1000) / 1000) * 100;

  const quickActions = [
    { icon: '⭐', label: 'Rate', handler: () => console.log('Open rating') },
    { icon: '📄', label: 'Invoice', handler: () => console.log('Download invoice') }
  ];

  return (
    <button
      className={`${styles.navCard} ${styles.completed} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-controls={ariaControls}
      id={tabId}
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
          {/* Main Stats */}
          <div className={styles.statsRow}>
            <div className={styles.monthSummary}>
              <span className={styles.statLabel}>{data.monthLabel}</span>
              <span className={styles.statNumber}>{data.totalCompleted} assignments</span>
              <span className={styles.spentAmount}>{data.spentThisMonth} spent</span>
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
                <div
                  key={index}
                  className={styles.quickAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.handler();
                  }}
                  title={action.label}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      action.handler();
                    }
                  }}
                >
                  <span className={styles.actionIcon}>{action.icon}</span>
                </div>
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