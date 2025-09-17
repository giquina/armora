import React, { useState, useEffect, useMemo } from 'react';
import { ServiceLevel, User, PersonalizationData } from '../../types';
import { generateRecommendation } from '../../utils/recommendationEngine';
import styles from './SmartRecommendation.module.css';

interface UserBookingHistory {
  totalBookings: number;
  lastBookingDate: string | null;
  isFirstTimeUser: boolean;
  preferredService?: string;
}

interface SmartRecommendationProps {
  services: ServiceLevel[];
  user: User | null;
  questionnaireData: PersonalizationData | null;
  onServiceSelect: (serviceId: string) => void;
}

// Fixed CSS variables for border visibility + simplified content
export const SmartRecommendation: React.FC<SmartRecommendationProps> = ({
  services,
  user,
  questionnaireData,
  onServiceSelect
}) => {
  // User booking history state
  const [userBookingHistory, setUserBookingHistory] = useState<UserBookingHistory>(() => {
    const saved = localStorage.getItem('armora_user_booking_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          totalBookings: 0,
          lastBookingDate: null,
          isFirstTimeUser: true
        };
      }
    }
    return {
      totalBookings: 0,
      lastBookingDate: null,
      isFirstTimeUser: true
    };
  });

  // Save booking history changes
  useEffect(() => {
    localStorage.setItem('armora_user_booking_history', JSON.stringify(userBookingHistory));
  }, [userBookingHistory]);

  // Get recommended service (currently always Armora Secure/Standard)
  const getRecommendedService = () => {
    // For now, always recommend Standard as it's the only available service
    return services.find(s => s.id === 'standard') || services[0];
  };

  // Determine display type based on booking history
  const getDisplayType = () => {
    if (userBookingHistory.totalBookings === 0) {
      return 'first-time';
    } else if (userBookingHistory.totalBookings >= 1) {
      return 'returning';
    }
    return 'first-time';
  };

  // Update booking history (to be called after successful booking)
  const updateBookingHistory = (serviceId: string) => {
    setUserBookingHistory(prev => ({
      ...prev,
      totalBookings: prev.totalBookings + 1,
      lastBookingDate: new Date().toISOString(),
      isFirstTimeUser: false,
      preferredService: serviceId
    }));
  };

  // Expose update function to parent (for post-booking update)
  useEffect(() => {
    // Attach to window for Dashboard to access
    (window as any).updateArmoraBookingHistory = updateBookingHistory;

    return () => {
      delete (window as any).updateArmoraBookingHistory;
    };
  }, []);

  const recommendedService = getRecommendedService();
  const displayType = getDisplayType();

  // Generate personalized recommendation - MEMOIZED to prevent re-renders
  const recommendation = useMemo(() =>
    generateRecommendation(questionnaireData, user, services),
    [questionnaireData, user, services]
  );

  // Minimal version for returning users - optimized for desktop
  if (displayType === 'returning') {
    return (
      <div className={styles.returningUserRec}>
        <div className={styles.quickRec}>
          <span className={styles.checkmark}>✅</span>
          <strong>SafeRide Standard</strong> - Your trusted security driver service
          <span className={styles.availability}> • 2 min away • Available now</span>
          <button
            className={styles.quickBookBtn}
            onClick={() => onServiceSelect('standard')}
          >
            Book Now
          </button>
        </div>
      </div>
    );
  }

  // Enhanced version for first-time users with streamlined content
  return (
    <div className={styles.recommendationCard}>
      <div className={styles.header}>
        <div className={styles.compactBadge}>
          <span className={styles.matchScore}>{recommendation.profile.matchScore}% MATCH</span>
          <span className={styles.separator}>•</span>
          <span className={styles.recommendedLabel}>RECOMMENDED</span>
        </div>
        <h3 className={styles.serviceName}>SafeRide Standard</h3>
      </div>

      <div className={styles.compactContent}>
        <div className={styles.contentLeft}>
          <div className={styles.recommendationExplanation}>
            <p className={styles.explanationText}>
              Your matched security drivers. Safe journeys, trusted by thousands.
            </p>
          </div>

          <div className={styles.benefitsList}>
            <div className={styles.benefit}>• Friendly, vetted security drivers</div>
            <div className={styles.benefit}>• Discrete & professional service</div>
            <div className={styles.benefit}>• Book instantly, 24/7</div>
          </div>
        </div>

        <div className={styles.contentRight}>
          <div className={styles.quickStats}>
            <span className={styles.stat}>⭐ 4.8 Rating</span>
            <span className={styles.stat}>👥 2,847+ Happy Riders</span>
            <span className={styles.stat}>⚡ 2 min away</span>
            <span className={styles.stat}>✅ Available Now</span>
          </div>

          <div className={styles.ctaSection}>
            <button
              className={styles.selectServiceBtn}
              onClick={() => onServiceSelect(recommendedService?.id || 'standard')}
            >
              BOOK SECURE RIDE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendation;