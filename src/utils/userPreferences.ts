// Intelligent User Preferences System
// Manages user defaults, learning, and personalization

interface Location {
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
}

interface UserPreferences {
  // Service Preferences
  preferredServiceTier?: 'standard' | 'executive' | 'shadow';
  preferredBookingTime?: 'immediate' | '15min' | '30min' | '1hour';

  // Location Preferences
  recentPickupLocations: Location[];
  recentDestinations: Location[];
  favoriteLocations: Location[];
  homeLocation?: Location;
  workLocation?: Location;

  // Booking Patterns
  typicalBookingTimes: string[]; // ISO times when user usually books
  frequentRoutes: Array<{
    commencementPoint: Location;
    secureDestination: Location;
    frequency: number;
    lastUsed: string;
  }>;

  // User Profile
  userType: 'individual' | 'business' | 'vip';
  isBusinessUser: boolean;
  averageJourneyDistance: number;
  preferredPaymentMethod?: string;

  // Learning Data
  bookingHistory: Array<{
    timestamp: string;
    serviceTier: string;
    pickupTime: string;
    route: {
      commencementPoint: Location;
      secureDestination: Location;
    };
    cost: number;
  }>;

  // Personalization Settings
  enableSmartDefaults: boolean;
  autoSelectPreferredService: boolean;
  rememberLocations: boolean;
  suggestFrequentRoutes: boolean;
}

class UserPreferencesService {
  private static readonly STORAGE_KEY = 'armora_user_preferences';
  private static readonly MAX_RECENT_LOCATIONS = 10;
  private static readonly MAX_FAVORITE_LOCATIONS = 5;
  private static readonly MAX_FREQUENT_ROUTES = 8;

  // Get user preferences from localStorage
  static getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        return {
          ...this.getDefaultPreferences(),
          ...preferences
        };
      }
    } catch (error) {
      console.warn('[Preferences] Error loading preferences:', error);
    }

    return this.getDefaultPreferences();
  }

  // Save preferences to localStorage
  static savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));

      console.log('[Analytics] User preferences updated', {
        updatedFields: Object.keys(preferences),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Preferences] Error saving preferences:', error);
    }
  }

  // Get default preferences for new users
  private static getDefaultPreferences(): UserPreferences {
    return {
      recentPickupLocations: [],
      recentDestinations: [],
      favoriteLocations: [],
      typicalBookingTimes: [],
      frequentRoutes: [],
      bookingHistory: [],
      userType: 'individual',
      isBusinessUser: false,
      averageJourneyDistance: 0,
      enableSmartDefaults: true,
      autoSelectPreferredService: true,
      rememberLocations: true,
      suggestFrequentRoutes: true
    };
  }

  // Learn from user's booking behavior
  static learnFromBooking(bookingData: {
    serviceTier: string;
    commencementLocation: Location;
    destinationLocation: Location;
    scheduledTime: string;
    cost: number;
  }): void {
    const preferences = this.getPreferences();

    // Add to booking history
    preferences.bookingHistory.unshift({
      timestamp: new Date().toISOString(),
      serviceTier: bookingData.serviceTier,
      pickupTime: bookingData.scheduledTime,
      route: {
        commencementPoint: bookingData.commencementLocation,
        secureDestination: bookingData.destinationLocation
      },
      cost: bookingData.cost
    });

    // Limit history size
    preferences.bookingHistory = preferences.bookingHistory.slice(0, 50);

    // Update recent locations
    this.updateRecentLocation(preferences.recentPickupLocations, bookingData.commencementLocation);
    this.updateRecentLocation(preferences.recentDestinations, bookingData.destinationLocation);

    // Learn preferred service tier
    this.learnServicePreference(preferences);

    // Learn booking time patterns
    this.learnBookingTimePatterns(preferences, bookingData.scheduledTime);

    // Update frequent routes
    this.updateFrequentRoutes(preferences, bookingData.commencementLocation, bookingData.destinationLocation);

    // Update user profile insights
    this.updateUserProfile(preferences);

    this.savePreferences(preferences);
  }

  // Add location to recent list (avoiding duplicates)
  private static updateRecentLocation(recentList: Location[], newLocation: Location): void {
    // Remove existing similar location
    const filtered = recentList.filter(loc =>
      Math.abs(loc.lat - newLocation.lat) > 0.001 ||
      Math.abs(loc.lng - newLocation.lng) > 0.001
    );

    // Add new location at beginning
    filtered.unshift(newLocation);

    // Limit size
    recentList.splice(0, recentList.length, ...filtered.slice(0, this.MAX_RECENT_LOCATIONS));
  }

  // Learn user's preferred service tier from history
  private static learnServicePreference(preferences: UserPreferences): void {
    if (preferences.bookingHistory.length < 3) return;

    const recentBookings = preferences.bookingHistory.slice(0, 10);
    const serviceCounts = recentBookings.reduce((counts, booking) => {
      counts[booking.serviceTier] = (counts[booking.serviceTier] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostUsed = Object.entries(serviceCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostUsed && mostUsed[1] >= 3) {
      preferences.preferredServiceTier = mostUsed[0] as any;
    }
  }

  // Learn typical booking time patterns
  private static learnBookingTimePatterns(preferences: UserPreferences, scheduledTime: string): void {
    if (scheduledTime === 'immediate') return;

    try {
      const date = new Date(scheduledTime);
      const timeStr = date.toTimeString().slice(0, 5); // HH:MM

      preferences.typicalBookingTimes.unshift(timeStr);

      // Keep only recent patterns (last 20)
      preferences.typicalBookingTimes = preferences.typicalBookingTimes.slice(0, 20);
    } catch (error) {
      console.warn('[Preferences] Error learning booking time pattern:', error);
    }
  }

  // Update frequent routes based on usage
  private static updateFrequentRoutes(preferences: UserPreferences, commencementPoint: Location, secureDestination: Location): void {
    const routeKey = `${commencementPoint.lat.toFixed(4)},${commencementPoint.lng.toFixed(4)}-${secureDestination.lat.toFixed(4)},${secureDestination.lng.toFixed(4)}`;

    const existingRoute = preferences.frequentRoutes.find(route =>
      Math.abs(route.commencementPoint.lat - commencementPoint.lat) < 0.001 &&
      Math.abs(route.commencementPoint.lng - commencementPoint.lng) < 0.001 &&
      Math.abs(route.secureDestination.lat - secureDestination.lat) < 0.001 &&
      Math.abs(route.secureDestination.lng - secureDestination.lng) < 0.001
    );

    if (existingRoute) {
      existingRoute.frequency += 1;
      existingRoute.lastUsed = new Date().toISOString();
    } else {
      preferences.frequentRoutes.push({
        commencementPoint,
        secureDestination,
        frequency: 1,
        lastUsed: new Date().toISOString()
      });
    }

    // Sort by frequency and recency, limit size
    preferences.frequentRoutes = preferences.frequentRoutes
      .sort((a, b) => {
        if (a.frequency !== b.frequency) {
          return b.frequency - a.frequency;
        }
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      })
      .slice(0, this.MAX_FREQUENT_ROUTES);
  }

  // Update user profile based on booking patterns
  private static updateUserProfile(preferences: UserPreferences): void {
    if (preferences.bookingHistory.length < 5) return;

    const recentBookings = preferences.bookingHistory.slice(0, 20);

    // Determine if business user based on booking patterns
    const businessHours = recentBookings.filter(booking => {
      try {
        const date = new Date(booking.timestamp);
        const hour = date.getHours();
        const dayOfWeek = date.getDay();
        return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 8 && hour <= 18;
      } catch {
        return false;
      }
    }).length;

    const businessPercentage = businessHours / recentBookings.length;
    preferences.isBusinessUser = businessPercentage > 0.6;
    preferences.userType = preferences.isBusinessUser ? 'business' : 'individual';

    // Calculate average journey cost (indicator of user tier)
    const avgCost = recentBookings.reduce((sum, b) => sum + b.cost, 0) / recentBookings.length;
    if (avgCost > 100) {
      preferences.userType = 'vip';
    }
  }

  // Get smart default service based on user patterns
  static getSmartServiceDefault(): string {
    const preferences = this.getPreferences();

    if (!preferences.enableSmartDefaults) {
      return 'standard';
    }

    // Return learned preference or intelligent default
    if (preferences.preferredServiceTier) {
      return preferences.preferredServiceTier;
    }

    // Default based on user type
    switch (preferences.userType) {
      case 'vip':
        return 'shadow';
      case 'business':
        return 'executive';
      default:
        return 'standard';
    }
  }

  // Get smart default booking time
  static getSmartTimeDefault(): string {
    const preferences = this.getPreferences();

    if (!preferences.enableSmartDefaults || preferences.typicalBookingTimes.length < 3) {
      return preferences.isBusinessUser ? '1hour' : 'immediate';
    }

    // Analyze typical booking times to suggest default
    const now = new Date();
    const currentHour = now.getHours();

    // If it's business hours, suggest advance booking for business users
    if (preferences.isBusinessUser && currentHour >= 8 && currentHour <= 17) {
      return '1hour';
    }

    return 'immediate';
  }

  // Get suggested locations for autocomplete
  static getSuggestedLocations(type: 'commencementPoint' | 'destination'): Location[] {
    const preferences = this.getPreferences();

    const recent = type === 'commencementPoint'
      ? preferences.recentPickupLocations
      : preferences.recentDestinations;

    const suggestions: Location[] = [];

    // Add recent locations
    suggestions.push(...recent.slice(0, 3));

    // Add home/work for pickup
    if (type === 'commencementPoint') {
      if (preferences.homeLocation) suggestions.push(preferences.homeLocation);
      if (preferences.workLocation) suggestions.push(preferences.workLocation);
    }

    // Add frequent destinations
    if (type === 'destination') {
      preferences.frequentRoutes.slice(0, 3).forEach(route => {
        if (!suggestions.some(s =>
          Math.abs(s.lat - route.secureDestination.lat) < 0.001 &&
          Math.abs(s.lng - route.secureDestination.lng) < 0.001
        )) {
          suggestions.push(route.secureDestination);
        }
      });
    }

    return suggestions.slice(0, 5);
  }

  // Clear all preferences (for testing or user request)
  static clearPreferences(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('[Preferences] All preferences cleared');
    } catch (error) {
      console.error('[Preferences] Error clearing preferences:', error);
    }
  }

  // Export preferences (for data portability)
  static exportPreferences(): string {
    const preferences = this.getPreferences();
    return JSON.stringify(preferences, null, 2);
  }

  // Import preferences (for data portability)
  static importPreferences(jsonData: string): boolean {
    try {
      const preferences = JSON.parse(jsonData);
      this.savePreferences(preferences);
      return true;
    } catch (error) {
      console.error('[Preferences] Error importing preferences:', error);
      return false;
    }
  }
}

export { UserPreferencesService };
export type { UserPreferences, Location };