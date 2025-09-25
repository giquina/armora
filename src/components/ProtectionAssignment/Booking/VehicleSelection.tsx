import React, { useState } from 'react';
import { ServiceLevel, User } from '../../../types';
import { LoadingSpinner } from '../../UI/LoadingSpinner';
import { ServiceCardSkeletonLoader } from '../../UI/SkeletonLoader';
import { ServiceCard } from '../../Dashboard/ServiceCard';
import { SmartRecommendation } from '../../Dashboard/SmartRecommendation';
import { GuestQuoteModal } from './GuestQuoteModal';
import { getAllServices } from '../../../data/standardizedServices';
import { getDisplayName } from '../../../utils/nameUtils';
import styles from './VehicleSelection.module.css';

interface VehicleSelectionProps {
  user: User | null;
  onServiceSelected: (service: ServiceLevel) => void;
  onBack?: () => void;
  onSignUp?: () => void;
}

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
    protectionOfficerQualification: service.id === 'standard' || service.id === 'client-vehicle' ? 'SIA Level 2 Close Protection' :
                        service.id === 'executive' ? 'SIA Level 3 Close Protection' : 'Special Forces Trained',
    description: service.description,
    features: service.features.map(f => f.text), // Convert from {icon, text} to string array
    isPopular: service.id === 'shadow', // Shadow is marked as most popular
    socialProof: {
      assignmentsCompleted: 3921, // Use static numbers since analytics not available
      selectionRate: service.id === 'shadow' ? 67 : undefined
    }
  }));
};

const ARMORA_SERVICES: ServiceLevel[] = convertToServiceLevel();

export function VehicleSelection({ user, onServiceSelected, onBack, onSignUp }: VehicleSelectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceLevel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestQuote, setShowGuestQuote] = useState(false);
  const [servicesLoading] = useState(false);
  const [rebookData] = useState(() => {
    try {
      const stored = localStorage.getItem('armora_rebook_data');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleServiceSelect = (service: ServiceLevel) => {
    setSelectedService(service);

    // If user is a guest, show quote modal instead of proceeding to protection
    if (user?.userType === 'guest') {
      setShowGuestQuote(true);
    } else {
      // Registered users can proceed directly to protection arrangement
      onServiceSelected(service);
    }
  };

  const handleGuestSignUp = () => {
    setShowGuestQuote(false);
    if (onSignUp) {
      onSignUp();
    }
  };


  const handleContinue = async () => {
    if (selectedService) {
      setIsLoading(true);
      
      // Simulate brief loading for service preparation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onServiceSelected(selectedService);
      setIsLoading(false);
    }
  };

  const hasReward = user?.hasUnlockedReward && user?.userType !== 'guest';


  // Get personalized recommendation based on questionnaire
  const getPersonalizedRecommendation = () => {
    // Get stored questionnaire data from localStorage
    const questionnaireData = JSON.parse(localStorage.getItem('armora_questionnaire_responses') || '{}');

    if (!questionnaireData?.recommendedService) return null;

    // Map the questionnaire recommendations to service IDs
    if (questionnaireData.recommendedService === 'armora-shadow') return 'shadow';
    if (questionnaireData.recommendedService === 'armora-executive') return 'executive';
    if (questionnaireData.recommendedService === 'armora-standard' || questionnaireData.recommendedService === 'armora-secure') return 'standard';
    if (questionnaireData.recommendedService === 'armora-client-vehicle') return 'client-vehicle';

    // Default fallback to standard if no clear recommendation
    return 'standard';
  };

  const recommendedService = getPersonalizedRecommendation();

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}
        <h1 className={styles.title}>
          Choose Your Protection{user ? `, ${getDisplayName(user)}` : ''}
        </h1>
        <p className={styles.subtitle}>Step 1 of 3 • Security Level Selection</p>
        <p className={styles.description}>
          Professional Protection Officers available 24/7 with secure transport fleet
        </p>
        {hasReward && (
          <div className={styles.rewardBanner}>
            🎉 50% off your first protection service - reward applied!
          </div>
        )}
        {rebookData && (
          <div className={styles.rebookBanner}>
            🔄 Rebooking: {rebookData.from} → {rebookData.to}
            <button
              className={styles.clearRebookButton}
              onClick={() => localStorage.removeItem('armora_rebook_data')}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Smart Recommendation - Same as Dashboard */}
      <SmartRecommendation
        services={ARMORA_SERVICES}
        user={user}
        questionnaireData={JSON.parse(localStorage.getItem('armora_questionnaire_responses') || '{}')}
        onServiceSelect={(serviceId) => {
          const service = ARMORA_SERVICES.find(s => s.id === serviceId);
          if (service) handleServiceSelect(service);
        }}
      />

      <div className={styles.serviceGrid}>
        {servicesLoading ? (
          // Show skeleton loaders while services load
          <>
            <ServiceCardSkeletonLoader />
            <ServiceCardSkeletonLoader />
            <ServiceCardSkeletonLoader />
          </>
        ) : (
          ARMORA_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedService?.id === service.id}
              onSelect={() => handleServiceSelect(service)}
              mode="selection"
              isRecommended={recommendedService === service.id}
              onBookNow={() => handleServiceSelect(service)}
              userType={user?.userType}
            />
          ))
        )}
      </div>

      {/* Continue Button - Only show if service is selected and user is not a guest */}
      {selectedService && user?.userType !== 'guest' && (
        <div className={styles.continueSection}>
          <button
            className={styles.continueButton}
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" variant="light" text="Preparing..." inline />
            ) : (
              <>Continue to Protection Planning →</>
            )}
          </button>
        </div>
      )}

      {/* Guest Quote Modal */}
      <GuestQuoteModal
        isOpen={showGuestQuote}
        onClose={() => setShowGuestQuote(false)}
        selectedService={selectedService}
        onSignUp={handleGuestSignUp}
      />
    </div>
  );
}