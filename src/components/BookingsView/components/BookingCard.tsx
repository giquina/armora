import React from 'react';
import { Booking } from '../utils/mockData';
import styles from './BookingCard.module.css';

interface BookingCardProps {
  booking: Booking;
  onTrackDriver?: () => void;
  onContactDriver?: () => void;
  onCancel?: () => void;
  onRebook?: () => void;
  onRate?: (rating: number) => void;
}

export function BookingCard({
  booking,
  onTrackDriver,
  onContactDriver,
  onCancel,
  onRebook,
  onRate
}: BookingCardProps) {
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
    const diffMs = booking.scheduledTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 0) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getServiceIcon = () => {
    switch (booking.serviceType) {
      case 'standard': return '🛡️';
      case 'executive': return '👔';
      case 'shadow': return '🕵️';
      default: return '🚗';
    }
  };

  const getStatusColor = () => {
    switch (booking.status) {
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

      <div className={styles.cardHeader}>
        <div className={styles.serviceInfo}>
          <span className={styles.serviceIcon}>{getServiceIcon()}</span>
          <div className={styles.serviceDetails}>
            <h3 className={styles.serviceName}>{booking.serviceName}</h3>
            <span className={styles.bookingId}>{booking.id}</span>
          </div>
        </div>
        <div className={styles.eta}>
          <span className={styles.etaLabel}>ETA</span>
          <span className={styles.etaTime}>{getTimeUntilPickup()}</span>
        </div>
      </div>

      <div className={styles.driverInfo}>
        <div className={styles.driverAvatar}>
          <div className={styles.avatarPlaceholder}>
            {booking.driver.name.charAt(0)}
          </div>
        </div>
        <div className={styles.driverDetails}>
          <div className={styles.driverName}>{booking.driver.name}</div>
          <div className={styles.vehicleInfo}>
            {booking.driver.vehicle} • {booking.driver.plate}
          </div>
          <div className={styles.driverRating}>
            <span className={styles.stars}>{'⭐'.repeat(Math.floor(booking.driver.rating))}</span>
            <span className={styles.ratingNumber}>{booking.driver.rating}</span>
          </div>
        </div>
      </div>

      <div className={styles.routeInfo}>
        <div className={styles.location}>
          <div className={styles.locationIcon}>📍</div>
          <div className={styles.locationText}>
            <div className={styles.locationLabel}>Pickup</div>
            <div className={styles.locationAddress}>{booking.pickupLocation.address}</div>
          </div>
        </div>
        <div className={styles.routeLine}></div>
        <div className={styles.location}>
          <div className={styles.locationIcon}>🏁</div>
          <div className={styles.locationText}>
            <div className={styles.locationLabel}>Destination</div>
            <div className={styles.locationAddress}>{booking.destination.address}</div>
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.primaryAction} onClick={onTrackDriver}>
          📍 Track Driver
        </button>
        <button className={styles.secondaryAction} onClick={onContactDriver}>
          📞 Contact
        </button>
        <button className={styles.dangerAction} onClick={onCancel}>
          ❌ Cancel
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
            <h3 className={styles.serviceName}>{booking.serviceName}</h3>
            <span className={styles.bookingId}>{booking.id}</span>
          </div>
        </div>
        <div className={styles.scheduleTime}>
          <div className={styles.scheduleDate}>{formatDate(booking.scheduledTime)}</div>
          <div className={styles.scheduleTimeText}>{formatTime(booking.scheduledTime)}</div>
        </div>
      </div>

      <div className={styles.routeInfo}>
        <div className={styles.location}>
          <div className={styles.locationIcon}>📍</div>
          <div className={styles.locationText}>
            <div className={styles.locationAddress}>{booking.pickupLocation.address}</div>
          </div>
        </div>
        <div className={styles.routeLine}></div>
        <div className={styles.location}>
          <div className={styles.locationIcon}>🏁</div>
          <div className={styles.locationText}>
            <div className={styles.locationAddress}>{booking.destination.address}</div>
          </div>
        </div>
      </div>

      <div className={styles.bookingMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Price:</span>
          <span className={styles.metaValue}>£{booking.pricing.total}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Duration:</span>
          <span className={styles.metaValue}>{booking.route.duration} min</span>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.primaryAction}>
          ✏️ Edit Booking
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
            <h3 className={styles.serviceName}>{booking.serviceName}</h3>
            <span className={styles.bookingId}>{booking.id}</span>
          </div>
        </div>
        <div className={styles.completedTime}>
          <div className={styles.completedDate}>{formatDate(booking.completedTime!)}</div>
          <div className={styles.completedTimeText}>{formatTime(booking.completedTime!)}</div>
        </div>
      </div>

      <div className={styles.routeSummary}>
        <span className={styles.routeText}>
          {booking.pickupLocation.address.split(',')[0]} → {booking.destination.address.split(',')[0]}
        </span>
        <span className={styles.routeStats}>
          {booking.route.distance}km • {booking.route.duration}min
        </span>
      </div>

      <div className={styles.completedMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Final Cost:</span>
          <span className={styles.metaValue}>£{booking.pricing.total}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Driver:</span>
          <span className={styles.metaValue}>{booking.driver.name}</span>
        </div>
      </div>

      <div className={styles.driverRatingSection}>
        <div className={styles.ratingPrompt}>Rate your driver:</div>
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
        <button className={styles.primaryAction} onClick={onRebook}>
          🔄 Book Again
        </button>
        <button className={styles.secondaryAction}>
          📄 Download Receipt
        </button>
      </div>
    </div>
  );

  switch (booking.status) {
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