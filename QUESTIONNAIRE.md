# QUESTIONNAIRE.md
## Armora Security Assessment Questionnaire Guide

**Version:** 3.0.0
**Last Updated:** September 2025
**Status:** SIA-COMPLIANT
**Purpose:** Documentation for the 9-step security assessment questionnaire completed during user registration

---

## 📋 QUESTIONNAIRE OVERVIEW

### Purpose
9-step professional security assessment completed during signup that:
- Matches users with appropriate protection levels (Essential/Executive/Shadow)
- Provides 50% first assignment discount for registered users
- Personalizes protection services based on security requirements
- Builds security profile for service recommendations

### User Registration Flow
```
Welcome → Auth (Sign Up) → Security Assessment Questionnaire (9 steps) → Achievement → Dashboard
```

### Technical Structure (Questionnaire Components Only)
```
src/components/Questionnaire/
├── QuestionnaireFlow.tsx       # Main questionnaire orchestrator
├── QuestionnaireStep.tsx       # Individual step renderer
├── QuestionnaireComplete.tsx   # Completion/achievement screen
├── ProgressIndicator.tsx       # Step progress tracking
├── SelectionFeedback.tsx       # Real-time feedback on selections
├── CustomAnswer.tsx            # Custom answer input option
├── NameCollection.tsx          # Name personalization step
├── CTAButtons.tsx              # Navigation buttons (Next/Back)
└── ProfileSummary.tsx          # Final profile review (Step 9)

src/data/
└── questionnaireData.ts        # All questionnaire questions and options
```

---

## 📝 COMPLETE 9-STEP QUESTIONS (SIA-COMPLIANT)

### STEP 1: PROFESSIONAL SECURITY PROFILE

**Question:** "Which professional category best describes your protection requirements?"

**Type:** Radio selection
**Required:** Yes
**Validation:** Must select one

**Options with Descriptions:**

```typescript
{
  value: "executive",
  label: "Executive 🏢",
  description: "Senior position holders requiring protection services matching their status"
},
{
  value: "entrepreneur",
  label: "Entrepreneur 💼",
  description: "Business owners requiring flexible protection arrangements"
},
{
  value: "celebrity",
  label: "Celebrity 🎭",
  description: "Entertainment professionals requiring discrete security services"
},
{
  value: "athlete",
  label: "Athlete ⚽",
  description: "Sports professionals requiring protection for training and events"
},
{
  value: "government",
  label: "Government Official 🏛️",
  description: "Officials requiring protocol-compliant security services"
},
{
  value: "diplomat",
  label: "Diplomat 🌍",
  description: "International representatives requiring cultural-aware protection"
},
{
  value: "medical",
  label: "Healthcare Professional 🏥",
  description: "Medical professionals requiring protection between facilities"
},
{
  value: "legal",
  label: "Legal Professional ⚖️",
  description: "Legal professionals requiring confidential protection services"
},
{
  value: "finance",
  label: "Finance Professional 📊",
  description: "Finance professionals requiring secure movement during market hours"
},
{
  value: "technology",
  label: "Technology Professional 💻",
  description: "Tech professionals requiring flexible protection arrangements"
},
{
  value: "academic",
  label: "Academic 🎓",
  description: "Academics requiring campus and conference protection"
},
{
  value: "creative",
  label: "Creative Professional 🎨",
  description: "Artists requiring protection for studios and venues"
},
{
  value: "consultant",
  label: "Consultant/Freelancer 💼",
  description: "Independent professionals with variable protection needs"
},
{
  value: "student",
  label: "Student 📚",
  description: "Students requiring affordable security options"
},
{
  value: "international_visitor",
  label: "International Visitor ✈️",
  description: "Visitors requiring temporary protection services in the UK"
},
{
  value: "family",
  label: "Family Protection 👨‍👩‍👧‍👦",
  description: "Families requiring comprehensive security coverage"
},
{
  value: "high_profile",
  label: "High Profile Individual 🔒",
  description: "Maximum security with enhanced discretion protocols"
},
{
  value: "prefer_not_to_say",
  label: "Prefer not to say ❓",
  description: "Privacy-focused protection assessment"
}
```

---

### STEP 2: PROTECTION FREQUENCY

**Question:** "How often do you require professional protection services?"

**Type:** Radio selection
**Required:** Yes
**Validation:** Must select one

**Options:**

```typescript
{
  value: "daily",
  label: "Daily Protection 📅",
  description: "5 or more days per week"
},
{
  value: "regular",
  label: "Regular Protection 🗓️",
  description: "3-4 days per week"
},
{
  value: "weekly",
  label: "Weekly Protection 📆",
  description: "1-2 days per week"
},
{
  value: "fortnightly",
  label: "Fortnightly Protection",
  description: "Every two weeks"
},
{
  value: "monthly",
  label: "Monthly Protection",
  description: "Once or twice monthly"
},
{
  value: "project_based",
  label: "Project-Based 🎯",
  description: "Intensive protection during specific periods"
},
{
  value: "special_events",
  label: "Special Events 🎪",
  description: "Occasional important events requiring security"
},
{
  value: "business_only",
  label: "Business Protection 💼",
  description: "Corporate events and meetings only"
},
{
  value: "airport_protection",
  label: "Airport Protection ✈️",
  description: "Airport security services only"
},
{
  value: "evening_events",
  label: "Evening Events 🌙",
  description: "Night-time protection services"
},
{
  value: "adhoc",
  label: "Ad-hoc Protection ❓",
  description: "Unpredictable security requirements"
},
{
  value: "prefer_not_to_say",
  label: "Prefer not to say",
  description: "Privacy option"
}
```

---

### STEP 3: SECURITY REQUIREMENTS

**Question:** "Which security features are essential for your protection?"

**Type:** Checkbox
**Required:** 1-5 selections
**Validation:** Min 1, Max 5

**Options:**

```typescript
{
  value: "privacy_discretion",
  label: "Privacy & Discretion 🔒",
  description: "Maximum confidentiality protocols"
},
{
  value: "enhanced_security",
  label: "Enhanced Security Awareness 🛡️",
  description: "Threat assessment and proactive protection"
},
{
  value: "premium_vehicles",
  label: "Premium Protection Vehicles 🚗",
  description: "Executive-class secure vehicles"
},
{
  value: "professional_presentation",
  label: "Professional Presentation 👤",
  description: "Corporate-appropriate protection officers"
},
{
  value: "reliability_tracking",
  label: "Reliability & Tracking ⏰",
  description: "Real-time protection monitoring"
},
{
  value: "24_7_availability",
  label: "24/7 Protection Available 🕐",
  description: "Round-the-clock security services"
},
{
  value: "female_officers",
  label: "Female Protection Officers 👩",
  description: "Gender preference accommodation"
},
{
  value: "multi_principal",
  label: "Multiple Principal Coverage 👥",
  description: "Family or group protection"
},
{
  value: "communication_skills",
  label: "Communication Protocols 💬",
  description: "Professional security liaison"
},
{
  value: "route_planning",
  label: "Security Route Planning 🗺️",
  description: "Strategic movement and threat avoidance"
},
{
  value: "live_tracking",
  label: "Live Protection Tracking 📱",
  description: "Digital security visibility"
},
{
  value: "advanced_training",
  label: "Advanced Officer Training 🎖️",
  description: "Specialized security qualifications"
},
{
  value: "corporate_billing",
  label: "Corporate Security Billing 💳",
  description: "Business account and invoicing"
},
{
  value: "nationwide_coverage",
  label: "Multi-city Protection Network 🌍",
  description: "Consistent security across UK"
}
```

---

### STEP 4: PROTECTION COVERAGE AREAS

**Question:** "Where do you require regular protection coverage?"

**Type:** Checkbox
**Required:** 1-8 selections
**Validation:** Min 1, Max 8

**Current Options (as implemented in questionnaireData.ts):**

```typescript
{
  value: "central_london",
  label: "📍 Do you primarily travel within Greater London?",
  description: "Is London your main base? From the City to Canary Wharf, Mayfair to Shoreditch, we know every street and shortcut."
},
{
  value: "financial_district",
  label: "🏭 Do you regularly need protection in Manchester?",
  description: "Are you part of the Northern Powerhouse? From MediaCity to the business district, we provide security coverage across Greater Manchester."
},
// ... (other options as defined in current implementation)
```

**Note:** The current implementation uses different option structure than this specification. See `questionnaireData.ts` for exact current options.

---

### STEP 5: SPECIALIZED SECURITY VENUES

**Question:** "Do you require protection services at these specialized venues?"

**Type:** Checkbox
**Required:** Optional
**Validation:** Max 9

**Options:**

```typescript
{
  value: "international_airports",
  label: "International Airports ✈️",
  description: "Enhanced airport security protocols"
},
{
  value: "private_aviation",
  label: "Private Aviation 🛩️",
  description: "Private jet and helipad security"
},
{
  value: "maritime",
  label: "Maritime/Ports ⚓",
  description: "Seaport and marina protection"
},
{
  value: "government_buildings",
  label: "Government Buildings ⚖️",
  description: "Official building security protocols"
},
{
  value: "corporate_hq",
  label: "Corporate Headquarters 🏢",
  description: "Business campus protection"
},
{
  value: "hotels_resorts",
  label: "Hotels & Resorts 🏨",
  description: "Hospitality venue security"
},
{
  value: "entertainment_venues",
  label: "Entertainment Venues 🎭",
  description: "Theaters, stadiums, arenas"
},
{
  value: "medical_facilities",
  label: "Medical Facilities 🏥",
  description: "Hospital and clinic security"
},
{
  value: "educational",
  label: "Educational Institutions 🎓",
  description: "University and school protection"
}
```

---

### STEP 6: SECURITY COORDINATION

**Question:** "Who should we notify for security coordination?"

**Type:** Checkbox
**Required:** Optional
**Validation:** Max 7

**Options:**

```typescript
{
  value: "family_contact",
  label: "Family Security Contact 👪",
  description: "Family member for security notifications"
},
{
  value: "corporate_security",
  label: "Corporate Security Team 🏢",
  description: "Business protection protocols"
},
{
  value: "medical_alert",
  label: "Medical Security Alert 🏥",
  description: "Health emergency procedures"
},
{
  value: "legal_liaison",
  label: "Legal Security Liaison ⚖️",
  description: "Attorney coordination for incidents"
},
{
  value: "insurance_provider",
  label: "Insurance Security Provider 📋",
  description: "Coverage verification and claims"
},
{
  value: "existing_security",
  label: "Existing Protection Team 🛡️",
  description: "Integration with current security"
},
{
  value: "no_contacts",
  label: "No Additional Contacts ❌",
  description: "Officer coordination only"
}
```

---

### STEP 7: PROTECTION ACCOMMODATIONS

**Question:** "Are there any specific requirements for your protection service?"

**Type:** Checkbox
**Required:** Optional
**Validation:** Max 12

**Options:**

```typescript
{
  value: "accessibility",
  label: "Accessibility Support ♿",
  description: "Mobility assistance protocols"
},
{
  value: "child_seats",
  label: "Child Protection Seats 👶",
  description: "Family security requirements"
},
{
  value: "pet_accommodation",
  label: "Pet Security Accommodation 🐕",
  description: "Animal protection protocols"
},
{
  value: "language_requirements",
  label: "Language Requirements 🗣️",
  description: "Multilingual protection officers"
},
{
  value: "medical_equipment",
  label: "Medical Security Equipment 🏥",
  description: "Medical device accommodation"
},
{
  value: "luggage_security",
  label: "Luggage Security Handling 🧳",
  description: "Secure cargo management"
},
{
  value: "dietary_requirements",
  label: "Dietary Requirements 🍽️",
  description: "Long-assignment provisions"
},
{
  value: "gender_preference",
  label: "Officer Gender Preference 👤",
  description: "Specific gender requirements"
},
{
  value: "business_facilities",
  label: "Business Security Facilities 💼",
  description: "Mobile office protection"
},
{
  value: "technology_security",
  label: "Technology Security 📱",
  description: "Secure connectivity requirements"
},
{
  value: "cultural_considerations",
  label: "Cultural Security Protocols 🕊️",
  description: "Religious/cultural requirements"
},
{
  value: "environmental",
  label: "Environmental Preferences 🌡️",
  description: "Climate-controlled vehicles"
}
```

---

### STEP 8: SECURITY COMMUNICATION

**Question:** "How should we coordinate your protection assignments?"

**Type:** Checkbox
**Required:** 1-8 selections
**Validation:** Min 1, Max 8

**Options:**

```typescript
{
  value: "sms_updates",
  label: "SMS Security Updates 📱",
  description: "Text message coordination"
},
{
  value: "email_confirmations",
  label: "Email Protection Confirmations 📧",
  description: "Formal security documentation"
},
{
  value: "app_notifications",
  label: "App Security Notifications 🔔",
  description: "Push alert system"
},
{
  value: "whatsapp",
  label: "WhatsApp Secure Messaging 💬",
  description: "Encrypted messaging service"
},
{
  value: "voice_urgent",
  label: "Voice Updates (Urgent Only) 📞",
  description: "Emergency calls only"
},
{
  value: "text_only",
  label: "Text-Only Coordination 📝",
  description: "No voice calls"
},
{
  value: "morning_briefing",
  label: "Morning Security Briefings ☀️",
  description: "6am-9am updates"
},
{
  value: "evening_updates",
  label: "Evening Protection Updates 🌙",
  description: "6pm-9pm coordination"
},
{
  value: "24_7_contact",
  label: "24/7 Security Availability 🕐",
  description: "Round-the-clock contact"
},
{
  value: "business_hours",
  label: "Business Hours Only 🏢",
  description: "9am-5pm weekdays"
},
{
  value: "encrypted_only",
  label: "Encrypted Communications 🔒",
  description: "Secure channels only"
},
{
  value: "minimal_contact",
  label: "Minimal Contact Protocol 🔕",
  description: "Essential updates only"
}
```

---

### STEP 9: PROTECTION PROFILE CONFIRMATION

**Question:** "Please confirm your protection profile to unlock your security benefits"

**Type:** Radio selection
**Required:** Yes
**Validation:** Must select one

**Options:**

```typescript
{
  value: "confirm",
  label: "Confirm Protection Profile ✅",
  description: "Lock in your security preferences and unlock benefits"
},
{
  value: "modify",
  label: "Modify Security Requirements 📝",
  description: "Review and edit previous selections"
},
{
  value: "maximum_privacy",
  label: "Complete with Maximum Privacy 🔒",
  description: "Highest security and confidentiality settings"
}
```

---

## 💾 QUESTIONNAIRE DATA PERSISTENCE

### LocalStorage Keys (Questionnaire Specific)
```javascript
// Questionnaire progress tracking
'armora_questionnaire_progress': {
  step: number,
  responses: Record<string, any>,
  timestamp: string
}

// Completed questionnaire responses
'armoraQuestionnaireResponses': QuestionnaireResponses

// User profile after questionnaire
'armoraUser': {
  hasCompletedQuestionnaire: boolean,
  protectionTier: 'Essential' | 'Executive' | 'Shadow'
}
```

### Questionnaire State Management
```typescript
interface AppState {
  questionnaireData: {
    responses?: Record<string, any>;
    currentStep?: number;
    isComplete?: boolean;
    firstName?: string;
  } | null;
  user: {
    hasCompletedQuestionnaire?: boolean;
    protectionTier?: string;
  };
}
```

---

## 🎯 PROTECTION TIER ALGORITHM

```typescript
function getProtectionRecommendation(data: SecurityProfileData): ProtectionTier {
  // Executive profiles
  const executiveProfiles = ['executive', 'celebrity', 'diplomat', 'government', 'high_profile'];

  // High security requirements
  const highSecurityRequirements = ['enhanced_security', 'privacy_discretion', 'advanced_training'];

  // Check for Shadow Protocol (£65/hour)
  if (
    executiveProfiles.includes(data.professionalProfile) &&
    data.requirements.some(req => highSecurityRequirements.includes(req))
  ) {
    return 'Shadow Protocol';
  }

  // Check for Executive Protection (£75/hour)
  if (
    executiveProfiles.includes(data.professionalProfile) ||
    data.frequency === 'daily' ||
    data.frequency === 'regular'
  ) {
    return 'Executive Protection';
  }

  // Default to Essential Protection (£50/hour)
  return 'Essential Protection';
}
```

---

## 🎨 UI TEXT & MESSAGES

### Welcome Screen
```typescript
{
  title: "Let's personalize your protection",
  subtitle: "A quick security assessment to match you with the right protection officer",
  description: "Takes about 3 minutes • Unlocks 50% off first assignment",
  cta: "Begin Security Assessment"
}
```

### Progress Messages
```typescript
{
  start: "Let's set up your protection profile",
  25: "Great start! Keep going...",
  50: "Halfway through your security assessment",
  75: "Almost done with your protection profile",
  complete: "Perfect! Your protection services are ready"
}
```

### Validation Messages
```typescript
{
  required: "Please make at least one selection to continue",
  maximum: "Maximum selections reached - please remove one to add another",
  invalid: "Please check your selection",
  incomplete: "Please complete this security requirement"
}
```

### Guest User Prompts
```typescript
{
  step3: "👤 Create an account to save 50% on your first protection assignment",
  step6: "🔒 Members get priority protection during high-demand periods",
  completion: "⭐ Sign up now to save your security profile and get 50% off"
}
```

### Completion Messages
```typescript
// Registered Users
{
  title: "Protection Profile Complete! 🎉",
  subtitle: "You've unlocked exclusive security benefits",
  benefits: [
    "50% off your first protection assignment",
    "Priority access to protection officers",
    "24/7 security support line",
    "Personalized protection matching"
  ],
  cta: "View Protection Services"
}

// Guest Users
{
  title: "Security Assessment Complete",
  subtitle: "Get a quote for protection services",
  limitation: "Create an account to unlock 50% discount and book protection",
  cta: "Get Protection Quote"
}
```

---

## ⚙️ QUESTIONNAIRE TECHNICAL IMPLEMENTATION

### Questionnaire Component Files
```
src/data/questionnaireData.ts          # All question text, options, and validation
src/components/Questionnaire/
  ├── QuestionnaireFlow.tsx            # Main questionnaire controller
  ├── QuestionnaireStep.tsx            # Individual step renderer
  ├── QuestionnaireComplete.tsx        # Achievement/completion screen
  ├── ProgressIndicator.tsx            # Step progress visualization
  ├── SelectionFeedback.tsx            # Real-time selection feedback
  ├── CustomAnswer.tsx                 # Custom answer input
  ├── NameCollection.tsx               # Name collection component
  ├── CTAButtons.tsx                   # Navigation buttons
  └── ProfileSummary.tsx               # Step 9 profile review
```

### Validation Rules
```typescript
const validationRules = {
  step1: { type: 'radio', required: true },
  step2: { type: 'radio', required: true },
  step3: { type: 'checkbox', min: 1, max: 5, required: true },
  step4: { type: 'checkbox', min: 1, max: 8, required: true },
  step5: { type: 'checkbox', min: 0, max: 9, required: false },
  step6: { type: 'checkbox', min: 0, max: 7, required: false },
  step7: { type: 'checkbox', min: 0, max: 12, required: false },
  step8: { type: 'checkbox', min: 1, max: 8, required: true },
  step9: { type: 'radio', required: true }
};
```

---

## 📱 MOBILE REQUIREMENTS

- **Typography:** 16px minimum (prevents zoom)
- **Touch targets:** 44px minimum height
- **Scrolling:** Auto-scroll to next question
- **Progress bar:** Fixed at top
- **CTAs:** Floating buttons on mobile
- **Width:** 320px minimum support

---

## ✅ QUESTIONNAIRE IMPLEMENTATION CHECKLIST

### SIA Compliance Updates
- [x] Update all question text to remove transport/journey/passenger language
- [x] Replace "transport" with "secure transport with protection services"
- [x] Change "journey" to "assignment" or "protection"
- [x] Update "passengers" to "principals"
- [x] Update service tier names (Essential/Executive/Shadow Protection)
- [x] Ensure pricing shows as "protection fees"
- [x] Update completion messages for security focus

### Technical Implementation
- [ ] Test all 9 steps render correctly
- [ ] Verify all validation rules work correctly
- [ ] Check mobile responsiveness at 320px
- [ ] Confirm progress saves to localStorage
- [ ] Test protection tier algorithm returns correct level
- [ ] Validate guest user conversion prompts display
- [ ] Verify achievement screen shows after completion
- [ ] Test back/forward navigation works correctly

### User Experience
- [ ] Confirm auto-scroll works on mobile
- [ ] Test selection feedback displays correctly
- [ ] Verify custom answer functionality
- [ ] Check name collection personalization works
- [ ] Test profile summary displays correctly in Step 9

---

**END OF QUESTIONNAIRE.md**