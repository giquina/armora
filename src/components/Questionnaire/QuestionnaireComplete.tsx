import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { serviceData } from '../../data/questionnaireData';
import styles from './QuestionnaireComplete.module.css';

interface QuestionnaireCompleteProps {
  onRestart?: () => void;
  onContinue: () => void;
}

export function QuestionnaireComplete({ onRestart, onContinue }: QuestionnaireCompleteProps) {
  const { state } = useApp();
  const { user, questionnaireData } = state;
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentAchievement, setCurrentAchievement] = useState(0);

  const isGuest = user?.userType === 'guest';
  const recommendedService = questionnaireData?.recommendedService || 'shadow';
  const service = serviceData[recommendedService as keyof typeof serviceData];

  // Achievement unlock animation
  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Achievement items for registered users
  const achievements = [
    {
      icon: '🛡️',
      title: 'Security Profile Created',
      description: 'Personalized protection recommendations ready'
    },
    {
      icon: '💰',
      title: '50% Discount Unlocked',
      description: 'Save £22.50-£37.50 on your first protection assignment'
    },
    {
      icon: '⚡',
      title: 'Priority Access Granted',
      description: 'Skip the queue with instant protection assignment'
    },
    {
      icon: '📞',
      title: '24/7 Support Activated',
      description: 'Direct line to security operations center'
    }
  ];

  // Guest limitations
  const guestLimitations = [
    {
      icon: '❌',
      title: 'Limited Assignment Access',
      description: 'Quote-only, no direct protection assignment available'
    },
    {
      icon: '❌',
      title: 'No Discount Available',
      description: 'Miss out on 50% first protection assignment discount'
    },
    {
      icon: '❌',
      title: 'Standard Support Only',
      description: 'Standard customer service hours'
    }
  ];

  // Animate achievements one by one
  useEffect(() => {
    if (!isGuest && !showAnimation) {
      const timer = setInterval(() => {
        setCurrentAchievement(prev => {
          if (prev < achievements.length - 1) {
            return prev + 1;
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [showAnimation, isGuest, achievements.length]);

  // Loading animation
  if (showAnimation) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingAnimation}>
          <div className={styles.securityBadge}>
            <div className={styles.badgeIcon}>🛡️</div>
            <div className={styles.scanningLine}></div>
          </div>
          <h2 className={styles.loadingTitle}>Analyzing Security Profile</h2>
          <p className={styles.loadingSubtitle}>Processing your responses...</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Success Header */}
        <header className={styles.header}>
          <div className={styles.successIcon}>
            {isGuest ? '📋' : '🎉'}
          </div>
          <h1 className={styles.title}>
            {isGuest ? 'Assessment Complete!' : 'Profile Created Successfully!'}
          </h1>
          <p className={styles.subtitle}>
            {isGuest 
              ? 'Your security preferences have been saved'
              : 'Welcome to Armora\'s premium security network'
            }
          </p>
        </header>

        {/* Recommended Service */}
        <div className={styles.recommendationSection}>
          <h2 className={styles.recommendationTitle}>Your Recommended Service</h2>
          <div className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <div className={styles.servicePrice}>
                {isGuest ? service.price : (
                  <>
                    <span className={styles.originalPrice}>{service.price}</span>
                    <span className={styles.discountedPrice}>
                      £{Math.round(parseFloat(service.price.replace('£', '').replace('/hour', '')) * 0.5)}/hour
                    </span>
                    <span className={styles.discountLabel}>50% OFF</span>
                  </>
                )}
              </div>
            </div>
            <p className={styles.serviceDescription}>{service.description}</p>
            <ul className={styles.serviceFeatures}>
              {service.features.map((feature, index) => (
                <li key={index} className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Achievements or Limitations */}
        <div className={styles.statusSection}>
          <h2 className={styles.statusTitle}>
            {isGuest ? 'Guest Account Limitations' : 'Rewards Unlocked'}
          </h2>
          
          <div className={styles.statusGrid}>
            {(isGuest ? guestLimitations : achievements).map((item, index) => (
              <div 
                key={index} 
                className={`${styles.statusItem} ${
                  !isGuest && index <= currentAchievement ? styles.statusItemActive : ''
                } ${isGuest ? styles.statusItemLimited : styles.statusItemUnlocked}`}
              >
                <div className={styles.statusIcon}>{item.icon}</div>
                <div className={styles.statusContent}>
                  <h3 className={styles.statusItemTitle}>{item.title}</h3>
                  <p className={styles.statusItemDescription}>{item.description}</p>
                </div>
                {!isGuest && index <= currentAchievement && (
                  <div className={styles.checkmark}>✨</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Guest Upgrade Prompt */}
        {isGuest && (
          <div className={styles.upgradePrompt}>
            <div className={styles.upgradeContent}>
              <h3 className={styles.upgradeTitle}>Unlock Full Access</h3>
              <p className={styles.upgradeDescription}>
                Create an account now and get 50% off your first protection assignment plus priority access to all Armora services.
              </p>
              <div className={styles.upgradeBenefits}>
                <div className={styles.upgradeBenefit}>
                  <span className={styles.upgradeIcon}>🎯</span>
                  <span>Direct protection assignment access</span>
                </div>
                <div className={styles.upgradeBenefit}>
                  <span className={styles.upgradeIcon}>💰</span>
                  <span>50% first protection assignment discount</span>
                </div>
                <div className={styles.upgradeBenefit}>
                  <span className={styles.upgradeIcon}>⭐</span>
                  <span>Priority customer support</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Summary (for registered users) */}
        {!isGuest && questionnaireData && (
          <div className={styles.profileSummary}>
            <h2 className={styles.summaryTitle}>Your Security Profile Summary</h2>
            <div className={styles.summaryGrid}>
              {questionnaireData.step1_transportProfile && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Profile:</span>
                  <span className={styles.summaryValue}>
                    {questionnaireData.step1_transportProfile.replace('_', ' ').charAt(0).toUpperCase() + 
                     questionnaireData.step1_transportProfile.replace('_', ' ').slice(1)}
                  </span>
                </div>
              )}
              {questionnaireData.step2_travelFrequency && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Frequency:</span>
                  <span className={styles.summaryValue}>
                    {questionnaireData.step2_travelFrequency.replace('_', ' ').charAt(0).toUpperCase() + 
                     questionnaireData.step2_travelFrequency.replace('_', ' ').slice(1)}
                  </span>
                </div>
              )}
              {questionnaireData.step3_serviceRequirements?.length && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Requirements:</span>
                  <span className={styles.summaryValue}>
                    {questionnaireData.step3_serviceRequirements.length} service{questionnaireData.step3_serviceRequirements.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        {onRestart && (
          <button
            onClick={onRestart}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            Retake Assessment
          </button>
        )}
        
        <button
          onClick={onContinue}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          {isGuest ? 'View Services' : 'Request Protection'}
        </button>
      </div>

      {/* Security Badge */}
      <div className={styles.securityFooter}>
        <div className={styles.securityBadgeSmall}>
          <span className={styles.badgeIconSmall}>🛡️</span>
          <span className={styles.badgeText}>Armora Verified Profile</span>
        </div>
      </div>
    </div>
  );
}