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
    console.log('🛡️ SafeRideFundCTA mounted, hasViewedModal:', !!viewed);
  }, []);

  const handleClick = () => {
    console.log('🛡️ SafeRideFundCTA clicked! Opening modal...');
    onClick();
  };

  return (
    <div className={`${styles.ctaContainer} ${hasViewedModal ? styles.reduced : ''}`}>
      <button
        className={styles.ctaButton}
        onClick={handleClick}
        aria-label="Learn about Safe Assignment Fund impact"
      >
        <span className={styles.ctaText}>
          🛡️ Learn About Our Impact
        </span>
      </button>
    </div>
  );
};

export default SafeRideFundCTA;