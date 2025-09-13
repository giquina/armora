import React, { useState, useEffect } from 'react';
import {
  BookingData,
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
  bookingData: BookingData;
  onBookingComplete: (bookingId: string) => void;
  onBack: () => void;
  corporateAccount?: CorporateAccount;
}

type PaymentStep = 'confirmation' | 'corporate-billing' | 'payment' | 'processing' | 'success' | 'error';

export function PaymentIntegration({
  bookingData,
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

  const { service, pickup, destination, estimatedDistance, estimatedDuration, estimatedCost, user } = bookingData;
  const hasReward = user?.hasUnlockedReward && user?.userType !== 'guest';
  const finalCost = hasReward ? Math.round(estimatedCost * 0.5) : estimatedCost;

  // Initialize payment flow
  useEffect(() => {
    const flow: PaymentFlow = {
      bookingDetails: bookingData,
      paymentMethod: 'card',
      amount: finalCost * 100, // Convert to pence for Stripe
      currency: 'GBP',
      description: `${service.name}: ${pickup} to ${destination}`,
      metadata: {
        serviceType: service.id,
        route: `${pickup} → ${destination}`,
        scheduledTime: bookingData.scheduledDateTime,
        corporateBooking: isCorporateBooking
      }
    };

    setPaymentFlow(flow);
  }, [bookingData, finalCost, isCorporateBooking, service, pickup, destination]);

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
          corporateBooking: true,
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
          <p className={styles.subtitle}>Review details before payment</p>
        </div>

        {/* Booking Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.serviceHeader}>
            <h2 className={styles.serviceName}>{service.name}</h2>
            <div className={styles.servicePrice}>
              {hasReward ? (
                <>
                  <span className={styles.discountedPrice}>£{finalCost}</span>
                  <span className={styles.originalPrice}>£{estimatedCost}</span>
                  <span className={styles.rewardBadge}>50% OFF</span>
                </>
              ) : (
                <span className={styles.price}>£{estimatedCost}</span>
              )}
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
              {bookingData.scheduledDateTime && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Scheduled:</span>
                  <span className={styles.metaValue}>
                    {new Date(bookingData.scheduledDateTime).toLocaleString('en-GB')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

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
        bookingData={bookingData}
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