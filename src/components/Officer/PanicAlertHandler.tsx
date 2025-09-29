import { useState, useEffect, useCallback } from 'react';
import { PanicAlert } from '../../types';
import styles from './PanicAlertHandler.module.css';

interface PanicAlertHandlerProps {
  className?: string;
}

interface AlertSound {
  play: () => void;
  pause: () => void;
  currentTime: number;
}

export function PanicAlertHandler({ className }: PanicAlertHandlerProps) {
  const [activeAlert, setActiveAlert] = useState<PanicAlert | null>(null);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [alertSound, setAlertSound] = useState<AlertSound | null>(null);

  // Initialize alert sound
  useEffect(() => {
    // Create audio for panic alerts (in production would use proper alert sound)
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmISBT2X4vO9diMFl2w='; // Simple beep sound

    setAlertSound(audio as any);

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Listen for panic alerts (WebSocket simulation)
  useEffect(() => {
    const handlePanicAlert = (event: CustomEvent<PanicAlert>) => {
      const alert = event.detail;
      setActiveAlert(alert);
      setIsAcknowledged(false);
      setCountdown(30);

      // Play alert sound continuously
      if (alertSound) {
        alertSound.currentTime = 0;
        alertSound.play();
      }

      // Vibrate device if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }

      // Request notification permission and show notification
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          showDesktopNotification(alert);
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              showDesktopNotification(alert);
            }
          });
        }
      }

    };

    // Listen for custom panic alert events
    window.addEventListener('panicAlert', handlePanicAlert as EventListener);

    // Simulate receiving panic alerts (for demonstration)
    const simulateAlert = () => {
      const mockAlert: PanicAlert = {
        id: 'alert_' + Date.now(),
        type: 'PANIC_ALERT',
        assignmentId: 'assignment_123',
        clientId: 'client_456',
        clientName: 'Sarah Johnson',
        clientPhone: '+44 7900 123456',
        officerId: 'officer_789',
        location: {
          lat: 51.5074,
          lng: -0.1278,
          address: '123 Oxford Street, London W1C 1DX',
          accuracy: 5
        },
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      window.dispatchEvent(new CustomEvent('panicAlert', { detail: mockAlert }));
    };

    // For demonstration - remove in production
    const demoTimer = setTimeout(simulateAlert, 5000);

    return () => {
      window.removeEventListener('panicAlert', handlePanicAlert as EventListener);
      clearTimeout(demoTimer);
    };
  }, [alertSound]);

  // Countdown timer for acknowledgment
  useEffect(() => {
    if (activeAlert && !isAcknowledged && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (activeAlert && !isAcknowledged && countdown === 0) {
      // Escalate alert if not acknowledged
      handleEscalateAlert();
    }
  }, [activeAlert, isAcknowledged, countdown]);

  const showDesktopNotification = (alert: PanicAlert) => {
    const notification = new Notification('🚨 PANIC ALERT - IMMEDIATE RESPONSE REQUIRED', {
      body: `${alert.clientName} needs urgent assistance at ${alert.location.address}`,
      icon: '/favicon.ico',
      tag: 'panic-alert',
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  const handleAcknowledge = useCallback(() => {
    if (!activeAlert) return;

    setIsAcknowledged(true);

    // Stop alert sound
    if (alertSound) {
      alertSound.pause();
      alertSound.currentTime = 0;
    }

    // Update alert status
    const acknowledgedAlert = {
      ...activeAlert,
      status: 'acknowledged' as const,
      acknowledgementTime: new Date().toISOString()
    };

    // In production, would send acknowledgment to server

    // Analytics
    console.log('Panic alert acknowledged', {
      alertId: activeAlert.id,
      responseTime: countdown,
      timestamp: Date.now()
    });
  }, [activeAlert, alertSound, countdown]);

  const handleCallClient = useCallback(() => {
    if (!activeAlert) return;

    // In production, would initiate call
    window.open(`tel:${activeAlert.clientPhone}`);

    // Update alert status
    const respondedAlert = {
      ...activeAlert,
      status: 'responded' as const,
      responseTime: new Date().toISOString()
    };

    // Analytics
    console.log('Client call initiated', {
      alertId: activeAlert.id,
      clientPhone: activeAlert.clientPhone,
      timestamp: Date.now()
    });
  }, [activeAlert]);

  const handleNavigateToClient = useCallback(() => {
    if (!activeAlert) return;

    const { lat, lng } = activeAlert.location;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    // Open maps for navigation
    window.open(mapsUrl, '_blank');

    // Analytics
    console.log('Navigation to client initiated', {
      alertId: activeAlert.id,
      location: activeAlert.location,
      timestamp: Date.now()
    });
  }, [activeAlert]);

  const handleEscalateAlert = useCallback(() => {
    if (!activeAlert) return;

    // Escalate to dispatch/backup
    const escalatedAlert = {
      ...activeAlert,
      escalated: true,
      escalationTime: new Date().toISOString()
    };

    // In production, would notify dispatch center
    alert('ALERT ESCALATED: No response from assigned officer. Notifying dispatch center.');

    // Analytics
    console.log('Alert escalated', {
      alertId: activeAlert.id,
      reason: 'no_acknowledgment',
      timestamp: Date.now()
    });
  }, [activeAlert]);

  const handleDismissAlert = useCallback(() => {
    if (!activeAlert || !isAcknowledged) return;

    // Stop alert sound
    if (alertSound) {
      alertSound.pause();
      alertSound.currentTime = 0;
    }

    // Clear alert
    setActiveAlert(null);
    setIsAcknowledged(false);
    setCountdown(30);

  }, [activeAlert, isAcknowledged, alertSound]);

  // Don't render if no active alert
  if (!activeAlert) {
    return null;
  }

  return (
    <div className={`${styles.alertOverlay} ${className || ''}`}>
      <div className={styles.alertContainer}>
        <div className={styles.alertHeader}>
          <div className={styles.alertIcon}>🚨</div>
          <div className={styles.alertTitle}>
            PANIC ALERT - IMMEDIATE RESPONSE REQUIRED
          </div>
          {!isAcknowledged && (
            <div className={styles.countdownTimer}>
              Acknowledge in: {countdown}s
            </div>
          )}
        </div>

        <div className={styles.clientInfo}>
          <h2 className={styles.clientName}>{activeAlert.clientName}</h2>
          <div className={styles.clientDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Phone:</span>
              <span className={styles.detailValue}>{activeAlert.clientPhone}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Assignment:</span>
              <span className={styles.detailValue}>{activeAlert.assignmentId}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Time:</span>
              <span className={styles.detailValue}>
                {new Date(activeAlert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.locationInfo}>
          <h3 className={styles.locationTitle}>Client Location:</h3>
          <div className={styles.locationAddress}>{activeAlert.location.address}</div>
          <div className={styles.locationCoords}>
            {activeAlert.location.lat.toFixed(6)}, {activeAlert.location.lng.toFixed(6)}
            {activeAlert.location.accuracy && (
              <span className={styles.accuracy}>
                (±{activeAlert.location.accuracy}m)
              </span>
            )}
          </div>
        </div>

        <div className={styles.alertActions}>
          {!isAcknowledged ? (
            <>
              <button
                className={`${styles.actionButton} ${styles.acknowledgeButton}`}
                onClick={handleAcknowledge}
              >
                ✓ ACKNOWLEDGE
              </button>
              <button
                className={`${styles.actionButton} ${styles.callButton}`}
                onClick={handleCallClient}
              >
                📞 CALL CLIENT
              </button>
              <button
                className={`${styles.actionButton} ${styles.navigateButton}`}
                onClick={handleNavigateToClient}
              >
                🗺️ NAVIGATE
              </button>
            </>
          ) : (
            <>
              <div className={styles.acknowledgedStatus}>
                ✅ Alert Acknowledged - Responding to Client
              </div>
              <div className={styles.followUpActions}>
                <button
                  className={`${styles.actionButton} ${styles.callButton}`}
                  onClick={handleCallClient}
                >
                  📞 CALL CLIENT
                </button>
                <button
                  className={`${styles.actionButton} ${styles.navigateButton}`}
                  onClick={handleNavigateToClient}
                >
                  🗺️ NAVIGATE
                </button>
                <button
                  className={`${styles.actionButton} ${styles.dismissButton}`}
                  onClick={handleDismissAlert}
                >
                  ✕ DISMISS
                </button>
              </div>
            </>
          )}
        </div>

        <div className={styles.urgencyIndicator}>
          <div className={styles.urgencyPulse}></div>
          <span className={styles.urgencyText}>URGENT ASSISTANCE REQUIRED</span>
        </div>
      </div>
    </div>
  );
}

export default PanicAlertHandler;