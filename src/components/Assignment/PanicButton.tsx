import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PanicAlert } from '../../types';
import styles from './PanicButton.module.css';

interface PanicButtonProps {
  assignmentId: string;
  officerId: string;
  className?: string;
}


interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export function PanicButton({ assignmentId, officerId, className }: PanicButtonProps) {
  const { state } = useApp();
  const { user } = state;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelCountdown, setCancelCountdown] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // 1 minute cache
          }
        );
      });

      // Reverse geocode to get address (in production would use proper geocoding service)
      const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);

      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address
      });
      setLocationError(null);
    } catch (error) {
      console.error('Failed to get location:', error);
      setLocationError('Location access denied');

      // Try to use last known location from localStorage
      const lastKnownLocation = localStorage.getItem('armora_last_known_location');
      if (lastKnownLocation) {
        try {
          setCurrentLocation(JSON.parse(lastKnownLocation));
          setLocationError('Using last known location');
        } catch (e) {
          setLocationError('No location available');
        }
      }
    }
  }, []);

  // Mock reverse geocoding (in production would use Google Maps API or similar)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Mock address based on coordinates
    return `${lat.toFixed(4)}, ${lng.toFixed(4)} (London)`;
  };

  // Handle panic button click
  const handlePanicClick = () => {
    if (alertSent) return;

    setShowConfirmation(true);

    // Analytics - log panic button activation
    console.log({
      assignmentId,
      officerId,
      timestamp: Date.now(),
      location: currentLocation
    });
  };

  // Handle confirmation
  const handleConfirmAlert = async () => {
    if (!currentLocation || !user) {
      alert('Unable to send alert: Location or user data not available');
      return;
    }

    setIsLoading(true);
    setShowConfirmation(false);

    try {
      // Prepare alert data
      const alertData: PanicAlert = {
        id: 'alert_' + Date.now(),
        type: 'PANIC_ALERT',
        assignmentId,
        clientId: user.id || 'unknown_client',
        clientName: user.name || 'Unknown Client',
        clientPhone: user.phone || 'No phone number',
        officerId,
        location: currentLocation,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      // Send alert (in production would use WebSocket or API)
      await sendPanicAlert(alertData);

      setAlertSent(true);
      startCancelCountdown();

      // Store in localStorage for persistence
      localStorage.setItem('armora_panic_alert_sent', JSON.stringify({
        timestamp: Date.now(),
        assignmentId,
        alertData
      }));


    } catch (error) {
      console.error('Failed to send panic alert:', error);
      alert('Failed to send alert. Please try again or call emergency services directly.');
      setIsLoading(false);
    }
  };

  // Mock alert sending (in production would be WebSocket or API call)
  const sendPanicAlert = async (alertData: PanicAlert): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, this would:
    // 1. Send WebSocket message to CPO app
    // 2. Make API call to backend
    // 3. Trigger push notification
    // 4. Send SMS fallback

    // Simulate CPO notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Panic Alert Sent', {
        body: `Alert sent to your protection officer. They have been notified of your location.`,
        icon: '/favicon.ico'
      });
    }
  };

  // Start 3-second cancel countdown
  const startCancelCountdown = () => {
    setCancelCountdown(3);

    const countdown = setInterval(() => {
      setCancelCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsLoading(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle cancel during countdown
  const handleCancelAlert = () => {
    setAlertSent(false);
    setCancelCountdown(0);
    setIsLoading(false);

    // Remove from localStorage
    localStorage.removeItem('armora_panic_alert_sent');

  };

  // Don't render if no location and no fallback
  if (!currentLocation && locationError === 'No location available') {
    return (
      <div className={`${styles.panicContainer} ${className || ''}`}>
        <div className={styles.locationError}>
          <p>⚠️ Location required for emergency alerts</p>
          <button onClick={getCurrentLocation} className={styles.retryButton}>
            Retry Location Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.panicContainer} ${className || ''}`}>
      {!alertSent && !showConfirmation && (
        <button
          className={styles.panicButton}
          onClick={handlePanicClick}
          disabled={isLoading}
          aria-label="Request urgent assistance from protection officer"
        >
          <div className={styles.panicIcon}>🚨</div>
          <div className={styles.panicText}>
            <div className={styles.panicTitle}>URGENT ASSISTANCE NEEDED</div>
            <div className={styles.panicSubtext}>Alert Protection Officer Now</div>
          </div>
        </button>
      )}

      {showConfirmation && (
        <div className={styles.confirmationDialog}>
          <div className={styles.confirmationContent}>
            <div className={styles.confirmationIcon}>🚨</div>
            <h3 className={styles.confirmationTitle}>Alert your protection officer?</h3>
            <p className={styles.confirmationMessage}>
              They will be immediately notified of your location and current situation.
            </p>
            {locationError && (
              <p className={styles.locationWarning}>
                ⚠️ {locationError}
              </p>
            )}
            <div className={styles.confirmationActions}>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmAlert}
                disabled={isLoading}
              >
                {isLoading ? 'Sending Alert...' : 'YES, SEND ALERT'}
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {alertSent && (
        <div className={styles.alertSentContainer}>
          <div className={styles.alertSentContent}>
            <div className={styles.alertSentIcon}>✅</div>
            <div className={styles.alertSentTitle}>Alert Sent Successfully</div>
            <div className={styles.alertSentMessage}>
              Your protection officer has been notified and is responding.
            </div>
            {cancelCountdown > 0 && (
              <div className={styles.cancelCountdown}>
                <button
                  className={styles.cancelCountdownButton}
                  onClick={handleCancelAlert}
                >
                  Cancel Alert ({cancelCountdown}s)
                </button>
              </div>
            )}
            {cancelCountdown === 0 && (
              <div className={styles.alertLocked}>
                <p>Alert is now active and cannot be cancelled.</p>
                <p>Your officer will contact you shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PanicButton;