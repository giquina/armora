
interface UserAccountData {
  profile: {
    tier: string;
  };
}

interface MembershipBenefitsProps {
  userData: UserAccountData;
}

export function MembershipBenefits({ userData }: MembershipBenefitsProps) {
  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h2 style={{ color: 'var(--text-primary)' }}>⭐ Membership Benefits</h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Current Tier: {userData.profile.tier}
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        Comprehensive membership benefits and tier management coming soon...
      </p>
    </div>
  );
}