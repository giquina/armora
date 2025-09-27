import { useState, useEffect } from 'react';
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

  const getProgressPercentage = (assignment: Assignment) => {
    const totalDuration = assignment.route.duration * 60 * 1000; // Convert to ms
    const startTime = assignment.scheduledTime.getTime() - totalDuration;
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
        {activeBookings.map((assignment) => {
          const eta = getTimeUntilPickup(assignment.scheduledTime);
          const progress = getProgressPercentage(assignment);

          return (
            <div key={assignment.id} className={`${styles.trackingCard} ${eta.urgent ? styles.urgent : ''}`}>
              <div className={styles.cardHeader}>
                <div className={styles.bookingInfo}>
                  <h3 className={styles.bookingTitle}>{assignment.serviceName}</h3>
                  <span className={styles.bookingId}>#{assignment.id}</span>
                </div>
                <div className={`${styles.eta} ${eta.urgent ? styles.etaUrgent : ''}`}>
                  <span className={styles.etaLabel}>ETA</span>
                  <span className={styles.etaTime}>{eta.text}</span>
                </div>
              </div>

              <div className={styles.cpoSection}>
                <div className={styles.cpoAvatar}>
                  <div className={styles.avatarPlaceholder}>
                    {assignment.protectionOfficer.name.charAt(0)}
                  </div>
                  <div className={styles.onlineIndicator}></div>
                </div>
                <div className={styles.cpoInfo}>
                  <div className={styles.cpoName}>{assignment.protectionOfficer.name}</div>
                  <div className={styles.vehicleInfo}>
                    {assignment.protectionOfficer.vehicle} • {assignment.protectionOfficer.plate}
                  </div>
                  <div className={styles.cpoRating}>
                    <span className={styles.stars}>{'⭐'.repeat(Math.floor(assignment.protectionOfficer.rating))}</span>
                    <span className={styles.ratingNumber}>{assignment.protectionOfficer.rating}</span>
                  </div>
                </div>
              </div>

              <div className={styles.routeProgress}>
                <div className={styles.routeInfo}>
                  <div className={styles.routePoint}>
                    <span className={styles.routeIcon}>📍</span>
                    <span className={styles.routeText}>
                      {assignment.commencementLocation.address.split(',')[0]}
                    </span>
                  </div>
                  <div className={styles.routePoint}>
                    <span className={styles.routeIcon}>🏁</span>
                    <span className={styles.routeText}>
                      {assignment.secureDestination.address.split(',')[0]}
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
                  <span className={styles.statValue}>{assignment.route.distance}km</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Duration</span>
                  <span className={styles.statValue}>{assignment.route.duration}min</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Price</span>
                  <span className={styles.statValue}>£{assignment.pricing.total}</span>
                </div>
              </div>

              <div className={styles.trackingActions}>
                <button
                  className={styles.primaryAction}
                  onClick={() => onTrackDriver(assignment.id)}
                >
                  📍 Live Map
                </button>
                <button
                  className={styles.secondaryAction}
                  onClick={() => onContactDriver(assignment.id)}
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