// Armora Security Transport - Safe Ride Fund Explainer Component

import React, { useState, useEffect } from 'react';
import styles from './ArmoraFoundationExplainer.module.css';

interface ArmoraFoundationExplainerProps {
  variant?: 'compact' | 'full' | 'breakdown';
  showAnimation?: boolean;
  className?: string;
}

// Mock data for Armora Foundation
const amoraFoundationData = {
  charityPartners: [
    {
      name: "Code Academy Partnership",
      description: "Coding bootcamp scholarships",
      monthlyAmount: 1800,
      logo: "💻"
    },
    {
      name: "Music Futures Studio",
      description: "Music production & equipment",
      monthlyAmount: 1200,
      logo: "🎵"
    }
  ],
  
  impactStories: [
    {
      id: 1,
      title: "First Developer Job",
      story: "Thanks to the Armora Foundation coding bootcamp, Sarah landed her first developer role at a fintech startup with a £45K salary.",
      date: "3 days ago",
      isAnonymous: false
    },
    {
      id: 2,
      title: "Music Producer Success",
      story: "The studio time helped Mark produce his first EP, which got picked up by an independent label for distribution.",
      date: "1 week ago",
      isAnonymous: false
    }
  ],
  
  monthlyStats: {
    programmesCompleted: 84,
    creativesHelped: 183,
    averageDuration: "8 weeks",
    peakProgram: "Coding Bootcamp"
  }
};

export function ArmoraFoundationExplainer({ 
  variant = 'full', 
  showAnimation = true,
  className = ''
}: ArmoraFoundationExplainerProps) {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (showAnimation && variant !== 'compact') {
      let start = 0;
      const target = amoraFoundationData.monthlyStats.programmesCompleted;
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
      setAnimatedCount(amoraFoundationData.monthlyStats.programmesCompleted);
    }
  }, [showAnimation, variant]);

  if (variant === 'compact') {
    return (
      <div className={`${styles.compactContainer} ${className}`}>
        <div className={styles.compactContent}>
          <div className={styles.impactIcon}>🛡️</div>
          <div className={styles.compactText}>
            <span className={styles.impactAmount}>£4</span> of your £14.99 funds creative education & skills
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
          <h3 className={styles.title}>Armora Foundation</h3>
          <p className={styles.subtitle}>
            Part of your Essential membership launches creative careers
          </p>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.mainStat}>
          <div className={styles.statNumber}>
            {showAnimation ? (
              <span className={styles.animatedNumber}>{animatedCount}</span>
            ) : (
              <span>{amoraFoundationData.monthlyStats.programmesCompleted}</span>
            )}
          </div>
          <div className={styles.statLabel}>creative programmes completed this month</div>
        </div>

        <div className={styles.subStats}>
          <div className={styles.subStat}>
            <span className={styles.subStatNumber}>{amoraFoundationData.monthlyStats.creativesHelped}</span>
            <span className={styles.subStatLabel}>creatives helped</span>
          </div>
          <div className={styles.subStat}>
            <span className={styles.subStatNumber}>{amoraFoundationData.monthlyStats.averageDuration}</span>
            <span className={styles.subStatLabel}>programme length</span>
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
                <div className={styles.allocationAmount}>£1.50</div>
                <div className={styles.allocationDesc}>Coding bootcamp scholarships</div>
              </div>
              <div className={styles.allocationItem}>
                <div className={styles.allocationAmount}>£1.50</div>
                <div className={styles.allocationDesc}>Music studio equipment & time</div>
              </div>
              <div className={styles.allocationItem}>
                <div className={styles.allocationAmount}>£1</div>
                <div className={styles.allocationDesc}>Film equipment & mentorship</div>
              </div>
            </div>
          </div>

          <div className={styles.partners}>
            <h4 className={styles.partnersTitle}>Our Partner Charities:</h4>
            <div className={styles.partnersList}>
              {amoraFoundationData.charityPartners.map((partner, index) => (
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
              {amoraFoundationData.impactStories.slice(0, 2).map((story) => (
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