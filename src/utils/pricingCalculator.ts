// Pricing Calculator for Armora Protection Services
import { SecurityAssessmentData } from '../components/BookingFlow/SecurityAssessment';

export interface PricingTier {
  id: 'essential' | 'executive' | 'shadow';
  name: string;
  baseHourlyRate: number;
  description: string;
  features: string[];
}

export interface PricingCalculation {
  tier: PricingTier;
  baseRate: number;
  duration: number;
  subtotal: number;
  surcharges: {
    timeSurcharge: number;
    riskSurcharge: number;
    specialRequirements: number;
  };
  discounts: {
    subscription: number;
    duration: number;
  };
  vatAmount: number;
  totalAmount: number;
  breakdown: PricingBreakdownItem[];
}

export interface PricingBreakdownItem {
  label: string;
  amount: number;
  type: 'base' | 'surcharge' | 'discount' | 'tax';
  description?: string;
}

// Service Tiers with Professional Protection Rates
export const SERVICE_TIERS: PricingTier[] = [
  {
    id: 'essential',
    name: 'Essential Protection',
    baseHourlyRate: 50,
    description: 'Standard close protection with SIA Level 2 certified CPO',
    features: [
      'SIA Level 2 certified Close Protection Officer',
      '2-hour minimum booking',
      'Standard response time (30 minutes)',
      'Basic threat assessment',
      'Emergency contact protocol',
      'Professional protection vehicle'
    ]
  },
  {
    id: 'executive',
    name: 'Executive Protection',
    baseHourlyRate: 75,
    description: 'Premium protection with advanced security protocols',
    features: [
      'SIA Level 3 certified Close Protection Officer',
      'Priority response (15 minutes)',
      'Advanced threat assessment',
      'Surveillance detection',
      'Executive vehicle (BMW 5 Series)',
      'Direct emergency services liaison',
      'Detailed security briefing',
      'Route planning and reconnaissance'
    ]
  },
  {
    id: 'shadow',
    name: 'Shadow Protocol',
    baseHourlyRate: 65,
    description: 'Discreet plainclothes protection for VIP clients',
    features: [
      'Former Special Forces / Elite trained CPO',
      'Covert surveillance detection',
      'Counter-surveillance protocols',
      'Discreet plainclothes protection',
      'Advanced threat neutralization',
      'Intelligence gathering',
      'Multiple CPO coordination',
      'Diplomatic protection protocols'
    ]
  }
];

// Time-based surge pricing multipliers
const TIME_SURCHARGE_RATES = {
  standard: 1.0,    // 6 AM - 6 PM
  evening: 1.5,     // 6 PM - 11 PM
  lateNight: 2.0,   // 11 PM - 6 AM
  weekend: 1.3,     // Saturday/Sunday
  holiday: 2.5      // Bank holidays
};

// Risk level multipliers
const RISK_SURCHARGE_RATES = {
  low: 1.0,
  medium: 1.2,
  high: 1.5
};

// Special requirements additional costs per hour
const SPECIAL_REQUIREMENTS_RATES = {
  k9Unit: 25,       // K9 unit and handler
  armed: 35,        // Licensed firearms officer
  diplomatic: 45,   // Diplomatic protocol specialist
  surveillance: 20, // Counter-surveillance specialist
  medical: 15       // Medical response trained CPO
};

// Subscription discount rates
const SUBSCRIPTION_DISCOUNTS = {
  essential: 0.10,  // 10% off
  executive: 0.20,  // 20% off
  shadow: 0.30      // 30% off
};

// Duration discount thresholds (hours)
const DURATION_DISCOUNTS = [
  { minHours: 24, discount: 0.15, label: '24+ hours: 15% off' },
  { minHours: 12, discount: 0.10, label: '12+ hours: 10% off' },
  { minHours: 8, discount: 0.05, label: '8+ hours: 5% off' }
];

// VAT rate (UK standard)
const VAT_RATE = 0.20; // 20%

export function calculatePricing(
  tier: PricingTier,
  securityAssessment: SecurityAssessmentData,
  hasSubscription: boolean = false,
  subscriptionTier?: string
): PricingCalculation {
  const { duration, threatLevel, specialRequirements } = securityAssessment;

  // Base calculation
  const baseRate = tier.baseHourlyRate;
  const subtotal = baseRate * duration;

  // Calculate surcharges
  const timeSurcharge = calculateTimeSurcharge(subtotal);
  const riskSurcharge = calculateRiskSurcharge(subtotal, threatLevel);
  const specialRequirementsTotal = calculateSpecialRequirements(specialRequirements, duration);

  // Calculate total before discounts
  const beforeDiscounts = subtotal + timeSurcharge + riskSurcharge + specialRequirementsTotal;

  // Calculate discounts
  const subscriptionDiscount = hasSubscription ?
    calculateSubscriptionDiscount(beforeDiscounts, subscriptionTier) : 0;
  const durationDiscount = calculateDurationDiscount(beforeDiscounts, duration);

  // Calculate final amounts
  const totalDiscounts = subscriptionDiscount + durationDiscount;
  const afterDiscounts = beforeDiscounts - totalDiscounts;
  const vatAmount = afterDiscounts * VAT_RATE;
  const totalAmount = afterDiscounts + vatAmount;

  // Build breakdown
  const breakdown: PricingBreakdownItem[] = [
    {
      label: `${tier.name} (${duration} hours)`,
      amount: subtotal,
      type: 'base',
      description: `£${baseRate}/hour × ${duration} hours`
    }
  ];

  if (timeSurcharge > 0) {
    breakdown.push({
      label: 'Time Surcharge',
      amount: timeSurcharge,
      type: 'surcharge',
      description: 'Evening/night/weekend premium'
    });
  }

  if (riskSurcharge > 0) {
    breakdown.push({
      label: 'Risk Level Surcharge',
      amount: riskSurcharge,
      type: 'surcharge',
      description: `${threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)} risk assessment`
    });
  }

  if (specialRequirementsTotal > 0) {
    const activeRequirements = Object.entries(specialRequirements)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());

    breakdown.push({
      label: 'Special Requirements',
      amount: specialRequirementsTotal,
      type: 'surcharge',
      description: activeRequirements.join(', ')
    });
  }

  if (subscriptionDiscount > 0) {
    breakdown.push({
      label: 'Subscription Discount',
      amount: -subscriptionDiscount,
      type: 'discount',
      description: `${subscriptionTier?.charAt(0).toUpperCase()}${subscriptionTier?.slice(1)} member discount`
    });
  }

  if (durationDiscount > 0) {
    const discountTier = DURATION_DISCOUNTS.find(d => duration >= d.minHours);
    breakdown.push({
      label: 'Duration Discount',
      amount: -durationDiscount,
      type: 'discount',
      description: discountTier?.label
    });
  }

  breakdown.push({
    label: 'VAT (20%)',
    amount: vatAmount,
    type: 'tax',
    description: 'UK Value Added Tax'
  });

  return {
    tier,
    baseRate,
    duration,
    subtotal,
    surcharges: {
      timeSurcharge,
      riskSurcharge,
      specialRequirements: specialRequirementsTotal
    },
    discounts: {
      subscription: subscriptionDiscount,
      duration: durationDiscount
    },
    vatAmount,
    totalAmount,
    breakdown
  };
}

function calculateTimeSurcharge(subtotal: number): number {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  let multiplier = TIME_SURCHARGE_RATES.standard;

  // Weekend surcharge
  if (day === 0 || day === 6) {
    multiplier = Math.max(multiplier, TIME_SURCHARGE_RATES.weekend);
  }

  // Time-based surcharge
  if (hour >= 23 || hour < 6) {
    multiplier = Math.max(multiplier, TIME_SURCHARGE_RATES.lateNight);
  } else if (hour >= 18) {
    multiplier = Math.max(multiplier, TIME_SURCHARGE_RATES.evening);
  }

  // TODO: Add holiday detection

  return subtotal * (multiplier - 1);
}

function calculateRiskSurcharge(subtotal: number, threatLevel: 'low' | 'medium' | 'high'): number {
  const multiplier = RISK_SURCHARGE_RATES[threatLevel];
  return subtotal * (multiplier - 1);
}

function calculateSpecialRequirements(
  requirements: SecurityAssessmentData['specialRequirements'],
  duration: number
): number {
  let total = 0;

  Object.entries(requirements).forEach(([key, enabled]) => {
    if (enabled) {
      const rate = SPECIAL_REQUIREMENTS_RATES[key as keyof typeof SPECIAL_REQUIREMENTS_RATES];
      if (rate) {
        total += rate * duration;
      }
    }
  });

  return total;
}

function calculateSubscriptionDiscount(amount: number, subscriptionTier?: string): number {
  if (!subscriptionTier) return 0;

  const discountRate = SUBSCRIPTION_DISCOUNTS[subscriptionTier as keyof typeof SUBSCRIPTION_DISCOUNTS];
  return discountRate ? amount * discountRate : 0;
}

function calculateDurationDiscount(amount: number, duration: number): number {
  const applicableDiscount = DURATION_DISCOUNTS.find(d => duration >= d.minHours);
  return applicableDiscount ? amount * applicableDiscount.discount : 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function getRecommendedTier(assessment: SecurityAssessmentData): PricingTier {
  const { threatLevel, locationType, specialRequirements } = assessment;

  // High risk or armed requirements = Shadow Protocol
  if (threatLevel === 'high' || specialRequirements.armed || specialRequirements.diplomatic) {
    return SERVICE_TIERS.find(t => t.id === 'shadow')!;
  }

  // Corporate/Event with medium risk = Executive
  if ((locationType === 'corporate' || locationType === 'event') && threatLevel === 'medium') {
    return SERVICE_TIERS.find(t => t.id === 'executive')!;
  }

  // Special requirements that benefit from Executive tier
  if (specialRequirements.surveillance || specialRequirements.k9Unit) {
    return SERVICE_TIERS.find(t => t.id === 'executive')!;
  }

  // Default to Essential for standard protection needs
  return SERVICE_TIERS.find(t => t.id === 'essential')!;
}