import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
// Logo removed - keeping pages clean and focused
import styles from './GuestDisclaimer.module.css';

export function GuestDisclaimer() {
  const { navigateToView, setUser, setLoading } = useApp();
  const [showContent, setShowContent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleContinueAsGuest = async () => {
    setIsProcessing(true);
    setLoading(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create guest user
      const guestUser = {
        id: 'guest-' + Date.now(),
        email: 'guest@armora.app',
        name: 'Guest User',
        isAuthenticated: false,
        userType: 'guest' as const,
        hasCompletedQuestionnaire: false,
        hasUnlockedReward: false,
        createdAt: new Date()
      };

      setUser(guestUser);
      navigateToView('questionnaire');

    } catch (error) {
      console.error('Guest setup failed:', error);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigateToView('signup');
  };

  return (
    <div className={styles.disclaimerPage}>
      <div className={`${styles.disclaimerContainer} ${showContent ? styles.visible : ''}`}>
        
        {/* Header - Logo removed for cleaner interface */}
        <header className={styles.header}>
          <h1 className={styles.title}>Guest Access</h1>
          <p className={styles.subtitle}>
            Experience Armora with limited access or create an account for full features
          </p>
        </header>

        {/* Main Content */}
        <div className={styles.content}>
          
          {/* Guest Capabilities */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.sectionIcon} viewBox="0 0 24 24" width="20" height="20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              What You Can Do as a Guest
            </h2>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" width="16" height="16">
                  <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Complete our 9-step professional service assessment</span>
              </li>
              <li className={styles.featureItem}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" width="16" height="16">
                  <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Browse all service levels (Standard, Executive, Shadow)</span>
              </li>
              <li className={styles.featureItem}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" width="16" height="16">
                  <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Use our quote calculator for route pricing estimates</span>
              </li>
              <li className={styles.featureItem}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" width="16" height="16">
                  <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Access direct contact information for bookings</span>
              </li>
              <li className={styles.featureItem}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" width="16" height="16">
                  <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Preview the protection assignment interface and app features</span>
              </li>
            </ul>
          </section>

          {/* Account Benefits */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.sectionIcon} viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
              </svg>
              Premium Account Benefits
            </h2>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitItem}>
                <div className={styles.benefitHeader}>
                  <svg className={styles.benefitIcon} viewBox="0 0 24 24" width="16" height="16">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className={styles.benefitTitle}>Direct In-App Assignment</span>
                </div>
                <p className={styles.benefitDescription}>
                  Book Assignments instantly without phone calls or waiting
                </p>
              </li>
              <li className={styles.benefitItem}>
                <div className={styles.benefitHeader}>
                  <svg className={styles.benefitIcon} viewBox="0 0 24 24" width="16" height="16">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className={styles.benefitTitle}>Secure Payment Storage</span>
                </div>
                <p className={styles.benefitDescription}>
                  Save payment methods for quick, secure transactions
                </p>
              </li>
              <li className={styles.benefitItem}>
                <div className={styles.benefitHeader}>
                  <svg className={styles.benefitIcon} viewBox="0 0 24 24" width="16" height="16">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className={styles.benefitTitle}>Assignment History & Profiles</span>
                </div>
                <p className={styles.benefitDescription}>
                  Access all previous Protection Details and saved secureDestination profiles
                </p>
              </li>
              <li className={styles.benefitItem}>
                <div className={styles.benefitHeader}>
                  <svg className={styles.benefitIcon} viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                  </svg>
                  <span className={styles.benefitTitle}>50% Off First Assignment Reward</span>
                </div>
                <p className={styles.benefitDescription}>
                  Unlock exclusive savings on your first premium journey
                </p>
              </li>
            </ul>
          </section>

          {/* Security & Privacy */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.sectionIcon} viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Your Privacy & Security
            </h2>
            <div className={styles.privacyContent}>
              <p className={styles.privacyText}>
                <strong>Guest Access:</strong> We collect minimal information to provide service recommendations. 
                Your questionnaire responses are stored locally and not linked to personal identity.
              </p>
              <p className={styles.privacyText}>
                <strong>GDPR Compliant:</strong> All data handling meets European privacy standards. 
                You may request data deletion at any time through our contact channels.
              </p>
            </div>
          </section>

          {/* Limitation Notice */}
          <section className={styles.limitationsSection}>
            <div className={styles.limitationNotice}>
              <svg className={styles.warningIcon} viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div className={styles.limitationContent}>
                <h3 className={styles.limitationTitle}>Important Limitation</h3>
                <p className={styles.limitationText}>
                  Guest users cannot complete direct bookings through the app. 
                  You'll need to contact us directly or create an account to reserve your security transport.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <footer className={styles.footer}>
          <Button
            variant="primary"
            size="lg"
            isFullWidth
            onClick={handleCreateAccount}
            disabled={isProcessing}
            className={styles.createAccountButton}
          >
            <span className={styles.buttonContent}>
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
              </svg>
              Create Account for Full Access
            </span>
          </Button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          <Button
            variant="outline"
            size="lg"
            isFullWidth
            onClick={handleContinueAsGuest}
            disabled={isProcessing}
            className={styles.guestButton}
          >
            {isProcessing ? (
              <>
                <svg className={styles.spinner} viewBox="0 0 24 24" width="20" height="20">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="31.416" strokeDashoffset="31.416">
                    <animate attributeName="stroke-dashoffset" dur="1s" values="31.416;0" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Setting up guest access...
              </>
            ) : (
              <span className={styles.buttonContent}>
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" width="20" height="20">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Continue as Guest
              </span>
            )}
          </Button>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigateToView('welcome')}
            disabled={isProcessing}
          >
            ← Back to Welcome
          </button>
        </footer>
      </div>
    </div>
  );
}