import React from 'react';
import { PricingBreakdown, ProtectionServiceRequest } from '../../utils/protectionPricingCalculator';
import { formatPrice } from '../../utils/priceFormatter';
import styles from './PricingDisplay.module.css';

interface PricingDisplayProps {
  pricingBreakdown: PricingBreakdown;
  protectionRequest: ProtectionServiceRequest;
  onContinue?: () => void;
  onBack?: () => void;
  showActions?: boolean;
}

export function PricingDisplay({
  pricingBreakdown,
  protectionRequest,
  onContinue,
  onBack,
  showActions = true
}: PricingDisplayProps) {
  const { components, discounts, subtotal, total } = pricingBreakdown;
  const { protectionLevel, secureDestination, venueTimeData } = protectionRequest;

  const formatDestination = (dest: string) => {
    return dest.length > 40 ? `${dest.substring(0, 40)}...` : dest;
  };

  const getTotalProtectionTime = () => {
    const journeyTime = 25; // Default journey time
    const journeyHours = (journeyTime * 2) / 60; // Both ways

    if (protectionLevel.type === 'transport') {
      return Math.max(journeyHours + 1, 2); // Journey + wait time, minimum 2 hours
    } else {
      const venueHours = venueTimeData?.venueHours || 2;
      return Math.max(journeyHours + venueHours, 2);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Service Pricing</h2>
          <p className={styles.subtitle}>
            {protectionLevel.name} to {formatDestination(secureDestination)}
          </p>
        </div>
      </div>

      {/* Service Summary */}
      <div className={styles.serviceSummary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Protection Type:</span>
          <span className={styles.summaryValue}>{protectionLevel.name}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Total Duration:</span>
          <span className={styles.summaryValue}>{getTotalProtectionTime()} hours</span>
        </div>
        {protectionLevel.type === 'personal' && venueTimeData && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Time at Venue:</span>
            <span className={styles.summaryValue}>{venueTimeData.venueHours} hours</span>
          </div>
        )}
        {protectionLevel.type === 'personal' && venueTimeData?.discreteProtection && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Special Request:</span>
            <span className={styles.summaryValue}>Discrete Protection</span>
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className={styles.pricingSection}>
        <h3 className={styles.sectionTitle}>Cost Breakdown</h3>

        {/* Components */}
        <div className={styles.priceComponents}>
          {components.map((component, index) => (
            <div key={index} className={styles.componentRow}>
              <div className={styles.componentInfo}>
                <span className={styles.componentLabel}>{component.label}</span>
                {component.description && (
                  <span className={styles.componentDescription}>{component.description}</span>
                )}
              </div>
              <span className={styles.componentAmount}>
                {formatPrice(component.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className={styles.subtotalRow}>
          <span className={styles.subtotalLabel}>Subtotal</span>
          <span className={styles.subtotalAmount}>{formatPrice(subtotal)}</span>
        </div>

        {/* Discounts */}
        {discounts.length > 0 && (
          <div className={styles.discountsSection}>
            {discounts.map((discount, index) => (
              <div key={index} className={styles.discountRow}>
                <span className={styles.discountLabel}>{discount.label}</span>
                <span className={styles.discountAmount}>
                  -{formatPrice(discount.amount)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total Service Fee</span>
          <span className={styles.totalAmount}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Service Inclusions */}
      <div className={styles.inclusionsSection}>
        <h3 className={styles.sectionTitle}>What's Included</h3>
        <div className={styles.inclusionsList}>
          <div className={styles.inclusion}>
            <div className={styles.inclusionIcon}>🛡️</div>
            <span>SIA-licensed Protection Officer</span>
          </div>
          <div className={styles.inclusion}>
            <div className={styles.inclusionIcon}>🚗</div>
            <span>Professional security vehicle</span>
          </div>
          <div className={styles.inclusion}>
            <div className={styles.inclusionIcon}>⛽</div>
            <span>Fuel and vehicle maintenance</span>
          </div>
          {protectionLevel.type === 'personal' && (
            <>
              <div className={styles.inclusion}>
                <div className={styles.inclusionIcon}>👥</div>
                <span>Personal venue accompaniment</span>
              </div>
              <div className={styles.inclusion}>
                <div className={styles.inclusionIcon}>🛍️</div>
                <span>Assistance with bags/shopping</span>
              </div>
            </>
          )}
          <div className={styles.inclusion}>
            <div className={styles.inclusionIcon}>📱</div>
            <span>Real-time GPS tracking</span>
          </div>
          <div className={styles.inclusion}>
            <div className={styles.inclusionIcon}>☂️</div>
            <span>Comprehensive insurance coverage</span>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className={styles.notesSection}>
        <h4 className={styles.notesTitle}>Important Notes:</h4>
        <ul className={styles.notesList}>
          <li>Minimum service duration: 2 hours</li>
          <li>Protection Officer arrives 5-10 minutes early</li>
          {protectionLevel.type === 'personal' && (
            <li>Client covers officer's venue entry fees if required</li>
          )}
          <li>Final cost may vary based on actual service time</li>
          <li>Cancellation fee applies within 30 minutes of service</li>
        </ul>
      </div>

      {/* Actions */}
      {showActions && (
        <div className={styles.actionsSection}>
          <button
            className={styles.continueButton}
            onClick={onContinue}
            disabled={!onContinue}
          >
            Confirm Service - {formatPrice(total)}
          </button>
          <p className={styles.actionHint}>
            You'll review all details before final confirmation
          </p>
        </div>
      )}

      {/* Legal Footer */}
      <div className={styles.legalFooter}>
        <p className={styles.legalText}>
          Armora provides SIA-licensed close protection services including secure transport.
          This is not a Protection Service or private hire vehicle service. All pricing is inclusive of VAT where applicable.
        </p>
      </div>
    </div>
  );
}