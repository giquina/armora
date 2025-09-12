// Example usage of SafeRideFundBanner component
// This file demonstrates how to integrate the banner into different parts of the app

import React from 'react';
import SafeRideFundBanner from './SafeRideFundBanner';
import SafeRideFundModal from './SafeRideFundModal';

// Example 1: Basic usage with modal integration
export const BasicBannerExample: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div>
      {/* Full banner with click handler */}
      <SafeRideFundBanner 
        onBannerClick={() => setShowModal(true)}
        variant="full"
      />
      
      {showModal && (
        <SafeRideFundModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

// Example 2: Compact banner for sidebars or smaller spaces
export const CompactBannerExample: React.FC = () => {
  return (
    <div style={{ width: '300px' }}>
      <SafeRideFundBanner 
        variant="compact"
        className="my-custom-banner"
      />
    </div>
  );
};

// Example 3: Read-only banner without interaction
export const ReadOnlyBannerExample: React.FC = () => {
  return (
    <SafeRideFundBanner 
      variant="full"
      // No onBannerClick prop means it's read-only
    />
  );
};

// Example 4: Integration in WelcomePage (suggested placement)
export const WelcomePageIntegration: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="welcome-page">
      {/* Other welcome page content */}
      
      {/* Add banner before or after main content */}
      <SafeRideFundBanner 
        onBannerClick={() => setShowModal(true)}
        variant="full"
      />
      
      {/* Rest of welcome page content */}
      
      {showModal && (
        <SafeRideFundModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

// Example 5: Dashboard integration
export const DashboardIntegration: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Compact banner in dashboard */}
      <SafeRideFundBanner 
        variant="compact"
        onBannerClick={() => console.log('Navigate to Safe Ride Fund details')}
      />
      
      {/* Other dashboard content */}
    </div>
  );
};