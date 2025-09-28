// Armora Security Transport - Marketing Banner Component

import { useState, useEffect, useCallback, useRef } from 'react';
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
  testimonial: "I save enough to cover my subscription in just 3 Assignments! - Sarah M.",
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

  // Refs to prevent unnecessary re-renders from timers
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const particleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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


  // Generate floating money particles - STABLE to prevent re-renders
  const createMoneyParticles = useCallback(() => {
    // Use deterministic positions instead of Math.random()
    const positions = ['15%', '30%', '45%', '60%', '75%'];
    const newParticles = positions.map((pos, i) => ({
      id: Date.now() + i,
      left: pos,
      delay: i * 200
    }));

    setParticles(newParticles);
    setShowMoneyParticles(true);

    // Clear existing timeout
    if (particleTimeoutRef.current) {
      clearTimeout(particleTimeoutRef.current);
    }

    // Clear particles after animation
    particleTimeoutRef.current = setTimeout(() => {
      setShowMoneyParticles(false);
      setParticles([]);
    }, 3000);
  }, []);

  // Animate the Assignments counter with smooth easing
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
        // Clear existing timeout
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }

        // Add golden glow pulse when complete
        animationTimeoutRef.current = setTimeout(() => {
          setBannerState(prev => ({ ...prev, showAnimation: false }));
          // Generate money particles effect
          createMoneyParticles();
        }, 500);
      }
    };

    requestAnimationFrame(update);
  }, [createMoneyParticles]);

  // Show banner with smart timing - only on dashboard, respects dismissals
  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let bounceTimer: NodeJS.Timeout;
    let animationTimer: NodeJS.Timeout;

    const checkAndShow = () => {
      // Check dismissal with expiry
      const dismissed = localStorage.getItem('membershipBannerDismissed');
      if (dismissed) {
        try {
          const dismissData = JSON.parse(dismissed);
          if (Date.now() < dismissData.expiresAt) {
            return; // Still within dismissal period (7 days)
          }
        } catch (e) {
          // Invalid data, continue to show
        }
      }

      // Don't show to Essential members (they already have membership)
      if (state.subscription?.tier === 'essential') {
        return;
      }

      // Don't show on very small screens
      if (window.innerHeight < 500) {
        return;
      }

      // Only show on dashboard view after 5 second delay
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
      }, 5000); // 5 second delay for less intrusion
    };

    // Only run once on mount
    checkAndShow();

    return () => {
      clearTimeout(showTimer);
      clearTimeout(bounceTimer);
      clearTimeout(animationTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Additional visibility checks after banner state loads - FIXED: Separate effect
  useEffect(() => {
    if (!bannerState.isVisible) return;

    // Check complex dismissal logic after state is loaded
    if (bannerState.dismissCount >= 3) {
      const lastDismissed = bannerState.lastDismissed ? new Date(bannerState.lastDismissed) : null;
      const now = new Date();
      const daysSinceDismissal = lastDismissed ?
        (now.getTime() - lastDismissed.getTime()) / (1000 * 60 * 60 * 24) : 999;

      if (daysSinceDismissal < 7) {
        setBannerState(prev => ({ ...prev, isVisible: false }));
        return;
      }
    }

    // Don't show if already started trial
    if (bannerState.hasStartedTrial) {
      setBannerState(prev => ({ ...prev, isVisible: false }));
      return;
    }
  }, [bannerState.isVisible, bannerState.dismissCount, bannerState.lastDismissed, bannerState.hasStartedTrial]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (particleTimeoutRef.current) {
        clearTimeout(particleTimeoutRef.current);
      }
    };
  }, []);

  // Member count increment - DISABLED to prevent constant re-renders
  // Real-time member updates would come from server-sent events or WebSocket in production
  useEffect(() => {
    if (!bannerState.isVisible) return;

    // Static member count - no automatic increments to prevent flashing
    // In production, this would update via real-time data connection
    return () => {}; // No cleanup needed for disabled timer
  }, [bannerState.isVisible]);

  // Handle banner dismissal with 7-day expiry
  const handleDismiss = () => {
    const dismissData = {
      timestamp: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      dismissCount: bannerState.dismissCount + 1
    };

    setBannerState(prev => ({
      ...prev,
      isVisible: false,
      dismissCount: dismissData.dismissCount,
      lastDismissed: new Date().toISOString()
    }));

    // Save dismissal with expiry to localStorage
    localStorage.setItem('membershipBannerDismissed', JSON.stringify(dismissData));

    // Track dismissal
    console.log('Marketing banner dismissed', {
      dismissCount: dismissData.dismissCount,
      variant,
      expiresAt: new Date(dismissData.expiresAt).toISOString()
    });
  };

  // Note: handleReopen function removed - functionality moved to ProtectionStatusFAB

  // Handle CTA click
  const handleTrialClick = async () => {
    try {
      setBannerState(prev => ({ ...prev, hasStartedTrial: true }));
      localStorage.setItem('marketingBannerTrialStarted', 'true');
      
      // Track CTA click
      console.log('Trial started from marketing banner', { variant, timestamp: Date.now() });
      
      // Start the trial
      await startFreeTrial('essential');
      
      // Close banner and navigate
      setBannerState(prev => ({ ...prev, isVisible: false }));
      onTrialStart();
      navigateToView('protection-request');
      
    } catch (error) {
      console.error('Error starting trial from banner:', error);
    }
  };

  // Note: Reopen button functionality moved to ProtectionStatusFAB component

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
              🛡️ Executive Protection Membership
            </h3>
            <p className={styles.headerSubtext}>
              Save £{marketingData.averageSavings}/month on professional protection services
            </p>
          </div>

          {/* Live Counter */}
          <div className={styles.counterSection}>
            <div className={styles.counterContainer}>
              <span className={`${styles.counterNumber} ${isAnimating ? styles.animating : ''}`}>
                {bannerState.currentRidesCount.toLocaleString()}
              </span>
              <span className={styles.counterText}>successful protection assignments</span>
            </div>
          </div>

          {/* Benefits List */}
          <div className={styles.benefitsSection}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitHeader}>Essential Membership - £14.99/month</div>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.benefitBullet}>✓</span>
              <span className={styles.benefitText}>SIA-licensed protection officers 24/7</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.benefitBullet}>✓</span>
              <span className={styles.benefitText}>Save £32/month on protection services</span>
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.benefitBullet}>✓</span>
              <span className={styles.benefitText}>Priority assignment for all security requests</span>
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
              Join {bannerState.currentMemberCount.toLocaleString()} protected members
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