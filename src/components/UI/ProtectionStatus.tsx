import { useApp } from '../../contexts/AppContext';
import styles from './ProtectionStatus.module.css';

export function ProtectionStatus() {
  const { navigateToView } = useApp();

  // Mock active protection assignment data - in real app would come from state
  const hasActiveProtection = false; // Would check state.activeBooking
  const hasScheduledProtection = false; // Would check state.scheduledBookings

  // Mock protection data
  const activeProtection = {
    officer: {
      name: 'Marcus Thompson',
      siaLicense: 'UK-12345'
    },
    eta: '5 min away',
    status: 'En route'
  };

  const scheduledProtection = {
    time: 'Today 3:00 PM'
  };

  const handleStatusClick = () => {
    navigateToView('hub');
  };

  // Hidden when no protection
  if (!hasActiveProtection && !hasScheduledProtection) {
    return null;
  }

  return (
    <div
      className={`${styles.protectionStatus} ${hasActiveProtection ? styles.active : styles.scheduled}`}
      onClick={handleStatusClick}
      role="button"
      aria-label="View protection details"
    >
      <span className={styles.statusDot} />
      <span className={styles.statusText}>
        {hasActiveProtection
          ? `Protected • ${activeProtection.officer.name} • ${activeProtection.eta}`
          : `Scheduled • ${scheduledProtection.time}`
        }
      </span>
    </div>
  );
}