import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    isFullWidth && styles.fullWidth,
    isLoading && styles.loading,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className={styles.spinner} aria-hidden="true">
          <div className={styles.spinnerRing}></div>
        </div>
      )}
      
      {!isLoading && leftIcon && (
        <span className={styles.iconLeft} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span className={styles.content}>
        {children}
      </span>
      
      {!isLoading && rightIcon && (
        <span className={styles.iconRight} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}