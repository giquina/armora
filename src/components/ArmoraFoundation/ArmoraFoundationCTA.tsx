import React, { useState, useEffect } from 'react';
import styles from './ArmoraFoundationCTA.module.css';

interface ArmoraFoundationCTAProps {
  onClick: () => void;
}

const ArmoraFoundationCTA: React.FC<ArmoraFoundationCTAProps> = ({ onClick }) => {
  const [hasViewedModal, setHasViewedModal] = useState(false);

  useEffect(() => {
    const viewed = localStorage.getItem('armoraFoundationModalViewed');
    if (viewed) {
      setHasViewedModal(true);
    }
    console.log('🎬 ArmoraFoundationCTA mounted, hasViewedModal:', !!viewed);
  }, []);

  const handleClick = () => {
    console.log('🎬 ArmoraFoundationCTA clicked! Opening modal...');
    onClick();
  };

  return (
    <div className={`${styles.ctaContainer} ${hasViewedModal ? styles.reduced : ''}`}>
      <button
        className={styles.ctaButton}
        onClick={handleClick}
        aria-label="See what we're creating with Armora Foundation"
      >
        <span className={styles.ctaText}>
          🎬 See What We're Creating
        </span>
      </button>
    </div>
  );
};

export default ArmoraFoundationCTA;