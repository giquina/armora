import { useState, useEffect } from 'react';
import { FavoriteRoute } from '../../types';
import { AssignmentHistoryManager } from '../../utils/assignmentHistory';
import { useApp } from '../../contexts/AppContext';
import styles from './FavoriteRoutes.module.css';

interface FavoriteRoutesProps {
  onBookRoute?: (route: FavoriteRoute) => void;
  maxItems?: number;
  showHeader?: boolean;
}

export function FavoriteRoutes({ onBookRoute, maxItems = 5, showHeader = true }: FavoriteRoutesProps) {
  const { navigateToView } = useApp();
  const [favorites, setFavorites] = useState<FavoriteRoute[]>([]);

  useEffect(() => {
    const favoriteRoutes = AssignmentHistoryManager.getFavoriteRoutes();
    // Sort by usage count and then by recent usage
    const sorted = favoriteRoutes
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count; // Higher usage first
        }
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime(); // More recent first
      })
      .slice(0, maxItems);
    setFavorites(sorted);
  }, [maxItems]);

  const handleBookRoute = (route: FavoriteRoute) => {
    if (onBookRoute) {
      onBookRoute(route);
    } else {
      // Default behavior: store selection and navigate to protection assignment
      localStorage.setItem('armora_rebook_data', JSON.stringify({
        from: route.from,
        to: route.to,
        service: route.preferredService,
        timestamp: new Date().toISOString()
      }));
      navigateToView('protection-request');
    }
  };

  const handleRemoveFavorite = (routeId: string) => {
    AssignmentHistoryManager.removeFromFavorites(routeId);
    const updatedFavorites = AssignmentHistoryManager.getFavoriteRoutes();
    setFavorites(updatedFavorites.slice(0, maxItems));
  };

  const formatLastUsed = (lastUsedString: string): string => {
    const lastUsed = new Date(lastUsedString);
    const now = new Date();
    const diffMs = now.getTime() - lastUsed.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const shortenAddress = (address: string): string => {
    if (address.length <= 25) return address;

    const parts = address.split(',');
    if (parts.length > 1) {
      return parts[0].trim();
    }

    return address.substring(0, 22) + '...';
  };

  const calculateTimeSaved = (count: number): string => {
    const timePerBooking = 2; // minutes saved per protection assignment
    const totalMinutes = count * timePerBooking;

    if (totalMinutes < 60) {
      return `${totalMinutes} mins saved`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} saved`;
    }

    return `${hours}h ${minutes}m saved`;
  };

  const getFavoriteIcon = (count: number, isAutoFavorite: boolean): string => {
    if (count >= 10) return '🌟'; // Super star for 10+ uses
    if (count >= 5) return '⭐'; // Gold star for 5+ uses
    if (isAutoFavorite) return '⚡'; // Lightning for auto-favorites
    return '📍'; // Pin for manual favorites
  };

  if (favorites.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⭐</div>
        <h3 className={styles.emptyTitle}>No Favorite Routes Yet</h3>
        <p className={styles.emptyText}>
          Routes you request protection frequently (3+ times) will automatically appear here as favorites for quick rebooking.
        </p>
        <div className={styles.emptyFeatures}>
          <div className={styles.emptyFeature}>
            <span className={styles.featureIcon}>⚡</span>
            <span>One-tap rebooking</span>
          </div>
          <div className={styles.emptyFeature}>
            <span className={styles.featureIcon}>💾</span>
            <span>Save time on every protection assignment</span>
          </div>
          <div className={styles.emptyFeature}>
            <span className={styles.featureIcon}>🎯</span>
            <span>Auto-suggested preferences</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoriteRoutes}>
      {showHeader && (
        <h2 className={styles.sectionTitle}>⭐ Your Favorite Routes</h2>
      )}

      <div className={styles.routesList}>
        {favorites.map((route) => (
          <div key={route.id} className={styles.routeCard}>
            <div className={styles.routeHeader}>
              <div className={styles.routeIcon}>
                {getFavoriteIcon(route.count, route.isAutoFavorite)}
              </div>
              <div className={styles.routeTitle}>
                <h3 className={styles.routeName}>
                  {route.nickname || `${shortenAddress(route.from)} → ${shortenAddress(route.to)}`}
                </h3>
                <p className={styles.routeSubtitle}>
                  Used {route.count} time{route.count !== 1 ? 's' : ''} • {formatLastUsed(route.lastUsed)}
                </p>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveFavorite(route.id)}
                title="Remove from favorites"
              >
                ×
              </button>
            </div>

            <div className={styles.routeDetails}>
              <div className={styles.addressRow}>
                <div className={styles.address}>
                  <span className={styles.addressIcon}>📍</span>
                  <span className={styles.addressText}>{shortenAddress(route.from)}</span>
                </div>
                <div className={styles.routeArrow}>→</div>
                <div className={styles.address}>
                  <span className={styles.addressIcon}>🎯</span>
                  <span className={styles.addressText}>{shortenAddress(route.to)}</span>
                </div>
              </div>
            </div>

            <div className={styles.routeStats}>
              <div className={styles.stat}>
                <span className={styles.statIcon}>💰</span>
                <span className={styles.statText}>~£{route.averagePrice}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}>⏱️</span>
                <span className={styles.statText}>{calculateTimeSaved(route.count)}</span>
              </div>
              {route.isAutoFavorite && (
                <div className={styles.stat}>
                  <span className={styles.statIcon}>⚡</span>
                  <span className={styles.statText}>Auto-favorite</span>
                </div>
              )}
            </div>

            <div className={styles.routeActions}>
              <button
                className={styles.bookButton}
                onClick={() => handleBookRoute(route)}
              >
                🚗 Book This Route
              </button>
            </div>
          </div>
        ))}
      </div>

      {favorites.length === maxItems && (
        <button
          className={styles.viewAllButton}
          onClick={() => navigateToView('Assignments')}
        >
          View All Favorites →
        </button>
      )}
    </div>
  );
}