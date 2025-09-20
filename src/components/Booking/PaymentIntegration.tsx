import React, { useState, useEffect } from 'react';
import {
  ProtectionAssignmentData,
  PaymentFlow,
  PaymentIntent,
  PaymentError,
  SavedPaymentMethod,
  CorporateAccount
} from '../../types';
import { PaymentForm } from '../Payment/PaymentForm';
import { PaymentSuccess } from '../Payment/PaymentSuccess';
import { CorporateBilling } from '../Payment/CorporateBilling';
import { BookingProgressIndicator } from '../UI/ProgressIndicator';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import styles from './PaymentIntegration.module.css';

interface PaymentIntegrationProps {
  protectionAssignmentData: ProtectionAssignmentData;
  onBookingComplete: (bookingId: string) => void;
  onBack: () => void;
  corporateAccount?: CorporateAccount;
}

type PaymentStep = 'confirmation' | 'corporate-billing' | 'payment' | 'processing' | 'success' | 'error';

export function PaymentIntegration({
  protectionAssignmentData,
  onBookingComplete,
  onBack,
  corporateAccount
}: PaymentIntegrationProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('confirmation');
  const [paymentFlow, setPaymentFlow] = useState<PaymentFlow | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
  const [bookingId, setBookingId] = useState<string>('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isCorporateBooking, setIsCorporateBooking] = useState(!!corporateAccount);
  const [savedPaymentMethods] = useState<SavedPaymentMethod[]>([
    // Mock saved payment methods - in production, load from user account
    {
      id: 'pm_card_visa',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      nickname: 'Business Card'
    }
  ]);

  // Credit system state
  const [userCredits, setUserCredits] = useState<number>(0);
  const [creditsToApply, setCreditsToApply] = useState<number>(0);
  const [applyCredits, setApplyCredits] = useState<boolean>(true);

  const { service, pickup, destination, estimatedDistance, estimatedDuration, estimatedCost, user } = protectionAssignmentData;
  const hasReward = user?.hasUnlockedReward && user?.userType !== 'guest';

  // Calculate cost with both rewards and credits
  let baseCost = hasReward ? Math.round(estimatedCost * 0.5) : estimatedCost;
  const maxCreditsAllowed = Math.floor(baseCost * 0.5); // Maximum 50% of protection service can be paid with credits
  const actualCreditsToApply = applyCredits ? Math.min(creditsToApply, maxCreditsAllowed, userCredits) : 0;
  const finalCost = Math.max(baseCost - actualCreditsToApply, 0);

  // Load user credits
  useEffect(() => {
    if (user) {
      const storageKey = `armora_credits_${user.id}`;
      const savedCredits = localStorage.getItem(storageKey);
      if (savedCredits) {
        try {
          const creditsData = JSON.parse(savedCredits);
          setUserCredits(creditsData.available || 0);

          // Auto-set credits to apply to maximum allowed
          const maxAllowed = Math.floor(baseCost * 0.5);
          const suggestedCredits = Math.min(creditsData.available || 0, maxAllowed);
          setCreditsToApply(suggestedCredits);
        } catch (error) {
          console.warn('Failed to load user credits:', error);
        }
      }
    }
  }, [user, baseCost]);

  // Initialize payment flow
  useEffect(() => {
    const flow: PaymentFlow = {
      protectionAssignmentDetails: protectionAssignmentData,
      paymentMethod: 'card',
      amount: finalCost * 100, // Convert to pence for Stripe
      currency: 'GBP',
      description: `${service.name}: ${pickup} to ${destination}`,
      metadata: {
        serviceType: service.id,
        route: `${pickup} → ${destination}`,
        scheduledTime: protectionAssignmentData.scheduledDateTime,
        corporateAssignment: isCorporateBooking
      }
    };

    setPaymentFlow(flow);
  }, [protectionAssignmentData, finalCost, isCorporateBooking, service, pickup, destination]);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleConfirmationNext = () => {
    if (!agreedToTerms) return;

    if (isCorporateBooking) {
      setCurrentStep('corporate-billing');
    } else {
      setCurrentStep('payment');
    }
  };

  const handleCorporateBillingComplete = (billingData: any) => {
    // Update payment flow with corporate billing data
    if (paymentFlow) {
      setPaymentFlow({
        ...paymentFlow,
        metadata: {
          ...paymentFlow.metadata,
          corporateAssignment: true,
          vatNumber: billingData.vatNumber
        }
      });
    }
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = async (intent: PaymentIntent) => {
    setPaymentIntent(intent);
    setCurrentStep('processing');

    try {
      // Generate booking ID
      const generatedBookingId = `ARV-${Date.now().toString().slice(-6)}`;
      setBookingId(generatedBookingId);

      // Simulate booking confirmation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store booking data with payment information
      const bookingRecord = {
        id: generatedBookingId,
        userId: user?.id,
        service: service.id,
        pickup,
        destination,
        estimatedCost,
        additionalRequirements,
        createdAt: new Date(),
        status: 'confirmed' as const,
        paymentIntentId: intent.id,
        paymentStatus: intent.status
      };

      // Store in localStorage (in production, send to backend)
      const existingBookings = JSON.parse(localStorage.getItem('armora_bookings') || '[]');
      existingBookings.push(bookingRecord);
      localStorage.setItem('armora_bookings', JSON.stringify(existingBookings));

      // Analytics tracking
      console.log('[Analytics] Booking completed', {
        bookingId: generatedBookingId,
        service: service.id,
        amount: intent.amount,
        paymentMethod: intent.paymentMethod?.type || 'card',
        corporate: isCorporateBooking,
        timestamp: Date.now()
      });

      setCurrentStep('success');

    } catch (error) {
      console.error('Booking confirmation failed:', error);
      setPaymentError({
        code: 'booking_failed',
        message: 'Booking confirmation failed. Please contact support.',
        type: 'network_error',
        suggestedAction: 'Contact support with your payment reference',
        retryable: false
      });
      setCurrentStep('error');
    }
  };

  const handlePaymentError = (error: PaymentError) => {
    setPaymentError(error);
    setCurrentStep('error');
  };

  const handleRetryPayment = () => {
    setPaymentError(null);
    setCurrentStep('payment');
  };

  const handleDownloadReceipt = () => {
    // In production, generate and download PDF receipt
    const receiptData = {
      bookingId,
      service: service.name,
      route: `${pickup} → ${destination}`,
      amount: paymentIntent?.amount || finalCost * 100,
      timestamp: new Date().toISOString(),
      paymentMethod: paymentIntent?.paymentMethod?.type || 'card'
    };

    console.log('[Analytics] Receipt downloaded', receiptData);
    alert('Receipt download functionality would be implemented here');
  };

  const handleBackToBooking = () => {
    onBookingComplete(bookingId);
  };

  // Render confirmation step
  if (currentStep === 'confirmation') {
    return (
      <div className={styles.container}>
        <BookingProgressIndicator currentStep="booking-confirmation" />

        <div className={styles.header}>
          <h1 className={styles.title}>Confirm Your Booking</h1>
          <p className={styles.subtitle}>Step 3 of 3 • Payment & Confirmation</p>
          <p className={styles.description}>Review details before payment</p>
        </div>

        {/* Booking Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.serviceHeader}>
            <h2 className={styles.serviceName}>{service.name}</h2>
            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Ride Total:</span>
                <span className={styles.priceValue}>£{estimatedCost}</span>
              </div>

              {hasReward && (
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Reward Discount (50%):</span>
                  <span className={styles.discountValue}>-£{estimatedCost - baseCost}</span>
                </div>
              )}

              {actualCreditsToApply > 0 && (
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Armora Credits:</span>
                  <span className={styles.creditValue}>-£{actualCreditsToApply}</span>
                </div>
              )}

              <div className={styles.priceDivider}></div>
              <div className={styles.priceRow}>
                <span className={styles.priceLabelFinal}>You Pay:</span>
                <span className={styles.priceValueFinal}>£{finalCost}</span>
              </div>
            </div>
          </div>

          <div className={styles.journeyDetails}>
            <div className={styles.routeInfo}>
              <div className={styles.routePoint}>
                <span className={styles.routeIcon}>📍</span>
                <div className={styles.routeText}>
                  <div className={styles.routeLabel}>Pickup</div>
                  <div className={styles.routeAddress}>{pickup}</div>
                </div>
              </div>

              <div className={styles.routeLine}></div>

              <div className={styles.routePoint}>
                <span className={styles.routeIcon}>🏁</span>
                <div className={styles.routeText}>
                  <div className={styles.routeLabel}>Destination</div>
                  <div className={styles.routeAddress}>{destination}</div>
                </div>
              </div>
            </div>

            <div className={styles.tripMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Distance:</span>
                <span className={styles.metaValue}>{estimatedDistance} miles</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Duration:</span>
                <span className={styles.metaValue}>{formatDuration(estimatedDuration)}</span>
              </div>
              {protectionAssignmentData.scheduledDateTime && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Scheduled:</span>
                  <span className={styles.metaValue}>
                    {new Date(protectionAssignmentData.scheduledDateTime).toLocaleString('en-GB')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Credit Controls */}
        {userCredits > 0 && (
          <div className={styles.creditSection}>
            <h3 className={styles.sectionTitle}>
              🪙 Apply Armora Credits
            </h3>
            <div className={styles.creditSummary}>
              <p className={styles.creditInfo}>
                You have <strong>£{userCredits}</strong> in credits available.
                Maximum £{maxCreditsAllowed} can be applied to this ride (50% limit).
              </p>
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={applyCredits}
                onChange={(e) => setApplyCredits(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                Apply £{actualCreditsToApply} credits to this booking
              </span>
            </label>

            {applyCredits && userCredits > maxCreditsAllowed && (
              <div className={styles.creditSliderContainer}>
                <label className={styles.sliderLabel}>
                  Credits to apply: £{creditsToApply}
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.min(userCredits, maxCreditsAllowed)}
                  value={creditsToApply}
                  onChange={(e) => setCreditsToApply(Number(e.target.value))}
                  className={styles.creditSlider}
                />
                <div className={styles.sliderMarks}>
                  <span>£0</span>
                  <span>£{Math.min(userCredits, maxCreditsAllowed)}</span>
                </div>
              </div>
            )}

            {userCredits > 0 && (
              <div className={styles.creditNote}>
                💡 Remaining credits after this booking: £{userCredits - actualCreditsToApply}
              </div>
            )}
          </div>
        )}

        {/* Additional Requirements */}
        <div className={styles.requirementsSection}>
          <h3 className={styles.sectionTitle}>Additional Requirements (Optional)</h3>
          <textarea
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            placeholder="Special instructions, accessibility requirements, preferred route, etc."
            className={styles.requirementsTextarea}
            rows={3}
          />
        </div>

        {/* Corporate Booking Toggle */}
        {corporateAccount && (
          <div className={styles.corporateSection}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isCorporateBooking}
                onChange={(e) => setIsCorporateBooking(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                Bill to corporate account ({corporateAccount.companyName})
              </span>
            </label>
          </div>
        )}

        {/* Terms Agreement */}
        <div className={styles.termsSection}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              I agree to the <a href="/terms" className={styles.link}>Terms of Service</a> and{' '}
              <a href="/privacy" className={styles.link}>Privacy Policy</a>
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="lg"
            onClick={onBack}
            className={styles.backButton}
          >
            ← Back
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirmationNext}
            disabled={!agreedToTerms}
            className={styles.nextButton}
            isFullWidth
          >
            {isCorporateBooking ? 'Continue to Corporate Billing' : 'Continue to Payment'}
          </Button>
        </div>
      </div>
    );
  }

  // Render corporate billing step
  if (currentStep === 'corporate-billing' && paymentFlow) {
    return (
      <CorporateBilling
        paymentFlow={paymentFlow}
        corporateAccount={corporateAccount}
        onBillingConfirmed={handleCorporateBillingComplete}
        onCancel={() => setCurrentStep('confirmation')}
      />
    );
  }

  // Render payment step
  if (currentStep === 'payment' && paymentFlow) {
    return (
      <PaymentForm
        paymentFlow={paymentFlow}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        onCancel={() => setCurrentStep('confirmation')}
        savedPaymentMethods={savedPaymentMethods}
        expressPaymentOptions={{
          applePay: true,
          googlePay: true,
          payPal: true,
          savedCards: savedPaymentMethods
        }}
      />
    );
  }

  // Render processing step
  if (currentStep === 'processing') {
    return (
      <div className={styles.container}>
        <div className={styles.processingContainer}>
          <LoadingSpinner size="large" text="Confirming your booking..." />
          <p className={styles.processingText}>
            Please don't close this page. We're confirming your payment and setting up your security transport.
          </p>
        </div>
      </div>
    );
  }

  // Render error step
  if (currentStep === 'error' && paymentError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Payment Failed</h2>
          <p className={styles.errorMessage}>{paymentError.message}</p>
          {paymentError.suggestedAction && (
            <p className={styles.errorSuggestion}>{paymentError.suggestedAction}</p>
          )}

          <div className={styles.errorActions}>
            {paymentError.retryable && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleRetryPayment}
                className={styles.retryButton}
              >
                Try Again
              </Button>
            )}

            <Button
              variant="secondary"
              size="lg"
              onClick={onBack}
              className={styles.cancelButton}
            >
              Back to Booking
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render success step
  if (currentStep === 'success' && paymentIntent && bookingId) {
    return (
      <PaymentSuccess
        protectionAssignmentData={protectionAssignmentData}
        paymentIntent={paymentIntent}
        onContinue={handleBackToBooking}
        onDownloadReceipt={handleDownloadReceipt}
      />
    );
  }

  // Fallback loading state
  return (
    <div className={styles.container}>
      <LoadingSpinner size="large" text="Loading payment system..." />
    </div>
  );
}