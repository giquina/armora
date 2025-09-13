import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AchievementBanner.module.css';
import MiniAchievement from './MiniAchievement';
import Confetti from './Confetti';
import { animateCounter, typeWriter, animationSequence } from './achievementAnimations';
import { getUnlockedCount, getTotalCount } from './achievementData';

interface AchievementBannerProps {
  isVisible: boolean;
  onClaim: () => void;
  onDismiss: () => void;
  userName?: string;
}

const AchievementBanner: React.FC<AchievementBannerProps> = ({
  isVisible,
  onClaim,
  onDismiss,
  userName = 'Member'
}) => {
  const [currentState, setCurrentState] = useState<'hidden' | 'showing' | 'minimized'>('hidden');
  const [titleText, setTitleText] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 });

  // Animation sequence states
  const [showTrophy, setShowTrophy] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const resetAnimations = useCallback(() => {
    setTitleText('');
    setDiscountValue(0);
    setShowConfetti(false);
    setShowTrophy(false);
    setShowProgressBar(false);
    setShowButton(false);
  }, []);

  const startAnimationSequence = useCallback(async () => {
    // Phase 1: Banner slide in (already handled by CSS)
    
    // Phase 2: Trophy appears
    setTimeout(() => {
      setShowTrophy(true);
    }, animationSequence.trophyAppear.delay);

    // Phase 3: Title typewriter effect
    setTimeout(async () => {
      await typeWriter('ACHIEVEMENT UNLOCKED', setTitleText, 50);
    }, animationSequence.textTypewriter.delay);

    // Phase 4: Counter animation
    setTimeout(() => {
      animateCounter(50, setDiscountValue, animationSequence.counterAnimation.duration);
      setShowProgressBar(true);
    }, animationSequence.counterAnimation.delay);

    // Phase 5: Confetti burst
    setTimeout(() => {
      setShowConfetti(true);
    }, animationSequence.confettiBurst.delay);

    // Phase 6: Button appears with pulse
    setTimeout(() => {
      setShowButton(true);
    }, animationSequence.buttonPulse.delay);

    // Auto-minimize after 5 seconds if not interacted with
    setTimeout(() => {
      if (currentState === 'showing') {
        setCurrentState('minimized');
      }
    }, 5000);
  }, [currentState]);

  useEffect(() => {
    if (isVisible && currentState === 'hidden') {
      setCurrentState('showing');
      startAnimationSequence();
    } else if (!isVisible) {
      setCurrentState('hidden');
      resetAnimations();
    }
  }, [isVisible, currentState, startAnimationSequence, resetAnimations]);

  useEffect(() => {
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      setBannerPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  }, [currentState]);

  const handleExpand = () => {
    setCurrentState('showing');
    // Restart some animations when expanding
    setShowButton(true);
    setShowProgressBar(true);
  };

  const handleClaim = () => {
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    onClaim();
  };

  const handleSwipeUp = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentTouch = moveEvent.touches[0];
      const deltaY = startY - currentTouch.clientY;
      
      if (deltaY > 50) { // Swipe up threshold
        handleClaim();
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { once: true });
  };

  const handleSwipeDown = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentTouch = moveEvent.touches[0];
      const deltaY = currentTouch.clientY - startY;
      
      if (deltaY > 50) { // Swipe down threshold
        setCurrentState('minimized');
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { once: true });
  };

  if (currentState === 'hidden') {
    return null;
  }

  if (currentState === 'minimized') {
    return (
      <MiniAchievement
        onExpand={handleExpand}
        onDismiss={onDismiss}
      />
    );
  }

  const unlockedCount = getUnlockedCount();
  const totalCount = getTotalCount();
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <>
      <div 
        ref={bannerRef}
        className={styles.achievementBanner}
        onTouchStart={currentState === 'showing' ? handleSwipeUp : undefined}
        onTouchEnd={currentState === 'showing' ? handleSwipeDown : undefined}
      >
        <div className={styles.header}>
          <div className={styles.achievementTitle}>
            {showTrophy && (
              <div className={styles.trophy}>
                🏆
                <div className={styles.orbitalRing}></div>
              </div>
            )}
            <span>{titleText}</span>
          </div>
          <button
            className={styles.closeButton}
            onClick={onDismiss}
            aria-label="Dismiss achievement"
          >
            ×
          </button>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.discountValue}>
            {discountValue}% OFF
          </div>
          <div className={styles.discountDescription}>
            Your first ride (up to £15)
          </div>
        </div>

        {showProgressBar && (
          <div className={styles.progressSection}>
            <div className={styles.progressText}>
              <span>Progress</span>
              <span>{unlockedCount} of {totalCount} unlocked</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className={styles.socialProof}>
          {userName}, join 3,741 members saving £32/mo
        </div>

        {showButton && (
          <button
            className={styles.claimButton}
            onClick={handleClaim}
          >
            CLAIM DISCOUNT →
          </button>
        )}

        <div className={styles.validityText}>
          Valid 30 days • No rush
        </div>
      </div>

      <Confetti
        isActive={showConfetti}
        centerX={bannerPosition.x}
        centerY={bannerPosition.y}
        particleCount={30}
        duration={3000}
        onComplete={() => setShowConfetti(false)}
      />
    </>
  );
};

export default AchievementBanner;