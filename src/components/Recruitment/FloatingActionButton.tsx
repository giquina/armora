import React from 'react';
import styles from './FloatingActionButton.module.css';

interface FloatingActionButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export function FloatingActionButton({ onClick, isVisible }: FloatingActionButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      className={styles.fab}
      onClick={onClick}
      aria-label="Join Our Security Team"
      title="Join Our Security Team"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={styles.fabIcon}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <span className={styles.fabText}>Join Our Team</span>
    </button>
  );
}