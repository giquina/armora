import React, { useState, useEffect } from 'react';
import { QuestionnaireStep as IQuestionnaireStep, QuestionnaireOption } from '../../types';
import { CTAButtons } from './CTAButtons';
import { Step2BottomCTA } from './Step2BottomCTA';
import { NameCollection } from './NameCollection';
import { 
  getDynamicProgressMessage, 
  getDynamicBackText, 
  getDynamicCTAText, 
  getDynamicExamples,
  getDynamicQuestionText,
  getDynamicStepDescription 
} from '../../utils/dynamicPersonalization';
import styles from './QuestionnaireStep.module.css';
import { Icon } from '../UI/Icon';
import '../../styles/questionnaire-animations.css';

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
  // Local state for form values
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textValue, setTextValue] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  const [preferNotToSay, setPreferNotToSay] = useState(false);
  const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});
  
  // Dynamic personalization state
  const [userName, setUserName] = useState<string>('');
  const [dynamicContent, setDynamicContent] = useState<{
    backText: string;
    progressMessage: string;
    ctaText: string;
    questionText: string;
    stepDescription?: string;
  }>({
    backText: '',
    progressMessage: '',
    ctaText: '',
    questionText: step.question,
    stepDescription: step.stepDescription
  });
  
    
  // Extract professional profile from userResponses or current selection
  const professionalProfile = userResponses?.step1_transportProfile || selectedValue;


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

  // Force remove golden lines after render
  useEffect(() => {
    const removeGoldenLines = () => {
      // Remove from all questionnaire options
      const options = document.querySelectorAll('.option');
      options.forEach((option) => {
        const element = option as HTMLElement;
        
        // Force border control
        element.style.borderBottom = '2px solid rgba(255, 215, 0, 0.3)';
        element.style.boxShadow = 'none';
        element.style.width = '100%';
        element.style.maxWidth = '100%';
        
        // Remove pseudo-elements
        const style = document.createElement('style');
        style.id = 'golden-line-killer';
        style.textContent = `
          .option::after,
          .option::before {
            display: none !important;
            content: none !important;
            border: none !important;
            background: none !important;
          }
        `;
        
        // Remove existing style if present
        const existing = document.getElementById('golden-line-killer');
        if (existing) existing.remove();
        
        document.head.appendChild(style);
      });
      
      // Remove any stray progress elements
      const progressElements = document.querySelectorAll('.progress-bar, .progress-fill');
      progressElements.forEach((el) => {
        const element = el as HTMLElement;
        element.style.position = 'relative';
        element.style.zIndex = '1';
      });
    };

    // Run immediately and after any navigation
    removeGoldenLines();
    const timer = setTimeout(removeGoldenLines, 100);
    
    return () => clearTimeout(timer);
  }, [step.id]);

  // Update dynamic content when context changes
  useEffect(() => {
    const updateDynamicContent = () => {
      const hasValue = selectedValue || selectedValues.length > 0 || textValue.trim();
      
      setDynamicContent({
        backText: getDynamicBackText(step.id),
        progressMessage: getDynamicProgressMessage({
          userName,
          professionalProfile,
          currentStep: step.id,
          totalSteps: 9
        }),
        ctaText: getDynamicCTAText(step.id, !!hasValue, userName),
        questionText: getDynamicQuestionText(step.question, userName, professionalProfile),
        stepDescription: step.stepDescription ? 
          getDynamicStepDescription(step.stepDescription, userName, professionalProfile) : 
          undefined
      });
    };

    updateDynamicContent();
  }, [userName, professionalProfile, step.id, step.question, step.stepDescription, selectedValue, selectedValues.length, textValue]);

  // Handle radio/select input with toggle functionality
  const handleSingleSelect = (value: string) => {
    // If clicking on the already selected option, deselect it (toggle off)
    if (selectedValue === value) {
      setSelectedValue('');
    } else {
      setSelectedValue(value);
    }
    setErrors([]);
  };

  // Enhanced CTA handlers
  const handleSaveExit = () => {
    // Save current progress to localStorage
    const progressData = {
      step: step.id,
      responses: {
        ...(selectedValue ? { [`step${step.id}`]: selectedValue } : {}),
        ...(selectedValues.length > 0 ? { [`step${step.id}`]: selectedValues } : {}),
        ...(textValue ? { [`step${step.id}`]: textValue } : {})
      },
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('armora_questionnaire_progress', JSON.stringify(progressData));
    
    // Show confirmation and navigate away
    alert('Your progress has been saved. You can return anytime to continue your security assessment.');
    window.location.href = '/';
  };

  const handleHelp = () => {
    const helpContent = `
Step ${step.id} Help:

${getStepGuidance(step.id)}

Need additional assistance?
• Contact our security specialists: 0800-ARMORA-1
• Live chat available 24/7 on our website
• Email: support@armora-transport.co.uk

Your privacy is important to us. All questions are optional and you can use "Prefer not to say" for maximum privacy.
    `;
    
    alert(helpContent);
  };

  const handleSkip = () => {
    if (step.validation.required) {
      alert('This step is required for security assessment. Please make a selection or choose "Prefer not to say" for privacy.');
      return;
    }
    
    // Skip with empty value
    onComplete(step.id, '');
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

  // Render enhanced options with examples and help
  const renderOptions = () => {
    const optionsToRender = step.options;
    if (!optionsToRender) return null;

  return optionsToRender.map((option: QuestionnaireOption & { examples?: string; helpText?: string }) => {
      // Apply dynamic examples based on professional profile
      const dynamicExamples = option.examples ? 
        getDynamicExamples(professionalProfile, option.examples) : 
        option.examples;
      if (step.type === 'radio') {
        const optionNode = (
          <label key={option.id} className={`${styles.option} questionnaire-option option-select-effect ${selectedValue === option.value ? 'selected' : ''}`} data-option-value={option.value}>
            {/* HIGH DEMAND badge - responsive positioning */}
            {option.value === 'international_visitor' && (
              <div className={`${styles.demandBadge} ${selectedValue === option.value ? styles.selected : ''}`}>
                HIGH DEMAND
              </div>
            )}
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
                <Icon name="check-circle" size={16} />
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
              {dynamicExamples && (
                <div className={styles.optionExamples}>
                  {dynamicExamples}
                </div>
              )}
            </div>
          </label>
        );

        // For Step 1: insert Privacy & Security disclaimer card after the
        // "International Visitor/Tourist" option, so it appears just before
        // the final "Prefer not to say" option.
        if (step.id === 1 && option.value === 'international_visitor') {
          const assuranceText = step.processOverview?.securityAssurance ||
            'All responses are encrypted and used exclusively for service matching. Your privacy is our priority.';

          return (
            <React.Fragment key={`${option.id}-with-assurance`}>
              {optionNode}
              <div className={`${styles.securityAssurance} ${styles.securityAssuranceInline}`}>
                <h4>Your Privacy & Security</h4>
                <p>{assuranceText}</p>
              </div>
            </React.Fragment>
          );
        }

        return optionNode;
      } else if (step.type === 'checkbox') {
        return (
          <label key={option.id} className={`${styles.option} questionnaire-option option-select-effect ${selectedValues.includes(option.value) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleMultiSelect(option.value, e.target.checked)}
              className={styles.checkboxInput}
            />
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <Icon name="check-circle" size={16} />
                <span className={styles.optionLabel}>{option.label}</span>
              </div>
              {option.description && (
                <p className={styles.optionDescription}>{option.description}</p>
              )}
              {dynamicExamples && (
                <div className={styles.optionExamples}>
                  {dynamicExamples}
                </div>
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
          className={`${styles.textInput} premium-input`}
          maxLength={step.validation.maxLength}
        />
      );
    } else if (step.type === 'textarea') {
      return (
        <textarea
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={step.placeholder}
          className={`${styles.textarea} premium-input`}
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

  // Dynamic content is already handled by the dynamicContent state above

  // Toggle examples visibility
  const toggleExamples = (optionId: string) => {
    setShowExamples(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
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
    <div className={`${styles.container} ${isAnimatingIn ? styles.animatingIn : ''} questionnaire-background`}>
      {/* Floating Background Elements */}
      <div className="floating-elements">
      </div>
      
      <div className={styles.content}>
        {/* Enhanced Step 1 Introduction with Name Collection */}
        {step.isFirstStep && step.processOverview ? (
          <div className={styles.stepIntroComprehensive}>
            {/* Name Collection Section */}
            <NameCollection 
              userName={userName}
              onNameChange={setUserName}
              className={styles.nameCollectionWrapper}
            />
            
            <div className={styles.stepBadge}>
              <Icon name="shield" size={18} />
              <span>Step {step.id} of 9</span>
            </div>
            
            <header className={styles.enhancedHeader}>
              <h1 className={styles.titleEnhanced}><Icon name="user" size={20} /> {step.title}</h1>
              <h2 className={styles.subtitleEnhanced}><Icon name="list" size={18} /> {step.subtitle}</h2>
              
              <div className={styles.whyQuestionnaire}>
                <h3><Icon name="info" size={16} /> Why This Assessment Matters</h3>
                <p>{dynamicContent.stepDescription || step.stepDescription}</p>
              </div>
              
              <div className={styles.processOverview}>
                <div className={styles.processBenefits}>
                  <div className={styles.benefitItem}>
                    <Icon name="clock" size={16} /> <span>Takes {step.processOverview.timeRequired}</span>
                  </div>
                  {step.processOverview.benefits.map((benefit, index) => (
                    <div key={index} className={styles.benefitItem}>
                      <Icon name="check-circle" size={16} /> <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Privacy & Security disclaimer moved to appear between options at the bottom of the page */}
            </header>
            
            {/* Trust Indicators */}
      <div className={styles.trustIndicators}>
              <div className={styles.securityBadges}>
        <div className={styles.badge}><Icon name="shield" size={14} /> SIA Licensed</div>
        <div className={styles.badge}><Icon name="lock" size={14} /> 256-bit Encryption</div>
        <div className={styles.badge}><Icon name="check-circle" size={14} /> Government Approved</div>
        <div className={styles.badge}><Icon name="check-circle" size={14} /> TFL Private Hire</div>
        <div className={styles.badge}><Icon name="shield" size={14} /> SIA Close Protection (CP) Officers</div>
              </div>
              
              <div className={styles.dataUsageNote}>
        <Icon name="lock" size={14} /> <span>Your responses are used exclusively for security service matching and are never shared externally.</span>
              </div>
            </div>
          </div>
        ) : (
          <header className={styles.header}>
            <h1 className={styles.title}><Icon name="user" size={18} /> {step.title}</h1>
            {step.subtitle && <p className={styles.subtitle}>{step.subtitle}</p>}
            
            {/* Step Guidance for non-first steps */}
            {(dynamicContent.stepDescription || step.stepDescription) && (
        <div className={styles.stepGuidance}>
                <div className={styles.guidanceContent}>
          <h4><Icon name="info" size={14} /> How This Step Helps:</h4>
                  <p>{dynamicContent.stepDescription || step.stepDescription}</p>
                </div>
              </div>
            )}
            
            {/* Dynamic Progress Message */}
            {dynamicContent.progressMessage && step.id > 1 && (
              <div className={styles.progressMessage}>
                <p>{dynamicContent.progressMessage}</p>
              </div>
            )}
          </header>
        )}

        <div className={styles.questionSection}>
          <h2 className={styles.question}><Icon name="list" size={16} /> {dynamicContent.questionText}</h2>
          {step.helpText && <p className={styles.helpText}>{step.helpText}</p>}
          
          {/* Step-by-step guidance for all steps */}
          <div className={styles.stepInstructions}>
            <div className={styles.instructionContent}>
              <h4><Icon name="info" size={14} /> How to Answer:</h4>
              <p>{getStepGuidance(step.id)}</p>
            </div>
          </div>
        </div>

        <div className={styles.inputSection}>
          {step.type === 'radio' || step.type === 'checkbox' ? (
            <div className={styles.optionsContainer}>
              {renderOptions()}
            </div>
          ) : step.type === 'select' ? (
            renderSelect()
          ) : (
            renderTextInput()
          )}
        </div>

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

        {/* Global Privacy & Security disclaimer footer for steps 2-9 */}
        {step.id !== 1 && (
          <div className={`${styles.securityAssurance} ${styles.securityAssuranceFooter}`}>
            <h4><Icon name="lock" size={14} /> Your Privacy & Security</h4>
            <p>{step.processOverview?.securityAssurance || 'All responses are encrypted and used exclusively for service matching. Your privacy is our priority.'}</p>
          </div>
        )}
      </div>

      {/* Step-specific CTA Buttons with Dynamic Text */}
      {step.id === 2 ? (
        <Step2BottomCTA
          onBack={onPrevious || (() => {})}
          onSaveExit={handleSaveExit}
          onContinue={handleSubmit}
          canContinue={canProceed()}
          dynamicBackText={dynamicContent.backText}
          dynamicContinueText={dynamicContent.ctaText}
        />
      ) : (
        <CTAButtons
          currentStep={step.id}
          totalSteps={9}
          hasSelection={canProceed()}
          onNext={handleSubmit}
          onPrevious={onPrevious}
          onSaveExit={handleSaveExit}
          onHelp={handleHelp}
          onSkip={handleSkip}
          isLastStep={Boolean(isLastStep)}
          dynamicBackText={dynamicContent.backText}
          dynamicContinueText={dynamicContent.ctaText}
        />
      )}
    </div>
  );
}