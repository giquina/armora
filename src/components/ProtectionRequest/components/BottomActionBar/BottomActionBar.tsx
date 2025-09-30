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
  /** Contextual hint for user guidance (e.g., "↑ Scroll up") */
  contextualHint?: string;
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
  contextualHint,
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

      {/* Always show header for expand/minimize functionality */}
      {!hasSelection && isMinimized && (
        <div className={styles.minimizedHeader}>
          <button
            className={styles.expandButton}
            onClick={() => setIsMinimized(false)}
            type="button"
            aria-label="Show details"
          >
            <span className={styles.expandIcon}>🛡️</span>
            <span className={styles.expandText}>Request Protection</span>
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
                  <h3 className={styles.initialTitle}>Protection Services</h3>
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
                  ✓ SIA-licensed • Nationwide coverage
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

              {/* Deployment Info Only - Remove redundant rate */}
              {additionalInfo && (
                <div className={styles.deploymentInfo}>
                  <span className={styles.deploymentIcon}>🚁</span>
                  <span className={styles.deploymentText}>{additionalInfo}</span>
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
              {/* Simplified Price Display - Just the final price */}
              <div className={styles.dynamicPriceDisplay}>
                <div className={styles.priceBreakdown}>
                  {pricing?.hasDiscount ? (
                    <div className={styles.discountedPriceRow}>
                      <span className={styles.finalPriceLabel}>Total:</span>
                      <div className={styles.priceWithDiscount}>
                        <span className={styles.originalPrice}>£{pricing.originalPrice?.toFixed(2)}</span>
                        <span className={styles.finalPrice}>£{pricing.finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.regularPriceRow}>
                      <span className={styles.finalPriceLabel}>Total:</span>
                      <span className={styles.finalPrice}>£{pricing?.finalPrice.toFixed(2) || '0.00'}</span>
                    </div>
                  )}
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