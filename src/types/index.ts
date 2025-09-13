// Armora Security Transport - TypeScript Interfaces

export type ViewState = 'splash' | 'welcome' | 'login' | 'signup' | 'guest-disclaimer' | 'questionnaire' | 'achievement' | 'dashboard' | 'subscription-offer' | 'trial-setup' | 'member-dashboard' | 'booking' | 'profile';

export type UserType = 'registered' | 'google' | 'guest' | null;

export interface User {
  id?: string;
  email: string;
  name?: string;
  legalName?: {
    first: string;
    last: string;
  };
  preferredName?: string;
  title?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Miss' | 'Mx.' | 'Dr.';
  nameDisplay?: 'preferred' | 'formal' | 'first';
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
  armoraValue?: string;
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

export interface LegalConfirmation {
  id: string;
  text: string;
  required: boolean;
  defaultChecked?: boolean;
  link?: string;
}

export interface ProfileSummaryCard {
  title: string;
  fields: string[];
}

export interface ServiceRecommendation {
  enabled: boolean;
  confidenceThreshold: number;
  previewFeatures: string[];
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
  isLastStep?: boolean;
  stepDescription?: string;
  processOverview?: {
    timeRequired: string;
    benefits: string[];
    securityAssurance: string;
  };
  profileSummary?: {
    showSummary: boolean;
    summaryCards: ProfileSummaryCard[];
  };
  legalConfirmations?: {
    required: LegalConfirmation[];
    optional: LegalConfirmation[];
  };
  securityStatement?: string;
  legalStatement?: string;
  serviceRecommendation?: ServiceRecommendation;
}

export interface QuestionnaireData {
  step1_transportProfile?: string;
  step2_travelFrequency?: string;
  step3_serviceRequirements?: string[];
  step4_primaryCoverage?: string[];
  step5_secondaryCoverage?: string[];
  step6_safetyContact?: {
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
  firstName?: string; // Optional name for personalization
  profileSelection?: string; // Step 1 profile selection for personalization
  nameConfirmed?: boolean; // Whether user confirmed their name via modal
  nameConfirmationTimestamp?: string; // ISO string of when name was confirmed
  skippedNameEntry?: boolean; // Whether user chose to skip name personalization
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
  subscription: UserSubscription | null;
  selectedServiceForBooking?: string;
  userProfileSelection?: string; // Step 1 profile for FloatingCTA personalization
  safeRideFundMetrics: SafeRideFundMetrics | null;
  communityImpactData: CommunityImpactData | null;
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
  scheduledDateTime?: string;
  isScheduled?: boolean;
}

export interface LocationSection {
  pickupLocation: {
    current: boolean;
    address: string;
    coordinates?: [number, number];
  };
  dropoffLocation: {
    address: string;
    coordinates?: [number, number];
  };
  journeyEstimate?: {
    distance: string;
    duration: string;
    basePrice: number;
  };
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
  scheduledDateTime?: string;
  isScheduled?: boolean;
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
  paymentIntentId?: string;
  paymentStatus?: PaymentStatus;
}

// Payment System Types
export type PaymentMethodType = 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'requires_action' | 'requires_payment_method';

export interface PaymentFlow {
  bookingDetails: BookingData;
  paymentMethod: PaymentMethodType;
  amount: number;
  currency: 'GBP';
  description: string;
  metadata: {
    serviceType: string;
    route: string;
    scheduledTime?: string;
    corporateBooking?: boolean;
    vatNumber?: string;
  };
}

export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  paymentMethod?: SavedPaymentMethod;
  lastPaymentError?: PaymentError;
}

export interface PaymentError {
  code: string;
  message: string;
  type: 'card_error' | 'network_error' | 'validation_error' | 'fraud_error';
  suggestedAction?: string;
  retryable: boolean;
}

export interface ExpressPayment {
  applePay: boolean;
  googlePay: boolean;
  payPal: boolean;
  savedCards: SavedPaymentMethod[];
}

export interface PriceBreakdown {
  basePrice: number;
  vatRate: number;
  vatAmount: number;
  discountAmount?: number;
  totalPrice: number;
  currency: 'GBP';
  description: string;
}

export interface CorporateAccount {
  id: string;
  companyName: string;
  vatNumber?: string;
  billingAddress: Address;
  paymentTerms: 'immediate' | 'net_7' | 'net_15' | 'net_30';
  creditLimit?: number;
  users: CorporateUser[];
  defaultPaymentMethod?: SavedPaymentMethod;
}

export interface CorporateUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'booker' | 'approver';
  bookingLimit?: number;
  approvalRequired: boolean;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

// Subscription System Types
export type SubscriptionTier = 'essential' | 'executive' | 'elite';
export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'cancelled' | 'expired';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  monthlyPrice: string;
  originalPrice?: number;
  discount: number;
  features: string[];
  description: string;
  isAvailable: boolean;
  isPopular?: boolean;
  trialDays?: number;
  responseTime: string;
  bookingFee: number;
  originalBookingFee: number;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trialStartDate?: Date;
  trialEndDate?: Date;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  startDate?: Date; // For Safe Ride Fund metrics calculation
  isTrialActive: boolean;
  daysRemainingInTrial?: number;
  memberBenefits: {
    discountPercentage: number;
    bookingFee: number;
    priorityBooking: boolean;
    flexibleCancellation: boolean;
    dedicatedManager?: boolean;
    responseTime: string;
  };
}

export interface PremiumInterest {
  tier: SubscriptionTier;
  userEmail: string;
  expectedUsage: string;
  timestamp: Date;
  userType: UserType;
  questionnaire?: boolean;
}

export interface NotificationData {
  type: 'premium_interest' | 'trial_signup' | 'subscription_activated';
  userEmail: string;
  tier?: SubscriptionTier;
  expectedUsage?: string;
  timestamp: Date;
  totalInterestCount?: number;
}

// Safe Ride Fund Types
export interface SafeRideFundMetrics {
  personalRidesFunded: number;
  totalContributed: number;
  currentStreak: number; // months active
  monthlyContribution: number; // £4 for Essential
  joinDate: Date;
  nextMilestone: number;
  progressToNextMilestone: number; // percentage
}

export interface CommunityImpactData {
  totalMembers: number;
  monthlyRidesFunded: number;
  totalRidesFunded: number;
  lastUpdated: Date;
}

export interface CharityPartner {
  name: string;
  description: string;
  monthlyAmount: number;
  logo?: string;
}

export interface ImpactStory {
  id: number;
  title: string;
  story: string;
  impact?: string;
  timeframe: string;
  isAnonymous?: boolean;
}