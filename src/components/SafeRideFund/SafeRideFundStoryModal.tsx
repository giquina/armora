import React, { useCallback, useEffect } from 'react';
import styles from './SafeRideFundStoryModal.module.css';

interface SafeRideFundStoryModalProps {
  onClose: () => void;
}

const SafeRideFundStoryModal: React.FC<SafeRideFundStoryModalProps> = ({ onClose }) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
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

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} />
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
            <h2 className={styles.title}>SAFE RIDE FUND INITIATIVE</h2>
            <p className={styles.subtitle}>Every Journey Creates Another Journey</p>
          </header>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>HOW YOUR MEMBERSHIP SAVES LIVES</h3>
            <p className={styles.text}>
              Every Essential membership includes £4 that directly funds emergency transportation for vulnerable people:
            </p>
            <ul className={styles.list}>
              <li>£3 → Partner safety charities</li>
              <li>£1 → Emergency ride fund</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>REAL STORIES, REAL IMPACT</h3>
            
            <div className={styles.story}>
              <div className={styles.storyHeader}>"Last Tuesday, 2:47 AM"</div>
              <p className={styles.storyText}>
                Sarah, a 34-year-old nurse, found herself in an unsafe situation after her night shift. 
                Her ex-partner was waiting at her car. With no money until payday, she used an emergency 
                Safe Ride voucher to get home safely. Your membership made this possible.
              </p>
            </div>

            <div className={styles.story}>
              <div className={styles.storyHeader}>"Three weeks ago"</div>
              <p className={styles.storyText}>
                Marcus, 19, a university student, was stranded after his phone was stolen on a night out. 
                No wallet, no way to contact anyone. A Safe Ride got him back to campus. He wrote to us: 
                "I don't know what I would have done. Thank you to everyone who makes this possible."
              </p>
            </div>

            <div className={styles.story}>
              <div className={styles.storyHeader}>"Yesterday afternoon"</div>
              <p className={styles.storyText}>
                A domestic violence shelter in East London requested emergency transport for a mother and 
                two children to a safe house. The Safe Ride Fund covered the entire journey. They're safe 
                now because of members like you.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>THIS MONTH'S IMPACT</h3>
            <div className={styles.impactGrid}>
              <div className={styles.impactItem}>
                <span className={styles.impactNumber}>278</span>
                <span className={styles.impactLabel}>emergency rides provided</span>
              </div>
              <div className={styles.impactItem}>
                <span className={styles.impactNumber}>834</span>
                <span className={styles.impactLabel}>people reached safety</span>
              </div>
              <div className={styles.impactItem}>
                <span className={styles.impactNumber}>5</span>
                <span className={styles.impactLabel}>partner shelters supported</span>
              </div>
              <div className={styles.impactItem}>
                <span className={styles.impactNumber}>£3,912</span>
                <span className={styles.impactLabel}>distributed to those in need</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>OUR CHARITY PARTNERS</h3>
            <div className={styles.partners}>
              <div className={styles.partner}>
                <div className={styles.partnerIcon}>🏠</div>
                <div className={styles.partnerInfo}>
                  <strong>Refuge UK</strong>
                  <span>National domestic abuse charity</span>
                  <span>127 rides funded this month</span>
                </div>
              </div>
              <div className={styles.partner}>
                <div className={styles.partnerIcon}>🛡️</div>
                <div className={styles.partnerInfo}>
                  <strong>Suzy Lamplugh Trust</strong>
                  <span>Personal safety charity</span>
                  <span>89 rides funded this month</span>
                </div>
              </div>
              <div className={styles.partner}>
                <div className={styles.partnerIcon}>🤝</div>
                <div className={styles.partnerInfo}>
                  <strong>Hestia</strong>
                  <span>Support for crisis situations</span>
                  <span>62 rides funded this month</span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>HOW PEOPLE ACCESS SAFE RIDES</h3>
            <ol className={styles.accessList}>
              <li>Through partner charities (verified need)</li>
              <li>Emergency services referral</li>
              <li>Hospital & NHS staff requests</li>
              <li>University welfare offices</li>
              <li>Verified crisis hotlines</li>
            </ol>
            <p className={styles.text}>
              All requests are verified to ensure funds reach those who need them most.
            </p>
          </section>

          <section className={styles.ctaSection}>
            <h3 className={styles.sectionTitle}>JOIN THE MOVEMENT</h3>
            <p className={styles.text}>
              Every Essential membership contributes £4 monthly to this fund. In just one year, 
              you'll fund 3-4 complete emergency journeys for someone in crisis.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryButton} onClick={handleClose}>
                Start Your Free Trial
              </button>
              <button className={styles.secondaryButton} onClick={handleClose}>
                Learn More About Essential
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SafeRideFundStoryModal;