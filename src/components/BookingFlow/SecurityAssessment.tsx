import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './SecurityAssessment.module.css';

interface SecurityAssessmentProps {
  onComplete: (data: SecurityAssessmentData) => void;
  onBack: () => void;
  initialData?: Partial<SecurityAssessmentData>;
}

export interface SecurityAssessmentData {
  threatLevel: 'low' | 'medium' | 'high';
  locationType: 'residential' | 'corporate' | 'event' | 'public';
  duration: number; // in hours, minimum 2
  specialRequirements: {
    k9Unit: boolean;
    armed: boolean;
    diplomatic: boolean;
    surveillance: boolean;
    medical: boolean;
  };
  principalDetails: {
    name: string;
    contact: string;
    specialNeeds: string;
    vipStatus: boolean;
  };
  additionalNotes: string;
}

const STEPS = [
  { id: 'threat', title: 'Threat Assessment', description: 'Evaluate the security risk level' },
  { id: 'location', title: 'Location Type', description: 'Where will protection be needed?' },
  { id: 'duration', title: 'Duration', description: 'How long do you need protection?' },
  { id: 'requirements', title: 'Special Requirements', description: 'Additional security needs' },
  { id: 'principal', title: 'Principal Details', description: 'Information about the person being protected' },
  { id: 'review', title: 'Review & Confirm', description: 'Review your security assessment' },
];

export function SecurityAssessment({ onComplete, onBack, initialData }: SecurityAssessmentProps) {
  const { state } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<SecurityAssessmentData>({
    threatLevel: 'medium',
    locationType: 'corporate',
    duration: 2,
    specialRequirements: {
      k9Unit: false,
      armed: false,
      diplomatic: false,
      surveillance: false,
      medical: false,
    },
    principalDetails: {
      name: '',
      contact: '',
      specialNeeds: '',
      vipStatus: false,
    },
    additionalNotes: '',
    ...initialData,
  });

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('armora_security_assessment', JSON.stringify(assessmentData));
  }, [assessmentData]);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('armora_security_assessment');
    if (saved && !initialData) {
      try {
        const parsed = JSON.parse(saved);
        setAssessmentData(parsed);
      } catch (error) {
        console.error('Failed to load saved assessment:', error);
      }
    }
  }, [initialData]);

  const updateData = (field: keyof SecurityAssessmentData, value: any) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
  };

  const updateSpecialRequirements = (field: keyof SecurityAssessmentData['specialRequirements'], value: boolean) => {
    setAssessmentData(prev => ({
      ...prev,
      specialRequirements: { ...prev.specialRequirements, [field]: value }
    }));
  };

  const updatePrincipalDetails = (field: keyof SecurityAssessmentData['principalDetails'], value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      principalDetails: { ...prev.principalDetails, [field]: value }
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = () => {
    // Clear saved progress
    localStorage.removeItem('armora_security_assessment');
    onComplete(assessmentData);
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'threat':
        return (
          <div className={styles.stepContent}>
            <h3>What is the threat level for this assignment?</h3>
            <div className={styles.optionGrid}>
              {[
                { value: 'low', label: 'Low Risk', description: 'Standard personal protection', color: '#22c55e' },
                { value: 'medium', label: 'Medium Risk', description: 'Elevated security awareness needed', color: '#f59e0b' },
                { value: 'high', label: 'High Risk', description: 'Maximum security protocols required', color: '#ef4444' },
              ].map(option => (
                <button
                  key={option.value}
                  className={`${styles.optionCard} ${assessmentData.threatLevel === option.value ? styles.selected : ''}`}
                  onClick={() => updateData('threatLevel', option.value)}
                  style={{ borderColor: assessmentData.threatLevel === option.value ? option.color : undefined }}
                >
                  <div className={styles.optionIcon} style={{ backgroundColor: option.color }}>
                    {option.value === 'low' ? '🟢' : option.value === 'medium' ? '🟡' : '🔴'}
                  </div>
                  <h4>{option.label}</h4>
                  <p>{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className={styles.stepContent}>
            <h3>Where will protection be required?</h3>
            <div className={styles.optionGrid}>
              {[
                { value: 'residential', label: 'Residential', description: 'Home, private residence', icon: '🏠' },
                { value: 'corporate', label: 'Corporate', description: 'Office, business facility', icon: '🏢' },
                { value: 'event', label: 'Event', description: 'Conference, gathering, function', icon: '🎪' },
                { value: 'public', label: 'Public Space', description: 'Streets, transport, public venues', icon: '🌆' },
              ].map(option => (
                <button
                  key={option.value}
                  className={`${styles.optionCard} ${assessmentData.locationType === option.value ? styles.selected : ''}`}
                  onClick={() => updateData('locationType', option.value)}
                >
                  <div className={styles.optionIcon}>{option.icon}</div>
                  <h4>{option.label}</h4>
                  <p>{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 'duration':
        return (
          <div className={styles.stepContent}>
            <h3>How long do you need protection?</h3>
            <div className={styles.durationSelector}>
              <label htmlFor="duration">Duration (minimum 2 hours):</label>
              <div className={styles.durationControls}>
                <button
                  className={styles.durationBtn}
                  onClick={() => updateData('duration', Math.max(2, assessmentData.duration - 1))}
                  disabled={assessmentData.duration <= 2}
                >
                  -
                </button>
                <span className={styles.durationValue}>{assessmentData.duration} hours</span>
                <button
                  className={styles.durationBtn}
                  onClick={() => updateData('duration', assessmentData.duration + 1)}
                >
                  +
                </button>
              </div>
              <div className={styles.quickDurationOptions}>
                {[2, 4, 6, 8, 12, 24].map(hours => (
                  <button
                    key={hours}
                    className={`${styles.quickDurationBtn} ${assessmentData.duration === hours ? styles.selected : ''}`}
                    onClick={() => updateData('duration', hours)}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'requirements':
        return (
          <div className={styles.stepContent}>
            <h3>Special Requirements</h3>
            <div className={styles.requirementsList}>
              {[
                { key: 'k9Unit', label: 'K9 Unit', description: 'Trained security dog and handler', icon: '🐕' },
                { key: 'armed', label: 'Armed Protection', description: 'Licensed firearms officer', icon: '🛡️' },
                { key: 'diplomatic', label: 'Diplomatic Protocol', description: 'International VIP procedures', icon: '🌍' },
                { key: 'surveillance', label: 'Surveillance Detection', description: 'Counter-surveillance sweeps', icon: '👁️' },
                { key: 'medical', label: 'Medical Response', description: 'First aid and emergency medical', icon: '🏥' },
              ].map(req => (
                <label key={req.key} className={styles.requirementItem}>
                  <input
                    type="checkbox"
                    checked={assessmentData.specialRequirements[req.key as keyof typeof assessmentData.specialRequirements]}
                    onChange={(e) => updateSpecialRequirements(req.key as keyof typeof assessmentData.specialRequirements, e.target.checked)}
                  />
                  <div className={styles.requirementContent}>
                    <div className={styles.requirementIcon}>{req.icon}</div>
                    <div>
                      <h4>{req.label}</h4>
                      <p>{req.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 'principal':
        return (
          <div className={styles.stepContent}>
            <h3>Principal Details</h3>
            <div className={styles.formFields}>
              <div className={styles.field}>
                <label htmlFor="principalName">Principal Name *</label>
                <input
                  type="text"
                  id="principalName"
                  value={assessmentData.principalDetails.name}
                  onChange={(e) => updatePrincipalDetails('name', e.target.value)}
                  placeholder="Person being protected"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="principalContact">Contact Information *</label>
                <input
                  type="text"
                  id="principalContact"
                  value={assessmentData.principalDetails.contact}
                  onChange={(e) => updatePrincipalDetails('contact', e.target.value)}
                  placeholder="Phone or email"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="specialNeeds">Special Needs or Medical Conditions</label>
                <textarea
                  id="specialNeeds"
                  value={assessmentData.principalDetails.specialNeeds}
                  onChange={(e) => updatePrincipalDetails('specialNeeds', e.target.value)}
                  placeholder="Any medical conditions, mobility needs, or special considerations..."
                  rows={3}
                />
              </div>
              <label className={styles.checkboxField}>
                <input
                  type="checkbox"
                  checked={assessmentData.principalDetails.vipStatus}
                  onChange={(e) => updatePrincipalDetails('vipStatus', e.target.checked)}
                />
                <span>High-profile VIP requiring discretion</span>
              </label>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className={styles.stepContent}>
            <h3>Review Your Security Assessment</h3>
            <div className={styles.reviewSummary}>
              <div className={styles.reviewSection}>
                <h4>Threat Level</h4>
                <p className={styles[`threat-${assessmentData.threatLevel}`]}>
                  {assessmentData.threatLevel.charAt(0).toUpperCase() + assessmentData.threatLevel.slice(1)} Risk
                </p>
              </div>
              <div className={styles.reviewSection}>
                <h4>Location Type</h4>
                <p>{assessmentData.locationType.charAt(0).toUpperCase() + assessmentData.locationType.slice(1)}</p>
              </div>
              <div className={styles.reviewSection}>
                <h4>Duration</h4>
                <p>{assessmentData.duration} hours</p>
              </div>
              <div className={styles.reviewSection}>
                <h4>Special Requirements</h4>
                <div className={styles.requirementTags}>
                  {Object.entries(assessmentData.specialRequirements)
                    .filter(([_, enabled]) => enabled)
                    .map(([key, _]) => (
                      <span key={key} className={styles.requirementTag}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    ))}
                  {Object.values(assessmentData.specialRequirements).every(v => !v) && (
                    <span className={styles.noRequirements}>None selected</span>
                  )}
                </div>
              </div>
              <div className={styles.reviewSection}>
                <h4>Principal</h4>
                <p><strong>{assessmentData.principalDetails.name}</strong></p>
                <p>{assessmentData.principalDetails.contact}</p>
                {assessmentData.principalDetails.vipStatus && (
                  <span className={styles.vipBadge}>VIP Status</span>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'principal':
        return assessmentData.principalDetails.name.trim() && assessmentData.principalDetails.contact.trim();
      default:
        return true;
    }
  };

  return (
    <div className={styles.securityAssessment}>
      {/* Progress Indicator */}
      <div className={styles.progressIndicator}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className={styles.stepIndicators}>
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.stepIndicator} ${index <= currentStep ? styles.completed : ''} ${index === currentStep ? styles.current : ''}`}
            >
              <span className={styles.stepNumber}>{index + 1}</span>
              <span className={styles.stepTitle}>{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h2>{STEPS[currentStep].title}</h2>
          <p>{STEPS[currentStep].description}</p>
        </div>
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          className={styles.backBtn}
          onClick={prevStep}
        >
          {currentStep === 0 ? 'Back to CPO Selection' : 'Previous'}
        </button>
        {currentStep < STEPS.length - 1 ? (
          <button
            className={styles.nextBtn}
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Continue
          </button>
        ) : (
          <button
            className={styles.completeBtn}
            onClick={handleComplete}
            disabled={!canProceed()}
          >
            Complete Assessment
          </button>
        )}
      </div>
    </div>
  );
}