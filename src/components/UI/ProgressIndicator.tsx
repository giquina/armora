import React from 'react';
import styles from './ProgressIndicator.module.css';

export interface ProgressIndicatorProps {
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
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className={styles.container}>
      {showStepNumbers && (
        <div className={styles.stepCounter}>
          <span className={styles.currentStep}>Step {currentStep}</span>
          <span className={styles.totalSteps}>of {totalSteps}</span>
        </div>
      )}

      <div className={styles.progressBar}>
        <div className={styles.progressTrack}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className={styles.progressDots}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div
              key={index}
              className={`${styles.dot} ${
                isCompleted ? styles.dotCompleted : 
                isCurrent ? styles.dotCurrent : 
                styles.dotUpcoming
              }`}
            />
          );
        })}
      </div>

      <div className={styles.progressText}>
        <span className={styles.progressPercentage}>
          {Math.round(progressPercentage)}% complete
        </span>
      </div>
    </div>
  );
}

interface BookingProgressIndicatorProps {
  currentStep: 'location-picker' | 'booking-confirmation' | 'booking-success';
}

const BOOKING_STEPS = {
  'location-picker': { step: 1, title: 'Location & Time' },
  'booking-confirmation': { step: 2, title: 'Confirm Details' },
  'booking-success': { step: 3, title: 'Booking Complete' }
};

export function BookingProgressIndicator({ currentStep }: BookingProgressIndicatorProps) {
  const current = BOOKING_STEPS[currentStep];
  
  return (
    <div className={styles.bookingProgress}>
      <div className={styles.stepInfo}>
        <h3 className={styles.stepTitle}>{current.title}</h3>
        <span className={styles.stepIndicator}>Step {current.step} of 3</span>
      </div>
      
      <ProgressIndicator 
        currentStep={current.step} 
        totalSteps={3} 
        showStepNumbers={false}
      />
    </div>
  );
}