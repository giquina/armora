// SafeAssignmentFund Banner with CSS Marquee Animation
// File: src/components/SafeAssignmentFund/SafeAssignmentFundBanner.tsx

import React, { useState, useEffect, useRef } from 'react';
import styles from './SafeAssignmentFundBanner.module.css';

interface SafeAssignmentFundBannerProps {
  variant?: 'full' | 'compact';
  className?: string;
  onBannerClick?: () => void;
}

const SafeAssignmentFundBanner: React.FC<SafeAssignmentFundBannerProps> = ({ 
  variant = 'full',
  className = '',
  onBannerClick 
}) => {
  // Rotating announcement messages for dynamic content
  const announcementMessages = [
    "🛡️ Every membership supports safe transport for vulnerable communities",
    "📊 3,741+ safe Assignments funded • 834 people reached safety this month",
    "🤝 Partnering with Crisis UK, Women's Aid, Mind Mental Health & more",
    "🚗 £4 from each membership directly funds priority transport assistance",
    "⚡ 24/7 availability • Average 12min response time • 98% success rate"
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const progressRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate messages every 20 seconds
  useEffect(() => {
    if (!isPaused && !isHovered) {
      const messageRotationInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % announcementMessages.length);
        progressRef.current = 0;
        setProgress(0);
      }, 20000); // 20 seconds per message

      return () => clearInterval(messageRotationInterval);
    }
  }, [announcementMessages.length, isPaused, isHovered]);

  // Progress animation
  useEffect(() => {
    if (!isPaused && !isHovered) {
      const progressInterval = setInterval(() => {
        progressRef.current += 0.5; // 0.5% every 100ms = 100% in 20 seconds
        setProgress(progressRef.current);
        if (progressRef.current >= 100) {
          progressRef.current = 0;
        }
      }, 100);

      intervalRef.current = progressInterval;
      return () => clearInterval(progressInterval);
    }
  }, [isPaused, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowControls(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const goToNext = () => {
    setCurrentMessageIndex((prev) => (prev + 1) % announcementMessages.length);
    progressRef.current = 0;
    setProgress(0);
  };

  const goToPrevious = () => {
    setCurrentMessageIndex((prev) => prev === 0 ? announcementMessages.length - 1 : prev - 1);
    progressRef.current = 0;
    setProgress(0);
  };

  const goToMessage = (index: number) => {
    setCurrentMessageIndex(index);
    progressRef.current = 0;
    setProgress(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onBannerClick?.();
    }
  };

  return (
    <div 
      className={`${styles.banner} ${styles[variant]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onBannerClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={onBannerClick ? 0 : -1}
      aria-label="Safe Assignment Fund information - click to learn more"
      aria-live="polite"
    >
      <div className={styles.content}>
        {/* Static shield icon */}
        <div className={styles.iconSection}>
          <div className={styles.shieldIcon}>
            <span className={styles.shieldEmoji}>🛡️</span>
          </div>
        </div>

        {/* Dynamic scrolling message section */}
        <div className={styles.messageSection}>
          <div className={styles.messageContainer}>
            <div 
              className={`${styles.scrollingText} ${styles.dynamicMessage}`}
              key={currentMessageIndex} // Force re-animation on message change
            >
              <p className={styles.messageText}>
                {announcementMessages[currentMessageIndex]}
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar}
              style={{ 
                width: `${progress}%`,
                transition: isPaused || isHovered ? 'none' : 'width 0.1s linear'
              }}
            />
          </div>

          {/* Message indicator dots */}
          <div className={styles.messageIndicators}>
            {announcementMessages.map((_, index) => (
              <span 
                key={index}
                className={`${styles.indicator} ${index === currentMessageIndex ? styles.active : ''}`}
              />
            ))}
          </div>

          {/* Show controls on hover or when paused */}
          {showControls && (
            <div className={styles.navigationControls}>
              <button 
                className={styles.controlButton}
                onClick={goToPrevious}
                aria-label="Previous message"
              >
                ‹
              </button>

              <button 
                className={styles.controlButton}
                onClick={togglePause}
                aria-label={isPaused ? "Resume rotation" : "Pause rotation"}
              >
                {isPaused ? '▶' : '❚❚'}
              </button>

              <button 
                className={styles.controlButton}
                onClick={goToNext}
                aria-label="Next message"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Learn More button */}
        <div className={styles.controlsSection}>
          {onBannerClick && (
            <div className={styles.learnMore}>
              <span>Learn More</span>
              <span className={styles.arrow}>→</span>
            </div>
          )}
        </div>
      </div>

      {/* Dot navigation (like Instagram stories) */}
      {announcementMessages.length > 1 && variant === 'full' && (
        <div className={styles.dotNavigation}>
          {announcementMessages.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentMessageIndex ? styles.activeDot : ''}`}
              onClick={(e) => { 
                e.stopPropagation(); 
                goToMessage(index);
              }}
              aria-label={`Go to message ${index + 1} of ${announcementMessages.length}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SafeAssignmentFundBanner;