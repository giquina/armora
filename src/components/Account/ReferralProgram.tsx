import React from 'react';

interface UserAccountData {
  financial: {
    credits: number;
  };
}

interface ReferralProgramProps {
  userData: UserAccountData;
  isCompact?: boolean;
}

export function ReferralProgram({ userData, isCompact }: ReferralProgramProps) {
  if (isCompact) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        textAlign: 'center'
      }}>
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-sm) 0' }}>
          🎁 Referral Program
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0', fontSize: 'var(--font-sm)' }}>
          Earn credits by inviting friends
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h2 style={{ color: 'var(--text-primary)' }}>🎁 Enhanced Referral Program</h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Enhanced referral program with gamification and rewards coming soon...
      </p>
    </div>
  );
}