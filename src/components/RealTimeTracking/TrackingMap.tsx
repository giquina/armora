import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './TrackingMap.module.css';

interface TrackingMapProps {
  assignmentId?: string;
  className?: string;
}

interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: Date;
  accuracy?: number;
}

interface TrackingData {
  cpoLocation: LocationPoint | null;
  principalLocation: LocationPoint | null;
  eta: number | null; // minutes
  status: 'en_route' | 'arrived' | 'active' | 'completed';
  route?: LocationPoint[];
  distance?: number; // kilometers
}

export function TrackingMap({ assignmentId, className = '' }: TrackingMapProps) {
  const { state, setTrackingData } = useApp();
  const [trackingData, setLocalTrackingData] = useState<TrackingData>({
    cpoLocation: null,
    principalLocation: null,
    eta: null,
    status: 'en_route',
    route: [],
    distance: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock real-time updates
  useEffect(() => {
    if (!assignmentId) return;

    // Simulate initial tracking data
    const initializeTracking = () => {
      const mockData: TrackingData = {
        cpoLocation: {
          lat: 51.5074 + (Math.random() - 0.5) * 0.01,
          lng: -0.1278 + (Math.random() - 0.5) * 0.01,
          timestamp: new Date(),
          accuracy: 5,
        },
        principalLocation: {
          lat: 51.5074 + (Math.random() - 0.5) * 0.02,
          lng: -0.1278 + (Math.random() - 0.5) * 0.02,
          timestamp: new Date(),
          accuracy: 10,
        },
        eta: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
        status: 'en_route',
        route: generateMockRoute(),
        distance: parseFloat((Math.random() * 10 + 1).toFixed(1)), // 1-11 km
      };

      setLocalTrackingData(mockData);
      setTrackingData(mockData);
      setIsLoading(false);
    };

    const updateTracking = () => {
      setLocalTrackingData(prev => {
        const updatedData = {
          ...prev,
          cpoLocation: prev.cpoLocation ? {
            ...prev.cpoLocation,
            lat: prev.cpoLocation.lat + (Math.random() - 0.5) * 0.001,
            lng: prev.cpoLocation.lng + (Math.random() - 0.5) * 0.001,
            timestamp: new Date(),
          } : null,
          eta: prev.eta ? Math.max(0, prev.eta - 1) : null,
        };

        // Update status based on ETA
        if (updatedData.eta === 0) {
          updatedData.status = 'arrived';
        } else if (updatedData.eta && updatedData.eta < 5) {
          updatedData.status = 'en_route';
        }

        setTrackingData(updatedData);
        return updatedData;
      });
    };

    // Initialize tracking
    const initTimeout = setTimeout(initializeTracking, 1000);

    // Update every 10 seconds
    const updateInterval = setInterval(updateTracking, 10000);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(updateInterval);
    };
  }, [assignmentId, setTrackingData]);

  const generateMockRoute = (): LocationPoint[] => {
    const points: LocationPoint[] = [];
    const startLat = 51.5074 + (Math.random() - 0.5) * 0.01;
    const startLng = -0.1278 + (Math.random() - 0.5) * 0.01;
    const endLat = 51.5074 + (Math.random() - 0.5) * 0.02;
    const endLng = -0.1278 + (Math.random() - 0.5) * 0.02;

    for (let i = 0; i <= 10; i++) {
      const progress = i / 10;
      points.push({
        lat: startLat + (endLat - startLat) * progress,
        lng: startLng + (endLng - startLng) * progress,
        timestamp: new Date(Date.now() + i * 60000), // 1 minute intervals
      });
    }

    return points;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_route':
        return '#f59e0b';
      case 'arrived':
        return '#22c55e';
      case 'active':
        return '#3b82f6';
      case 'completed':
        return '#6b7280';
      default:
        return '#f59e0b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_route':
        return 'CPO En Route';
      case 'arrived':
        return 'CPO Arrived';
      case 'active':
        return 'Protection Detail Active';
      case 'completed':
        return 'Assignment Completed';
      default:
        return 'Unknown Status';
    }
  };

  const formatETA = (eta: number | null) => {
    if (!eta) return 'Calculating...';
    if (eta === 0) return 'Arrived';
    if (eta === 1) return '1 minute';
    return `${eta} minutes`;
  };

  if (isLoading) {
    return (
      <div className={`${styles.trackingMap} ${className}`}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading tracking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.trackingMap} ${className}`}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>Unable to load tracking data</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.trackingMap} ${className}`}>
      {/* Status Header */}
      <div className={styles.statusHeader}>
        <div
          className={styles.statusIndicator}
          style={{ backgroundColor: getStatusColor(trackingData.status) }}
        >
          <div className={styles.statusDot}></div>
          <span className={styles.statusText}>
            {getStatusText(trackingData.status)}
          </span>
        </div>

        {trackingData.eta !== null && trackingData.status === 'en_route' && (
          <div className={styles.etaDisplay}>
            <span className={styles.etaLabel}>ETA:</span>
            <span className={styles.etaValue}>{formatETA(trackingData.eta)}</span>
          </div>
        )}
      </div>

      {/* Map Placeholder */}
      <div className={styles.mapContainer} ref={mapRef}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapContent}>
            <div className={styles.mapIcon}>🗺️</div>
            <h3>Live Tracking Map</h3>
            <p>Real-time location tracking will be displayed here</p>

            {/* Mock location indicators */}
            <div className={styles.locationIndicators}>
              {trackingData.cpoLocation && (
                <div className={styles.locationItem}>
                  <div className={styles.cpoMarker}>👮</div>
                  <div className={styles.locationInfo}>
                    <span className={styles.locationLabel}>CPO Location</span>
                    <span className={styles.locationCoords}>
                      {trackingData.cpoLocation.lat.toFixed(4)}, {trackingData.cpoLocation.lng.toFixed(4)}
                    </span>
                    <span className={styles.locationTime}>
                      Last updated: {trackingData.cpoLocation.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}

              {trackingData.principalLocation && (
                <div className={styles.locationItem}>
                  <div className={styles.principalMarker}>📍</div>
                  <div className={styles.locationInfo}>
                    <span className={styles.locationLabel}>Your Location</span>
                    <span className={styles.locationCoords}>
                      {trackingData.principalLocation.lat.toFixed(4)}, {trackingData.principalLocation.lng.toFixed(4)}
                    </span>
                    <span className={styles.locationTime}>
                      Last updated: {trackingData.principalLocation.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Details */}
      <div className={styles.trackingDetails}>
        <h3>Protection Detail Information</h3>

        <div className={styles.detailsGrid}>
          {trackingData.distance && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Distance:</span>
              <span className={styles.detailValue}>{trackingData.distance} km</span>
            </div>
          )}

          {trackingData.eta !== null && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Estimated Arrival:</span>
              <span className={styles.detailValue}>{formatETA(trackingData.eta)}</span>
            </div>
          )}

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Status:</span>
            <span
              className={styles.detailValue}
              style={{ color: getStatusColor(trackingData.status) }}
            >
              {getStatusText(trackingData.status)}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Assignment ID:</span>
            <span className={styles.detailValue}>{assignmentId || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      <div className={styles.emergencyActions}>
        <button className={styles.contactButton}>
          📞 Contact CPO
        </button>
        <button className={styles.emergencyButton}>
          🚨 Emergency Alert
        </button>
      </div>
    </div>
  );
}