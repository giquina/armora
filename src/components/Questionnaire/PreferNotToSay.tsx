import React from 'react';
import styles from './PreferNotToSay.module.css';

interface PreferNotToSayProps {
  isSelected: boolean;
  onChange: (selected: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function PreferNotToSay({ 
  isSelected, 
  onChange, 
  disabled = false,
  className = ''
}: PreferNotToSayProps) {
  
  const handleToggle = () => {
    if (!disabled) {
      onChange(!isSelected);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.separator}>
        <div className={styles.separatorLine}></div>
        <span className={styles.separatorText}>or</span>
        <div className={styles.separatorLine}></div>
      </div>
      
      <div 
        className={`${styles.preferOption} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
        onClick={handleToggle}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyPress={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className={styles.toggleContainer}>
          <div className={`${styles.toggle} ${isSelected ? styles.toggleActive : ''}`}>
            <div className={`${styles.toggleSlider} ${isSelected ? styles.sliderActive : ''}`}></div>
          </div>
          <div className={styles.textContainer}>
            <span className={styles.mainText}>Prefer not to say</span>
            <span className={styles.helperText}>You can update this later in settings</span>
          </div>
        </div>
        
        {isSelected && (
          <div className={styles.confirmationMessage}>
            <span className={styles.confirmationIcon}>✓</span>
            <span>Privacy option selected</span>
          </div>
        )}
      </div>
    </div>
  );
}