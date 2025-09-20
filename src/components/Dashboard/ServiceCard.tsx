import React, { useState, useEffect } from 'react';
import { ServiceLevel } from '../../types';
import { Button } from '../UI/Button';
import { InlineQuickScheduling } from '../UI/InlineQuickScheduling';
import { StreamlinedBookingModal } from '../UI/StreamlinedBookingModal';
import styles from './ServiceCard.module.css';

// Service tier configuration with breakdown pricing format
const SERVICE_CONFIG = {
  standard: {
    name: 'Essential Protection',
    protectionRate: '£50',
    transportRate: '£2.50',
    rating: 4.8,
    reviews: '2,847',
    vehicle: 'Nissan Leaf EV • Eco-friendly, discrete',
    icon: '🛡️',
    tagline: 'Professional protection for everyday security',
    credentials: 'SIA-licensed protection officers',
    features: [
      'Background verified & insured',
      'Real-time tracking',
      '24/7 support'
    ]
  },
  'client-vehicle': {
    name: 'Personal Vehicle Service',
    protectionRate: '£55',
    transportRate: 'No mileage charge',
    rating: 4.8,
    reviews: '2,156',
    vehicle: 'Your vehicle requirements',
    icon: '🔑',
    tagline: 'Your car, our protection expertise',
    credentials: 'Perfect for luxury car owners',
    features: [
      'Maintain total privacy',
      'Save on mileage charges',
      'Any vehicle type accepted'
    ]
  },
  executive: {
    name: 'Executive Protection',
    protectionRate: '£75',
    transportRate: '£2.50',
    rating: 4.9,
    reviews: '1,326',
    vehicle: 'Mercedes S-Class • Ultimate luxury',
    icon: '👔',
    tagline: 'Premium security for high-profile clients',
    credentials: 'Senior protection officers (10+ years)',
    features: [
      'Enhanced security protocols',
      'Premium vehicle fleet',
      'Route reconnaissance included'
    ]
  },
  shadow: {
    name: 'Shadow Protection',
    protectionRate: '£65',
    transportRate: '£2.50',
    rating: 4.7,
    reviews: '1,892',
    vehicle: 'Unmarked premium vehicles • Blend in',
    icon: '🕵️',
    tagline: 'Discreet security without drawing attention',
    credentials: 'Plainclothes protection specialists',
    features: [
      'Covert security operations',
      'Surveillance detection',
      'Maximum discretion'
    ]
  }
};

interface ServiceCardProps {
  service: ServiceLevel;
  isSelected: boolean;
  onSelect: (service: ServiceLevel) => void;
  mode: 'selection' | 'preview';
  isRecommended?: boolean;
  onBookNow?: (service: ServiceLevel) => void;
  onScheduleSelect?: (service: ServiceLevel) => void;
  onDirectBook?: (service: ServiceLevel) => void;
  userType?: 'registered' | 'google' | 'guest' | null;
}

export function ServiceCard({
  service,
  isSelected,
  onSelect,
  mode,
  isRecommended = false,
  onBookNow,
  onScheduleSelect,
  onDirectBook,
  userType = null
}: ServiceCardProps) {
  const [showExpandedInfo, setShowExpandedInfo] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);


  const config = SERVICE_CONFIG[service.id as keyof typeof SERVICE_CONFIG];

  // If config doesn't exist, skip rendering
  if (!config) {
    return null;
  }

  const handleSelect = () => {
    if (mode === 'selection') {
      onSelect(service);
    } else if (mode === 'preview' && onDirectBook) {
      onDirectBook(service);
    }
  };

  const handleBookNow = () => {
    setIsBookingLoading(true);
    setTimeout(() => {
      onBookNow?.(service);
    }, 300);
  };

  const handleMoreInfo = () => {
    setShowExpandedInfo(!showExpandedInfo);
  };

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
      data-testid={`service-${service.id}`}
      data-service={service.id}
    >
      {/* Service Header */}
      <div className={styles.cardHeader}>
        <div className={styles.serviceTitle}>
          <span className={styles.serviceIcon}>{config?.icon || '🛡️'}</span>
          <h3 className={styles.serviceName}>{config?.name || service.name}</h3>
        </div>
        {isRecommended && (
          <div className={styles.recommendedBadge}>RECOMMENDED</div>
        )}
      </div>

      {/* Service Tagline */}
      <p className={styles.serviceTagline}>{config?.tagline || service.tagline}</p>

      {/* Vehicle Info */}
      <div className={styles.vehicleInfo}>{config?.vehicle || service.vehicle}</div>

      {/* Service Rates Breakdown */}
      <div className={styles.serviceRates}>
        <div className={styles.ratesTitle}>Service Rates:</div>
        <div className={styles.rateItem}>
          <span className={styles.rateLabel}>Protection:</span>
          <span className={styles.rateValue}>{config?.protectionRate || '£50'}/hour</span>
        </div>
        <div className={styles.rateItem}>
          <span className={styles.rateLabel}>Transport:</span>
          <span className={styles.rateValue}>
            {config?.transportRate === 'No mileage charge' ? 'No mileage charge' : `${config?.transportRate || '£2.50'}/mile`}
          </span>
        </div>
        <div className={styles.rateMinimum}>(2-hour minimum)</div>
      </div>

      {/* Rating and Reviews */}
      <div className={styles.ratingSection}>
        <span className={styles.rating}>⭐ {config?.rating || 4.8} ({config?.reviews || '2,000+'} assignments)</span>
      </div>

      {/* Features List */}
      <div className={styles.featuresList}>
        <div className={styles.featuresTitle}>{config?.credentials || 'SIA-licensed protection officers'}</div>
        {(config?.features || ['Professional close protection', 'Background verified & insured', 'Real-time tracking']).map((feature, index) => (
          <div key={index} className={styles.featureItem}>
            <span className={styles.checkmark}>✓</span>
            <span className={styles.featureText}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Expanded Info */}
      {showExpandedInfo && (
        <div className={styles.expandedInfo}>
          <div className={styles.expandedHeader}>SERVICE DETAILS:</div>
          <div className={styles.expandedItem}>• Professional close protection</div>
          <div className={styles.expandedItem}>• Threat assessment included</div>
          <div className={styles.expandedItem}>• 2-hour minimum booking</div>

          <div className={styles.expandedHeader}>PERFECT FOR:</div>
          <div className={styles.expandedItem}>• Business meetings</div>
          <div className={styles.expandedItem}>• Airport transfers</div>
          <div className={styles.expandedItem}>• Evening events</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Button
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleBookNow();
          }}
          className={styles.bookButton}
          disabled={isBookingLoading}
        >
          {isBookingLoading ? 'Processing...' : 'Request Protection'}
        </Button>

        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleMoreInfo();
          }}
          className={styles.moreInfoButton}
        >
          More Info {showExpandedInfo ? '▲' : '▼'}
        </Button>
      </div>
    </div>
  );
}