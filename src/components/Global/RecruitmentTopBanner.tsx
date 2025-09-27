import { useState, useEffect, useRef } from 'react';
import styles from './RecruitmentTopBanner.module.css';

interface RecruitmentTopBannerProps {
  className?: string;
}

export function RecruitmentTopBanner({ className }: RecruitmentTopBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

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

  // Auto-close on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If user scrolls down more than 50px, close the dropdown
      if (currentScrollY > lastScrollY.current + 50 && isExpanded) {
        setIsExpanded(false);
      }

      lastScrollY.current = currentScrollY;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (bannerRef.current && !bannerRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('armora_recruitment_top_banner_dismissed', Date.now().toString());

    // Analytics
      timestamp: Date.now(),
      dismissalCount: parseInt(localStorage.getItem('armora_recruitment_top_dismissal_count') || '0') + 1
    });

    localStorage.setItem('armora_recruitment_top_dismissal_count',
      (parseInt(localStorage.getItem('armora_recruitment_top_dismissal_count') || '0') + 1).toString()
    );
  };

  const handleApplyClick = () => {
    // Analytics
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
      timestamp: Date.now(),
      isExpanded: !isExpanded
    });
  };

  const handleHeaderClick = (event: React.MouseEvent) => {
    // Don't toggle if clicking on apply button or close button
    const target = event.target as HTMLElement;
    if (target.closest(`.${styles.applyButton}`) || target.closest(`.${styles.closeButton}`)) {
      return;
    }
    toggleExpanded();
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
    <div ref={bannerRef} className={`${styles.topBanner} ${className || ''} ${isExpanded ? styles.expanded : ''}`}>
      {isExpanded && <div className={styles.backdrop} />}
      <div className={styles.bannerContent}>
        <div className={styles.mainRow} onClick={handleHeaderClick}>
          <div className={styles.bannerText}>
            <div className={styles.bannerTitle}>Recruiting SIA Close Protection Officers</div>
            <div className={styles.bannerSubtitle}>£28-45/hr • SIA License Required • Immediate Start</div>
          </div>

          <div className={styles.controls}>
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
            <div className={styles.benefitsSection}>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>💰</span>
                <span>£28-45/hour + tips + fuel</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>✓</span>
                <span>SIA license required</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>🕐</span>
                <span>Choose your own hours</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>📈</span>
                <span>Clear progression path</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}>⚡</span>
                <span>Start within 7 days</span>
              </div>
            </div>

            <div className={styles.separator}></div>

            <div className={styles.requirementsSection}>
              <div className={styles.requirementsTitle}>Requirements:</div>
              <ul className={styles.requirementsList}>
                <li>SIA Close Protection license</li>
                <li>UK driving license (2+ years)</li>
                <li>Enhanced DBS check</li>
                <li>Professional appearance</li>
              </ul>
            </div>

            <button
              className={styles.primaryApplyButton}
              onClick={handleApplyClick}
              aria-label="Apply to join protection team"
            >
              APPLY NOW - 5 minutes
            </button>

            <div className={styles.urgencyMessage}>
              <span className={styles.urgencyIcon}>🔥</span>
              <span>High demand - 47 positions open</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruitmentTopBanner;