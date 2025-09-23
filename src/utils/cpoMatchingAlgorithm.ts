import { CPOProfile, CPOMatch, MatchingCriteria, Location } from '../types/cpo';

/**
 * Smart matching algorithm for Close Protection Officers (CPOs)
 * Scores each CPO based on multiple weighted criteria to find the best match for a Principal
 */

// Scoring weights (must sum to 100)
const SCORING_WEIGHTS = {
  PROXIMITY: 40,        // Distance from Principal's location
  SPECIALIZATION: 30,   // Match with required specializations
  EXPERIENCE_THREAT: 20, // Experience level vs threat level
  AVAILABILITY: 10      // Current availability status
} as const;

// Additional scoring factors
const BONUS_WEIGHTS = {
  MILITARY_BACKGROUND: 5,
  POLICE_BACKGROUND: 3,
  SECURITY_CLEARANCE: 4,
  VEHICLE_AVAILABLE: 3,
  LANGUAGE_MATCH: 2,
  HIGH_RATING: 3,
  FAST_RESPONSE: 2
} as const;

/**
 * Calculate distance between two geographic points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Score proximity based on distance
 */
function scoreProximity(distance: number): number {
  if (distance <= 5) return 100;   // Within 5km - perfect
  if (distance <= 10) return 90;   // Within 10km - excellent
  if (distance <= 25) return 70;   // Within 25km - good
  if (distance <= 50) return 50;   // Within 50km - acceptable
  if (distance <= 100) return 25;  // Within 100km - possible
  return 10; // Beyond 100km - last resort
}

/**
 * Score specialization match
 */
function scoreSpecialization(
  cpoSpecializations: string[],
  requiredSpecializations: string[]
): { score: number; matches: string[] } {
  if (requiredSpecializations.length === 0) {
    return { score: 100, matches: [] }; // No specific requirements
  }

  const matches = requiredSpecializations.filter(required =>
    cpoSpecializations.includes(required)
  );

  const matchPercentage = (matches.length / requiredSpecializations.length) * 100;

  // Bonus for having more specialized skills than required
  const extraSpecializations = cpoSpecializations.filter(spec =>
    !requiredSpecializations.includes(spec)
  ).length;

  const bonusPoints = Math.min(extraSpecializations * 2, 10);

  return {
    score: Math.min(matchPercentage + bonusPoints, 100),
    matches
  };
}

/**
 * Score experience vs threat level match
 */
function scoreExperienceVsThreat(
  yearsOfExperience: number,
  threatLevel: string
): number {
  const experienceRequirements = {
    low: 2,      // Minimum 2 years for low threat
    medium: 5,   // Minimum 5 years for medium threat
    high: 10,    // Minimum 10 years for high threat
    extreme: 15  // Minimum 15 years for extreme threat
  };

  const requiredYears = experienceRequirements[threatLevel as keyof typeof experienceRequirements] || 5;

  if (yearsOfExperience >= requiredYears * 2) return 100; // Double the requirement - perfect
  if (yearsOfExperience >= requiredYears * 1.5) return 90; // 1.5x requirement - excellent
  if (yearsOfExperience >= requiredYears) return 80; // Meets requirement - good
  if (yearsOfExperience >= requiredYears * 0.8) return 60; // Close to requirement - acceptable
  if (yearsOfExperience >= requiredYears * 0.6) return 40; // Below requirement - poor
  return 20; // Well below requirement - inadequate
}

/**
 * Score availability status
 */
function scoreAvailability(
  availabilityStatus: string,
  urgency: string,
  responseTime: number
): number {
  const urgencyScoring = {
    immediate: {
      'Available_Now': 100,
      'Available_Soon': 60,
      'On_Assignment': 10,
      'Off_Duty': 5,
      'Emergency_Only': 80
    },
    within_hour: {
      'Available_Now': 100,
      'Available_Soon': 90,
      'On_Assignment': 20,
      'Off_Duty': 15,
      'Emergency_Only': 70
    },
    within_day: {
      'Available_Now': 100,
      'Available_Soon': 95,
      'On_Assignment': 50,
      'Off_Duty': 40,
      'Emergency_Only': 60
    },
    scheduled: {
      'Available_Now': 100,
      'Available_Soon': 100,
      'On_Assignment': 80,
      'Off_Duty': 70,
      'Emergency_Only': 50
    }
  };

  const baseScore = urgencyScoring[urgency as keyof typeof urgencyScoring]?.[availabilityStatus as keyof typeof urgencyScoring.immediate] || 50;

  // Adjust for response time
  let responseTimeAdjustment = 0;
  if (responseTime <= 15) responseTimeAdjustment = 5;
  else if (responseTime <= 30) responseTimeAdjustment = 3;
  else if (responseTime <= 60) responseTimeAdjustment = 0;
  else if (responseTime <= 120) responseTimeAdjustment = -3;
  else responseTimeAdjustment = -5;

  return Math.max(0, Math.min(100, baseScore + responseTimeAdjustment));
}

/**
 * Calculate bonus points for additional qualifications
 */
function calculateBonusPoints(
  cpo: CPOProfile,
  criteria: MatchingCriteria
): { totalBonus: number; bonusReasons: string[] } {
  let totalBonus = 0;
  const bonusReasons: string[] = [];

  // Military background bonus
  if (cpo.militaryBackground.hasMilitaryService) {
    totalBonus += BONUS_WEIGHTS.MILITARY_BACKGROUND;
    bonusReasons.push('Military Service');

    // Extra bonus for security clearance
    if (cpo.militaryBackground.securityClearance) {
      totalBonus += BONUS_WEIGHTS.SECURITY_CLEARANCE;
      bonusReasons.push('Security Clearance');
    }
  }

  // Police background bonus
  if (cpo.policeBackground.hasPoliceService) {
    totalBonus += BONUS_WEIGHTS.POLICE_BACKGROUND;
    bonusReasons.push('Police Service');
  }

  // Vehicle availability bonus
  if (criteria.vehicleRequired && cpo.vehicle) {
    totalBonus += BONUS_WEIGHTS.VEHICLE_AVAILABLE;
    bonusReasons.push('Vehicle Available');
  }

  // Language preference bonus
  if (criteria.languagePreferences && criteria.languagePreferences.length > 0) {
    const languageMatches = criteria.languagePreferences.filter(lang =>
      cpo.languages.includes(lang)
    );
    if (languageMatches.length > 0) {
      totalBonus += BONUS_WEIGHTS.LANGUAGE_MATCH * languageMatches.length;
      bonusReasons.push(`Speaks ${languageMatches.join(', ')}`);
    }
  }

  // High rating bonus
  if (cpo.rating >= 4.8) {
    totalBonus += BONUS_WEIGHTS.HIGH_RATING;
    bonusReasons.push('Excellent Rating');
  }

  // Fast response time bonus
  if (cpo.averageResponseTime <= 15) {
    totalBonus += BONUS_WEIGHTS.FAST_RESPONSE;
    bonusReasons.push('Fast Response');
  }

  return { totalBonus, bonusReasons };
}

/**
 * Estimate price based on service tier and duration
 */
function estimatePrice(
  cpo: CPOProfile,
  criteria: MatchingCriteria
): number {
  const rateMap = {
    essential: cpo.hourlyRates.essential,
    executive: cpo.hourlyRates.executive,
    shadow: cpo.hourlyRates.shadow
  };

  const baseRate = rateMap[criteria.budget] || cpo.hourlyRates.essential;
  const totalHours = Math.max(criteria.duration, cpo.minimumEngagement);

  // Add travel allowance if distance is significant
  const travelBonus = criteria.duration > 50 ? cpo.travelAllowance : 0;

  return (baseRate * totalHours) + travelBonus;
}

/**
 * Estimate response time based on urgency and distance
 */
function estimateResponseTime(
  cpo: CPOProfile,
  distance: number,
  urgency: string
): number {
  let baseResponseTime = cpo.averageResponseTime;

  // Adjust for distance (assume 30 km/h average speed in urban areas)
  const travelTime = distance * 2; // Conservative estimate

  // Adjust for urgency
  const urgencyMultiplier = {
    immediate: 0.5,     // Rush response
    within_hour: 0.8,   // Prioritized
    within_day: 1.0,    // Normal
    scheduled: 1.2      // Planned arrival
  };

  const multiplier = urgencyMultiplier[urgency as keyof typeof urgencyMultiplier] || 1.0;

  return Math.round((baseResponseTime * multiplier) + travelTime);
}

/**
 * Main matching function
 */
export function matchCPOToPrincipal(
  criteria: MatchingCriteria,
  availableCPOs: CPOProfile[]
): CPOMatch[] {
  const matches: CPOMatch[] = [];

  for (const cpo of availableCPOs) {
    // Skip inactive or unverified CPOs
    if (!cpo.isActive || !cpo.isVerified) {
      continue;
    }

    // Calculate distance
    const distance = cpo.currentLocation
      ? calculateDistance(
          criteria.principalLocation.latitude,
          criteria.principalLocation.longitude,
          cpo.currentLocation.latitude,
          cpo.currentLocation.longitude
        )
      : 100; // Default high distance if location unknown

    // Skip if too far for immediate requests
    if (criteria.urgency === 'immediate' && distance > 100) {
      continue;
    }

    // Calculate core scores
    const proximityScore = scoreProximity(distance);

    const cpoSpecializations = cpo.specializations.map(s => s.type);
    const { score: specializationScore, matches: specializationMatches } = scoreSpecialization(
      cpoSpecializations,
      criteria.requiredSpecializations
    );

    const experienceScore = scoreExperienceVsThreat(
      cpo.yearsOfExperience,
      criteria.threatLevel
    );

    const availabilityScore = scoreAvailability(
      cpo.availability.status,
      criteria.urgency,
      cpo.averageResponseTime
    );

    // Calculate weighted core score
    const coreScore = (
      (proximityScore * SCORING_WEIGHTS.PROXIMITY) +
      (specializationScore * SCORING_WEIGHTS.SPECIALIZATION) +
      (experienceScore * SCORING_WEIGHTS.EXPERIENCE_THREAT) +
      (availabilityScore * SCORING_WEIGHTS.AVAILABILITY)
    ) / 100;

    // Calculate bonus points
    const { totalBonus, bonusReasons } = calculateBonusPoints(cpo, criteria);

    // Final match score (capped at 100)
    const matchScore = Math.min(100, coreScore + totalBonus);

    // Generate match reasons
    const matchReasons: string[] = [];

    if (proximityScore >= 90) matchReasons.push(`Only ${distance.toFixed(1)}km away`);
    if (specializationMatches.length > 0) {
      matchReasons.push(`Specialized in ${specializationMatches.join(', ').replace(/_/g, ' ')}`);
    }
    if (experienceScore >= 90) matchReasons.push(`Highly experienced (${cpo.yearsOfExperience} years)`);
    if (availabilityScore >= 90) matchReasons.push('Available immediately');
    if (cpo.rating >= 4.8) matchReasons.push('Top-rated officer');

    // Add bonus reasons
    matchReasons.push(...bonusReasons);

    // Create match object
    const match: CPOMatch = {
      cpo,
      matchScore: Math.round(matchScore * 100) / 100, // Round to 2 decimal places
      matchReasons: matchReasons.slice(0, 3), // Limit to top 3 reasons
      proximityKm: Math.round(distance * 100) / 100, // Round to 2 decimal places
      estimatedResponseTime: estimateResponseTime(cpo, distance, criteria.urgency),
      priceEstimate: estimatePrice(cpo, criteria)
    };

    matches.push(match);
  }

  // Sort by match score (highest first)
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}

/**
 * Find CPOs by specific criteria without full matching
 */
export function findCPOsBySpecialization(
  specialization: string,
  availableCPOs: CPOProfile[],
  limit: number = 10
): CPOProfile[] {
  return availableCPOs
    .filter(cpo =>
      cpo.isActive &&
      cpo.isVerified &&
      cpo.specializations.some(s => s.type === specialization)
    )
    .sort((a, b) => {
      // Sort by specialization experience, then overall rating
      const aSpecExp = a.specializations.find(s => s.type === specialization)?.yearsExperience || 0;
      const bSpecExp = b.specializations.find(s => s.type === specialization)?.yearsExperience || 0;

      if (aSpecExp !== bSpecExp) {
        return bSpecExp - aSpecExp;
      }

      return b.rating - a.rating;
    })
    .slice(0, limit);
}

/**
 * Get recommended CPOs for a Principal based on their history and preferences
 */
export function getRecommendedCPOs(
  principalHistory: any[], // TODO: Define proper type for principal history
  availableCPOs: CPOProfile[],
  limit: number = 5
): CPOProfile[] {
  // This would analyze the principal's past assignments and preferences
  // For now, return top-rated available officers
  return availableCPOs
    .filter(cpo => cpo.isActive && cpo.isVerified && cpo.availability.status === 'Available_Now')
    .sort((a, b) => {
      // Weight rating more heavily, then experience
      const scoreA = (a.rating * 0.7) + (Math.min(a.yearsOfExperience, 20) * 0.015);
      const scoreB = (b.rating * 0.7) + (Math.min(b.yearsOfExperience, 20) * 0.015);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Quick availability check
 */
export function getAvailableNowCPOs(
  location: Location,
  maxDistance: number = 50,
  availableCPOs: CPOProfile[]
): CPOProfile[] {
  return availableCPOs.filter(cpo => {
    if (!cpo.isActive || !cpo.isVerified || cpo.availability.status !== 'Available_Now') {
      return false;
    }

    if (cpo.currentLocation) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        cpo.currentLocation.latitude,
        cpo.currentLocation.longitude
      );
      return distance <= maxDistance;
    }

    return false;
  });
}