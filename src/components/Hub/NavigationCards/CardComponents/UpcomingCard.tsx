import React, { useState, useEffect } from 'react';
import { MiniCalendar } from './MicroVisualizations/MiniCalendar';
import styles from '../NavigationCards.module.css';

interface Assignment {
  id: string;
  date: string;
  time: string;
  duration: string;
  officerName: string;
  officerSIA: string;
  serviceTier: 'Essential' | 'Executive' | 'Shadow';
  totalCost: number;
  status: string;
  location: {
    start: string;
    end: string;
  };
  rating?: number;
  vehicleType: string;
}

interface UpcomingCardData {
  nextAssignment: string;
  countdown: string;
  officerAssigned: string;
  dayOfWeek: string;
  duration: string;
  totalScheduled: number;
  favoriteTimeSlot: boolean;
  miniCalendar: number[];
  count: number;
  assignmentData?: Assignment | null;
}

interface UpcomingCardProps {
  data: UpcomingCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
  tabId?: string;
  ariaControls?: string;
}

export const UpcomingCard: React.FC<UpcomingCardProps> = ({
  data,
  isActive,
  onClick,
  screenWidth = 375,
  tabId,
  ariaControls
}) => {
  // With 1-per-row layout, we have full width to show all data
  const showFullData = true;
  const showVisuals = screenWidth >= 320;

  // Live countdown state
  const [liveCountdown, setLiveCountdown] = useState(data.countdown);

  useEffect(() => {
    // Update countdown every minute (simplified for demo)
    const interval = setInterval(() => {
      // In real implementation, calculate from actual timestamp
      setLiveCountdown(data.countdown);
    }, 60000);

    return () => clearInterval(interval);
  }, [data.countdown]);


  return (
    <button
      className={`${styles.navCard} ${styles.upcoming} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-controls={ariaControls}
      id={tabId}
    >
      {/* Header */}
      <div className={styles.navCardHeader}>
        <div className={styles.navCardLeft}>
          <span className={styles.navCardIcon}>📅</span>
          <span className={styles.navCardTitle}>Upcoming</span>
          <span className={styles.navCardCount}>({data.count})</span>
        </div>
        {isActive && <span className={styles.activeIndicator}>●</span>}
      </div>

      {/* Enhanced Content */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Header with Amber Indicator */}
          <div className={styles.upcomingHeader}>
            <div className={styles.statusSection}>
              <span className={styles.amberIndicator}>●</span>
              <span className={styles.statusText}>NEXT PROTECTION</span>
            </div>
            <div className={styles.nextDateTime}>Tomorrow 09:00</div>
          </div>

          {/* Service Details - NO officer name */}
          <div className={styles.serviceDetails}>
            <div className={styles.serviceStatus}>
              <span className={styles.checkmark}>✓</span>
              <span className={styles.statusText}>Executive Protection Assigned</span>
            </div>
            <div className={styles.routeDisplay}>
              <span className={styles.routeText}>
                {data.assignmentData ? data.assignmentData.location.start.split(',')[0] : 'Mayfair'} → {data.assignmentData ? data.assignmentData.location.end.split(',')[0] : 'Heathrow Airport'}
              </span>
            </div>
            <div className={styles.durationDisplay}>
              6 hours coverage
            </div>
            <div className={styles.confirmationStatus}>
              <span className={styles.checkmark}>✓</span>
              <span className={styles.statusText}>Officer Confirmed</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className={styles.countdownSection}>
            <div className={styles.countdown}>
              <span className={styles.countdownTime}>{liveCountdown}</span>
              <span className={styles.countdownLabel}>until protection begins</span>
            </div>
            {data.favoriteTimeSlot && (
              <div className={styles.favoriteSlot} title="Matches your usual time preference">
                ⭐
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log('View details');
              }}
            >
              <span className={styles.buttonIcon}>📋</span>
              <span className={styles.buttonLabel}>View Details</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Modify protection');
              }}
            >
              <span className={styles.buttonIcon}>⚙️</span>
              <span className={styles.buttonLabel}>Modify Protection</span>
            </button>
          </div>

          {/* Mini Calendar - Keep for visual reference */}
          {showVisuals && (
            <div className={styles.calendarSection}>
              <div className={styles.calendarLabel}>Next 7 days</div>
              <MiniCalendar
                days={7}
                bookedDays={data.miniCalendar}
                highlight="tomorrow"
                className={styles.miniCalendar}
              />
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {data.count === 0 && (
        <div className={styles.emptyCardState}>
          <div className={styles.emptyText}>No upcoming assignments</div>
          <div className={styles.emptySubtext}>Schedule your next service</div>
        </div>
      )}
    </button>
  );
};