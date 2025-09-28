import React, { useState } from 'react';
import styles from './ThreatIndicators.module.css';

export interface IThreatIndicatorData {
  hasReceivedThreats: boolean;        // "Have you received any threats in the past 12 months?"
  hasPublicProfile: boolean;          // "Do you have a public profile (media, social, professional)?"
  hasLegalProceedings: boolean;       // "Are you involved in any legal proceedings?"
  hasPreviousIncidents: boolean;      // "Have you experienced security incidents before?"
  requiresInternationalProtection: boolean; // "Do you travel internationally for work?"
  hasControversialWork: boolean;      // "Does your work involve controversial decisions?"
  hasHighValueAssets: boolean;        // "Do you manage high-value assets or information?"
}

export interface IRiskAssessment {
  level: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  score: number;
  description: string;
  recommendedProtection: string;
  assessmentPath: 'standard' | 'enhanced' | 'significant' | 'critical';
}

interface ThreatIndicatorQuestion {
  id: keyof IThreatIndicatorData;
  question: string;
  description: string;
  riskWeight: number;
  icon: string;
}

interface ThreatIndicatorsProps {
  onComplete: (data: IThreatIndicatorData, assessment: IRiskAssessment) => void;
  initialData?: Partial<IThreatIndicatorData>;
  className?: string;
}

const THREAT_QUESTIONS: ThreatIndicatorQuestion[] = [
  {
    id: 'hasReceivedThreats',
    question: 'Have you received any threats in the past 12 months?',
    description: 'This includes verbal, written, digital threats, or any concerning communications directed at you personally or professionally.',
    riskWeight: 5,
    icon: '⚠️'
  },
  {
    id: 'hasLegalProceedings',
    question: 'Are you involved in any legal proceedings?',
    description: 'Current litigation, court cases, disputes, or legal matters that could affect your security profile.',
    riskWeight: 4,
    icon: '⚖️'
  },
  {
    id: 'hasPreviousIncidents',
    question: 'Have you experienced security incidents before?',
    description: 'Any previous security breaches, stalking, harassment, or situations requiring security intervention.',
    riskWeight: 4,
    icon: '🚨'
  },
  {
    id: 'hasPublicProfile',
    question: 'Do you have a public profile (media, social, professional)?',
    description: 'Public visibility through media appearances, social media presence, professional recognition, or industry prominence.',
    riskWeight: 3,
    icon: '📺'
  },
  {
    id: 'requiresInternationalProtection',
    question: 'Do you travel internationally for work?',
    description: 'Regular international business travel, particularly to regions with varying security considerations.',
    riskWeight: 3,
    icon: '✈️'
  },
  {
    id: 'hasControversialWork',
    question: 'Does your work involve controversial decisions?',
    description: 'Professional responsibilities involving public policy, judicial decisions, corporate restructuring, or contentious business matters.',
    riskWeight: 3,
    icon: '🎯'
  },
  {
    id: 'hasHighValueAssets',
    question: 'Do you manage high-value assets or information?',
    description: 'Responsibility for significant financial assets, confidential information, or high-value intellectual property.',
    riskWeight: 2,
    icon: '💎'
  }
];

export function ThreatIndicators({ onComplete, initialData = {}, className = '' }: ThreatIndicatorsProps) {
  const [threatData, setThreatData] = useState<IThreatIndicatorData>({
    hasReceivedThreats: false,
    hasPublicProfile: false,
    hasLegalProceedings: false,
    hasPreviousIncidents: false,
    requiresInternationalProtection: false,
    hasControversialWork: false,
    hasHighValueAssets: false,
    ...initialData
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);

  // Calculate risk assessment
  const calculateRiskAssessment = (data: IThreatIndicatorData): IRiskAssessment => {
    let score = 0;

    THREAT_QUESTIONS.forEach(question => {
      if (data[question.id]) {
        score += question.riskWeight;
      }
    });

    let level: IRiskAssessment['level'];
    let description: string;
    let recommendedProtection: string;
    let assessmentPath: IRiskAssessment['assessmentPath'];

    if (score === 0) {
      level = 'GREEN';
      description = 'Low Risk Profile - Standard security protocols appropriate';
      recommendedProtection = 'Essential Protection Service';
      assessmentPath = 'standard';
    } else if (score <= 4) {
      level = 'GREEN';
      description = 'Low-Moderate Risk Profile - Standard assessment with basic security measures';
      recommendedProtection = 'Essential Protection Service with enhanced awareness';
      assessmentPath = 'standard';
    } else if (score <= 9) {
      level = 'YELLOW';
      description = 'Moderate Risk Profile - Enhanced assessment and security protocols recommended';
      recommendedProtection = 'Executive Shield Protection Service';
      assessmentPath = 'enhanced';
    } else if (score <= 16) {
      level = 'ORANGE';
      description = 'Significant Risk Profile - Comprehensive security assessment and elevated protection protocols';
      recommendedProtection = 'Shadow Protocol Protection Service';
      assessmentPath = 'significant';
    } else {
      level = 'RED';
      description = 'Critical Risk Profile - Immediate comprehensive assessment and maximum security protocols';
      recommendedProtection = 'Shadow Protocol with specialized security team';
      assessmentPath = 'critical';
    }

    return {
      level,
      score,
      description,
      recommendedProtection,
      assessmentPath
    };
  };

  const currentQuestion = THREAT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === THREAT_QUESTIONS.length - 1;
  const currentAssessment = calculateRiskAssessment(threatData);

  const handleAnswer = (questionId: keyof IThreatIndicatorData, answer: boolean) => {
    setIsAnimating(true);

    const newData = {
      ...threatData,
      [questionId]: answer
    };

    setThreatData(newData);

    setTimeout(() => {
      if (isLastQuestion) {
        setShowRiskAssessment(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleComplete = () => {
    const finalAssessment = calculateRiskAssessment(threatData);
    onComplete(threatData, finalAssessment);
  };

  const handlePrevious = () => {
    if (showRiskAssessment) {
      setShowRiskAssessment(false);
      return;
    }

    if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case 'GREEN': return styles.riskGreen;
      case 'YELLOW': return styles.riskYellow;
      case 'ORANGE': return styles.riskOrange;
      case 'RED': return styles.riskRed;
      default: return styles.riskGreen;
    }
  };

  if (showRiskAssessment) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.assessmentContainer}>
          <div className={styles.assessmentHeader}>
            <h2 className={styles.assessmentTitle}>Security Risk Assessment Complete</h2>
            <div className={`${styles.riskBadge} ${getRiskBadgeClass(currentAssessment.level)}`}>
              <span className={styles.riskLevel}>{currentAssessment.level} RISK</span>
              <span className={styles.riskScore}>Score: {currentAssessment.score}/24</span>
            </div>
          </div>

          <div className={styles.assessmentDetails}>
            <div className={styles.assessmentDescription}>
              <h3>Assessment Summary</h3>
              <p>{currentAssessment.description}</p>
            </div>

            <div className={styles.recommendedService}>
              <h3>Recommended Protection Level</h3>
              <div className={styles.serviceRecommendation}>
                <span className={styles.serviceIcon}>🛡️</span>
                <span className={styles.serviceName}>{currentAssessment.recommendedProtection}</span>
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h3>Next Steps</h3>
              <ul className={styles.stepsList}>
                <li>Personalized protection officer assignment based on risk profile</li>
                <li>Enhanced security protocols tailored to your assessment level</li>
                <li>Specialized route planning and venue security coordination</li>
                <li>Priority response protocols for {currentAssessment.level.toLowerCase()} risk clients</li>
              </ul>
            </div>
          </div>

          <div className={styles.assessmentActions}>
            <button
              type="button"
              onClick={handlePrevious}
              className={styles.secondaryButton}
            >
              Review Responses
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className={styles.primaryButton}
            >
              Continue Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.questionContainer}>
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.stepIndicator}>
              Question {currentQuestionIndex + 1} of {THREAT_QUESTIONS.length}
            </span>
            <div className={`${styles.currentRiskBadge} ${getRiskBadgeClass(currentAssessment.level)}`}>
              <span className={styles.riskLevel}>{currentAssessment.level}</span>
              <span className={styles.riskScore}>{currentAssessment.score}</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentQuestionIndex + 1) / THREAT_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className={`${styles.questionCard} ${isAnimating ? styles.animating : ''}`}>
          <div className={styles.questionHeader}>
            <span className={styles.questionIcon}>{currentQuestion.icon}</span>
            <h2 className={styles.questionTitle}>Security Assessment</h2>
          </div>

          <div className={styles.questionContent}>
            <h3 className={styles.questionText}>{currentQuestion.question}</h3>
            <p className={styles.questionDescription}>{currentQuestion.description}</p>
          </div>

          <div className={styles.answerSection}>
            <div className={styles.answerButtons}>
              <button
                type="button"
                onClick={() => handleAnswer(currentQuestion.id, true)}
                className={`${styles.answerButton} ${styles.yesButton} ${
                  threatData[currentQuestion.id] === true ? styles.selected : ''
                }`}
              >
                <span className={styles.answerIcon}>✓</span>
                <span className={styles.answerText}>Yes</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnswer(currentQuestion.id, false)}
                className={`${styles.answerButton} ${styles.noButton} ${
                  threatData[currentQuestion.id] === false ? styles.selected : ''
                }`}
              >
                <span className={styles.answerIcon}>✗</span>
                <span className={styles.answerText}>No</span>
              </button>
            </div>
          </div>

          <div className={styles.navigationSection}>
            {currentQuestionIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className={styles.navButton}
              >
                ← Previous
              </button>
            )}

            <div className={styles.confidentialityNote}>
              <span className={styles.lockIcon}>🔒</span>
              <span>Confidential Assessment - Complete Privacy Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreatIndicators;