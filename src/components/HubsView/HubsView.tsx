import { useState, useMemo, useCallback, useEffect } from 'react';
import { ProtectionHub, HubFilters } from './types';
import { mockProtectionHubs } from './mockData';
import { HubCard } from './HubCard';
import { QuickActions } from './QuickActions';
import { HubSearch } from './HubSearch';
import { HubSkeleton } from './HubSkeleton';
import { useApp } from '../../contexts/AppContext';
import styles from './hubs-view.module.css';

export function HubsView() {
  const { navigateToView } = useApp();
  const [hubs, setHubs] = useState<ProtectionHub[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHub, setSelectedHub] = useState<ProtectionHub | null>(null);

  // Mock loading delay and data fetch
  useEffect(() => {
    const loadHubs = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      setHubs(mockProtectionHubs);
      setIsLoading(false);
    };

    loadHubs();
  }, []);

  // Filter and search logic
  const filteredHubs = useMemo(() => {
    let filtered = [...hubs];

    // Apply search filter
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase();
      filtered = filtered.filter(hub =>
        hub.name.toLowerCase().includes(query) ||
        hub.location.address.toLowerCase().includes(query) ||
        hub.coverage.areas.some(area => area.toLowerCase().includes(query)) ||
        hub.specializations.some(spec => spec.toLowerCase().includes(query))
      );
    }

    // Apply quick filters
    switch (activeFilter) {
      case 'nearest':
        filtered = filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
      case 'available':
        filtered = filtered.filter(hub => hub.status === 'available');
        break;
      case 'favorites':
        filtered = filtered.filter(hub => hub.isFavorite);
        break;
      case 'all':
      default:
        // Sort by distance by default, then by rating
        filtered = filtered.sort((a, b) => {
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return b.ratings.overall - a.ratings.overall;
        });
        break;
    }

    return filtered;
  }, [hubs, searchValue, activeFilter]);

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleQuickFilter = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleSelectHub = useCallback((hub: ProtectionHub) => {
    if (hub.status === 'offline') return;

    setSelectedHub(hub);

    // In a real app, this would:
    // 1. Store selected hub in context/localStorage
    // 2. Navigate to protection assignment with hub pre-selected
    // 3. Update user preferences

    // For now, navigate back to protection assignment with hub selected
    // You could pass the hub ID via URL params or context
    navigateToView('protection-request');
  }, [navigateToView]);

  const handleToggleFavorite = useCallback((hubId: string) => {
    setHubs(prevHubs =>
      prevHubs.map(hub =>
        hub.id === hubId
          ? { ...hub, isFavorite: !hub.isFavorite }
          : hub
      )
    );
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setActiveFilter('all');
  }, []);

  // Get stats for quick info
  const hubStats = useMemo(() => {
    const available = hubs.filter(h => h.status === 'available').length;
    const totalOfficers = hubs.reduce((sum, h) => sum + h.officers.available, 0);
    const avgResponse = hubs.length > 0
      ? Math.round(hubs.reduce((sum, h) => sum + h.response.averageTime, 0) / hubs.length)
      : 0;

    return { available, totalOfficers, avgResponse };
  }, [hubs]);

  return (
    <div className={styles.hubsContainer}>
      {/* Header Section */}
      <div className={styles.hubsHeader}>
        <h1 className={styles.hubsTitle}>Select Your Protection Hub</h1>
        <p className={styles.hubsSubtitle}>
          Choose your preferred security operations center
        </p>

        {/* Quick Stats */}
        {!isLoading && hubs.length > 0 && (
          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{hubStats.available}</span>
              <span className={styles.statLabel}>Available</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{hubStats.totalOfficers}</span>
              <span className={styles.statLabel}>CPOs Ready</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{hubStats.avgResponse}min</span>
              <span className={styles.statLabel}>Avg Response</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!isLoading && (
        <QuickActions
          onNearestHubs={() => handleQuickFilter('nearest')}
          onAvailableOnly={() => handleQuickFilter('available')}
          onFavorites={() => handleQuickFilter('favorites')}
          onAll={() => handleQuickFilter('all')}
          activeFilter={activeFilter}
        />
      )}

      {/* Search & Filters */}
      {!isLoading && (
        <HubSearch
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
        />
      )}

      {/* Hubs Grid or Loading */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <HubSkeleton count={6} />
        </div>
      ) : filteredHubs.length > 0 ? (
        <div className={styles.hubsGrid}>
          {filteredHubs.map(hub => (
            <HubCard
              key={hub.id}
              hub={hub}
              onSelect={handleSelectHub}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🔍</div>
          <h3 className={styles.emptyStateTitle}>No Hubs Found</h3>
          <p className={styles.emptyStateDescription}>
            {searchValue || activeFilter !== 'all'
              ? "No protection hubs match your current search or filters."
              : "No protection hubs are currently available in this area."}
          </p>
          {(searchValue || activeFilter !== 'all') && (
            <button
              className={styles.emptyStateAction}
              onClick={handleClearSearch}
            >
              <span>🔄</span>
              Clear Search & Filters
            </button>
          )}
          <button
            className={styles.emptyStateAction}
            onClick={() => navigateToView('protection-request')}
          >
            <span>🛡️</span>
            Request Protection Anyway
          </button>
        </div>
      )}
    </div>
  );
}