import { useState } from 'react';
import styles from './hub-search.module.css';

interface HubSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function HubSearch({
  searchValue,
  onSearchChange,
  showFilters,
  onToggleFilters
}: HubSearchProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className={styles.searchSection}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search hubs by name, location, or service..."
            value={searchValue}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search protection hubs"
          />
          {searchValue && (
            <button
              className={styles.clearButton}
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <button
        className={styles.filterToggle}
        onClick={onToggleFilters}
        aria-expanded={showFilters}
        aria-label="Toggle filters"
      >
        <span className={styles.filterIcon}>⚙️</span>
        <span>Filters</span>
        <span className={`${styles.filterArrow} ${showFilters ? styles.open : ''}`}>
          ▼
        </span>
      </button>
    </div>
  );
}