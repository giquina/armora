import React, { FC, memo, useState } from 'react';
import styles from '../NavigationCards.module.css';

interface Assignment {
  id: string;
  date: string;
  time: string;
  duration: string;
  officerName: string;
  officerSIA: string;
  serviceTier: 'Essential' | 'Executive' | 'Shadow';
  totalCost: number;
  status: string;
  location: {
    start: string;
    end: string;
  };
  rating?: number;
  vehicleType: string;
}

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
  assignmentData?: Assignment | null;
}

interface CurrentCardProps {
  data: CurrentCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
  tabId?: string;
  ariaControls?: string;
}

export const CurrentCard: FC<CurrentCardProps> = memo(({
  data,
  isActive,
  onClick,
  screenWidth = 375,
  tabId,
  ariaControls
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showFullData = screenWidth >= 768; // Only show all details on desktop
  const isMobile = screenWidth <= 414;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Essential': return '#00D4FF';
      case 'Executive': return '#FFD700';
      case 'Shadow': return '#FF6B6B';
      default: return '#A0A0A0';
    }
  };


  return (
    <div
      className={`${styles.navCard} ${styles.current} ${isActive ? styles.active : ''}`}
      data-type="current"
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

      {/* Compact Content - Always Visible */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Essential Info Row */}
          <div className={styles.essentialInfo}>
            <div className={styles.statusSection}>
              <span className={styles.pulseIndicator}>●</span>
              <span className={styles.statusText}>ACTIVE</span>
            </div>
            <div className={styles.keyStats}>
              <span className={styles.officerName}>CPO {data.assignmentData?.officerName?.split(' ')[1] || 'N/A'}</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.timeRemaining}>{data.timeRemaining}</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.investment}>{data.runningFare}</span>
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
              {/* Officer Section */}
              {data.assignmentData && (
                <div className={styles.officerSection}>
                  <div className={styles.officerInfo}>
                    <div className={styles.officerPhoto}>
                      <span className={styles.officerInitials}>
                        {data.assignmentData.officerName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={styles.officerDetails}>
                      <div className={styles.officerName}>CPO {data.assignmentData.officerName}</div>
                      <div className={styles.officerCredentials}>★★★★★ 4.9 • SIA ✓ • 12 Years</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Journey Progress */}
              <div className={styles.journeySection}>
                <div className={styles.locationRow}>
                  <span className={styles.locationFrom}>
                    📍 {data.assignmentData?.location.start.split(',')[0] || 'Kensington'}
                  </span>
                  <span className={styles.locationTo}>
                    🏢 {data.assignmentData?.location.end.split(',')[0] || 'Canary Wharf'}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${data.progressPercent}%` }} />
                </div>
                <div className={styles.progressText}>45 minutes remaining</div>
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📞 Call
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  🛡️ Support
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📍 Track
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {data.count === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🛡️</span>
          <span className={styles.emptyText}>No active protection</span>
        </div>
      )}
    </div>
  );
});