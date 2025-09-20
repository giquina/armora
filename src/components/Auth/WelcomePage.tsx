import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
// Removed AnimatedTitle import as we now use BrandText component
import SeasonalTheme from '../UI/SeasonalTheme';
import GoogleIcon from '../UI/GoogleIcon';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import { WelcomeTitle, ArmoraTagline } from '../UI/BrandText';
import { CredentialsModal } from '../UI/CredentialsModal';
import SafeRideFundCTA from '../SafeRideFund/SafeRideFundCTA';
import SafeRideFundModal from '../SafeRideFund/SafeRideFundModal';
// import SafeRideFundBanner from '../SafeRideFund/SafeRideFundBanner';
import { DevNavigationPanel } from '../UI/DevNavigationPanel';
import styles from './WelcomePage.module.css';

export function WelcomePage() {
  const { navigateToView, setUser, updateQuestionnaireData } = useApp();
  const [showFeatures, setShowFeatures] = useState(false);
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
    const featureTimer = setTimeout(() => setShowFeatures(true), 1400);
    const contentTimer = setTimeout(() => setShowContent(true), 1600);
    return () => {
      clearTimeout(featureTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Helper function for navigation
  const handleNavigate = (destination: string) => {
    navigateToView(destination as any);
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
        notifications: ['booking-updates', 'driver-arrival']
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
      {/* New unified Safe Ride Fund Banner at top */}
      {/* Temporarily commented out due to TS errors - to be fixed in next session */}
      {/* <SafeRideFundBanner variant="compact" className={styles.topBanner} onBannerClick={() => setShowSafeRideModal(true)} /> */}
      {/* Removed legacy impactCounterTop bar */}
      <div className={`${styles.welcomeContainer}`}>
        {/* Improved Header Section */}
        <header className={styles.welcomeHeader}>
          <div className={styles.headerSection}>
            {/* Centered Logo Section */}
            <div className={styles.logoSection}>
              <div className={styles.logoContainer}>
                <ArmoraLogo 
                  size="medium"
                  variant="full"
                  showOrbits={true}
                  interactive={true}
                />
              </div>
            </div>
            
            {/* Stacked Text Section */}
            <div className={styles.textSection}>
              <div className={styles.textContainer}>
                <WelcomeTitle className={styles.welcomeTitle} />
                <div className={styles.taglineStack}>
                  <p className={styles.tagline}>
                    <ArmoraTagline />
                  </p>
                  <p className={styles.taglineSubtext}>
                    Your Security. Our Priority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Why Choose Armora Protection */}
        <main className={styles.welcomeContent}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>WHY CHOOSE ARMORA PROTECTION</h2>
          </div>

          {/* Feature Cards */}
          <div className={`${styles.features} ${showFeatures ? styles.featuresVisible : ''}`}>
            {/* Card 1 - Personal Protection */}
            <div className={styles.featureCard} style={{ animationDelay: '0ms', '--delay': 0 } as React.CSSProperties}>
              <div className={styles.featureCardContent}>
                <div className={styles.featureIconWrapper}>
                  <svg className={styles.featureLogo} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 7V14C4 19 12 22 12 22S20 19 20 14V7L12 2Z" />
                    <path d="M10 14L8 12L9.5 10.5L10 11L14.5 6.5L16 8L10 14Z" />
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Personal Protection</h3>
                  <h4 className={styles.featureSubtitle}>SIA-Licensed Protection Officers</h4>
                  <p className={styles.featureDescription}>2-hour minimum • Fully vetted professionals</p>
                  <button className={styles.featureButton} onClick={() => navigateToView('services')}>View Services</button>
                </div>
              </div>
            </div>

            {/* Card 2 - Secure Transport */}
            <div className={styles.featureCard} style={{ animationDelay: '100ms', '--delay': 1 } as React.CSSProperties}>
              <div className={styles.featureCardContent}>
                <div className={styles.featureIconWrapper}>
                  <svg className={styles.featureLogo} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01Z"/>
                    <circle cx="7.5" cy="16.5" r="1.5"/>
                    <circle cx="16.5" cy="16.5" r="1.5"/>
                    <path d="M12 2L4 7V14C4 19 12 22 12 22S20 19 20 14V7L12 2Z" stroke="white" strokeWidth="1" fill="none"/>
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Secure Transport</h3>
                  <h4 className={styles.featureSubtitle}>Threat-Assessed Routes</h4>
                  <p className={styles.featureDescription}>Executive vehicles • Live GPS tracking</p>
                  <button className={styles.featureButton} onClick={() => navigateToView('services')}>Protection Levels</button>
                </div>
              </div>
            </div>

            {/* Card 3 - Nationwide Coverage */}
            <div className={styles.featureCard} style={{ animationDelay: '200ms', '--delay': 2 } as React.CSSProperties}>
              <div className={styles.featureCardContent}>
                <div className={styles.featureIconWrapper}>
                  <svg className={styles.featureLogo} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 12C3 7.5 6.5 4 12 4S21 7.5 21 12C21 16.5 17.5 20 12 20S3 16.5 3 12Z"/>
                    <circle cx="9" cy="9" r="1" fill="white"/>
                    <circle cx="15" cy="11" r="1" fill="white"/>
                    <circle cx="12" cy="15" r="1" fill="white"/>
                    <path d="M7 8L9 10L11 8M13 10L15 12L17 10M10 14L12 16L14 14" stroke="white" strokeWidth="0.5" fill="none"/>
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>England & Wales</h3>
                  <h4 className={styles.featureSubtitle}>Nationwide Protection</h4>
                  <p className={styles.featureDescription}>London specialists • All major cities</p>
                  <button className={styles.featureButton} onClick={() => navigateToView('services')}>Coverage Areas</button>
                </div>
              </div>
            </div>

            {/* Card 4 - SIA Licensed */}
            <div className={styles.featureCard} style={{ animationDelay: '300ms', '--delay': 3 } as React.CSSProperties}>
              <div className={styles.featureCardContent}>
                <div className={styles.featureIconWrapper}>
                  <svg className={styles.featureLogo} viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="4" width="18" height="14" rx="2" ry="2"/>
                    <rect x="6" y="7" width="4" height="3" rx="0.5" fill="white"/>
                    <line x1="12" y1="8" x2="18" y2="8" stroke="white" strokeWidth="1"/>
                    <line x1="12" y1="11" x2="16" y2="11" stroke="white" strokeWidth="1"/>
                    <circle cx="8" cy="14" r="1" fill="white"/>
                    <path d="M10 14H18" stroke="white" strokeWidth="1"/>
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Fully Verified</h3>
                  <h4 className={styles.featureSubtitle}>Government Licensed</h4>
                  <p className={styles.featureDescription}>Background checked • £10m insured</p>
                  <button className={styles.featureButton} onClick={() => setShowCredentialsModal(true)}>Our Standards</button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustIndicator}>
              <span className={styles.trustIcon}>🛡️</span>
              <span className={styles.trustText}>Founded by Former Military & Police Protection Specialists</span>
            </div>
            <div className={styles.trustIndicator}>
              <span className={styles.trustIcon}>⭐</span>
              <span className={styles.trustText}>Operating across England & Wales • London-based rapid response</span>
            </div>
          </div>
        </main>



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
            Government-Licensed & Certified Operations
          </button>
        </footer>
      </div>

      {/* Safe Ride Fund CTA */}
      <SafeRideFundCTA onClick={() => {
        console.log('🛡️ WelcomePage: SafeRideFundCTA onClick handler called!');
        setShowSafeRideModal(true);
      }} />

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
      />

      {/* Safe Ride Fund Modal */}
      {showSafeRideModal && (
        <SafeRideFundModal onClose={() => setShowSafeRideModal(false)} />
      )}

      {/* Developer Navigation Panel */}
      {showDevButton && (
        <DevNavigationPanel />
      )}
    </SeasonalTheme>
  );
}