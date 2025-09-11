import React, { useState, useEffect } from 'react';
import styles from './ProgressIndicator.module.css';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  showStepNumbers?: boolean;
  onStepClick?: (step: number) => void;
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  onPrevious,
  showStepNumbers = true,
  onStepClick
}: ProgressIndicatorProps) {
  const [previousStep, setPreviousStep] = useState(currentStep);
  const [isUpdating, setIsUpdating] = useState(false);
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  // Handle step changes with animation
  useEffect(() => {
    if (currentStep !== previousStep) {
      setIsUpdating(true);
      const timer = setTimeout(() => {
        setIsUpdating(false);
        setPreviousStep(currentStep);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentStep, previousStep]);

  return (
    <div className={styles.container}>
      {/* Step counter */}
      {showStepNumbers && (
        <div className={styles.stepCounter}>
          <span className={`${styles.currentStep} ${isUpdating ? styles.updating : ''}`}>Step {currentStep}</span>
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

      {/* Enhanced Progress dots with interactivity */}
      <div className={styles.progressDots}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = isCompleted && onStepClick;
          
          return (
            <div
              key={index}
              className={`${styles.dot} ${
                isCompleted ? styles.dotCompleted : 
                isCurrent ? styles.dotCurrent : 
                styles.dotUpcoming
              }`}
              onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onStepClick(stepNumber);
                }
              }}
              tabIndex={isClickable ? 0 : -1}
              role={isClickable ? 'button' : undefined}
              aria-label={`Step ${stepNumber} ${
                isCompleted ? 'completed - click to return' : 
                isCurrent ? 'current' : 
                'upcoming'
              }`}
              style={{
                cursor: isClickable ? 'pointer' : 'default'
              }}
              title={`Step ${stepNumber}${isClickable ? ' - Click to return to this step' : ''}`}
            />
          );
        })}
      </div>

      {/* Progress percentage indicator */}
      <div className={styles.progressText}>
        <span className={`${styles.progressPercentage} ${isUpdating ? styles.updating : ''}`}>
          {Math.round(progressPercentage)}% complete
        </span>
        <span className={`${styles.estimatedTime} ${isUpdating ? styles.updating : ''}`}>
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