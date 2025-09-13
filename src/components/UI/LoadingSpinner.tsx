import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'light' | 'dark';
  text?: string;
  inline?: boolean;
  className?: string;
}

export function LoadingSpinner({
  size = 'medium',
  variant = 'primary',
  text,
  inline = false,
  className = ''
}: LoadingSpinnerProps) {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[variant],
    inline && styles.inline,
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.container,
    inline && styles.containerInline
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} aria-hidden="true">
        <div className={styles.ring}></div>
      </div>
      {text && (
        <span className={styles.text}>{text}</span>
      )}
    </div>
  );
}