// Armora Security Transport - Impact Dashboard Widget

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SafeRideFundExplainer } from '../Common/SafeRideFundExplainer';
import styles from './ImpactDashboardWidget.module.css';

interface ImpactDashboardWidgetProps {
  className?: string;
}

// Mock data for user impact metrics
const generateUserImpactData = (userStartDate: Date) => {
  const monthsSinceJoined = Math.floor((new Date().getTime() - userStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const personalRidesFunded = Math.max(1, monthsSinceJoined);
  const totalContributed = monthsSinceJoined * 4; // £4 per month

  return {
    personalRidesFunded,
    totalContributed,
    currentStreak: monthsSinceJoined,
    monthlyContribution: 4,
    nextMilestone: Math.ceil(personalRidesFunded / 5) * 5, // Next multiple of 5
    progressToNextMilestone: ((personalRidesFunded % 5) || 5) / 5 * 100
  };
};

const communityImpactData = {
  totalMembers: 1247,
  monthlyRidesFunded: 278,
  totalRidesFunded: 3741,
  lastUpdated: new Date().toISOString()
};

const impactStories = [
  {
    id: 1,
    title: "Late Night Emergency",
    story: "Sarah was able to leave a dangerous situation at 2 AM thanks to the Safe Ride Fund.",
    impact: "Emergency transport when she had no money",
    timeframe: "3 days ago"
  },
  {
    id: 2,
    title: "Hospital Visit",
    story: "The fund helped Mark visit his daughter in hospital during a medical crisis.",
    impact: "Critical family support transport",
    timeframe: "1 week ago"
  },
  {
    id: 3,
    title: "Safe Return",
    story: "Emma got home safely after her phone died and she couldn't access her banking app.",
    impact: "Emergency safe passage home",
    timeframe: "2 weeks ago"
  }
];

export function ImpactDashboardWidget({ className = '' }: ImpactDashboardWidgetProps) {
  const { state } = useApp();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showFullExplainer, setShowFullExplainer] = useState(false);

  // Only show for Essential subscribers
  if (!state.subscription || state.subscription.tier !== 'essential') {
    return null;
  }

  // Generate user impact data based on subscription start date
  const userStartDate = state.subscription.startDate || new Date();
  const userImpact = generateUserImpactData(userStartDate);

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % impactStories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + impactStories.length) % impactStories.length);
  };

  const currentStory = impactStories[currentStoryIndex];

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <div className={styles.icon}>🛡️</div>
          <div className={styles.pulseRing}></div>
        </div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Your Impact</h3>
          <p className={styles.subtitle}>Making every ride count</p>
        </div>
        <button 
          className={styles.expandButton}
          onClick={() => setShowFullExplainer(!showFullExplainer)}
        >
          {showFullExplainer ? '−' : '+'}
        </button>
      </div>

      {showFullExplainer ? (
        <SafeRideFundExplainer variant="full" showAnimation={true} />
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.primaryStat}>
              <div className={styles.statNumber}>{userImpact.personalRidesFunded}</div>
              <div className={styles.statLabel}>safe rides funded</div>
              <div className={styles.statSubtext}>by you</div>
            </div>
            
            <div className={styles.secondaryStat}>
              <div className={styles.statNumber}>£{userImpact.totalContributed}</div>
              <div className={styles.statLabel}>total contributed</div>
            </div>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>
                Progress to next milestone: {userImpact.nextMilestone} rides
              </span>
              <span className={styles.progressPercentage}>
                {Math.round(userImpact.progressToNextMilestone)}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${userImpact.progressToNextMilestone}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.communitySection}>
            <h4 className={styles.communityTitle}>Community Impact</h4>
            <div className={styles.communityStats}>
              <div className={styles.communityStatsGrid}>
                <div className={styles.communityStat}>
                  <span className={styles.communityNumber}>{communityImpactData.monthlyRidesFunded}</span>
                  <span className={styles.communityLabel}>rides this month</span>
                </div>
                <div className={styles.communityStat}>
                  <span className={styles.communityNumber}>{communityImpactData.totalMembers.toLocaleString()}</span>
                  <span className={styles.communityLabel}>members</span>
                </div>
              </div>
              <div className={styles.totalImpact}>
                Together we've funded <strong>{communityImpactData.totalRidesFunded.toLocaleString()}</strong> safe journeys
              </div>
            </div>
          </div>

          <div className={styles.storySection}>
            <div className={styles.storyHeader}>
              <h4 className={styles.storyTitle}>Recent Impact</h4>
              <div className={styles.storyNavigation}>
                <button 
                  className={styles.storyNavButton}
                  onClick={prevStory}
                  disabled={impactStories.length <= 1}
                >
                  ‹
                </button>
                <span className={styles.storyCounter}>
                  {currentStoryIndex + 1} of {impactStories.length}
                </span>
                <button 
                  className={styles.storyNavButton}
                  onClick={nextStory}
                  disabled={impactStories.length <= 1}
                >
                  ›
                </button>
              </div>
            </div>
            
            <div className={styles.storyCard}>
              <div className={styles.storyCardHeader}>
                <div className={styles.storyCardTitle}>{currentStory.title}</div>
                <div className={styles.storyTimeframe}>{currentStory.timeframe}</div>
              </div>
              <p className={styles.storyText}>{currentStory.story}</p>
              <div className={styles.storyImpact}>
                <span className={styles.impactIcon}>✨</span>
                <span className={styles.impactText}>{currentStory.impact}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionSection}>
            <button 
              className={styles.viewReportButton}
              onClick={() => setShowFullExplainer(true)}
            >
              View Full Impact Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}