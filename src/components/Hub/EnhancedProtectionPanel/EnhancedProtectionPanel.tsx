import { useState, useRef, useEffect } from 'react';
import { TimeExtensionModal } from './TimeExtensionModal';
import { useRealtimeTracking } from '../../../hooks/useRealtimeTracking';
import styles from './EnhancedProtectionPanel.module.css';

interface Officer {
  name: string;
  designation: string;
  initials: string;
}

interface EnhancedProtectionPanelProps {
  officer: Officer;
  assignment?: any;
  isLocationSharing: boolean;
  onLocationToggle: () => void;
  onOfficerCall: () => void;
  assignmentId: string;
  currentRate: number;
  panelState?: PanelState;
  onPanelClick?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

type PanelState = 'collapsed' | 'full';

export function EnhancedProtectionPanel({
  officer,
  assignment,
  isLocationSharing,
  onLocationToggle,
  onOfficerCall,
  assignmentId,
  currentRate,
  panelState: externalPanelState,
  onPanelClick,
  onSwipeUp,
  onSwipeDown
}: EnhancedProtectionPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>('collapsed');
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(isLocationSharing);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [panicModeActive, setPanicModeActive] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  // Real-time tracking integration
  const {
    location: officerLocation,
    progress: routeProgress,
    isLoading: isTrackingLoading,
    isActive: isTrackingActive,
  } = useRealtimeTracking(assignmentId);

  // Enhanced touch handlers with improved swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle touch events on the drag handle, not text areas
    const target = e.target as HTMLElement;
    if (!target.closest(`.${styles.dragHandle}`)) {
      return;
    }

    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    isDragging.current = true;
    setIsDraggingState(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    currentY.current = e.touches[0].clientY;
    // Prevent default scrolling when dragging panel
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const deltaY = currentY.current - startY.current;
    const threshold = 50; // 50px minimum distance as required

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Swipe down - always go to collapsed
        setPanelState('collapsed');
      } else {
        // Swipe up - always go to full
        setPanelState('full');
      }
    }

    isDragging.current = false;
    setIsDraggingState(false);
  };

  const handlePanelToggle = (e?: React.MouseEvent) => {
    // Prevent event bubbling
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Prevent rapid multiple clicks
    if (isDragging.current) {
      return;
    }

    // Toggle between: collapsed <-> full
    if (panelState === 'collapsed') {
      setPanelState('full');
    } else {
      setPanelState('collapsed');
    }
  };


  // Action handlers
  const handlePanicAlert = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]); // Strong panic pattern
    }
    setPanicModeActive(true);

    // Auto-deactivate after 30 seconds
    setTimeout(() => {
      setPanicModeActive(false);
    }, 30000);
    // In real app: immediate emergency protocol
  };

  const handleExtendTime = () => {
    setShowExtensionModal(true);
  };

  const handleTimeExtensionConfirm = (extensionData: any) => {
    setShowExtensionModal(false);
    // In real app: process extension with CPO notification
  };

  const handleModifyRoute = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    // In real app: open route modification interface
  };

  const handleMessageOfficer = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    // In real app: open chat interface
  };

  // Removed unused handleShareStatus function

  const handleLocationToggle = () => {
    setIsLocationEnabled(!isLocationEnabled);
    onLocationToggle();
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  // Get current status display with real-time data
  const getStatusInfo = () => {
    const defaultStatus = {
      location: 'Near Mayfair',
      routeStart: 'Kensington',
      routeEnd: 'Canary Wharf',
      progress: 75,
      timeRemaining: '1h 23m',
      eta: '16:45',
      cost: '£245.50',
      protectionLevel: 'Executive Protection'
    };

    // Use real-time tracking data if available
    if (routeProgress && officerLocation) {
      const minutesRemaining = Math.ceil((routeProgress.estimatedTimeArrival - Date.now()) / 60000);
      const hoursRemaining = Math.floor(minutesRemaining / 60);
      const mins = minutesRemaining % 60;
      const timeRemaining = hoursRemaining > 0 ? `${hoursRemaining}h ${mins}m` : `${mins}m`;

      const etaDate = new Date(routeProgress.estimatedTimeArrival);
      const eta = `${etaDate.getHours().toString().padStart(2, '0')}:${etaDate.getMinutes().toString().padStart(2, '0')}`;

      return {
        location: officerLocation.status === 'arrived' ? 'At Your Location' : 'En Route',
        routeStart: assignment?.location?.start || defaultStatus.routeStart,
        routeEnd: assignment?.location?.end || defaultStatus.routeEnd,
        progress: Math.round(routeProgress.percentComplete),
        timeRemaining,
        eta,
        cost: assignment?.estimatedCost ? `£${assignment.estimatedCost.toFixed(2)}` : defaultStatus.cost,
        protectionLevel: assignment?.serviceLevel || defaultStatus.protectionLevel,
      };
    }

    if (!assignment) return defaultStatus;

    return {
      location: assignment.currentLocation || defaultStatus.location,
      routeStart: assignment.location?.start || defaultStatus.routeStart,
      routeEnd: assignment.location?.end || defaultStatus.routeEnd,
      progress: assignment.progress || defaultStatus.progress,
      timeRemaining: assignment.timeRemaining || defaultStatus.timeRemaining,
      eta: assignment.eta || defaultStatus.eta,
      cost: assignment.cost || defaultStatus.cost,
      protectionLevel: assignment.serviceLevel || defaultStatus.protectionLevel
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[panelState]} ${isDraggingState ? styles.dragging : ''} ${panicModeActive ? styles.panicMode : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div
          className={styles.dragHandle}
          onClick={(e) => {
            e.stopPropagation();
            handlePanelToggle(e);
          }}
        />

        {/* Left-Aligned Collapsed State */}
        {panelState === 'collapsed' && (
          <div className={styles.collapsedPreview}>
            {/* Line 1: Status + Service Tier */}
            <div className={styles.statusLine}>
              <span className={styles.statusDot}></span>
              <span className={styles.statusText}>PROTECTION ACTIVE • {statusInfo.protectionLevel}</span>
              <button
                className={styles.expandArrow}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePanelToggle(e);
                }}
                aria-label="Expand protection panel"
              >
                <svg className={styles.chevronIcon} viewBox="0 0 24 24" width="20" height="20">
                  <path d="m7 14 5-5 5 5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Line 2: CPO Information */}
            <div className={styles.cpoLine}>
              <span className={styles.cpoInfo}>Protection Officer: {officer.name} • {statusInfo.protectionLevel}</span>
            </div>

            {/* Line 3: Journey Details */}
            <div className={styles.journeyLine}>
              <span className={styles.journeyInfo}>Route: {statusInfo.routeStart} → {statusInfo.routeEnd}</span>
            </div>

            {/* Line 4: Time and Cost with animated meter */}
            <div className={styles.timeLine}>
              <span className={styles.timeInfo}>Duration: {statusInfo.timeRemaining}</span>
              <div className={styles.costMeter}>
                <div className={styles.costMeterFill}></div>
                <span className={styles.costText}>{statusInfo.cost}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Bar - Visible when expanded */}
        {panelState === 'full' && (
          <div className={styles.statusBar}>
            {/* Fixed CPO Profile Section - Inline layout as required */}
            <div className={styles.expandedOfficerSection}>
              <div className={styles.officerProfile}>
                <div className={styles.officerAvatar}>
                  <span className={styles.initials}>{officer.initials}</span>
                </div>
                <div className={styles.officerNameInline}>
                  CPO {officer.name} • SIA CLOSE PROTECTION OFFICER
                </div>
              </div>
              <div className={styles.locationTimeSection}>
                {statusInfo.location} • {statusInfo.timeRemaining} remaining
              </div>
            </div>

            <div className={styles.expandedActions}>
              <div
                className={styles.quickCall}
                onClick={(e) => {
                  e.stopPropagation();
                  onOfficerCall();
                }}
              >
                📞
              </div>
              <div className={styles.collapseIcon}>
                <span className={styles.downArrow}>↓</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Visible when expanded */}
        {panelState === 'full' && (
          <div className={styles.panelContent}>
            {/* Progress Section */}
            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span className={styles.protectionLevel}>{statusInfo.protectionLevel}</span>
                <span className={styles.currentCost}>{statusInfo.cost}</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${statusInfo.progress}%` }}
                />
              </div>
              <div className={styles.progressDetails}>
                <span className={styles.eta}>ETA: {statusInfo.eta}</span>
                <span className={styles.progress}>{statusInfo.progress}% Complete</span>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className={styles.actionGrid}>
              <button
                className={`${styles.actionButton} ${styles.panic}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePanicAlert();
                }}
              >
                <span className={styles.buttonIcon}>🚨</span>
                <span className={styles.buttonLabel}>URGENT HELP</span>
                <span className={styles.buttonSubtext}>Immediate Response</span>
              </button>

              <button
                className={`${styles.actionButton} ${styles.call}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onOfficerCall();
                }}
              >
                <span className={styles.buttonIcon}>📞</span>
                <span className={styles.buttonLabel}>CALL OFFICER</span>
                <span className={styles.buttonSubtext}>Direct Line</span>
              </button>

              <button
                className={`${styles.actionButton} ${styles.extend}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExtendTime();
                }}
              >
                <span className={styles.buttonIcon}>⏰</span>
                <span className={styles.buttonLabel}>EXTEND SERVICE</span>
                <span className={styles.buttonSubtext}>Extend Protection Time</span>
              </button>

              <button
                className={`${styles.actionButton} ${styles.route}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModifyRoute();
                }}
              >
                <span className={styles.buttonIcon}>📍</span>
                <span className={styles.buttonLabel}>CHANGE ROUTE</span>
                <span className={styles.buttonSubtext}>Change Destination</span>
              </button>

              <button
                className={`${styles.actionButton} ${styles.message}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessageOfficer();
                }}
              >
                <span className={styles.buttonIcon}>💬</span>
                <span className={styles.buttonLabel}>MESSAGE OFFICER</span>
                <span className={styles.buttonSubtext}>Secure Chat</span>
              </button>

              <button
                className={`${styles.actionButton} ${styles.location} ${isLocationEnabled ? styles.active : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLocationToggle();
                }}
              >
                <span className={styles.buttonIcon}>📡</span>
                <span className={styles.buttonLabel}>
                  {isLocationEnabled ? 'LOCATION ON' : 'SHARE LOCATION'}
                </span>
                <span className={styles.buttonSubtext}>
                  {isLocationEnabled ? 'Sharing Live GPS' : 'Enable GPS Sharing'}
                </span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Time Extension Modal */}
      <TimeExtensionModal
        isOpen={showExtensionModal}
        onClose={() => setShowExtensionModal(false)}
        onConfirm={handleTimeExtensionConfirm}
        currentRate={currentRate}
        officerName={officer.name}
      />
    </>
  );
}