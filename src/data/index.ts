// Armora Security Transport - Data Exports
// Central export file for all application data and configurations

// Re-export questionnaire data and utilities
export {
  questionnaireSteps,
  getQuestionsForUserType,
  getTotalStepsForUserType,
  shouldShowConversionPrompt,
  getConversionPromptForStep,
  calculateProgress,
  validateStepData
} from './questionnaireData';

// Future service data exports will go here
// export { serviceData } from './servicesData';