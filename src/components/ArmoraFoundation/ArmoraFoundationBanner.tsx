// Armora Foundation Banner with CSS Marquee Animation
// File: src/components/ArmoraFoundation/ArmoraFoundationBanner.tsx

import React, { useState, useEffect, useRef } from 'react';
import styles from './ArmoraFoundationBanner.module.css';

interface ArmoraFoundationBannerProps {
  variant?: 'full' | 'compact';
  className?: string;
  onBannerClick?: () => void;
}

const ArmoraFoundationBanner: React.FC<ArmoraFoundationBannerProps> = ({ 
  variant = 'full',
  className = '',
  onBannerClick 
}) => {
  // Rotating announcement messages for dynamic content
  const announcementMessages = [
    "🎵 New Achievement: Spotify Music Lab opening in Birmingham this month!",
    "💻 Success Story: 12 coding bootcamp graduates just landed tech jobs!",
    "🎬 Watch Now: Student films from our program featured on Netflix Local",
    "🚀 This Month: 84 young creators learning new skills thanks to you",
    "🎯 Vote Now: Help choose next month's workshop focus - Music or Coding?"
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
      aria-label="Armora Foundation information - click to learn more"
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

export default ArmoraFoundationBanner;