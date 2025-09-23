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

  const quickActions = [
    { icon: '🔄', label: 'Reschedule', handler: () => console.log('Reschedule') },
    { icon: '➕', label: 'Book Similar', handler: () => console.log('Book similar') }
  ];

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
          {/* Next Assignment Info */}
          <div className={styles.nextAssignment}>
            <div className={styles.assignmentTime}>
              {data.nextAssignment} - {data.dayOfWeek}
            </div>
            <div className={styles.assignmentDuration}>CPO: {data.officerAssigned}</div>
            <div className={styles.assignmentDuration}>{data.duration}</div>
          </div>

          {/* Countdown Timer */}
          <div className={styles.countdownRow}>
            <div className={styles.countdown}>
              <span className={styles.countdownTime}>{liveCountdown}</span>
              <span className={styles.countdownLabel}>remaining</span>
            </div>
            {data.favoriteTimeSlot && (
              <div className={styles.favoriteSlot} title="Matches your usual time preference">
                ⭐
              </div>
            )}
          </div>

          {/* Essential Assignment Details Only */}
          {data.assignmentData && (
            <div className={styles.assignmentDetails}>
              <div className={styles.assignmentRow}>
                <span className={styles.assignmentLabel}>Officer</span>
                <span className={styles.assignmentValue}>{data.assignmentData.officerName}</span>
              </div>
              <div className={styles.assignmentRow}>
                <span className={styles.assignmentLabel}>Route</span>
                <div className={styles.routeInfo}>
                  <span className={styles.routeText}>
                    {data.assignmentData.location.start.split(',')[0]}
                    <span className={styles.routeArrow}>→</span>
                    {data.assignmentData.location.end.split(',')[0]}
                  </span>
                </div>
              </div>
              <div className={styles.assignmentRow}>
                <span className={styles.assignmentLabel}>Time</span>
                <span className={styles.assignmentValue}>
                  {data.assignmentData.time} ({data.assignmentData.duration})
                </span>
              </div>
              <div className={styles.assignmentRow}>
                <span className={styles.assignmentLabel}>Cost</span>
                <span className={`${styles.assignmentValue} ${styles.highlight}`}>
                  £{data.assignmentData.totalCost}
                </span>
              </div>
            </div>
          )}

          {/* Officer & Schedule Info */}
          {showFullData && (
            <div className={styles.officerSchedule}>
              <div className={styles.assignedOfficer}>Officer: {data.officerAssigned}</div>
              <div className={styles.totalScheduled}>{data.totalScheduled} assignments scheduled</div>
            </div>
          )}

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

          {/* Quick Actions */}
          {showVisuals && (
            <div className={styles.quickActions}>
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className={styles.quickAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.handler();
                  }}
                  title={action.label}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      action.handler();
                    }
                  }}
                >
                  <span className={styles.actionIcon}>{action.icon}</span>
                </div>
              ))}
            </div>
          )}

          {/* Smart Insight */}
          {showFullData && data.favoriteTimeSlot && (
            <div className={styles.smartInsight}>
              Similar to your Tuesday routine
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