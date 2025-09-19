import React, { useState, useEffect } from 'react';
import { ServiceLevel, LocationData } from '../../types';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import styles from './LocationPicker.module.css';

interface LocationPickerProps {
  selectedService: ServiceLevel;
  onLocationConfirmed: (locationData: LocationData & { estimatedCost: number }) => void;
  onBack: () => void;
  user: any;
}

// Popular secure venues data
const POPULAR_VENUES = [
  { name: 'Heathrow Terminal 5', address: 'Heathrow Airport, Terminal 5, Longford TW6 2GA' },
  { name: 'The Shard', address: '32 London Bridge St, London SE1 9SG' },
  { name: 'Canary Wharf', address: 'Canary Wharf, London E14 5AB' },
  { name: 'Buckingham Palace', address: 'Westminster, London SW1A 1AA' },
  { name: 'Houses of Parliament', address: 'Westminster, London SW1A 0AA' },
  { name: 'The Ritz London', address: '150 Piccadilly, St. James\'s, London W1J 9BR' }
];

export function LocationPicker({ selectedService, onLocationConfirmed, onBack, user }: LocationPickerProps) {
  const [pickup, setPickup] = useState('📍 Current Location');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [protectionHours, setProtectionHours] = useState<number>(2);
  const [errors, setErrors] = useState<{ destination?: string }>({});
  const [showVenues, setShowVenues] = useState(false);
  const [recentDestinations] = useState<string[]>([
    'The Dorchester Hotel, London',
    'Claridge\'s Hotel, London',
    'The Savoy Hotel, London'
  ]);

  // Use current location by default
  const handleUseCurrentLocation = () => {
    setPickup('📍 Current Location');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app, reverse geocode to get address
          setPickup('📍 Current Location (Confirmed)');
        },
        (error) => {
          console.warn('Location access denied, using default');
        }
      );
    }
  };

  // Handle venue selection
  const handleVenueSelect = (venue: { name: string; address: string }) => {
    setDestination(venue.address);
    setShowVenues(false);
  };

  // Real-time calculation with immediate feedback
  useEffect(() => {
    if (pickup && destination && destination.length > 3) {
      // Immediate mock calculation for responsive feedback
      const mockDistance = Math.floor(Math.random() * 20) + 5; // 5-25 miles
      const mockDuration = Math.floor(mockDistance / 12 * 60); // Rough time estimate in minutes
      const calculatedHours = Math.max(2, Math.ceil(mockDuration / 60)); // Minimum 2 hours

      setEstimatedDistance(mockDistance);
      setEstimatedDuration(mockDuration);
      setProtectionHours(calculatedHours);
    } else {
      setEstimatedDistance(0);
      setEstimatedDuration(0);
      setProtectionHours(2);
    }
  }, [pickup, destination]);

  const validateInputs = () => {
    const newErrors: { destination?: string } = {};

    if (!destination.trim()) {
      newErrors.destination = 'Destination is required for your protection detail';
    }

    if (pickup.trim() && destination.trim() && pickup.toLowerCase() === destination.toLowerCase()) {
      newErrors.destination = 'Destination must be different from pickup location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCost = () => {
    const hasReward = user?.hasUnlockedReward && user?.userType !== 'guest';
    const baseHourlyRate = hasReward ? selectedService.hourlyRate * 0.5 : selectedService.hourlyRate;
    const totalCost = baseHourlyRate * protectionHours;
    return Math.round(totalCost);
  };

  const handleContinue = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const locationData: LocationData = {
      pickup: pickup.trim(),
      destination: destination.trim(),
      estimatedDistance,
      estimatedDuration
    };

    const estimatedCost = calculateCost();

    onLocationConfirmed({
      ...locationData,
      estimatedCost,
    });

    setIsLoading(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      {/* Header with back button and step indicator */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack} aria-label="Go back">
          ←
        </button>
        <div className={styles.stepIndicator}>
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepText}>of 3</span>
        </div>
      </div>

      <div className={styles.pageTitle}>
        <h1>Where to?</h1>
        <p>Set your pickup and destination</p>
      </div>

      <div className={styles.locationForm}>
        {/* Starting Point Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>STARTING POINT</h2>
          <div className={styles.pickupContainer}>
            <div className={styles.currentLocationCard}>
              <div className={styles.locationIcon}>📍</div>
              <div className={styles.locationInfo}>
                <div className={styles.locationName}>Current Location</div>
                <div className={styles.locationSubtext}>We'll use your GPS location</div>
              </div>
              <button
                className={styles.confirmButton}
                onClick={handleUseCurrentLocation}
                aria-label="Confirm current location"
              >
                ✓
              </button>
            </div>
          </div>
        </div>

        {/* Destination Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>DESTINATION</h2>
          <div className={styles.destinationContainer}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setShowVenues(true)}
                placeholder="Search destination..."
                className={`${styles.searchInput} ${errors.destination ? styles.inputError : ''}`}
                autoComplete="off"
              />
              <div className={styles.searchIcon}>🔍</div>
            </div>

            {errors.destination && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {errors.destination}
              </div>
            )}

            {/* Recent Destinations */}
            {recentDestinations.length > 0 && (
              <div className={styles.recentSection}>
                <h3 className={styles.recentTitle}>Recent</h3>
                {recentDestinations.map((location, index) => (
                  <button
                    key={index}
                    className={styles.locationButton}
                    onClick={() => setDestination(location)}
                  >
                    <span className={styles.locationButtonIcon}>🕒</span>
                    <span className={styles.locationButtonText}>{location}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Venues */}
            <div className={styles.venuesSection}>
              <h3 className={styles.venuesTitle}>Popular Secure Venues</h3>
              <div className={styles.venuesList}>
                {POPULAR_VENUES.map((venue, index) => (
                  <button
                    key={index}
                    className={styles.venueButton}
                    onClick={() => handleVenueSelect(venue)}
                  >
                    <span className={styles.venueIcon}>🏢</span>
                    <div className={styles.venueInfo}>
                      <div className={styles.venueName}>{venue.name}</div>
                      <div className={styles.venueAddress}>{venue.address}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Feedback */}
        {pickup && destination && estimatedDistance > 0 && (
          <div className={styles.estimateCard}>
            <div className={styles.estimateRow}>
              <span className={styles.estimateLabel}>Distance</span>
              <span className={styles.estimateValue}>{estimatedDistance} miles</span>
            </div>
            <div className={styles.estimateRow}>
              <span className={styles.estimateLabel}>Journey Time</span>
              <span className={styles.estimateValue}>{formatDuration(estimatedDuration)}</span>
            </div>
            <div className={styles.estimateRow}>
              <span className={styles.estimateLabel}>Protection Hours</span>
              <span className={styles.estimateValue}>{protectionHours}h minimum</span>
            </div>
            <div className={`${styles.estimateRow} ${styles.costRow}`}>
              <span className={styles.costLabel}>Total Cost</span>
              <span className={styles.costValue}>{formatCurrency(calculateCost())}</span>
            </div>
            {user?.hasUnlockedReward && user?.userType !== 'guest' && (
              <div className={styles.discountBadge}>
                50% First Protection Discount Applied
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={!destination || isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size="small" variant="light" text="Processing..." inline />
          ) : (
            `Continue • ${destination ? formatCurrency(calculateCost()) : 'Enter destination'}`
          )}
        </button>

        <div className={styles.protectionNote}>
          <span className={styles.shieldIcon}>🛡️</span>
          <span>2-hour minimum • SIA licensed CPO • Real-time tracking</span>
        </div>
      </div>
    </div>
  );
}