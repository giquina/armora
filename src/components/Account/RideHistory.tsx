import React from 'react';

interface UserAccountData {
  analytics: {
    totalRides: number;
    totalHours: number;
  };
}

interface RideHistoryProps {
  userData: UserAccountData;
}

export function RideHistory({ userData }: RideHistoryProps) {
  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h2 style={{ color: 'var(--text-primary)' }}>📊 Assignment History & Analytics</h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Total Assignments: {userData.analytics.totalRides} • Hours Protected: {userData.analytics.totalHours}
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        Comprehensive Assignment history and analytics dashboard coming soon...
      </p>
    </div>
  );
}