import React from 'react';
import { Availability } from '../../../types/cpo';
import styles from '../styles/cpo-profile.module.css';

interface AvailabilityStatusProps {
  availability: Availability;
  showDetails?: boolean;
  compact?: boolean;
}

export const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({
  availability,
  showDetails = false,
  compact = false
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Available_Now':
        return {
          color: 'green',
          icon: '🟢',
          text: 'Available Now',
          className: 'available'
        };
      case 'Available_Soon':
        return {
          color: 'amber',
          icon: '🟡',
          text: 'Available Soon',
          className: 'availableSoon'
        };
      case 'On_Assignment':
        return {
          color: 'red',
          icon: '🔴',
          text: 'On Assignment',
          className: 'onAssignment'
        };
      case 'Off_Duty':
        return {
          color: 'gray',
          icon: '⚫',
          text: 'Off Duty',
          className: 'offDuty'
        };
      case 'Emergency_Only':
        return {
          color: 'orange',
          icon: '🟠',
          text: 'Emergency Only',
          className: 'emergencyOnly'
        };
      default:
        return {
          color: 'gray',
          icon: '⚫',
          text: 'Unknown',
          className: 'unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(availability.status);

  const formatNextAvailableTime = (nextAvailable?: string): string => {
    if (!nextAvailable) return '';

    const nextDate = new Date(nextAvailable);
    const now = new Date();
    const diffMs = nextDate.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `in ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  const formatCurrentAssignmentEnd = (endTime?: string): string => {
    if (!endTime) return '';

    const endDate = new Date(endTime);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.round(diffMs / (1000 * 60));
      return `ends in ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    } else {
      return `ends in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className={`${styles.availabilityContainer} ${compact ? styles.compact : ''}`}>
      <div className={`${styles.statusIndicator} ${styles[statusConfig.className]}`}>
        <span className={styles.statusIcon}>{statusConfig.icon}</span>
        <span className={styles.statusText}>{statusConfig.text}</span>
      </div>

      {showDetails && !compact && (
        <div className={styles.availabilityDetails}>
          {/* Next Available Time */}
          {availability.nextAvailable && availability.status !== 'Available_Now' && (
            <div className={styles.nextAvailable}>
              <span className={styles.label}>Next available:</span>
              <span className={styles.value}>
                {formatNextAvailableTime(availability.nextAvailable)}
              </span>
            </div>
          )}

          {/* Current Assignment End Time */}
          {availability.currentAssignmentEndTime && availability.status === 'On_Assignment' && (
            <div className={styles.assignmentEnd}>
              <span className={styles.label}>Current assignment:</span>
              <span className={styles.value}>
                {formatCurrentAssignmentEnd(availability.currentAssignmentEndTime)}
              </span>
            </div>
          )}

          {/* Response Time */}
          <div className={styles.responseTimeDetail}>
            <span className={styles.label}>Typical response:</span>
            <span className={styles.value}>
              {availability.responseTime < 60
                ? `${availability.responseTime} mins`
                : `${Math.round(availability.responseTime / 60)} hours`
              }
            </span>
          </div>

          {/* Working Hours Summary */}
          {showDetails && (
            <div className={styles.workingHours}>
              <span className={styles.label}>Schedule:</span>
              <div className={styles.scheduleGrid}>
                {Object.entries(availability.workingHours).map(([day, hours]) => (
                  <div key={day} className={`${styles.daySchedule} ${!hours.available ? styles.unavailable : ''}`}>
                    <span className={styles.dayName}>{day.slice(0, 3)}</span>
                    <span className={styles.dayHours}>
                      {hours.available ? `${hours.start}-${hours.end}` : 'Off'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick info for non-detailed view */}
      {!showDetails && !compact && (
        <div className={styles.quickInfo}>
          {availability.status === 'Available_Soon' && availability.nextAvailable && (
            <span className={styles.quickDetail}>
              {formatNextAvailableTime(availability.nextAvailable)}
            </span>
          )}
          {availability.status === 'On_Assignment' && availability.currentAssignmentEndTime && (
            <span className={styles.quickDetail}>
              {formatCurrentAssignmentEnd(availability.currentAssignmentEndTime)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Simplified version for use in lists
export const AvailabilityIndicator: React.FC<{ status: string; nextAvailable?: string }> = ({
  status,
  nextAvailable
}) => {
  const getIndicatorColor = (status: string): string => {
    switch (status) {
      case 'Available_Now': return '#10B981'; // green
      case 'Available_Soon': return '#F59E0B'; // amber
      case 'On_Assignment': return '#EF4444'; // red
      case 'Off_Duty': return '#6B7280'; // gray
      case 'Emergency_Only': return '#F97316'; // orange
      default: return '#6B7280'; // gray
    }
  };

  return (
    <div
      className={styles.simpleIndicator}
      style={{ backgroundColor: getIndicatorColor(status) }}
      title={status.replace('_', ' ')}
    >
      <div className={styles.pulse} />
    </div>
  );
};

// Real-time status updater component
export const RealTimeStatus: React.FC<{
  cpoId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}> = ({
  cpoId,
  currentStatus,
  onStatusChange
}) => {
  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  React.useEffect(() => {
    // Set up real-time status monitoring
    const interval = setInterval(() => {
      // This would connect to Supabase real-time updates
      // For now, we'll simulate status changes
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [cpoId]);


  return (
    <div className={styles.realTimeStatus}>
      <div className={styles.statusDot} />
      <span className={styles.liveText}>LIVE</span>
      <span className={styles.lastUpdate}>
        Updated {lastUpdate.toLocaleTimeString()}
      </span>
    </div>
  );
};