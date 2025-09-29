import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './DevNavigationPanel.module.css';

interface DevNavigationPanelProps {
  className?: string;
}

export function DevNavigationPanel({ className }: DevNavigationPanelProps) {
  const { navigateToView, setUser, updateQuestionnaireData } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Available views for quick navigation - comprehensive list
  const navigationOptions = [
    { id: 'splash', label: 'Splash', icon: '💫' },
    { id: 'welcome', label: 'Welcome', icon: '🏠' },
    { id: 'login', label: 'Login', icon: '🔐' },
    { id: 'signup', label: 'Signup', icon: '📝' },
    { id: 'guest-disclaimer', label: 'Guest', icon: '👤' },
    { id: 'questionnaire', label: 'Questionnaire', icon: '❓' },
    { id: 'achievement', label: 'Achievement', icon: '🏆' },
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'hub', label: 'Hub', icon: '🎯' },
    { id: 'services', label: 'Services', icon: '🛡️' },
    { id: 'protection-assignment', label: 'Protection Assignment', icon: '🚗' },
    { id: 'assignments', label: 'Protection Details', icon: '📋' },
    { id: 'account', label: 'Account', icon: '👥' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  const setupMockAuth = () => {

    // Set up mock user with comprehensive data
    const mockUser = {
      id: 'dev-user-123',
      name: 'Test User',
      email: 'test@armora.dev',
      isAuthenticated: true,
      userType: 'registered' as const,
      hasCompletedQuestionnaire: true,
      hasUnlockedReward: true,
      subscriptionTier: 'premium' as const,
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
        notifications: ['protection assignment-updates', 'Protection Officer-arrival']
      },
      step9_profileReview: true,
      completedAt: new Date(),
      recommendedService: 'executive',
      conversionAttempts: 0
    };
    updateQuestionnaireData(mockQuestionnaireData);
  };

  const handleNavigation = (viewId: string) => {

    // Views that require authentication - set up mock data first
    const authRequiredViews = ['home', 'hub', 'assignments', 'account', 'profile', 'protection-assignment'];

    if (authRequiredViews.includes(viewId)) {
      setupMockAuth();
    }

    // Special handling for specific views
    if (viewId === 'questionnaire') {
      // Clear user to start fresh questionnaire
      setUser(null);
      updateQuestionnaireData({});
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