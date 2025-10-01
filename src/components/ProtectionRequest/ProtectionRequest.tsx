import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SituationSelector } from './components/SituationSelector';
import { ServiceComparison, SERVICE_TIERS } from './components/ServiceComparison';
import { WhatYouGet } from './components/WhatYouGet';
import { OfficerProfile } from './components/OfficerProfile';
import { LocationInput } from './components/LocationInput';
import { TimeSelection } from './components/TimeSelection';
import { BottomActionBar } from './components/BottomActionBar';
import { PaymentModal } from './components/PaymentModal';
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

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Auto-scroll helper function
  const scrollToSection = useCallback((sectionSelector: string) => {
    setTimeout(() => {
      const element = document.querySelector(sectionSelector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }, []);

  // Handle situation selection
  const handleSituationSelect = useCallback((situation: Situation | null) => {
    setSelectedSituation(situation);
    // Auto-scroll to service selection after choosing situation
    if (situation) {
      scrollToSection('[data-section="service-comparison"]');
    }
  }, [scrollToSection]);

  // Handle service selection with toggle functionality
  const handleServiceSelect = useCallback((service: ServiceTier | null) => {
    setSelectedService(service);
    // Auto-scroll to time selection after choosing service
    if (service && secureDestination.trim()) {
      scrollToSection('.timeSelectionSection');
    }
  }, [scrollToSection, secureDestination]);

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

  // Auto-scroll when destination is entered
  useEffect(() => {
    if (secureDestination.trim() && pickupLocation.trim()) {
      // Both locations entered, scroll to situation selector
      scrollToSection('.situationSection');
    }
  }, [secureDestination, pickupLocation, scrollToSection]);

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

  // Handle proceed to payment - opens payment modal
  const handleProceedToPayment = useCallback(() => {
    if (!isReadyToRequest || !selectedService) return;

    // Save destination to recent locations
    saveDestination(secureDestination);

    // Open payment modal
    setShowPaymentModal(true);
  }, [isReadyToRequest, selectedService, saveDestination, secureDestination]);

  // Handle payment success
  const handlePaymentSuccess = useCallback((paymentIntentId: string) => {
    // Store assignment data with payment confirmation
    const assignmentData = {
      selectedSituation: selectedSituation?.id || 'general',
      selectedService: selectedService?.id,
      serviceName: selectedService?.name,
      serviceRate: selectedService?.rate,
      pickupLocation: pickupLocation.trim(),
      secureDestination: secureDestination.trim(),
      commencementTime,
      scheduledDateTime: commencementTime === 'schedule' ? scheduledDateTime : null,
      isImmediate: commencementTime === 'now',
      estimatedServiceFee: finalFee,
      originalServiceFee: originalFee,
      discountApplied: hasDiscount,
      discountAmount: savings,
      paymentIntentId,
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
      user: state.user
    };

    localStorage.setItem('armora_assignment_data', JSON.stringify(assignmentData));
    localStorage.setItem('armora_payment_confirmed', paymentIntentId);

    // Close modal and navigate to confirmation
    setShowPaymentModal(false);
    onAssignmentRequested();
  }, [selectedSituation, selectedService, pickupLocation, secureDestination, commencementTime, scheduledDateTime, finalFee, originalFee, hasDiscount, savings, state.user, onAssignmentRequested]);

  // Handle payment error
  const handlePaymentError = useCallback((error: string) => {
    console.error('Payment failed:', error);
    // Error is displayed in modal, user can retry
    // Modal stays open
  }, []);

  // Smart scroll to first incomplete step
  const handleScrollToIncompleteStep = useCallback(() => {
    const hasBothLocations = pickupLocation.trim() && secureDestination.trim();
    const hasSituation = !!selectedSituation;
    const hasService = !!selectedService;
    const hasTime = commencementTime && (commencementTime !== 'schedule' || scheduledDateTime);
    const termsAccepted = Object.values(terms).every(v => v === true);

    // STEP 1: Locations not complete
    if (!hasBothLocations) {
      scrollToSection('.locationSection');
      return;
    }

    // STEP 2: Situation not selected
    if (!hasSituation) {
      scrollToSection('.situationSection');
      return;
    }

    // STEP 3: Service not selected
    if (!hasService) {
      scrollToSection('[data-section="service-comparison"]');
      return;
    }

    // STEP 4: Time not selected
    if (!hasTime) {
      scrollToSection('.timeSelectionSection');
      return;
    }

    // STEP 5: Terms not accepted
    if (!termsAccepted) {
      scrollToSection('.termsSection');
      return;
    }

    // All complete - do nothing (panel will handle expanding)
  }, [pickupLocation, secureDestination, selectedSituation, selectedService, commencementTime, scheduledDateTime, terms, scrollToSection]);

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

  // Contextual guidance message based on user progress
  const getContextualGuidance = useMemo(() => {
    const hasLocation = (pickupLocation.trim() || secureDestination.trim());
    const hasBothLocations = pickupLocation.trim() && secureDestination.trim();
    const hasSituation = !!selectedSituation;
    const hasService = !!selectedService;
    const hasTime = commencementTime && (commencementTime !== 'schedule' || scheduledDateTime);
    const termsAccepted = Object.values(terms).every(v => v === true);

    // Calculate current step and progress
    let currentStep = 1;
    let stepTitle = '';
    let stepStatus = '';
    let progressText = '';
    let panelTitle = '';
    let panelSubtitle = '';

    // STEP 1: Locations
    if (!hasBothLocations) {
      currentStep = 1;
      stepTitle = 'STEP 1 of 5 INCOMPLETE';
      panelTitle = 'Configure Protection Detail';
      panelSubtitle = '✓ SIA-licensed security • Nationwide coverage';
      if (!hasLocation) {
        stepStatus = 'Complete your locations to continue';
        progressText = 'Enter commencement point and destination';
      } else {
        stepStatus = 'STEP 1 of 5 - Almost Complete';
        progressText = hasLocation && !pickupLocation.trim() ? 'Enter commencement point' : 'Enter destination';
      }
      return {
        message: stepTitle,
        hint: stepStatus,
        progressText,
        panelTitle,
        panelSubtitle,
        showScrollHint: true,
        currentStep: 1
      };
    }

    // STEP 2: Situation (optional, can skip) or STEP 3: Service
    if (hasBothLocations && !hasService) {
      currentStep = 2;
      panelTitle = 'Protection Detail Setup';
      panelSubtitle = '✓ Enhanced-vetted CPOs • Professional security';
      if (!hasSituation) {
        stepTitle = 'STEP 2 of 5 - Choose Protection Scenario';
        stepStatus = 'Select your situation type above';
        progressText = '✓ Locations confirmed • Next: Select scenario';
      } else {
        stepTitle = 'STEP 3 of 5 - Select Protection Level';
        stepStatus = 'Choose your service tier above';
        progressText = '✓ Scenario selected • Next: Choose service level';
        currentStep = 3;
      }
      return {
        message: stepTitle,
        hint: stepStatus,
        progressText,
        panelTitle,
        panelSubtitle,
        showScrollHint: true,
        currentStep
      };
    }

    // STEP 4: Time selection
    if (hasBothLocations && hasService && !hasTime) {
      currentStep = 4;
      stepTitle = 'STEP 4 of 5 - Choose Commencement Time';
      stepStatus = 'Select when you need protection to begin';
      progressText = '✓ Service selected • Next: Choose time';
      panelTitle = 'Protection Detail Setup';
      panelSubtitle = '✓ Enhanced-vetted CPOs • Professional security';
      return {
        message: stepTitle,
        hint: stepStatus,
        progressText,
        panelTitle,
        panelSubtitle,
        showScrollHint: true,
        currentStep: 4
      };
    }

    // STEP 5: Terms acceptance
    if (hasBothLocations && hasService && hasTime && !termsAccepted) {
      currentStep = 5;
      stepTitle = 'STEP 5 of 5 - Review & Accept Terms';
      stepStatus = 'Accept terms below to request protection';
      progressText = '✓ Time selected • Final step!';
      panelTitle = 'Protection Detail Setup';
      panelSubtitle = '✓ Enhanced-vetted CPOs • Professional security';
      return {
        message: stepTitle,
        hint: stepStatus,
        progressText,
        panelTitle,
        panelSubtitle,
        showScrollHint: true,
        currentStep: 5
      };
    }

    // Everything complete
    if (hasBothLocations && hasService && hasTime && termsAccepted) {
      stepTitle = 'READY TO REQUEST';
      stepStatus = 'All details confirmed';
      progressText = '✓ CPO deployment confirmed • Request below';
      panelTitle = 'Security Detail Ready';
      panelSubtitle = '✓ CPO deployment confirmed • Request below';
      return {
        message: stepTitle,
        hint: stepStatus,
        progressText,
        panelTitle,
        panelSubtitle,
        showScrollHint: false,
        currentStep: 5
      };
    }

    // Default fallback
    return {
      message: 'STEP 1 of 5 INCOMPLETE',
      hint: 'Complete your locations to continue',
      progressText: 'Enter commencement point and destination',
      panelTitle: 'Configure Protection Detail',
      panelSubtitle: '✓ SIA-licensed security • Nationwide coverage',
      showScrollHint: true,
      currentStep: 1
    };
  }, [pickupLocation, secureDestination, selectedSituation, selectedService, commencementTime, scheduledDateTime, terms]);

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
      {/* Page Header - Separate section */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Request Your Protection Detail</h1>
        <p className={styles.subtitle}>SIA-licensed Close Protection Officers across England & Wales</p>
      </div>

      {/* STEP 1 Section - Separate from header */}
      <div className={styles.step1Section}>
        <div className={styles.stepIndicatorInHeader}>
          <div className={styles.stepHeaderRow}>
            <span className={styles.stepNumber}>STEP 1</span>
            <span className={styles.stepProgress}>of 5</span>
            <span className={styles.stepDivider}>|</span>
            <span className={styles.stepTime}>⏱️ 2 minutes</span>
          </div>
          <div className={styles.stepDescriptionInHeader}>
            <p className={styles.stepDescriptionText}>Tell us where you need protection to begin and your destination. Your Close Protection Officer will arrive at your location to commence your security detail.</p>
            <p className={styles.stepActionHint}>Enter your locations below</p>
          </div>
        </div>

        <div className={styles.trustBadges}>
          <span className={styles.badge}>● Enhanced-Vetted Officers</span>
          <span className={styles.badge}>● Professional Security Transport</span>
          <span className={styles.badge}>● 24/7 Rapid Response</span>
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
            savedAddresses={state.user?.savedAddresses || []}
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

        {/* STEP 2: PROTECTION TYPE */}
        <div className={styles.stepIndicator}>
          <div className={styles.stepHeaderRow}>
            <span className={styles.stepNumber}>STEP 2</span>
            <span className={styles.stepProgress}>of 5</span>
            <span className={styles.stepDivider}>|</span>
            <span className={styles.stepTime}>⏱️ 1 minute</span>
          </div>
          <div className={styles.stepDescription}>
            <p className={styles.stepDescriptionTitle}>Choose Your Protection Scenario</p>
            <p className={styles.stepDescriptionText}>Select the situation that best matches your needs. Based on real client cases, we'll recommend the appropriate SIA-licensed CPO for your security requirements.</p>
          </div>
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

        {/* STEP 3: SERVICE LEVEL */}
        <div className={styles.stepIndicator}>
          <div className={styles.stepHeaderRow}>
            <span className={styles.stepNumber}>STEP 3</span>
            <span className={styles.stepProgress}>of 5</span>
            <span className={styles.stepDivider}>|</span>
            <span className={styles.stepTime}>⏱️ 1 minute</span>
          </div>
          <div className={styles.stepDescription}>
            <p className={styles.stepDescriptionTitle}>Choose Your Protection Level</p>
            <p className={styles.stepDescriptionText}>Every CPO is SIA-licensed with enhanced background checks. Select the tier based on your security requirements and situation complexity.</p>
          </div>
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
            <div className={styles.stepIndicator}>
              <div className={styles.stepHeaderRow}>
                <span className={styles.stepNumber}>STEP 4</span>
                <span className={styles.stepProgress}>of 5</span>
                <span className={styles.stepDivider}>|</span>
                <span className={styles.stepTime}>⏱️ 30 seconds</span>
              </div>
              <div className={styles.stepDescription}>
                <p className={styles.stepDescriptionTitle}>When Should Protection Commence?</p>
                <p className={styles.stepDescriptionText}>Choose when you need your Close Protection Officer to arrive. Select immediate deployment (2-4 min response) or schedule for a specific date and time.</p>
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
            <div className={styles.stepIndicator}>
              <div className={styles.stepHeaderRow}>
                <span className={styles.stepNumber}>STEP 5</span>
                <span className={styles.stepProgress}>of 5</span>
                <span className={styles.stepDivider}>|</span>
                <span className={styles.stepTime}>⏱️ 1 minute</span>
              </div>
              <div className={styles.stepDescription}>
                <p className={styles.stepDescriptionTitle}>Review & Accept Terms</p>
                <p className={styles.stepDescriptionText}>Review your protection detail summary and accept our terms of service. Your booking will be confirmed after payment.</p>
              </div>
            </div>

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
        isValid={isReadyToRequest}
        pricing={selectedService ? {
          basePrice: originalFee,
          discountAmount: hasDiscount ? savings : undefined,
          finalPrice: finalFee,
          hasDiscount: hasDiscount,
          originalPrice: hasDiscount ? originalFee : undefined
        } : {
          basePrice: 0,
          finalPrice: 0,
          hasDiscount: false
        }}
        serviceInfo={selectedService ? {
          name: selectedService.name,
          rate: selectedService.rate,
          hourlyRate: selectedService.hourlyRate,
          situation: selectedSituation?.label,
          journeyRoute: pickupLocation && secureDestination ? `${pickupLocation} → ${secureDestination}` : undefined,
          officerLevel: selectedService.officerLevel
        } : undefined}
        primaryButtonText={
          !selectedService
            ? `Complete Step ${getContextualGuidance.currentStep}`
            : !Object.values(terms).every(v => v)
            ? `Accept Terms to Continue`
            : `Proceed to Payment`
        }
        onPrimaryAction={handleProceedToPayment}
        onChangeSelection={selectedService ? handleChangeSelection : undefined}
        onScrollToIncomplete={handleScrollToIncompleteStep}
        additionalInfo={getContextualGuidance.progressText}
        contextualHint={getContextualGuidance.hint}
        panelTitle={getContextualGuidance.panelTitle}
        panelSubtitle={getContextualGuidance.panelSubtitle}
        currentStep={getContextualGuidance.currentStep}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingSummary={{
          serviceName: selectedService?.name || '',
          journeyRoute: pickupLocation && secureDestination ? `${pickupLocation} → ${secureDestination}` : '',
          commencementTime: deploymentInfo || '',
          totalPrice: finalFee,
          hasDiscount: hasDiscount,
          originalPrice: hasDiscount ? originalFee : undefined
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
}