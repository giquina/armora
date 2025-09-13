import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { ServiceCard } from './ServiceCard';
import { QuickBooking } from './QuickBooking';
import { ImpactDashboardWidget } from './ImpactDashboardWidget';
import { MarketingBanner } from './MarketingBanner';
import { ServiceLevel } from '../../types';
import styles from './Dashboard.module.css';

const ARMORA_SERVICES: ServiceLevel[] = [
  {
    id: 'standard',
    name: 'Armora Standard',
    tagline: 'Professional Security Transport',
    price: '£45/hour',
    hourlyRate: 45,
    description: 'Professional security-aware drivers with basic protection protocols',
    features: [
      'Security-trained professional drivers',
      'Real-time GPS tracking',
      'Secure communication protocols',
      'Basic threat assessment',
      '24/7 priority support'
    ]
  },
  {
    id: 'executive',
    name: 'Armora Executive',
    tagline: 'Enhanced Security & Luxury',
    price: '£75/hour',
    hourlyRate: 75,
    description: 'Premium luxury vehicles with enhanced security protocols',
    features: [
      'Executive protection trained drivers',
      'Luxury vehicle fleet',
      'Advanced route planning',
      'Executive assistance services',
      'Priority rapid response',
      'Discrete security protocols'
    ]
  },
  {
    id: 'shadow',
    name: 'Armora Shadow',
    tagline: 'Maximum Security Protection',
    price: '£65/hour',
    hourlyRate: 65,
    description: 'Close protection officers with armored vehicles for maximum security',
    features: [
      'Certified close protection officers',
      'Armored vehicle options',
      'Counter-surveillance training',
      'Tactical route planning',
      'Immediate threat response',
      'Government-level security protocols'
    ],
    isPopular: true,
    socialProof: {
      tripsCompleted: 15847,
      selectionRate: 67
    }
  }
];

export function Dashboard() {
  const { state, navigateToView } = useApp();
  const { user, questionnaireData, deviceCapabilities } = state;
  const [selectedService, setLocalSelectedService] = useState<'standard' | 'executive' | 'shadow' | null>(null);
  const [showRewardBanner, setShowRewardBanner] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Check if user has unlocked reward and hasn't dismissed banner
  useEffect(() => {
    const isEligible = user?.userType !== 'guest' && user?.hasUnlockedReward;
    const hasSeenBanner = localStorage.getItem('armora_reward_banner_dismissed');
    setShowRewardBanner(Boolean(isEligible && !hasSeenBanner));
  }, [user]);

  const handleServiceSelect = (serviceId: 'standard' | 'executive' | 'shadow') => {
    setLocalSelectedService(serviceId);
    // Store selected service for booking flow
    localStorage.setItem('armora_selected_service', serviceId);
    
    // Set service in app context and navigate to subscription offer
    const selectedServiceData = ARMORA_SERVICES.find(s => s.id === serviceId);
    if (selectedServiceData) {
      // setAppSelectedService(serviceId); // TODO: Implement service selection
      navigateToView('subscription-offer');
    }
  };

  const handleBookNow = async () => {
    setIsNavigating(true);
    
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

  const getPersonalizedRecommendation = () => {
    if (!questionnaireData) return null;

    const { step1_transportProfile, step3_serviceRequirements } = questionnaireData;
    
    // Business logic for service recommendations
    if (step3_serviceRequirements?.includes('maximum_security') || 
        step1_transportProfile === 'high_profile_executive') {
      return 'shadow';
    }
    
    if (step3_serviceRequirements?.includes('luxury_vehicles') || 
        step1_transportProfile === 'corporate_executive') {
      return 'executive';
    }
    
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
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className={styles.subtitle}>
            Book your security transport
          </p>
        </div>
      </div>

      {/* Quick Booking Section */}
      <div className={styles.quickBookingSection}>
        <QuickBooking
          onBookNow={handleBookNow}
          selectedService={selectedService}
          isLoading={isNavigating}
          userType={user?.userType || 'guest'}
        />
      </div>

      {/* Impact Widget for Essential Members */}
      <ImpactDashboardWidget />

      {/* Service Selection */}
      <div className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>Select Your Security Level</h2>
        <div className={styles.servicesGrid}>
          {ARMORA_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedService === service.id}
              onSelect={handleServiceSelect}
              mode="selection"
              isRecommended={recommendedService === service.id}
            />
          ))}
        </div>
      </div>

      {/* Personalized Recommendation */}
      {recommendedService && questionnaireData && (
        <div className={styles.recommendationSection}>
          <div className={styles.recommendationCard}>
            <div className={styles.recommendationIcon}>⭐</div>
            <div className={styles.recommendationContent}>
              <h3 className={styles.recommendationTitle}>Recommended For You</h3>
              <p className={styles.recommendationDescription}>
                Based on your security profile, <strong>Armora {ARMORA_SERVICES.find(s => s.id === recommendedService)?.name.split(' ')[1]}</strong> is 
                the optimal choice for your transportation needs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionSection}>
        <Button
          variant="primary"
          size="lg"
          isFullWidth={deviceCapabilities.isMobile}
          onClick={handleBookNow}
          disabled={!selectedService || isNavigating}
          className={styles.bookButton}
        >
          {isNavigating ? (
            <LoadingSpinner size="small" variant="light" text="Preparing Booking..." inline />
          ) : selectedService ? (
            `Book ${ARMORA_SERVICES.find(s => s.id === selectedService)?.name}`
          ) : (
            'Select Service to Book'
          )}
        </Button>
        
        {deviceCapabilities.isMobile && (
          <Button
            variant="outline"
            size="md"
            isFullWidth
            onClick={() => navigateToView('profile')}
            className={styles.profileButton}
          >
            View Profile & Settings
          </Button>
        )}
      </div>

      {/* Marketing Banner for Non-Members */}
      <MarketingBanner 
        onTrialStart={handleBookNow}
        currentUser={user}
        variant="savings"
      />
    </div>
  );
}