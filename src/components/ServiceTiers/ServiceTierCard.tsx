import React from 'react';
import { PricingTier, formatCurrency } from '../../utils/pricingCalculator';
import { useApp } from '../../contexts/AppContext';
import styles from './ServiceTierCard.module.css';

interface ServiceTierCardProps {
  tier: PricingTier;
  isRecommended?: boolean;
  isSelected?: boolean;
  onSelect: (tierId: string) => void;
  showPricing?: boolean;
  className?: string;
}

export function ServiceTierCard({
  tier,
  isRecommended = false,
  isSelected = false,
  onSelect,
  showPricing = true,
  className = ''
}: ServiceTierCardProps) {
  const { state } = useApp();

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'essential':
        return '🛡️';
      case 'executive':
        return '🏆';
      case 'shadow':
        return '🥷';
      default:
        return '🛡️';
    }
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'essential':
        return '#22c55e'; // Green
      case 'executive':
        return '#3b82f6'; // Blue
      case 'shadow':
        return '#8b5cf6'; // Purple
      default:
        return '#22c55e';
    }
  };

  const getSubscriptionDiscount = () => {
    if (!state.subscription) return null;

    const discountRates = {
      essential: 0.10,
      executive: 0.20,
      shadow: 0.30
    };

    const discount = discountRates[state.subscription.tier as keyof typeof discountRates];
    return discount ? discount * 100 : null;
  };

  const getDiscountedRate = () => {
    const discount = getSubscriptionDiscount();
    if (!discount) return tier.baseHourlyRate;

    return tier.baseHourlyRate * (1 - discount / 100);
  };

  const tierColor = getTierColor(tier.id);
  const subscriptionDiscount = getSubscriptionDiscount();
  const discountedRate = getDiscountedRate();

  return (
    <div
      className={`${styles.tierCard} ${isSelected ? styles.selected : ''} ${isRecommended ? styles.recommended : ''} ${className}`}
      onClick={() => onSelect(tier.id)}
      style={{
        borderColor: isSelected ? tierColor : undefined,
        boxShadow: isSelected ? `0 0 0 2px ${tierColor}40` : undefined
      }}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className={styles.recommendedBadge}>
          <span>⭐ Recommended</span>
        </div>
      )}

      {/* Tier Header */}
      <div className={styles.tierHeader}>
        <div className={styles.tierIcon} style={{ backgroundColor: `${tierColor}20` }}>
          {getTierIcon(tier.id)}
        </div>
        <div className={styles.tierInfo}>
          <h3 className={styles.tierName}>{tier.name}</h3>
          {showPricing && (
            <div className={styles.pricing}>
              {subscriptionDiscount ? (
                <>
                  <span className={styles.originalPrice}>
                    {formatCurrency(tier.baseHourlyRate)}/hour
                  </span>
                  <span className={styles.discountedPrice}>
                    {formatCurrency(discountedRate)}/hour
                  </span>
                  <span className={styles.discountBadge}>
                    -{subscriptionDiscount}%
                  </span>
                </>
              ) : (
                <span className={styles.price}>
                  {formatCurrency(tier.baseHourlyRate)}/hour
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tier Description */}
      <p className={styles.tierDescription}>{tier.description}</p>

      {/* Features List */}
      <div className={styles.featuresList}>
        {tier.features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <span
              className={styles.featureIcon}
              style={{ color: tierColor }}
            >
              ✓
            </span>
            <span className={styles.featureText}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Service Level Indicators */}
      <div className={styles.serviceLevel}>
        <div className={styles.levelIndicator}>
          <span className={styles.levelLabel}>Response Time:</span>
          <span className={styles.levelValue}>
            {tier.id === 'essential' ? '30 minutes' :
             tier.id === 'executive' ? '15 minutes' :
             '10 minutes'}
          </span>
        </div>
        <div className={styles.levelIndicator}>
          <span className={styles.levelLabel}>Minimum Duration:</span>
          <span className={styles.levelValue}>2 hours</span>
        </div>
        <div className={styles.levelIndicator}>
          <span className={styles.levelLabel}>SIA Level:</span>
          <span className={styles.levelValue}>
            {tier.id === 'essential' ? 'Level 2' :
             tier.id === 'executive' ? 'Level 3' :
             'Level 3+'}
          </span>
        </div>
      </div>

      {/* Select Button */}
      <button
        className={`${styles.selectButton} ${isSelected ? styles.selectedButton : ''}`}
        style={{
          backgroundColor: isSelected ? tierColor : undefined,
          borderColor: tierColor
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(tier.id);
        }}
      >
        {isSelected ? 'Selected' : `Choose ${tier.name}`}
      </button>

      {/* Subscription Upsell */}
      {!state.subscription && (
        <div className={styles.subscriptionUpsell}>
          <span className={styles.upsellText}>
            💎 Save {tier.id === 'essential' ? '10%' : tier.id === 'executive' ? '20%' : '30%'} with subscription
          </span>
        </div>
      )}
    </div>
  );
}