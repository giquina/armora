import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './UnifiedProtectionBooking.module.css';
import '../../styles/booking-white-theme.css';

interface PriceEstimate {
  journey: number;
  venue: number;
  vehicle: number;
  total: number;
  memberPrice: number;
  savings: number;
  hours: number;
  distance: number;
}

type ServiceLevel = 'essential' | 'executive' | 'shadow';

interface AdditionalOptions {
  femaleOfficer: boolean;
  discreteProtection: boolean;
  shoppingAssistance: boolean;
}

interface AvailabilityData {
  nearbyOfficers: number;
  nearestTime: string;
  rating: number;
  lastUpdated: number;
}

const SERVICE_LEVELS = {
  essential: { name: 'Essential', rate: 50, description: 'SIA Level 2 certified officer' },
  executive: { name: 'Executive', rate: 75, description: 'SIA Level 3 certified officers' },
  shadow: { name: 'Shadow', rate: 65, description: 'Specialist protection officer', popular: true }
};

export function UnifiedProtectionBooking() {
  const { state, navigateToView } = useApp();
  const { user } = state;

  // Protection service state
  const [secureDestination, setSecureDestination] = useState('');
  const [venueProtection, setVenueProtection] = useState(false);
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>('shadow');
  const [venueTime, setVenueTime] = useState(2);
  const [additionalOptions, setAdditionalOptions] = useState<AdditionalOptions>({
    femaleOfficer: false,
    discreteProtection: false,
    shoppingAssistance: false
  });
  const [showQuote, setShowQuote] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);

  // Live availability state
  const [availability, setAvailability] = useState<AvailabilityData>({
    nearbyOfficers: 10,
    nearestTime: '2-4 min',
    rating: 4.9,
    lastUpdated: Date.now()
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Load saved addresses for quick secure destination buttons
  useEffect(() => {
    const homeAddress = localStorage.getItem('armora_home_address');
    const workAddress = localStorage.getItem('armora_work_address');

    // Pre-populate if user has saved addresses and no secure destination set
    if (homeAddress && !secureDestination) {
      // Don't auto-populate, let user choose
    }
  }, [secureDestination]);

  // Simulate real-time availability updates
  const updateAvailability = useCallback(() => {
    setIsUpdating(true);

    setTimeout(() => {
      setAvailability(prev => ({
        ...prev,
        nearbyOfficers: Math.floor(Math.random() * 6) + 8, // 8-13 officers
        nearestTime: Math.random() > 0.5 ? "2-4 min" : "3-6 min",
        lastUpdated: Date.now()
      }));
      setIsUpdating(false);
    }, 500);
  }, []);

  // Auto-update availability every 45 seconds
  useEffect(() => {
    const interval = setInterval(updateAvailability, 45000);
    return () => clearInterval(interval);
  }, [updateAvailability]);

  // Smart suggestions based on secure destination
  const getSuggestions = (dest: string) => {
    const lower = dest.toLowerCase();
    if (lower.includes('airport') || lower.includes('heathrow') || lower.includes('gatwick')) {
      return { venueProtection: true, suggestions: ['luggage assistance', 'check-in escort'] };
    }
    if (lower.includes('shop') || lower.includes('mall') || lower.includes('westfield')) {
      return { venueProtection: true, suggestions: ['shopping assistance', 'package carrying'] };
    }
    if (lower.includes('restaurant') || lower.includes('bar') || lower.includes('club')) {
      return { venueProtection: true, suggestions: ['evening protection', 'safe departure'] };
    }
    return { venueProtection: false, suggestions: [] };
  };

  // Calculate protection fee
  const calculateProtectionFee = useCallback(async () => {
    if (!secureDestination.trim()) return;

    setIsCalculating(true);
    setShowQuote(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Mock distance calculation (would use Maps API in production)
      const distance = Math.random() * 20 + 5; // 5-25 km
      const estimatedTime = Math.max(2, Math.ceil((distance * 2.5 + 15) / 60)); // Minimum 2 hours

      // Base journey protection fee
      const serviceRate = SERVICE_LEVELS[serviceLevel].rate;
      const journeyFee = estimatedTime * serviceRate;

      // Venue protection fee (if selected)
      const venueFee = venueProtection ? venueTime * 15 : 0;

      // Vehicle operation fee (distance-based)
      const vehicleFee = distance * 2.5;

      const total = journeyFee + venueFee + vehicleFee;
      const memberPrice = user?.userType !== 'guest' ? total * 0.8 : total;
      const savings = total - memberPrice;

      const priceEstimate: PriceEstimate = {
        journey: Math.round(journeyFee),
        venue: Math.round(venueFee),
        vehicle: Math.round(vehicleFee),
        total: Math.round(total),
        memberPrice: Math.round(memberPrice),
        savings: Math.round(savings),
        hours: estimatedTime,
        distance: Math.round(distance * 10) / 10
      };

      setEstimate(priceEstimate);

      // Analytics
      console.log('[Analytics] Unified quote calculated', {
        destination: secureDestination,
        serviceLevel,
        venueProtection,
        estimate: priceEstimate,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Quote calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [secureDestination, serviceLevel, venueProtection, venueTime, user?.userType]);

  // Handle quick secure destination selection
  const handleQuickDestination = (type: 'home' | 'office' | 'airport') => {
    const secureDestinations = {
      home: localStorage.getItem('armora_home_address') || 'Home Address',
      office: localStorage.getItem('armora_work_address') || 'Office',
      airport: 'London Heathrow Airport (LHR)'
    };

    setSecureDestination(secureDestinations[type]);

    // Auto-suggest venue protection for airports
    if (type === 'airport') {
      setVenueProtection(true);
      setAdditionalOptions(prev => ({ ...prev, shoppingAssistance: true }));
    }
  };

  // Handle protection service confirmation
  const handleConfirmProtection = () => {
    if (estimate) {
      // Store protection service data
      localStorage.setItem('armora_booking_data', JSON.stringify({
        destination: secureDestination,
        serviceLevel,
        venueProtection,
        venueTime,
        additionalOptions,
        estimate
      }));

      // Navigate to full protection service flow
      navigateToView('booking');
    }
  };

  return (
    <div className={`${styles.unifiedContainer} booking-white-theme`}>
      {/* Live Status Header */}
      <div className={styles.liveStatus}>
        <span className={`${styles.statusDot} ${isUpdating ? styles.updating : ''}`}>🟢</span>
        <span className={styles.statusText}>
          {availability.nearbyOfficers} Protection Officers Ready • Nearest: {availability.nearestTime} • {availability.rating}★
        </span>
        <button
          className={styles.refreshButton}
          onClick={updateAvailability}
          disabled={isUpdating}
          aria-label="Refresh availability"
        >
          <span className={`${styles.refreshIcon} ${isUpdating ? styles.spinning : ''}`}>🔄</span>
        </button>
      </div>

      {/* Secure Destination Input */}
      <div className={styles.destinationSection}>
        <label className={styles.sectionLabel}>
          WHERE DO YOU NEED PROTECTION?
        </label>
        <div className={styles.destinationInput}>
          <span className={styles.inputIcon}>📍</span>
          <input
            type="text"
            placeholder="Enter secure destination or select below"
            value={secureDestination}
            onChange={(e) => setSecureDestination(e.target.value)}
            className={styles.textInput}
          />
          <button
            className={styles.searchBtn}
            onClick={() => {/* Would implement location search */}}
            aria-label="Search location"
          >
            🔍
          </button>
        </div>

        {/* Quick Secure Destinations */}
        <div className={styles.quickDestinations}>
          <button
            className={styles.quickBtn}
            onClick={() => handleQuickDestination('home')}
          >
            🏠 Home
          </button>
          <button
            className={styles.quickBtn}
            onClick={() => handleQuickDestination('office')}
          >
            🏢 Office
          </button>
          <button
            className={styles.quickBtn}
            onClick={() => handleQuickDestination('airport')}
          >
            ✈️ Airport
          </button>
        </div>
      </div>

      {/* Protection Included Banner */}
      <div className={styles.includedBanner}>
        <h4>🛡️ JOURNEY PROTECTION ALWAYS INCLUDED:</h4>
        <ul className={styles.includedList}>
          <li>✓ SIA-licensed close protection officer</li>
          <li>✓ Secure journey & threat assessment</li>
          <li>✓ Real-time route monitoring</li>
          <li>✓ Safe arrival protocols</li>
        </ul>
      </div>

      {/* Venue Protection Option */}
      <div className={styles.venueSection}>
        <label className={styles.sectionLabel}>
          AT YOUR SECURE DESTINATION:
        </label>

        <div className={styles.venueOptions}>
          <label className={`${styles.venueOption} ${!venueProtection ? styles.selected : ''}`}>
            <input
              type="radio"
              name="venue"
              checked={!venueProtection}
              onChange={() => setVenueProtection(false)}
            />
            <div className={styles.optionContent}>
              <h4>⏱️ VEHICLE STANDBY</h4>
              <p>Officer secures vehicle & waits</p>
              <span className={styles.price}>Included</span>
            </div>
          </label>

          <label className={`${styles.venueOption} ${venueProtection ? styles.selected : ''}`}>
            <input
              type="radio"
              name="venue"
              checked={venueProtection}
              onChange={() => setVenueProtection(true)}
            />
            <div className={styles.optionContent}>
              <h4>🏢 VENUE PROTECTION</h4>
              <p>Officer accompanies you inside</p>
              <span className={styles.price}>+£15/hr</span>
            </div>
          </label>
        </div>

        {venueProtection && (
          <div className={styles.venueTime}>
            <label>Estimated time at venue:</label>
            <select
              value={venueTime}
              onChange={(e) => setVenueTime(Number(e.target.value))}
              className={styles.timeSelect}
            >
              <option value={0.5}>30 minutes</option>
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4+ hours</option>
            </select>
          </div>
        )}
      </div>

      {/* Service Level Selection */}
      <div className={styles.serviceSection}>
        <label className={styles.sectionLabel}>SERVICE LEVEL:</label>
        <div className={styles.serviceLevels}>
          {Object.entries(SERVICE_LEVELS).map(([id, service]) => (
            <button
              key={id}
              className={`${styles.serviceBtn} ${serviceLevel === id ? styles.selected : ''}`}
              onClick={() => setServiceLevel(id as ServiceLevel)}
            >
              <span className={styles.serviceName}>{service.name}</span>
              <span className={styles.servicePrice}>£{service.rate}/hr</span>
              {'popular' in service && service.popular && <span className={styles.badge}>Popular</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options (Collapsible) */}
      <details
        className={styles.additionalOptions}
        open={showAdditionalOptions}
        onToggle={(e) => setShowAdditionalOptions((e.target as HTMLDetailsElement).open)}
      >
        <summary>Additional Protection Options</summary>
        <div className={styles.optionsList}>
          <label className={styles.optionItem}>
            <input
              type="checkbox"
              checked={additionalOptions.femaleOfficer}
              onChange={(e) => setAdditionalOptions({
                ...additionalOptions,
                femaleOfficer: e.target.checked
              })}
            />
            <span>👩 Female Protection Officer (subject to availability)</span>
          </label>
          <label className={styles.optionItem}>
            <input
              type="checkbox"
              checked={additionalOptions.discreteProtection}
              onChange={(e) => setAdditionalOptions({
                ...additionalOptions,
                discreteProtection: e.target.checked
              })}
            />
            <span>🕶️ Discrete Protection (plainclothes)</span>
          </label>
          <label className={styles.optionItem}>
            <input
              type="checkbox"
              checked={additionalOptions.shoppingAssistance}
              onChange={(e) => setAdditionalOptions({
                ...additionalOptions,
                shoppingAssistance: e.target.checked
              })}
            />
            <span>🛍️ Shopping Assistance</span>
          </label>
        </div>
      </details>

      {/* Quote Button */}
      <button
        className={`${styles.quoteBtn} ${isCalculating ? styles.calculating : ''}`}
        onClick={calculateProtectionFee}
        disabled={!secureDestination.trim() || isCalculating}
      >
        {isCalculating ? (
          <>
            <span className={styles.spinner}>⏳</span>
            Calculating Protection Fee...
          </>
        ) : (
          'Calculate Protection Fee →'
        )}
      </button>

      {/* Quote Display */}
      {showQuote && estimate && (
        <div className={styles.quoteDisplay}>
          <div className={styles.quoteHeader}>
            <h4>🛡️ Your Protection Quote</h4>
            <span className={styles.quoteRoute}>To: {secureDestination}</span>
          </div>

          <div className={styles.quoteBreakdown}>
            <div className={styles.quoteRow}>
              <span>Journey Protection ({estimate.hours}h):</span>
              <span>£{estimate.journey}</span>
            </div>
            {venueProtection && (
              <div className={styles.quoteRow}>
                <span>Venue Protection ({venueTime}h):</span>
                <span>£{estimate.venue}</span>
              </div>
            )}
            <div className={styles.quoteRow}>
              <span>Vehicle Operation ({estimate.distance}km):</span>
              <span>£{estimate.vehicle}</span>
            </div>
            <div className={styles.quoteDivider}></div>
            <div className={styles.quoteRow + ' ' + styles.quoteTotal}>
              <span>Total Protection Fee:</span>
              <span>£{estimate.total}</span>
            </div>
            {user?.userType !== 'guest' && estimate.savings > 0 && (
              <div className={styles.quoteRow + ' ' + styles.quoteMember}>
                <span>Member Price:</span>
                <span>
                  £{estimate.memberPrice}
                  <span className={styles.savings}>Save £{estimate.savings}</span>
                </span>
              </div>
            )}
          </div>

          <div className={styles.quoteActions}>
            {user?.userType === 'guest' ? (
              <button
                className={styles.signupCTA}
                onClick={() => navigateToView('signup')}
              >
                Create Account to Arrange Protection & Save £{estimate.savings}
              </button>
            ) : (
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmProtection}
              >
                Confirm Protection Assignment →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Protection Service Banner - Moved to Bottom */}
      <div className={styles.protectionBanner}>
        <div className={styles.bannerIcon}>🛡️</div>
        <h3 className={styles.bannerTitle}>Your Protection Service</h3>
        <div className={styles.bannerFeatures}>
          <span>SIA-licensed officers</span>
          <span className={styles.dot}>•</span>
          <span>2hr minimum</span>
          <span className={styles.dot}>•</span>
          <span>Secure transport</span>
        </div>
        <div className={styles.bannerRating}>
          ⭐ 4.9 rating from 2,847 assignments
        </div>
      </div>
    </div>
  );
}

export default UnifiedProtectionBooking;