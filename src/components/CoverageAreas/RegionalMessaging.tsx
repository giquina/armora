import React from 'react';
import styles from './RegionalMessaging.module.css';

interface RegionalMessagingProps {
  userLocation: string | null;
}

export function RegionalMessaging({ userLocation }: RegionalMessagingProps) {
  const getRegionalMessage = () => {
    if (!userLocation) {
      return {
        icon: '🇬🇧',
        title: 'Nationwide Protection Coverage',
        message: 'Professional security services available across the UK',
        callToAction: 'Check coverage in your area',
        priority: 'standard'
      };
    }

    switch (userLocation.toLowerCase()) {
      case 'london':
        return {
          icon: '⚡',
          title: 'Rapid Response in London',
          message: 'Same-day protection available across all London boroughs within M25',
          callToAction: 'Book immediate protection',
          priority: 'high'
        };

      case 'manchester':
        return {
          icon: '🏢',
          title: 'Local Officers Available in Manchester',
          message: 'Dedicated Manchester team with city center specialists',
          callToAction: 'Connect with local team',
          priority: 'medium'
        };

      case 'birmingham':
        return {
          icon: '🏭',
          title: 'Birmingham Operations Center',
          message: 'West Midlands coverage with industrial area expertise',
          callToAction: 'Book Birmingham protection',
          priority: 'medium'
        };

      case 'liverpool':
        return {
          icon: '⚓',
          title: 'Merseyside Protection Services',
          message: 'Port city specialists and cultural district teams available',
          callToAction: 'Secure Liverpool transport',
          priority: 'medium'
        };

      case 'bristol':
        return {
          icon: '🌊',
          title: 'South West Operations',
          message: 'Bristol hub covering tech corridor and coastal regions',
          callToAction: 'Book South West protection',
          priority: 'medium'
        };

      default:
        // For other locations, check if it's a major city or rural
        const majorCities = ['leeds', 'sheffield', 'newcastle', 'edinburgh', 'glasgow', 'cardiff', 'nottingham', 'leicester'];

        if (majorCities.some(city => userLocation.toLowerCase().includes(city))) {
          return {
            icon: '🏙️',
            title: `Protection Available in ${userLocation}`,
            message: 'Advanced booking recommended for optimal service delivery',
            callToAction: 'Schedule protection service',
            priority: 'low'
          };
        } else {
          return {
            icon: '🌱',
            title: 'Rural Area Coverage',
            message: 'Specialized rural and estate protection with advance booking',
            callToAction: 'Request coverage assessment',
            priority: 'low'
          };
        }
    }
  };

  const regionalData = getRegionalMessage();

  const getPriorityClass = () => {
    switch (regionalData.priority) {
      case 'high': return styles.priorityHigh;
      case 'medium': return styles.priorityMedium;
      case 'low': return styles.priorityLow;
      default: return styles.priorityStandard;
    }
  };

  const getResponseTimeInfo = () => {
    switch (regionalData.priority) {
      case 'high':
        return {
          time: '10-15 minutes',
          availability: '24/7 Coverage',
          officers: '12+ Local Officers'
        };
      case 'medium':
        return {
          time: '15-25 minutes',
          availability: 'Same Day Service',
          officers: '6+ Local Officers'
        };
      case 'low':
        return {
          time: '2-4 hours',
          availability: 'Advance Booking',
          officers: 'Deployed Officers'
        };
      default:
        return {
          time: 'Variable',
          availability: 'UK Wide',
          officers: 'Nationwide Network'
        };
    }
  };

  const responseInfo = getResponseTimeInfo();

  return (
    <div className={`${styles.messagingContainer} ${getPriorityClass()}`}>
      <div className={styles.messagingContent}>
        <div className={styles.messageHeader}>
          <span className={styles.messageIcon}>{regionalData.icon}</span>
          <div className={styles.messageText}>
            <h3 className={styles.messageTitle}>{regionalData.title}</h3>
            <p className={styles.messageDescription}>{regionalData.message}</p>
          </div>
        </div>

        <div className={styles.responseMetrics}>
          <div className={styles.metric}>
            <span className={styles.metricIcon}>⚡</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{responseInfo.time}</span>
              <span className={styles.metricLabel}>Response Time</span>
            </div>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricIcon}>🕐</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{responseInfo.availability}</span>
              <span className={styles.metricLabel}>Availability</span>
            </div>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricIcon}>👮</span>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{responseInfo.officers}</span>
              <span className={styles.metricLabel}>Officers</span>
            </div>
          </div>
        </div>

        <button className={styles.ctaButton}>
          {regionalData.callToAction}
        </button>
      </div>

      {userLocation && (
        <div className={styles.locationInfo}>
          <span className={styles.locationIcon}>📍</span>
          <span className={styles.locationText}>Detected location: {userLocation}</span>
          <button className={styles.changeLocationButton}>Change</button>
        </div>
      )}
    </div>
  );
}