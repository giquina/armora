import React, { useState } from 'react';
import { LocationPicker } from '../LocationPicker/LocationPicker';
import { useApp } from '../../contexts/AppContext';
import styles from './LegacyBookingPage.module.css';

/**
 * LegacyBookingPage
 * Full-screen page that shows the prior dark booking experience by simply
 * mounting the LocationPicker overlay in an always-open state with a dark backdrop.
 * This lets stakeholders view the old design directly via the app router.
 */
export default function LegacyBookingPage() {
  const [open, setOpen] = useState(true);
  const { navigateToView } = useApp();

  return (
    <div className={styles.legacyPage}>
      {/* We mount LocationPicker in open state and keep it open so it fills the screen */}
      <LocationPicker
        isOpen={open}
        onClose={() => {
          // Return to home if user dismisses
          setOpen(false);
          navigateToView('home');
        }}
        suppressNavigate
        onLocationSelect={() => { /* do nothing here; this page is for viewing */ }}
      />
    </div>
  );
}
