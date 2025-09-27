import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './ProtectionRequest.module.css';

interface ProtectionRequestProps {
  onAssignmentRequested: () => void;
  className?: string;
}

interface ServiceTier {
  id: 'essential' | 'executive' | 'shadow' | 'client-vehicle';
  name: string;
  icon: string;
  rate: string;
  hourlyRate: number;
  description: string;
  responseTime: string;
  features: string[];
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'essential',
    name: 'Essential Protection',
    icon: '🛡️',
    rate: '£50/hr',
    hourlyRate: 50,
    description: 'SIA-licensed Close Protection Officers',
    responseTime: '2-4 min',
    features: ['SIA Level 2 licensed', 'Real-time tracking', '24/7 support']
  },
  {
    id: 'executive',
    name: 'Executive Shield',
    icon: '👔',
    rate: '£75/hr',
    hourlyRate: 75,
    description: 'Premium security detail for high-profile clients',
    responseTime: '3-5 min',
    features: ['SIA Level 3 licensed', 'Threat assessment', 'Discrete surveillance']
  },
  {
    id: 'shadow',
    name: 'Shadow Protocol',
    icon: '🥷',
    rate: '£65/hr',
    hourlyRate: 65,
    description: 'Special Forces trained protection specialists',
    responseTime: '5-8 min',
    features: ['Military-grade training', 'Covert operations', 'Counter-surveillance']
  },
  {
    id: 'client-vehicle',
    name: 'Client Vehicle Service',
    icon: '🚗',
    rate: '£55/hr',
    hourlyRate: 55,
    description: 'Security-trained CPO for your vehicle',
    responseTime: '4-6 min',
    features: ['Your vehicle', 'No mileage charges', 'Enhanced privacy']
  }
];

interface TimeOption {
  value: string;
  label: string;
  description: string;
  badge?: string;
}

const TIME_OPTIONS: TimeOption[] = [
  { value: 'now', label: 'Now', description: 'CPO deploys now', badge: 'FASTEST' },
  { value: '30min', label: 'In 30 min', description: 'Protection commences in 30 minutes' },
  { value: '1hour', label: 'In 1 hour', description: 'Protection commences in 1 hour' },
  { value: 'schedule', label: 'Schedule', description: 'Choose specific time' }
];

export function ProtectionRequest({ onAssignmentRequested, className }: ProtectionRequestProps) {
  const { state } = useApp();
  const [selectedService, setSelectedService] = useState<ServiceTier>(SERVICE_TIERS[0]);
  const [secureDestination, setSecureDestination] = useState('');
  const [commencementTime, setCommencementTime] = useState('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  const [savedLocations, setSavedLocations] = useState<{home?: string, office?: string}>({});
  const [showRecentLocations, setShowRecentLocations] = useState(false);
  const [defaultRecentLocations] = useState([
    '📍 Heathrow Airport',
    '🏢 Canary Wharf',
    '🏠 Home (Saved)'
  ]);

  // Load recent locations and saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('armora_recent_destinations');
    if (saved) {
      try {
        setRecentLocations(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load recent destinations:', error);
      }
    }

    // Load saved home/office locations
    const savedHome = localStorage.getItem('armora_home_address');
    const savedOffice = localStorage.getItem('armora_office_address');
    setSavedLocations({
      home: savedHome || undefined,
      office: savedOffice || undefined
    });
  }, []);

  // Save destination to recent locations
  const saveDestination = (destination: string) => {
    if (!destination.trim()) return;

    const updated = [destination, ...recentLocations.filter(loc => loc !== destination)].slice(0, 5);
    setRecentLocations(updated);
    localStorage.setItem('armora_recent_destinations', JSON.stringify(updated));
  };

  // Handle destination input focus
  const handleDestinationFocus = () => {
    setShowRecentLocations(true);
  };

  // Handle destination input blur with delay
  const handleDestinationBlur = () => {
    // Delay hiding to allow clicks on recent locations
    setTimeout(() => setShowRecentLocations(false), 200);
  };

  // Select a location from recent/default list
  const selectLocation = (location: string) => {
    const cleanLocation = location.replace(/📍|🏢|🏠/, '').trim().replace(' (Saved)', '');
    setSecureDestination(cleanLocation);
    setShowRecentLocations(false);
  };

  // Calculate service fee (minimum 2 hours)
  const calculateServiceFee = () => {
    const baseHours = 2; // Minimum 2-hour assignment
    const baseFee = selectedService.hourlyRate * baseHours;

    // Apply 50% discount for registered users
    const hasDiscount = state.user?.hasUnlockedReward && state.user?.userType !== 'guest';
    const discountedFee = hasDiscount ? baseFee * 0.5 : baseFee;

    return {
      originalFee: baseFee,
      finalFee: discountedFee,
      hasDiscount,
      savings: hasDiscount ? baseFee - discountedFee : 0
    };
  };

  const { originalFee, finalFee, hasDiscount, savings } = calculateServiceFee();

  // Check if ready to request protection
  const isReadyToRequest = secureDestination.trim() &&
    (commencementTime !== 'schedule' || scheduledDateTime);

  // Handle protection request
  const handleRequestProtection = () => {
    if (!isReadyToRequest) return;

    // Save destination to recent locations
    saveDestination(secureDestination);

    // Store assignment data
    const assignmentData = {
      selectedService: selectedService.id,
      serviceName: selectedService.name,
      serviceRate: selectedService.rate,
      secureDestination: secureDestination.trim(),
      commencementTime,
      scheduledDateTime: commencementTime === 'schedule' ? scheduledDateTime : null,
      isImmediate: commencementTime === 'now',
      estimatedServiceFee: finalFee,
      originalServiceFee: originalFee,
      discountApplied: hasDiscount,
      discountAmount: savings,
      createdAt: new Date().toISOString(),
      user: state.user
    };

    localStorage.setItem('armora_assignment_data', JSON.stringify(assignmentData));
    onAssignmentRequested();
  };

  // Format deployment time
  const getDeploymentInfo = () => {
    if (commencementTime === 'now') {
      return `CPO deployment: ${selectedService.responseTime}`;
    } else if (commencementTime === '30min') {
      return 'Protection commences in 30 minutes';
    } else if (commencementTime === '1hour') {
      return 'Protection commences in 1 hour';
    } else if (commencementTime === 'schedule' && scheduledDateTime) {
      const date = new Date(scheduledDateTime);
      return `Protection commences: ${date.toLocaleString('en-GB')}`;
    }
    return 'Select commencement time';
  };

  return (
    <div className={`${styles.protectionRequest} ${className || ''}`}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.header}>
        <h1 className={styles.title}>Request Close Protection Officer</h1>
        <p className={styles.subtitle}>Three quick decisions - your CPO will be deployed</p>
      </div>

      {/* Service Tier Selection */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          Protection Level
        </label>
        <div className={styles.serviceSelector}>
          <div className={styles.protectionLevelContainer}>
            <span className={styles.serviceIcon}>{selectedService.icon}</span>
            <select
              className={styles.serviceDropdown}
              value={selectedService.id}
              onChange={(e) => {
                const service = SERVICE_TIERS.find(s => s.id === e.target.value);
                if (service) setSelectedService(service);
              }}
            >
              {SERVICE_TIERS.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} {service.rate} - {service.description}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.serviceDetails}>
            <div className={styles.serviceInfo}>
              <span className={styles.responseTime}>⚡ {selectedService.responseTime} response</span>
              <span className={styles.features}>
                {selectedService.features.join(' • ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secure Destination */}
      <div className={styles.section}>
        <label className={styles.sectionLabel} htmlFor="destination">
          Secure Destination
        </label>
        <div className={styles.destinationInput}>
          <input
            id="destination"
            type="text"
            className={styles.locationInput}
            placeholder="Enter protection required at..."
            value={secureDestination}
            onChange={(e) => setSecureDestination(e.target.value)}
            onFocus={handleDestinationFocus}
            onBlur={handleDestinationBlur}
          />
          <div className={styles.locationIcon}>📍</div>

          {/* Recent Locations Dropdown */}
          {showRecentLocations && (
            <div className={styles.recentLocationsDropdown}>
              {recentLocations.length > 0 && (
                <>
                  <div className={styles.recentHeader}>Recent Locations</div>
                  {recentLocations.slice(0, 3).map((location, index) => (
                    <button
                      key={index}
                      className={styles.recentLocationItem}
                      onClick={() => selectLocation(location)}
                    >
                      📍 {location}
                    </button>
                  ))}
                </>
              )}
              <div className={styles.recentHeader}>Quick Access</div>
              {defaultRecentLocations.map((location, index) => (
                <button
                  key={`default-${index}`}
                  className={styles.recentLocationItem}
                  onClick={() => selectLocation(location)}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Location Shortcuts */}
        <div className={styles.locationShortcuts}>
          {savedLocations.home && (
            <button
              className={styles.shortcutButton}
              onClick={() => setSecureDestination(savedLocations.home!)}
            >
              🏠 Home
            </button>
          )}
          {savedLocations.office && (
            <button
              className={styles.shortcutButton}
              onClick={() => setSecureDestination(savedLocations.office!)}
            >
              🏢 Office
            </button>
          )}
          {recentLocations.length > 0 && (
            <div className={styles.recentDropdown}>
              <select
                className={styles.recentSelect}
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    setSecureDestination(e.target.value);
                  }
                }}
              >
                <option value="">✈️ Recent locations</option>
                {recentLocations.slice(0, 5).map((location, index) => (
                  <option key={index} value={location}>
                    {location.length > 30 ? `${location.substring(0, 30)}...` : location}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Commencement Time */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          Protection Commences
        </label>
        <div className={styles.timeOptions}>
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.timeButton} ${commencementTime === option.value ? styles.active : ''} ${option.value === 'now' ? styles.fastest : ''}`}
              onClick={() => setCommencementTime(option.value)}
            >
              <span className={styles.timeLabel}>
                {option.label}
                {option.badge && <span className={styles.timeBadge}>{option.badge}</span>}
              </span>
              <span className={styles.timeDescription}>{option.description}</span>
            </button>
          ))}
        </div>

        {/* Schedule DateTime Picker */}
        {commencementTime === 'schedule' && (
          <div className={styles.schedulePicker}>
            <input
              type="datetime-local"
              className={styles.dateTimeInput}
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}
      </div>

      {/* Assignment Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>{getDeploymentInfo()}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Service fee (2hr minimum):</span>
          <span className={styles.summaryValue}>
            {hasDiscount && (
              <span className={styles.originalFee}>£{originalFee}</span>
            )}
            £{finalFee}
          </span>
        </div>
        {hasDiscount && (
          <div className={styles.summaryRow}>
            <span className={styles.discountLabel}>🎉 50% Member Discount:</span>
            <span className={styles.discountValue}>-£{savings}</span>
          </div>
        )}
      </div>

      {/* Request CTA */}
      <button
        className={styles.requestButton}
        onClick={handleRequestProtection}
        disabled={!isReadyToRequest}
      >
        {!secureDestination.trim() ? (
          'Enter Secure Destination'
        ) : commencementTime === 'schedule' && !scheduledDateTime ? (
          'Set Schedule Time'
        ) : (
          `Request CPO £${finalFee}`
        )}
      </button>

        {/* Trust Badges - Single Row */}
        <div className={styles.trustBadges}>
          🛡️ SIA Licensed | ⭐ 4.9 Rating | 🔒 Insured | 📍 Live Track
        </div>
      </div>
    </div>
  );
}