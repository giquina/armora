import { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ResponsiveModal } from './ResponsiveModal';
import { SmartLocationInput } from './SmartLocationInput';
import styles from './StreamlinedBookingModal.module.css';

interface Location {
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
}

interface BookingService {
  id: string;
  name: string;
  hourlyRate: number;
  description: string;
}

interface StreamlinedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: BookingService;
  onBookingConfirm: (bookingData: any) => void;
  userProfile?: {
    hasUnlockedReward?: boolean;
    userType?: string;
    recentLocations?: Location[];
  };
}

export function StreamlinedBookingModal({
  isOpen,
  onClose,
  selectedService,
  onBookingConfirm,
  userProfile
}: StreamlinedBookingModalProps) {
  const [commencementLocation, setPickupLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [routeEstimate, setRouteEstimate] = useState<{
    distance: number;
    duration: number;
    cost: number;
  } | null>(null);
  const [errors, setErrors] = useState<{
    commencementPoint?: string;
    secureDestination?: string;
    general?: string;
  }>({});

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({
        ...prev,
        general: 'Location services not available. Please enter Commencement Point address manually.'
      }));
      return;
    }

    setIsLoadingLocation(true);
    setErrors(prev => ({ ...prev, general: undefined }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const accuracy = Math.round(position.coords.accuracy);

      if (accuracy > 100) {
        setErrors(prev => ({
          ...prev,
          general: `Location accuracy is ${accuracy}m. For precise Commencement Point, please enter address manually or enable GPS.`
        }));
      }

      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: `Current Location (${accuracy}m accuracy)`
      };

      setCurrentLocation(location);
    } catch (error: any) {
      let errorMessage = 'Unable to get current location. ';

      switch (error.code) {
        case 1:
          errorMessage += 'Location access denied. Please enable location services and refresh.';
          break;
        case 2:
          errorMessage += 'Location unavailable. Please enter Commencement Point address manually.';
          break;
        case 3:
          errorMessage += 'Location timeout. Please try again or enter address manually.';
          break;
        default:
          errorMessage += 'Please enter Commencement Point address manually.';
      }

      console.warn('[Location] Error getting current location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const calculateRouteEstimate = useCallback(async () => {
    if (!commencementLocation || !destinationLocation) return;

    setIsCalculatingRoute(true);
    setErrors(prev => ({ ...prev, general: undefined }));

    try {
      // Simulate route calculation (in real app, use Google Maps API)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock calculation with realistic values
      const distance = Math.floor(Math.random() * 15) + 3; // 3-18 miles
      const duration = Math.floor(distance * 3.5) + Math.floor(Math.random() * 10); // Variable traffic
      const baseHourlyRate = selectedService.hourlyRate;
      const minimumCharge = 1; // 1 hour minimum
      const estimatedHours = Math.max(minimumCharge, duration / 60);

      // Apply discount if user has reward
      const hasDiscount = userProfile?.hasUnlockedReward && userProfile?.userType !== 'guest';
      const finalRate = hasDiscount ? baseHourlyRate * 0.5 : baseHourlyRate;
      const cost = Math.round(finalRate * estimatedHours);

      setRouteEstimate({
        distance,
        duration,
        cost
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'Unable to calculate route. Please check your locations and try again.'
      }));
      console.error('[Route] Calculation error:', error);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [commencementLocation, destinationLocation, selectedService, userProfile]);

  // Get current location on modal open
  useEffect(() => {
    if (isOpen && !currentLocation) {
      getCurrentLocation();
    }
  }, [isOpen, currentLocation, getCurrentLocation]);

  // Calculate route estimate when both locations are set
  useEffect(() => {
    if (commencementLocation && destinationLocation) {
      calculateRouteEstimate();
    }
  }, [commencementLocation, destinationLocation, calculateRouteEstimate]);

  const handlePickupLocationSelect = useCallback((location: Location) => {
    setPickupLocation(location);
    setErrors(prev => ({ ...prev, commencementPoint: undefined }));
  }, []);

  const handleDestinationLocationSelect = useCallback((location: Location) => {
    setDestinationLocation(location);
    setErrors(prev => ({ ...prev, secureDestination: undefined }));
  }, []);

  const useCurrentLocationForCommencement = () => {
    if (currentLocation) {
      handlePickupLocationSelect(currentLocation);
    } else {
      getCurrentLocation();
    }
  };

  const validateBooking = (): boolean => {
    const newErrors: typeof errors = {};

    if (!commencementLocation) {
      newErrors.commencementPoint = 'Please select a Commencement Point location';
    }

    if (!destinationLocation) {
      newErrors.secureDestination = 'Please select a destination';
    }

    if (commencementLocation && destinationLocation &&
        commencementLocation.address === destinationLocation.address) {
      newErrors.secureDestination = 'Destination must be different from commencement point location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookNow = async () => {
    if (!validateBooking() || !routeEstimate) return;

    setIsBooking(true);

    try {
      const bookingData = {
        service: selectedService,
        commencementLocation,
        destinationLocation,
        routeEstimate,
        bookingType: 'immediate',
        timestamp: new Date().toISOString(),
        userProfile,
        analytics: {
          clicksToComplete: 3, // This streamlined flow
          timeToComplete: Date.now() - (performance.now() || 0),
          locationMethod: commencementLocation?.address.includes('Current Location') ? 'gps' : 'manual'
        }
      };

      // Brief delay for better UX (shows loading state)
      await new Promise(resolve => setTimeout(resolve, 1000));

      onBookingConfirm(bookingData);

    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'Assignment failed. Please try again.'
      }));
      console.error('[Assignment] Error:', error);
      setIsBooking(false);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const isBookingReady = commencementLocation && destinationLocation && routeEstimate && !isCalculatingRoute;
  const hasDiscount = userProfile?.hasUnlockedReward && userProfile?.userType !== 'guest';

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      position="bottom"
      animationType="slide"
      className={styles.bookingModal}
    >
      <div className={styles.bookingContainer}>
        {/* Header with Navigation */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>
              Book {selectedService.name}
            </h2>
            <p className={styles.subtitle}>
              Where shall we collect you?
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close protection assignment"
          >
            ×
          </button>
        </div>

        {/* Service Info Banner */}
        <div className={styles.serviceBanner}>
          <div className={styles.serviceInfo}>
            <span className={styles.serviceName}>{selectedService.name}</span>
            <span className={styles.serviceRate}>
              £{hasDiscount ? selectedService.hourlyRate * 0.5 : selectedService.hourlyRate}/hour
              {hasDiscount && <span className={styles.discountBadge}>50% OFF</span>}
            </span>
          </div>
        </div>

        {/* Location Selection */}
        <div className={styles.locationSection}>
          {/* Commencement Point Location */}
          <div className={styles.locationGroup}>
            <SmartLocationInput
              type="Commencement Point"
              label="Commencement Point Location"
              icon="📍"
              placeholder="Enter Commencement Point address"
              value={commencementLocation}
              onLocationSelect={handlePickupLocationSelect}
              currentLocation={currentLocation}
              isLoadingCurrentLocation={isLoadingLocation}
              onUseCurrentLocation={useCurrentLocationForCommencement}
              error={errors.commencementPoint}
              recentLocations={userProfile?.recentLocations}
            />
          </div>

          {/* Route Visual Connector */}
          <div className={styles.routeConnector}>
            <div className={styles.routeLine} />
            <div className={styles.routeDots}>
              <div className={styles.routeDot} />
              <div className={styles.routeDot} />
              <div className={styles.routeDot} />
            </div>
          </div>

          {/* Destination Location */}
          <div className={styles.locationGroup}>
            <SmartLocationInput
              type="destination"
              label="Destination"
              icon="🏁"
              placeholder="Where are you going?"
              value={destinationLocation}
              onLocationSelect={handleDestinationLocationSelect}
              error={errors.secureDestination}
              recentLocations={userProfile?.recentLocations}
            />
          </div>
        </div>

        {/* Journey Preview */}
        {(isCalculatingRoute || routeEstimate) && (
          <div className={styles.journeyPreview}>
            <h3 className={styles.journeyTitle}>Journey Details</h3>
            {isCalculatingRoute ? (
              <div className={styles.calculatingState}>
                <LoadingSpinner size="small" variant="primary" inline />
                <span className={styles.calculatingText}>Calculating route...</span>
              </div>
            ) : routeEstimate ? (
              <div className={styles.journeyDetails}>
                <div className={styles.journeyStats}>
                  <div className={styles.journeyStat}>
                    <span className={styles.statValue}>{routeEstimate.distance}</span>
                    <span className={styles.statLabel}>miles</span>
                  </div>
                  <div className={styles.journeyStat}>
                    <span className={styles.statValue}>{formatDuration(routeEstimate.duration)}</span>
                    <span className={styles.statLabel}>journey</span>
                  </div>
                  <div className={styles.journeyStat}>
                    <span className={styles.statValue}>£{routeEstimate.cost}</span>
                    <span className={styles.statLabel}>estimated</span>
                  </div>
                </div>
                {hasDiscount && (
                  <div className={styles.discountInfo}>
                    <span className={styles.discountIcon}>🎉</span>
                    <span className={styles.discountText}>50% reward discount applied!</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Error Display */}
        {errors.general && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠️</span>
            <span className={styles.errorText}>{errors.general}</span>
          </div>
        )}

        {/* Action Section */}
        <div className={styles.actionSection}>
          <Button
            variant="primary"
            size="lg"
            isFullWidth
            onClick={handleBookNow}
            disabled={!isBookingReady || isBooking}
            className={styles.bookButton}
          >
            {isBooking ? (
              <LoadingSpinner size="small" variant="light" text="Confirming..." inline />
            ) : !commencementLocation ? (
              'Enter Commencement Point Location'
            ) : !destinationLocation ? (
              'Enter Destination'
            ) : isCalculatingRoute ? (
              'Calculating Route...'
            ) : routeEstimate ? (
              <>
                <span className={styles.buttonIcon}>🚗</span>
                Request CPO • £{routeEstimate.cost}
              </>
            ) : (
              'Request CPO'
            )}
          </Button>
        </div>

        {/* Quick Benefits */}
        <div className={styles.benefits}>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✅</span>
            <span className={styles.benefitText}>Instant confirmation</span>
          </div>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>📱</span>
            <span className={styles.benefitText}>SMS & app updates</span>
          </div>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon}>🔄</span>
            <span className={styles.benefitText}>Easy to modify</span>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}