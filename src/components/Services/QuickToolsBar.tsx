import { useState } from 'react';
import styles from './QuickToolsBar.module.css';

interface QuickToolsBarProps {
  onShowComparison: () => void;
  onShowCalculator: () => void;
  onShowChat: () => void;
}

export function QuickToolsBar({
  onShowComparison,
  onShowCalculator,
  onShowChat
}: QuickToolsBarProps) {
  const [isSticky, setIsSticky] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setIsSticky(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${styles.toolsBar} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.toolsContainer}>
        <h3 className={styles.toolsTitle}>🚀 Quick Tools</h3>

        <div className={styles.tools}>
          <button
            className={styles.tool}
            onClick={onShowCalculator}
            title="Get instant price estimates"
          >
            <span className={styles.toolIcon}>💰</span>
            <span className={styles.toolLabel}>Price Calculator</span>
            <span className={styles.toolDescription}>Live pricing</span>
          </button>

          <button
            className={styles.tool}
            onClick={onShowComparison}
            title="Compare services side-by-side"
          >
            <span className={styles.toolIcon}>📊</span>
            <span className={styles.toolLabel}>Compare Services</span>
            <span className={styles.toolDescription}>Side-by-side</span>
          </button>

          <button
            className={styles.tool}
            onClick={onShowChat}
            title="Chat with security experts"
          >
            <span className={styles.toolIcon}>💬</span>
            <span className={styles.toolLabel}>Live Chat</span>
            <span className={styles.toolDescription}>Expert help</span>
          </button>
        </div>

        {/* Mobile CTA */}
        <div className={styles.mobileCTA}>
          <button className={styles.mobileCTAButton} onClick={onShowCalculator}>
            💰 Price Calculator
          </button>
        </div>
      </div>
    </div>
  );
}