import React, { useState } from 'react';
import { SERVICE_TIERS, PricingTier, formatCurrency } from '../../utils/pricingCalculator';
import { ServiceTierCard } from './ServiceTierCard';
import { useApp } from '../../contexts/AppContext';
import styles from './TierComparison.module.css';

interface TierComparisonProps {
  onTierSelect: (tierId: string) => void;
  selectedTier?: string;
  recommendedTier?: string;
  className?: string;
}

const FEATURE_CATEGORIES = [
  {
    name: 'Protection Level',
    features: [
      { id: 'sia_level', label: 'SIA Certification Level', essential: 'Level 2', executive: 'Level 3', shadow: 'Level 3+' },
      { id: 'response_time', label: 'Response Time', essential: '30 minutes', executive: '15 minutes', shadow: '10 minutes' },
      { id: 'threat_assessment', label: 'Threat Assessment', essential: 'Basic', executive: 'Advanced', shadow: 'Elite' },
      { id: 'surveillance', label: 'Surveillance Detection', essential: '❌', executive: '✅', shadow: '✅ Advanced' },
    ]
  },
  {
    name: 'Vehicle & Transport',
    features: [
      { id: 'vehicle_type', label: 'Vehicle Type', essential: 'Standard Security', executive: 'BMW 5 Series', shadow: 'Discreet Vehicle' },
      { id: 'vehicle_armor', label: 'Armored Protection', essential: '❌', executive: 'Optional', shadow: '✅' },
      { id: 'route_planning', label: 'Route Planning', essential: 'Basic', executive: '✅ Advanced', shadow: '✅ Elite' },
      { id: 'counter_surveillance', label: 'Counter-Surveillance', essential: '❌', executive: 'Basic', shadow: '✅ Advanced' },
    ]
  },
  {
    name: 'Communication & Support',
    features: [
      { id: 'emergency_contact', label: 'Emergency Contact', essential: '✅', executive: '✅', shadow: '✅' },
      { id: 'live_tracking', label: 'Live GPS Tracking', essential: 'Basic', executive: '✅', shadow: '✅ Enhanced' },
      { id: 'command_center', label: '24/7 Command Center', essential: '❌', executive: '✅', shadow: '✅ Priority' },
      { id: 'backup_support', label: 'Backup Support', essential: '❌', executive: 'On-Call', shadow: '✅ Immediate' },
    ]
  },
  {
    name: 'Additional Services',
    features: [
      { id: 'k9_unit', label: 'K9 Unit Available', essential: 'Add-on', executive: 'Add-on', shadow: '✅ Included' },
      { id: 'armed_protection', label: 'Armed Protection', essential: '❌', executive: 'Optional', shadow: '✅ Available' },
      { id: 'diplomatic', label: 'Diplomatic Protocol', essential: '❌', executive: 'Optional', shadow: '✅' },
      { id: 'medical_response', label: 'Medical Response', essential: 'Basic First Aid', executive: 'Advanced', shadow: 'Paramedic Level' },
    ]
  }
];

export function TierComparison({ onTierSelect, selectedTier, recommendedTier, className = '' }: TierComparisonProps) {
  const { state } = useApp();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getSubscriptionDiscount = (tierId: string) => {
    if (!state.subscription) return null;

    const discountRates = {
      essential: 0.10,
      executive: 0.20,
      shadow: 0.30
    };

    return discountRates[tierId as keyof typeof discountRates] || null;
  };

  const getDiscountedPrice = (tier: PricingTier) => {
    const discount = getSubscriptionDiscount(tier.id);
    if (!discount) return tier.baseHourlyRate;

    return tier.baseHourlyRate * (1 - discount);
  };

  const renderCards = () => (
    <div className={styles.cardsGrid}>
      {SERVICE_TIERS.map(tier => (
        <ServiceTierCard
          key={tier.id}
          tier={tier}
          isRecommended={tier.id === recommendedTier}
          isSelected={tier.id === selectedTier}
          onSelect={onTierSelect}
          className={styles.tierCard}
        />
      ))}
    </div>
  );

  const renderTable = () => (
    <div className={styles.comparisonTable}>
      {/* Header Row */}
      <div className={styles.tableHeader}>
        <div className={styles.featureColumn}>
          <h3>Features</h3>
        </div>
        {SERVICE_TIERS.map(tier => (
          <div key={tier.id} className={styles.tierColumn}>
            <div className={styles.tierHeaderCell}>
              <h3>{tier.name}</h3>
              <div className={styles.tierPrice}>
                {state.subscription ? (
                  <>
                    <span className={styles.originalPrice}>
                      {formatCurrency(tier.baseHourlyRate)}
                    </span>
                    <span className={styles.discountedPrice}>
                      {formatCurrency(getDiscountedPrice(tier))}
                    </span>
                  </>
                ) : (
                  <span>{formatCurrency(tier.baseHourlyRate)}/hour</span>
                )}
              </div>
              {tier.id === recommendedTier && (
                <div className={styles.recommendedLabel}>Recommended</div>
              )}
              <button
                className={`${styles.selectButton} ${selectedTier === tier.id ? styles.selected : ''}`}
                onClick={() => onTierSelect(tier.id)}
              >
                {selectedTier === tier.id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Categories */}
      {FEATURE_CATEGORIES.map(category => (
        <div key={category.name} className={styles.categorySection}>
          <button
            className={`${styles.categoryHeader} ${expandedCategory === category.name ? styles.expanded : ''}`}
            onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
          >
            <h4>{category.name}</h4>
            <span className={styles.expandIcon}>
              {expandedCategory === category.name ? '−' : '+'}
            </span>
          </button>

          {expandedCategory === category.name && (
            <div className={styles.categoryFeatures}>
              {category.features.map(feature => (
                <div key={feature.id} className={styles.featureRow}>
                  <div className={styles.featureLabel}>
                    {feature.label}
                  </div>
                  <div className={styles.featureValue}>
                    {feature.essential}
                  </div>
                  <div className={styles.featureValue}>
                    {feature.executive}
                  </div>
                  <div className={styles.featureValue}>
                    {feature.shadow}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${styles.tierComparison} ${className}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>Choose Your Protection Level</h2>
          <p>Professional close protection services tailored to your security needs</p>
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'cards' ? styles.active : ''}`}
            onClick={() => setViewMode('cards')}
          >
            📋 Cards
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            📊 Compare
          </button>
        </div>
      </div>

      {/* Subscription Benefits Banner */}
      {!state.subscription && (
        <div className={styles.subscriptionBanner}>
          <div className={styles.bannerContent}>
            <h3>💎 Save with Armora Membership</h3>
            <p>Get 10-30% off all protection services plus priority booking</p>
            <div className={styles.subscriptionSavings}>
              <span>Essential: Save 10%</span>
              <span>Executive: Save 20%</span>
              <span>Shadow: Save 30%</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        {viewMode === 'cards' ? renderCards() : renderTable()}
      </div>

      {/* Bottom CTA */}
      {selectedTier && (
        <div className={styles.bottomCTA}>
          <div className={styles.ctaContent}>
            <span className={styles.ctaText}>
              Ready to proceed with {SERVICE_TIERS.find(t => t.id === selectedTier)?.name}?
            </span>
            <button
              className={styles.ctaButton}
              onClick={() => onTierSelect(selectedTier)}
            >
              Continue to Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}