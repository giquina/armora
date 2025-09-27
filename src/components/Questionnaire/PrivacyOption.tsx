import styles from './PrivacyOption.module.css';

interface PrivacyOptionProps {
  stepId: number;
  isSelected: boolean;
  onSelect: () => void;
  stepType: 'radio' | 'checkbox';
}

const privacyMessages = {
  1: "Our security specialists will recommend appropriate service levels based on your protection assignment patterns and general requirements",
  2: "We'll provide flexible scheduling options for all service frequencies without storing specific usage data", 
  3: "All service features will be available with premium privacy protocols maintained throughout",
  4: "We offer comprehensive UK coverage regardless of specific area preferences disclosed",
  5: "Our Protection Officers are trained to adapt to any service requirements discretely on demand",
  6: "All routes and destinations handled with maximum confidentiality and minimal data retention",
  7: "Special requirements can be communicated directly to your assigned Protection Officer without prior disclosure",
  8: "Priority protocols available without personal information storage in our systems",
  9: "Service selection available with anonymous protection assignment capabilities and minimal profile requirements"
};

export function PrivacyOption({ stepId, isSelected, onSelect, stepType }: PrivacyOptionProps) {
  const message = privacyMessages[stepId as keyof typeof privacyMessages] || 
    "We'll provide premium service while maintaining your privacy preferences";

  return (
    <div className={styles.privacySection}>
      <label className={`${styles.privacyOption} ${isSelected ? styles.selected : ''}`}>
        <input
          type={stepType}
          value="prefer_not_to_say"
          checked={isSelected}
          onChange={onSelect}
          className={stepType === 'radio' ? styles.radioInput : styles.checkboxInput}
        />
        <div className={styles.privacyContent}>
          <div className={styles.privacyHeader}>
            <span className={styles.privacyLabel}>Prefer not to say</span>
            <span className={styles.privacyBadge}>Maximum Privacy</span>
          </div>
          <p className={styles.privacyDescription}>
            Skip this question while maintaining maximum privacy
          </p>
          <div className={styles.privacyMessage}>
            <strong>Service Impact:</strong> {message}
          </div>
        </div>
      </label>
    </div>
  );
}