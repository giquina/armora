import React from 'react';
import styles from './BackButton.module.css';

interface BackButtonProps {
  onClick: () => void;
  showText?: boolean;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  showText = true,
  className = ''
}) => {
  return (
    <button
      className={`${styles.backButton} ${className}`}
      onClick={onClick}
      aria-label="Go back"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={styles.icon}
      >
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {showText && <span className={styles.text}>Back</span>}
    </button>
  );
};