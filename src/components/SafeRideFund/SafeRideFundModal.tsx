import React, { useState, useEffect, useCallback } from 'react';
import styles from './SafeRideFundModal.module.css';

interface SafeRideFundModalProps {
  onClose: () => void;
}

const organizationTestimonials = [
  {
    id: 1,
    organization: "Women's Aid Federation",
    testimonial: "The Safe Ride Fund has become an essential lifeline, providing immediate transport solutions when traditional funding isn't available. Their 24/7 availability has directly supported over 200 individuals this year.",
    impact: "Domestic Violence Support",
    verified: true,
    stats: "200+ individuals supported",
    story: "The Safe Ride Fund has become an essential lifeline, providing immediate transport solutions when traditional funding isn't available. Their 24/7 availability has directly supported over 200 individuals this year."
  },
  {
    id: 2,
    organization: "Crisis UK",
    testimonial: "Armora's Safe Ride Fund eliminates transport barriers that often prevent our service users from accessing vital support. Their rapid response has been instrumental in crisis intervention.",
    impact: "Homelessness Prevention", 
    verified: true,
    stats: "Average 12min response time",
    story: "Armora's Safe Ride Fund eliminates transport barriers that often prevent our service users from accessing vital support. Their rapid response has been instrumental in crisis intervention."
  },
  {
    id: 3,
    organization: "Mind Mental Health",
    testimonial: "Transport accessibility is crucial for mental health support. The Safe Ride Fund has enabled 150+ individuals to attend critical appointments and reach support services.",
    impact: "Mental Health Access",
    verified: true,
    stats: "98% appointment attendance rate",
    story: "Transport accessibility is crucial for mental health support. The Safe Ride Fund has enabled 150+ individuals to attend critical appointments and reach support services."
  }
];

const successStories = organizationTestimonials; // Alias for compatibility

const SafeRideFundModal: React.FC<SafeRideFundModalProps> = ({ onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [ridesCounter, setRidesCounter] = useState(0);
  const [peopleCounter, setPeopleCounter] = useState(0);

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

  useEffect(() => {
    const storyInterval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    }, 8000);

    return () => clearInterval(storyInterval);
  }, []);

  useEffect(() => {
    const ridesTarget = 3741;
    const peopleTarget = 834;
    const duration = 2000;

    const ridesIncrement = ridesTarget / (duration / 50);
    const peopleIncrement = peopleTarget / (duration / 50);

    const timer = setInterval(() => {
      setRidesCounter(prev => {
        const next = prev + ridesIncrement;
        return next >= ridesTarget ? ridesTarget : next;
      });
      setPeopleCounter(prev => {
        const next = prev + peopleIncrement;
        return next >= peopleTarget ? peopleTarget : next;
      });
    }, 50);

    setTimeout(() => clearInterval(timer), duration);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.icon}>🛡️</div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Safe Ride Fund</h2>
              <p className={styles.tagline}>Transport for those who need it most</p>
            </div>
          </header>

          <section className={styles.impact}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{Math.round(ridesCounter)}</span>
                <span className={styles.statLabel}>Safe Rides Delivered</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{Math.round(peopleCounter)}</span>
                <span className={styles.statLabel}>People Reached This Month</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>12min</span>
                <span className={styles.statLabel}>Average Response</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>Success Rate</span>
              </div>
            </div>
          </section>

          <section className={styles.mission}>
            <h3>Our Mission</h3>
            <p>Every Armora membership contributes £4 to our Safe Ride Fund, providing emergency transport for vulnerable individuals when they need it most. Working with Crisis UK, Women's Aid, Mind Mental Health, and other vital organizations, we ensure transport is never a barrier to safety and support.</p>
          </section>

          <section className={styles.stories}>
            <h3>Partner Organizations</h3>
            <div className={styles.storyContainer}>
              <div className={styles.story}>
                <div className={styles.organizationHeader}>
                  <div className={styles.organizationInfo}>
                    <h4 className={styles.organizationName}>
                      {organizationTestimonials[currentStoryIndex].organization}
                    </h4>
                    {organizationTestimonials[currentStoryIndex].verified && (
                      <span className={styles.verifiedBadge}>✓ Verified Partner</span>
                    )}
                  </div>
                </div>
                <p className={styles.storyText}>
                  "{successStories[currentStoryIndex].testimonial}"
                </p>
                <div className={styles.testimonialFooter}>
                  <span className={styles.storyImpact}>
                    {successStories[currentStoryIndex].impact}
                  </span>
                  <span className={styles.impactStats}>
                    {organizationTestimonials[currentStoryIndex].stats}
                  </span>
                </div>
              </div>
              <div className={styles.storyIndicators}>
                {successStories.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${index === currentStoryIndex ? styles.active : ''}`}
                    onClick={() => setCurrentStoryIndex(index)}
                    aria-label={`Story ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className={styles.howItWorks}>
            <h3>How It Works</h3>
            <div className={styles.processSteps}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>1</span>
                <span className={styles.stepText}>Partner organizations identify urgent transport needs</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <span className={styles.stepText}>Safe Ride Fund coordinates immediate response</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <span className={styles.stepText}>Security-trained drivers provide safe transport</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>4</span>
                <span className={styles.stepText}>Individual reaches safety and support</span>
              </div>
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
                  <span className={styles.result}>= 1 Emergency Journey</span>
                  <span className={styles.resultDesc}>Funded for someone in crisis</span>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={handleClose}>
              Support This Initiative
            </button>
            <button className={styles.secondaryButton} onClick={handleClose}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeRideFundModal;