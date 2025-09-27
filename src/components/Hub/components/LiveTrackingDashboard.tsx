import React, { useState, useEffect } from 'react';
import { Assignment } from '../utils/mockData';
import styles from './LiveTrackingDashboard.module.css';

interface LiveTrackingDashboardProps {
  activeBookings: Assignment[];
  onTrackDriver: (bookingId: string) => void;
  onContactDriver: (bookingId: string) => void;
}

export function LiveTrackingDashboard({
  activeBookings,
  onTrackDriver,
  onContactDriver
}: LiveTrackingDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeUntilPickup = (scheduledTime: Date) => {
    const now = new Date();
    const diffMs = scheduledTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins <= 0) return { text: 'Arriving Now', urgent: true };
    if (diffMins < 60) return { text: `${diffMins}m`, urgent: diffMins <= 5 };
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return { text: `${hours}h ${mins}m`, urgent: false };
  };

  const getProgressPercentage = (protection assignment: Assignment) => {
    const totalDuration = protection assignment.route.duration * 60 * 1000; // Convert to ms
    const startTime = protection assignment.scheduledTime.getTime() - totalDuration;
    const now = currentTime.getTime();
    const elapsed = now - startTime;
    const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    return Math.floor(progress);
  };

  if (activeBookings.length === 0) {
    return (
      <div className={styles.emptyTracker}>
        <div className={styles.emptyIcon}>🚗</div>
        <h3 className={styles.emptyTitle}>No Active Assignments</h3>
        <p className={styles.emptyText}>Your live tracking will appear here when you have active bookings</p>
      </div>
    );
  }

  return (
    <div className={styles.trackingDashboard}>
      <div className={styles.dashboardHeader}>
        <h2 className={styles.dashboardTitle}>
          <span className={styles.liveIndicator}></span>
          Live Tracking Dashboard
        </h2>
        <div className={styles.activeCount}>
          {activeBookings.length} Active Service{activeBookings.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className={styles.trackingCards}>
        {activeBookings.map((protection assignment) => {
          const eta = getTimeUntilPickup(protection assignment.scheduledTime);
          const progress = getProgressPercentage(protection assignment);

          return (
            <div key={protection assignment.id} className={`${styles.trackingCard} ${eta.urgent ? styles.urgent : ''}`}>
              <div className={styles.cardHeader}>
                <div className={styles.bookingInfo}>
                  <h3 className={styles.bookingTitle}>{protection assignment.serviceName}</h3>
                  <span className={styles.bookingId}>#{protection assignment.id}</span>
                </div>
                <div className={`${styles.eta} ${eta.urgent ? styles.etaUrgent : ''}`}>
                  <span className={styles.etaLabel}>ETA</span>
                  <span className={styles.etaTime}>{eta.text}</span>
                </div>
              </div>

              <div className={styles.cpoSection}>
                <div className={styles.cpoAvatar}>
                  <div className={styles.avatarPlaceholder}>
                    {protection assignment.protectionOfficer.name.charAt(0)}
                  </div>
                  <div className={styles.onlineIndicator}></div>
                </div>
                <div className={styles.cpoInfo}>
                  <div className={styles.cpoName}>{protection assignment.protectionOfficer.name}</div>
                  <div className={styles.vehicleInfo}>
                    {protection assignment.protectionOfficer.vehicle} • {protection assignment.protectionOfficer.plate}
                  </div>
                  <div className={styles.cpoRating}>
                    <span className={styles.stars}>{'⭐'.repeat(Math.floor(protection assignment.protectionOfficer.rating))}</span>
                    <span className={styles.ratingNumber}>{protection assignment.protectionOfficer.rating}</span>
                  </div>
                </div>
              </div>

              <div className={styles.routeProgress}>
                <div className={styles.routeInfo}>
                  <div className={styles.routePoint}>
                    <span className={styles.routeIcon}>📍</span>
                    <span className={styles.routeText}>
                      {protection assignment.commencementLocation.address.split(',')[0]}
                    </span>
                  </div>
                  <div className={styles.routePoint}>
                    <span className={styles.routeIcon}>🏁</span>
                    <span className={styles.routeText}>
                      {protection assignment.secureDestination.address.split(',')[0]}
                    </span>
                  </div>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>{progress}% Complete</span>
                </div>
              </div>

              <div className={styles.liveStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Distance</span>
                  <span className={styles.statValue}>{protection assignment.route.distance}km</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Duration</span>
                  <span className={styles.statValue}>{protection assignment.route.duration}min</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Price</span>
                  <span className={styles.statValue}>£{protection assignment.pricing.total}</span>
                </div>
              </div>

              <div className={styles.trackingActions}>
                <button
                  className={styles.primaryAction}
                  onClick={() => onTrackDriver(protection assignment.id)}
                >
                  📍 Live Map
                </button>
                <button
                  className={styles.secondaryAction}
                  onClick={() => onContactDriver(protection assignment.id)}
                >
                  📞 Contact Protection Officer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}