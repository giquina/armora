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

  // Get service tier styling
  const getServiceTierStyle = (tier: string) => {
    switch (tier) {
      case 'Essential': return { color: '#00D4FF', background: 'rgba(0, 212, 255, 0.1)' };
      case 'Executive': return { color: '#FFD700', background: 'rgba(255, 215, 0, 0.1)' };
      case 'Shadow': return { color: '#FF6B6B', background: 'rgba(255, 107, 107, 0.1)' };
      default: return { color: '#A0A0A0', background: 'rgba(160, 160, 160, 0.1)' };
    }
  };

  // Get vehicle icon
  const getVehicleIcon = (vehicleType: string) => {
    if (vehicleType.includes('BMW')) return '🚗';
    if (vehicleType.includes('Range Rover')) return '🚙';
    if (vehicleType.includes('Mercedes')) return '🚘';
    return '🚗';
  };


  return (
    <div
      className={`${styles.navCard} ${styles.upcoming} ${styles.primaryCard} ${isActive ? styles.active : ''}`}
      data-type="upcoming"
    >
      {/* Header with Enhanced Priority Styling */}
      <div className={styles.navCardHeader}>
        <div className={styles.navCardLeft}>
          <span className={styles.navCardIcon}>📅</span>
          <span className={styles.navCardTitle}>Next Protection</span>
          <span className={styles.navCardCount}>({data.count})</span>
          {data.count > 0 && (
            <span className={styles.priorityBadge}>PRIORITY</span>
          )}
        </div>
        {isActive && <span className={styles.activeIndicator}>●</span>}
      </div>

      {/* Enhanced Compact Content - Always Visible */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* CPO Information with Photo */}
          {data.assignmentData && (
            <div className={styles.cpoSection}>
              <div className={styles.cpoInfo}>
                <div className={styles.cpoPhoto}>
                  <img
                    src={`/images/officers/${data.assignmentData.officerName.toLowerCase().replace(' ', '-')}.jpg`}
                    alt={data.assignmentData.officerName}
                    className={styles.officerImage}
                    onError={(e) => {
                      // Fallback to initials if photo fails to load
                      e.currentTarget.style.display = 'none';
                      const initialsEl = e.currentTarget.nextElementSibling as HTMLElement;
                      if (initialsEl) initialsEl.style.display = 'flex';
                    }}
                  />
                  <div className={styles.officerInitials} style={{ display: 'none' }}>
                    {data.assignmentData.officerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={styles.cpoStatus}>
                    <span className={styles.onlineIndicator}>●</span>
                  </div>
                </div>
                <div className={styles.cpoDetails}>
                  <div className={styles.cpoName}>{data.assignmentData.officerName}</div>
                  <div className={styles.cpoCredentials}>SIA License: {data.assignmentData.officerSIA}</div>
                  <div
                    className={styles.serviceTierBadge}
                    style={getServiceTierStyle(data.assignmentData.serviceTier)}
                  >
                    {data.assignmentData.serviceTier} Protection
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Overview */}
          <div className={styles.assignmentOverview}>
            <div className={styles.timeSection}>
              <div className={styles.scheduledTime}>
                <span className={styles.timeLabel}>Scheduled</span>
                <span className={styles.timeValue}>
                  {data.assignmentData?.date} at {data.assignmentData?.time}
                </span>
              </div>
              <div className={styles.countdown}>
                <span className={styles.countdownValue}>{liveCountdown}</span>
                <span className={styles.countdownLabel}>until protection begins</span>
              </div>
            </div>

            {/* Route Information */}
            <div className={styles.routeSection}>
              <div className={styles.routeDisplay}>
                <span className={styles.routeIcon}>📍</span>
                <span className={styles.routeText}>
                  {data.assignmentData?.location.start.split(',')[0]} → {data.assignmentData?.location.end.split(',')[0]}
                </span>
                <span className={styles.vehicleIcon}>
                  {data.assignmentData && getVehicleIcon(data.assignmentData.vehicleType)}
                </span>
              </div>
              <div className={styles.durationCost}>
                <span className={styles.duration}>{data.assignmentData?.duration} coverage</span>
                <span className={styles.bullet}>•</span>
                <span className={styles.cost}>£{data.assignmentData?.totalCost}</span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className={styles.statusIndicators}>
            <div className={styles.statusItem}>
              <span className={styles.checkmark}>✓</span>
              <span className={styles.statusText}>CPO Confirmed</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.checkmark}>✓</span>
              <span className={styles.statusText}>Route Optimized</span>
            </div>
            {data.favoriteTimeSlot && (
              <div className={styles.statusItem}>
                <span className={styles.favoriteIcon}>⭐</span>
                <span className={styles.statusText}>Favorite Time Slot</span>
              </div>
            )}
          </div>

          {/* Expand Button */}
          <button
            className={styles.expandButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>

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