import React from 'react';
import styles from './hub-skeleton.module.css';

interface HubSkeletonProps {
  count?: number;
}

export function HubSkeleton({ count = 3 }: HubSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.hubSkeleton}>
          {/* Accent stripe */}
          <div className={styles.skeletonStripe} />

          {/* Header */}
          <div className={styles.skeletonHeader}>
            <div className={styles.skeletonInfo}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonLocation} />
            </div>
            <div className={styles.skeletonActions}>
              <div className={styles.skeletonFavorite} />
              <div className={styles.skeletonBadge} />
            </div>
          </div>

          {/* Service badges */}
          <div className={styles.skeletonBadges}>
            <div className={styles.skeletonServiceBadge} />
            <div className={styles.skeletonServiceBadge} />
            <div className={styles.skeletonServiceBadge} />
          </div>

          {/* Officer stats */}
          <div className={styles.skeletonOfficerSection}>
            <div className={styles.skeletonStats}>
              <div className={styles.skeletonStatItem}>
                <div className={styles.skeletonStatValue} />
                <div className={styles.skeletonStatLabel} />
              </div>
              <div className={styles.skeletonStatItem}>
                <div className={styles.skeletonStatValue} />
                <div className={styles.skeletonStatLabel} />
              </div>
              <div className={styles.skeletonStatItem}>
                <div className={styles.skeletonStatValue} />
                <div className={styles.skeletonStatLabel} />
              </div>
            </div>
          </div>

          {/* Performance section */}
          <div className={styles.skeletonPerformance}>
            <div className={styles.skeletonResponseTime} />
            <div className={styles.skeletonCoverage} />
            <div className={styles.skeletonLoad} />
          </div>

          {/* Meta section */}
          <div className={styles.skeletonMeta}>
            <div className={styles.skeletonRating} />
            <div className={styles.skeletonDistance} />
          </div>

          {/* Select button */}
          <div className={styles.skeletonSelectSection}>
            <div className={styles.skeletonSelectButton} />
          </div>
        </div>
      ))}
    </>
  );
}