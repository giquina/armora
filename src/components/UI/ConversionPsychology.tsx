import { FC, useState, useEffect } from 'react';
import styles from './ConversionPsychology.module.css';

interface ConversionPsychologyProps {
  userProfile?: string;
  stepNumber?: number;
  className?: string;
}

const ConversionPsychology: FC<ConversionPsychologyProps> = ({ 
  userProfile = 'executive',
  stepNumber = 1,
  className 
}) => {
  const [showScarcity, setShowScarcity] = useState(false);
  const [currentUrgency, setCurrentUrgency] = useState(0);

  // Strategic scarcity messages based on profile
  const scarcityMessages = {
    celebrity: [
      { text: "Only 3 discrete protection specialists available in your area", priority: "high" },
      { text: "2 other high-profile clients protection confirmed today", priority: "medium" },
      { text: "Premium vehicle availability: Limited", priority: "high" }
    ],
    executive: [
      { text: "5 Fortune 500 executives secured transport this hour", priority: "medium" },
      { text: "Only 7 executive protection officers available", priority: "high" },
      { text: "3 board-level clients scheduled for today", priority: "medium" }
    ],
    government: [
      { text: "2 government-cleared CPOs available now", priority: "high" },
      { text: "Official protocol specialists: Limited availability", priority: "high" },
      { text: "Security-cleared vehicles: 4 available", priority: "medium" }
    ]
  };

  // Investment psychology triggers
  const investmentTriggers = [
    { 
      step: 2, 
      message: "You've invested 30 seconds - unlock your personalized security profile",
      action: "Continue building profile"
    },
    { 
      step: 3, 
      message: "You've invested 1 minute - secure your professional transport solution",
      action: "Complete assessment"
    },
    { 
      step: 5, 
      message: "You've invested 2 minutes - finalize your VIP security matching",
      action: "Finish personalization"
    }
  ];

  // FOMO creation messages
  const fomoMessages = [
    "127 executives chose Armora this week",
    "Join the Fortune 500 companies that trust Armora",
    "Don't let security be an afterthought",
    "Professional transport that matches your status"
  ];

  // Social validation triggers
  const socialValidation = {
    celebrity: "Trusted by A-list celebrities and public figures",
    executive: "Preferred by C-suite executives at major corporations", 
    government: "Approved for government and diplomatic transport",
    default: "Chosen by professionals who value discretion and security"
  };

  // Cycle through urgency messages
  useEffect(() => {
    if (stepNumber >= 3) {
      setShowScarcity(true);
      const urgencyInterval = setInterval(() => {
        setCurrentUrgency(prev => (prev + 1) % fomoMessages.length);
      }, 4000);
      return () => clearInterval(urgencyInterval);
    }
  }, [stepNumber, fomoMessages.length]);

  const currentScarcity = scarcityMessages[userProfile as keyof typeof scarcityMessages] || scarcityMessages.executive;
  const currentInvestment = investmentTriggers.find(t => t.step === stepNumber);

  return (
    <div className={`${styles.conversionPsychology} ${className || ''}`}>
      {/* Investment Psychology */}
      {currentInvestment && (
        <div className={styles.investmentTrigger}>
          <div className={styles.progressIcon}>⏳</div>
          <div className={styles.investmentMessage}>
            <span className={styles.investmentText}>{currentInvestment.message}</span>
            <span className={styles.investmentAction}>{currentInvestment.action}</span>
          </div>
        </div>
      )}

      {/* Strategic Scarcity */}
      {showScarcity && (
        <div className={styles.scarcitySection}>
          <h4 className={styles.scarcityTitle}>Current Availability</h4>
          <div className={styles.scarcityList}>
            {currentScarcity.map((item, index) => (
              <div key={index} className={`${styles.scarcityItem} ${styles[item.priority]}`}>
                <div className={styles.scarcityIcon}>
                  {item.priority === 'high' ? '🔴' : '🟡'}
                </div>
                <span className={styles.scarcityText}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Validation */}
      <div className={styles.socialValidation}>
        <div className={styles.validationIcon}>✨</div>
        <span className={styles.validationText}>
          {socialValidation[userProfile as keyof typeof socialValidation] || socialValidation.default}
        </span>
      </div>

      {/* FOMO Messages */}
      {stepNumber >= 4 && (
        <div className={styles.fomoSection}>
          <div className={styles.fomoMessage}>
            <div className={styles.fomoIcon}>🚀</div>
            <span className={styles.fomoText}>{fomoMessages[currentUrgency]}</span>
          </div>
        </div>
      )}

      {/* Urgency Countdown (for final steps) */}
      {stepNumber >= 7 && (
        <div className={styles.urgencyCountdown}>
          <div className={styles.countdownIcon}>⏰</div>
          <div className={styles.countdownText}>
            <span className={styles.countdownMain}>Secure your profile now</span>
            <span className={styles.countdownSub}>Your recommended protection officers are standing by</span>
          </div>
        </div>
      )}

      {/* Trust Reinforcement */}
      <div className={styles.trustReinforcement}>
        <div className={styles.trustItems}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🏆</span>
            <span className={styles.trustText}>Industry Leading</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🔒</span>
            <span className={styles.trustText}>Fully Insured</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>⚡</span>
            <span className={styles.trustText}>Instant Assignment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionPsychology;