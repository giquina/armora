import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SavedAddress } from '../../../../types';
import { SavedAddressList } from '../SavedAddressList/SavedAddressList';
import styles from './LocationInput.module.css';

interface LocationInputProps {
  /** Current destination value */
  value: string;
  /** Destination change handler */
  onChange: (location: string) => void;
  /** Current pickup location */
  pickupLocation?: string;
  /** Pickup location change handler */
  onPickupChange?: (location: string) => void;
  /** Recent locations to display */
  recentLocations?: string[];
  /** Saved addresses */
  savedAddresses?: SavedAddress[];
  /** Location selection handler */
  onLocationSelect?: (location: string) => void;
  /** Additional CSS classes */
  className?: string;
}

// Helper function to parse address into two lines
const parseAddressLines = (address: string): { primary: string; secondary: string } => {
  if (!address) return { primary: '', secondary: '' };

  const parts = address.split(',').map(part => part.trim());

  if (parts.length <= 2) {
    return { primary: parts[0] || '', secondary: parts[1] || '' };
  }

  // For longer addresses, take first part as primary, combine rest as secondary
  const primary = parts[0];
  const secondary = parts.slice(1, 3).join(', '); // Take next 2 parts for secondary

  return { primary, secondary };
};

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  pickupLocation = '',
  onPickupChange,
  recentLocations = [],
  savedAddresses = [],
  onLocationSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupSearchQuery, setPickupSearchQuery] = useState('');
  const [activeField, setActiveField] = useState<'pickup' | 'destination'>('pickup');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isPickupDetected, setIsPickupDetected] = useState(false);
  const [isPickupEditable, setIsPickupEditable] = useState(false);
  const [showPickupSaved, setShowPickupSaved] = useState(false);
  const [showDestinationSaved, setShowDestinationSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fullAddrRef = useRef<HTMLDivElement>(null);
  const [showFullAddress, setShowFullAddress] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node) &&
        !pickupInputRef.current?.contains(event.target as Node) &&
        (!fullAddrRef.current || !fullAddrRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
        setIsPickupOpen(false);
        setShowFullAddress(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle pickup input focus
  const handlePickupFocus = useCallback(() => {
    setIsPickupOpen(true);
    setIsOpen(false);
    setActiveField('pickup');
    setPickupSearchQuery(pickupLocation);
  }, [pickupLocation]);

  // Handle destination input focus
  const handleDestinationFocus = useCallback(() => {
    setIsOpen(true);
    setIsPickupOpen(false);
    setActiveField('destination');
    setSearchQuery(value);
  }, [value]);

  // Handle pickup input change
  const handlePickupChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPickupSearchQuery(newValue);
    if (onPickupChange) {
      onPickupChange(newValue);
    }
  }, [onPickupChange]);

  // Handle destination input change
  const handleDestinationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
  }, [onChange]);

  // Handle location selection for active field
  const handleLocationSelect = useCallback((location: string) => {
    if (activeField === 'pickup') {
      setPickupSearchQuery(location);
      setIsPickupOpen(false);
      if (onPickupChange) {
        onPickupChange(location);
      }
    } else {
      setSearchQuery(location);
      setIsOpen(false);
      onChange(location);
    }

    if (onLocationSelect) {
      onLocationSelect(location);
    }
  }, [activeField, onChange, onPickupChange, onLocationSelect]);

  // Auto-detect current location on mount if pickup is empty
  useEffect(() => {
    let isCancelled = false;
    const shouldDetect = !pickupLocation || pickupLocation.trim().length === 0;

    async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
      try {
        const params = new URLSearchParams({ format: 'jsonv2', lat: String(lat), lon: String(lon) });
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
          headers: {
            'Accept': 'application/json',
            // Identify application politely per Nominatim usage policy
            'User-Agent': 'armora-security-app/0.1 (contact: support@armora.local)'
          }
        });
        if (!resp.ok) return null;
        const data = await resp.json();
        const display = data?.display_name as string | undefined;
        return display || null;
      } catch (_) {
        return null;
      }
    }

    async function detect() {
      if (!shouldDetect || !onPickupChange) return;
      if (!('geolocation' in navigator)) return;
      try {
        setIsDetecting(true);
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(),
            (err) => {
              // Permission denied or other error
              reject(err);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
          );
        });

        navigator.geolocation.getCurrentPosition(async (pos) => {
          if (isCancelled) return;
          const { latitude, longitude } = pos.coords;
          const address = await reverseGeocode(latitude, longitude);
          const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          const detected = address || fallback;
          setIsPickupDetected(true);
          setIsPickupEditable(false);
          setPickupSearchQuery(detected);
          onPickupChange(detected);
          setIsDetecting(false);
        }, () => {
          if (isCancelled) return;
          setIsDetecting(false);
        }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
      } catch {
        setIsDetecting(false);
      }
    }

    detect();
    return () => { isCancelled = true; };
  }, [pickupLocation, onPickupChange]);

  // Handle blur for both inputs
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
      setIsPickupOpen(false);
    }, 200);
  }, []);

  // Only show recent locations if available
  const displayLocations = recentLocations;

  return (
    <div className={`${styles.locationInput} ${className}`}>
      {/* Unified Location Wrapper */}
      <div className={styles.locationInputWrapper}>

      {/* Protection Commencement Point */}
      <div className={`${styles.inputGroup} ${styles.inputGroupFirst}`}>
        <h3 className={styles.inputLabel}>📍 Protection Commencement Point</h3>
        <div className={styles.locationInputContainer}>
          {/* Address Display */}
          {isPickupDetected && !isPickupEditable ? (
            <div className={styles.addressDisplay}>
              {(() => {
                const { primary, secondary } = parseAddressLines(pickupSearchQuery || pickupLocation);
                return (
                  <>
                    <div className={styles.addressDisplayBox}>
                      <div className={styles.addressContent}>
                        <div className={styles.addressPrimary}>{primary}</div>
                        {secondary && <div className={styles.addressSecondary}>{secondary}</div>}
                      </div>
                      <div className={styles.addressMeta}>
                        <div className={styles.autoDetectBadgeInline}>
                          <span className={styles.checkIcon}>✓</span>
                          <span>Auto-detected</span>
                        </div>
                        <button
                          className={styles.editButtonInline}
                          type="button"
                          onClick={() => {
                            setIsPickupEditable(true);
                            setTimeout(() => pickupInputRef.current?.focus(), 0);
                          }}
                          aria-label="Edit commencement address"
                        >
                          <span className={styles.editIcon}>✏️</span>
                          Edit
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            /* Input Field */
            <div className={styles.inputWrapper}>
              <input
                ref={pickupInputRef}
                type="text"
                value={isPickupEditable ? (pickupSearchQuery || pickupLocation) : (pickupSearchQuery || pickupLocation)}
                onChange={handlePickupChange}
                onFocus={handlePickupFocus}
                onBlur={handleBlur}
                placeholder={isDetecting ? 'Detecting your current location…' : 'Protection commencement point'}
                className={styles.input}
              />
              {isDetecting && (
                <div className={styles.inputIcon} aria-label="Detecting current location">
                  <div className={styles.spinner}>
                    <svg className={styles.spinnerSvg} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="32" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Address Popover */}
          {showFullAddress && (
            <div
              ref={fullAddrRef}
              className={styles.fullAddressPopover}
              role="dialog"
              aria-modal="false"
              aria-label="Full commencement address"
            >
              <div className={styles.fullAddressHeader}>
                <span>Complete Address</span>
                <button
                  type="button"
                  className={styles.closePopover}
                  aria-label="Close"
                  onClick={() => setShowFullAddress(false)}
                >
                  ×
                </button>
              </div>
              <div className={styles.fullAddressBody}>{pickupSearchQuery || pickupLocation}</div>
              <div className={styles.fullAddressActions}>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(pickupSearchQuery || pickupLocation);
                    } catch (_) {
                      /* ignore */
                    }
                  }}
                >
                  Copy Address
                </button>
              </div>
            </div>
          )}

          {/* Use Saved Address Button for Pickup */}
          {!showPickupSaved && (savedAddresses.length > 0 || recentLocations.length > 0) && (
            <button
              className={styles.savedAddressButton}
              onClick={() => setShowPickupSaved(true)}
              type="button"
            >
              📍 Use saved address
            </button>
          )}

          {/* Saved Addresses List for Pickup */}
          {showPickupSaved && (
            <SavedAddressList
              savedAddresses={savedAddresses}
              recentAddresses={recentLocations}
              onSelectAddress={(address) => {
                if (onPickupChange) {
                  onPickupChange(address);
                }
                setPickupSearchQuery(address);
                setIsPickupDetected(false);
                setIsPickupEditable(false);
              }}
              onClose={() => setShowPickupSaved(false)}
            />
          )}
        </div>
      </div>

      {/* Route Connector */}
      <div className={styles.routeConnector}>
        <div className={styles.routeLine}></div>
        <div className={styles.routeIcon}>↓</div>
        <div className={styles.routeLine}></div>
      </div>

      {/* Secure Destination */}
      <div className={`${styles.inputGroup} ${styles.inputGroupLast}`}>
        <h3 className={styles.inputLabel}>📍 Secure Destination</h3>
        <div className={styles.locationInputContainer}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery || value}
              onChange={handleDestinationChange}
              onFocus={handleDestinationFocus}
              onBlur={handleBlur}
              placeholder="Secure destination"
              className={styles.input}
            />
          </div>

          {/* Use Saved Address Button for Destination */}
          {!showDestinationSaved && (savedAddresses.length > 0 || recentLocations.length > 0) && (
            <button
              className={styles.savedAddressButton}
              onClick={() => setShowDestinationSaved(true)}
              type="button"
            >
              📍 Use saved address
            </button>
          )}

          {/* Saved Addresses List for Destination */}
          {showDestinationSaved && (
            <SavedAddressList
              savedAddresses={savedAddresses}
              recentAddresses={recentLocations}
              onSelectAddress={(address) => {
                onChange(address);
                setSearchQuery(address);
              }}
              onClose={() => setShowDestinationSaved(false)}
            />
          )}
        </div>
      </div>

      </div> {/* End locationInputWrapper */}

      {/* Dropdown Menu - Only show if there are recent locations */}
      {(isOpen || isPickupOpen) && displayLocations.length > 0 && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <div className={styles.dropdownSection}>
            <h3 className={styles.dropdownHeader}>Recent Locations</h3>
            {displayLocations.map((location, index) => (
              <button
                key={`${location}-${index}`}
                className={styles.dropdownItem}
                onClick={() => handleLocationSelect(location)}
              >
                <span className={styles.locationIcon}>📍</span>
                <div className={styles.locationInfo}>
                  <span className={styles.locationName}>{location}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};