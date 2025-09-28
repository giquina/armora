import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SituationSelector } from './components/SituationSelector';
import { ServiceComparison } from './components/ServiceComparison';
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
  const [pickupLocation, setPickupLocation] = useState('');
  const [secureDestination, setSecureDestination] = useState('');
  const [commencementTime, setCommencementTime] = useState('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [recentLocations, setRecentLocations] = useState<string[]>([]);

  // Generate time options with current time
  const timeOptions = useMemo(() => generateTimeOptions(), []);

  // Terms acceptance state
  const [terms, setTerms] = useState({
    understandService: false,
    agreeVerification: false,
    acceptTerms: false
  });

  // Handle situation selection
  const handleSituationSelect = useCallback((situation: Situation) => {
    setSelectedSituation(situation);
  }, []);

  // Handle service selection
  const handleServiceSelect = useCallback((service: ServiceTier) => {
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
    // Scroll to situation selector
    const element = document.querySelector('[data-section="situation-selector"]');
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
    if (!selectedService) return 'Select protection service';

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
        <h1 className={styles.title}>Arrange Protection Services</h1>
        <p className={styles.subtitle}>Professional security officers across England & Wales</p>
        <div className={styles.trustBadges}>
          <span className={styles.badge}>⚡ Fast response</span>
          <span className={styles.badge}>📍 Nationwide coverage</span>
          <span className={styles.badge}>✓ SIA & Government licensed</span>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Section 1: Journey Location & Time - MOVED TO FIRST */}
        <div className={styles.locationTimeSection}>
          <div className={styles.journeyHeader}>
            <div className={styles.journeyHeaderIcon}>🛡️</div>
            <div className={styles.journeyHeaderContent}>
              <h2 className={styles.journeyTitle}>Plan Your Protection</h2>
              <p className={styles.journeySubtitle}>
                Professional CPO with secure vehicle • Door-to-door service
              </p>
            </div>
          </div>

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

          <TimeSelection
            timeOptions={timeOptions}
            selectedTime={commencementTime}
            onTimeChange={setCommencementTime}
            scheduledDateTime={scheduledDateTime}
            onScheduledDateTimeChange={setScheduledDateTime}
          />
        </div>

        {/* Section 2: Situation Selector - NOW SHOWS AFTER JOURNEY ENTERED */}
        {pickupLocation.trim() && secureDestination.trim() && (
          <div data-section="situation-selector">
            <div className={styles.journeyContext}>
              <p className={styles.journeyContextText}>
                🛡️ <strong>Your protection journey:</strong><br />
                📍 {pickupLocation} → {secureDestination}
                {commencementTime === 'now' && ' • Immediate protection'}
                {commencementTime !== 'now' && commencementTime !== 'schedule' && ` • In ${commencementTime === '30min' ? '30 minutes' : '1 hour'}`}
                {commencementTime === 'schedule' && scheduledDateTime && ` • ${new Date(scheduledDateTime).toLocaleString('en-GB')}`}
              </p>
              <p className={styles.journeySubtext}>Select protection for your journey:</p>
            </div>
            <SituationSelector
              selectedSituation={selectedSituation?.id || null}
              onSituationSelect={handleSituationSelect}
            />
          </div>
        )}

        {/* Section 3: Journey Benefits - SHOWS AFTER SITUATION SELECTED */}
        {selectedSituation && (
          <div className={styles.journeyDetailsSection}>
            <h2 className={styles.sectionTitle}>🛡️ What's included in your protection service</h2>
            <div className={styles.journeyInfo}>
              <p className={styles.journeyDescription}>
                Your protection officer will provide secure transport in a professional vehicle as part of your protection service.
              </p>
              <div className={styles.journeyBenefits}>
                <span className={styles.benefit}>✓ Secure vehicle provided</span>
                <span className={styles.benefit}>✓ Protection officer drives you safely</span>
                <span className={styles.benefit}>✓ Door-to-door security service</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Service Comparison */}
        <ServiceComparison
          selectedServiceId={selectedService?.id || null}
          onServiceSelect={handleServiceSelect}
          recommendedService={selectedSituation?.recommended}
        />

        {/* Section 3: What You Get */}
        {selectedSituation && selectedService && (
          <WhatYouGet
            situation={selectedSituation.id}
            service={selectedService.id}
          />
        )}

        {/* Section 4: Officer Profile */}
        {selectedService && (
          <OfficerProfile selectedService={selectedService.id} />
        )}


        {/* Section 6: Terms & Conditions */}
        {selectedService && secureDestination && (
          <div className={styles.termsSection}>
            <h2 className={styles.sectionTitle}>Terms & Conditions</h2>

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
        )}
      </div>

      {/* SIA-Compliant Smart Bottom Panel */}
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
            ? 'Select Protection Level to Begin ↑'
            : !Object.values(terms).every(v => v)
            ? `Proceed to Assignment Details - £${finalFee.toFixed(2)}`
            : `Accept Terms & Pay - £${finalFee.toFixed(2)}`
        }
        onPrimaryAction={!selectedService ? undefined : handleRequestProtection}
        onChangeSelection={selectedService ? handleChangeSelection : undefined}
        additionalInfo={deploymentInfo}
      />
    </div>
  );
}