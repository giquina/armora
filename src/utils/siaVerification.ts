// SIA (Security Industry Authority) Certification Verification System
// UK Security Industry Authority License Verification

export interface SIALicense {
  licenseNumber: string;
  licenseType: 'Level_2_Door_Supervision' | 'Level_3_Close_Protection' | 'Level_2_Security_Guarding' | 'Level_2_CCTV' | 'Level_2_Cash_Transit';
  holderName: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'Active' | 'Expired' | 'Suspended' | 'Revoked' | 'Pending';
  endorsements?: string[];
  additionalQualifications?: string[];
}

export interface SIAVerificationResult {
  isValid: boolean;
  licenseDetails?: SIALicense;
  errors: string[];
  warnings: string[];
  verificationLevel: 'Basic' | 'Enhanced' | 'Full';
  verificationDate: Date;
  nextCheckDue: Date;
}

export interface OfficerProfile {
  name: string;
  siaLicense: SIALicense;
  additionalCertifications: AdditionalCertification[];
  experienceLevel: 'Entry' | 'Standard' | 'Experienced' | 'Expert' | 'Elite';
  specializations: string[];
  backgroundChecks: BackgroundCheck[];
  insuranceStatus: InsuranceStatus;
  availabilityStatus: 'Available' | 'Booked' | 'Unavailable' | 'On_Leave';
}

export interface AdditionalCertification {
  name: string;
  issuingBody: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate?: Date;
  level?: string;
}

export interface BackgroundCheck {
  type: 'Basic_DBS' | 'Enhanced_DBS' | 'Enhanced_DBS_Barred' | 'Security_Clearance';
  level?: 'SC' | 'DV' | 'Enhanced' | 'Standard';
  issueDate: Date;
  expiryDate?: Date;
  status: 'Current' | 'Expired' | 'Pending' | 'Not_Required';
  certificateNumber?: string;
}

export interface InsuranceStatus {
  professionalIndemnity: {
    provider: string;
    coverageAmount: number;
    expiryDate: Date;
    policyNumber: string;
  };
  publicLiability: {
    provider: string;
    coverageAmount: number;
    expiryDate: Date;
    policyNumber: string;
  };
  employersLiability?: {
    provider: string;
    coverageAmount: number;
    expiryDate: Date;
    policyNumber: string;
  };
}

// SIA License validation patterns
const SIA_LICENSE_PATTERNS = {
  DOOR_SUPERVISION: /^DS\d{8}$/,
  CLOSE_PROTECTION: /^CP\d{8}$/,
  SECURITY_GUARDING: /^SG\d{8}$/,
  CCTV: /^CC\d{8}$/,
  CASH_TRANSIT: /^CT\d{8}$/
};

// Required certifications for different service levels
export const CERTIFICATION_REQUIREMENTS = {
  DOOR_SUPERVISION: {
    siaLevel: 2,
    requiredCertifications: ['SIA Level 2 Door Supervision'],
    recommendedCertifications: ['Conflict Management', 'Physical Intervention'],
    minimumExperience: 1, // years
    dbsLevel: 'Enhanced_DBS'
  },
  CLOSE_PROTECTION: {
    siaLevel: 3,
    requiredCertifications: ['SIA Level 3 Close Protection'],
    recommendedCertifications: ['First Aid at Work', 'Defensive Driving', 'Surveillance Awareness'],
    minimumExperience: 3, // years
    dbsLevel: 'Enhanced_DBS'
  },
  ELITE_PROTECTION: {
    siaLevel: 3,
    requiredCertifications: ['SIA Level 3 Close Protection'],
    recommendedCertifications: [
      'Military/Police Background',
      'Advanced Tactical Training',
      'Counter-Surveillance',
      'Emergency Medical Training',
      'Advanced Driving'
    ],
    minimumExperience: 5, // years
    dbsLevel: 'Enhanced_DBS',
    additionalRequirements: ['Military/Police Service', 'Specialized Training']
  }
} as const;

/**
 * Validate SIA license number format
 */
export function validateSIALicenseFormat(licenseNumber: string, licenseType: string): boolean {
  const cleanLicense = licenseNumber.replace(/\s/g, '').toUpperCase();

  switch (licenseType) {
    case 'Level_2_Door_Supervision':
      return SIA_LICENSE_PATTERNS.DOOR_SUPERVISION.test(cleanLicense);
    case 'Level_3_Close_Protection':
      return SIA_LICENSE_PATTERNS.CLOSE_PROTECTION.test(cleanLicense);
    case 'Level_2_Security_Guarding':
      return SIA_LICENSE_PATTERNS.SECURITY_GUARDING.test(cleanLicense);
    case 'Level_2_CCTV':
      return SIA_LICENSE_PATTERNS.CCTV.test(cleanLicense);
    case 'Level_2_Cash_Transit':
      return SIA_LICENSE_PATTERNS.CASH_TRANSIT.test(cleanLicense);
    default:
      return false;
  }
}

/**
 * Mock SIA license verification (in production, this would connect to SIA database)
 */
export function verifySIALicense(licenseNumber: string): Promise<SIAVerificationResult> {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const cleanLicense = licenseNumber.replace(/\s/g, '').toUpperCase();
      const errors: string[] = [];
      const warnings: string[] = [];

      // Basic format validation
      const isValidFormat = Object.values(SIA_LICENSE_PATTERNS).some(pattern =>
        pattern.test(cleanLicense)
      );

      if (!isValidFormat) {
        errors.push('Invalid SIA license number format');
        resolve({
          isValid: false,
          errors,
          warnings,
          verificationLevel: 'Basic',
          verificationDate: new Date(),
          nextCheckDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
        return;
      }

      // Mock license data (in production, this would come from SIA API)
      const mockLicense: SIALicense = {
        licenseNumber: cleanLicense,
        licenseType: cleanLicense.startsWith('CP') ? 'Level_3_Close_Protection' :
                    cleanLicense.startsWith('DS') ? 'Level_2_Door_Supervision' :
                    'Level_2_Security_Guarding',
        holderName: 'John Smith', // Would come from SIA database
        issueDate: new Date('2021-01-15'),
        expiryDate: new Date('2024-01-15'),
        status: 'Active',
        endorsements: ['First Aid at Work', 'Conflict Management'],
        additionalQualifications: ['Advanced Driving Certificate']
      };

      // Check expiry date
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (mockLicense.expiryDate < now) {
        errors.push('SIA license has expired');
        mockLicense.status = 'Expired';
      } else if (mockLicense.expiryDate < thirtyDaysFromNow) {
        warnings.push('SIA license expires within 30 days - renewal required');
      }

      resolve({
        isValid: errors.length === 0,
        licenseDetails: mockLicense,
        errors,
        warnings,
        verificationLevel: 'Enhanced',
        verificationDate: new Date(),
        nextCheckDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      });
    }, 1000); // Simulate 1 second API call
  });
}

/**
 * Verify officer meets service requirements
 */
export function verifyOfficerRequirements(
  officer: OfficerProfile,
  serviceType: keyof typeof CERTIFICATION_REQUIREMENTS
): { meets: boolean; missing: string[]; recommendations: string[] } {
  const requirements = CERTIFICATION_REQUIREMENTS[serviceType];
  const missing: string[] = [];
  const recommendations: string[] = [];

  // Check SIA level
  const siaLevel = officer.siaLicense.licenseType.includes('Level_3') ? 3 : 2;
  if (siaLevel < requirements.siaLevel) {
    missing.push(`SIA Level ${requirements.siaLevel} license required`);
  }

  // Check required certifications
  const officerCertNames = officer.additionalCertifications.map(cert => cert.name);
  requirements.requiredCertifications.forEach(required => {
    if (!officerCertNames.some(cert => cert.includes(required))) {
      missing.push(required);
    }
  });

  // Check DBS level
  const hasRequiredDBS = officer.backgroundChecks.some(check =>
    check.type === requirements.dbsLevel && check.status === 'Current'
  );
  if (!hasRequiredDBS) {
    missing.push(`${requirements.dbsLevel.replace('_', ' ')} check required`);
  }

  // Check recommended certifications
  requirements.recommendedCertifications.forEach(recommended => {
    if (!officerCertNames.some(cert => cert.includes(recommended))) {
      recommendations.push(`Consider obtaining: ${recommended}`);
    }
  });

  // Check additional requirements for elite protection
  if (serviceType === 'ELITE_PROTECTION') {
    const hasMilitaryBackground = officer.specializations.some(spec =>
      spec.includes('Military') || spec.includes('Police') || spec.includes('Armed Forces')
    );
    if (!hasMilitaryBackground) {
      missing.push('Military or Police background required for Elite Protection');
    }
  }

  return {
    meets: missing.length === 0,
    missing,
    recommendations
  };
}

/**
 * Calculate officer verification score
 */
export function calculateVerificationScore(officer: OfficerProfile): {
  score: number;
  maxScore: number;
  breakdown: { category: string; score: number; maxScore: number; details: string }[];
} {
  const breakdown = [];
  let totalScore = 0;
  let maxTotalScore = 0;

  // SIA License (30 points)
  let siaScore = 0;
  const siaMax = 30;
  if (officer.siaLicense.status === 'Active') {
    siaScore += 20;
    if (officer.siaLicense.licenseType.includes('Level_3')) {
      siaScore += 10;
    } else if (officer.siaLicense.licenseType.includes('Level_2')) {
      siaScore += 5;
    }
  }
  breakdown.push({
    category: 'SIA License',
    score: siaScore,
    maxScore: siaMax,
    details: `${officer.siaLicense.licenseType} - ${officer.siaLicense.status}`
  });
  totalScore += siaScore;
  maxTotalScore += siaMax;

  // Background Checks (25 points)
  let dbsScore = 0;
  const dbsMax = 25;
  const currentDBS = officer.backgroundChecks.filter(check => check.status === 'Current');
  currentDBS.forEach(check => {
    switch (check.type) {
      case 'Enhanced_DBS_Barred':
        dbsScore += 15;
        break;
      case 'Enhanced_DBS':
        dbsScore += 12;
        break;
      case 'Basic_DBS':
        dbsScore += 8;
        break;
      case 'Security_Clearance':
        dbsScore += 10;
        break;
    }
  });
  dbsScore = Math.min(dbsScore, dbsMax);
  breakdown.push({
    category: 'Background Checks',
    score: dbsScore,
    maxScore: dbsMax,
    details: `${currentDBS.length} current checks`
  });
  totalScore += dbsScore;
  maxTotalScore += dbsMax;

  // Experience Level (20 points)
  let experienceScore = 0;
  const experienceMax = 20;
  switch (officer.experienceLevel) {
    case 'Elite':
      experienceScore = 20;
      break;
    case 'Expert':
      experienceScore = 16;
      break;
    case 'Experienced':
      experienceScore = 12;
      break;
    case 'Standard':
      experienceScore = 8;
      break;
    case 'Entry':
      experienceScore = 4;
      break;
  }
  breakdown.push({
    category: 'Experience Level',
    score: experienceScore,
    maxScore: experienceMax,
    details: officer.experienceLevel
  });
  totalScore += experienceScore;
  maxTotalScore += experienceMax;

  // Additional Certifications (15 points)
  const certScore = Math.min(officer.additionalCertifications.length * 3, 15);
  breakdown.push({
    category: 'Additional Certifications',
    score: certScore,
    maxScore: 15,
    details: `${officer.additionalCertifications.length} certifications`
  });
  totalScore += certScore;
  maxTotalScore += 15;

  // Insurance Status (10 points)
  let insuranceScore = 0;
  const insuranceMax = 10;
  const now = new Date();
  if (officer.insuranceStatus.professionalIndemnity.expiryDate > now) {
    insuranceScore += 4;
  }
  if (officer.insuranceStatus.publicLiability.expiryDate > now) {
    insuranceScore += 4;
  }
  if (officer.insuranceStatus.employersLiability?.expiryDate &&
      officer.insuranceStatus.employersLiability.expiryDate > now) {
    insuranceScore += 2;
  }
  breakdown.push({
    category: 'Insurance Status',
    score: insuranceScore,
    maxScore: insuranceMax,
    details: 'Current insurance coverage'
  });
  totalScore += insuranceScore;
  maxTotalScore += insuranceMax;

  return {
    score: totalScore,
    maxScore: maxTotalScore,
    breakdown
  };
}

/**
 * Generate compliance report for venue security deployment
 */
export function generateComplianceReport(officers: OfficerProfile[], serviceType: keyof typeof CERTIFICATION_REQUIREMENTS): {
  overallCompliance: boolean;
  officerResults: Array<{
    officer: string;
    compliant: boolean;
    issues: string[];
    score: number;
  }>;
  teamSummary: {
    totalOfficers: number;
    compliantOfficers: number;
    averageScore: number;
    criticalIssues: string[];
  };
} {
  const officerResults = officers.map(officer => {
    const requirements = verifyOfficerRequirements(officer, serviceType);
    const verification = calculateVerificationScore(officer);

    return {
      officer: officer.name,
      compliant: requirements.meets,
      issues: requirements.missing,
      score: Math.round((verification.score / verification.maxScore) * 100)
    };
  });

  const compliantOfficers = officerResults.filter(result => result.compliant).length;
  const averageScore = Math.round(
    officerResults.reduce((sum, result) => sum + result.score, 0) / officers.length
  );

  const criticalIssues: string[] = [];
  officerResults.forEach(result => {
    result.issues.forEach(issue => {
      if (!criticalIssues.includes(issue)) {
        criticalIssues.push(issue);
      }
    });
  });

  return {
    overallCompliance: compliantOfficers === officers.length,
    officerResults,
    teamSummary: {
      totalOfficers: officers.length,
      compliantOfficers,
      averageScore,
      criticalIssues
    }
  };
}

/**
 * Check insurance adequacy for venue security
 */
export function verifyInsuranceAdequacy(
  insurance: InsuranceStatus,
  serviceType: keyof typeof CERTIFICATION_REQUIREMENTS,
  eventValue?: number
): { adequate: boolean; issues: string[]; recommendations: string[] } {
  const issues: string[] = [];
  const recommendations: string[] = [];
  const now = new Date();

  // Minimum insurance requirements
  const minimumRequirements = {
    DOOR_SUPERVISION: {
      professionalIndemnity: 1000000, // £1M
      publicLiability: 2000000, // £2M
      employersLiability: 5000000 // £5M
    },
    CLOSE_PROTECTION: {
      professionalIndemnity: 2000000, // £2M
      publicLiability: 5000000, // £5M
      employersLiability: 5000000 // £5M
    },
    ELITE_PROTECTION: {
      professionalIndemnity: 5000000, // £5M
      publicLiability: 10000000, // £10M
      employersLiability: 5000000 // £5M
    }
  };

  const requirements = minimumRequirements[serviceType];

  // Check Professional Indemnity
  if (insurance.professionalIndemnity.expiryDate < now) {
    issues.push('Professional Indemnity insurance expired');
  } else if (insurance.professionalIndemnity.coverageAmount < requirements.professionalIndemnity) {
    issues.push(`Professional Indemnity coverage below minimum £${requirements.professionalIndemnity.toLocaleString()}`);
  }

  // Check Public Liability
  if (insurance.publicLiability.expiryDate < now) {
    issues.push('Public Liability insurance expired');
  } else if (insurance.publicLiability.coverageAmount < requirements.publicLiability) {
    issues.push(`Public Liability coverage below minimum £${requirements.publicLiability.toLocaleString()}`);
  }

  // Check Employers Liability
  if (insurance.employersLiability) {
    if (insurance.employersLiability.expiryDate < now) {
      issues.push('Employers Liability insurance expired');
    } else if (insurance.employersLiability.coverageAmount < requirements.employersLiability) {
      issues.push(`Employers Liability coverage below minimum £${requirements.employersLiability.toLocaleString()}`);
    }
  } else {
    issues.push('Employers Liability insurance required');
  }

  // Event-specific recommendations
  if (eventValue && eventValue > 1000000) {
    recommendations.push('Consider additional coverage for high-value events');
  }

  if (serviceType === 'ELITE_PROTECTION') {
    recommendations.push('Consider worldwide coverage for international assignments');
    recommendations.push('Verify kidnap & ransom insurance if applicable');
  }

  return {
    adequate: issues.length === 0,
    issues,
    recommendations
  };
}