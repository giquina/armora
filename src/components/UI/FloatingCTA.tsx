import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './FloatingCTA.module.css';
import { getRemainingMinutes, formatMinutesLeft } from '../../utils/timeEstimate';
import { getPersonalizedContent } from '../../data/personalizedContent';

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
  const { state } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const ignoreNextClick = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAttentionBounce, setShowAttentionBounce] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  // Desktop detection
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

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

  // Step names and dynamic time estimates with smart personalization
  const getStepInfo = () => {
    const minutesLeft = formatMinutesLeft(getRemainingMinutes(totalSteps, currentStep));
    const firstName = state.questionnaireData?.firstName;
    
    // Personalized step names - strategic usage (not excessive)
    const getPersonalizedStepName = (step: number, baseName: string): string => {
      if (!firstName) return baseName;
      
      // Personalize every 3rd step + final step for natural feel
      if (step === 3 || step === 6 || step === 9) {
        return `${firstName}'s ${baseName}`;
      }
      return baseName;
    };
    
    const baseStepNames: Record<number, string> = {
      1: 'Protection Assessment',
      2: 'Service Frequency',
      3: 'Protection Matching',
      4: 'Coverage Areas',
      5: 'Key Locations',
      6: 'Priority Setup',
      7: 'Special Requirements',
      8: 'Contact Preferences',
      9: 'Final Review',
    };
    
    const stepNames: Record<number, string> = Object.fromEntries(
      Object.entries(baseStepNames).map(([step, name]) => [
        step,
        getPersonalizedStepName(parseInt(step), name)
      ])
    );

    // Smart personalization in descriptions with greetings
    const getPersonalizedDescription = (step: number): string => {
      const baseDescriptions: Record<number, string> = {
        1: "We assess your protection requirements to match you with qualified protection officers and secure transport solutions. This helps us understand your security needs and assign appropriate officers for your protection engagement.",
        2: "Understanding your engagement patterns helps us optimize our protection service delivery. Regular clients benefit from consistent officer assignments and route planning, while occasional users receive flexible on-demand protection services.",
        3: "Your service priorities help us match you with the right protection officers and security personnel. We analyze your selections to recommend whether our Standard, Executive, or Shadow protection best meets your specific security requirements.",
        4: "Knowing your primary locations helps us ensure appropriate protection officer coverage. We pre-position qualified officers and establish secure routes in your key operational areas.",
        5: "Additional coverage areas help us provide comprehensive protection services. Airports, corporate venues, and entertainment districts each require specialized officers with venue-specific security protocols.",
        6: "Priority contacts and communication preferences ensure rapid response coordination with our protection officers, following security industry best practices for duty of care and incident management.",
        7: "Special requirements ensure our protection officers are prepared to provide appropriate professional services. Accessibility, medical, and personal security accommodations are configured in advance with our qualified personnel.",
        8: "Communication preferences ensure seamless coordination between you, your team, and our protection officers. Clear communication is essential for effective security operations.",
        9: "Final review ensures your protection profile is complete and accurate. This comprehensive assessment enables us to deliver the most appropriate protection service for your specific requirements."
      };

      const baseDescription = baseDescriptions[step];
      
      // Add personalized greetings at strategic steps
      if (firstName) {
        if (step === 2) {
          return `Hi ${firstName}, understanding your engagement patterns helps us optimize our protection service delivery. Regular clients benefit from consistent officer assignments and route planning, while occasional users receive flexible on-demand protection services.`;
        }
        if (step === 3) {
          return `Hi ${firstName}, your service priorities help us match you with the right protection officers and security personnel. We analyze your selections to recommend whether our Standard, Executive, or Shadow protection best meets your specific security requirements.`;
        }
        if (step === 6) {
          return `Hi ${firstName}, priority response is crucial for your safety. Priority contacts and communication preferences ensure rapid response coordination with our protection officers, following security industry best practices for duty of care and incident management.`;
        }
        if (step === 9) {
          return `${firstName}, you're almost done! ${baseDescription}`;
        }
      }
      
      return baseDescription;
    };
    
    const descriptions: Record<number, string> = Object.fromEntries(
      Object.entries({1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''}).map(([step]) => [
        step,
        getPersonalizedDescription(parseInt(step))
      ])
    );

    // Get personalized content based on user's profile selection
    const getStepExample = (step: number) => {
      const personalizedContent = getPersonalizedContent(
        state.userProfileSelection || state.questionnaireData?.profileSelection,
        `step${step}`,
        firstName
      );

      return {
        title: personalizedContent.title,
        example: firstName ? personalizedContent.withName : personalizedContent.example,
        benefit: personalizedContent.benefits.join(', ')
      };
    };

    const name = stepNames[currentStep] || 'Assessment';
    const description = descriptions[currentStep] || 'Completing your protection profile for professional security services with qualified officers...';
    const stepExample = getStepExample(currentStep);
    return { name, timeLeft: minutesLeft, description, stepExample };
  };

  // Enhanced message for floating bar
  const getStepMessage = () => {
    if (isLoading) return "Loading...";
    
    const stepInfo = getStepInfo();
    return `${stepInfo.name} - ${stepInfo.timeLeft}`;
  };

  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  // Get brief step description for desktop bar
  const getStepBrief = () => {
    const stepBriefs: Record<number, string> = {
      1: 'Select your protection profile',
      2: 'Define engagement frequency',
      3: 'Choose protection requirements',
      4: 'Select coverage areas',
      5: 'Add key locations',
      6: 'Set priority contacts',
      7: 'Specify special requirements',
      8: 'Configure communications',
      9: 'Review protection profile',
    };
    return stepBriefs[currentStep] || 'Complete your assessment';
  };

  // Touch event handlers for swipe gestures
  const isTap = useRef<boolean>(false);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    isTap.current = true;
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    // If finger moved notably, it's not a simple tap
    if (Math.abs(currentY.current - startY.current) > 10) {
      isTap.current = false;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = startY.current - currentY.current;
    const duration = Date.now() - touchStartTime.current;

    // Treat short, minimal-movement touch as a tap for instant toggle
    if (isTap.current && Math.abs(deltaY) < 10 && duration < 300) {
      e.preventDefault();
  ignoreNextClick.current = true;
  setIsExpanded(prev => !prev);
      return;
    }

    // Swipe up to open (reduced threshold for responsiveness)
    if (deltaY > 30 && !isExpanded) {
      setIsExpanded(true);
    }
    // Swipe down to close
    else if (deltaY < -30 && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleClick = () => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
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

      {/* Expandable Information Panel - Enhanced for Desktop */}
      {isExpanded && (
        <div
          className={`${styles.expandablePanel} ${isDesktop ? styles.desktopPanel : ''}`}
          ref={panelRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={`${styles.panelContent} ${isDesktop ? styles.desktopPanelContent : ''}`}>
            {isDesktop ? (
              // Desktop: Two-column layout
              <div className={styles.desktopPanelGrid}>
                <div className={styles.desktopPanelLeft}>
                  {/* Step Information */}
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

                    {/* Real Example */}
                    <div className={styles.stepExample}>
                      <div className={styles.exampleTitle}>Real Example:</div>
                      <p className={styles.exampleText}>
                        {stepInfo.stepExample.example}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.desktopPanelRight}>
                  {/* Security Information */}
                  <div className={styles.companySection}>
                    <h4>{stepInfo.stepExample.title}</h4>

                    <div className={styles.securityBenefit}>
                      <div className={styles.benefitTitle}>How This Shapes Your Protection:</div>
                      <p className={styles.benefitText}>
                        {stepInfo.stepExample.benefit}
                      </p>
                    </div>

                    <div className={styles.desktopFeatures}>
                      <div className={styles.featureRow}>
                        <div className={styles.feature}>✅ Personal Protection Profile</div>
                        <div className={styles.feature}>🎯 Specialized Officer Matching</div>
                      </div>
                      <div className={styles.featureRow}>
                        <div className={styles.feature}>🛡️ Verified Protection Officers</div>
                        <div className={styles.feature}>📋 Custom Security Protocols</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Mobile: Original single column
              <>
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

                {/* Step-Specific Security Information */}
                <div className={styles.companySection}>
                  <div className={styles.divider}></div>

                  <h4>{stepInfo.stepExample.title}</h4>

                  <div className={styles.stepExample}>
                    <div className={styles.exampleTitle}>Real Example:</div>
                    <p className={styles.exampleText}>
                      {stepInfo.stepExample.example}
                    </p>
                  </div>

                  <div className={styles.securityBenefit}>
                    <div className={styles.benefitTitle}>How This Shapes Your Protection:</div>
                    <p className={styles.benefitText}>
                      {stepInfo.stepExample.benefit}
                    </p>
                  </div>

                  <div className={styles.stepFeatures}>
                    <div className={styles.feature}>✅ Personal Protection Profile</div>
                    <div className={styles.feature}>🎯 Specialized Officer Matching</div>
                    <div className={styles.feature}>🛡️ Verified Protection Officers</div>
                    <div className={styles.feature}>📋 Custom Security Protocols</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main CTA Button - Enhanced for Desktop */}
      <button
        className={`${styles.floatingCTA} ${isLoading ? styles.loading : ''} ${isExpanded ? styles.expanded : ''} ${showAttentionBounce ? styles.attentionBounce : ''} ${isDesktop ? styles.desktop : ''}`}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.content}>
          {isDesktop ? (
            // Desktop: Rich information bar
            <div className={styles.desktopContent}>
              <div className={styles.desktopLeft}>
                <span className={styles.stepCounter}>Step {currentStep} of {totalSteps}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.progressPercent}>{progressPercentage}%</span>
              </div>
              <div className={styles.desktopCenter}>
                <span className={styles.stepBrief}>{getStepBrief()}</span>
              </div>
              <div className={styles.desktopRight}>
                <span className={styles.timeRemaining}>{stepInfo.timeLeft}</span>
                <div className={`${styles.expandIndicator} ${isExpanded ? styles.expanded : styles.collapsed}`}>
                  <span className={styles.expandHint}>{isExpanded ? 'Close' : 'Details'}</span>
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
            </div>
          ) : (
            // Mobile: Original compact design
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
          )}

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