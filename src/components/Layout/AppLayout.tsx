import React, { ReactNode } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import { Footer } from '../Footer';
import { getDisplayName } from '../../utils/nameUtils';
import { getLogoProps } from '../../styles/brandConstants';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  headerTitle?: string;
  headerActions?: ReactNode;
  className?: string;
}

export function AppLayout({
  children,
  showHeader = true,
  showNavigation = true,
  headerTitle,
  headerActions,
  className = ''
}: AppLayoutProps) {
  const { state, navigateToView } = useApp();
  const { currentView, user } = state;

  // Only show header (with logo) on welcome and splash pages
  const shouldShowHeader = showHeader && ['welcome', 'splash'].includes(currentView);
  const shouldShowNav = showNavigation && user && currentView !== 'splash';

  const getHeaderInfo = () => {
    if (headerTitle) return { title: headerTitle, subtitle: '', showServices: false };

    switch (currentView) {
      case 'welcome': return { title: 'Welcome to ARMORA', subtitle: '', showServices: false };
      case 'login': return { title: 'Sign In', subtitle: '', showServices: false };
      case 'signup': return { title: 'Create Account', subtitle: '', showServices: false };
      case 'guest-disclaimer': return { title: 'Guest Access', subtitle: '', showServices: false };
      case 'questionnaire': return { title: 'Security Assessment', subtitle: '', showServices: false };
      case 'home': return {
        title: 'Home',
        subtitle: 'Your Security Dashboard',
        showServices: true
      };
      case 'services': return { title: 'Services', subtitle: 'Choose your protection', showServices: false };
      case 'booking': return { title: '', subtitle: 'Secure Transport', showServices: false };
      case 'assignments':
      case 'rides': return { title: 'Your Assignments', subtitle: 'Transport & Security', showServices: false };
      case 'account': return { title: 'Your Account', subtitle: 'Settings & Preferences', showServices: false };
      case 'venue-protection-welcome': return { title: 'Venue Protection', subtitle: 'Professional Security Services', showServices: false };
      case 'venue-security-questionnaire': return { title: 'Security Assessment', subtitle: 'Venue Protection Planning', showServices: false };
      case 'venue-protection-success': return { title: 'Assessment Complete', subtitle: 'Quote Being Prepared', showServices: false };
      default: return { title: 'ARMORA Security Transport', subtitle: '', showServices: false };
    }
  };

  const handleBack = () => {
    switch (currentView) {
      case 'login':
      case 'signup':
        navigateToView('welcome');
        break;
      case 'guest-disclaimer':
        navigateToView('welcome');
        break;
      case 'questionnaire':
        if (user?.userType === 'guest') {
          navigateToView('guest-disclaimer');
        } else {
          navigateToView('welcome');
        }
        break;
      case 'services':
        navigateToView('home');
        break;
      case 'booking':
        navigateToView('services');
        break;
      case 'assignments':
        navigateToView('home');
        break;
      case 'account':
        navigateToView('home');
        break;
      case 'venue-security-questionnaire':
        navigateToView('venue-protection-welcome');
        break;
      case 'venue-protection-success':
        navigateToView('home');
        break;
      case 'venue-protection-welcome':
        navigateToView('home');
        break;
      default:
        navigateToView('home');
    }
  };

  const layoutClasses = [
    styles.layout,
    className
  ].filter(Boolean).join(' ');

  const headerInfo = getHeaderInfo();

  return (
    <div className={layoutClasses}>
      {shouldShowHeader && (
        <header className={styles.header}>
          <div className={styles.headerContent}>
            {/* Left Section - Logo and Brand */}
            <div className={styles.headerLeft}>
              {currentView !== 'welcome' && currentView !== 'splash' && (
                <button
                  className={styles.backButton}
                  onClick={handleBack}
                  aria-label="Go back"
                  title="Go back"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
              )}

              <div className={styles.headerBrand}>
                <ArmoraLogo
                  {...getLogoProps('compact')}
                  className={styles.headerLogo}
                />
                <div className={styles.brandInfo}>
                  <div className={styles.brandName}>ARMORA</div>
                  <h1 className={styles.headerTitle}>
                    {headerInfo.title}
                  </h1>
                  {headerInfo.subtitle && (
                    <p className={styles.headerSubtitle}>
                      {headerInfo.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Center Section - Service Types (Desktop Only) */}
            {headerInfo.showServices && (
              <div className={styles.headerCenter}>
                <div className={styles.serviceTypes}>
                  <span className={styles.serviceType}>Standard</span>
                  <span className={styles.serviceType}>Executive</span>
                  <span className={styles.serviceType}>Shadow</span>
                </div>
              </div>
            )}

            {/* Right Section - User Info and Actions */}
            <div className={styles.headerRight}>
              {user && (
                <>
                  <div className={styles.userInfo}>
                    <span className={styles.welcomeText}>
                      Welcome, {getDisplayName(user)}
                    </span>
                    <span className={styles.userType}>
                      {user.userType === 'registered' ? 'Premium Member' :
                       user.userType === 'google' ? 'Premium Member' : 'Guest'}
                    </span>
                  </div>

                  {/* Mobile Quick Actions */}
                  <div className={styles.mobileActions}>
                    {currentView === 'home' && (
                      <button
                        className={styles.quickActionButton}
                        onClick={() => navigateToView('booking')}
                        aria-label="Quick book"
                        title="Quick book"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 5v14"/>
                          <path d="M5 12h14"/>
                        </svg>
                      </button>
                    )}

                    <button
                      className={styles.quickActionButton}
                      onClick={() => navigateToView('account')}
                      aria-label="Profile menu"
                      title="Profile menu"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}

              {headerActions && (
                <div className={styles.headerActions}>
                  {headerActions}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>

      <Footer />

      {shouldShowNav && (
        <nav className={styles.navigation}>
          <div className={styles.navContent}>
            <button
              className={`${styles.navButton} ${currentView === 'home' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('home')}
              aria-label="Home"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span className={styles.navLabel}>Home</span>
            </button>

            <button
              className={`${styles.navButton} ${currentView === 'services' || currentView.startsWith('venue-protection') || currentView === 'booking' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('services')}
              aria-label="Services"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <span className={styles.navLabel}>Services</span>
            </button>

            <button
              className={`${styles.navButton} ${currentView === 'assignments' || currentView === 'rides' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('assignments')}
              aria-label="Assignments"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className={styles.navLabel}>Assignments</span>
            </button>

            <button
              className={`${styles.navButton} ${currentView === 'account' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('account')}
              aria-label="Account"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className={styles.navLabel}>Account</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}