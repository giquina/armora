import React, { useState } from 'react';
import { ServiceLevel, User } from '../../types';
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
      'Armored vehicle protection',
      'Real-time GPS tracking',
      '24/7 monitoring support',
      'Emergency response protocol'
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
      'Luxury armored vehicle',
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
      'Emergency backup available',
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

  const handleServiceSelect = (service: ServiceLevel) => {
    setSelectedService(service);
  };

  const handleContinue = () => {
    if (selectedService) {
      onServiceSelected(selectedService);
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
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}
        <h1 className={styles.title}>Choose Your Protection</h1>
        <p className={styles.subtitle}>
          Select the security service that best fits your needs
        </p>
        {hasReward && (
          <div className={styles.rewardBanner}>
            🎉 50% off your first ride - reward applied!
          </div>
        )}
      </div>

      <div className={styles.serviceGrid}>
        {servicelevels.map((service) => (
          <div
            key={service.id}
            className={`${styles.serviceCard} ${
              selectedService?.id === service.id ? styles.selected : ''
            } ${service.isPopular ? styles.popular : ''}`}
            onClick={() => handleServiceSelect(service)}
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
        ))}
      </div>

      {selectedService && (
        <div className={styles.footer}>
          <button className={styles.continueButton} onClick={handleContinue}>
            Continue with {selectedService.name}
          </button>
        </div>
      )}
    </div>
  );
}