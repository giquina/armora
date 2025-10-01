import { memo, useState } from 'react';
import { ServiceLevel } from '../../types';
import { Button } from '../UI/Button';
import styles from './ServiceCard.module.css';

// Service tier configuration with complete pricing and enhanced SIA-compliant descriptions
const SERVICE_CONFIG = {
  standard: {
    name: 'Essential Protection',
    protectionRate: '£50',
    transportRate: '£2.50',
    rating: 4.8,
    reviews: '2,847',
    vehicle: 'Secure transport vehicles',
    icon: '🛡️',
    tagline: 'Professional close protection for everyday security',
    credentials: '1 SIA-licensed Protection Officer',
    features: [
      'Single CPO for door-to-door security',
      'Security assessment and route planning',
      'Real-time tracking and 24/7 support',
      'Perfect for: Business meetings, property viewings, medical appointments'
    ]
  },
  'client-vehicle': {
    name: 'Client Vehicle Service',
    protectionRate: '£55',
    transportRate: 'No mileage charge',
    rating: 4.8,
    reviews: '2,156',
    vehicle: 'Your personal vehicle',
    icon: '🔑',
    tagline: 'SIA-trained officer operates your personal vehicle',
    credentials: 'Protection officer for your vehicle',
    features: [
      'Officer arrives and operates your car',
      'No mileage charges for your vehicle',
      'Complete privacy and familiarity',
      'Perfect for: Using your car, family vehicles, regular commutes'
    ]
  },
  executive: {
    name: 'Executive Protection',
    protectionRate: '£75',
    transportRate: '£3.50',
    rating: 4.9,
    reviews: '1,326',
    vehicle: 'BMW 5 Series • Mercedes S-Class',
    icon: '👔',
    tagline: 'Enhanced security with advance reconnaissance',
    credentials: '1-2 Protection Officers (scalable)',
    features: [
      '1-2 CPOs depending on requirements',
      'Advance venue reconnaissance (24hrs prior)',
      'Coordinated team protection when needed',
      'Perfect for: VIP events, high-value meetings, public appearances'
    ]
  },
  shadow: {
    name: 'Shadow Protection',
    protectionRate: '£65',
    transportRate: '£3.00',
    rating: 4.7,
    reviews: '1,892',
    vehicle: 'Unmarked vehicles • Plain clothes',
    icon: '🕵️',
    tagline: 'Covert protection with maximum scalability',
    credentials: '1-6 Officers (fully scalable)',
    features: [
      '1-6 CPOs scalable based on threat assessment',
      'Plain clothes covert layered security',
      'Special Forces trained specialists',
      'Perfect for: High-threat situations, complete anonymity, HNW individuals'
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

export const ServiceCard = memo(function ServiceCard({
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
  const [showExpandedInfo] = useState(false);
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
    if (mode === 'preview' && onDirectBook) {
      onDirectBook(service);
    } else {
      setIsBookingLoading(true);
      setTimeout(() => {
        onBookNow?.(service);
      }, 300);
    }
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
          <div className={styles.expandedItem}>• 2-hour minimum protection assignment</div>

          <div className={styles.expandedHeader}>PERFECT FOR:</div>
          <div className={styles.expandedItem}>• Business meetings</div>
          <div className={styles.expandedItem}>• Airport transfers</div>
          <div className={styles.expandedItem}>• Evening events</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={`${styles.actionButtons} ${mode === 'selection' ? styles.multipleButtons : ''}`}>
        {mode === 'preview' ? (
          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleBookNow();
            }}
            className={styles.requestNewButton}
            disabled={isBookingLoading}
          >
            {isBookingLoading ? 'Processing...' : `Request ${config.name}`}
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleBookNow();
              }}
              className={styles.requestNewButton}
              disabled={isBookingLoading}
            >
              {isBookingLoading ? 'Processing...' : 'Request New'}
            </Button>

            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                // Template selection implementation placeholder
              }}
              className={styles.useTemplateButton}
            >
              Use Template
            </Button>
          </>
        )}
      </div>
    </div>
  );
});