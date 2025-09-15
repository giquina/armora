import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { CreditBalance } from './CreditBalance';
import { ShareButtons } from './ShareButtons';
import { ReferralStats } from './ReferralStats';
import styles from './ReferralSection.module.css';

interface UserCredits {
  available: number;
  earned: number;
  used: number;
  referralCode: string;
  referrals: Array<{
    date: string;
    friendCode: string;
    status: 'invited' | 'joined' | 'subscribed';
    creditEarned: number;
  }>;
}

export function ReferralSection() {
  const { state } = useApp();
  const { user } = state;
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Generate or load user's referral code and credits
  useEffect(() => {
    if (user) {
      const generateReferralCode = () => {
        // Generate code based on user name + random numbers
        const userName = user.name?.replace(/\s+/g, '').toUpperCase() || 'USER';
        const randomNum = Math.floor(Math.random() * 999) + 100;
        return `${userName.substring(0, 4)}${randomNum}`;
      };

      // Load existing credits or create new ones
      const storageKey = `armora_credits_${user.id}`;
      const existingCredits = localStorage.getItem(storageKey);

      if (existingCredits) {
        setCredits(JSON.parse(existingCredits));
      } else {
        // Initialize new credits for user
        const newCredits: UserCredits = {
          available: 0,
          earned: 0,
          used: 0,
          referralCode: generateReferralCode(),
          referrals: []
        };

        // For demo purposes, add some sample data for existing users
        if (user.userType === 'registered' || user.userType === 'google') {
          newCredits.available = 3;
          newCredits.earned = 5;
          newCredits.used = 2;
          newCredits.referrals = [
            {
              date: '2024-01-15',
              friendCode: 'JANE456',
              status: 'subscribed',
              creditEarned: 1
            },
            {
              date: '2024-01-10',
              friendCode: 'MIKE789',
              status: 'subscribed',
              creditEarned: 1
            },
            {
              date: '2024-01-05',
              friendCode: 'SARAH321',
              status: 'joined',
              creditEarned: 0
            }
          ];
        }

        setCredits(newCredits);
        localStorage.setItem(storageKey, JSON.stringify(newCredits));
      }
    }
  }, [user]);

  if (!user || !credits) {
    return null;
  }

  const referralLink = `https://app.armora.security/join?ref=${credits.referralCode}`;

  return (
    <div className={styles.referralSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>🎁</span>
          Invite & Earn
        </h2>
        <p className={styles.subtitle}>
          Earn ride credits when friends join Armora
        </p>
      </div>

      {/* Credit Balance */}
      <CreditBalance
        available={credits.available}
        earned={credits.earned}
        used={credits.used}
      />

      {/* Referral Code */}
      <div className={styles.codeSection}>
        <div className={styles.codeHeader}>
          <h3 className={styles.codeTitle}>Your Referral Code</h3>
        </div>
        <div className={styles.codeDisplay}>
          <span className={styles.code}>{credits.referralCode}</span>
          <button
            className={styles.copyCodeButton}
            onClick={() => {
              navigator.clipboard.writeText(credits.referralCode);
              // Could add toast notification here
            }}
            aria-label="Copy referral code"
          >
            📋 Copy
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <ShareButtons
        referralCode={credits.referralCode}
        referralLink={referralLink}
      />

      {/* Referral Stats */}
      <ReferralStats referrals={credits.referrals} />

      {/* How It Works Section */}
      <div className={styles.howItWorksSection}>
        <button
          className={styles.howItWorksToggle}
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          aria-expanded={showHowItWorks}
        >
          <span>How It Works</span>
          <span className={styles.toggleIcon}>{showHowItWorks ? '▼' : '▶'}</span>
        </button>

        {showHowItWorks && (
          <div className={styles.howItWorksContent}>
            <h4 className={styles.howItWorksTitle}>How to Earn Credits:</h4>
            <ol className={styles.howItWorksList}>
              <li>Share your unique code with friends</li>
              <li>They sign up using your code</li>
              <li>When they pay subscription, you earn credits</li>
              <li>Use credits on any Armora ride</li>
            </ol>

            <h4 className={styles.howItWorksTitle}>Credit Values:</h4>
            <ul className={styles.creditValuesList}>
              <li>Monthly subscription (£14) = £1 credit</li>
              <li>Annual subscription (£140) = £12 credit</li>
              <li>Credits never expire</li>
              <li>Maximum 50% of ride can be paid with credits</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}