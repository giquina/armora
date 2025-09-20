import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './DevNavigationPanel.module.css';

interface DevNavigationPanelProps {
  className?: string;
}

export function DevNavigationPanel({ className }: DevNavigationPanelProps) {
  const { navigateToView } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Available views for quick navigation
  const navigationOptions = [
    { id: 'welcome', label: 'Welcome', icon: '🏠' },
    { id: 'login', label: 'Login', icon: '🔐' },
    { id: 'signup', label: 'Signup', icon: '📝' },
    { id: 'guest-disclaimer', label: 'Guest', icon: '👤' },
    { id: 'questionnaire', label: 'Questionnaire', icon: '❓' },
    { id: 'achievement', label: 'Achievement', icon: '🏆' },
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'services', label: 'Services', icon: '🛡️' },
    { id: 'booking', label: 'Booking', icon: '📅' },
    { id: 'assignments', label: 'Assignments', icon: '📋' },
    { id: 'account', label: 'Account', icon: '👥' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  const handleNavigation = (viewId: string) => {
    console.log(`🚀 [DEV] Navigating to: ${viewId}`);
    navigateToView(viewId as any);
  };

  return (
    <div className={`${styles.devPanel} ${isCollapsed ? styles.collapsed : ''} ${className || ''}`}>
      <div className={styles.header}>
        <button
          className={styles.toggleButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand dev panel' : 'Collapse dev panel'}
        >
          {isCollapsed ? '🚀' : '⬇️'}
        </button>
        {!isCollapsed && (
          <span className={styles.title}>DEV NAVIGATION</span>
        )}
      </div>

      {!isCollapsed && (
        <div className={styles.navigationGrid}>
          {navigationOptions.map((option) => (
            <button
              key={option.id}
              className={styles.navButton}
              onClick={() => handleNavigation(option.id)}
              title={`Navigate to ${option.label}`}
            >
              <span className={styles.navIcon}>{option.icon}</span>
              <span className={styles.navLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}