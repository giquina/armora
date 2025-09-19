import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatPrice } from '../../utils/priceFormatter';
import { estimateJourneyTime, estimateDistance } from '../../utils/protectionPricingCalculator';
import styles from './PricingCalculator.module.css';

interface PriceBreakdown {
  distance: number;
  timeNeeded: number;
  protectionHours: number;
  protectionOfficerCost: number;
  secureVehicleCost: number;
  subtotal: number;
  memberDiscount: number;
  total: number;
  memberPrice: number;
  savings: number;
}

interface PricingCalculatorProps {
  destination: string;
  serviceLevel?: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
  onPriceCalculated?: (breakdown: PriceBreakdown) => void;
  autoCalculate?: boolean;
  showMembershipCTA?: boolean;
  isCalculating?: boolean;
}

const SERVICE_RATES = {
  essential: 50,    // £50/hour
  executive: 75,    // £75/hour
  shadow: 65,       // £65/hour
  'client-vehicle': 45  // £45/hour (reduced rate for client vehicle)
};

const VEHICLE_RATES = {
  essential: 2.2,      // £2.20/mile
  executive: 2.8,      // £2.80/mile
  shadow: 2.5,         // £2.50/mile
  'client-vehicle': 0  // No vehicle cost when using client's vehicle
};

export function PricingCalculator({
  destination,
  serviceLevel = 'shadow',
  onPriceCalculated,
  autoCalculate = true,
  showMembershipCTA = true,
  isCalculating = false
}: PricingCalculatorProps) {
  const { state } = useApp();
  const { user } = state;

  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calculationStage, setCalculationStage] = useState<string>('');

  const calculatePricing = useCallback(async () => {
    if (!destination.trim()) return;

    setIsLoading(true);
    setCalculationStage('Analyzing route...');

    // Simulate real-time calculation stages
    await new Promise(resolve => setTimeout(resolve, 600));

    setCalculationStage('Calculating distance...');
    await new Promise(resolve => setTimeout(resolve, 400));

    setCalculationStage('Estimating protection time...');
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Get estimates based on destination
      const distance = estimateDistance(destination);
      const timeNeeded = estimateJourneyTime(destination);

      // Calculate protection hours (minimum 2 hours)
      const journeyHours = (timeNeeded * 2) / 60; // Both ways
      const protectionHours = Math.max(journeyHours + 0.5, 2); // Add wait time, minimum 2h

      // Calculate costs
      const protectionRate = SERVICE_RATES[serviceLevel];
      const vehicleRate = VEHICLE_RATES[serviceLevel];

      const protectionOfficerCost = protectionHours * protectionRate;
      const secureVehicleCost = serviceLevel === 'client-vehicle' ? 0 : distance * vehicleRate;
      const subtotal = protectionOfficerCost + secureVehicleCost;

      // Member discount (20% for registered users)
      const isMember = user?.userType === 'registered' || user?.userType === 'google';
      const memberDiscount = isMember ? subtotal * 0.2 : 0;
      const memberPrice = subtotal - memberDiscount;
      const total = subtotal;
      const savings = memberDiscount;

      const priceBreakdown: PriceBreakdown = {
        distance: Math.round(distance * 10) / 10,
        timeNeeded,
        protectionHours: Math.round(protectionHours * 10) / 10,
        protectionOfficerCost: Math.round(protectionOfficerCost),
        secureVehicleCost: Math.round(secureVehicleCost),
        subtotal: Math.round(subtotal),
        memberDiscount: Math.round(memberDiscount),
        total: Math.round(total),
        memberPrice: Math.round(memberPrice),
        savings: Math.round(savings)
      };

      setBreakdown(priceBreakdown);
      onPriceCalculated?.(priceBreakdown);

      // Analytics
      console.log('[Analytics] Pricing calculated', {
        destination,
        serviceLevel,
        breakdown: priceBreakdown,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Pricing calculation error:', error);
    } finally {
      setIsLoading(false);
      setCalculationStage('');
    }
  }, [destination, serviceLevel, user?.userType, onPriceCalculated]);

  // Auto-calculate when destination or service level changes
  useEffect(() => {
    if (autoCalculate && destination.trim()) {
      calculatePricing();
    }
  }, [destination, serviceLevel, autoCalculate, calculatePricing]);

  const isMember = user?.userType === 'registered' || user?.userType === 'google';

  if (isCalculating || isLoading) {
    return (
      <div className={styles.calculatorContainer}>
        <div className={styles.calculatingDisplay}>
          <div className={styles.calculatingHeader}>
            <div className={styles.spinner}>⏳</div>
            <h3>Calculating your protection...</h3>
          </div>

          {calculationStage && (
            <p className={styles.calculationStage}>{calculationStage}</p>
          )}

          <div className={styles.loadingBars}>
            <div className={styles.loadingBar}></div>
            <div className={styles.loadingBar} style={{ animationDelay: '0.2s' }}></div>
            <div className={styles.loadingBar} style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!breakdown) {
    return (
      <div className={styles.calculatorContainer}>
        <div className={styles.noCalculation}>
          <p>Enter a destination to see pricing</p>
          {!autoCalculate && (
            <button
              className={styles.calculateButton}
              onClick={calculatePricing}
              disabled={!destination.trim()}
            >
              Calculate Protection Investment
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calculatorContainer}>
      {/* Trust Badge */}
      <div className={styles.trustBadge}>
        <div className={styles.badgeIcon}>🛡️</div>
        <span>SIA Licensed Officers</span>
      </div>

      {/* Calculation Summary */}
      <div className={styles.calculationSummary}>
        <div className={styles.summaryHeader}>
          <h3>Calculating your protection...</h3>
        </div>

        <div className={styles.calculationDetails}>
          <div className={styles.detailRow}>
            <span>Distance:</span>
            <span>{breakdown.distance} miles</span>
          </div>
          <div className={styles.detailRow}>
            <span>Time needed:</span>
            <span>{breakdown.timeNeeded} minutes</span>
          </div>
          <div className={styles.detailRow}>
            <span>Protection hours:</span>
            <span>{breakdown.protectionHours} (minimum)</span>
          </div>
        </div>
      </div>

      {/* Investment Breakdown */}
      <div className={styles.investmentSection}>
        <h4 className={styles.investmentTitle}>YOUR INVESTMENT:</h4>

        <div className={styles.breakdownRows}>
          <div className={styles.breakdownRow}>
            <span>Protection Officer:</span>
            <span>{formatPrice(breakdown.protectionOfficerCost)}</span>
          </div>
          {serviceLevel !== 'client-vehicle' && (
            <div className={styles.breakdownRow}>
              <span>Secure vehicle:</span>
              <span>{formatPrice(breakdown.secureVehicleCost)}</span>
            </div>
          )}
        </div>

        <div className={styles.divider}></div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={styles.totalAmount}>{formatPrice(breakdown.total)}</span>
        </div>

        {/* Member Pricing */}
        {isMember && breakdown.savings > 0 && (
          <div className={styles.memberPricing}>
            <div className={styles.memberRow}>
              <span>Members pay:</span>
              <span className={styles.memberPrice}>
                {formatPrice(breakdown.memberPrice)}
                <span className={styles.savings}>(SAVE {formatPrice(breakdown.savings)})</span>
              </span>
            </div>
          </div>
        )}

        {/* Membership CTA for guests */}
        {!isMember && showMembershipCTA && breakdown.savings > 0 && (
          <div className={styles.membershipCTA}>
            <div className={styles.potentialSavings}>
              <span>Members pay: {formatPrice(breakdown.memberPrice)}</span>
              <span className={styles.potentialSavingsAmount}>(SAVE {formatPrice(breakdown.savings)})</span>
            </div>
            <button className={styles.membershipButton}>
              Become a member
            </button>
          </div>
        )}
      </div>

      {/* Additional Trust Signals */}
      <div className={styles.trustSignals}>
        <div className={styles.trustSignal}>
          <span className={styles.trustIcon}>✓</span>
          <span>Fully insured & bonded</span>
        </div>
        <div className={styles.trustSignal}>
          <span className={styles.trustIcon}>✓</span>
          <span>Real-time GPS tracking</span>
        </div>
        <div className={styles.trustSignal}>
          <span className={styles.trustIcon}>✓</span>
          <span>24/7 emergency support</span>
        </div>
      </div>

      {/* Service Level Info */}
      <div className={styles.serviceLevelInfo}>
        <h5>Service Level: {serviceLevel.charAt(0).toUpperCase() + serviceLevel.slice(1)}</h5>
        <p className={styles.serviceLevelDescription}>
          {serviceLevel === 'essential' && 'SIA Level 2 certified protection with secure transport'}
          {serviceLevel === 'executive' && 'SIA Level 3 certified officers with premium security protocols'}
          {serviceLevel === 'shadow' && 'Specialist close protection with advanced threat assessment'}
          {serviceLevel === 'client-vehicle' && 'Professional protection using your personal vehicle'}
        </p>
      </div>
    </div>
  );
}

export default PricingCalculator;