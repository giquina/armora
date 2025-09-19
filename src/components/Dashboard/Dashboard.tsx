import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { ServiceCard } from './ServiceCard';
// import { CreatorImpactWidget } from './CreatorImpactWidget';
import { SmartRecommendation } from './SmartRecommendation';
import { BookingSearchInterface } from './BookingSearchInterface';
import { ProtectionStatus } from '../UI/ProtectionStatus';
import { FloatingSOSButton } from './FloatingSOSButton';
import { ActivityTicker } from './ActivityTicker';
// import ArmoraFoundationModal from '../ArmoraFoundation/ArmoraFoundationModal';
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
             service.id === 'client-vehicle' ? 'Your Personal Vehicle' : 'Protected BMW X5',
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
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);


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


  // Carousel navigation utilities
  const carouselCards = 5; // Total number of cards
  const getCarouselScrollPosition = (index: number) => {
    // Responsive card width + gap calculation
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (isMobile) {
      return index * (Math.min(window.innerWidth * 0.7, 320) + 12);
    } else if (isTablet) {
      return index * (320 + 16);
    } else {
      return index * (300 + 16);
    }
  };

  const scrollToCarouselIndex = useCallback((index: number) => {
    const container = document.getElementById('getStartedCarousel');
    if (container) {
      container.scrollTo({ left: getCarouselScrollPosition(index), behavior: 'smooth' });
      setCurrentCarouselIndex(index);
    }
  }, []);

  const navigateCarousel = useCallback((direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? Math.max(0, currentCarouselIndex - 1)
      : Math.min(carouselCards - 1, currentCarouselIndex + 1);
    scrollToCarouselIndex(newIndex);
  }, [currentCarouselIndex, scrollToCarouselIndex]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).closest('.carouselWrapper')) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            navigateCarousel('left');
            break;
          case 'ArrowRight':
            event.preventDefault();
            navigateCarousel('right');
            break;
          case 'Home':
            event.preventDefault();
            scrollToCarouselIndex(0);
            break;
          case 'End':
            event.preventDefault();
            scrollToCarouselIndex(carouselCards - 1);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentCarouselIndex, navigateCarousel, scrollToCarouselIndex]);

  // Update current index on scroll
  useEffect(() => {
    const container = document.getElementById('getStartedCarousel');
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      // Calculate card width dynamically based on screen size
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      let cardSpacing;
      if (isMobile) {
        cardSpacing = Math.min(window.innerWidth * 0.7, 320) + 12;
      } else if (isTablet) {
        cardSpacing = 320 + 16;
      } else {
        cardSpacing = 300 + 16;
      }

      const newIndex = Math.round(scrollLeft / cardSpacing);
      if (newIndex !== currentCarouselIndex && newIndex >= 0 && newIndex < carouselCards) {
        setCurrentCarouselIndex(newIndex);
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', throttledScroll, { passive: true });
    return () => container.removeEventListener('scroll', throttledScroll);
  }, [currentCarouselIndex]);

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
      {/* Achievement Banner - Moved to top for immediate visibility */}
      {showRewardBanner && (
        <div className={styles.rewardBanner} onClick={() => navigateToView('booking')}>
          <div className={styles.rewardContent}>
            <div className={styles.rewardIcon}>🏆</div>
            <div className={styles.rewardText}>
              <h3 className={styles.rewardTitle}>🎉 ACHIEVEMENT UNLOCKED!</h3>
              <div className={styles.discountValue}>50% OFF</div>
              <div className={styles.rewardDetails}>
                <span className={styles.rewardDescription}>
                  Save up to £15 • Valid 30 days
                </span>
                <span className={styles.rewardCTA}>Begin Protection →</span>
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

      {/* Booking Search Interface - Uber-style "Where to?" - Now below Achievement Banner */}
      <BookingSearchInterface />

      {/* Get Started Section - 5 Card Carousel - MOVED HERE */}
      <div className={styles.getStartedSection}>
        <div className={styles.getStartedHeader}>
          <h2 className={styles.getStartedTitle}>GET STARTED</h2>
          <div className={styles.getStartedUnderline}></div>
        </div>

        <div
          className={styles.carouselWrapper}
          role="region"
          aria-label="Get started carousel"
          tabIndex={0}
        >
          {/* Carousel Container */}
          <div
            className={styles.carouselContainer}
            id="getStartedCarousel"
            role="tabpanel"
            aria-live="polite"
            aria-atomic="false"
            aria-label={`Showing card ${currentCarouselIndex + 1} of ${carouselCards}`}
          >
            <div className={styles.carouselTrack}>
              {/* Card 1: RIDE NOW */}
              <button
                className={styles.getStartedCard}
                onClick={() => navigateToView('booking')}
              >
                <div className={styles.getStartedIcon}>⚡</div>
                <div className={styles.getStartedContent}>
                  <h3 className={styles.getStartedCardTitle}>Immediate Protection</h3>
                  <p className={styles.getStartedCardDescription}>Protection available now</p>
                  <p className={styles.getStartedCardDetails}>Officers ready in 2 minutes</p>
                </div>
                <div className={styles.getStartedArrow}>→</div>
              </button>

              {/* Card 2: AIRPORT */}
              <button
                className={styles.getStartedCard}
                onClick={() => {
                  localStorage.setItem('armora_booking_preset', 'airport');
                  localStorage.setItem('armora_quick_destination', 'London Heathrow Airport (LHR)');
                  navigateToView('booking');
                }}
              >
                <div className={styles.getStartedIcon}>✈️</div>
                <div className={styles.getStartedContent}>
                  <h3 className={styles.getStartedCardTitle}>Airport Protection</h3>
                  <p className={styles.getStartedCardDescription}>Secure airport service</p>
                  <p className={styles.getStartedCardDetails}>All London terminals</p>
                </div>
                <div className={styles.getStartedArrow}>→</div>
              </button>

              {/* Card 3: SCHEDULE */}
              <button
                className={styles.getStartedCard}
                onClick={() => {
                  localStorage.setItem('armora_booking_preset', 'schedule');
                  navigateToView('booking');
                }}
              >
                <div className={styles.getStartedIcon}>📅</div>
                <div className={styles.getStartedContent}>
                  <h3 className={styles.getStartedCardTitle}>Schedule Protection</h3>
                  <p className={styles.getStartedCardDescription}>Advance planning</p>
                  <p className={styles.getStartedCardDetails}>Pre-arrange protection detail</p>
                </div>
                <div className={styles.getStartedArrow}>→</div>
              </button>

              {/* Card 4: EXECUTIVE */}
              <button
                className={styles.getStartedCard}
                onClick={() => navigateToView('services')}
              >
                <div className={styles.getStartedIcon}>👔</div>
                <div className={styles.getStartedContent}>
                  <h3 className={styles.getStartedCardTitle}>Executive Protection</h3>
                  <p className={styles.getStartedCardDescription}>Enhanced security</p>
                  <p className={styles.getStartedCardDetails}>Senior CPOs • Premium vehicles</p>
                </div>
                <div className={styles.getStartedArrow}>→</div>
              </button>

              {/* Card 5: EVENTS */}
              <button
                className={styles.getStartedCard}
                onClick={() => navigateToView('venue-protection-welcome')}
              >
                <div className={styles.getStartedIcon}>🎭</div>
                <div className={styles.getStartedContent}>
                  <h3 className={styles.getStartedCardTitle}>Event Security</h3>
                  <p className={styles.getStartedCardDescription}>Venue protection</p>
                  <p className={styles.getStartedCardDetails}>Functions • Galas • Corporate</p>
                </div>
                <div className={styles.getStartedArrow}>→</div>
              </button>
            </div>
          </div>

          {/* Carousel Navigation Arrows */}
          <button
            className={styles.carouselArrow + ' ' + styles.carouselArrowLeft}
            onClick={() => navigateCarousel('left')}
            disabled={currentCarouselIndex === 0}
            aria-label={`Previous cards. Currently showing card ${currentCarouselIndex + 1} of ${carouselCards}`}
          >
            ←
          </button>
          <button
            className={styles.carouselArrow + ' ' + styles.carouselArrowRight}
            onClick={() => navigateCarousel('right')}
            disabled={currentCarouselIndex === carouselCards - 1}
            aria-label={`Next cards. Currently showing card ${currentCarouselIndex + 1} of ${carouselCards}`}
          >
            →
          </button>

          {/* Carousel Indicators */}
          <div className={styles.carouselIndicators} role="tablist" aria-label="Get started navigation">
            {Array.from({ length: carouselCards }, (_, index) => (
              <button
                key={index}
                className={`${styles.carouselDot} ${currentCarouselIndex === index ? styles.active : ''}`}
                onClick={() => scrollToCarouselIndex(index)}
                role="tab"
                aria-selected={currentCarouselIndex === index}
                aria-label={`Go to card ${index + 1}: ${
                  ['Immediate Protection', 'Airport Protection', 'Schedule Protection', 'Executive Protection', 'Event Security'][index]
                }`}
                tabIndex={currentCarouselIndex === index ? 0 : -1}
              />
            ))}
          </div>
        </div>

        {/* Need Help Section */}
        <div className={styles.needHelpSection}>
          <h3 className={styles.needHelpTitle}>NEED HELP?</h3>
          <div className={styles.needHelpLinks}>
            <button
              className={styles.needHelpLink}
              onClick={() => navigateToView('services')}
            >
              Protection Options
            </button>
            <span className={styles.needHelpSeparator}>•</span>
            <button
              className={styles.needHelpLink}
              onClick={() => window.open('tel:+442071234567')}
            >
              24/7 Support
            </button>
            <span className={styles.needHelpSeparator}>•</span>
            <button
              className={styles.needHelpLink}
              onClick={() => navigateToView('about')}
            >
              Protection Process
            </button>
          </div>
        </div>
      </div>


      {/* Live Activity Ticker - NEW */}
      <ActivityTicker />

      {/* Impact Widget for Essential Members */}
      {/* <CreatorImpactWidget /> */}

      {/* Smart Recommendation - Condensed Version */}
      <SmartRecommendation
        services={ARMORA_SERVICES}
        user={user}
        questionnaireData={questionnaireData}
        onServiceSelect={handleServiceSelection}
      />



      {/* Service Overview Section */}
      <div id="service-overview" className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Your Protection Service Options
          </h2>
          <p className={styles.sectionDescription}>
            Professional protection officers available 24/7 with comprehensive security coverage
          </p>
        </div>
        <div className={styles.servicesGrid}>
          {ARMORA_SERVICES.map((service, index) => (
            <div
              key={service.id}
              style={{
                animationDelay: `${0.2 + index * 0.1}s`
              }}
            >
              <ServiceCard
                service={service}
                isSelected={false}
                onSelect={() => {}} // No selection - just display
                mode="preview" // Info display only
                isRecommended={recommendedService === service.id}
                userType={user?.userType}
                onDirectBook={handleDirectBooking}
              />
            </div>
          ))}
        </div>

        {/* Main Book Now CTA */}
        <div className={styles.mainCTA}>
          <button
            className={styles.bookNowMainButton}
            onClick={() => navigateToView('booking')}
          >
            🚀 Book Protection Services
          </button>
          <p className={styles.ctaSubtext}>
            Complete your booking in just 3 simple steps
          </p>
        </div>
      </div>



      {/* Complete Event Protection Section - Cleaned */}
      <div className={styles.eventSecuritySection}>
        <div className={styles.eventBadge}>INTRODUCING VENUE PROTECTION SERVICES</div>

        <h2 className={styles.eventMainHeadline}>Licensed Security Officers</h2>
        <h3 className={styles.eventSubHeadline}>24/7 Personal Protection • Secure Travel</h3>

        {/* Clean Service Cards Grid - 2x2 layout */}
        <div className={styles.eventServicesGrid}>
          <div className={styles.eventServiceCard}>
            <div className={styles.eventServiceIcon}>🛡️</div>
            <h4 className={styles.eventServiceTitle}>Personal Protection</h4>
            <button className={styles.eventQuoteBtn}>Learn More</button>
          </div>

          <div className={styles.eventServiceCard}>
            <div className={styles.eventServiceIcon}>✈️</div>
            <h4 className={styles.eventServiceTitle}>Secure Travel</h4>
            <button className={styles.eventQuoteBtn}>Learn More</button>
          </div>

          <div className={styles.eventServiceCard}>
            <div className={styles.eventServiceIcon}>🕐</div>
            <h4 className={styles.eventServiceTitle}>24/7 Service</h4>
            <button className={styles.eventQuoteBtn}>Learn More</button>
          </div>

          <div className={styles.eventServiceCard}>
            <div className={styles.eventServiceIcon}>⭐</div>
            <h4 className={styles.eventServiceTitle}>SIA-Licensed</h4>
            <button className={styles.eventQuoteBtn}>Learn More</button>
          </div>
        </div>

        {/* SIA-Licensed Badge */}
        <div className={styles.whatsIncludedSection}>
          <div className={styles.siaLicensedBadge}>
            <span className={styles.badgeIcon}>⭐</span>
            <span className={styles.badgeText}>SIA-Licensed Professionals</span>
          </div>
        </div>


        {/* Simple CTA */}
        <div className={styles.eventCTAButtons}>
          <button
            className={styles.eventPrimaryCTA}
            onClick={() => navigateToView('booking')}
          >
            Book Security Service
          </button>
        </div>
      </div>

      {/* Safe Ride Fund Modal */}
      {/* {showSafeRideModal && (
        <ArmoraFoundationModal onClose={() => setShowSafeRideModal(false)} />
      )} */}

      {/* Protection Status - Only shows when active/scheduled */}
      <ProtectionStatus />

      {/* Emergency SOS Button - Fixed Position - NEW */}
      <FloatingSOSButton />


    </div>
  );
}