import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SecurityAssessment, SecurityAssessmentData } from './SecurityAssessment';
import { CPOProfile } from '../../types/cpo';
import { SERVICE_TIERS, calculatePricing, PricingCalculation } from '../../utils/pricingCalculator';
import { mockCPOs } from '../../data/mockCPOs';
import styles from './BookingFlowContainer.module.css';

interface BookingFlowContainerProps {
  onComplete: (assignmentId: string) => void;
  onCancel: () => void;
}

interface BookingState {
  selectedCPO: CPOProfile | null;
  securityAssessment: SecurityAssessmentData | null;
  selectedTier: string | null;
  pricing: PricingCalculation | null;
}

export function BookingFlowContainer({ onComplete, onCancel }: BookingFlowContainerProps) {
  const { state, setBookingFlow, updateBookingFlowData, createAssignment, setSelectedCPO, setServiceTier } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedCPO: state.selectedCPO,
    securityAssessment: null,
    selectedTier: null,
    pricing: null,
  });

  const currentStep = state.bookingFlow?.step || 'security-assessment';

  useEffect(() => {
    // Initialize booking flow if not already started
    if (!state.bookingFlow) {
      setBookingFlow('security-assessment', {});
    }
  }, []);

  const handleSecurityAssessmentComplete = async (assessmentData: SecurityAssessmentData) => {
    setBookingState(prev => ({ ...prev, securityAssessment: assessmentData }));

    // Get recommended service tier and calculate pricing
    const recommendedTier = getRecommendedTier(assessmentData);
    const hasSubscription = !!state.subscription;
    const subscriptionTier = state.subscription?.tier;

    const pricing = calculatePricing(
      recommendedTier,
      assessmentData,
      hasSubscription,
      subscriptionTier
    );

    setBookingState(prev => ({
      ...prev,
      selectedTier: recommendedTier.id,
      pricing
    }));

    setServiceTier(recommendedTier.id);
    updateBookingFlowData({ assessmentData, recommendedTier, pricing });
    setBookingFlow('service-tiers', { assessmentData, recommendedTier, pricing });
  };

  const handleTierSelection = (tierId: string) => {
    if (!bookingState.securityAssessment) return;

    const selectedTier = SERVICE_TIERS.find(t => t.id === tierId)!;
    const hasSubscription = !!state.subscription;
    const subscriptionTier = state.subscription?.tier;

    const pricing = calculatePricing(
      selectedTier,
      bookingState.securityAssessment,
      hasSubscription,
      subscriptionTier
    );

    setBookingState(prev => ({
      ...prev,
      selectedTier: tierId,
      pricing
    }));

    setServiceTier(tierId);
    updateBookingFlowData({ tier: selectedTier, pricing });
    setBookingFlow('confirmation', { tier: selectedTier, pricing });
  };

  const handleConfirmBooking = async () => {
    if (!bookingState.selectedCPO || !bookingState.securityAssessment || !bookingState.pricing) {
      setError('Missing required booking information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the protection assignment
      const assignmentData = {
        user_id: state.user?.id,
        cpo_id: bookingState.selectedCPO.id,
        service_tier: bookingState.selectedTier,
        threat_level: bookingState.securityAssessment.threatLevel,
        location_type: bookingState.securityAssessment.locationType,
        duration_hours: bookingState.securityAssessment.duration,
        special_requirements: bookingState.securityAssessment.specialRequirements,
        principal_details: bookingState.securityAssessment.principalDetails,
        pricing_breakdown: bookingState.pricing.breakdown,
        total_amount: bookingState.pricing.totalAmount,
        assignment_status: 'confirmed',
        created_at: new Date().toISOString(),
      };

      const assignment = await createAssignment(assignmentData);

      // In a real app, this would assign the CPO to the protection detail
      // await assignCPOToProtection(bookingState.selectedCPO.id, assignment.id);

      // Clear booking flow state
      setBookingFlow('success', { assignmentId: assignment.id });

      // Notify parent component
      onComplete(assignment.id);

    } catch (error: any) {
      console.error('Error creating assignment:', error);
      setError(error.message || 'Failed to create protection assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'security-assessment':
        onCancel();
        break;
      case 'service-tiers':
        setBookingFlow('security-assessment', state.bookingFlow?.data || {});
        break;
      case 'confirmation':
        setBookingFlow('service-tiers', state.bookingFlow?.data || {});
        break;
      default:
        onCancel();
    }
  };

  const getRecommendedTier = (assessment: SecurityAssessmentData) => {
    const { threatLevel, locationType, specialRequirements } = assessment;

    // High risk or armed requirements = Shadow Protocol
    if (threatLevel === 'high' || specialRequirements.armed || specialRequirements.diplomatic) {
      return SERVICE_TIERS.find(t => t.id === 'shadow')!;
    }

    // Corporate/Event with medium risk = Executive
    if ((locationType === 'corporate' || locationType === 'event') && threatLevel === 'medium') {
      return SERVICE_TIERS.find(t => t.id === 'executive')!;
    }

    // Special requirements that benefit from Executive tier
    if (specialRequirements.surveillance || specialRequirements.k9Unit) {
      return SERVICE_TIERS.find(t => t.id === 'executive')!;
    }

    // Default to Essential for standard protection needs
    return SERVICE_TIERS.find(t => t.id === 'essential')!;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'security-assessment':
        return (
          <SecurityAssessment
            onComplete={handleSecurityAssessmentComplete}
            onBack={handleBack}
            initialData={state.bookingFlow?.data?.assessmentData}
          />
        );

      case 'service-tiers':
        return renderServiceTiers();

      case 'confirmation':
        return renderConfirmation();

      case 'success':
        return renderSuccess();

      default:
        return <div>Unknown step: {currentStep}</div>;
    }
  };

  const renderServiceTiers = () => {
    const recommendedTier = state.bookingFlow?.data?.recommendedTier;

    return (
      <div className={styles.serviceTiers}>
        <div className={styles.stepHeader}>
          <h2>Select Your Protection Level</h2>
          <p>Choose the service tier that best matches your security needs</p>
        </div>

        <div className={styles.tiersGrid}>
          {SERVICE_TIERS.map(tier => {
            const isRecommended = tier.id === recommendedTier?.id;
            const isSelected = tier.id === bookingState.selectedTier;

            // Calculate pricing for this tier
            const pricing = bookingState.securityAssessment ?
              calculatePricing(
                tier,
                bookingState.securityAssessment,
                !!state.subscription,
                state.subscription?.tier
              ) : null;

            return (
              <div
                key={tier.id}
                className={`${styles.tierCard} ${isSelected ? styles.selected : ''} ${isRecommended ? styles.recommended : ''}`}
                onClick={() => handleTierSelection(tier.id)}
              >
                {isRecommended && (
                  <div className={styles.recommendedBadge}>
                    Recommended
                  </div>
                )}

                <div className={styles.tierHeader}>
                  <h3>{tier.name}</h3>
                  <div className={styles.tierPrice}>
                    {pricing ? (
                      <>
                        <span className={styles.totalPrice}>
                          £{pricing.totalAmount.toFixed(2)}
                        </span>
                        <span className={styles.hourlyRate}>
                          £{tier.baseHourlyRate}/hour
                        </span>
                      </>
                    ) : (
                      <span className={styles.hourlyRate}>
                        £{tier.baseHourlyRate}/hour
                      </span>
                    )}
                  </div>
                </div>

                <p className={styles.tierDescription}>{tier.description}</p>

                <div className={styles.tierFeatures}>
                  {tier.features.map((feature, index) => (
                    <div key={index} className={styles.feature}>
                      <span className={styles.featureIcon}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <button
                    className={styles.selectButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookingFlow('confirmation', state.bookingFlow?.data || {});
                    }}
                  >
                    Continue with {tier.name}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.navigation}>
          <button className={styles.backBtn} onClick={handleBack}>
            Back to Assessment
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (!bookingState.pricing || !bookingState.selectedCPO) {
      return <div>Loading confirmation details...</div>;
    }

    return (
      <div className={styles.confirmation}>
        <div className={styles.stepHeader}>
          <h2>Confirm Your Protection Assignment</h2>
          <p>Review all details before confirming your booking</p>
        </div>

        {/* Selected CPO */}
        <div className={styles.confirmationSection}>
          <h3>Assigned Close Protection Officer</h3>
          <div className={styles.cpoCard}>
            <div className={styles.cpoInfo}>
              <h4>{bookingState.selectedCPO.firstName} {bookingState.selectedCPO.lastName}</h4>
              <p>Rating: {bookingState.selectedCPO.rating}/5 ⭐</p>
              <p>{bookingState.selectedCPO.yearsOfExperience} years experience</p>
              <div className={styles.cpoTags}>
                {bookingState.selectedCPO.specializations.map(spec => (
                  <span key={spec.type} className={styles.tag}>{spec.type}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className={styles.confirmationSection}>
          <h3>Pricing Breakdown</h3>
          <div className={styles.pricingBreakdown}>
            {bookingState.pricing.breakdown.map((item, index) => (
              <div key={index} className={`${styles.pricingItem} ${styles[item.type]}`}>
                <span className={styles.pricingLabel}>
                  {item.label}
                  {item.description && (
                    <small className={styles.pricingDescription}>{item.description}</small>
                  )}
                </span>
                <span className={styles.pricingAmount}>
                  {item.type === 'discount' ? '-' : ''}£{Math.abs(item.amount).toFixed(2)}
                </span>
              </div>
            ))}
            <div className={styles.pricingTotal}>
              <span>Total Amount</span>
              <span>£{bookingState.pricing.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.navigation}>
          <button className={styles.backBtn} onClick={handleBack}>
            Back to Service Tiers
          </button>
          <button
            className={styles.confirmBtn}
            onClick={handleConfirmBooking}
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm Protection Assignment'}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => {
    const assignmentId = state.bookingFlow?.data?.assignmentId;

    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>🛡️</div>
        <h2>Protection Assignment Confirmed</h2>
        <p>Your close protection detail has been successfully arranged.</p>

        <div className={styles.successDetails}>
          <div className={styles.successItem}>
            <strong>Assignment ID:</strong> {assignmentId}
          </div>
          <div className={styles.successItem}>
            <strong>CPO:</strong> {bookingState.selectedCPO?.firstName} {bookingState.selectedCPO?.lastName}
          </div>
          <div className={styles.successItem}>
            <strong>Service Tier:</strong> {bookingState.selectedTier?.charAt(0).toUpperCase()}{bookingState.selectedTier?.slice(1)}
          </div>
        </div>

        <button
          className={styles.viewAssignmentBtn}
          onClick={() => onComplete(assignmentId)}
        >
          View Assignment Details
        </button>
      </div>
    );
  };

  return (
    <div className={styles.bookingFlowContainer}>
      {renderCurrentStep()}
    </div>
  );
}