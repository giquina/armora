import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './AssignmentsView.module.css';

type AssignmentStatus = 'active' | 'upcoming' | 'completed';
type ProtectionTier = 'essential' | 'executive' | 'shadow';
type SecurityStatus = 'with-principal' | 'approaching' | 'advance-team' | 'covert' | 'incident-response' | 'venue-sweep' | 'cpo-approaching';

interface Assignment {
  id: string;
  status: AssignmentStatus;
  title: string;
  serviceLevelId: ProtectionTier;
  serviceLevelName: string;
  fromLocation: string;
  toLocation: string;
  scheduledTime: string;
  protectionDuration: {
    totalHours: number;
    completedHours: number;
    minimumHours: number;
  };
  totalInvestment: number;
  memberDiscount?: number;
  officer: {
    name: string;
    designation: string; // CPO designation
    siaLicense: string;
    yearsExperience: number;
    specializations: string[];
    rating: number;
    vehicle: string;
    initials: string;
  };
  timeAgo: string;
  securityStatus?: SecurityStatus;
  progress?: {
    current: string;
    percentage: number;
    eta?: string;
  };
  threatLevel?: 'low' | 'medium' | 'high';
  specialRequirements?: string[];
  incidentReports?: number;
}

// Mock assignment data with professional close protection terminology
const mockAssignments: Assignment[] = [
  {
    id: 'ASG-001',
    status: 'active',
    title: 'Executive Protection Detail - City Meeting',
    serviceLevelId: 'executive',
    serviceLevelName: 'Executive Protection',
    fromLocation: 'Private Residence, Kensington',
    toLocation: 'One Canada Square, Canary Wharf',
    scheduledTime: '14:30',
    protectionDuration: {
      totalHours: 4,
      completedHours: 2.6,
      minimumHours: 2
    },
    totalInvestment: 300,
    memberDiscount: 50,
    officer: {
      name: 'John Davis',
      designation: 'Senior CPO',
      siaLicense: 'SIA-1234-5678-CP',
      yearsExperience: 12,
      specializations: ['Executive Protection', 'Threat Assessment', 'Medical Response'],
      rating: 5,
      vehicle: 'BMW 5 Series (Armoured)',
      initials: 'JD'
    },
    timeAgo: '2 hours ago',
    securityStatus: 'with-principal',
    progress: {
      current: 'Protection Detail Active - With Principal',
      percentage: 65,
      eta: undefined
    },
    threatLevel: 'medium',
    specialRequirements: ['Medical Escort', 'VIP Route'],
    incidentReports: 0
  },
  {
    id: 'ASG-002',
    status: 'active',
    title: 'Essential Protection - Secure Airport Transfer',
    serviceLevelId: 'essential',
    serviceLevelName: 'Essential Protection',
    fromLocation: 'Corporate Offices, City of London',
    toLocation: 'Heathrow Terminal 5 - VIP Lounge',
    scheduledTime: '16:00',
    protectionDuration: {
      totalHours: 3,
      completedHours: 1.0,
      minimumHours: 2
    },
    totalInvestment: 135,
    memberDiscount: 50,
    officer: {
      name: 'Sarah Mitchell',
      designation: 'CPO',
      siaLicense: 'SIA-2345-6789-CP',
      yearsExperience: 8,
      specializations: ['Airport Security', 'Route Protection'],
      rating: 5,
      vehicle: 'Mercedes E-Class (Security Package)',
      initials: 'SM'
    },
    timeAgo: '1 hour ago',
    securityStatus: 'approaching',
    progress: {
      current: 'CPO Approaching - Principal Secure',
      percentage: 35,
      eta: '8 mins'
    },
    threatLevel: 'low',
    specialRequirements: ['Airport Fast Track'],
    incidentReports: 0
  },
  {
    id: 'ASG-003',
    status: 'upcoming',
    title: 'Shadow Protection - Evening Event Security',
    serviceLevelId: 'shadow',
    serviceLevelName: 'Shadow Protection',
    fromLocation: 'The Dorchester Hotel, Mayfair',
    toLocation: 'Royal Opera House, Covent Garden',
    scheduledTime: 'Tomorrow 19:00',
    protectionDuration: {
      totalHours: 5,
      completedHours: 0,
      minimumHours: 3
    },
    totalInvestment: 325,
    memberDiscount: 50,
    officer: {
      name: 'Marcus Thompson',
      designation: 'Elite CPO',
      siaLicense: 'SIA-3456-7890-CP',
      yearsExperience: 15,
      specializations: ['Covert Protection', 'Event Security', 'Threat Neutralization'],
      rating: 5,
      vehicle: 'BMW X5 (Tactical Package)',
      initials: 'MT'
    },
    timeAgo: 'Scheduled',
    securityStatus: 'advance-team',
    threatLevel: 'medium',
    specialRequirements: ['Covert Operations', 'Event Advance Team'],
    incidentReports: 0
  },
  {
    id: 'ASG-004',
    status: 'upcoming',
    title: 'Executive Protection - Corporate Security Detail',
    serviceLevelId: 'executive',
    serviceLevelName: 'Executive Protection',
    fromLocation: 'Private Residence, Chelsea',
    toLocation: 'Lloyd\'s Building, City of London',
    scheduledTime: 'Friday 09:00',
    protectionDuration: {
      totalHours: 6,
      completedHours: 0,
      minimumHours: 3
    },
    totalInvestment: 450,
    memberDiscount: 50,
    officer: {
      name: 'CPO Assignment Pending',
      designation: 'Elite CPO',
      siaLicense: 'SIA Verified',
      yearsExperience: 0,
      specializations: ['Executive Protection', 'Corporate Security'],
      rating: 0,
      vehicle: 'Premium Security Vehicle',
      initials: 'TBA'
    },
    timeAgo: 'Protection Detail Active',
    threatLevel: 'low',
    specialRequirements: ['Corporate Access', 'Executive Briefing']
  },
  {
    id: 'ASG-005',
    status: 'completed',
    title: 'Essential Protection - Secure Shopping Detail',
    serviceLevelId: 'essential',
    serviceLevelName: 'Essential Protection',
    fromLocation: 'Private Residence, Hampstead',
    toLocation: 'Westfield Shopping Centre, Stratford',
    scheduledTime: '10:00',
    protectionDuration: {
      totalHours: 3,
      completedHours: 3,
      minimumHours: 2
    },
    totalInvestment: 135,
    memberDiscount: 50,
    officer: {
      name: 'David Wilson',
      designation: 'CPO',
      siaLicense: 'SIA-4567-8901-CP',
      yearsExperience: 6,
      specializations: ['Personal Protection', 'Crowd Management'],
      rating: 5,
      vehicle: 'Audi A4 (Security Package)',
      initials: 'DW'
    },
    timeAgo: 'Yesterday',
    securityStatus: 'with-principal',
    progress: {
      current: 'Principal Delivered Safely',
      percentage: 100
    },
    threatLevel: 'low',
    specialRequirements: ['Public Area Security'],
    incidentReports: 0
  },
  {
    id: 'ASG-006',
    status: 'completed',
    title: 'Executive Protection - High-Profile Corporate Event',
    serviceLevelId: 'executive',
    serviceLevelName: 'Executive Protection',
    fromLocation: 'Corporate Headquarters, Canary Wharf',
    toLocation: 'Guildhall, City of London',
    scheduledTime: '18:30',
    protectionDuration: {
      totalHours: 4,
      completedHours: 4,
      minimumHours: 3
    },
    totalInvestment: 360,
    memberDiscount: 50,
    officer: {
      name: 'Emma Clarke',
      designation: 'Senior CPO',
      siaLicense: 'SIA-5678-9012-CP',
      yearsExperience: 10,
      specializations: ['Executive Protection', 'Event Security', 'Diplomatic Protocol'],
      rating: 5,
      vehicle: 'BMW 7 Series (Executive Package)',
      initials: 'EC'
    },
    timeAgo: '3 days ago',
    securityStatus: 'with-principal',
    progress: {
      current: 'Protection Detail Completed Successfully',
      percentage: 100
    },
    threatLevel: 'medium',
    specialRequirements: ['VIP Access', 'Diplomatic Protocol'],
    incidentReports: 0
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
      case 'active': return 'Protection Active';
      case 'upcoming': return 'Protection Scheduled';
      case 'completed': return 'Mission Complete';
      default: return '';
    }
  }, []);

  const getProtectionTierBadge = useCallback((tier: ProtectionTier) => {
    switch (tier) {
      case 'essential': return { label: 'Essential Protection', color: '#1e40af', icon: '🛡️' };
      case 'executive': return { label: 'Executive Protection', color: '#d97706', icon: '👑' };
      case 'shadow': return { label: 'Shadow Protection', color: '#374151', icon: '🥷' };
      default: return { label: 'Protection Service', color: '#6b7280', icon: '🛡️' };
    }
  }, []);

  const getSecurityStatusMessage = useCallback((securityStatus?: SecurityStatus, eta?: string) => {
    switch (securityStatus) {
      case 'with-principal': return 'Protection Detail Active - With Principal';
      case 'approaching': return `CPO Approaching Principal${eta ? ` - ETA: ${eta}` : ''}`;
      case 'advance-team': return 'Advance Team Conducting Security Assessment';
      case 'covert': return 'Covert Operations - Shadow Mode Active';
      case 'incident-response': return '🚨 Incident Response - Immediate Action';
      case 'venue-sweep': return 'Venue Security Sweep - Protection Detail Active';
      case 'cpo-approaching': return 'CPO Approaching Principal';
      default: return 'Security Status Unknown';
    }
  }, []);

  const renderStars = useCallback((rating: number) => {
    return '⭐'.repeat(rating);
  }, []);

  const formatProtectionDuration = useCallback((duration: Assignment['protectionDuration']) => {
    const hoursRemaining = duration.totalHours - duration.completedHours;
    const progressPercentage = (duration.completedHours / duration.totalHours) * 100;
    return {
      text: `${duration.totalHours}hr Detail | ${duration.completedHours.toFixed(1)}hr Complete`,
      remaining: `${hoursRemaining.toFixed(1)}hr Remaining`,
      percentage: progressPercentage,
      isMinimumMet: duration.completedHours >= duration.minimumHours
    };
  }, []);

  const renderAssignmentCard = useCallback((assignment: Assignment) => {
    const tierBadge = getProtectionTierBadge(assignment.serviceLevelId);
    const durationInfo = formatProtectionDuration(assignment.protectionDuration);
    const securityMessage = assignment.securityStatus
      ? getSecurityStatusMessage(assignment.securityStatus, assignment.progress?.eta)
      : assignment.progress?.current || 'Status Unknown';

    return (
    <div key={assignment.id} className={`${styles.assignmentCard} ${styles.fadeIn} ${styles[`tier-${assignment.serviceLevelId}`]}`}>
      {/* Professional Status and Protection Tier Line */}
      <div className={styles.statusLine}>
        <div className={styles.statusGroup}>
          <span className={`${styles.statusBadge} ${getStatusBadgeClass(assignment.status)}`}>
            {assignment.status === 'active' && <span className={styles.pulsingDot}></span>}
            {getStatusText(assignment.status)}
          </span>
          <span className={styles.protectionTierBadge} style={{ borderColor: tierBadge.color, color: tierBadge.color }}>
            {tierBadge.icon} {tierBadge.label}
          </span>
        </div>
        <span className={styles.timeAgo}>• {assignment.timeAgo}</span>
      </div>

      {/* Protection Duration and Progress Line */}
      <div className={styles.durationLine}>
        <div className={styles.durationInfo}>
          <span className={styles.durationText}>{durationInfo.text}</span>
          {assignment.status === 'active' && (
            <span className={styles.remainingText}>{durationInfo.remaining}</span>
          )}
        </div>
        {assignment.totalInvestment && (
          <div className={styles.investmentInfo}>
            <span className={styles.totalInvestment}>£{assignment.totalInvestment}</span>
            {assignment.memberDiscount && (
              <span className={styles.memberDiscount}>-{assignment.memberDiscount}% Member</span>
            )}
          </div>
        )}
      </div>

      {/* Enhanced CPO Information Line */}
      <div className={styles.officerLine}>
        <div className={styles.officerAvatar}>
          <span className={styles.officerInitials}>{assignment.officer.initials}</span>
          <div className={styles.siaIndicator}>SIA</div>
        </div>
        <div className={styles.officerText}>
          <div className={styles.officerName}>
            {assignment.officer.name}
            <span className={styles.designation}>({assignment.officer.designation})</span>
          </div>
          <div className={styles.officerDetails}>
            <div className={styles.licenseInfo}>
              <strong>SIA License:</strong> {assignment.officer.siaLicense}
            </div>
            <div className={styles.experienceInfo}>
              {assignment.officer.yearsExperience > 0 && (
                <span>{assignment.officer.yearsExperience} Years Experience</span>
              )}
              {assignment.officer.rating > 0 && (
                <span className={styles.officerRating}> • {renderStars(assignment.officer.rating)}</span>
              )}
            </div>
            {assignment.officer.specializations && assignment.officer.specializations.length > 0 && (
              <div className={styles.specializations}>
                {assignment.officer.specializations.slice(0, 2).map((spec, index) => (
                  <span key={index} className={styles.specializationTag}>{spec}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Route and Security Information */}
      <div className={styles.routeSection}>
        <div className={styles.routeInfo}>
          <div className={styles.locationLine}>
            <span className={styles.locationIcon}>📍</span>
            <div className={styles.locationText}>
              <div className={styles.locationLabel}>Principal Location:</div>
              <div className={styles.locationAddress}>{assignment.fromLocation}</div>
            </div>
          </div>
          <div className={styles.routeArrow}>↓</div>
          <div className={styles.locationLine}>
            <span className={styles.locationIcon}>🎯</span>
            <div className={styles.locationText}>
              <div className={styles.locationLabel}>Destination:</div>
              <div className={styles.locationAddress}>{assignment.toLocation}</div>
            </div>
          </div>
        </div>
        {assignment.threatLevel && (
          <div className={styles.securityMeta}>
            <div className={styles.threatLevel}>
              <span className={`${styles.threatIndicator} ${styles[`threat-${assignment.threatLevel}`]}`}>
                Threat Level: {assignment.threatLevel.toUpperCase()}
              </span>
            </div>
            {assignment.specialRequirements && assignment.specialRequirements.length > 0 && (
              <div className={styles.requirements}>
                {assignment.specialRequirements.slice(0, 2).map((req, index) => (
                  <span key={index} className={styles.requirementTag}>{req}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Status and Progress Line */}
      <div className={styles.statusUpdateLine}>
        <div className={styles.securityStatus}>
          <span className={styles.statusIndicator}>
            {assignment.status === 'active' && assignment.securityStatus === 'with-principal' && '🟢'}
            {assignment.status === 'active' && assignment.securityStatus === 'approaching' && '🔵'}
            {assignment.status === 'active' && assignment.securityStatus === 'advance-team' && '🟡'}
            {assignment.status === 'upcoming' && '⚪'}
            {assignment.status === 'completed' && '✅'}
          </span>
          <span className={styles.statusMessage}>{securityMessage}</span>
        </div>
        {assignment.status === 'active' && assignment.progress && (
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${assignment.progress.percentage}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Professional Action Section */}
      <div className={styles.actionSection}>
        {assignment.status === 'active' && (
          <>
            <button className={styles.primaryAction}>🎯 Live Tracking</button>
            <button className={styles.secondaryAction}>📞 Contact CPO</button>
            <button className={styles.emergencyAction}>🚨 Emergency</button>
          </>
        )}
        {assignment.status === 'upcoming' && (
          <>
            <button className={styles.primaryAction}>📝 Modify Assignment</button>
            <button className={styles.secondaryAction}>❌ Cancel Protection</button>
            <button className={styles.tertiaryAction}>📋 Security Brief</button>
          </>
        )}
        {assignment.status === 'completed' && (
          <>
            <button className={styles.primaryAction}>🔄 Request Protection Again</button>
            <button className={styles.secondaryAction}>📄 Mission Report</button>
            <button className={styles.tertiaryAction}>⭐ Rate CPO</button>
          </>
        )}
      </div>
    </div>
    );
  }, [getStatusBadgeClass, getStatusText, getProtectionTierBadge, formatProtectionDuration, getSecurityStatusMessage, renderStars]);

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="48" fill="#F3F4F6"/>
          <path d="M48 24L60 36H54V48H42V36H36L48 24Z" fill="#9CA3AF"/>
          <rect x="32" y="52" width="32" height="20" rx="2" fill="#9CA3AF"/>
        </svg>
      </div>
      <h3 className={styles.emptyTitle}>No Active Protection Assignments</h3>
      <p className={styles.emptyDescription}>Request protection services when needed - Your security is our priority</p>
      <button
        className={styles.emptyAction}
        onClick={() => navigateToView('home')}
      >
🛡️ Request Protection Now
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
        <h1 className={styles.pageTitle}>🛡️ Protection Command Centre</h1>
        <p className={styles.pageSubtitle}>Professional close protection services - SIA licensed and vetted</p>
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
          🟢 Active Protection ({activeAssignments.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          📅 Scheduled ({upcomingAssignments.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'completed' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          ✅ Completed ({completedAssignments.length})
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
            <span className={styles.actionIcon}>🛡️</span>
            <span className={styles.actionLabel}>Request Protection</span>
          </button>
          <button className={styles.quickActionSecondary}>
            <span className={styles.actionIcon}>📋</span>
            <span className={styles.actionLabel}>Security Brief</span>
          </button>
          <button className={styles.quickActionSecondary}>
            <span className={styles.actionIcon}>🚨</span>
            <span className={styles.actionLabel}>Emergency Line</span>
          </button>
        </div>
      </div>
    </div>
  );
}