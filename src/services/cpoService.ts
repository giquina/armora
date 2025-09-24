// CPO Service - Supabase Integration for Close Protection Officers
import { CPOProfile, CPOSearchFilters, CPOMatch, MatchingCriteria } from '../types/cpo';
import { mockCPOs } from '../data/mockCPOs';

// In a real application, these would be actual Supabase database calls
// For now, they work with mock data but maintain the same interface

/**
 * Fetch available Close Protection Officers based on filters
 * @param filters Optional search and filter criteria
 * @returns Promise<CPOProfile[]> Array of available CPOs
 */
export const fetchAvailableCPOs = async (filters?: CPOSearchFilters): Promise<CPOProfile[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filteredCPOs = [...mockCPOs];

  if (filters) {
    filteredCPOs = filteredCPOs.filter(cpo => {
      // Availability filter
      if (filters.availability === 'available_now' && cpo.availability.status !== 'Available_Now') {
        return false;
      }
      if (filters.availability === 'available_today' &&
          !['Available_Now', 'Available_Soon'].includes(cpo.availability.status)) {
        return false;
      }

      // Specialization filter
      if (filters.specializations && filters.specializations.length > 0) {
        const cpoSpecializations = cpo.specializations.map(s => s.type);
        if (!filters.specializations.some(spec => cpoSpecializations.includes(spec as any))) {
          return false;
        }
      }

      // Experience level filter
      if (filters.experienceLevel) {
        const years = cpo.yearsOfExperience;
        switch (filters.experienceLevel) {
          case 'junior':
            if (years >= 5) return false;
            break;
          case 'experienced':
            if (years < 5 || years >= 10) return false;
            break;
          case 'senior':
            if (years < 10 || years >= 15) return false;
            break;
          case 'elite':
            if (years < 15) return false;
            break;
        }
      }

      // Rating filter
      if (filters.ratingMinimum && cpo.rating < filters.ratingMinimum) {
        return false;
      }

      // Price filter
      if (filters.maxHourlyRate) {
        const lowestRate = Math.min(
          cpo.hourlyRates.essential,
          cpo.hourlyRates.executive,
          cpo.hourlyRates.shadow
        );
        if (lowestRate > filters.maxHourlyRate) {
          return false;
        }
      }

      // Vehicle filter
      if (filters.hasVehicle && !cpo.vehicle) {
        return false;
      }

      // Language filter
      if (filters.languages && filters.languages.length > 0) {
        if (!filters.languages.some(lang => cpo.languages.includes(lang))) {
          return false;
        }
      }

      // Coverage area filter
      if (filters.coverageArea && !cpo.coverageAreas.includes(filters.coverageArea)) {
        return false;
      }

      // Background filters
      if (filters.militaryBackground && !cpo.militaryBackground.hasMilitaryService) {
        return false;
      }
      if (filters.policeBackground && !cpo.policeBackground.hasPoliceService) {
        return false;
      }

      // SIA level filter
      if (filters.siaLevel && cpo.sia.level !== filters.siaLevel) {
        return false;
      }

      return true;
    });
  }

  return filteredCPOs;
};

/**
 * Get a specific CPO by ID
 * @param cpoId The unique identifier for the CPO
 * @returns Promise<CPOProfile | null> The CPO profile or null if not found
 */
export const getCPOById = async (cpoId: string): Promise<CPOProfile | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const cpo = mockCPOs.find(c => c.id === cpoId);
  return cpo || null;
};

/**
 * Find the best CPO matches based on specific criteria
 * @param criteria Matching criteria including location, threat level, etc.
 * @returns Promise<CPOMatch[]> Array of CPO matches with scores
 */
export const findBestCPOMatches = async (criteria: MatchingCriteria): Promise<CPOMatch[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const availableCPOs = await fetchAvailableCPOs({ availability: 'available_now' });

  const matches: CPOMatch[] = availableCPOs.map(cpo => {
    let matchScore = 0;
    const matchReasons: string[] = [];

    // Calculate match score based on various factors

    // Experience match
    if (cpo.yearsOfExperience >= criteria.preferredExperience) {
      matchScore += 20;
      matchReasons.push('Meets experience requirements');
    }

    // Specialization match
    const cpoSpecializations = cpo.specializations.map(s => s.type);
    const specializationMatch = criteria.requiredSpecializations.some(req =>
      cpoSpecializations.includes(req as any)
    );
    if (specializationMatch) {
      matchScore += 25;
      matchReasons.push('Specialized expertise match');
    }

    // Availability urgency match
    if (criteria.urgency === 'immediate' && cpo.availability.status === 'Available_Now') {
      matchScore += 30;
      matchReasons.push('Immediately available');
    }

    // Budget/tier match
    const tierRates = {
      essential: cpo.hourlyRates.essential,
      executive: cpo.hourlyRates.executive,
      shadow: cpo.hourlyRates.shadow
    };
    if (tierRates[criteria.budget] <= tierRates[criteria.budget] * 1.1) {
      matchScore += 15;
      matchReasons.push('Within budget range');
    }

    // Vehicle requirement match
    if (criteria.vehicleRequired && cpo.vehicle) {
      matchScore += 10;
      matchReasons.push('Vehicle available');
    }

    // Rating bonus
    if (cpo.rating >= 4.5) {
      matchScore += 10;
      matchReasons.push('Highly rated officer');
    }

    // Mock proximity calculation (in real app, would use actual GPS coordinates)
    const proximityKm = Math.random() * 50 + 5; // 5-55 km
    const estimatedResponseTime = Math.round(proximityKm * 2 + Math.random() * 30); // minutes
    const priceEstimate = tierRates[criteria.budget] * criteria.duration;

    return {
      cpo,
      matchScore: Math.min(matchScore, 100), // Cap at 100%
      matchReasons,
      proximityKm,
      estimatedResponseTime,
      priceEstimate
    };
  });

  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Assign a CPO to a protection assignment
 * @param cpoId The ID of the CPO to assign
 * @param assignmentId The ID of the protection assignment
 * @returns Promise<boolean> Success status
 */
export const assignCPOToProtection = async (cpoId: string, assignmentId: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real application, this would:
  // 1. Update the CPO's availability status
  // 2. Create the assignment relationship in the database
  // 3. Send notifications to both CPO and client
  // 4. Update assignment tracking systems

  console.log(`CPO ${cpoId} assigned to protection assignment ${assignmentId}`);

  // For now, always return success (in real app, would handle errors)
  return true;
};

/**
 * Update CPO availability status
 * @param cpoId The ID of the CPO
 * @param availability New availability data
 * @returns Promise<boolean> Success status
 */
export const updateCPOAvailability = async (
  cpoId: string,
  availability: CPOProfile['availability']
): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real application, this would update the CPO's availability in Supabase
  console.log(`Updated availability for CPO ${cpoId}:`, availability);

  return true;
};

/**
 * Get CPO assignment history
 * @param cpoId The ID of the CPO
 * @param limit Optional limit on number of assignments to return
 * @returns Promise<Assignment[]> Array of past assignments
 */
export const getCPOAssignmentHistory = async (
  cpoId: string,
  limit: number = 10
): Promise<CPOProfile['recentAssignments']> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  const cpo = await getCPOById(cpoId);
  if (!cpo) return [];

  return cpo.recentAssignments.slice(0, limit);
};

/**
 * Add or update CPO rating/testimonial
 * @param cpoId The ID of the CPO
 * @param testimonial The testimonial data including rating
 * @returns Promise<boolean> Success status
 */
export const addCPOTestimonial = async (
  cpoId: string,
  testimonial: Omit<CPOProfile['testimonials'][0], 'date' | 'verified'>
): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real application, this would:
  // 1. Add the testimonial to the CPO's profile
  // 2. Update the CPO's average rating
  // 3. Mark testimonial as pending verification
  // 4. Notify the CPO of new feedback

  console.log(`Added testimonial for CPO ${cpoId}:`, testimonial);

  return true;
};

// Export commonly used types for easy importing
export type { CPOProfile, CPOSearchFilters, CPOMatch, MatchingCriteria };