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



  return (
    <div
      className={`${styles.navCard} ${styles.upcoming} ${styles.primaryCard} ${isActive ? styles.active : ''}`}
      data-type="upcoming"
    >
      {/* Header with Enhanced Priority Styling */}
      <div className={styles.navCardHeader}>
        <div className={styles.navCardLeft}>
          <span className={styles.navCardTitle}>UPCOMING</span>
          <span className={styles.navCardCount}>({data.count})</span>
          {data.count > 0 && (
            <span className={styles.priorityBadge}>PRIORITY</span>
          )}
        </div>
      </div>

      {/* Enhanced Compact Content - Always Visible */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Section 1: Assigned Protection Officer */}
          {data.assignmentData && (
            <div className={styles.officerSection}>
              <div className={styles.sectionHeader}>ASSIGNED PROTECTION OFFICER</div>
              <div className={styles.officerName}>{data.assignmentData.officerName}</div>
              <div className={styles.siaLicense}>SIA License: {data.assignmentData.officerSIA}</div>
              <div
                className={styles.tierBadge}
                style={{
                  backgroundColor: getServiceTierStyle(data.assignmentData.serviceTier).color,
                  color: data.assignmentData.serviceTier === 'Executive' ? '#1A1A1A' : '#FFFFFF'
                }}
              >
                {data.assignmentData.serviceTier.toUpperCase()} PROTECTION
              </div>
            </div>
          )}

          {/* Section 2: Scheduled */}
          <div className={styles.scheduledSection}>
            <div className={styles.sectionHeader}>SCHEDULED</div>
            <div className={styles.dateTime}>
              {data.assignmentData?.date} at {data.assignmentData?.time}
            </div>
            <div className={styles.countdown}>{liveCountdown}</div>
            <div className={styles.countdownLabel}>until protection begins</div>
          </div>

          {/* Section 3: Assignment Details */}
          <div className={styles.detailsSection}>
            <div className={styles.sectionHeader}>ASSIGNMENT DETAILS</div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Protection commencement:</span> {data.assignmentData?.location.start}
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Secure destination:</span> {data.assignmentData?.location.end}
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Coverage duration:</span> {data.assignmentData?.duration}
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Service fee:</span> <span className={styles.feeValue}>£{data.assignmentData?.totalCost}</span>
            </div>
          </div>

          {/* Section 4: Status */}
          <div className={styles.statusSection}>
            <div className={styles.statusItem}>✓ Protection officer confirmed</div>
            <div className={styles.statusItem}>✓ Route optimized</div>
            {data.favoriteTimeSlot && (
              <div className={styles.statusItem}>★ Favorite time slot</div>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <>
              {/* CPO Profile Section */}
              <div className={styles.expandedSection}>
                <div className={styles.expandedHeader}>CPO PROFILE</div>
                <div className={styles.cpoProfileExpanded}>
                  <div className={styles.profileRow}>
                    <span className={styles.profileLabel}>Experience:</span>
                    <span className={styles.profileValue}>8+ years close protection</span>
                  </div>
                  <div className={styles.profileRow}>
                    <span className={styles.profileLabel}>Specialization:</span>
                    <span className={styles.profileValue}>Executive & VIP security</span>
                  </div>
                  <div className={styles.profileRow}>
                    <span className={styles.profileLabel}>Certifications:</span>
                    <span className={styles.profileValue}>SIA Level 3, First Aid, Counter-Surveillance</span>
                  </div>
                  <div className={styles.profileRow}>
                    <span className={styles.profileLabel}>Rating:</span>
                    <span className={styles.profileValue}>⭐ 4.9/5.0 (127 assignments)</span>
                  </div>
                </div>
              </div>

              {/* Route Information Section */}
              <div className={styles.expandedSection}>
                <div className={styles.expandedHeader}>ROUTE DETAILS</div>
                <div className={styles.routeDetails}>
                  <div className={styles.routeRow}>
                    <span className={styles.routeLabel}>Estimated travel time:</span>
                    <span className={styles.routeValue}>45 minutes</span>
                  </div>
                  <div className={styles.routeRow}>
                    <span className={styles.routeLabel}>Distance:</span>
                    <span className={styles.routeValue}>18.3 miles</span>
                  </div>
                  <div className={styles.routeRow}>
                    <span className={styles.routeLabel}>Route type:</span>
                    <span className={styles.routeValue}>Optimized for security & efficiency</span>
                  </div>
                  <div className={styles.routeRow}>
                    <span className={styles.routeLabel}>Traffic conditions:</span>
                    <span className={styles.routeValue}>Light (expected)</span>
                  </div>
                </div>
              </div>

              {/* Additional Assignment Details Section */}
              <div className={styles.expandedSection}>
                <div className={styles.expandedHeader}>ADDITIONAL DETAILS</div>
                <div className={styles.additionalDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Vehicle type:</span>
                    <span className={styles.detailValue}>{data.assignmentData?.vehicleType || 'Executive sedan'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Equipment:</span>
                    <span className={styles.detailValue}>Standard security kit</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Special instructions:</span>
                    <span className={styles.detailValue}>Airport terminal drop-off</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Show More/Less Button */}
          <button
            className={styles.showMoreButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>

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