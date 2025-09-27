import { useState } from 'react';
import { SERVICES_DATA } from '../../data/servicesData';
import styles from './ServiceComparisonTable.module.css';

interface Feature {
  label: string;
  key: string;
  highlight?: 'lowest' | 'highest';
  format?: (value: any) => string;
}

const COMPARISON_FEATURES: Feature[] = [
  {
    label: 'Hourly Rate',
    key: 'hourlyRate',
    highlight: 'lowest',
    format: (value) => `£${value}/hr`
  },
  { label: 'Vehicle Type', key: 'vehicle' },
  { label: 'Response Time', key: 'responseTime' },
  { label: 'Protection Level', key: 'protectionLevel', highlight: 'highest' },
  { label: 'Officer Training', key: 'training' },
  { label: 'Discretion Level', key: 'discretion' },
  { label: 'Coverage Areas', key: 'coverage' },
  { label: 'Insurance Coverage', key: 'insurance' }
];

const getFeatureValue = (serviceId: string, featureKey: string): string => {
  const service = SERVICES_DATA.find(s => s.id === serviceId);
  if (!service) return '-';

  const featureMap: Record<string, any> = {
    hourlyRate: service.id === 'standard' ? 50 :
                service.id === 'executive' ? 95 :
                service.id === 'shadow' ? 85 :
                service.id === 'event' ? 120 : 200,
    vehicle: service.vehicle,
    responseTime: service.id === 'standard' ? '10-15 min' :
                  service.id === 'executive' ? '5-10 min' :
                  service.id === 'shadow' ? '8-12 min' :
                  service.id === 'event' ? '15-30 min' : '2-5 min',
    protectionLevel: service.id === 'standard' ? 'Basic' :
                     service.id === 'executive' ? 'Advanced' :
                     service.id === 'shadow' ? 'Specialist' :
                     service.id === 'event' ? 'Event-Specific' : 'VIP',
    training: service.id === 'standard' ? 'SIA Licensed' :
              service.id === 'executive' ? 'Ex-Military/Police' :
              service.id === 'shadow' ? 'Intelligence Trained' :
              service.id === 'event' ? 'Event Security' : 'Elite Protection',
    discretion: service.id === 'standard' ? 'Professional' :
                service.id === 'executive' ? 'Corporate' :
                service.id === 'shadow' ? 'Covert' :
                service.id === 'event' ? 'Event Appropriate' : 'Ultra-Discrete',
    coverage: service.id === 'standard' ? 'Greater London' :
              service.id === 'executive' ? 'UK-wide' :
              service.id === 'shadow' ? 'International' :
              service.id === 'event' ? 'Event Venues' : 'Global',
    insurance: service.id === 'standard' ? '£5M' :
               service.id === 'executive' ? '£10M' :
               service.id === 'shadow' ? '£15M' :
               service.id === 'event' ? '£20M' : '£50M'
  };

  return featureMap[featureKey] || '-';
};

export function ServiceComparisonTable() {
  const [selectedServices, setSelectedServices] = useState<string[]>(['standard', 'executive']);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const availableServices = SERVICES_DATA.slice(0, 4); // Exclude wedding for comparison

  const toggleService = (serviceId: string) => {
    setSelectedServices(current => {
      if (current.includes(serviceId)) {
        // Remove if already selected (but keep minimum of 1)
        return current.length > 1 ? current.filter(id => id !== serviceId) : current;
      } else {
        // Add if not selected (max 3 services)
        return current.length < 3 ? [...current, serviceId] : current;
      }
    });
  };

  const getHighlightedValue = (feature: Feature, serviceId: string) => {
    if (!feature.highlight) return false;

    const values = selectedServices.map(id => {
      const rawValue = getFeatureValue(id, feature.key);
      if (feature.key === 'hourlyRate') {
        return parseInt(rawValue.replace(/[£/hr]/g, ''));
      }
      return rawValue;
    });

    const currentValue = getFeatureValue(serviceId, feature.key);
    const currentNumeric = feature.key === 'hourlyRate' ?
      parseInt(currentValue.replace(/[£/hr]/g, '')) : currentValue;

    if (feature.highlight === 'lowest' && feature.key === 'hourlyRate') {
      return currentNumeric === Math.min(...values as number[]);
    }

    return false;
  };

  const generateRecommendation = () => {
    if (selectedServices.length < 2) return '';

    const recommendations: Record<string, string> = {
      'standard,executive': 'For daily use, Essential offers great value. For business meetings, Executive provides the professional image you need.',
      'standard,shadow': 'Essential for routine protection, Shadow for sensitive situations requiring discretion.',
      'executive,shadow': 'Both offer premium protection - Executive for corporate visibility, Shadow for covert operations.',
      'standard,executive,shadow': 'You have diverse needs! Essential for daily use, Executive for business, Shadow for sensitive missions.'
    };

    const key = selectedServices.sort().join(',');
    return recommendations[key] || 'Each service is designed for specific protection needs. Consider your primary use case.';
  };

  const displayedFeatures = showAllFeatures ? COMPARISON_FEATURES : COMPARISON_FEATURES.slice(0, 4);

  return (
    <div className={styles.comparisonSection}>
      <div className={styles.comparisonHeader}>
        <h2 className={styles.title}>📊 Compare Protection Services</h2>
        <p className={styles.subtitle}>Select up to 3 services to compare side-by-side</p>
      </div>

      {/* Service Selector Chips */}
      <div className={styles.serviceChips}>
        {availableServices.map((service) => (
          <button
            key={service.id}
            className={`${styles.chip} ${selectedServices.includes(service.id) ? styles.selected : ''}`}
            onClick={() => toggleService(service.id)}
            disabled={selectedServices.length >= 3 && !selectedServices.includes(service.id)}
          >
            <span className={styles.chipIcon}>{service.icon}</span>
            <span className={styles.chipName}>{service.name}</span>
            {selectedServices.includes(service.id) && (
              <span className={styles.removeChip}>×</span>
            )}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className={styles.tableContainer}>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th className={styles.featureColumn}>Feature</th>
              {selectedServices.map(serviceId => {
                const service = SERVICES_DATA.find(s => s.id === serviceId);
                return (
                  <th key={serviceId} className={styles.serviceColumn}>
                    <div className={styles.serviceHeader}>
                      <span className={styles.serviceIcon}>{service?.icon}</span>
                      <span className={styles.serviceName}>{service?.name}</span>
                      <span className={styles.servicePrice}>{service?.price}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayedFeatures.map(feature => (
              <tr key={feature.key}>
                <td className={styles.featureName}>{feature.label}</td>
                {selectedServices.map(serviceId => {
                  const value = getFeatureValue(serviceId, feature.key);
                  const formattedValue = feature.format ? feature.format(value) : value;
                  const isHighlighted = getHighlightedValue(feature, serviceId);

                  return (
                    <td
                      key={serviceId}
                      className={isHighlighted ? styles.highlighted : ''}
                    >
                      {formattedValue}
                      {isHighlighted && <span className={styles.badge}>BEST</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className={styles.showMoreButton}
          onClick={() => setShowAllFeatures(!showAllFeatures)}
        >
          {showAllFeatures ? 'Show Less Features ↑' : 'Show More Features ↓'}
        </button>
      </div>

      {/* AI Recommendation */}
      <div className={styles.aiRecommendation}>
        <div className={styles.aiHeader}>
          <span className={styles.aiIcon}>🤖</span>
          <span className={styles.aiTitle}>AI Recommendation</span>
        </div>
        <p className={styles.aiText}>{generateRecommendation()}</p>
      </div>
    </div>
  );
}