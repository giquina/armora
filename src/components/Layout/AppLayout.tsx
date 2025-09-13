import React, { ReactNode } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import { getDisplayName } from '../../utils/nameUtils';
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

  const shouldShowHeader = showHeader && currentView !== 'splash';
  const shouldShowNav = showNavigation && user && currentView !== 'splash';

  const getHeaderInfo = () => {
    if (headerTitle) return { title: headerTitle, subtitle: '', showServices: false };

    switch (currentView) {
      case 'welcome': return { title: 'Welcome to Armora', subtitle: '', showServices: false };
      case 'login': return { title: 'Sign In', subtitle: '', showServices: false };
      case 'signup': return { title: 'Create Account', subtitle: '', showServices: false };
      case 'guest-disclaimer': return { title: 'Guest Access', subtitle: '', showServices: false };
      case 'questionnaire': return { title: 'Security Assessment', subtitle: '', showServices: false };
      case 'dashboard': return {
        title: 'Choose Your Service',
        subtitle: 'SIA Licensed • 24/7 Available • Premium Fleet',
        showServices: true
      };
      case 'booking': return { title: 'Booking Details', subtitle: 'Secure Transport', showServices: false };
      case 'profile': return { title: 'Your Profile', subtitle: 'Account Settings', showServices: false };
      default: return { title: 'Armora Security Transport', subtitle: '', showServices: false };
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
      case 'booking':
        navigateToView('dashboard');
        break;
      case 'profile':
        navigateToView('dashboard');
        break;
      default:
        navigateToView('dashboard');
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
              {currentView !== 'welcome' && currentView !== 'dashboard' && (
                <button
                  className={styles.backButton}
                  onClick={handleBack}
                  aria-label="Go back"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
              )}

              <div className={styles.headerBrand}>
                <ArmoraLogo
                  size="small"
                  variant="compact"
                  showOrbits={false}
                  interactive={true}
                  className={styles.headerLogo}
                />
                <div className={styles.brandInfo}>
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
                <div className={styles.userInfo}>
                  <span className={styles.welcomeText}>
                    Welcome, {getDisplayName(user)}
                  </span>
                  <span className={styles.userType}>
                    {user.userType === 'registered' ? 'Premium Member' :
                     user.userType === 'google' ? 'Premium Member' : 'Guest'}
                  </span>
                </div>
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

      {shouldShowNav && (
        <nav className={styles.navigation}>
          <div className={styles.navContent}>
            <button
              className={`${styles.navButton} ${currentView === 'dashboard' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('dashboard')}
              aria-label="Dashboard"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              <span className={styles.navLabel}>Dashboard</span>
            </button>
            
            <button
              className={`${styles.navButton} ${currentView === 'booking' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('booking')}
              aria-label="Bookings"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <span className={styles.navLabel}>Booking</span>
            </button>
            
            <button
              className={`${styles.navButton} ${currentView === 'profile' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('profile')}
              aria-label="Profile"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className={styles.navLabel}>Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}