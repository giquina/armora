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
      case 'dashboard': return 'Book Your Ride';
      case 'booking': return 'Booking Details';
      case 'profile': return 'Your Profile';
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