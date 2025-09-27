import React, { useState, useEffect, useMemo } from 'react';
import { ServiceLevel, User, PersonalizationData } from '../../types';
import { generateRecommendation } from '../../utils/recommendationEngine';
import styles from './SmartRecommendation.module.css';

interface UserAssignmentHistory {
  totalAssignments: number;
  lastAssignmentDate: string | null;
  isFirstTimeUser: boolean;
  preferredService?: string;
}

interface SmartRecommendationProps {
  services: ServiceLevel[];
  user: User | null;
  questionnaireData: PersonalizationData | null;
  onServiceSelect: (serviceId: string) => void;
}

// Fixed CSS variables for border visibility + simplified content
export const SmartRecommendation: React.FC<SmartRecommendationProps> = ({
  services,
  user,
  questionnaireData,
  onServiceSelect
}) => {
  // User assignment history state
  const [userAssignmentHistory, setUserAssignmentHistory] = useState<UserAssignmentHistory>(() => {
    const saved = localStorage.getItem('armora_user_assignment_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          totalAssignments: 0,
          lastAssignmentDate: null,
          isFirstTimeUser: true
        };
      }
    }
    return {
      totalAssignments: 0,
      lastAssignmentDate: null,
      isFirstTimeUser: true
    };
  });

  // Save assignment history changes
  useEffect(() => {
    localStorage.setItem('armora_user_assignment_history', JSON.stringify(userAssignmentHistory));
  }, [userAssignmentHistory]);

  // Get recommended service (currently always Armora Secure/Standard)
  const getRecommendedService = () => {
    // For now, always recommend Standard as it's the only available service
    return services.find(s => s.id === 'standard') || services[0];
  };

  // Determine display type based on protection assignment history
  const getDisplayType = () => {
    if (userAssignmentHistory.totalAssignments === 0) {
      return 'first-time';
    } else if (userAssignmentHistory.totalAssignments >= 1) {
      return 'returning';
    }
    return 'first-time';
  };

  // Update assignment history (to be called after successful assignment)
  const updateAssignmentHistory = (serviceId: string) => {
    setUserAssignmentHistory(prev => ({
      ...prev,
      totalAssignments: prev.totalAssignments + 1,
      lastAssignmentDate: new Date().toISOString(),
      isFirstTimeUser: false,
      preferredService: serviceId
    }));
  };

  // Expose update function to parent (for post-assignment update)
  useEffect(() => {
    // Attach to window for Dashboard to access
    (window as any).updateArmoraAssignmentHistory = updateAssignmentHistory;

    return () => {
      delete (window as any).updateArmoraAssignmentHistory;
    };
  }, []);

  const recommendedService = getRecommendedService();
  const displayType = getDisplayType();

  // Generate personalized recommendation - MEMOIZED to prevent re-renders
  const recommendation = useMemo(() =>
    generateRecommendation(questionnaireData, user, services),
    [questionnaireData, user, services]
  );

  // Minimal version for returning users - optimized for desktop
  if (displayType === 'returning') {
    return (
      <div className={styles.returningUserRec}>
        <div className={styles.quickRec}>
          <span className={styles.checkmark}>✅</span>
          <strong>Essential Protection</strong> - Your trusted security service
          <span className={styles.availability}> • 2 min away • Available now</span>
          <button
            className={styles.quickBookBtn}
            onClick={() => onServiceSelect('standard')}
          >
            Request Now
          </button>
        </div>
      </div>
    );
  }

  // Enhanced version for first-time users with unified personalized design
  const handleBeginProtection = () => {
    onServiceSelect(recommendedService?.id || 'standard');
  };

  const handleSchedule = () => {
    // Navigate to protection assignment with schedule mode - placeholder for future implementation
    onServiceSelect(recommendedService?.id || 'standard');
  };

  const handleOtherOptions = () => {
    // Navigate to full services view - placeholder for future implementation
    onServiceSelect(recommendedService?.id || 'standard');
  };

  return (
    <div className={styles.recommendationCard}>
      {/* Header emphasizing personalization */}
      <div className={styles.matchHeader}>
        <h3>YOUR PROTECTION MATCH</h3>
        <p>Based on your security profile</p>
      </div>

      {/* Visual match score */}
      <div className={styles.matchScoreBox}>
        <div className={styles.scoreText}>{recommendation.profile.matchScore}% MATCH SCORE</div>
        <div className={styles.scoreBar}>
          <div className={styles.scoreFill} style={{width: `${recommendation.profile.matchScore}%`}} />
        </div>
      </div>

      {/* Recommendation badge */}
      <div className={styles.recommendedBadge}>
        <span className={styles.trophy}>🏆</span>
        <span>RECOMMENDED FOR YOU</span>
      </div>

      {/* Service details */}
      <div className={styles.serviceSection}>
        <h2 className={styles.serviceName}>ESSENTIAL PROTECTION</h2>
        <div className="flex items-center justify-center gap-3 text-lg">
          <span className="font-bold text-yellow-400">£50/hour • £2.50/mile • 2-hour minimum</span>
        </div>
      </div>

      {/* Personalized benefits */}
      <div className={styles.benefits}>
        <div className={styles.benefitItem}>
          <span className={styles.check}>✓</span>
          <span>SIA-licensed protection officer</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.check}>✓</span>
          <span>Secure transport at £2.50/mile</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.check}>✓</span>
          <span>Threat assessment & route planning</span>
        </div>
      </div>

      {/* Pricing transparency box */}
      <div className={styles.pricingBreakdown}>
        <div className={styles.pricingTitle}>💰 Total Cost Breakdown:</div>
        <div className={styles.pricingLine}>━━━━━━━━━━━━━━━━━━━━</div>
        <div className={styles.pricingRow}>
          <span>Protection:</span>
          <span>£50/hour</span>
        </div>
        <div className={styles.pricingRow}>
          <span>Transport:</span>
          <span>£2.50/mile</span>
        </div>
        <div className={styles.pricingRow}>
          <span>Minimum:</span>
          <span>2 hours (£100 base)</span>
        </div>
        <div className={styles.pricingLine}>━━━━━━━━━━━━━━━━━━━━</div>
        <div className={styles.pricingExample}>
          Example: 2 hrs + 20 miles = £150
        </div>
      </div>

      {/* Trust indicators */}
      <div className={styles.trustBar}>
        <span>⭐ 4.8</span>
        <span>👥 2.8K Protected</span>
        <span>✓ SIA Verified</span>
      </div>

      {/* Single clear CTA */}
      <button className={styles.activateBtn} onClick={handleBeginProtection}>
        REQUEST PROTECTION NOW
      </button>

      {/* Alternative actions */}
      <div className={styles.alternativeActions}>
        <button className={styles.linkBtn} onClick={handleOtherOptions}>Other options →</button>
        <span className={styles.divider}>|</span>
        <button className={styles.linkBtn} onClick={handleSchedule}>Schedule later →</button>
      </div>
    </div>
  );
};

export default SmartRecommendation;