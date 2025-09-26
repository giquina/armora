import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { NavigationCards } from './NavigationCards/NavigationCards';
import { EnhancedProtectionPanel } from './EnhancedProtectionPanel/EnhancedProtectionPanel';
import { FinancialTracker } from './FinancialTracker/FinancialTracker';
import { IFinancialTracker } from '../../types';
import styles from './Hub.module.css';

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

// Mock data for enhanced assignment management

const mockFinancialData: IFinancialTracker = {
  monthlyBudget: 3000,
  monthlySpent: 2450,
  remainingBudget: 550,
  savingsVsStandard: 890,
  loyaltyPoints: 850,
  pointsValue: 85,
  nextTierProgress: {
    current: 'Gold',
    next: 'Platinum',
    pointsNeeded: 150,
    benefits: [
      '20% discount on all services',
      'Priority officer assignment',
      'Free flight protection',
      'Dedicated account manager'
    ]
  },
  currentMonth: {
    assignmentCount: 23,
    averageValue: 106,
    topRoute: 'Home ↔ Office',
    peakHours: '9-11 AM'
  }
};

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


export function Hub() {
  const { navigateToView } = useApp();
  const [activeSection, setActiveSection] = useState<AssignmentStatus>('current');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFinancialTracker, setShowFinancialTracker] = useState(false);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [panelState] = useState<'collapsed' | 'half' | 'full'>('collapsed');
  const [isLoading] = useState(false);
  const [sortBy] = useState<'time' | 'cost' | 'tier'>('time');
  const [filters, setFilters] = useState<{ratedOnly: boolean; execOnly: boolean}>({ ratedOnly: false, execOnly: false });
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState(''); // YYYY-MM-DD
  const [dateTo, setDateTo] = useState('');
  const assignments = mockAssignments;

  // Mock officer data for the control panel
  const mockOfficer = {
    name: 'John Davis',
    designation: 'Executive Protection Specialist',
    initials: 'JD'
  };

  // Memoize filtered assignments
  const sortFn = useCallback((a: Assignment, b: Assignment) => {
    if (sortBy === 'cost') return b.totalCost - a.totalCost;
    if (sortBy === 'tier') return a.serviceTier.localeCompare(b.serviceTier);
    // default by date/time
    return (a.date + a.time).localeCompare(b.date + b.time);
  }, [sortBy]);

  const matchesSearch = useCallback((a: Assignment) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.officerName.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.location.start.toLowerCase().includes(q) ||
      a.location.end.toLowerCase().includes(q) ||
      a.serviceTier.toLowerCase().includes(q)
    );
  }, [search]);

  const inDateRange = useCallback((a: Assignment) => {
    const d = a.date; // YYYY-MM-DD
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  }, [dateFrom, dateTo]);

  const currentAssignments = useMemo(() =>
    assignments.filter(a => a.status === 'current' && matchesSearch(a) && inDateRange(a)).sort(sortFn)
  , [assignments, sortFn, matchesSearch, inDateRange]);

  const upcomingAssignments = useMemo(() =>
    assignments.filter(a => a.status === 'upcoming' && matchesSearch(a) && inDateRange(a)).sort(sortFn)
  , [assignments, sortFn, matchesSearch, inDateRange]);

  const completedAssignments = useMemo(() => {
    let list = assignments.filter(a => a.status === 'completed' && matchesSearch(a) && inDateRange(a));
    if (filters.ratedOnly) list = list.filter(a => !!a.rating);
    if (filters.execOnly) list = list.filter(a => a.serviceTier === 'Executive');
    return list.sort(sortFn);
  }, [assignments, filters, sortFn, matchesSearch, inDateRange]);

  // Check if there's an active assignment for the quick actions bar
  const hasActiveAssignment = currentAssignments.length > 0;

  // Debug: Log assignment status
  console.log('🔍 Debug - Current assignments:', currentAssignments.length, hasActiveAssignment);

  const getServiceTierBadge = useCallback((tier: ProtectionTier) => {
    switch (tier) {
      case 'Essential': return { color: '#00D4FF', bg: 'rgba(0, 212, 255, 0.1)' };
      case 'Executive': return { color: '#FFD700', bg: 'rgba(255, 215, 0, 0.1)' };
      case 'Shadow': return { color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.1)' };
      default: return { color: '#A0A0A0', bg: 'rgba(160, 160, 160, 0.1)' };
    }
  }, []);

  // Enhanced feature handlers

  const handleDirectCall = useCallback(() => {
    console.log('📞 Calling protection officer...');
    // In real app: initiate call to assigned officer
  }, []);



  const handleLocationToggle = useCallback(() => {
    setIsLocationSharing(!isLocationSharing);
    console.log(`📍 Location sharing ${!isLocationSharing ? 'enabled' : 'disabled'}`);
  }, [isLocationSharing]);


  const handleViewFinancialDetails = useCallback(() => {
    console.log('📊 Opening detailed financial breakdown...');
    setShowFinancialTracker(!showFinancialTracker);
  }, [showFinancialTracker]);

  const handleAdjustBudget = useCallback(() => {
    console.log('⚙️ Opening budget adjustment...');
    // In real app: open budget settings modal
  }, []);

  const handleClaimPoints = useCallback(() => {
    console.log('🎁 Claiming loyalty points...');
    // In real app: process points claim
  }, []);



  const renderAssignmentCard = useCallback((assignment: Assignment) => {
    const tierBadge = getServiceTierBadge(assignment.serviceTier);
    const statusColor = assignment.status === 'current' ? '#10B981' :
                       assignment.status === 'upcoming' ? '#FFD700' : '#6B7280';

    return (
      <div key={assignment.id} className={styles.assignmentCard}>
        {/* Status badge in top-right corner */}
        <div
          className={styles.assignmentStatus}
          style={{ backgroundColor: tierBadge.bg, color: tierBadge.color }}
        >
          {assignment.serviceTier}
        </div>

        {/* Line 1: Officer name with status indicator */}
        <div className={styles.assignmentHeader}>
          <div className={styles.detailItem}>
            <div
              className={styles.statusDot}
              style={{ backgroundColor: statusColor }}
            />
            <span className={styles.detailValue} style={{ fontWeight: 600, fontSize: '14px' }}>
              {assignment.officerName} • {assignment.serviceTier}
            </span>
          </div>
        </div>

        {/* Line 2: Route information */}
        <div className={styles.assignmentDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Route</span>
            <span className={styles.detailValue}>
              {assignment.location.start.split(',')[0]} → {assignment.location.end.split(',')[0]}
            </span>
          </div>

          {/* Line 3: Time and cost details */}
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Time</span>
            <span className={styles.detailValue}>
              {assignment.time} ({assignment.duration}) • £{assignment.totalCost}
            </span>
          </div>
        </div>

        {/* Bottom section: Progress and actions */}
        <div className={styles.assignmentFooter}>
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: assignment.status === 'current' ? '75%' : '0%' }}
              />
            </div>
            <span className={styles.progressText}>
              {assignment.status === 'current' ? '75%' : assignment.status === 'upcoming' ? 'Scheduled' : 'Complete'}
            </span>
          </div>

          {assignment.rating && assignment.status === 'completed' && (
            <div className={styles.rating}>
              {'★'.repeat(assignment.rating)}
            </div>
          )}

          {!assignment.rating && assignment.status === 'completed' && (
            <button className={styles.inlineRateBtn} onClick={() => console.log('Open rating for', assignment.id)}>
              Rate Now
            </button>
          )}
        </div>
      </div>
    );
  }, [getServiceTierBadge]);

  const renderEmptyState = (type: AssignmentStatus) => {
    const emptyStates = {
      current: {
        icon: '🛡️',
        title: 'No Active Protection',
        description: 'Request protection now for immediate service',
        buttonText: 'Request Protection'
      },
      upcoming: {
        icon: '📅',
        title: 'No Upcoming Assignments',
        description: 'Schedule your next protection service',
        buttonText: 'Request Protection'
      },
      completed: {
        icon: '✅',
        title: 'No Completed Assignments',
        description: 'Your completed assignments will appear here',
        buttonText: 'Request Protection'
      },
      analytics: {
        icon: '📊',
        title: 'No Data Available',
        description: 'Analytics will be available after your first assignment',
        buttonText: 'View Sample Report'
      }
    };

    const state = emptyStates[type];
    const hasFilters = filters.ratedOnly || filters.execOnly || search || dateFrom || dateTo;

    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>{state.icon}</div>
        <h3 className={styles.emptyTitle}>{state.title}</h3>
        <p className={styles.emptyDescription}>
          {hasFilters ? 'No results match your filters.' : state.description}
        </p>
        {hasFilters && (
          <button
            className={styles.emptyAction}
            onClick={() => {
              setFilters({ ratedOnly: false, execOnly: false });
              setSearch('');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Clear filters
          </button>
        )}
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
    <div className={styles.assignmentsSection}>
      <div className={styles.analyticsContent} role="tabpanel" id="panel-analytics" aria-labelledby="tab-analytics">
        <div className={styles.analyticsCard}>
          <h3 className={styles.analyticsTitle}>Protection Analytics</h3>
          <p className={styles.analyticsDescription}>
            Detailed analytics and insights coming soon. View your protection usage patterns,
            officer ratings, and spending analytics.
          </p>
        </div>
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
      <div className={styles.assignmentsSection}>
        <div className={styles.sectionHeader}>{activeSection.toUpperCase()}</div>
        {isLoading ? (
          <div className={styles.assignmentsList} role="tabpanel" aria-busy>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        ) : (
          <div className={styles.assignmentsList} role="tabpanel" id={`panel-${activeSection}`} aria-labelledby={`tab-${activeSection}`}>
            {assignmentsToShow.map(assignment => renderAssignmentCard(assignment))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.hubContainer}>

      {/* Header Section */}
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>PROTECTION HUB</h1>
        <p className={styles.subtitle}>Your Secure Transport Command Center</p>
        <div className={styles.quickStatus}>
          {currentAssignments.length > 0 && (
            <span className={`${styles.statusPill} ${styles.active}`}>
              <span className={styles.pulseIndicator}>●</span>
              {currentAssignments.length} Active
            </span>
          )}
          {upcomingAssignments.length > 0 && (
            <span className={`${styles.statusPill} ${styles.scheduled}`}>
              <span className={styles.amberIndicator}>●</span>
              {upcomingAssignments.length} Scheduled
            </span>
          )}
          {currentAssignments.length === 0 && upcomingAssignments.length === 0 && (
            <span className={`${styles.statusPill} ${styles.inactive}`}>
              No Active Protection
            </span>
          )}
        </div>
      </div>

      {/* Financial Tracker */}
      {showFinancialTracker && (
        <FinancialTracker
          financialData={mockFinancialData}
          onViewDetails={handleViewFinancialDetails}
          onAdjustBudget={handleAdjustBudget}
          onClaimPoints={handleClaimPoints}
        />
      )}


      {/* Enhanced Navigation Cards */}
      <div className={styles.stickyNav}>
        <NavigationCards
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          assignmentCounts={{
            current: currentAssignments.length,
            upcoming: upcomingAssignments.length,
            completed: completedAssignments.length
          }}
          currentAssignments={currentAssignments}
          upcomingAssignments={upcomingAssignments}
          completedAssignments={completedAssignments}
        />

      </div>

      {/* Quick Stats Cards */}
      <div className={styles.statsSection}>
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
      </div>

      {/* Assignment List */}
      {renderSectionContent()}

      {/* Enhanced Quick Actions */}
      <div className={styles.quickActionsSection}>
        <div className={styles.quickActions}>
          <button className={styles.actionButton} onClick={() => navigateToView('booking')}>
            <span className={styles.actionIcon}>🛡️</span>
            <span className={styles.actionText}>Request Protection</span>
          </button>
          <button className={styles.actionButton} onClick={handleViewFinancialDetails}>
            <span className={styles.actionIcon}>💷</span>
            <span className={styles.actionText}>{showFinancialTracker ? 'Hide' : 'Show'} Finances</span>
          </button>
          <button className={styles.actionButton} onClick={() => setShowTemplates(!showTemplates)}>
            <span className={styles.actionIcon}>📍</span>
            <span className={styles.actionText}>{showTemplates ? 'Hide' : 'Show'} Saved Routes</span>
            <span className={styles.badge}>3</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>📊</span>
            <span className={styles.actionText}>Analytics Report</span>
          </button>
        </div>
      </div>

      {/* Enhanced Protection Panel - Always show for testing */}
      <EnhancedProtectionPanel
        officer={mockOfficer}
        assignment={currentAssignments[0] || {
          id: 'ASG-001',
          status: 'current',
          progress: 75,
          timeRemaining: '1h 23m',
          eta: '16:45',
          cost: '£245.50',
          serviceLevel: 'Executive Shield',
          currentLocation: 'Near Mayfair'
        }}
        isLocationSharing={isLocationSharing}
        onLocationToggle={handleLocationToggle}
        onOfficerCall={handleDirectCall}
        assignmentId={currentAssignments[0]?.id || 'ASG-001'}
        currentRate={95} // Executive Shield rate
      />
    </div>
  );
}