// Armora Security Transport - TypeScript Interfaces

export type ViewState = 'splash' | 'welcome' | 'login' | 'signup' | 'guest-disclaimer' | 'questionnaire' | 'achievement' | 'dashboard' | 'booking' | 'profile';

export type UserType = 'registered' | 'google' | 'guest' | null;

export interface User {
  id?: string;
  email: string;
  name?: string;
  isAuthenticated: boolean;
  userType: UserType;
  hasCompletedQuestionnaire?: boolean;
  hasUnlockedReward?: boolean;
  createdAt?: Date;
}

export interface ServiceLevel {
  id: 'standard' | 'executive' | 'shadow';
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  hourlyRate: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  socialProof?: {
    tripsCompleted: number;
    selectionRate?: number;
  };
}

export interface QuestionnaireOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: string;
  examples?: string;
  helpText?: string;
  recommendedFor?: string[];
}

export interface SimilarClientExample {
  type: string;
  needs: string;
  service: string;
}

export interface DynamicQuestionContent {
  title: string;
  subtitle: string;
  question: string;
  helpText: string;
  options: QuestionnaireOption[];
  similarClients?: SimilarClientExample[];
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minSelections?: number;
  maxSelections?: number;
  pattern?: RegExp;
  errorMessage?: string;
}

export interface ConversionPrompt {
  title: string;
  description: string;
  actionText: string;
  benefits: string[];
}

export interface QuestionnaireStep {
  id: number;
  title: string;
  subtitle?: string;
  question: string;
  type: 'radio' | 'checkbox' | 'input' | 'textarea' | 'select' | 'location';
  options?: QuestionnaireOption[];
  placeholder?: string;
  validation: ValidationRule;
  skipForUserTypes?: UserType[];
  showConversionPrompt?: ConversionPrompt;
  helpText?: string;
  isFirstStep?: boolean;
  stepDescription?: string;
  processOverview?: {
    timeRequired: string;
    benefits: string[];
    securityAssurance: string;
  };
}

export interface QuestionnaireData {
  step1_transportProfile?: string;
  step2_travelFrequency?: string;
  step3_serviceRequirements?: string[];
  step4_primaryCoverage?: string[];
  step5_secondaryCoverage?: string[];
  step6_emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  step7_specialRequirements?: string[];
  step8_contactPreferences?: {
    email?: string;
    phone?: string;
    notifications?: string[];
  };
  step9_profileReview?: boolean;
}

export interface PersonalizationData extends QuestionnaireData {
  completedAt?: Date;
  recommendedService?: string;
  conversionAttempts?: number;
}

export interface FirstRideReward {
  userId?: string;
  rewardType: 'questionnaire_completion';
  discountCode?: string;
  discountPercentage: 50;
  maxAmount: 15; // £15 maximum
  validUntil: Date; // 30 days from unlock
  used: boolean;
  unlockDate: Date;
}

export interface RewardData {
  discountPercentage: 50;
  maxDiscountAmount: 15; // £15
  rewardType: 'first_ride_discount';
  validityPeriod: 30; // days
  terms: string[];
}

export interface AchievementUnlockProps {
  userType: UserType;
  completedQuestionnaire?: PersonalizationData;
  onContinueToDashboard: () => void;
  onCreateAccountUpgrade?: () => void; // For guests
}

export interface DeviceCapabilities {
  isOnline: boolean;
  isMobile: boolean;
  isTouch: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  supportsInstallPrompt: boolean;
}

export interface AppState {
  currentView: ViewState;
  user: User | null;
  questionnaireData: PersonalizationData | null;
  deviceCapabilities: DeviceCapabilities;
  isLoading: boolean;
  error: string | null;
}

export interface BookingStep {
  step: 'vehicle-selection' | 'location-picker' | 'booking-confirmation' | 'booking-success';
  data?: any;
}

export interface LocationData {
  pickup: string;
  destination: string;
  estimatedDistance?: number;
  estimatedDuration?: number;
}

export interface BookingData {
  service: ServiceLevel;
  pickup: string;
  destination: string;
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedCost: number;
  additionalRequirements?: string;
  user: User | null;
}

export interface BookingRecord {
  id: string;
  userId?: string;
  service: string;
  pickup: string;
  destination: string;
  estimatedCost: number;
  additionalRequirements?: string;
  createdAt: Date;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
}