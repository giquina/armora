import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import SubscriptionCard from './SubscriptionCard';
import styles from './SubscriptionManager.module.css';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  discount: number;
  color: string;
  recommended?: boolean;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'essential',
    name: 'Essential Protection',
    price: 29,
    period: 'month',
    features: [
      '10% discount on all protection services',
      'Priority booking access',
      'Monthly security newsletter',
      'Basic threat assessment reports',
      '24/7 customer support'
    ],
    discount: 10,
    color: '#9E9E9E'
  },
  {
    id: 'executive',
    name: 'Executive Shield',
    price: 79,
    period: 'month',
    features: [
      '25% discount on all protection services',
      'Immediate booking priority',
      'Weekly security briefings',
      'Advanced threat intelligence',
      'Dedicated account manager',
      'Free security consultations',
      'Emergency response priority'
    ],
    discount: 25,
    color: '#FFD700',
    recommended: true
  },
  {
    id: 'elite',
    name: 'Elite Fortress',
    price: 199,
    period: 'month',
    features: [
      '40% discount on all protection services',
      'Instant booking with no wait times',
      'Daily security updates',
      'Real-time threat monitoring',
      'Personal security advisor',
      'Unlimited security consultations',
      'Highest emergency priority',
      'Exclusive CPO team access',
      'International protection coverage'
    ],
    discount: 40,
    color: '#E91E63'
  }
];

const SubscriptionManager: React.FC = () => {
  const { state, setSubscription } = useApp();
  const [selectedTier, setSelectedTier] = useState<string | null>(state.subscription?.tier || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectTier = async (tierId: string) => {
    if (tierId === selectedTier) return;

    setIsProcessing(true);

    // Simulate subscription processing
    setTimeout(() => {
      const tier = subscriptionTiers.find(t => t.id === tierId);
      if (tier) {
        setSubscription({
          tier: tierId as 'essential' | 'executive' | 'elite',
          status: 'trial',
          isTrialActive: true,
          trialStartDate: new Date(),
          trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          daysRemainingInTrial: 30,
          memberBenefits: {
            discountPercentage: tier.discount,
            bookingFee: tier.id === 'elite' ? 0 : tier.id === 'executive' ? 5 : 10,
            priorityBooking: tier.name.includes('Executive') || tier.name.includes('Elite'),
            flexibleCancellation: tier.id !== 'essential',
            dedicatedManager: tier.name.includes('Elite'),
            responseTime: tier.id === 'elite' ? 'Immediate' : tier.id === 'executive' ? '< 15 minutes' : '< 30 minutes'
          }
        });
        setSelectedTier(tierId);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
      setIsProcessing(false);
    }, 1500);
  };

  const handleCancelSubscription = () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose all benefits immediately.')) {
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setSubscription(null);
      setSelectedTier(null);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className={styles.subscriptionManager}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>🛡️</span>
          Protection Subscription Plans
        </h1>
        <p className={styles.subtitle}>
          Unlock exclusive discounts and priority access to elite protection services
        </p>
      </div>

      {showSuccess && (
        <div className={styles.successBanner}>
          <span className={styles.successIcon}>✓</span>
          <span>Subscription activated successfully!</span>
        </div>
      )}

      <div className={styles.currentPlan}>
        {selectedTier ? (
          <>
            <div className={styles.planInfo}>
              <span className={styles.planLabel}>Current Plan:</span>
              <span className={styles.planName}>
                {subscriptionTiers.find(t => t.id === selectedTier)?.name}
              </span>
              <span className={styles.planDiscount}>
                {subscriptionTiers.find(t => t.id === selectedTier)?.discount}% Discount Active
              </span>
            </div>
            <button
              className={styles.cancelButton}
              onClick={handleCancelSubscription}
              disabled={isProcessing}
            >
              Cancel Subscription
            </button>
          </>
        ) : (
          <div className={styles.noPlan}>
            <span className={styles.noPlanIcon}>ℹ️</span>
            <span>No active subscription - Choose a plan to save on protection services</span>
          </div>
        )}
      </div>

      <div className={styles.tiersGrid}>
        {subscriptionTiers.map((tier) => (
          <SubscriptionCard
            key={tier.id}
            tier={tier}
            isActive={tier.id === selectedTier}
            onSelect={() => handleSelectTier(tier.id)}
          />
        ))}
      </div>

      {isProcessing && (
        <div className={styles.processingOverlay}>
          <div className={styles.processingSpinner}>
            <div className={styles.spinner}></div>
            <p>Processing subscription...</p>
          </div>
        </div>
      )}

      <div className={styles.benefits}>
        <h2 className={styles.benefitsTitle}>Why Subscribe?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>💰</span>
            <h3>Save Money</h3>
            <p>Get up to 40% off all protection services with Elite membership</p>
          </div>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>⚡</span>
            <h3>Priority Access</h3>
            <p>Skip the queue with instant booking and immediate CPO assignment</p>
          </div>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>🔒</span>
            <h3>Enhanced Security</h3>
            <p>Access to elite CPO teams and advanced threat intelligence</p>
          </div>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>🌍</span>
            <h3>Global Coverage</h3>
            <p>Elite members get international protection coverage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;