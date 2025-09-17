import React, { useState, useEffect } from 'react';
import styles from './AddressManager.module.css';

interface AddressManagerProps {
  isOpen: boolean;
  onClose: () => void;
  addressType: 'home' | 'work';
}

interface RecentAddress {
  address: string;
  timestamp: number;
  type: 'recent' | 'saved';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek?: 'weekday' | 'weekend';
}

interface LocationSuggestion {
  label: string;
  address: string;
  timestamp?: number;
  isClickable: boolean;
}

export function AddressManager({ isOpen, onClose, addressType }: AddressManagerProps) {
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [recentAddresses, setRecentAddresses] = useState<RecentAddress[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPostSaveActions, setShowPostSaveActions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load existing address from localStorage
      const savedAddress = localStorage.getItem(`armora_${addressType}_address`) || '';
      setAddress(savedAddress);
      setIsEditing(!savedAddress); // Start in edit mode if no address saved

      // Load recent addresses
      loadRecentAddresses();
    }
  }, [isOpen, addressType]);

  const loadRecentAddresses = () => {
    try {
      const recentData = localStorage.getItem('armora_recent_addresses');
      if (recentData) {
        const recent: any[] = JSON.parse(recentData);
        // Filter out addresses older than 30 days and sort by most recent
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const validRecent: RecentAddress[] = recent
          .filter(addr => addr.timestamp > thirtyDaysAgo)
          .map(addr => ({
            address: addr.address,
            timestamp: addr.timestamp,
            type: (addr.type || 'recent') as 'recent' | 'saved',
            timeOfDay: addr.timeOfDay,
            dayOfWeek: addr.dayOfWeek
          }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10); // Keep more for filtering
        setRecentAddresses(validRecent);
      }
    } catch (error) {
      console.error('Error loading recent addresses:', error);
    }
  };

  const saveToRecentAddresses = (newAddress: string) => {
    try {
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();

      let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
      if (hour >= 6 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
      else timeOfDay = 'night';

      const dayType: 'weekday' | 'weekend' = (dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : 'weekday';

      const existing = recentAddresses.filter(addr => addr.address !== newAddress);
      const updated: RecentAddress[] = [
        {
          address: newAddress,
          timestamp: Date.now(),
          type: 'recent' as const,
          timeOfDay,
          dayOfWeek: dayType
        },
        ...existing
      ].slice(0, 10); // Keep more for filtering

      setRecentAddresses(updated);
      localStorage.setItem('armora_recent_addresses', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent address:', error);
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding for demo (in real app, use a geocoding service)
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Current Location)`;
          setAddress(mockAddress);
          setShowSuggestions(false);
        } catch (error) {
          console.error('Error getting location:', error);
          alert('Could not get current location. Please enter manually.');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Location access denied. Please enter address manually.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleSave = () => {
    if (address.trim()) {
      const trimmedAddress = address.trim();
      localStorage.setItem(`armora_${addressType}_address`, trimmedAddress);
      setIsEditing(false);
      setShowSuggestions(false);
      setShowPostSaveActions(true);

      // Save to recent addresses
      saveToRecentAddresses(trimmedAddress);

      // Dispatch custom event to notify other components of address update
      window.dispatchEvent(new CustomEvent('addressUpdated', {
        detail: { type: addressType, address: trimmedAddress }
      }));
    }
  };

  const handleBookNow = () => {
    onClose();
    // Navigate to booking with pre-filled address
    window.dispatchEvent(new CustomEvent('startBooking', {
      detail: {
        prefilledAddress: address,
        addressType: addressType
      }
    }));
  };

  const handleScheduleRide = () => {
    onClose();
    // Navigate to booking with scheduling option
    window.dispatchEvent(new CustomEvent('scheduleBooking', {
      detail: {
        prefilledAddress: address,
        addressType: addressType
      }
    }));
  };

  const getAddressIcon = () => {
    return addressType === 'home' ? '🏠' : '💼';
  };

  const getContextualInfo = () => {
    if (addressType === 'home') {
      return {
        subtitle: 'Why save your home address?',
        benefits: [
          'Instant booking from anywhere',
          'Priority pickup scheduling',
          'Personalized route preferences',
          'Family account sharing'
        ],
        actionText: 'SAVE ADDRESS',
        description: 'Ready for quick booking'
      };
    } else {
      return {
        subtitle: 'Why save your work address?',
        benefits: [
          'Quick commute booking',
          'Business expense tracking',
          'Regular route optimization',
          'Corporate account benefits'
        ],
        actionText: 'SAVE ADDRESS',
        description: 'Perfect for daily commutes'
      };
    }
  };

  const getLocationSuggestions = (): LocationSuggestion[] => {
    if (addressType === 'home') {
      // For home: show recent locations from evenings/weekends
      const relevantRecent = recentAddresses
        .filter(addr =>
          addr.timeOfDay === 'evening' ||
          addr.dayOfWeek === 'weekend' ||
          addr.type === 'saved'
        )
        .slice(0, 3);

      if (relevantRecent.length > 0) {
        return [
          {
            label: '📍 Recent Locations',
            address: '',
            isClickable: false
          },
          ...relevantRecent.map(addr => ({
            label: getRelativeTime(addr.timestamp),
            address: addr.address,
            timestamp: addr.timestamp,
            isClickable: true
          }))
        ];
      } else {
        // New user tips for home
        return [
          {
            label: 'Quick Tips',
            address: '',
            isClickable: false
          },
          {
            label: 'Include your full postcode',
            address: '',
            isClickable: false
          },
          {
            label: 'Add flat/building number if needed',
            address: '',
            isClickable: false
          },
          {
            label: 'Or use current location above',
            address: '',
            isClickable: false
          }
        ];
      }
    } else {
      // For work: show recent work locations or business areas
      const relevantRecent = recentAddresses
        .filter(addr =>
          (addr.timeOfDay === 'morning' || addr.timeOfDay === 'evening') &&
          addr.dayOfWeek === 'weekday'
        )
        .slice(0, 3);

      if (relevantRecent.length > 0) {
        return [
          {
            label: '📍 Recent Work Locations',
            address: '',
            isClickable: false
          },
          ...relevantRecent.map(addr => ({
            label: getRelativeTime(addr.timestamp),
            address: addr.address,
            timestamp: addr.timestamp,
            isClickable: true
          }))
        ];
      } else {
        // Common business areas for new users
        return [
          {
            label: 'Common Business Areas',
            address: '',
            isClickable: false
          },
          {
            label: 'Canary Wharf - E14',
            address: 'Canary Wharf, London E14',
            isClickable: true
          },
          {
            label: 'City of London - EC1-4',
            address: 'City of London, London EC2',
            isClickable: true
          },
          {
            label: 'Westminster - SW1',
            address: 'Westminster, London SW1',
            isClickable: true
          },
          {
            label: 'Mayfair - W1',
            address: 'Mayfair, London W1',
            isClickable: true
          }
        ];
      }
    }
  };

  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 14) return 'Last week';
    return 'Recently';
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    if (suggestion.isClickable && suggestion.address) {
      setAddress(suggestion.address);
      setShowSuggestions(false);
    }
  };

  const handleDelete = () => {
    localStorage.removeItem(`armora_${addressType}_address`);
    setAddress('');
    setIsEditing(true);
    // Notify other components
    window.dispatchEvent(new CustomEvent('addressUpdated', {
      detail: { type: addressType, address: '' }
    }));
  };

  const handleClose = () => {
    onClose();
    setIsEditing(false);
  };

  if (!isOpen) return null;

  const contextInfo = getContextualInfo();

  // Show post-save success state
  if (showPostSaveActions && address && !isEditing) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              ✅ Address Saved!
            </h2>
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.savedAddressDisplay}>
              <div className={styles.addressIcon}>
                {getAddressIcon()}
              </div>
              <div className={styles.addressText}>
                {address}
              </div>
            </div>

            <div className={styles.postSaveMessage}>
              {contextInfo.description}
            </div>

            <div className={styles.postSaveActions}>
              <button
                className={styles.bookNowButton}
                onClick={handleBookNow}
              >
                BOOK NOW - 3 min away
              </button>
              <button
                className={styles.scheduleButton}
                onClick={handleScheduleRide}
              >
                SCHEDULE RIDE
              </button>
              <button
                className={styles.doneButton}
                onClick={handleClose}
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {getAddressIcon()} Save Your {addressType === 'home' ? 'Home' : 'Work'} Address
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {!isEditing && address ? (
            // Display Mode - Existing Address
            <div className={styles.displayMode}>
              <div className={styles.savedAddress}>
                <div className={styles.addressIcon}>
                  {getAddressIcon()}
                </div>
                <div className={styles.addressText}>{address}</div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Address
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={handleDelete}
                >
                  Remove Address
                </button>
              </div>
            </div>
          ) : (
            // Edit Mode - New/Edit Address with Enhanced Context
            <div className={styles.editMode}>
              {/* Benefits Section */}
              <div className={styles.benefitsSection}>
                <h3 className={styles.benefitsTitle}>{contextInfo.subtitle}</h3>
                <div className={styles.benefitsList}>
                  {contextInfo.benefits.map((benefit, index) => (
                    <div key={index} className={styles.benefitItem}>
                      <span className={styles.checkmark}>✓</span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Location Button */}
              <button
                className={styles.locationButton}
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                type="button"
              >
                {isGettingLocation ? (
                  <>
                    <div className={styles.spinner}></div>
                    Getting location...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                    </svg>
                    Use Current Location
                  </>
                )}
              </button>

              {/* Address Input */}
              <textarea
                className={styles.addressInput}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setShowSuggestions(e.target.value.length > 2);
                }}
                onFocus={() => setShowSuggestions(address.length > 2)}
                placeholder={`Enter your ${addressType} address...`}
                rows={2}
                autoFocus
              />

              {/* Dynamic Location Suggestions */}
              <div className={styles.suggestionsSection}>
                {getLocationSuggestions().map((suggestion, index) => (
                  <div key={index} className={`${
                    suggestion.isClickable ? styles.suggestionClickable : styles.suggestionHeader
                  }`}>
                    {index === 0 ? (
                      <div className={styles.suggestionTitle}>
                        {suggestion.label}
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={`${
                          suggestion.isClickable
                            ? styles.suggestionButton
                            : styles.suggestionTip
                        }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={!suggestion.isClickable}
                      >
                        {suggestion.isClickable && suggestion.timestamp ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="3"/>
                              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                            </svg>
                            <div className={styles.suggestionContent}>
                              <div className={styles.suggestionAddress}>{suggestion.address}</div>
                              <div className={styles.suggestionTime}>{suggestion.label}</div>
                            </div>
                          </>
                        ) : (
                          <span>{suggestion.label}</span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Recent Addresses Suggestions */}
              {showSuggestions && recentAddresses.length > 0 && (
                <div className={styles.suggestions}>
                  <div className={styles.suggestionsHeader}>Recent addresses:</div>
                  {recentAddresses.map((recentAddr, index) => (
                    <button
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setAddress(recentAddr.address);
                        setShowSuggestions(false);
                      }}
                      type="button"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {recentAddr.address}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles.actions}>
                <button
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={!address.trim()}
                >
                  {contextInfo.actionText}
                </button>
                {address && (
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setIsEditing(false);
                      setShowSuggestions(false);
                      const savedAddress = localStorage.getItem(`armora_${addressType}_address`) || '';
                      setAddress(savedAddress);
                    }}
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}