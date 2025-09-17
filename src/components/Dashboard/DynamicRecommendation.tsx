import React, { useState, useEffect } from 'react';
import { ServiceLevel, PersonalizationData } from '../../types';
import styles from './DynamicRecommendation.module.css';

interface DynamicRecommendationProps {
  recommendedService: string;
  services: ServiceLevel[];
  questionnaireData: PersonalizationData;
  userType?: 'registered' | 'google' | 'guest' | null;
  isFirstTime?: boolean;
}

interface TrustMetrics {
  rating: number;
  totalTrips: number;
  activeClients: number;
  reviewCount: number;
}

export function DynamicRecommendation({
  recommendedService,
  services,
  questionnaireData,
  userType = 'registered',
  isFirstTime = false
}: DynamicRecommendationProps) {
  const [availableDrivers, setAvailableDrivers] = useState(3);
  const [dismissed, setDismissed] = useState(false);

  // Trust metrics (simplified for compact display)
  const trustMetrics: TrustMetrics = {
    rating: 4.8,
    totalTrips: 15847,
    activeClients: 3200,
    reviewCount: 2847
  };

  // Simulate driver availability
  useEffect(() => {
    const drivers = Math.floor(Math.random() * 3) + 2; // 2-4 drivers
    setAvailableDrivers(drivers);
  }, []);

  // Get recommended service details
  const service = services.find(s => s.id === recommendedService);
  if (!service || dismissed) return null;

  // Get match percentage (simulate 85% for now)
  const getMatchPercentage = () => {
    return service.socialProof?.selectionRate || 85;
  };

  return (
    <div className={styles.notificationBanner}>
      <button
        className={styles.dismissButton}
        onClick={() => setDismissed(true)}
        aria-label="Dismiss recommendation"
      >
        ×
      </button>

      <div className={styles.bannerContent}>
        {/* Line 1: Match & Service */}
        <div className={styles.matchLine}>
          <span className={styles.matchBadge}>🎯 {getMatchPercentage()}% MATCH</span>
          <span className={styles.divider}>•</span>
          <span className={styles.serviceName}>{service.name}</span>
        </div>

        {/* Line 2: Tagline */}
        <div className={styles.tagline}>
          Perfect for your security needs
        </div>

        {/* Line 3: Rating, Time, Price */}
        <div className={styles.detailsLine}>
          <span className={styles.rating}>⭐ {trustMetrics.rating}</span>
          <span className={styles.divider}>•</span>
          <span className={styles.timeAway}>{availableDrivers} min away</span>
          <span className={styles.divider}>•</span>
          <span className={styles.price}>From £{service.hourlyRate}/hr</span>
        </div>

        {/* Line 4: Actions */}
        <div className={styles.actionsLine}>
          <button className={styles.bookButton}>
            BOOK NOW
          </button>
          <button className={styles.detailsButton}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}