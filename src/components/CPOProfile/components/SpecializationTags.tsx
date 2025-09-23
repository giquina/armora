import React from 'react';
import { Specialization } from '../../../types/cpo';
import styles from '../styles/cpo-profile.module.css';

interface SpecializationTagsProps {
  specializations: Specialization[];
  maxDisplay?: number;
  clickable?: boolean;
  onTagClick?: (specialization: string) => void;
  showExperience?: boolean;
  compact?: boolean;
}

export const SpecializationTags: React.FC<SpecializationTagsProps> = ({
  specializations,
  maxDisplay = 3,
  clickable = false,
  onTagClick,
  showExperience = false,
  compact = false
}) => {
  const getSpecializationConfig = (type: string) => {
    const configs = {
      'VIP_Protection': {
        icon: '👑',
        label: 'VIP Protection',
        color: 'gold',
        priority: 10
      },
      'Close_Protection': {
        icon: '🛡️',
        label: 'Close Protection',
        color: 'blue',
        priority: 9
      },
      'Diplomatic_Protection': {
        icon: '🏛️',
        label: 'Diplomatic',
        color: 'purple',
        priority: 8
      },
      'Corporate_Security': {
        icon: '🏢',
        label: 'Corporate',
        color: 'gray',
        priority: 7
      },
      'Event_Security': {
        icon: '🎭',
        label: 'Event Security',
        color: 'orange',
        priority: 6
      },
      'Residential_Security': {
        icon: '🏠',
        label: 'Residential',
        color: 'green',
        priority: 5
      },
      'Executive_Transport': {
        icon: '🚗',
        label: 'Transport',
        color: 'navy',
        priority: 4
      },
      'Counter_Surveillance': {
        icon: '👁️',
        label: 'Counter-Surveillance',
        color: 'dark',
        priority: 3
      },
      'Hostile_Environment': {
        icon: '⚠️',
        label: 'Hostile Environment',
        color: 'red',
        priority: 2
      },
      'Maritime_Security': {
        icon: '⚓',
        label: 'Maritime',
        color: 'blue',
        priority: 1
      }
    };

    return configs[type as keyof typeof configs] || {
      icon: '🔰',
      label: type.replace('_', ' '),
      color: 'gray',
      priority: 0
    };
  };

  // Sort specializations by priority and experience
  const sortedSpecializations = specializations
    .sort((a, b) => {
      const configA = getSpecializationConfig(a.type);
      const configB = getSpecializationConfig(b.type);

      // First sort by priority, then by experience
      if (configA.priority !== configB.priority) {
        return configB.priority - configA.priority;
      }
      return b.yearsExperience - a.yearsExperience;
    })
    .slice(0, maxDisplay);

  const handleTagClick = (specialization: Specialization) => {
    if (clickable && onTagClick) {
      onTagClick(specialization.type);
    }
  };

  const formatExperience = (years: number): string => {
    if (years >= 10) return `${years}+ yrs`;
    if (years >= 5) return `${years} yrs`;
    return `${years}yr${years !== 1 ? 's' : ''}`;
  };

  return (
    <div className={`${styles.specializationContainer} ${compact ? styles.compact : ''}`}>
      {sortedSpecializations.map((specialization, index) => {
        const config = getSpecializationConfig(specialization.type);

        return (
          <div
            key={`${specialization.type}-${index}`}
            className={`
              ${styles.specializationTag}
              ${styles[config.color]}
              ${clickable ? styles.clickable : ''}
              ${compact ? styles.compact : ''}
            `}
            onClick={() => handleTagClick(specialization)}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            title={`${config.label}: ${specialization.yearsExperience} years experience${
              specialization.certifications.length > 0
                ? ` - Certifications: ${specialization.certifications.join(', ')}`
                : ''
            }`}
          >
            <span className={styles.tagIcon}>{config.icon}</span>
            <span className={styles.tagLabel}>
              {compact ? config.label.split(' ')[0] : config.label}
            </span>
            {showExperience && !compact && (
              <span className={styles.tagExperience}>
                {formatExperience(specialization.yearsExperience)}
              </span>
            )}
          </div>
        );
      })}

      {/* Show overflow indicator */}
      {specializations.length > maxDisplay && (
        <div className={`${styles.specializationTag} ${styles.overflow}`}>
          <span className={styles.tagLabel}>
            +{specializations.length - maxDisplay} more
          </span>
        </div>
      )}
    </div>
  );
};

// Filter component for specializations
export const SpecializationFilter: React.FC<{
  availableSpecializations: string[];
  selectedSpecializations: string[];
  onSelectionChange: (selected: string[]) => void;
}> = ({
  availableSpecializations,
  selectedSpecializations,
  onSelectionChange
}) => {
  const getSpecializationConfig = (type: string) => {
    const configs = {
      'VIP_Protection': { icon: '👑', label: 'VIP Protection', color: 'gold' },
      'Close_Protection': { icon: '🛡️', label: 'Close Protection', color: 'blue' },
      'Diplomatic_Protection': { icon: '🏛️', label: 'Diplomatic', color: 'purple' },
      'Corporate_Security': { icon: '🏢', label: 'Corporate', color: 'gray' },
      'Event_Security': { icon: '🎭', label: 'Event Security', color: 'orange' },
      'Residential_Security': { icon: '🏠', label: 'Residential', color: 'green' },
      'Executive_Transport': { icon: '🚗', label: 'Transport', color: 'navy' },
      'Counter_Surveillance': { icon: '👁️', label: 'Counter-Surveillance', color: 'dark' },
      'Hostile_Environment': { icon: '⚠️', label: 'Hostile Environment', color: 'red' },
      'Maritime_Security': { icon: '⚓', label: 'Maritime', color: 'blue' }
    };

    return configs[type as keyof typeof configs] || {
      icon: '🔰',
      label: type.replace('_', ' '),
      color: 'gray'
    };
  };

  const handleToggle = (specialization: string) => {
    if (selectedSpecializations.includes(specialization)) {
      onSelectionChange(selectedSpecializations.filter(s => s !== specialization));
    } else {
      onSelectionChange([...selectedSpecializations, specialization]);
    }
  };

  return (
    <div className={styles.specializationFilter}>
      <div className={styles.filterHeader}>
        <span className={styles.filterTitle}>Specializations</span>
        {selectedSpecializations.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={() => onSelectionChange([])}
          >
            Clear All
          </button>
        )}
      </div>

      <div className={styles.filterGrid}>
        {availableSpecializations.map(specialization => {
          const config = getSpecializationConfig(specialization);
          const isSelected = selectedSpecializations.includes(specialization);

          return (
            <button
              key={specialization}
              className={`
                ${styles.filterTag}
                ${styles[config.color]}
                ${isSelected ? styles.selected : ''}
              `}
              onClick={() => handleToggle(specialization)}
            >
              <span className={styles.tagIcon}>{config.icon}</span>
              <span className={styles.tagLabel}>{config.label}</span>
              {isSelected && (
                <span className={styles.selectedIcon}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Individual specialization badge component
export const SpecializationBadge: React.FC<{
  specialization: Specialization;
  variant?: 'default' | 'outlined' | 'minimal';
  size?: 'small' | 'medium' | 'large';
}> = ({
  specialization,
  variant = 'default',
  size = 'medium'
}) => {
  const getSpecializationConfig = (type: string) => {
    const configs = {
      'VIP_Protection': { icon: '👑', label: 'VIP Protection', color: 'gold' },
      'Close_Protection': { icon: '🛡️', label: 'Close Protection', color: 'blue' },
      'Diplomatic_Protection': { icon: '🏛️', label: 'Diplomatic', color: 'purple' },
      'Corporate_Security': { icon: '🏢', label: 'Corporate', color: 'gray' },
      'Event_Security': { icon: '🎭', label: 'Event Security', color: 'orange' },
      'Residential_Security': { icon: '🏠', label: 'Residential', color: 'green' },
      'Executive_Transport': { icon: '🚗', label: 'Transport', color: 'navy' },
      'Counter_Surveillance': { icon: '👁️', label: 'Counter-Surveillance', color: 'dark' },
      'Hostile_Environment': { icon: '⚠️', label: 'Hostile Environment', color: 'red' },
      'Maritime_Security': { icon: '⚓', label: 'Maritime', color: 'blue' }
    };

    return configs[type as keyof typeof configs] || {
      icon: '🔰',
      label: type.replace('_', ' '),
      color: 'gray'
    };
  };

  const config = getSpecializationConfig(specialization.type);

  return (
    <div
      className={`
        ${styles.specializationBadge}
        ${styles[config.color]}
        ${styles[variant]}
        ${styles[size]}
      `}
      title={`${config.label}: ${specialization.yearsExperience} years experience`}
    >
      <span className={styles.badgeIcon}>{config.icon}</span>
      <div className={styles.badgeContent}>
        <span className={styles.badgeLabel}>{config.label}</span>
        <span className={styles.badgeExperience}>
          {specialization.yearsExperience} years
        </span>
      </div>
    </div>
  );
};