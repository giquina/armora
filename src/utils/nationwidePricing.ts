/**
 * Nationwide Protection Services Pricing Calculator
 * Supports England & Wales with regional pricing zones
 */

export interface NationwideLocationData {
  address: string;
  region: ServiceRegion;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distanceFromLondon?: number; // in miles
}

export interface DistanceCalculation {
  totalMiles: number;
  journeyTimeMinutes: number;
  isWithinM25: boolean;
  deploymentRegion: ServiceRegion;
  returnJourney: boolean;
}

export interface NationwidePricingBreakdown {
  protectionOfficer: {
    rate: number; // per hour
    hours: number;
    total: number;
    serviceLevel: 'Essential' | 'Executive';
  };
  vehicleOperation: {
    miles: number;
    ratePerMile: number;
    total: number;
  };
  deploymentSurcharge?: {
    reason: string;
    amount: number;
  };
  bookingFee: {
    amount: number;
    waived: boolean;
  };
  subtotal: number;
  memberDiscount?: {
    percentage: number;
    amount: number;
  };
  total: number;
  estimatedJourneyTime: number; // minutes
  serviceCoverage: string;
}

export type ServiceRegion =
  | 'Greater London (M25)'
  | 'Home Counties'
  | 'Major Cities'
  | 'Rural England'
  | 'Wales'
  | 'Scotland'
  | 'Northern Ireland';

// Pricing constants
const RATES = {
  PROTECTION_ESSENTIAL: 50, // £50/hr
  PROTECTION_EXECUTIVE: 75, // £75/hr
  VEHICLE_PER_MILE: 2.50, // £2.50/mile
  MINIMUM_HOURS: 2,
  BOOKING_FEE: 10, // £10
  MEMBER_DISCOUNT: 0.20 // 20%
};

// Regional boundaries and characteristics
const REGIONS: Record<ServiceRegion, {
  baseMultiplier: number;
  deploymentSurcharge: number;
  coverageDescription: string;
  maxDistanceFromLondon?: number;
}> = {
  'Greater London (M25)': {
    baseMultiplier: 1.0,
    deploymentSurcharge: 0,
    coverageDescription: 'Standard rates • London-based rapid response',
    maxDistanceFromLondon: 25
  },
  'Home Counties': {
    baseMultiplier: 1.0,
    deploymentSurcharge: 15, // £15 deployment
    coverageDescription: 'Standard rates + deployment • Regional coverage',
    maxDistanceFromLondon: 60
  },
  'Major Cities': {
    baseMultiplier: 1.0,
    deploymentSurcharge: 25, // £25 deployment
    coverageDescription: 'Standard rates + deployment • City partnerships',
    maxDistanceFromLondon: 200
  },
  'Rural England': {
    baseMultiplier: 1.1,
    deploymentSurcharge: 35, // £35 deployment
    coverageDescription: 'Rural coverage + 10% • Specialist deployment',
    maxDistanceFromLondon: 300
  },
  'Wales': {
    baseMultiplier: 1.1,
    deploymentSurcharge: 45, // £45 deployment
    coverageDescription: 'Wales coverage + 10% • Cross-border operations',
    maxDistanceFromLondon: 250
  },
  'Scotland': {
    baseMultiplier: 1.2,
    deploymentSurcharge: 65, // £65 deployment
    coverageDescription: 'Scotland coverage + 20% • Extended operations',
    maxDistanceFromLondon: 500
  },
  'Northern Ireland': {
    baseMultiplier: 1.3,
    deploymentSurcharge: 85, // £85 deployment
    coverageDescription: 'Northern Ireland + 30% • Specialized deployment',
    maxDistanceFromLondon: 600
  }
};

/**
 * Detect service region based on address
 */
export function detectServiceRegion(address: string): ServiceRegion {
  const addr = address.toLowerCase();

  // Greater London detection
  const londonIndicators = [
    'london', 'ec1', 'ec2', 'ec3', 'ec4', 'wc1', 'wc2', 'w1', 'sw1', 'se1', 'nw1', 'n1', 'e1',
    'westminster', 'kensington', 'chelsea', 'camden', 'islington', 'hackney', 'tower hamlets',
    'southwark', 'lambeth', 'wandsworth', 'hammersmith', 'fulham', 'greenwich', 'lewisham',
    'canary wharf', 'shoreditch', 'mayfair', 'covent garden', 'paddington', 'kings cross'
  ];

  if (londonIndicators.some(indicator => addr.includes(indicator))) {
    return 'Greater London (M25)';
  }

  // Home Counties
  const homeCounties = [
    'hertfordshire', 'hertford', 'watford', 'st albans', 'hemel hempstead',
    'essex', 'chelmsford', 'colchester', 'southend', 'basildon',
    'kent', 'canterbury', 'maidstone', 'dartford', 'bromley',
    'surrey', 'guildford', 'woking', 'epsom', 'richmond',
    'buckinghamshire', 'milton keynes', 'aylesbury', 'high wycombe',
    'berkshire', 'reading', 'slough', 'windsor', 'maidenhead',
    'bedfordshire', 'luton', 'bedford'
  ];

  if (homeCounties.some(county => addr.includes(county))) {
    return 'Home Counties';
  }

  // Major Cities
  const majorCities = [
    'manchester', 'birmingham', 'leeds', 'liverpool', 'newcastle', 'sheffield',
    'bristol', 'nottingham', 'leicester', 'coventry', 'bradford', 'wolverhampton',
    'plymouth', 'stoke', 'derby', 'southampton', 'portsmouth', 'york',
    'oxford', 'cambridge', 'brighton', 'bournemouth', 'swindon', 'huddersfield',
    'warrington', 'stockport', 'preston', 'newport', 'cardiff'
  ];

  if (majorCities.some(city => addr.includes(city))) {
    return 'Major Cities';
  }

  // Wales
  const walesIndicators = [
    'wales', 'cymru', 'cardiff', 'swansea', 'newport', 'bangor', 'wrexham',
    'merthyr tydfil', 'barry', 'caerphilly', 'neath', 'port talbot',
    'bridgend', 'flintshire', 'denbighshire', 'conwy', 'gwynedd',
    'anglesey', 'ceredigion', 'powys', 'carmarthenshire', 'pembrokeshire',
    'monmouthshire', 'blaenau gwent', 'torfaen', 'vale of glamorgan',
    'rhondda cynon taff', 'merthyr tydfil'
  ];

  if (walesIndicators.some(indicator => addr.includes(indicator))) {
    return 'Wales';
  }

  // Scotland
  const scotlandIndicators = [
    'scotland', 'glasgow', 'edinburgh', 'aberdeen', 'dundee', 'stirling',
    'perth', 'inverness', 'highlands', 'lowlands', 'fife', 'ayrshire',
    'lanarkshire', 'renfrewshire', 'dumfries', 'galloway', 'borders',
    'lothian', 'grampian', 'tayside', 'central scotland', 'strathclyde'
  ];

  if (scotlandIndicators.some(indicator => addr.includes(indicator))) {
    return 'Scotland';
  }

  // Northern Ireland
  const niIndicators = [
    'northern ireland', 'belfast', 'derry', 'londonderry', 'armagh',
    'antrim', 'down', 'fermanagh', 'tyrone', 'ulster'
  ];

  if (niIndicators.some(indicator => addr.includes(indicator))) {
    return 'Northern Ireland';
  }

  // Default to Rural England for anywhere else in England
  return 'Rural England';
}

/**
 * Calculate mileage between two locations
 * This is a simplified version - in production, would use Google Maps/Mapbox API
 */
export function calculateMileage(origin: string, destination: string): DistanceCalculation {
  const originRegion = detectServiceRegion(origin);
  const destRegion = detectServiceRegion(destination);

  // Simplified distance calculation based on regions
  let baseMiles = 12; // Default London-area journey

  // If crossing regions, add distance
  if (originRegion !== destRegion) {
    baseMiles += 25; // Cross-region travel
  }

  // Region-specific adjustments
  if (destRegion === 'Home Counties') baseMiles = Math.max(baseMiles, 20);
  if (destRegion === 'Major Cities') baseMiles = Math.max(baseMiles, 35);
  if (destRegion === 'Rural England') baseMiles = Math.max(baseMiles, 45);
  if (destRegion === 'Wales') baseMiles = Math.max(baseMiles, 55);
  if (destRegion === 'Scotland') baseMiles = Math.max(baseMiles, 85);
  if (destRegion === 'Northern Ireland') baseMiles = Math.max(baseMiles, 120);

  // Add random variation for realism
  const variation = Math.random() * 0.2 - 0.1; // ±10%
  const totalMiles = Math.round((baseMiles * (1 + variation)) * 10) / 10;

  // Calculate journey time (average 30 mph in cities, 50 mph motorways)
  const avgSpeed = originRegion === 'Greater London (M25)' ? 25 : 45;
  const journeyTimeMinutes = Math.round((totalMiles / avgSpeed) * 60);

  return {
    totalMiles,
    journeyTimeMinutes,
    isWithinM25: originRegion === 'Greater London (M25)' && destRegion === 'Greater London (M25)',
    deploymentRegion: destRegion,
    returnJourney: true
  };
}

/**
 * Calculate comprehensive nationwide protection pricing
 */
export function calculateNationwideProtection(
  origin: string,
  destination: string,
  serviceLevel: 'Essential' | 'Executive',
  options: {
    userType?: 'registered' | 'google' | 'guest';
    isMember?: boolean;
    minimumHours?: number;
  } = {}
): NationwidePricingBreakdown {

  const {
    userType = 'guest',
    isMember = false,
    minimumHours = RATES.MINIMUM_HOURS
  } = options;

  // Calculate distance and journey details
  const distance = calculateMileage(origin, destination);
  const region = distance.deploymentRegion;
  const regionData = REGIONS[region];

  // Determine protection hours (minimum 2 hours)
  const journeyHours = (distance.journeyTimeMinutes * 2) / 60; // Return journey
  const waitTime = Math.max(minimumHours - journeyHours, 0.5); // Minimum wait
  const totalHours = Math.max(journeyHours + waitTime, minimumHours);

  // Calculate protection officer cost
  const hourlyRate = serviceLevel === 'Executive'
    ? RATES.PROTECTION_EXECUTIVE
    : RATES.PROTECTION_ESSENTIAL;
  const adjustedHourlyRate = hourlyRate * regionData.baseMultiplier;
  const protectionCost = totalHours * adjustedHourlyRate;

  // Calculate vehicle operation cost
  const vehicleCost = distance.totalMiles * RATES.VEHICLE_PER_MILE;

  // Build pricing breakdown
  const breakdown: NationwidePricingBreakdown = {
    protectionOfficer: {
      rate: adjustedHourlyRate,
      hours: totalHours,
      total: protectionCost,
      serviceLevel
    },
    vehicleOperation: {
      miles: distance.totalMiles,
      ratePerMile: RATES.VEHICLE_PER_MILE,
      total: vehicleCost
    },
    bookingFee: {
      amount: RATES.BOOKING_FEE,
      waived: isMember
    },
    subtotal: protectionCost + vehicleCost + (isMember ? 0 : RATES.BOOKING_FEE),
    total: 0, // Will be calculated below
    estimatedJourneyTime: distance.journeyTimeMinutes,
    serviceCoverage: regionData.coverageDescription
  };

  // Add deployment surcharge if applicable
  if (regionData.deploymentSurcharge > 0) {
    breakdown.deploymentSurcharge = {
      reason: `Officer deployment to ${region}`,
      amount: regionData.deploymentSurcharge
    };
    breakdown.subtotal += regionData.deploymentSurcharge;
  }

  // Apply member discount (20% on total)
  if (isMember && (userType === 'registered' || userType === 'google')) {
    const discountAmount = breakdown.subtotal * RATES.MEMBER_DISCOUNT;
    breakdown.memberDiscount = {
      percentage: 20,
      amount: discountAmount
    };
    breakdown.total = breakdown.subtotal - discountAmount;
  } else {
    breakdown.total = breakdown.subtotal;
  }

  return breakdown;
}

/**
 * Get popular nationwide destinations for quick access
 */
export function getNationwideDestinations(): Array<{
  name: string;
  address: string;
  region: ServiceRegion;
  category: string;
}> {
  return [
    // London Airports
    {
      name: 'Heathrow Airport',
      address: 'Heathrow Airport, London TW6',
      region: 'Greater London (M25)',
      category: 'Airports'
    },
    {
      name: 'Gatwick Airport',
      address: 'Gatwick Airport, West Sussex RH6',
      region: 'Home Counties',
      category: 'Airports'
    },
    {
      name: 'Stansted Airport',
      address: 'Stansted Airport, Essex CM24',
      region: 'Home Counties',
      category: 'Airports'
    },

    // Major Cities
    {
      name: 'Manchester',
      address: 'Manchester City Centre, Manchester M1',
      region: 'Major Cities',
      category: 'Cities'
    },
    {
      name: 'Birmingham',
      address: 'Birmingham City Centre, Birmingham B1',
      region: 'Major Cities',
      category: 'Cities'
    },
    {
      name: 'Cardiff',
      address: 'Cardiff City Centre, Cardiff CF10',
      region: 'Wales',
      category: 'Cities'
    },
    {
      name: 'Edinburgh',
      address: 'Edinburgh City Centre, Edinburgh EH1',
      region: 'Scotland',
      category: 'Cities'
    },

    // Business Districts
    {
      name: 'Canary Wharf',
      address: 'Canary Wharf, London E14',
      region: 'Greater London (M25)',
      category: 'Business'
    },
    {
      name: 'Oxford',
      address: 'Oxford City Centre, Oxfordshire OX1',
      region: 'Home Counties',
      category: 'Business'
    },
    {
      name: 'Cambridge',
      address: 'Cambridge City Centre, Cambridgeshire CB1',
      region: 'Home Counties',
      category: 'Business'
    }
  ];
}

/**
 * Validate if address is within service coverage
 */
export function isWithinServiceCoverage(address: string): {
  covered: boolean;
  region: ServiceRegion;
  message: string;
} {
  const region = detectServiceRegion(address);

  // Currently covering England & Wales
  const covered = region !== 'Scotland' && region !== 'Northern Ireland';

  let message = '';
  if (covered) {
    message = `✓ Coverage confirmed for ${region}`;
  } else {
    message = `Service expansion to ${region} coming soon. Contact us for custom quote.`;
  }

  return { covered, region, message };
}