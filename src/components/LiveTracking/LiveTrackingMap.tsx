/**
 * Live Tracking Map Component
 * Displays real-time officer location on a map with route visualization
 */

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRealtimeTracking } from '../../hooks/useRealtimeTracking';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import styles from './LiveTrackingMap.module.css';
import 'leaflet/dist/leaflet.css';

interface LiveTrackingMapProps {
  assignmentId: string;
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number };
  onArrival?: () => void;
}

// Custom marker icons
const officerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Auto-center map on officer location
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.panTo(center, { animate: true, duration: 1 });
  }, [center, map]);

  return null;
}

export function LiveTrackingMap({
  assignmentId,
  pickupLocation,
  dropoffLocation,
  onArrival,
}: LiveTrackingMapProps) {
  const {
    location: officerLocation,
    progress: routeProgress,
    isLoading,
    isActive,
  } = useRealtimeTracking(assignmentId);

  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const previousLocation = useRef<{ lat: number; lng: number } | null>(null);

  // Track officer's path
  useEffect(() => {
    if (officerLocation) {
      const newPoint: [number, number] = [
        officerLocation.latitude,
        officerLocation.longitude,
      ];

      // Add to path if location changed significantly
      if (
        !previousLocation.current ||
        Math.abs(previousLocation.current.lat - officerLocation.latitude) > 0.0001 ||
        Math.abs(previousLocation.current.lng - officerLocation.longitude) > 0.0001
      ) {
        setRoutePath((prev) => [...prev, newPoint]);
        previousLocation.current = {
          lat: officerLocation.latitude,
          lng: officerLocation.longitude,
        };
      }

      // Check for arrival
      if (officerLocation.status === 'arrived' && onArrival) {
        onArrival();
      }
    }
  }, [officerLocation, onArrival]);

  // Calculate map center based on officer location or midpoint
  const mapCenter: [number, number] = officerLocation
    ? [officerLocation.latitude, officerLocation.longitude]
    : [
        (pickupLocation.lat + dropoffLocation.lat) / 2,
        (pickupLocation.lng + dropoffLocation.lng) / 2,
      ];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" message="Loading tracking data..." />
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      {/* Status Banner */}
      <div className={styles.statusBanner}>
        {isActive ? (
          <div className={styles.activeStatus}>
            <span className={styles.pulsingDot}></span>
            <span>Live Tracking Active</span>
            {routeProgress && (
              <span className={styles.progress}>
                {Math.round(routeProgress.percentComplete)}% Complete
              </span>
            )}
          </div>
        ) : (
          <div className={styles.inactiveStatus}>
            <span>Officer Not Currently En Route</span>
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        className={styles.map}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Commencement Point */}
        <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
          <Popup>
            <div className={styles.popupContent}>
              <strong>Commencement Point</strong>
              <p>Starting point</p>
            </div>
          </Popup>
        </Marker>

        {/* Dropoff Location */}
        <Marker
          position={[dropoffLocation.lat, dropoffLocation.lng]}
          icon={dropoffIcon}
        >
          <Popup>
            <div className={styles.popupContent}>
              <strong>Destination</strong>
              <p>Drop-off point</p>
            </div>
          </Popup>
        </Marker>

        {/* Officer's Current Location */}
        {officerLocation && (
          <Marker
            position={[officerLocation.latitude, officerLocation.longitude]}
            icon={officerIcon}
          >
            <Popup>
              <div className={styles.popupContent}>
                <strong>Protection Officer</strong>
                <p>
                  Status: {officerLocation.status === 'en_route' ? 'En Route' : 'Arrived'}
                </p>
                {officerLocation.speed && (
                  <p>Speed: {Math.round(officerLocation.speed * 2.237)} mph</p>
                )}
                {routeProgress && (
                  <p>ETA: {new Date(routeProgress.estimatedTimeArrival).toLocaleTimeString()}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Path (traveled) */}
        {routePath.length > 1 && (
          <Polyline
            positions={routePath}
            color="#4A90E2"
            weight={4}
            opacity={0.7}
          />
        )}

        {/* Auto-center on officer */}
        <MapUpdater center={mapCenter} />
      </MapContainer>

      {/* Info Panel */}
      {routeProgress && (
        <div className={styles.infoPanel}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Distance Remaining:</span>
            <span className={styles.infoValue}>
              {(routeProgress.distanceRemaining / 1609.34).toFixed(1)} mi
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>ETA:</span>
            <span className={styles.infoValue}>
              {new Date(routeProgress.estimatedTimeArrival).toLocaleTimeString()}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Progress:</span>
            <span className={styles.infoValue}>
              {Math.round(routeProgress.percentComplete)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
