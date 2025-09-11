import React, { useState, useEffect, useRef } from 'react';
import styles from './FloatingCTA.module.css';

interface FloatingCTAProps {
  currentStep: number;
  totalSteps: number;
  onContinue?: () => void; // Made optional since it's now informational
  isLoading?: boolean;
  canProceed?: boolean;
}

export function FloatingCTA({ 
  currentStep, 
  totalSteps, 
  onContinue, 
  isLoading = false,
  canProceed = true 
}: FloatingCTAProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAttentionBounce, setShowAttentionBounce] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  // Show CTA after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Periodic bounce attention animation (every 15 seconds when not expanded)
  useEffect(() => {
    if (isExpanded || !isVisible) return;

    const bounceTimer = setInterval(() => {
      if (!isExpanded) {
        setShowAttentionBounce(true);
        setTimeout(() => setShowAttentionBounce(false), 600);
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(bounceTimer);
  }, [isExpanded, isVisible]);

  // Step names and time estimates
  const getStepInfo = () => {
    const stepData: Record<number, { name: string; timeLeft: string; description: string }> = {
      1: { 
        name: "Security Assessment", 
        timeLeft: "approximately 8 minutes left",
        description: "We assess your security requirements to match you with qualified SIA licensed close protection officers and appropriate minicab services. This helps us understand your protection needs and recommend suitable security officers for your transport requirements."
      },
      2: { 
        name: "Frequency Planning", 
        timeLeft: "approximately 7 minutes left",
        description: "Understanding your travel patterns helps us optimize our minicab and taxi service delivery. Regular users benefit from consistent SIA security officers and route planning, while occasional users receive flexible on-demand close protection services."
      },
      3: { 
        name: "Service Matching", 
        timeLeft: "approximately 6 minutes left", 
        description: "These preferences help us match you with the appropriate service level and qualified security officers. We analyze your selections to recommend whether our Standard, Executive, or Shadow protection with personal bodyguards best meets your specific transport security needs."
      },
      4: { 
        name: "Coverage Planning", 
        timeLeft: "approximately 5 minutes left",
        description: "Knowing your primary locations helps us ensure appropriate SIA licensed security officers and minicab coverage. We pre-position qualified close protection officers and establish secure taxi routes in your key areas."
      },
      5: { 
        name: "Special Locations", 
        timeLeft: "approximately 4 minutes left",
        description: "Additional coverage areas help us provide comprehensive protection services. Airport transfers, government buildings, and entertainment venues each require specialized SIA security officers and trained personal bodyguards with our professional minicab services."
      },
      6: { 
        name: "Emergency Protocols", 
        timeLeft: "approximately 3 minutes left",
        description: "Emergency contacts and communication preferences ensure rapid response coordination with our SIA licensed close protection officers. This follows security industry best practices for duty of care and incident management with professional taxi services."
      },
      7: { 
        name: "Custom Requirements", 
        timeLeft: "approximately 2 minutes left",
        description: "Special requirements ensure our qualified security officers and minicab drivers are prepared to provide appropriate professional services. Accessibility, medical, and private security accommodations are configured in advance with our SIA licensed personnel."
      },
      8: { 
        name: "Communication Setup", 
        timeLeft: "approximately 1 minute left", 
        description: "Communication preferences ensure seamless coordination between you, your team, and our close protection officers. Clear communication is essential for effective security transport operations with our professional taxi and minicab services."
      },
      9: { 
        name: "Profile Completion", 
        timeLeft: "Almost done!",
        description: "Final review ensures your security profile is complete and accurate. This comprehensive assessment enables us to deliver the most appropriate protection service with qualified SIA security officers and professional minicab transport for your specific requirements."
      }
    };
    
    return stepData[currentStep] || { name: "Assessment", timeLeft: "Loading...", description: "Completing your security profile for professional transport services with qualified SIA licensed officers..." };
  };

  // Enhanced message for floating bar
  const getStepMessage = () => {
    if (isLoading) return "Loading...";
    
    const stepInfo = getStepInfo();
    return `${stepInfo.name} - ${stepInfo.timeLeft}`;
  };

  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaY = startY.current - currentY.current;
    
    // Swipe up to open (minimum 50px swipe)
    if (deltaY > 50 && !isExpanded) {
      setIsExpanded(true);
    }
    // Swipe down to close (minimum 50px swipe)
    else if (deltaY < -50 && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleClick = () => {
    // Add haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Toggle expanded state
    setIsExpanded(!isExpanded);
  };

  const closePanel = () => {
    setIsExpanded(false);
  };

  const stepInfo = getStepInfo();

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''} ${isExpanded ? styles.expanded : ''}`}>
      {/* Background overlay when expanded */}
      {isExpanded && (
        <div 
          className={styles.backgroundOverlay} 
          onClick={closePanel}
        />
      )}

      {/* Expandable Information Panel */}
      {isExpanded && (
        <div 
          className={styles.expandablePanel}
          ref={panelRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.panelContent}>
            {/* Step-Specific Information */}
            <div className={styles.stepSection}>
              <div className={styles.panelHeader}>
                <h3>{stepInfo.name}</h3>
                <button className={styles.closeButton} onClick={closePanel}>✕</button>
              </div>
              
              <div className={styles.stepProgress}>
                <div className={styles.progressInfo}>
                  Step {currentStep} of {totalSteps} • {stepInfo.timeLeft}
                </div>
                <div className={styles.progressTrack}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <p className={styles.stepDescription}>
                {stepInfo.description}
              </p>
            </div>

            {/* Company Information */}
            <div className={styles.companySection}>
              <div className={styles.divider}></div>
              
              <h4>Professional Security Transport</h4>
              <p>
                We provide discreet minicab and taxi services with SIA licensed close protection officers for high-profile clients. Our qualified security officers and personal bodyguards ensure your safety and privacy for every journey, whether you need a secure cab for business or personal protection services.
              </p>
              
              <div className={styles.companyFeatures}>
                <div className={styles.feature}>🛡️ SIA Licensed Security</div>
                <div className={styles.feature}>🚗 Professional Vehicle Fleet</div>
                <div className={styles.feature}>🔒 Complete Discretion</div>
                <div className={styles.feature}>⏰ 24/7 Availability</div>
                <div className={styles.feature}>🏥 First aid trained drivers</div>
                <div className={styles.feature}>👮 SIA Close Protection Officers</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main CTA Button */}
      <button
        className={`${styles.floatingCTA} ${isLoading ? styles.loading : ''} ${isExpanded ? styles.expanded : ''} ${showAttentionBounce ? styles.attentionBounce : ''}`}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.content}>
          <div className={styles.messageText}>
            {isLoading && <div className={styles.spinner}></div>}
            {getStepMessage()}
            <div className={`${styles.expandIndicator} ${isExpanded ? styles.expanded : styles.collapsed}`}>
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 14 14" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={styles.expandIcon}
              >
                <path 
                  d="M7 1L13 9H1L7 1Z" 
                  fill="currentColor"
                  className={styles.iconPath}
                />
              </svg>
            </div>
          </div>
          
          {/* Progress bar inside button */}
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Golden shimmer effect */}
        <div className={styles.shimmer}></div>
      </button>
    </div>
  );
}