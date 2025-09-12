// Armora Security Transport - Marketing Banner Component

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './MarketingBanner.module.css';

interface MarketingBannerProps {
  onTrialStart: () => void;
  currentUser?: any;
  variant?: 'savings' | 'impact' | 'urgency';
  className?: string;
}

interface MarketingBannerState {
  isVisible: boolean;
  dismissCount: number;
  lastDismissed: string | null;
  hasStartedTrial: boolean;
  currentRidesCount: number;
  currentMemberCount: number;
  showAnimation: boolean;
}

// Mock data for marketing metrics
const marketingData = {
  currentRidesFunded: 3742,
  currentMembers: 1247,
  averageSavings: 32,
  testimonial: "I save enough to cover my subscription in just 3 rides! - Sarah M.",
  urgencyMessage: "753 spots remaining at founding member price",
  impactStats: {
    monthly: 278,
    weekly: 64,
    daily: 9
  }
};

export function MarketingBanner({ 
  onTrialStart, 
  currentUser, 
  variant = 'savings',
  className = '' 
}: MarketingBannerProps) {
  const { state, startFreeTrial, navigateToView } = useApp();
  
  const [bannerState, setBannerState] = useState<MarketingBannerState>({
    isVisible: false,
    dismissCount: 0,
    lastDismissed: null,
    hasStartedTrial: false,
    currentRidesCount: 3700,
    currentMemberCount: marketingData.currentMembers,
    showAnimation: true
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [showBounce, setShowBounce] = useState(false);

  // Load banner state from localStorage
  useEffect(() => {
    const savedDismissCount = parseInt(localStorage.getItem('marketingBannerDismissCount') || '0');
    const savedLastDismissed = localStorage.getItem('marketingBannerLastDismissed');
    const savedTrialStarted = localStorage.getItem('marketingBannerTrialStarted') === 'true';

    setBannerState(prev => ({
      ...prev,
      dismissCount: savedDismissCount,
      lastDismissed: savedLastDismissed,
      hasStartedTrial: savedTrialStarted
    }));
  }, []);

  // Check if banner should be shown
  const shouldShowBanner = useCallback(() => {
    // Don't show to Essential members
    if (state.subscription?.tier === 'essential') {
      return false;
    }

    // Don't show if dismissed too many times
    if (bannerState.dismissCount >= 3) {
      const lastDismissed = bannerState.lastDismissed ? new Date(bannerState.lastDismissed) : null;
      const now = new Date();
      const daysSinceDismissal = lastDismissed ? 
        (now.getTime() - lastDismissed.getTime()) / (1000 * 60 * 60 * 24) : 999;
      
      if (daysSinceDismissal < 7) {
        return false;
      }
    }

    // Don't show if already started trial
    if (bannerState.hasStartedTrial) {
      return false;
    }

    // Don't show on very small screens
    if (window.innerHeight < 500) {
      return false;
    }

    return true;
  }, [state.subscription, bannerState.dismissCount, bannerState.lastDismissed, bannerState.hasStartedTrial]);

  // Show banner with delay on dashboard load
  useEffect(() => {
    if (shouldShowBanner()) {
      const showTimer = setTimeout(() => {
        setBannerState(prev => ({ ...prev, isVisible: true }));
        
        // Start counter animation shortly after banner appears
        setTimeout(() => {
          setIsAnimating(true);
          animateCounter();
        }, 500);
        
        // Add attention bounce after banner is visible
        setTimeout(() => {
          setShowBounce(true);
          setTimeout(() => setShowBounce(false), 600);
        }, 4000);
      }, 3000); // 3 second delay after dashboard load

      return () => clearTimeout(showTimer);
    }
  }, [shouldShowBanner]);

  // Animate the rides counter
  const animateCounter = useCallback(() => {
    let current = 3700;
    const target = marketingData.currentRidesFunded;
    const increment = 1;
    const interval = 50; // 50ms between increments

    const counterInterval = setInterval(() => {
      current += increment;
      setBannerState(prev => ({ ...prev, currentRidesCount: current }));

      if (current >= target) {
        clearInterval(counterInterval);
        // Add golden glow pulse when complete
        setTimeout(() => {
          setBannerState(prev => ({ ...prev, showAnimation: false }));
        }, 500);
      }
    }, interval);
  }, []);

  // Slowly increment member count occasionally
  useEffect(() => {
    if (!bannerState.isVisible) return;

    const memberIncrement = setInterval(() => {
      const randomDelay = Math.random() * 45000 + 45000; // 45-90 seconds
      setTimeout(() => {
        setBannerState(prev => ({
          ...prev,
          currentMemberCount: prev.currentMemberCount + 1
        }));
      }, randomDelay);
    }, 60000); // Check every minute

    return () => clearInterval(memberIncrement);
  }, [bannerState.isVisible]);

  // Handle banner dismissal
  const handleDismiss = () => {
    const newDismissCount = bannerState.dismissCount + 1;
    const dismissTime = new Date().toISOString();

    setBannerState(prev => ({
      ...prev,
      isVisible: false,
      dismissCount: newDismissCount,
      lastDismissed: dismissTime
    }));

    // Save to localStorage
    localStorage.setItem('marketingBannerDismissCount', newDismissCount.toString());
    localStorage.setItem('marketingBannerLastDismissed', dismissTime);

    // Track dismissal
    console.log('📊 Analytics: banner_dismissed', { 
      dismissCount: newDismissCount, 
      variant,
      timeOnScreen: Date.now() // Would calculate actual time in real app
    });
  };

  // Handle CTA click
  const handleTrialClick = async () => {
    try {
      setBannerState(prev => ({ ...prev, hasStartedTrial: true }));
      localStorage.setItem('marketingBannerTrialStarted', 'true');
      
      // Track CTA click
      console.log('📊 Analytics: cta_clicked', { variant, source: 'marketing_banner' });
      
      // Start the trial
      await startFreeTrial('essential');
      
      // Close banner and navigate
      setBannerState(prev => ({ ...prev, isVisible: false }));
      onTrialStart();
      navigateToView('booking');
      
      console.log('📊 Analytics: trial_started_from_banner', { variant });
    } catch (error) {
      console.error('Error starting trial from banner:', error);
    }
  };

  // Don't render if not visible
  if (!bannerState.isVisible) {
    return null;
  }

  const getDismissalMessage = () => {
    if (bannerState.dismissCount === 1) return "Still thinking about it?";
    if (bannerState.dismissCount === 2) return "Last chance for free month";
    return "";
  };

  const dismissalMessage = getDismissalMessage();

  return (
    <div className={`${styles.bannerContainer} ${showBounce ? styles.bounce : ''} ${className}`}>
      <div className={styles.banner}>
        {/* Close Button */}
        <button 
          className={styles.closeButton}
          onClick={handleDismiss}
          aria-label="Close marketing banner"
        >
          ×
        </button>

        {/* Dismissal Message */}
        {dismissalMessage && (
          <div className={styles.dismissalMessage}>
            {dismissalMessage}
          </div>
        )}

        {/* Main Content */}
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <h3 className={styles.headerTitle}>
              💰 Members Save £{marketingData.averageSavings}/month on average
            </h3>
            <p className={styles.headerSubtext}>
              PLUS your membership saves lives:
            </p>
          </div>

          {/* Live Counter */}
          <div className={styles.counterSection}>
            <div className={styles.counterContainer}>
              <span className={`${styles.counterNumber} ${isAnimating ? styles.animating : ''}`}>
                {bannerState.currentRidesCount.toLocaleString()}
              </span>
              <span className={styles.counterText}>safe rides funded & counting</span>
            </div>
          </div>

          {/* Benefits List */}
          <div className={styles.benefitsSection}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitHeader}>Essential Membership - £14.99/month</div>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.benefitBullet}>•</span>
              <span className={styles.benefitText}>Save 10% on every ride (£3-6 per trip)</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.benefitBullet}>•</span>
              <span className={styles.benefitText}>£0 booking fees (save £5 each time)</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.benefitBullet}>•</span>
              <span className={styles.benefitText}>Fund emergency rides for others (£4/mo)</span>
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <button 
              className={styles.ctaButton}
              onClick={handleTrialClick}
            >
              START 30-DAY FREE TRIAL →
            </button>
            <div className={styles.ctaSubtext}>
              No payment required • Cancel anytime
            </div>
            <div className={styles.socialProof}>
              Join {bannerState.currentMemberCount.toLocaleString()} members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}