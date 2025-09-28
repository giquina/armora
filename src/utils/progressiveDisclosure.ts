// Progressive Disclosure Utility for Professional Close Protection Assessment
// Determines assessment modules based on risk levels and user responses

import { QuestionnaireStep } from '../types';
import { calculateRiskFromResponses } from './riskCalculator';

// Assessment path configuration based on risk level
export interface AssessmentPath {
  riskLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  assessmentType: 'standard' | 'enhanced' | 'significant' | 'critical';
  questionCount: number;
  requiresSevenPs: boolean;
  sevenPsLevel: 'basic' | 'standard' | 'comprehensive';
  requiresEnhancedEmergencyContacts: boolean;
  requiresMedicalData: boolean;
  requiredModules: string[];
  additionalSteps: number[];
}

// Risk-based assessment configuration
export const ASSESSMENT_PATHS: Record<string, AssessmentPath> = {
  GREEN: {
    riskLevel: 'GREEN',
    assessmentType: 'standard',
    questionCount: 7,
    requiresSevenPs: false,
    sevenPsLevel: 'basic',
    requiresEnhancedEmergencyContacts: false,
    requiresMedicalData: false,
    requiredModules: ['basic_questionnaire', 'emergency_contacts'],
    additionalSteps: []
  },
  YELLOW: {
    riskLevel: 'YELLOW',
    assessmentType: 'enhanced',
    questionCount: 12,
    requiresSevenPs: true,
    sevenPsLevel: 'basic',
    requiresEnhancedEmergencyContacts: true,
    requiresMedicalData: false,
    requiredModules: ['enhanced_questionnaire', 'seven_ps_basic', 'enhanced_emergency_contacts'],
    additionalSteps: [6.5, 7.5] // Enhanced emergency contacts, Seven Ps basic
  },
  ORANGE: {
    riskLevel: 'ORANGE',
    assessmentType: 'significant',
    questionCount: 18,
    requiresSevenPs: true,
    sevenPsLevel: 'standard',
    requiresEnhancedEmergencyContacts: true,
    requiresMedicalData: true,
    requiredModules: ['significant_questionnaire', 'seven_ps_standard', 'enhanced_emergency_contacts', 'medical_data'],
    additionalSteps: [6.5, 7.5, 8.5] // Enhanced emergency contacts, Seven Ps standard, Medical data
  },
  RED: {
    riskLevel: 'RED',
    assessmentType: 'critical',
    questionCount: 25,
    requiresSevenPs: true,
    sevenPsLevel: 'comprehensive',
    requiresEnhancedEmergencyContacts: true,
    requiresMedicalData: true,
    requiredModules: ['comprehensive_questionnaire', 'seven_ps_comprehensive', 'enhanced_emergency_contacts', 'medical_data', 'threat_analysis'],
    additionalSteps: [6.5, 7.5, 8.5, 9.5] // All enhanced modules plus threat analysis
  }
};

// Professional categories with inherent risk levels
export const PROFESSIONAL_RISK_MAPPING: Record<string, number> = {
  'celebrity': 4,
  'government': 4,
  'diplomat': 5,
  'high_profile': 5,
  'security': 3,
  'legal': 3,
  'finance': 2,
  'executive': 2,
  'entrepreneur': 2,
  'medical': 1,
  'academic': 1,
  'student': 1,
  'general': 1,
  'family': 1,
  'athlete': 3,
  'creative': 1,
  'international_visitor': 2,
  'prefer_not_to_say': 2
};

// Security requirement risk indicators
export const SECURITY_REQUIREMENT_RISK_WEIGHTS: Record<string, number> = {
  'privacy_discretion': 3,
  'security_awareness': 4,
  'trained_professionals': 2,
  'real_time_tracking': 2,
  'route_knowledge': 1,
  'flexibility_coverage': 2,
  'specialized_needs': 2,
  'professional_service': 1,
  'premium_comfort': 1,
  'reliability_tracking': 1,
  'communication_skills': 1,
  'payment_flexibility': 1,
  'multi_city_coverage': 2
};

// Geographic risk factors
export const GEOGRAPHIC_RISK_WEIGHTS: Record<string, number> = {
  'international_specialized': 4,
  'scotland_wales': 2,
  'healthcare_professional': 1,
  'airport_transfers': 2,
  'premium_shopping': 1,
  'government_quarter': 3,
  'financial_district': 2,
  'central_london': 1,
  'west_end': 1,
  'greater_london': 1,
  'tourist_destinations': 1,
  'entertainment_events': 1,
  'university_business_towns': 1
};

/**
 * Determine the appropriate assessment path based on user responses
 */
export function determineAssessmentPath(responses: Record<string, any>): AssessmentPath {
  const riskAssessment = calculateRiskFromResponses(responses);
  const riskLevel = riskAssessment.matrix.level;

  // Get base assessment path
  let assessmentPath = { ...ASSESSMENT_PATHS[riskLevel] };

  // Apply progressive disclosure rules based on specific responses
  const professionalProfile = responses.step1 || responses.professionalProfile;
  const securityRequirements = responses.step3 || responses.serviceRequirements || [];
  const threatAssessment = responses.step2_5 || responses.threatAssessment;

  // Enhanced assessment triggers
  if (shouldTriggerEnhancedAssessment(professionalProfile, securityRequirements, threatAssessment)) {
    assessmentPath = escalateAssessmentPath(assessmentPath);
  }

  return assessmentPath;
}

/**
 * Get required modules for an assessment path
 */
export function getRequiredModules(assessmentPath: AssessmentPath): string[] {
  return assessmentPath.requiredModules;
}

/**
 * Determine if Seven Ps framework is required
 */
export function shouldShowSevenPs(riskLevel: string, professionalProfile: string): boolean {
  const assessmentPath = ASSESSMENT_PATHS[riskLevel];
  if (!assessmentPath) return false;

  // Always show for high-risk professional profiles
  const highRiskProfiles = ['celebrity', 'government', 'diplomat', 'high_profile', 'security'];
  if (highRiskProfiles.includes(professionalProfile)) {
    return true;
  }

  return assessmentPath.requiresSevenPs;
}

/**
 * Get Seven Ps assessment level based on risk
 */
export function getSevenPsAssessmentLevel(riskLevel: string): 'basic' | 'standard' | 'comprehensive' {
  const assessmentPath = ASSESSMENT_PATHS[riskLevel];
  return assessmentPath?.sevenPsLevel || 'basic';
}

/**
 * Determine if enhanced emergency contacts are required
 */
export function shouldShowEnhancedEmergencyContacts(riskLevel: string): boolean {
  const assessmentPath = ASSESSMENT_PATHS[riskLevel];
  return assessmentPath?.requiresEnhancedEmergencyContacts || false;
}

/**
 * Calculate progressive questionnaire steps based on user responses
 */
export function calculateProgressiveSteps(userResponses: Record<string, any>): QuestionnaireStep[] {
  const assessmentPath = determineAssessmentPath(userResponses);
  const baseSteps = getBaseQuestionnaireSteps();

  // Add progressive steps based on assessment path
  const progressiveSteps = [...baseSteps];

  // Add enhanced emergency contacts step
  if (assessmentPath.requiresEnhancedEmergencyContacts) {
    progressiveSteps.splice(6, 0, createEnhancedEmergencyContactsStep());
  }

  // Add Seven Ps assessment step
  if (assessmentPath.requiresSevenPs) {
    progressiveSteps.splice(-2, 0, createSevenPsAssessmentStep(assessmentPath.sevenPsLevel));
  }

  // Add medical data collection step for high-risk assessments
  if (assessmentPath.requiresMedicalData) {
    progressiveSteps.splice(-1, 0, createMedicalDataStep());
  }

  return progressiveSteps;
}

/**
 * Check if enhanced assessment should be triggered
 */
function shouldTriggerEnhancedAssessment(
  professionalProfile: string,
  securityRequirements: string[],
  threatAssessment?: IThreatIndicatorData
): boolean {
  // High-risk professional profiles
  const highRiskProfiles = ['celebrity', 'government', 'diplomat', 'high_profile'];
  if (highRiskProfiles.includes(professionalProfile)) {
    return true;
  }

  // Security-focused requirements
  const highSecurityRequirements = ['privacy_discretion', 'security_awareness'];
  if (securityRequirements.some(req => highSecurityRequirements.includes(req))) {
    return true;
  }

  // Threat assessment indicators
  if (threatAssessment) {
    const threatIndicators = [
      threatAssessment.hasReceivedThreats,
      threatAssessment.hasLegalProceedings,
      threatAssessment.hasPreviousIncidents,
      threatAssessment.hasControversialWork
    ];

    // If any significant threat indicators are present
    if (threatIndicators.some(indicator => indicator)) {
      return true;
    }
  }

  return false;
}

/**
 * Escalate assessment path to higher security level
 */
function escalateAssessmentPath(currentPath: AssessmentPath): AssessmentPath {
  const riskLevels = ['GREEN', 'YELLOW', 'ORANGE', 'RED'];
  const currentIndex = riskLevels.indexOf(currentPath.riskLevel);

  if (currentIndex < riskLevels.length - 1) {
    const nextLevel = riskLevels[currentIndex + 1];
    return { ...ASSESSMENT_PATHS[nextLevel] };
  }

  return currentPath;
}

/**
 * Get base questionnaire steps (standard 9-step flow)
 */
function getBaseQuestionnaireSteps(): QuestionnaireStep[] {
  // Import from questionnaireData to get base steps
  // This would be the standard 9-step questionnaire
  return [
    { id: 1, title: "Professional Profile", type: "radio" } as QuestionnaireStep,
    { id: 2, title: "Protection Frequency", type: "radio" } as QuestionnaireStep,
    { id: 2.5, title: "Security Risk Assessment", type: "threat_assessment" } as QuestionnaireStep,
    { id: 3, title: "Security Requirements", type: "checkbox" } as QuestionnaireStep,
    { id: 4, title: "Protection Coverage Areas", type: "checkbox" } as QuestionnaireStep,
    { id: 5, title: "Specialized Venues", type: "checkbox" } as QuestionnaireStep,
    { id: 6, title: "Emergency Contact Information", type: "input" } as QuestionnaireStep,
    { id: 7, title: "Protection Accommodations", type: "checkbox" } as QuestionnaireStep,
    { id: 8, title: "Contact Preferences", type: "checkbox" } as QuestionnaireStep,
    { id: 9, title: "Protection Profile Review", type: "radio" } as QuestionnaireStep
  ];
}

/**
 * Create enhanced emergency contacts step
 */
function createEnhancedEmergencyContactsStep(): QuestionnaireStep {
  return {
    id: 6.5,
    title: "Enhanced Emergency Contacts",
    subtitle: "Comprehensive emergency contact information",
    question: "Please provide detailed emergency contact information for enhanced security protocols.",
    type: "enhanced_emergency_contacts",
    validation: { required: true, errorMessage: "Enhanced emergency contacts are required for your security level" },
    helpText: "Enhanced security protocols require comprehensive emergency contact information including primary, secondary, and medical contacts.",
    stepDescription: "Your security assessment requires enhanced emergency contact protocols. This ensures we can coordinate appropriate response and communication during any security situations."
  };
}

/**
 * Create Seven Ps assessment step
 */
function createSevenPsAssessmentStep(level: 'basic' | 'standard' | 'comprehensive'): QuestionnaireStep {
  const titles = {
    basic: "Basic Security Assessment (Seven Ps)",
    standard: "Standard Security Assessment (Seven Ps)",
    comprehensive: "Comprehensive Security Assessment (Seven Ps)"
  };

  const descriptions = {
    basic: "Basic Seven Ps security framework assessment covering essential protection elements.",
    standard: "Standard Seven Ps security framework assessment for enhanced protection planning.",
    comprehensive: "Comprehensive Seven Ps security framework assessment for maximum protection protocols."
  };

  return {
    id: 7.5,
    title: titles[level],
    subtitle: "Professional security planning framework",
    question: `Complete the ${level} Seven Ps security assessment to optimize your protection protocols.`,
    type: "checkbox",
    validation: { required: true, errorMessage: "Seven Ps assessment is required for your security level" },
    helpText: descriptions[level],
    stepDescription: "The Seven Ps framework (Planning, Preparation, People, Procedures, Premises, Perimeter, Physical Protection) ensures comprehensive security assessment for professional close protection services."
  };
}

/**
 * Create medical data collection step
 */
function createMedicalDataStep(): QuestionnaireStep {
  return {
    id: 8.5,
    title: "Medical Information",
    subtitle: "Critical medical information for emergency response",
    question: "Please provide medical information necessary for emergency response protocols.",
    type: "input",
    validation: { required: true, errorMessage: "Medical information is required for critical security assessments" },
    helpText: "Critical security assessments require medical information to ensure appropriate emergency response and medical coordination during protection services.",
    stepDescription: "Your security level requires medical information for emergency response protocols. This ensures our Protection Officers and emergency services can provide appropriate care if needed."
  };
}

/**
 * Check if user should see medical data collection
 */
export function shouldShowMedicalData(riskLevel: string): boolean {
  const assessmentPath = ASSESSMENT_PATHS[riskLevel];
  return assessmentPath?.requiresMedicalData || false;
}

/**
 * Get total steps for progressive assessment
 */
export function getTotalProgressiveSteps(userResponses: Record<string, any>): number {
  const assessmentPath = determineAssessmentPath(userResponses);
  return 9 + assessmentPath.additionalSteps.length;
}

/**
 * Calculate risk score from questionnaire responses for progressive disclosure
 */
export function calculateProgressiveRiskScore(responses: Record<string, any>): number {
  let riskScore = 0;

  // Professional profile risk
  const professionalProfile = responses.step1 || responses.professionalProfile;
  riskScore += PROFESSIONAL_RISK_MAPPING[professionalProfile] || 1;

  // Security requirements risk
  const securityRequirements = responses.step3 || responses.serviceRequirements || [];
  securityRequirements.forEach((req: string) => {
    riskScore += SECURITY_REQUIREMENT_RISK_WEIGHTS[req] || 0;
  });

  // Geographic risk
  const coverageAreas = responses.step4 || responses.primaryAreas || [];
  coverageAreas.forEach((area: string) => {
    riskScore += GEOGRAPHIC_RISK_WEIGHTS[area] || 0;
  });

  // Threat assessment risk
  const threatAssessment = responses.step2_5 || responses.threatAssessment;
  if (threatAssessment) {
    const threatIndicators = [
      threatAssessment.hasReceivedThreats ? 5 : 0,
      threatAssessment.hasLegalProceedings ? 4 : 0,
      threatAssessment.hasPreviousIncidents ? 4 : 0,
      threatAssessment.hasPublicProfile ? 3 : 0,
      threatAssessment.requiresInternationalProtection ? 3 : 0,
      threatAssessment.hasControversialWork ? 3 : 0,
      threatAssessment.hasHighValueAssets ? 2 : 0
    ];

    riskScore += threatIndicators.reduce((sum, score) => sum + score, 0);
  }

  return riskScore;
}

/**
 * Get protection level recommendation based on progressive assessment
 */
export function getProtectionLevelRecommendation(assessmentPath: AssessmentPath): string {
  const protectionLevels = {
    standard: 'Essential Protection',
    enhanced: 'Executive Shield',
    significant: 'Shadow Protocol',
    critical: 'Shadow Protocol + Enhanced Response'
  };

  return protectionLevels[assessmentPath.assessmentType] || 'Essential Protection';
}

/**
 * Determine if assessment requires immediate security consultation
 */
export function requiresSecurityConsultation(assessmentPath: AssessmentPath): boolean {
  return assessmentPath.riskLevel === 'RED' || assessmentPath.assessmentType === 'critical';
}

// Export default assessment configuration
const progressiveDisclosureConfig = {
  determineAssessmentPath,
  getRequiredModules,
  shouldShowSevenPs,
  getSevenPsAssessmentLevel,
  shouldShowEnhancedEmergencyContacts,
  calculateProgressiveSteps,
  shouldShowMedicalData,
  getTotalProgressiveSteps,
  calculateProgressiveRiskScore,
  getProtectionLevelRecommendation,
  requiresSecurityConsultation,
  ASSESSMENT_PATHS,
  PROFESSIONAL_RISK_MAPPING,
  SECURITY_REQUIREMENT_RISK_WEIGHTS,
  GEOGRAPHIC_RISK_WEIGHTS
};

export default progressiveDisclosureConfig;