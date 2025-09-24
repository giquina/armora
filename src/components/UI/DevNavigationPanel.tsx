import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './DevNavigationPanel.module.css';

interface DevNavigationPanelProps {
  className?: string;
}

export function DevNavigationPanel({ className }: DevNavigationPanelProps) {
  const { navigateToView, setUser, updateQuestionnaireData } = useApp();
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

    // Special handling for dashboard - set up mock user data
    if (viewId === 'home') {
      console.log('🚀 [DEV] Setting up mock data for dashboard access');

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
        step6_safetyContact: {
          name: 'Safety Contact',
          phone: '+44 7700 900000',
          relationship: 'spouse'
        },
        step7_specialRequirements: ['wheelchair-accessible'],
        step8_contactPreferences: {
          email: 'test@armora.dev',
          phone: '+44 7700 900000',
          notifications: ['booking-updates', 'Protection Officer-arrival']
        },
        step9_profileReview: true,
        completedAt: new Date(),
        recommendedService: 'executive',
        conversionAttempts: 0
      };
      updateQuestionnaireData(mockQuestionnaireData);
    }

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