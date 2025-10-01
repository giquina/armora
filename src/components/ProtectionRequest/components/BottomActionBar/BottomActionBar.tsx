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
  officerLevel?: string;
  numberOfOfficers?: number;
  keyFeature?: string;
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
  /** Smart scroll to incomplete step handler (optional) */
  onScrollToIncomplete?: () => void;
  /** Loading state for primary action */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional information to display */
  additionalInfo?: string;
  /** Contextual hint for user guidance (e.g., "↑ Scroll up") */
  contextualHint?: string;
  /** Dynamic panel title based on progress */
  panelTitle?: string;
  /** Dynamic panel subtitle based on progress */
  panelSubtitle?: string;
  /** Current step number (1-5) */
  currentStep?: number;
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
  onScrollToIncomplete,
  isLoading = false,
  error,
  additionalInfo,
  contextualHint,
  panelTitle,
  panelSubtitle,
  currentStep = 1,
  className = ''
}) => {
  const hasSelection = !!(serviceInfo && pricing);
  const [isMinimized, setIsMinimized] = useState(true);

  // Auto-expand only when user is valid (all terms accepted)
  useEffect(() => {
    if (hasSelection && isValid) {
      setIsMinimized(false);
    }
  }, [hasSelection, isValid]);

  return (
    <div className={`${styles.bottomActionBar} ${className} ${isMinimized ? styles.minimized : ''}`}>

      {/* Always show header for expand/minimize functionality */}
      {isMinimized && (
        <div className={styles.minimizedHeader}>
          <button
            className={styles.expandButton}
            onClick={() => {
              // If not valid and has scroll handler, scroll to incomplete step
              if (!isValid && onScrollToIncomplete) {
                onScrollToIncomplete();
              } else {
                // Otherwise just expand the panel
                setIsMinimized(false);
              }
            }}
            type="button"
            aria-label="Show booking details"
          >
            <span className={styles.expandIcon}>🛡️</span>
            <span className={styles.expandText}>
              {isValid
                ? 'View Summary & Proceed to Payment'
                : currentStep === 1
                ? 'Step 1 of 5 • Enter Locations'
                : currentStep === 2
                ? 'Step 2 of 5 • Choose Scenario'
                : currentStep === 3
                ? 'Step 3 of 5 • Select Service'
                : currentStep === 4
                ? 'Step 4 of 5 • Set Time'
                : 'Step 5 of 5 • Review & Accept'
              }
            </span>
            <span className={styles.expandChevron}>↑</span>
          </button>
        </div>
      )}

      {/* Pricing Summary */}
      <div className={`${styles.pricingSummary} ${!hasSelection && isMinimized ? styles.hidden : ''}`}>
        <div className={styles.pricingCompact}>

          {!hasSelection ? (
            /* SIMPLIFIED INITIAL STATE */
            <>
              <div className={styles.initialState}>
                <div className={styles.initialHeader}>
                  <h3 className={styles.initialTitle}>{panelTitle || 'Protection Services'}</h3>
                  <button
                    className={styles.hideDetailsButton}
                    onClick={() => setIsMinimized(!isMinimized)}
                    type="button"
                    aria-label="Hide Details"
                  >
                    ↓
                  </button>
                </div>

                <div className={styles.complianceLine}>
                  {panelSubtitle || '✓ SIA-licensed • Nationwide coverage'}
                </div>
              </div>
            </>
          ) : (
            /* AFTER SELECTION STATE - NEW GOLD THEME DESIGN */
            <>
              {/* Service Summary Section */}
              <div className={styles.serviceSummarySection}>
                <div className={styles.serviceSummaryHeader}>
                  <h4 className={styles.serviceSummaryTitle}>{serviceInfo.name}</h4>
                  <div className={styles.headerActions}>
                    {onChangeSelection && (
                      <button
                        className={styles.changeLinkGold}
                        onClick={onChangeSelection}
                        type="button"
                      >
                        Change
                      </button>
                    )}
                    <button
                      className={styles.minimizeButton}
                      onClick={() => setIsMinimized(true)}
                      type="button"
                      aria-label="Minimize panel"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                <div className={styles.serviceFeatures}>
                  <span className={styles.featureBadge}>
                    {serviceInfo.officerLevel || '1 Officer'}
                  </span>
                  {serviceInfo.situation && (
                    <span className={styles.featureBadge}>
                      {serviceInfo.situation}
                    </span>
                  )}
                </div>
              </div>

              {/* Journey Summary Section */}
              {serviceInfo.journeyRoute && (
                <div className={styles.journeySummarySection}>
                  <h5 className={styles.journeySectionTitle}>Journey Details</h5>
                  <div className={styles.journeyInfo}>
                    <span className={styles.journeyRoute}>
                      {serviceInfo.journeyRoute}
                    </span>
                    {additionalInfo && (
                      <span className={styles.journeyTiming}>
                        {additionalInfo}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Additional info now shown in service details when selected */}

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

      {/* Action Buttons - Only show when expanded or when service selected */}
      {!isMinimized && (
        <div className={styles.actionButtons}>
          {!hasSelection && (
            <div className={styles.minimizedActionContainer}>
              <div className={styles.buttonContainer}>
                <button
                  className={`${styles.ctaButton} ${styles.disabled}`}
                  disabled={true}
                  type="button"
                  aria-label="Select protection level above"
                >
                  <span className={styles.ctaButtonText}>{primaryButtonText}</span>
                  {contextualHint && <span className={styles.ctaButtonSubtext}>{contextualHint}</span>}
                </button>
              </div>
            </div>
          )}
          {hasSelection && (
            <div className={styles.selectedActionContainer}>
              {/* Detailed Pricing Breakdown - New Gold Theme */}
              <div className={styles.pricingBreakdownSection}>
                <h5 className={styles.pricingSectionTitle}>Pricing Summary</h5>

                {/* Base Rate Calculation */}
                <div className={styles.pricingLine}>
                  <span className={styles.pricingLineLabel}>
                    Protection Detail (2h minimum)
                  </span>
                  <span className={styles.pricingLineValue}>
                    £{pricing.basePrice.toFixed(2)}
                  </span>
                </div>

                {/* Subscription Discount if applicable */}
                {pricing?.hasDiscount && pricing.discountAmount && (
                  <div className={styles.pricingLine}>
                    <span className={styles.pricingLineLabel}>
                      50% Subscriber Discount
                    </span>
                    <span className={styles.discountLineValue}>
                      -£{pricing.discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Total Line */}
                <div className={styles.pricingTotalLine}>
                  <span className={styles.pricingTotalLabel}>Total Due:</span>
                  <span className={styles.pricingTotalValue}>
                    £{pricing.finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

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
            </div>
          )}
        </div>
      )}

      {/* Trust Indicators - removed to reduce redundancy */}

      {/* Safe Area Padding */}
      <div className={styles.safeAreaPadding} />
    </div>
  );
};