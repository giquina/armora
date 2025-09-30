import { useState, useRef, useCallback } from 'react';
import { OptionsMenu, MenuOption } from './OptionsMenu';
import styles from './CTAButton.module.css';

interface CTAButtonProps {
  title: string;
  subtitle?: string;
  icon: string;
  color: 'emergency' | 'primary' | 'secondary' | 'warning' | 'info' | 'neutral';
  onMainAction: () => void;
  menuOptions: MenuOption[];
  className?: string;
  pendingApproval?: boolean;
  isFullWidth?: boolean;
}

export function CTAButton({
  title,
  subtitle,
  icon,
  color,
  onMainAction,
  menuOptions,
  className = '',
  pendingApproval = false,
  isFullWidth = false
}: CTAButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');

  const handleMainClick = useCallback(() => {
    if (pendingApproval) return; // Disable main action when pending
    onMainAction();
  }, [onMainAction, pendingApproval]);

  const handleOptionsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    // Calculate menu position based on button position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;

      // Show menu above if less than 200px space below
      setMenuPosition(spaceBelow < 200 ? 'top' : 'bottom');
    }

    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const buttonClasses = [
    styles.ctaButton,
    styles[color],
    isFullWidth ? styles.fullWidth : '',
    pendingApproval ? styles.pending : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.ctaButtonContainer}>
      <button
        ref={buttonRef}
        className={buttonClasses}
        onClick={handleMainClick}
        disabled={pendingApproval}
        aria-label={subtitle ? `${title} - ${subtitle}` : title}
      >
        <span className={styles.buttonTitle}>
          <span className={styles.buttonIcon}>{icon}</span>
          {title}
        </span>
        {subtitle && <span className={styles.buttonSubtitle}>{subtitle}</span>}

        {pendingApproval && (
          <div className={styles.pendingOverlay}>
            <span className={styles.pendingText}>Pending approval</span>
            <div className={styles.pendingSpinner} />
          </div>
        )}

        {menuOptions.length > 0 && (
          <button
            className={styles.optionsButton}
            onClick={handleOptionsClick}
            aria-label={`More options for ${title}`}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="2" r="1.5"/>
              <circle cx="8" cy="8" r="1.5"/>
              <circle cx="8" cy="14" r="1.5"/>
            </svg>
          </button>
        )}

        {isMenuOpen && (
          <OptionsMenu
            isOpen={isMenuOpen}
            onClose={handleCloseMenu}
            options={menuOptions}
            position={menuPosition}
            buttonRef={buttonRef as React.RefObject<HTMLElement>}
          />
        )}
      </button>
    </div>
  );
}