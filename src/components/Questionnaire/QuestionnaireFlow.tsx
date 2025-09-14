import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { QuestionnaireStep as QuestionnaireStepComponent } from './QuestionnaireStep';
import { ProgressIndicator } from './ProgressIndicator';
import { QuestionnaireComplete } from './QuestionnaireComplete';
import { getQuestionsForUserType, getServiceRecommendation } from '../../data/questionnaireData';
import { QuestionnaireData, PersonalizationData, QuestionnaireAnswer } from '../../types';
import styles from './QuestionnaireFlow.module.css';

interface QuestionnaireFlowProps {
  onComplete?: () => void;
}

export function QuestionnaireFlow({ onComplete }: QuestionnaireFlowProps) {
  const { state, updateQuestionnaireData, navigateToView } = useApp();
  const { user, questionnaireData } = state;

  // Check if user has already completed questionnaire
  const hasCompleted = questionnaireData?.completedAt;

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState<QuestionnaireData>(() => {
    // Initialize with existing data if available
    if (questionnaireData) {
      const {
        completedAt,
        recommendedService,
        conversionAttempts,
        ...existingResponses
      } = questionnaireData;
      return existingResponses;
    }
    return {};
  });
  const [isComplete, setIsComplete] = useState(hasCompleted || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConversionPrompt, setShowConversionPrompt] = useState(false);

  // Get steps for current user type
  const filteredSteps = getQuestionsForUserType(user?.userType || 'guest');

  const totalSteps = filteredSteps.length;
  const currentStepData = filteredSteps.find(step => step.id === currentStep);

  // Handle step completion and navigation
  const handleStepComplete = (stepId: number, value: QuestionnaireAnswer) => {
    const stepKey = `step${stepId}_${currentStepData?.type === 'radio' ? 
      getSingleValueKey(stepId) : 
      getMultiValueKey(stepId)}` as keyof QuestionnaireData;

    const updatedResponses = {
      ...responses,
      [stepKey]: value
    };

    setResponses(updatedResponses);

    // Check if this step has a conversion prompt for guest users
    if (currentStepData?.showConversionPrompt && user?.userType === 'guest') {
      setShowConversionPrompt(true);
      return;
    }

    // Move to next step or complete
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeQuestionnaire(updatedResponses);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowConversionPrompt(false);
    }
  };

  const handleConversionPromptClose = (shouldConvert: boolean) => {
    setShowConversionPrompt(false);
    
    if (shouldConvert) {
      // Navigate to signup with return path
      navigateToView('signup');
      return;
    }

    // Continue with next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeQuestionnaire(responses);
    }
  };

  const completeQuestionnaire = async (finalResponses: QuestionnaireData) => {
    setIsSubmitting(true);

    try {
      // Generate service recommendation
      const recommendedService = getServiceRecommendation(finalResponses);

      // Create personalization data
      const personalizationData: PersonalizationData = {
        ...finalResponses,
        completedAt: new Date(),
        recommendedService,
        conversionAttempts: questionnaireData?.conversionAttempts || 0
      };

      // Update app state
      updateQuestionnaireData(personalizationData);

      // Mark user as having completed questionnaire if authenticated
      if (user && user.userType !== 'guest') {
        // In a real app, this would make an API call to update user profile
        console.log('Marking user as completed questionnaire');
      }

      // Set completion state
      setIsComplete(true);

      // Navigate directly to achievement screen for immediate celebration
      navigateToView('achievement');

      // Call completion callback
      if (onComplete) {
        onComplete();
      }

    } catch (error) {
      console.error('Error completing questionnaire:', error);
      // Handle error - maybe show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setResponses({});
    setIsComplete(false);
    setShowConversionPrompt(false);
  };

  // Handle browser refresh - restore progress
  useEffect(() => {
    const savedProgress = localStorage.getItem('armora_questionnaire_progress');
    if (savedProgress && !hasCompleted) {
      try {
        const { step, responses: savedResponses } = JSON.parse(savedProgress);
        if (step && savedResponses) {
          setCurrentStep(step);
          setResponses(savedResponses);
        }
      } catch (error) {
        console.error('Failed to restore questionnaire progress:', error);
      }
    }
  }, [hasCompleted]);

  // Save progress on step change
  useEffect(() => {
    if (!isComplete && currentStep > 1) {
      localStorage.setItem('armora_questionnaire_progress', JSON.stringify({
        step: currentStep,
        responses
      }));
    }
  }, [currentStep, responses, isComplete]);

  // Clear progress on completion
  useEffect(() => {
    if (isComplete) {
      localStorage.removeItem('armora_questionnaire_progress');
    }
  }, [isComplete]);

  // Show completion screen only if user had previously completed (e.g., coming back to retake)
  // Fresh completions now navigate directly to achievement screen
  if (hasCompleted && !isComplete) {
    return (
      <QuestionnaireComplete 
        onRestart={handleRestart}
        onContinue={() => navigateToView('achievement')}
      />
    );
  }

  // Show loading while submitting
  if (isSubmitting) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <h2>Analyzing Your Security Profile...</h2>
          <p>Creating personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ProgressIndicator 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={currentStep > 1 ? handlePrevious : undefined}
      />
      
      {currentStepData && (
        <QuestionnaireStepComponent
          step={currentStepData}
          currentValue={getCurrentStepValue()}
          onComplete={handleStepComplete}
          onPrevious={currentStep > 1 ? handlePrevious : undefined}
          showConversionPrompt={showConversionPrompt}
          onConversionPromptResponse={handleConversionPromptClose}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === totalSteps}
        />
      )}
    </div>
  );

  // Helper functions
  function getCurrentStepValue(): string | string[] | undefined {
    if (!currentStepData) return undefined;
    
    const stepKey = `step${currentStep}_${currentStepData.type === 'radio' ? 
      getSingleValueKey(currentStep) : 
      getMultiValueKey(currentStep)}` as keyof QuestionnaireData;

    return responses[stepKey] as string | string[] | undefined;
  }

  function getSingleValueKey(stepId: number): string {
    const keyMap: Record<number, string> = {
      1: 'transportProfile',
      2: 'travelFrequency',
      9: 'profileReview'
    };
    return keyMap[stepId] || 'value';
  }

  function getMultiValueKey(stepId: number): string {
    const keyMap: Record<number, string> = {
      3: 'serviceRequirements',
      4: 'primaryCoverage',
      5: 'secondaryCoverage',
      7: 'specialRequirements'
    };
    return keyMap[stepId] || 'values';
  }
}