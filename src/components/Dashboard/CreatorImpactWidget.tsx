// Armora Security Transport - Impact Dashboard Widget

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ArmoraFoundationExplainer } from '../ArmoraFoundation/ArmoraFoundationExplainer';
import styles from './CreatorImpactWidget.module.css';

interface CreatorImpactWidgetProps {
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
  totalMembers: 312,
  monthlyLearners: 84,
  totalCareersLaunched: 427,
  lastUpdated: new Date().toISOString()
};

const impactStories = [
  {
    id: 1,
    title: "First App Launch",
    story: "Tom launched his first mobile app after completing our coding bootcamp - it hit 5K downloads in week one.",
    impact: "Career launched in tech",
    timeframe: "3 days ago"
  },
  {
    id: 2,
    title: "Spotify Success",
    story: "Maya's track from our music program just hit 10K streams and caught attention from a major label.",
    impact: "Music career breakthrough",
    timeframe: "1 week ago"
  },
  {
    id: 3,
    title: "Film Festival Win",
    story: "Alex's short film from our media workshop was selected for the London Youth Film Festival.",
    impact: "Recognition in film industry",
    timeframe: "2 weeks ago"
  },
  {
    id: 4,
    title: "Cohort Graduation",
    story: "Coding cohort #12 just graduated with 100% pass rate - all 15 students found placement within a month.",
    impact: "Perfect success rate",
    timeframe: "1 month ago"
  }
];

export function CreatorImpactWidget({ className = '' }: CreatorImpactWidgetProps) {
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
          <h3 className={styles.title}>Your Creative Impact</h3>
          <p className={styles.subtitle}>Launching the next generation</p>
        </div>
        <button 
          className={styles.expandButton}
          onClick={() => setShowFullExplainer(!showFullExplainer)}
        >
          {showFullExplainer ? '−' : '+'}
        </button>
      </div>

      {showFullExplainer ? (
        <ArmoraFoundationExplainer variant="full" showAnimation={true} />
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.primaryStat}>
              <div className={styles.statNumber}>3</div>
              <div className={styles.statLabel}>coding scholarships</div>
              <div className={styles.statSubtext}>funded by you</div>
            </div>
            
            <div className={styles.secondaryStat}>
              <div className={styles.statNumber}>2</div>
              <div className={styles.statLabel}>studio sessions enabled</div>
            </div>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>
                Progress to next milestone: 5 scholarships
              </span>
              <span className={styles.progressPercentage}>
                60%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: '60%' }}
              ></div>
            </div>
          </div>

          <div className={styles.communitySection}>
            <h4 className={styles.communityTitle}>Creative Community Impact</h4>
            <div className={styles.communityStats}>
              <div className={styles.communityStatsGrid}>
                <div className={styles.communityStat}>
                  <span className={styles.communityNumber}>{communityImpactData.monthlyLearners}</span>
                  <span className={styles.communityLabel}>learners this month</span>
                </div>
                <div className={styles.communityStat}>
                  <span className={styles.communityNumber}>{communityImpactData.totalMembers.toLocaleString()}</span>
                  <span className={styles.communityLabel}>members</span>
                </div>
              </div>
              <div className={styles.totalImpact}>
                Together we've launched <strong>{communityImpactData.totalCareersLaunched.toLocaleString()}</strong> creative careers
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
              View Full Creative Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}