import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './StatusUpdates.module.css';

interface StatusUpdate {
  id: string;
  timestamp: Date;
  status: 'assignment_accepted' | 'en_route' | 'arrived' | 'protection_active' | 'protection_completed' | 'emergency_alert';
  title: string;
  message: string;
  icon: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignmentId?: string;
  cpoId?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface StatusUpdatesProps {
  assignmentId?: string;
  className?: string;
  maxUpdates?: number;
}

export function StatusUpdates({ assignmentId, className = '', maxUpdates = 10 }: StatusUpdatesProps) {
  const { state } = useApp();
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock real-time status updates
  useEffect(() => {
    const generateMockUpdates = (): StatusUpdate[] => {
      const now = new Date();
      const mockUpdates: StatusUpdate[] = [
        {
          id: 'update-1',
          timestamp: new Date(now.getTime() - 30000), // 30 seconds ago
          status: 'assignment_accepted',
          title: 'Protection Assignment Accepted',
          message: 'Your Close Protection Officer has accepted the assignment and is preparing for deployment.',
          icon: '✅',
          priority: 'medium',
          assignmentId,
          cpoId: 'cpo-001',
        },
        {
          id: 'update-2',
          timestamp: new Date(now.getTime() - 120000), // 2 minutes ago
          status: 'en_route',
          title: 'CPO En Route',
          message: 'Marcus Thompson is now en route to your location. Estimated arrival: 18 minutes.',
          icon: '🚗',
          priority: 'medium',
          assignmentId,
          cpoId: 'cpo-001',
          location: {
            lat: 51.5074,
            lng: -0.1278,
            address: 'Central London'
          }
        },
        {
          id: 'update-3',
          timestamp: new Date(now.getTime() - 300000), // 5 minutes ago
          status: 'arrived',
          title: 'CPO Arrived',
          message: 'Your Close Protection Officer has arrived at the designated location and is establishing security perimeter.',
          icon: '📍',
          priority: 'high',
          assignmentId,
          cpoId: 'cpo-001',
        },
        {
          id: 'update-4',
          timestamp: new Date(now.getTime() - 600000), // 10 minutes ago
          status: 'protection_active',
          title: 'Protection Detail Active',
          message: 'Close protection services are now active. Your CPO is monitoring the situation and maintaining security protocols.',
          icon: '🛡️',
          priority: 'high',
          assignmentId,
          cpoId: 'cpo-001',
        }
      ];

      // Add emergency alert if panic button was pressed
      if (state.assignmentState.panicAlertSent) {
        mockUpdates.unshift({
          id: 'update-emergency',
          timestamp: state.assignmentState.panicAlertTimestamp || new Date(),
          status: 'emergency_alert',
          title: 'Emergency Alert Activated',
          message: 'Panic alert received. Emergency protocols activated. CPO and response team notified immediately.',
          icon: '🚨',
          priority: 'critical',
          assignmentId,
          cpoId: 'cpo-001',
        });
      }

      return mockUpdates.slice(0, maxUpdates);
    };

    // Simulate loading delay
    const loadingTimeout = setTimeout(() => {
      setUpdates(generateMockUpdates());
      setIsLoading(false);
    }, 1000);

    // Simulate periodic updates every 30 seconds
    const updateInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new update
        const newUpdate: StatusUpdate = {
          id: `update-${Date.now()}`,
          timestamp: new Date(),
          status: 'protection_active',
          title: 'Status Update',
          message: 'Protection detail continues. All security protocols maintained. No threats detected.',
          icon: '🔍',
          priority: 'low',
          assignmentId,
          cpoId: 'cpo-001',
        };

        setUpdates(prev => [newUpdate, ...prev].slice(0, maxUpdates));
      }
    }, 30000);

    return () => {
      clearTimeout(loadingTimeout);
      clearInterval(updateInterval);
    };
  }, [assignmentId, maxUpdates, state.assignmentState.panicAlertSent, state.assignmentState.panicAlertTimestamp]);

  const getPriorityColor = (priority: StatusUpdate['priority']) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getStatusLabel = (status: StatusUpdate['status']) => {
    switch (status) {
      case 'assignment_accepted':
        return 'Assignment Accepted';
      case 'en_route':
        return 'En Route';
      case 'arrived':
        return 'Arrived';
      case 'protection_active':
        return 'Protection Active';
      case 'protection_completed':
        return 'Completed';
      case 'emergency_alert':
        return 'Emergency Alert';
      default:
        return 'Status Update';
    }
  };

  if (isLoading) {
    return (
      <div className={`${styles.statusUpdates} ${className}`}>
        <div className={styles.header}>
          <h3>Status Updates</h3>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading status updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.statusUpdates} ${className}`}>
      <div className={styles.header}>
        <h3>Real-Time Status Updates</h3>
        <div className={styles.liveIndicator}>
          <div className={styles.liveDot}></div>
          <span>Live</span>
        </div>
      </div>

      <div className={styles.updatesList}>
        {updates.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <p>No status updates available</p>
          </div>
        ) : (
          updates.map((update, index) => (
            <div
              key={update.id}
              className={`${styles.updateItem} ${styles[`priority-${update.priority}`]}`}
              style={{
                borderLeftColor: getPriorityColor(update.priority),
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className={styles.updateIcon}>
                {update.icon}
              </div>

              <div className={styles.updateContent}>
                <div className={styles.updateHeader}>
                  <h4 className={styles.updateTitle}>{update.title}</h4>
                  <div className={styles.updateMeta}>
                    <span
                      className={styles.statusLabel}
                      style={{ backgroundColor: getPriorityColor(update.priority) }}
                    >
                      {getStatusLabel(update.status)}
                    </span>
                    <span className={styles.timestamp}>
                      {formatTimestamp(update.timestamp)}
                    </span>
                  </div>
                </div>

                <p className={styles.updateMessage}>{update.message}</p>

                {update.location && (
                  <div className={styles.locationInfo}>
                    <span className={styles.locationIcon}>📍</span>
                    <span className={styles.locationText}>
                      {update.location.address}
                    </span>
                  </div>
                )}

                {update.cpoId && (
                  <div className={styles.cpoInfo}>
                    <span className={styles.cpoLabel}>CPO:</span>
                    <span className={styles.cpoName}>Marcus Thompson</span>
                  </div>
                )}
              </div>

              {update.priority === 'critical' && (
                <div className={styles.criticalIndicator}>
                  <span>URGENT</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {updates.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Last updated: {formatTimestamp(updates[0]?.timestamp)}
          </p>
          <button className={styles.refreshButton} onClick={() => window.location.reload()}>
            🔄 Refresh
          </button>
        </div>
      )}
    </div>
  );
}