import React, { useState, useEffect, useCallback } from 'react';
import { QuestionnaireStep as IQuestionnaireStep, QuestionnaireOption, QuestionnaireAnswer, CustomAnswerValue } from '../../types';
import { CTAButtons } from './CTAButtons';
import { NameCollection } from './NameCollection';
import ProfileSummaryComponent from './ProfileSummary';
import YesNoToggle from '../UI/YesNoToggle';
import { FloatingCTA } from '../UI/FloatingCTA';
import { CustomAnswer } from './CustomAnswer';
import { SelectionFeedback } from './SelectionFeedback';
import { getSelectionFeedback, getCombinedFeedback, SelectionFeedback as ISelectionFeedback } from '../../data/selectionFeedbackData';
import { useApp } from '../../contexts/AppContext';
import styles from './QuestionnaireStep.module.css';
import spacingStyles from './BenefitListSpacing.module.css';
import '../../styles/questionnaire-animations.css';
import '../../styles/global-container.css';

interface QuestionnaireStepProps {
  step: IQuestionnaireStep;
  currentValue?: QuestionnaireAnswer;
  onComplete: (stepId: number, value: QuestionnaireAnswer) => void;
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
  const { state, setUserProfileSelection } = useApp();
  
  // Local state for form values
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textValue, setTextValue] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  // Custom answer state
  const [customAnswer, setCustomAnswer] = useState<string>('');
  const [isCustomSelected, setIsCustomSelected] = useState<boolean>(false);

  // Selection feedback state
  const [selectionFeedback, setSelectionFeedback] = useState<ISelectionFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  // Initialize values from current value
  useEffect(() => {
    if (currentValue) {
      // Check if the value indicates a custom answer
      if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue) && 'type' in currentValue && currentValue.type === 'custom') {
        const customValue = currentValue as CustomAnswerValue;
        setIsCustomSelected(true);
        setCustomAnswer(customValue.value || '');
        setSelectedValue('');
        setSelectedValues([]);
        setTextValue('');
      } else if (currentValue === 'prefer_not_to_say') {
        // Handle legacy prefer_not_to_say values
        setIsCustomSelected(false);
        setCustomAnswer('');
        setSelectedValue('');
        setSelectedValues([]);
        setTextValue('');
      } else if (Array.isArray(currentValue)) {
        setSelectedValues(currentValue);
        setIsCustomSelected(false);
      } else {
        setIsCustomSelected(false);
        setCustomAnswer('');
        if (step.type === 'radio' || step.type === 'select') {
          setSelectedValue(currentValue as string);
        } else {
          setTextValue(currentValue as string);
        }
      }
    } else {
      // Reset values when stepping to new question
      setSelectedValue('');
      setSelectedValues([]);
      setTextValue('');
      setIsCustomSelected(false);
      setCustomAnswer('');
    }
    setErrors([]);
    setIsAnimatingIn(true);
    
    const timer = setTimeout(() => setIsAnimatingIn(false), 300);
    return () => clearTimeout(timer);
  }, [step.id, currentValue, step.type]);

  // Edge-to-edge is now default via global-container.css

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

  // Auto-scroll functionality
  const scrollToBottom = useCallback(() => {
    // Small delay to ensure state updates have completed
    setTimeout(() => {
      const bottomElement = document.getElementById('questionnaire-bottom');
      if (bottomElement) {
        bottomElement.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }
    }, 100);
  }, []);

  // Update selection feedback - Fixed to prevent infinite re-renders
  const updateSelectionFeedback = useCallback((stepId: number, value?: string, values?: string[], isCustom?: boolean, customText?: string) => {
    let feedback: ISelectionFeedback | null = null;

    if (isCustom && customText?.trim()) {
      // Show generic feedback for custom answers
      feedback = {
        title: 'Custom Requirements Noted',
        description: 'Your specific requirements have been recorded and will be incorporated into your personalized service.',
        benefits: [
          'Customized service approach',
          'Flexible accommodation of needs',
          'Personalized attention to details',
          'Tailored security protocols'
        ],
        icon: '📝'
      };
    } else if (values && values.length > 0) {
      // Multiple selections (checkboxes)
      feedback = getCombinedFeedback(stepId, values);
    } else if (value && value.trim()) {
      // Single selection
      feedback = getSelectionFeedback(stepId, value);
    }

    setSelectionFeedback(feedback);
    setShowFeedback(!!feedback);

    // Auto-scroll if we have a selection
    if (feedback) {
      scrollToBottom();
    }
  }, [scrollToBottom]); // Removed dependency on state variables that change frequently

  // Handle radio/select input - always set new selection (no toggle off)
  const handleSingleSelect = (value: string) => {
    setSelectedValue(value);
    setErrors([]);

    // Store profile selection for Step 1 (ID 1) for FloatingCTA personalization
    if (step.id === 1) {
      setUserProfileSelection(value);
    }

    // Update feedback and auto-scroll
    updateSelectionFeedback(step.id, value);
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

    // Update feedback and auto-scroll
    updateSelectionFeedback(step.id, undefined, newValues);
  };

  // Handle text input
  const handleTextChange = (value: string) => {
    setTextValue(value);
    setErrors([]);
    // Clear custom answer when user starts typing in regular inputs
    if (isCustomSelected) {
      setIsCustomSelected(false);
      setCustomAnswer('');
    }

    // Real-time validation for text inputs
    if (step.validation.maxLength && value.length > step.validation.maxLength) {
      setErrors([`Maximum ${step.validation.maxLength} characters allowed`]);
    }
  };

  // Handle custom answer toggle
  const handleCustomAnswerToggle = (selected: boolean) => {
    setIsCustomSelected(selected);
    if (selected) {
      // Clear all other selections when custom answer is selected
      setSelectedValue('');
      setSelectedValues([]);
      setTextValue('');
      setErrors([]);
    } else {
      setCustomAnswer('');
    }
  };

  // Handle custom answer text change
  const handleCustomAnswerChange = (value: string) => {
    setCustomAnswer(value);
    setErrors([]);

    // Update feedback for custom answers
    if (isCustomSelected && value.trim()) {
      updateSelectionFeedback(step.id, undefined, undefined, true, value);
    } else if (!value.trim()) {
      setShowFeedback(false);
      setSelectionFeedback(null);
    }
  };

  // Validate current input
  const validate = (): boolean => {
    // If user provided custom answer, check if it has content
    if (isCustomSelected && customAnswer.trim().length > 0) return true;
    
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
    if (step.type === 'checkbox') {
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
    // If user provided custom answer, submit custom answer object
    if (isCustomSelected && customAnswer.trim().length > 0) {
      onComplete(step.id, { type: 'custom', value: customAnswer.trim() });
      return;
    }
    
    if (!validate()) {
      return;
    }

    let value: QuestionnaireAnswer;

    if (step.type === 'checkbox') {
      value = selectedValues;
    } else if (step.type === 'radio' || step.type === 'select') {
      value = selectedValue;
    } else {
      value = textValue.trim();
    }

    onComplete(step.id, value);
  };

  // Helper function to render golden text for asterisk-marked content
  const renderGoldenText = (text: string) => {
    if (text.startsWith('*')) {
      // Keep the asterisk and style it with golden color, along with the text
      return (
        <span className={styles.goldenText}>
          <span className={styles.goldenAsterisk}>*</span>
          <span>{text.substring(1)}</span>
        </span>
      );
    }
    return text;
  };

  // Render enhanced options with examples and help
  const renderOptions = () => {
    const optionsToRender = step.options;
    if (!optionsToRender) return null;

    return optionsToRender.map((option: QuestionnaireOption & { examples?: string; helpText?: string }) => {
      if (step.type === 'radio') {
        const optionNode = (
          <div 
            key={option.id} 
            className={`${styles.option} questionnaire-option option-select-effect ${selectedValue === option.value ? styles.optionSelected : ''}`} 
            data-option-value={option.value}
            onClick={() => {
              // Toggle behavior: if already selected, deselect it; if not selected, select it
              if (selectedValue === option.value) {
                setSelectedValue(''); // Deselect if already selected
                setErrors([]);
              } else {
                handleSingleSelect(option.value); // Select if not selected
              }
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                // Same toggle logic for keyboard
                if (selectedValue === option.value) {
                  setSelectedValue(''); // Deselect if already selected
                  setErrors([]);
                } else {
                  handleSingleSelect(option.value); // Select if not selected
                }
              }
            }}
          >
            {/* HIGH DEMAND badge - responsive positioning */}
            {option.value === 'international_visitor' && (
              <div className={`${styles.demandBadge} ${selectedValue === option.value ? styles.selected : ''}`}>
                HIGH DEMAND
              </div>
            )}
            
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.description && (
                  <p className={styles.optionDescription}>{option.description}</p>
                )}
                {option.examples && (
                  <div className={styles.optionExamples}>
                    {renderGoldenText(option.examples)}
                  </div>
                )}
              </div>
              <div className={styles.toggleContainer}>
                <div 
                  className={styles.toggleGroup}
                  onClick={(e) => e.stopPropagation()} // Prevent double-toggle when clicking on toggle itself
                >
                  <YesNoToggle
                    value={selectedValue === option.value}
                    onChange={(isSelected) => {
                      if (isSelected) {
                        handleSingleSelect(option.value);
                      } else {
                        // Allow deselection via toggle
                        setSelectedValue('');
                        setErrors([]);
                      }
                    }}
                    label=""
                    className={styles.optionToggle}
                  />
                  {option.helpText && (
                    <button 
                      type="button"
                      className={styles.helpButton}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent triggering option click
                        alert(option.helpText);
                      }}
                    >
                      ?
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

        return optionNode;
      } else if (step.type === 'checkbox') {
        return (
          <div 
            key={option.id} 
            className={`${styles.option} questionnaire-option option-select-effect ${selectedValues.includes(option.value) ? styles.optionSelected : ''}`}
            onClick={() => {
              // Toggle checkbox behavior
              const isCurrentlySelected = selectedValues.includes(option.value);
              handleMultiSelect(option.value, !isCurrentlySelected);
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const isCurrentlySelected = selectedValues.includes(option.value);
                handleMultiSelect(option.value, !isCurrentlySelected);
              }
            }}
          >
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.description && (
                  <p className={styles.optionDescription}>{option.description}</p>
                )}
                {option.examples && (
                  <div className={styles.optionExamples}>
                    {renderGoldenText(option.examples)}
                  </div>
                )}
              </div>
              <div className={styles.toggleContainer}>
                <div 
                  className={styles.toggleGroup}
                  onClick={(e) => e.stopPropagation()} // Prevent double-toggle when clicking on toggle itself
                >
                  <YesNoToggle
                    value={selectedValues.includes(option.value)}
                    onChange={(isSelected) => handleMultiSelect(option.value, isSelected)}
                    label=""
                    className={styles.optionToggle}
                  />
                </div>
              </div>
            </div>
          </div>
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
    // If user provided custom answer with content, they can proceed
    if (isCustomSelected && customAnswer.trim().length > 0) return true;
    
    const { validation } = step;
    
    if (step.type === 'checkbox') {
      const hasMinSelections = !validation.minSelections || selectedValues.length >= validation.minSelections;
      const hasMaxSelections = !validation.maxSelections || selectedValues.length <= validation.maxSelections;
      const hasValue = selectedValues.length > 0;
      
      if (validation.required) {
        return hasValue && hasMinSelections && hasMaxSelections;
      } else {
        return !hasValue || (hasMinSelections && hasMaxSelections);
      }
    } else if (step.type === 'radio' || step.type === 'select') {
      return validation.required ? selectedValue.length > 0 : true;
    } else {
      const hasValue = textValue.trim().length > 0;
      if (validation.required) {
        return hasValue;
      } else {
        return true;
      }
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
      6: "Provide a priority contact following security industry best practices. This ensures rapid response in any situation.",
      7: "Select any accommodations or special requirements. We ensure all Principals receive appropriate support for comfortable transport.",
      8: "Choose how you'd like to receive updates. Clear communication is essential for effective security operations.",
      9: "Review your complete security profile. This comprehensive assessment ensures we deliver the most appropriate protection service."
    };
    return guidance[stepId] || "Please complete this step to continue building your security profile.";
  };

  // Render conversion prompt for guest users
  if (showConversionPrompt && step.showConversionPrompt && onConversionPromptResponse) {
    const prompt = step.showConversionPrompt;
    
    return (
      <div className="global-viewport">
        <div className="global-container">
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
        </div>
      </div>
    );
  }

  // Special handling for Step 8 - Profile Summary
  if (step.id === 8) {
    return (
      <div className="global-viewport">
        <div className="global-container">
          <div className={`${styles.container} ${isAnimatingIn ? styles.animatingIn : ''} questionnaire-background`}>
            <div className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>Your Armora Security Profile</h1>
            <p className={styles.subtitle}>Comprehensive analysis of your transport requirements</p>
          </header>
          
          <div className={styles.profileSummary}>
            <ProfileSummaryComponent userResponses={userResponses} />
          </div>
          
          {/* Privacy & Security section - positioned at bottom before CTA buttons */}
          <div className={`${styles.securityAssurance} ${styles.securityAssuranceFooter}`}>
            <h4>Your Privacy & Security</h4>
            <p>Your comprehensive security profile is encrypted and used exclusively for service matching. Complete confidentiality guaranteed.</p>
          </div>
          
          <CTAButtons
            currentStep={step.id}
            totalSteps={9}
            hasSelection={true}
            onNext={() => onComplete(step.id, 'profile_reviewed')}
            onPrevious={onPrevious}
            onSaveExit={handleSaveExit}
            onHelp={handleHelp}
            onSkip={handleSkip}
            isLastStep={false}
          />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="global-viewport">
      <div className="global-container">
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
              userName={state.questionnaireData?.firstName || ''}
              onNameChange={() => {}}
              className={styles.nameCollectionWrapper}
            />
            
            {/* Header - Outside the boxes */}
            <div className={styles.stepHeaderSection}>
              <header className={styles.header}>
                <h1 className={styles.title}>{step.title}</h1>
                <p className={styles.subtitle}>{step.subtitle}</p>
              </header>
            </div>
            
            {/* Single Consolidated Introduction Box */}
            <div className={styles.singleIntroContainer}>
              <div className={styles.consolidatedBox}>
                {/* Primary Headline */}
                <div className={styles.primaryHeadline}>
                  <span className={styles.headlineIcon}>🛡️</span>
                  <h3>Professional Security Assessment</h3>
                </div>
                
                {/* Value Proposition */}
                <p className={styles.valueProposition}>
                  Unlock personalized VIP transport with security-trained Protection Officers tailored to your professional requirements. Our comprehensive assessment ensures the right protection level and service features for your specific needs.
                </p>
                
                {/* Benefits List */}
                <div className={styles.benefitsSection}>
                  <h4 className={styles.sectionHeading}>
                    <span>✨</span>
                    <span>What You'll Receive</span>
                  </h4>
                  <ul className={spacingStyles.tightBenefitsList}>
                    <li className={spacingStyles.tightBenefitItem}>
                      <span className={styles.checkmark}>✓</span>
                      <span>Personalized security recommendations matched to your profile</span>
                    </li>
                    <li className={spacingStyles.tightBenefitItem}>
                      <span className={styles.checkmark}>✓</span>
                      <span>Protection level assessment with appropriate Protection Officer assignment</span>
                    </li>
                    <li className={spacingStyles.tightBenefitItem}>
                      <span className={styles.checkmark}>✓</span>
                      <span>Security-conscious route planning and venue coordination</span>
                    </li>
                    <li className={spacingStyles.tightBenefitItem}>
                      <span className={styles.checkmark}>✓</span>
                      <span>Exclusive 50% discount on your first professional protection assignment</span>
                    </li>
                  </ul>
                </div>
                
                {/* Inline Credentials */}
                <div className={styles.credentialsSection}>
                  <h4 className={styles.sectionHeading}>
                    <span>🏆</span>
                    <span>Our Credentials</span>
                  </h4>
                  <div className={styles.inlineCredentials}>
                    <div className={styles.credentialBadge}>🛡️ SIA Licensed</div>
                    <div className={styles.credentialBadge}>🔒 256-bit Encryption</div>
                    <div className={styles.credentialBadge}>✅ Government Approved</div>
                    <div className={styles.credentialBadge}>🚗 TfL Private Hire</div>
                    <div className={styles.credentialBadge}>👮 Close Protection</div>
                  </div>
                </div>
                
                <div className={styles.spacer}></div>
                
                {/* Time Estimate and Instructions */}
                <div className={styles.instructionsSection}>
                  <div className={styles.timeAndInstructions}>
                    <div className={styles.timeIndicator}>
                      <span className={styles.timeIcon}>⏱️</span>
                      <span>Complete in {Math.max(2, Math.round((9 - step.id + 1) * 1.1))} minutes</span>
                    </div>
                    <div className={styles.spacer}></div>
                    <p className={styles.instructionText}>
                      Select the option that best matches your professional role below. This helps us understand the discretion and security protocols required for your transport.
                    </p>
                  </div>
                </div>
                
                
                {/* Condensed Privacy Statement */}
                <div className={styles.privacyFooter}>
                  <p className={styles.privacyText}>
                    <span>🔒</span>
                    All responses encrypted • Service matching only • Complete confidentiality
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <header className={styles.header}>
            <h1 className={styles.title}>{step.title}</h1>
            {step.subtitle && <p className={styles.subtitle}>{step.subtitle}</p>}
            
            {/* Unified Content Box for non-first steps */}
            {step.stepDescription && (
              <div className={styles.unifiedContentBox}>
                <section className={styles.stepExplanation}>
                  <h4>📋 How This Step Helps</h4>
                  <p>{step.stepDescription}</p>
                </section>
              </div>
            )}
          </header>
        )}

        <div className={styles.questionSection}>
          <h2 className={styles.question}>{step.question}</h2>
          {step.helpText && <p className={styles.helpText}>{step.helpText}</p>}
          
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

        {/* Custom Answer Option */}
        <CustomAnswer
          value={customAnswer}
          onChange={handleCustomAnswerChange}
          isSelected={isCustomSelected}
          onToggle={handleCustomAnswerToggle}
          disabled={false}
          stepId={step.id}
        />

        {/* Selection Feedback Box */}
        <SelectionFeedback
          feedback={selectionFeedback}
          isVisible={showFeedback}
          className={styles.selectionFeedback}
        />

        {/* Privacy & Security section - positioned at bottom inside content container */}
        <div className={`${styles.securityAssurance} ${styles.securityAssuranceFooter}`}>
          <h4>Your Privacy & Security</h4>
          <p>{step.processOverview?.securityAssurance || 'All responses are encrypted and used exclusively for service matching. Your privacy is our priority.'}</p>
        </div>

        {/* Bottom anchor for auto-scroll */}
        <div id="questionnaire-bottom" className={styles.bottomAnchor}></div>
      </div>

      {/* Standardized CTA Buttons for all steps */}
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
      />

      {/* Floating CTA with dynamic messaging */}
      <FloatingCTA 
        currentStep={step.id}
        totalSteps={9}
        onContinue={handleSubmit}
        isLoading={false}
        canProceed={canProceed()}
      />
        </div>
      </div>
    </div>
  );
}