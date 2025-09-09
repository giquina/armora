import React from 'react';
import styles from './ProgressIndicator.module.css';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  showStepNumbers?: boolean;
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  onPrevious,
  showStepNumbers = true 
}: ProgressIndicatorProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={styles.container}>
      {/* Step counter */}
      {showStepNumbers && (
        <div className={styles.stepCounter}>
          <span className={styles.currentStep}>Step {currentStep}</span>
          <span className={styles.totalSteps}>of {totalSteps}</span>
        </div>
      )}

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressTrack}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          >
            <div className={styles.progressGlow}></div>
          </div>
        </div>
      </div>

      {/* Progress dots (mobile-friendly alternative) */}
      <div className={styles.progressDots}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              index + 1 <= currentStep ? styles.dotCompleted : 
              index + 1 === currentStep ? styles.dotCurrent : 
              styles.dotUpcoming
            }`}
            aria-label={`Step ${index + 1} ${
              index + 1 < currentStep ? 'completed' : 
              index + 1 === currentStep ? 'current' : 
              'upcoming'
            }`}
          />
        ))}
      </div>

      {/* Progress percentage indicator */}
      <div className={styles.progressText}>
        <span className={styles.progressPercentage}>
          {Math.round(progressPercentage)}% complete
        </span>
        <span className={styles.estimatedTime}>
          ~{Math.max(1, totalSteps - currentStep)} min remaining
        </span>
      </div>

      {/* Navigation hints (no top back button; bottom nav handles Back) */}
      <div className={styles.navigationHints}>
        <div className={styles.navigationTip}>
          Tap to select • Answers saved automatically
        </div>
      </div>
    </div>
  );
}