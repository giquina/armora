import React from 'react';
import styles from './Step2BottomCTA.module.css';
import { Icon } from '../UI/Icon';

interface Step2BottomCTAProps {
  onBack: () => void;
  onSaveExit: () => void;
  onContinue: () => void;
  canContinue: boolean;
  dynamicBackText?: string;
  dynamicContinueText?: string;
}

export function Step2BottomCTA({
  onBack,
  onSaveExit,
  onContinue,
  canContinue,
  dynamicBackText = "Back",
  dynamicContinueText = "Continue"
}: Step2BottomCTAProps) {
  return (
    <div className={styles.ctaContainer}>
      <div className={`${styles.ctaButtonsRow} ${styles.step2Layout}`}>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`${styles.ctaButton} ${styles.continueButton}`}
        >
          <span className={styles.ctaLabel}><Icon name="arrow-right" size={18} /> {dynamicContinueText}</span>
        </button>

        <button
          onClick={onBack}
          className={`${styles.ctaButton} ${styles.backButton}`}
        >
          <span className={styles.ctaLabel}><Icon name="chevron-left" size={18} /> {dynamicBackText}</span>
        </button>
        
        <button
          onClick={onSaveExit}
          className={`${styles.ctaButton} ${styles.saveExitButton}`}
        >
          <span className={styles.ctaLabel}><Icon name="save" size={18} /> Save & Exit</span>
        </button>
      </div>
    </div>
  );
}