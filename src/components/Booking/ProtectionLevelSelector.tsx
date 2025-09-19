import React, { useState, useEffect } from 'react';
import styles from './ProtectionLevelSelector.module.css';

export interface ProtectionLevel {
  type: 'transport' | 'personal';
  name: string;
  description: string;
  features: string[];
  priceFrom: number;
  additionalInfo?: string;
}

interface ProtectionLevelSelectorProps {
  destination: string;
  onProtectionLevelSelect: (level: ProtectionLevel) => void;
  onBack?: () => void;
}

const PROTECTION_LEVELS: ProtectionLevel[] = [
  {
    type: 'transport',
    name: 'Transport Protection',
    description: 'Your Protection Officer will:',
    features: [
      'Drive you safely to your destination',
      'Remain with the vehicle',
      'Be ready for your return journey'
    ],
    priceFrom: 50,
    additionalInfo: 'Perfect for: Quick visits, private meetings'
  },
  {
    type: 'personal',
    name: 'Personal Protection',
    description: 'Your Protection Officer will:',
    features: [
      'Drive you safely to your destination',
      'Accompany you inside the venue',
      'Provide continuous close protection',
      'Assist with bags/requirements',
      'Return with you to vehicle'
    ],
    priceFrom: 65,
    additionalInfo: 'Perfect for: Shopping, events, airports, evening venues'
  }
];

export function ProtectionLevelSelector({
  destination,
  onProtectionLevelSelect,
  onBack
}: ProtectionLevelSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<ProtectionLevel | null>(null);
  const [smartRecommendation, setSmartRecommendation] = useState<string | null>(null);

  useEffect(() => {
    // Generate smart suggestions based on destination
    const suggestion = generateSmartSuggestion(destination);
    setSmartRecommendation(suggestion);
  }, [destination]);

  const generateSmartSuggestion = (dest: string): string | null => {
    const destination = dest.toLowerCase();

    if (destination.includes('harrods') || destination.includes('selfridges') || destination.includes('shopping') || destination.includes('mall')) {
      return '💡 Recommended: Personal Protection for shopping assistance';
    }

    if (destination.includes('airport') || destination.includes('heathrow') || destination.includes('gatwick')) {
      return '💡 Recommended: Personal Protection for check-in assistance';
    }

    if (destination.includes('restaurant') || destination.includes('bar') || destination.includes('club') || destination.includes('pub')) {
      return '💡 Popular choice: Personal Protection for evening safety';
    }

    if (destination.includes('office') || destination.includes('business') || destination.includes('meeting')) {
      return '💡 Most choose: Transport Protection for privacy';
    }

    return null;
  };

  const handleLevelSelect = (level: ProtectionLevel) => {
    setSelectedLevel(level);
    onProtectionLevelSelect(level);
  };

  const formatDestination = (dest: string) => {
    return dest.length > 40 ? `${dest.substring(0, 40)}...` : dest;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            How would you like to be protected at {formatDestination(destination)}?
          </h2>
          <p className={styles.subtitle}>Choose your level of protection</p>
        </div>
      </div>

      {/* Smart Recommendation */}
      {smartRecommendation && (
        <div className={styles.recommendationBanner}>
          {smartRecommendation}
        </div>
      )}

      {/* Protection Level Cards */}
      <div className={styles.levelGrid}>
        {PROTECTION_LEVELS.map((level) => (
          <div
            key={level.type}
            className={`${styles.levelCard} ${selectedLevel?.type === level.type ? styles.selected : ''}`}
            onClick={() => handleLevelSelect(level)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                {level.type === 'transport' ? '🚗' : '👤'}
              </div>
              <h3 className={styles.cardTitle}>{level.name}</h3>
            </div>

            <div className={styles.cardContent}>
              <p className={styles.cardDescription}>{level.description}</p>

              <ul className={styles.featureList}>
                {level.features.map((feature, index) => (
                  <li key={index} className={styles.feature}>
                    • {feature}
                  </li>
                ))}
              </ul>

              <p className={styles.perfectFor}>{level.additionalInfo}</p>

              <div className={styles.pricing}>
                <span className={styles.priceFrom}>From £{level.priceFrom}/hour</span>
                {level.type === 'personal' && (
                  <span className={styles.additionalCosts}>+ any parking costs</span>
                )}
              </div>
            </div>

            <button className={styles.selectButton}>
              Select This
            </button>
          </div>
        ))}
      </div>

      {/* Legal Footer */}
      <div className={styles.legalFooter}>
        <p className={styles.legalText}>
          Armora provides SIA-licensed close protection services including secure transport.
          This is not a taxi or private hire vehicle service. Protection officers may accompany
          clients at venues as part of comprehensive security services.
        </p>
      </div>
    </div>
  );
}