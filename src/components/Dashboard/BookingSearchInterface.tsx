import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './BookingSearchInterface.module.css';

interface BookingSearchInterfaceProps {
  onDestinationSelect?: (secureDestination: string) => void;
}

export function BookingSearchInterface({
  onDestinationSelect
}: BookingSearchInterfaceProps) {
  const { navigateToView } = useApp();
  const [savedAddresses, setSavedAddresses] = useState({
    home: '',
    work: ''
  });
  const [recentDestination, setRecentDestination] = useState('');

  useEffect(() => {
    // Load saved addresses from localStorage
    const homeAddress = localStorage.getItem('armora_home_address') || '';
    const workAddress = localStorage.getItem('armora_work_address') || '';
    const recent = localStorage.getItem('armora_recent_destination') || '';

    setSavedAddresses({ home: homeAddress, work: workAddress });
    setRecentDestination(recent);
  }, []);

  // Handle navigation to protection assignment from toolbar
  useEffect(() => {
    const maybeOpenFromFlag = () => {
      if (localStorage.getItem('armora_open_location_picker') === 'true') {
        localStorage.removeItem('armora_open_location_picker');
        navigateToView('protection-request');
      }
    };
    maybeOpenFromFlag();
    const handler = () => navigateToView('protection-request');
    window.addEventListener('armora:open-location-picker' as any, handler);
    return () => window.removeEventListener('armora:open-location-picker' as any, handler);
  }, [navigateToView]);

  const handleSearchClick = () => {
    // Navigate to protection assignment flow instead of opening modal
    navigateToView('protection-request');
  };

  const handleQuickDestination = (type: 'home' | 'work' | 'recent', address?: string) => {
    if (address) {
      // Set the quick secureDestination and navigate to protection assignment
      localStorage.setItem('armora_quick_destination', address);
      localStorage.setItem('armora_assignment_preset', type);
      if (onDestinationSelect) {
        onDestinationSelect(address);
      }
      navigateToView('protection-request');
    } else {
      // Navigate to address setup or protection assignment
      navigateToView('protection-request');
    }
  };


  return (
    <div className={styles.searchContainer}>
      {/* Main Search Bar */}
      <div className={styles.searchBar} onClick={handleSearchClick}>
        <div className={styles.searchIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <div className={styles.searchText}>
          <span className={styles.searchPlaceholder}>Where do you require protection?</span>
        </div>
        <div className={styles.searchArrow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </div>

      {/* Quick Destinations */}
      <div className={styles.quickDestinations}>
        {/* Home Address */}
        <button
          className={styles.quickDestinationItem}
          onClick={() => handleQuickDestination('home', savedAddresses.home)}
        >
          <div className={styles.destinationIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <div className={styles.destinationInfo}>
            <span className={styles.destinationLabel}>Residence</span>
            <span className={styles.destinationAddress}>
              {savedAddresses.home || 'Add home address'}
            </span>
          </div>
        </button>

        {/* Work Address */}
        <button
          className={styles.quickDestinationItem}
          onClick={() => handleQuickDestination('work', savedAddresses.work)}
        >
          <div className={styles.destinationIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div className={styles.destinationInfo}>
            <span className={styles.destinationLabel}>Executive Office</span>
            <span className={styles.destinationAddress}>
              {savedAddresses.work || 'Add work address'}
            </span>
          </div>
        </button>

        {/* Recent Destination */}
        {recentDestination && (
          <button
            className={styles.quickDestinationItem}
            onClick={() => handleQuickDestination('recent', recentDestination)}
          >
            <div className={styles.destinationIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <div className={styles.destinationInfo}>
              <span className={styles.destinationLabel}>Recent</span>
              <span className={styles.destinationAddress}>
                {recentDestination.length > 30
                  ? `${recentDestination.substring(0, 30)}...`
                  : recentDestination}
              </span>
            </div>
          </button>
        )}
      </div>


      {/* Location picker removed - now navigates directly to protection assignment flow */}
    </div>
  );
}