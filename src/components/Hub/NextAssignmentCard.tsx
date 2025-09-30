import { useMemo } from 'react';
import styles from './NextAssignmentCard.module.css';

interface ProtectionAssignment {
  id: string;
  scheduledDateTime: Date | string;
  cpoName: string;
  cpoDesignation?: string; // Professional title (e.g., "Executive Protection Specialist")
  protectionLevel: 'Essential' | 'Executive' | 'Shadow' | 'Client Vehicle';
  cpoSiaLicense: string;
}

interface NextAssignmentCardProps {
  assignment: ProtectionAssignment | null;
  onClick: () => void;
}

export function NextAssignmentCard({ assignment, onClick }: NextAssignmentCardProps) {
  // Format date/time with smart relative formatting
  const formattedDateTime = useMemo(() => {
    if (!assignment) return null;

    const scheduleDate = typeof assignment.scheduledDateTime === 'string'
      ? new Date(assignment.scheduledDateTime)
      : assignment.scheduledDateTime;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const scheduleDay = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate());

    const daysDiff = Math.floor((scheduleDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const time = scheduleDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (daysDiff === 0) {
      return `Today ${time}`;
    } else if (daysDiff === 1) {
      return `Tomorrow ${time}`;
    } else if (daysDiff >= 2 && daysDiff <= 6) {
      const dayName = scheduleDate.toLocaleDateString('en-GB', { weekday: 'long' });
      return `${dayName} ${time}`;
    } else {
      const dateStr = scheduleDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      return `${dateStr} ${time}`;
    }
  }, [assignment]);

  // Check if assignment is within 2 hours for urgent styling
  const isUrgent = useMemo(() => {
    if (!assignment) return false;

    const scheduleDate = typeof assignment.scheduledDateTime === 'string'
      ? new Date(assignment.scheduledDateTime)
      : assignment.scheduledDateTime;

    const now = new Date();
    const diffMs = scheduleDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours > 0 && diffHours <= 2;
  }, [assignment]);

  // Get protection tier badge styling
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Essential':
        return { color: '#3B82F6', label: 'Essential Protection' };
      case 'Executive':
        return { color: '#D4AF37', label: 'Executive Protection' };
      case 'Shadow':
        return { color: '#A855F7', label: 'Shadow Protocol' };
      case 'Client Vehicle':
        return { color: '#10B981', label: 'Client Vehicle Protection' };
      default:
        return { color: '#6B7280', label: tier };
    }
  };

  const tierInfo = assignment ? getTierBadge(assignment.protectionLevel) : null;

  return (
    <div
      className={`${styles.card} ${isUrgent ? styles.urgent : ''} ${!assignment ? styles.empty : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={assignment ? 'View next protection assignment details' : 'Request protection service'}
    >
      <div className={styles.header}>NEXT ASSIGNMENT</div>

      {assignment ? (
        <div className={styles.content}>
          <div className={styles.dateTime}>{formattedDateTime}</div>

          <div className={styles.cpoInfo}>
            <div className={styles.cpoNameRow}>
              <span className={styles.cpoName}>{assignment.cpoName}</span>
              {assignment.cpoDesignation && (
                <span className={styles.cpoDesignation}>{assignment.cpoDesignation}</span>
              )}
            </div>
            <span
              className={styles.tierBadge}
              style={{ backgroundColor: `${tierInfo?.color}15`, color: tierInfo?.color }}
            >
              {tierInfo?.label}
            </span>
          </div>

          <div className={styles.siaLicense}>
            SIA License: {assignment.cpoSiaLicense}
          </div>

          <div className={styles.statusRow}>
            <span className={styles.statusItem}>✓ CPO confirmed</span>
            <span className={styles.statusItem}>✓ Route optimized</span>
            <span className={styles.statusItem}>★ Favorite slot</span>
          </div>

          <div className={styles.action}>
            View Full Details →
          </div>
        </div>
      ) : (
        <div className={styles.emptyContent}>
          <div className={styles.emptyMessage}>No upcoming protection scheduled</div>
          <div className={styles.action}>
            Request Protection →
          </div>
        </div>
      )}
    </div>
  );
}