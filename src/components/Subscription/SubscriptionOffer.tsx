// Armora Security Transport - Subscription Offer Component

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { subscriptionPlans, calculateSavings, formatSavings } from '../../data/subscriptionData';
import { PremiumInterest } from '../../types';
import { SafeAssignmentFundExplainer } from '../Common/SafeAssignmentFundExplainer';
import styles from './SubscriptionOffer.module.css';

interface SubscriptionOfferProps {
  selectedService?: string;
  servicePrice?: number;
}

export function SubscriptionOffer({ selectedService, servicePrice = 45 }: SubscriptionOfferProps) {
  const { state, startFreeTrial, recordPremiumInterest, navigateToView, setError } = useApp();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [emailForInterest, setEmailForInterest] = useState('');
  const [expectedUsage, setExpectedUsage] = useState('');
  const [showInterestForm, setShowInterestForm] = useState<string | null>(null);
  const [showSafeRideFund, setShowSafeRideFund] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const essentialPlan = subscriptionPlans.find(p => p.tier === 'essential')!;
  const executivePlan = subscriptionPlans.find(p => p.tier === 'executive')!;
  const elitePlan = subscriptionPlans.find(p => p.tier === 'elite')!;

  const essentialSavings = calculateSavings(servicePrice, 'essential');

  const handleStartTrial = async () => {
    try {
      setIsSubmitting('essential');
      await startFreeTrial('essential');
      // Navigate to booking with trial active
      navigateToView('booking');
    } catch (error) {
      console.error('Trial signup error:', error);
    } finally {
      setIsSubmitting(null);
    }
  };

  const handlePremiumInterest = async (tier: 'executive' | 'elite') => {
    if (!emailForInterest || !expectedUsage) {
      setError('Please provide your email and expected usage frequency');
      return;
    }

    try {
      setIsSubmitting(tier);
      
      const interestData: PremiumInterest = {
        tier,
        userEmail: emailForInterest,
        expectedUsage,
        timestamp: new Date(),
        userType: state.user?.userType || 'guest',
        questionnaire: !!state.questionnaireData
      };

      await recordPremiumInterest(interestData);
      
      // Show success message
      setShowInterestForm(null);
      setEmailForInterest('');
      setExpectedUsage('');
      
      // Show confirmation
      alert(`Thank you! We've recorded your interest in ${tier === 'executive' ? 'Executive' : 'Elite'} tier. You'll be among the first to know when it launches!`);
      
    } catch (error) {
      console.error('Interest submission error:', error);
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleGuestBooking = () => {
    navigateToView('booking');
  };

  const handleClosePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsPanelOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleReopenPanel = () => {
    setIsPanelOpen(true);
  };

  return (
    <>
      {/* Sticky Reopener Bar - shows when panel is closed */}
      {!isPanelOpen && (
        <div className={styles.stickyReopener} onClick={handleReopenPanel}>
          <div className={styles.reopenerContent}>
            <span className={styles.reopenerIcon}>💰</span>
            <span className={styles.reopenerText}>Special Membership Offer</span>
            <span className={styles.reopenerArrow}>↑</span>
          </div>
        </div>
      )}

      {/* Main Panel */}
      <div className={`${styles.container} ${isPanelOpen ? styles.panelOpen : styles.panelClosed} ${isClosing ? styles.panelClosing : ''}`}>
        <div className={styles.content}>
          {/* Close button */}
          <button
            className={styles.panelCloseButton}
            onClick={handleClosePanel}
            aria-label="Close membership panel"
          >
            ×
          </button>
        <header className={styles.header}>
          <h1 className={styles.title}>💰 Save Money AND Save Lives!</h1>
          <p className={styles.subtitle}>
            Choose your membership level and start saving immediately
          </p>
          <div className={styles.socialProofContainer}>
            <div className={styles.socialProof}>
              <span className={styles.socialProofIcon}>🛡️</span>
              <span className={styles.socialProofText}>
                Join <strong>1,247 members</strong> protecting themselves AND others
              </span>
            </div>
            <div className={styles.impactCounter}>
              <span className={styles.counterNumber}>278</span>
              <span className={styles.counterText}>successful protection assignments this month</span>
            </div>
          </div>
        </header>

        <div className={styles.plansContainer}>
          {/* Essential Plan - Available with Free Trial */}
          <div className={`${styles.planCard} ${styles.primaryPlan}`}>
            <div className={styles.planBadge}>
              <span className={styles.badge}>🟢 AVAILABLE NOW</span>
              <span className={styles.impactBadge}>🛡️ Protection Plus Impact</span>
            </div>
            
            <div className={styles.planHeader}>
              <h2 className={styles.planName}>{essentialPlan.name}</h2>
              <div className={styles.trialOffer}>
                🎁 FREE for first 30 days!
              </div>
            </div>

            <div className={styles.savingsHighlight}>
              <div className={styles.savingsAmount}>
                Save {formatSavings(essentialSavings)} on your booking today:
              </div>
              <div className={styles.savingsBreakdown}>
                • {essentialPlan.discount}% discount: £{servicePrice} → £{(servicePrice * 0.9).toFixed(2)}
              </div>
              <div className={styles.savingsBreakdown}>
                • £{essentialPlan.originalBookingFee} booking fee → £0
              </div>
              <div className={styles.savingsBreakdown}>
                • Priority {essentialPlan.responseTime} response
              </div>
            </div>

            <SafeAssignmentFundExplainer variant="compact" showAnimation={false} />
            
            <div className={styles.safeRideFundSection}>
              <button 
                className={styles.learnMoreButton}
                onClick={() => setShowSafeRideFund(!showSafeRideFund)}
              >
                {showSafeRideFund ? 'Hide Impact Details' : 'Why this matters'} 
                <span className={styles.toggleIcon}>{showSafeRideFund ? '▲' : '▼'}</span>
              </button>
              
              {showSafeRideFund && (
                <SafeAssignmentFundExplainer variant="breakdown" showAnimation={false} />
              )}
            </div>

            <button 
              className={styles.primaryButton}
              onClick={handleStartTrial}
              disabled={isSubmitting === 'essential'}
            >
              {isSubmitting === 'essential' ? 'Starting Trial...' : 'START FREE TRIAL & BOOK'}
            </button>

            <div className={styles.trialDetails}>
              No payment required • Cancel anytime • Full benefits from day 1
            </div>
          </div>

          {/* Executive Plan - Coming Soon */}
          <div className={`${styles.planCard} ${styles.comingSoonPlan}`}>
            <div className={styles.planBadge}>
              <span className={styles.badge}>🟡 COMING SOON</span>
            </div>
            
            <div className={styles.planHeader}>
              <h2 className={styles.planName}>{executivePlan.name}</h2>
              <div className={styles.planPrice}>{executivePlan.monthlyPrice}/month</div>
            </div>

            <div className={styles.comingSoonFeatures}>
              <div className={styles.featureHighlight}>
                🚧 {executivePlan.discount}% savings + Dedicated Security Manager
              </div>
              <ul className={styles.featureList}>
                <li>• {executivePlan.responseTime} priority response</li>
                <li>• Premium vehicle fleet access</li>
                <li>• 24/7 priority support line</li>
                <li>• Personal security consultation</li>
              </ul>
            </div>

            <button 
              className={styles.secondaryButton}
              onClick={() => setShowInterestForm('executive')}
              disabled={isSubmitting === 'executive'}
            >
              {isSubmitting === 'executive' ? 'Recording Interest...' : 'NOTIFY ME'}
            </button>
          </div>

          {/* Elite Plan - Coming Soon */}
          <div className={`${styles.planCard} ${styles.comingSoonPlan}`}>
            <div className={styles.planBadge}>
              <span className={styles.badge}>🔴 COMING SOON</span>
            </div>
            
            <div className={styles.planHeader}>
              <h2 className={styles.planName}>{elitePlan.name}</h2>
              <div className={styles.planPrice}>{elitePlan.monthlyPrice}/month</div>
            </div>

            <div className={styles.comingSoonFeatures}>
              <div className={styles.featureHighlight}>
                🚧 {elitePlan.discount}% savings + Full VIP Service
              </div>
              <ul className={styles.featureList}>
                <li>• {elitePlan.responseTime} priority response</li>
                <li>• Access to all service tiers</li>
                <li>• VIP lounge access</li>
                <li>• Concierge travel arrangements</li>
              </ul>
            </div>

            <button 
              className={styles.secondaryButton}
              onClick={() => setShowInterestForm('elite')}
              disabled={isSubmitting === 'elite'}
            >
              {isSubmitting === 'elite' ? 'Recording Interest...' : 'JOIN WAITLIST'}
            </button>
          </div>
        </div>

        {/* Interest Form Modal */}
        {showInterestForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>Express Interest - {showInterestForm === 'executive' ? 'Executive' : 'Elite'} Tier</h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowInterestForm(null)}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.modalContent}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    value={emailForInterest}
                    onChange={(e) => setEmailForInterest(e.target.value)}
                    placeholder="your.email@company.com"
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="usage">Expected Usage *</label>
                  <select
                    id="usage"
                    value={expectedUsage}
                    onChange={(e) => setExpectedUsage(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Select frequency...</option>
                    <option value="daily">Daily (5+ times per week)</option>
                    <option value="frequent">Frequent (3-4 times per week)</option>
                    <option value="regular">Regular (1-2 times per week)</option>
                    <option value="occasional">Occasional (2-3 times per month)</option>
                    <option value="rare">Rare (once per month or less)</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.submitButton}
                  onClick={() => handlePremiumInterest(showInterestForm as 'executive' | 'elite')}
                  disabled={!emailForInterest || !expectedUsage || !!isSubmitting}
                >
                  Submit Interest
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowInterestForm(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guest Booking Option */}
        <div className={styles.guestOption}>
          <div className={styles.divider}>
            <span>OR</span>
          </div>
          
          <button 
            className={styles.guestButton}
            onClick={handleGuestBooking}
          >
            Book as Guest
          </button>
          
          <div className={styles.guestDetails}>
            No benefits • £{servicePrice} + £5 booking fee = £{servicePrice + 5} total
          </div>
        </div>
        </div>
      </div>
    </>
  );
}