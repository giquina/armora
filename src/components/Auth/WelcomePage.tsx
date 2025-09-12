import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { AnimatedTitle } from '../UI/AnimatedTitle';
import SeasonalTheme from '../UI/SeasonalTheme';
import GoogleIcon from '../UI/GoogleIcon';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import { CredentialsModal } from '../UI/CredentialsModal';
import SafeRideFundCTA from '../SafeRideFund/SafeRideFundCTA';
import SafeRideFundModal from '../SafeRideFund/SafeRideFundModal';
import styles from './WelcomePage.module.css';

export function WelcomePage() {
  const { navigateToView, setUser, updateQuestionnaireData } = useApp();
  const [showFeatures, setShowFeatures] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showSafeRideModal, setShowSafeRideModal] = useState(false);
  const [impactCounter, setImpactCounter] = useState(0);
  const [showTodayIncrement, setShowTodayIncrement] = useState(false);

  // Development environment detection - ALWAYS SHOW IN DEV
  const isDevelopment = process.env.NODE_ENV === 'development';
  const showDevButton = isDevelopment; // Always show if development mode

  useEffect(() => {
    const featureTimer = setTimeout(() => setShowFeatures(true), 1400);
    const contentTimer = setTimeout(() => setShowContent(true), 1600);
    
    // Simple counter animation - count up once on load
    const counterTimer = setTimeout(() => {
      let current = 0;
      const target = 3743; // Updated number
      const duration = 1500; // 1.5 seconds
      const increment = target / (duration / 50);
      
      const counterInterval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setImpactCounter(target);
          clearInterval(counterInterval);
        } else {
          setImpactCounter(Math.floor(current));
        }
      }, 50);
      
      return () => clearInterval(counterInterval);
    }, 300); // Start after fadeIn
    
    // Debug development button visibility
    console.log('WelcomePage Debug:', { 
      isDevelopment, 
      showDevButton, 
      nodeEnv: process.env.NODE_ENV,
      hostname: window.location.hostname 
    });
    
    return () => {
      clearTimeout(featureTimer);
      clearTimeout(contentTimer);
      clearTimeout(counterTimer);
    };
  }, [isDevelopment, showDevButton]);

  // Helper function for navigation
  const handleNavigate = (destination: string) => {
    navigateToView(destination as any);
  };

  // Handle impact counter interactions
  const handleCounterHover = () => {
    setShowTodayIncrement(true);
    setTimeout(() => setShowTodayIncrement(false), 2000);
  };

  const handleCounterClick = () => {
    setShowSafeRideModal(true);
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
      {/* Impact Counter Bar - MOVED TO VERY TOP */}
      <div 
        className={styles.impactCounterTop}
        onMouseEnter={handleCounterHover}
        onClick={handleCounterClick}
      >
        <span className={styles.shieldIcon}>🛡️</span>
        <span className={styles.counterNumber}>
          {impactCounter.toLocaleString()}
        </span>
        <span className={styles.counterText}>
          safe rides funded by our community
        </span>
        {showTodayIncrement && (
          <span className={styles.todayIncrement}>+12 today</span>
        )}
      </div>

      <div className={styles.welcomeContainer}>
        {/* Header Section */}
        <header className={styles.welcomeHeader}>
          <ArmoraLogo 
            size="large"
            variant="full"
            showOrbits={true}
            interactive={true}
            className={styles.logoContainer}
          />
          
          <AnimatedTitle 
            text="Welcome to Armora" 
            highlightWord="Armora"
            className={styles.welcomeTitle}
            delay={400}
          />
          
          <div className={styles.taglineContainer}>
            <p className={styles.tagline}>
              Your Personal Security Driver Team
            </p>
            <p className={styles.taglineSubtext}>
              Protection for You. Safety for All.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.welcomeContent}>
          {/* Features Highlights */}
          <div className={`${styles.features} ${showFeatures ? styles.featuresVisible : ''}`}>
            <div className={styles.feature} style={{ animationDelay: '0ms', '--delay': 0 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <svg className={styles.featureLogo} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 7V14C4 19 12 22 12 22S20 19 20 14V7L12 2Z" />
                  <path d="M10 14L8 12L9.5 10.5L10 11L14.5 6.5L16 8L10 14Z" />
                </svg>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>Government-Licensed Security Cab Drivers</h3>
                  <p className={styles.featureSubtitle}>SIA-certified drivers with enhanced background screening</p>
                </div>
              </div>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '100ms', '--delay': 1 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <svg className={styles.featureLogo} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01Z"/>
                  <circle cx="7.5" cy="16.5" r="1.5"/>
                  <circle cx="16.5" cy="16.5" r="1.5"/>
                  <path d="M12 8L10 10L14 14L12 16" stroke="currentColor" strokeWidth="1" fill="none"/>
                </svg>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>Secure Private Hire Transport</h3>
                  <p className={styles.featureSubtitle}>Licensed transport with enhanced safety protocols</p>
                </div>
              </div>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '200ms', '--delay': 2 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <div className={styles.featureLogo} style={{ color: '#FFD700' }}>
                  🛡️
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>Safe Ride Fund Initiative</h3>
                  <p className={styles.featureSubtitle}>Your membership funds safe rides for those in danger</p>
                </div>
              </div>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '300ms', '--delay': 3 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <svg className={styles.featureLogo} viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14" stroke="white" strokeWidth="2" fill="none"/>
                  <text x="12" y="4" textAnchor="middle" fontSize="3" fill="currentColor">24/7</text>
                </svg>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>24/7 Protection Booking</h3>
                  <p className={styles.featureSubtitle}>Instant booking with security-conscious drivers available anytime</p>
                </div>
              </div>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '400ms', '--delay': 4 } as React.CSSProperties}>
              <div className={styles.featureContent}>
                <svg className={styles.featureLogo} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 7L7 10L12 6L17 10L21 7L19 16H5Z"/>
                  <text x="12" y="20" textAnchor="middle" fontSize="3" fill="currentColor">VIP</text>
                </svg>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitleOnly}>Discrete Professional Service</h3>
                  <p className={styles.featureSubtitle}>VIP-level confidential transport standards</p>
                </div>
              </div>
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
              className={styles.googleButton}
            >
              <span className={styles.buttonContent}>
                <GoogleIcon className={styles.authIcon} size={20} />
                Join 1,247 Members - Continue with Google
              </span>
            </Button>
            
            {/* Email + Phone Row */}
            <div className={styles.buttonRow}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleNavigate('login')}
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
                onClick={() => handleNavigate('signup')}
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
                <span>Continue as Guest</span>
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
      <SafeRideFundCTA onClick={() => setShowSafeRideModal(true)} />

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
      />

      {/* Safe Ride Fund Modal */}
      {showSafeRideModal && (
        <SafeRideFundModal onClose={() => setShowSafeRideModal(false)} />
      )}

      {/* SUPER VISIBLE RED DEVELOPMENT BUTTON */}
      {showDevButton && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 99999,
            backgroundColor: '#ff0000',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255, 0, 0, 0.6)',
            border: '3px solid #ffffff',
            fontFamily: 'monospace',
            animation: 'pulse 1s infinite'
          }}
          onClick={() => navigateToView('questionnaire')}
        >
          🔴 TEST QUESTIONNAIRE 🔴
        </div>
      )}
      
    </SeasonalTheme>
  );
}