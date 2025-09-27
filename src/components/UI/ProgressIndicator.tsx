import styles from './ProgressIndicator.module.css';

interface ProgressStep {
  label: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  variant?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  className?: string;
}

export function ProgressIndicator({ 
  steps, 
  variant = 'horizontal', 
  showLabels = true,
  className = ''
}: ProgressIndicatorProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className={`${styles.container} ${styles[variant]} ${className}`}>
      {/* Progress Bar */}
      <div className={styles.progressTrack}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={completedSteps}
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-label={`Progress: ${completedSteps} of ${steps.length} steps completed`}
        />
      </div>

      {/* Step Indicators */}
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styles.step} ${
              step.completed ? styles.completed : ''
            } ${step.current ? styles.current : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Step ${index + 1}: ${step.label}${
              step.completed ? ' (completed)' : step.current ? ' (current)' : ''
            }`}
          >
            <div className={styles.stepIndicator}>
              {step.completed ? (
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M13.5 4.5L6 12L2.5 8.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className={styles.stepNumber}>{index + 1}</span>
              )}
            </div>
            
            {showLabels && (
              <span className={styles.stepLabel}>{step.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Pre-built progress indicator for protection assignment flow - Updated for consistent 3-step flow
export function BookingProgressIndicator({ currentStep }: { currentStep: string }) {
  const bookingSteps: ProgressStep[] = [
    {
      label: 'Security Level',
      completed: ['location-picker', 'protection assignment-confirmation', 'protection assignment-success'].includes(currentStep),
      current: currentStep === 'vehicle-selection'
    },
    {
      label: 'Route Planning',
      completed: ['protection assignment-confirmation', 'protection assignment-success'].includes(currentStep),
      current: currentStep === 'location-picker'
    },
    {
      label: 'Confirmation',
      completed: currentStep === 'protection assignment-success',
      current: currentStep === 'protection assignment-confirmation'
    }
  ];

  return (
    <div className={styles.bookingProgress}>
      <ProgressIndicator 
        steps={bookingSteps} 
        variant="horizontal" 
        showLabels={true}
      />
    </div>
  );
}