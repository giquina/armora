import React, { useState } from 'react';
import styles from './ShareButtons.module.css';

interface ShareButtonsProps {
  referralCode: string;
  referralLink: string;
}

export function ShareButtons({ referralCode, referralLink }: ShareButtonsProps) {
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const shareMessage = `I use Armora for secure protection services. Use my code ${referralCode} to get £5 off your first service and 1 month free premium!`;

  const handleWhatsAppShare = () => {
    const encodedMessage = encodeURIComponent(`${shareMessage} ${referralLink}`);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSMSShare = () => {
    const encodedMessage = encodeURIComponent(`${shareMessage} ${referralLink}`);
    const smsUrl = `sms:?body=${encodedMessage}`;
    window.open(smsUrl);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className={styles.shareSection}>
      <h3 className={styles.shareTitle}>Share Your Code</h3>
      <p className={styles.shareSubtitle}>
        Invite friends and earn £1-12 credits per subscription
      </p>

      <div className={styles.shareButtons}>
        <button
          className={`${styles.shareButton} ${styles.whatsappButton}`}
          onClick={handleWhatsAppShare}
          aria-label="Share via WhatsApp"
        >
          <span className={styles.shareIcon}>📱</span>
          <span className={styles.shareText}>WhatsApp</span>
        </button>

        <button
          className={`${styles.shareButton} ${styles.smsButton}`}
          onClick={handleSMSShare}
          aria-label="Share via SMS"
        >
          <span className={styles.shareIcon}>💬</span>
          <span className={styles.shareText}>SMS</span>
        </button>

        <button
          className={`${styles.shareButton} ${styles.copyButton}`}
          onClick={handleCopyLink}
          aria-label="Copy referral link"
        >
          <span className={styles.shareIcon}>🔗</span>
          <span className={styles.shareText}>
            {showCopySuccess ? 'Copied!' : 'Copy Link'}
          </span>
        </button>
      </div>

      <div className={styles.sharePreview}>
        <div className={styles.previewLabel}>Message preview:</div>
        <div className={styles.previewText}>
          "{shareMessage}"
        </div>
      </div>
    </div>
  );
}