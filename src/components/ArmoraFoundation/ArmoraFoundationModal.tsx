import React from 'react';
import styles from './ArmoraFoundationModal.module.css';

interface ArmoraFoundationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ArmoraFoundationModal({ isOpen, onClose }: ArmoraFoundationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.content}>
          <h2 className={styles.title}>Armora Foundation</h2>
          <p className={styles.description}>
            Supporting community safety initiatives and security awareness programs.
          </p>
          <div className={styles.initiatives}>
            <div className={styles.initiative}>
              <h3>Community Safety</h3>
              <p>Local neighborhood watch and safety education programs.</p>
            </div>
            <div className={styles.initiative}>
              <h3>Security Training</h3>
              <p>Professional development for security industry workers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArmoraFoundationModal;