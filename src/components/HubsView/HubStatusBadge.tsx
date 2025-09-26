import React from 'react';
import styles from './hub-status-badge.module.css';

interface HubStatusBadgeProps {
  status: 'available' | 'busy' | 'offline';
  size?: 'small' | 'medium';
}

export function HubStatusBadge({ status, size = 'medium' }: HubStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          icon: '🟢',
          text: 'Available',
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.2)'
        };
      case 'busy':
        return {
          icon: '🟡',
          text: 'Busy',
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.2)'
        };
      case 'offline':
        return {
          icon: '🔴',
          text: 'Offline',
          color: '#EF4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.2)'
        };
      default:
        return {
          icon: '⚪',
          text: 'Unknown',
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.1)',
          borderColor: 'rgba(107, 114, 128, 0.2)'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`${styles.statusBadge} ${styles[size]}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor
      }}
      aria-label={`Hub status: ${config.text}`}
    >
      <span className={styles.statusIcon}>{config.icon}</span>
      <span className={styles.statusText}>{config.text}</span>
    </div>
  );
}