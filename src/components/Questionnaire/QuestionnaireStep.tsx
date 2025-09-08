import React, { useState, useEffect } from 'react';
import { QuestionnaireStep as IQuestionnaireStep, QuestionnaireOption } from '../../types';
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
}

export function QuestionnaireStep({
  step,
  currentValue,
  onComplete,
  onPrevious,
  showConversionPrompt,
  onConversionPromptResponse,
  isFirstStep,
  isLastStep
}: QuestionnaireStepProps) {
  // const { state } = useApp(); // Available for future features if needed
  // const { user } = state;

  // Local state for form values
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textValue, setTextValue] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);

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

  // Render options for radio/checkbox/select
  const renderOptions = () => {
    if (!step.options) return null;

    return step.options.map((option: QuestionnaireOption) => {
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
              </div>
              {option.description && (
                <p className={styles.optionDescription}>{option.description}</p>
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
        <header className={styles.header}>
          <h1 className={styles.title}>{step.title}</h1>
          {step.subtitle && <p className={styles.subtitle}>{step.subtitle}</p>}
        </header>

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
          {isLastStep ? 'Complete Assessment' : 'Next →'}
        </button>
      </div>
    </div>
  );
}