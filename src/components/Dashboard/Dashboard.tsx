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
import { getAllServices } from '../../data/standardizedServices';
import styles from './Dashboard.module.css';

// Convert standardized services to legacy ServiceLevel format for compatibility
const convertToServiceLevel = (): ServiceLevel[] => {
  return getAllServices().map(service => ({
    id: service.id,
    name: service.name,
    tagline: service.tagline,
    price: service.priceDisplay,
    hourlyRate: service.hourlyRate,
    // Vehicle and capacity data - standardized for all services
    vehicle: service.id === 'standard' ? 'Nissan Leaf EV' :
             service.id === 'executive' ? 'BMW 5 Series' :
             service.id === 'client-vehicle' ? 'Your Personal Vehicle' : 'Armored BMW X5',
    capacity: service.id === 'client-vehicle' ? 'Any vehicle size' : '4 passengers',
    driverQualification: service.id === 'standard' || service.id === 'client-vehicle' ? 'SIA Level 2 Security Certified' :
                        service.id === 'executive' ? 'SIA Level 3 Security Certified' : 'Special Forces Trained',
    description: service.description,
    features: service.features.map(f => f.text) // Convert from {icon, text} to string array
  }));
};

const ARMORA_SERVICES: ServiceLevel[] = convertToServiceLevel();

export function Dashboard() {
  const { state, navigateToView } = useApp();
  const { user, questionnaireData, deviceCapabilities } = state;
  const [selectedService, setLocalSelectedService] = useState<'standard' | 'executive' | 'shadow' | 'client-vehicle' | null>(null);
  const [showRewardBanner, setShowRewardBanner] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [focusedServiceId, setFocusedServiceId] = useState<string | null>(null);
  // const [bookingMode, setBookingMode] = useState<'book-now' | 'schedule' | null>(null);
  const [locationData, setLocationData] = useState<LocationSection | null>(null);
  const [showLocationFirst, setShowLocationFirst] = useState(true);

  // Handle ESC key to close modal - FIXED: Improved scroll management
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showScheduling) {
        setShowScheduling(false);
      }
    };

    if (showScheduling) {
      document.addEventListener('keydown', handleEscKey);
      // Store original overflow value before hiding
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscKey);
        // Restore original overflow or default to visible
        document.body.style.overflow = originalOverflow || 'visible';
      };
    } else {
      // Ensure scroll is enabled when modal is not showing
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
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

  const handleServiceSelect = (serviceId: 'standard' | 'executive' | 'shadow' | 'client-vehicle') => {
    setLocalSelectedService(serviceId);
    // Store selected service for booking flow
    localStorage.setItem('armora_selected_service', serviceId);
    // Reset scheduling state when changing services
    setShowScheduling(false);
    setScheduledDateTime('');

    // Auto-scroll to booking confirmation after service selection
    setTimeout(() => {
      scrollToSection('booking-confirmation');
    }, 300);
  };

  const handleScheduleSelect = (serviceId: 'standard' | 'executive' | 'shadow' | 'client-vehicle') => {
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

  const handleDirectBooking = (serviceId: 'standard' | 'executive' | 'shadow' | 'client-vehicle') => {
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
    setLocalSelectedService(serviceId as 'standard' | 'executive' | 'shadow' | 'client-vehicle');
    setFocusedServiceId(serviceId);

    // Store for booking flow
    localStorage.setItem('armora_selected_service', serviceId);

    // Auto-scroll to destination input section
    setTimeout(() => {
      const destinationInput = document.getElementById('dropoff-location');
      if (destinationInput) {
        // Scroll to the destination input with smooth behavior and center it
        destinationInput.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Focus the input after scrolling completes
        setTimeout(() => {
          (destinationInput as HTMLInputElement).focus();
        }, 600);
      } else {
        // Fallback to location section if input not found
        scrollToSection('location-input');
      }
    }, 300);

    // Analytics
    console.log('[Analytics] Service selected from recommendation', {
      serviceId,
      timestamp: Date.now(),
      userType: user?.userType
    });
  };

  // Smooth scroll to next section with header offset
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Handle location completion and auto-scroll to services
  const handleLocationCompletion = () => {
    setTimeout(() => {
      scrollToSection('service-selection');
    }, 500); // Small delay for better UX
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

    // USE QUESTIONNAIRE-BASED RECOMMENDATION: Use the actual recommendation from questionnaire analysis
    const questionnaireBased = questionnaireData.recommendedService;

    // Map the questionnaire recommendations to service IDs
    if (questionnaireBased === 'armora-shadow') return 'shadow';
    if (questionnaireBased === 'armora-executive') return 'executive';
    if (questionnaireBased === 'armora-standard' || questionnaireBased === 'armora-secure') return 'standard';
    if (questionnaireBased === 'armora-client-vehicle') return 'client-vehicle';

    // For users who prefer cost savings, occasionally recommend client vehicle
    // This would be based on budget preferences in real implementation

    // Default fallback to standard if no clear recommendation
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
        <div id="location-input">
          <LocationPlanningSection
            onLocationSet={handleLocationSet}
            onCompletionScroll={handleLocationCompletion}
            isDisabled={isNavigating}
          />
        </div>
      )}

      {/* Service Selection */}
      <div id="service-selection" className={styles.servicesSection}>
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

      {/* Booking Confirmation Section - Shows when service is selected */}
      {selectedService && locationData && (
        <div id="booking-confirmation" className={styles.bookingConfirmation}>
          <div className={styles.confirmationCard}>
            <h3 className={styles.confirmationTitle}>🎯 Ready to Book</h3>
            <div className={styles.confirmationDetails}>
              <div className={styles.confirmationItem}>
                <span className={styles.confirmationLabel}>Service:</span>
                <span className={styles.confirmationValue}>
                  {ARMORA_SERVICES.find(s => s.id === selectedService)?.name}
                </span>
              </div>
              <div className={styles.confirmationItem}>
                <span className={styles.confirmationLabel}>Route:</span>
                <span className={styles.confirmationValue}>
                  {locationData.pickupLocation.address} → {locationData.dropoffLocation.address}
                </span>
              </div>
              {locationData.journeyEstimate && (
                <div className={styles.confirmationItem}>
                  <span className={styles.confirmationLabel}>Estimate:</span>
                  <span className={styles.confirmationValue}>
                    {locationData.journeyEstimate.distance} • {locationData.journeyEstimate.duration}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.confirmationActions}>
              <button
                className={styles.bookNowButton}
                onClick={handleBookNow}
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <LoadingSpinner size="small" variant="light" text="Processing..." inline />
                ) : (
                  <>🚀 Complete Booking</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Banner for Non-Members */}
      <MarketingBanner 
        onTrialStart={handleBookNow}
        currentUser={user}
        variant="savings"
      />
    </div>
  );
}