import React, { useState } from 'react';
import { ServiceLevel, User } from '../../types';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { ServiceCardSkeletonLoader } from '../UI/SkeletonLoader';
import { BookingProgressIndicator } from '../UI/ProgressIndicator';
import styles from './VehicleSelection.module.css';

interface VehicleSelectionProps {
  user: User | null;
  onServiceSelected: (service: ServiceLevel) => void;
  onBack?: () => void;
}

const servicelevels: ServiceLevel[] = [
  {
    id: 'standard',
    name: 'Armora Standard',
    tagline: 'Professional Security Transport',
    price: '£45',
    hourlyRate: 45,
    description: 'Professional security officers provide safe, reliable transport with comprehensive protection.',
    features: [
      'Certified security professional',
      'Advanced vehicle protection',
      'Real-time GPS tracking',
      '24/7 monitoring support',
      'Priority response protocol'
    ],
    socialProof: {
      tripsCompleted: 2847,
    }
  },
  {
    id: 'executive',
    name: 'Armora Executive', 
    tagline: 'Luxury Security Transport',
    price: '£75',
    hourlyRate: 75,
    description: 'Premium luxury vehicles with elite security professionals for VIP experiences.',
    features: [
      'Elite security specialist',
      'Luxury reinforced vehicle',
      'Discrete personal protection',
      'Priority response team',
      'Concierge service included',
      'Privacy screening available'
    ],
    socialProof: {
      tripsCompleted: 1203,
    }
  },
  {
    id: 'shadow',
    name: 'Armora Shadow',
    tagline: 'Independent Security Escort',
    price: '£65',
    hourlyRate: 65,
    description: 'Personal security escort service for independent travel with professional oversight.',
    features: [
      'Personal security escort',
      'Discrete protection service',
      'Independent travel support',
      'Priority backup available',
      'Flexible scheduling'
    ],
    isPopular: true,
    socialProof: {
      tripsCompleted: 3921,
      selectionRate: 67
    }
  }
];

export function VehicleSelection({ user, onServiceSelected, onBack }: VehicleSelectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceLevel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [servicesLoading] = useState(false);

  const handleServiceSelect = (service: ServiceLevel) => {
    setSelectedService(service);
    onServiceSelected(service);
  };

  const handleKeyDown = (event: React.KeyboardEvent, service: ServiceLevel) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleServiceSelect(service);
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

  const calculatePrice = (service: ServiceLevel) => {
    if (hasReward) {
      const discountedPrice = Math.max(0, service.hourlyRate * 0.5); // 50% off
      return `£${discountedPrice}`;
    }
    return service.price;
  };

  return (
    <div className={styles.container}>
      {/* Progress Indicator */}
      <BookingProgressIndicator currentStep="vehicle-selection" />
      
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}
        <h1 className={styles.title}>Choose Your Protection</h1>
        <p className={styles.subtitle}>Step 1 of 3 • Security Level Selection</p>
        <p className={styles.description}>
          Select the security service that best fits your needs
        </p>
        {hasReward && (
          <div className={styles.rewardBanner}>
            🎉 50% off your first ride - reward applied!
          </div>
        )}
      </div>

      <div className={styles.serviceGrid}>
        {servicesLoading ? (
          // Show skeleton loaders while services load
          <>
            <ServiceCardSkeletonLoader />
            <ServiceCardSkeletonLoader />
            <ServiceCardSkeletonLoader />
          </>
        ) : (
          servicelevels.map((service) => (
          <div
            key={service.id}
            data-testid={`service-${service.id}`}
            className={`${styles.serviceCard} ${
              selectedService?.id === service.id ? styles.selected : ''
            } ${service.isPopular ? styles.popular : ''}`}
            onClick={() => handleServiceSelect(service)}
            onKeyDown={(e) => handleKeyDown(e, service)}
            tabIndex={0}
            role="button"
            aria-label={`Select ${service.name} - ${service.tagline}`}
          >
            {service.isPopular && (
              <div className={styles.popularBadge}>Most Popular</div>
            )}
            
            <div className={styles.serviceHeader}>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <p className={styles.serviceTagline}>{service.tagline}</p>
            </div>

            <div className={styles.pricing}>
              <span className={styles.price}>
                {calculatePrice(service)}
                {hasReward && (
                  <span className={styles.originalPrice}>{service.price}</span>
                )}
              </span>
              <span className={styles.perHour}>per hour</span>
            </div>

            <p className={styles.description}>{service.description}</p>

            <div className={styles.features}>
              {service.features.map((feature, index) => (
                <div key={index} className={styles.feature}>
                  <span className={styles.checkmark}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {service.socialProof && (
              <div className={styles.socialProof}>
                {service.socialProof.tripsCompleted.toLocaleString()} trips completed
                {service.socialProof.selectionRate && (
                  <span className={styles.selectionRate}>
                    • {service.socialProof.selectionRate}% choose this
                  </span>
                )}
              </div>
            )}

            <div className={styles.selectIndicator}>
              {selectedService?.id === service.id ? '● Selected' : 'Select Service'}
            </div>
          </div>
          ))
        )}
      </div>

      {selectedService && (
        <div className={styles.footer}>
          <button 
            className={styles.continueButton} 
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" variant="light" text="Preparing Service..." inline />
            ) : (
              user?.userType === 'guest' ? 'Get Quote' : 'Book Now'
            )}
          </button>
        </div>
      )}
    </div>
  );
}