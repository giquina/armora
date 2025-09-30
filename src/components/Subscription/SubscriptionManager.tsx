// Armora Subscription Manager
// Manage active subscription, view benefits, and cancel

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './SubscriptionManager.module.css';

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

interface SubscriptionManagerProps {
  userId: string;
  onSubscribe?: () => void;
}

export function SubscriptionManager({ userId, onSubscribe }: SubscriptionManagerProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, [userId]);

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error loading subscription:', err);
      setError(err.message || 'Failed to load subscription');
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setIsCancelling(true);
    setError(null);

    try {
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jmzvrqwjmlnvxojculee.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      await loadSubscription();
      setShowCancelConfirm(false);
      alert('Subscription cancelled. You will retain benefits until the end of your billing period.');
    } catch (err: any) {
      console.error('Cancellation error:', err);
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading subscription details...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className={styles.noSubscription}>
        <div className={styles.noSubIcon}>🔐</div>
        <h2 className={styles.noSubTitle}>No Active Membership</h2>
        <p className={styles.noSubText}>
          Subscribe to Armora Membership for 50% off all protection services and exclusive benefits.
        </p>
        <button onClick={onSubscribe} className={styles.subscribeButton}>
          Subscribe Now - £14.99/month
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Armora Membership</h1>
        <div className={styles.statusBadge} data-status={subscription.status}>
          {subscription.status === 'active' ? '✓ Active' : subscription.status}
        </div>
      </div>

      <div className={styles.subscriptionCard}>
        <div className={styles.cardHeader}>
          <div className={styles.price}>
            <span className={styles.priceAmount}>£14.99</span>
            <span className={styles.priceInterval}>/month</span>
          </div>
          {subscription.cancel_at_period_end && (
            <div className={styles.cancelWarning}>
              ⚠️ Cancels on {formatDate(subscription.current_period_end)}
            </div>
          )}
        </div>

        <div className={styles.billingInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Current period:</span>
            <span className={styles.infoValue}>
              {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Next billing date:</span>
            <span className={styles.infoValue}>
              {subscription.cancel_at_period_end
                ? 'Subscription ending'
                : formatDate(subscription.current_period_end)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Member since:</span>
            <span className={styles.infoValue}>{formatDate(subscription.created_at)}</span>
          </div>
        </div>
      </div>

      <div className={styles.benefitsSection}>
        <h3 className={styles.sectionTitle}>Active Benefits</h3>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💰</div>
            <div className={styles.benefitTitle}>50% Service Discount</div>
            <div className={styles.benefitDescription}>
              Half price on all protection services
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>⚡</div>
            <div className={styles.benefitTitle}>Priority Assignment</div>
            <div className={styles.benefitDescription}>
              First access to available CPOs
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📞</div>
            <div className={styles.benefitTitle}>24/7 Support</div>
            <div className={styles.benefitDescription}>
              Dedicated security support line
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🎯</div>
            <div className={styles.benefitTitle}>Shadow Protocol</div>
            <div className={styles.benefitDescription}>
              Access to elite protection tier
            </div>
          </div>
        </div>
      </div>

      <div className={styles.savingsSection}>
        <h3 className={styles.sectionTitle}>Monthly Savings Calculator</h3>
        <div className={styles.savingsExamples}>
          <div className={styles.savingsRow}>
            <span className={styles.savingsService}>Essential (2hrs)</span>
            <span className={styles.savingsOriginal}>£130</span>
            <span className={styles.savingsArrow}>→</span>
            <span className={styles.savingsFinal}>£65</span>
            <span className={styles.savingsAmount}>Save £65</span>
          </div>
          <div className={styles.savingsRow}>
            <span className={styles.savingsService}>Executive (3hrs)</span>
            <span className={styles.savingsOriginal}>£285</span>
            <span className={styles.savingsArrow}>→</span>
            <span className={styles.savingsFinal}>£142.50</span>
            <span className={styles.savingsAmount}>Save £142.50</span>
          </div>
          <div className={styles.savingsRow}>
            <span className={styles.savingsService}>Shadow (4hrs)</span>
            <span className={styles.savingsOriginal}>£500</span>
            <span className={styles.savingsArrow}>→</span>
            <span className={styles.savingsFinal}>£250</span>
            <span className={styles.savingsAmount}>Save £250</span>
          </div>
        </div>
        <p className={styles.savingsNote}>
          One protection service per month typically exceeds the membership cost.
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {!subscription.cancel_at_period_end && (
        <div className={styles.actions}>
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className={styles.cancelButton}
            >
              Cancel Membership
            </button>
          ) : (
            <div className={styles.confirmCancel}>
              <p className={styles.confirmText}>
                Are you sure? You'll lose 50% discount benefits at the end of your billing period.
              </p>
              <div className={styles.confirmActions}>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className={styles.keepButton}
                  disabled={isCancelling}
                >
                  Keep Membership
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className={styles.confirmButton}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {subscription.cancel_at_period_end && (
        <div className={styles.reactivateSection}>
          <p className={styles.reactivateText}>
            Your membership will end on {formatDate(subscription.current_period_end)}.
            Reactivate to keep your benefits.
          </p>
          <button className={styles.reactivateButton}>
            Reactivate Membership
          </button>
        </div>
      )}
    </div>
  );
}
