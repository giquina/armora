import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SERVICES_DATA } from '../../data/servicesData';
import styles from './ServicePricingCalculator.module.css';

interface PricingInputs {
  hours: number;
  distance: number;
  serviceLevel: string;
  frequency: 'once' | 'weekly' | 'daily' | 'monthly';
  membership: boolean;
  timeOfDay: 'standard' | 'evening' | 'night';
}

interface PricingBreakdown {
  protection: number;
  vehicle: number;
  timeMultiplier: number;
  subtotal: number;
  discount: number;
  final: number;
  savings: number;
  perMile: number;
}

const SERVICE_RATES: Record<string, number> = {
  standard: 50,
  executive: 95,
  shadow: 85,
  event: 120,
  luxury: 200
};

const TIME_MULTIPLIERS = {
  standard: 1.0,   // 9am-6pm
  evening: 1.15,   // 6pm-11pm
  night: 1.25      // 11pm-9am
};

const FREQUENCY_DISCOUNTS = {
  once: 0,
  weekly: 0.05,
  daily: 0.10,
  monthly: 0.15
};

export function ServicePricingCalculator() {
  const { navigateToView } = useApp();
  const [inputs, setInputs] = useState<PricingInputs>({
    hours: 2,
    distance: 10,
    serviceLevel: 'standard',
    frequency: 'once',
    membership: false,
    timeOfDay: 'standard'
  });

  const [breakdown, setBreakdown] = useState<PricingBreakdown | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const calculatePrice = useMemo(() => {
    const baseRate = SERVICE_RATES[inputs.serviceLevel] || 50;
    const timeMultiplier = TIME_MULTIPLIERS[inputs.timeOfDay];
    const protectionCost = Math.round(inputs.hours * baseRate * timeMultiplier);
    const vehicleCost = Math.round(inputs.distance * 2.5);
    const subtotal = protectionCost + vehicleCost;

    const frequencyDiscount = FREQUENCY_DISCOUNTS[inputs.frequency];
    const memberDiscount = inputs.membership ? 0.20 : 0;
    const totalDiscount = Math.max(frequencyDiscount, memberDiscount);

    const discountAmount = Math.round(subtotal * totalDiscount);
    const finalPrice = subtotal - discountAmount;

    const annualSavings = inputs.membership ? Math.round(subtotal * 0.20 * 12) : 0;

    return {
      protection: protectionCost,
      vehicle: vehicleCost,
      timeMultiplier: timeMultiplier,
      subtotal,
      discount: discountAmount,
      final: finalPrice,
      savings: annualSavings,
      perMile: Math.round(finalPrice / inputs.distance * 100) / 100
    };
  }, [inputs]);

  useEffect(() => {
    setBreakdown(calculatePrice);
  }, [calculatePrice]);

  const handleBookNow = () => {
    localStorage.setItem('armora_selected_service', inputs.serviceLevel);
    localStorage.setItem('armora_pricing_estimate', JSON.stringify({
      ...inputs,
      breakdown,
      timestamp: Date.now()
    }));
    navigateToView('protection-request');
  };

  const getTimeLabel = () => {
    switch (inputs.timeOfDay) {
      case 'evening': return '🌆 Evening (6pm-11pm) +15%';
      case 'night': return '🌙 Night (11pm-9am) +25%';
      default: return '☀️ Standard (9am-6pm)';
    }
  };

  const getFrequencyLabel = () => {
    const discounts = {
      once: 'One-time',
      weekly: 'Weekly (5% off)',
      daily: 'Daily (10% off)',
      monthly: 'Monthly contract (15% off)'
    };
    return discounts[inputs.frequency];
  };

  if (!breakdown) return null;

  return (
    <div className={styles.calculator}>
      <div className={styles.calculatorHeader} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>💰 Instant Price Calculator</h3>
          <div className={styles.quickPrice}>
            <span className={styles.priceValue}>£{breakdown.final}</span>
            <span className={styles.priceLabel}>estimated</span>
          </div>
        </div>
        <button className={styles.expandButton}>
          {isExpanded ? '↑' : '↓'}
        </button>
      </div>

      <div className={`${styles.calculatorContent} ${isExpanded ? styles.expanded : ''}`}>
        {/* Interactive Controls */}
        <div className={styles.controls}>

          {/* Duration Slider */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              <span>Protection Duration</span>
              <span className={styles.controlValue}>{inputs.hours} hours</span>
            </label>
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              value={inputs.hours}
              onChange={(e) => setInputs({...inputs, hours: parseInt(e.target.value)})}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>2hr</span>
              <span>6hr</span>
              <span>12hr</span>
            </div>
          </div>

          {/* Distance Slider */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              <span>Journey Distance</span>
              <span className={styles.controlValue}>{inputs.distance} miles</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={inputs.distance}
              onChange={(e) => setInputs({...inputs, distance: parseInt(e.target.value)})}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>1mi</span>
              <span>25mi</span>
              <span>50mi</span>
            </div>
          </div>

          {/* Service Level Buttons */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Service Level</label>
            <div className={styles.serviceButtons}>
              {Object.entries(SERVICE_RATES).slice(0, 4).map(([level, rate]) => {
                const service = SERVICES_DATA.find(s => s.id === level);
                if (!service) return null;

                return (
                  <button
                    key={level}
                    className={`${styles.serviceButton} ${inputs.serviceLevel === level ? styles.active : ''}`}
                    onClick={() => setInputs({...inputs, serviceLevel: level})}
                  >
                    <span className={styles.serviceIcon}>{service.icon}</span>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceRate}>£{rate}/hr</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time of Day */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Time of Day</label>
            <select
              value={inputs.timeOfDay}
              onChange={(e) => setInputs({...inputs, timeOfDay: e.target.value as any})}
              className={styles.select}
            >
              <option value="standard">☀️ Standard (9am-6pm)</option>
              <option value="evening">🌆 Evening (6pm-11pm) +15%</option>
              <option value="night">🌙 Night (11pm-9am) +25%</option>
            </select>
          </div>

          {/* Frequency */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>How often?</label>
            <select
              value={inputs.frequency}
              onChange={(e) => setInputs({...inputs, frequency: e.target.value as any})}
              className={styles.select}
            >
              <option value="once">One-time</option>
              <option value="weekly">Weekly (5% off)</option>
              <option value="daily">Daily (10% off)</option>
              <option value="monthly">Monthly contract (15% off)</option>
            </select>
          </div>

          {/* Membership Toggle */}
          <label className={styles.membershipToggle}>
            <input
              type="checkbox"
              checked={inputs.membership}
              onChange={(e) => setInputs({...inputs, membership: e.target.checked})}
              className={styles.checkbox}
            />
            <span className={styles.checkboxLabel}>
              <span className={styles.membershipIcon}>👑</span>
              I'm a member (20% off everything)
            </span>
          </label>
        </div>

        {/* Price Breakdown */}
        <div className={styles.breakdown}>
          <h4 className={styles.breakdownTitle}>Price Breakdown</h4>

          <div className={styles.breakdownLines}>
            <div className={styles.breakdownLine}>
              <span>Protection ({inputs.hours}hrs @ £{SERVICE_RATES[inputs.serviceLevel]}/hr)</span>
              <span>£{breakdown.protection}</span>
            </div>
            <div className={styles.breakdownLine}>
              <span>Secure Vehicle ({inputs.distance}mi @ £2.50/mi)</span>
              <span>£{breakdown.vehicle}</span>
            </div>
            {breakdown.timeMultiplier > 1 && (
              <div className={styles.breakdownLine}>
                <span>{getTimeLabel()}</span>
                <span>+£{breakdown.protection - Math.round(inputs.hours * SERVICE_RATES[inputs.serviceLevel])}</span>
              </div>
            )}
            {breakdown.discount > 0 && (
              <div className={`${styles.breakdownLine} ${styles.discount}`}>
                <span>Your Discount ({getFrequencyLabel()})</span>
                <span>-£{breakdown.discount}</span>
              </div>
            )}
          </div>

          <div className={styles.total}>
            <span className={styles.totalLabel}>Total Estimate</span>
            <span className={styles.totalPrice}>£{breakdown.final}</span>
          </div>

          <div className={styles.priceDetails}>
            <span className={styles.perMile}>£{breakdown.perMile}/mile</span>
            {inputs.membership && (
              <span className={styles.savings}>Save ~£{breakdown.savings}/year</span>
            )}
          </div>

          <button className={styles.bookButton} onClick={handleBookNow}>
            Request {SERVICES_DATA.find(s => s.id === inputs.serviceLevel)?.name} Now →
          </button>
        </div>
      </div>
    </div>
  );
}