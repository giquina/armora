import React from 'react';
import { ProtectionAssignmentHistoryItem, FavoriteRoute } from '../../types';
import { AssignmentHistoryManager } from '../../utils/assignmentHistory';
import { useApp } from '../../contexts/AppContext';
import styles from './RecentServices.module.css';

interface RecentAssignmentsProps {
  onRebook?: (item: ProtectionAssignmentHistoryItem) => void;
  onAddToFavorites?: (item: ProtectionAssignmentHistoryItem) => void;
  maxItems?: number;
}

export function RecentAssignments({ onRebook, onAddToFavorites, maxItems = 5 }: RecentAssignmentsProps) {
  const { navigateToView } = useApp();
  const [history, setHistory] = React.useState<ProtectionAssignmentHistoryItem[]>([]);
  const [favorites, setFavorites] = React.useState<FavoriteRoute[]>([]);

  React.useEffect(() => {
    const assignmentHistory = AssignmentHistoryManager.getAssignmentHistory();
    const favoriteRoutes = AssignmentHistoryManager.getFavoriteRoutes();
    setHistory(assignmentHistory.slice(0, maxItems));
    setFavorites(favoriteRoutes);
  }, [maxItems]);

  const handleRebook = (item: ProtectionAssignmentHistoryItem) => {
    if (onRebook) {
      onRebook(item);
    } else {
      // Default behavior: store selection and navigate to protection assignment
      localStorage.setItem('armora_rebook_data', JSON.stringify({
        from: item.from,
        to: item.to,
        service: item.service,
        timestamp: new Date().toISOString()
      }));
      navigateToView('protection-request');
    }
  };

  const handleAddToFavorites = (item: ProtectionAssignmentHistoryItem) => {
    AssignmentHistoryManager.addToFavorites(item, false);
    const updatedFavorites = AssignmentHistoryManager.getFavoriteRoutes();
    setFavorites(updatedFavorites);

    if (onAddToFavorites) {
      onAddToFavorites(item);
    }
  };

  const isRouteInFavorites = (item: ProtectionAssignmentHistoryItem): boolean => {
    return favorites.some(fav => fav.from === item.from && fav.to === item.to);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatTime = (timeString: string): string => {
    return timeString;
  };

  const getServiceBadgeClass = (serviceId: string): string => {
    switch (serviceId) {
      case 'executive':
        return styles.badgeExecutive;
      case 'shadow':
        return styles.badgeShadow;
      case 'standard':
        return styles.badgeStandard;
      default:
        return styles.badgeDefault;
    }
  };

  const shortenAddress = (address: string): string => {
    if (address.length <= 30) return address;

    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[0].trim();
    }

    return address.substring(0, 27) + '...';
  };

  if (history.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🎯</div>
        <h3 className={styles.emptyTitle}>No Recent Services</h3>
        <p className={styles.emptyText}>
          Your completed journeys will appear here after your first Assignment with Armora.
        </p>
        <button
          className={styles.emptyAction}
          onClick={() => navigateToView('protection-request')}
        >
          📅 Book Your First Service
        </button>
      </div>
    );
  }

  return (
    <div className={styles.recentServices}>
      <h2 className={styles.sectionTitle}>🚗 Recent Journeys</h2>

      <div className={styles.assignmentsList}>
        {history.map((protectionDetail) => (
          <div key={protectionDetail.id} className={styles.assignmentCard}>
            <div className={styles.assignmentHeader}>
              <div className={styles.dateTimeInfo}>
                <span className={styles.date}>{formatDate(protectionDetail.date)}</span>
                <span className={styles.time}>{formatTime(protectionDetail.time)}</span>
              </div>
              <div className={`${styles.serviceBadge} ${getServiceBadgeClass(protectionDetail.service)}`}>
                {protectionDetail.serviceName}
              </div>
            </div>

            <div className={styles.routeInfo}>
              <div className={styles.route}>
                <div className={styles.location}>
                  <span className={styles.locationIcon}>📍</span>
                  <span className={styles.locationText}>{shortenAddress(protectionDetail.from)}</span>
                </div>
                <div className={styles.routeArrow}>→</div>
                <div className={styles.location}>
                  <span className={styles.locationIcon}>🎯</span>
                  <span className={styles.locationText}>{shortenAddress(protectionDetail.to)}</span>
                </div>
              </div>
            </div>

            <div className={styles.assignmentDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>💰</span>
                <span className={styles.detailText}>{protectionDetail.price}</span>
              </div>
              {protectionDetail.protectionOfficer && (
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>👨‍💼</span>
                  <span className={styles.detailText}>{protectionDetail.protectionOfficer}</span>
                </div>
              )}
              {protectionDetail.frequency > 1 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🔄</span>
                  <span className={styles.detailText}>{protectionDetail.frequency}x protection confirmed</span>
                </div>
              )}
            </div>

            <div className={styles.assignmentActions}>
              <button
                className={styles.rebookButton}
                onClick={() => handleRebook(protectionDetail)}
              >
                🔄 Book Again
              </button>

              {!isRouteInFavorites(protectionDetail) && (
                <button
                  className={styles.favoriteButton}
                  onClick={() => handleAddToFavorites(protectionDetail)}
                >
                  ⭐ Add Favorite
                </button>
              )}

              {isRouteInFavorites(protectionDetail) && (
                <div className={styles.favoriteIndicator}>
                  <span className={styles.favoriteIcon}>⭐</span>
                  <span className={styles.favoriteText}>Favorite</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {history.length === maxItems && (
        <button
          className={styles.viewAllButton}
          onClick={() => navigateToView('Assignments')}
        >
          View All Services →
        </button>
      )}
    </div>
  );
}

export default RecentAssignments;

// Export as RecentServices for backward compatibility
export { RecentAssignments as RecentServices };