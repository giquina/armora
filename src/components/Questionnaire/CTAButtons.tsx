import React from 'react';
import styles from './CTAButtons.module.css';
import { Icon } from '../UI/Icon';

interface CTAButton {
  text: string;
  action: () => void;
  disabled?: boolean;
  style: 'primary' | 'secondary' | 'ghost' | 'text';
  icon?: string;
  show?: boolean;
}

interface CTAButtonsProps {
  currentStep: number;
  totalSteps: number;
  hasSelection: boolean;
  onNext: () => void;
  onPrevious?: () => void;
  onSaveExit: () => void;
  onHelp: () => void;
  onSkip?: () => void;
  isLastStep: boolean;
  dynamicBackText?: string;
  dynamicContinueText?: string;
}

export function CTAButtons({
  currentStep,
  totalSteps,
  hasSelection,
  onNext,
  onPrevious,
  onSaveExit,
  onHelp,
  onSkip,
  isLastStep,
  dynamicBackText = "Back",
  dynamicContinueText = "Continue"
}: CTAButtonsProps) {
  
  const primaryCTA: CTAButton = {
    text: isLastStep ? 'Complete Security Assessment' : dynamicContinueText,
    action: onNext,
    disabled: !hasSelection,
    style: 'primary'
  };

  const secondaryCTAs: CTAButton[] = [
    // NEVER show back button on step 1
    ...(onPrevious && currentStep > 1 ? [{
      text: 'Back',
      icon: 'chevron-left',
      action: onPrevious,
      style: 'secondary' as const,
      show: true,
    }] : []),
    {
      text: 'Save & Exit',
      icon: 'save',
      action: onSaveExit,
      style: 'ghost' as const,
      show: true
    }
  ];

  // Utility CTAs (Need Help?, Skip Step) are intentionally removed for consistency across steps.

  return (
    <div className={styles.ctaContainer}>
      {/* Horizontal CTA Buttons Row */}
      <div className={styles.ctaButtonsRow}>
  {/* Primary CTA */}
        <button
          onClick={primaryCTA.action}
          disabled={primaryCTA.disabled}
          className={`${styles.ctaButton} ${styles.primaryCTA} premium-button`}
        >
          <span className={styles.ctaLabel}><Icon name="arrow-right" size={22} /> {primaryCTA.text}</span>
        </button>

        {/* Secondary CTAs */}
        {secondaryCTAs.map((cta, index) => (
          cta.show !== false && (
            <button
              key={index}
              onClick={cta.action}
              disabled={cta.disabled}
              className={`${styles.ctaButton} ${styles.secondaryCTA} premium-button micro-bounce`}
            >
              {cta.icon && <Icon name={cta.icon as any} size={22} />}
              <span className={styles.ctaLabel}>{cta.text}</span>
            </button>
          )
        ))}

    {/* No utility CTAs on any step */}
      </div>

      {/* Remove Progress Indicator - it's already at the top */}
    </div>
  );
}