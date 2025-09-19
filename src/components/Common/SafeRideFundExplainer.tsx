// Armora Security Transport - Safe Ride Fund Explainer Component

import React, { useState, useEffect } from 'react';
import styles from './SafeRideFundExplainer.module.css';

interface SafeRideFundExplainerProps {
  variant?: 'compact' | 'full' | 'breakdown';
  showAnimation?: boolean;
  className?: string;
}

// Mock data for Safe Ride Fund
const safeRideFundData = {
  charityPartners: [
    {
      name: "Refuge UK",
      description: "Supporting victims of domestic abuse",
      monthlyAmount: 2340,
      logo: "🏠"
    },
    {
      name: "Suzy Lamplugh Trust", 
      description: "Personal safety charity",
      monthlyAmount: 1560,
      logo: "🛡️"
    }
  ],
  
  impactStories: [
    {
      id: 1,
      title: "Safe Late Night Transport",
      story: "Thanks to the Safe Ride Fund, Sarah was able to reach a women's refuge at 2 AM when she had no money for transport.",
      date: "3 days ago",
      isAnonymous: true
    },
    {
      id: 2,
      title: "Essential Healthcare Access", 
      story: "The fund helped Mark visit his daughter in hospital when unexpected medical costs left him unable to afford transport.",
      date: "1 week ago",
      isAnonymous: false
    }
  ],
  
  monthlyStats: {
    ridesProvided: 278,
    peopleHelped: 834,
    averageDistance: "7.2 miles",
    peakHour: "11 PM - 2 AM"
  }
};

export function SafeRideFundExplainer({ 
  variant = 'full', 
  showAnimation = true,
  className = ''
}: SafeRideFundExplainerProps) {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (showAnimation && variant !== 'compact') {
      let start = 0;
      const target = safeRideFundData.monthlyStats.ridesProvided;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setAnimatedCount(target);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setAnimatedCount(safeRideFundData.monthlyStats.ridesProvided);
    }
  }, [showAnimation, variant]);

  if (variant === 'compact') {
    return (
      <div className={`${styles.compactContainer} ${className}`}>
        <div className={styles.compactContent}>
          <div className={styles.impactIcon}>🛡️</div>
          <div className={styles.compactText}>
            <span className={styles.impactAmount}>£4</span> of your £14.99 funds safe rides & charities
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'breakdown') {
    return (
      <div className={`${styles.breakdownContainer} ${className}`}>
        <div className={styles.breakdownHeader}>
          <h3 className={styles.breakdownTitle}>Your £14.99 Essential Subscription:</h3>
        </div>
        <div className={styles.breakdownChart}>
          <div className={styles.breakdownRow}>
            <div className={styles.breakdownLabel}>£10.99</div>
            <div className={styles.breakdownBar}>
              <div className={styles.breakdownFill} style={{ width: '73%' }}></div>
            </div>
            <div className={styles.breakdownDesc}>Your Benefits & Service</div>
          </div>
          <div className={`${styles.breakdownRow} ${styles.impactRow}`}>
            <div className={styles.breakdownLabel}>£3</div>
            <div className={styles.breakdownBar}>
              <div className={`${styles.breakdownFill} ${styles.impactFill}`} style={{ width: '20%' }}></div>
            </div>
            <div className={styles.breakdownDesc}>Safety Charities</div>
          </div>
          <div className={`${styles.breakdownRow} ${styles.impactRow}`}>
            <div className={styles.breakdownLabel}>£1</div>
            <div className={styles.breakdownBar}>
              <div className={`${styles.breakdownFill} ${styles.impactFill}`} style={{ width: '7%' }}></div>
            </div>
            <div className={styles.breakdownDesc}>Safe Transport Assistance</div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.icon}>🛡️</div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>Safe Ride Fund</h3>
          <p className={styles.subtitle}>
            Part of your Essential membership helps keep others safe
          </p>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.mainStat}>
          <div className={styles.statNumber}>
            {showAnimation ? (
              <span className={styles.animatedNumber}>{animatedCount}</span>
            ) : (
              <span>{safeRideFundData.monthlyStats.ridesProvided}</span>
            )}
          </div>
          <div className={styles.statLabel}>safe rides funded this month</div>
        </div>

        <div className={styles.subStats}>
          <div className={styles.subStat}>
            <span className={styles.subStatNumber}>{safeRideFundData.monthlyStats.peopleHelped}</span>
            <span className={styles.subStatLabel}>people helped</span>
          </div>
          <div className={styles.subStat}>
            <span className={styles.subStatNumber}>{safeRideFundData.monthlyStats.averageDistance}</span>
            <span className={styles.subStatLabel}>avg distance</span>
          </div>
        </div>
      </div>

      <button 
        className={styles.detailsToggle}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide Details' : 'How it works'} 
        <span className={styles.toggleIcon}>{showDetails ? '▲' : '▼'}</span>
      </button>

      {showDetails && (
        <div className={styles.detailsContainer}>
          <div className={styles.allocation}>
            <h4 className={styles.allocationTitle}>£4 from your £14.99 subscription goes to:</h4>
            <div className={styles.allocationList}>
              <div className={styles.allocationItem}>
                <div className={styles.allocationAmount}>£3</div>
                <div className={styles.allocationDesc}>Partner safety charities</div>
              </div>
              <div className={styles.allocationItem}>
                <div className={styles.allocationAmount}>£1</div>
                <div className={styles.allocationDesc}>Safe transport assistance for vulnerable communities</div>
              </div>
            </div>
          </div>

          <div className={styles.partners}>
            <h4 className={styles.partnersTitle}>Our Partner Charities:</h4>
            <div className={styles.partnersList}>
              {safeRideFundData.charityPartners.map((partner, index) => (
                <div key={index} className={styles.partner}>
                  <div className={styles.partnerLogo}>{partner.logo}</div>
                  <div className={styles.partnerInfo}>
                    <div className={styles.partnerName}>{partner.name}</div>
                    <div className={styles.partnerDesc}>{partner.description}</div>
                    <div className={styles.partnerAmount}>£{partner.monthlyAmount.toLocaleString()}/month</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.stories}>
            <h4 className={styles.storiesTitle}>Recent Impact:</h4>
            <div className={styles.storiesList}>
              {safeRideFundData.impactStories.slice(0, 2).map((story) => (
                <div key={story.id} className={styles.story}>
                  <div className={styles.storyHeader}>
                    <div className={styles.storyTitle}>{story.title}</div>
                    <div className={styles.storyDate}>{story.date}</div>
                  </div>
                  <p className={styles.storyText}>{story.story}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}