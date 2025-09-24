import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './PanicButton.module.css';

interface PanicButtonProps {
  className?: string;
}

export function PanicButton({ className = '' }: PanicButtonProps) {
  const { state, activatePanicAlert, deactivatePanicAlert, updateLastKnownLocation } = useApp();
  const [isPressed, setIsPressed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isActivating, setIsActivating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const confirmationTimer = useRef<NodeJS.Timeout | null>(null);

  const PRESS_DURATION = 2000; // 2 seconds to activate
  const CONFIRMATION_DURATION = 10000; // 10 seconds to confirm or cancel

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
          updateLastKnownLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          });
        },
        (error) => {
          console.warn('Unable to get location for panic button:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  }, [updateLastKnownLocation]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
      if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    };
  }, []);

  const handlePressStart = () => {
    if (state.assignmentState.panicAlertSent || isActivating) return;

    setIsPressed(true);
    setCountdown(2);

    // Start countdown
    countdownTimer.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownTimer.current) clearInterval(countdownTimer.current);
          handlePanicActivation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set press timer for the full duration
    pressTimer.current = setTimeout(() => {
      handlePanicActivation();
    }, PRESS_DURATION);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }

    setIsPressed(false);
    setCountdown(0);
  };

  const handlePanicActivation = () => {
    setIsPressed(false);
    setCountdown(0);
    setIsConfirming(true);
    setShowConfirmation(true);

    // Auto-confirm after 10 seconds if no action taken
    confirmationTimer.current = setTimeout(() => {
      handleConfirmPanic();
    }, CONFIRMATION_DURATION);
  };

  const handleConfirmPanic = async () => {
    if (confirmationTimer.current) {
      clearTimeout(confirmationTimer.current);
      confirmationTimer.current = null;
    }

    setIsActivating(true);
    setShowConfirmation(false);

    try {
      const locationData = currentLocation ? {
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
        address: 'Emergency Location',
        accuracy: currentLocation.coords.accuracy,
        timestamp: new Date().toISOString()
      } : null;

      await activatePanicAlert(locationData);

      // Show success message briefly, then hide
      setTimeout(() => {
        setIsActivating(false);
        setIsConfirming(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to activate panic alert:', error);
      setIsActivating(false);
      setIsConfirming(false);
      // Could show error message here
    }
  };

  const handleCancelPanic = () => {
    if (confirmationTimer.current) {
      clearTimeout(confirmationTimer.current);
      confirmationTimer.current = null;
    }

    setIsConfirming(false);
    setShowConfirmation(false);
  };

  const handleDeactivate = async () => {
    try {
      await deactivatePanicAlert();
    } catch (error) {
      console.error('Failed to deactivate panic alert:', error);
    }
  };

  // Don't render if user is not logged in
  if (!state.user) {
    return null;
  }

  return (
    <>
      {/* Main Panic Button */}
      <button
        className={`${styles.panicButton} ${className} ${
          isPressed ? styles.pressed : ''
        } ${
          state.assignmentState.panicAlertSent ? styles.active : ''
        } ${
          isActivating ? styles.activating : ''
        }`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        disabled={isActivating}
        aria-label="Emergency Panic Button - Press and hold for 2 seconds"
        title="Emergency Panic Button - Press and hold for 2 seconds"
      >
        <div className={styles.buttonContent}>
          {state.assignmentState.panicAlertSent ? (
            <>
              <div className={styles.icon}>🚨</div>
              <span className={styles.activeText}>ALERT SENT</span>
            </>
          ) : isActivating ? (
            <>
              <div className={styles.spinner}></div>
              <span className={styles.activatingText}>ALERTING...</span>
            </>
          ) : isPressed ? (
            <>
              <div className={styles.icon}>🚨</div>
              <span className={styles.countdownText}>{countdown}</span>
            </>
          ) : (
            <>
              <div className={styles.icon}>🛡️</div>
              <span className={styles.buttonText}>PANIC</span>
            </>
          )}
        </div>

        {/* Progress ring for press and hold */}
        {isPressed && (
          <div className={styles.progressRing}>
            <svg className={styles.progressSvg} viewBox="0 0 36 36">
              <path
                className={styles.progressBackground}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={styles.progressForeground}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{
                  strokeDasharray: '100, 100',
                  animation: `${styles.progress} ${PRESS_DURATION}ms linear`
                }}
              />
            </svg>
          </div>
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <div className={styles.modalHeader}>
              <div className={styles.warningIcon}>⚠️</div>
              <h2>Emergency Alert Confirmation</h2>
            </div>

            <div className={styles.modalContent}>
              <p>
                You are about to send an emergency alert to Armora Protection Services.
                This will immediately notify:
              </p>
              <ul>
                <li>Your assigned Close Protection Officer</li>
                <li>Armora Emergency Response Team</li>
                <li>Local Emergency Services (if required)</li>
              </ul>

              {currentLocation && (
                <div className={styles.locationInfo}>
                  <strong>Your current location will be shared:</strong>
                  <p>
                    Lat: {currentLocation.coords.latitude.toFixed(6)}<br />
                    Lng: {currentLocation.coords.longitude.toFixed(6)}<br />
                    Accuracy: ±{Math.round(currentLocation.coords.accuracy)}m
                  </p>
                </div>
              )}

              <div className={styles.autoConfirmWarning}>
                <strong>This alert will be sent automatically in {Math.ceil((CONFIRMATION_DURATION - (Date.now() % CONFIRMATION_DURATION)) / 1000)} seconds</strong>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelPanic}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmPanic}
              >
                Send Emergency Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Alert Status */}
      {state.assignmentState.panicAlertSent && (
        <div className={styles.alertStatus}>
          <div className={styles.alertContent}>
            <div className={styles.alertIcon}>🚨</div>
            <div className={styles.alertText}>
              <strong>Emergency Alert Active</strong>
              <p>Protection services have been notified</p>
              {state.assignmentState.panicAlertTimestamp && (
                <small>
                  Sent: {state.assignmentState.panicAlertTimestamp.toLocaleTimeString()}
                </small>
              )}
            </div>
            <button
              className={styles.deactivateButton}
              onClick={handleDeactivate}
              title="Deactivate Emergency Alert"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}