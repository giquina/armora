import { FC, memo, useState } from 'react';
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

export const CompletedCard: FC<CompletedCardProps> = memo(({
  data,
  isActive,
  onClick,
  screenWidth = 375,
  tabId,
  ariaControls
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showVisuals = screenWidth >= 320;
  const isMobile = screenWidth <= 414;

  // Calculate loyalty progress percentage


  return (
    <div
      className={`${styles.navCard} ${styles.completed} ${isActive ? styles.active : ''}`}
      data-type="completed"
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

      {/* Compact Content - Always Visible */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Essential Info Row */}
          <div className={styles.essentialInfo}>
            <div className={styles.statusSection}>
              <span className={styles.greenIndicator}>✓</span>
              <span className={styles.statusText}>COMPLETED</span>
            </div>
            <div className={styles.keyStats}>
              <span className={styles.completedCount}>15 journeys</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.averageRating}>4.9★</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.spentAmount}>{data.spentThisMonth}</span>
            </div>
            <button
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className={styles.expandedDetails}>
              {/* Safety Statistics */}
              <div className={styles.statsSection}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>15</span>
                  <span className={styles.statLabel}>Secure Journeys</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>87</span>
                  <span className={styles.statLabel}>Hours Protected</span>
                </div>
                <div className={styles.safetyStat}>
                  <span className={styles.safetyBadge}>✓</span>
                  <span className={styles.safetyText}>100% Safety Record</span>
                </div>
              </div>

              {/* Value Statement */}
              <div className={styles.valueSection}>
                <div className={styles.investmentRow}>
                  <span className={styles.investmentLabel}>Safety investment:</span>
                  <span className={styles.investmentAmount}>£3,250</span>
                </div>
                <div className={styles.responseTime}>
                  <span className={styles.responseLabel}>Avg response:</span>
                  <span className={styles.responseValue}>12 minutes</span>
                </div>
              </div>

              {/* Rating Details */}
              {showVisuals && (
                <div className={styles.ratingSection}>
                  <RatingStars
                    rating={data.averageRating}
                    size="small"
                    showNumber={true}
                    className={styles.averageRating}
                  />
                  <span className={styles.ratingLabel}>Protection quality rating</span>
                </div>
              )}

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📋 History
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📄 Report
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  💳 Invoice
                </button>
              </div>
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
    </div>
  );
});