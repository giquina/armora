import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProtectionAssignments, useSafeAssignmentFundStats, useUserProfile, useNotifications } from '../../hooks/useSupabaseData';
import { Button } from '../UI/Button';
import { ServiceCard } from './ServiceCard';
// import { CreatorImpactWidget } from './CreatorImpactWidget';
import { SmartRecommendation } from './SmartRecommendation';
import { BookingSearchInterface } from './BookingSearchInterface';
import { ProtectionStatus } from '../UI/ProtectionStatus';
// import ArmoraFoundationModal from '../ArmoraFoundation/ArmoraFoundationModal';
import { ServiceLevel } from '../../types';
// import { getDisplayName } from '../../utils/nameUtils'; // Removed since header is no longer displayed
import { getAllServices } from '../../data/standardizedServices';
import { FAQ } from './FAQ';
import { CPOCard } from '../CPOProfile/CPOCard';
import { CPODetailModal } from '../CPOProfile/CPODetailModal';
import { getRecommendedCPOs } from '../../utils/cpoMatchingAlgorithm';
import { mockCPOs } from '../../data/mockCPOs';
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
    capacity: service.id === 'client-vehicle' ? 'Any vehicle size' : '4 Principals',
    driverQualification: service.id === 'standard' || service.id === 'client-vehicle' ? 'SIA Level 2 Security Certified' :
                        service.id === 'executive' ? 'SIA Level 3 Security Certified' : 'Special Forces Trained',
    description: service.description,
    features: service.features.map(f => f.text) // Convert from {icon, text} to string array
  }));
};

const ARMORA_SERVICES: ServiceLevel[] = convertToServiceLevel();

export function Dashboard() {
  const { state, navigateToView } = useApp();
  const { user: legacyUser, questionnaireData, deviceCapabilities } = state;
  const { user, profile } = useAuth();
  const { assignments, loading: assignmentsLoading } = useProtectionAssignments();
  const { stats: safeAssignmentFundStats } = useSafeAssignmentFundStats();
  const { profile: extendedProfile } = useUserProfile();
  const { notifications } = useNotifications();
  const [showRewardBanner, setShowRewardBanner] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [showCPOModal, setShowCPOModal] = useState(false);
  const [selectedCPOId, setSelectedCPOId] = useState<string | null>(null);


  // Check if user has unlocked reward and hasn't dismissed banner
  useEffect(() => {
    // ALWAYS show reward banner for eligible users (non-guests)
    // Use legacy user for backward compatibility, fallback to Supabase user
    const currentUser = legacyUser || user;
    const isEligible = currentUser && (legacyUser?.userType !== 'guest' || user?.email);
    const hasSeenBanner = localStorage.getItem('armora_reward_banner_dismissed');
    setShowRewardBanner(Boolean(isEligible && !hasSeenBanner));
  }, [user, legacyUser]);


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
      userType: legacyUser?.userType || (user ? 'registered' : 'guest')
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
      userType: legacyUser?.userType || (user ? 'registered' : 'guest'),
      source: 'dashboard_card'
    });
  };

  // CPO-related handlers
  const handleRequestOfficer = (cpoId: string) => {
    // Store selected CPO and navigate to booking with pre-selected officer
    localStorage.setItem('armora_selected_cpo', cpoId);
    localStorage.setItem('armora_booking_context', 'cpo_selected');
    navigateToView('booking');
  };

  const handleViewCPODetails = (cpoId: string) => {
    setSelectedCPOId(cpoId);
    setShowCPOModal(true);
  };

  const handleAddToFavorites = (cpoId: string) => {
    // Store in localStorage for now - would be backend API in production
    const favorites = JSON.parse(localStorage.getItem('armora_favorite_cpos') || '[]');
    if (!favorites.includes(cpoId)) {
      favorites.push(cpoId);
      localStorage.setItem('armora_favorite_cpos', JSON.stringify(favorites));
    }
  };

  // Get top 3 recommended CPOs for display
  const getTopCPOs = () => {
    return getRecommendedCPOs([], mockCPOs, 3);
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
  if (legacyUser?.userType === 'guest') {
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
                and exclusive rewards including 50% off your first protection assignment.
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
                userType={legacyUser?.userType || (user ? 'registered' : 'guest')}
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

      {/* Smart Recommendation - Your Protection Match Section */}
      <div className={styles.recommendationSection}>
        <SmartRecommendation
          services={ARMORA_SERVICES}
          user={legacyUser}
          questionnaireData={questionnaireData}
          onServiceSelect={handleServiceSelection}
        />
      </div>

      {/* Get Started Section - 5 Card Carousel - Now below Protection Match */}
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
              {/* Card 1: PROTECTION NOW */}
              <button
                className={styles.getStartedCard}
                onClick={() => {
                  localStorage.setItem('armora_booking_context', 'immediate');
                  localStorage.setItem('armora_selected_service', 'standard');
                  navigateToView('booking');
                }}
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
                  localStorage.setItem('armora_booking_context', 'airport');
                  localStorage.setItem('armora_selected_service', 'executive');
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
                  localStorage.setItem('armora_booking_context', 'schedule');
                  localStorage.setItem('armora_selected_service', 'executive');
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
                userType={legacyUser?.userType || (user ? 'registered' : 'guest')}
                onDirectBook={handleDirectBooking}
              />
            </div>
          ))}
        </div>

        {/* Main Request Now CTA */}
        <div className={styles.mainCTA}>
          <button
            className={styles.bookNowMainButton}
            onClick={() => {
              localStorage.setItem('armora_booking_context', 'executive');
              localStorage.setItem('armora_selected_service', 'executive');
              navigateToView('booking');
            }}
          >
            🚀 Request Protection Services
          </button>
          <p className={styles.ctaSubtext}>
            Complete your request in just 3 simple steps
          </p>
        </div>
      </div>

      {/* Available Protection Officers Section */}
      <div className={styles.cpoSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Available Protection Officers
          </h2>
          <p className={styles.sectionDescription}>
            Professional SIA-licensed officers ready to provide immediate protection
          </p>
        </div>

        <div className={styles.topCPOsGrid}>
          {getTopCPOs().map((cpo) => (
            <div key={cpo.id} className={styles.cpoCardWrapper}>
              <CPOCard
                cpo={cpo}
                onRequestOfficer={handleRequestOfficer}
                onViewDetails={handleViewCPODetails}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={false}
                showMatchScore={false}
                compact={false}
              />
            </div>
          ))}
        </div>

        <div className={styles.cpoCTA}>
          <button
            className={styles.viewAllCPOsButton}
            onClick={() => {
              // For now, navigate to services until CPO list view is added to app routing
              navigateToView('services');
            }}
          >
            View All Protection Officers
          </button>
          <p className={styles.cpoCtaSubtext}>
            Browse {mockCPOs.length} verified officers • Filter by specialization
          </p>
        </div>
      </div>

      {/* Safe Assignment Fund Modal */}
      {/* {showSafeRideModal && (
        <ArmoraFoundationModal onClose={() => setShowSafeRideModal(false)} />
      )} */}

      {/* Protection Status - Only shows when active/scheduled */}
      <ProtectionStatus />

      {/* Why Choose Armora Protection Section */}
      <div className={styles.whyChooseSection}>
        <h2 className={styles.whyChooseTitle}>Why Choose Armora Protection</h2>
        <div className={styles.whyChooseGrid}>
          <div className={styles.whyChooseCard}>
            <div className={styles.whyChooseIcon}>🛡️</div>
            <h3 className={styles.whyChooseCardTitle}>SIA-Licensed Officers</h3>
            <p className={styles.whyChooseCardText}>
              All protection officers hold valid SIA licenses with advanced close protection training
            </p>
          </div>

          <div className={styles.whyChooseCard}>
            <div className={styles.whyChooseIcon}>🚗</div>
            <h3 className={styles.whyChooseCardTitle}>Premium Fleet</h3>
            <p className={styles.whyChooseCardText}>
              Executive vehicles including BMW 5 Series and armored options for maximum security
            </p>
          </div>

          <div className={styles.whyChooseCard}>
            <div className={styles.whyChooseIcon}>📍</div>
            <h3 className={styles.whyChooseCardTitle}>Nationwide Coverage</h3>
            <p className={styles.whyChooseCardText}>
              Complete service across England & Wales with specialized airport and city teams
            </p>
          </div>

          <div className={styles.whyChooseCard}>
            <div className={styles.whyChooseIcon}>⏰</div>
            <h3 className={styles.whyChooseCardTitle}>24/7 Availability</h3>
            <p className={styles.whyChooseCardText}>
              Round-the-clock protection services with rapid response times nationwide
            </p>
          </div>

          <div className={styles.whyChooseCard}>
            <div className={styles.whyChooseIcon}>🎖️</div>
            <h3 className={styles.whyChooseCardTitle}>Elite Training</h3>
            <p className={styles.whyChooseCardText}>
              Officers trained in threat assessment, medical response, and defensive driving
            </p>
          </div>

          <div className={styles.whyChooseCard}>
            <div className={styles.whyChooseIcon}>🔒</div>
            <h3 className={styles.whyChooseCardTitle}>Discreet Service</h3>
            <p className={styles.whyChooseCardText}>
              Professional, confidential protection maintaining your privacy at all times
            </p>
          </div>
        </div>
      </div>

      {/* How Armora Works Section */}
      <div className={styles.howItWorksSection}>
        <h2 className={styles.howItWorksTitle}>HOW ARMORA WORKS</h2>
        <p className={styles.howItWorksSubtitle}>Professional Protection in 4 Simple Steps</p>

        <div className={styles.stepsGrid}>
          {/* Step 1 */}
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Submit Your Security Requirements</h3>
              <ul className={styles.stepList}>
                <li>Open the Armora app and select protection level</li>
                <li>Specify your location and destination</li>
                <li>Choose immediate or scheduled protection</li>
                <li>Request instantly sent to verified officers</li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Receive Your Protection Details</h3>
              <ul className={styles.stepList}>
                <li>View officer profile with photo and SIA license</li>
                <li>See vehicle details and registration</li>
                <li>Get real-time tracking link</li>
                <li>Receive estimated arrival time</li>
              </ul>
            </div>
          </div>

          {/* Step 3 - S.A.F.E. Protocol */}
          <div className={`${styles.stepCard} ${styles.safeProtocolCard}`}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Your Safety is Paramount - Always Verify</h3>
              <div className={styles.safeProtocol}>
                <h4 className={styles.safeTitle}>S.A.F.E. Protocol:</h4>
                <div className={styles.safeGrid}>
                  <div className={styles.safeItem}>
                    <span className={styles.safeLetter}>S</span>
                    <span className={styles.safeText}>SEE the officer's SIA badge (worn visibly)</span>
                  </div>
                  <div className={styles.safeItem}>
                    <span className={styles.safeLetter}>A</span>
                    <span className={styles.safeText}>ASK for the unique 6-digit security code</span>
                  </div>
                  <div className={styles.safeItem}>
                    <span className={styles.safeLetter}>F</span>
                    <span className={styles.safeText}>FIND the code match in your app</span>
                  </div>
                  <div className={styles.safeItem}>
                    <span className={styles.safeLetter}>E</span>
                    <span className={styles.safeText}>ENSURE vehicle registration matches</span>
                  </div>
                </div>
                <div className={styles.safeWarning}>
                  <strong>⚠️ NEVER proceed without verification</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Professional Security Throughout</h3>
              <ul className={styles.stepList}>
                <li>Officer conducts threat assessment</li>
                <li>Secure route planning</li>
                <li>Real-time journey tracking</li>
                <li>Professional protocols maintained</li>
                <li>Post-journey security report</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Verification Features */}
        <div className={styles.verificationSection}>
          <h3 className={styles.verificationTitle}>Security Verification Features</h3>
          <div className={styles.verificationGrid}>
            <div className={styles.verificationCard}>
              <h4 className={styles.verificationType}>Digital Verification</h4>
              <ul className={styles.verificationList}>
                <li>Unique codes</li>
                <li>QR scanning</li>
                <li>Live photo matching</li>
              </ul>
            </div>
            <div className={styles.verificationCard}>
              <h4 className={styles.verificationType}>Physical Verification</h4>
              <ul className={styles.verificationList}>
                <li>SIA badge</li>
                <li>Vehicle match</li>
                <li>Professional appearance</li>
              </ul>
            </div>
            <div className={styles.verificationCard}>
              <h4 className={styles.verificationType}>Behavioral Verification</h4>
              <ul className={styles.verificationList}>
                <li>Professional introduction</li>
                <li>Confirms client name</li>
                <li>Explains procedures</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Red Flags Warning */}
        <div className={styles.redFlagsSection}>
          <h3 className={styles.redFlagsTitle}>🚨 RED FLAGS - When NOT to Proceed</h3>
          <div className={styles.redFlagsWarning}>
            <div className={styles.redFlagsList}>
              <ul>
                <li>Security codes don't match</li>
                <li>No SIA badge visible</li>
                <li>Vehicle details differ from app</li>
                <li>Officer cannot confirm your details</li>
                <li>Any feeling of discomfort</li>
              </ul>
            </div>
            <div className={styles.redFlagsActions}>
              <h4>If concerned:</h4>
              <ul>
                <li>Press SOS in app</li>
                <li>Call 24/7 security line</li>
                <li>Move to safe location</li>
                <li>Backup dispatch available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What Happens During Protection */}
        <div className={styles.protectionPhases}>
          <h3 className={styles.phasesTitle}>What Happens During Your Protection Service</h3>
          <div className={styles.phasesGrid}>
            <div className={styles.phaseCard}>
              <h4 className={styles.phaseTitle}>Pre-Departure</h4>
              <p className={styles.phaseDescription}>Security check, route review, comfort settings</p>
            </div>
            <div className={styles.phaseCard}>
              <h4 className={styles.phaseTitle}>During Journey</h4>
              <p className={styles.phaseDescription}>Professional vigilance, secure routing, status updates</p>
            </div>
            <div className={styles.phaseCard}>
              <h4 className={styles.phaseTitle}>At Destination</h4>
              <p className={styles.phaseDescription}>Area survey, safe exit, entrance escort, secure confirmation</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />

      {/* Complete Event Protection Section - Moved after FAQ */}
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
            onClick={() => {
              localStorage.setItem('armora_booking_context', 'event');
              localStorage.setItem('armora_selected_service', 'executive');
              navigateToView('booking');
            }}
          >
            Request Security Service
          </button>
        </div>
      </div>

      {/* CPO Detail Modal */}
      {showCPOModal && selectedCPOId && (
        <CPODetailModal
          cpo={mockCPOs.find(cpo => cpo.id === selectedCPOId)!}
          isOpen={showCPOModal}
          onClose={() => {
            setShowCPOModal(false);
            setSelectedCPOId(null);
          }}
          onRequestOfficer={handleRequestOfficer}
          onAddToFavorites={handleAddToFavorites}
          isFavorite={false}
        />
      )}

    </div>
  );
}