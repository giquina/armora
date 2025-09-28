import React from 'react';
import styles from './RiskIndicator.module.css';
import { IRiskAssessment, RISK_LEVELS } from '../../utils/riskCalculator';

interface RiskIndicatorProps {
  assessment: IRiskAssessment;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  assessment,
  showDetails = false,
  size = 'medium',
  animated = true
}) => {
  const { matrix, confidence } = assessment;
  const riskConfig = RISK_LEVELS[matrix.level];

  const getRiskIcon = () => {
    switch (matrix.level) {
      case 'GREEN': return '🟢';
      case 'YELLOW': return '🟡';
      case 'ORANGE': return '🟠';
      case 'RED': return '🔴';
      default: return '⚪';
    }
  };

  const getProtectionBadge = () => {
    switch (matrix.protectionLevel) {
      case 'Essential': return { text: 'Essential Protection', color: '#28a745' };
      case 'Executive': return { text: 'Executive Shield', color: '#ffc107' };
      case 'Shadow': return { text: 'Shadow Protocol', color: '#fd7e14' };
      case 'Enhanced': return { text: 'Enhanced Security', color: '#dc3545' };
      default: return { text: 'Standard', color: '#6c757d' };
    }
  };

  const protectionBadge = getProtectionBadge();

  return (
    <div className={`${styles.riskIndicator} ${styles[size]} ${animated ? styles.animated : ''}`}>
      <div className={styles.riskHeader}>
        <div className={styles.riskLevel}>
          <span className={styles.riskIcon}>{getRiskIcon()}</span>
          <span
            className={styles.riskLabel}
            style={{ color: riskConfig.color }}
          >
            {riskConfig.label}
          </span>
        </div>
        <div className={styles.riskScore}>
          <span className={styles.scoreValue}>{matrix.score}</span>
          <span className={styles.scoreMax}>/25</span>
        </div>
      </div>

      {showDetails && (
        <div className={styles.riskDetails}>
          <div className={styles.matrixValues}>
            <div className={styles.matrixValue}>
              <span className={styles.valueLabel}>Probability:</span>
              <span className={styles.valueScore}>{matrix.probability}/5</span>
            </div>
            <div className={styles.matrixValue}>
              <span className={styles.valueLabel}>Impact:</span>
              <span className={styles.valueScore}>{matrix.impact}/5</span>
            </div>
          </div>

          <div className={styles.protectionRecommendation}>
            <span className={styles.recommendationLabel}>Recommended:</span>
            <span
              className={styles.protectionBadge}
              style={{ backgroundColor: protectionBadge.color }}
            >
              {protectionBadge.text}
            </span>
          </div>

          <div className={styles.confidenceLevel}>
            <span className={styles.confidenceLabel}>Assessment Confidence:</span>
            <div className={styles.confidenceBar}>
              <div
                className={styles.confidenceFill}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className={styles.confidenceValue}>{confidence}%</span>
          </div>

          {matrix.factors.length > 0 && (
            <div className={styles.riskFactors}>
              <span className={styles.factorsLabel}>Active Risk Factors:</span>
              <div className={styles.factorsList}>
                {matrix.factors.slice(0, 3).map((factor) => (
                  <span key={factor.id} className={styles.riskFactor}>
                    {factor.name}
                  </span>
                ))}
                {matrix.factors.length > 3 && (
                  <span className={styles.moreFactors}>
                    +{matrix.factors.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskIndicator;