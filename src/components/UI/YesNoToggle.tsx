import { FC } from 'react';
import styles from './YesNoToggle.module.css';

interface YesNoToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const YesNoToggle: FC<YesNoToggleProps> = ({
  value,
  onChange,
  disabled = false,
  label,
  className = ''
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`${styles.toggleContainer} ${className}`}>
      {label && (
        <span className={styles.label}>{label}</span>
      )}
      <div
        className={`${styles.toggle} ${value ? styles.yes : styles.no} ${disabled ? styles.disabled : ''}`}
        onClick={handleToggle}
        onKeyPress={handleKeyPress}
        role="switch"
        aria-checked={value}
        aria-label={label || `Toggle: currently ${value ? 'Yes' : 'No'}`}
        tabIndex={disabled ? -1 : 0}
      >
        <div className={styles.track}>
          <span className={`${styles.textLabel} ${styles.noText}`}>No</span>
          <span className={`${styles.textLabel} ${styles.yesText}`}>Yes</span>
          <div className={styles.indicator} />
        </div>
      </div>
    </div>
  );
};

export default YesNoToggle;