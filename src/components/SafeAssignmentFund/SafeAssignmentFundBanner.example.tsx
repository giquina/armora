// Example usage of SafeRideFundBanner component
// This file demonstrates how to integrate the banner into different parts of the app

import { FC } from 'react';
import SafeAssignmentFundBanner from './SafeAssignmentFundBanner';
import SafeAssignmentFundModal from './SafeAssignmentFundModal';

// Example 1: Basic usage with modal integration
export const BasicBannerExample: FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div>
      {/* Full banner with click handler */}
      <SafeAssignmentFundBanner
        onBannerClick={() => setShowModal(true)}
        variant="full"
      />

      {showModal && (
        <SafeAssignmentFundModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

// Example 2: Compact banner for sidebars or smaller spaces
export const CompactBannerExample: FC = () => {
  return (
    <div style={{ width: '300px' }}>
      <SafeAssignmentFundBanner
        variant="compact"
        className="my-custom-banner"
      />
    </div>
  );
};

// Example 3: Read-only banner without interaction
export const ReadOnlyBannerExample: FC = () => {
  return (
    <SafeAssignmentFundBanner
      variant="full"
      // No onBannerClick prop means it's read-only
    />
  );
};

// Example 4: Integration in WelcomePage (suggested placement)
export const WelcomePageIntegration: FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="welcome-page">
      {/* Other welcome page content */}
      
      {/* Add banner before or after main content */}
      <SafeAssignmentFundBanner
        onBannerClick={() => setShowModal(true)}
        variant="full"
      />

      {/* Rest of welcome page content */}

      {showModal && (
        <SafeAssignmentFundModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

// Example 5: Dashboard integration
export const DashboardIntegration: FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Compact banner in dashboard */}
      <SafeAssignmentFundBanner
        variant="compact"
      />
      
      {/* Other dashboard content */}
    </div>
  );
};