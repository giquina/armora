import React from 'react';
import styles from './ModernHeader.module.css';

interface ModernHeaderProps {
  /** Current step in the protection request flow */
  currentStep: number;
  /** Total number of steps in the flow */
  totalSteps: number;
  /** Page title to display */
  title: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Back button click handler */
  onBack: () => void;
  /** Optional close button click handler */
  onClose?: () => void;
  /** Whether to show the progress indicator */
  showProgress?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <span className={styles.progressText}>
        {currentStep} of {totalSteps}
      </span>
    </div>
  );
};

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  onBack,
  onClose,
  showProgress = true,
  className = ''
}) => {
  return (
    <header className={`${styles.modernHeader} ${className}`}>
      {/* Top Action Bar */}
      <div className={styles.actionBar}>
        <button
          className={styles.backButton}
          onClick={onBack}
          aria-label="Go back"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        {showProgress && (
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        )}

        {onClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Title Section */}
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}
      </div>
    </header>
  );
};