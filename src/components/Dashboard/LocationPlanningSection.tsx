import React, { useState, useEffect } from 'react';
import { LocationSection } from '../../types';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import styles from './LocationPlanningSection.module.css';

interface LocationPlanningSectionProps {
  onLocationSet: (locationData: LocationSection) => void;
  isDisabled?: boolean;
}

export function LocationPlanningSection({ onLocationSet, isDisabled = false }: LocationPlanningSectionProps) {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isCalculatingJourney, setIsCalculatingJourney] = useState(false);
  const [journeyEstimate, setJourneyEstimate] = useState<LocationSection['journeyEstimate'] | null>(null);
  const [errors, setErrors] = useState<{ pickup?: string; dropoff?: string; geolocation?: string }>({});

  // Handle current location request
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setErrors({ ...errors, geolocation: 'Geolocation not supported by this browser' });
      return;
    }

    setIsLoadingLocation(true);
    setErrors({ ...errors, geolocation: undefined });

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Mock reverse geocoding - in real implementation, use Google Maps Geocoding API
      const mockAddress = await reverseGeocode(latitude, longitude);
      setPickupAddress(mockAddress);
      setUseCurrentLocation(true);

    } catch (error) {
      let errorMessage = 'Unable to get your location';
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied - please enter address manually';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable - please enter address manually';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out - please enter address manually';
            break;
        }
      }
      setErrors({ ...errors, geolocation: errorMessage });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Mock reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock address based on rough London coordinates
    const mockAddresses = [
      'Central London, London W1',
      'Canary Wharf, London E14',
      'Westminster, London SW1',
      'Kings Cross, London N1',
      'Shoreditch, London E1'
    ];

    return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
  };

  // Calculate journey when both locations are set
  useEffect(() => {
    if (pickupAddress.trim() && dropoffAddress.trim()) {
      calculateJourney();
    } else {
      setJourneyEstimate(null);
    }
  }, [pickupAddress, dropoffAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateJourney = async () => {
    setIsCalculatingJourney(true);

    try {
      // Simulate API call to calculate route
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock journey calculation
      const mockDistance = Math.floor(Math.random() * 25) + 5; // 5-30 miles
      const mockDuration = Math.floor(mockDistance / 15 * 60); // Rough time estimate in minutes
      const mockBasePrice = Math.floor(mockDistance * 2.5) + 15; // Base price calculation

      const estimate = {
        distance: `${mockDistance} miles`,
        duration: formatDuration(mockDuration),
        basePrice: mockBasePrice
      };

      setJourneyEstimate(estimate);

      // Notify parent component with location data
      const locationData: LocationSection = {
        pickupLocation: {
          current: useCurrentLocation,
          address: pickupAddress.trim(),
          coordinates: useCurrentLocation ? [51.5074, -0.1278] : undefined // Mock London coords
        },
        dropoffLocation: {
          address: dropoffAddress.trim()
        },
        journeyEstimate: estimate
      };

      onLocationSet(locationData);

    } catch (error) {
      console.error('Journey calculation failed:', error);
    } finally {
      setIsCalculatingJourney(false);
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Validation is handled inline during journey calculation

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Where would you like to go?</h2>
        <p className={styles.subtitle}>Step 1 of 3: Choose Your Route</p>
      </div>

      <div className={styles.locationForm}>
        {/* Pickup Location */}
        <div className={styles.inputGroup}>
          <label htmlFor="pickup-location" className={styles.label}>
            <span className={styles.icon}>📍</span>
            Pickup Location
          </label>
          <div className={styles.inputContainer}>
            <input
              id="pickup-location"
              type="text"
              value={pickupAddress}
              onChange={(e) => {
                setPickupAddress(e.target.value);
                setUseCurrentLocation(false);
              }}
              placeholder="Enter pickup address or use current location"
              className={`${styles.input} ${errors.pickup ? styles.inputError : ''}`}
              disabled={isDisabled || isLoadingLocation}
            />
            <button
              type="button"
              className={styles.currentLocationButton}
              onClick={handleUseCurrentLocation}
              disabled={isDisabled || isLoadingLocation}
              title="Use current location"
            >
              {isLoadingLocation ? (
                <LoadingSpinner size="small" variant="primary" inline />
              ) : (
                '📍'
              )}
            </button>
          </div>
          {errors.pickup && (
            <div className={styles.errorMessage}>{errors.pickup}</div>
          )}
          {errors.geolocation && (
            <div className={styles.errorMessage}>{errors.geolocation}</div>
          )}
        </div>

        {/* Drop-off Location */}
        <div className={styles.inputGroup}>
          <label htmlFor="dropoff-location" className={styles.label}>
            <span className={styles.icon}>🏁</span>
            Destination
          </label>
          <input
            id="dropoff-location"
            type="text"
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            placeholder="Enter destination address"
            className={`${styles.input} ${errors.dropoff ? styles.inputError : ''}`}
            disabled={isDisabled}
          />
          {errors.dropoff && (
            <div className={styles.errorMessage}>{errors.dropoff}</div>
          )}
        </div>

        {/* Journey Estimate */}
        {(isCalculatingJourney || journeyEstimate) && (
          <div className={styles.estimateSection}>
            <h3 className={styles.estimateTitle}>Journey Estimate</h3>
            {isCalculatingJourney ? (
              <div className={styles.calculatingIndicator}>
                <LoadingSpinner size="small" variant="primary" text="Calculating route..." inline />
              </div>
            ) : journeyEstimate ? (
              <div className={styles.estimateDetails}>
                <div className={styles.estimateItem}>
                  <span className={styles.estimateLabel}>Distance:</span>
                  <span className={styles.estimateValue}>{journeyEstimate.distance}</span>
                </div>
                <div className={styles.estimateItem}>
                  <span className={styles.estimateLabel}>Duration:</span>
                  <span className={styles.estimateValue}>{journeyEstimate.duration}</span>
                </div>
                <div className={styles.estimateItem}>
                  <span className={styles.estimateLabel}>Base Price:</span>
                  <span className={styles.estimatePrice}>£{journeyEstimate.basePrice}</span>
                </div>
                <div className={styles.estimateNote}>
                  Final price depends on your security level choice
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}