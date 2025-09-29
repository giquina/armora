import { FC, memo, useState, useEffect } from 'react';
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

export const UpcomingCard: FC<UpcomingCardProps> = memo(({
  data,
  isActive,
  onClick,
  screenWidth = 375,
  tabId,
  ariaControls
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showVisuals = screenWidth >= 320;
  const isMobile = screenWidth <= 414;

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
    <div
      className={`${styles.navCard} ${styles.upcoming} ${isActive ? styles.active : ''}`}
      data-type="upcoming"
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

      {/* Compact Content - Always Visible */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Essential Info Row */}
          <div className={styles.essentialInfo}>
            <div className={styles.statusSection}>
              <span className={styles.amberIndicator}>●</span>
              <span className={styles.statusText}>NEXT</span>
            </div>
            <div className={styles.keyStats}>
              <span className={styles.nextTime}>Tomorrow 09:00</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.serviceTier}>Executive</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.timeUntil}>{liveCountdown}</span>
            </div>
            <button
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className={styles.expandedDetails}>
              {/* Service Details */}
              <div className={styles.serviceSection}>
                <div className={styles.serviceInfo}>
                  <div className={styles.serviceStatus}>
                    <span className={styles.checkmark}>✓</span>
                    <span className={styles.statusText}>Executive Protection Assigned</span>
                  </div>
                  <div className={styles.routeDisplay}>
                    <span className={styles.routeText}>
                      📍 {data.assignmentData ? data.assignmentData.location.start.split(',')[0] : 'Mayfair'} → 🏢 {data.assignmentData ? data.assignmentData.location.end.split(',')[0] : 'Heathrow Airport'}
                    </span>
                  </div>
                  <div className={styles.durationDisplay}>6 hours coverage</div>
                  <div className={styles.confirmationStatus}>
                    <span className={styles.checkmark}>✓</span>
                    <span className={styles.statusText}>Officer Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Countdown Details */}
              <div className={styles.countdownSection}>
                <div className={styles.countdown}>
                  <span className={styles.countdownTime}>{liveCountdown}</span>
                  <span className={styles.countdownLabel}>until protection begins</span>
                </div>
                {data.favoriteTimeSlot && (
                  <div className={styles.favoriteSlot} title="Matches your usual time preference">
                    ⭐ Favorite time slot
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📋 Details
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  ⚙️ Modify
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📞 Contact
                </button>
              </div>

              {/* Mini Calendar */}
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
        </div>
      )}

      {/* Empty State */}
      {data.count === 0 && (
        <div className={styles.emptyCardState}>
          <div className={styles.emptyText}>No upcoming assignments</div>
          <div className={styles.emptySubtext}>Schedule your next service</div>
        </div>
      )}
    </div>
  );
});