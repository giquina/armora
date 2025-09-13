import React, { useState, useEffect } from 'react';
import { ServiceLevel } from '../../types';
import { Button } from '../UI/Button';
import styles from './ServiceCard.module.css';

// Service tier configuration for visual differentiation
const SERVICE_CONFIG = {
  standard: {
    theme: 'professional',
    icon: '🛡️',
    vehicle: 'BMW 5 Series',
    driverLevel: 'SIA Level 2',
    capacity: '4 passengers',
    eta: '5-8 min',
    rating: 4.8,
    reviewCount: 2847,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
    accentColor: '#c0c0c0'
  },
  executive: {
    theme: 'luxury',
    icon: '👑',
    vehicle: 'Mercedes S-Class',
    driverLevel: 'SIA Level 3',
    capacity: '4 passengers + luggage',
    eta: '3-5 min',
    rating: 4.9,
    reviewCount: 1653,
    gradient: 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)',
    accentColor: '#FFD700'
  },
  shadow: {
    theme: 'tactical',
    icon: '🕴️',
    vehicle: 'Armored Range Rover',
    driverLevel: 'Special Forces',
    capacity: '6 passengers + secure storage',
    eta: 'On-demand',
    rating: 5.0,
    reviewCount: 892,
    gradient: 'linear-gradient(135deg, #0f0f1f 0%, #1a1a2e 100%)',
    accentColor: '#ff4444'
  }
};

interface ServiceCardProps {
  service: ServiceLevel;
  isSelected: boolean;
  onSelect: (serviceId: 'standard' | 'executive' | 'shadow') => void;
  mode: 'selection' | 'preview';
  isRecommended?: boolean;
  onBookNow?: (serviceId: 'standard' | 'executive' | 'shadow') => void;
  onScheduleSelect?: (serviceId: 'standard' | 'executive' | 'shadow') => void;
}

export function ServiceCard({
  service,
  isSelected,
  onSelect,
  mode,
  isRecommended = false,
  onBookNow,
  onScheduleSelect
}: ServiceCardProps) {
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'busy' | 'surge'>('available');

  const config = SERVICE_CONFIG[service.id];

  // Simulate dynamic availability (in real app, this would come from API)
  useEffect(() => {
    const statuses: Array<'available' | 'busy' | 'surge'> = ['available', 'available', 'available', 'busy', 'surge'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setAvailabilityStatus(randomStatus);
  }, []);

  const handleSelect = () => {
    if (mode === 'selection') {
      onSelect(service.id);
    }
  };

  const getAvailabilityInfo = () => {
    switch (availabilityStatus) {
      case 'available':
        return { text: `${config.eta} away`, color: '#22c55e', icon: '🟢' };
      case 'busy':
        return { text: '10-15 min', color: '#f59e0b', icon: '🟡' };
      case 'surge':
        return { text: 'High demand', color: '#ef4444', icon: '🔴' };
      default:
        return { text: config.eta, color: '#22c55e', icon: '🟢' };
    }
  };

  const availability = getAvailabilityInfo();

  const cardClasses = [
    styles.serviceCard,
    isSelected && styles.selected,
    isRecommended && styles.recommended,
    service.isPopular && styles.popular,
    mode === 'preview' && styles.preview
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={handleSelect}
      data-service={service.id}
      style={{
        '--service-gradient': config.gradient,
        '--service-accent': config.accentColor,
        '--availability-color': availability.color
      } as React.CSSProperties}
    >
      {/* Top Corner Badges and Availability */}
      <div className={styles.topSection}>
        {/* Service Icon - Left Side */}
        <div className={styles.serviceIconContainer}>
          <div className={styles.serviceIcon}>{config.icon}</div>
        </div>

        {/* Right Corner Badges */}
        <div className={styles.topRightBadges}>
          {/* Availability Indicator */}
          <div className={styles.availabilityIndicator}>
            <span className={styles.availabilityDot} style={{ backgroundColor: availability.color }}></span>
            <span className={styles.availabilityText}>{availability.text}</span>
          </div>

          {/* Popular Badge */}
          {service.isPopular && (
            <div className={styles.popularBadge}>
              <span className={styles.popularIcon}>🔥</span>
              Most Popular
            </div>
          )}

          {/* Recommended Badge */}
          {isRecommended && (
            <div className={styles.recommendedBadge}>
              <span className={styles.recommendedIcon}>⭐</span>
              Recommended
            </div>
          )}
        </div>
      </div>

      {/* Service Header */}
      <div className={styles.serviceHeader}>
        <div className={styles.serviceInfo}>
          <h3 className={styles.serviceName}>{service.name}</h3>
          <p className={styles.serviceTagline}>{service.tagline}</p>
        </div>
        <div className={styles.priceInfo}>
          <div className={styles.price}>{service.price}</div>
          {availabilityStatus === 'surge' && (
            <div className={styles.surgeIndicator}>+£5 surge</div>
          )}
        </div>
      </div>

      {/* Vehicle and Driver Info */}
      <div className={styles.vehicleSection}>
        <div className={styles.vehicleInfo}>
          <div className={styles.vehicleDetail}>
            <span className={styles.vehicleLabel}>Vehicle:</span>
            <span className={styles.vehicleValue}>{config.vehicle}</span>
          </div>
          <div className={styles.vehicleDetail}>
            <span className={styles.vehicleLabel}>Capacity:</span>
            <span className={styles.vehicleValue}>{config.capacity}</span>
          </div>
        </div>
        <div className={styles.driverInfo}>
          <span className={styles.driverLabel}>Driver Qualification:</span>
          <span className={styles.driverLevel}>{config.driverLevel}</span>
        </div>
      </div>

      {/* Rating Section */}
      <div className={styles.ratingSection}>
        <div className={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.floor(config.rating) ? styles.starFilled : styles.starEmpty}>
              ⭐
            </span>
          ))}
          <span className={styles.ratingNumber}>{config.rating}</span>
        </div>
        <span className={styles.reviewCount}>({config.reviewCount.toLocaleString()} rides)</span>
      </div>

      {/* Service Description */}
      <div className={styles.descriptionSection}>
        <p className={styles.description}>{service.description}</p>
      </div>


      {/* Social Proof */}
      {service.socialProof && (
        <div className={styles.socialProof}>
          <div className={styles.socialProofItem}>
            <span className={styles.socialProofNumber}>
              {service.socialProof.tripsCompleted.toLocaleString()}
            </span>
            <span className={styles.socialProofLabel}>trips completed</span>
          </div>
          {service.socialProof.selectionRate && (
            <div className={styles.socialProofItem}>
              <span className={styles.socialProofNumber}>
                {service.socialProof.selectionRate}%
              </span>
              <span className={styles.socialProofLabel}>choose this service</span>
            </div>
          )}
        </div>
      )}

      {/* Card Footer - Direct Booking Actions */}
      <div className={styles.cardFooter}>
        {mode === 'selection' ? (
          <div className={styles.bookingActions}>
            <Button
              variant="primary"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(service.id);
                onBookNow?.(service.id);
              }}
              className={styles.bookNowButton}
            >
              Book Now
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(service.id);
                onScheduleSelect?.(service.id);
              }}
              className={styles.scheduleButton}
            >
              Schedule for Later
            </Button>
          </div>
        ) : (
          <div className={styles.previewFooter}>
            <p className={styles.previewText}>
              Create account to book this service
            </p>
          </div>
        )}
      </div>

    </div>
  );
}