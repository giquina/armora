import { useState, useCallback } from 'react';
import styles from './BookingProgress.module.css';

type BookingStep = 'service' | 'location' | 'schedule' | 'payment' | 'confirmation';

interface BookingProgressProps {
  currentStep: BookingStep;
  completedSteps: BookingStep[];
  totalSteps?: number;
  showStepLabels?: boolean;
  compact?: boolean;
}

interface StepInfo {
  id: BookingStep;
  label: string;
  shortLabel: string;
  icon: string;
  order: number;
}

const BOOKING_STEPS: StepInfo[] = [
  { id: 'service', label: 'Select Service', shortLabel: 'Service', icon: '🚗', order: 1 },
  { id: 'location', label: 'Set Locations', shortLabel: 'Location', icon: '📍', order: 2 },
  { id: 'schedule', label: 'Choose Time', shortLabel: 'Time', icon: '⏰', order: 3 },
  { id: 'payment', label: 'Payment', shortLabel: 'Pay', icon: '💳', order: 4 },
  { id: 'confirmation', label: 'Confirmed', shortLabel: 'Done', icon: '✅', order: 5 }
];

export function BookingProgress({
  currentStep,
  completedSteps,
  totalSteps,
  showStepLabels = true,
  compact = false
}: BookingProgressProps) {
  // Use actual steps or custom number
  const steps = totalSteps
    ? BOOKING_STEPS.slice(0, totalSteps)
    : BOOKING_STEPS.filter(step =>
        completedSteps.includes(step.id) ||
        step.id === currentStep ||
        step.order <= BOOKING_STEPS.find(s => s.id === currentStep)!.order
      );

  const currentStepInfo = BOOKING_STEPS.find(step => step.id === currentStep);
  const currentStepOrder = currentStepInfo?.order || 1;
  const totalStepsCount = Math.max(steps.length, totalSteps || 5);
  const progressPercentage = Math.min(((currentStepOrder - 1) / (totalStepsCount - 1)) * 100, 100);

  const getStepStatus = (step: StepInfo): 'completed' | 'current' | 'upcoming' => {
    if (completedSteps.includes(step.id)) return 'completed';
    if (step.id === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepNumber = (step: StepInfo): number => {
    return steps.findIndex(s => s.id === step.id) + 1;
  };

  const getEstimatedTimeRemaining = (): string => {
    const remaining = totalStepsCount - currentStepOrder;
    if (remaining <= 0) return 'Complete';
    if (remaining === 1) return '~1 min remaining';
    return `~${remaining} mins remaining`;
  };

  return (
    <div className={`${styles.progressContainer} ${compact ? styles.compact : ''}`}>
      {/* Progress Header */}
      <div className={styles.progressHeader}>
        <div className={styles.stepInfo}>
          <span className={styles.stepCounter}>
            Step {currentStepOrder} of {totalStepsCount}
          </span>
          <span className={styles.currentStepLabel}>
            {currentStepInfo?.label || 'Processing'}
          </span>
        </div>
        <div className={styles.timeEstimate}>
          {getEstimatedTimeRemaining()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className={styles.progressPercentage}>
          {Math.round(progressPercentage)}% complete
        </div>
      </div>

      {/* Step Indicators */}
      {!compact && (
        <div className={styles.stepsContainer}>
          {steps.map((step) => {
            const status = getStepStatus(step);
            const stepNumber = getStepNumber(step);

            return (
              <div
                key={step.id}
                className={`${styles.stepIndicator} ${styles[status]}`}
              >
                <div className={styles.stepCircle}>
                  {status === 'completed' ? (
                    <span className={styles.checkmark}>✓</span>
                  ) : status === 'current' ? (
                    <span className={styles.stepIcon}>{step.icon}</span>
                  ) : (
                    <span className={styles.stepNumber}>{stepNumber}</span>
                  )}
                </div>

                {showStepLabels && (
                  <div className={styles.stepLabel}>
                    <span className={styles.stepTitle}>
                      {compact ? step.shortLabel : step.label}
                    </span>
                    {status === 'current' && (
                      <span className={styles.stepStatus}>In Progress</span>
                    )}
                    {status === 'completed' && (
                      <span className={styles.stepStatus}>Complete</span>
                    )}
                  </div>
                )}

                {/* Connection Line */}
                {stepNumber < steps.length && (
                  <div
                    className={`${styles.connectionLine} ${
                      status === 'completed' ? styles.completed : ''
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Compact Step Dots (when compact=true) */}
      {compact && (
        <div className={styles.compactSteps}>
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            return (
              <div
                key={step.id}
                className={`${styles.stepDot} ${styles[status]}`}
                title={step.label}
              >
                {status === 'completed' && <span className={styles.miniCheck}>✓</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Help Text */}
      <div className={styles.helpText}>
        {currentStep === 'service' && 'Choose your preferred security transport service'}
        {currentStep === 'location' && 'Set your Commencement Point and secureDestination locations'}
        {currentStep === 'schedule' && 'Select when you need the transport'}
        {currentStep === 'payment' && 'Confirm payment method and complete protection assignment'}
        {currentStep === 'confirmation' && 'Your protection assignment is confirmed and protection officer assigned'}
      </div>
    </div>
  );
}

// Progress hook for managing protection assignment flow
export function useBookingProgress(initialStep: BookingStep = 'service') {
  const [currentStep, setCurrentStep] = useState<BookingStep>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<BookingStep[]>([]);

  const completeStep = useCallback((step: BookingStep) => {
    setCompletedSteps(prev => {
      if (!prev.includes(step)) {
        return [...prev, step];
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((step: BookingStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex < BOOKING_STEPS.length - 1) {
      // Complete current step
      completeStep(currentStep);
      // Move to next step
      const nextStepId = BOOKING_STEPS[currentIndex + 1].id;
      setCurrentStep(nextStepId);
      return nextStepId;
    }
    return currentStep;
  }, [currentStep, completeStep]);

  const previousStep = useCallback(() => {
    const currentIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      const prevStepId = BOOKING_STEPS[currentIndex - 1].id;
      setCurrentStep(prevStepId);
      // Remove current step from completed (allow re-doing)
      setCompletedSteps(prev => prev.filter(s => s !== currentStep));
      return prevStepId;
    }
    return currentStep;
  }, [currentStep]);

  const resetProgress = useCallback(() => {
    setCurrentStep('service');
    setCompletedSteps([]);
  }, []);

  const getProgressPercentage = useCallback(() => {
    const currentStepIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    return Math.round(((currentStepIndex + 1) / BOOKING_STEPS.length) * 100);
  }, [currentStep]);

  const isStepCompleted = useCallback((step: BookingStep) => {
    return completedSteps.includes(step);
  }, [completedSteps]);

  const isStepAccessible = useCallback((step: BookingStep) => {
    const stepIndex = BOOKING_STEPS.findIndex(s => s.id === step);
    const currentIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);

    // Can access completed steps, current step, or next step
    return stepIndex <= currentIndex + 1 || completedSteps.includes(step);
  }, [currentStep, completedSteps]);

  return {
    currentStep,
    completedSteps,
    completeStep,
    goToStep,
    nextStep,
    previousStep,
    resetProgress,
    getProgressPercentage,
    isStepCompleted,
    isStepAccessible
  };
}