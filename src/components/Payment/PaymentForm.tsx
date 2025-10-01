import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement
} from '@stripe/react-stripe-js';
import {
  PaymentFlow,
  PaymentIntent,
  PaymentError,
  PriceBreakdown,
  SavedPaymentMethod,
  ExpressPayment
} from '../../types';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import styles from './PaymentForm.module.css';

// Initialize Stripe (in production, use environment variable)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PaymentFormProps {
  paymentFlow: PaymentFlow;
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentError: (error: PaymentError) => void;
  onCancel: () => void;
  savedPaymentMethods?: SavedPaymentMethod[];
  expressPaymentOptions?: ExpressPayment;
}

// Main PaymentForm wrapper component
export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}

// Internal payment form content
function PaymentFormContent({
  paymentFlow,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
  savedPaymentMethods = [],
  expressPaymentOptions = { applePay: true, googlePay: true, payPal: true, savedCards: [] }
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  // Payment method is always 'card' for now - future expansion for other methods
  // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [showSavedMethods, setShowSavedMethods] = useState(savedPaymentMethods.length > 0);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<SavedPaymentMethod | null>(
    savedPaymentMethods.find(method => method.isDefault) || null
  );

  // Calculate price breakdown with VAT
  useEffect(() => {
    const calculatePricing = () => {
      const basePrice = paymentFlow.amount;
      const vatRate = 0.20; // 20% UK VAT
      const vatAmount = Math.round(basePrice * vatRate);
      const totalPrice = basePrice + vatAmount;

      setPriceBreakdown({
        basePrice,
        vatRate,
        vatAmount,
        totalPrice,
        currency: paymentFlow.currency,
        description: paymentFlow.description
      });
    };

    calculatePricing();
  }, [paymentFlow]);

  // Initialize Payment Request API for Apple Pay/Google Pay
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'GB',
        currency: 'gbp',
        total: {
          label: 'Armora Security Transport',
          amount: priceBreakdown?.totalPrice || paymentFlow.amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      setPaymentRequest(pr);
    }
  }, [stripe, priceBreakdown?.totalPrice, paymentFlow.amount]);

  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.canMakePayment().then((result: any) => {
        setCanMakePayment(!!result);
      });
    }
  }, [paymentRequest]);

  // Helper functions for error handling
  const getErrorType = (code: string): PaymentError['type'] => {
    if (['card_declined', 'insufficient_funds', 'expired_card'].includes(code)) {
      return 'card_error';
    }
    if (['network_error', 'processing_error'].includes(code)) {
      return 'network_error';
    }
    if (['fraud_suspected', 'security_error'].includes(code)) {
      return 'fraud_error';
    }
    return 'validation_error';
  };

  const getSuggestedAction = (code: string): string => {
    switch (code) {
      case 'card_declined':
        return 'Try a different payment method or contact your bank';
      case 'insufficient_funds':
        return 'Try a different card or add funds to your account';
      case 'expired_card':
        return 'Please update your card details';
      case 'network_error':
        return 'Check your connection and try again';
      default:
        return 'Please try again or contact support';
    }
  };

  const isRetryableError = (code: string): boolean => {
    return ['network_error', 'processing_error', 'temporary_failure'].includes(code);
  };

  // Error handling function - moved before useEffect to avoid hoisting issues
  const handlePaymentError = useCallback((error: any) => {
    const paymentError: PaymentError = {
      code: error.code || 'unknown_error',
      message: error.message || 'An unexpected error occurred',
      type: getErrorType(error.code),
      suggestedAction: getSuggestedAction(error.code),
      retryable: isRetryableError(error.code)
    };

    setPaymentError(paymentError);
    onPaymentError(paymentError);
  }, [onPaymentError]);

  // Create payment intent via Vercel API
  const createPaymentIntent = async (flow: PaymentFlow): Promise<PaymentIntent> => {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Authentication required. Please sign in to continue.');
      }

      // Call Vercel API to create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: flow.amount,
          currency: flow.currency,
          description: flow.description,
          metadata: {
            serviceType: flow.metadata?.serviceType || 'protection_assignment',
            route: flow.metadata?.route || '',
            scheduledTime: flow.metadata?.scheduledTime || '',
            corporateAssignment: flow.metadata?.corporateAssignment || false,
            principalId: session.user.id,
            userId: flow.protectionAssignmentDetails.user?.id,
            pickupLocation: flow.protectionAssignmentDetails.commencementPoint,
            dropoffLocation: flow.protectionAssignmentDetails.secureDestination,
            estimatedDuration: flow.protectionAssignmentDetails.estimatedDuration,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();

      // Store payment intent in Supabase
      await supabase.from('payments').insert({
        payment_intent_id: data.paymentIntentId,
        amount: flow.amount,
        currency: flow.currency,
        status: 'pending',
        user_id: session.user.id,
        metadata: flow.metadata,
        created_at: new Date().toISOString(),
      });

      return {
        id: data.paymentIntentId,
        amount: flow.amount,
        currency: flow.currency,
        status: 'requires_payment_method',
        clientSecret: data.clientSecret,
      };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      throw new Error(error.message || 'Failed to initialize payment. Please try again.');
    }
  };

  // Handle express payment (Apple Pay, Google Pay)
  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.on('paymentmethod', async (ev: any) => {
        setIsProcessing(true);

        try {
          // Create payment intent on backend (mock for now)
          const paymentIntent = await createPaymentIntent({
            ...paymentFlow,
            amount: priceBreakdown?.totalPrice || paymentFlow.amount
          });

          if (paymentIntent.clientSecret && stripe) {
            const { error: confirmError } = await stripe.confirmCardPayment(
              paymentIntent.clientSecret,
              { payment_method: ev.paymentMethod.id },
              { handleActions: false }
            );

            if (confirmError) {
              ev.complete('fail');
              handlePaymentError(confirmError);
            } else {
              ev.complete('success');
              onPaymentSuccess({
                ...paymentIntent,
                status: 'succeeded'
              });
            }
          }
        } catch (error) {
          ev.complete('fail');
          handlePaymentError(error as any);
        }

        setIsProcessing(false);
      });
    }
  }, [paymentRequest, stripe, paymentFlow, priceBreakdown, onPaymentSuccess, handlePaymentError]);

  // Handle standard card payment
  const handleCardPayment = async () => {
    if (!stripe || !elements || !priceBreakdown) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: paymentFlow.protectionAssignmentDetails.user?.name || 'Anonymous',
          email: paymentFlow.protectionAssignmentDetails.user?.email || '',
        },
      });

      if (methodError) {
        throw methodError;
      }

      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        ...paymentFlow,
        amount: priceBreakdown.totalPrice
      });

      if (!paymentIntent.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment
      const { error: confirmError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        { payment_method: paymentMethod.id }
      );

      if (confirmError) {
        throw confirmError;
      }

      if (confirmedIntent) {
        onPaymentSuccess({
          id: confirmedIntent.id,
          amount: confirmedIntent.amount,
          currency: confirmedIntent.currency,
          status: confirmedIntent.status as any,
          clientSecret: confirmedIntent.client_secret || undefined
        });
      }

    } catch (error: any) {
      handlePaymentError(error);
    }

    setIsProcessing(false);
  };

  // Handle saved payment method
  const handleSavedMethodPayment = async (savedMethod: SavedPaymentMethod) => {
    if (!stripe || !priceBreakdown) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const paymentIntent = await createPaymentIntent({
        ...paymentFlow,
        amount: priceBreakdown.totalPrice
      });

      if (!paymentIntent.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        { payment_method: savedMethod.id }
      );

      if (error) {
        throw error;
      }

      if (confirmedIntent) {
        onPaymentSuccess({
          id: confirmedIntent.id,
          amount: confirmedIntent.amount,
          currency: confirmedIntent.currency,
          status: confirmedIntent.status as any,
          paymentMethod: savedMethod
        });
      }

    } catch (error: any) {
      handlePaymentError(error);
    }

    setIsProcessing(false);
  };

  // Functions moved above to avoid hoisting issues

  if (!priceBreakdown) {
    return <LoadingSpinner size="large" text="Preparing payment..." />;
  }

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentHeader}>
        <h2 className={styles.title}>Complete Your Assignment</h2>
        <p className={styles.subtitle}>Secure payment powered by Stripe</p>
      </div>

      {/* Price Breakdown */}
      <div className={styles.priceBreakdown}>
        <h3 className={styles.breakdownTitle}>Payment Summary</h3>
        <div className={styles.breakdownItem}>
          <span className={styles.itemLabel}>{priceBreakdown.description}</span>
          <span className={styles.itemValue}>£{(priceBreakdown.basePrice / 100).toFixed(2)}</span>
        </div>
        <div className={styles.breakdownItem}>
          <span className={styles.itemLabel}>VAT (20%)</span>
          <span className={styles.itemValue}>£{(priceBreakdown.vatAmount / 100).toFixed(2)}</span>
        </div>
        {paymentFlow.protectionAssignmentDetails.user?.hasUnlockedReward && (
          <div className={styles.breakdownItem}>
            <span className={styles.itemLabel}>50% Reward Discount</span>
            <span className={styles.itemValue}>-£{((priceBreakdown.totalPrice * 0.5) / 100).toFixed(2)}</span>
          </div>
        )}
        <div className={styles.breakdownTotal}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>
            £{((paymentFlow.protectionAssignmentDetails.user?.hasUnlockedReward ? priceBreakdown.totalPrice * 0.5 : priceBreakdown.totalPrice) / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Error Display */}
      {paymentError && (
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            <div>
              <div className={styles.errorTitle}>{paymentError.message}</div>
              {paymentError.suggestedAction && (
                <div className={styles.errorSuggestion}>{paymentError.suggestedAction}</div>
              )}
            </div>
          </div>
          {paymentError.retryable && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPaymentError(null)}
              className={styles.retryButton}
            >
              Try Again
            </Button>
          )}
        </div>
      )}

      {/* Express Payment Options */}
      {canMakePayment && (
        <div className={styles.expressPayment}>
          <div className={styles.expressTitle}>Quick Payment</div>
          <PaymentRequestButtonElement
            className={styles.expressButton}
            options={{ paymentRequest }}
          />
          <div className={styles.divider}>
            <span>or pay with card</span>
          </div>
        </div>
      )}

      {/* Saved Payment Methods */}
      {showSavedMethods && savedPaymentMethods.length > 0 && (
        <div className={styles.savedMethods}>
          <h3 className={styles.savedTitle}>Saved Payment Methods</h3>
          {savedPaymentMethods.map((method) => (
            <div
              key={method.id}
              className={`${styles.savedMethod} ${selectedSavedMethod?.id === method.id ? styles.selected : ''}`}
              onClick={() => setSelectedSavedMethod(method)}
            >
              <div className={styles.methodInfo}>
                <span className={styles.methodBrand}>{method.brand?.toUpperCase()}</span>
                <span className={styles.methodLast4}>•••• {method.last4}</span>
                {method.isDefault && <span className={styles.defaultBadge}>Default</span>}
              </div>
            </div>
          ))}

          {selectedSavedMethod && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleSavedMethodPayment(selectedSavedMethod)}
              disabled={isProcessing}
              className={styles.payButton}
              isFullWidth
            >
              {isProcessing ? (
                <LoadingSpinner size="small" variant="light" text="Processing..." inline />
              ) : (
                `Pay £${((paymentFlow.protectionAssignmentDetails.user?.hasUnlockedReward ? priceBreakdown.totalPrice * 0.5 : priceBreakdown.totalPrice) / 100).toFixed(2)}`
              )}
            </Button>
          )}

          <button
            className={styles.newMethodButton}
            onClick={() => setShowSavedMethods(false)}
          >
            Use a different payment method
          </button>
        </div>
      )}

      {/* New Card Payment */}
      {!showSavedMethods && (
        <div className={styles.cardPayment}>
          <h3 className={styles.cardTitle}>Payment Details</h3>

          <div className={styles.cardElementContainer}>
            <CardElement
              className={styles.cardElement}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#e0e0e0',
                    backgroundColor: 'transparent',
                    fontFamily: 'system-ui, sans-serif',
                    '::placeholder': {
                      color: '#a0a0a0',
                    },
                  },
                  invalid: {
                    color: '#ff4444',
                  },
                },
                hidePostalCode: false,
              }}
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleCardPayment}
            disabled={isProcessing || !stripe || !elements}
            className={styles.payButton}
            isFullWidth
          >
            {isProcessing ? (
              <LoadingSpinner size="small" variant="light" text="Processing..." inline />
            ) : (
              `Pay £${((paymentFlow.protectionAssignmentDetails.user?.hasUnlockedReward ? priceBreakdown.totalPrice * 0.5 : priceBreakdown.totalPrice) / 100).toFixed(2)}`
            )}
          </Button>

          {savedPaymentMethods.length > 0 && (
            <button
              className={styles.savedMethodsToggle}
              onClick={() => setShowSavedMethods(true)}
            >
              Use saved payment method
            </button>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className={styles.footerActions}>
        <Button
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isProcessing}
          className={styles.cancelButton}
        >
          Cancel
        </Button>

        <div className={styles.securityBadge}>
          <span className={styles.securityIcon}>🔒</span>
          <span className={styles.securityText}>Secured by Stripe</span>
        </div>
      </div>
    </div>
  );
}