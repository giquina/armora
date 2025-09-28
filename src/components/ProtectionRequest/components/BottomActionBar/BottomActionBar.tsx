import React, { useState, useEffect } from 'react';
import styles from './BottomActionBar.module.css';

interface PricingBreakdown {
  basePrice: number;
  discountAmount?: number;
  finalPrice: number;
  hasDiscount?: boolean;
  originalPrice?: number;
}

interface ServiceInfo {
  name: string;
  rate: string;
  hourlyRate: number;
  situation?: string;
  journeyRoute?: string;
}

interface BottomActionBarProps {
  /** Whether the form is valid and ready to submit */
  isValid: boolean;
  /** Pricing breakdown for the service */
  pricing: PricingBreakdown;
  /** Service information */
  serviceInfo?: ServiceInfo;
  /** Primary action button text */
  primaryButtonText: string;
  /** Primary action click handler */
  onPrimaryAction: () => void;
  /** Secondary action button text (optional) */
  secondaryButtonText?: string;
  /** Secondary action click handler (optional) */
  onSecondaryAction?: () => void;
  /** Change selection click handler (optional) */
  onChangeSelection?: () => void;
  /** Loading state for primary action */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional information to display */
  additionalInfo?: string;
  /** Additional CSS classes */
  className?: string;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  isValid,
  pricing,
  serviceInfo,
  primaryButtonText,
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryAction,
  onChangeSelection,
  isLoading = false,
  error,
  additionalInfo,
  className = ''
}) => {
  const hasSelection = !!(serviceInfo && pricing);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-expand when service is selected
  useEffect(() => {
    if (hasSelection) {
      setIsMinimized(false);
    }
  }, [hasSelection]);

  return (
    <div className={`${styles.bottomActionBar} ${className} ${!hasSelection && isMinimized ? styles.minimized : ''}`}>
      {/* Minimize/Expand Button - Only show when no selection */}
      {!hasSelection && (
        <button
          className={styles.minimizeButton}
          onClick={() => setIsMinimized(!isMinimized)}
          type="button"
          aria-label={isMinimized ? 'Expand protection details' : 'Minimize protection details'}
        >
          <span className={styles.minimizeIcon}>
            {isMinimized ? '🔼' : '🔽'}
          </span>
          <span className={styles.minimizeText}>
            {isMinimized ? 'Show Details' : 'Hide Details'}
          </span>
        </button>
      )}

      {/* Pricing Summary */}
      <div className={`${styles.pricingSummary} ${!hasSelection && isMinimized ? styles.hidden : ''}`}>
        <div className={styles.pricingCompact}>

          {!hasSelection ? (
            /* INITIAL STATE - Full SIA-Compliant Content */
            <>
              <div className={styles.initialState}>
                <div className={styles.initialHeader}>
                  <h3 className={styles.initialTitle}>🛡️ Request Protection Services</h3>
                </div>

                <div className={styles.securityDetailInitial}>
                  <p className={styles.securityDescription}>Your security detail includes:</p>
                  <div className={styles.securityFeaturesCompact}>
                    <div className={styles.featureRow}>
                      <span className={styles.securityFeature}>• SIA-licensed protection officer</span>
                      <span className={styles.securityFeature}>• Secure vehicle with driver</span>
                    </div>
                    <div className={styles.featureRow}>
                      <span className={styles.securityFeature}>• Door-to-door close protection</span>
                      <span className={styles.securityFeature}>• Nationwide coverage</span>
                    </div>
                  </div>
                </div>

                <div className={styles.processStepsCompact}>
                  <div className={styles.stepRow}>
                    <div className={styles.processStep}>
                      <span className={styles.stepNumber}>①</span>
                      <span className={styles.stepText}>Select protection level</span>
                    </div>
                    <div className={styles.processStep}>
                      <span className={styles.stepNumber}>②</span>
                      <span className={styles.stepText}>Set journey details</span>
                    </div>
                  </div>
                  <div className={styles.stepRow}>
                    <div className={styles.processStep}>
                      <span className={styles.stepNumber}>③</span>
                      <span className={styles.stepText}>Confirm assignment</span>
                    </div>
                    <div className={styles.processStep}>
                      <span className={styles.stepNumber}>✓</span>
                      <span className={styles.stepText}>Fast response</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* AFTER SELECTION STATE */
            <>
              <div className={styles.pricingHeader}>
                <div className={styles.serviceTitleLine}>
                  <span className={styles.serviceTitle}>
                    Selected: {serviceInfo.name}
                  </span>
                  {onChangeSelection && (
                    <button
                      className={styles.changeLink}
                      onClick={onChangeSelection}
                      type="button"
                    >
                      Change
                    </button>
                  )}
                </div>
                {serviceInfo.journeyRoute && (
                  <div className={styles.journeyRoute}>
                    {serviceInfo.journeyRoute}
                  </div>
                )}
              </div>

              <div className={styles.securityDetailSelected}>
                <div className={styles.featureRow}>
                  <div className={styles.securityFeature}>• SIA Level 3 Protection Officer</div>
                  <div className={styles.securityFeature}>• 2-hour minimum engagement</div>
                </div>
                <div className={styles.featureRow}>
                  <div className={styles.securityFeature}>• Licensed professionals only</div>
                  <div className={styles.securityFeature}>• 1-hour cancellation policy</div>
                </div>
              </div>
            </>
          )}

        </div>

        {additionalInfo && (
          <div className={styles.additionalInfo}>
            {additionalInfo}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={`${styles.actionButtons} ${!hasSelection && isMinimized ? styles.minimizedActions : ''}`}>
        {!hasSelection && (
          <div className={styles.siaComplianceRow}>
            <span className={styles.siaText}>All officers hold valid SIA licenses</span>
            <div className={styles.buttonContainer}>
              <button
                className={`${styles.primaryButton} ${styles.initialState} ${!isValid ? styles.disabled : ''}`}
                onClick={onPrimaryAction}
                disabled={(!hasSelection && !onPrimaryAction) || (!isValid && hasSelection) || isLoading}
                type="button"
                aria-label={primaryButtonText}
              >
                {isLoading ? (
                  <>
                    <div className={styles.spinner} role="status" aria-label="Processing">
                      <svg className={styles.spinnerSvg} viewBox="0 0 24 24">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="32"
                          strokeDashoffset="32"
                        />
                      </svg>
                    </div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {primaryButtonText}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {hasSelection && (
          <button
            className={`${styles.primaryButton} ${styles.fullWidth} ${!isValid ? styles.disabled : ''}`}
            onClick={onPrimaryAction}
            disabled={(!hasSelection && !onPrimaryAction) || (!isValid && hasSelection) || isLoading}
            type="button"
            aria-label={primaryButtonText}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner} role="status" aria-label="Processing">
                  <svg className={styles.spinnerSvg} viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="32"
                      strokeDashoffset="32"
                    />
                  </svg>
                </div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                {primaryButtonText}
              </>
            )}
          </button>
        )}
      </div>

      {/* Trust Indicators - removed to reduce redundancy */}

      {/* Safe Area Padding */}
      <div className={styles.safeAreaPadding} />
    </div>
  );
};