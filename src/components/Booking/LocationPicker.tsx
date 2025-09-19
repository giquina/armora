import React, { useState, useEffect } from 'react';
import { ServiceLevel, LocationData } from '../../types';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { LocationSkeletonLoader } from '../UI/SkeletonLoader';
import { BookingProgressIndicator } from '../UI/ProgressIndicator';
import { CompactSchedulingPicker } from '../UI/CompactSchedulingPicker';
import styles from './LocationPicker.module.css';

interface LocationPickerProps {
  selectedService: ServiceLevel;
  onLocationConfirmed: (locationData: LocationData & { estimatedCost: number }) => void;
  onBack: () => void;
  user: any;
}

export function LocationPicker({ selectedService, onLocationConfirmed, onBack, user }: LocationPickerProps) {
  const [pickup, setPickup] = useState('📍 Current Location');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [errors, setErrors] = useState<{ pickup?: string; destination?: string }>({});
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | null>(null);
  const [savedLocations, setSavedLocations] = useState<{home?: string; work?: string; favorites?: string[]}>({});
  const [recentLocations, setRecentLocations] = useState<string[]>([]);

  // Load saved and recent locations on mount
  useEffect(() => {
    // Load saved locations from localStorage
    const saved = localStorage.getItem('armora_saved_locations');
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }

    // Load recent locations from localStorage
    const recent = localStorage.getItem('armora_recent_locations');
    if (recent) {
      setRecentLocations(JSON.parse(recent).slice(0, 5)); // Keep last 5
    }
  }, []);

  // Save recent location when destination is set
  const saveRecentLocation = (location: string) => {
    if (!location || location === '📍 Current Location') return;

    const updated = [location, ...recentLocations.filter(l => l !== location)].slice(0, 10);
    setRecentLocations(updated);
    localStorage.setItem('armora_recent_locations', JSON.stringify(updated));
  };

  // Handle quick location selection
  const handleQuickLocationSelect = (location: string) => {
    if (activeField === 'pickup') {
      setPickup(location);
    } else if (activeField === 'destination') {
      setDestination(location);
      saveRecentLocation(location);
    }
    setActiveField(null);
  };

  // Mock distance/duration calculation with loading state
  const calculateEstimate = async (pickup: string, destination: string) => {
    if (!pickup || !destination) {
      setEstimatedDistance(0);
      setEstimatedDuration(0);
      return;
    }

    setIsCalculatingRoute(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock calculation - in real app this would use Google Maps API or similar
    const mockDistance = Math.floor(Math.random() * 20) + 5; // 5-25 miles
    const mockDuration = Math.floor(mockDistance / 12 * 60); // Rough time estimate in minutes
    
    setEstimatedDistance(mockDistance);
    setEstimatedDuration(mockDuration);
    setIsCalculatingRoute(false);
  };

  useEffect(() => {
    if (pickup && destination) {
      const debounceTimer = setTimeout(() => {
        calculateEstimate(pickup, destination);
      }, 500);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [pickup, destination]);

  const validateInputs = () => {
    const newErrors: { pickup?: string; destination?: string } = {};
    
    if (!pickup.trim()) {
      newErrors.pickup = 'Pickup location is required';
    }
    
    if (!destination.trim()) {
      newErrors.destination = 'Destination is required';
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
    const minimumCharge = 1; // Minimum 1 hour
    const estimatedHours = Math.max(minimumCharge, estimatedDuration / 60);
    return Math.round(baseHourlyRate * estimatedHours);
  };

  const handleContinue = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const locationData: LocationData = {
      pickup: pickup.trim(),
      destination: destination.trim(),
      estimatedDistance,
      estimatedDuration,
      scheduledDateTime: isScheduled ? scheduledDateTime : undefined,
      isScheduled
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

  return (
    <div className={styles.container}>
      {/* Progress Indicator - Clean design without redundant header */}
      <BookingProgressIndicator currentStep="location-picker" />

      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <h1 className={styles.title}>Route Planning</h1>
        <p className={styles.subtitle}>
          Configure pickup and destination for your {selectedService.name}
        </p>
      </div>

      <div className={styles.selectedService}>
        <div className={styles.serviceInfo}>
          <h3>{selectedService.name}</h3>
          <p>{selectedService.tagline}</p>
        </div>
        <div className={styles.servicePrice}>
          {user?.hasUnlockedReward && user?.userType !== 'guest' ? (
            <>
              <span className={styles.discountedPrice}>£{(selectedService.hourlyRate * 0.5).toFixed(2)}</span>
              <span className={styles.originalPrice}>£{selectedService.hourlyRate.toFixed(2)}</span>
            </>
          ) : (
            <span className={styles.price}>£{selectedService.hourlyRate.toFixed(2)}</span>
          )}
          <span className={styles.perHour}>/hr</span>
        </div>
      </div>

      <div className={styles.locationForm}>
        {/* Quick Locations Section */}
        {(savedLocations.home || savedLocations.work || recentLocations.length > 0) && (
          <div className={styles.quickLocationsSection}>
            <h3 className={styles.quickLocationsTitle}>Quick Locations</h3>
            <div className={styles.quickLocationsList}>
              {savedLocations.home && (
                <button
                  className={styles.quickLocationButton}
                  onClick={() => handleQuickLocationSelect(savedLocations.home!)}
                >
                  <span className={styles.quickLocationIcon}>🏠</span>
                  <div className={styles.quickLocationInfo}>
                    <span className={styles.quickLocationName}>Home</span>
                    <span className={styles.quickLocationAddress}>{savedLocations.home}</span>
                  </div>
                </button>
              )}
              {savedLocations.work && (
                <button
                  className={styles.quickLocationButton}
                  onClick={() => handleQuickLocationSelect(savedLocations.work!)}
                >
                  <span className={styles.quickLocationIcon}>💼</span>
                  <div className={styles.quickLocationInfo}>
                    <span className={styles.quickLocationName}>Work</span>
                    <span className={styles.quickLocationAddress}>{savedLocations.work}</span>
                  </div>
                </button>
              )}
              {recentLocations.slice(0, 3).map((location, index) => (
                <button
                  key={index}
                  className={styles.quickLocationButton}
                  onClick={() => handleQuickLocationSelect(location)}
                >
                  <span className={styles.quickLocationIcon}>⏱️</span>
                  <div className={styles.quickLocationInfo}>
                    <span className={styles.quickLocationName}>Recent</span>
                    <span className={styles.quickLocationAddress}>{location}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Premium Location Selection Container */}
        <div className={styles.locationSelectionContainer}>

          <div className={styles.locationInputGroup}>
            <label htmlFor="pickup" className={styles.locationLabel}>
              <span className={styles.locationIcon}>📍</span>
              Pickup Location
            </label>
            <div className={styles.locationInputWrapper}>
              <input
                id="pickup"
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                onFocus={() => setActiveField('pickup')}
                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                placeholder="Enter pickup address"
                className={`${styles.locationInput} ${errors.pickup ? styles.inputError : ''}`}
              />
              <div className={styles.inputButtons}>
                <button
                  type="button"
                  className={styles.voiceButton}
                  onClick={() => {
                    // Placeholder for voice input
                    alert('Voice input coming soon! 🎤');
                  }}
                  aria-label="Voice input"
                  title="Voice input"
                >
                  🎤
                </button>
                <button
                  type="button"
                  className={styles.currentLocationButton}
                  onClick={() => {
                    setPickup("📍 Current Location");
                  }}
                  aria-label="Use current location"
                  title="Use current location"
                >
                  📍
                </button>
              </div>
            </div>
            {errors.pickup && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {errors.pickup}
              </div>
            )}
          </div>

          <div className={styles.locationSeparator}>
            <span className={styles.separatorIcon}>🗺️</span>
          </div>

          <div className={styles.locationInputGroup}>
            <label htmlFor="destination" className={styles.locationLabel}>
              <span className={styles.locationIcon}>🏁</span>
              Destination
            </label>
            <div className={styles.locationInputWrapper}>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  if (e.target.value) saveRecentLocation(e.target.value);
                }}
                onFocus={() => setActiveField('destination')}
                onBlur={() => setTimeout(() => setActiveField(null), 200)}
                placeholder="Where would you like to go?"
                className={`${styles.locationInput} ${errors.destination ? styles.inputError : ''}`}
              />
              <div className={styles.inputButtons}>
                <button
                  type="button"
                  className={styles.voiceButton}
                  onClick={() => {
                    // Placeholder for voice input
                    alert('Voice input coming soon! 🎤');
                  }}
                  aria-label="Voice input"
                  title="Voice input"
                >
                  🎤
                </button>
                <button
                  type="button"
                  className={styles.mapButton}
                  onClick={() => {
                    // Placeholder for map selection
                    alert('Map selection coming soon! 🗺️');
                  }}
                  aria-label="Choose on map"
                  title="Choose on map"
                >
                  🗺️
                </button>
              </div>
            </div>
            {errors.destination && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {errors.destination}
              </div>
            )}
          </div>

          {/* Journey Preview Integration */}
          {pickup && destination && !isCalculatingRoute && estimatedDistance > 0 && (
            <div className={`${styles.journeyPreviewContainer} ${styles.visible}`}>
              <h3 className={styles.journeyTitle}>Journey Preview</h3>
              <div className={styles.journeyDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailValue}>{estimatedDistance}</span>
                  <span className={styles.detailLabel}>MILES</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailValue}>{formatDuration(estimatedDuration)}</span>
                  <span className={styles.detailLabel}>DURATION</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailValue}>£{calculateCost().toFixed(2)}</span>
                  <span className={styles.detailLabel}>ESTIMATE</span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className={styles.progressSteps}>
            <div className={`${styles.progressStep} ${pickup ? styles.completed : styles.active}`}></div>
            <div className={`${styles.progressStep} ${destination ? styles.completed : pickup ? styles.active : ''}`}></div>
            <div className={`${styles.progressStep} ${pickup && destination && estimatedDistance > 0 ? styles.active : ''}`}></div>
          </div>
        </div>

        {/* Route Calculation and Estimate */}
        {(isCalculatingRoute || estimatedDistance > 0 || estimatedDuration > 0) && (
          <div className={styles.estimate}>
            <h3 className={styles.estimateTitle}>Service Estimate</h3>
            {isCalculatingRoute ? (
              <LocationSkeletonLoader />
            ) : (
              <div className={styles.estimateDetails}>
                <div className={styles.estimateItem}>
                  <span className={styles.estimateLabel}>Distance:</span>
                  <span className={styles.estimateValue}>{estimatedDistance} miles</span>
                </div>
                <div className={styles.estimateItem}>
                  <span className={styles.estimateLabel}>Duration:</span>
                  <span className={styles.estimateValue}>{formatDuration(estimatedDuration)}</span>
                </div>
                <div className={styles.estimateItem}>
                  <span className={styles.estimateLabel}>Estimated Cost:</span>
                  <span className={styles.estimateCost}>£{calculateCost().toFixed(2)}</span>
                </div>
                {user?.hasUnlockedReward && user?.userType !== 'guest' && (
                  <div className={styles.rewardApplied}>
                    50% reward discount applied!
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Scheduling Section */}
        {estimatedDistance > 0 && estimatedDuration > 0 && !isCalculatingRoute && (
          <div className={styles.schedulingSection}>
            <CompactSchedulingPicker
              selectedDateTime={scheduledDateTime}
              onDateTimeChange={setScheduledDateTime}
              onSchedulingToggle={setIsScheduled}
              disabled={isLoading}
              label="Schedule for later"
              autoOpen={true}
            />
          </div>
        )}

        {/* Show route calculation indicator */}
        {isCalculatingRoute && pickup && destination && (
          <div className={styles.calculatingIndicator}>
            <LoadingSpinner size="small" variant="primary" text="Calculating route..." inline />
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={!pickup || !destination || isLoading || isCalculatingRoute}
        >
          {isLoading ? (
            <LoadingSpinner size="small" variant="light" text="Processing Location..." inline />
          ) : isCalculatingRoute ? (
            <LoadingSpinner size="small" variant="light" text="Calculating..." inline />
          ) : (
            'Confirm Security Transport'
          )}
        </button>
        
        <div className={styles.disclaimer}>
          <p>
            Security transport pricing based on actual journey time and threat assessment requirements.
            Minimum engagement: 1 hour with SIA certified security driver.
          </p>
        </div>
      </div>
    </div>
  );
}