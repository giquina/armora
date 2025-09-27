import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'light';
  text?: string;
  inline?: boolean;
}

export function LoadingSpinner({ 
  size = 'medium', 
  variant = 'primary', 
  text,
  inline = false 
}: LoadingSpinnerProps) {
  return (
    <div className={`${styles.container} ${inline ? styles.inline : ''}`}>
      <div 
        className={`${styles.spinner} ${styles[size]} ${styles[variant]}`}
        role="status"
        aria-label={text || 'Loading'}
      >
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      {text && (
        <span className={styles.text} aria-hidden="true">
          {text}
        </span>
      )}
    </div>
  );
}