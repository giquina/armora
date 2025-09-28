// Risk Matrix Calculation Engine for Professional Close Protection
// Analyzes threat probability and impact to determine protection level requirements

export interface IRiskFactor {
  id: string;
  category: 'threat_history' | 'public_exposure' | 'travel_patterns' | 'asset_value' | 'legal_proceedings' | 'industry_risk' | 'geographic_risk';
  name: string;
  description: string;
  weight: number; // 1-5 multiplier
  isActive: boolean;
}

export interface IRiskMatrix {
  probability: 1 | 2 | 3 | 4 | 5;  // Rare → Almost Certain
  impact: 1 | 2 | 3 | 4 | 5;       // Negligible → Severe
  score: number;                    // probability × impact
  level: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  factors: IRiskFactor[];           // Contributing risk factors
  recommendations: string[];        // Service recommendations
  protectionLevel: 'Essential' | 'Executive' | 'Shadow' | 'Enhanced';
}

export interface IRiskAssessment {
  matrix: IRiskMatrix;
  confidence: number; // 0-100% confidence in assessment
  lastUpdated: Date;
  assessmentSource: 'questionnaire' | 'manual' | 'intelligence';
}

// Predefined risk factors with professional security context
export const RISK_FACTORS: IRiskFactor[] = [
  // Threat History
  {
    id: 'previous_incidents',
    category: 'threat_history',
    name: 'Previous Security Incidents',
    description: 'History of threats, harassment, or security breaches',
    weight: 5,
    isActive: false
  },
  {
    id: 'stalking_harassment',
    category: 'threat_history',
    name: 'Stalking or Harassment',
    description: 'Ongoing or recent stalking, harassment, or unwanted attention',
    weight: 4,
    isActive: false
  },
  {
    id: 'legal_threats',
    category: 'threat_history',
    name: 'Legal-Related Threats',
    description: 'Threats related to legal proceedings or business disputes',
    weight: 4,
    isActive: false
  },

  // Public Exposure
  {
    id: 'media_profile',
    category: 'public_exposure',
    name: 'High Media Profile',
    description: 'Regular media coverage, celebrity status, or public recognition',
    weight: 3,
    isActive: false
  },
  {
    id: 'social_media_presence',
    category: 'public_exposure',
    name: 'Significant Social Media Presence',
    description: 'Large following on social platforms with location sharing',
    weight: 2,
    isActive: false
  },
  {
    id: 'controversial_position',
    category: 'public_exposure',
    name: 'Controversial Public Position',
    description: 'Involvement in controversial issues or polarizing topics',
    weight: 4,
    isActive: false
  },

  // Travel Patterns
  {
    id: 'predictable_routes',
    category: 'travel_patterns',
    name: 'Predictable Travel Routes',
    description: 'Regular, predictable travel patterns that could be exploited',
    weight: 2,
    isActive: false
  },
  {
    id: 'high_risk_locations',
    category: 'travel_patterns',
    name: 'High-Risk Location Travel',
    description: 'Regular travel to areas with elevated security concerns',
    weight: 3,
    isActive: false
  },
  {
    id: 'international_travel',
    category: 'travel_patterns',
    name: 'Frequent International Travel',
    description: 'Regular international travel with varying security standards',
    weight: 2,
    isActive: false
  },

  // Asset Value
  {
    id: 'high_net_worth',
    category: 'asset_value',
    name: 'High Net Worth Individual',
    description: 'Significant personal wealth making them attractive targets',
    weight: 3,
    isActive: false
  },
  {
    id: 'valuable_possessions',
    category: 'asset_value',
    name: 'Valuable Personal Items',
    description: 'Regular transport of jewelry, art, or high-value items',
    weight: 2,
    isActive: false
  },
  {
    id: 'financial_information',
    category: 'asset_value',
    name: 'Access to Financial Information',
    description: 'Access to sensitive financial data or systems',
    weight: 3,
    isActive: false
  },

  // Legal Proceedings
  {
    id: 'active_litigation',
    category: 'legal_proceedings',
    name: 'Active Legal Proceedings',
    description: 'Currently involved in high-stakes litigation',
    weight: 3,
    isActive: false
  },
  {
    id: 'witness_testimony',
    category: 'legal_proceedings',
    name: 'Key Witness Status',
    description: 'Serving as key witness in important legal cases',
    weight: 4,
    isActive: false
  },
  {
    id: 'regulatory_issues',
    category: 'legal_proceedings',
    name: 'Regulatory Investigations',
    description: 'Subject to regulatory investigations or enforcement',
    weight: 3,
    isActive: false
  },

  // Industry Risk
  {
    id: 'high_risk_industry',
    category: 'industry_risk',
    name: 'High-Risk Industry',
    description: 'Working in industries with elevated threat levels',
    weight: 3,
    isActive: false
  },
  {
    id: 'competitive_intelligence',
    category: 'industry_risk',
    name: 'Competitive Intelligence Target',
    description: 'Likely target for corporate espionage or intelligence gathering',
    weight: 2,
    isActive: false
  },
  {
    id: 'sensitive_information',
    category: 'industry_risk',
    name: 'Access to Sensitive Information',
    description: 'Regular access to classified or highly sensitive information',
    weight: 4,
    isActive: false
  },

  // Geographic Risk
  {
    id: 'high_crime_areas',
    category: 'geographic_risk',
    name: 'High-Crime Area Operations',
    description: 'Regular operations in areas with elevated crime rates',
    weight: 2,
    isActive: false
  },
  {
    id: 'political_instability',
    category: 'geographic_risk',
    name: 'Political Instability Exposure',
    description: 'Operations in areas with political tensions or unrest',
    weight: 3,
    isActive: false
  },
  {
    id: 'remote_locations',
    category: 'geographic_risk',
    name: 'Remote Location Travel',
    description: 'Regular travel to isolated areas with limited emergency response',
    weight: 2,
    isActive: false
  }
];

// Risk level thresholds and color coding
export const RISK_LEVELS = {
  GREEN: { min: 1, max: 6, color: '#28a745', label: 'Acceptable Risk' },
  YELLOW: { min: 7, max: 12, color: '#ffc107', label: 'Elevated Risk' },
  ORANGE: { min: 13, max: 19, color: '#fd7e14', label: 'Significant Risk' },
  RED: { min: 20, max: 25, color: '#dc3545', label: 'Critical Risk' }
};

// Protection service recommendations based on risk level
export const PROTECTION_RECOMMENDATIONS = {
  GREEN: {
    service: 'Essential Protection',
    features: ['SIA Level 2 Protection Officers', 'Standard security protocols', 'Basic threat awareness'],
    description: 'Standard professional protection suitable for low-risk scenarios'
  },
  YELLOW: {
    service: 'Executive Shield',
    features: ['SIA Level 3 Protection Officers', 'Enhanced security protocols', 'Route planning', 'Communication systems'],
    description: 'Enhanced protection for elevated risk situations'
  },
  ORANGE: {
    service: 'Executive Shield / Shadow Protocol',
    features: ['SIA Close Protection Officers', 'Advanced security protocols', 'Counter-surveillance', 'Secure communications'],
    description: 'Advanced protection for significant risk scenarios'
  },
  RED: {
    service: 'Shadow Protocol + Immediate Response',
    features: ['Elite Close Protection Team', 'Maximum security protocols', 'Real-time threat monitoring', 'Emergency response coordination'],
    description: 'Maximum protection for critical risk situations requiring immediate intervention'
  }
};

// Calculate risk score based on probability and impact
export function calculateRiskScore(probability: number, impact: number): number {
  return probability * impact;
}

// Determine risk level based on score
export function getRiskLevel(score: number): 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' {
  if (score >= RISK_LEVELS.RED.min) return 'RED';
  if (score >= RISK_LEVELS.ORANGE.min) return 'ORANGE';
  if (score >= RISK_LEVELS.YELLOW.min) return 'YELLOW';
  return 'GREEN';
}

// Calculate risk assessment from questionnaire responses
export function calculateRiskFromResponses(responses: Record<string, any>): IRiskAssessment {
  const activeFactors: IRiskFactor[] = [];
  let probabilityScore = 1;
  let impactScore = 1;

  // Analyze professional profile for inherent risks
  const professionalProfile = responses.step1 || responses.professionalProfile;
  if (['celebrity', 'government', 'diplomat', 'high_profile'].includes(professionalProfile)) {
    probabilityScore += 1;
    impactScore += 1;
    activeFactors.push({
      ...RISK_FACTORS.find(f => f.id === 'media_profile')!,
      isActive: true
    });
  }

  // Analyze security requirements for risk indicators
  const securityRequirements = responses.step3 || responses.serviceRequirements || [];
  if (securityRequirements.includes('privacy_discretion')) {
    probabilityScore += 1;
    impactScore += 1;
    activeFactors.push({
      ...RISK_FACTORS.find(f => f.id === 'controversial_position')!,
      isActive: true
    });
  }

  if (securityRequirements.includes('security_awareness')) {
    probabilityScore += 1;
    activeFactors.push({
      ...RISK_FACTORS.find(f => f.id === 'previous_incidents')!,
      isActive: true
    });
  }

  // Analyze coverage areas for geographic risk
  const coverageAreas = responses.step4 || responses.primaryAreas || [];
  if (coverageAreas.includes('international_specialized')) {
    probabilityScore += 1;
    impactScore += 1;
    activeFactors.push({
      ...RISK_FACTORS.find(f => f.id === 'high_risk_locations')!,
      isActive: true
    });
  }

  // Analyze frequency for pattern predictability
  const frequency = responses.step2 || responses.travelFrequency;
  if (['daily', 'weekly'].includes(frequency)) {
    probabilityScore += 1;
    activeFactors.push({
      ...RISK_FACTORS.find(f => f.id === 'predictable_routes')!,
      isActive: true
    });
  }

  // Cap scores at maximum values
  probabilityScore = Math.min(probabilityScore, 5) as 1 | 2 | 3 | 4 | 5;
  impactScore = Math.min(impactScore, 5) as 1 | 2 | 3 | 4 | 5;

  const score = calculateRiskScore(probabilityScore, impactScore);
  const level = getRiskLevel(score);
  const recommendations = PROTECTION_RECOMMENDATIONS[level];

  const matrix: IRiskMatrix = {
    probability: probabilityScore,
    impact: impactScore,
    score,
    level,
    factors: activeFactors,
    recommendations: [recommendations.description, ...recommendations.features],
    protectionLevel: level === 'GREEN' ? 'Essential' :
                    level === 'YELLOW' ? 'Executive' :
                    level === 'ORANGE' ? 'Shadow' : 'Enhanced'
  };

  // Calculate confidence based on number of data points
  const dataPoints = Object.keys(responses).length;
  const confidence = Math.min(Math.max((dataPoints / 9) * 100, 30), 95);

  return {
    matrix,
    confidence: Math.round(confidence),
    lastUpdated: new Date(),
    assessmentSource: 'questionnaire'
  };
}

// Get risk matrix cell data for visualization
export function getRiskMatrixCells(): Array<Array<{probability: number, impact: number, score: number, level: string}>> {
  const cells = [];
  for (let probability = 1; probability <= 5; probability++) {
    const row = [];
    for (let impact = 1; impact <= 5; impact++) {
      const score = calculateRiskScore(probability, impact);
      const level = getRiskLevel(score);
      row.push({ probability, impact, score, level });
    }
    cells.push(row);
  }
  return cells;
}

// Get position coordinates for current risk level in matrix
export function getRiskPosition(assessment: IRiskAssessment): { x: number, y: number } {
  return {
    x: assessment.matrix.impact - 1,  // 0-4 for impact (columns)
    y: 5 - assessment.matrix.probability  // 0-4 for probability (rows, inverted)
  };
}

// Export comprehensive risk calculation function
export function assessRisk(factors: IRiskFactor[], manualProbability?: number, manualImpact?: number): IRiskAssessment {
  const activeFactors = factors.filter(f => f.isActive);

  // Calculate probability and impact if not manually set
  let probability = manualProbability || 1;
  let impact = manualImpact || 1;

  if (!manualProbability || !manualImpact) {
    // Calculate based on active factors
    const totalWeight = activeFactors.reduce((sum, factor) => sum + factor.weight, 0);
    const avgWeight = totalWeight / Math.max(activeFactors.length, 1);

    probability = Math.min(Math.max(Math.round(avgWeight), 1), 5) as 1 | 2 | 3 | 4 | 5;
    impact = Math.min(Math.max(Math.round(avgWeight * 0.8), 1), 5) as 1 | 2 | 3 | 4 | 5;
  }

  const score = calculateRiskScore(probability, impact);
  const level = getRiskLevel(score);
  const recommendations = PROTECTION_RECOMMENDATIONS[level];

  const matrix: IRiskMatrix = {
    probability: probability as 1 | 2 | 3 | 4 | 5,
    impact: impact as 1 | 2 | 3 | 4 | 5,
    score,
    level,
    factors: activeFactors,
    recommendations: [recommendations.description, ...recommendations.features],
    protectionLevel: level === 'GREEN' ? 'Essential' :
                    level === 'YELLOW' ? 'Executive' :
                    level === 'ORANGE' ? 'Shadow' : 'Enhanced'
  };

  return {
    matrix,
    confidence: activeFactors.length > 0 ? Math.min(activeFactors.length * 20, 95) : 50,
    lastUpdated: new Date(),
    assessmentSource: 'manual'
  };
}