import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { VenueSecurityStep } from './VenueSecurityStep';
import { ProgressIndicator } from '../Questionnaire/ProgressIndicator';
import { venueSecuritySteps } from '../../data/venueSecurityData';
import { VenueSecurityData } from '../../types/venue';
import styles from '../Questionnaire/QuestionnaireFlow.module.css'; // Reuse existing styles

interface VenueSecurityQuestionnaireProps {
  onComplete?: () => void;
}

export function VenueSecurityQuestionnaire({ onComplete }: VenueSecurityQuestionnaireProps) {
  const { navigateToView } = useApp();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState<VenueSecurityData>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = venueSecuritySteps.length;
  const currentStepData = venueSecuritySteps.find(step => step.id === currentStep);

  // Handle step completion and navigation
  const handleStepComplete = (stepId: number, value: string | string[] | number) => {
    const stepKey = `step${stepId}` as keyof VenueSecurityData;

    const updatedResponses = {
      ...responses,
      [stepKey]: value
    };

    setResponses(updatedResponses);

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
    }
  };

  const completeQuestionnaire = async (finalResponses: VenueSecurityData) => {
    setIsSubmitting(true);

    try {
      // Calculate recommendations based on responses
      const quote = calculateVenueQuote(finalResponses);

      // Create venue security assessment
      const venueAssessment = {
        ...finalResponses,
        completedAt: new Date(),
        quote,
        referenceNumber: generateReferenceNumber()
      };

      // Store assessment data
      localStorage.setItem('armora_venue_assessment', JSON.stringify(venueAssessment));

      // Set completion state
      setIsComplete(true);

      // Navigate to success screen
      navigateToView('venue-protection-success');

      // Call completion callback
      if (onComplete) {
        onComplete();
      }

    } catch (error) {
      console.error('Error completing venue security questionnaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Handle browser refresh - restore progress
  useEffect(() => {
    const savedProgress = localStorage.getItem('armora_venue_questionnaire_progress');
    if (savedProgress) {
      try {
        const { step, responses: savedResponses } = JSON.parse(savedProgress);
        if (step && savedResponses) {
          setCurrentStep(step);
          setResponses(savedResponses);
        }
      } catch (error) {
        console.error('Failed to restore venue questionnaire progress:', error);
      }
    }
  }, []);

  // Save progress on step change
  useEffect(() => {
    if (!isComplete && currentStep > 1) {
      localStorage.setItem('armora_venue_questionnaire_progress', JSON.stringify({
        step: currentStep,
        responses
      }));
    }
  }, [currentStep, responses, isComplete]);

  // Clear progress on completion
  useEffect(() => {
    if (isComplete) {
      localStorage.removeItem('armora_venue_questionnaire_progress');
    }
  }, [isComplete]);

  // Show loading while submitting
  if (isSubmitting) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <h2>Analyzing Your Venue Security Requirements...</h2>
          <p>Creating customized protection plan and quote</p>
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
        <VenueSecurityStep
          step={currentStepData}
          currentValue={getCurrentStepValue()}
          onComplete={handleStepComplete}
          onPrevious={currentStep > 1 ? handlePrevious : undefined}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === totalSteps}
        />
      )}
    </div>
  );

  // Helper functions
  function getCurrentStepValue(): string | string[] | number | undefined {
    const stepKey = `step${currentStep}` as keyof VenueSecurityData;
    const value = responses[stepKey];
    // Filter out non-step values (Date, VenueQuote, etc.)
    if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
      return value;
    }
    return undefined;
  }
}

// Utility functions
function calculateVenueQuote(responses: VenueSecurityData): any {
  const attendance = (typeof responses.step3 === 'number' ? responses.step3 : 100);
  const serviceLevel = (typeof responses.step7 === 'string' ? responses.step7 : 'standard');
  const officerCount = (typeof responses.step8 === 'number' ? responses.step8 : Math.max(Math.ceil(attendance / 75), 2));
  const duration = (typeof responses.step2 === 'string' ? responses.step2 : 'single-day');

  const dailyRates = {
    standard: 550,
    executive: 750,
    elite: 950
  };

  const days = duration === 'single-day' ? 1 :
               duration === '2-days' ? 2 :
               duration === 'weekend' ? 2 :
               duration === 'week' ? 7 : 1;

  const basePrice = officerCount * days * (dailyRates[serviceLevel as keyof typeof dailyRates] || dailyRates.standard);

  return {
    officers: officerCount,
    days,
    serviceLevel,
    dailyRate: dailyRates[serviceLevel as keyof typeof dailyRates] || dailyRates.standard,
    basePrice,
    totalEstimate: basePrice,
    breakdown: {
      officers: officerCount,
      dailyRate: dailyRates[serviceLevel as keyof typeof dailyRates] || dailyRates.standard,
      duration: days,
      subtotal: basePrice
    }
  };
}

function generateReferenceNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VP-${timestamp}-${random}`;
}