import { FC, useState, useEffect, useCallback } from 'react';
import styles from './SafeAssignmentFundModal.module.css';
import { 
  useCounterAnimation, 
  useIntersectionObserver, 
  getStaggeredDelay, 
  formatCounterValue
} from '../../utils/animationUtils';

interface SafeAssignmentFundModalProps {
  onClose: () => void;
}

const organizationTestimonials = [
  {
    id: 1,
    organization: "Women's Aid Federation",
    testimonial: "The Safe Assignment Fund has become an essential lifeline, providing immediate transport solutions when traditional funding isn't available. Their 24/7 availability has directly supported over 200 individuals this year.",
    impact: "Domestic Violence Support",
    verified: true,
    stats: "200+ individuals supported",
    story: "The Safe Assignment Fund has become an essential lifeline, providing immediate transport solutions when traditional funding isn't available. Their 24/7 availability has directly supported over 200 individuals this year."
  },
  {
    id: 2,
    organization: "Crisis UK",
    testimonial: "Armora's Safe Assignment Fund eliminates transport barriers that often prevent our service users from accessing vital support. Their rapid response has been instrumental in crisis intervention.",
    impact: "Homelessness Prevention", 
    verified: true,
    stats: "Average 12min response time",
    story: "Armora's Safe Assignment Fund eliminates transport barriers that often prevent our service users from accessing vital support. Their rapid response has been instrumental in crisis intervention."
  },
  {
    id: 3,
    organization: "Mind Mental Health",
    testimonial: "Transport accessibility is crucial for mental health support. The Safe Assignment Fund has enabled 150+ individuals to attend critical appointments and reach support services.",
    impact: "Mental Health Access",
    verified: true,
    stats: "98% appointment attendance rate",
    story: "Transport accessibility is crucial for mental health support. The Safe Assignment Fund has enabled 150+ individuals to attend critical appointments and reach support services."
  }
];


const SafeAssignmentFundModal: FC<SafeAssignmentFundModalProps> = ({ onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasAnimationStarted, setHasAnimationStarted] = useState(false);
  
  // Animation-powered counter hooks
  const ridesAnimation = useCounterAnimation(3741, 2000, 300, 'easeOut');
  const peopleAnimation = useCounterAnimation(834, 2000, 500, 'easeOut');
  const timeAnimation = useCounterAnimation(12, 1500, 800, 'easeOut');
  const successAnimation = useCounterAnimation(98, 1800, 1000, 'easeOut');

  // Intersection observers for scroll-triggered animations
  const { targetRef: impactRef, hasIntersected: impactIntersected } = useIntersectionObserver();
  const { targetRef: storiesRef, hasIntersected: storiesIntersected } = useIntersectionObserver();
  const { targetRef: processRef, hasIntersected: processIntersected } = useIntersectionObserver();

  const handleClose = useCallback(() => {
    localStorage.setItem('safeRideFundModalViewed', 'true');
    localStorage.setItem('safeRideFundModalViewedDate', new Date().toISOString());
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Modal entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Start counter animations when modal becomes visible
  useEffect(() => {
    if (isModalVisible && !hasAnimationStarted) {
      setHasAnimationStarted(true);
      ridesAnimation.startAnimation();
      peopleAnimation.startAnimation();
      timeAnimation.startAnimation();
      successAnimation.startAnimation();
    }
  }, [isModalVisible, hasAnimationStarted, ridesAnimation, peopleAnimation, timeAnimation, successAnimation]);

  // Story carousel rotation
  useEffect(() => {
    const storyInterval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % organizationTestimonials.length);
    }, 8000);

    return () => clearInterval(storyInterval);
  }, []);

  // Restart animations when scrolled back into view
  useEffect(() => {
    if (impactIntersected && hasAnimationStarted) {
      // Re-trigger animations if they're not currently running
      if (!ridesAnimation.isAnimating) {
        ridesAnimation.startAnimation();
        peopleAnimation.startAnimation();
        timeAnimation.startAnimation();
        successAnimation.startAnimation();
      }
    }
  }, [impactIntersected, hasAnimationStarted, ridesAnimation, peopleAnimation, timeAnimation, successAnimation]);

  return (
    <div 
      className={`${styles.modalOverlay} ${isModalVisible ? styles.visible : ''}`} 
      onClick={handleBackdropClick}
    >
      <div 
        className={`${styles.modal} ${isModalVisible ? styles.modalEnter : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className={`${styles.closeButton} ${isModalVisible ? styles.fadeInDelayed : ''}`}
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className={styles.content}>
          <header className={`${styles.header} ${isModalVisible ? styles.headerAnimate : ''}`}>
            <div className={`${styles.icon} ${isModalVisible ? styles.iconBounce : ''}`}>🛡️</div>
            <div className={styles.headerText}>
              <h2 className={`${styles.title} ${isModalVisible ? styles.titleSlideIn : ''}`}>
                Safe Assignment Fund
              </h2>
              <p className={`${styles.tagline} ${isModalVisible ? styles.taglineSlideIn : ''}`}>
                Transport for those who need it most
              </p>
            </div>
          </header>

          <section 
            ref={impactRef}
            className={`${styles.impact} ${impactIntersected ? styles.impactVisible : ''}`}
          >
            <div className={styles.statsGrid}>
              <div 
                className={`${styles.statCard} ${styles.statCard1} ${hasAnimationStarted ? styles.cardAnimateIn : ''}`}
                style={{ animationDelay: `${getStaggeredDelay(0, 0.15)}s` }}
              >
                <span className={`${styles.statNumber} ${styles.primaryNumber}`}>
                  {formatCounterValue(ridesAnimation.currentValue, 'default')}
                </span>
                <span className={styles.statLabel}>Safe Assignments Delivered</span>
              </div>
              <div 
                className={`${styles.statCard} ${styles.statCard2} ${hasAnimationStarted ? styles.cardAnimateIn : ''}`}
                style={{ animationDelay: `${getStaggeredDelay(1, 0.15)}s` }}
              >
                <span className={`${styles.statNumber} ${styles.secondaryNumber}`}>
                  {formatCounterValue(peopleAnimation.currentValue, 'default')}
                </span>
                <span className={styles.statLabel}>People Reached This Month</span>
              </div>
              <div 
                className={`${styles.statCard} ${styles.statCard3} ${hasAnimationStarted ? styles.cardAnimateIn : ''}`}
                style={{ animationDelay: `${getStaggeredDelay(2, 0.15)}s` }}
              >
                <span className={`${styles.statNumber} ${styles.timeNumber}`}>
                  {formatCounterValue(timeAnimation.currentValue, 'time')}
                </span>
                <span className={styles.statLabel}>Average Response</span>
              </div>
              <div 
                className={`${styles.statCard} ${styles.statCard4} ${styles.successCard} ${hasAnimationStarted ? styles.cardAnimateIn : ''}`}
                style={{ animationDelay: `${getStaggeredDelay(3, 0.15)}s` }}
              >
                <span className={`${styles.statNumber} ${styles.successNumber}`}>
                  {formatCounterValue(successAnimation.currentValue, 'percentage')}
                </span>
                <span className={styles.statLabel}>Success Rate</span>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${successAnimation.currentValue}%`,
                      transitionDelay: '1.2s'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.mission}>
            <h3>Our Mission</h3>
            <p>Every Armora membership contributes £4 to our Safe Assignment Fund, providing priority transport for vulnerable individuals when they need it most. Working with Crisis UK, Women's Aid, Mind Mental Health, and other vital organizations, we ensure transport is never a barrier to safety and support.</p>
          </section>

          <section 
            ref={storiesRef}
            className={`${styles.stories} ${storiesIntersected ? styles.storiesVisible : ''}`}
          >
            <h3 className={`${styles.sectionTitle} ${storiesIntersected ? styles.titleFadeUp : ''}`}>
              Partner Organizations
            </h3>
            <div className={`${styles.storyContainer} ${storiesIntersected ? styles.storyContainerFadeIn : ''}`}>
              <div className={`${styles.story} ${styles.storyTransition}`}>
                <div className={`${styles.organizationHeader} ${storiesIntersected ? styles.headerSlideIn : ''}`}>
                  <div className={styles.organizationInfo}>
                    <h4 className={`${styles.organizationName} ${styles.nameGlow}`}>
                      {organizationTestimonials[currentStoryIndex].organization}
                    </h4>
                    {organizationTestimonials[currentStoryIndex].verified && (
                      <span className={`${styles.verifiedBadge} ${styles.badgePulse}`}>
                        ✓ Verified Partner
                      </span>
                    )}
                  </div>
                </div>
                <p className={`${styles.storyText} ${styles.textShimmer}`}>
                  "{organizationTestimonials[currentStoryIndex].testimonial}"
                </p>
                <div className={`${styles.testimonialFooter} ${storiesIntersected ? styles.footerSlideUp : ''}`}>
                  <span className={`${styles.storyImpact} ${styles.impactHighlight}`}>
                    {organizationTestimonials[currentStoryIndex].impact}
                  </span>
                  <span className={`${styles.impactStats} ${styles.statsGlow}`}>
                    {organizationTestimonials[currentStoryIndex].stats}
                  </span>
                </div>
              </div>
              <div className={`${styles.storyIndicators} ${storiesIntersected ? styles.indicatorsSlideIn : ''}`}>
                {organizationTestimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${styles.indicatorHover} ${index === currentStoryIndex ? styles.active : ''}`}
                    onClick={() => setCurrentStoryIndex(index)}
                    aria-label={`Story ${index + 1}`}
                    style={{ animationDelay: `${getStaggeredDelay(index, 0.1)}s` }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section 
            ref={processRef}
            className={`${styles.howItWorks} ${processIntersected ? styles.processVisible : ''}`}
          >
            <h3 className={`${styles.sectionTitle} ${processIntersected ? styles.titleFadeUp : ''}`}>
              How It Works
            </h3>
            <div className={`${styles.processSteps} ${processIntersected ? styles.stepsAnimate : ''}`}>
              {[
                "Partner organizations identify urgent transport needs",
                "Safe Assignment Fund coordinates immediate response", 
                "Security-trained Protection Officers provide safe transport",
                "Individual reaches safety and support"
              ].map((stepText, index) => (
                <div 
                  key={index}
                  className={`${styles.step} ${styles.stepHover} ${processIntersected ? styles.stepSlideIn : ''}`}
                  style={{ animationDelay: `${getStaggeredDelay(index, 0.2)}s` }}
                >
                  <span className={`${styles.stepNumber} ${styles.numberPulse}`}>{index + 1}</span>
                  <span className={`${styles.stepText} ${styles.textFade}`}>{stepText}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.contribution}>
            <div className={styles.contributionCard}>
              <h3>Your Membership Impact</h3>
              <div className={styles.contributionDetails}>
                <div className={styles.contributionAmount}>
                  <span className={styles.amount}>£4</span>
                  <span className={styles.amountDesc}>from every membership</span>
                </div>
                <div className={styles.contributionResult}>
                  <span className={styles.result}>= 1 Priority Journey</span>
                  <span className={styles.resultDesc}>Funded for someone in crisis</span>
                </div>
              </div>
            </div>
          </section>

          <div className={`${styles.actions} ${isModalVisible ? styles.actionsSlideUp : ''}`}>
            <button 
              className={`${styles.primaryButton} ${styles.buttonPulse} ${styles.gradientShift}`} 
              onClick={handleClose}
            >
              <span className={styles.buttonText}>Support This Initiative</span>
              <div className={styles.buttonRipple}></div>
            </button>
            <button 
              className={`${styles.secondaryButton} ${styles.buttonHover} ${styles.buttonGlow}`} 
              onClick={handleClose}
            >
              <span className={styles.buttonText}>Learn More</span>
              <div className={styles.buttonShimmer}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeAssignmentFundModal;