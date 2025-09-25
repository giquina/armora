import React, { useState } from 'react';
import { LocationPicker } from './LocationPicker';
import { useApp } from '../../contexts/AppContext';
import { ServiceLevel } from '../../types';
import styles from './LegacyAssignmentPage.module.css';

/**
 * LegacyAssignmentPage
 * Full-screen page that shows the prior dark assignment experience by simply
 * mounting the LocationPicker overlay in an always-open state with a dark backdrop.
 * This lets stakeholders view the old design directly via the app router.
 */
export default function LegacyAssignmentPage() {
  const { navigateToView, user } = useApp();

  return (
    <div className={styles.legacyPage}>
      {/* We mount LocationPicker with required props for legacy viewing */}
      <LocationPicker
        selectedService={'essential' as ServiceLevel}
        onLocationConfirmed={() => {
          // Do nothing for legacy viewing
        }}
        onBack={() => {
          // Return to home if user goes back
          navigateToView('home');
        }}
        onClose={() => {
          // Return to home if user dismisses
          navigateToView('home');
        }}
        user={user}
      />
    </div>
  );
}
