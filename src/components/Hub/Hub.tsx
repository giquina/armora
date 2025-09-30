import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { NavigationCards } from './NavigationCards/NavigationCards';
import { EnhancedProtectionPanel } from './EnhancedProtectionPanel/EnhancedProtectionPanel';
import { FinancialTracker } from './FinancialTracker/FinancialTracker';
import { FavoriteCPOs } from './FavoriteCPOs/FavoriteCPOs';
import { NextAssignmentCard } from './NextAssignmentCard';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
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
  const [showFavoriteCPOs, setShowFavoriteCPOs] = useState(false);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
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
  // const hasActiveAssignment = currentAssignments.length > 0;

  // Debug: Log assignment status

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
    // In real app: initiate call to assigned officer
  }, []);

  const handleLocationToggle = useCallback(() => {
    setIsLocationSharing(!isLocationSharing);
  }, [isLocationSharing]);

  const handleViewFinancialDetails = useCallback(() => {
    setShowFinancialTracker(!showFinancialTracker);
  }, [showFinancialTracker]);

  const handleAdjustBudget = useCallback(() => {
    // In real app: open budget settings modal
  }, []);

  const handleClaimPoints = useCallback(() => {
    // In real app: process points claim
  }, []);

  const handleBookWithCPO = useCallback((cpoId: string) => {
    // In real app: navigate to booking with pre-selected CPO
    console.log('Booking with CPO:', cpoId);
    navigateToView('protection-request'); // Navigate to booking with CPO pre-selected
  }, [navigateToView]);

  const handleViewCPOProfile = useCallback((cpoId: string) => {
    // In real app: show CPO profile modal or navigate to profile page
    console.log('Viewing CPO profile:', cpoId);
  }, []);

  const handleNextAssignmentClick = useCallback(() => {
    if (upcomingAssignments.length > 0) {
      // Scroll to existing NEXT PROTECTION section
      const nextProtectionSection = document.getElementById('next-protection-section');
      if (nextProtectionSection) {
        nextProtectionSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback: scroll to upcoming section
        setActiveSection('upcoming');
      }
    } else {
      // Navigate to booking flow
      navigateToView('protection-request');
    }
  }, [upcomingAssignments, navigateToView]);

  // Pull-to-refresh functionality
  const handleRefresh = useCallback(async () => {
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app: refresh assignments, data, etc.
    console.log('Refreshing assignments data...');
  }, []);

  const {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    refreshIndicatorStyle,
    shouldShowIndicator,
  } = usePullToRefresh(handleRefresh, {
    threshold: 80,
    enabled: true,
  });



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
            <button className={styles.rateButton}>
              Rate Now
            </button>
          )}
        </div>
      </div>
    );
  }, [getServiceTierBadge]);

  // Enhanced empty states configuration with contextual messages
  const emptyStates = useMemo(() => ({
    current: {
      icon: '🛡️',
      title: 'No Active Protection',
      description: 'You don\'t have any active protection details right now.',
      helpText: 'Our SIA-licensed CPOs are available 24/7 for immediate deployment.',
      buttonText: 'Request Protection',
      secondaryText: 'Response time: ~12 minutes',
      suggestions: [
        '🚀 Emergency protection available',
        '📱 One-tap booking process',
        '⭐ 98% customer satisfaction'
      ]
    },
    upcoming: {
      icon: '📅',
      title: 'No Scheduled Protection',
      description: 'You don\'t have any upcoming protection assignments.',
      helpText: 'Book in advance for better availability and preferred officers.',
      buttonText: 'Schedule Protection',
      secondaryText: 'Plan ahead for peace of mind',
      suggestions: [
        '🗓️ Schedule recurring protection',
        '👤 Request preferred CPO',
        '💼 Business trip protection'
      ]
    },
    completed: {
      icon: '✅',
      title: 'No Protection History',
      description: 'Your completed protection assignments will appear here.',
      helpText: 'Start your protection journey and build a secure history.',
      buttonText: 'Start Your First Assignment',
      secondaryText: 'Join thousands of protected principals',
      suggestions: [
        '📊 Track your protection patterns',
        '⭐ Rate and review your CPOs',
        '🏆 Earn loyalty rewards'
      ]
    },
    analytics: {
      icon: '📊',
      title: 'No Analytics Data',
      description: 'Analytics will be available after your first protection assignment.',
      helpText: 'Get insights into your protection patterns, spending, and safety metrics.',
      buttonText: 'Request Protection to Start',
      secondaryText: 'Data-driven security insights',
      suggestions: [
        '📈 Spending and budget tracking',
        '🛡️ Safety pattern analysis',
        '📋 Monthly protection reports'
      ]
    }
  }), []);

  const clearFilters = useCallback(() => {
    setFilters({ ratedOnly: false, execOnly: false });
    setSearch('');
    setDateFrom('');
    setDateTo('');
  }, []);

  const handleEmptyStateAction = useCallback((type: AssignmentStatus) => {
    if (type === 'analytics') {
      // Could show analytics demo
    } else {
      navigateToView('protection-request');
    }
  }, [navigateToView]);

  const renderEmptyState = useCallback((type: AssignmentStatus) => {
    const state = emptyStates[type];
    const hasFilters = filters.ratedOnly || filters.execOnly || search || dateFrom || dateTo;

    return (
      <div className={styles.enhancedEmptyState}>
        <div className={styles.emptyStateHeader}>
          <div className={styles.emptyIcon}>{state.icon}</div>
          <h3 className={styles.emptyTitle}>{state.title}</h3>
          <p className={styles.emptyDescription}>
            {hasFilters ? 'No results match your current filters.' : state.description}
          </p>
          {!hasFilters && (
            <p className={styles.emptyHelpText}>{state.helpText}</p>
          )}
        </div>

        {!hasFilters && (
          <div className={styles.emptySuggestions}>
            {state.suggestions.map((suggestion, index) => (
              <div key={index} className={styles.suggestionItem}>
                <span className={styles.suggestionText}>{suggestion}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.emptyStateActions}>
          {hasFilters && (
            <button
              className={styles.secondaryEmptyAction}
              onClick={clearFilters}
            >
              🔍 Clear filters
            </button>
          )}

          <button
            className={styles.primaryEmptyAction}
            onClick={() => handleEmptyStateAction(type)}
          >
            {type === 'analytics' ? '📊' : '🛡️'} {state.buttonText}
          </button>

          {!hasFilters && (
            <p className={styles.emptySecondaryText}>
              {state.secondaryText}
            </p>
          )}
        </div>
      </div>
    );
  }, [emptyStates, filters, search, dateFrom, dateTo, clearFilters, handleEmptyStateAction]);

  const renderAnalytics = useCallback(() => (
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
  ), []);

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
      <div className={styles.assignmentsSection} data-section={activeSection}>
        <div className={styles.sectionHeader}>{activeSection.toUpperCase()}</div>
        {/* Contextual Stats for Current Section */}
        {activeSection === 'current' && currentAssignments.length > 0 && (
          <div className={styles.contextualInfo}>
            <div className={styles.contextualStat}>
              <span className={styles.contextIcon}>⏱️</span>
              <span>Total Active Time: {currentAssignments.reduce((acc, a) => acc + parseFloat(a.duration.split(' ')[0]) || 0, 0)}h</span>
            </div>
            <div className={styles.contextualStat}>
              <span className={styles.contextIcon}>💷</span>
              <span>Active Investment: £{currentAssignments.reduce((acc, a) => acc + a.totalCost, 0)}</span>
            </div>
          </div>
        )}
        {activeSection === 'upcoming' && upcomingAssignments.length > 0 && (
          <div className={styles.contextualInfo}>
            <div className={styles.contextualStat}>
              <span className={styles.contextIcon}>📅</span>
              <span>Next: {upcomingAssignments[0]?.date} at {upcomingAssignments[0]?.time}</span>
            </div>
            <div className={styles.contextualStat}>
              <span className={styles.contextIcon}>🛡️</span>
              <span>Scheduled: {upcomingAssignments.length} protection{upcomingAssignments.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
        {activeSection === 'completed' && completedAssignments.length > 0 && (
          <div className={styles.contextualInfo}>
            <div className={styles.contextualStat}>
              <span className={styles.contextIcon}>⭐</span>
              <span>Avg Rating: {(completedAssignments.reduce((acc, a) => acc + (a.rating || 0), 0) / completedAssignments.filter(a => a.rating).length || 0).toFixed(1)}</span>
            </div>
            <div className={styles.contextualStat}>
              <span className={styles.contextIcon}>📊</span>
              <span>Total Completed: {completedAssignments.length}</span>
            </div>
          </div>
        )}
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
    <div className={styles.hubContainer} ref={containerRef as React.RefObject<HTMLDivElement>}>
      {/* Pull-to-refresh indicator */}
      {shouldShowIndicator && (
        <div
          className={styles.refreshIndicator}
          style={refreshIndicatorStyle}
        >
          <div className={styles.refreshIcon}>
            {isRefreshing ? '🔄' : '⬇️'}
          </div>
          <span className={styles.refreshText}>
            {isRefreshing ? 'Refreshing...' : isPulling ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}

      {/* Enhanced Header Section */}
      <div className={styles.headerSection}>
        {/* Time and Greeting Row */}
        <div className={styles.greetingRow}>
          <div className={styles.greetingSection}>
            <h1 className={styles.greetingText}>
              {(() => {
                const hour = new Date().getHours();
                const userName = "Principal"; // In real app: get from AuthContext
                if (hour < 12) return `Good morning, ${userName}`;
                if (hour < 17) return `Good afternoon, ${userName}`;
                return `Good evening, ${userName}`;
              })()}
            </h1>
            <div className={styles.dateTimeInfo}>
              <span className={styles.currentDate}>
                {new Date().toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className={styles.currentTime}>
                {new Date().toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
          </div>

          {/* Next Assignment Preview Card */}
          <NextAssignmentCard
            assignment={upcomingAssignments.length > 0 ? {
              id: upcomingAssignments[0].id,
              scheduledDateTime: new Date(`${upcomingAssignments[0].date}T${upcomingAssignments[0].time}`),
              cpoName: upcomingAssignments[0].officerName,
              cpoDesignation: upcomingAssignments[0].serviceTier === 'Shadow' ? 'Special Forces Protection Specialist' :
                              upcomingAssignments[0].serviceTier === 'Executive' ? 'Executive Protection Specialist' :
                              'Close Protection Officer',
              protectionLevel: upcomingAssignments[0].serviceTier as 'Essential' | 'Executive' | 'Shadow',
              cpoSiaLicense: upcomingAssignments[0].officerSIA
            } : null}
            onClick={handleNextAssignmentClick}
          />
        </div>

        {/* Main Title */}
        <div className={styles.titleSection}>
          <h2 className={styles.pageTitle}>PROTECTION HUB</h2>
          <p className={styles.subtitle}>Your Secure Transport Command Center</p>
        </div>

        {/* Status Pills */}
        <div className={styles.quickStatus}>
          {currentAssignments.length > 0 && (
            <span className={`${styles.statusPill} ${styles.active}`}>
              <span className={styles.pulseIndicator}>●</span>
              {currentAssignments.length} Active Protection Detail{currentAssignments.length > 1 ? 's' : ''}
            </span>
          )}
          {upcomingAssignments.length > 0 && (
            <span className={`${styles.statusPill} ${styles.scheduled}`}>
              <span className={styles.amberIndicator}>●</span>
              {upcomingAssignments.length} Scheduled Assignment{upcomingAssignments.length > 1 ? 's' : ''}
            </span>
          )}
          {currentAssignments.length === 0 && upcomingAssignments.length === 0 && (
            <span className={`${styles.statusPill} ${styles.inactive}`}>
              <span className={styles.inactiveIndicator}>●</span>
              No Active Protection
            </span>
          )}
        </div>

        {/* Enhanced Contextual Status */}
        <div className={styles.contextualStatus}>
          {currentAssignments.length > 0 ? (
            <div className={styles.activeStatusDetails}>
              <span className={styles.statusMessage}>
                Protection Detail Active - Monitor real-time progress below
              </span>
              <div className={styles.activeMetrics}>
                <span className={styles.metric}>
                  ETA: {currentAssignments[0]?.time}
                </span>
                <span className={styles.metric}>
                  Running cost: £{currentAssignments[0]?.totalCost}
                </span>
                <span className={styles.metric}>
                  CPO: {currentAssignments[0]?.officerName}
                </span>
              </div>
            </div>
          ) : upcomingAssignments.length > 0 ? (
            <div className={styles.upcomingStatusDetails}>
              <span className={styles.statusMessage}>
                Next protection detail: {upcomingAssignments[0]?.date} at {upcomingAssignments[0]?.time}
              </span>
              <div className={styles.upcomingMetrics}>
                <span className={styles.metric}>
                  Service: {upcomingAssignments[0]?.serviceTier}
                </span>
                <span className={styles.metric}>
                  CPO: {upcomingAssignments[0]?.officerName}
                </span>
                <span className={styles.metric}>
                  Route: {upcomingAssignments[0]?.location.start.split(',')[0]} → {upcomingAssignments[0]?.location.end.split(',')[0]}
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.readyStatusDetails}>
              <span className={styles.statusMessage}>
                Ready to request your next protection service
              </span>
              <div className={styles.readyMetrics}>
                <span className={styles.metric}>Response time: ~12 minutes</span>
                <span className={styles.metric}>24/7 availability</span>
                <span className={styles.metric}>98% satisfaction rate</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Alert Banner */}
        <div className={styles.securityBanner}>
          <div className={styles.securityAlert}>
            <span className={styles.securityIcon}>🔒</span>
            <span className={styles.securityText}>
              Enhanced security protocols active
            </span>
            <span className={styles.securityLevel}>Level 3 SIA Compliance</span>
          </div>
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
        <div className={styles.navigationHeader}>
          <span className={styles.navTitle}>Protection Overview</span>
          <span className={styles.navSubtitle}>Tap to view details</span>
        </div>
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


      {/* Favorite CPOs Section */}
      {(currentAssignments.length === 0 && upcomingAssignments.length === 0) || showFavoriteCPOs ? (
        <FavoriteCPOs
          onBookWithCPO={handleBookWithCPO}
          onViewProfile={handleViewCPOProfile}
          className={styles.favoriteCPOsSection}
        />
      ) : null}

      {/* Assignment List */}
      {renderSectionContent()}

      {/* Enhanced Protection Panel - Only show when protection is active */}
      {currentAssignments.length > 0 && (
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
      )}
    </div>
  );
}