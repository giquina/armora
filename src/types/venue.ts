// Venue Protection Types for Armora Close Protection Services

export interface VenueSecurityStepData {
  id: number;
  title: string;
  subtitle: string;
  question: string;
  type: 'radio' | 'checkbox' | 'slider' | 'text';
  options?: VenueSecurityOption[];
  sliderProps?: {
    min: number;
    max: number;
    step?: number;
    defaultValue: number;
    unit?: string;
  };
  placeholder?: string;
  validation?: {
    required: boolean;
    minSelections?: number;
    maxSelections?: number;
    errorMessage: string;
  };
  helpText?: string;
}

export interface VenueSecurityOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface VenueSecurityData {
  step1?: string;    // Event type
  step2?: string;    // Duration
  step3?: number;    // Attendance
  step4?: string[];  // Venue characteristics
  step5?: string[];  // Security requirements
  step6?: string[];  // Attendee profile
  step7?: string;    // Service level
  step8?: number;    // Officer count
  step9?: string;    // Additional requirements
  completedAt?: Date;
  quote?: VenueQuote;
  referenceNumber?: string;
}

export interface VenueQuote {
  officers: number;
  days: number;
  serviceLevel: string;
  dailyRate: number;
  basePrice: number;
  totalEstimate: number;
  breakdown: {
    officers: number;
    dailyRate: number;
    duration: number;
    subtotal: number;
    addons?: { [key: string]: number };
  };
  validUntil?: Date;
  terms?: string[];
}