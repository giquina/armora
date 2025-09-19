import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './AssignmentsView.module.css';

type AssignmentStatus = 'active' | 'upcoming' | 'completed';

interface Assignment {
  id: string;
  status: AssignmentStatus;
  title: string;
  serviceLevelId: string;
  serviceLevelName: string;
  pickup: string;
  destination: string;
  scheduledTime: string;
  estimatedCost: number;
  officer: {
    name: string;
    siaLicense: string;
    rating: number;
    vehicle: string;
    initials: string;
  };
  timeAgo: string;
  progress?: {
    current: string;
    percentage: number;
  };
}

// Mock assignment data
const mockAssignments: Assignment[] = [
  {
    id: 'ASG-001',
    status: 'active',
    title: 'Executive Protection - City Meeting',
    serviceLevelId: 'executive',
    serviceLevelName: 'Executive Shield',
    pickup: 'Home',
    destination: 'Canary Wharf',
    scheduledTime: '14:30',
    estimatedCost: 125,
    officer: {
      name: 'John Davis',
      siaLicense: '1234-5678',
      rating: 5,
      vehicle: 'BMW 5 Series',
      initials: 'JD'
    },
    timeAgo: '2 hours ago',
    progress: {
      current: 'In Progress',
      percentage: 65
    }
  },
  {
    id: 'ASG-002',
    status: 'active',
    title: 'Standard Protection - Airport Transfer',
    serviceLevelId: 'standard',
    serviceLevelName: 'Standard Protection',
    pickup: 'Office',
    destination: 'Heathrow Terminal 5',
    scheduledTime: '16:00',
    estimatedCost: 85,
    officer: {
      name: 'Sarah Mitchell',
      siaLicense: '2345-6789',
      rating: 5,
      vehicle: 'Mercedes E-Class',
      initials: 'SM'
    },
    timeAgo: '1 hour ago',
    progress: {
      current: 'En Route',
      percentage: 35
    }
  },
  {
    id: 'ASG-003',
    status: 'upcoming',
    title: 'Shadow Protocol - Evening Event',
    serviceLevelId: 'shadow',
    serviceLevelName: 'Shadow Protocol',
    pickup: 'Hotel',
    destination: 'Royal Opera House',
    scheduledTime: 'Tomorrow 19:00',
    estimatedCost: 195,
    officer: {
      name: 'Marcus Thompson',
      siaLicense: '3456-7890',
      rating: 5,
      vehicle: 'BMW X5',
      initials: 'MT'
    },
    timeAgo: 'Scheduled'
  },
  {
    id: 'ASG-004',
    status: 'upcoming',
    title: 'Executive Protection - Business Meeting',
    serviceLevelId: 'executive',
    serviceLevelName: 'Executive Shield',
    pickup: 'Home',
    destination: 'City of London',
    scheduledTime: 'Friday 09:00',
    estimatedCost: 150,
    officer: {
      name: 'TBA',
      siaLicense: 'TBA',
      rating: 0,
      vehicle: 'TBA',
      initials: 'TB'
    },
    timeAgo: 'Pending Assignment'
  },
  {
    id: 'ASG-005',
    status: 'completed',
    title: 'Standard Protection - Shopping Trip',
    serviceLevelId: 'standard',
    serviceLevelName: 'Standard Protection',
    pickup: 'Home',
    destination: 'Westfield',
    scheduledTime: '10:00',
    estimatedCost: 65,
    officer: {
      name: 'David Wilson',
      siaLicense: '4567-8901',
      rating: 5,
      vehicle: 'Audi A4',
      initials: 'DW'
    },
    timeAgo: 'Yesterday'
  },
  {
    id: 'ASG-006',
    status: 'completed',
    title: 'Executive Protection - Corporate Event',
    serviceLevelId: 'executive',
    serviceLevelName: 'Executive Shield',
    pickup: 'Office',
    destination: 'Guildhall',
    scheduledTime: '18:30',
    estimatedCost: 180,
    officer: {
      name: 'Emma Clarke',
      siaLicense: '5678-9012',
      rating: 5,
      vehicle: 'BMW 7 Series',
      initials: 'EC'
    },
    timeAgo: '3 days ago'
  }
];

export function AssignmentsView() {
  const { navigateToView } = useApp();
  const [activeTab, setActiveTab] = useState<AssignmentStatus>('active');

  const assignments = mockAssignments;

  // Memoize filtered assignments to prevent unnecessary re-renders
  const activeAssignments = useMemo(() => assignments.filter(a => a.status === 'active'), [assignments]);
  const upcomingAssignments = useMemo(() => assignments.filter(a => a.status === 'upcoming'), [assignments]);
  const completedAssignments = useMemo(() => assignments.filter(a => a.status === 'completed'), [assignments]);

  // Memoize callback functions to prevent unnecessary re-renders
  const getStatusBadgeClass = useCallback((status: AssignmentStatus) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'upcoming': return styles.statusUpcoming;
      case 'completed': return styles.statusCompleted;
      default: return '';
    }
  }, []);

  const getStatusText = useCallback((status: AssignmentStatus) => {
    switch (status) {
      case 'active': return 'Active Protection';
      case 'upcoming': return 'Scheduled';
      case 'completed': return 'Completed';
      default: return '';
    }
  }, []);

  const renderStars = useCallback((rating: number) => {
    return '⭐'.repeat(rating);
  }, []);

  const renderAssignmentCard = useCallback((assignment: Assignment) => (
    <div key={assignment.id} className={`${styles.assignmentCard} ${styles.fadeIn}`}>
      {/* Consolidated Status and Time Line */}
      <div className={styles.statusLine}>
        <span className={`${styles.statusBadge} ${getStatusBadgeClass(assignment.status)}`}>
          {assignment.status === 'active' && <span className={styles.pulsingDot}></span>}
          {getStatusText(assignment.status)}
        </span>
        <span className={styles.timeAgo}>• {assignment.timeAgo}</span>
      </div>

      {/* Consolidated Officer Info Line */}
      <div className={styles.officerLine}>
        <div className={styles.officerAvatar}>
          <span className={styles.officerInitials}>{assignment.officer.initials}</span>
        </div>
        <span className={styles.officerText}>
          {assignment.officer.name} • SIA {assignment.officer.siaLicense}
          {assignment.officer.rating > 0 && ` • ${renderStars(assignment.officer.rating)}`}
        </span>
      </div>

      {/* Consolidated Journey Line */}
      <div className={styles.journeyLine}>
        <span className={styles.journeyText}>
          {assignment.pickup} → {assignment.destination}
        </span>
      </div>

      {/* Consolidated Service and Price Line */}
      <div className={styles.serviceLine}>
        <span className={styles.serviceText}>
          {assignment.serviceLevelName} • £{Math.round(assignment.estimatedCost)}
        </span>
        {assignment.status === 'active' && assignment.progress && (
          <span className={styles.progressText}>• {assignment.progress.current}</span>
        )}
      </div>

      {/* Compact Actions */}
      <div className={styles.actionSection}>
        {assignment.status === 'active' && (
          <>
            <button className={styles.primaryAction}>Track Live</button>
            <button className={styles.secondaryAction}>Contact</button>
          </>
        )}
        {assignment.status === 'upcoming' && (
          <>
            <button className={styles.primaryAction}>Modify</button>
            <button className={styles.secondaryAction}>Cancel</button>
          </>
        )}
        {assignment.status === 'completed' && (
          <>
            <button className={styles.primaryAction}>Request Protection Again</button>
            <button className={styles.secondaryAction}>Receipt</button>
          </>
        )}
      </div>
    </div>
  ), [getStatusBadgeClass, getStatusText, renderStars]);

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="48" fill="#F3F4F6"/>
          <path d="M48 24L60 36H54V48H42V36H36L48 24Z" fill="#9CA3AF"/>
          <rect x="32" y="52" width="32" height="20" rx="2" fill="#9CA3AF"/>
        </svg>
      </div>
      <h3 className={styles.emptyTitle}>No Active Assignments</h3>
      <p className={styles.emptyDescription}>Your protection history will appear here</p>
      <button
        className={styles.emptyAction}
        onClick={() => navigateToView('home')}
      >
Request Protection Now
      </button>
    </div>
  );

  const renderTabContent = () => {
    let assignmentsToShow: Assignment[] = [];

    switch (activeTab) {
      case 'active':
        assignmentsToShow = activeAssignments;
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
        {assignmentsToShow.map(renderAssignmentCard)}
      </div>
    );
  };

  return (
    <div className={styles.assignmentsView}>
      {/* Premium Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Your Protection Assignments</h1>
        <p className={styles.pageSubtitle}>Track and manage your security services</p>
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{assignments.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{activeAssignments.length + upcomingAssignments.length}</span>
            <span className={styles.statLabel}>This Week</span>
          </div>
        </div>
      </div>

      {/* Modern Status Tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({activeAssignments.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({upcomingAssignments.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'completed' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completedAssignments.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>

      {/* Quick Actions Bar - Clear Labels */}
      <div className={styles.quickActionsBar}>
        <div className={styles.quickActions}>
          <button className={styles.quickActionPrimary}>
            <span className={styles.actionIcon}>🔄</span>
            <span className={styles.actionLabel}>Request Protection</span>
          </button>
          <button className={styles.quickActionSecondary}>
            <span className={styles.actionIcon}>📅</span>
            <span className={styles.actionLabel}>Schedule Protection</span>
          </button>
          <button className={styles.quickActionSecondary}>
            <span className={styles.actionIcon}>🆘</span>
            <span className={styles.actionLabel}>24/7 Support</span>
          </button>
        </div>
      </div>
    </div>
  );
}