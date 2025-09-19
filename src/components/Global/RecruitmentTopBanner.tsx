import React, { useState, useEffect } from 'react';
import styles from './RecruitmentTopBanner.module.css';

interface RecruitmentTopBannerProps {
  className?: string;
}

export function RecruitmentTopBanner({ className }: RecruitmentTopBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissedTimestamp = localStorage.getItem('armora_recruitment_top_banner_dismissed');

    if (dismissedTimestamp) {
      const dismissedDate = new Date(parseInt(dismissedTimestamp));
      const now = new Date();
      const daysSinceDismissed = Math.floor((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));

      // Show again after 7 days
      if (daysSinceDismissed >= 7) {
        localStorage.removeItem('armora_recruitment_top_banner_dismissed');
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } else {
      // Never dismissed, show banner
      setIsVisible(true);
    }

    setIsLoading(false);
  }, []);

  // Add/remove body class for proper spacing
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('has-recruitment-banner');
    } else {
      document.body.classList.remove('has-recruitment-banner');
    }

    return () => {
      document.body.classList.remove('has-recruitment-banner');
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('armora_recruitment_top_banner_dismissed', Date.now().toString());

    // Analytics
    console.log('[Analytics] Recruitment top banner dismissed', {
      timestamp: Date.now(),
      dismissalCount: parseInt(localStorage.getItem('armora_recruitment_top_dismissal_count') || '0') + 1
    });

    localStorage.setItem('armora_recruitment_top_dismissal_count',
      (parseInt(localStorage.getItem('armora_recruitment_top_dismissal_count') || '0') + 1).toString()
    );
  };

  const handleApplyClick = () => {
    // Analytics
    console.log('[Analytics] Recruitment top banner apply clicked', {
      timestamp: Date.now(),
      source: 'top_banner',
      isExpanded
    });

    // For now, we'll navigate to the recruitment modal
    // In the future, this could navigate to a dedicated page
    window.open('https://armora.security/careers', '_blank');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);

    // Analytics
    console.log('[Analytics] Recruitment top banner expanded', {
      timestamp: Date.now(),
      isExpanded: !isExpanded
    });
  };

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.topBanner} ${className || ''} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.bannerContent}>
        <div className={styles.mainRow}>
          <div className={styles.bannerText}>
            <span className={styles.bannerTitle}>
              <span className={styles.desktopText}>Join Our Team • Recruiting SIA Close Protection Officers</span>
              <span className={styles.mobileText}>Join Our Team</span>
            </span>
          </div>

          <div className={styles.controls}>
            <button
              className={styles.applyButton}
              onClick={handleApplyClick}
              aria-label="Apply to join protection team"
            >
              Apply Now
            </button>

            <button
              className={styles.expandButton}
              onClick={toggleExpanded}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className={isExpanded ? styles.rotated : ''}
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>

            <button
              className={styles.closeButton}
              onClick={handleDismiss}
              aria-label="Dismiss banner"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className={styles.expandedContent}>
            <ul className={styles.highlights}>
              <li>Competitive rates: £28-45/hr</li>
              <li>Immediate start available</li>
              <li>SIA licensed officers wanted</li>
              <li>Click Apply Now to begin</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruitmentTopBanner;