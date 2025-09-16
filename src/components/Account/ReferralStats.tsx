import React, { useState } from 'react';
import styles from './ReferralStats.module.css';

interface Referral {
  date: string;
  friendCode: string;
  status: 'invited' | 'joined' | 'subscribed';
  creditEarned: number;
}

interface ReferralStatsProps {
  referrals: Referral[];
}

export function ReferralStats({ referrals }: ReferralStatsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const stats = {
    friendsInvited: referrals.length,
    friendsJoined: referrals.filter(r => r.status === 'joined' || r.status === 'subscribed').length,
    activeSubscribers: referrals.filter(r => r.status === 'subscribed').length,
    totalCreditsEarned: referrals.reduce((sum, r) => sum + r.creditEarned, 0)
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'invited':
        return { text: 'Invited', color: '#666' };
      case 'joined':
        return { text: 'Joined', color: '#ffd700' };
      case 'subscribed':
        return { text: 'Subscribed', color: '#FFD700' };
      default:
        return { text: status, color: '#666' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.referralStats}>
      <div className={styles.statsHeader}>
        <h3 className={styles.statsTitle}>Your Referral Impact</h3>
        <button
          className={styles.viewDetailsButton}
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
        >
          {showDetails ? 'Hide Details' : 'View Details'}
          <span className={styles.toggleIcon}>{showDetails ? '▼' : '▶'}</span>
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.friendsInvited}</div>
          <div className={styles.statLabel}>Friends Invited</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.friendsJoined}</div>
          <div className={styles.statLabel}>Friends Joined</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.activeSubscribers}</div>
          <div className={styles.statLabel}>Active Subscribers</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>£{stats.totalCreditsEarned}</div>
          <div className={styles.statLabel}>Credits Earned</div>
        </div>
      </div>

      {showDetails && referrals.length > 0 && (
        <div className={styles.referralDetails}>
          <h4 className={styles.detailsTitle}>Referral History</h4>
          <div className={styles.referralList}>
            {referrals.map((referral, index) => {
              const statusDisplay = getStatusDisplay(referral.status);
              return (
                <div key={index} className={styles.referralItem}>
                  <div className={styles.referralInfo}>
                    <div className={styles.referralCode}>{referral.friendCode}</div>
                    <div className={styles.referralDate}>{formatDate(referral.date)}</div>
                  </div>
                  <div className={styles.referralStatus}>
                    <span
                      className={styles.statusBadge}
                      style={{ color: statusDisplay.color }}
                    >
                      {statusDisplay.text}
                    </span>
                    {referral.creditEarned > 0 && (
                      <span className={styles.creditEarned}>+£{referral.creditEarned}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showDetails && referrals.length === 0 && (
        <div className={styles.noReferrals}>
          <p>No referrals yet. Start sharing your code to earn credits!</p>
        </div>
      )}
    </div>
  );
}