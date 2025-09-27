import styles from './FloatingActionButton.module.css';

interface FloatingActionButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export function FloatingActionButton({ onClick, isVisible }: FloatingActionButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      className={styles.fab}
      onClick={onClick}
      aria-label="Become Protection Officer - Join our team"
      title="Become Protection Officer"
    >
      <span className={styles.fabIcon}>🛡️</span>
      <span className={styles.fabText}>Become Protection Officer</span>
    </button>
  );
}