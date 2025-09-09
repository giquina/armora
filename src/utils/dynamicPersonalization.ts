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
    'executive': `${userPrefix}we're building your executive transport profile`,
    'entrepreneur': `${userPrefix}we understand entrepreneurs need flexible, reliable solutions`,
    'celebrity': `${userPrefix}we're ensuring maximum privacy and discretion for your profile`,
    'athlete': `${userPrefix}we're customizing our service for professional athletes`,
    'government': `${userPrefix}we're tailoring secure transport for government officials`,
    'diplomat': `${userPrefix}we're ensuring diplomatic protocol compliance`,
    'medical': `${userPrefix}we're customizing our service for medical professionals like yourself`,
    'legal': `${userPrefix}we're tailoring our recommendations for legal professionals`,
    'creative': `${userPrefix}we're adapting our service for creative professionals`,
    'academic': `${userPrefix}we're customizing transport for academic professionals`,
    'student': `${userPrefix}we're ensuring safe, reliable transport for students`,
    'international_visitor': `${userPrefix}we're providing specialized service for international visitors`,
    'other': `${userPrefix}we're customizing your security transport experience`
  };
  
  const message = profileMessages[professionalProfile || 'other'] || profileMessages.other;
  
  if (remaining === 0) {
    return `${message}... completing your profile`;
  } else if (remaining === 1) {
    return `${message}... 1 step remaining`;
  } else {
    return `${message}... ${remaining} steps remaining`;
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
    'medical': (base) => base.replace('Including', 'Including hospital rounds, medical conferences, patient consultations, emergency calls'),
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
  professionalProfile?: string
): string => {
  if (!userName && !professionalProfile) {
    return baseQuestion;
  }

  const profileQuestionMods: Record<string, (base: string, name?: string) => string> = {
    'medical': (base, name) => {
      const question = base.replace('security transport services', 'medical professional transport');
      return name ? `${name}, ${question.toLowerCase()}` : question;
    },
    'executive': (base, name) => {
      const question = base.replace('security transport services', 'executive transport');
      return name ? `${name}, what's your typical executive transport pattern?` : "What's your typical executive transport pattern?";
    },
    'legal': (base, name) => {
      const question = base.replace('security transport services', 'legal professional transport');
      return name ? `${name}, ${question.toLowerCase()}` : question;
    },
    'government': (base, name) => {
      const question = base.replace('security transport services', 'government official transport');
      return name ? `${name}, ${question.toLowerCase()}` : question;
    }
  };

  const transform = profileQuestionMods[professionalProfile || ''];
  if (transform) {
    return transform(baseQuestion, userName);
  }
  
  // Default: just add name if available
  return userName ? `${userName}, ${baseQuestion.toLowerCase()}` : baseQuestion;
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