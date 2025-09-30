import { useState, useEffect, useCallback } from 'react';
import { CTAButton } from './CTAButton';
import { MenuOption } from './OptionsMenu';
import { AssignmentStatus } from '../../types';
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
  status: AssignmentStatus;
  eta?: string;
  startTime: Date;
  expectedEndTime: Date;
  serviceName: 'Executive' | 'Essential' | 'Shadow' | string;
  currentRate: number;
  mileageRate: number;
  currentCharges: number;
}

export function ActiveProtectionPanel({ isOpen, onClose, isActive }: ActiveProtectionPanelProps) {
  const [elapsedTime, setElapsedTime] = useState('0:00:00');
  const [remainingTime, setRemainingTime] = useState<string>('0m');
  const [pendingExtensions, setPendingExtensions] = useState<Set<string>>(new Set());
  const [extensionRequests, setExtensionRequests] = useState<string[]>([]);

  // Mock protection data - in real app, this would come from context/API
  const protectionData: ProtectionData = {
    officerName: 'James Mitchell',
    officerTitle: 'Executive Protection Specialist',
    siaLicense: 'SIA-1234567',
    vehicleModel: 'BMW X5 Executive',
    vehicleRegistration: 'AR23 ORA',
    securityCode: 'SEC-789',
    status: 'en_route_to_destination',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
    expectedEndTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours remaining (demo)
    serviceName: 'Executive',
    currentRate: 95,
    mileageRate: 2.50,
    currentCharges: 195.50
  };

  // Helper function to get status display text
  const getStatusText = (status: AssignmentStatus): string => {
    switch (status) {
      case 'assigned':
        return 'Protection officer assigned';
      case 'officer_en_route':
        return 'Protection officer en route';
      case 'officer_arrived':
        return 'Protection officer has arrived';
      case 'protection_active':
        return 'Protection detail active';
      case 'en_route_to_destination':
        return 'En route to secure destination';
      case 'arriving_at_destination':
        return 'Approaching secure destination';
      case 'completed':
        return 'Protection service completed';
      case 'cancelled':
        return 'Assignment cancelled';
      default:
        return 'Protection detail in progress';
    }
  };

  // Helper function to calculate progress percentage
  const getProgressPercentage = (status: AssignmentStatus): number => {
    switch (status) {
      case 'assigned':
        return 5;
      case 'officer_en_route':
        return 20;
      case 'officer_arrived':
        return 35;
      case 'protection_active':
        return 50;
      case 'en_route_to_destination':
        return 75;
      case 'arriving_at_destination':
        return 90;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  // Helper function to get service tier color
  const getServiceTierColor = (serviceName: string): string => {
    switch (serviceName) {
      case 'Executive':
        return '#D4AF37'; // Gold
      case 'Shadow':
        return '#A855F7'; // Purple
      case 'Essential':
        return '#3B82F6'; // Blue
      default:
        return '#22D3EE'; // Cyan
    }
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

  if (!isOpen) return null;

  return (
    <div className={`${styles.activeProtectionPanel} ${isOpen ? styles.open : ''}`}>
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
            <div className={`${styles.statusBadge} ${styles[protectionData.status.toLowerCase().replace(/[_\s]/g, '')]}`}>
              {getStatusText(protectionData.status)}
            </div>
          </div>

          {/* Primary Info - CPO */}
          <div className={styles.primaryInfo}>
            <div className={styles.cpoAvatar}>
              {protectionData.officerName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className={styles.cpoDetails}>
              <span className={styles.cpoName}>{protectionData.officerName}</span>
              <span className={styles.cpoRole}>Close Protection Officer</span>
              <span className={styles.cpoLicense}>SIA: {protectionData.siaLicense}</span>
            </div>
          </div>

          {/* Secondary Info - Vehicle */}
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>🚗 Vehicle</span>
              <span className={styles.detailValue}>{protectionData.vehicleModel}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>🔢 Registration</span>
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
              subtitle="Activate emergency protocols including silent alarm, emergency services dispatch, and immediate notification to your emergency contacts. For life-threatening situations only."
              icon="🚨"
              color="emergency"
              onMainAction={() => handleEmergencyAction('sos')}
              menuOptions={urgentHelpOptions}
              isFullWidth
            />

            <CTAButton
              title="CALL OFFICER"
              subtitle="Connect directly with your assigned Close Protection Officer via secure voice or video call. Available 24/7 for immediate communication during your protection detail."
              icon="📞"
              color="primary"
              onMainAction={() => handleEmergencyAction('call')}
              menuOptions={callOfficerOptions}
            />

            <CTAButton
              title="EXTEND SERVICE"
              subtitle="Request additional protection time beyond your scheduled service window. Extensions require officer availability and approval. Billing adjustments apply automatically."
              icon="⏰"
              color="warning"
              onMainAction={() => extendTime(30)}
              menuOptions={extendServiceOptions}
              pendingApproval={pendingExtensions.size > 0}
            />

            <CTAButton
              title="CHANGE ROUTE"
              subtitle="Modify your destination, add intermediate waypoints, or request route optimization. Your CPO will review and implement changes for maximum security."
              icon="📝"
              color="info"
              onMainAction={() => handleEmergencyAction('destination')}
              menuOptions={changeRouteOptions}
            />

            <CTAButton
              title="MESSAGE OFFICER"
              subtitle="Send secure messages to your CPO including text, voice recordings, or photos. All communications are encrypted and logged for your security records."
              icon="💬"
              color="secondary"
              onMainAction={() => handleEmergencyAction('message')}
              menuOptions={messageOfficerOptions}
            />

            <CTAButton
              title="SHARE LOCATION"
              subtitle="Share your real-time GPS location with designated emergency contacts or trusted parties. Control sharing duration and recipients with full privacy control."
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
    </div>
  );
}