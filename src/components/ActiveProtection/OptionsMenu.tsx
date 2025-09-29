import { useState, useEffect, useRef } from 'react';
import styles from './OptionsMenu.module.css';

export interface MenuOption {
  label: string;
  action: () => void;
  requiresApproval?: boolean;
  icon?: string;
}

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  options: MenuOption[];
  position: 'bottom' | 'top';
  buttonRef: React.RefObject<HTMLElement>;
}

export function OptionsMenu({ isOpen, onClose, options, position, buttonRef }: OptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleOptionClick = (option: MenuOption) => {
    option.action();
    onClose();
  };

  if (!isOpen) return null;

  // Mobile bottom sheet
  if (isMobile) {
    return (
      <>
        <div className={styles.backdrop} onClick={onClose} />
        <div className={styles.bottomSheet} ref={menuRef}>
          <div className={styles.bottomSheetHeader}>
            <div className={styles.bottomSheetHandle} />
          </div>
          <div className={styles.bottomSheetContent}>
            {options.map((option, index) => (
              <button
                key={index}
                className={styles.bottomSheetOption}
                onClick={() => handleOptionClick(option)}
              >
                {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
                <span className={styles.optionLabel}>{option.label}</span>
                {option.requiresApproval && (
                  <span className={styles.approvalBadge}>Requires approval</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Desktop dropdown
  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={`${styles.dropdownMenu} ${styles[position]}`}
        ref={menuRef}
        style={{
          position: 'absolute',
          top: position === 'bottom' ? '100%' : 'auto',
          bottom: position === 'top' ? '100%' : 'auto',
          right: 0,
          marginTop: position === 'bottom' ? '4px' : '0',
          marginBottom: position === 'top' ? '4px' : '0',
        }}
      >
        {options.map((option, index) => (
          <button
            key={index}
            className={styles.dropdownOption}
            onClick={() => handleOptionClick(option)}
          >
            {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
            <span className={styles.optionLabel}>{option.label}</span>
            {option.requiresApproval && (
              <span className={styles.approvalBadge}>✓</span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}