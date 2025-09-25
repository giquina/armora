import React, { useState, useEffect } from 'react';
import styles from './SafeAssignmentFundCTA.module.css';

interface SafeAssignmentFundCTAProps {
  onClick: () => void;
}

const SafeAssignmentFundCTA: React.FC<SafeAssignmentFundCTAProps> = ({ onClick }) => {
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

export default SafeAssignmentFundCTA;