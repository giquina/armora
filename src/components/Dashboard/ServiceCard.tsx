import React from 'react';
import { ServiceLevel } from '../../types';
import { Button } from '../UI/Button';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  service: ServiceLevel;
  isSelected: boolean;
  onSelect: (serviceId: 'standard' | 'executive' | 'shadow') => void;
  mode: 'selection' | 'preview';
  isRecommended?: boolean;
}

export function ServiceCard({ 
  service, 
  isSelected, 
  onSelect, 
  mode,
  isRecommended = false 
}: ServiceCardProps) {
  const handleSelect = () => {
    if (mode === 'selection') {
      onSelect(service.id);
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
    <div className={cardClasses} onClick={handleSelect}>
      {/* Popular Badge */}
      {service.isPopular && (
        <div className={styles.popularBadge}>
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

      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.serviceInfo}>
          <h3 className={styles.serviceName}>{service.name}</h3>
          <p className={styles.serviceTagline}>{service.tagline}</p>
        </div>
        
        <div className={styles.priceInfo}>
          <div className={styles.price}>{service.price}</div>
          {service.originalPrice && (
            <div className={styles.originalPrice}>{service.originalPrice}</div>
          )}
        </div>
      </div>

      {/* Service Description */}
      <div className={styles.cardContent}>
        <p className={styles.description}>{service.description}</p>

        {/* Features List */}
        <div className={styles.features}>
          <h4 className={styles.featuresTitle}>Included:</h4>
          <ul className={styles.featuresList}>
            {service.features.slice(0, mode === 'preview' ? 3 : service.features.length).map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                {feature}
              </li>
            ))}
            {mode === 'preview' && service.features.length > 3 && (
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>+</span>
                {service.features.length - 3} more features...
              </li>
            )}
          </ul>
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
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        {mode === 'selection' ? (
          <Button
            variant={isSelected ? "primary" : "outline"}
            size="md"
            isFullWidth
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className={styles.selectButton}
          >
            {isSelected ? "Selected" : "Select Service"}
          </Button>
        ) : (
          <div className={styles.previewFooter}>
            <p className={styles.previewText}>
              Create account to book this service
            </p>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && mode === 'selection' && (
        <div className={styles.selectionIndicator}>
          <div className={styles.selectionCheck}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}