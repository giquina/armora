import React, { useState, useEffect } from 'react';
import { QuestionnaireStep as IQuestionnaireStep, QuestionnaireOption, DynamicQuestionContent } from '../../types';
import { getDynamicQuestionContent, getRealtimeRecommendations } from '../../data/questionnaireData';
import styles from './QuestionnaireStep.module.css';

interface QuestionnaireStepProps {
  step: IQuestionnaireStep;
  currentValue?: string | string[];
  onComplete: (stepId: number, value: string | string[]) => void;
  onPrevious?: () => void;
  showConversionPrompt?: boolean;
  onConversionPromptResponse?: (shouldConvert: boolean) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  userResponses?: Record<string, any>;
  currentStepNumber?: number;
}

export function QuestionnaireStep({
  step,
  currentValue,
  onComplete,
  onPrevious,
  showConversionPrompt,
  onConversionPromptResponse,
  isFirstStep,
  isLastStep,
  userResponses = {},
  currentStepNumber = 1
}: QuestionnaireStepProps) {
  // const { state } = useApp(); // Available for future features if needed
  // const { user } = state;

  // Local state for form values
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textValue, setTextValue] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});
  const [showUncertaintyHelp, setShowUncertaintyHelp] = useState(false);
  
  // Get dynamic content and real-time recommendations
  const dynamicContent: DynamicQuestionContent = getDynamicQuestionContent(step.id, userResponses);
  const recommendations = currentStepNumber >= 2 ? getRealtimeRecommendations(userResponses) : null;

  // Initialize values from current value
  useEffect(() => {
    if (currentValue) {
      if (Array.isArray(currentValue)) {
        setSelectedValues(currentValue);
      } else {
        if (step.type === 'radio' || step.type === 'select') {
          setSelectedValue(currentValue);
        } else {
          setTextValue(currentValue);
        }
      }
    } else {
      // Reset values when stepping to new question
      setSelectedValue('');
      setSelectedValues([]);
      setTextValue('');
    }
    setErrors([]);
    setIsAnimatingIn(true);
    
    const timer = setTimeout(() => setIsAnimatingIn(false), 300);
    return () => clearTimeout(timer);
  }, [step.id, currentValue, step.type]);

  // Handle radio/select input
  const handleSingleSelect = (value: string) => {
    setSelectedValue(value);
    setErrors([]);
  };

  // Handle checkbox input
  const handleMultiSelect = (value: string, checked: boolean) => {
    let newValues: string[];
    
    if (checked) {
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter(v => v !== value);
    }
    
    setSelectedValues(newValues);
    setErrors([]);

    // Validate max selections
    if (step.validation.maxSelections && newValues.length > step.validation.maxSelections) {
      setErrors([`Please select no more than ${step.validation.maxSelections} options`]);
      return;
    }
  };

  // Handle text input
  const handleTextChange = (value: string) => {
    setTextValue(value);
    setErrors([]);

    // Real-time validation for text inputs
    if (step.validation.maxLength && value.length > step.validation.maxLength) {
      setErrors([`Maximum ${step.validation.maxLength} characters allowed`]);
    }
  };

  // Validate current input
  const validate = (): boolean => {
    const newErrors: string[] = [];
    const { validation } = step;

    // Get current values based on step type
    let hasValue = false;
    let valueLength = 0;
    let selectionCount = 0;

    if (step.type === 'checkbox') {
      hasValue = selectedValues.length > 0;
      selectionCount = selectedValues.length;
    } else if (step.type === 'radio' || step.type === 'select') {
      hasValue = selectedValue.length > 0;
    } else {
      hasValue = textValue.trim().length > 0;
      valueLength = textValue.trim().length;
    }

    // Required validation
    if (validation.required && !hasValue) {
      newErrors.push(validation.errorMessage || 'This field is required');
    }

    // Length validations for text inputs
    if (hasValue && (step.type === 'input' || step.type === 'textarea')) {
      if (validation.minLength && valueLength < validation.minLength) {
        newErrors.push(`Minimum ${validation.minLength} characters required`);
      }
      if (validation.maxLength && valueLength > validation.maxLength) {
        newErrors.push(`Maximum ${validation.maxLength} characters allowed`);
      }
    }

    // Selection count validations for checkboxes
    if (step.type === 'checkbox' && hasValue) {
      if (validation.minSelections && selectionCount < validation.minSelections) {
        newErrors.push(`Please select at least ${validation.minSelections} option${validation.minSelections > 1 ? 's' : ''}`);
      }
      if (validation.maxSelections && selectionCount > validation.maxSelections) {
        newErrors.push(`Please select no more than ${validation.maxSelections} option${validation.maxSelections > 1 ? 's' : ''}`);
      }
    }

    // Pattern validation for text inputs
    if (hasValue && validation.pattern && (step.type === 'input' || step.type === 'textarea')) {
      if (!validation.pattern.test(textValue.trim())) {
        newErrors.push(validation.errorMessage || 'Please enter a valid value');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    let value: string | string[];
    
    if (step.type === 'checkbox') {
      value = selectedValues;
    } else if (step.type === 'radio' || step.type === 'select') {
      value = selectedValue;
    } else {
      value = textValue.trim();
    }

    onComplete(step.id, value);
  };

  // Toggle examples visibility
  const toggleExamples = (optionId: string) => {
    setShowExamples(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  };

  // Render enhanced options with examples and help
  const renderOptions = () => {
    const optionsToRender = step.id === 2 && dynamicContent.options.length > 0 ? dynamicContent.options : step.options;
    if (!optionsToRender) return null;

    return optionsToRender.map((option: QuestionnaireOption & { examples?: string; helpText?: string }) => {
      if (step.type === 'radio') {
        return (
          <label key={option.id} className={styles.option}>
            <input
              type="radio"
              name={`step-${step.id}`}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleSingleSelect(option.value)}
              className={styles.radioInput}
            />
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
                <span className={styles.optionLabel}>{option.label}</span>
                {option.helpText && (
                  <button 
                    type="button"
                    className={styles.helpButton}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(option.helpText);
                    }}
                  >
                    ?
                  </button>
                )}
              </div>
              {option.description && (
                <p className={styles.optionDescription}>{option.description}</p>
              )}
              {option.examples && (
                <div className={styles.examplesSection}>
                  <button 
                    type="button"
                    className={styles.showExamplesBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExamples(option.id);
                    }}
                  >
                    {showExamples[option.id] ? 'Hide examples' : 'See examples'}
                  </button>
                  {showExamples[option.id] && (
                    <div className={styles.examplesContent}>
                      <strong>Examples:</strong> {option.examples}
                    </div>
                  )}
                </div>
              )}
            </div>
          </label>
        );
      } else if (step.type === 'checkbox') {
        return (
          <label key={option.id} className={styles.option}>
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleMultiSelect(option.value, e.target.checked)}
              className={styles.checkboxInput}
            />
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
                <span className={styles.optionLabel}>{option.label}</span>
              </div>
              {option.description && (
                <p className={styles.optionDescription}>{option.description}</p>
              )}
            </div>
          </label>
        );
      }
      return null;
    });
  };

  // Render text inputs
  const renderTextInput = () => {
    if (step.type === 'input') {
      return (
        <input
          type="text"
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={step.placeholder}
          className={styles.textInput}
          maxLength={step.validation.maxLength}
        />
      );
    } else if (step.type === 'textarea') {
      return (
        <textarea
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={step.placeholder}
          className={styles.textarea}
          rows={4}
          maxLength={step.validation.maxLength}
        />
      );
    }
    return null;
  };

  // Render select dropdown
  const renderSelect = () => {
    if (step.type !== 'select' || !step.options) return null;

    return (
      <select
        value={selectedValue}
        onChange={(e) => handleSingleSelect(e.target.value)}
        className={styles.select}
      >
        <option value="">Select an option...</option>
        {step.options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  // Check if we can proceed to next step
  const canProceed = () => {
    if (step.type === 'checkbox') {
      return selectedValues.length > 0;
    } else if (step.type === 'radio' || step.type === 'select') {
      return selectedValue.length > 0;
    } else {
      return textValue.trim().length > 0;
    }
  };

  // Step-by-step guidance helper
  const getStepGuidance = (stepId: number): string => {
    const guidance: Record<number, string> = {
      1: "Select the option that best matches your professional role. This helps us understand the level of discretion and security protocols required for your transport needs.",
      2: "Consider your typical transport patterns. Regular users benefit from consistent security teams, while occasional users receive flexible on-demand protection.",
      3: "Think about your specific security concerns or requirements. There are no wrong answers - this helps us match appropriate protection levels.",
      4: "Choose the areas where you most frequently need transport. This helps us pre-position resources and establish secure routes.",
      5: "Select any specialized locations you might need. Airport transfers and event venues require enhanced security protocols.",
      6: "Provide an emergency contact following security industry best practices. This ensures rapid response in any situation.",
      7: "Select any accommodations or special requirements. We ensure all passengers receive appropriate support for comfortable transport.",
      8: "Choose how you'd like to receive updates. Clear communication is essential for effective security operations.",
      9: "Review your complete security profile. This comprehensive assessment ensures we deliver the most appropriate protection service."
    };
    return guidance[stepId] || "Please complete this step to continue building your security profile.";
  };

  // Render conversion prompt for guest users
  if (showConversionPrompt && step.showConversionPrompt && onConversionPromptResponse) {
    const prompt = step.showConversionPrompt;
    
    return (
      <div className={styles.container}>
        <div className={styles.conversionPrompt}>
          <div className={styles.promptContent}>
            <h2 className={styles.promptTitle}>{prompt.title}</h2>
            <p className={styles.promptDescription}>{prompt.description}</p>
            
            <div className={styles.promptBenefits}>
              {prompt.benefits.map((benefit, index) => (
                <div key={index} className={styles.promptBenefit}>
                  <span className={styles.checkmark}>✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className={styles.promptActions}>
              <button
                onClick={() => onConversionPromptResponse(true)}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                {prompt.actionText}
              </button>
              <button
                onClick={() => onConversionPromptResponse(false)}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isAnimatingIn ? styles.animatingIn : ''}`}>
      <div className={styles.content}>
        {/* Enhanced Step 1 Introduction */}
        {step.isFirstStep && step.processOverview ? (
          <div className={styles.stepIntroComprehensive}>
            <div className={styles.stepBadge}>
              <span className={styles.shieldIcon}>🛡️</span>
              <span>Step {step.id} of 9</span>
            </div>
            
            <header className={styles.enhancedHeader}>
              <h1 className={styles.titleEnhanced}>{step.title}</h1>
              <h2 className={styles.subtitleEnhanced}>{step.subtitle}</h2>
              
              <div className={styles.whyQuestionnaire}>
                <h3>Why This Assessment Matters</h3>
                <p>{step.stepDescription}</p>
              </div>
              
              <div className={styles.processOverview}>
                <div className={styles.processBenefits}>
                  <div className={styles.benefitItem}>
                    <span className={styles.clockIcon}>⏱️</span>
                    <span>Takes {step.processOverview.timeRequired}</span>
                  </div>
                  {step.processOverview.benefits.map((benefit, index) => (
                    <div key={index} className={styles.benefitItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.securityAssurance}>
                <h4>Your Privacy & Security</h4>
                <p>{step.processOverview.securityAssurance}</p>
              </div>
            </header>
            
            {/* Trust Indicators */}
            <div className={styles.trustIndicators}>
              <div className={styles.securityBadges}>
                <div className={styles.badge}>
                  <span>🛡️</span> SIA Licensed
                </div>
                <div className={styles.badge}>
                  <span>🔒</span> 256-bit Encryption
                </div>
                <div className={styles.badge}>
                  <span>🏆</span> Government Approved
                </div>
              </div>
              
              <div className={styles.dataUsageNote}>
                <span>ℹ️</span>
                <span>Your responses are used exclusively for security service matching and are never shared externally.</span>
              </div>
            </div>
          </div>
        ) : (
          <header className={styles.header}>
            <h1 className={styles.title}>{step.title}</h1>
            {step.subtitle && <p className={styles.subtitle}>{step.subtitle}</p>}
            
            {/* Step Guidance for non-first steps */}
            {step.stepDescription && (
              <div className={styles.stepGuidance}>
                <div className={styles.guidanceContent}>
                  <h4>How This Step Helps:</h4>
                  <p>{step.stepDescription}</p>
                </div>
              </div>
            )}
          </header>
        )}

        <div className={styles.questionSection}>
          <h2 className={styles.question}>{step.question}</h2>
          {step.helpText && <p className={styles.helpText}>{step.helpText}</p>}
          
          {/* Step-by-step guidance for all steps */}
          <div className={styles.stepInstructions}>
            <div className={styles.instructionContent}>
              <h4>How to Answer:</h4>
              <p>{getStepGuidance(step.id)}</p>
            </div>
          </div>
        </div>

        <div className={styles.inputSection}>
          {step.type === 'radio' || step.type === 'checkbox' ? (
            <div className={styles.optionsContainer}>
              {renderOptions()}
              
              {/* Uncertainty Option */}
              <div className={styles.uncertaintySection}>
                <label className={`${styles.option} ${styles.uncertaintyOption}`}>
                  <input
                    type={step.type}
                    name={`step-${step.id}`}
                    value="not_sure"
                    checked={step.type === 'radio' ? selectedValue === 'not_sure' : selectedValues.includes('not_sure')}
                    onChange={() => step.type === 'radio' ? handleSingleSelect('not_sure') : handleMultiSelect('not_sure', true)}
                    className={step.type === 'radio' ? styles.radioInput : styles.checkboxInput}
                  />
                  <div className={styles.optionContent}>
                    <div className={styles.optionHeader}>
                      <span className={styles.optionIcon}>❓</span>
                      <span className={styles.optionLabel}>I'm not sure what applies to me</span>
                    </div>
                    <p className={styles.optionDescription}>
                      Let our security specialists recommend based on professionals in similar roles
                    </p>
                  </div>
                </label>
                
                {(selectedValue === 'not_sure' || selectedValues.includes('not_sure')) && (
                  <div className={styles.uncertaintyHelp}>
                    <div className={styles.helpOptions}>
                      <button 
                        type="button"
                        className={styles.helpButton}
                        onClick={() => setShowUncertaintyHelp(!showUncertaintyHelp)}
                      >
                        {showUncertaintyHelp ? 'Hide guidance' : 'Get personalized guidance'}
                      </button>
                      {showUncertaintyHelp && (
                        <div className={styles.uncertaintyGuidance}>
                          <h4>Let us help you choose</h4>
                          <p>Based on your professional profile, here are typical scenarios:</p>
                          {dynamicContent?.similarClients && dynamicContent.similarClients.length > 0 && (
                            <div className={styles.similarClients}>
                              {dynamicContent.similarClients.map((client, index) => (
                                <div key={index} className={styles.clientExample}>
                                  <div className={styles.clientType}>{client.type}</div>
                                  <div className={styles.clientNeeds}>{client.needs}</div>
                                  <div className={styles.recommendedService}>
                                    <strong>Our solution:</strong> {client.service}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : step.type === 'select' ? (
            renderSelect()
          ) : (
            renderTextInput()
          )}
        </div>

        {/* Real-time Service Preview */}
        {recommendations && currentStepNumber >= 2 && (
          <div className={styles.servicePreviewPanel}>
            <div className={styles.previewHeader}>
              <h3>Your Profile So Far</h3>
              <div className={styles.progressIndicator}>
                {currentStepNumber}/9 steps complete ({recommendations.completionPercentage}%)
              </div>
            </div>
            
            <div className={styles.currentRecommendations}>
              <div className={styles.serviceLevel}>
                <strong>Recommended Service:</strong> {recommendations.recommendedService}
              </div>
              <div className={styles.costEstimate}>
                <strong>Estimated Cost:</strong> {recommendations.estimatedCost}/hour
              </div>
              <div className={styles.driverMatch}>
                <strong>Available Drivers:</strong> {recommendations.matchingDrivers} certified specialists in your area
              </div>
              <div className={styles.securityFeatures}>
                <strong>Security Features:</strong> {recommendations.securityFeatures.join(', ')}
              </div>
            </div>
            
            <div className={styles.previewNote}>
              <small>💡 This preview updates as you complete more steps</small>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className={styles.errorContainer}>
            {errors.map((error, index) => (
              <p key={index} className={styles.error}>{error}</p>
            ))}
          </div>
        )}

        {/* Character count for text inputs */}
        {(step.type === 'input' || step.type === 'textarea') && step.validation.maxLength && (
          <div className={styles.characterCount}>
            {textValue.length}/{step.validation.maxLength}
          </div>
        )}

        {/* Selection count for checkboxes */}
        {step.type === 'checkbox' && (step.validation.minSelections || step.validation.maxSelections) && (
          <div className={styles.selectionCount}>
            {selectedValues.length} selected
            {step.validation.minSelections && ` (minimum ${step.validation.minSelections})`}
            {step.validation.maxSelections && ` (maximum ${step.validation.maxSelections})`}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {onPrevious && (
          <button
            onClick={onPrevious}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            ← Previous
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canProceed()}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          {isLastStep ? 'Complete Security Assessment' : 'Next →'}
        </button>
      </div>
    </div>
  );
}