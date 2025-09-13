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
  const [showMoneyParticles, setShowMoneyParticles] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number; left: string; delay: number}>>([]);

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

  // Generate floating money particles
  const createMoneyParticles = useCallback(() => {
    const newParticles = [];
    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: Date.now() + i,
        left: Math.random() * 80 + 10 + '%', // Random position between 10-90%
        delay: i * 200
      });
    }
    setParticles(newParticles);
    setShowMoneyParticles(true);

    // Clear particles after animation
    setTimeout(() => {
      setShowMoneyParticles(false);
      setParticles([]);
    }, 3000);
  }, []);

  // Animate the rides counter with smooth easing
  const animateCounter = useCallback(() => {
    const start = 3700;
    const target = marketingData.currentRidesFunded;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out-cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      setBannerState(prev => ({ ...prev, currentRidesCount: current }));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Add golden glow pulse when complete
        setTimeout(() => {
          setBannerState(prev => ({ ...prev, showAnimation: false }));
          // Generate money particles effect
          createMoneyParticles();
        }, 500);
      }
    };

    requestAnimationFrame(update);
  }, [createMoneyParticles]);

  // Show banner with delay on dashboard load (FIX: Remove problematic dependencies)
  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let bounceTimer: NodeJS.Timeout;
    let animationTimer: NodeJS.Timeout;

    // Only check once on mount, don't re-run when dependencies change
    const checkAndShow = () => {
      if (shouldShowBanner()) {
        showTimer = setTimeout(() => {
          setBannerState(prev => ({ ...prev, isVisible: true }));

          // Start counter animation shortly after banner appears
          animationTimer = setTimeout(() => {
            setIsAnimating(true);
            animateCounter();
          }, 500);

          // Add attention bounce after banner is visible
          bounceTimer = setTimeout(() => {
            setShowBounce(true);
            setTimeout(() => setShowBounce(false), 600);
          }, 4000);
        }, 3000); // 3 second delay after dashboard load
      }
    };

    // Only run once on mount
    checkAndShow();

    return () => {
      clearTimeout(showTimer);
      clearTimeout(bounceTimer);
      clearTimeout(animationTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    localStorage.setItem('marketingBannerDismissed', 'true'); // Flag for reopen button

    // Track dismissal
    console.log('📊 Analytics: banner_dismissed', {
      dismissCount: newDismissCount,
      variant,
      timeOnScreen: Date.now() // Would calculate actual time in real app
    });
  };

  // Handle banner reopen
  const handleReopen = () => {
    setBannerState(prev => ({
      ...prev,
      isVisible: true,
      dismissCount: 0, // Reset dismiss count on manual reopen
      lastDismissed: null
    }));

    // Clear dismissal flags
    localStorage.removeItem('marketingBannerDismissed');
    localStorage.removeItem('marketingBannerDismissCount');
    localStorage.removeItem('marketingBannerLastDismissed');

    // Start animations
    setTimeout(() => {
      setIsAnimating(true);
      animateCounter();
    }, 500);

    console.log('📊 Analytics: banner_reopened', { variant });
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

  // Check if banner was dismissed and should show reopen button
  const isDismissed = localStorage.getItem('marketingBannerDismissed') === 'true';

  // Show reopen button if dismissed and not permanently hidden
  if (!bannerState.isVisible && isDismissed && bannerState.dismissCount < 3) {
    return (
      <div className={styles.reopenContainer}>
        <button
          className={styles.reopenButton}
          onClick={handleReopen}
          aria-label="View membership offers"
        >
          💰 View Special Offers
        </button>
      </div>
    );
  }

  // Don't render if not visible and not dismissed recently
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
              <span className={styles.benefitText}>Fund priority rides for others (£4/mo)</span>
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

        {/* Money Particles */}
        {showMoneyParticles && particles.map(particle => (
          <div
            key={particle.id}
            className={styles.moneyParticle}
            style={{
              left: particle.left,
              animationDelay: `${particle.delay}ms`
            }}
          >
            £
          </div>
        ))}
      </div>
    </div>
  );
}