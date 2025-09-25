import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
// Removed AnimatedTitle import as we now use BrandText component
import SeasonalTheme from '../UI/SeasonalTheme';
import GoogleIcon from '../UI/GoogleIcon';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import { WelcomeTitle, ArmoraTagline } from '../UI/BrandText';
import { CredentialsModal } from '../UI/CredentialsModal';
import SafeAssignmentFundCTA from '../SafeAssignmentFund/SafeAssignmentFundCTA';
import SafeAssignmentFundModal from '../SafeAssignmentFund/SafeAssignmentFundModal';
// import SafeAssignmentFundBanner from '../SafeAssignmentFund/SafeAssignmentFundBanner';
import { DevNavigationPanel } from '../UI/DevNavigationPanel';
import styles from './WelcomePage.module.css';

export function WelcomePage() {
  const { navigateToView, setUser, updateQuestionnaireData } = useApp();
  const [showContent, setShowContent] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showSafeRideModal, setShowSafeRideModal] = useState(false);

  // Debug modal state changes
  useEffect(() => {
    console.log('🛡️ WelcomePage: showSafeRideModal state changed to:', showSafeRideModal);
  }, [showSafeRideModal]);
  // Removed impact counter + rotating message specific states

  // Development environment detection - ALWAYS SHOW IN DEV
  const isDevelopment = process.env.NODE_ENV === 'development';
  const showDevButton = isDevelopment;

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 1600);
    return () => {
      clearTimeout(contentTimer);
    };
  }, []);

  // Helper function for navigation
  const handleNavigate = (secureDestination: string) => {
    navigateToView(secureDestination as any);
  };

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
      step6_safetyContact: {
        name: 'Safety Contact',
        phone: '+44 7700 900000',
        relationship: 'spouse'
      },
      step7_specialRequirements: ['wheelchair-accessible'],
      step8_contactPreferences: {
        email: 'test@armora.dev',
        phone: '+44 7700 900000',
        notifications: ['booking-updates', 'cpo-arrival']
      },
      step9_profileReview: true,
      completedAt: new Date(),
      recommendedService: 'executive',
      conversionAttempts: 0
    };
    updateQuestionnaireData(mockQuestionnaireData);

    // Navigate directly to dashboard
    navigateToView('home');
  };

  return (
    <SeasonalTheme className={styles.welcomePage}>
      {/* New unified Safe Assignment Fund Banner at top */}
      {/* Temporarily commented out due to TS errors - to be fixed in next session */}
      {/* <SafeAssignmentFundBanner variant="compact" className={styles.topBanner} onBannerClick={() => setShowSafeRideModal(true)} /> */}
      {/* Removed legacy impactCounterTop bar */}
      <div className={styles.welcomeContainer}>
        {/* Premium Header Section */}
        <header className={styles.welcomeHeader}>
          <div className={styles.headerSection}>
            {/* Small Logo at Top Center */}
            <div className={styles.logoTop}>
              <div className={styles.logoContainer}>
                <ArmoraLogo
                  size="small"
                  variant="full"
                  showOrbits={true}
                  interactive={true}
                />
              </div>
            </div>

            {/* Full Width Text Section */}
            <div className={styles.fullWidthText}>
              <h1 className={styles.heroHeadline}>Protection That Matches Your Standards</h1>
              <div className={styles.dividerLine}></div>
              <p className={styles.heroSubheading}>Discrete. Professional. Always Available.</p>
              <p className={styles.heroBody}>
                Experience executive-level security tailored to your lifestyle. Our SIA-licensed protection officers provide discrete, professional service that adapts to your needs.
              </p>
            </div>
          </div>
        </header>

        {/* Trust Indicators Section */}
        <section className={`${styles.trustIndicatorsSection} ${showContent ? styles.trustVisible : ''}`}>
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <div className={styles.trustIcon}>✓</div>
              <div className={styles.trustText}>Ex-Military & Police Officers</div>
            </div>
            <div className={styles.trustBadge}>
              <div className={styles.trustIcon}>✓</div>
              <div className={styles.trustText}>Average Response: 12 Minutes</div>
            </div>
            <div className={styles.trustBadge}>
              <div className={styles.trustIcon}>✓</div>
              <div className={styles.trustText}>5-Star Principal Rating</div>
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className={`${styles.welcomeActions} ${showContent ? styles.actionsVisible : ''}`}>
          <div className={styles.authButtons}>
            {/* Primary CTA - Full Width */}
            <Button
              variant="primary"
              size="lg"
              isFullWidth
              onClick={() => handleNavigate('signup')}
              className={`${styles.googleButton} ${styles.authButtonBase}`}
            >
              <span className={styles.buttonContent}>
                <GoogleIcon className={styles.authIcon} size={20} />
                <span className={styles.buttonText}>
                  <span className={styles.desktopText}>Join 1,247 Members - Continue with Google</span>
                  <span className={styles.mobileText}>Join 1,247 Members</span>
                </span>
              </span>
            </Button>
            
            {/* Email + Phone Row */}
            <div className={styles.buttonRow}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleNavigate('login')}
                className={`${styles.emailButton} ${styles.authButtonBase}`}
              >
                <span className={styles.buttonContent}>
                  <svg className={styles.authIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span className={styles.buttonText}>
                    <span className={styles.desktopText}>Continue with Email</span>
                    <span className={styles.mobileText}>Email</span>
                  </span>
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => handleNavigate('signup')}
                className={`${styles.phoneButton} ${styles.authButtonBase}`}
              >
                <span className={styles.buttonContent}>
                  <svg className={styles.authIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span className={styles.buttonText}>
                    <span className={styles.desktopText}>Continue with Phone</span>
                    <span className={styles.mobileText}>Phone</span>
                  </span>
                </span>
              </Button>
            </div>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          {/* Guest + Dev Buttons Row */}
          <div className={styles.bottomButtonRow}>
            <Button
              variant="ghost"
              size="md"
              onClick={() => handleNavigate('guest-disclaimer')}
              className={styles.guestButton}
            >
              <span className={styles.guestButtonContent}>
                <span className={styles.buttonText}>
                  <span className={styles.desktopText}>Continue as Guest</span>
                  <span className={styles.mobileText}>Guest</span>
                </span>
                <span className={styles.guestNote}>(Limited features)</span>
              </span>
            </Button>

            {/* Development-only questionnaire button */}
            {showDevButton && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigateToView('questionnaire')}
                className={styles.devQuestionnaireButton}
              >
                <span className={styles.devButtonContent}>
                  <span>📝 TEST QUESTIONNAIRE</span>
                  <span className={styles.devNote}>(DEVELOPMENT ONLY)</span>
                </span>
              </Button>
            )}
          </div>

          {/* Development-only skip button - keep separate/full width */}
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
            Trusted by 1,247 London executives
          </button>
        </footer>
      </div>

      {/* Safe Assignment Fund CTA */}
      <SafeAssignmentFundCTA onClick={() => {
        console.log('🛡️ WelcomePage: SafeAssignmentFundCTA onClick handler called!');
        setShowSafeRideModal(true);
      }} />

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
      />

      {/* Safe Assignment Fund Modal */}
      {showSafeRideModal && (
        <SafeAssignmentFundModal onClose={() => setShowSafeRideModal(false)} />
      )}

      {/* Developer Navigation Panel */}
      {showDevButton && (
        <DevNavigationPanel />
      )}
    </SeasonalTheme>
  );
}