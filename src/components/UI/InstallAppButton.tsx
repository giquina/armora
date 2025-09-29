import { FC, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './InstallAppButton.module.css';

interface InstallAppButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact';
}

export const InstallAppButton: FC<InstallAppButtonProps> = ({
  className = '',
  variant = 'primary'
}) => {
  const { state, showInstallPrompt, canInstall } = useApp();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstallClick = async () => {
    if (!canInstall()) {
      console.log('[PWA] Cannot install - conditions not met');
      return;
    }

    setIsInstalling(true);

    try {
      const installed = await showInstallPrompt();

      if (installed) {
        console.log('[PWA] App was successfully installed');
      } else {
        console.log('[PWA] User cancelled installation');
      }
    } catch (error) {
      console.error('[PWA] Error during installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show if already installed or not installable
  if (state.deviceCapabilities.isInstalled || !canInstall()) {
    return null;
  }

  const buttonText = isInstalling ? 'Installing...' : 'Install App';
  const buttonClass = `${styles.installButton} ${styles[variant]} ${className}`;

  return (
    <button
      onClick={handleInstallClick}
      disabled={isInstalling}
      className={buttonClass}
      aria-label="Install Armora Security app"
    >
      <span className={styles.icon}>📱</span>
      {variant !== 'compact' && (
        <span className={styles.text}>{buttonText}</span>
      )}
    </button>
  );
};

export default InstallAppButton;