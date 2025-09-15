// Martyn's Law (Terrorism Protection of Premises Act 2025) Compliance System
// UK Counter-Terrorism Security Requirements for Venues

export interface MartynsLawAssessment {
  venueId: string;
  venueName: string;
  capacity: number;
  assessmentDate: Date;
  assessor: string;
  complianceLevel: 'Enhanced' | 'Standard' | 'Not_Applicable';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  complianceStatus: 'Compliant' | 'Partially_Compliant' | 'Non_Compliant' | 'Assessment_Required';
  requirements: MartynsLawRequirement[];
  actionPlan: ComplianceAction[];
  nextReviewDate: Date;
}

export interface MartynsLawRequirement {
  id: string;
  category: 'Risk_Assessment' | 'Security_Plan' | 'Training' | 'Procedures' | 'Communication' | 'Review';
  requirement: string;
  applicableFor: 'Standard' | 'Enhanced' | 'Both';
  status: 'Met' | 'Partially_Met' | 'Not_Met' | 'Not_Applicable';
  evidence?: string[];
  deadline?: Date;
  responsible: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ComplianceAction {
  id: string;
  action: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  deadline: Date;
  responsible: string;
  cost?: number;
  status: 'Not_Started' | 'In_Progress' | 'Completed' | 'Overdue';
  dependencies?: string[];
}

export interface TerrorismRiskAssessment {
  venueProfile: VenueProfile;
  threatAssessment: ThreatAssessment;
  vulnerabilityAnalysis: VulnerabilityAnalysis;
  riskMatrix: RiskMatrix;
  mitigationMeasures: MitigationMeasure[];
  overallRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  lastUpdated: Date;
  nextReview: Date;
}

export interface VenueProfile {
  type: string;
  capacity: number;
  location: string;
  openingHours: string;
  eventTypes: string[];
  securityFeatures: string[];
  accessPoints: number;
  emergencyExits: number;
  publicProfile: 'Low' | 'Medium' | 'High';
}

export interface ThreatAssessment {
  localThreatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  specificThreats: string[];
  historicalIncidents: boolean;
  intelligenceReports: string[];
  proximityToTargets: string[];
}

export interface VulnerabilityAnalysis {
  physicalVulnerabilities: string[];
  procedureGaps: string[];
  staffingWeaknesses: string[];
  technicalVulnerabilities: string[];
  communicationGaps: string[];
}

export interface RiskMatrix {
  likelihood: 'Very_Low' | 'Low' | 'Medium' | 'High' | 'Very_High';
  impact: 'Minor' | 'Moderate' | 'Major' | 'Severe' | 'Catastrophic';
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface MitigationMeasure {
  id: string;
  measure: string;
  type: 'Preventive' | 'Detective' | 'Responsive' | 'Recovery';
  effectiveness: 'Low' | 'Medium' | 'High';
  implementationCost: 'Low' | 'Medium' | 'High';
  timeline: string;
  responsible: string;
  status: 'Proposed' | 'Approved' | 'Implemented' | 'Rejected';
}

// Martyn's Law capacity thresholds
export const MARTYNS_LAW_THRESHOLDS = {
  STANDARD_TIER: 200,     // 200-799 capacity
  ENHANCED_TIER: 800,     // 800+ capacity
  NOT_APPLICABLE: 200     // Under 200 capacity
} as const;

// Standard tier requirements (200-799 capacity)
export const STANDARD_TIER_REQUIREMENTS: Omit<MartynsLawRequirement, 'id'>[] = [
  {
    category: 'Risk_Assessment',
    requirement: 'Conduct terrorism risk assessment',
    applicableFor: 'Standard',
    status: 'Not_Met',
    responsible: 'Senior Manager',
    priority: 'High'
  },
  {
    category: 'Security_Plan',
    requirement: 'Develop written terrorism security plan',
    applicableFor: 'Standard',
    status: 'Not_Met',
    responsible: 'Senior Manager',
    priority: 'High'
  },
  {
    category: 'Procedures',
    requirement: 'Implement security procedures',
    applicableFor: 'Standard',
    status: 'Not_Met',
    responsible: 'Security Team',
    priority: 'High'
  },
  {
    category: 'Training',
    requirement: 'Provide staff terrorism awareness training',
    applicableFor: 'Standard',
    status: 'Not_Met',
    responsible: 'HR Manager',
    priority: 'Medium'
  },
  {
    category: 'Communication',
    requirement: 'Establish incident reporting procedures',
    applicableFor: 'Standard',
    status: 'Not_Met',
    responsible: 'Operations Manager',
    priority: 'Medium'
  },
  {
    category: 'Review',
    requirement: 'Annual review of security measures',
    applicableFor: 'Standard',
    status: 'Not_Met',
    responsible: 'Senior Manager',
    priority: 'Medium'
  }
];

// Enhanced tier requirements (800+ capacity)
export const ENHANCED_TIER_REQUIREMENTS: Omit<MartynsLawRequirement, 'id'>[] = [
  ...STANDARD_TIER_REQUIREMENTS.map(req => ({ ...req, applicableFor: 'Enhanced' as const })),
  {
    category: 'Risk_Assessment',
    requirement: 'Quarterly terrorism risk assessment review',
    applicableFor: 'Enhanced',
    status: 'Not_Met',
    responsible: 'Security Director',
    priority: 'High'
  },
  {
    category: 'Security_Plan',
    requirement: 'Designated terrorism security manager',
    applicableFor: 'Enhanced',
    status: 'Not_Met',
    responsible: 'Executive Team',
    priority: 'High'
  },
  {
    category: 'Training',
    requirement: 'Advanced staff counter-terrorism training',
    applicableFor: 'Enhanced',
    status: 'Not_Met',
    responsible: 'Security Director',
    priority: 'High'
  },
  {
    category: 'Procedures',
    requirement: 'Emergency response drills (quarterly)',
    applicableFor: 'Enhanced',
    status: 'Not_Met',
    responsible: 'Security Team',
    priority: 'High'
  },
  {
    category: 'Communication',
    requirement: 'Direct liaison with Counter Terrorism Police',
    applicableFor: 'Enhanced',
    status: 'Not_Met',
    responsible: 'Security Director',
    priority: 'High'
  },
  {
    category: 'Procedures',
    requirement: 'Visitor and contractor screening procedures',
    applicableFor: 'Enhanced',
    status: 'Not_Met',
    responsible: 'Security Team',
    priority: 'Medium'
  }
];

/**
 * Determine Martyn's Law compliance tier based on venue capacity
 */
export function determineComplianceTier(capacity: number): 'Enhanced' | 'Standard' | 'Not_Applicable' {
  if (capacity >= MARTYNS_LAW_THRESHOLDS.ENHANCED_TIER) {
    return 'Enhanced';
  } else if (capacity >= MARTYNS_LAW_THRESHOLDS.STANDARD_TIER) {
    return 'Standard';
  } else {
    return 'Not_Applicable';
  }
}

/**
 * Generate Martyn's Law requirements for a venue
 */
export function generateMartynsLawRequirements(capacity: number): MartynsLawRequirement[] {
  const tier = determineComplianceTier(capacity);

  if (tier === 'Not_Applicable') {
    return [];
  }

  const baseRequirements = tier === 'Enhanced' ? ENHANCED_TIER_REQUIREMENTS : STANDARD_TIER_REQUIREMENTS;

  return baseRequirements.map((req, index) => ({
    ...req,
    id: `ML-${tier.toUpperCase()}-${(index + 1).toString().padStart(3, '0')}`
  }));
}

/**
 * Conduct terrorism risk assessment
 */
export function conductTerrorismRiskAssessment(
  venueProfile: VenueProfile,
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium'
): TerrorismRiskAssessment {

  // Assess specific threats
  const specificThreats = [];
  if (venueProfile.publicProfile === 'High') {
    specificThreats.push('High-profile target for symbolic attacks');
  }
  if (venueProfile.eventTypes.includes('political') || venueProfile.eventTypes.includes('government')) {
    specificThreats.push('Political targeting risk');
  }
  if (venueProfile.capacity > 1000) {
    specificThreats.push('Mass casualty potential');
  }
  if (venueProfile.location.includes('London') || venueProfile.location.includes('Manchester')) {
    specificThreats.push('Major city targeting risk');
  }

  // Analyze vulnerabilities
  const vulnerabilities: VulnerabilityAnalysis = {
    physicalVulnerabilities: [],
    procedureGaps: [],
    staffingWeaknesses: [],
    technicalVulnerabilities: [],
    communicationGaps: []
  };

  if (venueProfile.accessPoints > 5) {
    vulnerabilities.physicalVulnerabilities.push('Multiple uncontrolled access points');
  }
  if (venueProfile.securityFeatures.length < 3) {
    vulnerabilities.physicalVulnerabilities.push('Limited physical security measures');
  }
  if (!venueProfile.securityFeatures.includes('CCTV')) {
    vulnerabilities.technicalVulnerabilities.push('No surveillance coverage');
  }
  if (!venueProfile.securityFeatures.includes('Access Control')) {
    vulnerabilities.procedureGaps.push('No formal access control procedures');
  }

  // Calculate risk matrix
  const likelihood = calculateLikelihood(venueProfile, threatLevel);
  const impact = calculateImpact(venueProfile);
  const riskScore = calculateRiskScore(likelihood, impact);
  const riskLevel = determineRiskLevel(riskScore);

  const riskMatrix: RiskMatrix = {
    likelihood,
    impact,
    riskScore,
    riskLevel
  };

  // Generate mitigation measures
  const mitigationMeasures: MitigationMeasure[] = [
    {
      id: 'MIT-001',
      measure: 'Install comprehensive CCTV system',
      type: 'Detective',
      effectiveness: 'High',
      implementationCost: 'Medium',
      timeline: '30 days',
      responsible: 'Security Manager',
      status: 'Proposed'
    },
    {
      id: 'MIT-002',
      measure: 'Implement bag screening procedures',
      type: 'Preventive',
      effectiveness: 'High',
      implementationCost: 'Low',
      timeline: '14 days',
      responsible: 'Security Team',
      status: 'Proposed'
    },
    {
      id: 'MIT-003',
      measure: 'Staff counter-terrorism awareness training',
      type: 'Preventive',
      effectiveness: 'Medium',
      implementationCost: 'Low',
      timeline: '21 days',
      responsible: 'HR Manager',
      status: 'Proposed'
    }
  ];

  if (riskLevel === 'High' || riskLevel === 'Critical') {
    mitigationMeasures.push({
      id: 'MIT-004',
      measure: 'Deploy armed security officers',
      type: 'Responsive',
      effectiveness: 'High',
      implementationCost: 'High',
      timeline: '7 days',
      responsible: 'Security Director',
      status: 'Proposed'
    });
  }

  return {
    venueProfile,
    threatAssessment: {
      localThreatLevel: threatLevel,
      specificThreats,
      historicalIncidents: false, // Would come from intelligence sources
      intelligenceReports: [],
      proximityToTargets: []
    },
    vulnerabilityAnalysis: vulnerabilities,
    riskMatrix,
    mitigationMeasures,
    overallRiskLevel: riskLevel,
    lastUpdated: new Date(),
    nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  };
}

/**
 * Calculate likelihood of terrorist attack
 */
function calculateLikelihood(
  venueProfile: VenueProfile,
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical'
): 'Very_Low' | 'Low' | 'Medium' | 'High' | 'Very_High' {
  let score = 0;

  // Base threat level
  switch (threatLevel) {
    case 'Critical': score += 4; break;
    case 'High': score += 3; break;
    case 'Medium': score += 2; break;
    case 'Low': score += 1; break;
  }

  // Venue characteristics
  if (venueProfile.publicProfile === 'High') score += 2;
  if (venueProfile.capacity > 1000) score += 1;
  if (venueProfile.eventTypes.includes('political')) score += 2;
  if (venueProfile.location.includes('London')) score += 1;

  // Convert score to likelihood
  if (score >= 8) return 'Very_High';
  if (score >= 6) return 'High';
  if (score >= 4) return 'Medium';
  if (score >= 2) return 'Low';
  return 'Very_Low';
}

/**
 * Calculate potential impact of terrorist attack
 */
function calculateImpact(venueProfile: VenueProfile): 'Minor' | 'Moderate' | 'Major' | 'Severe' | 'Catastrophic' {
  let score = 0;

  // Capacity impact
  if (venueProfile.capacity > 2000) score += 4;
  else if (venueProfile.capacity > 1000) score += 3;
  else if (venueProfile.capacity > 500) score += 2;
  else if (venueProfile.capacity > 200) score += 1;

  // Venue profile impact
  if (venueProfile.publicProfile === 'High') score += 2;
  if (venueProfile.eventTypes.includes('government')) score += 1;

  // Convert score to impact
  if (score >= 6) return 'Catastrophic';
  if (score >= 5) return 'Severe';
  if (score >= 3) return 'Major';
  if (score >= 2) return 'Moderate';
  return 'Minor';
}

/**
 * Calculate risk score from likelihood and impact
 */
function calculateRiskScore(
  likelihood: 'Very_Low' | 'Low' | 'Medium' | 'High' | 'Very_High',
  impact: 'Minor' | 'Moderate' | 'Major' | 'Severe' | 'Catastrophic'
): number {
  const likelihoodValues = {
    'Very_Low': 1,
    'Low': 2,
    'Medium': 3,
    'High': 4,
    'Very_High': 5
  };

  const impactValues = {
    'Minor': 1,
    'Moderate': 2,
    'Major': 3,
    'Severe': 4,
    'Catastrophic': 5
  };

  return likelihoodValues[likelihood] * impactValues[impact];
}

/**
 * Determine risk level from risk score
 */
function determineRiskLevel(riskScore: number): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (riskScore >= 20) return 'Critical';
  if (riskScore >= 12) return 'High';
  if (riskScore >= 6) return 'Medium';
  return 'Low';
}

/**
 * Generate compliance action plan
 */
export function generateComplianceActionPlan(
  requirements: MartynsLawRequirement[],
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
): ComplianceAction[] {
  const actions: ComplianceAction[] = [];
  const baseDate = new Date();

  requirements.forEach((req, index) => {
    if (req.status === 'Not_Met') {
      let deadline = new Date(baseDate);
      let priority: ComplianceAction['priority'] = 'Medium';

      // Set priority and deadline based on requirement and risk level
      if (req.category === 'Risk_Assessment' || req.category === 'Security_Plan') {
        priority = 'Critical';
        deadline.setDate(deadline.getDate() + 30); // 30 days for critical items
      } else if (riskLevel === 'High' || riskLevel === 'Critical') {
        priority = 'High';
        deadline.setDate(deadline.getDate() + 45); // 45 days for high-risk venues
      } else {
        priority = req.priority === 'High' ? 'High' : 'Medium';
        deadline.setDate(deadline.getDate() + 60); // 60 days for standard items
      }

      actions.push({
        id: `ACT-${(index + 1).toString().padStart(3, '0')}`,
        action: req.requirement,
        priority,
        deadline,
        responsible: req.responsible,
        status: 'Not_Started',
        cost: estimateComplianceCost(req.requirement)
      });
    }
  });

  return actions.sort((a, b) => {
    const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Estimate cost for compliance actions
 */
function estimateComplianceCost(requirement: string): number {
  const costEstimates: Record<string, number> = {
    'Conduct terrorism risk assessment': 2500,
    'Develop written terrorism security plan': 3500,
    'Implement security procedures': 5000,
    'Provide staff terrorism awareness training': 1500,
    'Establish incident reporting procedures': 1000,
    'Annual review of security measures': 2000,
    'Quarterly terrorism risk assessment review': 1500,
    'Designated terrorism security manager': 50000, // Annual salary portion
    'Advanced staff counter-terrorism training': 3000,
    'Emergency response drills (quarterly)': 2000,
    'Direct liaison with Counter Terrorism Police': 0, // No direct cost
    'Visitor and contractor screening procedures': 7500
  };

  // Find matching cost or estimate based on keywords
  for (const [key, cost] of Object.entries(costEstimates)) {
    if (requirement.toLowerCase().includes(key.toLowerCase())) {
      return cost;
    }
  }

  // Default estimate
  return 2000;
}

/**
 * Check Martyn's Law compliance status
 */
export function checkMartynsLawCompliance(assessment: MartynsLawAssessment): {
  isCompliant: boolean;
  compliancePercentage: number;
  criticalGaps: string[];
  nextActions: string[];
  deadlines: { action: string; deadline: Date; overdue: boolean }[];
} {
  const totalRequirements = assessment.requirements.length;
  const metRequirements = assessment.requirements.filter(req => req.status === 'Met').length;
  const compliancePercentage = totalRequirements > 0 ? Math.round((metRequirements / totalRequirements) * 100) : 0;

  const criticalGaps = assessment.requirements
    .filter(req => req.status === 'Not_Met' && req.priority === 'High')
    .map(req => req.requirement);

  const nextActions = assessment.actionPlan
    .filter(action => action.status === 'Not_Started')
    .slice(0, 5)
    .map(action => action.action);

  const now = new Date();
  const deadlines = assessment.actionPlan.map(action => ({
    action: action.action,
    deadline: action.deadline,
    overdue: action.deadline < now && action.status !== 'Completed'
  }));

  const isCompliant = compliancePercentage >= 100 && criticalGaps.length === 0;

  return {
    isCompliant,
    compliancePercentage,
    criticalGaps,
    nextActions,
    deadlines
  };
}

/**
 * Generate Martyn's Law compliance report
 */
export function generateComplianceReport(assessment: MartynsLawAssessment): {
  executiveSummary: string;
  complianceStatus: string;
  riskSummary: string;
  keyFindings: string[];
  recommendations: string[];
  costEstimate: number;
  timeline: string;
} {
  const compliance = checkMartynsLawCompliance(assessment);
  const totalCost = assessment.actionPlan.reduce((sum, action) => sum + (action.cost || 0), 0);

  const executiveSummary = `${assessment.venueName} (capacity: ${assessment.capacity}) falls under Martyn's Law ${assessment.complianceLevel} tier requirements. Current compliance: ${compliance.compliancePercentage}%. Risk level: ${assessment.riskLevel}.`;

  const complianceStatus = compliance.isCompliant
    ? "✅ Fully compliant with Martyn's Law requirements"
    : `⚠️ ${compliance.criticalGaps.length} critical gaps identified requiring immediate attention`;

  const riskSummary = `Terrorism risk assessed as ${assessment.riskLevel}. ${assessment.requirements.filter(r => r.status === 'Not_Met').length} security measures require implementation.`;

  const keyFindings = [
    `Compliance level: ${assessment.complianceLevel} tier (${assessment.capacity} capacity)`,
    `${compliance.compliancePercentage}% of requirements currently met`,
    `${compliance.criticalGaps.length} critical security gaps identified`,
    `${assessment.actionPlan.length} actions required for full compliance`
  ];

  const recommendations = [
    'Prioritize critical security gaps for immediate action',
    'Implement terrorism risk assessment as foundation',
    'Develop comprehensive written security plan',
    'Establish regular review and update procedures',
    ...(assessment.riskLevel === 'High' || assessment.riskLevel === 'Critical'
      ? ['Consider enhanced security measures given high risk level']
      : [])
  ];

  const timeline = assessment.actionPlan.length > 0
    ? `Estimated ${Math.ceil(assessment.actionPlan.length / 4)} months for full compliance`
    : 'No actions required - venue is compliant';

  return {
    executiveSummary,
    complianceStatus,
    riskSummary,
    keyFindings,
    recommendations,
    costEstimate: totalCost,
    timeline
  };
}