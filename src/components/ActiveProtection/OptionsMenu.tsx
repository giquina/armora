import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate menu position relative to viewport when button ref changes
  useEffect(() => {
    if (!buttonRef.current || isMobile) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuPosition({
          top: position === 'bottom' ? rect.bottom + 4 : rect.top - 4,
          left: rect.right - 180, // Align right edge with button
        });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [buttonRef, position, isMobile, isOpen]);

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

  // Handle for closing mobile sheet
  const handleHandleClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  // Touch handlers for swipe-to-close on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    const diff = currentY - startY;
    // If swiped down more than 100px, close the sheet
    if (diff > 100) {
      onClose();
    }
    setStartY(0);
    setCurrentY(0);
  };

  if (!isOpen) return null;

  // Mobile bottom sheet - also render via portal
  if (isMobile) {
    return createPortal(
      <>
        <div className={styles.backdrop} onClick={onClose} />
        <div
          className={styles.bottomSheet}
          ref={menuRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.bottomSheetHeader} onClick={handleHandleClick}>
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
      </>,
      document.body
    );
  }

  // Desktop dropdown - render via portal to document body
  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={`${styles.dropdownMenu} ${styles[position]}`}
        ref={menuRef}
        style={{
          position: 'fixed',
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
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
    </>,
    document.body
  );
}