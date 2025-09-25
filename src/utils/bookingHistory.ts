// Booking History Management Utilities
import { ProtectionAssignmentHistoryItem, FavoriteRoute, QuickActionItem, PersonalizationAnalytics, ProtectionAssignmentData } from '../types';

// Storage keys
export const STORAGE_KEYS = {
  BOOKING_HISTORY: 'armora_booking_history',
  FAVORITE_ROUTES: 'armora_favorite_routes',
  PERSONALIZATION_ANALYTICS: 'armora_personalization_analytics',
} as const;

// Maximum items to store
const MAX_HISTORY_ITEMS = 20;
const MIN_FREQUENCY_FOR_FAVORITE = 3;

export class BookingHistoryManager {

  /**
   * Save a completed booking to history
   */
  static saveBookingToHistory(protectionAssignmentData: ProtectionAssignmentData, bookingId: string, protectionOfficerName?: string): void {
    try {
      const history = this.getBookingHistory();

      const historyItem: ProtectionAssignmentHistoryItem = {
        id: bookingId,
        service: protectionAssignmentData.service.id,
        serviceName: protectionAssignmentData.service.name,
        from: protectionAssignmentData.commencementPoint,
        to: protectionAssignmentData.secureDestination,
        price: `£${protectionAssignmentData.estimatedCost}`,
        estimatedCost: protectionAssignmentData.estimatedCost,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        time: new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        protectionOfficer: protectionOfficerName,
        frequency: this.calculateRouteFrequency(history, protectionAssignmentData.commencementPoint, protectionAssignmentData.secureDestination),
        status: 'completed',
        additionalRequirements: protectionAssignmentData.additionalRequirements,
        estimatedDistance: protectionAssignmentData.estimatedDistance,
        estimatedDuration: protectionAssignmentData.estimatedDuration,
        userId: protectionAssignmentData.user?.id,
      };

      // Add to beginning of array
      history.unshift(historyItem);

      // Keep only last MAX_HISTORY_ITEMS
      if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
      }

      localStorage.setItem(STORAGE_KEYS.BOOKING_HISTORY, JSON.stringify(history));

      // Check if route should become favorite
      this.checkAndAddToFavorites(historyItem);

      // Update analytics
      this.updatePersonalizationAnalytics(historyItem);

    } catch (error) {
      console.error('Error saving booking to history:', error);
    }
  }

  /**
   * Get booking history from localStorage
   */
  static getBookingHistory(): ProtectionAssignmentHistoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKING_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving booking history:', error);
      return [];
    }
  }

  /**
   * Get favorite routes from localStorage
   */
  static getFavoriteRoutes(): FavoriteRoute[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITE_ROUTES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving favorite routes:', error);
      return [];
    }
  }

  /**
   * Calculate how many times a route has been booked
   */
  private static calculateRouteFrequency(history: ProtectionAssignmentHistoryItem[], from: string, to: string): number {
    return history.filter(item =>
      item.from === from && item.to === to
    ).length + 1; // +1 for current booking
  }

  /**
   * Check if a route should be added to favorites and add it
   */
  private static checkAndAddToFavorites(historyItem: ProtectionAssignmentHistoryItem): void {
    if (historyItem.frequency >= MIN_FREQUENCY_FOR_FAVORITE) {
      this.addToFavorites(historyItem, true);
    }
  }

  /**
   * Add a route to favorites
   */
  static addToFavorites(item: ProtectionAssignmentHistoryItem | FavoriteRoute, isAutoFavorite: boolean = false): void {
    try {
      const favorites = this.getFavoriteRoutes();
      const routeId = `${item.from}|${item.to}`;

      // Check if already exists
      const existingIndex = favorites.findIndex(fav => fav.id === routeId);

      if (existingIndex >= 0) {
        // Update existing favorite
        const existing = favorites[existingIndex];
        favorites[existingIndex] = {
          ...existing,
          count: existing.count + 1,
          lastUsed: new Date().toISOString(),
          averagePrice: this.calculateAveragePrice(existing, item),
        };
      } else {
        // Create new favorite
        const favorite: FavoriteRoute = {
          id: routeId,
          from: item.from,
          to: item.to,
          nickname: this.generateRouteNickname(item.from, item.to),
          count: 'frequency' in item ? item.frequency : 1,
          lastUsed: new Date().toISOString(),
          averagePrice: 'estimatedCost' in item ? item.estimatedCost : item.averagePrice,
          preferredService: 'service' in item ? item.service : item.preferredService,
          estimatedDistance: item.estimatedDistance,
          estimatedDuration: item.estimatedDuration,
          isAutoFavorite,
          createdAt: new Date().toISOString(),
        };

        favorites.push(favorite);
      }

      localStorage.setItem(STORAGE_KEYS.FAVORITE_ROUTES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  /**
   * Remove a route from favorites
   */
  static removeFromFavorites(routeId: string): void {
    try {
      const favorites = this.getFavoriteRoutes();
      const filtered = favorites.filter(fav => fav.id !== routeId);
      localStorage.setItem(STORAGE_KEYS.FAVORITE_ROUTES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  /**
   * Generate dynamic quick actions based on user history
   */
  static generatePersonalizedQuickActions(): QuickActionItem[] {
    const history = this.getBookingHistory();
    const favorites = this.getFavoriteRoutes();

    if (history.length === 0) {
      return this.getDefaultQuickActions();
    }

    const actions: QuickActionItem[] = [];

    // Most recent booking - "Book Again"
    if (history.length > 0) {
      const recent = history[0];
      actions.push({
        id: 'rebook-recent',
        title: `Rebook: ${this.shortenLocationName(recent.to)}`,
        subtitle: `From ${this.shortenLocationName(recent.from)}`,
        icon: '🔄',
        type: 'recent',
        data: recent,
        isPersonalized: true,
        lastUsed: `${recent.date} ${recent.time}`,
      });
    }

    // Favorite routes (sorted by usage count)
    const sortedFavorites = favorites
      .sort((a, b) => b.count - a.count)
      .slice(0, 2); // Top 2 favorites

    sortedFavorites.forEach((fav, index) => {
      actions.push({
        id: `favorite-${fav.id}`,
        title: fav.nickname || `${this.shortenLocationName(fav.from)} → ${this.shortenLocationName(fav.to)}`,
        subtitle: `Booked ${fav.count} times`,
        icon: fav.count > 5 ? '⭐' : '📍',
        type: 'frequent',
        data: fav,
        isPersonalized: true,
        usageCount: fav.count,
        lastUsed: fav.lastUsed,
      });
    });

    // Smart suggestions based on patterns
    const suggestions = this.generateSmartSuggestions(history);
    actions.push(...suggestions.slice(0, 1)); // Add top suggestion

    // Fill remaining slots with defaults if needed
    const remainingSlots = 3 - actions.length;
    if (remainingSlots > 0) {
      const defaults = this.getDefaultQuickActions().slice(0, remainingSlots);
      actions.push(...defaults);
    }

    return actions.slice(0, 3);
  }

  /**
   * Generate smart suggestions based on booking patterns
   */
  static generateSmartSuggestions(history: ProtectionAssignmentHistoryItem[]): QuickActionItem[] {
    const suggestions: QuickActionItem[] = [];

    // Pattern: Same day of week bookings
    const today = new Date().getDay();
    const sameDayBookings = history.filter(item => {
      const bookingDay = new Date(item.date).getDay();
      return bookingDay === today;
    });

    if (sameDayBookings.length >= 2) {
      const mostCommon = this.getMostCommonRoute(sameDayBookings);
      if (mostCommon) {
        suggestions.push({
          id: 'suggestion-weekly',
          title: `${this.getDayName(today)} Regular?`,
          subtitle: `You usually book ${this.shortenLocationName(mostCommon.to)}`,
          icon: '📅',
          type: 'suggestion',
          data: mostCommon,
          isPersonalized: true,
        });
      }
    }

    // Pattern: Time-based suggestions (morning/evening)
    const currentHour = new Date().getHours();
    const timeCategory = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';

    const timeBasedBookings = history.filter(item => {
      const hour = parseInt(item.time.split(':')[0]);
      if (timeCategory === 'morning') return hour < 12;
      if (timeCategory === 'afternoon') return hour >= 12 && hour < 17;
      return hour >= 17;
    });

    if (timeBasedBookings.length >= 2) {
      const timeCommon = this.getMostCommonRoute(timeBasedBookings);
      if (timeCommon && !suggestions.find(s => s.data?.to === timeCommon.to)) {
        suggestions.push({
          id: 'suggestion-time',
          title: `${timeCategory.charAt(0).toUpperCase() + timeCategory.slice(1)} protection commencement?`,
          subtitle: `Your usual ${timeCategory} destination`,
          icon: timeCategory === 'morning' ? '🌅' : timeCategory === 'afternoon' ? '☀️' : '🌙',
          type: 'suggestion',
          data: timeCommon,
          isPersonalized: true,
        });
      }
    }

    return suggestions;
  }

  /**
   * Get default quick actions for new users
   */
  private static getDefaultQuickActions(): QuickActionItem[] {
    return [
      {
        id: 'default-airport',
        title: 'Airport Transfer',
        subtitle: 'Professional airport service',
        icon: '✈️',
        type: 'default',
        isPersonalized: false,
      },
      {
        id: 'default-commute',
        title: 'Daily Commute',
        subtitle: 'Regular office transport',
        icon: '🏢',
        type: 'default',
        isPersonalized: false,
      },
      {
        id: 'default-evening',
        title: 'Evening protection commencement',
        subtitle: 'Safe evening transport',
        icon: '🌙',
        type: 'default',
        isPersonalized: false,
      },
    ];
  }

  /**
   * Update personalization analytics
   */
  private static updatePersonalizationAnalytics(historyItem: ProtectionAssignmentHistoryItem): void {
    try {
      const analytics = this.getPersonalizationAnalytics();

      analytics.totalProtectionAssignments += 1;
      analytics.averageAssignmentValue = this.recalculateAverageAssignmentValue(analytics, historyItem);

      // Update most used service
      const serviceCount = this.getBookingHistory()
        .reduce((acc, item) => {
          acc[item.service] = (acc[item.service] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      analytics.mostUsedService = Object.entries(serviceCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || historyItem.service;

      // Update booking patterns
      const date = new Date(historyItem.date);
      const dayName = this.getDayName(date.getDay());
      const monthName = date.toLocaleString('default', { month: 'long' });
      const season = this.getSeason(date.getMonth());

      analytics.assignmentPatterns.weekly[dayName] = (analytics.assignmentPatterns.weekly[dayName] || 0) + 1;
      analytics.assignmentPatterns.monthly[monthName] = (analytics.assignmentPatterns.monthly[monthName] || 0) + 1;
      analytics.assignmentPatterns.seasonal[season] = (analytics.assignmentPatterns.seasonal[season] || 0) + 1;

      localStorage.setItem(STORAGE_KEYS.PERSONALIZATION_ANALYTICS, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error updating personalization analytics:', error);
    }
  }

  /**
   * Get personalization analytics
   */
  static getPersonalizationAnalytics(): PersonalizationAnalytics {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PERSONALIZATION_ANALYTICS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error retrieving personalization analytics:', error);
    }

    // Return default analytics
    return {
      totalProtectionAssignments: 0,
      favoriteRoutes: [],
      mostUsedService: '',
      averageAssignmentValue: 0,
      peakUsageTime: '',
      frequentDestinations: [],
      assignmentPatterns: {
        weekly: {},
        monthly: {},
        seasonal: {},
      },
    };
  }

  // Helper methods
  private static generateRouteNickname(from: string, to: string): string {
    const shortenLocation = (location: string) => {
      if (location.toLowerCase().includes('home')) return 'Home';
      if (location.toLowerCase().includes('office') || location.toLowerCase().includes('work')) return 'Office';
      if (location.toLowerCase().includes('airport')) return 'Airport';
      if (location.toLowerCase().includes('station')) return 'Station';

      // Extract postcode or area
      const postcodeMatch = location.match(/[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}/gi);
      if (postcodeMatch) return postcodeMatch[0];

      // Get first significant word
      const words = location.split(',')[0].split(' ');
      return words.find(word => word.length > 2) || words[0];
    };

    const fromShort = shortenLocation(from);
    const toShort = shortenLocation(to);

    return `${fromShort} → ${toShort}`;
  }

  private static shortenLocationName(location: string): string {
    if (location.length <= 20) return location;

    // Try to extract key parts
    const parts = location.split(',');
    if (parts.length > 1) {
      return parts[0].trim();
    }

    return location.substring(0, 17) + '...';
  }

  private static calculateAveragePrice(existing: FavoriteRoute, newItem: ProtectionAssignmentHistoryItem | FavoriteRoute): number {
    const newPrice = 'estimatedCost' in newItem ? newItem.estimatedCost : newItem.averagePrice;
    return Math.round(((existing.averagePrice * existing.count) + newPrice) / (existing.count + 1));
  }

  private static recalculateAverageAssignmentValue(analytics: PersonalizationAnalytics, newItem: ProtectionAssignmentHistoryItem): number {
    return Math.round(((analytics.averageAssignmentValue * (analytics.totalProtectionAssignments - 1)) + newItem.estimatedCost) / analytics.totalProtectionAssignments);
  }

  private static getMostCommonRoute(protectionAssignments: ProtectionAssignmentHistoryItem[]): ProtectionAssignmentHistoryItem | null {
    const routeCounts = protectionAssignments.reduce((acc, assignment) => {
      const key = `${assignment.from}|${assignment.to}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonRoute = Object.entries(routeCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (!mostCommonRoute) return null;

    const [routeKey] = mostCommonRoute;
    const [from, to] = routeKey.split('|');

    return protectionAssignments.find(a => a.from === from && a.to === to) || null;
  }

  private static getDayName(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }

  private static getSeason(monthIndex: number): string {
    if (monthIndex >= 2 && monthIndex <= 4) return 'Spring';
    if (monthIndex >= 5 && monthIndex <= 7) return 'Summer';
    if (monthIndex >= 8 && monthIndex <= 10) return 'Autumn';
    return 'Winter';
  }

  /**
   * Clear all booking history and personalization data
   */
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.BOOKING_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.FAVORITE_ROUTES);
    localStorage.removeItem(STORAGE_KEYS.PERSONALIZATION_ANALYTICS);
  }

  /**
   * Export booking data for user download
   */
  static exportProtectionAssignmentData(): string {
    const history = this.getBookingHistory();
    const favorites = this.getFavoriteRoutes();
    const analytics = this.getPersonalizationAnalytics();

    return JSON.stringify({
      exportDate: new Date().toISOString(),
      bookingHistory: history,
      favoriteRoutes: favorites,
      analytics: analytics,
    }, null, 2);
  }
}