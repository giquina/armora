import styles from './TrustBadges.module.css';

interface TrustBadge {
  icon: string;
  label: string;
  tooltip: string;
  level?: 'basic' | 'premium' | 'elite';
}

interface TrustBadgesProps {
  serviceLevel: string;
  compact?: boolean;
}

const TRUST_BADGES: Record<string, TrustBadge[]> = {
  standard: [
    { icon: '🛡️', label: 'SIA Licensed', tooltip: 'Security Industry Authority certified officers', level: 'basic' },
    { icon: '✅', label: 'DBS Checked', tooltip: 'Enhanced background checks completed', level: 'basic' },
    { icon: '🏥', label: 'First Aid', tooltip: 'Medical emergency response trained', level: 'basic' },
    { icon: '🚗', label: 'Insured Vehicle', tooltip: '£5M comprehensive insurance coverage', level: 'basic' }
  ],
  executive: [
    { icon: '🎖️', label: 'Ex-Military', tooltip: 'Former armed forces personnel', level: 'premium' },
    { icon: '🚗', label: 'Advanced Driving', tooltip: 'Defensive & evasive driving certified', level: 'premium' },
    { icon: '🔒', label: 'Level 3 Security', tooltip: 'Advanced protection training completed', level: 'premium' },
    { icon: '🏢', label: 'Corporate Trained', tooltip: 'Executive protection protocols certified', level: 'premium' },
    { icon: '💼', label: '£10M Insured', tooltip: 'Premium insurance coverage', level: 'premium' }
  ],
  shadow: [
    { icon: '🥷', label: 'Covert Ops', tooltip: 'Specialist surveillance & protection training', level: 'elite' },
    { icon: '👁️', label: 'Counter-Surveillance', tooltip: 'Threat detection & assessment specialists', level: 'elite' },
    { icon: '🌐', label: 'Intel Trained', tooltip: 'Intelligence service background verification', level: 'elite' },
    { icon: '🔍', label: 'Risk Assessment', tooltip: 'Advanced threat evaluation certified', level: 'elite' },
    { icon: '💰', label: '£15M Coverage', tooltip: 'Elite-level insurance protection', level: 'elite' }
  ],
  event: [
    { icon: '🏟️', label: 'Venue Certified', tooltip: 'Specialized venue security training', level: 'premium' },
    { icon: '👥', label: 'Crowd Control', tooltip: 'Large event management expertise', level: 'premium' },
    { icon: '📋', label: 'Event Planning', tooltip: 'Security logistics coordination', level: 'premium' },
    { icon: '🚨', label: 'Emergency Response', tooltip: 'Crisis management protocols', level: 'premium' },
    { icon: '🎭', label: 'Discrete Operations', tooltip: 'Event-appropriate security presence', level: 'premium' }
  ],
  luxury: [
    { icon: '👑', label: 'VIP Certified', tooltip: 'Diplomatic protection standard training', level: 'elite' },
    { icon: '🌍', label: 'Global Network', tooltip: 'International protection coverage', level: 'elite' },
    { icon: '⭐', label: 'White Glove', tooltip: 'Luxury service excellence standards', level: 'elite' },
    { icon: '🛩️', label: 'Transport Security', tooltip: 'Aviation & maritime protection', level: 'elite' },
    { icon: '💎', label: '£50M Insured', tooltip: 'Ultra-premium coverage levels', level: 'elite' }
  ]
};

const getBadgeColor = (level?: string) => {
  switch (level) {
    case 'premium': return 'var(--armora-gold)';
    case 'elite': return '#8b5cf6';
    default: return '#22c55e';
  }
};

const getBadgeGradient = (level?: string) => {
  switch (level) {
    case 'premium': return 'linear-gradient(135deg, #f59e0b, #d97706)';
    case 'elite': return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    default: return 'linear-gradient(135deg, #22c55e, #16a34a)';
  }
};

export function TrustBadges({ serviceLevel, compact = false }: TrustBadgesProps) {
  const badges = TRUST_BADGES[serviceLevel] || TRUST_BADGES.standard;

  if (compact) {
    // Show only top 3 badges in compact mode
    const topBadges = badges.slice(0, 3);

    return (
      <div className={styles.trustBadgesCompact}>
        {topBadges.map((badge, index) => (
          <div
            key={index}
            className={styles.badgeCompact}
            title={badge.tooltip}
            style={{ borderColor: getBadgeColor(badge.level) }}
          >
            <span className={styles.badgeIcon}>{badge.icon}</span>
            <span className={styles.badgeLabel}>{badge.label}</span>
          </div>
        ))}
        {badges.length > 3 && (
          <div className={styles.moreIndicator}>
            +{badges.length - 3} more
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.trustBadges}>
      <h4 className={styles.badgesTitle}>🏆 Certifications & Standards</h4>

      <div className={styles.badgesGrid}>
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`${styles.badge} ${styles[`badge${badge.level}`]}`}
            title={badge.tooltip}
          >
            <div
              className={styles.badgeHeader}
              style={{ background: getBadgeGradient(badge.level) }}
            >
              <span className={styles.badgeIcon}>{badge.icon}</span>
            </div>

            <div className={styles.badgeContent}>
              <span className={styles.badgeLabel}>{badge.label}</span>
              <span className={styles.badgeTooltip}>{badge.tooltip}</span>
            </div>

            {badge.level === 'elite' && (
              <div className={styles.eliteBadge}>ELITE</div>
            )}
            {badge.level === 'premium' && (
              <div className={styles.premiumBadge}>PREMIUM</div>
            )}
          </div>
        ))}
      </div>

      {/* Service Level Summary */}
      <div className={styles.levelSummary}>
        <div className={styles.summaryContent}>
          {serviceLevel === 'standard' && (
            <>
              <span className={styles.summaryIcon}>🛡️</span>
              <span className={styles.summaryText}>Essential protection with full compliance</span>
            </>
          )}
          {serviceLevel === 'executive' && (
            <>
              <span className={styles.summaryIcon}>💼</span>
              <span className={styles.summaryText}>Premium protection for business professionals</span>
            </>
          )}
          {serviceLevel === 'shadow' && (
            <>
              <span className={styles.summaryIcon}>🥷</span>
              <span className={styles.summaryText}>Elite covert protection specialists</span>
            </>
          )}
          {serviceLevel === 'event' && (
            <>
              <span className={styles.summaryIcon}>🎭</span>
              <span className={styles.summaryText}>Specialized event security experts</span>
            </>
          )}
          {serviceLevel === 'luxury' && (
            <>
              <span className={styles.summaryIcon}>👑</span>
              <span className={styles.summaryText}>Ultra-premium VIP protection services</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}