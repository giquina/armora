// Close Protection Officer (CPO) Types and Interfaces
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  postcode: string;
  city: string;
  region: string;
}

export interface SIABadge {
  licenseNumber: string;
  level: 'Level_2' | 'Level_3' | 'Level_4';
  expiryDate: string;
  verified: boolean;
  verificationDate?: string;
  specialistSectors: string[];
}

export interface MilitaryBackground {
  hasMilitaryService: boolean;
  branch?: 'Army' | 'Navy' | 'RAF' | 'Royal_Marines';
  rank?: string;
  yearsOfService?: number;
  specializations?: string[];
  securityClearance?: 'SC' | 'DV' | 'Enhanced_DV';
}

export interface PoliceBackground {
  hasPoliceService: boolean;
  force?: string;
  rank?: string;
  yearsOfService?: number;
  specializations?: string[];
  crnumber?: string;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  color: string;
  registration: string;
  type: 'Standard' | 'Executive' | 'Armored' | 'Unmarked';
  capacity: number;
  features: string[];
}

export interface Certification {
  name: string;
  issuingBody: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  level?: string;
}

export interface Specialization {
  type: 'VIP_Protection' | 'Residential_Security' | 'Event_Security' | 'Close_Protection' |
        'Corporate_Security' | 'Diplomatic_Protection' | 'Counter_Surveillance' |
        'Executive_Transport' | 'Hostile_Environment' | 'Maritime_Security';
  yearsExperience: number;
  certifications: string[];
  notable?: string[];
}

export interface Assignment {
  id: string;
  principalId: string;
  startDate: string;
  endDate: string;
  duration: number; // in hours
  type: string;
  rating?: number;
  feedback?: string;
  location: string;
}

export interface Availability {
  status: 'Available_Now' | 'Available_Soon' | 'On_Assignment' | 'Off_Duty' | 'Emergency_Only';
  nextAvailable?: string;
  responseTime: number; // in minutes
  currentAssignmentEndTime?: string;
  workingHours: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
}

export interface CPOProfile {
  id: string;

  // Personal Information
  firstName: string;
  lastName: string;
  callSign?: string;
  dateOfBirth: string;
  nationality: string;
  languages: string[];
  profilePhoto?: string;

  // Professional Details
  sia: SIABadge;
  yearsOfExperience: number;
  militaryBackground: MilitaryBackground;
  policeBackground: PoliceBackground;
  specializations: Specialization[];
  certifications: Certification[];

  // Current Status
  availability: Availability;
  currentLocation?: Location;
  coverageAreas: string[]; // postcodes/regions they cover

  // Performance Metrics
  rating: number;
  totalAssignments: number;
  completedAssignments: number;
  cancelledAssignments: number;
  averageResponseTime: number; // in minutes
  reliabilityScore: number; // 0-100

  // Assignment History
  recentAssignments: Assignment[];
  testimonials: {
    principalName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }[];

  // Operational Information
  vehicle?: Vehicle;
  equipment: string[];
  operationalProcedures: string[];
  emergencyContacts: {
    primary: { name: string; relationship: string; phone: string };
    secondary: { name: string; relationship: string; phone: string };
  };

  // Business Information
  hourlyRates: {
    essential: number;
    executive: number;
    shadow: number;
  };
  minimumEngagement: number; // minimum hours
  travelAllowance: number;

  // System Information
  isActive: boolean;
  isVerified: boolean;
  accountCreated: string;
  lastLogin: string;
  lastLocationUpdate: string;

  // Additional Metadata
  tags: string[];
  notes?: string;
  internalRating?: number; // Armora's internal assessment
}

export interface MatchingCriteria {
  principalLocation: Location;
  threatLevel: 'low' | 'medium' | 'high' | 'extreme';
  requiredSpecializations: string[];
  preferredExperience: number;
  urgency: 'immediate' | 'within_hour' | 'within_day' | 'scheduled';
  budget: 'essential' | 'executive' | 'shadow';
  duration: number; // expected hours
  timeOfDay?: 'day' | 'night' | 'overnight';
  vehicleRequired?: boolean;
  languagePreferences?: string[];
  genderPreference?: 'male' | 'female' | 'no_preference';
  securityClearanceRequired?: boolean;
}

export interface CPOSearchFilters {
  availability?: 'available_now' | 'available_today' | 'available_this_week';
  specializations?: string[];
  experienceLevel?: 'junior' | 'experienced' | 'senior' | 'elite';
  ratingMinimum?: number;
  maxHourlyRate?: number;
  hasVehicle?: boolean;
  languages?: string[];
  coverageArea?: string;
  militaryBackground?: boolean;
  policeBackground?: boolean;
  siaLevel?: 'Level_2' | 'Level_3' | 'Level_4';
}

export interface CPOMatch {
  cpo: CPOProfile;
  matchScore: number;
  matchReasons: string[];
  proximityKm: number;
  estimatedResponseTime: number;
  priceEstimate: number;
}

export interface CPOListState {
  cpos: CPOProfile[];
  filteredCpos: CPOProfile[];
  matches: CPOMatch[];
  isLoading: boolean;
  error?: string;
  sortBy: 'match_score' | 'rating' | 'experience' | 'response_time' | 'price';
  sortOrder: 'asc' | 'desc';
  activeFilters: CPOSearchFilters;
}

// Utility type for CPO creation/updates
export type CreateCPOProfile = Omit<CPOProfile, 'id' | 'rating' | 'totalAssignments' | 'completedAssignments' | 'cancelledAssignments' | 'averageResponseTime' | 'recentAssignments' | 'accountCreated' | 'lastLogin' | 'lastLocationUpdate'>;

// Utility type for CPO updates
export type UpdateCPOProfile = Partial<Pick<CPOProfile, 'availability' | 'currentLocation' | 'hourlyRates' | 'coverageAreas' | 'tags' | 'notes' | 'isActive'>>;