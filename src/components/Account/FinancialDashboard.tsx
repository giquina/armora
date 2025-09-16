import React from 'react';

interface UserAccountData {
  financial: {
    credits: number;
    totalSpent: number;
    monthlySpend: number[];
    paymentMethods: any[];
    subscription: any;
  };
}

interface FinancialDashboardProps {
  userData: UserAccountData;
  isCompact?: boolean;
}

export function FinancialDashboard({ userData, isCompact }: FinancialDashboardProps) {
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
          💳 Financial Dashboard
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0', fontSize: 'var(--font-sm)' }}>
          Credits: £{userData.financial.credits} • Spent: £{userData.financial.totalSpent}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h2 style={{ color: 'var(--text-primary)' }}>💳 Financial Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Comprehensive financial dashboard with charts and analytics coming soon...
      </p>
    </div>
  );
}