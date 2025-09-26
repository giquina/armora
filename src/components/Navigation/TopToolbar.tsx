import React, { useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import { BrandText } from '../UI/BrandText';
import { HamburgerMenu } from './HamburgerMenu';
import styles from './TopToolbar.module.css';

interface TopToolbarProps {
  onOpenNotifications?: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ onOpenNotifications }) => {
  const { startAssignment, navigateToView, state } = useApp();
  const unreadCount = useMemo(() => (state.notifications || []).filter((n: any) => !n.isRead).length, [state.notifications]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use exact splash/welcome brand style via BrandText

  const openBooking = () => {
    // Start assignment with no preselected service - show all steps
    startAssignment({
      source: 'toolbar'
    });
  };

  const handleLogoClick = () => {
    navigateToView('home');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.topbar} aria-label="Top">
      <button
        className={styles.logoSection}
        onClick={handleLogoClick}
        aria-label="Armora Home"
        title="Return to Home"
      >
        <ArmoraLogo size="small" variant="compact" showOrbits={false} interactive={false} />
        <div>
          <BrandText size="small" animated={false} />
        </div>
      </button>
      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          aria-label="Request Protection"
          title="Request Protection Services"
          onClick={openBooking}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="16" rx="2"/>
            <path d="M16 3v4M8 3v4"/>
            <path d="M3 11h18"/>
            <path d="M12 15v4M10 17h4"/>
          </svg>
          <span className={styles.iconLabel}>Book</span>
        </button>
        <button
          className={styles.iconBtn}
          aria-label="Notifications"
          title="View Notifications"
          onClick={() => onOpenNotifications && onOpenNotifications()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadCount > 0 && (
            <span className={styles.badge} aria-label={`${unreadCount} unread`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button
          className={styles.iconBtn}
          aria-label="Menu"
          title="Open Menu"
          onClick={toggleMenu}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18"/>
            <path d="M3 6h18"/>
            <path d="M3 18h18"/>
          </svg>
        </button>
      </div>

      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  );
};
