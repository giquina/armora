import React from 'react';
import styles from './TrustIndicators.module.css';

export function TrustIndicators() {
  return (
    <div className={styles.trustIndicators}>
      <h3 className={styles.title}>Your Safety & Security</h3>
      <div className={styles.indicatorGrid}>
        <div className={styles.indicator}>
          <span className={styles.icon}>✓</span>
          <span className={styles.text}>All CPOs photo-verified</span>
        </div>
        <div className={styles.indicator}>
          <span className={styles.icon}>✓</span>
          <span className={styles.text}>See officer details before arrival</span>
        </div>
        <div className={styles.indicator}>
          <span className={styles.icon}>✓</span>
          <span className={styles.text}>Cancel anytime before arrival</span>
        </div>
        <div className={styles.indicator}>
          <span className={styles.icon}>✓</span>
          <span className={styles.text}>Emergency button during service</span>
        </div>
        <div className={styles.indicator}>
          <span className={styles.icon}>✓</span>
          <span className={styles.text}>12,000+ clients protected</span>
        </div>
      </div>
    </div>
  );
}