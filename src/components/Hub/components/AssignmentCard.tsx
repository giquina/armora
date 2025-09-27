import React from 'react';
import { Assignment } from '../utils/mockData';
import styles from './AssignmentCard.module.css';

interface AssignmentCardProps {
  assignment: Assignment;
  onTrackCPO?: () => void;
  onContactCPO?: () => void;
  onCancel?: () => void;
  onRepeatAssignment?: () => void;
  onRate?: (rating: number) => void;
}

export function AssignmentCard({
  assignment,
  onTrackCPO,
  onContactCPO,
  onCancel,
  onRepeatAssignment,
  onRate
}: AssignmentCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeUntilPickup = () => {
    const now = new Date();
    const diffMs = assignment.scheduledTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 0) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getServiceIcon = () => {
    switch (assignment.serviceType) {
      case 'standard': return '🛡️';
      case 'executive': return '👔';
      case 'shadow': return '🕵️';
      default: return '🚗';
    }
  };

  const getStatusColor = () => {
    switch (assignment.status) {
      case 'active': return '#00ff88';
      case 'scheduled': return '#FFD700';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderActiveBooking = () => (
    <div className={`${styles.bookingCard} ${styles.activeCard}`}>
      <div className={styles.liveIndicator}>
        <div className={styles.pulseIcon}></div>
        <span className={styles.liveText}>LIVE</span>
      </div>

      {/* ROW 1: BALANCED HEADER */}
      <div className={styles.assignmentHeader}>
        <div className={styles.dateInfo}>
          {formatDate(assignment.scheduledTime)}
        </div>
        <div className={styles.servicePriceSection}>
          <div className={styles.serviceLevelBadge}>
            {getServiceIcon()} {assignment.serviceType.toUpperCase()}
          </div>
          <div className={styles.priceDisplay}>£{assignment.pricing.total}</div>
          <div className={styles.ratingDisplay}>
            {'⭐'.repeat(Math.floor(assignment.protectionOfficer.rating))}
          </div>
        </div>
      </div>

      {/* ROW 2: STATS GRID */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>🕐</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>TIME</div>
            <div className={styles.statValue}>{formatTime(assignment.scheduledTime)}</div>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>⏱️</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>DURATION</div>
            <div className={styles.statValue}>{assignment.route.duration} min</div>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>👤</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>OFFICER</div>
            <div className={styles.statValue}>{assignment.protectionOfficer.name}</div>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>🚗</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>VEHICLE</div>
            <div className={styles.statValue}>{assignment.protectionOfficer.vehicle}</div>
          </div>
        </div>
      </div>

      {/* ROW 3: ROUTE INFORMATION */}
      <div className={styles.routeSection}>
        <div className={styles.routeItem}>
          <div className={styles.routeIcon}>📍</div>
          <div className={styles.routeLabel}>FROM</div>
          <div className={styles.routeText}>{assignment.commencementLocation.address}</div>
        </div>
        <div className={styles.routeItem}>
          <div className={styles.routeIcon}>🎯</div>
          <div className={styles.routeLabel}>TO</div>
          <div className={styles.routeText}>{assignment.secureDestination.address}</div>
        </div>
      </div>

      {/* ROW 4: ACTION BUTTONS */}
      <div className={styles.actionButtons}>
        <button className={`${styles.actionBtn} ${styles.btnTrack}`} onClick={onTrackDriver}>
          📍 Live Track
        </button>
        <button className={`${styles.actionBtn} ${styles.btnCall}`} onClick={onContactDriver}>
          📞 Call Officer
        </button>
      </div>
    </div>
  );

  const renderScheduledBooking = () => (
    <div className={`${styles.bookingCard} ${styles.scheduledCard}`}>
      <div className={styles.scheduledBadge}>Upcoming</div>

      <div className={styles.cardHeader}>
        <div className={styles.serviceInfo}>
          <span className={styles.serviceIcon}>{getServiceIcon()}</span>
          <div className={styles.serviceDetails}>
            <h3 className={styles.serviceName}>{assignment.serviceName}</h3>
            <span className={styles.bookingId}>{assignment.id}</span>
          </div>
        </div>
        <div className={styles.scheduleTime}>
          <div className={styles.scheduleDate}>{formatDate(assignment.scheduledTime)}</div>
          <div className={styles.scheduleTimeText}>{formatTime(assignment.scheduledTime)}</div>
        </div>
      </div>

      <div className={styles.routeInfo}>
        <div className={styles.location}>
          <div className={styles.locationIcon}>📍</div>
          <div className={styles.locationText}>
            <div className={styles.locationAddress}>{assignment.commencementLocation.address}</div>
          </div>
        </div>
        <div className={styles.routeLine}></div>
        <div className={styles.location}>
          <div className={styles.locationIcon}>🏁</div>
          <div className={styles.locationText}>
            <div className={styles.locationAddress}>{assignment.secureDestination.address}</div>
          </div>
        </div>
      </div>

      <div className={styles.bookingMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Price:</span>
          <span className={styles.metaValue}>£{assignment.pricing.total}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Duration:</span>
          <span className={styles.metaValue}>{assignment.route.duration} min</span>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.primaryAction}>
          ✏️ Edit Assignment
        </button>
        <button className={styles.secondaryAction}>
          🔔 Set Reminder
        </button>
        <button className={styles.dangerAction} onClick={onCancel}>
          ❌ Cancel
        </button>
      </div>
    </div>
  );

  const renderCompletedBooking = () => (
    <div className={`${styles.bookingCard} ${styles.completedCard}`}>
      <div className={styles.completedBadge}>Completed</div>

      <div className={styles.cardHeader}>
        <div className={styles.serviceInfo}>
          <span className={styles.serviceIcon}>{getServiceIcon()}</span>
          <div className={styles.serviceDetails}>
            <h3 className={styles.serviceName}>{assignment.serviceName}</h3>
            <span className={styles.bookingId}>{assignment.id}</span>
          </div>
        </div>
        <div className={styles.completedTime}>
          <div className={styles.completedDate}>{formatDate(assignment.completedTime!)}</div>
          <div className={styles.completedTimeText}>{formatTime(assignment.completedTime!)}</div>
        </div>
      </div>

      <div className={styles.routeSummary}>
        <span className={styles.routeText}>
          {assignment.commencementLocation.address.split(',')[0]} → {assignment.secureDestination.address.split(',')[0]}
        </span>
        <span className={styles.routeStats}>
          {assignment.route.distance}km • {assignment.route.duration}min
        </span>
      </div>

      <div className={styles.completedMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Final Cost:</span>
          <span className={styles.metaValue}>£{assignment.pricing.total}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Protection Officer:</span>
          <span className={styles.metaValue}>{assignment.protectionOfficer.name}</span>
        </div>
      </div>

      <div className={styles.cpoRatingSection}>
        <div className={styles.ratingPrompt}>Rate your Protection Officer:</div>
        <div className={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={styles.ratingStar}
              onClick={() => onRate?.(star)}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.primaryAction} onClick={onRepeatAssignment}>
          🔄 Book Again
        </button>
        <button className={styles.secondaryAction}>
          📄 Download Receipt
        </button>
      </div>
    </div>
  );

  switch (assignment.status) {
    case 'active':
      return renderActiveBooking();
    case 'scheduled':
      return renderScheduledBooking();
    case 'completed':
      return renderCompletedBooking();
    default:
      return null;
  }
}