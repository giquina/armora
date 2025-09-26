import React from 'react';
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

interface CurrentCardData {
  status: string;
  timeRemaining: string;
  officerName: string;
  officerStatus: 'online' | 'offline';
  currentLocation: string;
  serviceTier: 'Essential' | 'Executive' | 'Shadow';
  runningFare: string;
  progressPercent: number;
  eta: string;
  count: number;
  assignmentData?: Assignment | null;
}

interface CurrentCardProps {
  data: CurrentCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
  tabId?: string;
  ariaControls?: string;
}

export const CurrentCard: React.FC<CurrentCardProps> = ({
  data,
  isActive,
  onClick,
  screenWidth = 375,
  tabId,
  ariaControls
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const showFullData = screenWidth >= 768; // Only show all details on desktop
  const showVisuals = screenWidth >= 320;
  const isMobile = screenWidth <= 414;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Essential': return '#00D4FF';
      case 'Executive': return '#FFD700';
      case 'Shadow': return '#FF6B6B';
      default: return '#A0A0A0';
    }
  };


  return (
    <button
      className={`${styles.navCard} ${styles.current} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-controls={ariaControls}
      id={tabId}
    >
      {/* Left accent bar applied via CSS */}

      {/* Header */}
      <div className={styles.navCardHeader}>
        <div className={styles.navCardLeft}>
          <span className={styles.navCardIcon}>📋</span>
          <span className={styles.navCardTitle}>Current</span>
          <span className={styles.navCardCount}>({data.count})</span>
        </div>
        {isActive && <span className={styles.activeIndicator}>●</span>}
      </div>

      {/* Enhanced Content */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Status Bar with Service Tier Badge */}
          <div className={styles.statusBar}>
            <div className={styles.statusSection}>
              <span className={styles.pulseIndicator}>●</span>
              <span className={styles.statusText}>PROTECTION ACTIVE</span>
            </div>
            <div
              className={styles.serviceTierBadge}
              style={{
                background: `linear-gradient(90deg, ${getTierColor(data.serviceTier)}, #FFA500)`,
                color: '#1a1a2e'
              }}
            >
              {data.serviceTier.toUpperCase()}
            </div>
          </div>

          {/* Officer Trust Section - Simplified for Mobile */}
          {data.assignmentData && (
            <div className={styles.officerTrustSection}>
              <div className={styles.officerPhotoSection}>
                <div className={styles.officerPhoto}>
                  <span className={styles.officerInitials}>
                    {data.assignmentData.officerName.split(' ').map(n => n[0]).join('')}
                  </span>
                  <div className={styles.verificationBadge}>✓</div>
                </div>
              </div>
              <div className={styles.officerCredentials}>
                <div className={styles.officerName}>CPO {data.assignmentData.officerName}</div>
                <div className={styles.siaLicense}>
                  ★★★★★ 4.9 | <span className={styles.siaVerified}>SIA ✓</span>
                </div>
                <div className={styles.officerRating}>12 Years Experience</div>
                {/* Specializations only show on desktop or when expanded */}
                {(showFullData || showDetails) && (
                  <div className={styles.specializations}>
                    <span className={styles.specBadge}>Executive</span>
                    <span className={styles.specBadge}>Diplomatic</span>
                    <span className={styles.specBadge}>VIP Events</span>
                  </div>
                )}
                {/* Show more details toggle on mobile */}
                {isMobile && !showDetails && (
                  <button
                    className={styles.expandButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(true);
                    }}
                  >
                    View Officer Details
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Journey Progress Section */}
          <div className={styles.journeyProgress}>
            <div className={styles.progressTimeline}>
              <div className={styles.startPoint}>
                <span className={styles.locationIcon}>📍</span>
                <span className={styles.locationText}>
                  {data.assignmentData ? data.assignmentData.location.start.split(',')[0] : 'Kensington'}
                </span>
              </div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${data.progressPercent}%` }}
                  />
                  <div className={styles.movingIndicator} style={{ left: `${data.progressPercent}%` }} />
                </div>
              </div>
              <div className={styles.endPoint}>
                <span className={styles.locationIcon}>🏢</span>
                <span className={styles.locationText}>
                  {data.assignmentData ? data.assignmentData.location.end.split(',')[0] : 'Canary Wharf'}
                </span>
              </div>
            </div>
            <div className={styles.timeRemaining}>45 minutes remaining</div>
          </div>

          {/* Service Details Grid */}
          <div className={styles.serviceDetailsGrid}>
            <div className={styles.detailColumn}>
              <div className={styles.detailLabel}>Protection Duration</div>
              <div className={styles.detailValue}>{data.timeRemaining}</div>
            </div>
            <div className={styles.detailColumn}>
              <div className={styles.detailLabel}>Arrival Time</div>
              <div className={styles.detailValue}>{data.eta}</div>
            </div>
          </div>

          {/* Investment Section */}
          <div className={styles.investmentSection}>
            <div className={styles.investmentLabel}>Protection Investment</div>
            <div className={styles.investmentAmount}>{data.runningFare}</div>
            <div className={styles.serviceDescription}>Executive Protection Service</div>
            <div className={styles.serviceIncludes}>Includes secure transport + close protection</div>
          </div>

          {/* Action Buttons with Labels */}
          <div className={styles.actionButtons}>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Contact officer');
              }}
            >
              <span className={styles.buttonIcon}>📞</span>
              <span className={styles.buttonLabel}>Contact Officer</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Security support');
              }}
            >
              <span className={styles.buttonIcon}>🛡️</span>
              <span className={styles.buttonLabel}>Security Support</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Track protection');
              }}
            >
              <span className={styles.buttonIcon}>📍</span>
              <span className={styles.buttonLabel}>Track Protection</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {data.count === 0 && (
        <div className={styles.emptyCardState}>
          <div className={styles.emptyText}>No active protection</div>
          <div className={styles.emptySubtext}>Request immediate service</div>
        </div>
      )}
    </button>
  );
};