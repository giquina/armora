import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { AnimatedTitle } from '../UI/AnimatedTitle';
import SeasonalTheme from '../UI/SeasonalTheme';
import GoogleIcon from '../UI/GoogleIcon';
import { Logo } from '../UI/Logo';
import { CredentialsModal } from '../UI/CredentialsModal';
import styles from './WelcomePage.module.css';

export function WelcomePage() {
  const { navigateToView, setUser, updateQuestionnaireData } = useApp();
  const [showFeatures, setShowFeatures] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  // Development environment detection
  const isDevelopment = process.env.NODE_ENV === 'development';
  const showDevButton = isDevelopment && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  useEffect(() => {
    const featureTimer = setTimeout(() => setShowFeatures(true), 900);
    const contentTimer = setTimeout(() => setShowContent(true), 1100);
    
    return () => {
      clearTimeout(featureTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Development-only function to skip to dashboard with mock data
  const handleDevSkipToDashboard = () => {
    console.log('🚀 [DEV] Skipping to dashboard with mock data');
    
    // Set up mock user
    const mockUser = {
      id: 'dev-user-123',
      name: 'Test User',
      email: 'test@armora.dev',
      isAuthenticated: true,
      userType: 'registered' as const,
      hasCompletedQuestionnaire: true,
      hasUnlockedReward: true,
      createdAt: new Date()
    };
    setUser(mockUser);

    // Set up mock questionnaire data
    const mockQuestionnaireData = {
      step1_transportProfile: 'executive-business',
      step2_travelFrequency: 'weekly',
      step3_serviceRequirements: ['professional-security', 'premium-vehicles', 'punctuality'],
      step4_primaryCoverage: ['london', 'birmingham'],
      step5_secondaryCoverage: ['manchester'],
      step6_emergencyContact: {
        name: 'Emergency Contact',
        phone: '+44 7700 900000',
        relationship: 'spouse'
      },
      step7_specialRequirements: ['wheelchair-accessible'],
      step8_contactPreferences: {
        email: 'test@armora.dev',
        phone: '+44 7700 900000',
        notifications: ['booking-updates', 'driver-arrival']
      },
      step9_profileReview: true,
      completedAt: new Date(),
      recommendedService: 'executive',
      conversionAttempts: 0
    };
    updateQuestionnaireData(mockQuestionnaireData);

    // Navigate directly to dashboard
    navigateToView('dashboard');
  };

  return (
    <SeasonalTheme className={styles.welcomePage}>
      
      <div className={styles.welcomeContainer}>
        {/* Header Section */}
        <header className={styles.welcomeHeader}>
          <Logo 
            size="lg"
            showOrbital={true}
            animated={true}
            clickable={true}
            enhanced3D={true}
            className={styles.logoContainer}
          />
          
          <AnimatedTitle 
            text="Welcome to Armora" 
            highlightWord="Armora"
            className={styles.welcomeTitle}
            delay={400}
          />
          
          <p className={styles.tagline}>
            Your Personal Security Driver Team
          </p>
        </header>

        {/* Main Content */}
        <main className={styles.welcomeContent}>
          {/* Features Highlights */}
          <div className={`${styles.features} ${showFeatures ? styles.featuresVisible : ''}`}>
            <div className={styles.feature} style={{ animationDelay: '0ms', '--delay': 0 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <svg className={styles.checkmarkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" className={styles.checkmarkPath} />
                </svg>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>Government-Licensed Security Taxi Drivers</h3>
                  <p className={styles.featureSubtitle}>Professional taxi drivers with close protection training and background checks</p>
                </div>
              </div>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '100ms', '--delay': 1 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <svg className={styles.checkmarkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" className={styles.checkmarkPath} />
                </svg>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>Secure Private Hire Transport</h3>
                  <p className={styles.featureSubtitle}>Licensed private hire service with enhanced safety protocols and threat awareness</p>
                </div>
              </div>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '200ms', '--delay': 2 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <svg className={styles.checkmarkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" className={styles.checkmarkPath} />
                </svg>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>24/7 Protection Booking</h3>
                  <p className={styles.featureSubtitle}>Instant taxi booking with security-conscious drivers available anytime</p>
                </div>
              </div>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '300ms', '--delay': 3 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <svg className={styles.checkmarkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" className={styles.checkmarkPath} />
                </svg>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>Discrete Professional Service</h3>
                  <p className={styles.featureSubtitle}>VIP-level service standards with confidential transport protocols</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Action Section */}
        <section className={`${styles.welcomeActions} ${showContent ? styles.actionsVisible : ''}`}>
          <div className={styles.authButtons}>
            <Button
              variant="primary"
              size="lg"
              isFullWidth
              onClick={() => navigateToView('signup')}
              className={styles.googleButton}
            >
              <span className={styles.buttonContent}>
                <GoogleIcon className={styles.authIcon} size={20} />
                Continue with Google
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              isFullWidth
              onClick={() => navigateToView('login')}
              className={styles.emailButton}
            >
              <span className={styles.buttonContent}>
                <svg className={styles.authIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Continue with Email
              </span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              isFullWidth
              onClick={() => navigateToView('signup')}
              className={styles.phoneButton}
            >
              <span className={styles.buttonContent}>
                <svg className={styles.authIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Continue with Phone
              </span>
            </Button>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          <Button
            variant="ghost"
            size="md"
            isFullWidth
            onClick={() => navigateToView('guest-disclaimer')}
            className={styles.guestButton}
          >
            <span className={styles.guestButtonContent}>
              <span>Continue as Guest</span>
              <span className={styles.guestNote}>(Limited features)</span>
            </span>
          </Button>

          {/* Development-only skip button */}
          {showDevButton && (
            <Button
              variant="ghost"
              size="md"
              isFullWidth
              onClick={handleDevSkipToDashboard}
              className={styles.devSkipButton}
            >
              <span className={styles.devButtonContent}>
                <span>🚀 SKIP TO DASHBOARD</span>
                <span className={styles.devNote}>(DEVELOPMENT ONLY)</span>
              </span>
            </Button>
          )}
        </section>

        {/* Footer - Single Government Licensed Text */}
        <footer className={`${styles.welcomeFooter} ${showContent ? styles.footerVisible : ''}`}>
          <button 
            className={styles.governmentLicensedButton}
            onClick={() => setShowCredentialsModal(true)}
            aria-label="View all Government Licensed & Certified Operations credentials"
          >
            Government-Licensed & Certified Operations
          </button>
        </footer>
      </div>

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
      />
    </SeasonalTheme>
  );
}