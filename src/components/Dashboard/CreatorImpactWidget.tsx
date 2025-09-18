import React from 'react';
import styles from './CreatorImpactWidget.module.css';

interface CreatorImpactWidgetProps {
  className?: string;
}

export function CreatorImpactWidget({ className }: CreatorImpactWidgetProps) {
  return (
    <div className={`${styles.creatorWidget} ${className || ''}`}>
      <div className={styles.content}>
        <h3 className={styles.title}>Creator Impact</h3>
        <p className={styles.description}>
          Supporting content creators through safe transportation services.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.number}>150+</span>
            <span className={styles.label}>Creators Supported</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>2.5K+</span>
            <span className={styles.label}>Safe Journeys</span>
          </div>
        </div>
      </div>
    </div>
  );
}