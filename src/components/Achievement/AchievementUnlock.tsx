import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { AchievementUnlockProps, FirstRideReward } from '../../types';
import styles from './AchievementUnlock.module.css';

const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  userType,
  completedQuestionnaire,
  onContinueToDashboard,
  onCreateAccountUpgrade
}) => {
  const { state, setUser } = useApp();
  const [animationStep, setAnimationStep] = useState<'entry' | 'reveal' | 'unlock' | 'reward' | 'preview' | 'details' | 'action'>('entry');
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate reward data
  const rewardData: FirstRideReward = {
    userId: state.user?.id,
    rewardType: 'questionnaire_completion',
    discountCode: `ARMORA${Date.now().toString().slice(-6)}`,
    discountPercentage: 50,
    maxAmount: 15,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    used: false,
    unlockDate: new Date()
  };

  const terms = [
    'Valid for 30 days from profile completion',
    'Applicable to first ride booking only',
    'Cannot be combined with other offers',
    'Maximum discount value: £15',
    'Valid for all service tiers: Standard, Executive, Shadow'
  ];

  // Animation sequence
  useEffect(() => {
    const sequence = [
      { step: 'entry', delay: 0 },
      { step: 'reveal', delay: 1000 },
      { step: 'unlock', delay: 2000 },
      { step: 'reward', delay: 3000 },
      { step: 'preview', delay: 4000 },
      { step: 'details', delay: 5000 },
      { step: 'action', delay: 6000 }
    ];

    const timeouts = sequence.map(({ step, delay }) =>
      setTimeout(() => {
        setAnimationStep(step as typeof animationStep);
        if (step === 'reward') {
          setShowConfetti(true);
          // Store reward in user context
          if (state.user && userType !== 'guest') {
            const updatedUser = {
              ...state.user,
              hasUnlockedReward: true
            };
            setUser(updatedUser);
          }
        }
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [state.user, setUser, userType]);

  // Confetti cleanup
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleContinue = () => {
    // Save reward data to localStorage for later use
    localStorage.setItem('armora_first_ride_reward', JSON.stringify(rewardData));
    onContinueToDashboard();
  };

  const handleUpgrade = () => {
    if (onCreateAccountUpgrade) {
      onCreateAccountUpgrade();
    }
  };

  const isGuest = userType === 'guest';

  return (
    <div className={styles.container}>
      {/* Background particles */}
      <div className={styles.particleField}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`${styles.particle} ${animationStep === 'reward' ? styles.particleActive : ''}`}
            style={{
              '--delay': `${i * 0.1}s`,
              '--duration': `${2 + Math.random() * 2}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={styles.confetti}
              style={{
                '--delay': `${Math.random() * 0.5}s`,
                '--x': `${Math.random() * 100}%`,
                '--rotate': `${Math.random() * 360}deg`,
                '--hue': Math.random() > 0.5 ? '45deg' : '220deg' // Gold or blue
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className={`${styles.content} ${styles[`step-${animationStep}`]}`}>
        {/* Trophy/Chest container */}
        <div className={styles.achievementContainer}>
          {/* Trophy Icon */}
          <div className={`${styles.trophy} ${animationStep >= 'reveal' ? styles.trophyVisible : ''}`}>
            <div className={styles.trophyBase}>
              <div className={styles.trophyHandle}></div>
              <div className={`${styles.trophyGlow} ${animationStep >= 'unlock' ? styles.glowing : ''}`}></div>
            </div>
          </div>

          {/* Shield Icon (Security Theme) */}
          <div className={`${styles.shield} ${animationStep >= 'unlock' ? styles.shieldActive : ''}`}>
            <svg viewBox="0 0 24 24" className={styles.shieldIcon}>
              <path
                d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.8C8,12.2 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Reward announcement */}
        <div className={`${styles.rewardSection} ${animationStep >= 'reward' ? styles.rewardVisible : ''}`}>
          <div className={styles.rewardBadge}>
            <span className={styles.discountText}>50% OFF</span>
            <span className={styles.maxSaving}>Max £15 off</span>
          </div>

          <h1 className={styles.congratsTitle}>
            Congratulations!
          </h1>
          
          <p className={styles.rewardMessage}>
            You've unlocked 50% off your first ride!
          </p>
          
          <div className={styles.safeRideFundSection}>
            <div className={styles.safeRideFundIcon}>🛡️</div>
            <p className={styles.safeRideFundMessage}>
              Want to make every ride count? Join Essential to save money 
              <span className={styles.highlight}> AND </span>
              help others stay safe too.
            </p>
          </div>
          
          <p className={styles.profileMessage}>
            Your security transport profile is now complete
          </p>
        </div>

        {/* Terms and details */}
        <div className={`${styles.detailsSection} ${animationStep >= 'details' ? styles.detailsVisible : ''}`}>
          <div className={styles.rewardDetails}>
            <h3 className={styles.detailsTitle}>Your Reward Details:</h3>
            <div className={styles.discountCode}>
              Code: <span className={styles.code}>{rewardData.discountCode}</span>
            </div>
            <div className={styles.validity}>
              Valid until: {rewardData.validUntil.toLocaleDateString()}
            </div>
          </div>

          <div className={styles.termsContainer}>
            <details className={styles.termsDetails}>
              <summary className={styles.termsSummary}>Terms & Conditions</summary>
              <ul className={styles.termsList}>
                {terms.map((term, index) => (
                  <li key={index} className={styles.termItem}>{term}</li>
                ))}
              </ul>
            </details>
          </div>
        </div>

        {/* Service Preview Section */}
        <div className={`${styles.servicePreviewSection} ${animationStep >= 'preview' ? styles.previewVisible : ''}`}>
          <div className={styles.previewHeader}>
            <h3 className={styles.previewTitle}>Your VIP Security Team Is Ready</h3>
            <div className={styles.availabilityIndicator}>
              <div className={styles.statusDot}></div>
              <span>12 certified drivers available now</span>
            </div>
          </div>

          <div className={styles.driversShowcase}>
            <div className={styles.driverCard}>
              <div className={styles.driverAvatar}>
                <div className={styles.avatarImage}>👨‍💼</div>
                <div className={styles.certificationBadge}>SIA</div>
              </div>
              <div className={styles.driverInfo}>
                <div className={styles.driverName}>Marcus Johnson</div>
                <div className={styles.driverTitle}>Executive Protection</div>
                <div className={styles.responseTime}>4 min away</div>
              </div>
            </div>
            
            <div className={styles.driverCard}>
              <div className={styles.driverAvatar}>
                <div className={styles.avatarImage}>👩‍💼</div>
                <div className={styles.certificationBadge}>SIA</div>
              </div>
              <div className={styles.driverInfo}>
                <div className={styles.driverName}>Sarah Mitchell</div>
                <div className={styles.driverTitle}>VIP Transport</div>
                <div className={styles.responseTime}>6 min away</div>
              </div>
            </div>

            <div className={styles.driverCard}>
              <div className={styles.driverAvatar}>
                <div className={styles.avatarImage}>👨‍💼</div>
                <div className={styles.certificationBadge}>SIA</div>
              </div>
              <div className={styles.driverInfo}>
                <div className={styles.driverName}>David Clark</div>
                <div className={styles.driverTitle}>Close Protection</div>
                <div className={styles.responseTime}>8 min away</div>
              </div>
            </div>
          </div>

          <div className={styles.pricingPreview}>
            <h4 className={styles.pricingTitle}>Your Personalized VIP Pricing</h4>
            <div className={styles.pricingGrid}>
              <div className={styles.priceCard}>
                <div className={styles.serviceType}>Standard</div>
                <div className={styles.originalPrice}>£50/hr</div>
                <div className={styles.discountedPrice}>£25.00/hr</div>
                <div className={styles.saveAmount}>Save £25.00</div>
              </div>
              
              <div className={`${styles.priceCard} ${styles.popular}`}>
                <div className={styles.popularBadge}>Most Popular</div>
                <div className={styles.serviceType}>Shadow</div>
                <div className={styles.originalPrice}>£65/hr</div>
                <div className={styles.discountedPrice}>£32.50/hr</div>
                <div className={styles.saveAmount}>Save £32.50</div>
              </div>
              
              <div className={styles.priceCard}>
                <div className={styles.serviceType}>Executive</div>
                <div className={styles.originalPrice}>£75/hr</div>
                <div className={styles.discountedPrice}>£37.50/hr</div>
                <div className={styles.saveAmount}>Save £37.50</div>
              </div>
            </div>
          </div>

          <div className={styles.socialProof}>
            <div className={styles.trustStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>127</span>
                <span className={styles.statLabel}>Fortune 500 Executives</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>99.8%</span>
                <span className={styles.statLabel}>Incident-Free Record</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>8 min</span>
                <span className={styles.statLabel}>Average Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={`${styles.actionSection} ${animationStep >= 'action' ? styles.actionVisible : ''}`}>
          {isGuest ? (
            <div className={styles.guestActions}>
              <div className={styles.upgradePrompt}>
                <p className={styles.upgradeMessage}>
                  Create an account to save this reward and unlock full booking features
                </p>
              </div>
              <button
                onClick={handleUpgrade}
                className={`${styles.button} ${styles.primaryButton} ${styles.pulsing}`}
              >
                <span className={styles.buttonText}>Secure Your 50% Discount</span>
                <span className={styles.urgencyText}>Limited time offer</span>
              </button>
              <button
                onClick={handleContinue}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                Continue as Guest
              </button>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              className={`${styles.button} ${styles.primaryButton} ${styles.pulsing}`}
            >
              <span className={styles.buttonText}>Start Your VIP Experience</span>
              <span className={styles.urgencyText}>Your drivers are waiting</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating elements for atmosphere */}
      <div className={styles.floatingElements}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`${styles.floatingElement} ${animationStep >= 'reward' ? styles.floating : ''}`}
            style={{
              '--delay': `${i * 0.2}s`,
              '--duration': `${3 + Math.random() * 2}s`,
              '--x': `${10 + Math.random() * 80}%`,
              '--y': `${10 + Math.random() * 80}%`
            } as React.CSSProperties}
          >
            💰
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementUnlock;