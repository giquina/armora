import React, { useState, useEffect } from 'react';
import { CurrentCard } from './CardComponents/CurrentCard';
import { UpcomingCard } from './CardComponents/UpcomingCard';
import { CompletedCard } from './CardComponents/CompletedCard';
import { AnalyticsCard } from './CardComponents/AnalyticsCard';
import styles from './NavigationCards.module.css';

type AssignmentStatus = 'current' | 'upcoming' | 'completed' | 'analytics';

interface NavigationCardsProps {
  activeSection: AssignmentStatus;
  setActiveSection: (section: AssignmentStatus) => void;
  assignmentCounts: {
    current: number;
    upcoming: number;
    completed: number;
  };
}

export const NavigationCards: React.FC<NavigationCardsProps> = ({
  activeSection,
  setActiveSection,
  assignmentCounts
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // No longer needed - individual cards handle their own display logic

  // Mock data - in real app, this would come from context/props
  const currentData = {
    status: "Protection Detail Active",
    timeRemaining: "1h 23m remaining",
    officerName: "John Davis",
    officerStatus: "online" as const,
    currentLocation: "Near Mayfair",
    serviceTier: "Executive" as const,
    runningFare: "£245.50",
    progressPercent: 75,
    eta: "16:45",
    count: assignmentCounts.current
  };

  const upcomingData = {
    nextAssignment: "Tomorrow 9:00 AM",
    countdown: "18h 45m",
    officerAssigned: "Sarah Chen",
    weather: "☀️",
    dayOfWeek: "Thursday",
    totalScheduled: 3,
    favoriteTimeSlot: true,
    miniCalendar: [2, 4, 5], // Booked days in next 7 days
    count: assignmentCounts.upcoming
  };

  const completedData = {
    monthProgress: 23, // out of 31 days
    totalCompleted: 47,
    averageRating: 4.9,
    lastAssignment: "2 hours ago",
    pendingRatings: 3,
    loyaltyPoints: 850,
    pointsToNextTier: 150,
    savedThisMonth: "£890",
    count: assignmentCounts.completed
  };

  const analyticsData = {
    monthlySpend: 2450,
    spendTrend: -18, // percentage vs last month
    sparklineData: [2200, 2100, 2300, 2250, 2400, 2300, 2450], // last 7 data points
    topStat: "127 hours protected",
    savingsAchieved: 890,
    reportStatus: "Ready" as const,
    lastUpdated: "2 hours ago",
    hasNewReport: true
  };

  return (
    <div className={styles.navigationGrid}>
      <CurrentCard
        data={currentData}
        isActive={activeSection === 'current'}
        onClick={() => setActiveSection('current')}
        screenWidth={screenWidth}
      />

      <UpcomingCard
        data={upcomingData}
        isActive={activeSection === 'upcoming'}
        onClick={() => setActiveSection('upcoming')}
        screenWidth={screenWidth}
      />

      <CompletedCard
        data={completedData}
        isActive={activeSection === 'completed'}
        onClick={() => setActiveSection('completed')}
        screenWidth={screenWidth}
      />

      <AnalyticsCard
        data={analyticsData}
        isActive={activeSection === 'analytics'}
        onClick={() => setActiveSection('analytics')}
        screenWidth={screenWidth}
      />
    </div>
  );
};