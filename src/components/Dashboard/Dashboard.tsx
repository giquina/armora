import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { ServiceCard } from './ServiceCard';
import { ImpactDashboardWidget } from './ImpactDashboardWidget';
import { MarketingBanner } from './MarketingBanner';
import { SmartRecommendation } from './SmartRecommendation';
import { BookingSearchInterface } from './BookingSearchInterface';
import SafeRideFundModal from '../SafeRideFund/SafeRideFundModal';
import { ServiceLevel } from '../../types';
// import { getDisplayName } from '../../utils/nameUtils'; // Removed since header is no longer displayed
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
  const [showRewardBanner, setShowRewardBanner] = useState(false);
  const [showSafeRideModal, setShowSafeRideModal] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);


  // Check if user has unlocked reward and hasn't dismissed banner
  useEffect(() => {
    // ALWAYS show reward banner for eligible users (non-guests)
    const isEligible = user?.userType !== 'guest';
    const hasSeenBanner = localStorage.getItem('armora_reward_banner_dismissed');
    setShowRewardBanner(Boolean(isEligible && !hasSeenBanner));
  }, [user]);


  const handleUpgradeAccount = () => {
    navigateToView('signup');
  };

  const handleDismissReward = () => {
    setShowRewardBanner(false);
    localStorage.setItem('armora_reward_banner_dismissed', 'true');
  };

  const handleServiceSelection = (serviceId: string) => {
    // Store selected service for future booking
    localStorage.setItem('armora_selected_service', serviceId);

    // Navigate directly to booking page
    navigateToView('booking');

    // Analytics
    console.log('[Analytics] Service selected from recommendation', {
      serviceId,
      timestamp: Date.now(),
      userType: user?.userType
    });
  };

  const handleDirectBooking = (service: ServiceLevel) => {
    // Store selected service and skip service selection step
    localStorage.setItem('armora_selected_service', service.id);

    // Navigate directly to booking page - this will skip the service selection step
    navigateToView('booking');

    // Analytics for direct booking from dashboard cards
    console.log('[Analytics] Direct booking from dashboard card', {
      serviceId: service.id,
      timestamp: Date.now(),
      userType: user?.userType,
      source: 'dashboard_card'
    });
  };


  const handleQuickBookPreset = (preset: 'airport' | 'commute') => {
    // Set default service (Executive for airport, Standard for commute)
    const serviceId = preset === 'airport' ? 'executive' : 'standard';
    localStorage.setItem('armora_selected_service', serviceId);

    // Set preset-specific data
    if (preset === 'airport') {
      localStorage.setItem('armora_quick_destination', 'London Heathrow Airport (LHR)');
      localStorage.setItem('armora_booking_preset', 'airport');
    } else if (preset === 'commute') {
      localStorage.setItem('armora_booking_preset', 'commute');
    }

    navigateToView('booking');

    console.log('[Analytics] Quick book preset used', {
      preset,
      serviceId,
      timestamp: Date.now(),
      userType: user?.userType,
      source: 'quick_book_preset'
    });
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
        {/* Booking Search Interface for Guests */}
        <BookingSearchInterface />

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
                className={styles.upgradeButton}
              >
                Create Free Account
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
                userType={user?.userType}
                onDirectBook={handleDirectBooking}
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
      {/* Booking Search Interface - Uber-style "Where to?" */}
      <BookingSearchInterface />

      {/* Reward Banner */}
      {showRewardBanner && (
        <div className={styles.rewardBanner} onClick={() => navigateToView('booking')}>
          <div className={styles.rewardContent}>
            <div className={styles.rewardIcon}>🏆</div>
            <div className={styles.rewardText}>
              <h3 className={styles.rewardTitle}>🎉 ACHIEVEMENT UNLOCKED!</h3>
              <div className={styles.discountValue}>50% OFF</div>
              <div className={styles.rewardDetails}>
                <span className={styles.rewardDescription}>
                  Your first ride (up to £15) • Valid 30 days
                </span>
                <span className={styles.rewardCTA}>Secure Your Journey →</span>
              </div>
            </div>
            <button
              className={styles.dismissButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDismissReward();
              }}
              aria-label="Dismiss reward banner"
            >
              ×
            </button>
          </div>
        </div>
      )}


      {/* Impact Widget for Essential Members */}
      <ImpactDashboardWidget />

      {/* Smart Recommendation - Condensed Version */}
      <SmartRecommendation
        services={ARMORA_SERVICES}
        user={user}
        questionnaireData={questionnaireData}
        onServiceSelect={handleServiceSelection}
      />

      {/* Quick Actions Carousel */}
      <div className={styles.quickActionsSection}>
        <div className={styles.quickActionsHeader}>
          <h2 className={styles.quickActionsTitle}>Security Services</h2>
        </div>
        <div className={styles.quickActionsCarousel}>
          <div className={styles.carouselContainer}>
            <div
              className={styles.carouselTrack}
              onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft;
                const cardWidth = 280 + 16; // Card width + gap
                const index = Math.round(scrollLeft / cardWidth);
                setActiveCarouselIndex(Math.min(index, 5)); // Max 6 cards (0-5)
              }}
            >
              <button
                className={styles.carouselCard}
                onClick={() => handleQuickBookPreset('airport')}
              >
                <span className={styles.quickActionIcon}>✈️</span>
                <span className={styles.quickActionText}>Airport Transfer</span>
                <span className={styles.quickActionSubtext}>Fast setup</span>
              </button>

              <button
                className={styles.carouselCard}
                onClick={() => handleQuickBookPreset('commute')}
              >
                <span className={styles.quickActionIcon}>🏢</span>
                <span className={styles.quickActionText}>Daily Commute</span>
                <span className={styles.quickActionSubtext}>Regular route</span>
              </button>

              <button
                className={styles.carouselCard}
                onClick={() => navigateToView('venue-protection-welcome')}
              >
                <span className={styles.quickActionIcon}>🏛️</span>
                <span className={styles.quickActionText}>Venue Security</span>
                <span className={styles.quickActionSubtext}>Book protection</span>
              </button>

              <button
                className={styles.carouselCard}
                onClick={() => navigateToView('booking')}
              >
                <span className={styles.quickActionIcon}>📅</span>
                <span className={styles.quickActionText}>Schedule Ride</span>
                <span className={styles.quickActionSubtext}>Plan ahead</span>
              </button>

              <button
                className={styles.carouselCard}
                onClick={() => {
                  localStorage.setItem('armora_selected_service', 'executive');
                  navigateToView('booking');
                }}
              >
                <span className={styles.quickActionIcon}>👔</span>
                <span className={styles.quickActionText}>Executive Service</span>
                <span className={styles.quickActionSubtext}>VIP transport</span>
              </button>

              <button
                className={styles.carouselCard}
                onClick={() => setShowSafeRideModal(true)}
              >
                <span className={styles.quickActionIcon}>🛡️</span>
                <span className={styles.quickActionText}>Safe Ride Fund</span>
                <span className={styles.quickActionSubtext}>Donate</span>
              </button>
            </div>
          </div>

          {/* Scroll Indicators */}
          <div className={styles.carouselIndicators}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                className={`${styles.carouselIndicator} ${
                  activeCarouselIndex === index ? styles.active : ''
                }`}
                onClick={() => {
                  const track = document.querySelector(`.${styles.carouselTrack}`) as HTMLElement;
                  if (track) {
                    const cardWidth = 280 + 16; // Card width + gap
                    track.scrollTo({
                      left: index * cardWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                aria-label={`Go to security service section ${index + 1} of 6`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Service Overview Section */}
      <div id="service-overview" className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Your Security Transport Options
          </h2>
          <p className={styles.sectionDescription}>
            Professional security drivers available 24/7 with premium fleet vehicles
          </p>
        </div>
        <div className={styles.servicesGrid}>
          {ARMORA_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={false}
              onSelect={() => {}} // No selection - just display
              mode="preview" // Info display only
              isRecommended={recommendedService === service.id}
              userType={user?.userType}
              onDirectBook={handleDirectBooking}
            />
          ))}
        </div>

        {/* Main Book Now CTA */}
        <div className={styles.mainCTA}>
          <button
            className={styles.bookNowMainButton}
            onClick={() => navigateToView('booking')}
          >
            🚀 Book Your Secure Transport
          </button>
          <p className={styles.ctaSubtext}>
            Complete your booking in just 3 simple steps
          </p>
        </div>
      </div>


      {/* Marketing Banner for Non-Members */}
      <MarketingBanner
        onTrialStart={() => navigateToView('booking')}
        currentUser={user}
        variant="savings"
      />

      {/* Event Security CTA */}
      <div className={styles.eventCTA}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaIcon}>🛡️</div>
          <h3 className={styles.ctaHeadline}>Also Need Event Security?</h3>
          <p className={styles.ctaDescription}>
            Professional protection for weddings, corporate events & special occasions
          </p>
          <div className={styles.ctaSocialProof}>200+ events protected</div>
          <button
            className={styles.ctaButton}
            onClick={() => navigateToView('services')}
          >
            Explore Event Services →
          </button>
        </div>
      </div>

      {/* Safe Ride Fund Modal */}
      {showSafeRideModal && (
        <SafeRideFundModal onClose={() => setShowSafeRideModal(false)} />
      )}
    </div>
  );
}