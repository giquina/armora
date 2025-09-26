// Define types locally since components were removed
export interface ProtectionLevel {
  id: string;
  name: string;
  hourlyRate: number;
  type: 'personal' | 'transport';
}

export interface VenueTimeData {
  hours: number;
  minutes: number;
  venueHours?: number;
}

export interface ProtectionPreferences {
  defaultProtectionType: 'transport' | 'personal' | null;
  preferredOfficerGender: 'any' | 'male' | 'female';
  discreteProtection: boolean;
  helpWithShopping: boolean;
  waitInside: boolean;
  commonDestinations: CommonDestination[];
}

export interface CommonDestination {
  address: string;
  protectionType: 'transport' | 'personal';
  averageDuration: number;
  usageCount: number;
  lastUsed: number; // timestamp
}

const PREFERENCES_KEY = 'armora_protection_preferences';

/**
 * Get user's protection preferences from localStorage
 */
export function getProtectionPreferences(): ProtectionPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      const preferences = JSON.parse(stored) as ProtectionPreferences;

      // Ensure all properties exist with defaults
      return {
        defaultProtectionType: preferences.defaultProtectionType || null,
        preferredOfficerGender: preferences.preferredOfficerGender || 'any',
        discreteProtection: preferences.discreteProtection ?? false,
        helpWithShopping: preferences.helpWithShopping ?? false,
        waitInside: preferences.waitInside ?? true,
        commonDestinations: preferences.commonDestinations || []
      };
    }
  } catch (error) {
    console.error('Error loading protection preferences:', error);
  }

  // Return defaults if not found or error
  return {
    defaultProtectionType: null,
    preferredOfficerGender: 'any',
    discreteProtection: false,
    helpWithShopping: false,
    waitInside: true,
    commonDestinations: []
  };
}

/**
 * Save user's protection preferences to localStorage
 */
export function saveProtectionPreferences(preferences: ProtectionPreferences): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving protection preferences:', error);
  }
}

/**
 * Update specific preference values
 */
export function updateProtectionPreferences(updates: Partial<ProtectionPreferences>): void {
  const current = getProtectionPreferences();
  const updated = { ...current, ...updates };
  saveProtectionPreferences(updated);
}

/**
 * Record a secureDestination usage for learning user preferences
 */
export function recordDestinationUsage(
  secureDestination: string,
  protectionLevel: ProtectionLevel,
  venueTimeData?: VenueTimeData
): void {
  const preferences = getProtectionPreferences();
  const existingIndex = preferences.commonDestinations.findIndex(
    d => d.address.toLowerCase() === secureDestination.toLowerCase()
  );

  const duration = protectionLevel.type === 'personal' && venueTimeData
    ? venueTimeData.venueHours
    : 2; // Default for transport protection

  if (existingIndex >= 0) {
    // Update existing destination
    const existing = preferences.commonDestinations[existingIndex];
    preferences.commonDestinations[existingIndex] = {
      ...existing,
      protectionType: protectionLevel.type,
      averageDuration: (existing.averageDuration + duration) / 2, // Simple average
      usageCount: existing.usageCount + 1,
      lastUsed: Date.now()
    };
  } else {
    // Add new destination
    preferences.commonDestinations.push({
      address: secureDestination,
      protectionType: protectionLevel.type,
      averageDuration: duration,
      usageCount: 1,
      lastUsed: Date.now()
    });
  }

  // Keep only the 10 most recent/frequently used destinations
  preferences.commonDestinations = preferences.commonDestinations
    .sort((a, b) => {
      // Sort by usage frequency and recency
      const scoreA = a.usageCount * 0.7 + (Date.now() - a.lastUsed) / (1000 * 60 * 60 * 24) * 0.3;
      const scoreB = b.usageCount * 0.7 + (Date.now() - b.lastUsed) / (1000 * 60 * 60 * 24) * 0.3;
      return scoreB - scoreA;
    })
    .slice(0, 10);

  saveProtectionPreferences(preferences);
}

/**
 * Get recommended protection type for a secureDestination based on user history
 */
export function getRecommendedProtectionType(secureDestination: string): 'transport' | 'personal' | null {
  const preferences = getProtectionPreferences();

  // Check if user has been to this secureDestination before
  const commonDestination = preferences.commonDestinations.find(
    d => d.address.toLowerCase().includes(secureDestination.toLowerCase()) ||
         secureDestination.toLowerCase().includes(d.address.toLowerCase())
  );

  if (commonDestination) {
    return commonDestination.protectionType;
  }

  // Fall back to user's default preference
  return preferences.defaultProtectionType;
}

/**
 * Get pre-filled venue time data based on user preferences and secureDestination history
 */
export function getPrefilledVenueTimeData(secureDestination: string): Partial<VenueTimeData> {
  const preferences = getProtectionPreferences();

  // Find similar secureDestination in history
  const commonDestination = preferences.commonDestinations.find(
    d => d.address.toLowerCase().includes(secureDestination.toLowerCase()) ||
         secureDestination.toLowerCase().includes(d.address.toLowerCase())
  );

  return {
    venueHours: commonDestination?.averageDuration || 2,
    discreteProtection: preferences.discreteProtection,
    helpWithShopping: preferences.helpWithShopping,
    waitInside: preferences.waitInside,
    femaleOfficerPreferred: preferences.preferredOfficerGender === 'female'
  };
}

/**
 * Learn from user selections to improve recommendations
 */
export function learnFromSelection(
  protectionLevel: ProtectionLevel,
  venueTimeData?: VenueTimeData
): void {
  const preferences = getProtectionPreferences();

  // Update default protection type based on selections
  if (!preferences.defaultProtectionType) {
    preferences.defaultProtectionType = protectionLevel.type;
  } else {
    // Weighted learning - slowly adjust default based on recent selections
    // This could be made more sophisticated with a proper learning algorithm
    const currentWeight = 0.8;
    const newWeight = 0.2;

    // For now, just update if user consistently chooses different type
    // In a real implementation, we'd track selection history and use ML
  }

  // Update preferences from venue time data
  if (venueTimeData) {
    preferences.discreteProtection = venueTimeData.discreteProtection;
    preferences.helpWithShopping = venueTimeData.helpWithShopping;
    preferences.waitInside = venueTimeData.waitInside;

    if (venueTimeData.femaleOfficerPreferred) {
      preferences.preferredOfficerGender = 'female';
    }
  }

  saveProtectionPreferences(preferences);
}

/**
 * Reset all preferences to defaults
 */
export function resetProtectionPreferences(): void {
  try {
    localStorage.removeItem(PREFERENCES_KEY);
  } catch (error) {
    console.error('Error resetting protection preferences:', error);
  }
}

/**
 * Get usage statistics for analytics
 */
export function getUsageStatistics() {
  const preferences = getProtectionPreferences();

  const totalUsages = preferences.commonDestinations.reduce((sum, dest) => sum + dest.usageCount, 0);
  const transportUsages = preferences.commonDestinations
    .filter(dest => dest.protectionType === 'transport')
    .reduce((sum, dest) => sum + dest.usageCount, 0);
  const personalUsages = preferences.commonDestinations
    .filter(dest => dest.protectionType === 'personal')
    .reduce((sum, dest) => sum + dest.usageCount, 0);

  return {
    totalUsages,
    transportUsages,
    personalUsages,
    transportPercentage: totalUsages > 0 ? Math.round((transportUsages / totalUsages) * 100) : 0,
    personalPercentage: totalUsages > 0 ? Math.round((personalUsages / totalUsages) * 100) : 0,
    averageDuration: preferences.commonDestinations.length > 0
      ? preferences.commonDestinations.reduce((sum, dest) => sum + dest.averageDuration, 0) / preferences.commonDestinations.length
      : 2,
    mostUsedDestination: preferences.commonDestinations.length > 0
      ? preferences.commonDestinations[0]
      : null
  };
}