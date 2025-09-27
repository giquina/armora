import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ResponsiveModal.module.css';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
  position?: 'center' | 'bottom';
}

export function ResponsiveModal({
  isOpen,
  onClose,
  children,
  className = '',
  showBackdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  animationType = 'slide',
  position = 'bottom'
}: ResponsiveModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = 'unset';
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusableElement = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;

      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalClasses = [
    styles.modal,
    styles[`animation-${animationType}`],
    styles[`position-${position}`],
    className
  ].filter(Boolean).join(' ');

  const modalContent = (
    <div
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {showBackdrop && <div className={styles.backdrop} />}

      <div
        ref={modalRef}
        className={modalClasses}
        role="document"
      >
        {children}
      </div>
    </div>
  );

  // Render to portal for proper z-index layering
  return createPortal(modalContent, document.body);
}