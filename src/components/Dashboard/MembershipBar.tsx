import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './MembershipBar.module.css';

export function MembershipBar() {
  const { navigateToView } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("23:59:47");
  const [memberCount, setMemberCount] = useState(1247);
  const [isVisible, setIsVisible] = useState(false);

  // Check if user has already dismissed this offer and clear stuck dismissals
  useEffect(() => {
    const dismissed = localStorage.getItem('armora_membership_bar_dismissed');
    const initialDismissTime = localStorage.getItem('armora_membership_bar_dismiss_time');

    if (dismissed && initialDismissTime) {
      const dismissedAt = parseInt(initialDismissTime);
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;

      // Re-show after 24 hours
      if (now - dismissedAt > oneDayMs) {
        localStorage.removeItem('armora_membership_bar_dismissed');
        localStorage.removeItem('armora_membership_bar_dismiss_time');
      } else {
        setIsDismissed(true);
      }
    }

    // Clear any stuck dismissals on component mount (use different variable name)
    const storedDismissTime = localStorage.getItem('armora_membership_bar_dismiss_time');
    if (storedDismissTime) {
      const timeSinceDismiss = Date.now() - parseInt(storedDismissTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (timeSinceDismiss > twentyFourHours) {
        localStorage.removeItem('armora_membership_bar_dismissed');
        localStorage.removeItem('armora_membership_bar_dismiss_time');
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const timeRemaining = endOfDay.getTime() - now.getTime();

      if (timeRemaining > 0) {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        // Reset to next day
        setTimeLeft("23:59:59");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate growing member count
  useEffect(() => {
    const memberTimer = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to increment
        setMemberCount(prev => prev + 1);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(memberTimer);
  }, []);

  // Show membership bar after user scrolls 10% (much earlier than before)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show when user has scrolled 10% of the page (much earlier)
      const scrollPercent = scrollTop / (documentHeight - windowHeight);
      setIsVisible(scrollPercent > 0.1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartTrial = useCallback(() => {
    // Store membership conversion context
    localStorage.setItem('armora_conversion_source', 'membership_bar');
    localStorage.setItem('armora_conversion_timestamp', Date.now().toString());

    // Analytics
    console.log('Membership bar trial started', {
      source: 'top_membership_bar',
      memberCount,
      timeLeft,
      timestamp: Date.now()
    });

    // Navigate to subscription offer
    navigateToView('subscription-offer');
  }, [navigateToView, memberCount, timeLeft]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem('armora_membership_bar_dismissed', 'true');
    localStorage.setItem('armora_membership_bar_dismiss_time', Date.now().toString());

    // Analytics
    console.log('Membership bar dismissed', {
      timeLeft,
      memberCount,
      timestamp: Date.now()
    });
  }, [timeLeft, memberCount]);

  if (isDismissed || !isVisible) return null;

  return (
    <div className={styles.membershipBar}>
      <div className={styles.membershipContent}>
        <div className={styles.offerSection}>
          <span className={styles.membershipOffer}>
            🎯 Join {memberCount.toLocaleString()} members saving <span className={styles.goldAccent}>£200+</span> monthly
          </span>
          <div className={styles.offerDetails}>
            <span className={styles.benefitPoint}>• 20% off all bookings</span>
            <span className={styles.benefitPoint}>• Priority response</span>
            <span className={styles.benefitPoint}>• Free cancellation</span>
          </div>
        </div>

        <div className={styles.urgencySection}>
          <span className={styles.timerLabel}>Offer ends in:</span>
          <span className={styles.timer}>{timeLeft}</span>
        </div>

        <button
          className={styles.membershipCTA}
          onClick={handleStartTrial}
        >
          <span className={styles.ctaText}>Start Free Trial</span>
          <span className={styles.ctaArrow}>→</span>
        </button>
      </div>

      <button
        className={styles.dismissButton}
        onClick={handleDismiss}
        aria-label="Dismiss membership offer"
      >
        <span className={styles.dismissIcon}>×</span>
      </button>

      {/* Animated progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>
    </div>
  );
}