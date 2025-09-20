import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ProtectionControlPanel } from './ProtectionControlPanel';
import styles from './AssignmentsView.module.css';

type AssignmentStatus = 'active' | 'upcoming' | 'completed';
type ProtectionTier = 'essential' | 'executive' | 'shadow';
type SecurityStatus = 'with-principal' | 'approaching' | 'advance-team' | 'covert' | 'incident-response' | 'venue-sweep' | 'completing';

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
    designation: string;
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

// Mock assignment data focused on active protection details
const mockAssignments: Assignment[] = [
  {
    id: 'ASG-001',
    status: 'active',
    title: 'Executive Security Service - City Meeting',
    serviceLevelId: 'executive',
    serviceLevelName: 'Executive Security',
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
      designation: 'Senior Security Officer',
      siaLicense: 'SIA-1234-5678-CP',
      yearsExperience: 12,
      specializations: ['Executive Security', 'Safety Assessment', 'Medical Response'],
      rating: 5,
      vehicle: 'BMW 5 Series (Armoured)',
      initials: 'JD'
    },
    timeAgo: '2h 14m elapsed',
    securityStatus: 'with-principal',
    progress: {
      current: 'En route via A4 Westbound',
      percentage: 70,
      eta: '14 minutes'
    },
    threatLevel: 'medium',
    specialRequirements: ['Medical Support Available'],
    incidentReports: 0
  }
];

export function AssignmentsView() {
  const { navigateToView, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<AssignmentStatus>('active');
  const [isLocationSharing, setIsLocationSharing] = useState(true); // Default to active for demo
  const [currentTime, setCurrentTime] = useState(new Date());
  const assignments = mockAssignments;

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Memoize filtered assignments
  const activeAssignments = useMemo(() => assignments.filter(a => a.status === 'active'), [assignments]);
  const upcomingAssignments = useMemo(() => assignments.filter(a => a.status === 'upcoming'), [assignments]);
  const completedAssignments = useMemo(() => assignments.filter(a => a.status === 'completed'), [assignments]);

  // Set active assignment in context for auto-navigation
  // TODO: Fix type mismatch between local Assignment type and global Assignment type
  // useEffect(() => {
  //   if (activeAssignments.length > 0) {
  //     dispatch({ type: 'SET_ASSIGNMENT', payload: activeAssignments[0] });
  //   } else {
  //     dispatch({ type: 'SET_ASSIGNMENT', payload: null });
  //   }
  // }, [activeAssignments, dispatch]);

  const getSecurityStatusDisplay = useCallback((securityStatus?: SecurityStatus, eta?: string) => {
    switch (securityStatus) {
      case 'with-principal': return { text: '🟢 With You - All Secure', class: styles.statusSecure };
      case 'approaching': return { text: `🔴 On The Way to You${eta ? ` - ETA: ${eta}` : ''}`, class: styles.statusEnRoute };
      case 'advance-team': return { text: '🔵 Location Security Active', class: styles.statusVenue };
      case 'completing': return { text: '⚫ Service Completing', class: styles.statusCompleting };
      default: return { text: '🟡 Status Unknown', class: styles.statusUnknown };
    }
  }, []);

  const formatDuration = useCallback((duration: Assignment['protectionDuration']) => {
    const remaining = duration.totalHours - duration.completedHours;
    return {
      elapsed: `${Math.floor(duration.completedHours)}h ${Math.round((duration.completedHours % 1) * 60)}m elapsed`,
      remaining: `${remaining.toFixed(1)}hr remaining`,
      percentage: (duration.completedHours / duration.totalHours) * 100
    };
  }, []);

  // Control Panel Handlers
  const handleLocationToggle = useCallback(() => {
    setIsLocationSharing(!isLocationSharing);
    console.log('Location sharing toggled:', !isLocationSharing);
  }, [isLocationSharing]);

  const handleOfficerCall = useCallback(() => {
    console.log('Initiating officer call...');
    // In real app, this would open phone app or secure calling interface
    if (window.confirm('Call your Protection Officer John Davis directly?')) {
      // Simulate call initiation
      alert('Connecting to John Davis...');
    }
  }, []);


  const renderActiveAssignment = useCallback((assignment: Assignment) => {
    const durationInfo = formatDuration(assignment.protectionDuration);
    const statusInfo = getSecurityStatusDisplay(assignment.securityStatus, assignment.progress?.eta);
    const memberSavings = assignment.memberDiscount ? (assignment.totalInvestment * assignment.memberDiscount / 100) : 0;

    return (
      <div key={assignment.id} className={styles.activeAssignmentCard}>
        {/* COMMAND CENTER HEADER */}
        <div className={styles.commandCenterHeader}>
          <div className={styles.timeDisplay}>
            <span className={styles.timeLabel}>LOCAL TIME:</span>
            <span className={styles.timeValue}>{currentTime.toLocaleTimeString('en-GB', { hour12: false })}</span>
          </div>
          <div className={styles.protectionStatusHud}>
            <span className={styles.protectionActiveText}>PROTECTION ACTIVE</span>
            <div className={styles.statusPulse}></div>
          </div>
          <div className={styles.threatDisplay}>
            <span className={styles.threatLabel}>THREAT LEVEL:</span>
            <div className={styles.threatBar}>
              <div className={`${styles.threatSegment} ${styles[`threat${assignment.threatLevel?.toUpperCase() || 'MEDIUM'}`]}`}>
                <span className={styles.threatText}>{assignment.threatLevel?.toUpperCase() || 'MEDIUM'}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Clean Header Section */}
        <div className={styles.assignmentHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot}></span>
              <span className={styles.statusText}>YOU ARE PROTECTED</span>
            </div>
            <div className={styles.serviceInfo}>
              <span className={styles.serviceTier}>{assignment.serviceLevelName}</span>
              <span className={styles.separator}>|</span>
              <span className={styles.officerName}>{assignment.officer.name}</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.elapsedTime}>{durationInfo.elapsed}</div>
            <div className={styles.totalCost}>£{assignment.totalInvestment}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${durationInfo.percentage}%` }}
            ></div>
          </div>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>{durationInfo.remaining}</span>
            {memberSavings > 0 && (
              <span className={styles.memberRate}>Member rate: -£{memberSavings} (50% off)</span>
            )}
          </div>
        </div>

        {/* CP OFFICER DETAILS */}
        <div className={styles.protectionOfficerCard}>
          <div className={styles.officerHeader}>
            <h3 className={styles.officerSectionTitle}>CP OFFICER DETAILS</h3>
            <span className={styles.officerSubtitle}>SIA LICENSED PROTECTION SPECIALIST</span>
            <div className={styles.scanLine}></div>
          </div>
          <div className={styles.officerContent}>
            <div className={styles.officerAvatar}>
              <span className={styles.officerInitials}>{assignment.officer.initials}</span>
            </div>
            <div className={styles.officerInfo}>
              <div className={styles.officerName}>
                {assignment.officer.name} - Senior CP Officer
              </div>
              <div className={styles.officerRole}>Close Protection Specialist</div>
              <div className={styles.officerCredentials}>
                <span className={styles.siaLicense}>SIA: {assignment.officer.siaLicense.replace('SIA-', '').replace(/-/g, '-')}</span>
                <span className={styles.verifiedBadge}>[VERIFIED]</span>
              </div>
              <div className={styles.experienceBar}>
                <span className={styles.experienceLabel}>Experience Level:</span>
                <div className={styles.skillBar}>
                  <div className={styles.skillFill} style={{ width: `${(assignment.officer.yearsExperience / 15) * 100}%` }}></div>
                </div>
                <span className={styles.experienceYears}>{assignment.officer.yearsExperience} Years</span>
              </div>
              <div className={styles.specializations}>
                {assignment.officer.specializations.slice(0, 3).map((spec, index) => (
                  <span key={index} className={styles.specChip}>{spec}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* OPERATION TIMELINE */}
        <div className={styles.operationTimeline}>
          <div className={styles.timelineHeader}>
            <h3 className={styles.timelineTitle}>OPERATION TIMELINE</h3>
            <div className={styles.elapsedCounter}>
              <span className={styles.elapsedLabel}>ELAPSED:</span>
              <span className={styles.elapsedTime}>{durationInfo.elapsed.replace(' elapsed', '')}</span>
            </div>
          </div>

          <div className={styles.timelineEvents}>
            <div className={styles.timelineEvent}>
              <div className={`${styles.timelineNode} ${styles.nodeCompleted}`}></div>
              <div className={styles.timelineContent}>
                <div className={styles.eventTime}>{assignment.scheduledTime} | COMMENCED</div>
                <div className={styles.eventLocation}>{assignment.fromLocation}</div>
              </div>
            </div>

            <div className={styles.timelineConnector}></div>

            <div className={styles.timelineEvent}>
              <div className={`${styles.timelineNode} ${styles.nodeCurrent}`}></div>
              <div className={styles.timelineContent}>
                <div className={styles.eventTime}>{currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })} | EN ROUTE [LIVE]</div>
                <div className={styles.eventLocation}>{assignment.progress?.current || 'Via A4 Westbound'}</div>
                <div className={styles.eventEta}>ETA: T-{assignment.progress?.eta || '14:00'}</div>
              </div>
            </div>

            <div className={styles.timelineConnector}></div>

            <div className={styles.timelineEvent}>
              <div className={`${styles.timelineNode} ${styles.nodeFuture}`}></div>
              <div className={styles.timelineContent}>
                <div className={styles.eventTime}>17:00 | DESTINATION</div>
                <div className={styles.eventLocation}>{assignment.toLocation}</div>
                {assignment.specialRequirements && assignment.specialRequirements[0] && (
                  <div className={styles.eventRequirement}>{assignment.specialRequirements[0]}</div>
                )}
              </div>
            </div>
          </div>

          {/* LIVE TRACKING SECTION */}
          <div className={styles.liveTracking}>
            <div className={styles.trackingHeader}>[ SATELLITE TRACKING ACTIVE ]</div>
            <div className={styles.trackingFrame}>
              <div className={styles.cornerBracket} data-position="top-left"></div>
              <div className={styles.cornerBracket} data-position="top-right"></div>
              <div className={styles.cornerBracket} data-position="bottom-left"></div>
              <div className={styles.cornerBracket} data-position="bottom-right"></div>

              <div className={styles.trackingContent}>
                <button className={styles.currentPositionBtn}>
                  <div className={styles.radarSweep}></div>
                  <span className={styles.positionText}>Current Position</span>
                </button>
                <div className={styles.gpsCoordinates}>
                  <span className={styles.coordLabel}>GPS:</span>
                  <span className={styles.coordValue}>51.5074°N, 0.1278°W</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Protection Control Panel moved to sticky bottom */}
      </div>
    );
  }, [formatDuration, getSecurityStatusDisplay, isLocationSharing, handleLocationToggle, handleOfficerCall]);

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>🛡️</div>
      <h3 className={styles.emptyTitle}>No Active Security Services</h3>
      <p className={styles.emptyDescription}>Book security services when you need them - Your safety is our priority</p>
      <button
        className={styles.emptyAction}
        onClick={() => navigateToView('booking')}
      >
        🛡️ Book Security Now
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
        {assignmentsToShow.map(assignment =>
          assignment.status === 'active' ? renderActiveAssignment(assignment) : renderEmptyState()
        )}
      </div>
    );
  };

  return (
    <div className={styles.assignmentsView}>
      {/* Simplified Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Assignments</h1>

        {/* Security Status Bar - Moved to top */}
        {activeAssignments.length > 0 && (
          <div className={styles.topSecurityStatusBar}>
            <div className={styles.statusIndicator}>
              <div className={styles.statusPulseDot}></div>
              <span className={styles.statusText}>
                {activeAssignments[0].securityStatus === 'with-principal'
                  ? 'STATUS: PROTECTION ACTIVE | ALL SECURE'
                  : activeAssignments[0].securityStatus === 'approaching'
                  ? `STATUS: OFFICER EN ROUTE | ETA: ${activeAssignments[0].progress?.eta || '15 MINUTES'}`
                  : activeAssignments[0].securityStatus === 'venue-sweep'
                  ? 'STATUS: AT VENUE | OFFICER STANDING BY'
                  : 'STATUS: PROTECTION ACTIVE | ALL SECURE'
                }
              </span>
            </div>
          </div>
        )}

        <p className={styles.pageSubtitle}>Professional security services - Licensed and background checked</p>

        {/* Subtle Recruitment Chip */}
        <button className={styles.recruitmentChip} onClick={() => console.log('Officer recruitment modal')}>
          <span className={styles.chipIcon}>💼</span>
          <span className={styles.chipText}>Join Our Team</span>
          <span className={styles.chipArrow}>→</span>
        </button>
      </div>

      {/* Clean Status Tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('active')}
        >
          🟢 Active ({activeAssignments.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          📅 Upcoming ({upcomingAssignments.length})
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

      {/* Sticky Protection Control Panel - Only show for active assignments */}
      {activeTab === 'active' && activeAssignments.length > 0 && (
        <ProtectionControlPanel
          officer={{
            name: activeAssignments[0].officer.name,
            designation: activeAssignments[0].officer.designation,
            initials: activeAssignments[0].officer.initials
          }}
          assignment={activeAssignments[0]}
          isLocationSharing={isLocationSharing}
          onLocationToggle={handleLocationToggle}
          onOfficerCall={handleOfficerCall}
          assignmentId={activeAssignments[0].id}
          currentRate={75} // Executive rate for demo
        />
      )}

    </div>
  );
}