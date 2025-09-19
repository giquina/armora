import { ProtectionLevel } from '../components/Booking/ProtectionLevelSelector';
import { VenueTimeData } from '../components/Booking/VenueTimeEstimator';
import { formatPrice } from './priceFormatter';

export interface PricingBreakdown {
  components: Array<{
    label: string;
    amount: number;
    description?: string;
  }>;
  subtotal: number;
  discounts: Array<{
    label: string;
    amount: number;
    percentage?: number;
  }>;
  total: number;
  formattedBreakdown: string[];
}

export interface ProtectionServiceRequest {
  destination: string;
  protectionLevel: ProtectionLevel;
  venueTimeData?: VenueTimeData;
  userType: 'registered' | 'google' | 'guest';
  hasUnlockedReward?: boolean;
  estimatedDistance?: number; // in miles
  journeyTimeMinutes?: number; // one-way journey time
}

const RATES = {
  TRANSPORT_PROTECTION: 50, // £50/hour
  PERSONAL_PROTECTION: 65,  // £65/hour
  VEHICLE_COST_PER_MILE: 2.50, // £2.50/mile
  PARKING_ESTIMATE: 15, // £15 average parking
  MINIMUM_HOURS: 2
};

const DISCOUNTS = {
  MEMBER_DISCOUNT: 0.20, // 20% for registered members
  REWARD_DISCOUNT: 0.50  // 50% for first-time reward
};

/**
 * Calculates comprehensive pricing for protection services
 */
export function calculateProtectionPricing(request: ProtectionServiceRequest): PricingBreakdown {
  const {
    protectionLevel,
    venueTimeData,
    userType,
    hasUnlockedReward,
    estimatedDistance = 12, // Default 12 miles total
    journeyTimeMinutes = 25   // Default 25 minutes one-way
  } = request;

  // Calculate total protection time
  let totalHours: number;

  if (protectionLevel.type === 'transport') {
    // Transport: Journey time both ways + wait time (minimum 2 hours)
    const journeyHours = (journeyTimeMinutes * 2) / 60; // Both ways
    const waitHours = Math.max(RATES.MINIMUM_HOURS - journeyHours, 0.5); // Minimum wait time
    totalHours = Math.max(journeyHours + waitHours, RATES.MINIMUM_HOURS);
  } else {
    // Personal Protection: Journey time both ways + venue time
    const journeyHours = (journeyTimeMinutes * 2) / 60;
    const venueHours = venueTimeData?.venueHours || 2;
    totalHours = Math.max(journeyHours + venueHours, RATES.MINIMUM_HOURS);
  }

  // Calculate base costs
  const hourlyRate = protectionLevel.type === 'transport'
    ? RATES.TRANSPORT_PROTECTION
    : RATES.PERSONAL_PROTECTION;

  const protectionCost = totalHours * hourlyRate;
  const vehicleCost = estimatedDistance * RATES.VEHICLE_COST_PER_MILE;

  // Build pricing components
  const components = [
    {
      label: `Protection Officer (${totalHours}h @ £${hourlyRate})`,
      amount: protectionCost,
      description: protectionLevel.type === 'personal'
        ? 'Includes venue accompaniment'
        : 'Vehicle security and waiting time'
    },
    {
      label: `Secure Vehicle (${estimatedDistance} miles @ £${RATES.VEHICLE_COST_PER_MILE})`,
      amount: vehicleCost,
      description: 'Professional security vehicle and fuel'
    }
  ];

  // Add parking for personal protection if applicable
  if (protectionLevel.type === 'personal') {
    components.push({
      label: 'Estimated parking',
      amount: RATES.PARKING_ESTIMATE,
      description: 'Venue parking (if required)'
    });
  }

  const subtotal = components.reduce((sum, component) => sum + component.amount, 0);

  // Calculate discounts
  const discounts = [];

  // Member discount (20% for registered users)
  if (userType === 'registered' || userType === 'google') {
    const memberDiscount = subtotal * DISCOUNTS.MEMBER_DISCOUNT;
    discounts.push({
      label: 'Member Discount (20%)',
      amount: memberDiscount,
      percentage: 20
    });
  }

  // First-time reward (50% off - only if user has unlocked reward)
  if (hasUnlockedReward && (userType === 'registered' || userType === 'google')) {
    const rewardDiscount = subtotal * DISCOUNTS.REWARD_DISCOUNT;
    discounts.push({
      label: 'First Ride Reward (50%)',
      amount: rewardDiscount,
      percentage: 50
    });
  }

  const totalDiscountAmount = discounts.reduce((sum, discount) => sum + discount.amount, 0);
  const total = Math.max(subtotal - totalDiscountAmount, 0);

  // Create formatted breakdown for display
  const formattedBreakdown = createFormattedBreakdown(
    components,
    discounts,
    subtotal,
    total,
    request
  );

  return {
    components,
    subtotal,
    discounts,
    total,
    formattedBreakdown
  };
}

/**
 * Creates a formatted breakdown for display in UI
 */
function createFormattedBreakdown(
  components: PricingBreakdown['components'],
  discounts: PricingBreakdown['discounts'],
  subtotal: number,
  total: number,
  request: ProtectionServiceRequest
): string[] {
  const breakdown = [
    'Protection Service Breakdown:',
    '--------------------------------'
  ];

  // Add journey info
  const journeyTime = request.journeyTimeMinutes || 25;
  breakdown.push(`Journey: Current location to ${request.destination} (${journeyTime} mins)`);
  breakdown.push(`Service Type: ${request.protectionLevel.name}`);

  if (request.protectionLevel.type === 'personal' && request.venueTimeData) {
    breakdown.push(`Time at venue: ${request.venueTimeData.venueHours} hours`);
  }

  breakdown.push(`Return journey: ${journeyTime} mins`);

  // Calculate total protection time for display
  const journeyHours = (journeyTime * 2) / 60;
  const venueHours = request.venueTimeData?.venueHours || 0;
  const waitHours = request.protectionLevel.type === 'transport'
    ? Math.max(RATES.MINIMUM_HOURS - journeyHours, 0.5)
    : 0;
  const totalTime = Math.max(journeyHours + venueHours + waitHours, RATES.MINIMUM_HOURS);

  breakdown.push(`Total protection time: ${totalTime} hours`);
  breakdown.push('');
  breakdown.push('Cost Calculation:');

  // Add components
  components.forEach(component => {
    breakdown.push(`${component.label}: ${formatPrice(component.amount)}`);
  });

  breakdown.push('--------------------------------');
  breakdown.push(`Subtotal: ${formatPrice(subtotal)}`);

  // Add discounts
  discounts.forEach(discount => {
    breakdown.push(`${discount.label}: -${formatPrice(discount.amount)}`);
  });

  breakdown.push('--------------------------------');
  breakdown.push(`Total Service Fee: ${formatPrice(total)}`);

  return breakdown;
}

/**
 * Get estimated journey time based on destination
 */
export function estimateJourneyTime(destination: string): number {
  const dest = destination.toLowerCase();

  // Airport destinations typically take longer
  if (dest.includes('airport') || dest.includes('heathrow') || dest.includes('gatwick')) {
    return 45; // 45 minutes
  }

  // Central London destinations
  if (dest.includes('westminster') || dest.includes('covent garden') || dest.includes('oxford street')) {
    return 30; // 30 minutes
  }

  // Shopping centers
  if (dest.includes('harrods') || dest.includes('selfridges') || dest.includes('westfield')) {
    return 20; // 20 minutes
  }

  // Default estimate
  return 25; // 25 minutes
}

/**
 * Get estimated distance based on destination
 */
export function estimateDistance(destination: string): number {
  const dest = destination.toLowerCase();

  if (dest.includes('airport') || dest.includes('heathrow') || dest.includes('gatwick')) {
    return 25; // 25 miles total
  }

  if (dest.includes('central london') || dest.includes('westminster')) {
    return 16; // 16 miles total
  }

  return 12; // 12 miles default
}

/**
 * Check if parking is likely required for destination
 */
export function requiresParking(destination: string): boolean {
  const dest = destination.toLowerCase();

  // Venues that typically require paid parking
  return dest.includes('shopping') ||
         dest.includes('mall') ||
         dest.includes('harrods') ||
         dest.includes('selfridges') ||
         dest.includes('restaurant') ||
         dest.includes('hotel') ||
         dest.includes('hospital');
}

/**
 * Get protection level recommendation based on destination
 */
export function getRecommendedProtectionLevel(destination: string): 'transport' | 'personal' {
  const dest = destination.toLowerCase();

  // Destinations that typically benefit from personal protection
  if (dest.includes('shopping') ||
      dest.includes('airport') ||
      dest.includes('restaurant') ||
      dest.includes('bar') ||
      dest.includes('club') ||
      dest.includes('event') ||
      dest.includes('hospital')) {
    return 'personal';
  }

  // Business/office destinations typically just need transport
  if (dest.includes('office') ||
      dest.includes('business') ||
      dest.includes('meeting')) {
    return 'transport';
  }

  // Default to personal for safety
  return 'personal';
}