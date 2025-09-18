import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { ServiceCard } from './ServiceCard';
// import { CreatorImpactWidget } from './CreatorImpactWidget';
import { MarketingBanner } from './MarketingBanner';
import { SmartRecommendation } from './SmartRecommendation';
import { BookingSearchInterface } from './BookingSearchInterface';
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
    // Security assets and capacity data - standardized for all services
    vehicle: service.id === 'standard' ? 'Unmarked Secure Vehicle' :
             service.id === 'executive' ? 'Executive Security Vehicle (S-Class)' :
             service.id === 'client-vehicle' ? 'Your Personal Vehicle' : 'Armoured Protection Vehicle',
    capacity: service.id === 'client-vehicle' ? 'Any vehicle configuration' : 'Principal + 3 associates',
    driverQualification: service.id === 'standard' || service.id === 'client-vehicle' ? 'SIA Level 2 Close Protection' :
                        service.id === 'executive' ? 'SIA Level 3 Close Protection' : 'Ex-Military Close Protection',
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

  const scrollToCarouselIndex = (index: number) => {
    const container = document.getElementById('getStartedCarousel');
    if (container) {
      container.scrollTo({ left: getCarouselScrollPosition(index), behavior: 'smooth' });
      setCurrentCarouselIndex(index);
    }
  };

  const navigateCarousel = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? Math.max(0, currentCarouselIndex - 1)
      : Math.min(carouselCards - 1, currentCarouselIndex + 1);
    scrollToCarouselIndex(newIndex);
  };

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
              Armora Security Services
            </h1>
            <p className={styles.subtitle}>
              Licensed Security Officers Ensuring Your Safety
            </p>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className={styles.upgradeSection}>
          <div className={styles.upgradeCard}>
            <div className={styles.upgradeContent}>
              <h2 className={styles.upgradeTitle}>Create Account for Security Services</h2>
              <p className={styles.upgradeDescription}>
                Register now to unlock direct security service booking, personalized recommendations,
                and exclusive rewards including 50% off your first security service.
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
          <h2 className={styles.sectionTitle}>Our Security Services</h2>
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
              Call our 24/7 support for immediate security officer deployment and coordination
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
                <a href="mailto:services@armora.security" className={styles.contactLink}>
                  services@armora.security
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
                  Your first security service (up to £75) • Valid 30 days
                </span>
                <span className={styles.rewardCTA}>Request Security →</span>
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
      {/* <CreatorImpactWidget /> */}

      {/* Smart Recommendation - Condensed Version */}
      <SmartRecommendation
        services={ARMORA_SERVICES}
        user={user}
        questionnaireData={questionnaireData}
        onServiceSelect={handleServiceSelection}
      />

      {/* Get Started Section - 5 Card Carousel */}
      <div className={styles.getStartedSection}>
        <div className={styles.getStartedHeader}>
          <h2 className={styles.getStartedTitle}>GET STARTED</h2>
          <div className={styles.getStartedUnderline}></div>
        </div>

        <div
          className={styles.carouselWrapper}
          role="region"
          aria-label="Service options carousel"
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
                  <h3 className={styles.getStartedCardTitle}>Request Protection</h3>
                  <p className={styles.getStartedCardDescription}>Immediate deployment</p>
                  <p className={styles.getStartedCardDetails}>CPO available in 15 minutes</p>
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
                  <h3 className={styles.getStartedCardTitle}>Airport Security</h3>
                  <p className={styles.getStartedCardDescription}>Secure transit</p>
                  <p className={styles.getStartedCardDetails}>Aviation security protocols</p>
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
                  <p className={styles.getStartedCardDescription}>Plan security coverage</p>
                  <p className={styles.getStartedCardDetails}>Advance threat assessment</p>
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
                  <p className={styles.getStartedCardDescription}>Corporate security</p>
                  <p className={styles.getStartedCardDetails}>Ex-military CPOs • Armoured vehicles</p>
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
                  <h3 className={styles.getStartedCardTitle}>Special Events</h3>
                  <p className={styles.getStartedCardDescription}>VIP occasions</p>
                  <p className={styles.getStartedCardDetails}>Weddings • Galas • Corporate</p>
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
          <div className={styles.carouselIndicators} role="tablist" aria-label="Carousel navigation">
            {Array.from({ length: carouselCards }, (_, index) => (
              <button
                key={index}
                className={`${styles.carouselDot} ${currentCarouselIndex === index ? styles.active : ''}`}
                onClick={() => scrollToCarouselIndex(index)}
                role="tab"
                aria-selected={currentCarouselIndex === index}
                aria-label={`Go to card ${index + 1}: ${
                  ['Ride Now', 'Airport Transfer', 'Schedule Ride', 'Executive', 'Special Events'][index]
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
              View All Services
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
              How It Works
            </button>
          </div>
        </div>
      </div>

      {/* Service Overview Section */}
      <div id="service-overview" className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Your Close Protection Options
          </h2>
          <p className={styles.sectionDescription}>
            SIA-licensed Close Protection Officers available 24/7 with secure vehicle assets
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
            🛡️ Request Protection Services
          </button>
          <p className={styles.ctaSubtext}>
            Complete your security engagement in just 3 simple steps
          </p>
        </div>
      </div>


      {/* Marketing Banner for Non-Members */}
      <MarketingBanner
        onTrialStart={() => navigateToView('booking')}
        currentUser={user}
        variant="savings"
      />

      {/* Complete Event Protection Section - Cleaned */}
      <div className={styles.eventSecuritySection}>
        <div className={styles.eventBadge}>INTRODUCING VENUE PROTECTION SERVICES</div>

        <h2 className={styles.eventMainHeadline}>SIA Level 3 Officers for Weddings, Corporate Events & Private Venues</h2>
        <h3 className={styles.eventSubHeadline}>Secure What Matters Most</h3>

        {/* Clean Service Cards Grid - 2x2 layout */}
        <div className={styles.eventServicesGrid}>
          <div className={styles.eventServiceCard}>
            <div className={styles.eventServiceIcon}>💍</div>
            <h4 className={styles.eventServiceTitle}>WEDDINGS</h4>
            <div className={styles.eventKeyStat}>500+ Events</div>
            <div className={styles.eventPrice}>From £800</div>
            <button className={styles.eventQuoteBtn}>Get Quote</button>
          </div>

          <div className={styles.eventServiceCard}>
            <div className={styles.eventServiceIcon}>🏢</div>
            <h4 className={styles.eventServiceTitle}>CORPORATE</h4>
            <div className={styles.eventKeyStat}>Fortune 500</div>
            <div className={styles.eventPrice}>From £1,200</div>
            <button className={styles.eventQuoteBtn}>Get Quote</button>
          </div>

          <div className={styles.eventServiceCard}>
            <div className={styles.eventServiceIcon}>🎭</div>
            <h4 className={styles.eventServiceTitle}>VIP GALAS</h4>
            <div className={styles.eventKeyStat}>Celebrity Grade</div>
            <div className={styles.eventPrice}>From £1,500</div>
            <button className={styles.eventQuoteBtn}>Get Quote</button>
          </div>

          <div className={styles.eventServiceCard}>
            <div className={styles.eventServiceIcon}>🎪</div>
            <h4 className={styles.eventServiceTitle}>PUBLIC EVENTS</h4>
            <div className={styles.eventKeyStat}>10,000+ Cap</div>
            <div className={styles.eventPrice}>From £2,000</div>
            <button className={styles.eventQuoteBtn}>Get Quote</button>
          </div>
        </div>

        {/* What's Included Section - Simplified */}
        <div className={styles.whatsIncludedSection}>
          <div className={styles.includedList}>
            <div className={styles.includedItem}>
              <span className={styles.includedIcon}>✓</span>
              <span>Venue Security Assessment</span>
            </div>
            <div className={styles.includedItem}>
              <span className={styles.includedIcon}>✓</span>
              <span>Guest List Management</span>
            </div>
            <div className={styles.includedItem}>
              <span className={styles.includedIcon}>✓</span>
              <span>Discrete Plainclothes Officers</span>
            </div>
            <div className={styles.includedItem}>
              <span className={styles.includedIcon}>✓</span>
              <span>VIP Guest Driver Service</span>
            </div>
            <div className={styles.includedItem}>
              <span className={styles.includedIcon}>✓</span>
              <span><strong>Close Protection Officers (CPO)</strong></span>
            </div>
          </div>
        </div>

        {/* CPO Educational Content Section */}
        <div className={styles.cpoEducationSection}>
          <h3 className={styles.cpoEducationTitle}>What Are Close Protection Officers?</h3>

          <p className={styles.cpoEducationIntro}>
            Close Protection Officers (CPOs) represent the highest tier of personal security professionals. Unlike standard security supervisors, CPOs undergo extensive specialized training in:
          </p>

          <div className={styles.cpoTrainingList}>
            <div className={styles.cpoTrainingItem}>
              <span className={styles.cpoTrainingIcon}>🎯</span>
              <div className={styles.cpoTrainingContent}>
                <strong>Advanced Threat Assessment</strong> - Identifying and neutralizing risks before they develop
              </div>
            </div>
            <div className={styles.cpoTrainingItem}>
              <span className={styles.cpoTrainingIcon}>🚗</span>
              <div className={styles.cpoTrainingContent}>
                <strong>Defensive Driving Techniques</strong> - Evasive maneuvers and secure transport protocols
              </div>
            </div>
            <div className={styles.cpoTrainingItem}>
              <span className={styles.cpoTrainingIcon}>🏥</span>
              <div className={styles.cpoTrainingContent}>
                <strong>Medical Emergency Response</strong> - First aid and crisis medical intervention
              </div>
            </div>
            <div className={styles.cpoTrainingItem}>
              <span className={styles.cpoTrainingIcon}>👁️</span>
              <div className={styles.cpoTrainingContent}>
                <strong>Surveillance Detection</strong> - Recognizing and countering hostile surveillance
              </div>
            </div>
            <div className={styles.cpoTrainingItem}>
              <span className={styles.cpoTrainingIcon}>🛡️</span>
              <div className={styles.cpoTrainingContent}>
                <strong>Executive Protection Protocols</strong> - Discreet, professional close-quarters security
              </div>
            </div>
          </div>

          <div className={styles.cpoDifferenceSection}>
            <h4 className={styles.cpoDifferenceTitle}>The CPO Difference:</h4>
            <div className={styles.cpoDifferenceGrid}>
              <div className={styles.cpoDifferenceItem}>
                <span className={styles.cpoDifferenceIcon}>🎖️</span>
                <div className={styles.cpoDifferenceContent}>
                  <strong>SIA Level 3+ Certification</strong><br />
                  <span className={styles.cpoDifferenceSubtext}>(vs. Level 2 for supervisors)</span>
                </div>
              </div>
              <div className={styles.cpoDifferenceItem}>
                <span className={styles.cpoDifferenceIcon}>⚔️</span>
                <div className={styles.cpoDifferenceContent}>
                  <strong>Military/Police Background</strong><br />
                  <span className={styles.cpoDifferenceSubtext}>Many are ex-military or specialist police</span>
                </div>
              </div>
              <div className={styles.cpoDifferenceItem}>
                <span className={styles.cpoDifferenceIcon}>🎯</span>
                <div className={styles.cpoDifferenceContent}>
                  <strong>Ongoing Tactical Training</strong><br />
                  <span className={styles.cpoDifferenceSubtext}>Regular updates in security techniques</span>
                </div>
              </div>
              <div className={styles.cpoDifferenceItem}>
                <span className={styles.cpoDifferenceIcon}>🧠</span>
                <div className={styles.cpoDifferenceContent}>
                  <strong>Psychological Screening</strong><br />
                  <span className={styles.cpoDifferenceSubtext}>Enhanced vetting for high-pressure situations</span>
                </div>
              </div>
              <div className={styles.cpoDifferenceItem}>
                <span className={styles.cpoDifferenceIcon}>🤐</span>
                <div className={styles.cpoDifferenceContent}>
                  <strong>Confidentiality Protocols</strong><br />
                  <span className={styles.cpoDifferenceSubtext}>Trained in executive discretion and privacy</span>
                </div>
              </div>
            </div>
          </div>

          <p className={styles.cpoClosingStatement}>
            CPOs provide invisible, professional protection that allows you to conduct business naturally while maintaining complete security awareness of your environment.
          </p>
        </div>

        {/* Enhanced CTAs */}
        <div className={styles.eventCTAButtons}>
          <button
            className={styles.eventPrimaryCTA}
            onClick={() => navigateToView('venue-protection-welcome')}
          >
            GET CUSTOM QUOTE
          </button>
          <button
            className={styles.eventSecondaryCTA}
            onClick={() => navigateToView('services')}
          >
            VIEW PACKAGES
          </button>
        </div>
      </div>

      {/* Safe Ride Fund Modal */}
      {/* {showSafeRideModal && (
        <ArmoraFoundationModal onClose={() => setShowSafeRideModal(false)} />
      )} */}
    </div>
  );
}