import React, { useState } from 'react';
import styles from './ProfileHeader.module.css';

interface UserAccountData {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    memberSince: Date;
    tier: 'standard' | 'executive' | 'shadow';
    verificationStatus: {
      email: boolean;
      phone: boolean;
      identity: boolean;
      background: boolean;
    };
  };
  analytics: {
    safetyScore: number;
    totalRides: number;
    totalHours: number;
    carbonSaved: number;
    favoriteRoutes: string[];
  };
}

interface ProfileHeaderProps {
  userData: UserAccountData;
}

export function ProfileHeader({ userData }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const { profile, analytics } = userData;

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'executive':
        return {
          name: 'Executive Member',
          color: 'var(--accent-primary)',
          gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
          icon: '👑'
        };
      case 'shadow':
        return {
          name: 'Shadow Member',
          color: '#8B5CF6',
          gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
          icon: '🕶️'
        };
      default:
        return {
          name: 'Standard Member',
          color: '#10B981',
          gradient: 'linear-gradient(135deg, #10B981, #059669)',
          icon: '🛡️'
        };
    }
  };

  const tierConfig = getTierConfig(profile.tier);

  const getVerificationScore = () => {
    const verifications = Object.values(profile.verificationStatus);
    const completed = verifications.filter(Boolean).length;
    return Math.round((completed / verifications.length) * 100);
  };

  const getMembershipDuration = () => {
    const now = new Date();
    const memberSince = new Date(profile.memberSince);
    const diffTime = Math.abs(now.getTime() - memberSince.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <div className={styles.profileHeader}>
      {/* Background Gradient */}
      <div
        className={styles.headerBackground}
        style={{ background: tierConfig.gradient }}
      ></div>

      {/* Profile Content */}
      <div className={styles.profileContent}>
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div
            className={styles.avatarContainer}
            onMouseEnter={() => setShowAvatarUpload(true)}
            onMouseLeave={() => setShowAvatarUpload(false)}
          >
            <img
              src={profile.avatar}
              alt="Profile"
              className={styles.avatar}
            />
            <div
              className={`${styles.avatarOverlay} ${showAvatarUpload ? styles.visible : ''}`}
            >
              <span className={styles.cameraIcon}>📷</span>
              <span className={styles.uploadText}>Change Photo</span>
            </div>
            <div
              className={styles.tierBadge}
              style={{ background: tierConfig.gradient }}
            >
              <span className={styles.tierIcon}>{tierConfig.icon}</span>
            </div>
          </div>

          {/* Verification Badges */}
          <div className={styles.verificationBadges}>
            {profile.verificationStatus.email && (
              <div className={styles.verificationBadge}>
                <span className={styles.badgeIcon}>✅</span>
                <span className={styles.badgeText}>Email</span>
              </div>
            )}
            {profile.verificationStatus.phone && (
              <div className={styles.verificationBadge}>
                <span className={styles.badgeIcon}>📱</span>
                <span className={styles.badgeText}>Phone</span>
              </div>
            )}
            {profile.verificationStatus.identity && (
              <div className={styles.verificationBadge}>
                <span className={styles.badgeIcon}>🆔</span>
                <span className={styles.badgeText}>ID Verified</span>
              </div>
            )}
            {profile.verificationStatus.background && (
              <div className={styles.verificationBadge}>
                <span className={styles.badgeIcon}>🛡️</span>
                <span className={styles.badgeText}>Background Check</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className={styles.profileInfo}>
          <div className={styles.nameSection}>
            <h1 className={styles.userName}>{profile.name}</h1>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(!isEditing)}
            >
              <span className={styles.editIcon}>✏️</span>
              Edit
            </button>
          </div>

          <div className={styles.membershipInfo}>
            <div
              className={styles.tierLabel}
              style={{ color: tierConfig.color }}
            >
              {tierConfig.name}
            </div>
            <div className={styles.memberSince}>
              Member for {getMembershipDuration()}
            </div>
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📧</span>
              <span className={styles.contactText}>{profile.email}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              <span className={styles.contactText}>{profile.phone}</span>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className={styles.statsSection}>
          <div className={styles.primaryStat}>
            <div className={styles.safetyScoreContainer}>
              <div className={styles.safetyScoreCircle}>
                <svg className={styles.progressRing} width="120" height="120">
                  <circle
                    className={styles.progressRingBg}
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    className={styles.progressRingFill}
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke={tierConfig.color}
                    strokeWidth="8"
                    strokeDasharray={`${(analytics.safetyScore / 100) * 314.16} 314.16`}
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className={styles.safetyScoreText}>
                  <span className={styles.scoreNumber}>{analytics.safetyScore}</span>
                  <span className={styles.scoreLabel}>Safety Score</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{analytics.totalRides}</div>
              <div className={styles.statLabel}>Total Assignments</div>
              <div className={styles.statIcon}>🚗</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{analytics.totalHours}</div>
              <div className={styles.statLabel}>Hours Protected</div>
              <div className={styles.statIcon}>🕐</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{analytics.carbonSaved}kg</div>
              <div className={styles.statLabel}>Carbon Saved</div>
              <div className={styles.statIcon}>🌱</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{getVerificationScore()}%</div>
              <div className={styles.statLabel}>Profile Complete</div>
              <div className={styles.statIcon}>✨</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className={styles.editModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Profile</h3>
              <button
                className={styles.closeButton}
                onClick={() => setIsEditing(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  defaultValue={profile.name}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  className={styles.formInput}
                  defaultValue={profile.phone}
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button className={styles.saveButton}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}