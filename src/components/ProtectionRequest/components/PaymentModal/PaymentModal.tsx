import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { supabase } from '../../../../lib/supabase';
import styles from './PaymentModal.module.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingSummary: {
    serviceName: string;
    journeyRoute: string;
    commencementTime: string;
    totalPrice: number;
    hasDiscount: boolean;
    originalPrice?: number;
  };
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

// Main PaymentModal wrapper component
export function PaymentModal(props: PaymentModalProps) {
  const { isOpen } = props;

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        props.onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, props]);

  if (!isOpen) return null;

  return (
    <Elements stripe={stripePromise}>
      <PaymentModalContent {...props} />
    </Elements>
  );
}

// Internal payment modal content
function PaymentModalContent({
  isOpen,
  onClose,
  bookingSummary,
  onPaymentSuccess,
  onPaymentError
}: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // Create payment intent via Supabase Edge Function
  const createPaymentIntent = async (amount: number): Promise<{ clientSecret: string; paymentIntentId: string }> => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Authentication required. Please sign in to continue.');
      }

      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (!supabaseUrl) {
        throw new Error('Supabase configuration missing');
      }

      // Convert pounds to pence for Stripe
      const amountInPence = Math.round(amount * 100);

      const response = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPence,
          currency: 'gbp',
          metadata: {
            serviceType: 'protection_assignment',
            serviceName: bookingSummary.serviceName,
            journeyRoute: bookingSummary.journeyRoute,
            commencementTime: bookingSummary.commencementTime,
            principalId: session.user.id,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();

      return {
        clientSecret: data.clientSecret,
        paymentIntentId: data.paymentIntentId
      };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      throw new Error(error.message || 'Failed to initialize payment. Please try again.');
    }
  };

  // Handle payment submission
  const handlePayment = async () => {
    if (!stripe || !elements || !cardComplete) {
      setError('Please complete your card details');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment intent
      const { clientSecret, paymentIntentId } = await createPaymentIntent(bookingSummary.totalPrice);

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // Add billing details if available from user context
          },
        },
        setup_future_usage: saveCard ? 'off_session' : undefined,
      });

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment failed');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntentId);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`${styles.modal} ${isOpen ? styles.modalVisible : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="payment-modal-title" className={styles.title}>
            Complete Payment
          </h2>
          <p className={styles.subtitle}>
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Booking Summary */}
        <div className={styles.summarySection}>
          <h3 className={styles.summaryTitle}>Booking Summary</h3>

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Service:</span>
            <span className={styles.summaryValue}>{bookingSummary.serviceName}</span>
          </div>

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Journey:</span>
            <span className={styles.summaryValue}>{bookingSummary.journeyRoute}</span>
          </div>

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Commencement:</span>
            <span className={styles.summaryValue}>{bookingSummary.commencementTime}</span>
          </div>

          {bookingSummary.hasDiscount && bookingSummary.originalPrice && (
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Original Price:</span>
              <span className={styles.summaryValueStrike}>£{bookingSummary.originalPrice.toFixed(2)}</span>
            </div>
          )}

          {bookingSummary.hasDiscount && bookingSummary.originalPrice && (
            <div className={styles.summaryRow}>
              <span className={styles.discountLabel}>Discount Applied:</span>
              <span className={styles.discountValue}>
                -£{(bookingSummary.originalPrice - bookingSummary.totalPrice).toFixed(2)}
              </span>
            </div>
          )}

          <div className={styles.summaryDivider} />

          <div className={styles.summaryRow}>
            <span className={styles.totalLabel}>Total Amount:</span>
            <span className={styles.totalValue}>£{bookingSummary.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className={styles.paymentSection}>
          <h3 className={styles.paymentTitle}>Payment Details</h3>

          <div className={styles.cardElementWrapper}>
            <CardElement
              className={styles.cardElement}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1a2332',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    '::placeholder': {
                      color: '#94a3b8',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                    iconColor: '#ef4444',
                  },
                },
                hidePostalCode: false,
              }}
              onChange={(e) => setCardComplete(e.complete)}
            />
          </div>

          {/* Save Card Option */}
          <label className={styles.saveCardOption}>
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.saveCardText}>
              Save card for future bookings
            </span>
          </label>

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className={styles.secondaryButton}
          >
            Go Back
          </button>

          <button
            type="button"
            onClick={handlePayment}
            disabled={isProcessing || !stripe || !cardComplete}
            className={styles.primaryButton}
          >
            {isProcessing ? (
              <>
                <span className={styles.spinner} />
                Processing...
              </>
            ) : (
              `Confirm & Pay £${bookingSummary.totalPrice.toFixed(2)}`
            )}
          </button>
        </div>

        {/* Security Badge */}
        <div className={styles.securityBadge}>
          <span className={styles.lockIcon}>🔒</span>
          <span className={styles.securityText}>
            Secured by Stripe • Your payment details are encrypted and secure
          </span>
        </div>
      </div>
    </>
  );
}
