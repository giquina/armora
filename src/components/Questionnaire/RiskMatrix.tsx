import React, { useState, useEffect, useMemo } from 'react';
import styles from './RiskMatrix.module.css';
import {
  IRiskAssessment,
  RISK_FACTORS,
  RISK_LEVELS,
  getRiskMatrixCells,
  getRiskPosition,
  assessRisk,
  calculateRiskFromResponses
} from '../../utils/riskCalculator';
import RiskIndicator from './RiskIndicator';

interface RiskMatrixProps {
  questionnaireResponses?: Record<string, any>;
  onRiskAssessmentChange?: (assessment: IRiskAssessment) => void;
  showControls?: boolean;
  showFactors?: boolean;
  interactive?: boolean;
  size?: 'compact' | 'standard' | 'expanded';
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({
  questionnaireResponses = {},
  onRiskAssessmentChange,
  showControls = true,
  showFactors = true,
  interactive = true,
  size = 'standard'
}) => {
  const [riskAssessment, setRiskAssessment] = useState<IRiskAssessment | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [activeFactors, setActiveFactors] = useState(RISK_FACTORS.map(f => ({ ...f })));
  const [matrixExpanded, setMatrixExpanded] = useState(size === 'expanded');
  const [currentTab, setCurrentTab] = useState<'matrix' | 'factors' | 'recommendations'>('matrix');

  // Generate matrix cells for visualization
  const matrixCells = useMemo(() => getRiskMatrixCells(), []);

  // Probability and Impact labels
  const probabilityLabels = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
  const impactLabels = ['Negligible', 'Minor', 'Moderate', 'Major', 'Severe'];

  // Calculate risk assessment from questionnaire responses or active factors
  useEffect(() => {
    let assessment: IRiskAssessment;

    if (Object.keys(questionnaireResponses).length > 0) {
      // Calculate from questionnaire responses
      assessment = calculateRiskFromResponses(questionnaireResponses);
    } else {
      // Calculate from manually selected factors
      assessment = assessRisk(activeFactors);
    }

    setRiskAssessment(assessment);

    // Update position indicator
    const position = getRiskPosition(assessment);
    setSelectedCell(position);

    // Notify parent component
    if (onRiskAssessmentChange) {
      onRiskAssessmentChange(assessment);
    }
  }, [questionnaireResponses, activeFactors, onRiskAssessmentChange]);

  // Handle factor toggle
  const handleFactorToggle = (factorId: string) => {
    if (!interactive) return;

    setActiveFactors(prev =>
      prev.map(factor =>
        factor.id === factorId
          ? { ...factor, isActive: !factor.isActive }
          : factor
      )
    );
  };

  // Handle matrix cell click (for manual risk assessment)
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!interactive) return;

    const probability = (5 - rowIndex) as 1 | 2 | 3 | 4 | 5;
    const impact = (colIndex + 1) as 1 | 2 | 3 | 4 | 5;

    const manualAssessment = assessRisk(activeFactors, probability, impact);
    setRiskAssessment(manualAssessment);
    setSelectedCell({ x: colIndex, y: rowIndex });

    if (onRiskAssessmentChange) {
      onRiskAssessmentChange(manualAssessment);
    }
  };

  // Get cell style based on risk level
  const getCellStyle = (cell: any, rowIndex: number, colIndex: number) => {
    const riskConfig = RISK_LEVELS[cell.level as keyof typeof RISK_LEVELS];
    const isSelected = selectedCell?.x === colIndex && selectedCell?.y === rowIndex;

    return {
      backgroundColor: riskConfig.color,
      opacity: isSelected ? 1 : 0.7,
      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
      border: isSelected ? '3px solid #1a1a2e' : '1px solid rgba(255,255,255,0.3)',
      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
    };
  };

  // Get risk factor categories for organization
  const factorCategories = useMemo(() => {
    const categories: Record<string, typeof RISK_FACTORS> = {};
    RISK_FACTORS.forEach(factor => {
      if (!categories[factor.category]) {
        categories[factor.category] = [];
      }
      categories[factor.category].push(factor);
    });
    return categories;
  }, []);

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!riskAssessment) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <span>Calculating risk assessment...</span>
      </div>
    );
  }

  return (
    <div className={`${styles.riskMatrix} ${styles[size]}`}>
      {/* Header with current risk indicator */}
      <div className={styles.matrixHeader}>
        <h3 className={styles.matrixTitle}>Professional Security Risk Assessment</h3>
        <RiskIndicator
          assessment={riskAssessment}
          size="medium"
          showDetails={!matrixExpanded}
        />
      </div>

      {/* Mobile-friendly tab navigation */}
      {size !== 'compact' && (
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${currentTab === 'matrix' ? styles.active : ''}`}
            onClick={() => setCurrentTab('matrix')}
          >
            📊 Risk Matrix
          </button>
          {showFactors && (
            <button
              className={`${styles.tabButton} ${currentTab === 'factors' ? styles.active : ''}`}
              onClick={() => setCurrentTab('factors')}
            >
              ⚠️ Risk Factors
            </button>
          )}
          <button
            className={`${styles.tabButton} ${currentTab === 'recommendations' ? styles.active : ''}`}
            onClick={() => setCurrentTab('recommendations')}
          >
            🛡️ Recommendations
          </button>
        </div>
      )}

      {/* Matrix Visualization */}
      {(currentTab === 'matrix' || size === 'compact') && (
        <div className={styles.matrixSection}>
          {showControls && (
            <div className={styles.matrixControls}>
              <button
                className={styles.expandButton}
                onClick={() => setMatrixExpanded(!matrixExpanded)}
              >
                {matrixExpanded ? '📱 Compact View' : '📈 Expand Matrix'}
              </button>
            </div>
          )}

          <div className={`${styles.matrixContainer} ${matrixExpanded ? styles.expanded : ''}`}>
            {/* Impact labels (top) */}
            <div className={styles.impactLabels}>
              <div className={styles.cornerLabel}>Impact →</div>
              {impactLabels.map((label, index) => (
                <div key={index} className={styles.impactLabel}>
                  {matrixExpanded ? label : label.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Matrix with probability labels */}
            <div className={styles.matrixGrid}>
              {/* Probability labels (left) */}
              <div className={styles.probabilityLabels}>
                <div className={styles.probabilityHeader}>
                  Probability ↓
                </div>
                {probabilityLabels.slice().reverse().map((label, index) => (
                  <div key={index} className={styles.probabilityLabel}>
                    {matrixExpanded ? label : label.slice(0, 3)}
                  </div>
                ))}
              </div>

              {/* Risk matrix cells */}
              <div className={styles.matrixCells}>
                {matrixCells.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.matrixRow}>
                    {row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`${styles.matrixCell} ${interactive ? styles.interactive : ''}`}
                        style={getCellStyle(cell, rowIndex, colIndex)}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        title={`Risk Score: ${cell.score} (${RISK_LEVELS[cell.level as keyof typeof RISK_LEVELS].label})`}
                      >
                        <span className={styles.cellScore}>{cell.score}</span>
                        {selectedCell?.x === colIndex && selectedCell?.y === rowIndex && (
                          <div className={styles.selectionIndicator}>●</div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Risk level legend */}
            <div className={styles.riskLegend}>
              {Object.entries(RISK_LEVELS).map(([level, config]) => (
                <div key={level} className={styles.legendItem}>
                  <div
                    className={styles.legendColor}
                    style={{ backgroundColor: config.color }}
                  />
                  <span className={styles.legendLabel}>
                    {config.label} ({config.min}-{config.max})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors Section */}
      {showFactors && (currentTab === 'factors' || size === 'expanded') && (
        <div className={styles.factorsSection}>
          <h4 className={styles.sectionTitle}>Risk Factors Assessment</h4>
          <p className={styles.sectionDescription}>
            Select applicable risk factors to enhance the accuracy of your security assessment.
          </p>

          <div className={styles.factorCategories}>
            {Object.entries(factorCategories).map(([category, factors]) => (
              <div key={category} className={styles.factorCategory}>
                <h5 className={styles.categoryTitle}>
                  {formatCategoryName(category)}
                </h5>
                <div className={styles.factorGrid}>
                  {factors.map((factor) => {
                    const activeFactor = activeFactors.find(f => f.id === factor.id);
                    return (
                      <div
                        key={factor.id}
                        className={`${styles.factorCard} ${activeFactor?.isActive ? styles.active : ''} ${interactive ? styles.interactive : ''}`}
                        onClick={() => handleFactorToggle(factor.id)}
                      >
                        <div className={styles.factorHeader}>
                          <span className={styles.factorName}>{factor.name}</span>
                          <span className={styles.factorWeight}>
                            Weight: {factor.weight}/5
                          </span>
                        </div>
                        <p className={styles.factorDescription}>
                          {factor.description}
                        </p>
                        {activeFactor?.isActive && (
                          <div className={styles.activeIndicator}>✓ Active</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {(currentTab === 'recommendations' || size === 'expanded') && (
        <div className={styles.recommendationsSection}>
          <h4 className={styles.sectionTitle}>Security Recommendations</h4>

          <div className={styles.recommendationCard}>
            <div className={styles.serviceRecommendation}>
              <h5>Recommended Protection Level</h5>
              <div className={styles.protectionLevel}>
                <span className={styles.protectionBadge}>
                  {riskAssessment.matrix.protectionLevel}
                </span>
                <span className={styles.confidenceLevel}>
                  {riskAssessment.confidence}% confidence
                </span>
              </div>
            </div>

            <div className={styles.recommendations}>
              <h6>Specific Recommendations:</h6>
              <ul className={styles.recommendationsList}>
                {riskAssessment.matrix.recommendations.map((recommendation, index) => (
                  <li key={index} className={styles.recommendationItem}>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>

            {riskAssessment.matrix.factors.length > 0 && (
              <div className={styles.activeFactorsSummary}>
                <h6>Based on Active Risk Factors:</h6>
                <div className={styles.factorTags}>
                  {riskAssessment.matrix.factors.map((factor) => (
                    <span key={factor.id} className={styles.factorTag}>
                      {factor.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assessment metadata */}
      <div className={styles.assessmentMetadata}>
        <div className={styles.lastUpdated}>
          Last updated: {riskAssessment.lastUpdated.toLocaleString()}
        </div>
        <div className={styles.assessmentSource}>
          Source: {riskAssessment.assessmentSource}
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;