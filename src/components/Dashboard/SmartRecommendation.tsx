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
          <strong>Standard Protection</strong> - Your trusted security service
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

  // Enhanced version for first-time users with unified personalized design
  const handleBeginProtection = () => {
    onServiceSelect(recommendedService?.id || 'standard');
  };

  const handleSchedule = () => {
    // Navigate to booking with schedule mode - placeholder for future implementation
    onServiceSelect(recommendedService?.id || 'standard');
  };

  const handleOtherOptions = () => {
    // Navigate to full services view - placeholder for future implementation
    onServiceSelect(recommendedService?.id || 'standard');
  };

  return (
    <div className={styles.recommendationCard}>
      {/* Header emphasizing personalization */}
      <div className={styles.matchHeader}>
        <h3>YOUR PROTECTION MATCH</h3>
        <p>Based on your security profile</p>
      </div>

      {/* Visual match score */}
      <div className={styles.matchScoreBox}>
        <div className={styles.scoreText}>{recommendation.profile.matchScore}% MATCH SCORE</div>
        <div className={styles.scoreBar}>
          <div className={styles.scoreFill} style={{width: `${recommendation.profile.matchScore}%`}} />
        </div>
      </div>

      {/* Recommendation badge */}
      <div className={styles.recommendedBadge}>
        <span className={styles.trophy}>🏆</span>
        <span>RECOMMENDED FOR YOU</span>
      </div>

      {/* Service details */}
      <div className={styles.serviceSection}>
        <h2 className={styles.serviceName}>STANDARD PROTECTION</h2>
        <div className={styles.serviceDetails}>
          <span className={styles.price}>£45/hour</span>
          <span className={styles.separator}>•</span>
          <span className={styles.availability}>Available in 2 minutes</span>
        </div>
      </div>

      {/* Personalized benefits */}
      <div className={styles.benefits}>
        <div className={styles.benefitItem}>
          <span className={styles.check}>✓</span>
          <span>Matches your requirements</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.check}>✓</span>
          <span>SIA-certified officers</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.check}>✓</span>
          <span>Immediate availability</span>
        </div>
      </div>

      {/* Trust indicators */}
      <div className={styles.trustBar}>
        <span>⭐ 4.8</span>
        <span>👥 2.8K</span>
        <span>✓ Verified</span>
      </div>

      {/* Single clear CTA */}
      <button className={styles.activateBtn} onClick={handleBeginProtection}>
        ACTIVATE PROTECTION
      </button>

      {/* Alternative actions */}
      <div className={styles.alternativeActions}>
        <button className={styles.linkBtn} onClick={handleOtherOptions}>Other options →</button>
        <span className={styles.divider}>|</span>
        <button className={styles.linkBtn} onClick={handleSchedule}>Schedule later →</button>
      </div>
    </div>
  );
};

export default SmartRecommendation;