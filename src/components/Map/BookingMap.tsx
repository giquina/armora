import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './BookingMap.module.css';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, symbol?: string) => {
  return L.divIcon({
    className: `custom-marker ${color}`,
    html: `
      <div class="${styles.markerIcon} ${styles[color]}">
        <div class="${styles.markerInner}">
          ${symbol || ''}
        </div>
        <div class="${styles.markerPulse}"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const commencementPointIcon = createCustomIcon('commencementPoint', '📍');
const destinationIcon = createCustomIcon('destination', '🏁');
const currentLocationIcon = createCustomIcon('current', '🔵');

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface BookingMapProps {
  commencementPoint?: Location;
  secureDestination?: Location;
  onPickupChange: (location: Location) => void;
  onDestinationChange: (location: Location) => void;
  editMode: 'commencementPoint' | 'destination' | null;
  height?: number;
}

// Map click handler component
function MapClickHandler({
  editMode,
  onPickupChange,
  onDestinationChange
}: {
  editMode: 'commencementPoint' | 'destination' | null;
  onPickupChange: (location: Location) => void;
  onDestinationChange: (location: Location) => void;
}) {
  useMapEvents({
    click: async (e) => {
      if (!editMode) return;

      const { lat, lng } = e.latlng;
      const location = { lat, lng };

      // Reverse geocoding would go here in real app
      const address = await reverseGeocode(lat, lng);
      const locationWithAddress = { ...location, address };

      if (editMode === 'commencementPoint') {
        onPickupChange(locationWithAddress);
      } else if (editMode === 'destination') {
        onDestinationChange(locationWithAddress);
      }

      // Add bounce animation to marker
      setTimeout(() => {
        const markers = document.querySelectorAll(`.${styles.markerIcon}`);
        markers.forEach(marker => {
          marker.classList.add(styles.bounce);
          setTimeout(() => marker.classList.remove(styles.bounce), 600);
        });
      }, 100);
    }
  });

  return null;
}

// Mock reverse geocoding function
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // In real app, use a geocoding API
  return `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

// Generate route path (simplified)
const generateRoute = (commencementPoint?: Location, secureDestination?: Location): [number, number][] => {
  if (!commencementPoint || !secureDestination) return [];

  // Simple straight line - in real app, use routing API
  return [
    [commencementPoint.lat, commencementPoint.lng],
    [secureDestination.lat, secureDestination.lng]
  ];
};

export const BookingMap: React.FC<BookingMapProps> = ({
  commencementPoint,
  secureDestination,
  onPickupChange,
  onDestinationChange,
  editMode,
  height = 300
}) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // No default location - only show actual user location
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accuracy = Math.round(position.coords.accuracy);

        // Reject inaccurate locations (over 50m accuracy)
        if (accuracy > 50) {
          console.warn(`Location too inaccurate: ${accuracy}m. Requesting high accuracy GPS.`);
          setLocationError(`Location accuracy is ${accuracy}m. Please enable precise location/GPS for accurate pickup.`);
          setIsLoadingLocation(false);
          return;
        }

        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: `Current Location (${accuracy}m accuracy)`
        };
        setCurrentLocation(location);
        setMapCenter([location.lat, location.lng]);
        setIsLoadingLocation(false);
        setLocationError(null);

        console.log(`✅ Accurate GPS location found: ${accuracy}m accuracy`);

        // Set as commencementPoint if no commencementPoint is set
        if (!commencementPoint) {
          onPickupChange(location);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoadingLocation(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location services and refresh.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable. Please enter your location manually.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again or enter manually.');
            break;
          default:
            setLocationError('Unable to get location. Please enter your address manually.');
            break;
        }
      },
      {
        enableHighAccuracy: true,  // Force GPS usage
        timeout: 30000,            // Give GPS more time to get accurate reading
        maximumAge: 0              // Always get fresh location, no cache
      }
    );
  }, [commencementPoint, onPickupChange]);

  // Update route when commencementPoint or secureDestination changes
  useEffect(() => {
    const route = generateRoute(commencementPoint, secureDestination);
    setRoutePath(route);

    // Fit map to show both points
    if (commencementPoint && secureDestination && mapRef.current) {
      const group = new L.FeatureGroup([
        L.marker([commencementPoint.lat, commencementPoint.lng]),
        L.marker([secureDestination.lat, secureDestination.lng])
      ]);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [commencementPoint, destination]);

  const handleMapReady = useCallback(() => {
    // MapContainer passes the map instance internally
    // We can access it via the map events
  }, []);

  // Show loading state while getting location
  if (isLoadingLocation) {
    return (
      <div className={styles.mapContainer} style={{ height }}>
        <div className={styles.mapLoading}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Getting your location...</p>
        </div>
      </div>
    );
  }

  // Show error state if location failed and no manual location set
  if (locationError && !mapCenter) {
    const retryLocation = () => {
      setLocationError(null);
      setIsLoadingLocation(true);

      // Request location again with even more aggressive GPS settings
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = Math.round(position.coords.accuracy);

          if (accuracy > 50) {
            setLocationError(`Still getting ${accuracy}m accuracy. Your device may not have GPS enabled or you're indoors. Please enter address manually.`);
            setIsLoadingLocation(false);
            return;
          }

          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `Current Location (${accuracy}m accuracy)`
          };
          setCurrentLocation(location);
          setMapCenter([location.lat, location.lng]);
          setIsLoadingLocation(false);
          setLocationError(null);

          if (!commencementPoint) {
            onPickupChange(location);
          }
        },
        (error) => {
          console.error('Retry geolocation error:', error);
          setIsLoadingLocation(false);
          setLocationError('GPS location failed. Please check location permissions and try again, or enter address manually.');
        },
        {
          enableHighAccuracy: true,
          timeout: 45000, // Even longer timeout for GPS
          maximumAge: 0
        }
      );
    };

    return (
      <div className={styles.mapContainer} style={{ height }}>
        <div className={styles.mapError}>
          <div className={styles.errorIcon}>🛰️</div>
          <p className={styles.errorText}>{locationError}</p>
          <div className={styles.errorActions}>
            <button className={styles.retryButton} onClick={retryLocation}>
              Try GPS Again
            </button>
            <button className={styles.manualButton} onClick={() => setLocationError(null)}>
              Enter Address Manually
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use commencementPoint location as fallback if no current location
  const centerLocation = mapCenter || (commencementPoint ? [commencementPoint.lat, commencementPoint.lng] : null);

  if (!centerLocation) {
    return (
      <div className={styles.mapContainer} style={{ height }}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.placeholderIcon}>🗺️</div>
          <p className={styles.placeholderText}>Set a commencementPoint location to view map</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.mapContainer}
      style={{ height }}
    >
      <MapContainer
        center={centerLocation as [number, number]}
        zoom={13}
        className={styles.map}
        whenReady={handleMapReady}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />

        {/* Map click handler */}
        <MapClickHandler
          editMode={editMode}
          onPickupChange={onPickupChange}
          onDestinationChange={onDestinationChange}
        />

        {/* Current location marker */}
        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={currentLocationIcon}
          >
            <Popup>
              <div className={styles.popupContent}>
                <strong>📍 Your Location</strong>
                <p>{currentLocation.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* commencementPoint marker */}
        {commencementPoint && (
          <Marker
            position={[commencementPoint.lat, commencementPoint.lng]}
            icon={commencementPointIcon}
            draggable={editMode === 'commencementPoint'}
            eventHandlers={{
              dragend: async (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                const address = await reverseGeocode(position.lat, position.lng);
                onPickupChange({
                  lat: position.lat,
                  lng: position.lng,
                  address
                });
              }
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <strong>📍 commencementPoint Location</strong>
                <p>{commencementPoint.address || 'Commencement Point'}</p>
                {editMode === 'commencementPoint' && (
                  <small>Drag to adjust position</small>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {secureDestination && (
          <Marker
            position={[secureDestination.lat, secureDestination.lng]}
            icon={destinationIcon}
            draggable={editMode === 'destination'}
            eventHandlers={{
              dragend: async (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                const address = await reverseGeocode(position.lat, position.lng);
                onDestinationChange({
                  lat: position.lat,
                  lng: position.lng,
                  address
                });
              }
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <strong>🏁 Destination</strong>
                <p>{destination.address || 'Destination Point'}</p>
                {editMode === 'destination' && (
                  <small>Drag to adjust position</small>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route line */}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#FFD700',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 10'
            }}
            className={styles.routeLine}
          />
        )}

        {/* Custom zoom controls */}
        <div className={styles.zoomControls}>
          <button
            className={styles.zoomButton}
            onClick={() => mapRef.current?.zoomIn()}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            className={styles.zoomButton}
            onClick={() => mapRef.current?.zoomOut()}
            aria-label="Zoom out"
          >
            −
          </button>
        </div>

        {/* Edit mode indicator */}
        {editMode && (
          <div className={styles.editModeIndicator}>
            <span className={styles.editIcon}>✏️</span>
            <span>
              Tap map to set {editMode === 'commencementPoint' ? 'commencementPoint' : 'destination'}
            </span>
          </div>
        )}
      </MapContainer>
    </div>
  );
};