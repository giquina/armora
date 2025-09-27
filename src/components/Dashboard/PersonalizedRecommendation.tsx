import { useState, useEffect } from 'react';
import { ServiceLevel, PersonalizationData, User } from '../../types';
import { generateRecommendation, RecommendationData } from '../../utils/recommendationEngine';
import styles from './PersonalizedRecommendation.module.css';

interface PersonalizedRecommendationProps {
  services: ServiceLevel[];
  questionnaireData: PersonalizationData | null;
  user: User | null;
  onServiceSelect: (serviceId: string) => void;
}

export function PersonalizedRecommendation({
  services,
  questionnaireData,
  user,
  onServiceSelect
}: PersonalizedRecommendationProps) {
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const rec = generateRecommendation(questionnaireData, user, services);
    setRecommendation(rec);

    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, [questionnaireData, user, services]);

  if (!recommendation) return null;

  const { service, profile, timeBasedMessage, availabilityInfo } = recommendation;

  const handleSelectService = () => {
    onServiceSelect(service.id);

    // Analytics
      serviceId: service.id,
      profileType: profile.type,
      matchScore: profile.matchScore,
      timestamp: Date.now()
    });
  };

  return (
    <div className={`${styles.recommendationSection} ${isAnimating ? styles.animated : ''}`}>
      <div className={styles.recommendationCard}>
        {/* Header with match score */}
        <div className={styles.header}>
          <div className={styles.matchScore}>
            <div className={styles.scoreCircle}>
              <span className={styles.percentage}>{profile.matchScore}%</span>
              <span className={styles.matchLabel}>match</span>
            </div>
          </div>
          <div className={styles.headerContent}>
            <span className={styles.badge}>Based on Your Assessment</span>
            <h3 className={styles.title}>{profile.title}</h3>
            <p className={styles.subtitle}>{profile.subtitle}</p>
          </div>
        </div>

        {/* Time-based message */}
        <div className={styles.timeMessage}>
          <span className={styles.timeIcon}>🕒</span>
          <span className={styles.timeText}>{timeBasedMessage}</span>
        </div>

        {/* Service spotlight */}
        <div className={styles.serviceSpotlight}>
          <div className={styles.serviceBadge}>
            <span className={styles.serviceName}>Recommended: {service.name}</span>
            {service.isPopular && <span className={styles.popularTag}>Most Popular</span>}
          </div>
          <p className={styles.serviceDescription}>
            {profile.description}
          </p>
        </div>

        {/* Personalized benefits */}
        <div className={styles.benefits}>
          <h4 className={styles.benefitsTitle}>Why This Matches Your Needs</h4>
          <div className={styles.benefitsList}>
            {profile.benefits.slice(0, 4).map((benefit, index) => (
              <div key={index} className={styles.benefitItem}>
                <span className={styles.benefitIcon}>✓</span>
                <span className={styles.benefitText}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications row */}
        <div className={styles.certifications}>
          <div className={styles.certHeader}>
            <span className={styles.certIcon}>🛡️</span>
            <span className={styles.certTitle}>Professional Certifications</span>
          </div>
          <div className={styles.certBadges}>
            {profile.certifications.map((cert, index) => (
              <span key={index} className={styles.certBadge}>
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className={styles.trustSection}>
          <div className={styles.trustIndicators}>
            {profile.trustIndicators.map((indicator, index) => (
              <div key={index} className={styles.trustItem}>
                <span className={styles.trustIcon}>⭐</span>
                <span className={styles.trustText}>{indicator}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Availability status */}
        <div className={styles.availabilitySection}>
          <div className={styles.availability}>
            <span className={styles.availIcon}>🚗</span>
            <span className={styles.availText}>
              {availabilityInfo.officersAvailable} certified officers available
            </span>
            <span className={styles.eta}>ETA: {availabilityInfo.estimatedArrival}</span>
          </div>
          {availabilityInfo.isHighDemand && (
            <div className={styles.urgencyAlert}>
              <span className={styles.urgencyIcon}>⚡</span>
              <span className={styles.urgencyText}>
                High demand period - request protection now to secure your professional Protection Officer
              </span>
            </div>
          )}
        </div>

        {/* Social proof */}
        <div className={styles.socialProof}>
          <div className={styles.proofBadge}>
            <span className={styles.proofIcon}>📊</span>
            <span className={styles.proofText}>{profile.socialProof}</span>
          </div>
        </div>

        {/* Personal message */}
        <div className={styles.personalMessage}>
          <p className={styles.messageText}>
            <strong>"{profile.personalizedMessage}"</strong>
          </p>
        </div>

        {/* Call to action */}
        <div className={styles.ctaSection}>
          <button
            className={styles.primaryCta}
            onClick={handleSelectService}
          >
            <span className={styles.ctaIcon}>🛡️</span>
            <span className={styles.ctaText}>Select {service.name}</span>
          </button>
          <p className={styles.ctaSubtext}>
            Continue to customize your secure journey
          </p>
        </div>

        {/* Comparison hint */}
        <div className={styles.comparisonHint}>
          <button className={styles.compareBtn}>
            Compare All Security Levels →
          </button>
        </div>
      </div>
    </div>
  );
}