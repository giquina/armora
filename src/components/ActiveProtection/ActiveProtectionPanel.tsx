import { useState, useEffect, useCallback } from 'react';
import { CTAButton } from './CTAButton';
import { MenuOption } from './OptionsMenu';
import styles from './ActiveProtectionPanel.module.css';

interface ActiveProtectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
}

interface ProtectionData {
  officerName: string;
  officerTitle: string;
  siaLicense: string;
  vehicleModel: string;
  vehicleRegistration: string;
  securityCode: string;
  status: 'En Route' | 'On Location' | 'Protection Active' | 'Awaiting Assignment';
  eta?: string;
  startTime: Date;
  expectedEndTime: Date;
  serviceName: 'Executive' | 'Standard' | 'Shadow' | string;
  currentRate: number;
  mileageRate: number;
  currentCharges: number;
}

export function ActiveProtectionPanel({ isOpen, onClose, isActive }: ActiveProtectionPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('0:00:00');
  const [remainingTime, setRemainingTime] = useState<string>('0m');
  const [pendingExtensions, setPendingExtensions] = useState<Set<string>>(new Set());
  const [extensionRequests, setExtensionRequests] = useState<string[]>([]);

  // Mock protection data - in real app, this would come from context/API
  const protectionData: ProtectionData = {
    officerName: 'James Mitchell',
    officerTitle: 'Close Protection Officer',
    siaLicense: 'SIA-1234567',
    vehicleModel: 'BMW X5 Executive',
    vehicleRegistration: 'AR23 ORA',
    securityCode: 'SEC-789',
    status: 'Protection Active',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
    expectedEndTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours remaining (demo)
    serviceName: 'Executive',
    currentRate: 75,
    mileageRate: 2.50,
    currentCharges: 165.50
  };

  // Calculate elapsed time
  useEffect(() => {
    if (!isActive) return;

    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - protectionData.startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setElapsedTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

      // Remaining time (until expected end)
      const remainingMs = Math.max(0, protectionData.expectedEndTime.getTime() - now.getTime());
      const rHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const rMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      setRemainingTime(
        rHours > 0 ? `${rHours}h ${rMinutes}m` : `${rMinutes}m`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isActive, protectionData.startTime, protectionData.expectedEndTime]);

  // Handle scroll indicator updates
  useEffect(() => {
    if (!isOpen) return;

    const scrollContainer = document.querySelector(`.${styles.scrollContainer}`);
    const scrollDots = document.querySelectorAll(`.${styles.scrollDot}`);

    if (!scrollContainer || !scrollDots.length) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollPercentage = scrollTop / scrollHeight;

      // Update active dot based on scroll position
      const sectionIndex = Math.floor(scrollPercentage * 4);
      scrollDots.forEach((dot, index) => {
        if (index === Math.min(sectionIndex, 3)) {
          dot.classList.add(styles.active);
        } else {
          dot.classList.remove(styles.active);
        }
      });
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const extendTime = (minutes: number) => {
    // Time extension implementation placeholder
  };

  const handleEmergencyAction = (action: string) => {
    // Emergency actions implementation placeholder
    console.log('Emergency action:', action);
  };

  // Extension request handlers
  const handleExtensionRequest = useCallback((duration: string) => {
    const requestId = `ext_${Date.now()}`;
    setPendingExtensions(prev => new Set(prev).add(requestId));
    setExtensionRequests(prev => [...prev, `${duration} extension requested`]);

    // Simulate officer approval after 3 seconds
    setTimeout(() => {
      setPendingExtensions(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
      setExtensionRequests(prev => prev.filter(req => !req.includes(duration)));
    }, 3000);
  }, []);

  // Menu option definitions
  const urgentHelpOptions: MenuOption[] = [
    {
      label: 'Emergency call (999)',
      icon: '🚨',
      action: () => handleEmergencyAction('emergency_call')
    },
    {
      label: 'Silent alarm',
      icon: '🔕',
      action: () => handleEmergencyAction('silent_alarm')
    },
    {
      label: 'Send SOS to contacts',
      icon: '📱',
      action: () => handleEmergencyAction('sos_contacts')
    },
    {
      label: 'Emergency protocols',
      icon: '📋',
      action: () => handleEmergencyAction('protocols')
    }
  ];

  const callOfficerOptions: MenuOption[] = [
    {
      label: 'Voice call',
      icon: '📞',
      action: () => handleEmergencyAction('voice_call')
    },
    {
      label: 'Video call',
      icon: '📹',
      action: () => handleEmergencyAction('video_call')
    },
    {
      label: 'Request callback',
      icon: '📲',
      action: () => handleEmergencyAction('callback')
    },
    {
      label: 'View officer profile',
      icon: '👤',
      action: () => handleEmergencyAction('officer_profile')
    }
  ];

  const extendServiceOptions: MenuOption[] = [
    {
      label: 'Request 30 min extension',
      icon: '⏰',
      action: () => handleExtensionRequest('30 minutes'),
      requiresApproval: true
    },
    {
      label: 'Request 1 hour extension',
      icon: '⏱️',
      action: () => handleExtensionRequest('1 hour'),
      requiresApproval: true
    },
    {
      label: 'Request 2 hours extension',
      icon: '⏲️',
      action: () => handleExtensionRequest('2 hours'),
      requiresApproval: true
    },
    {
      label: 'Custom duration',
      icon: '⌚',
      action: () => handleExtensionRequest('custom'),
      requiresApproval: true
    }
  ];

  const changeRouteOptions: MenuOption[] = [
    {
      label: 'Add waypoint',
      icon: '📍',
      action: () => handleEmergencyAction('add_waypoint')
    },
    {
      label: 'Change destination',
      icon: '🎯',
      action: () => handleEmergencyAction('change_destination')
    },
    {
      label: 'Optimize route',
      icon: '🗺️',
      action: () => handleEmergencyAction('optimize_route')
    },
    {
      label: 'Report road issue',
      icon: '⚠️',
      action: () => handleEmergencyAction('road_issue')
    }
  ];

  const messageOfficerOptions: MenuOption[] = [
    {
      label: 'Text message',
      icon: '💬',
      action: () => handleEmergencyAction('text_message')
    },
    {
      label: 'Voice note',
      icon: '🎤',
      action: () => handleEmergencyAction('voice_note')
    },
    {
      label: 'Share photo',
      icon: '📷',
      action: () => handleEmergencyAction('share_photo')
    },
    {
      label: 'Request status update',
      icon: '📊',
      action: () => handleEmergencyAction('status_update')
    }
  ];

  const shareLocationOptions: MenuOption[] = [
    {
      label: 'Share for 30 minutes',
      icon: '⏰',
      action: () => handleEmergencyAction('share_30min')
    },
    {
      label: 'Share for 1 hour',
      icon: '⏱️',
      action: () => handleEmergencyAction('share_1hour')
    },
    {
      label: 'Share until arrival',
      icon: '🎯',
      action: () => handleEmergencyAction('share_arrival')
    },
    {
      label: 'Stop sharing',
      icon: '🛑',
      action: () => handleEmergencyAction('stop_sharing')
    }
  ];

  if (!isOpen && !isMinimized) return null;

  if (isMinimized) {
    return (
      <div className={styles.miniBar} onClick={() => setIsMinimized(false)}>
        <div className={styles.miniContent}>
          <div className={styles.topRow}>
            <div className={styles.officerInfo}>
              <span className={styles.statusDot}></span>
              <span className={styles.cpoLabel}>CPO</span>
              <span className={styles.officerName}>{protectionData.officerName}</span>
            </div>
            <button
              className={`${styles.expandArrow} ${!isMinimized ? styles.expanded : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              aria-label="Expand protection panel"
            >
              ↑
            </button>
          </div>
          <div className={styles.bottomRow}>
            <span>{protectionData.serviceName}</span>
            <span className={styles.bullet}>•</span>
            <span>{remainingTime} left</span>
            <span className={styles.bullet}>•</span>
            <span>£{protectionData.currentCharges.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.activeProtectionPanel} ${isOpen ? styles.open : ''}`} style={{maxHeight: isOpen ? '75vh' : '100vh'}}>
      {/* Mobile-First Header */}
      <div className={styles.panelHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleSection}>
            <span className={styles.statusDot}>🟢</span>
            <h2 className={styles.panelTitle}>ACTIVE PROTECTION</h2>
          </div>
          <div className={styles.controlSection}>
            <span className={styles.timer}>{elapsedTime}</span>
            <button
              className={`${styles.closeButton} ${styles.expandArrow} ${!isMinimized ? styles.expanded : ''}`}
              onClick={() => setIsMinimized(true)}
              aria-label="Minimize protection panel"
            >
              ↑
            </button>
          </div>
        </div>
        <div className={styles.headerBottom}>
          <span className={styles.officerName}>{protectionData.officerName}</span>
          <span className={styles.protectionType}>Executive Protection</span>
        </div>
      </div>

      {/* Scroll Container */}
      <div className={styles.scrollContainer}>
        {/* Section 1: Map View */}
        <div className={`${styles.scrollSection} ${styles.mapSection}`}>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapIcon}>🗺️</div>
            <p>Live tracking map would appear here</p>
            <p className={styles.mapNote}>Officer location updating every 30 seconds</p>
          </div>
        </div>

        {/* Section 2: Protection Details */}
        <div className={`${styles.scrollSection} ${styles.detailsSection}`}>
          <div className={styles.sectionHeader}>
            <h3>Protection Details</h3>
            <div className={`${styles.statusBadge} ${styles[protectionData.status.toLowerCase().replace(' ', '')]}`}>
              {protectionData.status}
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>CPO</span>
              <span className={styles.detailValue}>{protectionData.officerName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>SIA License</span>
              <span className={styles.detailValue}>{protectionData.siaLicense}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Vehicle</span>
              <span className={styles.detailValue}>{protectionData.vehicleModel}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Registration</span>
              <span className={styles.detailValue}>{protectionData.vehicleRegistration}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Security Code */}
        <div className={`${styles.scrollSection} ${styles.securitySection}`}>
          <div className={styles.sectionHeader}>
            <h3>Security Verification</h3>
          </div>
          <div className={styles.securityCode}>
            <span className={styles.securityLabel}>SECURITY CODE</span>
            <span className={styles.securityValue}>{protectionData.securityCode}</span>
            <p className={styles.securityNote}>Present this code to your CPO for verification</p>
          </div>
        </div>

        {/* Section 4: Security Commands */}
        <div className={`${styles.scrollSection} ${styles.actionsSection}`}>
          <div className={styles.sectionHeader}>
            <h3>Security Commands</h3>
          </div>
          <div className={styles.actionsGrid}>
            <CTAButton
              title="URGENT HELP"
              icon="🚨"
              color="emergency"
              onMainAction={() => handleEmergencyAction('sos')}
              menuOptions={urgentHelpOptions}
              isFullWidth
            />

            <CTAButton
              title="CALL OFFICER"
              icon="📞"
              color="primary"
              onMainAction={() => handleEmergencyAction('call')}
              menuOptions={callOfficerOptions}
            />

            <CTAButton
              title="EXTEND SERVICE"
              icon="⏰"
              color="warning"
              onMainAction={() => extendTime(30)}
              menuOptions={extendServiceOptions}
              pendingApproval={pendingExtensions.size > 0}
            />

            <CTAButton
              title="CHANGE ROUTE"
              icon="📝"
              color="info"
              onMainAction={() => handleEmergencyAction('destination')}
              menuOptions={changeRouteOptions}
            />

            <CTAButton
              title="MESSAGE OFFICER"
              icon="💬"
              color="secondary"
              onMainAction={() => handleEmergencyAction('message')}
              menuOptions={messageOfficerOptions}
            />

            <CTAButton
              title="SHARE LOCATION"
              icon="📍"
              color="neutral"
              onMainAction={() => handleEmergencyAction('location')}
              menuOptions={shareLocationOptions}
            />
          </div>

          {/* Extension request status */}
          {extensionRequests.length > 0 && (
            <div className={styles.extensionStatus}>
              <h4>Pending Requests</h4>
              {extensionRequests.map((request, index) => (
                <div key={index} className={styles.extensionRequest}>
                  <span className={styles.requestText}>{request}</span>
                  <span className={styles.pendingBadge}>Pending officer approval</span>
                </div>
              ))}
            </div>
          )}

          {/* Billing Tracker */}
          <div className={styles.billingTracker}>
            <h4>Current Billing</h4>
            <div className={styles.billingDetails}>
              <div className={styles.billingRow}>
                <span>Protection Rate:</span>
                <span>£{protectionData.currentRate}/hour</span>
              </div>
              <div className={styles.billingRow}>
                <span>Transport Rate:</span>
                <span>£{protectionData.mileageRate}/mile</span>
              </div>
              <div className={styles.billingRow}>
                <span>Time Elapsed:</span>
                <span>{elapsedTime}</span>
              </div>
              <div className={`${styles.billingRow} ${styles.total}`}>
                <span>Current Total:</span>
                <span>£{protectionData.currentCharges.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className={styles.bottomActions}>
            <button className={styles.reportButton}>Report Issue</button>
            <button className={styles.endButton}>End Protection</button>
          </div>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollDot}></div>
        <div className={styles.scrollDot}></div>
        <div className={styles.scrollDot}></div>
        <div className={styles.scrollDot}></div>
      </div>
    </div>
  );
}