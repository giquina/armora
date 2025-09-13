import React, { ReactNode } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ArmoraLogo } from '../UI/ArmoraLogo';
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

  const getHeaderTitle = () => {
    if (headerTitle) return headerTitle;
    
    switch (currentView) {
      case 'welcome': return 'Welcome to Armora';
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'guest-disclaimer': return 'Guest Access';
      case 'questionnaire': return 'Security Assessment';
      case 'dashboard': return 'Home';
      case 'booking': return 'Activity';
      case 'profile': return 'Account';
      case 'support': return 'Support';
      default: return 'Armora Security Transport';
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
      case 'support':
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

  return (
    <div className={layoutClasses}>
      {shouldShowHeader && (
        <header className={styles.header}>
          <div className={styles.headerContent}>
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
              <h1 className={styles.headerTitle}>
                {getHeaderTitle()}
              </h1>
            </div>
            
            {headerActions && (
              <div className={styles.headerActions}>
                {headerActions}
              </div>
            )}
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
              aria-label="Home"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span className={styles.navLabel}>Home</span>
            </button>
            
            <button
              className={`${styles.navButton} ${currentView === 'booking' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('booking')}
              aria-label="Activity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className={styles.navLabel}>Activity</span>
            </button>
            
            <button
              className={`${styles.navButton} ${currentView === 'support' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('support')}
              aria-label="Support"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className={styles.navLabel}>Support</span>
            </button>
            
            <button
              className={`${styles.navButton} ${currentView === 'profile' ? styles.navButtonActive : ''}`}
              onClick={() => navigateToView('profile')}
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