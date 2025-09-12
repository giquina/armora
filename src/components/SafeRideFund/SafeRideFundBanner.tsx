import React, { useState, useEffect, useRef } from 'react';
import styles from './SafeRideFundBanner.module.css';

interface SafeRideFundBannerProps {
  className?: string;
  onBannerClick?: () => void;
  variant?: 'full' | 'compact';
}

const getTimeBasedMessages = () => {
  const hour = new Date().getHours();
  const isWeekend = [0, 6].includes(new Date().getDay());
  
  if (isWeekend) {
    return [
      "💛 Weekend support active for vulnerable communities",
      "🚗 Ensuring everyone can travel safely, regardless of income", 
      "🤝 Community solidarity in action every day of the week"
    ];
  }
  
  if (hour >= 18 || hour <= 6) {
    return [
      "🌙 Safe evening transport for vulnerable individuals",
      "🛡️ No one left stranded due to financial constraints",
      "💪 Supporting those who need transport to safety"
    ];
  }
  
  return [
    "🛡️ Helping vulnerable communities access work and services",
    "🤝 Your rides fund transport for those in need",
    "📍 Supporting people getting to essential appointments"
  ];
};

const bannerMessages = [
  "🛡️ 3,773 safe rides provided for vulnerable communities since January 2024",
  "💛 Every Armora membership contributes to transport assistance for those who cannot afford it",
  "🤝 Partnering with women's refuges, community centers, and support organizations",
  "📍 Active across London, Manchester, Birmingham, and expanding nationwide", 
  "✨ 12 rides funded today for individuals accessing support services",
  "🚗 Together we're ensuring transport isn't a barrier to safety and support",
  "👥 Join 1,247 members making a difference in vulnerable communities",
  "💪 Your journey funds someone else's path to safety",
  "🏠 Supporting women's shelters and domestic violence refuges",
  "🤲 Transport assistance for low-income families",
  "📈 23% more people helped access services this month",
  "🎯 Working with 23 community organizations across the UK",
  "💛 Community-funded safe rides for those without options",
  "🛡️ Providing dignity through reliable, safe transport",
  "👨‍👩‍👧‍👦 Supporting families in temporary accommodation",
  "🌟 Bridging the transport gap for vulnerable communities",
  "💝 Every ride you book helps someone in need travel safely"
];

const SafeRideFundBanner: React.FC<SafeRideFundBannerProps> = ({ 
  className = '', 
  onBannerClick,
  variant = 'full' 
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Combine time-based and general messages
    const timeBasedMessages = getTimeBasedMessages();
    const combinedMessages = [...timeBasedMessages, ...bannerMessages];
    
    // Shuffle messages for variety
    const shuffledMessages = [...combinedMessages].sort(() => Math.random() - 0.5);
    setMessages(shuffledMessages);
  }, []);

  useEffect(() => {
    if (messages.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 8000); // 8 seconds per message

    return () => clearInterval(interval);
  }, [messages.length, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onBannerClick?.();
    }
  };

  if (messages.length === 0) return null;

  return (
    <div 
      className={`${styles.bannerContainer} ${styles[variant]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={styles.bannerContent}
        onClick={onBannerClick}
        onKeyDown={handleKeyDown}
        tabIndex={onBannerClick ? 0 : -1}
        role={onBannerClick ? "button" : "status"}
        aria-label={onBannerClick ? "Learn more about Safe Ride Fund" : undefined}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={styles.iconContainer}>
          <span className={styles.fundIcon}>🛡️</span>
        </div>
        
        <div className={styles.messageContainer} ref={scrollRef}>
          <div 
            className={`${styles.messageScroller} ${isPaused ? styles.paused : ''}`}
            style={{ 
              transform: `translateX(-${currentMessageIndex * 100}%)`,
              transition: isPaused ? 'none' : 'transform 0.5s ease-in-out'
            }}
          >
            {messages.map((message, index) => (
              <div key={index} className={styles.message}>
                {message}
              </div>
            ))}
          </div>
        </div>

        {onBannerClick && (
          <div className={styles.actionIndicator}>
            <span className={styles.learnMore}>Learn More</span>
            <span className={styles.arrow}>→</span>
          </div>
        )}
      </div>
      
      <div className={styles.progressIndicator}>
        <div 
          className={styles.progressBar}
          style={{ 
            animationDuration: isPaused ? 'infinite' : '8s',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        />
      </div>
    </div>
  );
};

export default SafeRideFundBanner;