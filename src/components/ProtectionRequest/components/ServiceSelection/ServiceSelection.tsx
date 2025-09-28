import React from 'react';
import styles from './ServiceSelection.module.css';
import { Tooltip } from '../Tooltip/Tooltip';

export interface ServiceTier {
  id: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
  name: string;
  icon: string;
  rate: string;
  hourlyRate: number;
  description: string;
  responseTime: string;
  features: string[];
  badge?: string;
  popular?: boolean;
  officerProfile: string[];
  idealFor: string[];
}

interface ServiceSelectionProps {
  /** Available service tiers */
  serviceTiers: ServiceTier[];
  /** Currently selected service tier ID */
  selectedServiceId: string;
  /** Service selection change handler */
  onServiceChange: (service: ServiceTier) => void;
  /** Additional CSS classes */
  className?: string;
}

interface ServiceCardProps {
  service: ServiceTier;
  isSelected: boolean;
  onSelect: (service: ServiceTier) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onSelect }) => {
  return (
    <button
      className={`${styles.serviceCard} ${isSelected ? styles.selected : ''} ${service.popular ? styles.popular : ''}`}
      onClick={() => onSelect(service)}
      aria-pressed={isSelected}
    >
      {/* Badge for popular or special options */}
      {service.badge && (
        <div className={styles.badge}>
          {service.badge}
        </div>
      )}

      {/* Service Icon and Name */}
      <div className={styles.serviceHeader}>
        <div className={styles.serviceHeaderLeft}>
          <span className={styles.serviceIcon} role="img" aria-hidden="true">
            {service.icon}
          </span>
          <div className={styles.serviceName}>
            <h3 className={styles.name}>
              {service.name}
              <Tooltip content={`Professional ${service.name.toLowerCase()} service with specialized security training`}>
                <span className={styles.helpIcon}>ⓘ</span>
              </Tooltip>
            </h3>
            <p className={styles.description}>{service.description}</p>
          </div>
        </div>
        <div className={styles.serviceHeaderRight}>
          <p className={styles.rate}>{service.rate}</p>
          <div className={styles.responseTime}>
            <span className={styles.responseIcon}>⚡</span>
            <span className={styles.responseText}>{service.responseTime}</span>
          </div>
        </div>
      </div>

      {/* Officer Profile */}
      <div className={styles.officerProfile}>
        <h4 className={styles.profileTitle}>Officer Profile:</h4>
        <ul className={styles.profileList}>
          {service.officerProfile.map((item, index) => (
            <li key={index} className={styles.profileItem}>
              <span className={styles.profileIcon}>•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Ideal For */}
      <div className={styles.idealFor}>
        <h4 className={styles.idealTitle}>Ideal for:</h4>
        <ul className={styles.idealList}>
          {service.idealFor.map((scenario, index) => (
            <li key={index} className={styles.idealItem}>
              <span className={styles.idealIcon}>•</span>
              {scenario}
            </li>
          ))}
        </ul>
      </div>

      {/* Features List */}
      <ul className={styles.features}>
        {service.features.map((feature, index) => (
          <li key={index} className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Selection Indicator */}
      <div className={styles.selectionIndicator}>
        {isSelected && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 12 2 2 4-4"/>
          </svg>
        )}
      </div>
    </button>
  );
};

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  serviceTiers,
  selectedServiceId,
  onServiceChange,
  className = ''
}) => {
  const selectedService = serviceTiers.find(service => service.id === selectedServiceId);

  return (
    <div className={`${styles.serviceSelection} ${className}`}>
      {/* Service Clarity Section */}
      <div className={styles.serviceClarity}>
        <h3 className={styles.clarityTitle}>What is Close Protection?</h3>
        <p className={styles.clarityDescription}>
          A licensed security professional accompanies you for personal safety.
        </p>
        <ul className={styles.clarityList}>
          <li>• NOT a taxi or chauffeur service</li>
          <li>• Your CPO stays with you entire time</li>
          <li>• Minimum 2-hour booking</li>
        </ul>
        <button className={styles.learnMoreButton}>Learn More</button>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Choose Your Protection Level</h2>
        <p className={styles.sectionSubtitle}>
          All officers are SIA licensed with specialized security training
        </p>
      </div>

      <div className={styles.serviceGrid}>
        {serviceTiers.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={service.id === selectedServiceId}
            onSelect={onServiceChange}
          />
        ))}
      </div>

      {/* Selected Service Summary */}
      {selectedService && (
        <div className={styles.selectedSummary}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryIcon}>{selectedService.icon}</span>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryName}>{selectedService.name}</span>
              <span className={styles.summaryRate}>{selectedService.rate}</span>
            </div>
          </div>
          <p className={styles.summaryDescription}>
            {selectedService.description} • {selectedService.responseTime} response
          </p>
        </div>
      )}
    </div>
  );
};