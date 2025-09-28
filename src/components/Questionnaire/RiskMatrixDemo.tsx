import React, { useState } from 'react';
import RiskMatrix from './RiskMatrix';
import RiskIndicator from './RiskIndicator';
import { IRiskAssessment } from '../../utils/riskCalculator';
import styles from './RiskMatrixDemo.module.css';

const RiskMatrixDemo: React.FC = () => {
  const [currentAssessment, setCurrentAssessment] = useState<IRiskAssessment | null>(null);
  const [demoResponses, setDemoResponses] = useState<Record<string, any>>({});

  // Sample questionnaire responses for testing
  const sampleResponses = {
    basic: {
      step1: 'executive',
      step2: 'daily',
      step3: ['privacy_discretion', 'premium_comfort'],
      step4: ['central_london', 'airport_transfers']
    },
    highRisk: {
      step1: 'celebrity',
      step2: 'daily',
      step3: ['privacy_discretion', 'security_awareness', 'trained_professionals'],
      step4: ['international_specialized', 'central_london']
    },
    lowRisk: {
      step1: 'student',
      step2: 'monthly',
      step3: ['reliability_tracking'],
      step4: ['central_london']
    },
    government: {
      step1: 'government',
      step2: 'weekly',
      step3: ['privacy_discretion', 'security_awareness', 'professional_service'],
      step4: ['government_quarter', 'airport_transfers']
    }
  };

  const handleRiskAssessmentChange = (assessment: IRiskAssessment) => {
    setCurrentAssessment(assessment);
  };

  const loadSampleResponses = (responseType: keyof typeof sampleResponses) => {
    setDemoResponses(sampleResponses[responseType]);
  };

  const clearResponses = () => {
    setDemoResponses({});
    setCurrentAssessment(null);
  };

  return (
    <div className={styles.demoContainer}>
      <header className={styles.demoHeader}>
        <h1>Risk Matrix Visualization System</h1>
        <p>Professional Close Protection Risk Assessment</p>
      </header>

      <div className={styles.demoControls}>
        <h3>Sample Risk Scenarios</h3>
        <div className={styles.controlButtons}>
          <button
            className={styles.sampleButton}
            onClick={() => loadSampleResponses('basic')}
          >
            💼 Executive Profile
          </button>
          <button
            className={styles.sampleButton}
            onClick={() => loadSampleResponses('highRisk')}
          >
            🎭 Celebrity Profile
          </button>
          <button
            className={styles.sampleButton}
            onClick={() => loadSampleResponses('lowRisk')}
          >
            🎓 Student Profile
          </button>
          <button
            className={styles.sampleButton}
            onClick={() => loadSampleResponses('government')}
          >
            🏛️ Government Official
          </button>
          <button
            className={styles.clearButton}
            onClick={clearResponses}
          >
            🔄 Clear & Manual
          </button>
        </div>
      </div>

      {currentAssessment && (
        <div className={styles.quickIndicator}>
          <h3>Current Risk Assessment</h3>
          <RiskIndicator
            assessment={currentAssessment}
            showDetails={true}
            size="large"
            animated={true}
          />
        </div>
      )}

      <div className={styles.matrixDisplay}>
        <RiskMatrix
          questionnaireResponses={demoResponses}
          onRiskAssessmentChange={handleRiskAssessmentChange}
          showControls={true}
          showFactors={true}
          interactive={true}
          size="standard"
        />
      </div>

      <div className={styles.demoInfo}>
        <h3>System Features</h3>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h4>🎯 5x5 Risk Matrix</h4>
            <p>Interactive probability vs impact assessment with color-coded risk levels (Green, Yellow, Orange, Red).</p>
          </div>
          <div className={styles.featureCard}>
            <h4>⚠️ Risk Factors</h4>
            <p>Comprehensive risk factor analysis across threat history, public exposure, travel patterns, and more.</p>
          </div>
          <div className={styles.featureCard}>
            <h4>🛡️ Protection Recommendations</h4>
            <p>Automatic service level recommendations based on calculated risk: Essential, Executive, Shadow, Enhanced.</p>
          </div>
          <div className={styles.featureCard}>
            <h4>📱 Mobile Optimized</h4>
            <p>Responsive design with touch-friendly interface, collapsible matrix, and swipeable risk factor cards.</p>
          </div>
          <div className={styles.featureCard}>
            <h4>📊 Real-time Updates</h4>
            <p>Dynamic risk calculation as questionnaire responses change or risk factors are selected/deselected.</p>
          </div>
          <div className={styles.featureCard}>
            <h4>🎨 Visual Indicators</h4>
            <p>Animated position indicators, confidence levels, active factor tracking, and professional color coding.</p>
          </div>
        </div>
      </div>

      {Object.keys(demoResponses).length > 0 && (
        <div className={styles.responseDisplay}>
          <h3>Current Questionnaire Responses</h3>
          <pre className={styles.responseCode}>
            {JSON.stringify(demoResponses, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RiskMatrixDemo;