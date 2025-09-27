import { useEffect, useState } from 'react';
import { SelectionFeedback as ISelectionFeedback } from '../../data/selectionFeedbackData';
import styles from './SelectionFeedback.module.css';

interface SelectionFeedbackProps {
  feedback: ISelectionFeedback | null;
  isVisible: boolean;
  className?: string;
}

export function SelectionFeedback({ feedback, isVisible, className }: SelectionFeedbackProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible && feedback) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for animation
      const timer = setTimeout(() => setIsAnimating(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Wait for exit animation before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, feedback]);

  if (!shouldRender || !feedback) {
    return null;
  }

  return (
    <div
      className={`${styles.container} ${isAnimating ? styles.visible : ''} ${className || ''}`}
      id="selection-feedback"
    >
      <div className={styles.content}>
        {/* Header with icon and title */}
        <div className={styles.header}>
          <span className={styles.icon} role="img" aria-label="Selection icon">
            {feedback.icon}
          </span>
          <h3 className={styles.title}>{feedback.title}</h3>
        </div>

        {/* Description */}
        <p className={styles.description}>{feedback.description}</p>

        {/* Benefits list */}
        <div className={styles.benefitsSection}>
          <h4 className={styles.benefitsTitle}>
            <span className={styles.benefitsIcon}>✨</span>
            <span>What This Includes:</span>
          </h4>
          <ul className={styles.benefitsList}>
            {feedback.benefits.map((benefit, index) => (
              <li key={index} className={styles.benefitItem}>
                <span className={styles.checkmark}>✓</span>
                <span className={styles.benefitText}>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security badge */}
        <div className={styles.securityBadge}>
          <span className={styles.securityIcon}>🛡️</span>
          <span className={styles.securityText}>SIA Licensed • Government Approved • Fully Insured</span>
        </div>
      </div>

      {/* Decorative elements */}
      <div className={styles.decorativeGlow}></div>
    </div>
  );
}