// Minimal questionnaire data for basic app functionality
import { QuestionnaireStep } from '../types';

// Simple type for dynamic content
interface DynamicQuestionContent {
  title: string;
  subtitle: string;
  question: string;
  helpText: string;
  options: Array<{
    id: string;
    label: string;
    value: string;
    description: string;
  }>;
}

// Minimal questionnaire data to get app working
export const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: 1,
    title: "Professional Profile",
    subtitle: "Help us understand your security requirements",
    question: "What best describes your professional role?",
    type: "radio",
    options: [
      {
        id: "business",
        label: "Business Executive",
        value: "business",
        description: "Corporate leadership and management roles"
      },
      {
        id: "public",
        label: "Public Figure", 
        value: "public",
        description: "Celebrity, influencer, or media personality"
      },
      {
        id: "government",
        label: "Government Official",
        value: "government", 
        description: "Political or government leadership roles"
      },
      {
        id: "other",
        label: "Other",
        value: "other",
        description: "Professional requiring security transport"
      }
    ],
    validation: { required: true, errorMessage: "Please select your professional profile" },
    helpText: "This helps us understand your specific security requirements."
  }
];

// Simple functions to satisfy imports
export const getDynamicQuestionContent = (stepId: number, userResponses: Record<string, any>) => ({
  title: "Security Assessment",
  subtitle: "Understanding your needs",
  question: "What are your transport requirements?",
  helpText: "This helps us provide appropriate service recommendations.",
  options: [
    {
      id: "standard",
      label: "Standard Security",
      value: "standard",
      description: "Basic professional security transport"
    }
  ],
  similarClients: [
    {
      type: "Business Executive",
      needs: "Secure transport to corporate meetings",
      service: "Armora Executive - Professional security driver with corporate discretion"
    },
    {
      type: "Public Figure",
      needs: "Discreet transport with enhanced protection",
      service: "Armora Shadow - Independent security with privacy protocols"
    }
  ]
});

export const getRealtimeRecommendations = (responses: Record<string, any>) => ({
  recommendations: ["Armora Standard recommended for your profile"],
  reasoning: "Based on your responses, standard security transport meets your needs.",
  completionPercentage: Math.floor((Object.keys(responses).length / 9) * 100),
  serviceRecommendation: "armora-standard",
  recommendedService: "Armora Standard",
  estimatedCost: "£45",
  confidenceScore: 85,
  securityLevel: "Standard Security Transport",
  matchingDrivers: 12,
  securityFeatures: ["Professional security driver", "Secure vehicle", "Real-time tracking", "Emergency support"],
  upcomingAvailability: "Available now in your area"
});

export const getQuestionsForUserType = (userType: string) => questionnaireSteps;
export const getTotalStepsForUserType = (userType: string) => 1;
export const shouldShowConversionPrompt = (step: number) => false;
export const getConversionPromptForStep = (step: number) => null;
export const calculateProgress = (currentStep: number, totalSteps: number) => (currentStep / totalSteps) * 100;
export const validateStepData = (stepId: number, value: any) => ({ isValid: true });
export const getServiceRecommendation = (responses: Record<string, any>) => "armora-standard";

export const serviceData = {
  "armora-standard": {
    id: "armora-standard",
    name: "Armora Standard",
    description: "Professional security transport service",
    features: ["Professional driver", "Secure vehicle", "Basic protection protocols"],
    price: "£45/hour"
  }
};

export default questionnaireSteps;