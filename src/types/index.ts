// Armora Security Transport - TypeScript Interfaces

// Navigation views aligned with UI terminology
export type NavigationViews = 'home' | 'services' | 'hub' | 'account';

// Complete view state including navigation and flow states
export type ViewState = 'splash' | 'welcome' | 'login' | 'signup' | 'guest-disclaimer' | 'questionnaire' | 'achievement' | 'home' | 'subscription-offer' | 'trial-setup' | 'member-dashboard' | 'services' | 'service-selection' | 'protection-assignment' | 'active' | 'hub' | 'Assignments' | 'account' | 'venue-protection-welcome' | 'venue-security-questionnaire' | 'venue-protection-success' | 'about' | 'coverage-areas' | 'legacy-assignment-view' | 'protection-request' | 'assignment-confirmed' | 'protection-assignment' | 'legacy-assignment-view' | 'privacy' | 'terms' | 'gdpr' | 'sia';

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
  officerQualification?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  socialProof?: {
    assignmentsCompleted: number;
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

export type QuestionnaireAnswer = string | string[] | CustomAnswerValue | ISevenPsAssessment | IEnhancedEmergencyInfo | { threatData: IThreatIndicatorData; riskAssessment: IRiskAssessment } | null;

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
  type: 'radio' | 'checkbox' | 'input' | 'textarea' | 'select' | 'location' | 'threat_assessment' | 'enhanced_emergency_contacts' | 'seven_ps_assessment';
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
  threatAssessment?: {
    enabled: boolean;
    questions: Array<{
      id: string;
      question: string;
      description: string;
      riskWeight: number;
      icon: string;
    }>;
    riskLevels: {
      GREEN: { range: [number, number]; description: string; assessmentPath: string };
      YELLOW: { range: [number, number]; description: string; assessmentPath: string };
      ORANGE: { range: [number, number]; description: string; assessmentPath: string };
      RED: { range: [number, number]; description: string; assessmentPath: string };
    };
  };
  progressiveDisclosure?: {
    triggerConditions: {
      riskLevel?: ('GREEN' | 'YELLOW' | 'ORANGE' | 'RED')[];
      professionalProfiles?: string[];
      securityRequirements?: string[];
      specialRequirements?: string[];
    };
    assessmentLevel?: 'basic' | 'standard' | 'comprehensive' | 'conditional';
    dataProtection?: {
      specialCategoryData?: boolean;
      encryptionLevel?: 'standard' | 'enhanced';
      retentionPeriod?: string;
    };
  };
}

// Threat Assessment Interfaces for Phase 1 Implementation
export interface IThreatIndicatorData {
  hasReceivedThreats: boolean;        // "Have you received any threats in the past 12 months?"
  hasPublicProfile: boolean;          // "Do you have a public profile (media, social, professional)?"
  hasLegalProceedings: boolean;       // "Are you involved in any legal proceedings?"
  hasPreviousIncidents: boolean;      // "Have you experienced security incidents before?"
  requiresInternationalProtection: boolean; // "Do you travel internationally for work?"
  hasControversialWork: boolean;      // "Does your work involve controversial decisions?"
  hasHighValueAssets: boolean;        // "Do you manage high-value assets or information?"
}

export interface IRiskAssessment {
  level: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  score: number;
  description: string;
  recommendedProtection: string;
  assessmentPath: 'standard' | 'enhanced' | 'significant' | 'critical';
  matrix: RiskMatrix;
}

// Seven Ps Framework Interfaces for Professional Close Protection Assessment
export interface IPeopleAssessment {
  family: {
    spouse?: {
      name: string;
      requiresProtection: boolean;
      riskFactors: string[];
    };
    children?: Array<{
      name: string;
      age: number;
      school?: string;
      requiresProtection: boolean;
    }>;
    requiredFamilyProtection: boolean;
  };
  associates: {
    businessPartners: string[];
    householdStaff: string[];
    regularContacts: string[];
  };
  threats: {
    knownAdversaries: string[];
    disgruntledAssociates: string[];
    stalkers: string[];
    specificThreats: string[];
  };
}

export interface IPlacesAssessment {
  residence: {
    type: 'house' | 'apartment' | 'estate' | 'other';
    securityFeatures: string[];
    vulnerabilities: string[];
    address?: string; // Optional for privacy
  };
  workplace: {
    address: string;
    accessControl: boolean;
    securityTeam: boolean;
    threatLevel: 'low' | 'medium' | 'high';
  };
  frequentLocations: Array<{
    type: string;
    address: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  travelPatterns: {
    domestic: string[];
    international: string[];
    highRiskAreas: string[];
    predictability: 'highly_predictable' | 'somewhat_predictable' | 'unpredictable';
  };
}

export interface IPersonalityAssessment {
  riskTolerance: 'low' | 'medium' | 'high';
  complianceLevel: 'excellent' | 'good' | 'challenging';
  publicInteraction: 'minimal' | 'controlled' | 'frequent';
  socialMedia: {
    platforms: string[];
    activityLevel: 'low' | 'medium' | 'high';
    controversial: boolean;
    locationSharing: boolean;
  };
  communicationStyle: 'direct' | 'diplomatic' | 'private';
}

export interface IPrejudiceAssessment {
  businessConflicts: string[];
  ideologicalOpposition: string[];
  culturalSensitivities: string[];
  publicStances: string[];
  religiousConsiderations: string[];
  politicalAffiliations: string[];
}

export interface IPersonalHistoryAssessment {
  previousIncidents: Array<{
    date: string;
    type: 'threat' | 'harassment' | 'physical' | 'cyber' | 'stalking' | 'other';
    description: string;
    outcome: string;
    ongoing: boolean;
    reportedToPolice: boolean;
  }>;
  lawEnforcement: {
    reports: boolean;
    cooperation: 'full' | 'partial' | 'none';
    restrictions: string[];
    ongoingInvestigations: boolean;
  };
  securityHistory: {
    previousSecurityTeam?: string;
    reasonForChange?: string;
    effectiveness: 'excellent' | 'good' | 'poor' | 'na';
  };
}

export interface IPoliticalAssessment {
  publicProfile: boolean;
  controversialViews: boolean;
  activism: boolean;
  oppositionGroups: string[];
  publicOffice: boolean;
  politicalExposure: 'none' | 'local' | 'national' | 'international';
  religiousLeadership: boolean;
}

export interface ILifestyleAssessment {
  highRiskActivities: string[];
  socialActivities: {
    frequency: 'rare' | 'occasional' | 'regular' | 'frequent';
    venues: string[];
    publicEvents: boolean;
  };
  healthConsiderations: {
    mobilityIssues: boolean;
    medicalEquipment: boolean;
    regularTreatments: boolean;
    emergencyProtocols: string[];
  };
  financialProfile: {
    publicWealth: boolean;
    businessOwnership: boolean;
    highValueAssets: boolean;
    financialDisputes: boolean;
  };
  travelStyle: {
    accommodation: 'budget' | 'standard' | 'luxury' | 'exclusive';
    transportation: 'public' | 'private' | 'mixed';
    scheduleFlexibility: 'rigid' | 'flexible' | 'unpredictable';
  };
}

export interface ISevenPsAssessment {
  people: IPeopleAssessment;
  places: IPlacesAssessment;
  personality: IPersonalityAssessment;
  prejudices: IPrejudiceAssessment;
  personalHistory: IPersonalHistoryAssessment;
  political: IPoliticalAssessment;
  privateLifestyle: ILifestyleAssessment;
  completionLevel: 'basic' | 'standard' | 'comprehensive';
  riskLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  assessmentDate: string;
}

export interface IEnhancedEmergencyInfo {
  nextOfKin: {
    name: string;
    relationship: string;
    primaryPhone: string;
    secondaryPhone: string;
    address: string;
    canMakeDecisions: boolean;
  };
  medicalEmergency: {
    bloodType?: string;
    criticalAllergies: string[];
    currentMedications: string[];
    medicalConditions: string[];
    emergencyProcedures: string[];
    primaryPhysician?: {
      name: string;
      phone: string;
      hospital: string;
      specialNotes: string;
    };
  };
  secondaryContact: {
    name: string;
    relationship: string;
    phone: string;
    role: 'backup' | 'business' | 'family' | 'legal';
  };
  dataConsent: {
    medicalDataConsent: boolean;
    emergencyContactConsent: boolean;
    dataProcessingConsent: boolean;
    consentTimestamp: string;
  };
  privacyLevel: 'minimal' | 'standard' | 'comprehensive';
  encryptionLevel: 'standard' | 'enhanced';
}

export interface QuestionnaireData {
  step1_transportProfile?: string;
  step2_travelFrequency?: string;
  step2_5_sevenPsAssessment?: ISevenPsAssessment; // Seven Ps framework assessment
  step2_5_threatAssessment?: IThreatIndicatorData; // New threat assessment data
  step2_5_riskAssessment?: IRiskAssessment; // Risk assessment results
  step3_serviceRequirements?: string[];
  step4_primaryCoverage?: string[];
  step5_secondaryCoverage?: string[];
  step6_safetyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  step6_emergencyContacts?: EmergencyContact[]; // Enhanced emergency contacts
  step6_enhancedEmergencyContacts?: IEnhancedEmergencyInfo; // Enhanced emergency contact data
  step7_specialRequirements?: string[];
  step7_securityHistory?: SecurityHistoryData; // New security history module
  step8_contactPreferences?: {
    email?: string;
    phone?: string;
    notifications?: string[];
  };
  step9_profileReview?: boolean;
}

// Threat Assessment Interfaces
export interface ThreatIndicator {
  id: string;
  question: string;
  category: 'personal' | 'professional' | 'operational' | 'legal' | 'security';
  riskWeight: number; // 1-3 multiplier for risk calculation
  answered?: boolean;
  value?: boolean;
}

export interface ThreatAssessmentData {
  indicators: Record<string, boolean>;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskColor: 'green' | 'yellow' | 'orange' | 'red';
  professionalMultiplier: number;
  completedAt?: Date;
}

export interface RiskMatrix {
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  score: number; // probability * impact
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  color: 'green' | 'yellow' | 'orange' | 'red';
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  hasDecisionAuthority?: boolean;
  medicalInfo?: {
    bloodType?: string;
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    physicianName?: string;
    physicianPhone?: string;
    preferredHospital?: string;
  };
}

// Enhanced Emergency Contact Information Interfaces
export interface IEnhancedEmergencyInfo {
  nextOfKin: {
    name: string;
    relationship: string;
    primaryPhone: string;
    secondaryPhone: string;
    address: string;
    canMakeDecisions: boolean;  // Medical/legal decision authority
  };

  medicalEmergency: {
    bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
    criticalAllergies?: string[];     // Life-threatening allergies
    currentMedications?: string[];     // Current medication list
    medicalConditions?: string[];      // Relevant medical conditions
    emergencyProcedures?: string[];    // Special medical procedures
    primaryPhysician?: {
      name: string;
      phone: string;
      hospital: string;
      specialNotes?: string;
    };
  };

  secondaryContact: {
    name: string;
    relationship: string;
    phone: string;
    role: 'backup' | 'business' | 'family' | 'legal';
  };

  // Data protection and consent
  dataConsent: {
    medicalDataConsent: boolean;
    emergencyContactConsent: boolean;
    dataProcessingConsent: boolean;
    consentTimestamp: string;
  };

  // Privacy settings
  privacyLevel: 'minimal' | 'standard' | 'comprehensive';
  encryptionLevel: 'standard' | 'enhanced';
}

export interface SecurityHistoryData {
  previousTeams?: string[];
  incidentHistory?: Array<{
    type: 'harassment' | 'threat' | 'physical' | 'cyber' | 'stalking';
    date: string;
    description: string;
    resolved: boolean;
    lawEnforcementInvolved: boolean;
  }>;
  threatLevel: 1 | 2 | 3 | 4 | 5;
  specialRequirements?: string[];
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
  // Enhanced threat assessment data
  threatAssessment?: ThreatAssessmentData;
  emergencyContacts?: EmergencyContact[];
  securityHistory?: SecurityHistoryData;
}

export interface FirstServiceReward {
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
  rewardType: 'first_assignment_discount';
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
  deferredPrompt?: any;
  isInstallable?: boolean;
  isInstalled?: boolean;
}

export interface AssignmentContext {
  preselectedService?: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
  source?: 'home' | 'services' | 'toolbar' | 'hamburger';
}

export interface AppState {
  currentView: ViewState;
  user: User | null;
  questionnaireData: PersonalizationData | null;
  deviceCapabilities: DeviceCapabilities;
  subscription: UserSubscription | null;
  selectedServiceForProtectionAssignment?: string;
  userProfileSelection?: string; // Step 1 profile for FloatingCTA personalization
  safeAssignmentFundMetrics: SafeAssignmentFundMetrics | null;
  communityImpactData: CommunityImpactData | null;
  venueProtectionData?: any; // Venue protection assessment data
  assignmentState: AssignmentState;
  assignmentContext: AssignmentContext | null;
  isAssignmentActive: boolean;
  isLoading: boolean;
  error: string | null;
  notifications?: INotificationItem[];
}

export interface ProtectionAssignmentStep {
  step: 'vehicle-selection' | 'location-picker' | 'protection-assignment-confirmation' | 'protection-assignment-success';
  data?: any;
}

export interface LocationData {
  commencementPoint: string;
  secureDestination: string;
  estimatedDistance?: number;
  estimatedDuration?: number;
  scheduledDateTime?: string;
  isScheduled?: boolean;
}

export interface LocationSection {
  commencementLocation: {
    current: boolean;
    address: string;
    coordinates?: [number, number];
  };
  secureDestinationLocation: {
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
  commencementPoint: string;
  secureDestination: string;
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
  commencementPoint: string;
  secureDestination: string;
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
  role: 'admin' | 'assignment-coordinator' | 'approver';
  assignmentLimit?: number;
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
  serviceFee: number;
  originalBookingFee: number;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trialStartDate?: Date;
  trialEndDate?: Date;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  startDate?: Date; // For Safe Assignment Fund metrics calculation
  isTrialActive: boolean;
  daysRemainingInTrial?: number;
  memberBenefits: {
    discountPercentage: number;
    serviceFee: number;
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

// Safe Assignment Fund Types
export interface SafeAssignmentFundMetrics {
  personalServicesFunded: number;
  totalContributed: number;
  currentStreak: number; // months active
  monthlyContribution: number; // £4 for Essential
  joinDate: Date;
  nextMilestone: number;
  progressToNextMilestone: number; // percentage
}

export interface CommunityImpactData {
  totalMembers: number;
  monthlyAssignmentsFunded: number;
  totalAssignmentsFunded: number;
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
  commencementLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  secureDestination: {
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
  type: 'panic' | 'call' | 'chat' | 'location' | 'reschedule' | 'cancel' | 'rate' | 'receipt' | 'repeat-assignment';
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
    type: 'request-protection' | 'reschedule' | 'upgrade' | 'alert';
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

// Safe Assignment Fund metrics interface
export interface SafeServiceFundMetrics {
  personalServicesFunded: number;
  totalContributed: number;
  currentStreak: number;
  monthlyContribution: number;
  impactLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  communityRank: number;
  lastUpdated: string;
}