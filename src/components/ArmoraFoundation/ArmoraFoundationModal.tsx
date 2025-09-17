import React, { useState, useEffect, useCallback } from 'react';
import styles from './ArmoraFoundationModal.module.css';
import { 
  useCounterAnimation, 
  useIntersectionObserver, 
  getStaggeredDelay, 
  formatCounterValue
} from '../../utils/animationUtils';

interface ArmoraFoundationModalProps {
  onClose: () => void;
}

const organizationTestimonials = [
  {
    id: 1,
    organization: "Spotify Music Lab",
    testimonial: "Armora Foundation graduates are creating chart-worthy music. Three of our recent participants now have tracks on official playlists and one hit 50K streams in their first month.",
    impact: "Music Career Development",
    verified: true,
    stats: "3 tracks on official playlists",
    story: "Armora Foundation graduates are creating chart-worthy music. Three of our recent participants now have tracks on official playlists and one hit 50K streams in their first month."
  },
  {
    id: 2,
    organization: "Google for Startups",
    testimonial: "The coding bootcamp produces job-ready developers. We've hired 12 graduates directly into our partner companies, with starting salaries 40% above industry average.",
    impact: "Tech Career Placement",
    verified: true,
    stats: "12 graduates hired directly",
    story: "The coding bootcamp produces job-ready developers. We've hired 12 graduates directly into our partner companies, with starting salaries 40% above industry average."
  },
  {
    id: 3,
    organization: "Netflix Local Studios",
    testimonial: "These young filmmakers bring fresh perspectives. Two short films from the program are now in our showcase collection, and one director just signed their first commercial deal.",
    impact: "Film & Media Opportunities",
    verified: true,
    stats: "2 films in showcase collection",
    story: "These young filmmakers bring fresh perspectives. Two short films from the program are now in our showcase collection, and one director just signed their first commercial deal."
  }
];


const ArmoraFoundationModal: React.FC<ArmoraFoundationModalProps> = ({ onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasAnimationStarted, setHasAnimationStarted] = useState(false);

  // Rotating creative icons
  const creativeIcons = ['🎬', '🎵', '💻', '🎨', '🚀'];
  const [currentIcon, setCurrentIcon] = useState(0);
  
  // Animation-powered counter hooks
  const careersAnimation = useCounterAnimation(427, 2000, 300, 'easeOut');
  const projectsAnimation = useCounterAnimation(183, 2000, 500, 'easeOut');
  const weeksAnimation = useCounterAnimation(8, 1500, 800, 'easeOut');
  const employmentAnimation = useCounterAnimation(92, 1800, 1000, 'easeOut');

  // Intersection observers for scroll-triggered animations
  const { targetRef: impactRef, hasIntersected: impactIntersected } = useIntersectionObserver();
  const { targetRef: storiesRef, hasIntersected: storiesIntersected } = useIntersectionObserver();
  const { targetRef: processRef, hasIntersected: processIntersected } = useIntersectionObserver();

  const handleClose = useCallback(() => {
    localStorage.setItem('armoraFoundationModalViewed', 'true');
    localStorage.setItem('armoraFoundationModalViewedDate', new Date().toISOString());
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
      careersAnimation.startAnimation();
      projectsAnimation.startAnimation();
      weeksAnimation.startAnimation();
      employmentAnimation.startAnimation();
    }
  }, [isModalVisible, hasAnimationStarted, careersAnimation, projectsAnimation, weeksAnimation, employmentAnimation]);

  // Story carousel rotation
  useEffect(() => {
    const storyInterval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % organizationTestimonials.length);
    }, 8000);

    return () => clearInterval(storyInterval);
  }, []);

  // Icon rotation effect
  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % creativeIcons.length);
    }, 2000);
    return () => clearInterval(iconInterval);
  }, [creativeIcons.length]);

  // Restart animations when scrolled back into view
  useEffect(() => {
    if (impactIntersected && hasAnimationStarted) {
      // Re-trigger animations if they're not currently running
      if (!careersAnimation.isAnimating) {
        careersAnimation.startAnimation();
        projectsAnimation.startAnimation();
        weeksAnimation.startAnimation();
        employmentAnimation.startAnimation();
      }
    }
  }, [impactIntersected, hasAnimationStarted, careersAnimation, projectsAnimation, weeksAnimation, employmentAnimation]);

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
            <div className={`${styles.icon} ${isModalVisible ? styles.iconBounce : ''}`}>
              <span className={styles.rotatingIcon}>{creativeIcons[currentIcon]}</span>
            </div>
            <div className={styles.headerText}>
              <h2 className={`${styles.title} ${isModalVisible ? styles.titleSlideIn : ''}`}>
                Armora Foundation
              </h2>
              <p className={`${styles.tagline} ${isModalVisible ? styles.taglineSlideIn : ''}`}>
                Future Creators Hub
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
                  {formatCounterValue(careersAnimation.currentValue, 'default')}
                </span>
                <span className={styles.statLabel}>Creative Careers Launched</span>
              </div>
              <div 
                className={`${styles.statCard} ${styles.statCard2} ${hasAnimationStarted ? styles.cardAnimateIn : ''}`}
                style={{ animationDelay: `${getStaggeredDelay(1, 0.15)}s` }}
              >
                <span className={`${styles.statNumber} ${styles.secondaryNumber}`}>
                  {formatCounterValue(projectsAnimation.currentValue, 'default')}
                </span>
                <span className={styles.statLabel}>Active Projects Created</span>
              </div>
              <div 
                className={`${styles.statCard} ${styles.statCard3} ${hasAnimationStarted ? styles.cardAnimateIn : ''}`}
                style={{ animationDelay: `${getStaggeredDelay(2, 0.15)}s` }}
              >
                <span className={`${styles.statNumber} ${styles.timeNumber}`}>
                  {formatCounterValue(weeksAnimation.currentValue, 'default')} weeks
                </span>
                <span className={styles.statLabel}>Program Length</span>
              </div>
              <div 
                className={`${styles.statCard} ${styles.statCard4} ${styles.successCard} ${hasAnimationStarted ? styles.cardAnimateIn : ''}`}
                style={{ animationDelay: `${getStaggeredDelay(3, 0.15)}s` }}
              >
                <span className={`${styles.statNumber} ${styles.successNumber}`}>
                  {formatCounterValue(employmentAnimation.currentValue, 'percentage')}
                </span>
                <span className={styles.statLabel}>Employment Rate</span>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${employmentAnimation.currentValue}%`,
                      transitionDelay: '1.2s'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.mission}>
            <h3>Our Mission</h3>
            <p>Every Armora membership includes a £4 contribution to fund creative education for underserved youth. We provide FREE coding bootcamps, music production studio time, and media creation workshops. Our 8-week programs transform beginners into portfolio-ready creators, with 92% finding employment or launching their own projects within 6 months.</p>
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
                "Young people apply for free 8-week programs in coding, music, or media",
                "Create real projects with industry mentors and pro equipment",
                "Present work at Amora Festival and connect with employers",
                "Successful graduates return to mentor the next generation"
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
              <h3>Your Creative Impact</h3>
              <div className={styles.contributionDetails}>
                <div className={styles.contributionAmount}>
                  <span className={styles.amount}>£4</span>
                  <span className={styles.amountDesc}>from every membership</span>
                </div>
                <div className={styles.contributionResult}>
                  <span className={styles.result}>= Creative Futures</span>
                  <span className={styles.resultDesc}>Coding scholarships, studio time & equipment</span>
                </div>
              </div>
            </div>
          </section>

          <div className={`${styles.actions} ${isModalVisible ? styles.actionsSlideUp : ''}`}>
            <button 
              className={`${styles.primaryButton} ${styles.buttonPulse} ${styles.gradientShift}`} 
              onClick={handleClose}
            >
              <span className={styles.buttonText}>Join the Movement</span>
              <div className={styles.buttonRipple}></div>
            </button>
            <button 
              className={`${styles.secondaryButton} ${styles.buttonHover} ${styles.buttonGlow}`} 
              onClick={handleClose}
            >
              <span className={styles.buttonText}>See Our Graduates</span>
              <div className={styles.buttonShimmer}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmoraFoundationModal;