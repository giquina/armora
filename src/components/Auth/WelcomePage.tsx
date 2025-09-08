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
    const featureTimer = setTimeout(() => setShowFeatures(true), 1800);
    const contentTimer = setTimeout(() => setShowContent(true), 2200);
    
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
            <div className={styles.feature} style={{ animationDelay: '0ms' }}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className={styles.featureText}>Professional Drivers</span>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '200ms' }}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <span className={styles.featureText}>Premium Vehicles</span>
            </div>
            
            <div className={styles.feature} style={{ animationDelay: '400ms' }}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <span className={styles.featureText}>Always Available</span>
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

        {/* Footer Stats - Interactive Credentials */}
        <footer className={`${styles.welcomeFooter} ${showContent ? styles.footerVisible : ''}`}>
          <div className={styles.trustItem}>
            <button 
              className={styles.credentialBadge}
              onClick={() => setShowCredentialsModal(true)}
              aria-label="View Government Licensed credentials details"
            >
              <span className={styles.trustIcon}>🏛️</span>
              <span className={styles.trustNumber}>Government Licensed</span>
              <span className={styles.trustLabel}>SIA Authority</span>
            </button>
          </div>
          <div className={styles.trustDivider}></div>
          <div className={styles.trustItem}>
            <button 
              className={styles.credentialBadge}
              onClick={() => setShowCredentialsModal(true)}
              aria-label="View Home Office Approved credentials details"
            >
              <span className={styles.trustIcon}>🛡️</span>
              <span className={styles.trustNumber}>Home Office Approved</span>
              <span className={styles.trustLabel}>Security Standards</span>
            </button>
          </div>
          <div className={styles.trustDivider}></div>
          <div className={styles.trustItem}>
            <button 
              className={styles.credentialBadge}
              onClick={() => setShowCredentialsModal(true)}
              aria-label="View Cabinet Office Verified credentials details"
            >
              <span className={styles.trustIcon}>⭐</span>
              <span className={styles.trustNumber}>Cabinet Office Verified</span>
              <span className={styles.trustLabel}>VIP Protection</span>
            </button>
          </div>
          <div className={styles.trustDivider}></div>
          <div className={styles.trustItem}>
            <button 
              className={styles.credentialBadge}
              onClick={() => setShowCredentialsModal(true)}
              aria-label="View TfL Licensed credentials details"
            >
              <span className={styles.trustIcon}>🚗</span>
              <span className={styles.trustNumber}>TfL Licensed</span>
              <span className={styles.trustLabel}>Transport for London</span>
            </button>
          </div>
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