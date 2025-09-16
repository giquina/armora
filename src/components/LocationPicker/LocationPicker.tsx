import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './LocationPicker.module.css';

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { address: string; coordinates?: { lat: number; lng: number } }) => void;
}

interface SavedPlace {
  type: 'home' | 'work';
  address: string;
  coordinates?: { lat: number; lng: number };
}

interface RecentPlace {
  address: string;
  timestamp: number;
  coordinates?: { lat: number; lng: number };
}

const SUGGESTED_DESTINATIONS = [
  { name: 'London Heathrow Airport', address: 'Heathrow Airport, Hounslow TW6 1AP, UK', type: 'airport' },
  { name: 'London Gatwick Airport', address: 'Gatwick Airport, Horley RH6 0NP, UK', type: 'airport' },
  { name: 'King\'s Cross Station', address: 'King\'s Cross, London N1C 4AH, UK', type: 'transport' },
  { name: 'Westminster', address: 'Westminster, London SW1A 0AA, UK', type: 'government' },
  { name: 'Canary Wharf', address: 'Canary Wharf, London E14 5AB, UK', type: 'business' },
  { name: 'The Shard', address: '32 London Bridge St, London SE1 9SG, UK', type: 'landmark' }
];

export function LocationPicker({ isOpen, onClose, onLocationSelect }: LocationPickerProps) {
  const { navigateToView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<RecentPlace[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting location...');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      // Load saved places
      const homeAddress = localStorage.getItem('armora_home_address');
      const workAddress = localStorage.getItem('armora_work_address');
      const places: SavedPlace[] = [];

      if (homeAddress) {
        places.push({ type: 'home', address: homeAddress });
      }
      if (workAddress) {
        places.push({ type: 'work', address: workAddress });
      }
      setSavedPlaces(places);

      // Load recent places
      const recentData = localStorage.getItem('armora_recent_places');
      if (recentData) {
        try {
          const parsed = JSON.parse(recentData) as RecentPlace[];
          setRecentPlaces(parsed.slice(0, 5)); // Show only last 5
        } catch (error) {
          console.error('Error loading recent places:', error);
        }
      }

      // Detect current location
      detectCurrentLocation();
    }
  }, [isOpen]);

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we'd reverse geocode this
          setCurrentLocation('Current location detected');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setCurrentLocation('Unable to detect location');
        }
      );
    } else {
      setCurrentLocation('Location not available');
    }
  };

  const handleLocationSelect = (address: string, coordinates?: { lat: number; lng: number }) => {
    // Save to recent places
    const newPlace: RecentPlace = {
      address,
      timestamp: Date.now(),
      coordinates
    };

    const updatedRecents = [newPlace, ...recentPlaces.filter(p => p.address !== address)].slice(0, 10);
    setRecentPlaces(updatedRecents);
    localStorage.setItem('armora_recent_places', JSON.stringify(updatedRecents));

    // Call the selection handler
    onLocationSelect({ address, coordinates });

    // Navigate to service selection
    navigateToView('booking');

    // Close the overlay
    onClose();
  };

  const handleAddSavedPlace = (type: 'home' | 'work') => {
    // For now, just close and let user set it up later
    // In a real app, we'd show a form to add the address
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h2 className={styles.title}>Plan your trip</h2>
        </div>

        {/* Current Location */}
        <div className={styles.locationSection}>
          <div className={styles.locationItem}>
            <div className={styles.locationIcon}>
              <div className={styles.currentLocationDot}></div>
            </div>
            <div className={styles.locationText}>
              <span className={styles.locationLabel}>Current location</span>
              <span className={styles.locationAddress}>{currentLocation}</span>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className={styles.searchSection}>
          <div className={styles.searchInputContainer}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={searchInputRef}
              className={styles.searchInput}
              type="text"
              placeholder="Where to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Saved Places */}
          {savedPlaces.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Saved</h3>
              {savedPlaces.map((place) => (
                <button
                  key={place.type}
                  className={styles.placeItem}
                  onClick={() => handleLocationSelect(place.address, place.coordinates)}
                >
                  <div className={styles.placeIcon}>
                    {place.type === 'home' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    )}
                  </div>
                  <div className={styles.placeContent}>
                    <span className={styles.placeName}>
                      {place.type === 'home' ? 'Home' : 'Work'}
                    </span>
                    <span className={styles.placeAddress}>{place.address}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Add Saved Places */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Saved</h3>
            {!savedPlaces.find(p => p.type === 'home') && (
              <button
                className={styles.placeItem}
                onClick={() => handleAddSavedPlace('home')}
              >
                <div className={styles.placeIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </div>
                <div className={styles.placeContent}>
                  <span className={styles.placeName}>Add home</span>
                </div>
                <div className={styles.addIcon}>+</div>
              </button>
            )}
            {!savedPlaces.find(p => p.type === 'work') && (
              <button
                className={styles.placeItem}
                onClick={() => handleAddSavedPlace('work')}
              >
                <div className={styles.placeIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div className={styles.placeContent}>
                  <span className={styles.placeName}>Add work</span>
                </div>
                <div className={styles.addIcon}>+</div>
              </button>
            )}
          </div>

          {/* Recent Places */}
          {recentPlaces.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Recent</h3>
              {recentPlaces.map((place, index) => (
                <button
                  key={`${place.address}-${place.timestamp}`}
                  className={styles.placeItem}
                  onClick={() => handleLocationSelect(place.address, place.coordinates)}
                >
                  <div className={styles.placeIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                  <div className={styles.placeContent}>
                    <span className={styles.placeName}>{place.address}</span>
                    <span className={styles.placeTime}>
                      {new Date(place.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Suggested Destinations */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Suggested</h3>
            {SUGGESTED_DESTINATIONS.map((place) => (
              <button
                key={place.address}
                className={styles.placeItem}
                onClick={() => handleLocationSelect(place.address)}
              >
                <div className={styles.placeIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className={styles.placeContent}>
                  <span className={styles.placeName}>{place.name}</span>
                  <span className={styles.placeAddress}>{place.address}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Set Location on Map */}
          <div className={styles.section}>
            <button
              className={styles.placeItem}
              onClick={() => {
                // For now, just close - in real app would open map picker
                onClose();
              }}
            >
              <div className={styles.placeIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className={styles.placeContent}>
                <span className={styles.placeName}>Set location on map</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}