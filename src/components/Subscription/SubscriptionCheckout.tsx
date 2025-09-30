// Armora Protection Service - Subscription Checkout
// £14.99/month membership with 50% discount on all protection services

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from './SubscriptionCheckout.module.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionCheckoutProps {
  userId: string;
  onSuccess: (subscriptionId: string) => void;
  onCancel: () => void;
}

function CheckoutForm({ userId, onSuccess, onCancel }: SubscriptionCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Create subscription via Edge Function
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jmzvrqwjmlnvxojculee.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userId,
          priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PRICE_ID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const { clientSecret, subscriptionId } = await response.json();

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/subscription-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setIsProcessing(false);
      } else {
        onSuccess(subscriptionId);
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      setErrorMessage(error.message || 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h1 className={styles.title}>Armora Membership</h1>
        <div className={styles.price}>
          <span className={styles.priceAmount}>£14.99</span>
          <span className={styles.priceInterval}>/month</span>
        </div>
      </div>

      <div className={styles.benefits}>
        <h3 className={styles.benefitsTitle}>Membership Benefits</h3>
        <ul className={styles.benefitsList}>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✓</span>
            <span className={styles.benefitText}>50% discount on all protection services</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✓</span>
            <span className={styles.benefitText}>Priority CPO assignment</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✓</span>
            <span className={styles.benefitText}>24/7 dedicated security support line</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✓</span>
            <span className={styles.benefitText}>Flexible cancellation - cancel anytime</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✓</span>
            <span className={styles.benefitText}>Advanced protection detail scheduling</span>
          </li>
          <li className={styles.benefitItem}>
            <span className={styles.benefitIcon}>✓</span>
            <span className={styles.benefitText}>Access to Shadow Protocol tier</span>
          </li>
        </ul>
      </div>

      <div className={styles.savingsCalculator}>
        <h4 className={styles.savingsTitle}>Example Savings</h4>
        <div className={styles.savingsRow}>
          <span className={styles.savingsLabel}>Executive Service (2 hours):</span>
          <div className={styles.savingsAmount}>
            <span className={styles.savingsOriginal}>£190</span>
            <span className={styles.savingsFinal}>£95</span>
            <span className={styles.savingsBadge}>Save £95</span>
          </div>
        </div>
        <p className={styles.savingsNote}>
          One protection service per month pays for itself. Everything else is pure savings.
        </p>
      </div>

      <div className={styles.paymentSection}>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {errorMessage}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Subscribe Now'}
        </button>
      </div>

      <div className={styles.terms}>
        <p className={styles.termsText}>
          By subscribing, you agree to automatic monthly billing. Cancel anytime from your account settings.
          Full terms available in our <a href="/terms" className={styles.termsLink}>Terms of Service</a>.
        </p>
      </div>
    </form>
  );
}

export function SubscriptionCheckout({ userId, onSuccess, onCancel }: SubscriptionCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize subscription setup intent
  useState(() => {
    const initializeSubscription = async () => {
      try {
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jmzvrqwjmlnvxojculee.supabase.co';
        const response = await fetch(`${supabaseUrl}/functions/v1/create-subscription-setup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize subscription');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Subscription initialization error:', err);
        setError(err.message || 'Failed to load payment form');
        setIsLoading(false);
      }
    };

    initializeSubscription();
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading subscription checkout...</p>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className={styles.errorContainer}>
        <h2>Unable to Load Checkout</h2>
        <p>{error || 'Please try again later'}</p>
        <button onClick={onCancel} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#D4AF37',
        colorBackground: '#1a1a1a',
        colorText: '#ffffff',
        colorDanger: '#ff4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '12px',
      },
    },
  };

  return (
    <div className={styles.container}>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm userId={userId} onSuccess={onSuccess} onCancel={onCancel} />
      </Elements>
    </div>
  );
}
