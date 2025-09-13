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
        <div className={styles.inputGroup}>
          <label htmlFor="pickup" className={styles.label}>
            <span className={styles.icon}>📍</span>
            Pickup Location
          </label>
          <input
            id="pickup"
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Enter pickup address or location"
            className={`${styles.input} ${errors.pickup ? styles.inputError : ''}`}
          />
          {errors.pickup && (
            <div className={styles.errorMessage}>{errors.pickup}</div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="destination" className={styles.label}>
            <span className={styles.icon}>🏁</span>
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination address"
            className={`${styles.input} ${errors.destination ? styles.inputError : ''}`}
          />
          {errors.destination && (
            <div className={styles.errorMessage}>{errors.destination}</div>
          )}
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