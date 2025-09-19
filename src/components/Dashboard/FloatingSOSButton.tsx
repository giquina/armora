import React, { useState, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './FloatingSOSButton.module.css';

export function FloatingSOSButton() {
  const { navigateToView } = useApp();
  const [isPulsing, setIsPulsing] = useState(true);
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergencyProtection = useCallback(() => {
    setIsPressed(true);
    setIsPulsing(false);

    // Store emergency context
    localStorage.setItem('armora_emergency_request', 'true');
    localStorage.setItem('armora_emergency_timestamp', Date.now().toString());
    localStorage.setItem('armora_selected_service', 'shadow'); // Highest level for emergencies
    localStorage.setItem('armora_booking_preset', 'emergency');

    // Analytics for emergency request
    console.log('[Analytics] Emergency SOS activated', {
      timestamp: Date.now(),
      location: navigator.geolocation ? 'requesting' : 'unavailable',
      source: 'floating_sos_button'
    });

    // Navigate to immediate booking
    navigateToView('booking');
  }, [navigateToView]);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={`${styles.sosButton} ${isPulsing ? styles.pulsing : ''} ${isPressed ? styles.pressed : ''}`}
      onClick={handleEmergencyProtection}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      aria-label="Emergency SOS - Immediate protection request"
      title="Emergency Protection Request"
    >
      <span className={styles.sosIcon}>🛡️</span>
      <span className={styles.sosText}>SOS</span>
    </button>
  );
}