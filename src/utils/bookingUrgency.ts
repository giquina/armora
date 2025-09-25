// Booking Urgency and Availability System
// Creates realistic urgency indicators and availability status

interface AvailabilityInfo {
  status: 'available' | 'limited' | 'high-demand' | 'very-busy';
  officersNearby: number;
  estimatedWaitTime: string;
  nextAvailable: string;
  urgencyMessage?: string;
  socialProofMessage?: string;
  demandLevel: 'low' | 'medium' | 'high' | 'surge';
}

interface ServiceAvailability {
  serviceId: string;
  availability: AvailabilityInfo;
  isPeakTime: boolean;
  priceModifier: number; // 1.0 = normal, 1.2 = 20% surge, etc.
}

class BookingUrgencyService {
  private static lastUpdated: number = 0;
  private static cachedAvailability: ServiceAvailability[] = [];
  private static readonly CACHE_DURATION = 30000; // 30 seconds

  // Get availability info for all services
  static getServicesAvailability(): ServiceAvailability[] {
    const now = Date.now();

    // Return cached data if still fresh
    if (this.cachedAvailability.length > 0 && (now - this.lastUpdated) < this.CACHE_DURATION) {
      return this.cachedAvailability;
    }

    // Generate fresh availability data
    this.cachedAvailability = this.generateAvailabilityData();
    this.lastUpdated = now;

    return this.cachedAvailability;
  }

  // Get availability for specific service
  static getServiceAvailability(serviceId: string): ServiceAvailability | null {
    const availability = this.getServicesAvailability();
    return availability.find(s => s.serviceId === serviceId) || null;
  }

  // Generate realistic availability data based on time and patterns
  private static generateAvailabilityData(): ServiceAvailability[] {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isBusinessHours = hour >= 8 && hour <= 18;
    const isPeakTime = this.isPeakTime(hour, dayOfWeek);

    const services = [
      { id: 'standard', baseOfficers: 25, surgeMultiplier: 1.2 },
      { id: 'executive', baseOfficers: 12, surgeMultiplier: 1.4 },
      { id: 'shadow', baseOfficers: 8, surgeMultiplier: 1.6 }
    ];

    return services.map(service => ({
      serviceId: service.id,
      availability: this.calculateAvailability(service, isPeakTime, isWeekend, isBusinessHours),
      isPeakTime,
      priceModifier: this.calculatePriceModifier(service.id, isPeakTime, isWeekend)
    }));
  }

  // Determine if current time is peak demand
  private static isPeakTime(hour: number, dayOfWeek: number): boolean {
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    // Weekday peak times: 7-9 AM, 5-7 PM
    if (isWeekday) {
      return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    }

    // Weekend peak times: 10 AM - 2 PM, 7-10 PM
    return (hour >= 10 && hour <= 14) || (hour >= 19 && hour <= 22);
  }

  // Calculate availability metrics for a service
  private static calculateAvailability(
    service: { id: string; baseOfficers: number; surgeMultiplier: number },
    isPeakTime: boolean,
    isWeekend: boolean,
    isBusinessHours: boolean
  ): AvailabilityInfo {
    // Base Protection Officer availability with random variation
    let officersNearby = service.baseOfficers;

    // Apply time-based modifiers
    if (isPeakTime) {
      officersNearby = Math.floor(officersNearby * 0.6); // 40% reduction during peak
    } else if (!isBusinessHours && !isWeekend) {
      officersNearby = Math.floor(officersNearby * 0.8); // 20% reduction off-hours
    } else if (isWeekend) {
      officersNearby = Math.floor(officersNearby * 0.9); // 10% reduction weekends
    }

    // Add random variation (±20%)
    const variation = 0.2;
    officersNearby = Math.floor(officersNearby * (1 + (Math.random() - 0.5) * variation));
    officersNearby = Math.max(officersNearby, 1); // Minimum 1 Protection Officer

    return this.determineAvailabilityStatus(officersNearby, service.id, isPeakTime);
  }

  // Determine status and messages based on Protection Officer count
  private static determineAvailabilityStatus(
    officersNearby: number,
    serviceId: string,
    isPeakTime: boolean
  ): AvailabilityInfo {
    let status: AvailabilityInfo['status'];
    let estimatedWaitTime: string;
    let nextAvailable: string;
    let demandLevel: AvailabilityInfo['demandLevel'];
    let urgencyMessage: string | undefined;
    let socialProofMessage: string | undefined;

    if (officersNearby >= 15) {
      status = 'available';
      estimatedWaitTime = '3-5 minutes';
      nextAvailable = 'Now';
      demandLevel = 'low';
      socialProofMessage = `${officersNearby} Protection Officers nearby`;
    } else if (officersNearby >= 8) {
      status = 'available';
      estimatedWaitTime = '5-8 minutes';
      nextAvailable = 'Now';
      demandLevel = 'medium';
      socialProofMessage = `${officersNearby} Protection Officers available`;
    } else if (officersNearby >= 4) {
      status = 'limited';
      estimatedWaitTime = '8-12 minutes';
      nextAvailable = 'Now';
      demandLevel = 'medium';
      urgencyMessage = 'Limited availability';
      socialProofMessage = `${officersNearby} Protection Officers remaining`;
    } else if (officersNearby >= 2) {
      status = 'high-demand';
      estimatedWaitTime = '12-20 minutes';
      nextAvailable = 'Now';
      demandLevel = 'high';
      urgencyMessage = 'High demand area';
      socialProofMessage = `Only ${officersNearby} Protection Officers available`;
    } else {
      status = 'very-busy';
      estimatedWaitTime = '20-35 minutes';
      nextAvailable = this.generateNextAvailableTime();
      demandLevel = 'surge';
      urgencyMessage = 'Very high demand';
      socialProofMessage = 'Last Protection Officer booked 8 minutes ago';
    }

    // Add peak time urgency
    if (isPeakTime && status !== 'available') {
      urgencyMessage = urgencyMessage + ' • Peak hours';
    }

    return {
      status,
      officersNearby,
      estimatedWaitTime,
      nextAvailable,
      urgencyMessage,
      socialProofMessage,
      demandLevel
    };
  }

  // Calculate dynamic pricing modifier
  private static calculatePriceModifier(serviceId: string, isPeakTime: boolean, isWeekend: boolean): number {
    let modifier = 1.0;

    // Base surge for peak times
    if (isPeakTime) {
      modifier = 1.15; // 15% surge during peak
    }

    // Weekend modifiers
    if (isWeekend && !isPeakTime) {
      modifier = 1.05; // 5% weekend premium
    }

    // Service-specific modifiers (premium services have higher surge)
    switch (serviceId) {
      case 'executive':
        modifier *= 1.1;
        break;
      case 'shadow':
        modifier *= 1.2;
        break;
    }

    // Random market variation (±3%)
    modifier *= 1 + (Math.random() - 0.5) * 0.06;

    return Math.round(modifier * 100) / 100; // Round to 2 decimal places
  }

  // Generate next available time for very busy periods
  private static generateNextAvailableTime(): string {
    const now = new Date();
    const nextSlot = new Date(now.getTime() + (15 + Math.random() * 20) * 60000); // 15-35 min

    return nextSlot.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Get recent booking activity message
  static getRecentActivityMessage(): string {
    const activities = [
      'Last booked 3 minutes ago',
      'Last booked 7 minutes ago',
      'Last booked 12 minutes ago',
      '2 bookings in the last hour',
      '5 bookings in the last hour',
      '8 bookings in the last hour',
      'Most popular choice today',
      'Booked 15 times today',
      'Trending with business users',
      'Popular with VIP clients',
      'High demand in this area',
      'Preferred by executives'
    ];

    return activities[Math.floor(Math.random() * activities.length)];
  }

  // Get urgency indicator for UI
  static getUrgencyIndicator(availability: AvailabilityInfo): {
    color: string;
    icon: string;
    pulse: boolean;
  } {
    switch (availability.status) {
      case 'available':
        return { color: '#22c55e', icon: '🟢', pulse: false };
      case 'limited':
        return { color: '#f59e0b', icon: '🟡', pulse: true };
      case 'high-demand':
        return { color: '#ef4444', icon: '🟠', pulse: true };
      case 'very-busy':
        return { color: '#dc2626', icon: '🔴', pulse: true };
      default:
        return { color: '#6b7280', icon: '⚫', pulse: false };
    }
  }

  // Get pricing display info
  static getPricingDisplay(serviceId: string, basePrice: number): {
    displayPrice: string;
    surgeInfo?: string;
    priceColor: string;
  } {
    const availability = this.getServiceAvailability(serviceId);
    if (!availability) {
      return {
        displayPrice: `£${basePrice}`,
        priceColor: '#e0e0e0'
      };
    }

    const adjustedPrice = Math.round(basePrice * availability.priceModifier);
    const isSurge = availability.priceModifier > 1.05;

    return {
      displayPrice: isSurge ? `£${adjustedPrice}` : `£${basePrice}`,
      surgeInfo: isSurge ? `+${Math.round((availability.priceModifier - 1) * 100)}%` : undefined,
      priceColor: isSurge ? '#f59e0b' : '#e0e0e0'
    };
  }

  // Simulate real-time updates (call this periodically)
  static invalidateCache(): void {
    this.cachedAvailability = [];
    this.lastUpdated = 0;
  }

  // Get business insights for analytics
  static getBusinessInsights(): {
    totalActiveDrivers: number;
    peakDemandServices: string[];
    averageWaitTime: number;
    surgeActive: boolean;
  } {
    const availability = this.getServicesAvailability();

    const totalActiveDrivers = availability.reduce((sum, s) => sum + s.availability.officersNearby, 0);
    const peakDemandServices = availability
      .filter(s => s.availability.status === 'high-demand' || s.availability.status === 'very-busy')
      .map(s => s.serviceId);

    const avgWaitTimeMinutes = availability.reduce((sum, s) => {
      const waitStr = s.availability.estimatedWaitTime;
      const minutes = parseInt(waitStr.split('-')[0]) || 5;
      return sum + minutes;
    }, 0) / availability.length;

    const surgeActive = availability.some(s => s.priceModifier > 1.05);

    return {
      totalActiveDrivers,
      peakDemandServices,
      averageWaitTime: Math.round(avgWaitTimeMinutes),
      surgeActive
    };
  }
}

export { BookingUrgencyService };
export type { AvailabilityInfo, ServiceAvailability };