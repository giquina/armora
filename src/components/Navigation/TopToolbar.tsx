import { FC, useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import { BrandText } from '../UI/BrandText';
import { HamburgerMenu } from './HamburgerMenu';
import styles from './TopToolbar.module.css';

interface TopToolbarProps {
  onToggleNotifications?: () => void;
  isNotificationsOpen?: boolean;
}

export const TopToolbar: FC<TopToolbarProps> = ({ onToggleNotifications, isNotificationsOpen }) => {
  const { navigateToView, state } = useApp();
  const unreadCount = useMemo(() => (state.notifications || []).filter((n: any) => !n.isRead).length, [state.notifications]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use exact splash/welcome brand style via BrandText

  const openProtectionRequest = () => {
    // Navigate to SIA-compliant protection request flow
    navigateToView('protection-request');
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
          onClick={openProtectionRequest}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2" />
            <path d="M16 5h1.5a1.5 1.5 0 0 1 0 3H16" />
          </svg>
          <span className={styles.iconLabel}>Request Protection</span>
        </button>
        <button
          className={styles.iconBtn}
          aria-label="Notifications"
          title="View Notifications"
          onClick={() => onToggleNotifications && onToggleNotifications()}
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
