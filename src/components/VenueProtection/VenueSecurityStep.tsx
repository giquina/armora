import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { VenueSecurityStepData } from '../../types/venue';
import styles from '../Questionnaire/QuestionnaireStep.module.css'; // Reuse existing styles

interface VenueSecurityStepProps {
  step: VenueSecurityStepData;
  currentValue?: string | string[] | number;
  onComplete: (stepId: number, value: string | string[] | number) => void;
  onPrevious?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function VenueSecurityStep({
  step,
  currentValue,
  onComplete,
  onPrevious,
  isFirstStep,
  isLastStep
}: VenueSecurityStepProps) {
  const [selectedValue, setSelectedValue] = useState<string | string[] | number>(() => {
    if (currentValue !== undefined) {
      return currentValue;
    }
    if (step.type === 'checkbox') {
      return [];
    }
    if (step.type === 'slider') {
      return step.sliderProps?.defaultValue || 50;
    }
    return '';
  });

  const [showError, setShowError] = useState(false);

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    setShowError(false);
  };

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const currentSelections = Array.isArray(selectedValue) ? selectedValue : [];

    let newSelections: string[];
    if (checked) {
      newSelections = [...currentSelections, optionValue];
    } else {
      newSelections = currentSelections.filter(v => v !== optionValue);
    }

    setSelectedValue(newSelections);
    setShowError(false);
  };

  const handleSliderChange = (value: number) => {
    setSelectedValue(value);
    setShowError(false);
  };

  const handleTextChange = (value: string) => {
    setSelectedValue(value);
    setShowError(false);
  };

  const validateAndProceed = () => {
    // Validation logic
    if (step.validation?.required) {
      if (step.type === 'radio' || step.type === 'text') {
        if (!selectedValue || (typeof selectedValue === 'string' && selectedValue.trim() === '')) {
          setShowError(true);
          return;
        }
      }

      if (step.type === 'checkbox') {
        const selections = Array.isArray(selectedValue) ? selectedValue : [];
        const minSelections = step.validation.minSelections || 1;
        if (selections.length < minSelections) {
          setShowError(true);
          return;
        }
      }
    }

    onComplete(step.id, selectedValue);
  };

  const renderOptions = () => {
    if (!step.options) return null;

    if (step.type === 'radio') {
      return (
        <div className={styles.radioGroup}>
          {step.options.map((option) => (
            <div key={option.id} className={styles.radioOption}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`step-${step.id}`}
                  value={option.value}
                  checked={selectedValue === option.value}
                  onChange={() => handleRadioChange(option.value)}
                  className={styles.radioInput}
                />
                <div className={styles.radioCustom}>
                  <div className={styles.radioIndicator}></div>
                  <div className={styles.radioContent}>
                    <div className={styles.radioTitle}>
                      {option.label}
                    </div>
                    {option.description && (
                      <div className={styles.radioDescription}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      );
    }

    if (step.type === 'checkbox') {
      const selections = Array.isArray(selectedValue) ? selectedValue : [];

      return (
        <div className={styles.checkboxGroup}>
          {step.options.map((option) => (
            <div key={option.id} className={styles.checkboxOption}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selections.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  className={styles.checkboxInput}
                />
                <div className={styles.checkboxCustom}>
                  <div className={styles.checkboxIndicator}></div>
                  <div className={styles.checkboxContent}>
                    <div className={styles.checkboxTitle}>
                      {option.label}
                    </div>
                    {option.description && (
                      <div className={styles.checkboxDescription}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderSlider = () => {
    if (step.type !== 'slider' || !step.sliderProps) return null;

    const { min, max, step: sliderStep, unit } = step.sliderProps;
    const numericValue = typeof selectedValue === 'number' ? selectedValue : step.sliderProps.defaultValue || 50;

    return (
      <div className={styles.sliderContainer}>
        <div className={styles.sliderValue}>
          {numericValue}{unit && ` ${unit}`}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={sliderStep || 1}
          value={numericValue}
          onChange={(e) => handleSliderChange(parseInt(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.sliderLabels}>
          <span>{min}{unit && ` ${unit}`}</span>
          <span>{max}{unit && `+ ${unit}`}</span>
        </div>
      </div>
    );
  };

  const renderTextInput = () => {
    if (step.type !== 'text') return null;

    return (
      <div className={styles.textInputContainer}>
        <textarea
          value={typeof selectedValue === 'string' ? selectedValue : ''}
          onChange={(e) => handleTextChange(e.target.value)}
          className={styles.textInput}
          placeholder={step.placeholder || "Enter your requirements..."}
          rows={4}
        />
      </div>
    );
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <div className={styles.stepMeta}>
          <span className={styles.stepNumber}>Step {step.id}</span>
          <span className={styles.stepCategory}>{step.title}</span>
        </div>
        <h2 className={styles.stepTitle}>{step.question}</h2>
        {step.subtitle && (
          <p className={styles.stepSubtitle}>{step.subtitle}</p>
        )}
      </div>

      <div className={styles.stepContent}>
        {renderOptions()}
        {renderSlider()}
        {renderTextInput()}

        {step.helpText && (
          <div className={styles.helpText}>
            <p>{step.helpText}</p>
          </div>
        )}

        {showError && step.validation?.errorMessage && (
          <div className={styles.errorMessage}>
            {step.validation.errorMessage}
          </div>
        )}
      </div>

      <div className={styles.stepActions}>
        {onPrevious && (
          <Button
            variant="secondary"
            onClick={onPrevious}
            className={styles.backButton}
          >
            Previous
          </Button>
        )}

        <Button
          variant="primary"
          onClick={validateAndProceed}
          className={styles.nextButton}
        >
          {isLastStep ? 'Request Quote' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}