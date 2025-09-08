import React, { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import styles from './QuickBooking.module.css';

interface QuickBookingProps {
  onBookNow: () => void;
  selectedService: 'standard' | 'executive' | 'shadow' | null;
}

export function QuickBooking({ onBookNow, selectedService }: QuickBookingProps) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsLoadingLocation(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      // For now, just show generic location text
      // In a real app, you'd reverse geocode the coordinates
      const locationText = `Current Location (${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)})`;
      setCurrentLocation(locationText);
      setPickupLocation(locationText);
      
    } catch (error) {
      console.log('Could not get current location:', error);
      setCurrentLocation(null);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const useCurrentLocation = () => {
    if (currentLocation) {
      setPickupLocation(currentLocation);
    } else {
      getCurrentLocation();
    }
  };

  const handleQuickBook = () => {
    // Store booking details for the booking flow
    const bookingData = {
      pickupLocation: pickupLocation || 'Current Location',
      dropoffLocation: dropoffLocation || '',
      selectedService,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('armora_booking_draft', JSON.stringify(bookingData));
    onBookNow();
  };

  const isReadyToBook = pickupLocation.trim().length > 0 && selectedService;

  return (
    <div className={styles.quickBooking}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Quick Book</h2>
        <p className={styles.subtitle}>Set your pickup and destination</p>
      </div>

      {/* Location Inputs */}
      <div className={styles.locationInputs}>
        {/* Pickup Location */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="pickup-location">
            <span className={styles.locationIcon}>📍</span>
            Pickup Location
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="pickup-location"
              type="text"
              className={styles.locationInput}
              placeholder="Enter pickup address or use current location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
            <button
              type="button"
              className={styles.currentLocationButton}
              onClick={useCurrentLocation}
              disabled={isLoadingLocation}
              title="Use current location"
            >
              {isLoadingLocation ? (
                <div className={styles.locationSpinner}></div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
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

        {/* Dropoff Location */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="dropoff-location">
            <span className={styles.locationIcon}>🎯</span>
            Destination
          </label>
          <input
            id="dropoff-location"
            type="text"
            className={styles.locationInput}
            placeholder="Enter destination address"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
          />
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
              <h3 className={styles.bookingOptionTitle}>Book Now</h3>
              <p className={styles.bookingOptionDescription}>
                Immediate pickup (5-15 minutes)
              </p>
            </div>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            isFullWidth
            onClick={handleQuickBook}
            disabled={!isReadyToBook}
            className={styles.bookButton}
          >
            {!selectedService 
              ? 'Select Service First' 
              : !pickupLocation.trim()
              ? 'Enter Pickup Location'
              : 'Book Now'
            }
          </Button>
        </div>

        {/* Schedule for Later Option */}
        <div className={styles.schedulingNote}>
          <p className={styles.schedulingText}>
            Need to schedule for later? Complete your booking to set a specific time.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>24/7</span>
          <span className={styles.statLabel}>Available</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>5-15</span>
          <span className={styles.statLabel}>Min pickup</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>15k+</span>
          <span className={styles.statLabel}>Secure trips</span>
        </div>
      </div>
    </div>
  );
}