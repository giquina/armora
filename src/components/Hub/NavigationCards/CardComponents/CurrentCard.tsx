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
      </div>

      {/* Simplified Active State - When protection is active */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          <div className={styles.activeProtectionState}>
            <div className={styles.activeStatusLine}>
              <span className={styles.pulseIndicator}>●</span>
              <span className={styles.activeStatusText}>PROTECTION ACTIVE</span>
            </div>
            <div className={styles.activeTierLine}>
              <span className={styles.activeCpoName}>CPO {data.assignmentData?.officerName?.split(' ')[1] || 'Davis'}</span>
              <span className={styles.bullet}>•</span>
              <span
                className={styles.activeServiceTier}
                style={{ color: getTierColor(data.serviceTier) }}
              >
                {data.serviceTier}
              </span>
            </div>
            <button
              className={styles.viewLiveProtectionBtn}
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to Active view
              }}
            >
              <span className={styles.liveIcon}>📡</span>
              View Live Protection
              <span className={styles.arrowIcon}>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Empty State with Next Assignment Preview */}
      {data.count === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <span className={styles.emptyIcon}>🛡️</span>
            <div className={styles.emptyTextGroup}>
              <span className={styles.emptyTitle}>No Active Protection</span>
              <span className={styles.emptySubtext}>Next scheduled: Today 4:30 PM</span>
            </div>
          </div>
          <button className={styles.requestProtectionBtn}>
            <span className={styles.requestIcon}>➕</span>
            Request Protection
          </button>
        </div>
      )}
    </div>
  );
});