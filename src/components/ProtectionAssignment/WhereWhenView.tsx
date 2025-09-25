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
    price: '£65/hour',
    description: 'SIA Level 2, personal protection trained CPOs',
    icon: '🛡️',
    features: ['SIA-licensed CPOs', 'Real-time tracking', '24/7 support', 'Standard response time']
  },
  {
    id: 'executive',
    name: 'Executive Shield',
    price: '£95/hour',
    description: 'SIA Level 3, corporate bodyguard services',
    icon: '👔',
    features: ['Advanced threat assessment', 'Discrete surveillance', 'Emergency protocols', 'Priority response']
  },
  {
    id: 'shadow',
    name: 'Shadow Protocol',
    price: '£125/hour',
    description: 'Special Forces trained, covert protection specialists',
    icon: '🕴️',
    features: ['Military-grade training', 'Covert operations', 'Counter-surveillance', 'Elite specialists']
  },
  {
    id: 'client-vehicle',
    name: 'Client Vehicle Service',
    price: '£55/hour',
    description: 'Security-trained CPO for customer\'s vehicle',
    icon: '🔑',
    features: ['Use your vehicle', 'No mileage charges', 'Enhanced privacy', 'Familiar surroundings']
  }
];

const AIRPORT_LOCATIONS = [
  { name: 'London Heathrow Airport', address: 'Heathrow Airport, Hounslow TW6 1AP', distance: '15 miles', icon: '✈️' },
  { name: 'London Gatwick Airport', address: 'Gatwick Airport, Horley RH6 0NP', distance: '28 miles', icon: '✈️' },
  { name: 'London City Airport', address: 'London City Airport, London E16 2PX', distance: '8 miles', icon: '✈️' },
  { name: 'London Stansted Airport', address: 'Stansted Airport, Stansted CM24 1QW', distance: '31 miles', icon: '✈️' },
  { name: 'London Luton Airport', address: 'Luton Airport, Luton LU2 9LY', distance: '34 miles', icon: '✈️' }
];

const POPULAR_DESTINATIONS = [
  { name: 'The Shard', address: '32 London Bridge St, London SE1 9SG', icon: '🏢' },
  { name: 'Canary Wharf', address: 'Canary Wharf, London E14 5AB', icon: '🏦' },
  { name: 'Oxford Street', address: 'Oxford St, London W1C 1JN', icon: '🛍️' },
  { name: 'Westminster', address: 'Westminster, London SW1A 0AA', icon: '🏛️' },
  { name: 'King\'s Cross Station', address: 'Euston Rd, London N1 9AL', icon: '🚂' },
  { name: 'Liverpool Street', address: 'Liverpool St, London EC2M 7QH', icon: '🚂' }
];

export function WhereWhenView({ onContinueToPayment, preSelectedServiceId, preSelectedContext }: WhereWhenViewProps) {
  const { navigateToView } = useApp();

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
  const [shouldShowAirports, setShouldShowAirports] = useState(preSelectedContext === 'airport');
  const toLocationRef = useRef<HTMLInputElement>(null);

  // Auto-focus on to location when component mounts
  useEffect(() => {
    setTimeout(() => {
      toLocationRef.current?.focus();
    }, 300);
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
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigateToView('home')}
          aria-label="Back to home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className={styles.title}>Arrange Protection Service</h1>
      </div>

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
                <div className={styles.serviceHeader}>
                  <div className={styles.serviceIcon}>{service.icon}</div>
                  <div className={styles.serviceInfo}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    <p className={styles.servicePrice}>{service.price}</p>
                  </div>
                  {selectedService === service.id && (
                    <div className={styles.selectedIndicator}>✓</div>
                  )}
                </div>
                <p className={styles.serviceDescription}>{service.description}</p>
                <div className={styles.serviceFeatures}>
                  {service.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className={styles.featureBadge}>
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Location Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Where do you need protection?</h2>

          {/* FROM Location */}
          <div className={styles.locationGroup}>
            <label className={styles.locationLabel}>FROM</label>
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
                <span className={styles.locationText}>{fromLocation}</span>
              )}
              <button
                className={styles.editButton}
                onClick={() => setIsEditingFrom(true)}
              >
                Edit
              </button>
            </div>
          </div>

          {/* TO Location */}
          <div className={styles.locationGroup}>
            <label className={styles.locationLabel}>TO</label>
            <div className={styles.locationRow}>
              <div className={styles.locationIcon}>🎯</div>
              <input
                ref={toLocationRef}
                className={styles.locationInput}
                placeholder="Enter destination address or landmark"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Destinations */}
          <div className={styles.destinationQuickSelect}>
            <h3 className={styles.quickSelectTitle}>Popular Destinations</h3>
            <div className={styles.destinationTabs}>
              <button
                className={`${styles.destinationTab} ${shouldShowAirports ? styles.destinationTabActive : ''}`}
                onClick={() => setShouldShowAirports(true)}
              >
                ✈️ Airports
              </button>
              <button
                className={`${styles.destinationTab} ${!shouldShowAirports ? styles.destinationTabActive : ''}`}
                onClick={() => setShouldShowAirports(false)}
              >
                🏢 Landmarks
              </button>
            </div>

            <div className={styles.destinationGrid}>
              {shouldShowAirports ? (
                AIRPORT_LOCATIONS.map((airport) => (
                  <button
                    key={airport.address}
                    className={styles.destinationButton}
                    onClick={() => setToLocation(airport.address)}
                  >
                    <span className={styles.destinationIcon}>{airport.icon}</span>
                    <div className={styles.destinationInfo}>
                      <span className={styles.destinationName}>{airport.name}</span>
                      <span className={styles.destinationDistance}>{airport.distance}</span>
                    </div>
                  </button>
                ))
              ) : (
                POPULAR_DESTINATIONS.map((destination) => (
                  <button
                    key={destination.address}
                    className={styles.destinationButton}
                    onClick={() => setToLocation(destination.address)}
                  >
                    <span className={styles.destinationIcon}>{destination.icon}</span>
                    <div className={styles.destinationInfo}>
                      <span className={styles.destinationName}>{destination.name}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Time Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>When do you need protection?</h2>

          <div className={styles.timeOptions}>
            <button
              className={`${styles.timeOption} ${timeOption === 'now' ? styles.timeOptionActive : ''}`}
              onClick={() => setTimeOption('now')}
            >
              <div className={styles.timeIcon}>⚡</div>
              <div>
                <h3 className={styles.timeTitle}>Now</h3>
                <p className={styles.timeDescription}>Officer arrives in 15-20 minutes</p>
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

        {/* Enhanced Price Calculator */}
        <div className={styles.priceSection}>
          <div className={styles.priceCard}>
            <div className={styles.priceHeader}>
              <h3 className={styles.priceTitle}>Protection Assignment Estimate</h3>
              {timeOption === 'now' && (
                <span className={styles.rushBadge}>Immediate Response</span>
              )}
            </div>

            <div className={styles.priceAmount}>£{estimatedPrice}</div>

            <div className={styles.priceBreakdown}>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>
                  <span className={styles.serviceIcon}>{selectedServiceData.icon}</span>
                  {selectedServiceData.name}
                </span>
                <span className={styles.breakdownValue}>{selectedServiceData.price}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Minimum Duration</span>
                <span className={styles.breakdownValue}>2 hours</span>
              </div>
              {timeOption === 'now' && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Immediate Response Fee</span>
                  <span className={styles.breakdownValue}>+25%</span>
                </div>
              )}
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Distance Charge</span>
                <span className={styles.breakdownValue}>£2.50/mile</span>
              </div>
            </div>

            <div className={styles.priceFeatures}>
              <div className={styles.includedFeatures}>
                <h4 className={styles.featuresTitle}>✓ Included</h4>
                {selectedServiceData.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className={styles.includedFeature}>{feature}</span>
                ))}
              </div>
            </div>

            <p className={styles.priceNote}>
              Final quote provided before confirmation • No booking fees • Transparent pricing
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className={styles.buttonSection}>
          <button
            className={styles.continueButton}
            onClick={handleContinue}
            disabled={!toLocation.trim() || (timeOption === 'schedule' && (!scheduledDate || !scheduledTime))}
          >
            💳 Continue to Secure Payment
          </button>
        </div>
      </div>
    </div>
  );
}