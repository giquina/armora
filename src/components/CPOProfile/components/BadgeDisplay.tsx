import React from 'react';
import { SIABadge, MilitaryBackground, PoliceBackground } from '../../../types/cpo';
import styles from '../styles/cpo-profile.module.css';

interface BadgeDisplayProps {
  sia: SIABadge;
  militaryBackground: MilitaryBackground;
  policeBackground: PoliceBackground;
  yearsOfExperience: number;
  compact?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  sia,
  militaryBackground,
  policeBackground,
  yearsOfExperience,
  compact = false
}) => {
  const getSIABadgeColor = (level: string): string => {
    switch (level) {
      case 'Level_4': return 'platinum';
      case 'Level_3': return 'gold';
      case 'Level_2': return 'silver';
      default: return 'bronze';
    }
  };

  const getSIALevelText = (level: string): string => {
    switch (level) {
      case 'Level_4': return 'SIA L4';
      case 'Level_3': return 'SIA L3';
      case 'Level_2': return 'SIA L2';
      default: return 'SIA';
    }
  };

  const getMilitaryBranchIcon = (branch: string): string => {
    switch (branch) {
      case 'Army': return '🎖️';
      case 'Navy': return '⚓';
      case 'RAF': return '✈️';
      case 'Royal_Marines': return '🔱';
      default: return '🎖️';
    }
  };

  const getExperienceBadgeLevel = (years: number): { level: string; color: string } => {
    if (years >= 20) return { level: 'Elite', color: 'diamond' };
    if (years >= 15) return { level: 'Senior', color: 'platinum' };
    if (years >= 10) return { level: 'Expert', color: 'gold' };
    if (years >= 5) return { level: 'Pro', color: 'silver' };
    return { level: 'Certified', color: 'bronze' };
  };

  const experienceBadge = getExperienceBadgeLevel(yearsOfExperience);

  return (
    <div className={`${styles.badgeContainer} ${compact ? styles.compact : ''}`}>
      {/* SIA Badge - Always show as it's required */}
      <div
        className={`${styles.badge} ${styles.siaBadge} ${styles[getSIABadgeColor(sia.level)]}`}
        title={`SIA ${sia.level} - License: ${sia.licenseNumber}`}
      >
        <span className={styles.badgeIcon}>🛡️</span>
        <span className={styles.badgeText}>
          {getSIALevelText(sia.level)}
          {sia.verified && <span className={styles.verifiedIcon}>✓</span>}
        </span>
      </div>

      {/* Military Service Badge */}
      {militaryBackground.hasMilitaryService && (
        <div
          className={`${styles.badge} ${styles.militaryBadge}`}
          title={`${militaryBackground.branch} - ${militaryBackground.yearsOfService} years service`}
        >
          <span className={styles.badgeIcon}>
            {getMilitaryBranchIcon(militaryBackground.branch || 'Army')}
          </span>
          {!compact && (
            <span className={styles.badgeText}>
              {militaryBackground.branch?.replace('_', ' ')}
            </span>
          )}
        </div>
      )}

      {/* Police Service Badge */}
      {policeBackground.hasPoliceService && (
        <div
          className={`${styles.badge} ${styles.policeBadge}`}
          title={`Police Service - ${policeBackground.yearsOfService} years, ${policeBackground.force}`}
        >
          <span className={styles.badgeIcon}>👮</span>
          {!compact && (
            <span className={styles.badgeText}>
              Police
            </span>
          )}
        </div>
      )}

      {/* Security Clearance Badge */}
      {militaryBackground.securityClearance && (
        <div
          className={`${styles.badge} ${styles.clearanceBadge}`}
          title={`Security Clearance: ${militaryBackground.securityClearance.replace('_', ' ')}`}
        >
          <span className={styles.badgeIcon}>🔐</span>
          {!compact && (
            <span className={styles.badgeText}>
              {militaryBackground.securityClearance.replace('Enhanced_', 'E-').replace('_', '')}
            </span>
          )}
        </div>
      )}

      {/* Experience Level Badge */}
      <div
        className={`${styles.badge} ${styles.experienceBadge} ${styles[experienceBadge.color]}`}
        title={`${yearsOfExperience} years of close protection experience`}
      >
        <span className={styles.badgeIcon}>⭐</span>
        <span className={styles.badgeText}>
          {experienceBadge.level}
        </span>
      </div>

      {/* Specialist Sectors from SIA */}
      {sia.specialistSectors.length > 0 && !compact && (
        <div
          className={`${styles.badge} ${styles.specialistBadge}`}
          title={`Specialist sectors: ${sia.specialistSectors.join(', ')}`}
        >
          <span className={styles.badgeIcon}>🎯</span>
          <span className={styles.badgeText}>
            Specialist
          </span>
        </div>
      )}

      {/* Languages Badge (if multilingual) */}
      {/* Note: This would be passed from parent component if needed */}
    </div>
  );
};

// Individual badge components for more granular use
export const SIABadgeComponent: React.FC<{ sia: SIABadge; compact?: boolean }> = ({
  sia,
  compact = false
}) => {
  const getSIABadgeColor = (level: string): string => {
    switch (level) {
      case 'Level_4': return 'platinum';
      case 'Level_3': return 'gold';
      case 'Level_2': return 'silver';
      default: return 'bronze';
    }
  };

  return (
    <div
      className={`${styles.badge} ${styles.siaBadge} ${styles[getSIABadgeColor(sia.level)]}`}
      title={`SIA ${sia.level} - License: ${sia.licenseNumber}${sia.verified ? ' (Verified)' : ''}`}
    >
      <span className={styles.badgeIcon}>🛡️</span>
      {!compact && (
        <span className={styles.badgeText}>
          SIA {sia.level.replace('_', ' ')}
          {sia.verified && <span className={styles.verifiedIcon}>✓</span>}
        </span>
      )}
    </div>
  );
};

export const MilitaryBadgeComponent: React.FC<{ military: MilitaryBackground; compact?: boolean }> = ({
  military,
  compact = false
}) => {
  if (!military.hasMilitaryService) return null;

  const getMilitaryBranchIcon = (branch: string): string => {
    switch (branch) {
      case 'Army': return '🎖️';
      case 'Navy': return '⚓';
      case 'RAF': return '✈️';
      case 'Royal_Marines': return '🔱';
      default: return '🎖️';
    }
  };

  return (
    <div
      className={`${styles.badge} ${styles.militaryBadge}`}
      title={`${military.branch} - ${military.yearsOfService} years service${military.rank ? `, ${military.rank}` : ''}`}
    >
      <span className={styles.badgeIcon}>
        {getMilitaryBranchIcon(military.branch || 'Army')}
      </span>
      {!compact && (
        <span className={styles.badgeText}>
          {military.branch?.replace('_', ' ')}
        </span>
      )}
    </div>
  );
};

export const PoliceBadgeComponent: React.FC<{ police: PoliceBackground; compact?: boolean }> = ({
  police,
  compact = false
}) => {
  if (!police.hasPoliceService) return null;

  return (
    <div
      className={`${styles.badge} ${styles.policeBadge}`}
      title={`Police Service - ${police.yearsOfService} years${police.force ? `, ${police.force}` : ''}${police.rank ? `, ${police.rank}` : ''}`}
    >
      <span className={styles.badgeIcon}>👮</span>
      {!compact && (
        <span className={styles.badgeText}>
          Police
        </span>
      )}
    </div>
  );
};