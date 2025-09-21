import React, { useState, useEffect } from 'react';
import styles from './ActiveProtectionPanel.module.css';

interface ActiveProtectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
}

interface ProtectionData {
  officerName: string;
  siaLicense: string;
  vehicleModel: string;
  vehicleRegistration: string;
  securityCode: string;
  status: 'En Route' | 'On Location' | 'Protection Active' | 'Awaiting Assignment';
  eta?: string;
  startTime: Date;
  currentRate: number;
  mileageRate: number;
  currentCharges: number;
}

export function ActiveProtectionPanel({ isOpen, onClose, isActive }: ActiveProtectionPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('0:00:00');

  // Mock protection data - in real app, this would come from context/API
  const protectionData: ProtectionData = {
    officerName: 'James Mitchell',
    siaLicense: 'SIA-1234567',
    vehicleModel: 'BMW X5 Executive',
    vehicleRegistration: 'AR23 ORA',
    securityCode: 'SEC-789',
    status: 'Protection Active',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
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
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isActive, protectionData.startTime]);

  const handleSwipeDown = (e: React.TouchEvent) => {
    // Simple swipe detection - in production would use proper gesture library
    const startY = e.touches[0].clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentY = moveEvent.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 100) { // Swiped down 100px
        setIsMinimized(true);
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };

    document.addEventListener('touchmove', handleTouchMove);

    setTimeout(() => {
      document.removeEventListener('touchmove', handleTouchMove);
    }, 1000);
  };

  const extendTime = (minutes: number) => {
    console.log(`Extending protection by ${minutes} minutes`);
    // TODO: Implement time extension logic
  };

  const handleEmergencyAction = (action: string) => {
    console.log(`Emergency action: ${action}`);
    // TODO: Implement emergency actions
  };

  if (!isOpen && !isMinimized) return null;

  if (isMinimized) {
    return (
      <div className={styles.miniBar} onClick={() => setIsMinimized(false)}>
        <div className={styles.miniContent}>
          <div className={styles.miniStatus}>
            <div className={styles.miniIndicator}></div>
            <span>Protection Active - {protectionData.officerName}</span>
          </div>
          <div className={styles.miniTime}>{elapsedTime}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`}>
      <div
        className={`${styles.panel} ${isOpen ? styles.slideUp : ''}`}
        onTouchStart={handleSwipeDown}
      >
        {/* Handle bar for swipe indication */}
        <div className={styles.handleBar}></div>

        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h2 className={styles.title}>ACTIVE PROTECTION</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.officerInfo}>
              <span className={styles.officerName}>{protectionData.officerName}</span>
              <span className={styles.elapsedTime}>{elapsedTime}</span>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className={styles.mapSection}>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapIcon}>🗺️</div>
            <p>Live tracking map would appear here</p>
            <p className={styles.mapNote}>Officer location updating every 30 seconds</p>
          </div>
        </div>

        {/* Protection Details */}
        <div className={styles.detailsSection}>
          <div className={styles.detailsHeader}>
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

          <div className={styles.securityCode}>
            <span className={styles.securityLabel}>SECURITY CODE</span>
            <span className={styles.securityValue}>{protectionData.securityCode}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.actionsSection}>
          <h3>Quick Actions</h3>
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
        </div>

        {/* Billing Tracker */}
        <div className={styles.billingSection}>
          <h3>Billing Tracker</h3>
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
  );
}