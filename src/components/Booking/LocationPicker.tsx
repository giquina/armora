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
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [errors, setErrors] = useState<{ pickup?: string; destination?: string }>({});
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);

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
      {/* Progress Indicator */}
      <BookingProgressIndicator currentStep="location-picker" />
      
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <h1 className={styles.title}>Where to?</h1>
        <p className={styles.subtitle}>
          Enter your pickup and destination for {selectedService.name}
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
              <span className={styles.discountedPrice}>£{selectedService.hourlyRate * 0.5}</span>
              <span className={styles.originalPrice}>£{selectedService.hourlyRate}</span>
            </>
          ) : (
            <span className={styles.price}>£{selectedService.hourlyRate}</span>
          )}
          <span className={styles.perHour}>/hr</span>
        </div>
      </div>

      <div className={styles.locationForm}>
        {/* Premium Location Selection Container */}
        <div className={styles.locationSelectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.mainTitle}>Where would you like to go?</h2>
            <p className={styles.progressIndicator}>Step 2 of 3 • Route Planning</p>
          </div>

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
                placeholder="Enter pickup address or use current location"
                className={`${styles.locationInput} ${errors.pickup ? styles.inputError : ''}`}
              />
              <button
                type="button"
                className={styles.currentLocationButton}
                onClick={() => {
                  // Add current location functionality
                  setPickup("Current Location");
                }}
                aria-label="Use current location"
              >
                📍 Current
              </button>
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
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination address"
                className={`${styles.locationInput} ${errors.destination ? styles.inputError : ''}`}
              />
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
                  <span className={styles.detailValue}>£{calculateCost()}</span>
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
            <h3 className={styles.estimateTitle}>Trip Estimate</h3>
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
                  <span className={styles.estimateCost}>£{calculateCost()}</span>
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
            'Continue to Booking'
          )}
        </button>
        
        <div className={styles.disclaimer}>
          <p>
            Final pricing may vary based on actual travel time and additional services required.
            Minimum charge: 1 hour.
          </p>
        </div>
      </div>
    </div>
  );
}