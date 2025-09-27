import { useState, useEffect } from 'react';
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
  };

  if (!isOpen && !isMinimized) return null;

  if (isMinimized) {
    return (
      <div className={styles.miniBar} onClick={() => setIsMinimized(false)}>
        <div className={styles.miniContent}>
          <div className={styles.miniLeft}>
            <div className={styles.miniTags}>
              <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
              <span className={`${styles.badge} ${styles.badgeService}`}>{protectionData.serviceName}</span>
            </div>
            <div className={styles.miniOfficerLine}>
              <span className={styles.miniIndicator}></span>
              <span className={styles.miniOfficerName}>{protectionData.officerName}</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.miniOfficerTitle}>{protectionData.officerTitle}</span>
            </div>
          </div>
          <div className={styles.miniRight}>
            <div className={styles.miniRemaining}>{remainingTime} left</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.activeProtectionPanel} ${isOpen ? styles.open : ''}`}>
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
              className={styles.closeButton}
              onClick={() => setIsMinimized(true)}
              aria-label="Minimize protection panel"
            >
              ✕
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
            <button className={styles.actionButton} onClick={() => handleEmergencyAction('call')}>
              <span className={styles.actionIcon}>📞</span>
              <span>Call Officer</span>
            </button>
            <button className={styles.actionButton} onClick={() => extendTime(30)}>
              <span className={styles.actionIcon}>⏰</span>
              <span>Extend +30min</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleEmergencyAction('location')}>
              <span className={styles.actionIcon}>📍</span>
              <span>Share Location</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleEmergencyAction('destination')}>
              <span className={styles.actionIcon}>📝</span>
              <span>Update Route</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleEmergencyAction('silent')}>
              <span className={styles.actionIcon}>🔔</span>
              <span>Silent Alert</span>
            </button>
            <button className={`${styles.actionButton} ${styles.emergencyButton}`} onClick={() => handleEmergencyAction('sos')}>
              <span className={styles.actionIcon}>🚨</span>
              <span>SOS</span>
            </button>
          </div>

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