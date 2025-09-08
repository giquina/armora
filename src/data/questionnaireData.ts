// Armora Security Transport - Questionnaire Data Structure
// Complete 9-step personalization flow with different content for registered vs guest users

import { QuestionnaireStep, UserType, QuestionnaireOption, ValidationRule, ConversionPrompt } from '../types';

// Conversion prompts for guest users throughout the questionnaire
const guestConversionPrompts: Record<string, ConversionPrompt> = {
  step3: {
    title: "Unlock Premium Security Features",
    description: "Register to access advanced security preferences and priority booking capabilities.",
    actionText: "Create Account",
    benefits: [
      "Advanced security officer selection",
      "Vehicle preference customization", 
      "Priority booking access",
      "50% off first ride reward"
    ]
  },
  step6: {
    title: "Enhanced Security Protocols",
    description: "Registered users get emergency contact integration and 24/7 security monitoring.",
    actionText: "Sign Up for Full Protection",
    benefits: [
      "Emergency contact alerts",
      "Real-time security monitoring",
      "Incident response protocols",
      "Direct security officer communication"
    ]
  },
  step8: {
    title: "Complete Your Security Profile",
    description: "Register to save preferences and unlock exclusive member benefits.",
    actionText: "Complete Registration",
    benefits: [
      "Profile persistence across sessions",
      "Personalized service recommendations",
      "Member-only promotions",
      "Priority customer support"
    ]
  }
};

// Step 1: Transport Profile - Professional categories
const step1Options: QuestionnaireOption[] = [
  {
    id: "exec",
    label: "Executive/C-Suite",
    value: "executive",
    description: "Senior executive requiring discrete professional transport",
    icon: "briefcase"
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur/Business Owner",
    value: "entrepreneur", 
    description: "Independent business professional with flexible schedule",
    icon: "startup"
  },
  {
    id: "celebrity",
    label: "Public Figure/Celebrity", 
    value: "celebrity",
    description: "High-profile individual requiring privacy protection",
    icon: "star"
  },
  {
    id: "athlete",
    label: "Professional Athlete",
    value: "athlete",
    description: "Sports professional with event-based travel needs",
    icon: "trophy"
  },
  {
    id: "diplomatic",
    label: "Diplomatic/Government",
    value: "diplomatic",
    description: "Official requiring protocol-compliant transport",
    icon: "shield"
  },
  {
    id: "corporate",
    label: "Corporate Professional",
    value: "corporate",
    description: "Business professional with regular transport needs",
    icon: "building"
  },
  {
    id: "personal",
    label: "Personal/Family Use",
    value: "personal",
    description: "Individual or family requiring secure transport",
    icon: "family"
  },
  {
    id: "other",
    label: "Other",
    value: "other",
    description: "Unique professional circumstances",
    icon: "user"
  }
];

// Step 2: Travel Frequency - Usage patterns
const step2Options: QuestionnaireOption[] = [
  {
    id: "daily",
    label: "Daily",
    value: "daily",
    description: "Regular commute or daily transport needs"
  },
  {
    id: "weekly",
    label: "Weekly",
    value: "weekly", 
    description: "Several times per week for business"
  },
  {
    id: "monthly",
    label: "Monthly",
    value: "monthly",
    description: "Occasional business or personal transport"
  },
  {
    id: "events",
    label: "Event-Based",
    value: "events",
    description: "Specific occasions, conferences, or meetings"
  },
  {
    id: "travel",
    label: "Travel Days", 
    value: "travel",
    description: "Airport transfers and travel-related transport"
  },
  {
    id: "emergency",
    label: "Emergency/On-Demand",
    value: "emergency",
    description: "Unpredictable, security-focused situations"
  }
];

// Step 3: Service Requirements - Security/vehicle preferences  
const step3RegisteredOptions: QuestionnaireOption[] = [
  {
    id: "armed_security",
    label: "Armed Security Officer",
    value: "armed_security",
    description: "Close protection with licensed armed professional"
  },
  {
    id: "unarmed_security", 
    label: "Unarmed Security Officer",
    value: "unarmed_security",
    description: "Professional security without weapons"
  },
  {
    id: "luxury_vehicle",
    label: "Luxury Vehicle Required",
    value: "luxury_vehicle", 
    description: "Premium vehicle fleet (Mercedes S-Class, BMW 7-Series)"
  },
  {
    id: "armored_vehicle",
    label: "Armored Vehicle",
    value: "armored_vehicle",
    description: "Ballistic protection and reinforced security"
  },
  {
    id: "surveillance_detection",
    label: "Surveillance Detection",
    value: "surveillance_detection",
    description: "Counter-surveillance and route security"
  },
  {
    id: "multi_vehicle",
    label: "Multi-Vehicle Convoy", 
    value: "multi_vehicle",
    description: "Multiple vehicle security formation"
  },
  {
    id: "discrete_service",
    label: "Discrete/Low Profile",
    value: "discrete_service",
    description: "Unmarked vehicles, civilian appearance"
  },
  {
    id: "child_safety",
    label: "Child Safety Seating",
    value: "child_safety",
    description: "Family transport with security protocols"
  }
];

const step3GuestOptions: QuestionnaireOption[] = [
  {
    id: "security_level",
    label: "Security Level Preference",
    value: "security_level",
    description: "Basic security requirements assessment"
  },
  {
    id: "vehicle_type",
    label: "Vehicle Type",
    value: "vehicle_type", 
    description: "General vehicle preferences"
  },
  {
    id: "service_style",
    label: "Service Style",
    value: "service_style",
    description: "Professional or discrete approach"
  }
];

// Step 4: Primary Coverage Areas - Geographic preferences
const step4Options: QuestionnaireOption[] = [
  {
    id: "central_london",
    label: "Central London",
    value: "central_london",
    description: "City, West End, Canary Wharf"
  },
  {
    id: "greater_london",
    label: "Greater London", 
    value: "greater_london",
    description: "All London boroughs and surrounds"
  },
  {
    id: "manchester",
    label: "Manchester",
    value: "manchester",
    description: "Manchester city center and surrounding areas"
  },
  {
    id: "birmingham",
    label: "Birmingham",
    value: "birmingham", 
    description: "Birmingham metropolitan area"
  },
  {
    id: "leeds",
    label: "Leeds",
    value: "leeds",
    description: "Leeds and West Yorkshire region"
  },
  {
    id: "glasgow",
    label: "Glasgow", 
    value: "glasgow",
    description: "Glasgow and central Scotland"
  },
  {
    id: "edinburgh",
    label: "Edinburgh",
    value: "edinburgh",
    description: "Edinburgh and surrounding areas"
  },
  {
    id: "bristol",
    label: "Bristol",
    value: "bristol",
    description: "Bristol and South West England"
  }
];

// Step 5: Secondary Coverage - Airports, events, international
const step5Options: QuestionnaireOption[] = [
  {
    id: "heathrow",
    label: "Heathrow Airport",
    value: "heathrow", 
    description: "Regular airport transfers and international travel"
  },
  {
    id: "gatwick",
    label: "Gatwick Airport",
    value: "gatwick",
    description: "South London airport transport"
  },
  {
    id: "stansted",
    label: "Stansted Airport",
    value: "stansted",
    description: "Essex airport connections"
  },
  {
    id: "luton",
    label: "Luton Airport",
    value: "luton",
    description: "North London airport access"
  },
  {
    id: "private_jets",
    label: "Private Aviation",
    value: "private_jets",
    description: "Farnborough, Biggin Hill, other private airfields"
  },
  {
    id: "events_venues",
    label: "Event Venues", 
    value: "events_venues",
    description: "Conference centers, hotels, entertainment venues"
  },
  {
    id: "international",
    label: "International Travel",
    value: "international",
    description: "European cities and global destinations"
  },
  {
    id: "government",
    label: "Government Buildings",
    value: "government",
    description: "Whitehall, embassies, official locations"
  }
];

// Step 7: Special Requirements - Accessibility, accommodations
const step7Options: QuestionnaireOption[] = [
  {
    id: "wheelchair_access",
    label: "Wheelchair Accessibility", 
    value: "wheelchair_access",
    description: "Vehicles equipped for wheelchair users"
  },
  {
    id: "mobility_assistance",
    label: "Mobility Assistance",
    value: "mobility_assistance",
    description: "Support for limited mobility passengers"
  },
  {
    id: "medical_equipment",
    label: "Medical Equipment Transport",
    value: "medical_equipment", 
    description: "Accommodation for medical devices"
  },
  {
    id: "pet_transport",
    label: "Pet Transport",
    value: "pet_transport",
    description: "Secure transport for pets and service animals"
  },
  {
    id: "dietary_restrictions",
    label: "Dietary Accommodations",
    value: "dietary_restrictions",
    description: "Special dietary needs for extended journeys"
  },
  {
    id: "language_support",
    label: "Language Support",
    value: "language_support", 
    description: "Multi-language security officer capabilities"
  },
  {
    id: "privacy_screens",
    label: "Privacy Partitions",
    value: "privacy_screens",
    description: "Additional privacy from security officer"
  },
  {
    id: "none",
    label: "No Special Requirements",
    value: "none",
    description: "Standard service requirements"
  }
];

// Step 8: Contact Information - Communication preferences  
const step8NotificationOptions: QuestionnaireOption[] = [
  {
    id: "booking_confirmations",
    label: "Booking Confirmations",
    value: "booking_confirmations",
    description: "Service booking and modification alerts"
  },
  {
    id: "security_updates", 
    label: "Security Updates",
    value: "security_updates",
    description: "Real-time security status and route changes"
  },
  {
    id: "promotional_offers",
    label: "Promotional Offers",
    value: "promotional_offers", 
    description: "Exclusive member discounts and upgrades"
  },
  {
    id: "service_reminders",
    label: "Service Reminders",
    value: "service_reminders",
    description: "Upcoming booking and schedule notifications"
  },
  {
    id: "security_briefings",
    label: "Security Briefings",
    value: "security_briefings",
    description: "Area security updates and threat assessments"
  }
];

// Questionnaire step definitions with user-type specific variations
export const questionnaireSteps: Record<Exclude<UserType, null>, QuestionnaireStep[]> = {
  registered: [
    // Step 1: Transport Profile
    {
      id: 1,
      title: "Professional Profile",
      subtitle: "Help us understand your professional transport needs",
      question: "What best describes your professional profile?",
      type: "radio",
      options: step1Options,
      validation: { required: true, errorMessage: "Please select your professional profile" },
      helpText: "This helps us recommend the most appropriate security level and service style for your professional requirements."
    },

    // Step 2: Travel Frequency  
    {
      id: 2,
      title: "Travel Frequency",
      subtitle: "Understanding your usage patterns helps optimize our service",
      question: "How frequently do you anticipate using Armora services?",
      type: "radio", 
      options: step2Options,
      validation: { required: true, errorMessage: "Please select your travel frequency" },
      helpText: "Frequent users can benefit from priority scheduling and customized routing."
    },

    // Step 3: Service Requirements
    {
      id: 3,
      title: "Security Requirements", 
      subtitle: "Customize your security and vehicle preferences",
      question: "Which security features are important for your transport needs?", 
      type: "checkbox",
      options: step3RegisteredOptions,
      validation: { 
        required: true, 
        minSelections: 1, 
        maxSelections: 4,
        errorMessage: "Please select 1-4 security requirements" 
      },
      helpText: "Multiple selections help us match you with appropriately equipped officers and vehicles."
    },

    // Step 4: Primary Coverage Areas
    {
      id: 4,
      title: "Primary Coverage", 
      subtitle: "Your main geographic service areas",
      question: "Which areas will you primarily need transport services?",
      type: "checkbox",
      options: step4Options,
      validation: { 
        required: true, 
        minSelections: 1,
        maxSelections: 3, 
        errorMessage: "Please select 1-3 primary coverage areas" 
      },
      helpText: "Selecting fewer areas helps us optimize officer availability in your preferred locations."
    },

    // Step 5: Secondary Coverage
    {
      id: 5,
      title: "Extended Coverage",
      subtitle: "Additional locations and specialized transport needs", 
      question: "Do you need coverage for any of these specialized locations?",
      type: "checkbox",
      options: step5Options,
      validation: { required: false },
      helpText: "These selections help us prepare for your extended travel and event requirements."
    },

    // Step 6: Emergency Contact  
    {
      id: 6,
      title: "Emergency Contact",
      subtitle: "Professional best practice for enhanced service delivery",
      question: "Please provide emergency contact details (following industry best practices):",
      type: "input",
      placeholder: "Emergency contact name",
      validation: { 
        required: true, 
        minLength: 2,
        errorMessage: "Emergency contact name is required for security protocols" 
      },
      helpText: "This information is encrypted and only accessed during security incidents or emergencies."
    },

    // Step 7: Special Requirements
    {
      id: 7, 
      title: "Special Requirements",
      subtitle: "Accessibility and accommodation needs",
      question: "Do you have any special requirements or accommodations needed?",
      type: "checkbox",
      options: step7Options,
      validation: { required: false },
      helpText: "We ensure all passengers receive appropriate accommodations for comfortable, secure transport."
    },

    // Step 8: Contact Information
    {
      id: 8,
      title: "Communication Preferences", 
      subtitle: "How would you like to receive service updates?",
      question: "Select your preferred notification types:",
      type: "checkbox", 
      options: step8NotificationOptions,
      validation: { 
        required: true,
        minSelections: 1, 
        errorMessage: "Please select at least one notification preference" 
      },
      helpText: "You can modify these preferences anytime in your account settings."
    },

    // Step 9: Review & Submit
    {
      id: 9,
      title: "Profile Complete",
      subtitle: "Review your security transport profile",
      question: "Please review your profile information and submit to unlock your personalized service recommendations:",
      type: "radio",
      options: [
        {
          id: "confirm",
          label: "Confirm and Complete Profile", 
          value: "confirm",
          description: "I confirm my profile information is accurate"
        }
      ],
      validation: { required: true, errorMessage: "Please confirm your profile to continue" },
      helpText: "You can update any of these preferences later in your account dashboard."
    }
  ],

  google: [
    // Google users get same experience as registered users but with simplified OAuth flow
    // Steps identical to registered user experience
    {
      id: 1,
      title: "Professional Profile",
      subtitle: "Help us understand your professional transport needs",
      question: "What best describes your professional profile?",
      type: "radio",
      options: step1Options,
      validation: { required: true, errorMessage: "Please select your professional profile" },
      helpText: "This helps us recommend the most appropriate security level and service style for your professional requirements."
    },
    {
      id: 2,
      title: "Travel Frequency",
      subtitle: "Understanding your usage patterns helps optimize our service",
      question: "How frequently do you anticipate using Armora services?",
      type: "radio", 
      options: step2Options,
      validation: { required: true, errorMessage: "Please select your travel frequency" },
      helpText: "Frequent users can benefit from priority scheduling and customized routing."
    },
    {
      id: 3,
      title: "Security Requirements", 
      subtitle: "Customize your security and vehicle preferences",
      question: "Which security features are important for your transport needs?", 
      type: "checkbox",
      options: step3RegisteredOptions,
      validation: { 
        required: true, 
        minSelections: 1, 
        maxSelections: 4,
        errorMessage: "Please select 1-4 security requirements" 
      },
      helpText: "Multiple selections help us match you with appropriately equipped officers and vehicles."
    },
    {
      id: 4,
      title: "Primary Coverage", 
      subtitle: "Your main geographic service areas",
      question: "Which areas will you primarily need transport services?",
      type: "checkbox",
      options: step4Options,
      validation: { 
        required: true, 
        minSelections: 1,
        maxSelections: 3, 
        errorMessage: "Please select 1-3 primary coverage areas" 
      },
      helpText: "Selecting fewer areas helps us optimize officer availability in your preferred locations."
    },
    {
      id: 5,
      title: "Extended Coverage",
      subtitle: "Additional locations and specialized transport needs", 
      question: "Do you need coverage for any of these specialized locations?",
      type: "checkbox",
      options: step5Options,
      validation: { required: false },
      helpText: "These selections help us prepare for your extended travel and event requirements."
    },
    {
      id: 6,
      title: "Emergency Contact",
      subtitle: "Professional best practice for enhanced service delivery",
      question: "Please provide emergency contact details (following industry best practices):",
      type: "input",
      placeholder: "Emergency contact name",
      validation: { 
        required: true, 
        minLength: 2,
        errorMessage: "Emergency contact name is required for security protocols" 
      },
      helpText: "This information is encrypted and only accessed during security incidents or emergencies."
    },
    {
      id: 7, 
      title: "Special Requirements",
      subtitle: "Accessibility and accommodation needs",
      question: "Do you have any special requirements or accommodations needed?",
      type: "checkbox",
      options: step7Options,
      validation: { required: false },
      helpText: "We ensure all passengers receive appropriate accommodations for comfortable, secure transport."
    },
    {
      id: 8,
      title: "Communication Preferences", 
      subtitle: "How would you like to receive service updates?",
      question: "Select your preferred notification types:",
      type: "checkbox", 
      options: step8NotificationOptions,
      validation: { 
        required: true,
        minSelections: 1, 
        errorMessage: "Please select at least one notification preference" 
      },
      helpText: "You can modify these preferences anytime in your account settings."
    },
    {
      id: 9,
      title: "Profile Complete",
      subtitle: "Review your security transport profile",
      question: "Please review your profile information and submit to unlock your personalized service recommendations:",
      type: "radio",
      options: [
        {
          id: "confirm",
          label: "Confirm and Complete Profile", 
          value: "confirm",
          description: "I confirm my profile information is accurate"
        }
      ],
      validation: { required: true, errorMessage: "Please confirm your profile to continue" },
      helpText: "You can update any of these preferences later in your account dashboard."
    }
  ],

  guest: [
    // Step 1: Transport Profile (Limited for guests)
    {
      id: 1,
      title: "Professional Profile",
      subtitle: "Help us understand your transport needs",
      question: "What best describes your professional profile?",
      type: "radio",
      options: step1Options.slice(0, 4), // Limited options for guests
      validation: { required: true, errorMessage: "Please select your professional profile" },
      helpText: "Guest users get basic service matching. Register for advanced professional customization."
    },

    // Step 2: Travel Frequency (Simplified)
    {
      id: 2,
      title: "Usage Pattern", 
      subtitle: "Understanding your transport frequency",
      question: "How often would you use premium security transport?",
      type: "radio",
      options: step2Options.slice(0, 4), // Simplified options
      validation: { required: true, errorMessage: "Please select your usage pattern" },
      helpText: "Registered users get priority scheduling and route optimization."
    },

    // Step 3: Basic Security Preferences (Limited + Conversion Prompt)
    {
      id: 3,
      title: "Security Preferences",
      subtitle: "Basic security transport requirements", 
      question: "What type of security transport do you prefer?",
      type: "radio", // Changed to single selection for guests
      options: step3GuestOptions,
      validation: { required: true, errorMessage: "Please select a security preference" },
      showConversionPrompt: guestConversionPrompts.step3,
      helpText: "Guest users have limited security customization options."
    },

    // Step 4: Coverage Area (Limited)
    {
      id: 4,
      title: "Service Area",
      subtitle: "Where do you need transport services?", 
      question: "Select your primary service area:",
      type: "radio", // Single selection for guests
      options: step4Options.slice(0, 4), // Limited to major cities
      validation: { required: true, errorMessage: "Please select a service area" },
      helpText: "Registered users can select multiple areas with optimized coverage."
    },

    // Step 5: Basic Secondary Services (Very Limited)
    {
      id: 5,
      title: "Airport Services",
      subtitle: "Do you need airport transport?",
      question: "Do you require airport transfer services?", 
      type: "radio",
      options: [
        {
          id: "airport_yes",
          label: "Yes, I need airport transfers",
          value: "airport_yes",
          description: "Occasional airport security transport"
        },
        {
          id: "airport_no", 
          label: "No airport services needed",
          value: "airport_no", 
          description: "City transport only"
        }
      ],
      validation: { required: true, errorMessage: "Please indicate airport service needs" },
      helpText: "Registered users get access to all airport and specialized venue services."
    },

    // Step 6: Skip Emergency Contact (Guest Limitation + Major Conversion Prompt)
    {
      id: 6,
      title: "Security Protocols", 
      subtitle: "Enhanced security features require registration",
      question: "Advanced security protocols including emergency contacts are available for registered users:",
      type: "radio",
      options: [
        {
          id: "guest_continue",
          label: "Continue as Guest",
          value: "guest_continue",
          description: "Basic service without emergency protocols"
        }
      ],
      validation: { required: true, errorMessage: "Please select to continue" },
      showConversionPrompt: guestConversionPrompts.step6,
      helpText: "Guest users have limited access to security protocol features."
    },

    // Step 7: Basic Special Requirements 
    {
      id: 7,
      title: "Basic Requirements",
      subtitle: "Any accessibility or special needs?",
      question: "Do you have basic accessibility requirements?",
      type: "checkbox",
      options: step7Options.slice(0, 3).concat(step7Options.slice(-1)), // Wheelchair, mobility, none
      validation: { required: false },
      helpText: "Full accommodation options available for registered users."
    },

    // Step 8: Limited Contact Preferences + Final Conversion Prompt
    {
      id: 8,
      title: "Basic Notifications",
      subtitle: "Simple notification preferences",
      question: "How would you like to receive basic service updates?",
      type: "radio", // Single selection for guests
      options: [
        {
          id: "email_basic",
          label: "Email Updates",
          value: "email_basic", 
          description: "Basic booking confirmations via email"
        },
        {
          id: "sms_basic",
          label: "SMS Updates", 
          value: "sms_basic",
          description: "Text message service updates"
        }
      ],
      validation: { required: true, errorMessage: "Please select a notification method" },
      showConversionPrompt: guestConversionPrompts.step8,
      helpText: "Guest users receive limited notifications compared to full members."
    },

    // Step 9: Guest Profile Complete (With Registration Encouragement)
    {
      id: 9,
      title: "Guest Profile Complete",
      subtitle: "Basic profile ready - upgrade available",
      question: "Your guest profile is ready. You can continue with basic service or register for full access:", 
      type: "radio",
      options: [
        {
          id: "continue_guest",
          label: "Continue as Guest",
          value: "continue_guest",
          description: "Access basic services with limited features"
        },
        {
          id: "upgrade_now",
          label: "Register for Full Access",
          value: "upgrade_now", 
          description: "Unlock all features + 50% off first ride"
        }
      ],
      validation: { required: true, errorMessage: "Please choose how to proceed" },
      helpText: "Guest users can access quotes and basic booking but cannot make direct reservations."
    }
  ]
};

// Export helper functions for questionnaire logic
export const getQuestionsForUserType = (userType: UserType): QuestionnaireStep[] => {
  if (!userType || userType === null) {
    return questionnaireSteps.guest;
  }
  return questionnaireSteps[userType] || questionnaireSteps.guest;
};

export const getTotalStepsForUserType = (userType: UserType): number => {
  return getQuestionsForUserType(userType).length;
};

export const shouldShowConversionPrompt = (stepId: number, userType: UserType): boolean => {
  if (userType !== 'guest') return false;
  const step = getQuestionsForUserType(userType).find(s => s.id === stepId);
  return !!step?.showConversionPrompt;
};

export const getConversionPromptForStep = (stepId: number, userType: UserType): ConversionPrompt | null => {
  if (userType !== 'guest') return null;
  const step = getQuestionsForUserType(userType).find(s => s.id === stepId);
  return step?.showConversionPrompt || null;
};

// Progress calculation helper
export const calculateProgress = (currentStep: number, userType: UserType): number => {
  const totalSteps = getTotalStepsForUserType(userType);
  return Math.round((currentStep / totalSteps) * 100);
};

// Validation helper
export const validateStepData = (stepId: number, data: any, userType: UserType): string[] => {
  const step = getQuestionsForUserType(userType).find(s => s.id === stepId);
  if (!step) return ['Invalid step'];

  const errors: string[] = [];
  const validation = step.validation;

  if (validation.required && (!data || (Array.isArray(data) && data.length === 0))) {
    errors.push(validation.errorMessage || 'This field is required');
  }

  if (validation.minSelections && Array.isArray(data) && data.length < validation.minSelections) {
    errors.push(`Please select at least ${validation.minSelections} option${validation.minSelections > 1 ? 's' : ''}`);
  }

  if (validation.maxSelections && Array.isArray(data) && data.length > validation.maxSelections) {
    errors.push(`Please select no more than ${validation.maxSelections} option${validation.maxSelections > 1 ? 's' : ''}`);
  }

  if (validation.minLength && typeof data === 'string' && data.length < validation.minLength) {
    errors.push(`Minimum length is ${validation.minLength} characters`);
  }

  if (validation.maxLength && typeof data === 'string' && data.length > validation.maxLength) {
    errors.push(`Maximum length is ${validation.maxLength} characters`);
  }

  if (validation.pattern && typeof data === 'string' && !validation.pattern.test(data)) {
    errors.push(validation.errorMessage || 'Invalid format');
  }

  return errors;
};

// Recommendation engine logic
export const getServiceRecommendation = (responses: Record<string, any>): string => {
  let score = {
    standard: 0,
    executive: 0,
    shadow: 0
  };

  // Transport profile scoring
  const transportProfile = responses.step1_transportProfile;
  if (transportProfile === 'high_profile_individual' || transportProfile === 'corporate_executive') {
    score.executive += 3;
  } else if (transportProfile === 'public_figure') {
    score.executive += 2;
    score.shadow += 1;
  } else if (transportProfile === 'private_individual') {
    score.shadow += 2;
    score.standard += 1;
  }

  // Frequency scoring
  const frequency = responses.step2_travelFrequency;
  if (frequency === 'daily' || frequency === 'weekly') {
    score.executive += 2;
    score.shadow += 1;
  } else if (frequency === 'special_events') {
    score.executive += 3;
  } else if (frequency === 'emergency') {
    score.shadow += 2;
    score.standard += 1;
  }

  // Service requirements scoring
  const serviceRequirements = responses.step3_serviceRequirements || [];
  if (serviceRequirements.includes('close_protection')) {
    score.executive += 3;
  }
  if (serviceRequirements.includes('discrete_protection')) {
    score.shadow += 2;
    score.executive += 1;
  }
  if (serviceRequirements.includes('basic_transport')) {
    score.standard += 2;
  }

  // Special requirements scoring
  const specialRequirements = responses.step7_specialRequirements || [];
  if (specialRequirements.includes('threat_level_high')) {
    score.executive += 3;
  }
  if (specialRequirements.includes('media_management')) {
    score.executive += 2;
    score.shadow += 1;
  }

  // Profile review (final preference)
  if (responses.step9_profileReview) {
    // This could indicate a preference, but for now we'll let the algorithm decide
  }

  // Return highest scoring service
  const maxScore = Math.max(score.standard, score.executive, score.shadow);
  if (score.shadow === maxScore) return 'shadow';
  if (score.executive === maxScore) return 'executive';
  return 'standard';
};

// Service data for recommendations
export const serviceData = {
  standard: {
    name: "Armora Standard",
    price: "£45/hour",
    description: "Professional security transport with certified protection officers",
    features: ["Professional Security Officer", "Secure Vehicle", "Route Planning", "Basic Communication"]
  },
  executive: {
    name: "Armora Executive", 
    price: "£75/hour",
    description: "Luxury security transport with premium protection services",
    features: ["Executive Protection Officer", "Luxury Vehicle", "Advanced Route Security", "Priority Response", "Concierge Services"]
  },
  shadow: {
    name: "Armora Shadow",
    price: "£65/hour", 
    description: "Independent security escort service - Our most popular choice",
    features: ["Discrete Protection", "Low-Profile Operations", "Flexible Protocols", "Real-Time Adaptation", "Most Popular (67% choose this)"]
  }
};