import React, { useState } from 'react';
import styles from './SecurityCenter.module.css';

interface UserAccountData {
  security: {
    twoFactorEnabled: boolean;
    trustedContacts: any[];
    panicButtonEnabled: boolean;
    loginSessions: any[];
    privacySettings: any;
  };
}

interface SecurityCenterProps {
  userData: UserAccountData;
  isCompact?: boolean;
}

export function SecurityCenter({ userData, isCompact }: SecurityCenterProps) {
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showLoginSessions, setShowLoginSessions] = useState(false);

  const { security } = userData;

  const getSecurityScore = () => {
    let score = 0;
    if (security.twoFactorEnabled) score += 30;
    if (security.trustedContacts.length > 0) score += 25;
    if (security.panicButtonEnabled) score += 20;
    score += Math.min(security.loginSessions.length * 5, 25); // Max 25 for sessions
    return Math.min(score, 100);
  };

  const securityItems = [
    {
      id: 'two-factor',
      title: '2-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: '🔐',
      enabled: security.twoFactorEnabled,
      priority: 'high',
      action: () => setShow2FASetup(true)
    },
    {
      id: 'login-sessions',
      title: 'Active Sessions',
      description: `${security.loginSessions.length} devices connected`,
      icon: '📱',
      enabled: true,
      priority: 'low',
      action: () => setShowLoginSessions(true)
    }
  ];

  if (isCompact) {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <h3 className={styles.compactTitle}>
            <span className={styles.titleIcon}>🔒</span>
            Security Center
          </h3>
          <div className={styles.securityScore}>
            <span className={styles.scoreNumber}>{getSecurityScore()}</span>
            <span className={styles.scoreLabel}>Security Score</span>
          </div>
        </div>

        <div className={styles.compactGrid}>
          {securityItems.slice(0, 2).map((item) => (
            <div key={item.id} className={styles.compactItem}>
              <div className={styles.compactItemHeader}>
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={`${styles.statusDot} ${item.enabled ? styles.enabled : styles.disabled}`}></span>
              </div>
              <div className={styles.compactItemText}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemStatus}>
                  {item.enabled ? 'Active' : 'Setup Required'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.compactCTA}>
          View All Security Settings
        </button>
      </div>
    );
  }

  return (
    <div className={styles.securityContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>
            <span className={styles.titleIcon}>🔒</span>
            Security Center
          </h2>
          <p className={styles.subtitle}>
            Protect your account and personal safety
          </p>
        </div>

        <div className={styles.securityScoreCard}>
          <div className={styles.scoreCircle}>
            <svg className={styles.progressRing} width="80" height="80">
              <circle
                className={styles.progressRingBg}
                cx="40"
                cy="40"
                r="35"
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="6"
              />
              <circle
                className={styles.progressRingFill}
                cx="40"
                cy="40"
                r="35"
                fill="transparent"
                stroke="#10B981"
                strokeWidth="6"
                strokeDasharray={`${(getSecurityScore() / 100) * 219.9} 219.9`}
                strokeDashoffset="0"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className={styles.scoreText}>
              <span className={styles.scoreNumber}>{getSecurityScore()}</span>
              <span className={styles.scoreLabel}>Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.securityGrid}>
        {securityItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.securityCard} ${styles[item.priority]}`}
            onClick={item.action}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>{item.icon}</div>
              <div className={`${styles.statusIndicator} ${item.enabled ? styles.enabled : styles.disabled}`}>
                <span className={styles.statusDot}></span>
                <span className={styles.statusText}>
                  {item.enabled ? 'Active' : 'Setup Required'}
                </span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </div>

            <div className={styles.cardAction}>
              <span className={styles.actionText}>
                {item.enabled ? 'Manage' : 'Setup'}
              </span>
              <span className={styles.actionIcon}>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Security Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.quickActionsTitle}>Quick Security Actions</h3>
        <div className={styles.quickActionsGrid}>
          <button className={styles.quickAction}>
            <span className={styles.quickActionIcon}>🔄</span>
            <span className={styles.quickActionText}>Sign Out All Devices</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickActionIcon}>🔒</span>
            <span className={styles.quickActionText}>Change Password</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickActionIcon}>📱</span>
            <span className={styles.quickActionText}>Download Backup Codes</span>
          </button>
          <button className={styles.quickAction}>
            <span className={styles.quickActionIcon}>🛡️</span>
            <span className={styles.quickActionText}>Security Checkup</span>
          </button>
        </div>
      </div>

      {/* Recent Security Activity */}
      <div className={styles.recentActivity}>
        <h3 className={styles.activityTitle}>Recent Security Activity</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🔐</div>
            <div className={styles.activityContent}>
              <div className={styles.activityText}>Password changed successfully</div>
              <div className={styles.activityTime}>2 days ago</div>
            </div>
            <div className={styles.activityStatus}>✅</div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>📱</div>
            <div className={styles.activityContent}>
              <div className={styles.activityText}>New device logged in: iPhone 14 Pro</div>
              <div className={styles.activityTime}>1 week ago</div>
            </div>
            <div className={styles.activityStatus}>✅</div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🔒</div>
            <div className={styles.activityContent}>
              <div className={styles.activityText}>Two-factor authentication disabled</div>
              <div className={styles.activityTime}>2 weeks ago</div>
            </div>
            <div className={styles.activityStatus}>⚠️</div>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Setup Two-Factor Authentication</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShow2FASetup(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.twoFactorOptions}>
                <div className={styles.optionCard}>
                  <div className={styles.optionIcon}>📱</div>
                  <h4 className={styles.optionTitle}>Authenticator App</h4>
                  <p className={styles.optionDescription}>
                    Use Google Authenticator, Authy, or similar apps
                  </p>
                  <button className={styles.optionButton}>Setup</button>
                </div>
                <div className={styles.optionCard}>
                  <div className={styles.optionIcon}>💬</div>
                  <h4 className={styles.optionTitle}>SMS Text Messages</h4>
                  <p className={styles.optionDescription}>
                    Receive codes via text message
                  </p>
                  <button className={styles.optionButton}>Setup</button>
                </div>
                <div className={styles.optionCard}>
                  <div className={styles.optionIcon}>🔑</div>
                  <h4 className={styles.optionTitle}>Security Key</h4>
                  <p className={styles.optionDescription}>
                    Use a physical security key (YubiKey, etc.)
                  </p>
                  <button className={styles.optionButton}>Setup</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Login Sessions Modal */}
      {showLoginSessions && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Active Login Sessions</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowLoginSessions(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.sessionsList}>
                {security.loginSessions.map((session, index) => (
                  <div key={index} className={styles.sessionItem}>
                    <div className={styles.sessionIcon}>📱</div>
                    <div className={styles.sessionInfo}>
                      <div className={styles.sessionDevice}>{session.device}</div>
                      <div className={styles.sessionDetails}>
                        {session.location} • {session.lastActive}
                      </div>
                    </div>
                    <button className={styles.sessionAction}>
                      {index === 0 ? 'Current' : 'Sign Out'}
                    </button>
                  </div>
                ))}
              </div>
              <button className={styles.signOutAllButton}>
                Sign Out All Other Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}