import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  /** Location selection handler */
  onLocationSelect?: (location: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  pickupLocation = '',
  onPickupChange,
  recentLocations = [],
  onLocationSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupSearchQuery, setPickupSearchQuery] = useState('');
  const [activeField, setActiveField] = useState<'pickup' | 'destination'>('pickup');
  const inputRef = useRef<HTMLInputElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node) &&
        !pickupInputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsPickupOpen(false);
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

  // Use current location handler
  const handleUseCurrentLocation = useCallback(() => {
    handleLocationSelect('Current Location');
  }, [handleLocationSelect]);

  // Handle blur for both inputs
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
      setIsPickupOpen(false);
    }, 200);
  }, []);

  // Default suggested locations for demo
  const defaultLocations = [
    'Heathrow Airport, London',
    'Canary Wharf, London',
    'Kings Cross Station, London',
    'Birmingham Airport',
    'Manchester Airport',
    'Cardiff Central Station'
  ];

  const displayLocations = recentLocations.length > 0 ? recentLocations : defaultLocations;

  return (
    <div className={`${styles.locationInput} ${className}`}>
      {/* Security Message at Top */}
      <div className={styles.securityMessage}>
        <div className={styles.securityItem}>
          <span className={styles.securityIcon}>🔒</span>
          <span className={styles.securityText}>Your addresses are encrypted & deleted after service</span>
        </div>
        <div className={styles.securityItem}>
          <span className={styles.securityIcon}>📍</span>
          <span className={styles.securityText}>Used only to match you with nearest CPO</span>
        </div>
      </div>

      {/* Pickup Location */}
      <div className={styles.inputGroup}>
        <h3 className={styles.inputLabel}>📍 Where should your CPO collect you?</h3>
        <div className={styles.inputWrapper}>
          <input
            ref={pickupInputRef}
            type="text"
            value={pickupSearchQuery || pickupLocation}
            onChange={handlePickupChange}
            onFocus={handlePickupFocus}
            onBlur={handleBlur}
            placeholder="Enter pick-up address..."
            className={styles.input}
          />
          <button
            className={styles.currentLocationButton}
            onClick={handleUseCurrentLocation}
            type="button"
          >
            📍 Use current location
          </button>
        </div>
      </div>

      {/* Destination Location */}
      <div className={styles.inputGroup}>
        <h3 className={styles.inputLabel}>📍 Where are you going?</h3>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery || value}
            onChange={handleDestinationChange}
            onFocus={handleDestinationFocus}
            onBlur={handleBlur}
            placeholder="Enter destination address..."
            className={styles.input}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {(isOpen || isPickupOpen) && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <div className={styles.dropdownSection}>
            <h3 className={styles.dropdownHeader}>Suggested Locations</h3>
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