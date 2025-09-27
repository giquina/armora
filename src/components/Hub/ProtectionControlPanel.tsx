import { useState, useRef, useEffect } from 'react';
import { AssistanceRequestModal } from './AssistanceRequestModal';
import { ExtendTimeModal } from './ExtendTimeModal';
import styles from './ProtectionControlPanel.module.css';

interface Officer {
  name: string;
  designation: string;
  initials: string;
}

interface ProtectionControlPanelProps {
  officer: Officer;
  assignment?: any; // Will be typed properly later
  isLocationSharing: boolean;
  onLocationToggle: () => void;
  onOfficerCall: () => void;
  assignmentId: string;
  currentRate: number;
}

export function ProtectionControlPanel({
  officer,
  assignment,
  isLocationSharing,
  onLocationToggle,
  onOfficerCall,
  assignmentId,
  currentRate
}: ProtectionControlPanelProps) {
  const [showAssistanceModal, setShowAssistanceModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [assistanceRequested, setAssistanceRequested] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Panel is open by default
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const handleAssistanceRequest = () => {
    setShowAssistanceModal(true);
  };

  const handleAssistanceSent = (reason: string, message?: string) => {
    setAssistanceRequested(true);
    setShowAssistanceModal(false);

    // Reset the assistance state after 5 minutes
    setTimeout(() => {
      setAssistanceRequested(false);
    }, 5 * 60 * 1000);
  };

  const handleExtendTime = () => {
    setShowExtendModal(true);
  };

  const handleExtensionConfirm = (duration: number, reason?: string) => {
    setShowExtendModal(false);
  };

  const extensionPrice = Math.round(currentRate * 0.5); // 30-min rate

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const deltaY = currentY.current - startY.current;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Swipe down - collapse
        setIsCollapsed(true);
      } else {
        // Swipe up - expand
        setIsCollapsed(false);
      }
    }

    isDragging.current = false;
  };

  // Click handler for drag handle and panel toggle
  const handleTogglePanel = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('armoraPanelExpanded', JSON.stringify(!newState));
  };

  // Load saved panel state
  useEffect(() => {
    const savedState = localStorage.getItem('armoraPanelExpanded');
    if (savedState !== null) {
      setIsCollapsed(!JSON.parse(savedState)); // Inverted because we store expanded state
    }
  }, []);

  // Status info functionality removed - using assignment.status directly

  // Get context-aware buttons based on assignment status
  const getButtonsForStatus = (status: string) => {
    switch (status) {
      case 'en_route':
        return [
          { id: 'track', icon: '📍', title: 'TRACK OFFICER', subtitle: 'See real-time location', helper: 'Live GPS tracking' },
          { id: 'call', icon: '📞', title: 'CALL OFFICER', subtitle: `Direct line to ${officer.name}`, helper: 'Tap to connect' },
          { id: 'update', icon: '📌', title: 'UPDATE LOCATION', subtitle: 'Change your location', helper: 'Modify commencement point' },
          { id: 'cancel', icon: '❌', title: 'CANCEL SERVICE', subtitle: 'Cancel protection', helper: 'Full refund available' }
        ];
      case 'active':
      case 'with_principal':
        return [
          { id: 'assist', icon: '🛡️', title: 'REQUEST ASSISTANCE', subtitle: 'Alert protection officer', helper: 'Emergency backup' },
          { id: 'call', icon: '📞', title: 'CALL OFFICER', subtitle: `Direct line to ${officer.name}`, helper: 'Tap to connect' },
          { id: 'location', icon: '📍', title: isLocationSharing ? 'LOCATION: ACTIVE' : 'LOCATION: OFF', subtitle: isLocationSharing ? 'Live tracking active' : 'Enable sharing', helper: 'Toggle GPS sharing' },
          { id: 'extend', icon: '⏰', title: `ADD TIME - £${extensionPrice}.50`, subtitle: 'Extend service', helper: `Ends: ${getEndTime()}` }
        ];
      case 'at_venue':
        return [
          { id: 'escort', icon: '🤝', title: 'REQUEST ESCORT', subtitle: 'Need officer present', helper: 'Officer to your location' },
          { id: 'security', icon: '🔍', title: 'SECURITY CHECK', subtitle: 'Venue assessment', helper: 'Threat evaluation' },
          { id: 'extend', icon: '⏰', title: `ADD TIME - £${extensionPrice}.50`, subtitle: 'Extend protection', helper: `Ends: ${getEndTime()}` },
          { id: 'end', icon: '🏁', title: 'END EARLY', subtitle: 'Complete service now', helper: 'Finish protection' }
        ];
      case 'completed':
        return [
          { id: 'rate', icon: '⭐', title: 'RATE SERVICE', subtitle: `Review ${officer.name}`, helper: 'Share your experience' },
          { id: 'report', icon: '📄', title: 'VIEW REPORT', subtitle: 'Security summary', helper: 'Download PDF' },
          { id: 'request protection', icon: '🔄', title: 'REQUEST AGAIN', subtitle: 'Same officer/time', helper: 'Repeat service' },
          { id: 'issue', icon: '❗', title: 'REPORT ISSUE', subtitle: 'File complaint', helper: 'Service problem' }
        ];
      default:
        return [];
    }
  };

  // Helper function to get end time
  const getEndTime = () => {
    if (!assignment?.protectionDuration) return '10:36 PM';
    const now = new Date();
    const endTime = new Date(now.getTime() + (assignment.protectionDuration.totalHours - assignment.protectionDuration.completedHours) * 60 * 60 * 1000);
    return endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  // Get dynamic title for collapsed state based on assignment status
  const getCollapsedTitle = () => {
    if (!assignment) return 'SECURITY CONTROLS';

    switch (assignment.status) {
      case 'en_route':
        return `EN ROUTE | ${officer.name} arriving in 5 min`;
      case 'active':
      case 'with_principal':
        return `PROTECTED | With ${officer.name}`;
      case 'at_venue':
        return `AT VENUE | ${assignment.toLocation || 'Current Location'}`;
      case 'completed':
        return `COMPLETED | Service ended`;
      default:
        return 'PROTECTED';
    }
  };

  // Get panel header title based on assignment status
  const getPanelTitle = () => {
    if (!assignment) return '⚡ LIVE CONTROLS';

    if (assignment.status === 'active') {
      return '⚡ LIVE CONTROLS';
    } else if (assignment.status === 'upcoming') {
      return '📅 SCHEDULED ASSIGNMENT';
    } else if (assignment.status === 'completed') {
      return '✅ SERVICE COMPLETED';
    }

    return '🛡️ SECURITY CONTROLS';
  };

  // Status info removed - not needed with new design

  return (
    <div
      ref={panelRef}
      className={`${styles.protectionControlPanel} ${isCollapsed ? styles.collapsed : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isCollapsed ? (
        /* Collapsed Panel - Professional Status Bar */
        <div
          className={`${styles.collapsedPanel} ${assignment?.status ? styles[assignment.status] : ''}`}
          onClick={handleTogglePanel}
        >
          <div className={styles.leftSection}>
            <span className={`${styles.statusDot} ${assignment?.status ? styles[assignment.status] : styles.active}`}></span>
            <span className={styles.collapsedTitle}>{getCollapsedTitle()}</span>
          </div>
          <div className={styles.centerSection}>
            <span className={styles.contextInfo}>
              {assignment?.status === 'en_route' && 'Track →'}
              {(assignment?.status === 'active' || assignment?.status === 'with_principal') && `${assignment.protectionDuration ? Math.floor(assignment.protectionDuration.completedHours) : 2}h ${assignment.protectionDuration ? Math.round((assignment.protectionDuration.completedHours % 1) * 60) : 14}m | £${assignment?.totalInvestment || 300}`}
              {assignment?.status === 'at_venue' && 'Officer nearby'}
              {assignment?.status === 'completed' && 'Rate now →'}
              {!assignment?.status && `${Math.floor(2)}h ${Math.round(14)}m | £300`}
            </span>
          </div>
          <div className={styles.rightSection}>
            <button
              className={styles.quickCall}
              onClick={(e) => {
                e.stopPropagation();
                onOfficerCall();
              }}
              aria-label="Call Officer"
            >
              📞
            </button>
            <button className={styles.expandToggle} aria-label="Expand panel">
              ↑
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Panel - Full Controls */
        <>
          {/* Drag Handle */}
          <div
            className={styles.panelHandle}
            onClick={handleTogglePanel}
          ></div>

          <div className={styles.panelHeader}>
            <div className={styles.headerTop}>
              <div className={styles.titleSection}>
                <span className={styles.statusDot}>
                  {assignment?.status === 'active' && '🟢'}
                  {assignment?.status === 'upcoming' && '🟡'}
                  {assignment?.status === 'completed' && '✅'}
                  {(!assignment || assignment.status === 'active') && '🟢'}
                </span>
                <h2 className={styles.panelTitle}>{getPanelTitle()}</h2>
              </div>
              <div className={styles.controlSection}>
                <span className={styles.timer}>
                  {assignment?.status === 'active' ? `${assignment.protectionDuration ? Math.floor(assignment.protectionDuration.completedHours) : 2}h ${assignment.protectionDuration ? Math.round((assignment.protectionDuration.completedHours % 1) * 60) : 14}m` : 'Ready'}
                </span>
                <button
                  className={styles.collapseButton}
                  onClick={handleTogglePanel}
                  aria-label="Collapse panel"
                >
                  ↓
                </button>
              </div>
            </div>
            <div className={styles.headerBottom}>
              <span className={styles.officerName}>{officer.name}</span>
              <span className={styles.officerType}>{officer.designation}</span>
            </div>
          </div>

      <div className={styles.controlGrid}>
        {getButtonsForStatus(assignment?.status || 'active').map((button) => {
          // Determine button class and handler
          let buttonClass = `${styles.controlButton}`;
          let isActive = false;

          switch (button.id) {
            case 'assist':
              buttonClass += ` ${styles.assistanceButton} ${assistanceRequested ? styles.assistanceActive : ''}`;
              handler = handleAssistanceRequest;
              isActive = assistanceRequested;
              break;
            case 'call':
              buttonClass += ` ${styles.officerButton}`;
              handler = onOfficerCall;
              break;
            case 'location':
              buttonClass += ` ${styles.locationButton} ${isLocationSharing ? styles.locationActive : ''}`;
              handler = onLocationToggle;
              isActive = isLocationSharing;
              break;
            case 'extend':
              buttonClass += ` ${styles.extendButton}`;
              handler = handleExtendTime;
              break;
            case 'track':
              buttonClass += ` ${styles.trackButton}`;
              break;
            case 'rate':
              buttonClass += ` ${styles.rateButton}`;
              break;
          }

          return (
            <button
              key={button.id}
              className={buttonClass}
              onClick={handler}
              disabled={button.id === 'assist' && assistanceRequested}
            >
              <div className={styles.buttonIcon}>
                {button.id === 'assist' && assistanceRequested ? '✅' : button.icon}
              </div>
              <div className={styles.buttonTitle}>
                {button.id === 'assist' && assistanceRequested ? 'ASSISTANCE REQUESTED' : button.title}
              </div>
              <div className={styles.buttonSubtext}>
                {button.id === 'assist' && assistanceRequested ? 'Officer notified' : button.subtitle}
              </div>
              <div className={styles.buttonHelper}>
                {button.helper}
              </div>
              {button.id === 'assist' && assistanceRequested && <div className={styles.pulsing}></div>}
            </button>
          );
        })}
      </div>
        </>
      )}

      {/* Modals */}
      <AssistanceRequestModal
        isOpen={showAssistanceModal}
        onClose={() => setShowAssistanceModal(false)}
        onSend={handleAssistanceSent}
        officerName={officer.name}
      />

      <ExtendTimeModal
        isOpen={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        onConfirm={handleExtensionConfirm}
        currentRate={currentRate}
        officerAvailableUntil="8:00 PM"
      />
    </div>
  );
}