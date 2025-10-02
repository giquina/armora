import { useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './ProtectionStatusModal.module.css';

interface ProtectionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  protectionStatus: 'active' | 'scheduled' | 'none';
}

export function ProtectionStatusModal({ isOpen, onClose, protectionStatus }: ProtectionStatusModalProps) {
  const { state, navigateToView } = useApp();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Mock data - in real app would come from state/API
  const mockActiveProtection = {
    officer: {
      name: 'Marcus Thompson',
      siaLicense: 'UK-12345',
      rating: 4.9,
      vehicle: 'BMW 5 Series',
      plate: 'AR24 MRA'
    },
    status: 'En route',
    eta: '5 minutes',
    threatLevel: 'LOW'
  };

  const mockUserProfile = {
    tier: 'essential' as const,
    protectionScore: 94,
    memberSince: '2022'
  };

  const handleRequestProtection = () => {
    onClose();
    navigateToView('protection-request');
  };

  const handleScheduleProtection = () => {
    onClose();
    navigateToView('protection-request');
  };

  const handleViewHistory = () => {
    onClose();
    navigateToView('hub');
  };

  const handleSecuritySettings = () => {
    onClose();
    navigateToView('account');
  };

  const getStatusSection = () => {
    switch (protectionStatus) {
      case 'active':
        return (
          <div className={styles.activeProtectionSection}>
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>✅</span>
              <h3 className={styles.statusTitle}>PROTECTED</h3>
            </div>

            <div className={styles.officerDetails}>
              <div className={styles.officerInfo}>
                <span className={styles.officerLabel}>Officer:</span>
                <span className={styles.officerName}>{mockActiveProtection.officer.name}</span>
              </div>
              <div className={styles.officerInfo}>
                <span className={styles.officerLabel}>SIA:</span>
                <span className={styles.siaNumber}>#{mockActiveProtection.officer.siaLicense}</span>
              </div>
              <div className={styles.officerInfo}>
                <span className={styles.officerLabel}>Vehicle:</span>
                <span className={styles.vehicleInfo}>
                  {mockActiveProtection.officer.vehicle} • {mockActiveProtection.officer.plate}
                </span>
              </div>
              <div className={styles.officerInfo}>
                <span className={styles.officerLabel}>ETA:</span>
                <span className={styles.etaInfo}>{mockActiveProtection.eta}</span>
              </div>
            </div>

            <div className={styles.threatLevel}>
              <span className={styles.threatLabel}>Threat Level:</span>
              <span className={`${styles.threatValue} ${styles.threatLow}`}>
                {mockActiveProtection.threatLevel} ●●○○○
              </span>
            </div>
          </div>
        );

      case 'scheduled':
        return (
          <div className={styles.scheduledProtectionSection}>
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>⏰</span>
              <h3 className={styles.statusTitle}>PROTECTION SCHEDULED</h3>
            </div>
            <p className={styles.scheduledDetails}>
              Next assignment: Tomorrow at 9:00 AM<br />
              Officer will be assigned 30 minutes before
            </p>
          </div>
        );

      default:
        return (
          <div className={styles.noProtectionSection}>
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>⚪</span>
              <h3 className={styles.statusTitle}>No Active Protection</h3>
            </div>
            <p className={styles.noProtectionText}>
              Request protection now or schedule for later
            </p>
          </div>
        );
    }
  };

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'essential':
        return 'Essential Member';
      case 'executive':
        return 'Executive Member';
      case 'elite':
        return 'Elite Member';
      default:
        return 'Member';
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>PROTECTION STATUS</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Current Protection Status */}
          {getStatusSection()}

          {/* Contact & Emergency Section - Only for active protection */}
          {protectionStatus === 'active' && (
            <div className={styles.contactSection}>
              <div className={styles.sectionDivider}></div>
              <h3 className={styles.sectionTitle}>CONTACT & EMERGENCY</h3>

              <div className={styles.contactOptions}>
                <button className={styles.contactButton}>
                  📞 Contact Officer
                </button>
                <button className={styles.contactButton}>
                  🗺️ View Route
                </button>
                <button className={styles.emergencyButton}>
                  🚨 Emergency
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions Section */}
          <div className={styles.quickActionsSection}>
            <div className={styles.sectionDivider}></div>
            <h3 className={styles.sectionTitle}>QUICK ACTIONS</h3>

            <div className={styles.actionButtons}>
              {protectionStatus !== 'active' && (
                <button
                  className={styles.primaryActionButton}
                  onClick={handleRequestProtection}
                >
                  Request Protection Now
                </button>
              )}

              <button
                className={styles.actionButton}
                onClick={handleScheduleProtection}
              >
                Schedule Protection
              </button>

              <button
                className={styles.actionButton}
                onClick={handleViewHistory}
              >
                View History
              </button>

              <button
                className={styles.actionButton}
                onClick={handleSecuritySettings}
              >
                Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}