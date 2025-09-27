import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './AccountView.module.css';

interface UserAccountData {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    memberSince: Date;
    tier: 'standard' | 'executive' | 'shadow';
    membershipYears: number;
    verificationStatus: {
      email: boolean;
      phone: boolean;
      identity: boolean;
      background: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    securityScore: number;
    trustedContacts: any[];
    panicButtonEnabled: boolean;
    loginSessions: any[];
    privacySettings: any;
  };
  stats: {
    totalRides: number;
    totalHours: number;
    totalSpent: number;
    userRating: number;
    averagePerRide: number;
    thisMonth: {
      amount: number;
      Assignments: number;
    };
    lastMonth: {
      amount: number;
      Assignments: number;
    };
  };
  financial: {
    credits: number;
    paymentMethods: any[];
    subscription: any;
  };
  referral: {
    code: string;
    earned: number;
    friendsJoined: number;
    pending: number;
  };
  achievements: {
    badges: Array<{
      id: string;
      name: string;
      icon: string;
      earned: boolean;
    }>;
  };
}

// Enhanced mock data generator
const generateMockUserData = (user: any): UserAccountData => {
  const memberSince = new Date('2022-03-15');
  const now = new Date();
  const membershipYears = Math.floor((now.getTime() - memberSince.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return {
    profile: {
      id: user?.id || 'user-123',
      name: user?.name || 'Test User',
      email: user?.email || 'test@armora.dev',
      phone: '+44 7700 900123',
      avatar: '/api/placeholder/150/150',
      memberSince,
      membershipYears: Math.max(membershipYears, 1),
      tier: user?.userType === 'registered' ? 'executive' : 'standard',
      verificationStatus: {
        email: true,
        phone: true,
        identity: user?.userType !== 'guest',
        background: user?.userType === 'registered'
      }
    },
    security: {
      twoFactorEnabled: false,
      securityScore: 94,
      trustedContacts: [],
      panicButtonEnabled: true,
      loginSessions: [
        { device: 'iPhone 14 Pro', location: 'London, UK', lastActive: 'Active now', id: '1' },
        { device: 'MacBook Pro', location: 'London, UK', lastActive: '2 hours ago', id: '2' }
      ],
      privacySettings: {}
    },
    stats: {
      totalRides: 47,
      totalHours: 156,
      totalSpent: 2847.50,
      userRating: 4.9,
      averagePerRide: 60.58,
      thisMonth: {
        amount: 487.00,
        Assignments: 8
      },
      lastMonth: {
        amount: 623.50,
        Assignments: 11
      }
    },
    financial: {
      credits: 125.00,
      paymentMethods: [
        { id: '1', type: 'card', last4: '4242', brand: 'visa', isDefault: true },
        { id: '2', type: 'card', last4: '8888', brand: 'mastercard', isDefault: false }
      ],
      subscription: {
        plan: 'Executive Monthly',
        status: 'active',
        nextBilling: new Date('2024-02-15'),
        amount: 75
      }
    },
    referral: {
      code: 'ARMORA2847',
      earned: 150,
      friendsJoined: 3,
      pending: 100
    },
    achievements: {
      badges: [
        { id: '1', name: 'Protection Elite', icon: '🛡️', earned: true },
        { id: '2', name: 'Verified', icon: '✓', earned: true },
        { id: '3', name: 'Trusted Principal', icon: '🎖️', earned: true },
        { id: '4', name: 'Elite', icon: '⭐', earned: true }
      ]
    }
  };
};

type SubPage = 'main' | 'security-score' | 'financial' | 'referral' | 'settings' | 'support';

export function AccountView() {
  const { state, navigateToView } = useApp();
  const { user } = state;
  const [userData, setUserData] = useState<UserAccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<SubPage>('main');

  // Initialize user data
  useEffect(() => {
    // Always generate mock data, even without a user
    const mockData = generateMockUserData(user || {
      name: 'Guest User',
      email: 'guest@armora.security',
      userType: 'guest' as any
    });
    setUserData(mockData);
    setIsLoading(false);
  }, [user]);

  if (isLoading || !userData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading your account...</p>
      </div>
    );
  }

  const handleSignOut = () => {
    // Sign out implementation placeholder
    navigateToView('welcome');
  };

  const handleDeleteAccount = () => {
    // Account deletion implementation placeholder
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'var(--success-color)';
    if (score >= 70) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  const getSecurityScoreStatus = (score: number) => {
    if (score >= 90) return 'Excellent Protection Status';
    if (score >= 70) return 'Good Protection Status';
    return 'Needs Improvement';
  };

  const renderSecurityScoreBreakdown = () => (
    <div className={styles.subPage}>
      <div className={styles.subPageHeader}>
        <button className={styles.backButton} onClick={() => setCurrentPage('main')}>
          ← Back
        </button>
        <h2 className={styles.subPageTitle}>YOUR SECURITY SCORE: {userData.security.securityScore}/100</h2>
      </div>

      <div className={styles.scoreBreakdown}>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Profile Completion</span>
          <span className={styles.scoreValue}>20/20 ✓</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>ID Verification</span>
          <span className={styles.scoreValue}>20/20 ✓</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Background Check</span>
          <span className={styles.scoreValue}>20/20 ✓</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>2FA Enabled</span>
          <span className={styles.scoreValue}>0/20 ✗</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Service History</span>
          <span className={styles.scoreValue}>19/20 ✓</span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Payment Verified</span>
          <span className={styles.scoreValue}>15/20 ✓</span>
        </div>
      </div>

      <button className={styles.primaryButton} onClick={() => setCurrentPage('settings')}>
        IMPROVE SCORE
      </button>
    </div>
  );

  const renderFinancialDashboard = () => (
    <div className={styles.subPage}>
      <div className={styles.subPageHeader}>
        <button className={styles.backButton} onClick={() => setCurrentPage('main')}>
          ← Back
        </button>
        <h2 className={styles.subPageTitle}>FINANCIAL OVERVIEW</h2>
      </div>

      <div className={styles.financialGrid}>
        <div className={styles.financialCard}>
          <span className={styles.financialLabel}>Current Balance:</span>
          <span className={styles.financialValue}>£{userData.financial.credits.toFixed(2)}</span>
        </div>
        <div className={styles.financialCard}>
          <span className={styles.financialLabel}>Total Spent:</span>
          <span className={styles.financialValue}>£{userData.stats.totalSpent.toFixed(2)}</span>
        </div>
        <div className={styles.financialCard}>
          <span className={styles.financialLabel}>Average per service:</span>
          <span className={styles.financialValue}>£{userData.stats.averagePerRide.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.monthlyComparison}>
        <h3 className={styles.sectionTitle}>MONTHLY COMPARISON</h3>
        <div className={styles.monthlyGrid}>
          <div className={styles.monthlyCard}>
            <span className={styles.monthlyLabel}>This Month:</span>
            <span className={styles.monthlyValue}>£{userData.stats.thisMonth.amount.toFixed(2)} ({userData.stats.thisMonth.Assignments} services)</span>
          </div>
          <div className={styles.monthlyCard}>
            <span className={styles.monthlyLabel}>Last Month:</span>
            <span className={styles.monthlyValue}>£{userData.stats.lastMonth.amount.toFixed(2)} ({userData.stats.lastMonth.Assignments} services)</span>
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.primaryButton}>ADD CREDITS</button>
        <button className={styles.secondaryButton}>DOWNLOAD STATEMENT</button>
      </div>
    </div>
  );

  const renderReferralProgram = () => (
    <div className={styles.subPage}>
      <div className={styles.subPageHeader}>
        <button className={styles.backButton} onClick={() => setCurrentPage('main')}>
          ← Back
        </button>
        <h2 className={styles.subPageTitle}>REFER & EARN</h2>
      </div>

      <div className={styles.referralCard}>
        <h3 className={styles.referralTitle}>Your Code: {userData.referral.code}</h3>

        <div className={styles.shareOptions}>
          <span className={styles.shareLabel}>Share via:</span>
          <div className={styles.shareButtons}>
            <button className={styles.shareButton}>WhatsApp</button>
            <button className={styles.shareButton}>Email</button>
            <button className={styles.shareButton}>Copy Link</button>
          </div>
        </div>

        <div className={styles.referralEarnings}>
          <h4 className={styles.earningsTitle}>Earnings:</h4>
          <p className={styles.earningsText}>
            {userData.referral.friendsJoined} friends joined = £{userData.referral.earned} earned
          </p>
          <p className={styles.earningsText}>
            2 pending = £{userData.referral.pending} potential
          </p>
        </div>

        <div className={styles.howItWorks}>
          <h4 className={styles.howItWorksTitle}>How it works:</h4>
          <ol className={styles.stepsList}>
            <li>Friend signs up with your code</li>
            <li>They complete first service</li>
            <li>You both get £50 credits</li>
          </ol>
        </div>
      </div>
    </div>
  );

  const renderMainPage = () => (
    <div className={styles.mainContent}>
      {/* User Profile Section */}
      <div className={`${styles.profileSection} ${styles.card}`}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            <img src={userData.profile.avatar} alt="Profile" className={styles.avatar} />
            <div className={styles.memberBadge}>
              {userData.profile.tier.toUpperCase()} MEMBER
            </div>
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.userName}>
              {userData.profile.name}
              <button className={styles.editButton}>✏️</button>
            </h1>
            <p className={styles.membershipInfo}>
              EXECUTIVE MEMBER • Member for {userData.profile.membershipYears} years
            </p>
            <div className={styles.contactInfo}>
              <p className={styles.contactItem}>{userData.profile.email}</p>
              <p className={styles.contactItem}>{userData.profile.phone}</p>
            </div>
          </div>
        </div>
        <button className={styles.editProfileButton}>EDIT PROFILE</button>
      </div>

      {/* Protection Status Section */}
      <div className={`${styles.protectionSection} ${styles.card}`}>
        <h2 className={styles.sectionTitle}>YOUR PROTECTION LEVEL</h2>
        <div className={styles.sectionLine}></div>

        <div className={styles.securityScoreContainer}>
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreRing} style={{
              background: `conic-gradient(${getSecurityScoreColor(userData.security.securityScore)} ${userData.security.securityScore * 3.6}deg, var(--bg-tertiary) 0deg)`
            }}>
              <div className={styles.scoreInner}>
                <span className={styles.scoreNumber}>{userData.security.securityScore}</span>
                <span className={styles.scoreMax}>/100</span>
              </div>
            </div>
            <button
              className={styles.infoButton}
              onClick={() => setCurrentPage('security-score')}
            >
              ℹ️
            </button>
          </div>
          <p className={styles.scoreStatus}>"{getSecurityScoreStatus(userData.security.securityScore)}"</p>
        </div>

        <div className={styles.scoreFactors}>
          <h4 className={styles.factorsTitle}>What affects your score:</h4>
          <div className={styles.factorsList}>
            <div className={styles.factorItem}>
              <span className={styles.factorIcon}>✓</span>
              <span>Profile completed</span>
            </div>
            <div className={styles.factorItem}>
              <span className={styles.factorIcon}>✓</span>
              <span>ID verified</span>
            </div>
            <div className={styles.factorItem}>
              <span className={styles.factorIcon}>✓</span>
              <span>Background check passed</span>
            </div>
            <div className={`${styles.factorItem} ${styles.factorIncomplete}`}>
              <span className={styles.factorIcon}>✗</span>
              <span>2FA enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className={`${styles.statsSection} ${styles.card}`}>
        <h2 className={styles.sectionTitle}>YOUR STATISTICS</h2>
        <div className={styles.sectionLine}></div>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.miniCard}`}>
            <span className={styles.statValue}>{userData.stats.totalRides}</span>
            <span className={styles.statLabel}>Protection Assignments</span>
          </div>
          <div className={`${styles.statCard} ${styles.miniCard}`}>
            <span className={styles.statValue}>{userData.stats.totalHours} hrs</span>
            <span className={styles.statLabel}>Hours Protected</span>
          </div>
          <div className={`${styles.statCard} ${styles.miniCard}`}>
            <span className={styles.statValue}>£{userData.stats.totalSpent.toFixed(0)}</span>
            <span className={styles.statLabel}>Investment in Security</span>
          </div>
          <div className={`${styles.statCard} ${styles.miniCard}`}>
            <span className={styles.statValue}>⭐ {userData.stats.userRating}</span>
            <span className={styles.statLabel}>Client Satisfaction</span>
          </div>
          <div className={`${styles.statCard} ${styles.miniCard}`}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Threat-Free Journeys</span>
          </div>
          <div className={`${styles.statCard} ${styles.miniCard}`}>
            <span className={styles.statValue}>5</span>
            <span className={styles.statLabel}>Preferred Officers</span>
          </div>
          <div className={`${styles.statCard} ${styles.miniCard}`}>
            <span className={styles.statValue}>Executive</span>
            <span className={styles.statLabel}>Security Level</span>
          </div>
        </div>

        <button
          className={styles.detailsButton}
          onClick={() => setCurrentPage('financial')}
        >
          VIEW SECURITY REPORT
        </button>
      </div>

      {/* Account Settings Section */}
      <div className={`${styles.settingsSection} ${styles.card}`}>
        <h2 className={styles.sectionTitle}>MANAGE YOUR ACCOUNT</h2>
        <div className={styles.sectionLine}></div>

        <div className={styles.settingsList}>
          <button className={`${styles.settingItem} ${styles.settingCard}`} onClick={() => setCurrentPage('settings')}>
            <span className={styles.settingIcon}>👤</span>
            <div className={styles.settingContent}>
              <span className={styles.settingTitle}>Personal Information</span>
              <span className={styles.settingDesc}>Update name, email, phone</span>
            </div>
            <span className={styles.settingArrow}>→</span>
          </button>

          <button className={`${styles.settingItem} ${styles.settingCard}`} onClick={() => setCurrentPage('settings')}>
            <span className={styles.settingIcon}>🔒</span>
            <div className={styles.settingContent}>
              <span className={styles.settingTitle}>Security & Privacy</span>
              <span className={styles.settingDesc}>2FA, password, ID verification</span>
              {!userData.security.twoFactorEnabled && (
                <span className={styles.actionNeeded}>⚠️ 2FA not enabled - Set up now</span>
              )}
            </div>
            <span className={styles.settingArrow}>→</span>
          </button>

          <button className={`${styles.settingItem} ${styles.settingCard}`} onClick={() => setCurrentPage('financial')}>
            <span className={styles.settingIcon}>💳</span>
            <div className={styles.settingContent}>
              <span className={styles.settingTitle}>Payment & Billing</span>
              <span className={styles.settingDesc}>Cards, invoices, credits</span>
              <span className={styles.balanceInfo}>Balance: £{userData.financial.credits.toFixed(2)} credits</span>
            </div>
            <span className={styles.settingArrow}>→</span>
          </button>

          <button className={`${styles.settingItem} ${styles.settingCard}`} onClick={() => setCurrentPage('settings')}>
            <span className={styles.settingIcon}>🔔</span>
            <div className={styles.settingContent}>
              <span className={styles.settingTitle}>Notifications</span>
              <span className={styles.settingDesc}>Security alerts, protection updates</span>
            </div>
            <span className={styles.settingArrow}>→</span>
          </button>

          <button className={`${styles.settingItem} ${styles.settingCard}`} onClick={() => setCurrentPage('referral')}>
            <span className={styles.settingIcon}>🎁</span>
            <div className={styles.settingContent}>
              <span className={styles.settingTitle}>Referral Program</span>
              <span className={styles.settingDesc}>Earn £50 per friend</span>
              <span className={styles.referralCode}>Your code: {userData.referral.code}</span>
            </div>
            <span className={styles.settingArrow}>→</span>
          </button>

          <button className={`${styles.settingItem} ${styles.settingCard}`} onClick={() => setCurrentPage('settings')}>
            <span className={styles.settingIcon}>⚙️</span>
            <div className={styles.settingContent}>
              <span className={styles.settingTitle}>Preferences</span>
              <span className={styles.settingDesc}>Default service, accessibility</span>
            </div>
            <span className={styles.settingArrow}>→</span>
          </button>

          <button className={`${styles.settingItem} ${styles.settingCard}`} onClick={() => setCurrentPage('settings')}>
            <span className={styles.settingIcon}>📱</span>
            <div className={styles.settingContent}>
              <span className={styles.settingTitle}>Active Sessions</span>
              <span className={styles.settingDesc}>Manage logged-in devices</span>
              <span className={styles.sessionInfo}>✓ Currently {userData.security.loginSessions.length} active</span>
            </div>
            <span className={styles.settingArrow}>→</span>
          </button>
        </div>
      </div>

      {/* Achievements Section */}
      <div className={`${styles.achievementsSection} ${styles.card}`}>
        <h2 className={styles.sectionTitle}>YOUR ACHIEVEMENTS</h2>
        <div className={styles.sectionLine}></div>

        <div className={styles.badgesList}>
          {userData.achievements.badges.map(badge => (
            <div key={badge.id} className={`${styles.badge} ${badge.earned ? styles.badgeEarned : ''}`}>
              <span className={styles.badgeIcon}>{badge.icon}</span>
              <span className={styles.badgeName}>{badge.name}</span>
            </div>
          ))}
        </div>

        <button className={styles.viewAllButton}>VIEW ALL ACHIEVEMENTS →</button>
      </div>

      {/* Support Section */}
      <div className={`${styles.supportSection} ${styles.card}`}>
        <h2 className={styles.sectionTitle}>NEED HELP?</h2>
        <div className={styles.sectionLine}></div>

        <div className={styles.supportOptions}>
          <a href="tel:0800-ARMORA" className={styles.supportOption}>
            <span className={styles.supportIcon}>📞</span>
            <span className={styles.supportText}>24/7 Support: 0800 ARMORA</span>
          </a>
          <button className={styles.supportOption} onClick={() => setCurrentPage('support')}>
            <span className={styles.supportIcon}>💬</span>
            <span className={styles.supportText}>Live Chat</span>
          </button>
          <a href="mailto:support@armora.dev" className={styles.supportOption}>
            <span className={styles.supportIcon}>📧</span>
            <span className={styles.supportText}>Email Support</span>
          </a>
          <button className={styles.supportOption} onClick={() => setCurrentPage('support')}>
            <span className={styles.supportIcon}>❓</span>
            <span className={styles.supportText}>FAQs</span>
          </button>
        </div>

        <button className={styles.reportButton}>REPORT AN ISSUE</button>
      </div>

      {/* Bottom Actions */}
      <div className={styles.bottomActions}>
        <button className={styles.signOutButton} onClick={handleSignOut}>
          SIGN OUT
        </button>
        <button className={styles.deleteAccountButton} onClick={handleDeleteAccount}>
          DELETE ACCOUNT
        </button>

        <div className={styles.appInfo}>
          <span>Version 2.4.1 • </span>
          <button className={styles.linkButton}>Terms</button>
          <span> • </span>
          <button className={styles.linkButton}>Privacy</button>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'security-score':
        return renderSecurityScoreBreakdown();
      case 'financial':
        return renderFinancialDashboard();
      case 'referral':
        return renderReferralProgram();
      default:
        return renderMainPage();
    }
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.backgroundPattern}></div>
      <div className={styles.contentArea}>
        {renderCurrentPage()}
      </div>
    </div>
  );
}