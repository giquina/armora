// Selection feedback content for questionnaire steps
// Provides context and benefits for each option selection

export interface SelectionFeedback {
  title: string;
  description: string;
  benefits: string[];
  icon: string;
}

export interface StepFeedback {
  [optionValue: string]: SelectionFeedback;
}

export interface SelectionFeedbackData {
  [stepId: string]: StepFeedback;
}

export const selectionFeedbackData: SelectionFeedbackData = {
  step1: {
    'executive': {
      title: 'Executive Protection Selected',
      description: 'Perfect for C-suite executives requiring discretion and corporate protocol expertise.',
      benefits: [
        'Board meeting security protocols',
        'Corporate venue access expertise',
        'Executive assistant coordination',
        'Crisis management procedures'
      ],
      icon: '🏢'
    },
    'entrepreneur': {
      title: 'Entrepreneur Service Selected',
      description: 'Flexible protection for business owners with dynamic schedules and investor meetings.',
      benefits: [
        'Startup hub navigation (Shoreditch, Old St)',
        'Investor meeting coordination',
        'Flexible scheduling for rapid pivots',
        'Tech venue and co-working access'
      ],
      icon: '💼'
    },
    'celebrity': {
      title: 'Entertainment Professional Service',
      description: 'Specialized protection for media personalities requiring crowd management and discrete presence.',
      benefits: [
        'Paparazzi evasion techniques',
        'Stage door and venue protocols',
        'Fan interaction management',
        'Red carpet event coordination'
      ],
      icon: '🎭'
    },
    'athlete': {
      title: 'Athletic Professional Protection',
      description: 'Tailored for sports professionals with training schedules and competition logistics.',
      benefits: [
        'Training facility access knowledge',
        'Competition day coordination',
        'Sports medicine center routes',
        'Recovery period discretion'
      ],
      icon: '⚽'
    },
    'government': {
      title: 'Government Official Security',
      description: 'Enhanced vetting and protocols for civil servants and officials requiring security clearance awareness.',
      benefits: [
        'Westminster and Whitehall expertise',
        'Security clearance understanding',
        'Official protocol compliance',
        'Government building access'
      ],
      icon: '🏛️'
    },
    'diplomat': {
      title: 'Diplomatic Protection Service',
      description: 'International protocol expertise for delegation members and diplomatic personnel.',
      benefits: [
        'Embassy district navigation',
        'Diplomatic immunity awareness',
        'Multi-vehicle convoy coordination',
        'International protocol compliance'
      ],
      icon: '🌍'
    },
    'medical': {
      title: 'Healthcare Professional Service',
      description: 'Medical transport with understanding of on-call schedules and hospital protocols.',
      benefits: [
        'Hospital access and parking knowledge',
        'On-call schedule flexibility',
        'Medical equipment transport',
        'Priority response for emergencies'
      ],
      icon: '🏥'
    },
    'legal': {
      title: 'Legal Professional Protection',
      description: 'Court-focused service with understanding of legal schedules and client confidentiality.',
      benefits: [
        'All London court location knowledge',
        'Legal document security protocols',
        'Client confidentiality procedures',
        'Chambers and tribunal access'
      ],
      icon: '⚖️'
    },
    'creative': {
      title: 'Creative Professional Service',
      description: 'Flexible service for artists and designers with unconventional schedules and valuable works.',
      benefits: [
        'Studio and gallery venue knowledge',
        'Artwork transport capabilities',
        'Creative industry event familiarity',
        'Late session accommodation'
      ],
      icon: '🎨'
    },
    'academic': {
      title: 'Academic Professional Service',
      description: 'University-focused transport with understanding of academic schedules and research requirements.',
      benefits: [
        'London university campus navigation',
        'Academic calendar awareness',
        'Conference and research travel',
        'Late library session support'
      ],
      icon: '🎓'
    },
    'student': {
      title: 'Student Safety Service',
      description: 'Budget-conscious protection for university students with late study sessions and social safety needs.',
      benefits: [
        'Campus security coordination',
        'Late library Commencement Point service',
        'Student area coverage',
        'Budget-friendly pricing'
      ],
      icon: '📚'
    },
    'international_visitor': {
      title: 'International Visitor Service',
      description: 'Tourist-focused protection with local knowledge and cultural sensitivity for UK visitors.',
      benefits: [
        'Tourist secureDestination expertise',
        'Airport transfer coordination',
        'Embassy liaison capabilities',
        'Multi-lingual Protection Officer options'
      ],
      icon: '✈️'
    },
    'finance': {
      title: 'Financial Services Protection',
      description: 'City-focused service understanding market hours and trading floor protocols.',
      benefits: [
        'Square Mile and Canary Wharf expertise',
        'Pre-market hour availability',
        'Deal confidentiality procedures',
        'Trading floor access knowledge'
      ],
      icon: '📊'
    },
    'security': {
      title: 'Security Professional Service',
      description: 'Peer-level protection from fellow security professionals with operational understanding.',
      benefits: [
        'Professional courtesy protocols',
        'Operational security awareness',
        'Family protection services',
        'Off-duty transport coordination'
      ],
      icon: '🛡️'
    },
    'family': {
      title: 'Family Protection Service',
      description: 'Family-focused transport with child safety expertise and school run coordination.',
      benefits: [
        'Child safety protocols',
        'School run optimization',
        'Family activity coordination',
        'Multi-Principal accommodation'
      ],
      icon: '👨‍👩‍👧‍👦'
    },
    'general': {
      title: 'Premium Transport Service',
      description: 'Professional transport service customized to your specific requirements and preferences.',
      benefits: [
        'Personalized service approach',
        'Flexible scheduling options',
        'Complete London coverage',
        'Professional Protection Officer standards'
      ],
      icon: '🚗'
    },
    'high_profile': {
      title: 'VIP Protection Service',
      description: 'Elite protection for high-profile individuals requiring advanced security and media management.',
      benefits: [
        'Advanced threat assessment',
        'Media management protocols',
        'Discrete extraction procedures',
        'Celebrity-level security standards'
      ],
      icon: '🔒'
    }
  },

  step2: {
    'daily': {
      title: 'Daily Service Confirmed',
      description: 'Regular daily transport builds familiarity and enables predictive security planning.',
      benefits: [
        'Consistent security team assignment',
        'Route optimization and planning',
        'Predictive security measures',
        'Priority protection assignment guarantees'
      ],
      icon: '📅'
    },
    'weekly': {
      title: 'Weekly Service Selected',
      description: 'Regular weekly patterns allow for consistent team assignment and route planning.',
      benefits: [
        'Familiar Protection Officer team rotation',
        'Weekly schedule coordination',
        'Preferred route establishment',
        'Regular security assessment'
      ],
      icon: '📊'
    },
    'monthly': {
      title: 'Monthly Service Confirmed',
      description: 'Monthly requirements provide flexibility while maintaining service quality.',
      benefits: [
        'Flexible scheduling options',
        'Monthly planning coordination',
        'Priority protection assignment access',
        'Consistent service standards'
      ],
      icon: '📅'
    },
    'occasional': {
      title: 'On-Demand Service Selected',
      description: 'Flexible on-demand service for irregular transport needs with priority access.',
      benefits: [
        'No commitment required',
        'Same-day protection assignment available',
        'Flexible timing options',
        'Premium service when needed'
      ],
      icon: '⚡'
    }
  },

  step3: {
    'secure_transport': {
      title: 'Secure Transport Priority',
      description: 'Enhanced security protocols with trained officers and secure route planning.',
      benefits: [
        'SIA licensed security officers',
        'Threat assessment procedures',
        'Secure route planning',
        'Emergency response protocols'
      ],
      icon: '🔒'
    },
    'professional_service': {
      title: 'Professional Service Focus',
      description: 'Premium professional service with attention to business requirements and protocols.',
      benefits: [
        'Business protocol expertise',
        'Professional presentation standards',
        'Corporate venue knowledge',
        'Executive service training'
      ],
      icon: '💼'
    },
    'privacy_discretion': {
      title: 'Privacy & Discretion Priority',
      description: 'Maximum discretion with confidentiality protocols and low-profile operations.',
      benefits: [
        'Confidentiality agreements',
        'Discrete vehicle options',
        'Privacy protection measures',
        'Low-profile operations'
      ],
      icon: '🤐'
    },
    'convenience': {
      title: 'Convenience & Comfort Focus',
      description: 'Comfort-focused service with premium vehicles and convenience features.',
      benefits: [
        'Premium vehicle standards',
        'Comfort-focused amenities',
        'Convenient protection start points',
        'Flexible service options'
      ],
      icon: '⭐'
    }
  },

  step4: {
    'central_london': {
      title: 'Central London Coverage',
      description: 'Comprehensive coverage of central London business and cultural districts.',
      benefits: [
        'City and Westminster expertise',
        'Cultural venue knowledge',
        'Business district optimization',
        'Tourist secureDestination access'
      ],
      icon: '🏙️'
    },
    'canary_wharf': {
      title: 'Canary Wharf Expertise',
      description: 'Financial district specialization with trading floor and corporate venue knowledge.',
      benefits: [
        'Financial district navigation',
        'Corporate building access',
        'Trading hour understanding',
        'Banking venue protocols'
      ],
      icon: '🏢'
    },
    'heathrow_area': {
      title: 'Heathrow Corridor Coverage',
      description: 'Airport and western London coverage with international travel coordination.',
      benefits: [
        'Airport transfer expertise',
        'International arrival coordination',
        'West London venue knowledge',
        'Flight tracking services'
      ],
      icon: '✈️'
    },
    'north_london': {
      title: 'North London Coverage',
      description: 'Comprehensive north London coverage including residential and business areas.',
      benefits: [
        'Residential area expertise',
        'North London venue knowledge',
        'Community familiarity',
        'Local route optimization'
      ],
      icon: '🏠'
    },
    'south_london': {
      title: 'South London Coverage',
      description: 'South London specialization with knowledge of diverse communities and venues.',
      benefits: [
        'South London expertise',
        'Community venue knowledge',
        'Diverse area familiarity',
        'Cross-river coordination'
      ],
      icon: '🌉'
    },
    'greater_london': {
      title: 'Greater London Coverage',
      description: 'Complete Greater London coverage extending to outer boroughs and surrounding areas.',
      benefits: [
        'Complete London coverage',
        'Outer borough expertise',
        'Extended area knowledge',
        'Comprehensive service area'
      ],
      icon: '🗺️'
    }
  },

  step5: {
    'airports': {
      title: 'Airport Transfer Specialist',
      description: 'Enhanced airport services with flight tracking and international arrival coordination.',
      benefits: [
        'All London airport coverage',
        'Flight delay monitoring',
        'Meet & greet services',
        'International protocol support'
      ],
      icon: '🛫'
    },
    'hotels': {
      title: 'Hotel & Hospitality Focus',
      description: 'Premium hotel and hospitality venue expertise with concierge coordination.',
      benefits: [
        'Five-star hotel protocols',
        'Concierge coordination',
        'Guest service standards',
        'Hospitality venue knowledge'
      ],
      icon: '🏨'
    },
    'government_buildings': {
      title: 'Government Facility Access',
      description: 'Specialized government building access with security clearance understanding.',
      benefits: [
        'Government building protocols',
        'Security clearance awareness',
        'Official venue procedures',
        'Westminster area expertise'
      ],
      icon: '🏛️'
    },
    'entertainment_venues': {
      title: 'Entertainment Venue Specialist',
      description: 'Entertainment and cultural venue expertise with event coordination capabilities.',
      benefits: [
        'West End and venue knowledge',
        'Event coordination experience',
        'Cultural venue protocols',
        'Entertainment industry familiarity'
      ],
      icon: '🎭'
    },
    'private_residences': {
      title: 'Private Residence Service',
      description: 'Discrete private residence service with residential area expertise.',
      benefits: [
        'Residential area knowledge',
        'Privacy protection measures',
        'Neighborhood familiarity',
        'Discrete service protocols'
      ],
      icon: '🏠'
    }
  },

  step6: {
    'family_member': {
      title: 'Family Emergency Contact',
      description: 'Family member designated as primary contact for rapid response coordination.',
      benefits: [
        'Immediate family notification',
        'Emergency response protocols',
        'Family-friendly procedures',
        'Priority contact system'
      ],
      icon: '👨‍👩‍👧‍👦'
    },
    'personal_assistant': {
      title: 'Assistant Coordination',
      description: 'Personal assistant integration for seamless schedule and logistics management.',
      benefits: [
        'Schedule coordination',
        'Logistics management',
        'Professional integration',
        'Administrative efficiency'
      ],
      icon: '📋'
    },
    'security_team': {
      title: 'Security Team Integration',
      description: 'Integration with existing security team for comprehensive protection coordination.',
      benefits: [
        'Security team coordination',
        'Threat assessment sharing',
        'Comprehensive protection',
        'Professional integration'
      ],
      icon: '🛡️'
    },
    'workplace': {
      title: 'Workplace Coordination',
      description: 'Workplace security and management integration for business continuity.',
      benefits: [
        'Workplace integration',
        'Business continuity',
        'Corporate coordination',
        'Professional protocols'
      ],
      icon: '🏢'
    }
  },

  step7: {
    'mobility_assistance': {
      title: 'Mobility Support Services',
      description: 'Specialized mobility assistance with accessible vehicles and trained support staff.',
      benefits: [
        'Wheelchair accessible vehicles',
        'Mobility assistance training',
        'Accessible venue knowledge',
        'Dignified support services'
      ],
      icon: '♿'
    },
    'medical_support': {
      title: 'Medical Assistance Ready',
      description: 'Medical support capabilities with trained staff and emergency response procedures.',
      benefits: [
        'First aid trained Protection Officers',
        'Medical equipment transport',
        'Hospital coordination',
        'Emergency response procedures'
      ],
      icon: '🏥'
    },
    'language_interpretation': {
      title: 'Language Support Services',
      description: 'Multi-lingual Protection Officers and interpretation services for international clients.',
      benefits: [
        'Multi-lingual Protection Officer options',
        'Cultural sensitivity training',
        'International protocol understanding',
        'Communication assistance'
      ],
      icon: '🌍'
    },
    'child_safety': {
      title: 'Child Safety Specialist',
      description: 'Child safety protocols with appropriate safety equipment and family-trained Protection Officers.',
      benefits: [
        'Child safety seat provision',
        'Family-friendly Protection Officers',
        'Child protection protocols',
        'School coordination services'
      ],
      icon: '👶'
    },
    'privacy_requirements': {
      title: 'Enhanced Privacy Measures',
      description: 'Maximum privacy protection with confidentiality agreements and discrete operations.',
      benefits: [
        'Enhanced confidentiality protocols',
        'Privacy protection measures',
        'Discrete service delivery',
        'Confidentiality agreements'
      ],
      icon: '🔐'
    }
  },

  step8: {
    'mobile_app': {
      title: 'Mobile App Communications',
      description: 'Real-time mobile app coordination with live tracking and instant messaging.',
      benefits: [
        'Real-time vehicle tracking',
        'Instant messaging capability',
        'Push notification updates',
        'Digital coordination tools'
      ],
      icon: '📱'
    },
    'phone_calls': {
      title: 'Direct Phone Coordination',
      description: 'Traditional phone-based coordination with dedicated contact lines.',
      benefits: [
        'Direct phone access',
        'Personal coordinator assignment',
        'Voice communication priority',
        '24/7 phone support'
      ],
      icon: '📞'
    },
    'email_updates': {
      title: 'Email Communication System',
      description: 'Email-based coordination with detailed updates and confirmation systems.',
      benefits: [
        'Detailed email confirmations',
        'Written communication records',
        'Schedule update notifications',
        'Professional correspondence'
      ],
      icon: '📧'
    },
    'assistant_coordination': {
      title: 'Assistant Integration',
      description: 'Full integration with personal or executive assistants for seamless coordination.',
      benefits: [
        'Assistant access privileges',
        'Schedule synchronization',
        'Third-party coordination',
        'Professional integration'
      ],
      icon: '💼'
    }
  },

  step9: {
    'profile_reviewed': {
      title: 'Security Profile Complete',
      description: 'Your comprehensive security profile has been created and optimized for your specific needs.',
      benefits: [
        'Personalized protection plan',
        'Optimized service matching',
        'Professional recommendation ready',
        'Enhanced security protocols'
      ],
      icon: '✅'
    }
  }
};

// Generic feedback for custom answers or fallbacks
export const genericFeedback: SelectionFeedback = {
  title: 'Custom Selection Recorded',
  description: 'Your specific requirements have been noted and will be incorporated into your personalized service plan.',
  benefits: [
    'Customized service approach',
    'Flexible accommodation',
    'Personalized attention',
    'Specific needs addressed'
  ],
  icon: '📝'
};

// Get feedback for a specific step and option
export function getSelectionFeedback(stepId: number, optionValue: string): SelectionFeedback {
  const stepKey = `step${stepId}`;
  const stepData = selectionFeedbackData[stepKey];

  if (stepData && stepData[optionValue]) {
    return stepData[optionValue];
  }

  // Return generic feedback for unknown selections
  return genericFeedback;
}

// Get combined feedback for multiple selections (checkboxes)
export function getCombinedFeedback(stepId: number, optionValues: string[]): SelectionFeedback {
  if (optionValues.length === 0) {
    return genericFeedback;
  }

  if (optionValues.length === 1) {
    return getSelectionFeedback(stepId, optionValues[0]);
  }

  // For multiple selections, combine benefits
  const feedbacks = optionValues.map(value => getSelectionFeedback(stepId, value));
  const allBenefits = feedbacks.flatMap(f => f.benefits);
  const uniqueBenefits = Array.from(new Set(allBenefits));

  return {
    title: 'Multiple Services Selected',
    description: 'Your combined selections will provide comprehensive coverage for all your specified requirements.',
    benefits: uniqueBenefits.slice(0, 4), // Limit to 4 benefits
    icon: '🎯'
  };
}