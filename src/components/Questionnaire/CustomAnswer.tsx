import { useState } from 'react';
import styles from './CustomAnswer.module.css';

interface CustomAnswerProps {
  value: string;
  onChange: (value: string) => void;
  isSelected: boolean;
  onToggle: (selected: boolean) => void;
  disabled?: boolean;
  className?: string;
  stepId?: number;
}

export function CustomAnswer({
  value,
  onChange,
  isSelected,
  onToggle,
  disabled = false,
  className = '',
  stepId = 1
}: CustomAnswerProps) {
  const [isExpanded, setIsExpanded] = useState(isSelected);

  const handleToggle = () => {
    if (!disabled) {
      const newSelected = !isSelected;
      onToggle(newSelected);
      setIsExpanded(newSelected);
      if (!newSelected) {
        onChange(''); // Clear text when toggling off
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 200) {
      onChange(newValue);
      if (!isSelected && newValue.trim()) {
        onToggle(true);
      }
    }
  };

  const handleClear = () => {
    onChange('');
    onToggle(false);
    setIsExpanded(false);
  };

  const getPlaceholderText = (stepId: number): string => {
    const placeholders: Record<number, string> = {
      1: "Describe your professional role or situation...",
      2: "Explain your travel frequency or pattern...",
      3: "Share your specific service requirements...",
      4: "Tell us about your coverage area needs...",
      5: "Describe your secondary location requirements...",
      6: "Share your safety contact preferences...",
      7: "Explain any special requirements you have...",
      8: "Add any communication preferences...",
      9: "Share any final thoughts or requirements..."
    };
    return placeholders[stepId] || "Share your thoughts or specific requirements...";
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.separator}>
        <div className={styles.separatorLine}></div>
        <span className={styles.separatorText}>or</span>
        <div className={styles.separatorLine}></div>
      </div>

      <div
        className={`${styles.customOption} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
        onClick={!isExpanded ? handleToggle : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyPress={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !disabled && !isExpanded) {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className={styles.toggleContainer}>
          <div className={`${styles.toggle} ${isSelected ? styles.toggleActive : ''}`} onClick={handleToggle}>
            <div className={`${styles.toggleSlider} ${isSelected ? styles.sliderActive : ''}`}></div>
          </div>
          <div className={styles.textContainer}>
            <span className={styles.mainText}>✏️ Custom Answer</span>
            <span className={styles.helperText}>Have a different answer? Tell us more</span>
          </div>
        </div>

        {isExpanded && (
          <div className={styles.inputSection}>
            <textarea
              value={value}
              onChange={handleTextChange}
              placeholder={getPlaceholderText(stepId)}
              className={styles.textArea}
              rows={3}
              maxLength={200}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <div className={styles.inputFooter}>
              <div className={styles.characterCount}>
                {value.length}/200 characters
              </div>
              {value.trim() && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {isSelected && value.trim() && (
          <div className={styles.confirmationMessage}>
            <span className={styles.confirmationIcon}>✓</span>
            <span>Custom answer provided</span>
          </div>
        )}
      </div>
    </div>
  );
}