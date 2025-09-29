import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SituationSelector } from './components/SituationSelector';
import { ServiceComparison, SERVICE_TIERS } from './components/ServiceComparison';
import { WhatYouGet } from './components/WhatYouGet';
import { OfficerProfile } from './components/OfficerProfile';
import { LocationInput } from './components/LocationInput';
import { TimeSelection } from './components/TimeSelection';
import { BottomActionBar } from './components/BottomActionBar';
import type { Situation } from './components/SituationSelector';
import type { ServiceTier } from './components/ServiceComparison';
import styles from './ProtectionRequest.module.css';

interface ProtectionRequestProps {
  onAssignmentRequested: () => void;
  className?: string;
}

interface TimeOption {
  value: string;
  label: string;
  description: string;
  badge?: string;
}

// Generate time options with actual clock times
const generateTimeOptions = (): TimeOption[] => {
  const now = new Date();
  const immediate = new Date(now.getTime() + 3 * 60000); // 3 minutes from now
  const thirtyMin = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
  const oneHour = new Date(now.getTime() + 60 * 60000); // 1 hour from now

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return [
    {
      value: 'now',
      label: '⚡ IMMEDIATE',
      description: `Protection commences: ${formatTime(immediate)}`,
      badge: 'FASTEST'
    },
    {
      value: '30min',
      label: '📅 IN 30 MIN',
      description: `Protection commences: ${formatTime(thirtyMin)}`
    },
    {
      value: '1hour',
      label: '📅 IN 1 HOUR',
      description: `Protection commences: ${formatTime(oneHour)}`
    },
    {
      value: 'schedule',
      label: '🗓️ SCHEDULE',
      description: 'Pick specific date/time'
    }
  ];
};

export function ProtectionRequest({ onAssignmentRequested, className }: ProtectionRequestProps) {
  const { state, navigateToView } = useApp();
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceTier | null>(null);

  // Check for preselected service from context
  const preselectedServiceId = state.assignmentContext?.preselectedService;
  const source = state.assignmentContext?.source;
  const [pickupLocation, setPickupLocation] = useState('');
  const [secureDestination, setSecureDestination] = useState('');
  const [commencementTime, setCommencementTime] = useState('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [recentLocations, setRecentLocations] = useState<string[]>([]);

  // Generate time options with current time
  const timeOptions = useMemo(() => generateTimeOptions(), []);

  // Handle preselected service from context
  useEffect(() => {
    if (preselectedServiceId && !selectedService) {
      const preselectedService = SERVICE_TIERS.find(tier => tier.id === preselectedServiceId);
      if (preselectedService) {
        setSelectedService(preselectedService);
      }
    }
  }, [preselectedServiceId, selectedService]);

  // Terms acceptance state
  const [terms, setTerms] = useState({
    understandService: false,
    agreeVerification: false,
    acceptTerms: false
  });

  // Handle situation selection
  const handleSituationSelect = useCallback((situation: Situation | null) => {
    setSelectedSituation(situation);
  }, []);

  // Handle service selection with toggle functionality
  const handleServiceSelect = useCallback((service: ServiceTier | null) => {
    setSelectedService(service);
  }, []);

  // Handle terms changes
  const handleTermChange = useCallback((term: keyof typeof terms) => {
    setTerms(prev => ({ ...prev, [term]: !prev[term] }));
  }, []);

  // Load recent locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('armora_recent_destinations');
    if (saved) {
      try {
        setRecentLocations(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load recent destinations:', error);
      }
    }
  }, []);

  // Save destination to recent locations
  const saveDestination = useCallback((destination: string) => {
    if (!destination.trim()) return;

    const updated = [destination, ...recentLocations.filter(loc => loc !== destination)].slice(0, 5);
    setRecentLocations(updated);
    localStorage.setItem('armora_recent_destinations', JSON.stringify(updated));
  }, [recentLocations]);

  // Select a location from recent/default list
  const selectLocation = useCallback((location: string) => {
    const cleanLocation = location.replace(/📍|🏢|🏠/, '').trim().replace(' (Saved)', '');
    setSecureDestination(cleanLocation);
  }, []);

  // Dynamic page titles based on preselected service
  const getPageTitle = useMemo(() => {
    if (preselectedServiceId && source) {
      const serviceName = SERVICE_TIERS.find(tier => tier.id === preselectedServiceId)?.shortName || 'Protection';
      return `Request ${serviceName} Protection`;
    }
    return 'Arrange Protection Services';
  }, [preselectedServiceId, source]);

  const getPageSubtitle = useMemo(() => {
    if (preselectedServiceId && source === 'home') {
      return `Selected from Home • SIA-licensed professionals across England & Wales`;
    }
    return 'Professional security officers across England & Wales';
  }, [preselectedServiceId, source]);

  // Calculate service fee (minimum 2 hours) - memoized to prevent re-computation
  const serviceFeeCalculation = useMemo(() => {
    if (!selectedService) {
      return {
        originalFee: 0,
        finalFee: 0,
        hasDiscount: false,
        savings: 0
      };
    }

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
  }, [selectedService, state.user?.hasUnlockedReward, state.user?.userType]);

  const { originalFee, finalFee, hasDiscount, savings } = serviceFeeCalculation;

  // Check if ready to request protection - memoized to prevent re-computation
  const isReadyToRequest = useMemo(() => {
    const termsAccepted = Object.values(terms).every(v => v === true);
    return selectedService &&
           secureDestination.trim() &&
           (commencementTime !== 'schedule' || scheduledDateTime) &&
           termsAccepted;
  }, [selectedService, secureDestination, commencementTime, scheduledDateTime, terms]);

  // Handle navigation actions
  const handleClose = useCallback(() => {
    navigateToView('home');
  }, [navigateToView]);


  const handleChangeSelection = useCallback(() => {
    // Scroll to service comparison section
    const element = document.querySelector('[data-section="service-comparison"]');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handle protection request
  const handleRequestProtection = useCallback(() => {
    if (!isReadyToRequest || !selectedService) return;

    // Save destination to recent locations
    saveDestination(secureDestination);

    // Store assignment data
    const assignmentData = {
      selectedSituation: selectedSituation?.id || 'general',
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
  }, [isReadyToRequest, saveDestination, secureDestination, selectedSituation, selectedService, commencementTime, scheduledDateTime, finalFee, originalFee, hasDiscount, savings, state.user, onAssignmentRequested]);

  // Format deployment time - memoized to prevent re-computation
  const deploymentInfo = useMemo(() => {
    if (!selectedService) return undefined;

    if (commencementTime === 'now') {
      return `CPO deployment: ${selectedService.responseTime || '2-4 min'}`;
    } else if (commencementTime === '30min') {
      return 'Protection commences in 30 minutes';
    } else if (commencementTime === '1hour') {
      return 'Protection commences in 1 hour';
    } else if (commencementTime === 'schedule' && scheduledDateTime) {
      const date = new Date(scheduledDateTime);
      return `Protection commences: ${date.toLocaleString('en-GB')}`;
    }
    return 'Select commencement time';
  }, [commencementTime, selectedService, scheduledDateTime]);

  return (
    <div className={`${styles.protectionRequest} ${className || ''}`}>
      {/* Back Button */}
      <button
        className={styles.backButton}
        onClick={handleClose}
        aria-label="Go back"
        type="button"
      >
        <span>←</span>
      </button>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.statusLine}>🟢 Officers Available Now</div>
        <h1 className={styles.title}>{getPageTitle}</h1>
        <p className={styles.subtitle}>{getPageSubtitle}</p>
        <div className={styles.trustBadges}>
          <span className={styles.badge}>⚡ Fast response</span>
          <span className={styles.badge}>📍 Nationwide coverage</span>
          <span className={styles.badge}>✓ SIA & Government licensed</span>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* SECTION 2: LOCATION INPUT - Move to top */}
        <div className={styles.locationSection}>
          <LocationInput
            value={secureDestination}
            onChange={setSecureDestination}
            pickupLocation={pickupLocation}
            onPickupChange={setPickupLocation}
            recentLocations={recentLocations}
            onLocationSelect={selectLocation}
          />

          {/* Journey Summary - Shows when both locations are entered */}
          {pickupLocation.trim() && secureDestination.trim() && (
            <div className={styles.journeySummary}>
              <div className={styles.journeyRoute}>
                <div className={styles.routeItem}>
                  <span className={styles.routeIcon}>📍</span>
                  <span className={styles.routeText}>{pickupLocation}</span>
                </div>
                <div className={styles.routeArrow}>→</div>
                <div className={styles.routeItem}>
                  <span className={styles.routeIcon}>🎯</span>
                  <span className={styles.routeText}>{secureDestination}</span>
                </div>
              </div>
              <p className={styles.journeyNote}>✓ Your protection officer will drive you safely between these locations</p>
            </div>
          )}
        </div>

        {/* SECTION 3: SITUATION SELECTOR */}
        <div className={styles.situationSection}>
          <SituationSelector
            selectedSituation={selectedSituation?.id || null}
            onSituationSelect={handleSituationSelect}
          />
          {!selectedSituation && (
            <div className={styles.skipOption}>
              <button
                className={styles.skipButton}
                onClick={() => document.querySelector('[data-section="service-comparison"]')?.scrollIntoView({ behavior: 'smooth' })}
                type="button"
              >
                Skip to service selection →
              </button>
            </div>
          )}
        </div>

        {/* SECTION 3: SERVICE COMPARISON - Move before location */}
        <div data-section="service-comparison">
          <ServiceComparison
            selectedServiceId={selectedService?.id || null}
            onServiceSelect={handleServiceSelect}
            recommendedService={selectedSituation?.recommended}
            preselectedServiceId={preselectedServiceId}
            source={source}
          />
        </div>
        {/* SECTION 4: TIME SELECTION - Show when service selected */}
        {selectedService && (
          <div className={styles.timeSelectionSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderIcon}>⏰</div>
              <div className={styles.sectionHeaderContent}>
                <h2 className={styles.sectionTitle}>When do you need protection?</h2>
                <p className={styles.sectionSubtitle}>Choose your preferred start time</p>
              </div>
            </div>

            <TimeSelection
              timeOptions={timeOptions}
              selectedTime={commencementTime}
              onTimeChange={setCommencementTime}
              scheduledDateTime={scheduledDateTime}
              onScheduledDateTimeChange={setScheduledDateTime}
            />
          </div>
        )}

        {/* What You Get */}
        {selectedSituation && selectedService && (
          <WhatYouGet
            situation={selectedSituation.id}
            service={selectedService.id}
          />
        )}

        {/* Officer Profile */}
        {selectedService && (
          <OfficerProfile selectedService={selectedService.id} />
        )}

        {/* SECTION 5: CONFIRMATION DETAILS */}
        {selectedService && secureDestination && (
          <div className={styles.confirmationSection}>
            <h2 className={styles.sectionTitle}>Confirmation Details</h2>

            {/* Selected Options Summary */}
            <div className={styles.selectionSummary}>
              {selectedSituation && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Protection Type:</span>
                  <span className={styles.summaryValue}>{selectedSituation.label}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Service Tier:</span>
                <span className={styles.summaryValue}>{selectedService.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Service Fee:</span>
                <span className={styles.summaryValue}>£{finalFee.toFixed(2)}</span>
              </div>
              {pickupLocation && secureDestination && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Journey:</span>
                  <span className={styles.summaryValue}>{pickupLocation} → {secureDestination}</span>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className={styles.termsSection}>
              <h3 className={styles.termsTitle}>Terms & Conditions</h3>

              <label className={styles.termItem}>
                <input
                  type="checkbox"
                  checked={terms.understandService}
                  onChange={() => handleTermChange('understandService')}
                  className={styles.checkbox}
                />
                <span className={styles.termText}>
                  I understand this is a 2-hour minimum security service
                </span>
              </label>

              <label className={styles.termItem}>
                <input
                  type="checkbox"
                  checked={terms.agreeVerification}
                  onChange={() => handleTermChange('agreeVerification')}
                  className={styles.checkbox}
                />
                <span className={styles.termText}>
                  I agree to officer ID verification on arrival
                </span>
              </label>

              <label className={styles.termItem}>
                <input
                  type="checkbox"
                  checked={terms.acceptTerms}
                  onChange={() => handleTermChange('acceptTerms')}
                  className={styles.checkbox}
                />
                <span className={styles.termText}>
                  I accept the terms of service
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: BOTTOM ACTION BAR - Fixed positioning */}
      <BottomActionBar
        isValid={!selectedService ? false : isReadyToRequest}
        pricing={selectedService ? {
          basePrice: originalFee,
          discountAmount: hasDiscount ? savings : undefined,
          finalPrice: finalFee,
          hasDiscount,
          originalPrice: hasDiscount ? originalFee : undefined
        } : undefined}
        serviceInfo={selectedService ? {
          name: selectedService.name,
          rate: selectedService.rate,
          hourlyRate: selectedService.hourlyRate,
          situation: selectedSituation?.label,
          journeyRoute: pickupLocation && secureDestination ? `${pickupLocation} → ${secureDestination}` : undefined
        } : undefined}
        primaryButtonText={
          !selectedService
            ? 'Select Protection Level Above'
            : !Object.values(terms).every(v => v)
            ? `Request ${selectedService.shortName || selectedService.name} - £${finalFee.toFixed(2)}`
            : `Request ${selectedService.shortName || selectedService.name} - £${finalFee.toFixed(2)}`
        }
        onPrimaryAction={!selectedService ? undefined : handleRequestProtection}
        onChangeSelection={selectedService ? handleChangeSelection : undefined}
        additionalInfo={deploymentInfo}
      />
    </div>
  );
}