import React, { useState, useEffect } from 'react';
import { ServiceLevel, LocationData } from '../../types';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { calculateNationwideProtection, detectServiceRegion, getNationwideDestinations, isWithinServiceCoverage, NationwidePricingBreakdown } from '../../utils/nationwidePricing';
import styles from './LocationPicker.module.css';

interface LocationPickerProps {
  selectedService: ServiceLevel;
  onLocationConfirmed: (locationData: LocationData & { estimatedCost: number; pricingBreakdown: NationwidePricingBreakdown }) => void;
  onBack: () => void;
  onClose?: () => void;
  user: any;
}

// Nationwide popular destinations
const POPULAR_DESTINATIONS = getNationwideDestinations();

// London airports data with terminals
const LONDON_AIRPORTS = {
  LHR: {
    name: 'Heathrow',
    terminals: ['T2', 'T3', 'T4', 'T5'],
    popularFor: 'International flights',
    address: 'Heathrow Airport, London TW6'
  },
  LGW: {
    name: 'Gatwick',
    terminals: ['North', 'South'],
    popularFor: 'European flights',
    address: 'Gatwick Airport, West Sussex RH6'
  },
  STN: {
    name: 'Stansted',
    terminals: ['Main'],
    popularFor: 'Budget airlines',
    address: 'Stansted Airport, Essex CM24'
  },
  LCY: {
    name: 'London City',
    terminals: ['Main'],
    popularFor: 'Business flights',
    address: 'London City Airport, London E16'
  },
  LTN: {
    name: 'Luton',
    terminals: ['Main'],
    popularFor: 'Charter flights',
    address: 'Luton Airport, Bedfordshire LU2'
  },
  SEN: {
    name: 'Southend',
    terminals: ['Main'],
    popularFor: 'Regional flights',
    address: 'Southend Airport, Essex SS2'
  }
};

// Mock user protection history - in real app, this would come from API
const getMockProtectionHistory = (user: any) => {
  if (!user || user.userType === 'guest') return [];

  return [
    {
      address: 'Harrods, 87-135 Brompton Rd, Knightsbridge, London SW1X 7XL',
      name: 'Harrods, Knightsbridge',
      lastUsed: '3 days ago',
      timesUsed: 5
    },
    {
      address: 'One Canada Square, Canary Wharf, London E14 5AB',
      name: 'Canary Wharf, One Canada Square',
      lastUsed: '1 week ago',
      timesUsed: 12
    },
    {
      address: 'The Shard, 32 London Bridge St, London SE1 9SG',
      name: 'The Shard, London Bridge',
      lastUsed: '2 weeks ago',
      timesUsed: 3
    }
  ];
};

// Mock saved locations
const getMockSavedLocations = (user: any) => {
  if (!user || user.userType === 'guest') return {
    residence: null as string | null,
    office: null as string | null,
    custom: [] as string[]
  };

  return {
    residence: null as string | null, // 'Private Residence, Kensington, London W8'
    office: 'WeWork, 1 Poultry, London EC2R 8EJ' as string | null,
    custom: [] as string[]
  };
};

export function LocationPicker({ selectedService, onLocationConfirmed, onBack, onClose, user }: LocationPickerProps) {
  const [commencementPoint, setPickup] = useState('📍 Current Location');
  const [secureDestination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState<number>(0);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [protectionHours, setProtectionHours] = useState<number>(2);
  const [errors, setErrors] = useState<{ secureDestination?: string }>({});
  const [pricingBreakdown, setPricingBreakdown] = useState<NationwidePricingBreakdown | null>(null);
  const [serviceRegion, setServiceRegion] = useState<string>('');
  const [coverageStatus, setCoverageStatus] = useState<{covered: boolean; message: string} | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<{code: string, terminal?: string} | null>(null);
  const [showTerminalSelector, setShowTerminalSelector] = useState(false);

  // Get user's protection history and saved locations
  const protectionHistory = getMockProtectionHistory(user);
  const savedLocations = getMockSavedLocations(user);

  // Responsive placeholder text based on screen width
  const getPlaceholderText = () => {
    if (typeof window === 'undefined') return 'Enter any address in England or Wales';

    const width = window.innerWidth;
    if (width <= 320) return 'Where to?';
    if (width <= 480) return 'Destination';
    if (width <= 768) return 'Enter address in England or Wales';
    return 'Enter any address in England or Wales';
  };

  const [placeholderText, setPlaceholderText] = useState(getPlaceholderText());

  // Handle close with confirmation if data would be lost
  const handleClose = () => {
    if (secureDestination.trim() && onClose) {
      const shouldClose = window.confirm('Exit booking? Your progress will be lost.');
      if (shouldClose) {
        onClose();
      }
    } else if (onClose) {
      onClose();
    }
  };

  // Use current location by default
  const handleUseCurrentLocation = () => {
    setPickup('📍 Current Location');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickup('📍 Current Location (Confirmed)');
        },
        (error) => {
          console.warn('Location access denied, using default');
        }
      );
    }
  };

  // Handle airport selection
  const handleAirportSelect = (airportCode: string) => {
    const airport = LONDON_AIRPORTS[airportCode as keyof typeof LONDON_AIRPORTS];

    if (airport.terminals.length > 1) {
      setSelectedAirport({ code: airportCode });
      setShowTerminalSelector(true);
    } else {
      const fullAddress = `${airport.name} Airport (${airportCode}), ${airport.address}`;
      setDestination(fullAddress);
      setSelectedAirport({ code: airportCode, terminal: airport.terminals[0] });
      setShowTerminalSelector(false);
    }
  };

  // Handle terminal selection
  const handleTerminalSelect = (terminal: string) => {
    if (selectedAirport) {
      const airport = LONDON_AIRPORTS[selectedAirport.code as keyof typeof LONDON_AIRPORTS];
      const fullAddress = `${airport.name} Airport ${terminal} (${selectedAirport.code}), ${airport.address}`;
      setDestination(fullAddress);
      setSelectedAirport({ ...selectedAirport, terminal });
      setShowTerminalSelector(false);
    }
  };

  // Handle protection history selection
  const handleHistorySelect = (location: any) => {
    setDestination(location.address);
  };

  // Handle saved location selection
  const handleSavedLocationSelect = (address: string) => {
    setDestination(address);
  };

  // Handle responsive placeholder text
  useEffect(() => {
    const handleResize = () => {
      setPlaceholderText(getPlaceholderText());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time calculation with nationwide pricing
  useEffect(() => {
    if (commencementPoint && secureDestination && secureDestination.length > 3) {
      try {
        // Check service coverage
        const coverage = isWithinServiceCoverage(secureDestination);
        setCoverageStatus(coverage);

        if (coverage.covered) {
          // Calculate nationwide pricing
          const serviceLevel = selectedService.id === 'executive' ? 'Executive' : 'Essential';
          const isMember = user?.userType === 'registered' || user?.userType === 'google';

          const pricing = calculateNationwideProtection(
            commencementPoint,
            secureDestination,
            serviceLevel,
            {
              userType: user?.userType || 'guest',
              isMember
            }
          );

          setPricingBreakdown(pricing);
          setEstimatedDistance(pricing.vehicleOperation.miles);
          setEstimatedDuration(pricing.estimatedJourneyTime);
          setProtectionHours(pricing.protectionOfficer.hours);
          setServiceRegion(coverage.region);
        } else {
          // Outside service area
          setPricingBreakdown(null);
          setEstimatedDistance(0);
          setEstimatedDuration(0);
          setProtectionHours(2);
          setServiceRegion('');
        }
      } catch (error) {
        console.warn('Pricing calculation error:', error);
        // Fallback to mock data
        const mockDistance = Math.floor(Math.random() * 20) + 5;
        const mockDuration = Math.floor(mockDistance / 12 * 60);
        const calculatedHours = Math.max(2, Math.ceil(mockDuration / 60));

        setEstimatedDistance(mockDistance);
        setEstimatedDuration(mockDuration);
        setProtectionHours(calculatedHours);
        setPricingBreakdown(null);
      }
    } else {
      setEstimatedDistance(0);
      setEstimatedDuration(0);
      setProtectionHours(2);
      setPricingBreakdown(null);
      setCoverageStatus(null);
      setServiceRegion('');
    }
  }, [commencementPoint, secureDestination, selectedService, user]);

  const validateInputs = () => {
    const newErrors: { secureDestination?: string } = {};

    if (!secureDestination.trim()) {
      newErrors.secureDestination = 'Destination is required for your protection detail';
    }

    if (commencementPoint.trim() && secureDestination.trim() && commencementPoint.toLowerCase() === secureDestination.toLowerCase()) {
      newErrors.secureDestination = 'Destination must be different from commencement point location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCost = () => {
    if (pricingBreakdown) {
      return Math.round(pricingBreakdown.total);
    }
    // Fallback to legacy calculation
    const hasReward = user?.hasUnlockedReward && user?.userType !== 'guest';
    const baseHourlyRate = hasReward ? selectedService.hourlyRate * 0.5 : selectedService.hourlyRate;
    const totalCost = baseHourlyRate * protectionHours;
    return Math.round(totalCost);
  };

  const handleContinue = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    // Save to protection history (in real app, this would be an API call)
    if (user && user.userType !== 'guest') {
      const historyKey = 'armora_protection_history';
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const newLocation = {
        address: secureDestination.trim(),
        name: secureDestination.split(',')[0],
        lastUsed: new Date().toISOString(),
        timesUsed: 1
      };

      // Add to history, avoiding duplicates
      const updatedHistory = [newLocation, ...existingHistory.filter((loc: any) => loc.address !== newLocation.address)].slice(0, 10);
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const locationData: LocationData = {
      commencementPoint: commencementPoint.trim(),
      secureDestination: secureDestination.trim(),
      estimatedDistance,
      estimatedDuration
    };

    const estimatedCost = calculateCost();

    onLocationConfirmed({
      ...locationData,
      estimatedCost,
      pricingBreakdown: pricingBreakdown!
    });

    setIsLoading(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      {/* Header with back and close buttons */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className={styles.headerTitle}>Select Destination</h1>
        {onClose && (
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close booking">
            ✕ Close
          </button>
        )}
      </div>

      <div className={styles.content}>
        {/* Main search section */}
        <div className={styles.searchSection}>
          <h2 className={styles.sectionTitle}>WHERE DO YOU REQUIRE PROTECTION SERVICES?</h2>
          <p className={styles.coverageNote}>Nationwide coverage • England & Wales • London-based rapid response</p>

          {/* Protection starts from */}
          <div className={styles.fromSection}>
            <label className={styles.inputLabel}>Protection starts from:</label>
            <div className={styles.currentLocationCard} onClick={handleUseCurrentLocation}>
              <span className={styles.locationIcon}>📍</span>
              <div className={styles.locationInfo}>
                <div className={styles.locationText}>Current location detected</div>
                <div className={styles.locationSubtext}>Tap to change</div>
              </div>
            </div>
          </div>

          {/* Protection secureDestination */}
          <div className={styles.toSection}>
            <label className={styles.inputLabel}>Protection secureDestination:</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={secureDestination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={placeholderText}
                className={`${styles.searchInput} ${errors.secureDestination ? styles.inputError : ''}`}
                autoComplete="off"
              />
              <span className={styles.searchIcon}>🔍</span>
            </div>

            {errors.secureDestination && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {errors.secureDestination}
              </div>
            )}

            {/* Service coverage status */}
            {secureDestination && secureDestination.length > 3 && coverageStatus && (
              <div className={`${styles.coverageStatus} ${coverageStatus.covered ? styles.covered : styles.notCovered}`}>
                {coverageStatus.message}
              </div>
            )}
          </div>
        </div>

        {/* Protection History Section - Only show if user has history */}
        {protectionHistory.length > 0 && (
          <div className={styles.historySection}>
            <h3 className={styles.sectionTitle}>YOUR RECENT LOCATIONS</h3>
            <div className={styles.historyList}>
              {protectionHistory.map((location, index) => (
                <button
                  key={index}
                  className={styles.historyCard}
                  onClick={() => handleHistorySelect(location)}
                >
                  <span className={styles.historyIcon}>📍</span>
                  <div className={styles.historyInfo}>
                    <div className={styles.historyName}>{location.name}</div>
                    <div className={styles.historyMeta}>
                      Last protected: {location.lastUsed}
                      {location.timesUsed > 1 && ` • Used ${location.timesUsed} times`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Saved Locations Section */}
        <div className={styles.savedSection}>
          <h3 className={styles.sectionTitle}>SAVED LOCATIONS</h3>
          <div className={styles.savedList}>
            <div className={styles.savedCard}>
              <span className={styles.savedIcon}>🏠</span>
              <div className={styles.savedInfo}>
                <div className={styles.savedName}>Secure Residence</div>
                {savedLocations.residence ? (
                  <button
                    className={styles.savedAddress}
                    onClick={() => handleSavedLocationSelect(savedLocations.residence!)}
                  >
                    {savedLocations.residence}
                  </button>
                ) : (
                  <div className={styles.savedEmpty}>Not set - tap to add</div>
                )}
              </div>
            </div>

            <div className={styles.savedCard}>
              <span className={styles.savedIcon}>💼</span>
              <div className={styles.savedInfo}>
                <div className={styles.savedName}>Primary Office</div>
                {savedLocations.office ? (
                  <button
                    className={styles.savedAddress}
                    onClick={() => handleSavedLocationSelect(savedLocations.office!)}
                  >
                    {savedLocations.office}
                  </button>
                ) : (
                  <div className={styles.savedEmpty}>Not set - tap to add</div>
                )}
              </div>
            </div>

            <button className={styles.addLocationButton}>
              <span className={styles.addIcon}>+</span>
              Add custom location
            </button>
          </div>
        </div>

        {/* Popular Destinations Section */}
        <div className={styles.popularSection}>
          <h3 className={styles.sectionTitle}>POPULAR DESTINATIONS</h3>
          <div className={styles.secureDestinationTabs}>
            <div className={styles.tabContent}>
              <div className={styles.secureDestinationGrid}>
                {POPULAR_DESTINATIONS.filter(dest => dest.category === 'Airports').slice(0, 3).map((dest, index) => (
                  <button
                    key={index}
                    className={styles.secureDestinationButton}
                    onClick={() => setDestination(dest.address)}
                  >
                    <div className={styles.destName}>{dest.name}</div>
                    <div className={styles.destRegion}>{dest.region}</div>
                  </button>
                ))}
              </div>
              <div className={styles.secureDestinationGrid}>
                {POPULAR_DESTINATIONS.filter(dest => dest.category === 'Cities').slice(0, 4).map((dest, index) => (
                  <button
                    key={index}
                    className={styles.secureDestinationButton}
                    onClick={() => setDestination(dest.address)}
                  >
                    <div className={styles.destName}>{dest.name}</div>
                    <div className={styles.destRegion}>{dest.region}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* London Airports Section */}
        <div className={styles.airportsSection}>
          <h3 className={styles.sectionTitle}>LONDON AIRPORTS</h3>
          <div className={styles.airportGrid}>
            {Object.entries(LONDON_AIRPORTS).map(([code, airport]) => (
              <button
                key={code}
                className={styles.airportButton}
                onClick={() => handleAirportSelect(code)}
              >
                <div className={styles.airportCode}>{code}</div>
                <div className={styles.airportName}>{airport.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Selector Modal */}
        {showTerminalSelector && selectedAirport && (
          <div className={styles.terminalModal}>
            <div className={styles.terminalContent}>
              <h4 className={styles.terminalTitle}>
                Select Terminal - {LONDON_AIRPORTS[selectedAirport.code as keyof typeof LONDON_AIRPORTS].name}
              </h4>
              <div className={styles.terminalGrid}>
                {LONDON_AIRPORTS[selectedAirport.code as keyof typeof LONDON_AIRPORTS].terminals.map((terminal) => (
                  <button
                    key={terminal}
                    className={styles.terminalButton}
                    onClick={() => handleTerminalSelect(terminal)}
                  >
                    {terminal}
                  </button>
                ))}
              </div>
              <button
                className={styles.terminalClose}
                onClick={() => setShowTerminalSelector(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Nationwide pricing breakdown */}
        {commencementPoint && secureDestination && pricingBreakdown && coverageStatus?.covered && (
          <div className={styles.estimateCard}>
            <div className={styles.cardHeader}>
              <h4>YOUR PROTECTION SERVICE</h4>
              <div className={styles.serviceArea}>{serviceRegion} ✓</div>
            </div>

            <div className={styles.journeyDetails}>
              <div className={styles.routeInfo}>
                <div className={styles.routePoint}>
                  <span className={styles.routeIcon}>📍</span>
                  <span>From: Current Location</span>
                </div>
                <div className={styles.routePoint}>
                  <span className={styles.routeIcon}>📍</span>
                  <span>To: {secureDestination.split(',')[0]}</span>
                </div>
              </div>

              <div className={styles.tripMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>📏</span>
                  <span>Distance: {pricingBreakdown.vehicleOperation.miles} miles</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>⏱️</span>
                  <span>Est. time: {formatDuration(pricingBreakdown.estimatedJourneyTime)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>📍</span>
                  <span>Service Area: {serviceRegion} ✓</span>
                </div>
              </div>
            </div>

            <div className={styles.pricingBreakdown}>
              <h5>PRICING BREAKDOWN</h5>
              <div className={styles.priceRow}>
                <span>Protection Officer ({pricingBreakdown.protectionOfficer.hours}h min)</span>
                <span>{formatCurrency(pricingBreakdown.protectionOfficer.total)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Secure Vehicle ({pricingBreakdown.vehicleOperation.miles} mi × £{pricingBreakdown.vehicleOperation.ratePerMile})</span>
                <span>{formatCurrency(pricingBreakdown.vehicleOperation.total)}</span>
              </div>
              {pricingBreakdown.deploymentSurcharge && (
                <div className={styles.priceRow}>
                  <span>{pricingBreakdown.deploymentSurcharge.reason}</span>
                  <span>{formatCurrency(pricingBreakdown.deploymentSurcharge.amount)}</span>
                </div>
              )}
              <div className={styles.priceRow}>
                <span>Booking Fee{pricingBreakdown.bookingFee.waived ? ' (waived)' : ''}</span>
                <span>{pricingBreakdown.bookingFee.waived ? '£0.00' : formatCurrency(pricingBreakdown.bookingFee.amount)}</span>
              </div>
              {pricingBreakdown.memberDiscount && (
                <div className={`${styles.priceRow} ${styles.discount}`}>
                  <span>Member Discount ({pricingBreakdown.memberDiscount.percentage}%)</span>
                  <span>-{formatCurrency(pricingBreakdown.memberDiscount.amount)}</span>
                </div>
              )}
              <div className={`${styles.priceRow} ${styles.total}`}>
                <span>TOTAL</span>
                <span>{formatCurrency(pricingBreakdown.total)}</span>
              </div>
            </div>

            <div className={styles.serviceCoverage}>
              {pricingBreakdown.serviceCoverage}
            </div>
          </div>
        )}
      </div>

      {/* Continue button */}
      <div className={styles.footer}>
        <button
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={!secureDestination || isLoading || (coverageStatus ? !coverageStatus.covered : false)}
        >
          {isLoading ? (
            <LoadingSpinner size="small" variant="light" text="Processing..." inline />
          ) : coverageStatus && !coverageStatus.covered ? (
            "Service area not available"
          ) : (
            "Continue to Payment"
          )}
        </button>

        <div className={styles.protectionNote}>
          <span className={styles.shieldIcon}>🛡️</span>
          <span>2-hour minimum • SIA licensed CPO • Real-time tracking</span>
        </div>
      </div>
    </div>
  );
}