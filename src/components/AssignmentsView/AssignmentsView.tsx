import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ProtectionControlPanel } from './ProtectionControlPanel';
import styles from './AssignmentsView.module.css';

type AssignmentStatus = 'current' | 'upcoming' | 'completed' | 'analytics';
type ProtectionTier = 'Essential' | 'Executive' | 'Shadow';

interface Assignment {
  id: string;
  date: string;
  time: string;
  duration: string;
  officerName: string;
  officerSIA: string;
  serviceTier: ProtectionTier;
  totalCost: number;
  status: AssignmentStatus;
  location: {
    start: string;
    end: string;
  };
  rating?: number;
  vehicleType: string;
}

// Mock assignment data for the new management interface
const mockAssignments: Assignment[] = [
  {
    id: 'ASG-001',
    date: '2024-03-15',
    time: '14:30',
    duration: '4 hours',
    officerName: 'John Davis',
    officerSIA: 'SIA-1234-5678',
    serviceTier: 'Executive',
    totalCost: 380,
    status: 'current',
    location: {
      start: 'Kensington, London',
      end: 'Canary Wharf, London'
    },
    rating: 5,
    vehicleType: 'BMW 5 Series'
  },
  {
    id: 'ASG-002',
    date: '2024-03-16',
    time: '09:00',
    duration: '6 hours',
    officerName: 'Sarah Mitchell',
    officerSIA: 'SIA-2345-6789',
    serviceTier: 'Shadow',
    totalCost: 750,
    status: 'upcoming',
    location: {
      start: 'Mayfair, London',
      end: 'Heathrow Airport'
    },
    vehicleType: 'Range Rover Sport'
  },
  {
    id: 'ASG-003',
    date: '2024-03-14',
    time: '16:00',
    duration: '3 hours',
    officerName: 'Michael Thompson',
    officerSIA: 'SIA-3456-7890',
    serviceTier: 'Essential',
    totalCost: 195,
    status: 'completed',
    location: {
      start: 'Westminster, London',
      end: 'City of London'
    },
    rating: 4,
    vehicleType: 'Mercedes E-Class'
  }
];

export function AssignmentsView() {
  const { navigateToView } = useApp();
  const [activeTab, setActiveTab] = useState<AssignmentStatus>('current');
  const assignments = mockAssignments;

  // Memoize filtered assignments
  const currentAssignments = useMemo(() => assignments.filter(a => a.status === 'current'), [assignments]);
  const upcomingAssignments = useMemo(() => assignments.filter(a => a.status === 'upcoming'), [assignments]);
  const completedAssignments = useMemo(() => assignments.filter(a => a.status === 'completed'), [assignments]);

  const getServiceTierBadge = useCallback((tier: ProtectionTier) => {
    switch (tier) {
      case 'Essential': return { color: '#00D4FF', bg: 'rgba(0, 212, 255, 0.1)' };
      case 'Executive': return { color: '#FFD700', bg: 'rgba(255, 215, 0, 0.1)' };
      case 'Shadow': return { color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.1)' };
      default: return { color: '#A0A0A0', bg: 'rgba(160, 160, 160, 0.1)' };
    }
  }, []);


  const renderAssignmentCard = useCallback((assignment: Assignment) => {
    const tierBadge = getServiceTierBadge(assignment.serviceTier);

    return (
      <div key={assignment.id} className={styles.assignmentCard}>
        <div className={styles.assignmentHeader}>
          <div className={styles.assignmentDate}>{assignment.date}</div>
          <div
            className={styles.assignmentStatus}
            style={{ backgroundColor: tierBadge.bg, color: tierBadge.color }}
          >
            {assignment.serviceTier}
          </div>
        </div>

        <div className={styles.assignmentDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Time</span>
            <span className={styles.detailValue}>{assignment.time}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Duration</span>
            <span className={styles.detailValue}>{assignment.duration}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Officer</span>
            <span className={styles.detailValue}>{assignment.officerName}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Vehicle</span>
            <span className={styles.detailValue}>{assignment.vehicleType}</span>
          </div>
        </div>

        <div className={styles.locationInfo}>
          <div className={styles.locationItem}>
            <span className={styles.locationIcon}>📍</span>
            <div className={styles.locationDetails}>
              <span className={styles.locationLabel}>From</span>
              <span className={styles.locationValue}>{assignment.location.start}</span>
            </div>
          </div>
          <div className={styles.locationItem}>
            <span className={styles.locationIcon}>🎯</span>
            <div className={styles.locationDetails}>
              <span className={styles.locationLabel}>To</span>
              <span className={styles.locationValue}>{assignment.location.end}</span>
            </div>
          </div>
        </div>

        <div className={styles.assignmentFooter}>
          <div className={styles.totalCost}>£{assignment.totalCost}</div>
          {assignment.rating && (
            <div className={styles.rating}>
              {'★'.repeat(assignment.rating)}
            </div>
          )}
        </div>

        {assignment.status === 'current' && (
          <div className={styles.assignmentActions}>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>📞</span>
              <span className={styles.actionText}>Call Officer</span>
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>📍</span>
              <span className={styles.actionText}>Live Track</span>
            </button>
          </div>
        )}
      </div>
    );
  }, [getServiceTierBadge]);

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>🛡️</div>
      <h3 className={styles.emptyTitle}>No Assignments Found</h3>
      <p className={styles.emptyDescription}>Your protection assignments will appear here</p>
      <button
        className={styles.emptyAction}
        onClick={() => navigateToView('booking')}
      >
        ➕ Book Protection
      </button>
    </div>
  );

  const renderAnalytics = () => (
    <div className={styles.analyticsContent}>
      <div className={styles.analyticsCard}>
        <h3 className={styles.analyticsTitle}>Protection Analytics</h3>
        <p className={styles.analyticsDescription}>
          Detailed analytics and insights coming soon. View your protection usage patterns,
          officer ratings, and spending analytics.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'analytics') {
      return renderAnalytics();
    }

    let assignmentsToShow: Assignment[] = [];

    switch (activeTab) {
      case 'current':
        assignmentsToShow = currentAssignments;
        break;
      case 'upcoming':
        assignmentsToShow = upcomingAssignments;
        break;
      case 'completed':
        assignmentsToShow = completedAssignments;
        break;
    }

    if (assignmentsToShow.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className={styles.assignmentsList}>
        {assignmentsToShow.map(assignment => renderAssignmentCard(assignment))}
      </div>
    );
  };

  return (
    <div className={styles.assignmentsContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>ASSIGNMENT MANAGEMENT</h1>
        <p className={styles.subtitle}>Protection History & Scheduling</p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tab} ${activeTab === 'current' ? styles.active : ''}`}
          onClick={() => setActiveTab('current')}
        >
          <span className={styles.tabIcon}>📋</span>
          <span className={styles.tabLabel}>Current</span>
          <span className={styles.tabCount}>({currentAssignments.length})</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.active : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <span className={styles.tabIcon}>📅</span>
          <span className={styles.tabLabel}>Upcoming</span>
          <span className={styles.tabCount}>({upcomingAssignments.length})</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <span className={styles.tabIcon}>✅</span>
          <span className={styles.tabLabel}>Completed</span>
          <span className={styles.tabCount}>({completedAssignments.length})</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span className={styles.tabIcon}>📊</span>
          <span className={styles.tabLabel}>Analytics</span>
        </button>
      </div>

      {/* Quick Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🛡️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>127</div>
            <div className={styles.statLabel}>Total Hours Protected</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💷</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>£8,450</div>
            <div className={styles.statLabel}>Total Invested</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>4.9</div>
            <div className={styles.statLabel}>Average Rating Given</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>Gold</div>
            <div className={styles.statLabel}>Member Status</div>
          </div>
        </div>
      </div>

      {/* Assignment List */}
      <div className={styles.assignmentsList}>
        {renderTabContent()}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button className={styles.actionButton} onClick={() => navigateToView('booking')}>
          <span className={styles.actionIcon}>➕</span>
          <span className={styles.actionText}>Book Protection</span>
        </button>
        <button className={styles.actionButton}>
          <span className={styles.actionIcon}>📥</span>
          <span className={styles.actionText}>Download Reports</span>
        </button>
      </div>
    </div>
  );
}