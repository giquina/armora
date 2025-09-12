import React, { useState, useEffect, useCallback } from 'react';
import styles from './SafeRideFundModal.module.css';

interface SafeRideFundModalProps {
  onClose: () => void;
}

const successStories = [
  {
    id: 1,
    story: "Thanks to the Safe Ride Fund, Sarah could leave a dangerous situation at 2 AM when she had no money for transport. The emergency ride got her to a safe space where she could call family.",
    impact: "Domestic violence survivor"
  },
  {
    id: 2,
    story: "Marcus was stranded after his phone was stolen, leaving him without access to banking apps or money. A Safe Ride Fund journey got him home safely at midnight.",
    impact: "Crime victim assistance"
  },
  {
    id: 3,
    story: "When Emma's mental health crisis escalated late at night, the Safe Ride Fund provided immediate transport to emergency services, potentially saving her life.",
    impact: "Mental health emergency"
  }
];

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
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
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
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className={styles.content}>
          <header className={styles.header}>
            <h2 className={styles.title}>Safe Ride Fund Initiative</h2>
            <p className={styles.subtitle}>Every Member Makes London Safer</p>
          </header>

          <section className={styles.mission}>
            <p>
              At Armora, protection extends beyond our members. £4 from every Essential membership 
              directly funds emergency transportation for vulnerable people in crisis.
            </p>
          </section>

          <section className={styles.breakdown}>
            <h3>How It Works</h3>
            <div className={styles.breakdownChart}>
              <div className={styles.breakdownItem}>
                <span className={styles.amount}>£10.99</span>
                <span className={styles.description}>Your premium service & benefits</span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.amount}>£3.00</span>
                <span className={styles.description}>Partner safety charities</span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.amount}>£1.00</span>
                <span className={styles.description}>Emergency safe rides pool</span>
              </div>
              <div className={styles.total}>
                <span className={styles.totalAmount}>£14.99</span>
                <span className={styles.totalLabel}>Essential Membership</span>
              </div>
            </div>
          </section>

          <section className={styles.impact}>
            <h3>Real Impact</h3>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {Math.floor(ridesCounter).toLocaleString()}
                </span>
                <span className={styles.statLabel}>safe rides funded</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {Math.floor(peopleCounter)}
                </span>
                <span className={styles.statLabel}>people reached safety this month</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>5</span>
                <span className={styles.statLabel}>partner charities supported</span>
              </div>
            </div>
          </section>

          <section className={styles.stories}>
            <h3>Success Stories</h3>
            <div className={styles.storyContainer}>
              <div className={styles.story}>
                <p className={styles.storyText}>
                  "{successStories[currentStoryIndex].story}"
                </p>
                <span className={styles.storyImpact}>
                  — {successStories[currentStoryIndex].impact}
                </span>
              </div>
              <div className={styles.storyIndicators}>
                {successStories.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${index === currentStoryIndex ? styles.active : ''}`}
                    onClick={() => setCurrentStoryIndex(index)}
                    aria-label={`View story ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className={styles.cta}>
            <h3>Join the Movement</h3>
            <p>Start your 30-day free trial and immediately begin making a difference</p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryCta} onClick={handleClose}>
                Start Free Trial
              </button>
              <button className={styles.secondaryCta} onClick={handleClose}>
                Learn More
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SafeRideFundModal;