import { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { CurrentCard } from './CardComponents/CurrentCard';
import { UpcomingCard } from './CardComponents/UpcomingCard';
import { CompletedCard } from './CardComponents/CompletedCard';
import { AnalyticsCard } from './CardComponents/AnalyticsCard';
import { useSwipeGesture } from '../../../hooks/useSwipeGesture';
import styles from './NavigationCards.module.css';

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

interface NavigationCardsProps {
  activeSection: AssignmentStatus;
  setActiveSection: (section: AssignmentStatus) => void;
  assignmentCounts: {
    current: number;
    upcoming: number;
    completed: number;
  };
  currentAssignments: Assignment[];
  upcomingAssignments: Assignment[];
  completedAssignments: Assignment[];
}

export const NavigationCards: FC<NavigationCardsProps> = ({
  activeSection,
  setActiveSection,
  assignmentCounts,
  currentAssignments,
  upcomingAssignments,
  completedAssignments
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // No longer needed - individual cards handle their own display logic

  // Memoized current assignment data - use real assignment if available
  const currentData = useMemo(() => {
    const currentAssignment = currentAssignments[0];
    return currentAssignment ? {
      status: "Protection Detail Active",
      timeRemaining: currentAssignment.duration,
      officerName: currentAssignment.officerName,
      officerStatus: "online" as const,
      currentLocation: currentAssignment.location.start,
      serviceTier: currentAssignment.serviceTier,
      runningFare: `£${currentAssignment.totalCost}`,
      progressPercent: 75,
      eta: currentAssignment.time,
      count: assignmentCounts.current,
      // Add real assignment details for display
      assignmentData: currentAssignment
    } : {
      status: "No Active Protection",
      timeRemaining: "0 minutes",
      officerName: "No Officer Assigned",
      officerStatus: "offline" as const,
      currentLocation: "No Location",
      serviceTier: "Essential" as const,
      runningFare: "£0",
      progressPercent: 0,
      eta: "N/A",
      count: 0,
      assignmentData: null
    };
  }, [currentAssignments, assignmentCounts.current]);

  // Memoized upcoming assignment data - use real assignment if available
  const upcomingData = useMemo(() => {
    const upcomingAssignment = upcomingAssignments[0];
    return upcomingAssignment ? {
      nextAssignment: `${upcomingAssignment.date} ${upcomingAssignment.time}`,
      countdown: "18h 45m", // Calculate based on assignment date/time
      officerAssigned: upcomingAssignment.officerName,
      dayOfWeek: new Date(upcomingAssignment.date).toLocaleDateString('en-US', { weekday: 'long' }),
      totalScheduled: upcomingAssignments.length,
      duration: upcomingAssignment.duration,
      favoriteTimeSlot: true,
      miniCalendar: [2, 4, 5], // Booked days in next 7 days
      weather: "☀️",
      count: assignmentCounts.upcoming,
      // Add real assignment details for display
      assignmentData: upcomingAssignment
    } : {
      nextAssignment: "No upcoming assignments",
      countdown: "N/A",
      officerAssigned: "No Officer Assigned",
      dayOfWeek: "N/A",
      totalScheduled: 0,
      duration: "No assignments scheduled",
      favoriteTimeSlot: false,
      miniCalendar: [],
      weather: "☀️",
      count: 0,
      assignmentData: null
    };
  }, [upcomingAssignments, assignmentCounts.upcoming]);

  // Memoized completed data
  const completedData = useMemo(() => ({
    monthLabel: "This Month",
    totalCompleted: 3,
    averageRating: 4.9,
    lastAssignment: "2 hours ago",
    pendingRatings: 3,
    loyaltyPoints: 850,
    pointsToNextTier: 150,
    spentThisMonth: "£890",
    monthProgress: 15, // Added missing monthProgress property
    savedThisMonth: "£125", // Added missing savedThisMonth property
    count: assignmentCounts.completed
  }), [assignmentCounts.completed]);

  // Memoized analytics data
  const analyticsData = useMemo(() => ({
    monthlySpend: 2450,
    spendTrend: -18, // percentage vs last month
    sparklineData: [2200, 2100, 2300, 2250, 2400, 2300, 2450], // last 7 data points
    topStat: "127 hours protected",
    spendingLabel: "£2,450 monthly spending",
    reportStatus: "Ready" as const,
    lastUpdated: "2 hours ago",
    hasNewReport: true,
    savingsAchieved: 245, // Added missing savingsAchieved property
    // Enhanced analytics data
    totalHours: 127,
    totalInvestment: 8450,
    avgRating: 4.9,
    statusProgress: 76, // Progress to Platinum status (230/300)
    weeklyData: [
      { label: 'Mon', value: 8 },
      { label: 'Tue', value: 12 },
      { label: 'Wed', value: 6 },
      { label: 'Thu', value: 15 },
      { label: 'Fri', value: 9 },
      { label: 'Sat', value: 4 },
      { label: 'Sun', value: 3 }
    ],
    monthlyTrend: 12, // percentage increase in monthly investment
    favoriteRoutes: [
      { route: 'Home ↔ Office', frequency: 65 },
      { route: 'Office ↔ Airport', frequency: 22 },
      { route: 'Home ↔ Restaurant', frequency: 13 }
    ],
    peakTimes: [
      { time: 'Weekday evenings', percentage: 45 },
      { time: 'Monday mornings', percentage: 28 },
      { time: 'Friday afternoons', percentage: 18 }
    ],
    protectionPatterns: {
      mostUsedTier: 'Executive',
      averageAssignmentDuration: 3.2,
      frequentDestinations: ['Central London', 'Canary Wharf', 'Heathrow Airport'],
      weekdayVsWeekend: { weekday: 78, weekend: 22 }
    }
  }), []);

  // Keyboard navigation across tabs
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const sections: AssignmentStatus[] = ['current', 'upcoming', 'completed', 'analytics'];
    const idx = sections.indexOf(activeSection);
    if (idx === -1) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = sections[(idx + 1) % sections.length];
      setActiveSection(next);
      const el = document.getElementById(`tab-${next}`);
      el?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = sections[(idx - 1 + sections.length) % sections.length];
      setActiveSection(prev);
      const el = document.getElementById(`tab-${prev}`);
      el?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveSection(sections[0]);
      document.getElementById(`tab-${sections[0]}`)?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveSection(sections[sections.length - 1]);
      document.getElementById(`tab-${sections[sections.length - 1]}`)?.focus();
    }
  }, [activeSection, setActiveSection]);

  // Swipe navigation between sections
  const sections: AssignmentStatus[] = ['current', 'upcoming', 'completed', 'analytics'];
  const navigateSection = useCallback((direction: 'next' | 'prev') => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % sections.length
      : (currentIndex - 1 + sections.length) % sections.length;

    setActiveSection(sections[nextIndex]);
  }, [activeSection, setActiveSection]);

  const { swipeProps } = useSwipeGesture({
    onSwipeLeft: () => navigateSection('next'),
    onSwipeRight: () => navigateSection('prev'),
  }, {
    threshold: 50,
    prevent: false,
  });

  return (
    <div
      className={styles.navigationGrid}
      role="tablist"
      aria-label="Assignment sections"
      onKeyDown={onKeyDown}
      {...swipeProps}
    >
      <CurrentCard
        data={currentData}
        isActive={activeSection === 'current'}
        onClick={useCallback(() => setActiveSection('current'), [setActiveSection])}
        screenWidth={screenWidth}
        tabId="tab-current"
        ariaControls="panel-current"
      />

      <UpcomingCard
        data={upcomingData}
        isActive={activeSection === 'upcoming'}
        onClick={useCallback(() => setActiveSection('upcoming'), [setActiveSection])}
        screenWidth={screenWidth}
        tabId="tab-upcoming"
        ariaControls="panel-upcoming"
      />

      <CompletedCard
        data={completedData}
        isActive={activeSection === 'completed'}
        onClick={useCallback(() => setActiveSection('completed'), [setActiveSection])}
        screenWidth={screenWidth}
        tabId="tab-completed"
        ariaControls="panel-completed"
      />

      <AnalyticsCard
        data={analyticsData}
        isActive={activeSection === 'analytics'}
        onClick={useCallback(() => setActiveSection('analytics'), [setActiveSection])}
        screenWidth={screenWidth}
        tabId="tab-analytics"
        ariaControls="panel-analytics"
      />
    </div>
  );
};