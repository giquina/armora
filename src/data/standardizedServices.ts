// SINGLE SOURCE OF TRUTH: Standardized Service Data
// This file contains the canonical service information used across ALL components

export interface ServiceFeature {
  icon: string;
  text: string;
}

export interface StandardizedService {
  id: 'standard' | 'executive' | 'shadow';
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
}

export const STANDARDIZED_SERVICES: Record<string, StandardizedService> = {
  standard: {
    id: 'standard',
    name: 'Armora Secure', // STANDARDIZED: Was "Standard" in some places, "Secure" in others
    tagline: 'Professional security transport for everyday protection',
    price: 45,
    priceDisplay: '£45/hour',
    hourlyRate: 45,
    description: 'Professional drivers with basic security training for routine transport needs. Ideal for general protection and peace of mind.',
    features: [
      { icon: '🛡️', text: 'SIA Level 2 certified drivers' },
      { icon: '🚗', text: 'Premium vehicle fleet' },
      { icon: '📱', text: 'Real-time tracking' },
      { icon: '☎️', text: '24/7 support line' },
      { icon: '🔒', text: 'Background checked team' }
    ],
    socialProof: 'Chosen by 2,847 professionals monthly',
    popularityRank: 2,
    targetUsers: ['general', 'student', 'academic', 'creative', 'family'],
    riskLevel: 'low'
  },

  executive: {
    id: 'executive',
    name: 'Armora Executive', // STANDARDIZED: Consistent everywhere
    tagline: 'Enhanced security protocols for business leaders and VIPs',
    price: 75,
    priceDisplay: '£75/hour',
    hourlyRate: 75,
    description: 'Specialized protection for executives and high-profile individuals with advanced security protocols and discretion training.',
    features: [
      { icon: '👔', text: 'Executive protection specialists' },
      { icon: '🏢', text: 'Corporate venue expertise' },
      { icon: '📋', text: 'Meeting coordination' },
      { icon: '🎯', text: 'Threat assessment protocols' },
      { icon: '🤝', text: 'Concierge-level service' },
      { icon: '📊', text: 'Detailed security reports' }
    ],
    socialProof: 'Trusted by 156 C-suite executives',
    popularityRank: 3,
    targetUsers: ['executive', 'entrepreneur', 'finance', 'legal', 'medical'],
    riskLevel: 'medium'
  },

  shadow: {
    id: 'shadow',
    name: 'Armora Shadow', // STANDARDIZED: Consistent everywhere
    tagline: 'Maximum discretion and security for high-risk situations',
    price: 65,
    priceDisplay: '£65/hour',
    hourlyRate: 65,
    description: 'Elite protection service with maximum discretion, advanced threat management, and crisis response capabilities for high-risk individuals.',
    features: [
      { icon: '🥷', text: 'Covert protection specialists' },
      { icon: '🔍', text: 'Advanced threat detection' },
      { icon: '🚨', text: 'Crisis response protocols' },
      { icon: '🤐', text: 'Maximum discretion guaranteed' },
      { icon: '🌐', text: 'Counter-surveillance expertise' },
      { icon: '⚡', text: 'Emergency extraction procedures' }
    ],
    socialProof: 'Most popular choice (67% of bookings)',
    popularityRank: 1, // Most popular
    targetUsers: ['celebrity', 'government', 'diplomat', 'security', 'high_profile'],
    riskLevel: 'high'
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

// Price calculation with discount
export interface PriceCalculation {
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
}

export const calculateServicePrice = (
  serviceId: string,
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
      discountPercentage: 0
    };
  }

  const basePrice = service.hourlyRate;
  const discountAmount = hasDiscount ? (basePrice * discountPercentage / 100) : 0;
  const finalPrice = basePrice - discountAmount;

  return {
    basePrice,
    discountAmount,
    finalPrice,
    hasDiscount,
    discountPercentage
  };
};