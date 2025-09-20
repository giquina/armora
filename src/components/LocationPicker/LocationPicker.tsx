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

const LOCATION_DATA = {
  airport: [
    { name: 'London Heathrow Airport', address: 'Heathrow Airport, Hounslow TW6 1AP, UK', distance: '15 miles' },
    { name: 'London Gatwick Airport', address: 'Gatwick Airport, Horley RH6 0NP, UK', distance: '28 miles' },
    { name: 'London City Airport', address: 'London City Airport, London E16 2PX, UK', distance: '8 miles' },
    { name: 'London Stansted Airport', address: 'Stansted Airport, Stansted CM24 1QW, UK', distance: '31 miles' },
    { name: 'London Luton Airport', address: 'Luton Airport, Luton LU2 9LY, UK', distance: '34 miles' }
  ],
  retail: [
    { name: 'Harrods', address: '87-135 Brompton Rd, London SW1X 7XL, UK', distance: '12 miles' },
    { name: 'Selfridges Oxford Street', address: '400 Oxford St, London W1A 1AB, UK', distance: '10 miles' },
    { name: 'Westfield Stratford City', address: 'Montfichet Rd, London E20 1EJ, UK', distance: '18 miles' },
    { name: 'Westfield White City', address: 'Ariel Way, London W12 7GF, UK', distance: '14 miles' },
    { name: 'Covent Garden Market', address: 'Covent Garden, London WC2E 8RF, UK', distance: '9 miles' }
  ],
  medical: [
    { name: 'Guy\'s Hospital', address: 'Great Maze Pond, London SE1 9RT, UK', distance: '7 miles' },
    { name: 'St Thomas\' Hospital', address: 'Westminster Bridge Rd, London SE1 7EH, UK', distance: '8 miles' },
    { name: 'King\'s College Hospital', address: 'Denmark Hill, London SE5 9RS, UK', distance: '11 miles' },
    { name: 'The London Clinic', address: '20 Devonshire Pl, London W1G 6BW, UK', distance: '9 miles' },
    { name: 'Royal Free Hospital', address: 'Pond St, London NW3 2QG, UK', distance: '13 miles' }
  ],
  business: [
    { name: 'Canary Wharf', address: 'Canary Wharf, London E14 5AB, UK', distance: '16 miles' },
    { name: 'The Shard', address: '32 London Bridge St, London SE1 9SG, UK', distance: '6 miles' },
    { name: 'City of London', address: 'City of London, London EC2V 7HH, UK', distance: '8 miles' },
    { name: 'Westminster', address: 'Westminster, London SW1A 0AA, UK', distance: '7 miles' },
    { name: 'King\'s Cross Business District', address: 'King\'s Cross, London N1C 4AH, UK', distance: '5 miles' }
  ]
};

// Commented out as we now use Recent locations instead of Suggested
// const ALL_SUGGESTED = Object.values(LOCATION_DATA).flat();

export function LocationPicker({ isOpen, onClose, onLocationSelect }: LocationPickerProps) {
  const { navigateToView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<RecentPlace[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting location...');
  const [isEditingFromLocation, setIsEditingFromLocation] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Focus management for accessibility
      const previouslyFocusedElement = document.activeElement as HTMLElement;

      // Focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);

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

      // Return focus to previously focused element when modal closes
      return () => {
        if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
          previouslyFocusedElement.focus();
        }
      };
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
    }

    // Cleanup function to restore body scroll if component unmounts
    return () => {
      document.body.style.overflow = '';
    };
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

    // Tab navigation focus trap
    if (e.key === 'Tab') {
      const focusableElements = overlayRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab (backward)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab (forward)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
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
          <button className={styles.backButton} onClick={onClose} aria-label="Close location picker">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className={styles.title}>Arrange Protection Service</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>


        {/* FROM/TO Location Section */}
        <div className={styles.locationSection}>
          {/* FROM Location */}
          <div className={styles.locationItem}>
            <div className={styles.locationIcon}>
              <div className={styles.currentLocationDot}></div>
            </div>
            <div className={styles.locationText}>
              <span className={styles.locationLabel}>FROM</span>
              <span className={styles.locationAddress}>{currentLocation}</span>
            </div>
            {!isEditingFromLocation && (
              <button
                className={styles.editButton}
                onClick={() => setIsEditingFromLocation(true)}
              >
                Edit
              </button>
            )}
          </div>

          {isEditingFromLocation && (
            <div className={styles.locationItem}>
              <div className={styles.locationIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <div className={styles.locationText}>
                <input
                  className={styles.fromLocationInput}
                  type="text"
                  placeholder="Enter pickup location"
                  defaultValue={currentLocation}
                  onBlur={() => setIsEditingFromLocation(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingFromLocation(false);
                    }
                  }}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* TO Location */}
          <div className={styles.locationItem}>
            <div className={styles.locationIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className={styles.locationText}>
              <span className={styles.locationLabel}>TO</span>
              <div className={styles.searchInputContainer}>
                <input
                  ref={searchInputRef}
                  className={styles.toLocationInput}
                  type="text"
                  placeholder="Where do you require protection?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
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
                      {place.type === 'home' ? 'Secure Residence' : 'Executive Office'}
                    </span>
                    <span className={styles.placeAddress}>{place.address}</span>
                    <span className={styles.usageCount}>
                      {place.type === 'home' ? 'Used 12 times' : 'Used 8 times'}
                    </span>
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
                  <span className={styles.placeName}>Add secure residence</span>
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
                  <span className={styles.placeName}>Add primary office</span>
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

          {/* Recent Destinations */}
          {recentPlaces.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Recent</h3>
              <p className={styles.sectionSubtext}>Your most recent locations</p>
              {recentPlaces.slice(0, 5).map((place, index) => (
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
                    <span className={styles.placeName}>{place.address.split(',')[0]}</span>
                    <span className={styles.placeAddress}>{place.address}</span>
                    <span className={styles.placeTime}>
                      {new Date(place.timestamp).toLocaleDateString('en-GB', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

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

          {/* Protection Service Banner - How It Works Process */}
          <div className={styles.protectionBanner}>
            <div className={styles.bannerIcon}>🛡️</div>
            <h3 className={styles.bannerTitle}>How It Works - Simple & Secure</h3>

            <div className={styles.processSteps}>
              <div className={styles.stepText}>1. Select your protection level</div>
              <div className={styles.stepText}>2. Enter your destination</div>
              <div className={styles.stepText}>3. Your officer arrives in 15-20 mins</div>
            </div>

            <div className={styles.bannerFeatures}>
              <span>✓ Secure vehicle included</span>
              <span className={styles.dot}>•</span>
              <span>✓ Real-time tracking</span>
              <span className={styles.dot}>•</span>
              <span>✓ Fixed transparent pricing</span>
            </div>
            <div className={styles.bannerRating}>
              ⭐ 4.9 rating from 2,847 protected clients
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}