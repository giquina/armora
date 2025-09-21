import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { NavigationCards } from './NavigationCards/NavigationCards';
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
  const [activeSection, setActiveSection] = useState<AssignmentStatus>('current');
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

  const renderEmptyState = (type: AssignmentStatus) => {
    const emptyStates = {
      current: {
        icon: '🛡️',
        title: 'No Active Protection',
        description: 'Request protection now for immediate service',
        buttonText: 'Book Protection'
      },
      upcoming: {
        icon: '📅',
        title: 'No Upcoming Assignments',
        description: 'Schedule your next protection service',
        buttonText: 'Book Protection'
      },
      completed: {
        icon: '✅',
        title: 'No Completed Assignments',
        description: 'Your completed assignments will appear here',
        buttonText: 'Book Protection'
      },
      analytics: {
        icon: '📊',
        title: 'No Data Available',
        description: 'Analytics will be available after your first assignment',
        buttonText: 'View Sample Report'
      }
    };

    const state = emptyStates[type];

    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>{state.icon}</div>
        <h3 className={styles.emptyTitle}>{state.title}</h3>
        <p className={styles.emptyDescription}>{state.description}</p>
        <button
          className={styles.emptyAction}
          onClick={() => {
            if (type === 'analytics') {
              // Could show analytics demo
              console.log('Show analytics demo');
            } else {
              navigateToView('booking');
            }
          }}
        >
          {type === 'analytics' ? '📊' : '➕'} {state.buttonText}
        </button>
      </div>
    );
  };

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

  const renderSectionContent = () => {
    if (activeSection === 'analytics') {
      return renderAnalytics();
    }

    let assignmentsToShow: Assignment[] = [];

    switch (activeSection) {
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
      return renderEmptyState(activeSection);
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

      {/* Enhanced Navigation Cards */}
      <NavigationCards
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        assignmentCounts={{
          current: currentAssignments.length,
          upcoming: upcomingAssignments.length,
          completed: completedAssignments.length
        }}
      />

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
        {renderSectionContent()}
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