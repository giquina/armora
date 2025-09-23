import React, { useState, useEffect, useMemo } from 'react';
import { CPOProfile, CPOMatch, CPOSearchFilters, MatchingCriteria } from '../../types/cpo';
import { CPOCard } from './CPOCard';
import { SpecializationFilter } from './components/SpecializationTags';
import styles from './styles/cpo-profile.module.css';

interface CPOListViewProps {
  cpos: CPOProfile[];
  matches?: CPOMatch[];
  isLoading?: boolean;
  error?: string;
  onRequestOfficer: (cpoId: string) => void;
  onViewDetails: (cpoId: string) => void;
  onAddToFavorites: (cpoId: string) => void;
  favoriteCpoIds?: string[];
  matchingCriteria?: MatchingCriteria;
}

type SortOption = 'match_score' | 'rating' | 'experience' | 'response_time' | 'price';
type ViewMode = 'grid' | 'list';

export const CPOListView: React.FC<CPOListViewProps> = ({
  cpos,
  matches = [],
  isLoading = false,
  error,
  onRequestOfficer,
  onViewDetails,
  onAddToFavorites,
  favoriteCpoIds = [],
  matchingCriteria
}) => {
  const [filters, setFilters] = useState<CPOSearchFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('match_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Extract available filter options from CPO data
  const filterOptions = useMemo(() => {
    const specializations = new Set<string>();
    const languages = new Set<string>();
    const coverageAreas = new Set<string>();

    cpos.forEach(cpo => {
      cpo.specializations.forEach(spec => specializations.add(spec.type));
      cpo.languages.forEach(lang => languages.add(lang));
      cpo.coverageAreas.forEach(area => coverageAreas.add(area));
    });

    return {
      specializations: Array.from(specializations),
      languages: Array.from(languages),
      coverageAreas: Array.from(coverageAreas)
    };
  }, [cpos]);

  // Filter and sort CPOs
  const filteredAndSortedData = useMemo(() => {
    let filtered = cpos.filter(cpo => {
      // Availability filter
      if (filters.availability === 'available_now' && cpo.availability.status !== 'Available_Now') {
        return false;
      }
      if (filters.availability === 'available_today' &&
          !['Available_Now', 'Available_Soon'].includes(cpo.availability.status)) {
        return false;
      }

      // Specialization filter
      if (filters.specializations && filters.specializations.length > 0) {
        const cpoSpecializations = cpo.specializations.map(s => s.type);
        if (!filters.specializations.some(spec => cpoSpecializations.includes(spec as any))) {
          return false;
        }
      }

      // Experience level filter
      if (filters.experienceLevel) {
        const years = cpo.yearsOfExperience;
        switch (filters.experienceLevel) {
          case 'junior':
            if (years >= 5) return false;
            break;
          case 'experienced':
            if (years < 5 || years >= 10) return false;
            break;
          case 'senior':
            if (years < 10 || years >= 15) return false;
            break;
          case 'elite':
            if (years < 15) return false;
            break;
        }
      }

      // Rating filter
      if (filters.ratingMinimum && cpo.rating < filters.ratingMinimum) {
        return false;
      }

      // Price filter
      if (filters.maxHourlyRate) {
        const lowestRate = Math.min(
          cpo.hourlyRates.essential,
          cpo.hourlyRates.executive,
          cpo.hourlyRates.shadow
        );
        if (lowestRate > filters.maxHourlyRate) {
          return false;
        }
      }

      // Vehicle filter
      if (filters.hasVehicle && !cpo.vehicle) {
        return false;
      }

      // Language filter
      if (filters.languages && filters.languages.length > 0) {
        if (!filters.languages.some(lang => cpo.languages.includes(lang))) {
          return false;
        }
      }

      // Coverage area filter
      if (filters.coverageArea && !cpo.coverageAreas.includes(filters.coverageArea)) {
        return false;
      }

      // Background filters
      if (filters.militaryBackground && !cpo.militaryBackground.hasMilitaryService) {
        return false;
      }
      if (filters.policeBackground && !cpo.policeBackground.hasPoliceService) {
        return false;
      }

      // SIA level filter
      if (filters.siaLevel && cpo.sia.level !== filters.siaLevel) {
        return false;
      }

      return true;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'match_score':
          const matchA = matches.find(m => m.cpo.id === a.id);
          const matchB = matches.find(m => m.cpo.id === b.id);
          comparison = (matchB?.matchScore || 0) - (matchA?.matchScore || 0);
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'experience':
          comparison = b.yearsOfExperience - a.yearsOfExperience;
          break;
        case 'response_time':
          comparison = a.averageResponseTime - b.averageResponseTime;
          break;
        case 'price':
          const priceA = Math.min(a.hourlyRates.essential, a.hourlyRates.executive, a.hourlyRates.shadow);
          const priceB = Math.min(b.hourlyRates.essential, b.hourlyRates.executive, b.hourlyRates.shadow);
          comparison = priceA - priceB;
          break;
      }

      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [cpos, matches, filters, sortBy, sortOrder]);

  const handleFilterChange = (newFilters: Partial<CPOSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          <h3>Unable to Load Protection Officers</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cpoListContainer}>
      {/* Header */}
      <div className={styles.listHeader}>
        <div className={styles.headerTop}>
          <h2 className={styles.listTitle}>
            Available Protection Officers
            {filteredAndSortedData.length > 0 && (
              <span className={styles.resultCount}>
                ({filteredAndSortedData.length} officers)
              </span>
            )}
          </h2>

          <div className={styles.viewControls}>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className={styles.controlsBar}>
          <button
            className={`${styles.filterToggle} ${activeFilterCount > 0 ? styles.hasFilters : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            🔽 Filters
            {activeFilterCount > 0 && (
              <span className={styles.filterCount}>({activeFilterCount})</span>
            )}
          </button>

          <div className={styles.sortControls}>
            <label className={styles.sortLabel}>Sort by:</label>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              {matches.length > 0 && <option value="match_score">Best Match</option>}
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="response_time">Fastest Response</option>
              <option value="price">Lowest Price</option>
            </select>

            <button
              className={styles.sortOrderButton}
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              title={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button className={styles.clearFiltersButton} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterRow}>
            {/* Availability Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Availability</label>
              <select
                className={styles.filterSelect}
                value={filters.availability || ''}
                onChange={(e) => handleFilterChange({ availability: e.target.value as any })}
              >
                <option value="">All Officers</option>
                <option value="available_now">Available Now</option>
                <option value="available_today">Available Today</option>
                <option value="available_this_week">Available This Week</option>
              </select>
            </div>

            {/* Experience Level Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Experience</label>
              <select
                className={styles.filterSelect}
                value={filters.experienceLevel || ''}
                onChange={(e) => handleFilterChange({ experienceLevel: e.target.value as any })}
              >
                <option value="">All Levels</option>
                <option value="junior">Junior (Under 5 years)</option>
                <option value="experienced">Experienced (5-10 years)</option>
                <option value="senior">Senior (10-15 years)</option>
                <option value="elite">Elite (15+ years)</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Minimum Rating</label>
              <select
                className={styles.filterSelect}
                value={filters.ratingMinimum?.toString() || ''}
                onChange={(e) => handleFilterChange({ ratingMinimum: e.target.value ? parseFloat(e.target.value) : undefined })}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>

            {/* Max Price Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Max Price/Hour</label>
              <select
                className={styles.filterSelect}
                value={filters.maxHourlyRate?.toString() || ''}
                onChange={(e) => handleFilterChange({ maxHourlyRate: e.target.value ? parseInt(e.target.value) : undefined })}
              >
                <option value="">Any Price</option>
                <option value="75">Under £75</option>
                <option value="100">Under £100</option>
                <option value="150">Under £150</option>
                <option value="200">Under £200</option>
              </select>
            </div>
          </div>

          <div className={styles.filterRow}>
            {/* Additional Filters */}
            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.hasVehicle || false}
                  onChange={(e) => handleFilterChange({ hasVehicle: e.target.checked || undefined })}
                />
                Has Vehicle
              </label>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.militaryBackground || false}
                  onChange={(e) => handleFilterChange({ militaryBackground: e.target.checked || undefined })}
                />
                Military Background
              </label>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.policeBackground || false}
                  onChange={(e) => handleFilterChange({ policeBackground: e.target.checked || undefined })}
                />
                Police Background
              </label>
            </div>
          </div>

          {/* Specialization Filter */}
          <SpecializationFilter
            availableSpecializations={filterOptions.specializations}
            selectedSpecializations={filters.specializations || []}
            onSelectionChange={(selected) => handleFilterChange({ specializations: selected.length > 0 ? selected : undefined })}
          />
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Finding available Protection Officers...</p>
        </div>
      ) : filteredAndSortedData.length === 0 ? (
        <div className={styles.noResultsContainer}>
          <div className={styles.noResultsMessage}>
            <span className={styles.noResultsIcon}>🔍</span>
            <h3>No Protection Officers Found</h3>
            <p>Try adjusting your filters or check back later for availability.</p>
            {activeFilterCount > 0 && (
              <button className={styles.clearFiltersButton} onClick={clearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={`${styles.cpoGrid} ${styles[viewMode]}`}>
          {filteredAndSortedData.map((cpo) => {
            const match = matches.find(m => m.cpo.id === cpo.id);
            const isFavorite = favoriteCpoIds.includes(cpo.id);

            return (
              <CPOCard
                key={cpo.id}
                cpo={cpo}
                match={match}
                onRequestOfficer={onRequestOfficer}
                onViewDetails={onViewDetails}
                onAddToFavorites={onAddToFavorites}
                isFavorite={isFavorite}
                showMatchScore={!!match && matches.length > 0}
                compact={viewMode === 'list'}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};