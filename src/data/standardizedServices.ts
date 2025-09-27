// SINGLE SOURCE OF TRUTH: Standardized Service Data
// This file contains the canonical service information used across ALL components

export interface ServiceFeature {
  icon: string;
  text: string;
}

export interface PricingOption {
  type: 'hourly' | 'journey';
  baseRate: number;
  minimumHours?: number;
  hourlyBlocks?: number[];
  journeyMultiplier?: number;
}

export interface StandardizedService {
  id: 'standard' | 'executive' | 'shadow' | 'client-vehicle';
  name: string;
  tagline: string;
  price: number;
  priceDisplay: string;
  hourlyRate: number;
  mileageRate: number;
  description: string;
  features: ServiceFeature[];
  socialProof: string;
  popularityRank: number;
  targetUsers: string[];
  riskLevel: 'low' | 'medium' | 'high';
  vehicleType?: 'company' | 'client';
  badge?: string;
  pricingOptions: {
    hourly: PricingOption;
    journey: PricingOption;
  };
}

export const STANDARDIZED_SERVICES: Record<string, StandardizedService> = {
  standard: {
    id: 'standard',
    name: 'Essential Protection',
    tagline: 'Professional close protection with certified security officers',
    price: 50,
    priceDisplay: '£50/hour + £2.50/mile',
    hourlyRate: 50,
    mileageRate: 2.50,
    description: 'SIA Level 2 certified protection officers ensuring your complete security. Comprehensive protection services including secure movement for enhanced personal safety.',
    features: [
      { icon: '🛡️', text: 'SIA Level 2 certified protection officers' },
      { icon: '👤', text: 'Personal protection trained' },
      { icon: '🚗', text: 'Secure vehicle fleet' },
      { icon: '📱', text: 'Real-time GPS tracking' },
      { icon: '☎️', text: '24/7 customer support' },
      { icon: '🔒', text: 'Background verified team' }
    ],
    socialProof: 'Trusted by 2,847 individuals monthly',
    popularityRank: 3,
    targetUsers: ['general', 'student', 'women', 'vulnerable_groups'],
    riskLevel: 'low',
    vehicleType: 'company',
    pricingOptions: {
      hourly: {
        type: 'hourly',
        baseRate: 50,
        minimumHours: 2,
        hourlyBlocks: [2, 4, 6, 8]
      },
      journey: {
        type: 'journey',
        baseRate: 50,
        journeyMultiplier: 1.2
      }
    }
  },

  'client-vehicle': {
    id: 'client-vehicle',
    name: 'Client Vehicle',
    tagline: 'Your vehicle, our protection officer - maximum privacy and discretion',
    price: 55,
    priceDisplay: '£55/hour + £2.50/mile',
    hourlyRate: 55,
    mileageRate: 2.50,
    description: 'SIA certified protection officers provide security using your personal vehicle, ensuring complete privacy and discretion while maintaining comprehensive protection coverage.',
    features: [
      { icon: '🔑', text: 'SIA Level 2 certified protection officers' },
      { icon: '🚙', text: 'Your personal vehicle used' },
      { icon: '💰', text: 'Cost-effective protection' },
      { icon: '🤐', text: 'Maximum discretion guaranteed' },
      { icon: '👤', text: 'Personal protection trained' },
      { icon: '📱', text: 'Secure real-time tracking' }
    ],
    socialProof: 'Chosen by 1,892 privacy-conscious clients',
    popularityRank: 2,
    targetUsers: ['executive', 'privacy_conscious', 'family', 'general'],
    riskLevel: 'low',
    vehicleType: 'client',
    badge: 'Best Value',
    pricingOptions: {
      hourly: {
        type: 'hourly',
        baseRate: 55,
        minimumHours: 2,
        hourlyBlocks: [2, 4, 6, 8]
      },
      journey: {
        type: 'journey',
        baseRate: 55,
        journeyMultiplier: 1.1
      }
    }
  },

  executive: {
    id: 'executive',
    name: 'Executive Shield',
    tagline: 'Enhanced close protection for corporate executives and business leaders',
    price: 75,
    priceDisplay: '£75/hour + £2.50/mile',
    hourlyRate: 75,
    mileageRate: 2.50,
    description: 'SIA Level 3 certified executive protection specialists providing comprehensive security coverage including threat assessment, venue security, and discrete protection services for high-profile business leaders.',
    features: [
      { icon: '👔', text: 'SIA Level 3 executive protection specialists' },
      { icon: '🏢', text: 'Corporate venue security expertise' },
      { icon: '🎯', text: 'Advanced threat assessment' },
      { icon: '🤐', text: 'Discrete protection services' },
      { icon: '🚗', text: 'Protected vehicle options' },
      { icon: '📊', text: 'Detailed security reports' }
    ],
    socialProof: 'Protecting 156 C-suite executives',
    popularityRank: 4,
    targetUsers: ['executive', 'entrepreneur', 'finance', 'legal', 'medical'],
    riskLevel: 'medium',
    vehicleType: 'company',
    pricingOptions: {
      hourly: {
        type: 'hourly',
        baseRate: 75,
        minimumHours: 2,
        hourlyBlocks: [2, 4, 6, 8]
      },
      journey: {
        type: 'journey',
        baseRate: 75,
        journeyMultiplier: 1.4
      }
    }
  },

  shadow: {
    id: 'shadow',
    name: 'Shadow Protocol',
    tagline: 'Elite covert protection for high-risk individuals and VIPs',
    price: 65,
    priceDisplay: '£65/hour + £2.50/mile',
    hourlyRate: 65,
    mileageRate: 2.50,
    description: 'Special Forces trained covert protection specialists providing maximum security for high-risk situations. Advanced threat management, counter-surveillance, and secure movement capabilities.',
    features: [
      { icon: '🥷', text: 'Special Forces trained protection specialists' },
      { icon: '🔍', text: 'Advanced threat detection systems' },
      { icon: '🚨', text: 'Rapid response protocols' },
      { icon: '🤐', text: 'Covert protection operations' },
      { icon: '🌐', text: 'Counter-surveillance expertise' },
      { icon: '⚡', text: 'Secure extraction capabilities' }
    ],
    socialProof: 'Most popular choice (67% of high-risk clients)',
    popularityRank: 1,
    targetUsers: ['celebrity', 'government', 'diplomat', 'high_profile', 'international'],
    riskLevel: 'high',
    vehicleType: 'company',
    badge: 'Most Popular',
    pricingOptions: {
      hourly: {
        type: 'hourly',
        baseRate: 65,
        minimumHours: 2,
        hourlyBlocks: [2, 4, 6, 8]
      },
      journey: {
        type: 'journey',
        baseRate: 65,
        journeyMultiplier: 1.6
      }
    }
  }
};

// Helper functions for consistent service access
export const getServiceById = (id: string): StandardizedService | null => {
  return STANDARDIZED_SERVICES[id] || null;
};

export const getAllServices = (): StandardizedService[] => {
  return Object.values(STANDARDIZED_SERVICES);
};

export const getServicesByRiskLevel = (riskLevel: 'low' | 'medium' | 'high'): StandardizedService[] => {
  return getAllServices().filter(service => service.riskLevel === riskLevel);
};

export const getRecommendedServiceByProfile = (profile: string): StandardizedService => {
  // Find service where profile is in targetUsers
  const matchingService = getAllServices().find(service =>
    service.targetUsers.includes(profile)
  );

  // Default to standard if no match
  return matchingService || STANDARDIZED_SERVICES.standard;
};

export const getMostPopularService = (): StandardizedService => {
  return getAllServices().sort((a, b) => a.popularityRank - b.popularityRank)[0];
};

// Dual pricing system calculations
export interface PriceCalculation {
  protectionFee: number;
  vehicleFee: number;
  bookingFee: number;
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  pricingType: 'hourly' | 'journey';
  duration?: number;
  distance?: number;
  minimumCharge?: number;
}

// New dual pricing calculator (SIA compliant)
export const calculateDualPrice = (
  serviceId: string,
  hours: number,
  miles: number,
  isMember: boolean = false,
  memberDiscountPercentage: number = 20
): PriceCalculation => {
  const service = getServiceById(serviceId);
  if (!service) {
    return {
      protectionFee: 0,
      vehicleFee: 0,
      bookingFee: 0,
      basePrice: 0,
      discountAmount: 0,
      finalPrice: 0,
      hasDiscount: false,
      discountPercentage: 0,
      pricingType: 'hourly',
      duration: hours,
      distance: miles
    };
  }

  // Ensure minimum 2 hours
  const effectiveHours = Math.max(hours, 2);

  // Calculate components
  const protectionFee = service.hourlyRate * effectiveHours;
  const vehicleFee = service.mileageRate * miles;
  const bookingFee = isMember ? 0 : 10;

  const subtotal = protectionFee + vehicleFee + bookingFee;
  const discountAmount = isMember ? (protectionFee + vehicleFee) * (memberDiscountPercentage / 100) : 0;
  const finalPrice = subtotal - discountAmount;

  return {
    protectionFee,
    vehicleFee,
    bookingFee,
    basePrice: subtotal,
    discountAmount,
    finalPrice,
    hasDiscount: isMember,
    discountPercentage: memberDiscountPercentage,
    pricingType: 'hourly',
    duration: effectiveHours,
    distance: miles,
    minimumCharge: service.hourlyRate * 2 + service.mileageRate * miles
  };
};

export const calculateHourlyPrice = (
  serviceId: string,
  hours: number,
  hasDiscount: boolean = false,
  discountPercentage: number = 50
): PriceCalculation => {
  const service = getServiceById(serviceId);
  if (!service) {
    return {
      protectionFee: 0,
      vehicleFee: 0,
      bookingFee: 0,
      basePrice: 0,
      discountAmount: 0,
      finalPrice: 0,
      hasDiscount: false,
      discountPercentage: 0,
      pricingType: 'hourly'
    };
  }

  const minimumHours = service.pricingOptions.hourly.minimumHours || 4;
  const effectiveHours = Math.max(hours, minimumHours);
  const basePrice = service.hourlyRate * effectiveHours;
  const discountAmount = hasDiscount ? (basePrice * discountPercentage / 100) : 0;
  const finalPrice = basePrice - discountAmount;

  return {
    protectionFee: basePrice,
    vehicleFee: 0,
    bookingFee: 0,
    basePrice,
    discountAmount,
    finalPrice,
    hasDiscount,
    discountPercentage,
    pricingType: 'hourly',
    duration: effectiveHours,
    minimumCharge: service.hourlyRate * minimumHours
  };
};

export const calculateJourneyPrice = (
  serviceId: string,
  estimatedDuration: number,
  distance: number,
  hasDiscount: boolean = false,
  discountPercentage: number = 50
): PriceCalculation => {
  const service = getServiceById(serviceId);
  if (!service) {
    return {
      protectionFee: 0,
      vehicleFee: 0,
      bookingFee: 0,
      basePrice: 0,
      discountAmount: 0,
      finalPrice: 0,
      hasDiscount: false,
      discountPercentage: 0,
      pricingType: 'journey'
    };
  }

  const journeyMultiplier = service.pricingOptions.journey.journeyMultiplier || 1.2;
  const baseRate = service.hourlyRate;
  const durationHours = estimatedDuration / 60; // Convert minutes to hours
  const basePrice = (baseRate * durationHours * journeyMultiplier) + (distance * 0.5); // Add £0.50 per mile
  const discountAmount = hasDiscount ? (basePrice * discountPercentage / 100) : 0;
  const finalPrice = basePrice - discountAmount;

  return {
    protectionFee: baseRate * durationHours * journeyMultiplier,
    vehicleFee: distance * 0.5,
    bookingFee: 0,
    basePrice,
    discountAmount,
    finalPrice,
    hasDiscount,
    discountPercentage,
    pricingType: 'journey',
    duration: durationHours
  };
};

// Personal Protection Officer (PPO) venue protection assignment
export interface PPOVenueBooking {
  serviceType: 'venue_protection';
  duration: 'day' | '2_days' | 'month' | 'year';
  officerCount: number;
  venueType: string;
  specialRequirements?: string[];
  basePrice: number;
  totalPrice: number;
}

export const PPO_VENUE_RATES = {
  day: 450, // per officer per day
  '2_days': 850, // per officer for 2 days (5% discount)
  month: 12500, // per officer per month
  year: 135000 // per officer per year (10% discount)
};

export const calculatePPOVenuePrice = (
  duration: 'day' | '2_days' | 'month' | 'year',
  officerCount: number = 1,
  venueType: string = 'standard'
): PPOVenueBooking => {
  const baseRate = PPO_VENUE_RATES[duration];
  const venueMultiplier = venueType === 'high_risk' ? 1.5 : 1.0;
  const basePrice = baseRate * venueMultiplier;
  const totalPrice = basePrice * officerCount;

  return {
    serviceType: 'venue_protection',
    duration,
    officerCount,
    venueType,
    basePrice,
    totalPrice
  };
};

// Legacy function for backward compatibility
export const calculateServicePrice = (
  serviceId: string,
  hasDiscount: boolean = false,
  discountPercentage: number = 50
): PriceCalculation => {
  return calculateHourlyPrice(serviceId, 4, hasDiscount, discountPercentage);
};