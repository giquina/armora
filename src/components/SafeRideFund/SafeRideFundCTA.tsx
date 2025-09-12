import React, { useState, useEffect } from 'react';
import styles from './SafeRideFundCTA.module.css';

interface SafeRideFundCTAProps {
  onClick: () => void;
}

const SafeRideFundCTA: React.FC<SafeRideFundCTAProps> = ({ onClick }) => {
  const [hasViewedModal, setHasViewedModal] = useState(false);

  useEffect(() => {
    const viewed = localStorage.getItem('safeRideFundModalViewed');
    if (viewed) {
      setHasViewedModal(true);
    }
  }, []);

  return (
    <div className={`${styles.ctaContainer} ${hasViewedModal ? styles.reduced : ''}`}>
      <button
        className={styles.ctaButton}
        onClick={onClick}
        aria-label="Learn about Safe Ride Fund impact"
      >
        <span className={styles.ctaText}>
          🛡️ Learn About Our Impact
        </span>
      </button>
    </div>
  );
};

export default SafeRideFundCTA;