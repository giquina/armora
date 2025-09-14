import React, { useState, useEffect } from 'react';
import { ServiceLevel, User, PersonalizationData } from '../../types';
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

  // Minimal version for returning users
  if (displayType === 'returning') {
    return (
      <div className={styles.returningUserRec}>
        <div className={styles.quickRec}>
          <span className={styles.checkmark}>✅</span>
          <strong>Armora Secure</strong> - Your usual choice • £45/hour •
          <span className={styles.availability}> 2 drivers nearby</span>
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

  // Full version for first-time users
  return (
    <div className={styles.recommendationCard}>
      <div className={styles.header}>
        <span className={styles.icon}>⭐</span>
        <h3>Recommended: {recommendedService?.name}</h3>
      </div>

      <div className={styles.compactContent}>
        <div className={styles.mainMessage}>
          Professional security transport with SIA Level 2 certified drivers
          and real-time tracking - accessible protection at {recommendedService?.price}.
        </div>

        <div className={styles.quickStats}>
          <span className={styles.stat}>⭐ 4.8/5</span>
          <span className={styles.stat}>🛡️ 15,847+ safe trips</span>
          <span className={styles.stat}>⚡ 2 drivers nearby</span>
        </div>

        <div className={styles.urgencyBanner}>
          <span className={styles.urgencyIcon}>⏰</span>
          High demand area - book within 15 minutes for guaranteed service
        </div>

        <button
          className={styles.selectServiceBtn}
          onClick={() => onServiceSelect(recommendedService?.id || 'standard')}
        >
          Select {recommendedService?.name}
        </button>
      </div>
    </div>
  );
};