import React from 'react';
import { useApp } from '../../../contexts/AppContext';
import styles from './QuickActions.module.css';

interface QuickAction {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  badge?: string;
  onClick: () => void;
}

export function QuickActions() {
  const { navigateToView } = useApp();

  const handleAirportTransfer = () => {
    localStorage.setItem('armora_selected_service', 'executive');
    localStorage.setItem('armora_quick_destination', 'London Heathrow Airport (LHR)');
    localStorage.setItem('armora_assignment_preset', 'airport');
    navigateToView('protection-request');
  };

  const handleDailyCommute = () => {
    localStorage.setItem('armora_selected_service', 'standard');
    localStorage.setItem('armora_assignment_preset', 'commute');
    navigateToView('protection-request');
  };

  const handleEveningPickup = () => {
    localStorage.setItem('armora_selected_service', 'shadow');
    localStorage.setItem('armora_assignment_preset', 'evening');
    navigateToView('protection-request');
  };

  const handleEventSecurity = () => {
    navigateToView('venue-protection-welcome');
  };

  const quickActions: QuickAction[] = [
    {
      id: 'airport',
      icon: '✈️',
      title: 'Airport Transfer',
      subtitle: 'Executive service to terminals',
      badge: 'Most Popular',
      onClick: handleAirportTransfer
    },
    {
      id: 'commute',
      icon: '🏢',
      title: 'Daily Commute',
      subtitle: 'Regular route protection',
      badge: 'Save 20%',
      onClick: handleDailyCommute
    },
    {
      id: 'evening',
      icon: '🌙',
      title: 'Evening Commencement Point',
      subtitle: 'Discrete late-night security',
      badge: 'Late Night',
      onClick: handleEveningPickup
    },
    {
      id: 'event',
      icon: '🛡️',
      title: 'Event Security',
      subtitle: 'Venue protection services',
      badge: 'New',
      onClick: handleEventSecurity
    }
  ];

  return (
    <div className={styles.quickActionsContainer}>
      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.actionsGrid}>
        {quickActions.map((action) => (
          <button
            key={action.id}
            className={styles.actionCard}
            onClick={action.onClick}
          >
            {action.badge && (
              <div className={`${styles.badge} ${styles[action.badge.toLowerCase().replace(' ', '')]}`}>
                {action.badge}
              </div>
            )}

            <div className={styles.actionIcon}>
              {action.icon}
            </div>

            <div className={styles.actionContent}>
              <h3 className={styles.actionTitle}>{action.title}</h3>
              <p className={styles.actionSubtitle}>{action.subtitle}</p>
            </div>

            <div className={styles.actionArrow}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}