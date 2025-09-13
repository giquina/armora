// Dynamic personalization utilities for Armora questionnaire

export interface PersonalizationContext {
  userName?: string;
  professionalProfile?: string;
  currentStep: number;
  totalSteps: number;
}

/**
 * Generate dynamic progress messages based on user context
 */
export const getDynamicProgressMessage = (context: PersonalizationContext): string => {
  const { userName, professionalProfile, currentStep, totalSteps } = context;
  const remaining = totalSteps - currentStep;
  const userPrefix = userName ? `${userName}, ` : '';
  
  const profileMessages: Record<string, string> = {
    'executive': `${userPrefix}building your personalized executive security profile`,
    'entrepreneur': `${userPrefix}building your personalized entrepreneur security profile`,
    'celebrity': `${userPrefix}building your personalized VIP discretion profile`,
    'athlete': `${userPrefix}building your personalized athlete protection profile`,
    'government': `${userPrefix}building your personalized government security profile`,
    'diplomat': `${userPrefix}building your personalized diplomatic protection profile`,
    'medical': `${userPrefix}building your personalized medical professional security profile`,
    'legal': `${userPrefix}building your personalized legal professional security profile`,
    'creative': `${userPrefix}building your personalized creative professional security profile`,
    'academic': `${userPrefix}building your personalized academic security profile`,
    'student': `${userPrefix}building your personalized student security profile`,
    'international_visitor': `${userPrefix}building your personalized international visitor security profile`,
    'other': `${userPrefix}building your personalized security profile`
  };
  
  const message = profileMessages[professionalProfile || 'other'] || profileMessages.other;
  
  if (remaining === 0) {
    return `${message}... completing protection setup`;
  } else if (remaining === 1) {
    return `${message}... 1 step to complete protection`;
  } else {
    return `${message}... ${remaining} steps to complete protection`;
  }
};

/**
 * Generate dynamic back button text with step names
 */
export const getDynamicBackText = (currentStep: number): string => {
  // Step 1 should never have a back button - return empty string
  if (currentStep <= 1) {
    return '';
  }

  // Enforce one-word CTA label
  return 'Back';
};

/**
 * Generate simple, clean CTA button text for better UX
 * Simplified to reduce cognitive load and create premium feel
 */
export const getDynamicCTAText = (currentStep: number, hasSelection: boolean, userName?: string): string => {
  // Final step gets specific completion text
  if (currentStep === 9) {
    return "Complete Assessment";
  }
  
  // All other steps use simple "Continue" for cleaner UX
  return "Continue";
};

/**
 * Generate dynamic examples based on professional profile
 */
export const getDynamicExamples = (professionalProfile: string, baseExamples: string): string => {
  const profileExamples: Record<string, (base: string) => string> = {
    'executive': (base) => base.replace('Including', 'Including board meetings, executive presentations, corporate events, client dinners'),
    'entrepreneur': (base) => base.replace('Including', 'Including investor meetings, startup events, networking functions, pitch presentations'),
    'celebrity': (base) => base.replace('Including', 'Including premieres, award ceremonies, media appearances, private events'),
    'athlete': (base) => base.replace('Including', 'Including training sessions, competitions, sponsorship events, team activities'),
    'government': (base) => base.replace('Including', 'Including official duties, government meetings, public events, administrative responsibilities'),
    'diplomat': (base) => base.replace('Including', 'Including diplomatic meetings, embassy functions, international events, official protocols'),
    'medical': (base) => base.replace('Including', 'Including hospital rounds, medical conferences, patient consultations, urgent calls'),
    'legal': (base) => base.replace('Including', 'Including court appearances, client meetings, tribunal hearings, chambers visits'),
    'creative': (base) => base.replace('Including', 'Including studio sessions, premieres, creative meetings, performances, exhibitions'),
    'academic': (base) => base.replace('Including', 'Including conferences, university travel, academic events, research activities'),
    'student': (base) => base.replace('Including', 'Including campus events, internships, late-night study sessions, academic activities'),
    'international_visitor': (base) => base.replace('Including', 'Including sightseeing tours, business visits, cultural events, tourism activities')
  };
  
  const transform = profileExamples[professionalProfile];
  return transform ? transform(baseExamples) : baseExamples;
};

/**
 * Generate personalized validation messages
 */
export const getPersonalizedValidation = (userName: string, messageType: 'required' | 'success' | 'saving' | 'error'): string => {
  const namePrefix = userName ? `${userName}, ` : '';
  
  const messages: Record<string, string> = {
    required: `${namePrefix}please select an option to continue`,
    success: `${namePrefix}excellent choice! This helps us provide better service`,
    saving: `${namePrefix}we're saving your progress...`,
    error: `${namePrefix}please check your selection and try again`
  };
  
  return messages[messageType];
};

/**
 * Generate dynamic question text based on context
 */
export const getDynamicQuestionText = (
  baseQuestion: string, 
  userName?: string, 
  professionalProfile?: string,
  stepId?: number
): string => {
  if (!userName && !professionalProfile) {
    return baseQuestion;
  }

  const profileLabels: Record<string, string> = {
    'executive': 'Executive/C-Suite professional',
    'entrepreneur': 'Entrepreneur/Business Owner',
    'celebrity': 'Public Figure/Celebrity',
    'athlete': 'Professional Athlete',
    'government': 'Government Official',
    'diplomat': 'Diplomat/International Representative',
    'medical': 'Medical Professional',
    'legal': 'Legal Professional',
    'creative': 'Creative/Entertainment Professional',
    'academic': 'Academic/Educational Professional',
    'student': 'Student/Academic Learner',
    'international_visitor': 'International Visitor/Tourist',
    'prefer_not_to_say': 'valued client'
  };

  const profileQuestionMods: Record<string, Record<number, (base: string, name?: string) => string>> = {
    'executive': {
      2: (base, name) => name ? `${name}, as an Executive, how frequently do you anticipate using our security transport services?` : "As an Executive, how frequently do you anticipate using our security transport services?",
      3: (base, name) => name ? `${name}, as a senior executive, which security features are most important for your transport needs?` : "As a senior executive, which security features are most important for your transport needs?",
      4: (base, name) => name ? `${name}, what are your primary business locations for executive transport?` : "What are your primary business locations for executive transport?",
      5: (base, name) => name ? `${name}, are there any additional areas where you conduct executive business?` : "Are there any additional areas where you conduct executive business?",
      6: (base, name) => name ? `${name}, who should we contact for executive-level priority coordination?` : "Who should we contact for executive-level priority coordination?",
      7: (base, name) => name ? `${name}, do you have any special requirements for executive transport?` : "Do you have any special requirements for executive transport?",
      8: (base, name) => name ? `${name}, what's your preferred communication method for executive transport coordination?` : "What's your preferred communication method for executive transport coordination?"
    },
    'medical': {
      2: (base, name) => name ? `${name}, as a Medical Professional, how frequently do you need secure transport for medical duties?` : "As a Medical Professional, how frequently do you need secure transport for medical duties?",
      3: (base, name) => name ? `${name}, which security features are most important for medical professional transport?` : "Which security features are most important for medical professional transport?",
      4: (base, name) => name ? `${name}, what are your primary medical practice locations requiring transport?` : "What are your primary medical practice locations requiring transport?",
      5: (base, name) => name ? `${name}, are there additional medical facilities you visit regularly?` : "Are there additional medical facilities you visit regularly?",
      6: (base, name) => name ? `${name}, who should we contact for medical priority coordination?` : "Who should we contact for medical priority coordination?",
      7: (base, name) => name ? `${name}, do you have special medical transport requirements?` : "Do you have special medical transport requirements?",
      8: (base, name) => name ? `${name}, how should we communicate with you regarding medical transport?` : "How should we communicate with you regarding medical transport?"
    },
    'legal': {
      2: (base, name) => name ? `${name}, as a Legal Professional, how often do you require secure transport for legal matters?` : "As a Legal Professional, how often do you require secure transport for legal matters?",
      3: (base, name) => name ? `${name}, which security features are most important for legal professional transport?` : "Which security features are most important for legal professional transport?",
      4: (base, name) => name ? `${name}, what are your primary legal practice locations?` : "What are your primary legal practice locations?",
      5: (base, name) => name ? `${name}, are there additional courts or legal venues you visit?` : "Are there additional courts or legal venues you visit?",
      6: (base, name) => name ? `${name}, who should we contact for legal priority situations?` : "Who should we contact for legal priority situations?",
      7: (base, name) => name ? `${name}, do you have special requirements for legal transport?` : "Do you have special requirements for legal transport?",
      8: (base, name) => name ? `${name}, what's your preferred communication method for legal transport?` : "What's your preferred communication method for legal transport?"
    },
    'celebrity': {
      2: (base, name) => name ? `${name}, as a Public Figure, how frequently do you need discrete security transport?` : "As a Public Figure, how frequently do you need discrete security transport?",
      3: (base, name) => name ? `${name}, which privacy and security features are most important for your transport?` : "Which privacy and security features are most important for your transport?",
      4: (base, name) => name ? `${name}, what are your primary locations for secure transport needs?` : "What are your primary locations for secure transport needs?",
      5: (base, name) => name ? `${name}, are there additional venues or events you attend regularly?` : "Are there additional venues or events you attend regularly?",
      6: (base, name) => name ? `${name}, who should handle priority coordination for your security team?` : "Who should handle priority coordination for your security team?",
      7: (base, name) => name ? `${name}, do you have special privacy or security requirements?` : "Do you have special privacy or security requirements?",
      8: (base, name) => name ? `${name}, how should we coordinate with your team regarding transport?` : "How should we coordinate with your team regarding transport?"
    },
    'entrepreneur': {
      2: (base, name) => name ? `${name}, as an Entrepreneur, how frequently do you need transport for business activities?` : "As an Entrepreneur, how frequently do you need transport for business activities?",
      3: (base, name) => name ? `${name}, which features are most important for your entrepreneurial transport needs?` : "Which features are most important for your entrepreneurial transport needs?",
      4: (base, name) => name ? `${name}, what are your primary business locations and networking venues?` : "What are your primary business locations and networking venues?",
      5: (base, name) => name ? `${name}, are there additional business or investor locations you visit?` : "Are there additional business or investor locations you visit?",
      6: (base, name) => name ? `${name}, who should we contact for business priority coordination?` : "Who should we contact for business priority coordination?",
      7: (base, name) => name ? `${name}, do you have special requirements for business transport?` : "Do you have special requirements for business transport?",
      8: (base, name) => name ? `${name}, what's your preferred method for business transport communication?` : "What's your preferred method for business transport communication?"
    },
    'international_visitor': {
      2: (base, name) => name ? `${name}, as an International Visitor, how frequently will you need transport during your stay?` : "As an International Visitor, how frequently will you need transport during your stay?",
      3: (base, name) => name ? `${name}, which features are most important for international visitor transport?` : "Which features are most important for international visitor transport?",
      4: (base, name) => name ? `${name}, what are your primary destinations and accommodation locations?` : "What are your primary destinations and accommodation locations?",
      5: (base, name) => name ? `${name}, are there additional tourist attractions or business venues you'll visit?` : "Are there additional tourist attractions or business venues you'll visit?",
      6: (base, name) => name ? `${name}, who should we contact for international visitor priority coordination?` : "Who should we contact for international visitor priority coordination?",
      7: (base, name) => name ? `${name}, do you have special requirements as an international visitor?` : "Do you have special requirements as an international visitor?",
      8: (base, name) => name ? `${name}, how should we communicate with you during your visit?` : "How should we communicate with you during your visit?"
    }
  };

  // Use provided step ID or attempt to detect from question text
  const stepNumber = stepId || (() => {
    if (baseQuestion.includes('Which security features')) return 3;
    if (baseQuestion.includes('Select your primary locations')) return 4;
    if (baseQuestion.includes('additional areas')) return 5;
    if (baseQuestion.includes('priority')) return 6;
    if (baseQuestion.includes('special requirements')) return 7;
    if (baseQuestion.includes('communication method')) return 8;
    return 2; // Default for frequency questions
  })();

  const profileMods = profileQuestionMods[professionalProfile || ''];
  if (profileMods && profileMods[stepNumber]) {
    return profileMods[stepNumber](baseQuestion, userName);
  }

  // Fallback for profiles without specific customizations
  const profileLabel = profileLabels[professionalProfile || 'prefer_not_to_say'] || 'valued client';
  const userPrefix = userName ? `${userName}, ` : '';
  
  if (professionalProfile && professionalProfile !== 'prefer_not_to_say') {
    return `${userPrefix}as a ${profileLabel}, ${baseQuestion.toLowerCase()}`;
  }
  
  // Default: just add name if available
  return userName ? `${userPrefix}${baseQuestion.toLowerCase()}` : baseQuestion;
};

/**
 * Generate dynamic step descriptions based on context
 */
export const getDynamicStepDescription = (
  baseDescription: string,
  userName?: string,
  professionalProfile?: string
): string => {
  if (!userName && !professionalProfile) {
    return baseDescription;
  }

  const userPrefix = userName ? `${userName}, ` : '';
  const profileContext: Record<string, string> = {
    'executive': 'as a senior executive',
    'entrepreneur': 'as an entrepreneur', 
    'celebrity': 'as a public figure',
    'athlete': 'as a professional athlete',
    'government': 'as a government official',
    'diplomat': 'as a diplomatic representative',
    'medical': 'as a medical professional',
    'legal': 'as a legal professional',
    'creative': 'as a creative professional',
    'academic': 'as an academic professional',
    'student': 'as a student',
    'international_visitor': 'as an international visitor'
  };

  const context = profileContext[professionalProfile || ''];
  if (context) {
    return `${userPrefix}${baseDescription.toLowerCase()} ${context}`;
  }

  return userName ? `${userPrefix}${baseDescription.toLowerCase()}` : baseDescription;
};