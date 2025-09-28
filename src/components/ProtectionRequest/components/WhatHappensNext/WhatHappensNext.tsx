import React from 'react';
import styles from './WhatHappensNext.module.css';

export function WhatHappensNext() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>What Happens Next</h3>
      <div className={styles.stepsList}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>Receive CPO Details</h4>
            <p className={styles.stepDescription}>Get your officer's name, photo & ID number</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>Track Arrival</h4>
            <p className={styles.stepDescription}>Watch real-time location as CPO approaches</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>Verify Identity</h4>
            <p className={styles.stepDescription}>Check ID matches the details sent to you</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepContent}>
            <h4 className={styles.stepTitle}>Protection Begins</h4>
            <p className={styles.stepDescription}>CPO stays with you for full booking duration</p>
          </div>
        </div>
      </div>
    </div>
  );
}