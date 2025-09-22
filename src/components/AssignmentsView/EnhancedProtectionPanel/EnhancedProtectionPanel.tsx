import React, { useState, useRef } from 'react';
import { TimeExtensionModal } from './TimeExtensionModal';
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

type PanelState = 'collapsed' | 'half' | 'full';

export function EnhancedProtectionPanel({
  officer,
  assignment,
  isLocationSharing,
  onLocationToggle,
  onOfficerCall,
  assignmentId,
  currentRate,
  panelState = 'collapsed',
  onPanelClick,
  onSwipeUp,
  onSwipeDown
}: EnhancedProtectionPanelProps) {
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(isLocationSharing);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [panicModeActive, setPanicModeActive] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  // Touch handlers for smooth drag gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('🖐️ Touch start detected');
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current; // Initialize currentY
    isDragging.current = true;
    setIsDraggingState(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    console.log('📱 Touch move:', deltaY, 'px');

    // Prevent default scrolling when dragging panel
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const deltaY = currentY.current - startY.current;
    const threshold = 50;

    console.log('✋ Touch end - Delta:', deltaY, 'Threshold:', threshold, 'Current state:', panelState);

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Swipe down
        console.log('⬇️ Swipe down detected');
        if (onSwipeDown) {
          onSwipeDown();
        } else {
          // Fallback internal logic for backward compatibility
          if (panelState === 'full') {
            console.log('🔄 Transitioning from full to half');
          } else if (panelState === 'half') {
            console.log('🔄 Transitioning from half to collapsed');
          }
        }
      } else {
        // Swipe up
        console.log('⬆️ Swipe up detected');
        if (onSwipeUp) {
          onSwipeUp();
        } else {
          // Fallback internal logic for backward compatibility
          if (panelState === 'collapsed') {
            console.log('🔄 Transitioning from collapsed to half');
          } else if (panelState === 'half') {
            console.log('🔄 Transitioning from half to full');
          }
        }
      }
    } else {
      console.log('❌ Gesture too small, no state change');
    }

    isDragging.current = false;
    setIsDraggingState(false);
  };

  const handlePanelToggle = (e?: React.MouseEvent) => {
    // Prevent event bubbling
    if (e) {
      e.stopPropagation();
    }

    console.log('🔍 Panel toggle clicked, current state:', panelState);

    // Use external click handler if provided
    if (onPanelClick) {
      onPanelClick();
    }
  };

  // Unified panel click handler for cycling through states
  const handlePanelClick = (e: React.MouseEvent) => {
    // Only respond to clicks on the panel container or drag handle, not action buttons
    const target = e.target as HTMLElement;
    const isActionButton = target.closest('.actionButton') || target.closest('button');

    if (isActionButton) {
      return; // Don't cycle states when clicking action buttons
    }

    e.stopPropagation();
    console.log('🔄 Panel click - cycling from:', panelState);

    // Add visual feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(5); // Subtle haptic feedback
    }

    // Cycle through states: collapsed → half → full → collapsed
    if (onPanelClick) {
      onPanelClick();
    }
  };

  // Triple-tap panic mode handler
  const handleTripleTap = () => {
    setTapCount(prev => {
      const newCount = prev + 1;

      // Clear any existing timeout
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }

      if (newCount === 3) {
        // Triple tap detected - activate panic mode
        console.log('🚨 TRIPLE TAP DETECTED - Silent panic mode activated');
        setPanicModeActive(true);

        // Strong vibration pattern for panic
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }

        // Auto-deactivate after 30 seconds
        setTimeout(() => {
          setPanicModeActive(false);
        }, 30000);

        return 0; // Reset count
      } else {
        // Set timeout to reset count after 1 second
        tapTimeoutRef.current = setTimeout(() => {
          setTapCount(0);
        }, 1000);

        return newCount;
      }
    });
  };

  // Action handlers
  const handlePanicAlert = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]); // Strong panic pattern
    }
    console.log('🚨 URGENT ASSISTANCE - Protection alert triggered');
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
    console.log('⏰ Time extension confirmed:', extensionData);
    setShowExtensionModal(false);
    // In real app: process extension with CPO notification
  };

  const handleModifyRoute = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    console.log('📍 Route modification requested');
    // In real app: open route modification interface
  };

  const handleMessageOfficer = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    console.log('💬 Opening message interface with protection officer');
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

  // Get current status display
  const getStatusInfo = () => {
    const defaultStatus = {
      location: 'Near Mayfair',
      progress: 75,
      timeRemaining: '1h 23m',
      eta: '16:45',
      cost: '£245.50',
      protectionLevel: 'Executive Shield'
    };

    if (!assignment) return defaultStatus;

    return {
      location: assignment.currentLocation || defaultStatus.location,
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
        onClick={handlePanelClick}
        onMouseDown={(e) => {
          // Add visual feedback for mouse interactions
          const panel = e.currentTarget;
          panel.style.transform = 'scale(0.998)';
          panel.style.transition = 'transform 0.1s ease';
        }}
        onMouseUp={(e) => {
          // Reset visual feedback
          const panel = e.currentTarget;
          panel.style.transform = '';
          panel.style.transition = '';
        }}
        onMouseLeave={(e) => {
          // Reset visual feedback if mouse leaves
          const panel = e.currentTarget;
          panel.style.transform = '';
          panel.style.transition = '';
        }}
        title="Tap to expand/collapse • Triple-tap for emergency"
      >
        {/* Drag Handle */}
        <div
          className={styles.dragHandle}
          onClick={handlePanelToggle}
          title={`Tap to ${panelState === 'collapsed' ? 'expand' : panelState === 'half' ? 'show all' : 'collapse'}`}
        />

        {/* Collapsed Preview - Only when collapsed */}
        {panelState === 'collapsed' && (
          <div
            className={styles.collapsedPreview}
            onClick={handleTripleTap} // Enable triple-tap panic mode
          >
            {/* Top Line: [● ACTIVE] [Executive] */}
            <div className={styles.topLine}>
              <div className={styles.statusSection}>
                <span className={styles.statusDot}>●</span>
                <span className={styles.statusText}>
                  {panicModeActive ? 'URGENT' : 'ACTIVE'}
                </span>
              </div>
              <div className={styles.serviceBadge}>
                {statusInfo.protectionLevel.split(' ')[0]}
              </div>
            </div>

            {/* Bottom Line: John Davis | ETA 16:45 | 1h 23m left */}
            <div className={styles.bottomLine}>
              <span className={styles.cpoName}>CPO {officer.name}</span>
              <span className={styles.divider}>|</span>
              <span className={styles.etaText}>ETA {statusInfo.eta}</span>
              <span className={styles.divider}>|</span>
              <span className={styles.timeLeft}>{statusInfo.timeRemaining} left</span>
            </div>
          </div>
        )}

        {/* Status Bar - Visible when expanded */}
        {(panelState === 'half' || panelState === 'full') && (
          <div className={styles.statusBar}>
            {/* Center-aligned CPO Profile Section for half-open state */}
            <div className={styles.expandedOfficerSection}>
              <div className={styles.officerProfileCentered}>
                <div className={styles.officerAvatar}>
                  <span className={styles.initials}>{officer.initials}</span>
                  <div className={styles.onlineIndicator} />
                </div>
                <div className={styles.officerNameCentered}>
                  {officer.name.toUpperCase()}
                </div>
                <div className={styles.officerCredentials}>
                  SIA Licensed CPO
                </div>
                <div className={styles.locationTimeSection}>
                  {statusInfo.location} • {statusInfo.timeRemaining} remaining
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Visible when expanded */}
        {(panelState === 'half' || panelState === 'full') && (
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

            {/* Service/Price Row */}
            <div className={styles.servicePriceRow}>
              <span className={styles.serviceLevel}>{statusInfo.protectionLevel}</span>
              <span className={styles.currentPrice}>{statusInfo.cost}</span>
            </div>

            {/* Action Buttons Row - 3 buttons evenly spaced */}
            <div className={styles.actionButtonsRow}>
              <button
                className={`${styles.actionButton} ${styles.call}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onOfficerCall();
                }}
              >
                <span className={styles.buttonIcon}>📞</span>
                <span className={styles.buttonLabel}>Call CPO</span>
              </button>

              <button
                className={`${styles.actionButton} ${styles.extend}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExtendTime();
                }}
              >
                <span className={styles.buttonIcon}>⏰</span>
                <span className={styles.buttonLabel}>Extend Service</span>
              </button>

              <button
                className={`${styles.actionButton} ${styles.location}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLocationToggle();
                }}
              >
                <span className={styles.buttonIcon}>📍</span>
                <span className={styles.buttonLabel}>Track Location</span>
              </button>
            </div>

            {/* Full Action Grid - Only in full mode */}
            {panelState === 'full' && (
              <div className={styles.fullActionGrid}>
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
              </div>
            )}

            {/* Enhanced Features - Only visible in full mode */}
            {panelState === 'full' && (
              <div className={styles.fullModeContent}>
                {/* CPO Verification Badges */}
                <div className={styles.verificationSection}>
                  <h4 className={styles.sectionTitle}>CPO Verification & Credentials</h4>
                  <div className={styles.badgeGrid}>
                    <div className={styles.verificationBadge}>
                      <span className={styles.badgeIcon}>✓</span>
                      <span className={styles.badgeText}>SIA Verified</span>
                    </div>
                    <div className={styles.verificationBadge}>
                      <span className={styles.badgeIcon}>✓</span>
                      <span className={styles.badgeText}>Background Checked</span>
                    </div>
                    <div className={styles.verificationBadge}>
                      <span className={styles.badgeIcon}>✓</span>
                      <span className={styles.badgeText}>Medical Trained</span>
                    </div>
                    <div className={styles.verificationBadge}>
                      <span className={styles.badgeIcon}>⭐</span>
                      <span className={styles.badgeText}>4.9★ Rating</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Protection Details */}
                <div className={styles.vehicleSection}>
                  <h4 className={styles.sectionTitle}>Vehicle & Protection Details</h4>
                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Vehicle:</span>
                      <span className={styles.detailValue}>Black Range Rover • ABC 123</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Protection Level:</span>
                      <span className={styles.detailValue}>{statusInfo.protectionLevel}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Insurance:</span>
                      <span className={styles.detailValue}>£10M Coverage Active</span>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className={styles.activitySection}>
                  <h4 className={styles.sectionTitle}>Live Activity Feed</h4>
                  <div className={styles.activityFeed}>
                    <div className={styles.activityItem}>
                      <span className={styles.activityTime}>14:32</span>
                      <span className={styles.activityText}>CPO departed operations center</span>
                    </div>
                    <div className={styles.activityItem}>
                      <span className={styles.activityTime}>14:45</span>
                      <span className={styles.activityText}>Route optimized for traffic</span>
                    </div>
                    <div className={styles.activityItem}>
                      <span className={styles.activityTime}>14:50</span>
                      <span className={styles.activityText}>Approaching your location</span>
                    </div>
                    <div className={styles.activityItem}>
                      <span className={styles.activityTime}>14:55</span>
                      <span className={styles.activityText}>CPO 5 minutes away</span>
                    </div>
                    <div className={styles.activityItem}>
                      <span className={styles.activityTime}>15:00</span>
                      <span className={styles.activityText}>CPO has arrived</span>
                    </div>
                  </div>
                </div>

                {/* Mini-Map Placeholder */}
                <div className={styles.miniMapSection}>
                  <h4 className={styles.sectionTitle}>Live Tracking</h4>
                  <div className={styles.miniMapPlaceholder}>
                    <div className={styles.mapContent}>
                      <div className={styles.mapIcon}>🗺️</div>
                      <span className={styles.mapText}>Real-time tracking map</span>
                      <span className={styles.mapSubtext}>CPO location • Route • ETA updates</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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