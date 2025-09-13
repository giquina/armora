import React from 'react';
import styles from './AchievementBanner.module.css';

interface MiniAchievementProps {
  onExpand: () => void;
  onDismiss: () => void;
}

const MiniAchievement: React.FC<MiniAchievementProps> = ({ onExpand, onDismiss }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onExpand();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss();
  };

  return (
    <div 
      className={`${styles.achievementBanner} ${styles.minimized}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onExpand();
        }
      }}
      aria-label="Click to expand achievement banner"
    >
      <div className={styles.miniContent}>
        <span className={styles.trophy}>🏆</span>
        <span>50% OFF</span>
      </div>
      <button
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Dismiss achievement"
        style={{ 
          marginLeft: '8px',
          width: '24px',
          height: '24px',
          fontSize: '14px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default MiniAchievement;