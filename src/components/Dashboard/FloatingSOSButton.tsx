import React, { useState, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './FloatingSOSButton.module.css';

export function FloatingSOSButton() {
  const { navigateToView } = useApp();
  const [isPulsing, setIsPulsing] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    setIsPulsing(false);
  }, [isExpanded]);

  const handleEmergencyProtection = useCallback((e: React.MouseEvent) => {
    // Only trigger protection assignment if expanded, otherwise just expand
    if (!isExpanded) {
      handleToggleExpand(e);
      return;
    }

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

    // Navigate to immediate protection assignment
    navigateToView('protection-request');
  }, [navigateToView, isExpanded, handleToggleExpand]);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={`${styles.sosButton} ${isPulsing ? styles.pulsing : ''} ${isPressed ? styles.pressed : ''} ${isExpanded ? styles.expanded : styles.collapsed}`}
      onClick={handleEmergencyProtection}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      aria-label={isExpanded ? "Immediate Protection - 24/7 Security Response" : "Expand protection menu"}
      title={isExpanded ? "Request Immediate Protection" : "Click to expand"}
    >
      <span className={styles.sosIcon}>🛡️</span>
      {isExpanded ? (
        <>
          <span className={styles.mainText}>Immediate Protection</span>
          <span className={styles.subText}>24/7 Protection Team</span>
        </>
      ) : (
        <span className={styles.collapsedText}>PROTECT</span>
      )}
    </button>
  );
}