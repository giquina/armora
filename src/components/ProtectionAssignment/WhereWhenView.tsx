import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ServiceLevel, LocationData } from '../../types';
import styles from './WhereWhenView.module.css';

interface WhereWhenViewProps {
  onContinueToPayment: (data: {
    selectedService: ServiceLevel;
    location: LocationData;
    scheduledTime?: Date;
    isImmediate: boolean;
  }) => void;
  preSelectedServiceId?: string;
  preSelectedContext?: 'immediate' | 'airport' | 'executive' | 'schedule' | 'event';
}

interface ServiceOption {
  id: 'standard' | 'executive' | 'shadow' | 'client-vehicle';
  name: string;
  price: string;
  description: string;
  icon: string;
  features: string[];
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'standard',
    name: 'Essential Protection',
    price: '£50/hour',
    description: 'Professional protection for everyday security',
    icon: '🛡️',
    features: ['SIA-licensed officers', 'Real-time tracking', '24/7 support']
  },
  {
    id: 'executive',
    name: 'Executive Protection',
    price: '£75/hour',
    description: 'Premium security for high-profile clients',
    icon: '👔',
    features: ['Advanced threat assessment', 'Discrete surveillance', 'Emergency protocols']
  },
  {
    id: 'shadow',
    name: 'Shadow Protocol',
    price: '£65/hour',
    description: 'Special Forces trained, covert protection specialists',
    icon: '🕴️',
    features: ['Military-grade training', 'Covert operations', 'Counter-surveillance']
  },
  {
    id: 'client-vehicle',
    name: 'Client Vehicle Service',
    price: '£55/hour',
    description: 'Security-trained Protection Officer for your vehicle',
    icon: '🔑',
    features: ['Your vehicle', 'No mileage charges', 'Enhanced privacy']
  }
];

const AIRPORT_LOCATIONS = [
  { name: 'London Heathrow Airport', address: 'Heathrow Airport, Hounslow TW6 1AP', distance: '15 miles' },
  { name: 'London Gatwick Airport', address: 'Gatwick Airport, Horley RH6 0NP', distance: '28 miles' },
  { name: 'London City Airport', address: 'London City Airport, London E16 2PX', distance: '8 miles' },
  { name: 'London Stansted Airport', address: 'Stansted Airport, Stansted CM24 1QW', distance: '31 miles' },
  { name: 'London Luton Airport', address: 'Luton Airport, Luton LU2 9LY', distance: '34 miles' }
];

export function WhereWhenView({ onContinueToPayment, preSelectedServiceId, preSelectedContext }: WhereWhenViewProps) {
  const { navigateToView } = useApp();

  // Full-screen booking experience - hide navigation and prevent body scroll
  useEffect(() => {
    // Apply booking-active to both html and body for complete coverage
    document.documentElement.classList.add('booking-active');
    document.body.classList.add('booking-active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Force white background on root elements
    document.documentElement.style.backgroundColor = '#FFFFFF';
    document.body.style.backgroundColor = '#FFFFFF';

    return () => {
      document.documentElement.classList.remove('booking-active');
      document.body.classList.remove('booking-active');
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';

      // Restore original background
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Smart pre-selection based on context
  const getInitialService = (): 'standard' | 'executive' | 'shadow' | 'client-vehicle' => {
    if (preSelectedServiceId) return preSelectedServiceId as 'standard' | 'executive' | 'shadow' | 'client-vehicle';

    switch (preSelectedContext) {
      case 'immediate': return 'standard';
      case 'airport': return 'executive';
      case 'executive': return 'executive';
      case 'schedule': return 'executive';
      case 'event': return 'executive';
      default: return 'standard';
    }
  };

  const getInitialTimeOption = (): 'now' | 'schedule' => {
    switch (preSelectedContext) {
      case 'immediate': return 'now';
      case 'schedule': return 'schedule';
      case 'event': return 'schedule';
      default: return 'now';
    }
  };

  const [selectedService, setSelectedService] = useState<'standard' | 'executive' | 'shadow' | 'client-vehicle'>(getInitialService());
  const [timeOption, setTimeOption] = useState<'now' | 'schedule'>(getInitialTimeOption());
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [fromLocation, setFromLocation] = useState<string>('Current location');
  const [toLocation, setToLocation] = useState<string>('');
  const [isEditingFrom, setIsEditingFrom] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(130);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const toLocationRef = useRef<HTMLInputElement>(null);

  // Auto-focus on to location when component mounts
  useEffect(() => {
    setTimeout(() => {
      toLocationRef.current?.focus();
    }, 300);
  }, []);

  // Show airports for airport context
  const shouldShowAirports = preSelectedContext === 'airport';

  // Auto-detect current location function
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Use reverse geocoding service or fallback
        setFromLocation(`Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error('Error detecting location:', error);
        setFromLocation('Current location (detection failed)');
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Auto-detect location on component mount
  useEffect(() => {
    if (fromLocation === 'Current location') {
      detectCurrentLocation();
    }
  }, []);

  // Calculate price estimate
  useEffect(() => {
    const service = SERVICE_OPTIONS.find(s => s.id === selectedService);
    if (service) {
      const basePrice = parseInt(service.price.replace(/[^\d]/g, ''));
      const multiplier = timeOption === 'now' ? 1.2 : 1.0; // Rush pricing
      setEstimatedPrice(basePrice * 2 * multiplier); // 2 hour minimum
    }
  }, [selectedService, timeOption]);

  const handleContinue = () => {
    if (!toLocation.trim()) {
      toLocationRef.current?.focus();
      return;
    }

    const locationData: LocationData = {
      commencementPoint: fromLocation,
      secureDestination: toLocation.trim(),
      estimatedDistance: 10,
      estimatedDuration: 30
    };

    const scheduledDateTime = (timeOption === 'schedule' && scheduledDate && scheduledTime)
      ? new Date(`${scheduledDate}T${scheduledTime}`)
      : undefined;

    // Convert service ID to ServiceLevel object
    const selectedServiceData = SERVICE_OPTIONS.find(s => s.id === selectedService)!;
    const serviceLevel: ServiceLevel = {
      id: selectedService,
      name: selectedServiceData.name,
      tagline: selectedServiceData.description,
      price: selectedServiceData.price,
      hourlyRate: parseInt(selectedServiceData.price.replace(/[^\d]/g, '')),
      description: selectedServiceData.description,
      features: selectedServiceData.features
    };

    onContinueToPayment({
      selectedService: serviceLevel,
      location: locationData,
      scheduledTime: scheduledDateTime,
      isImmediate: timeOption === 'now'
    });
  };

  const selectedServiceData = SERVICE_OPTIONS.find(s => s.id === selectedService)!;

  return (
    <div className={styles.container}>
      {/* Header removed for full-screen mobile experience */}

      <div className={styles.content}>
        {/* Service Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Protection Level</h2>
          <div className={styles.serviceGrid}>
            {SERVICE_OPTIONS.map((service) => (
              <button
                key={service.id}
                className={`${styles.serviceCard} ${selectedService === service.id ? styles.serviceCardActive : ''}`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className={styles.serviceIcon}>{service.icon}</div>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  <p className={styles.servicePrice}>{service.price}</p>
                  <p className={styles.serviceDescription}>{service.description}</p>
                </div>
                {selectedService === service.id && (
                  <div className={styles.selectedIndicator}>✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Location Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Protection Service Locations</h2>

          {/* FROM Location */}
          <div className={styles.locationGroup}>
            <label className={styles.locationLabel}>PROTECTION COMMENCEMENT</label>
            <div className={styles.locationRow}>
              <div className={styles.locationIcon}>📍</div>
              {isEditingFrom ? (
                <input
                  className={styles.locationInput}
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  onBlur={() => setIsEditingFrom(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingFrom(false)}
                  autoFocus
                />
              ) : (
                <span className={styles.locationText}>
                  {isDetectingLocation ? 'Detecting your location...' : fromLocation}
                </span>
              )}
              <button
                className={styles.editButton}
                onClick={() => setIsEditingFrom(true)}
                disabled={isDetectingLocation}
              >
                Edit
              </button>
              <button
                className={styles.detectButton}
                onClick={detectCurrentLocation}
                disabled={isDetectingLocation}
                title="Detect current location"
              >
                {isDetectingLocation ? '⟳' : '📍'}
              </button>
            </div>
          </div>

          {/* TO Location */}
          <div className={styles.locationGroup}>
            <label className={styles.locationLabel}>SECURE DESTINATION</label>
            <div className={styles.locationRow}>
              <div className={styles.locationIcon}>🎯</div>
              <input
                ref={toLocationRef}
                className={styles.locationInput}
                placeholder="Enter secure destination address"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                autoComplete="street-address"
                list="location-suggestions"
              />
              {toLocation && (
                <button
                  className={styles.clearButton}
                  onClick={() => setToLocation('')}
                  title="Clear destination"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
            <datalist id="location-suggestions">
              <option value="London Heathrow Airport" />
              <option value="London Gatwick Airport" />
              <option value="London City Airport" />
              <option value="Canary Wharf, London" />
              <option value="The Shard, London" />
              <option value="Westminster, London" />
              <option value="King's Cross Station, London" />
              <option value="Liverpool Street Station, London" />
            </datalist>
          </div>

          {/* Airport Quick Select */}
          {shouldShowAirports && (
            <div className={styles.airportQuickSelect}>
              <h3 className={styles.quickSelectTitle}>Popular Airports</h3>
              <div className={styles.airportGrid}>
                {AIRPORT_LOCATIONS.map((airport) => (
                  <button
                    key={airport.address}
                    className={styles.airportButton}
                    onClick={() => setToLocation(airport.address)}
                  >
                    <span className={styles.airportName}>{airport.name}</span>
                    <span className={styles.airportDistance}>{airport.distance}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Protection Service Schedule</h2>

          <div className={styles.timeOptions}>
            <button
              className={`${styles.timeOption} ${timeOption === 'now' ? styles.timeOptionActive : ''}`}
              onClick={() => setTimeOption('now')}
            >
              <div className={styles.timeIcon}>⚡</div>
              <div>
                <h3 className={styles.timeTitle}>Immediate</h3>
                <p className={styles.timeDescription}>CPO arrives in 15-20 minutes</p>
              </div>
            </button>

            <button
              className={`${styles.timeOption} ${timeOption === 'schedule' ? styles.timeOptionActive : ''}`}
              onClick={() => setTimeOption('schedule')}
            >
              <div className={styles.timeIcon}>📅</div>
              <div>
                <h3 className={styles.timeTitle}>Schedule</h3>
                <p className={styles.timeDescription}>Book for later today or future date</p>
              </div>
            </button>
          </div>

          {timeOption === 'schedule' && (
            <div className={styles.scheduleInputs}>
              <div className={styles.scheduleRow}>
                <div className={styles.scheduleField}>
                  <label className={styles.scheduleLabel}>Date</label>
                  <input
                    type="date"
                    className={styles.scheduleInput}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className={styles.scheduleField}>
                  <label className={styles.scheduleLabel}>Time</label>
                  <input
                    type="time"
                    className={styles.scheduleInput}
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price Estimate */}
        <div className={styles.priceSection}>
          <div className={styles.priceCard}>
            <div className={styles.priceHeader}>
              <h3 className={styles.priceTitle}>Estimated Cost</h3>
              {timeOption === 'now' && (
                <span className={styles.rushBadge}>Rush pricing</span>
              )}
            </div>
            <div className={styles.priceAmount}>£{estimatedPrice}</div>
            <div className={styles.priceDetails}>
              <div className={styles.priceBreakdown}>
                <span>{selectedServiceData.name}</span>
                <span>2 hour minimum</span>
              </div>
              <p className={styles.priceNote}>
                Final price calculated on completion • No hidden fees
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonSection}>
          <button
            className={styles.continueButton}
            onClick={handleContinue}
            disabled={!toLocation.trim() || (timeOption === 'schedule' && (!scheduledDate || !scheduledTime))}
          >
            Request Protection →
          </button>
          <button
            className={styles.quickBookButton}
            onClick={() => {
              if (toLocation.trim()) {
                // Quick book with Essential Protection
                setSelectedService('standard');
                setTimeOption('now');
                setTimeout(handleContinue, 100);
              } else {
                toLocationRef.current?.focus();
              }
            }}
            disabled={!toLocation.trim()}
          >
            Quick Request - Essential Protection
          </button>
        </div>
      </div>
    </div>
  );
}