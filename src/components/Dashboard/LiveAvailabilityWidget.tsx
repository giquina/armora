import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './LiveAvailabilityWidget.module.css';

interface AvailabilityData {
  nearbyOfficers: number;
  nearestTime: string;
  hotspots: Array<{ lat: number; lng: number; id: string }>;
  lastUpdated: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

export function LiveAvailabilityWidget() {
  const { navigateToView } = useApp();
  const [availability, setAvailability] = useState<AvailabilityData>({
    nearbyOfficers: 13,
    nearestTime: "3 min",
    hotspots: [
      { lat: 51.5074, lng: -0.1278, id: 'central' },
      { lat: 51.5155, lng: -0.0922, id: 'city' },
      { lat: 51.4994, lng: -0.1248, id: 'south' },
      { lat: 51.5074, lng: -0.1478, id: 'west' },
      { lat: 51.5174, lng: -0.1278, id: 'north' }
    ],
    lastUpdated: Date.now()
  });

  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time updates
  const updateAvailability = useCallback(() => {
    setIsUpdating(true);

    // Simulate API call delay
    setTimeout(() => {
      setAvailability(prev => ({
        ...prev,
        nearbyOfficers: Math.floor(Math.random() * 8) + 10, // 10-17 officers
        nearestTime: Math.random() > 0.5 ? "2-4 min" : "3-6 min",
        lastUpdated: Date.now()
      }));
      setIsUpdating(false);
    }, 500);
  }, []);

  // Auto-update availability every 30 seconds
  useEffect(() => {
    const interval = setInterval(updateAvailability, 30000);
    return () => clearInterval(interval);
  }, [updateAvailability]);

  // Get user location (optional)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation not available:', error);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - availability.lastUpdated) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className={styles.availabilityWidget}>
      <div className={styles.widgetHeader}>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          <span className={styles.liveText}>LIVE AVAILABILITY</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.bookNowButton}
            onClick={() => navigateToView('booking')}
            aria-label="Book protection now"
          >
            Book Now
          </button>
          <button
            className={styles.refreshButton}
            onClick={updateAvailability}
            disabled={isUpdating}
            aria-label="Refresh availability"
          >
            <span className={`${styles.refreshIcon} ${isUpdating ? styles.spinning : ''}`}>🔄</span>
          </button>
        </div>
      </div>

      <div className={styles.availabilityContent}>
        <div className={styles.availabilityStats}>
          <div className={styles.statItem}>
            <span className={styles.shieldIcon}>🛡️</span>
            <span className={styles.statText}>
              <strong>{availability.nearbyOfficers}</strong> Protection Officers
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.starIcon}>⭐</span>
            <span className={styles.statText}>
              <strong>4.9</strong> average rating
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.timeIcon}>⚡</span>
            <span className={styles.statText}>
              Nearest: <strong>{availability.nearestTime}</strong> away
            </span>
          </div>
        </div>

        <div className={styles.miniMapContainer}>
          <div className={styles.miniMap}>
            <div className={styles.mapOverlay}>
              <div className={styles.mapLabel}>Central London</div>
              {/* User location dot */}
              {userLocation && (
                <div
                  className={styles.userDot}
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                  title="Your location"
                ></div>
              )}
              {/* Officer hotspots */}
              {availability.hotspots.map((hotspot, index) => (
                <div
                  key={hotspot.id}
                  className={`${styles.officerDot} ${styles[`hotspot${index + 1}`]}`}
                  style={{
                    left: `${20 + (index % 3) * 30}%`,
                    top: `${20 + Math.floor(index / 3) * 35}%`
                  }}
                  title={`Officer available - ${2 + index}min`}
                ></div>
              ))}
            </div>
          </div>

          <div className={styles.mapLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#22c55e' }}></span>
              <span>Available Officers</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#3b82f6' }}></span>
              <span>Your Location</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.widgetFooter}>
        <span className={styles.updateTime}>Updated {getTimeSinceUpdate()}</span>
        <span className={styles.coverage}>Greater London coverage</span>
      </div>
    </div>
  );
}