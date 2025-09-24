import React, { useState, useEffect, useCallback } from 'react';
import { CurrentCard } from './CardComponents/CurrentCard';
import { UpcomingCard } from './CardComponents/UpcomingCard';
import { CompletedCard } from './CardComponents/CompletedCard';
import { AnalyticsCard } from './CardComponents/AnalyticsCard';
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

export const NavigationCards: React.FC<NavigationCardsProps> = ({
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

  // Current assignment data - use real assignment if available
  const currentAssignment = currentAssignments[0];
  const currentData = currentAssignment ? {
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

  // Upcoming assignment data - use real assignment if available
  const upcomingAssignment = upcomingAssignments[0];
  const upcomingData = upcomingAssignment ? {
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

  const completedData = {
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
  };

  const analyticsData = {
    monthlySpend: 2450,
    spendTrend: -18, // percentage vs last month
    sparklineData: [2200, 2100, 2300, 2250, 2400, 2300, 2450], // last 7 data points
    topStat: "127 hours protected",
    spendingLabel: "£2,450 monthly spending",
    reportStatus: "Ready" as const,
    lastUpdated: "2 hours ago",
    hasNewReport: true,
    savingsAchieved: 245 // Added missing savingsAchieved property
  };

  // Keyboard navigation across tabs
  const sections: AssignmentStatus[] = ['current', 'upcoming', 'completed', 'analytics'];
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
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
  }, [activeSection, setActiveSection, sections]);

  return (
    <div
      className={styles.navigationGrid}
      role="tablist"
      aria-label="Assignment sections"
      onKeyDown={onKeyDown}
    >
      <CurrentCard
        data={currentData}
        isActive={activeSection === 'current'}
        onClick={() => setActiveSection('current')}
        screenWidth={screenWidth}
        tabId="tab-current"
        ariaControls="panel-current"
      />

      <UpcomingCard
        data={upcomingData}
        isActive={activeSection === 'upcoming'}
        onClick={() => setActiveSection('upcoming')}
        screenWidth={screenWidth}
        tabId="tab-upcoming"
        ariaControls="panel-upcoming"
      />

      <CompletedCard
        data={completedData}
        isActive={activeSection === 'completed'}
        onClick={() => setActiveSection('completed')}
        screenWidth={screenWidth}
        tabId="tab-completed"
        ariaControls="panel-completed"
      />

      <AnalyticsCard
        data={analyticsData}
        isActive={activeSection === 'analytics'}
        onClick={() => setActiveSection('analytics')}
        screenWidth={screenWidth}
        tabId="tab-analytics"
        ariaControls="panel-analytics"
      />
    </div>
  );
};