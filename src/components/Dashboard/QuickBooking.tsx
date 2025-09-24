import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { BookingMap } from '../Map/BookingMap';
import { SchedulingPicker } from '../UI/SchedulingPicker';
import styles from './QuickBooking.module.css';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface QuickBookingProps {
  onBookNow: () => void;
  selectedService: 'standard' | 'executive' | 'shadow' | null;
  isLoading?: boolean;
  userType?: 'registered' | 'google' | 'guest';
}

export function QuickBooking({ onBookNow, selectedService, isLoading = false, userType = 'guest' }: QuickBookingProps) {
  const [commencementLocation, setPickupLocation] = useState<Location | undefined>();
  const [destinationLocation, setDestinationLocation] = useState<Location | undefined>();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [editMode, setEditMode] = useState<'commencementPoint' | 'destination' | null>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [multiStops, setMultiStops] = useState<Location[]>([]);
  const [showMultiStop, setShowMultiStop] = useState(false);

  // Define getCurrentLocation before using it
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      return;
    }

    setIsLoadingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0 // Always get fresh location
        });
      });

      const accuracy = Math.round(position.coords.accuracy);

      // Reject inaccurate locations (over 50m)
      if (accuracy > 50) {
        console.warn(`Location too inaccurate: ${accuracy}m. GPS required for precise Commencement Point.`);
        setCurrentLocation(null);

        // You could show a toast notification here
        alert(`Location accuracy is ${accuracy}m. Please enable precise location/GPS for accurate Commencement Point, or enter your address manually.`);
        return;
      }

      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: `Current Location (${accuracy}m accuracy)`
      };

      console.log(`✅ Accurate GPS location: ${accuracy}m accuracy`);
      setCurrentLocation(location);
      if (!commencementLocation) {
        setPickupLocation(location);
      }

    } catch (error: any) {
      console.error('Geolocation error:', error);
      setCurrentLocation(null);

      // Provide user feedback for different error types
      let errorMessage = 'Unable to get location';
      if (error.code === 1) {
        errorMessage = 'Location access denied';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable';
      } else if (error.code === 3) {
        errorMessage = 'Location timeout';
      }

      // You could show this error to the user via a toast or alert
      console.warn(`Location error: ${errorMessage}`);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map is always visible - no need for auto-expand logic

  const useCurrentLocation = () => {
    if (currentLocation) {
      setPickupLocation(currentLocation);
    } else {
      getCurrentLocation();
    }
  };

  const handlePickupChange = useCallback((location: Location) => {
    setPickupLocation(location);
    setEditMode(null);
  }, []);

  const handleDestinationChange = useCallback((location: Location) => {
    setDestinationLocation(location);
    setEditMode(null);
  }, []);

  const toggleMapEdit = (mode: 'commencementPoint' | 'destination') => {
    if (editMode === mode) {
      setEditMode(null);
    } else {
      setEditMode(mode);
    }
  };

  const addMultiStop = () => {
    if (multiStops.length < 3) { // Limit to 3 additional stops
      setMultiStops([...multiStops, { lat: 0, lng: 0, address: '' }]);
    }
  };

  const removeMultiStop = (index: number) => {
    setMultiStops(multiStops.filter((_, i) => i !== index));
  };

  const updateMultiStop = (index: number, address: string) => {
    const updated = [...multiStops];
    updated[index] = { ...updated[index], address };
    setMultiStops(updated);
  };

  const formatScheduledTime = () => {
    if (!scheduledTime) return '';
    const date = new Date(scheduledTime);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateEstimatedDuration = () => {
    // Simple duration calculation - in real app would use routing API
    const baseTime = 30; // 30 minutes base
    const multiStopTime = multiStops.length * 10; // 10 minutes per stop
    return baseTime + multiStopTime;
  };

  const handleQuickBook = () => {
    // Store comprehensive booking details for the booking flow
    const bookingData = {
      commencementLocation,
      destinationLocation,
      multiStops: multiStops.filter(stop => stop.address?.trim()),
      selectedService,
      isScheduled,
      scheduledTime: scheduledTime || null,
      userType,
      timestamp: new Date().toISOString(),
      estimatedDuration: calculateEstimatedDuration(),
      features: {
        multiStop: multiStops.length > 0,
        scheduled: isScheduled,
        mapIntegration: true
      }
    };

    localStorage.setItem('armora_booking_draft', JSON.stringify(bookingData));
    onBookNow();
  };

  const isReadyToBook = commencementLocation?.address && selectedService && (!isScheduled || scheduledTime);

  // Check if Shadow service should be available (premium vehicle owners only)
  const shouldShowShadow = userType === 'registered' || userType === 'google';

  return (
    <div className={styles.quickBooking}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Quick Request</h2>
        <p className={styles.subtitle}>Set your Commencement Point and destination</p>
        <p className={styles.mapNote}>Map and all options available below</p>
      </div>

      {/* Interactive Map - Always Visible */}
      <div className={styles.mapSection}>
        <BookingMap
          commencementPoint={commencementLocation}
          secureDestination={destinationLocation}
          onPickupChange={handlePickupChange}
          onDestinationChange={handleDestinationChange}
          editMode={editMode}
          height={280}
        />
      </div>

      {/* Location Inputs */}
      <div className={styles.locationInputs}>
        {/* Commencement Point Location */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="Commencement Point-location">
            <span className={styles.locationIcon}>📍</span>
            Commencement Point Location
            {editMode === 'commencementPoint' && <span className={styles.editingIndicator}>✏️ Editing</span>}
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="Commencement Point-location"
              type="text"
              className={`${styles.locationInput} ${editMode === 'commencementPoint' ? styles.editing : ''}`}
              placeholder="Enter Commencement Point address or use current location"
              value={commencementLocation?.address || ''}
              onChange={(e) => {
                if (commencementLocation) {
                  setPickupLocation({ ...commencementLocation, address: e.target.value });
                }
              }}
              onFocus={() => {}} // Map is always visible
            />
            <div className={styles.inputActions}>
              <button
                type="button"
                className={styles.currentLocationButton}
                onClick={useCurrentLocation}
                disabled={isLoadingLocation}
                title="Use current location"
              >
                {isLoadingLocation ? (
                  <LoadingSpinner size="small" variant="primary" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
              <button
                type="button"
                className={`${styles.mapEditButton} ${editMode === 'commencementPoint' ? styles.active : ''}`}
                onClick={() => toggleMapEdit('commencementPoint')}
                title="Edit on map"
              >
                🗺️
              </button>
            </div>
          </div>
        </div>

        {/* Route Indicator */}
        <div className={styles.routeIndicator}>
          <div className={styles.routeLine}></div>
          <div className={styles.routeDots}>
            <div className={styles.routeDot}></div>
            <div className={styles.routeDot}></div>
            <div className={styles.routeDot}></div>
          </div>
        </div>

        {/* Destination Location */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="destination-location">
            <span className={styles.locationIcon}>🎯</span>
            Destination
            {editMode === 'destination' && <span className={styles.editingIndicator}>✏️ Editing</span>}
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="destination-location"
              type="text"
              className={`${styles.locationInput} ${editMode === 'destination' ? styles.editing : ''}`}
              placeholder="Enter secureDestination address"
              value={destinationLocation?.address || ''}
              onChange={(e) => {
                if (destinationLocation) {
                  setDestinationLocation({ ...destinationLocation, address: e.target.value });
                } else {
                  setDestinationLocation({ lat: 0, lng: 0, address: e.target.value });
                }
              }}
              onFocus={() => {}} // Map is always visible
            />
            <div className={styles.inputActions}>
              <button
                type="button"
                className={`${styles.mapEditButton} ${editMode === 'destination' ? styles.active : ''}`}
                onClick={() => toggleMapEdit('destination')}
                title="Edit on map"
              >
                🗺️
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Stop & Scheduling Options - Always Visible */}
        <div className={styles.advancedOptions}>
            <div className={styles.multiStopSection}>
              <div className={styles.multiStopHeader}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={showMultiStop}
                    onChange={(e) => setShowMultiStop(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Multiple stops</span>
                </label>
                {showMultiStop && multiStops.length < 3 && (
                  <button
                    type="button"
                    className={styles.addStopButton}
                    onClick={addMultiStop}
                  >
                    + Add Stop
                  </button>
                )}
              </div>

              {showMultiStop && multiStops.map((stop, index) => (
                <div key={index} className={styles.multiStopInput}>
                  <input
                    type="text"
                    placeholder={`Stop ${index + 1} address`}
                    value={stop.address || ''}
                    onChange={(e) => updateMultiStop(index, e.target.value)}
                    className={styles.locationInput}
                  />
                  <button
                    type="button"
                    className={styles.removeStopButton}
                    onClick={() => removeMultiStop(index)}
                    title="Remove stop"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Scheduling Option */}
            <div className={styles.schedulingSection}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Schedule for later</span>
              </label>

              {isScheduled && (
                <div className={styles.schedulingInput}>
                  <SchedulingPicker
                    selectedDateTime={scheduledTime}
                    onDateTimeChange={setScheduledTime}
                    label="Choose your Commencement Point date and time"
                  />
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Service Selection Status */}
      {selectedService ? (
        <div className={styles.serviceStatus}>
          <div className={styles.serviceStatusIcon}>✓</div>
          <span className={styles.serviceStatusText}>
            Service selected: <strong>Armora {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}</strong>
          </span>
        </div>
      ) : (
        <div className={styles.serviceWarning}>
          <div className={styles.serviceWarningIcon}>⚠️</div>
          <span className={styles.serviceWarningText}>
            Please select a security service below
          </span>
        </div>
      )}

      {/* Booking Options */}
      <div className={styles.bookingOptions}>
        {/* Immediate Booking */}
        <div className={styles.bookingOption}>
          <div className={styles.bookingOptionContent}>
            <div className={styles.bookingOptionIcon}>🚗</div>
            <div className={styles.bookingOptionText}>
              <h3 className={styles.bookingOptionTitle}>
                {isScheduled ? 'Schedule Service' : 'Request Now'}
              </h3>
              <p className={styles.bookingOptionDescription}>
                {isScheduled
                  ? `Commencement Point at ${formatScheduledTime() || 'your chosen time'}`
                  : 'Immediate Commencement Point (5-15 minutes)'
                }
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            isFullWidth
            onClick={handleQuickBook}
            disabled={!isReadyToBook || isLoading}
            className={styles.bookButton}
          >
            {isLoading ? (
              <LoadingSpinner size="small" variant="light" text="Preparing..." inline />
            ) : !selectedService ? (
              'Select Service First'
            ) : !commencementLocation?.address ? (
              'Enter Commencement Point Location'
            ) : isScheduled && !scheduledTime ? (
              'Set Schedule Time'
            ) : isScheduled ? (
              `Schedule ${selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}`
            ) : multiStops.length > 0 ? (
              `Request Multi-Stop (${multiStops.length + 1} locations)`
            ) : (
              'Request Now'
            )}
          </Button>
        </div>

        {/* Booking Summary */}
        <div className={styles.bookingSummary}>
          {isScheduled && scheduledTime && (
            <div className={styles.scheduledInfo}>
              <span className={styles.scheduledIcon}>⏰</span>
              <span>Commencement Point at {formatScheduledTime()}</span>
            </div>
          )}
          {multiStops.length > 0 && (
            <div className={styles.multiStopInfo}>
              <span className={styles.multiStopIcon}>🛣️</span>
              <span>{multiStops.length} additional stop{multiStops.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>24/7</span>
          <span className={styles.statLabel}>Available</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{isScheduled ? 'Custom' : '5-15'}</span>
          <span className={styles.statLabel}>{isScheduled ? 'Time' : 'Min Commencement Point'}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{calculateEstimatedDuration()}</span>
          <span className={styles.statLabel}>Est. mins</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>15k+</span>
          <span className={styles.statLabel}>Secure Protection Details</span>
        </div>
      </div>

      {/* Shadow Service Warning for Guests */}
      {selectedService === 'shadow' && !shouldShowShadow && (
        <div className={styles.shadowWarning}>
          <div className={styles.warningIcon}>🔒</div>
          <div className={styles.warningContent}>
            <h4 className={styles.warningTitle}>Shadow Service</h4>
            <p className={styles.warningText}>
              Available exclusively for verified premium vehicle owners.
              <strong>Register your vehicle</strong> to access this premium service.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}