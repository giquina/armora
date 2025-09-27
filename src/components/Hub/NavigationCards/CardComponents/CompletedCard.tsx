import { FC, memo } from 'react';
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
  // With 1-per-row layout, we have full width to show all data
  const showVisuals = screenWidth >= 320;

  // Calculate loyalty progress percentage


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
          {/* Header with Green Checkmark */}
          <div className={styles.completedHeader}>
            <div className={styles.statusSection}>
              <span className={styles.greenIndicator}>✓</span>
              <span className={styles.statusText}>THIS MONTH</span>
            </div>
            <div className={styles.summaryTitle}>Protection Summary</div>
          </div>

          {/* Safety Statistics - Reframe from points */}
          <div className={styles.safetyStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>15</span>
              <span className={styles.statLabel}>Secure Journeys Completed</span>
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

          {/* Value Statement - Investment Focus */}
          <div className={styles.valueStatement}>
            <div className={styles.investmentRow}>
              <span className={styles.investmentLabel}>Your investment in safety:</span>
              <span className={styles.investmentAmount}>£3,250</span>
            </div>
            <div className={styles.responseTime}>
              <span className={styles.responseLabel}>Average response time:</span>
              <span className={styles.responseValue}>12 minutes</span>
            </div>
          </div>

          {/* Rating Section - Keep for trust building */}
          {showVisuals && (
            <div className={styles.ratingSection}>
              <RatingStars
                rating={data.averageRating}
                size="small"
                showNumber={true}
                className={styles.averageRating}
              />
              <span className={styles.ratingLabel}>Your protection quality rating</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span className={styles.buttonIcon}>📋</span>
              <span className={styles.buttonLabel}>View Protection History</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span className={styles.buttonIcon}>📄</span>
              <span className={styles.buttonLabel}>Download Report</span>
            </button>
          </div>
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
});