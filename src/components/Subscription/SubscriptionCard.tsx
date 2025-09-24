import React from 'react';
import styles from './SubscriptionCard.module.css';

interface SubscriptionCardProps {
  tier: {
    name: string;
    price: number;
    period: string;
    features: string[];
    discount: number;
    color: string;
    recommended?: boolean;
  };
  isActive?: boolean;
  onSelect: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ tier, isActive, onSelect }) => {
  const savings = tier.discount > 0 ? tier.price * (tier.discount / 100) * 12 : 0;

  return (
    <div
      className={`${styles.subscriptionCard} ${isActive ? styles.active : ''} ${tier.recommended ? styles.recommended : ''}`}
      onClick={onSelect}
      style={{ '--tier-color': tier.color } as React.CSSProperties}
    >
      {tier.recommended && (
        <div className={styles.recommendedBadge}>
          <span>⭐ MOST POPULAR</span>
        </div>
      )}

      <div className={styles.header}>
        <h3 className={styles.tierName}>{tier.name}</h3>
        <div className={styles.pricing}>
          <span className={styles.price}>£{tier.price}</span>
          <span className={styles.period}>/{tier.period}</span>
        </div>
        {tier.discount > 0 && (
          <div className={styles.discount}>
            <span className={styles.discountBadge}>{tier.discount}% OFF</span>
            <span className={styles.savings}>Save £{savings.toFixed(0)}/year</span>
          </div>
        )}
      </div>

      <div className={styles.features}>
        <h4 className={styles.featuresTitle}>Included Benefits:</h4>
        <ul className={styles.featuresList}>
          {tier.features.map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              <span className={styles.checkmark}>✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.action}>
        <button
          className={`${styles.selectButton} ${isActive ? styles.activeButton : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isActive ? (
            <>
              <span className={styles.activeIcon}>✓</span>
              Current Plan
            </>
          ) : (
            'Select Plan'
          )}
        </button>
      </div>

      {isActive && (
        <div className={styles.activeOverlay}>
          <span className={styles.activeBadge}>ACTIVE</span>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;