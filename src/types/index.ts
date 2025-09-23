// Armora Security Transport - TypeScript Interfaces

// Navigation views aligned with UI terminology
export type NavigationViews = 'home' | 'services' | 'hub' | 'account';

// Complete view state including navigation and flow states
export type ViewState = 'splash' | 'welcome' | 'login' | 'signup' | 'guest-disclaimer' | 'questionnaire' | 'achievement' | 'home' | 'subscription-offer' | 'trial-setup' | 'member-dashboard' | 'services' | 'service-selection' | 'booking' | 'hub' | 'rides' | 'account' | 'venue-protection-welcome' | 'venue-security-questionnaire' | 'venue-protection-success' | 'about' | 'coverage-areas';

export type UserType = 'registered' | 'google' | 'guest' | null;

export interface User {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
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
  id: 'standard' | 'executive' | 'shadow' | 'client-vehicle' | 'venue-door-supervision' | 'venue-close-protection' | 'venue-elite-protection';
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  hourlyRate: number;
  dailyRate?: number; // For venue security services
  vehicle?: string;
  capacity?: string;
  driverQualification?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  socialProof?: {
    tripsCompleted: number;
    selectionRate?: number;
  };
  // Venue security specific properties
  venueSecurityType?: 'door_supervision' | 'close_protection' | 'elite_protection';
  officerRequirements?: {
    siaLevel: number;
    specializations: string[];
    minimumExperience: string;
  };
  suitableFor?: string[];
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

export interface CustomAnswerValue {
  type: 'custom';
  value: string;
}

export type QuestionnaireAnswer = string | string[] | CustomAnswerValue;

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
  selectedServiceForProtectionAssignment?: string;
  userProfileSelection?: string; // Step 1 profile for FloatingCTA personalization
  safeRideFundMetrics: SafeRideFundMetrics | null;
  communityImpactData: CommunityImpactData | null;
  venueProtectionData?: any; // Venue protection assessment data
  assignmentState: AssignmentState;
  isLoading: boolean;
  error: string | null;
  notifications?: INotificationItem[];
}

export interface ProtectionAssignmentStep {
  step: 'vehicle-selection' | 'location-picker' | 'protection-assignment-confirmation' | 'protection-assignment-success';
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

export interface ProtectionAssignmentData {
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

export interface ProtectionAssignmentRecord {
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
  protectionAssignmentDetails: ProtectionAssignmentData;
  paymentMethod: PaymentMethodType;
  amount: number;
  currency: 'GBP';
  description: string;
  metadata: {
    serviceType: string;
    route: string;
    scheduledTime?: string;
    corporateAssignment?: boolean;
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

// Venue Security Assessment Types
export type VenueType = 'wedding' | 'corporate' | 'private_party' | 'celebrity_event' | 'diplomatic' | 'sporting_event' | 'cultural_event' | 'religious_gathering' | 'political_event' | 'charity_gala' | 'product_launch' | 'conference' | 'other';

export type VenueCapacity = 'small' | 'medium' | 'large' | 'extra_large'; // <50, 50-200, 200-500, 500+

export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

export interface VenueSecurityAssessment {
  // Seven Ps Methodology
  people: {
    principalProfile: string; // High-profile individual, executive, celebrity, etc.
    guestListScreened: boolean;
    expectedAttendance: number;
    vipAttendees: string[];
    potentialThreats: string[];
    familyDynamics?: string; // For weddings
  };
  places: {
    venueType: VenueType;
    venueCapacity: VenueCapacity;
    indoorOutdoor: 'indoor' | 'outdoor' | 'mixed';
    entryExitPoints: number;
    emergencyExits: number;
    previousIncidents: boolean;
    securityFeatures: string[];
    accessControl: 'open' | 'controlled' | 'restricted';
  };
  personality: {
    principalCharacter: string;
    publicProfile: 'low' | 'medium' | 'high';
    mediaAttention: boolean;
    communicationStyle: string;
  };
  prejudices: {
    controversialAspects: boolean;
    targetingRisks: string[];
    discriminationThreats: boolean;
    ethnicReligiousFactors: string[];
  };
  personalHistory: {
    previousThreats: boolean;
    stalking: boolean;
    businessDisputes: boolean;
    personalConflicts: boolean;
    securityIncidents: string[];
  };
  politicalReligious: {
    politicalAffiliations: boolean;
    religiousConsiderations: boolean;
    controversialBeliefs: boolean;
    activistThreats: boolean;
  };
  privateLlifestyle: {
    socialMediaPresence: 'low' | 'medium' | 'high';
    personalRelationships: string;
    lifestyleFactors: string[];
    privacyNeeds: 'standard' | 'enhanced' | 'maximum';
  };
}

export interface VenueSecurityRequirements {
  assessmentId: string;
  venueDetails: VenueDetails;
  threatAssessment: VenueSecurityAssessment;
  serviceLevel: 'door_supervision' | 'close_protection' | 'elite_protection';
  officerCount: number;
  specialRequirements: string[];
  contractDuration: 'single_event' | 'short_term' | 'long_term';
  budget: {
    dailyRate: number;
    totalCost: number;
    currency: 'GBP';
  };
  complianceNeeds: {
    martynsLaw: boolean;
    bs8507: boolean;
    gdprCompliant: boolean;
    insuranceRequired: boolean;
  };
}

export interface VenueDetails {
  name: string;
  address: Address;
  capacity: number;
  venueType: VenueType;
  eventDate: Date;
  eventDuration: number; // hours
  setupTime: number; // hours before event
  breakdownTime: number; // hours after event
  contactPerson: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  priority: 'primary' | 'secondary' | 'tertiary';
}

export interface OfficerRequirement {
  siaLevel: 2 | 3; // Level 2 for door supervision, Level 3 for close protection
  specializations: string[];
  experience: string;
  additionalQualifications: string[];
  languageRequirements?: string[];
}

export interface VenueSecurityQuote {
  id: string;
  venueRequirements: VenueSecurityRequirements;
  serviceRecommendation: ServiceLevel;
  officerAllocation: {
    count: number;
    roles: string[];
    qualifications: OfficerRequirement[];
  };
  pricing: VenueSecurityPricing;
  complianceItems: ComplianceItem[];
  timeline: SecurityTimeline;
}

export interface VenueSecurityPricing {
  baseRate: number;
  officerCount: number;
  dailyRate: number;
  additionalCharges: {
    reconnaissance: number;
    equipment: number;
    travel: number;
    accommodation?: number;
    shortNotice?: number; // 20-30% premium
  };
  discounts: {
    weeklyContract?: number; // 10-15%
    monthlyContract?: number; // 15-20%
  };
  totalCost: number;
  currency: 'GBP';
}

export interface ComplianceItem {
  requirement: string;
  status: 'met' | 'pending' | 'not_applicable';
  documentation: string[];
  cost?: number;
}

export interface SecurityTimeline {
  reconnaissance: Date;
  briefing: Date;
  deployment: Date;
  eventStart: Date;
  eventEnd: Date;
  debrief: Date;
}

// Protection Assignment History and Personalization Types
export interface ProtectionAssignmentHistoryItem {
  id: string;
  service: string;
  serviceName: string;
  from: string;
  to: string;
  price: string;
  estimatedCost: number;
  date: string;
  time: string;
  protectionOfficer?: string;
  officerRating?: number;
  frequency: number;
  status: 'completed' | 'cancelled' | 'in-progress';
  additionalRequirements?: string;
  estimatedDistance?: number;
  estimatedDuration?: number;
  userId?: string;
}

export interface FavoriteRoute {
  id: string;
  from: string;
  to: string;
  nickname?: string;
  count: number;
  lastUsed: string;
  averagePrice: number;
  preferredService: string;
  estimatedDistance?: number;
  estimatedDuration?: number;
  isAutoFavorite: boolean;
  createdAt: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'recent' | 'frequent' | 'suggestion' | 'default';
  data?: ProtectionAssignmentHistoryItem | FavoriteRoute;
  isPersonalized: boolean;
  usageCount?: number;
  lastUsed?: string;
}

export interface PersonalizationAnalytics {
  totalProtectionAssignments: number;
  favoriteRoutes: FavoriteRoute[];
  mostUsedService: string;
  averageAssignmentValue: number;
  peakUsageTime: string;
  frequentDestinations: string[];
  assignmentPatterns: {
    weekly: Record<string, number>;
    monthly: Record<string, number>;
    seasonal: Record<string, number>;
  };
}

// Assignment and Security Types
export type AssignmentStatus = 'scheduled' | 'active' | 'in_progress' | 'completed' | 'cancelled';

export interface Assignment {
  id: string;
  clientId: string;
  officerId: string;
  serviceLevel: string;
  status: AssignmentStatus;
  startTime: string;
  estimatedEndTime: string;
  actualEndTime?: string;
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  venueProtection?: {
    enabled: boolean;
    duration: number; // hours
    requirements: string[];
  };
  additionalOptions?: {
    femaleOfficer?: boolean;
    discreteProtection?: boolean;
    shoppingAssistance?: boolean;
  };
  cost: {
    journey: number;
    venue: number;
    vehicle: number;
    total: number;
  };
  officerDetails?: {
    name: string;
    phone: string;
    vehicle: string;
    licensePlate: string;
    photo?: string;
    rating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PanicAlert {
  id: string;
  type: 'PANIC_ALERT';
  assignmentId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  officerId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    accuracy?: number;
  };
  timestamp: string;
  status: 'sent' | 'acknowledged' | 'responded' | 'resolved';
  acknowledgementTime?: string;
  responseTime?: string;
  resolutionTime?: string;
  officerNotes?: string;
  escalated?: boolean;
  escalationTime?: string;
}

export interface AssignmentState {
  currentAssignment: Assignment | null;
  hasActiveAssignment: boolean;
  activeAssignmentId: string | null;
  panicAlertSent: boolean;
  panicAlertTimestamp: Date | null;
  lastKnownLocation: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  } | null;
}

// Enhanced Booking Management Types
export interface IBookingTemplate {
  id: string;
  name: string;
  route: {
    from: string;
    to: string;
    estimatedDistance?: number;
    estimatedDuration?: number;
  };
  serviceLevel: 'essential' | 'executive' | 'shadow';
  preferredOfficer?: string;
  recurringPattern?: string;
  usageCount: number;
  lastUsed: Date;
  isDefault: boolean;
}

export interface IProtectionPackage {
  id: string;
  type: 'hours' | 'unlimited';
  hoursTotal?: number;
  hoursUsed?: number;
  hoursRemaining?: number;
  expiresAt: Date;
  autoRenew: boolean;
  discount: number;
  monthlyContribution: number;
  packageValue: number;
  status: 'active' | 'paused' | 'expired';
}

export interface IBookingFlexibility {
  tier: 'flex_plus' | 'standard' | 'fixed';
  cancellationHours: number;
  modificationAllowed: boolean;
  transferable: boolean;
  priceAdjustment: number;
  freeChanges: number;
  description: string;
}

export interface IJourneyStage {
  id: string;
  from: {
    address: string;
    coordinates?: [number, number];
  };
  to: {
    address: string;
    coordinates?: [number, number];
  };
  scheduledTime: Date;
  waitTime?: number;
  notes?: string;
  estimatedDuration: number;
  estimatedCost: number;
}

export interface IMultiStageJourney {
  id: string;
  name: string;
  stages: IJourneyStage[];
  totalDuration: number;
  totalCost: number;
  preferredOfficer?: string;
  serviceLevel: 'essential' | 'executive' | 'shadow';
  flexibility: IBookingFlexibility;
  createdAt: Date;
  isTemplate: boolean;
}

export interface IQuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'panic' | 'call' | 'chat' | 'location' | 'reschedule' | 'cancel' | 'rate' | 'receipt' | 'rebook';
  isEmergency: boolean;
  requiresConfirmation: boolean;
  action: () => void;
}

export interface IPredictiveSuggestion {
  id: string;
  type: 'calendar' | 'weather' | 'pattern' | 'traffic';
  title: string;
  description: string;
  confidence: number;
  suggestedAction: {
    type: 'book' | 'reschedule' | 'upgrade' | 'alert';
    data: any;
  };
  priority: 'low' | 'medium' | 'high';
  expiresAt: Date;
}

export interface IFinancialTracker {
  monthlyBudget: number;
  monthlySpent: number;
  remainingBudget: number;
  savingsVsStandard: number;
  loyaltyPoints: number;
  pointsValue: number;
  nextTierProgress: {
    current: string;
    next: string;
    pointsNeeded: number;
    benefits: string[];
  };
  currentMonth: {
    assignmentCount: number;
    averageValue: number;
    topRoute: string;
    peakHours: string;
  };
}

export interface IBookingManagementState {
  templates: IBookingTemplate[];
  packages: IProtectionPackage[];
  activeJourney: IMultiStageJourney | null;
  quickActions: IQuickAction[];
  predictiveSuggestions: IPredictiveSuggestion[];
  financialTracker: IFinancialTracker;
  notifications: INotificationItem[];
}

export interface INotificationItem {
  id: string;
  type: 'info' | 'warning' | 'success' | 'emergency';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  requiresAction: boolean;
  actionText?: string;
  actionHandler?: () => void;
}