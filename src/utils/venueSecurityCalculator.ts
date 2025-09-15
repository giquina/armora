// UK Venue Security Pricing Calculator
import { VenueSecurityRequirements, VenueSecurityPricing, OfficerRequirement } from '../types';

// UK Market Rate Constants (£/day)
export const UK_MARKET_RATES = {
  DOOR_SUPERVISION: {
    min: 150,
    max: 250,
    standard: 200
  },
  CLOSE_PROTECTION: {
    entry: 500,
    standard: 650,
    experienced: 800,
    premium: 1000
  },
  MILITARY_SPECIALIST: {
    standard: 800,
    elite: 1200,
    confidential: 1500
  }
} as const;

// Officer to Attendee Ratios
export const SECURITY_RATIOS = {
  GENERAL_EVENT: 75,      // 1:75 for standard events
  HIGH_THREAT: 10,        // 1:10 for high-threat situations
  VIP_PROTECTION: 5,      // 1:5 for VIP/celebrity events
  DIPLOMATIC: 3           // 1:3 for diplomatic protection
} as const;

// Regional Price Variations (% adjustment)
export const REGIONAL_MULTIPLIERS = {
  LONDON: 1.2,           // 20% premium for London
  MANCHESTER: 1.05,      // 5% premium for Manchester
  BIRMINGHAM: 1.05,      // 5% premium for Birmingham
  EDINBURGH: 1.0,        // Standard rate for Edinburgh
  GLASGOW: 0.95,         // 5% discount for Glasgow
  REGIONAL: 0.85         // 15% discount for regional areas
} as const;

// Contract Duration Discounts
export const CONTRACT_DISCOUNTS = {
  SINGLE_DAY: 0,         // No discount
  WEEKEND: 0.05,         // 5% for weekend events
  WEEKLY: 0.125,         // 12.5% for weekly contracts
  MONTHLY: 0.175,        // 17.5% for monthly contracts
  QUARTERLY: 0.20        // 20% for quarterly contracts
} as const;

// Short Notice Premiums
export const SHORT_NOTICE_PREMIUMS = {
  SAME_DAY: 0.5,         // 50% premium for same-day
  NEXT_DAY: 0.3,         // 30% premium for next-day
  WITHIN_48H: 0.2,       // 20% premium for 48-hour notice
  WITHIN_WEEK: 0.1       // 10% premium for week notice
} as const;

export interface VenueSecurityCalculation {
  officerCount: number;
  baseRate: number;
  totalDailyRate: number;
  additionalCharges: {
    reconnaissance: number;
    equipment: number;
    travel: number;
    accommodation?: number;
    shortNotice?: number;
  };
  discounts: {
    contractDiscount: number;
    volumeDiscount: number;
  };
  finalCost: number;
  breakdown: string[];
  recommendations: string[];
}

/**
 * Calculate officer requirements based on event parameters
 */
export function calculateOfficerRequirements(
  attendees: number,
  threatLevel: 'low' | 'medium' | 'high' | 'critical',
  serviceType: 'door_supervision' | 'close_protection' | 'elite_protection',
  eventType: string
): number {
  let ratio: number = SECURITY_RATIOS.GENERAL_EVENT;

  // Adjust ratio based on threat level
  switch (threatLevel) {
    case 'critical':
      ratio = SECURITY_RATIOS.DIPLOMATIC;
      break;
    case 'high':
      ratio = SECURITY_RATIOS.HIGH_THREAT;
      break;
    case 'medium':
      ratio = eventType.includes('celebrity') ? SECURITY_RATIOS.VIP_PROTECTION : SECURITY_RATIOS.GENERAL_EVENT;
      break;
    default:
      ratio = SECURITY_RATIOS.GENERAL_EVENT;
  }

  const calculatedOfficers = Math.ceil(attendees / ratio);

  // Apply minimum officer requirements
  const minimumOfficers = {
    door_supervision: 1,
    close_protection: 2,
    elite_protection: 3
  };

  return Math.max(calculatedOfficers, minimumOfficers[serviceType]);
}

/**
 * Calculate base daily rate for officers
 */
export function calculateBaseDailyRate(
  serviceType: 'door_supervision' | 'close_protection' | 'elite_protection',
  experience: 'entry' | 'standard' | 'experienced' | 'premium' | 'elite',
  region: keyof typeof REGIONAL_MULTIPLIERS = 'LONDON'
): number {
  let baseRate: number;

  switch (serviceType) {
    case 'door_supervision':
      baseRate = UK_MARKET_RATES.DOOR_SUPERVISION.standard;
      break;
    case 'close_protection':
      baseRate = UK_MARKET_RATES.CLOSE_PROTECTION[experience as keyof typeof UK_MARKET_RATES.CLOSE_PROTECTION] ||
                 UK_MARKET_RATES.CLOSE_PROTECTION.standard;
      break;
    case 'elite_protection':
      baseRate = experience === 'elite' ?
                 UK_MARKET_RATES.MILITARY_SPECIALIST.elite :
                 UK_MARKET_RATES.MILITARY_SPECIALIST.standard;
      break;
    default:
      baseRate = UK_MARKET_RATES.CLOSE_PROTECTION.standard;
  }

  // Apply regional multiplier
  return Math.round(baseRate * REGIONAL_MULTIPLIERS[region]);
}

/**
 * Calculate additional charges
 */
export function calculateAdditionalCharges(
  serviceType: 'door_supervision' | 'close_protection' | 'elite_protection',
  requirements: string[],
  location: string,
  noticeHours: number
): VenueSecurityCalculation['additionalCharges'] {
  const charges = {
    reconnaissance: 0,
    equipment: 0,
    travel: 0,
    accommodation: undefined as number | undefined,
    shortNotice: undefined as number | undefined
  };

  // Advance reconnaissance (highly recommended)
  if (requirements.includes('advance_reconnaissance')) {
    charges.reconnaissance = serviceType === 'elite_protection' ? 500 :
                           serviceType === 'close_protection' ? 350 : 200;
  }

  // Equipment charges
  if (requirements.includes('surveillance_countermeasures') ||
      requirements.includes('team_coordination')) {
    charges.equipment = serviceType === 'elite_protection' ? 200 : 100;
  }

  // Travel charges (outside London)
  if (!location.toLowerCase().includes('london')) {
    charges.travel = 150;
  }

  // Accommodation for multi-day events outside officer's base
  if (requirements.includes('weekend_event') || requirements.includes('week_long_event')) {
    charges.accommodation = 120; // Per night
  }

  // Short notice premium
  if (noticeHours <= 24) {
    charges.shortNotice = SHORT_NOTICE_PREMIUMS.SAME_DAY;
  } else if (noticeHours <= 48) {
    charges.shortNotice = SHORT_NOTICE_PREMIUMS.WITHIN_48H;
  } else if (noticeHours <= 168) { // 1 week
    charges.shortNotice = SHORT_NOTICE_PREMIUMS.WITHIN_WEEK;
  }

  return charges;
}

/**
 * Calculate contract discounts
 */
export function calculateDiscounts(
  contractType: 'single_day' | 'weekend' | 'weekly' | 'monthly' | 'quarterly',
  officerCount: number
): { contractDiscount: number; volumeDiscount: number } {
  const contractDiscount = CONTRACT_DISCOUNTS[contractType.toUpperCase() as keyof typeof CONTRACT_DISCOUNTS] || 0;

  // Volume discount for multiple officers
  let volumeDiscount = 0;
  if (officerCount >= 5) {
    volumeDiscount = 0.1; // 10% for 5+ officers
  } else if (officerCount >= 3) {
    volumeDiscount = 0.05; // 5% for 3+ officers
  }

  return { contractDiscount, volumeDiscount };
}

/**
 * Main venue security calculation function
 */
export function calculateVenueSecurityCost(
  attendees: number,
  serviceType: 'door_supervision' | 'close_protection' | 'elite_protection',
  threatLevel: 'low' | 'medium' | 'high' | 'critical',
  eventType: string,
  contractType: 'single_day' | 'weekend' | 'weekly' | 'monthly' | 'quarterly',
  requirements: string[],
  location: string = 'London',
  noticeHours: number = 720, // 30 days default
  experience: 'entry' | 'standard' | 'experienced' | 'premium' | 'elite' = 'standard'
): VenueSecurityCalculation {

  // Calculate officer requirements
  const officerCount = calculateOfficerRequirements(attendees, threatLevel, serviceType, eventType);

  // Calculate base rate per officer
  const region = location.toLowerCase().includes('london') ? 'LONDON' :
                location.toLowerCase().includes('manchester') ? 'MANCHESTER' :
                location.toLowerCase().includes('birmingham') ? 'BIRMINGHAM' :
                location.toLowerCase().includes('edinburgh') ? 'EDINBURGH' :
                location.toLowerCase().includes('glasgow') ? 'GLASGOW' : 'REGIONAL';

  const baseRate = calculateBaseDailyRate(serviceType, experience, region);
  const totalDailyRate = baseRate * officerCount;

  // Calculate additional charges
  const additionalCharges = calculateAdditionalCharges(serviceType, requirements, location, noticeHours);

  // Calculate discounts
  const discounts = calculateDiscounts(contractType, officerCount);

  // Calculate total additional costs
  const totalAdditional = Object.values(additionalCharges).reduce((sum, charge) => {
    if (typeof charge === 'number') return sum + charge;
    return sum;
  }, 0);

  // Apply short notice premium to base rate
  let adjustedDailyRate = totalDailyRate;
  if (additionalCharges.shortNotice) {
    adjustedDailyRate = totalDailyRate * (1 + additionalCharges.shortNotice);
  }

  // Apply discounts
  const totalDiscount = discounts.contractDiscount + discounts.volumeDiscount;
  const discountedRate = adjustedDailyRate * (1 - totalDiscount);

  const finalCost = Math.round(discountedRate + totalAdditional);

  // Generate breakdown
  const breakdown = [
    `${officerCount} × ${serviceType.replace('_', ' ')} officers @ £${baseRate}/day`,
    `Base cost: £${totalDailyRate}`,
    ...(additionalCharges.reconnaissance ? [`Advance reconnaissance: £${additionalCharges.reconnaissance}`] : []),
    ...(additionalCharges.equipment ? [`Equipment: £${additionalCharges.equipment}`] : []),
    ...(additionalCharges.travel ? [`Travel: £${additionalCharges.travel}`] : []),
    ...(additionalCharges.accommodation ? [`Accommodation: £${additionalCharges.accommodation}/night`] : []),
    ...(additionalCharges.shortNotice ? [`Short notice premium: ${(additionalCharges.shortNotice * 100).toFixed(0)}%`] : []),
    ...(totalDiscount > 0 ? [`Contract discount: ${(totalDiscount * 100).toFixed(1)}%`] : []),
    `Total: £${finalCost}`
  ];

  // Generate recommendations
  const recommendations = [];

  if (!requirements.includes('advance_reconnaissance')) {
    recommendations.push('⚠️ Advance reconnaissance highly recommended for proper security planning');
  }

  if (threatLevel === 'high' && serviceType === 'door_supervision') {
    recommendations.push('⚠️ Consider upgrading to Close Protection for high-threat scenarios');
  }

  if (officerCount === 1 && attendees > 50) {
    recommendations.push('⚠️ Consider additional officers for events over 50 attendees');
  }

  if (noticeHours <= 48) {
    recommendations.push('⚠️ Short notice bookings limit officer selection and increase costs');
  }

  return {
    officerCount,
    baseRate,
    totalDailyRate,
    additionalCharges,
    discounts,
    finalCost,
    breakdown,
    recommendations
  };
}

/**
 * Generate SIA compliance verification checklist
 */
export function generateComplianceChecklist(
  serviceType: 'door_supervision' | 'close_protection' | 'elite_protection',
  attendees: number,
  requirements: string[]
): { requirement: string; mandatory: boolean; description: string; cost?: number }[] {
  const checklist = [];

  // SIA Licensing (mandatory)
  checklist.push({
    requirement: 'SIA License Verification',
    mandatory: true,
    description: serviceType === 'door_supervision' ? 'SIA Level 2 Door Supervision license required' : 'SIA Level 3 Close Protection license required'
  });

  // Insurance (mandatory)
  checklist.push({
    requirement: 'Professional Insurance',
    mandatory: true,
    description: 'Professional Indemnity (£2M+), Public Liability (£2-5M), Employers Liability (£5M)'
  });

  // Enhanced DBS (mandatory)
  checklist.push({
    requirement: 'Enhanced DBS Check',
    mandatory: true,
    description: 'Enhanced Disclosure and Barring Service check for all officers'
  });

  // Martyn's Law (mandatory for 200+ capacity)
  if (attendees >= 200) {
    checklist.push({
      requirement: "Martyn's Law Compliance",
      mandatory: true,
      description: 'Terrorism Protection of Premises Act 2025 - written security plan and risk assessment required'
    });
  }

  // BS 8507 (recommended)
  if (serviceType !== 'door_supervision') {
    checklist.push({
      requirement: 'BS 8507 Standards',
      mandatory: false,
      description: 'British Standard 8507 quality framework for close protection services'
    });
  }

  // Government clearance (if required)
  if (requirements.includes('government_clearance')) {
    checklist.push({
      requirement: 'Security Clearance',
      mandatory: true,
      description: 'SC (Security Check) or DV (Developed Vetting) clearance verification',
      cost: 500
    });
  }

  return checklist;
}

/**
 * Validate pricing against UK market standards
 */
export function validateMarketPricing(
  serviceType: 'door_supervision' | 'close_protection' | 'elite_protection',
  quotedRate: number,
  region: string = 'London'
): { isWithinMarket: boolean; marketRange: string; recommendation: string } {
  let marketMin: number, marketMax: number;

  switch (serviceType) {
    case 'door_supervision':
      marketMin = UK_MARKET_RATES.DOOR_SUPERVISION.min;
      marketMax = UK_MARKET_RATES.DOOR_SUPERVISION.max;
      break;
    case 'close_protection':
      marketMin = UK_MARKET_RATES.CLOSE_PROTECTION.entry;
      marketMax = UK_MARKET_RATES.CLOSE_PROTECTION.premium;
      break;
    case 'elite_protection':
      marketMin = UK_MARKET_RATES.MILITARY_SPECIALIST.standard;
      marketMax = UK_MARKET_RATES.MILITARY_SPECIALIST.confidential;
      break;
  }

  // Apply regional adjustment
  const regionalMultiplier = region.toLowerCase().includes('london') ? 1.2 : 1.0;
  const adjustedMin = Math.round(marketMin * regionalMultiplier);
  const adjustedMax = Math.round(marketMax * regionalMultiplier);

  const isWithinMarket = quotedRate >= adjustedMin && quotedRate <= adjustedMax;
  const marketRange = `£${adjustedMin}-£${adjustedMax}/day`;

  let recommendation: string;
  if (quotedRate < adjustedMin) {
    recommendation = '⚠️ Below market rate - verify service quality and credentials';
  } else if (quotedRate > adjustedMax) {
    recommendation = '⚠️ Above market rate - ensure premium justification';
  } else {
    recommendation = '✅ Within UK market standards';
  }

  return { isWithinMarket, marketRange, recommendation };
}