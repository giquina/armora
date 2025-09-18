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
    name: 'ARMORA ESSENTIAL',
    tagline: 'Security officer providing eco-friendly safe travel',
    price: 35,
    priceDisplay: '£35.00/hour + £1.20/mile',
    hourlyRate: 35,
    description: 'Licensed protection professional ensuring your security in a discrete, environmentally conscious vehicle.',
    features: [
      { icon: '🛡️', text: 'Licensed security professionals' },
      { icon: '🌱', text: 'Eco-friendly Nissan Leaf EV' },
      { icon: '👤', text: 'Personal protection trained' },
      { icon: '📱', text: 'Real-time security tracking' },
      { icon: '☎️', text: '24/7 support' },
      { icon: '🔒', text: 'Government-vetted officers' }
    ],
    socialProof: 'Trusted by 2,847 individuals monthly',
    popularityRank: 3,
    targetUsers: ['general', 'student', 'women', 'vulnerable_groups'],
    riskLevel: 'low',
    vehicleType: 'company',
    pricingOptions: {
      hourly: {
        type: 'hourly',
        baseRate: 65,
        minimumHours: 4,
        hourlyBlocks: [4, 6, 8]
      },
      journey: {
        type: 'journey',
        baseRate: 65,
        journeyMultiplier: 1.2
      }
    }
  },

  'client-vehicle': {
    id: 'client-vehicle',
    name: 'ARMORA COMFORT',
    tagline: 'Professional security with comfortable travel',
    price: 45,
    priceDisplay: '£45.00/hour + £1.50/mile',
    hourlyRate: 45,
    description: 'Experienced security officer providing protection and safe passage in a quality vehicle.',
    features: [
      { icon: '🛡️', text: 'Licensed security officers' },
      { icon: '🚗', text: 'Standard sedan vehicle' },
      { icon: '⭐', text: 'Quality comfort features' },
      { icon: '🤐', text: 'Professional discretion' },
      { icon: '👤', text: 'Protection throughout journey' },
      { icon: '📱', text: 'Secure tracking system' }
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
        minimumHours: 4,
        hourlyBlocks: [4, 6, 8]
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
    name: 'ARMORA PREMIUM',
    tagline: 'Executive security service with luxury travel',
    price: 75,
    priceDisplay: '£75.00/hour + £2.00/mile',
    hourlyRate: 75,
    description: 'Senior protection officer delivering high-level security with premium comfort.',
    features: [
      { icon: '👔', text: 'Senior protection officers' },
      { icon: '🚗', text: 'Luxury sedan (Mercedes, BMW)' },
      { icon: '⭐', text: 'Premium comfort amenities' },
      { icon: '🤐', text: 'Executive-level discretion' },
      { icon: '🛡️', text: 'Enhanced security protocols' },
      { icon: '📊', text: 'Professional service standards' }
    ],
    socialProof: 'Protecting 156 C-suite executives',
    popularityRank: 4,
    targetUsers: ['executive', 'entrepreneur', 'finance', 'legal', 'medical'],
    riskLevel: 'medium',
    vehicleType: 'company',
    pricingOptions: {
      hourly: {
        type: 'hourly',
        baseRate: 95,
        minimumHours: 6,
        hourlyBlocks: [6, 8, 12]
      },
      journey: {
        type: 'journey',
        baseRate: 95,
        journeyMultiplier: 1.4
      }
    }
  },

  shadow: {
    id: 'shadow',
    name: 'ARMORA ELITE',
    tagline: 'Maximum security with specialist protection',
    price: 150,
    priceDisplay: '£150.00/hour + £3.00/mile',
    hourlyRate: 150,
    description: 'Elite security team providing comprehensive protection with advanced safety features.',
    features: [
      { icon: '🛡️', text: 'Elite security specialists' },
      { icon: '🚙', text: 'Premium SUV/Armoured vehicle' },
      { icon: '🔍', text: 'Advanced security systems' },
      { icon: '🚨', text: 'Rapid response capability' },
      { icon: '🌐', text: 'Comprehensive protection' },
      { icon: '⚡', text: 'Maximum safety protocols' }
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
        baseRate: 125,
        minimumHours: 8,
        hourlyBlocks: [8, 12, 24]
      },
      journey: {
        type: 'journey',
        baseRate: 125,
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
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  pricingType: 'hourly' | 'journey';
  duration?: number;
  minimumCharge?: number;
}

export const calculateHourlyPrice = (
  serviceId: string,
  hours: number,
  hasDiscount: boolean = false,
  discountPercentage: number = 50
): PriceCalculation => {
  const service = getServiceById(serviceId);
  if (!service) {
    return {
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
    basePrice,
    discountAmount,
    finalPrice,
    hasDiscount,
    discountPercentage,
    pricingType: 'journey',
    duration: durationHours
  };
};

// Personal Protection Officer (PPO) venue booking
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