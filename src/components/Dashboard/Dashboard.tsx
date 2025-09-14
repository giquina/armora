import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { ServiceCard } from './ServiceCard';
import { ImpactDashboardWidget } from './ImpactDashboardWidget';
import { MarketingBanner } from './MarketingBanner';
import { LocationPlanningSection } from './LocationPlanningSection';
import { SmartRecommendation } from './SmartRecommendation';
// import { SchedulingPicker } from '../UI/SchedulingPicker'; // Replaced with new QuickScheduling system
import { ResponsiveModal } from '../UI/ResponsiveModal';
import { QuickScheduling } from '../UI/QuickScheduling';
import { ServiceLevel, LocationSection } from '../../types';
import { getDisplayName } from '../../utils/nameUtils';
import styles from './Dashboard.module.css';

const ARMORA_SERVICES: ServiceLevel[] = [
  {
    id: 'standard',
    name: 'Armora Secure',
    tagline: 'Professional Security Transport',
    price: '£45/hour',
    hourlyRate: 45,
    vehicle: 'Nissan Leaf EV',
    capacity: '4 passengers',
    driverQualification: 'SIA Level 2 Security Certified',
    description: 'Professional security-aware drivers providing discreet protection in eco-friendly vehicles',
    features: [
      'Trained security-aware drivers',
      'Discreet vehicle selection (Nissan Leaf EV)',
      'Real-time safety monitoring',
      'Emergency response protocols',
      'Background-checked professionals',
      'Eco-friendly professional transport'
    ]
  },
  {
    id: 'executive',
    name: 'Armora Executive',
    tagline: 'Enhanced Security & Luxury',
    price: '£75/hour',
    hourlyRate: 75,
    vehicle: 'BMW 5 Series',
    capacity: '4 passengers',
    driverQualification: 'SIA Level 3 Security Certified',
    description: 'Premium luxury vehicles with enhanced security protocols and executive protection',
    features: [
      'SIA Level 3 certified security drivers',
      'Advanced threat assessment training',
      'Luxury vehicle with security modifications',
      'Priority safety response',
      'Executive protection protocols',
      'Discrete security professionals'
    ]
  },
  {
    id: 'shadow',
    name: 'Armora Shadow',
    tagline: 'Maximum Security Protection',
    price: '£65/hour',
    hourlyRate: 65,
    vehicle: 'Armored BMW X5',
    capacity: '4 passengers',
    driverQualification: 'Special Forces Trained',
    description: 'Premium tactical security transport with specialized protection protocols',
    features: [
      'Special Forces trained drivers',
      'Armored vehicle specifications',
      'Counter-surveillance techniques',
      'Tactical route planning',
      'Close protection specialist team',
      'Government-level security protocols'
    ]
  }
];

export function Dashboard() {
  const { state, navigateToView } = useApp();
  const { user, questionnaireData, deviceCapabilities } = state;
  const [selectedService, setLocalSelectedService] = useState<'standard' | 'executive' | 'shadow' | null>(null);
  const [showRewardBanner, setShowRewardBanner] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [focusedServiceId, setFocusedServiceId] = useState<string | null>(null);
  // const [bookingMode, setBookingMode] = useState<'book-now' | 'schedule' | null>(null);
  const [locationData, setLocationData] = useState<LocationSection | null>(null);
  const [showLocationFirst, setShowLocationFirst] = useState(true);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showScheduling) {
        setShowScheduling(false);
      }
    };

    if (showScheduling) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showScheduling]);
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  // Check if user has unlocked reward and hasn't dismissed banner
  useEffect(() => {
    // ALWAYS show reward banner for eligible users (non-guests)
    const isEligible = user?.userType !== 'guest';
    const hasSeenBanner = localStorage.getItem('armora_reward_banner_dismissed');
    setShowRewardBanner(Boolean(isEligible && !hasSeenBanner));
  }, [user]);

  const handleServiceSelect = (serviceId: 'standard' | 'executive' | 'shadow') => {
    setLocalSelectedService(serviceId);
    // Store selected service for booking flow
    localStorage.setItem('armora_selected_service', serviceId);
    // Reset scheduling state when changing services
    setShowScheduling(false);
    setScheduledDateTime('');
  };

  const handleScheduleSelect = (serviceId: 'standard' | 'executive' | 'shadow') => {
    // Set the selected service first
    setLocalSelectedService(serviceId);
    localStorage.setItem('armora_selected_service', serviceId);

    // Enter focused mode
    setFocusedServiceId(serviceId);
    // setBookingMode('schedule');
    setShowScheduling(true);

    // Simple analytics placeholder
    console.log('[Analytics] Scheduling modal opened', { serviceId, ts: Date.now() });
  };

  const handleDirectBooking = (serviceId: 'standard' | 'executive' | 'shadow') => {
    // Set the selected service first
    setLocalSelectedService(serviceId);
    localStorage.setItem('armora_selected_service', serviceId);

    // Enter focused mode
    setFocusedServiceId(serviceId);
    // setBookingMode('book-now');

    // Store immediate booking preference and proceed
    localStorage.setItem('armora_booking_immediate', 'true');
    handleBookNow();
  };

  const handleCancelFocusedMode = () => {
    setFocusedServiceId(null);
    // setBookingMode(null);
    setShowScheduling(false);
    setScheduledDateTime('');
    console.log('[Analytics] User cancelled focused mode, returning to service selection');
  };

  // Determine which services should be visible
  const shouldShowService = (serviceId: string) => {
    if (!focusedServiceId) return true; // Show all when no service is focused
    return serviceId === focusedServiceId; // Only show focused service when in focused mode
  };

  const handleBookNow = async () => {
    setIsNavigating(true);

    // Store scheduling information for the booking flow
    if (scheduledDateTime) {
      localStorage.setItem('armora_scheduled_datetime', scheduledDateTime);
      localStorage.setItem('armora_booking_immediate', 'false');
    } else {
      localStorage.setItem('armora_booking_immediate', 'true');
      localStorage.removeItem('armora_scheduled_datetime');
    }

    // Brief loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (user?.userType === 'guest') {
      // Guest users need to create account first
      navigateToView('signup');
    } else {
      // Navigate to booking flow
      navigateToView('booking');
    }

    setIsNavigating(false);
  };

  const handleUpgradeAccount = () => {
    navigateToView('signup');
  };

  const handleDismissReward = () => {
    setShowRewardBanner(false);
    localStorage.setItem('armora_reward_banner_dismissed', 'true');
  };

  const handleServiceSelection = (serviceId: string) => {
    // Set selected service and navigate directly to service focus
    setLocalSelectedService(serviceId as 'standard' | 'executive' | 'shadow');
    setFocusedServiceId(serviceId);

    // Store for booking flow
    localStorage.setItem('armora_selected_service', serviceId);

    // Analytics
    console.log('[Analytics] Service selected from recommendation', {
      serviceId,
      timestamp: Date.now(),
      userType: user?.userType
    });
  };

  const handleLocationSet = (location: LocationSection) => {
    setLocationData(location);
    setShowLocationFirst(false);

    // Store location data for booking flow
    localStorage.setItem('armora_location_data', JSON.stringify({
      pickup: location.pickupLocation.address,
      destination: location.dropoffLocation.address,
      estimatedDistance: location.journeyEstimate ? parseFloat(location.journeyEstimate.distance) : 0,
      estimatedDuration: location.journeyEstimate ? parseEstimatedMinutes(location.journeyEstimate.duration) : 0,
      coordinates: {
        pickup: location.pickupLocation.coordinates,
        dropoff: location.dropoffLocation.coordinates
      }
    }));

    // Analytics
    console.log('[Analytics] Location set', {
      hasPickup: Boolean(location.pickupLocation.address),
      hasDropoff: Boolean(location.dropoffLocation.address),
      usedCurrentLocation: location.pickupLocation.current,
      hasEstimate: Boolean(location.journeyEstimate),
      timestamp: Date.now()
    });
  };

  const parseEstimatedMinutes = (duration: string): number => {
    const hourMatch = duration.match(/(\d+)h/);
    const minuteMatch = duration.match(/(\d+)m/);

    let totalMinutes = 0;
    if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
    if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);

    return totalMinutes || 30; // Default to 30 minutes if parsing fails
  };

  const getPersonalizedRecommendation = () => {
    if (!questionnaireData) return null;

    // UNIVERSAL RECOMMENDATION: Always recommend Armora Secure (Standard)
    // as it's the only currently available service option
    return 'standard';
  };

  const recommendedService = getPersonalizedRecommendation();

  // For guest users - show limited interface
  if (user?.userType === 'guest') {
    return (
      <div className={styles.dashboard}>
        {/* Guest Header */}
        <div className={styles.guestHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              Armora Security Transport
            </h1>
            <p className={styles.subtitle}>
              View our premium security services
            </p>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className={styles.upgradeSection}>
          <div className={styles.upgradeCard}>
            <div className={styles.upgradeContent}>
              <h2 className={styles.upgradeTitle}>Create Account to Book</h2>
              <p className={styles.upgradeDescription}>
                Register now to unlock direct booking, personalized recommendations, 
                and exclusive rewards including 50% off your first ride.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                isFullWidth={deviceCapabilities.isMobile}
                onClick={handleUpgradeAccount}
                disabled={isNavigating}
                className={styles.upgradeButton}
              >
                {isNavigating ? (
                  <LoadingSpinner size="small" variant="light" text="Redirecting..." inline />
                ) : (
                  'Create Free Account'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Service Overview Cards */}
        <div className={styles.servicesSection}>
          <h2 className={styles.sectionTitle}>Our Security Transport Services</h2>
          <div className={styles.servicesGrid}>
            {ARMORA_SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={false}
                onSelect={() => {}} // No selection for guests
                mode="preview"
                isRecommended={false}
              />
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className={styles.contactSection}>
          <div className={styles.contactCard}>
            <h3 className={styles.contactTitle}>Need Immediate Assistance?</h3>
            <p className={styles.contactDescription}>
              Call our 24/7 security operations center for immediate booking assistance
            </p>
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Priority Support:</span>
                <a href="tel:+442071234567" className={styles.contactLink}>
                  +44 20 7123 4567
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Email:</span>
                <a href="mailto:operations@armora.security" className={styles.contactLink}>
                  operations@armora.security
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For registered users - show full dashboard
  return (
    <div className={styles.dashboard}>
      {/* Reward Banner */}
      {showRewardBanner && (
        <div className={styles.rewardBanner}>
          <div className={styles.rewardContent}>
            <div className={styles.rewardIcon}>🏆</div>
            <div className={styles.rewardText}>
              <h3 className={styles.rewardTitle}>🎉 ACHIEVEMENT UNLOCKED!</h3>
              <div className={styles.discountValue}>50% OFF</div>
              <p className={styles.rewardDescription}>
                Your first ride (up to £15) • Valid 30 days
              </p>
            </div>
            <button 
              className={styles.dismissButton}
              onClick={handleDismissReward}
              aria-label="Dismiss reward banner"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Your Personal Security Detail{user ? `, ${getDisplayName(user)}` : ''}
          </h1>
          <p className={styles.subtitle}>
            Professional security drivers at your service
          </p>
        </div>
      </div>


      {/* Impact Widget for Essential Members */}
      <ImpactDashboardWidget />

      {/* Smart Recommendation - Condensed Version */}
      <SmartRecommendation
        services={ARMORA_SERVICES}
        user={user}
        questionnaireData={questionnaireData}
        onServiceSelect={handleServiceSelection}
      />

      {/* Location Planning Section - NEW LOCATION-FIRST FLOW */}
      {showLocationFirst && (
        <LocationPlanningSection
          onLocationSet={handleLocationSet}
          isDisabled={isNavigating}
        />
      )}

      {/* Service Selection */}
      <div className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {focusedServiceId
              ? `Booking ${ARMORA_SERVICES.find(s => s.id === focusedServiceId)?.name}`
              : locationData
                ? `Step 2 of 3: Choose Your Security Level`
                : 'Select Your Security Level'}
          </h2>
          {locationData && (
            <div className={styles.journeyContext}>
              <span className={styles.journeyRoute}>
                📍 {locationData.pickupLocation.address} → 🏁 {locationData.dropoffLocation.address}
              </span>
              {locationData.journeyEstimate && (
                <span className={styles.journeyDetails}>
                  {locationData.journeyEstimate.distance} • {locationData.journeyEstimate.duration}
                </span>
              )}
            </div>
          )}
          {focusedServiceId && (
            <button
              className={styles.backToServicesButton}
              onClick={handleCancelFocusedMode}
              aria-label="Back to service selection"
            >
              ← Back to Services
            </button>
          )}
        </div>
        <div className={`${styles.servicesGrid} ${focusedServiceId ? styles.focusedMode : ''}`}>
          {ARMORA_SERVICES.filter(service => shouldShowService(service.id)).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={false}
              onSelect={handleServiceSelect}
              mode="selection"
              isRecommended={recommendedService === service.id}
              onBookNow={handleDirectBooking}
              onScheduleSelect={handleScheduleSelect}
            />
          ))}
        </div>
      </div>

      {/* New Responsive Scheduling Modal */}
      <ResponsiveModal
        isOpen={showScheduling}
        onClose={() => setShowScheduling(false)}
        position="bottom"
        animationType="slide"
      >
        <QuickScheduling
          onScheduleConfirmed={(dateTime: string, displayText: string) => {
            setScheduledDateTime(dateTime);
            console.log('[Analytics] Schedule confirmed', {
              service: selectedService,
              dateTime,
              displayText,
              timestamp: Date.now()
            });
            handleBookNow();
          }}
          onCancel={() => setShowScheduling(false)}
          isLoading={isNavigating}
          selectedService={selectedService ? ARMORA_SERVICES.find(s => s.id === selectedService)?.name.split(' ')[1] || 'Standard' : 'Standard'}
          userProfile={{
            isBusinessUser: user?.userType === 'registered' || user?.userType === 'google',
            preferredTime: '9:00', // Would come from user preferences in real implementation
            timeZone: 'Europe/London',
            recentBookings: [
              // This would come from user data in real implementation
              { time: '9:00 AM', date: 'Last Tuesday' },
              { time: '6:30 PM', date: 'Friday' }
            ]
          }}
        />
      </ResponsiveModal>

      {/* Personalized Recommendation moved above - this section removed */}


      {/* Marketing Banner for Non-Members */}
      <MarketingBanner 
        onTrialStart={handleBookNow}
        currentUser={user}
        variant="savings"
      />
    </div>
  );
}