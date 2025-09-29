import { FC, memo, useState, useCallback, useMemo } from 'react';
import { RatingStars } from './MicroVisualizations/RatingStars';
import styles from '../NavigationCards.module.css';

type ProtectionTier = 'Essential' | 'Executive' | 'Shadow';

interface CompletedAssignment {
  id: string;
  date: string;
  time: string;
  duration: string;
  officerName: string;
  officerSIA: string;
  serviceTier: ProtectionTier;
  totalCost: number;
  location: {
    start: string;
    end: string;
  };
  rating?: number;
  vehicleType: string;
  officerPhoto?: string;
}

interface CompletedCardData {
  monthLabel: string;
  totalCompleted: number;
  averageRating: number;
  lastAssignment: string;
  pendingRatings: number;
  loyaltyPoints: number;
  pointsToNextTier: number;
  spentThisMonth: string;
  count: number;
  assignments?: CompletedAssignment[];
}

interface CompletedCardProps {
  data: CompletedCardData;
  isActive: boolean;
  onClick: () => void;
  screenWidth?: number;
  tabId?: string;
  ariaControls?: string;
}

export const CompletedCard: FC<CompletedCardProps> = memo(({
  data,
  isActive,
  onClick,
  screenWidth = 375,
  tabId,
  ariaControls
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'rated' | 'executive' | 'recent'>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'all'>('month');
  const [showFilters, setShowFilters] = useState(false);

  const showVisuals = screenWidth >= 320;
  const isMobile = screenWidth <= 414;

  // Mock completed assignments data
  const mockCompletedAssignments: CompletedAssignment[] = useMemo(() => [
    {
      id: 'ASG-003',
      date: '2024-03-14',
      time: '16:00',
      duration: '3 hours',
      officerName: 'Michael Thompson',
      officerSIA: 'SIA-3456-7890',
      serviceTier: 'Essential',
      totalCost: 195,
      location: { start: 'Westminster, London', end: 'City of London' },
      rating: 4,
      vehicleType: 'Mercedes E-Class',
      officerPhoto: '/images/officers/michael-t.jpg'
    },
    {
      id: 'ASG-004',
      date: '2024-03-12',
      time: '14:30',
      duration: '4 hours',
      officerName: 'Sarah Mitchell',
      officerSIA: 'SIA-2345-6789',
      serviceTier: 'Executive',
      totalCost: 380,
      location: { start: 'Mayfair, London', end: 'Heathrow Airport' },
      rating: 5,
      vehicleType: 'Range Rover Sport',
      officerPhoto: '/images/officers/sarah-m.jpg'
    },
    {
      id: 'ASG-005',
      date: '2024-03-10',
      time: '09:00',
      duration: '6 hours',
      officerName: 'John Davis',
      officerSIA: 'SIA-1234-5678',
      serviceTier: 'Shadow',
      totalCost: 750,
      location: { start: 'Kensington, London', end: 'Canary Wharf, London' },
      rating: 5,
      vehicleType: 'BMW 5 Series',
      officerPhoto: '/images/officers/john-d.jpg'
    }
  ], []);

  // Filter and search logic
  const filteredAssignments = useMemo(() => {
    let filtered = data.assignments || mockCompletedAssignments;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(assignment =>
        assignment.officerName.toLowerCase().includes(term) ||
        assignment.id.toLowerCase().includes(term) ||
        assignment.location.start.toLowerCase().includes(term) ||
        assignment.location.end.toLowerCase().includes(term) ||
        assignment.serviceTier.toLowerCase().includes(term)
      );
    }

    // Category filter
    switch (filterBy) {
      case 'rated':
        filtered = filtered.filter(a => a.rating && a.rating >= 4);
        break;
      case 'executive':
        filtered = filtered.filter(a => a.serviceTier === 'Executive' || a.serviceTier === 'Shadow');
        break;
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(a => new Date(a.date) >= weekAgo);
        break;
    }

    // Date range filter
    const now = new Date();
    let cutoffDate = new Date();
    switch (dateRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'all':
        cutoffDate = new Date(0); // Beginning of time
        break;
    }

    filtered = filtered.filter(a => new Date(a.date) >= cutoffDate);

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.assignments, mockCompletedAssignments, searchTerm, filterBy, dateRange]);

  const handleBookAgain = useCallback((assignment: CompletedAssignment) => {
    // In real app: pre-fill booking form with assignment details
    console.log('Booking again:', assignment.id);
    // Navigate to booking with pre-filled data
  }, []);

  const handleExportReport = useCallback(() => {
    // Generate expense report for filtered assignments
    const reportData = filteredAssignments.map(a => ({
      date: a.date,
      officer: a.officerName,
      route: `${a.location.start} → ${a.location.end}`,
      duration: a.duration,
      cost: a.totalCost,
      tier: a.serviceTier
    }));

    // In real app: trigger download of CSV/PDF report
    console.log('Exporting report:', reportData);
  }, [filteredAssignments]);


  return (
    <div
      className={`${styles.navCard} ${styles.completed} ${isActive ? styles.active : ''}`}
      data-type="completed"
    >
      {/* Header */}
      <div className={styles.navCardHeader}>
        <div className={styles.navCardLeft}>
          <span className={styles.navCardIcon}>✅</span>
          <span className={styles.navCardTitle}>Completed</span>
          <span className={styles.navCardCount}>({data.count})</span>
        </div>
        {isActive && <span className={styles.activeIndicator}>●</span>}
        {data.pendingRatings > 0 && (
          <div className={styles.pendingBadge}>{data.pendingRatings}</div>
        )}
      </div>

      {/* Compact Content - Always Visible */}
      {data.count > 0 && (
        <div className={styles.cardContent}>
          {/* Essential Info Row - Improved Typography */}
          <div className={styles.essentialInfo}>
            <div className={styles.statusRow}>
              <div className={styles.statusSection}>
                <span className={styles.greenIndicator}>✓</span>
                <span className={styles.statusText}>COMPLETED</span>
              </div>
              <button
                className={styles.expandButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            </div>
            <div className={styles.keyStats}>
              <span className={styles.completedCount}>{filteredAssignments.length} protection details</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.averageRating}>{data.averageRating}★</span>
              <span className={styles.bullet}>•</span>
              <span className={styles.spentAmount}>{data.spentThisMonth}</span>
            </div>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className={styles.expandedDetails}>
              {/* Search and Filter Controls */}
              <div className={styles.searchFilterSection}>
                <div className={styles.searchRow}>
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFilters(!showFilters);
                    }}
                  >
                    🔍
                  </button>
                </div>

                {showFilters && (
                  <div className={styles.filterControls}>
                    <div className={styles.filterRow}>
                      <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value as any)}
                        className={styles.filterSelect}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="all">All Assignments</option>
                        <option value="rated">Highly Rated (4+ ⭐)</option>
                        <option value="executive">Executive Tier</option>
                        <option value="recent">Recent (Last Week)</option>
                      </select>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as any)}
                        className={styles.filterSelect}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="all">All Time</option>
                      </select>
                    </div>
                    <button
                      className={styles.exportButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportReport();
                      }}
                    >
                      📄 Export Report
                    </button>
                  </div>
                )}
              </div>

              {/* Assignment List */}
              <div className={styles.assignmentsList}>
                {filteredAssignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className={styles.assignmentItem}>
                    {/* Officer and Service Info */}
                    <div className={styles.assignmentHeader}>
                      <div className={styles.officerInfo}>
                        {assignment.officerPhoto && (
                          <img
                            src={assignment.officerPhoto}
                            alt={assignment.officerName}
                            className={styles.officerPhoto}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className={styles.officerDetails}>
                          <span className={styles.officerName}>{assignment.officerName}</span>
                          <span className={styles.serviceTier}>{assignment.serviceTier}</span>
                        </div>
                      </div>
                      {assignment.rating && (
                        <div className={styles.assignmentRating}>
                          {'★'.repeat(assignment.rating)}
                        </div>
                      )}
                    </div>

                    {/* Assignment Details */}
                    <div className={styles.assignmentDetails}>
                      <div className={styles.routeInfo}>
                        <span className={styles.routeText}>
                          {assignment.location.start.split(',')[0]} → {assignment.location.end.split(',')[0]}
                        </span>
                      </div>
                      <div className={styles.assignmentMeta}>
                        <span className={styles.assignmentDate}>{assignment.date}</span>
                        <span className={styles.assignmentDuration}>{assignment.duration}</span>
                        <span className={styles.assignmentCost}>£{assignment.totalCost}</span>
                      </div>
                    </div>

                    {/* Book Again Action */}
                    <div className={styles.assignmentActions}>
                      <button
                        className={styles.bookAgainButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookAgain(assignment);
                        }}
                      >
                        🔄 Book Again
                      </button>
                      <span className={styles.vehicleType}>{assignment.vehicleType}</span>
                    </div>
                  </div>
                ))}

                {filteredAssignments.length > 3 && (
                  <div className={styles.moreAssignments}>
                    <span className={styles.moreText}>
                      +{filteredAssignments.length - 3} more assignments
                    </span>
                  </div>
                )}

                {filteredAssignments.length === 0 && (
                  <div className={styles.noResults}>
                    <span className={styles.noResultsIcon}>🔍</span>
                    <span className={styles.noResultsText}>No assignments match your search</span>
                  </div>
                )}
              </div>

              {/* Summary Statistics */}
              <div className={styles.summaryStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{filteredAssignments.length}</span>
                  <span className={styles.statLabel}>Filtered Results</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>
                    £{filteredAssignments.reduce((sum, a) => sum + a.totalCost, 0)}
                  </span>
                  <span className={styles.statLabel}>Total Investment</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>
                    {(filteredAssignments.reduce((sum, a) => sum + (a.rating || 0), 0) /
                      filteredAssignments.filter(a => a.rating).length || 0).toFixed(1)}
                  </span>
                  <span className={styles.statLabel}>Avg Rating</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📋 Full History
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  📊 Analytics
                </button>
                <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
                  💳 Expense Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {data.count === 0 && (
        <div className={styles.emptyCardState}>
          <div className={styles.emptyText}>No completed assignments</div>
          <div className={styles.emptySubtext}>History will appear here</div>
        </div>
      )}
    </div>
  );
});