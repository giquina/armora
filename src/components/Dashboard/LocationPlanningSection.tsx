import { useState, useEffect, useCallback, useRef } from 'react';
import { LocationSection } from '../../types';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import styles from './LocationPlanningSection.module.css';

interface LocationPlanningSectionProps {
  onLocationSet: (locationData: LocationSection) => void;
  isDisabled?: boolean;
  onCompletionScroll?: () => void; // Callback to scroll to next section
}

export function LocationPlanningSection({ onLocationSet, isDisabled = false, onCompletionScroll }: LocationPlanningSectionProps) {
  const [commencementAddress, setCommencementAddress] = useState('');
  const [secureDestinationAddress, setDropoffAddress] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isCalculatingJourney, setIsCalculatingJourney] = useState(false);
  const [journeyEstimate, setJourneyEstimate] = useState<LocationSection['journeyEstimate'] | null>(null);
  const [errors, setErrors] = useState<{ commencementPoint?: string; secureDestination?: string; geolocation?: string }>({});
  const [showProceedButton, setShowProceedButton] = useState(false);

  // Refs for auto-focus and scroll functionality
  const commencementPointInputRef = useRef<HTMLInputElement>(null);
  const secureDestinationInputRef = useRef<HTMLInputElement>(null);

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
      setCommencementAddress(mockAddress);
      setUseCurrentLocation(true);

      // Auto-focus to secureDestination field after commencementPoint is set
      setTimeout(() => {
        secureDestinationInputRef.current?.focus();
      }, 500);

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

  // FIXED: Stable calculateJourney function to prevent infinite loops
  const calculateJourney = useCallback(async () => {
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
        commencementLocation: {
          current: useCurrentLocation,
          address: commencementAddress.trim(),
          coordinates: useCurrentLocation ? [51.5074, -0.1278] : undefined // Mock London coords
        },
        secureDestinationLocation: {
          address: secureDestinationAddress.trim()
        },
        journeyEstimate: estimate
      };

      onLocationSet(locationData);

      // Show proceed button after journey is calculated
      setShowProceedButton(true);

    } catch (error) {
      console.error('Journey calculation failed:', error);
    } finally {
      setIsCalculatingJourney(false);
    }
  }, [commencementAddress, secureDestinationAddress, useCurrentLocation, onLocationSet]);

  // Calculate journey when both locations are set - FIXED: Include calculateJourney in dependencies
  useEffect(() => {
    if (commencementAddress.trim() && secureDestinationAddress.trim()) {
      calculateJourney();
    } else {
      setJourneyEstimate(null);
    }
  }, [commencementAddress, secureDestinationAddress, calculateJourney]);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Handle commencementPoint input changes with auto-focus
  const handleCommencementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommencementAddress(value);
    setUseCurrentLocation(false);
    setShowProceedButton(false);

    // Auto-focus to secureDestination when commencementPoint is filled
    if (value.trim().length > 10 && !secureDestinationAddress.trim()) {
      setTimeout(() => {
        secureDestinationInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle secureDestination input changes with auto-scroll
  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDropoffAddress(value);
    setShowProceedButton(false);

    // Auto-scroll to services when secureDestination is entered and we have both locations
    if (value.trim().length > 10 && commencementAddress.trim()) {
      setTimeout(() => {
        // Scroll to service selection section
        const serviceSection = document.getElementById('service-selection');
        if (serviceSection) {
          serviceSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 1500); // Wait a bit for journey calculation to start
    }
  };

  // Handle Enter key navigation
  const handleKeyPress = (e: React.KeyboardEvent, field: 'commencementPoint' | 'secureDestination') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'commencementPoint' && commencementAddress.trim()) {
        secureDestinationInputRef.current?.focus();
      } else if (field === 'secureDestination' && secureDestinationAddress.trim() && commencementAddress.trim()) {
        handleProceedToServices();
      }
    }
  };

  // Handle proceed to services button click
  const handleProceedToServices = () => {
    if (onCompletionScroll) {
      onCompletionScroll();
    }
  };

  // Validation is handled inline during journey calculation

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Where would you like to go?</h2>
        <p className={styles.subtitle}>Plan Your Route • Quick Assignment</p>
      </div>

      <div className={styles.locationForm}>
        {/* commencementPoint Location */}
        <div className={styles.inputGroup}>
          <label htmlFor="commencement-point-location" className={styles.label}>
            <span className={styles.icon}>📍</span>
            commencementPoint Location
          </label>
          <div className={styles.inputContainer}>
            <input
              ref={commencementPointInputRef}
              id="commencement-point-location"
              type="text"
              value={commencementAddress}
              onChange={handleCommencementChange}
              onKeyPress={(e) => handleKeyPress(e, 'commencementPoint')}
              placeholder="Enter commencementPoint address or use current location"
              className={`${styles.input} ${errors.commencementPoint ? styles.inputError : ''} ${commencementAddress.trim() ? styles.inputCompleted : ''}`}
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
          {errors.commencementPoint && (
            <div className={styles.errorMessage}>{errors.commencementPoint}</div>
          )}
          {errors.geolocation && (
            <div className={styles.errorMessage}>{errors.geolocation}</div>
          )}
        </div>

        {/* Destination Location */}
        <div className={styles.inputGroup}>
          <label htmlFor="Secure Destination-location" className={styles.label}>
            <span className={styles.icon}>🏁</span>
            Destination
          </label>
          <input
            ref={secureDestinationInputRef}
            id="secure-destination-location"
            type="text"
            value={secureDestinationAddress}
            onChange={handleDropoffChange}
            onKeyPress={(e) => handleKeyPress(e, 'secureDestination')}
            placeholder="Enter secureDestination address"
            className={`${styles.input} ${errors.secureDestination ? styles.inputError : ''} ${secureDestinationAddress.trim() ? styles.inputCompleted : ''}`}
            disabled={isDisabled}
          />
          {errors.secureDestination && (
            <div className={styles.errorMessage}>{errors.secureDestination}</div>
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

        {/* Proceed Button - Show when journey is calculated */}
        {showProceedButton && journeyEstimate && !isCalculatingJourney && (
          <div className={styles.proceedSection}>
            <button
              className={styles.proceedButton}
              onClick={handleProceedToServices}
              disabled={isDisabled}
            >
              <span className={styles.proceedIcon}>🎯</span>
              Find Available Services
              <span className={styles.proceedArrow}>→</span>
            </button>
            <p className={styles.proceedHint}>
              Press Enter or click to continue to service selection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}