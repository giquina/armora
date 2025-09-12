import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './NameConfirmationModal.module.css';

interface NameConfirmationModalProps {
  name: string;
  isOpen: boolean;
  onConfirm: () => void;
  onSkip: () => void;
  onClose?: () => void;
  isNameUpdate?: boolean;
}

export function NameConfirmationModal({ 
  name, 
  isOpen, 
  onConfirm, 
  onSkip, 
  onClose,
  isNameUpdate = false 
}: NameConfirmationModalProps) {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Get greeting based on time of day (could be used for future enhancements)
  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return 'Good morning';
  //   if (hour < 17) return 'Good afternoon';
  //   return 'Good evening';
  // };

  // Handle modal entry animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimatingIn(true);
      setIsAnimatingOut(false);
      
      const timer = setTimeout(() => {
        setIsAnimatingIn(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsAnimatingOut(true);
        setTimeout(() => {
          onConfirm();
        }, 300);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsAnimatingOut(true);
        setTimeout(() => {
          onSkip();
        }, 300);
      }
    };

    // Focus trap - prevent tabbing outside modal
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          `.${styles.modal} button, .${styles.modal} [tabindex]:not([tabindex="-1"])`
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleFocusTrap);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first button
    const timer = setTimeout(() => {
      const primaryButton = document.querySelector(`.${styles.primaryButton}`) as HTMLElement;
      primaryButton?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleFocusTrap);
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [isOpen, onConfirm, onSkip]);

  const handleConfirm = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  const handleSkip = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  // Truncate long names for display
  const displayName = name.length > 20 ? `${name.substring(0, 20)}...` : name;
  
  // Get modal title based on context
  const getTitle = () => {
    if (isNameUpdate) {
      return `Updated! We'll now call you ${displayName}`;
    }
    return `Welcome, ${displayName}!`;
  };

  // Get main message based on context
  const getMainMessage = () => {
    if (isNameUpdate) {
      return `Perfect! We've updated your name to ${displayName} throughout your journey with Armora.`;
    }
    return `Perfect! We'll call you ${displayName} throughout your journey with Armora.`;
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={`${styles.overlay} ${isAnimatingIn ? styles.overlayAnimatingIn : ''} ${isAnimatingOut ? styles.overlayAnimatingOut : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        className={`${styles.modal} ${isAnimatingIn ? styles.modalAnimatingIn : ''} ${isAnimatingOut ? styles.modalAnimatingOut : ''}`}
      >
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.waveEmoji}>
            <span className={`${styles.wave} ${isAnimatingIn ? styles.waveAnimating : ''}`}>👋</span>
          </div>
          <h2 id="modal-title" className={styles.title}>
            {getTitle()}
          </h2>
          <div className={styles.goldenUnderline}></div>
        </div>

        {/* Body Section */}
        <div className={styles.body}>
          <p id="modal-description" className={styles.mainMessage}>
            {getMainMessage()}
          </p>

          <div className={styles.assessmentPreview}>
            <div className={styles.assessmentHeader}>
              <span className={styles.assessmentIcon}>📋</span>
              <span>Your Security Assessment</span>
            </div>
            <div className={styles.assessmentDetails}>
              <div className={styles.assessmentDetail}>
                <span className={styles.detailIcon}>⏱️</span>
                <span>Time Required: 10 minutes</span>
              </div>
              <div className={styles.assessmentDetail}>
                <span className={styles.detailIcon}>🎯</span>
                <span>Purpose: Create your personalized security profile</span>
              </div>
            </div>
          </div>

          <div className={styles.benefitsSection}>
            <h3 className={styles.benefitsTitle}>Your responses help us:</h3>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitItem}>
                <span className={styles.bulletPoint}>•</span>
                <span>Match you with qualified SIA officers</span>
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.bulletPoint}>•</span>
                <span>Understand your specific security needs</span>
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.bulletPoint}>•</span>
                <span>Provide tailored protection services</span>
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.bulletPoint}>•</span>
                <span>Save your preferences for future bookings</span>
              </li>
            </ul>
          </div>

          <div className={styles.valueProposition}>
            <p>
              <strong>This one-time setup ensures every journey is perfectly protected based on YOUR specific requirements.</strong>
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className={styles.footer}>
          <button
            className={styles.primaryButton}
            onClick={handleConfirm}
            type="button"
            aria-label={`Continue with personalized assessment as ${displayName}`}
          >
            Let's Build Your Profile →
          </button>
          <button
            className={styles.secondaryButton}
            onClick={handleSkip}
            type="button"
            aria-label="Skip personalization and continue anonymously"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal in portal to body
  return createPortal(modalContent, document.body);
}