import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getDisplayName } from '../../utils/nameUtils';
import { AssignmentHistoryManager } from '../../utils/assignmentHistory';
import { RecentAssignments } from './RecentAssignments';
import { FavoriteRoutes } from './FavoriteRoutes';
import { PersonalizedQuickActions } from './PersonalizedQuickActions';
import styles from './Assignments.module.css';

export function Assignments() {
  const { state, navigateToView } = useApp();
  const { user } = state;
  const [assignmentHistory, setAssignmentHistory] = useState(() =>
    AssignmentHistoryManager.getAssignmentHistory()
  );
  const [hasActiveRides] = useState(false); // Active Assignments data placeholder
  const [hasVenueBookings] = useState(false); // Venue bookings data placeholder
  const [activeTab, setActiveTab] = useState<'transport' | 'venues'>('transport');

  const handleBookNewService = () => {
    navigateToView('services');
  };

  const handleBookVenueSecurity = () => {
    navigateToView('venue-protection-welcome');
  };

  // Refresh data when component mounts or becomes visible
  useEffect(() => {
    const refreshData = () => {
      setAssignmentHistory(AssignmentHistoryManager.getAssignmentHistory());
    };

    refreshData();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('armora_')) {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={styles.ridesContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Your Bookings{user ? `, ${getDisplayName(user)}` : ''}
        </h1>
        <p className={styles.subtitle}>
          {assignmentHistory.length > 0
            ? `${assignmentHistory.length} assignment${assignmentHistory.length !== 1 ? 's' : ''} completed • Transport & Security Services`
            : 'Track active bookings and view your service history'
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeTab === 'transport' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('transport')}
        >
          🚗 Transport
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'venues' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('venues')}
        >
          🛡️ Venues
        </button>
      </div>

      {/* Transport Tab Content */}
      {activeTab === 'transport' && (
        <>
          {/* Personalized Quick Actions */}
          <div className={styles.section}>
            <PersonalizedQuickActions maxActions={3} />
          </div>

          {/* Active Assignments Section */}
          {hasActiveRides ? (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🚗 Active Transport</h2>
              {/* Active Assignments component placeholder */}
            </div>
          ) : (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🚗 Active Transport</h2>
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>🎯</div>
                <h3 className={styles.placeholderTitle}>No Active Transport</h3>
                <p className={styles.placeholderText}>
                  You don't have any active transport bookings at the moment.
                </p>
                <button
                  className={styles.bookButton}
                  onClick={handleBookNewService}
                >
                  🚗 Book Transport
                </button>
              </div>
            </div>
          )}

          {/* Recent Services Section */}
          <div className={styles.section}>
            <RecentAssignments maxItems={5} />
          </div>

          {/* Favorite Routes Section */}
          <div className={styles.section}>
            <FavoriteRoutes maxItems={3} />
          </div>
        </>
      )}

      {/* Venues Tab Content */}
      {activeTab === 'venues' && (
        <>
          {/* Active Venue Security Section */}
          {hasVenueBookings ? (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🛡️ Active Venue Security</h2>
              {/* Active venue bookings component placeholder */}
            </div>
          ) : (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🛡️ Active Venue Security</h2>
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>🛡️</div>
                <h3 className={styles.placeholderTitle}>No Active Venue Security</h3>
                <p className={styles.placeholderText}>
                  You don't have any active venue security bookings at the moment.
                </p>
                <button
                  className={styles.bookButton}
                  onClick={handleBookVenueSecurity}
                >
                  🛡️ Book Venue Security
                </button>
              </div>
            </div>
          )}

          {/* Recent Venue Bookings Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📋 Recent Venue Bookings</h2>
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📋</div>
              <h3 className={styles.placeholderTitle}>No Previous Bookings</h3>
              <p className={styles.placeholderText}>
                Your venue security protection assignment history will appear here.
              </p>
            </div>
          </div>

          {/* Venue Security Information */}
          <div className={styles.section}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Venue Security Services</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>👮‍♂️</div>
                  <div className={styles.infoText}>
                    <strong>SIA Licensed Officers</strong>
                    <span>Level 3 certified professionals</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>🎖️</div>
                  <div className={styles.infoText}>
                    <strong>Military Background</strong>
                    <span>Ex-forces & police personnel</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>🏢</div>
                  <div className={styles.infoText}>
                    <strong>Event Coverage</strong>
                    <span>Weddings, corporate, private</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>💰</div>
                  <div className={styles.infoText}>
                    <strong>From £500/day</strong>
                    <span>Competitive rates, premium service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Smart Recommendations */}
      {assignmentHistory.length >= 2 && (
        <div className={styles.section}>
          <div className={styles.smartRecommendations}>
            <h2 className={styles.sectionTitle}>🤖 Smart Recommendations</h2>
            <div className={styles.recommendationCard}>
              <div className={styles.recommendationIcon}>💡</div>
              <div className={styles.recommendationContent}>
                <h3 className={styles.recommendationTitle}>Travel Pattern Detected</h3>
                <p className={styles.recommendationText}>
                  You frequently request protection Assignments on {getCurrentDayName()}. Would you like to set up a recurring protection assignment?
                </p>
                <button className={styles.recommendationButton}>
                  Set Up Recurring Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Actions */}
      <div className={styles.additionalActions}>
        <button
          className={styles.actionButton}
          onClick={handleBookNewService}
        >
          🚀 New Assignment
        </button>
        <button
          className={styles.actionButtonSecondary}
          onClick={() => navigateToView('account')}
        >
          ⚙️ Account Settings
        </button>
        {assignmentHistory.length > 0 && (
          <button
            className={styles.actionButtonSecondary}
            onClick={() => {
              const data = AssignmentHistoryManager.exportProtectionAssignmentData();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `armora-protection assignment-history-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            📊 Export Data
          </button>
        )}
      </div>
    </div>
  );
}

function getCurrentDayName(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}