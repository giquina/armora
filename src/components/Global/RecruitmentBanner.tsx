import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './RecruitmentBanner.module.css';

interface RecruitmentBannerProps {
  className?: string;
}

export function RecruitmentBanner({ className }: RecruitmentBannerProps) {
  const { state } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissedTimestamp = localStorage.getItem('armora_recruitment_banner_dismissed');

    if (dismissedTimestamp) {
      const dismissedDate = new Date(parseInt(dismissedTimestamp));
      const now = new Date();
      const daysSinceDismissed = Math.floor((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));

      // Show again after 7 days
      if (daysSinceDismissed >= 7) {
        localStorage.removeItem('armora_recruitment_banner_dismissed');
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

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('armora_recruitment_banner_dismissed', Date.now().toString());

    // Analytics
    console.log('Recruitment banner dismissed', {
      timestamp: Date.now(),
      dismissalCount: parseInt(localStorage.getItem('armora_recruitment_dismissal_count') || '0') + 1
    });

    localStorage.setItem('armora_recruitment_dismissal_count',
      (parseInt(localStorage.getItem('armora_recruitment_dismissal_count') || '0') + 1).toString()
    );
  };

  const handleApplyClick = () => {
    // Analytics
    console.log('Recruitment apply clicked', {
      timestamp: Date.now(),
      source: 'global_banner'
    });

    // Open recruitment page - in real app would navigate to application form
    window.open('https://armora.security/careers', '_blank');
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
    <div className={`${styles.recruitmentBanner} ${className || ''}`}>
      <div className={styles.bannerContent}>
        <div className={styles.bannerText}>
          <div className={styles.bannerTitle}>Join Our Team</div>
          <div className={styles.bannerDescription}>Recruiting SIA Close Protection Officers</div>
        </div>
        <button
          className={styles.applyButton}
          onClick={handleApplyClick}
          aria-label="Apply to join protection team"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default RecruitmentBanner;