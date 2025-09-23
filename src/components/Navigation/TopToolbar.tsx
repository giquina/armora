import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ArmoraLogo } from '../UI/ArmoraLogo';
import { BrandText } from '../UI/BrandText';
import styles from './TopToolbar.module.css';

interface TopToolbarProps {
  onOpenNotifications?: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ onOpenNotifications }) => {
  const { state, navigateToView } = useApp();
  const { currentView } = state;
  const unreadCount = useMemo(() => (state.notifications || []).filter(n => !n.isRead).length, [state.notifications]);

  // Use exact splash/welcome brand style via BrandText

  const openBooking = () => {
    try {
      // Signal the home page to open the LocationPicker overlay (legacy/old booking entry)
      localStorage.setItem('armora_open_location_picker', 'true');
    } catch {}
    // Navigate to home where the BookingSearchInterface listens for this flag/event
    navigateToView('home');
    // Also emit a lightweight event in case we're already on home
    try {
      window.dispatchEvent(new Event('armora:open-location-picker'));
    } catch {}
  };

  return (
    <nav className={styles.topbar} aria-label="Top">
      <div className={styles.brand}>
        <ArmoraLogo size="small" variant="compact" showOrbits={false} interactive={false} />
        <div>
          <BrandText size="small" animated={false} />
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Schedule or Book" title="Schedule or Book" onClick={openBooking}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="16" rx="2"/>
            <path d="M16 3v4M8 3v4"/>
            <path d="M3 11h18"/>
            <path d="M12 15v4M10 17h4"/>
          </svg>
          <span className={styles.iconLabel}>Book</span>
        </button>
        <button className={styles.iconBtn} aria-label="Notifications" onClick={() => onOpenNotifications && onOpenNotifications()}>
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
      </div>
    </nav>
  );
};
