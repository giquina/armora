// Professional Close Protection Questionnaire with Progressive Disclosure
import { QuestionnaireStep } from '../types';
import {
  determineAssessmentPath,
  getProtectionLevelRecommendation
} from '../utils/progressiveDisclosure';


// Complete 9-step questionnaire for Armora Security Transport
export const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: 1,
    title: "Professional Profile",
    subtitle: "Help us understand your security requirements",
    question: "Which professional category requires secure transport with protection services?",
    type: "radio",
    options: [
      {
        id: "executive",
        label: "🏢 Are you an executive or business professional?",
        value: "executive",
        description: "Do you require secure transport with professional protection for high-stakes meetings, corporate events, or daily commutes? We understand that executive transport must combine security with professional presentation.",
        examples: "*Choose this if you hold a senior position requiring secure transport with protection services matching your professional status."
      },
      {
        id: "entrepreneur", 
        label: "💼 Are you a business owner or entrepreneur?",
        value: "entrepreneur",
        description: "Are you building your empire, meeting investors, or managing multiple ventures? Your secure transport and protection needs are as dynamic as your business decisions.",
        examples: "*Choose this if you own a business or are self-employed requiring flexible secure transport with protection arrangements."
      },
      {
        id: "celebrity",
        label: "🎭 Are you in entertainment or media?",
        value: "celebrity",
        description: "Do you need discrete security services to studios, premieres, or appearances? Whether you're in front of the camera or behind the scenes, privacy and security are everything.",
        examples: "*Choose this if you're an actor, musician, TV personality, producer, or media professional requiring discrete security services."
      },
      {
        id: "athlete",
        label: "⚽ Are you a sports professional or athlete?", 
        value: "athlete",
        description: "Do you need protection for training, competitions, or sports events? We understand the importance of arriving safely and focused on your performance.",
        examples: "*Choose this if you're an athlete, coach, or sports professional requiring protection for training and events."
      },
      {
        id: "government",
        label: "🏛️ Are you a government or public sector official?",
        value: "government", 
        description: "Do your responsibilities require secure, protocol-compliant protection to sensitive locations? Whether it's council meetings, government buildings, or public events, we understand security protocols matter.",
        examples: "*Choose this if you work in any level of government, civil service, or public administration requiring protocol-compliant security services."
      },
      {
        id: "diplomat",
        label: "🌍 Are you part of an international delegation?",
        value: "diplomat",
        description: "Are you coordinating protection for diplomatic visits, international business groups, or foreign delegations? Security protocols and cultural sensitivity are paramount.",
        examples: "*Choose this if you're organizing or part of international group requiring specialized protection services."
      },
      {
        id: "medical",
        label: "🏥 Are you a senior healthcare professional?",
        value: "medical",
        description: "Do you move between hospitals, clinics, or urgent calls? Perhaps you need reliable protection after exhausting shifts or for important medical conferences?",
        examples: "*Choose this if you're a doctor, surgeon, senior nurse, or healthcare administrator requiring protection between facilities."
      },
      {
        id: "legal",
        label: "⚖️ Are you a legal professional?",
        value: "legal",
        description: "Do you need dependable protection between courts, chambers, and client meetings? We know your reputation depends on punctuality and maintaining client confidentiality.",
        examples: "*Choose this if you're a barrister, solicitor, judge, or other legal professional requiring confidential protection services."
      },
      {
        id: "creative",
        label: "🎨 Are you a creative professional?",
        value: "creative",
        description: "Are you an artist, designer, or creative consultant moving between studios, galleries, or client presentations? Your creative energy shouldn't be compromised by security concerns.",
        examples: "*Choose this if you work in creative industries requiring protection for creative venues."
      },
      {
        id: "academic",
        label: "🎓 Are you an academic or educational professional?",
        value: "academic",
        description: "Do you travel between universities, conferences, or research facilities? Perhaps you're a visiting professor or education administrator who requires secure protection for academic activities?",
        examples: "*Choose this if you work in education, research, or academic administration requiring campus or conference protection."
      },
      {
        id: "student",
        label: "📚 Are you a student?",
        value: "student",
        description: "Are you studying at university or college? Need safe protection for late library sessions, social events, or secure travel home? We understand student life has unique security needs.",
        examples: "*Choose this if you're currently in full-time education requiring affordable security options."
      },
      {
        id: "international_visitor",
        label: "✈️ Are you visiting the UK?",
        value: "international_visitor",
        description: "Are you here for tourism, temporary work, or visiting family? Do you need reliable protection to explore safely without worrying about navigation or security?",
        examples: "*Choose this if you're a tourist or temporary visitor to the UK requiring temporary protection services."
      },
      {
        id: "finance",
        label: "📊 Are you a financial services professional?",
        value: "finance",
        description: "Do you work in banking, investment, or insurance? Are early morning market hours and late client dinners part of your routine? Your security should match your professional standards.",
        examples: "*Choose this if you work in finance, banking, trading, or insurance requiring secure movement."
      },
      {
        id: "security",
        label: "🛡️ Are you in security or law enforcement?",
        value: "security",
        description: "Do you work in private security, police services, or military? You understand protocols and appreciate professional standards in protection services.",
        examples: "*Choose this if you're in any security, police, or military role requiring discrete civilian protection."
      },
      {
        id: "family",
        label: "👨‍👩‍👧‍👦 Are you looking for secure family transport?",
        value: "family",
        description: "Do you need safe, reliable protection for your loved ones? Whether it's school runs, family outings, or airport security, your family's safety and protection come first.",
        examples: "*Choose this if you're primarily protection assignment family protection services and personal security."
      },
      {
        id: "general",
        label: "🚗 Are you looking for general premium transport?",
        value: "general",
        description: "Do you simply want reliable, comfortable protection without specific professional requirements? Sometimes you just need dependable security services.",
        examples: "*Choose this if you need standard protection services but don't fit other specific categories."
      },
      {
        id: "high_profile",
        label: "🔒 Are you a high-profile individual requiring maximum discretion?",
        value: "high_profile",
        description: "Is your privacy paramount? Do you need the highest level of discretion and security for your movements? We understand some clients require maximum security protocols.",
        examples: "*Choose this if you require enhanced security measures and complete confidentiality with maximum discretion."
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer not to say",
        value: "prefer_not_to_say",
        description: "No problem at all. We can work with you to understand your needs as we go.",
        examples: "*Choose this if you prefer to keep your professional background private."
      }
    ],
    validation: { required: true, errorMessage: "Please select your professional profile" },
    helpText: "Tell us about yourself so we can match you with the perfect secure transport and protection service. There are no wrong answers - just honest ones.",
    isFirstStep: true,
    processOverview: {
      timeRequired: "8-9 minutes",
      benefits: [
        "Personalized security recommendations",
        "Matched with appropriate protection level",
        "Optimized routing and officer selection",
        "Exclusive 50% discount on first protection assignment"
      ],
      securityAssurance: "All responses are encrypted and used exclusively for service matching. Your privacy is our priority."
    },
    stepDescription: "Tell us what you do so we can match you with the right protection officers. A CEO might need someone who understands business confidentiality, while a student might prefer a friendly officer who knows secure late-night routes. It's all about finding your perfect security match."
  },
  {
    id: 2,
    title: "Protection Frequency",
    subtitle: "Understanding your security patterns",
    question: "How often do you need secure transport with professional protection?",
    type: "radio",
    options: [
      {
        id: "daily",
        label: "📅 Do you need daily protection?",
        value: "daily",
        description: "Is secure protection part of your everyday routine? Whether it's your commute to work or multiple daily appointments, we'll become part of your daily security.",
        examples: "*Choose this if you need protection services 5 or more times per week."
      },
      {
        id: "weekly",
        label: "🗓️ Do you need regular business protection?",
        value: "weekly",
        description: "Are you traveling for business several times a week? Client meetings, office visits, or regular business entertainment requiring security?",
        examples: "*Choose this if you need protection services 2-4 times per week."
      },
      {
        id: "monthly",
        label: "📆 Do you need monthly protection?",
        value: "monthly",
        description: "Are your protection needs periodic? Monthly board meetings, regular check-ups, or social events?",
        examples: "*Choose this if you need protection services 1-3 times per month."
      },
      {
        id: "project_based",
        label: "🎯 Do you have project-based protection needs?",
        value: "project_based",
        description: "Is your need temporary but intensive? Perhaps a film shoot, business project, or temporary assignment requiring security?",
        examples: "*Choose this if you need intensive protection for specific time periods."
      },
      {
        id: "unpredictable",
        label: "❓ Are your protection needs unpredictable?",
        value: "unpredictable",
        description: "Is your schedule too variable to predict? Last-minute meetings or spontaneous security requirements?",
        examples: "*Choose this if you can't predict your protection service frequency."
      },
      {
        id: "special_events",
        label: "🎪 Do you only need protection for special events?",
        value: "special_events",
        description: "Are you looking for protection just for important occasions? Galas, premieres, or special celebrations?",
        examples: "*Choose this if you only need occasional event protection."
      },
      {
        id: "seasonal",
        label: "🏦 Are you here for holiday or tourist purposes?",
        value: "seasonal",
        description: "Are you visiting the UK for leisure? Need reliable protection to explore without the stress of security concerns?",
        examples: "*Choose this if you're a tourist or holiday visitor requiring temporary protection."
      },
      {
        id: "weekly_appointments",
        label: "📅 Do you have weekly appointments?",
        value: "weekly_appointments",
        description: "Do you have regular weekly commitments? Perhaps standing meetings, medical appointments, or social engagements?",
        examples: "*Choose this if you need protection services 1-2 times per week."
      },
      {
        id: "biweekly",
        label: "🗓️ Do you travel every other week?",
        value: "biweekly",
        description: "Is your schedule more spread out? Perhaps alternating between offices or bi-weekly business assignments?",
        examples: "*Choose this if you need protection services every other week."
      },
      {
        id: "quarterly",
        label: "📆 Do you travel quarterly?",
        value: "quarterly",
        description: "Are your protection needs tied to quarterly business cycles? Perhaps investor meetings or seasonal events?",
        examples: "*Choose this if you need protection services every few months."
      },
      {
        id: "term_time",
        label: "🎓 Do you need term-time protection only?",
        value: "term_time",
        description: "Are your protection needs tied to the academic calendar? University terms or school schedules?",
        examples: "*Choose this if you're a student needing term-time protection services."
      },
      {
        id: "prefer_not_to_say",
        label: "❓ I'd rather not specify right now",
        value: "prefer_not_to_say",
        description: "No problem at all. We can work with you to understand your needs as we go.",
        examples: "*Choose this if you prefer to keep your travel patterns private."
      }
    ],
    validation: { required: true, errorMessage: "Please select your travel frequency requirements" },
    helpText: "Knowing your rhythm helps us be ready when you need us. Whether daily or occasionally, we adapt to your security needs.",
    stepDescription: "How often you need protection helps us serve you better. Daily principals get familiar Protection Officers who learn your secure routes and preferences. Occasional clients get our most flexible Protection Officers who excel with new locations. It's like having a regular security team versus adaptable protection specialists."
  },
  {
    id: 2.5,
    title: "Security Risk Assessment",
    subtitle: "Professional threat evaluation",
    question: "To provide appropriate protection levels, we need to understand your security profile. This confidential assessment helps us match you with the right protection protocols.",
    type: "threat_assessment",
    threatAssessment: {
      enabled: true,
      questions: [
        {
          id: 'hasReceivedThreats',
          question: 'Have you received any threats in the past 12 months?',
          description: 'This includes verbal, written, digital threats, or any concerning communications directed at you personally or professionally.',
          riskWeight: 5,
          icon: '⚠️'
        },
        {
          id: 'hasLegalProceedings',
          question: 'Are you involved in any legal proceedings?',
          description: 'Current litigation, court cases, disputes, or legal matters that could affect your security profile.',
          riskWeight: 4,
          icon: '⚖️'
        },
        {
          id: 'hasPreviousIncidents',
          question: 'Have you experienced security incidents before?',
          description: 'Any previous security breaches, stalking, harassment, or situations requiring security intervention.',
          riskWeight: 4,
          icon: '🚨'
        },
        {
          id: 'hasPublicProfile',
          question: 'Do you have a public profile (media, social, professional)?',
          description: 'Public visibility through media appearances, social media presence, professional recognition, or industry prominence.',
          riskWeight: 3,
          icon: '📺'
        },
        {
          id: 'requiresInternationalProtection',
          question: 'Do you travel internationally for work?',
          description: 'Regular international business travel, particularly to regions with varying security considerations.',
          riskWeight: 3,
          icon: '✈️'
        },
        {
          id: 'hasControversialWork',
          question: 'Does your work involve controversial decisions?',
          description: 'Professional responsibilities involving public policy, judicial decisions, corporate restructuring, or contentious business matters.',
          riskWeight: 3,
          icon: '🎯'
        },
        {
          id: 'hasHighValueAssets',
          question: 'Do you manage high-value assets or information?',
          description: 'Responsibility for significant financial assets, confidential information, or high-value intellectual property.',
          riskWeight: 2,
          icon: '💎'
        }
      ],
      riskLevels: {
        GREEN: { range: [0, 4], description: 'Standard assessment', assessmentPath: 'standard' },
        YELLOW: { range: [5, 9], description: 'Enhanced assessment', assessmentPath: 'enhanced' },
        ORANGE: { range: [10, 16], description: 'Significant risk assessment', assessmentPath: 'significant' },
        RED: { range: [17, 24], description: 'Critical risk - comprehensive assessment', assessmentPath: 'critical' }
      }
    },
    validation: { required: true, errorMessage: "Please complete the security assessment" },
    helpText: "This confidential assessment ensures we provide appropriate protection levels and security protocols. All information is encrypted and used exclusively for service optimization.",
    stepDescription: "Professional security assessment helps us understand your risk profile and protection requirements. Based on your responses, we'll recommend appropriate protection levels and assign officers with relevant experience and training."
  },
  {
    id: 2.6,
    title: "Comprehensive Security Assessment",
    subtitle: "Seven Ps professional protection framework",
    question: "Based on your risk profile, we recommend a comprehensive security assessment using the professional Seven Ps framework.",
    type: "seven_ps_assessment",
    validation: { required: false, errorMessage: "Please complete the Seven Ps assessment or skip to continue" },
    helpText: "The Seven Ps framework (People, Places, Personality, Prejudices, Personal History, Political/Religious Views, Private Lifestyle) is the gold standard for professional threat assessment used by security services worldwide.",
    stepDescription: "This comprehensive assessment helps us understand your complete security profile and assign the most appropriate protection officers and protocols for your specific situation.",
    progressiveDisclosure: {
      triggerConditions: {
        riskLevel: ['YELLOW', 'ORANGE', 'RED'],
        professionalProfiles: ['celebrity', 'government', 'diplomat', 'high_profile'],
        securityRequirements: ['privacy_discretion', 'security_awareness']
      },
      assessmentLevel: 'conditional' // Will be determined by progressive disclosure logic
    }
  },
  {
    id: 2.7,
    title: "Enhanced Emergency Contact Information",
    subtitle: "Comprehensive emergency contact and medical information",
    question: "Given your security profile, we recommend providing enhanced emergency contact information including medical details for your safety.",
    type: "enhanced_emergency_contacts",
    validation: { required: false, errorMessage: "Please complete enhanced emergency contact information or skip to continue" },
    helpText: "Enhanced emergency contact information helps us provide better duty of care and coordinate with medical services if needed. All information is encrypted and stored securely.",
    stepDescription: "Professional protection services include comprehensive emergency response protocols. This information ensures we can act quickly and appropriately in any situation.",
    progressiveDisclosure: {
      triggerConditions: {
        riskLevel: ['ORANGE', 'RED'],
        securityRequirements: ['trained_professionals', 'security_awareness'],
        specialRequirements: ['medical_considerations', 'accessibility_needs']
      },
      dataProtection: {
        specialCategoryData: true,
        encryptionLevel: 'enhanced',
        retentionPeriod: 'assignment_duration_plus_7_years'
      }
    }
  },
  {
    id: 3,
    title: "Security Requirements",
    subtitle: "What matters most to you",
    question: "What secure transport experience with protection officers matters most to you?",
    type: "checkbox",
    options: [
      {
        id: "privacy_discretion",
        label: "🔒 Is absolute privacy and confidentiality essential?",
        value: "privacy_discretion",
        description: "Do your conversations and destinations need to remain completely confidential? No questions asked?",
        examples: "*Select this if discretion is paramount to your security needs."
      },
      {
        id: "security_awareness",
        label: "🛡️ Do you need security that blends in seamlessly?",
        value: "security_awareness",
        description: "Would you feel safer knowing trained professionals are watching over you without drawing unwanted attention to your movements?",
        examples: "*Select this if you want discrete protection without obvious security presence."
      },
      {
        id: "premium_comfort",
        label: "🚗 Do you expect premium protection vehicles?",
        value: "premium_comfort",
        description: "Is the security vehicle itself part of your image? Do you need premium cars that make the right professional statement?",
        examples: "*Select this if protection vehicle quality and presentation matter to your security profile."
      },
      {
        id: "professional_service",
        label: "👤 Is your Protection Officer's presentation crucial for your image?",
        value: "professional_service",
        description: "Do your Protection Officers need to match your professional standards when meeting clients or arriving at important events?",
        examples: "*Select this if your Protection Officer's professional appearance reflects on your security requirements."
      },
      {
        id: "reliability_tracking",
        label: "⏰ Is punctuality absolutely critical?",
        value: "reliability_tracking",
        description: "Can't afford to be late? Is your schedule so precise that every minute counts for your security?",
        examples: "*Select this if being on time is non-negotiable for your protection schedule."
      },
      {
        id: "flexibility_coverage",
        label: "📁 Do you need 24/7 protection availability?",
        value: "flexibility_coverage",
        description: "Are your hours unpredictable? Early flights, late meetings, or middle-of-the-night security emergencies?",
        examples: "*Select this if you need round-the-clock protection service availability."
      },
      {
        id: "specialized_needs",
        label: "👥 Do you need group or family protection?",
        value: "specialized_needs",
        description: "Are you protection assignment protection for multiple people? Need security vehicles that accommodate your entire family or team?",
        examples: "*Select this if you regularly need multi-Principal protection services."
      },
      {
        id: "communication_skills",
        label: "💬 Do you value excellent communication?",
        value: "communication_skills",
        description: "Do you need Protection Officers who can engage professionally when needed but also respect when you need quiet time?",
        examples: "*Select this if Protection Officer communication skills matter to your security experience."
      },
      {
        id: "route_knowledge",
        label: "🗺️ Do you need expert security route planning?",
        value: "route_knowledge",
        description: "Want to avoid threats, know secure routes, or need someone who truly knows safe city navigation?",
        examples: "*Select this if security route efficiency and protective navigation are important."
      },
      {
        id: "real_time_tracking",
        label: "📱 Do you want real-time protection tracking and updates?",
        value: "real_time_tracking",
        description: "Do you or your team need to track protection assignments, receive security updates, or coordinate schedules digitally?",
        examples: "*Select this if you want full digital visibility of your protection services."
      },
      {
        id: "trained_professionals",
        label: "🛡️ Do you prefer highly trained professional Protection Officers?",
        value: "trained_professionals",
        description: "Would you feel more confident with Protection Officers who have advanced security training and situational awareness?",
        examples: "*Select this if you want Protection Officers with enhanced security qualifications and specialized training."
      },
      {
        id: "payment_flexibility",
        label: "💳 Do you need flexible payment options?",
        value: "payment_flexibility",
        description: "Do you need corporate billing, multiple payment methods, or special invoicing arrangements for protection services?",
        examples: "*Select this if standard payment doesn't suit your protection service needs."
      },
      {
        id: "multi_city_coverage",
        label: "🌍 Do you travel across multiple cities?",
        value: "multi_city_coverage",
        description: "Do you need consistent protection service whether you're in London, Manchester, or Edinburgh?",
        examples: "*Select this if you need nationwide protection coverage."
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer not to say",
        value: "prefer_not_to_say",
        description: "That's great. We'll adapt to your needs as we learn what works best for you.",
        examples: "*Our specialists will provide adaptable service recommendations based on your protection assignment patterns while maintaining complete confidentiality about your specific requirements."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 5, errorMessage: "Please select 1-5 security requirements" },
    helpText: "Pick what matters most to you (select 1-5 options). Every detail helps us create your perfect secure transport experience with professional protection.",
    stepDescription: "What matters most to your security? Some prefer communicative Protection Officers, others want discrete assignments. Some need assistance with equipment, others prioritize privacy. Your preferences help us pick Protection Officers who naturally match your security style - no compromised protection."
  },
  {
    id: 4,
    title: "Protection Coverage Areas",
    subtitle: "Where do you need security most",
    question: "Where do you need secure transport services with protection coverage?",
    type: "checkbox",
    options: [
      {
        id: "central_london",
        label: "📍 Do you primarily travel within Greater London?",
        value: "central_london",
        description: "Is London your main base? From the City to Canary Wharf, Mayfair to Shoreditch, we know every street and shortcut.",
        examples: "*Select this if London is your primary location."
      },
      {
        id: "financial_district",
        label: "🏭 Do you regularly need protection in Manchester?",
        value: "financial_district",
        description: "Are you part of the Northern Powerhouse? From MediaCity to the business district, we provide security coverage across Greater Manchester.",
        examples: "*Select this if Manchester is a regular protection destination."
      },
      {
        id: "government_quarter",
        label: "🏙️ Do you frequently need protection in Birmingham?",
        value: "government_quarter",
        description: "Is the Midlands your territory? From the Jewellery Quarter to the NEC, we know Birmingham inside out.",
        examples: "*Select this if Birmingham features in your travel plans."
      },
      {
        id: "west_end",
        label: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Do you need coverage in Edinburgh?",
        value: "west_end",
        description: "Do you work in Scotland's capital? From the financial district to the airport, we navigate Edinburgh expertly.",
        examples: "*Select this if Edinburgh is part of your regular travel."
      },
      {
        id: "greater_london",
        label: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Do you require transport in Glasgow?",
        value: "greater_london",
        description: "Is Glasgow your Scottish base? We know the city from the merchant quarter to the West End.",
        examples: "*Select this if Glasgow is in your travel rotation."
      },
      {
        id: "airport_transfers",
        label: "✈️ Do you frequently fly from UK airports?",
        value: "airport_transfers",
        description: "Are you constantly catching flights? Whether it's Heathrow at 5am or a late arrival at Gatwick, we'll provide secure airport protection.",
        examples: "*Select this if you regularly need airport protection services."
      },
      {
        id: "tourist_destinations",
        label: "🎭 Do you need transport for entertainment venues and events?",
        value: "tourist_destinations",
        description: "From West End shows to arena concerts, do you need transport to entertainment venues where timing and discretion matter?",
        examples: "*Select this if you frequent entertainment venues."
      },
      {
        id: "entertainment_events",
        label: "🏨 Do you stay at premium hotels?",
        value: "entertainment_events",
        description: "Are five-star hotels your second home? Do you need Protection Officers who understand premium hospitality standards?",
        examples: "*Select this if you regularly use high-end hotels."
      },
      {
        id: "premium_shopping",
        label: "⚖️ Do you visit government buildings or courts?",
        value: "premium_shopping",
        description: "Do you have business in Westminster, attend court hearings, or visit government offices? We understand the security protocols.",
        examples: "*Select this if you regularly visit official buildings."
      },
      {
        id: "healthcare_professional",
        label: "🚌 Do you need transport across multiple UK cities?",
        value: "healthcare_professional",
        description: "Do you travel between London, Manchester, Birmingham, or other major cities? We provide consistent service nationwide.",
        examples: "*Select this if you regularly travel between major UK cities."
      },
      {
        id: "university_business_towns",
        label: "🎓 Do you travel to university towns or tech centers?",
        value: "university_business_towns",
        description: "Do you visit Oxford, Cambridge, Reading, or Brighton? Academic and tech hubs where intellectual conversations matter?",
        examples: "*Select this if you regularly travel to academic or technology centers."
      },
      {
        id: "scotland_wales",
        label: "🌐 Do you need international coordination?",
        value: "scotland_wales",
        description: "Does your travel extend beyond the UK? Do you need transport that coordinates with international security teams?",
        examples: "*Select this if you have international transport needs."
      },
      {
        id: "international_specialized",
        label: "🚨 Are you sometimes in high-security situations?",
        value: "international_specialized",
        description: "Do you ever need transport in sensitive areas, during protests, or in situations requiring enhanced security awareness?",
        examples: "*Select this if you face elevated security situations."
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer not to say",
        value: "prefer_not_to_say",
        description: "We completely understand. Your privacy and security come first.",
        examples: "*Choose this if you prefer to keep your location preferences confidential."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 8, errorMessage: "Please select 1-8 coverage areas" },
    helpText: "Choose your regular security zones. We'll make sure we're always ready where you need protection most.",
    stepDescription: "Where you need protection helps us assign Protection Officers who really know those security zones. They'll know the secure routes, secure commencement points, and which areas to avoid during high-risk periods. Local security knowledge makes every assignment safer."
  },
  {
    id: 5,
    title: "Specialized Venues",
    subtitle: "Additional protection areas",
    question: "Do you require protection services at these specialized venues?",
    type: "checkbox",
    options: [
      {
        id: "london_suburbs",
        label: "✈️ Do you frequently fly from UK airports?",
        value: "london_suburbs",
        description: "Are you constantly catching flights? Whether it's Heathrow at 5am or a late arrival at Gatwick, we'll provide secure airport protection.",
        examples: "*Select this if you regularly need airport protection services."
      },
      {
        id: "business_parks",
        label: "⚖️ Do you visit government buildings or courts?",
        value: "business_parks",
        description: "Do you have business in Westminster, attend court hearings, or visit government offices? We understand the security protocols.",
        examples: "*Select this if you regularly visit official buildings."
      },
      {
        id: "event_venues",
        label: "🎭 Do you attend entertainment venues and events?",
        value: "event_venues",
        description: "From West End shows to arena concerts, do you need transport to entertainment venues where timing and discretion matter?",
        examples: "*Select this if you frequent entertainment venues."
      },
      {
        id: "private_aviation",
        label: "🏨 Do you stay at premium hotels?",
        value: "private_aviation",
        description: "Are five-star hotels your second home? Do you need Protection Officers who understand premium hospitality standards?",
        examples: "*Select this if you regularly use high-end hotels."
      },
      {
        id: "healthcare_medical",
        label: "🌐 Do you need international coordination?",
        value: "healthcare_medical",
        description: "Does your travel extend beyond the UK? Do you need transport that coordinates with international security teams?",
        examples: "*Select this if you have international transport needs."
      },
      {
        id: "educational_training",
        label: "🚨 Are you sometimes in high-security situations?",
        value: "educational_training",
        description: "Do you ever need transport in sensitive areas, during protests, or in situations requiring enhanced security awareness?",
        examples: "*Select this if you face elevated security situations."
      },
      {
        id: "leisure_recreation",
        label: "✅ No additional coverage needed",
        value: "leisure_recreation",
        description: "My requirements are fully covered by my primary areas",
        examples: "*Select this if you only need coverage in your primary locations."
      },
      {
        id: "none_required",
        label: "❌ None of the above apply to me",
        value: "none_required",
        description: "My requirements are fully covered by my primary locations",
        examples: "*Select this if you only need coverage in your primary areas."
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer not to say",
        value: "prefer_not_to_say",
        description: "That's great. We'll adapt to your needs as we learn what works best for you.",
        examples: "*Our specialists will provide flexible coverage recommendations while maintaining complete confidentiality about your additional location requirements."
      }
    ],
    validation: { required: false },
    helpText: "These are optional extras. Pick any that matter to your security needs.",
    stepDescription: "Airports, hotels, event venues - these places have their own security protocols. Protection Officers familiar with these venues know exactly where to provide secure commencement, which entrances to use, and how to navigate security procedures. No more confusion at high-security locations."
  },
  {
    id: 6,
    title: "Emergency Contact Information",
    subtitle: "Comprehensive emergency contact and medical information",
    question: "Please provide emergency contact information to ensure your safety and appropriate care during protection services.",
    type: "input",
    validation: { required: false, errorMessage: "Please provide at least basic emergency contact information" },
    helpText: "These details help us take better care of you. All information stays completely private.",
    stepDescription: "Having someone we can contact in emergencies gives everyone peace of mind. Like having ICE contacts in your phone, but for your journeys. It's optional but recommended - just in case you ever need help."
  },
  {
    id: 7,
    title: "Protection Accommodations",
    subtitle: "Any additional security needs",
    question: "Are there any specific requirements for your protection service?",
    type: "checkbox",
    options: [
      {
        id: "accessibility_needs",
        label: "♿ Accessibility Needs",
        value: "accessibility_needs",
        description: "Mobility, visual, hearing, and cognitive assistance",
        examples: "*Wheelchair Accessible Vehicle Required, Walking Aid Accommodation (canes, walkers, mobility scooters), Transfer Assistance Needed, Extended Time for Boarding/Alighting, Ground Floor Commencement Point Preferred, Accessible Commencement Point/Secure Destination Points Only"
      },
      {
        id: "visual_hearing_support",
        label: "👁️ Visual & Hearing Support",
        value: "visual_hearing_support",
        description: "Communication and sensory assistance",
        examples: "*Guide Dog Accommodation, Large Print Materials Needed, Audio Communication Preferred, Sign Language Interpretation, Written Communication Preferred, Hearing Loop Compatibility Required"
      },
      {
        id: "medical_considerations",
        label: "🏥 Medical Considerations",
        value: "medical_considerations",
        description: "Special medical requirements",
        examples: "*Oxygen Equipment Transport, Medical Device Power Requirements, Temperature-Controlled Environment Needed, Medication Storage Requirements, Infection Control Protocols, Medical Equipment Transport"
      },
      {
        id: "language_preferences",
        label: "🗣️ Language Preferences",
        value: "language_preferences",
        description: "Communication in preferred language",
        examples: "*English (Primary), Welsh (Cymraeg), French (Français), German (Deutsch), Spanish (Español), Mandarin (中文), Arabic (العربية), Other Language Required"
      },
      {
        id: "group_family_transport",
        label: "👥 Group & Family Transport",
        value: "group_family_transport",
        description: "Multiple Principals and family needs",
        examples: "*Child Safety Seats Required (specify ages/weights), Family Group Protection (specify ages), Business Team Coordination, Multiple Vehicle Coordination, Security Detail Coordination, Group Communication Requirements"
      },
      {
        id: "luggage_equipment",
        label: "🧳 Luggage & Equipment",
        value: "luggage_equipment",
        description: "Special cargo and equipment handling",
        examples: "*Oversized Items Regular Transport, Sports Equipment Transport, Musical Instruments, Art/Antique Transport, Technical Equipment, Secure Document Transport, Diplomatic Pouch Handling"
      },
      {
        id: "pet_transport",
        label: "🐕 Pet Transport",
        value: "pet_transport",
        description: "Protection accommodation for animals",
        examples: "*Small Pet Accommodation (cats, small dogs), Large Dog Protection Transport, Multiple Pet Security Accommodation, Pet Safety Equipment Required, Veterinary Documentation Assistance, Pet Comfort During Protection"
      },
      {
        id: "security_preferences",
        label: "🔒 Security Preferences",
        value: "security_preferences",
        description: "Privacy and security accommodations",
        examples: "*Discrete/Unmarked Vehicles Only, Female Protection Officer/Security Preferred, Male Protection Officer/Security Preferred, Same Protection Officer Assignment Preferred, Route Confidentiality Required, Counter-Surveillance Awareness"
      },
      {
        id: "business_facilities",
        label: "💼 Business Facilities",
        value: "business_facilities",
        description: "Work and communication needs",
        examples: "*Mobile Office Setup, WiFi and Charging Required, Conference Call Capability, Privacy Glass/Partition, Quiet Environment Essential, Business Refreshments"
      },
      {
        id: "environment_comfort",
        label: "🌡️ Environment & Comfort",
        value: "environment_comfort",
        description: "Climate and comfort preferences",
        examples: "*Climate-Controlled Environment, Allergy Management Protocols, Scent-Free Environment, Quiet/Low-Stimulation Environment, Dietary Restrictions (refreshments), Specific Vehicle Type Preference"
      },
      {
        id: "technology_requirements",
        label: "📱 Technology Requirements",
        value: "technology_requirements",
        description: "Communication and device needs",
        examples: "*Mobile Signal Boosters, Multiple Device Charging, Satellite Communication, Priority Communication Backup, Real-Time Tracking Privacy, Communication Blackout Periods"
      },
      {
        id: "no_special_requirements",
        label: "❌ No Special Requirements",
        value: "no_special_requirements",
        description: "Armora Secure service is sufficient",
        examples: "*I have no special requirements, Armora Secure meets all my needs"
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer not to say",
        value: "prefer_not_to_say",
        description: "That's great. We'll adapt to your needs as we learn what works best for you.",
        examples: "*Our specialists will provide standard service arrangements while maintaining complete confidentiality about any specific requirements you may have."
      }
    ],
    validation: { required: false, minSelections: 0, maxSelections: 12, errorMessage: "Please select your special requirements" },
    helpText: "Tell us about anything that would make your protection service more effective. We're here to help.",
    stepDescription: "Everyone's security needs are different. Maybe you need wheelchair accessibility, maybe you have a service dog, or maybe you just need extra time for secure transfers. Whatever you need, we'll make sure your Protection Officer is prepared and comfortable providing appropriate security assistance."
  },
  {
    id: 8,
    title: "Contact Preferences",
    subtitle: "How you'd like to hear from us",
    question: "How should we stay in touch with you?",
    type: "checkbox",
    options: [
      {
        id: "sms_updates",
        label: "📱 SMS Updates",
        value: "sms_updates",
        description: "Text messages for protection assignment confirmations and Protection Officer updates",
        examples: "*Real-time protection assignment confirmations, Protection Officer arrival notifications, journey progress updates, and immediate security alerts delivered via SMS. Best for busy professionals who check messages frequently."
      },
      {
        id: "email_communication",
        label: "📧 Email Communications",
        value: "email_communication",
        description: "Detailed email confirmations and documentation",
        examples: "*Professional email communications with protection assignment confirmations, detailed journey information, receipts, and comprehensive documentation. Best for formal business environments and record keeping."
      },
      {
        id: "app_notifications",
        label: "🔔 App Notifications",
        value: "app_notifications",
        description: "Push notifications through Armora Transport app",
        examples: "*Modern push notifications through our secure mobile app, including real-time tracking, Protection Officer updates, and protection assignment management. Best for tech-savvy users seeking streamlined experience."
      },
      {
        id: "phone_calls",
        label: "📞 Phone Calls",
        value: "phone_calls",
        description: "Voice communication for important updates",
        examples: "*Direct phone calls from our operations team for important updates, protection assignment confirmations, and security coordination. Best for senior executives preferring traditional business communication."
      },
      {
        id: "through_assistant",
        label: "👤 Through Personal Assistant",
        value: "through_assistant",
        description: "All communications via personal assistant or PA",
        examples: "*All transport communications directed through your personal assistant or PA, including protection assignment coordination, updates, and scheduling. Best for C-level executives and high-profile individuals."
      },
      {
        id: "business_contact",
        label: "🏢 Business/Corporate Contact",
        value: "business_contact",
        description: "Communications through company contact",
        examples: "*All communications routed through designated business contact, travel coordinator, or corporate security office. Ideal for company-managed transport arrangements and corporate protocols."
      },
      {
        id: "secure_messaging",
        label: "🔒 Secure Messaging Platform",
        value: "secure_messaging",
        description: "Encrypted messaging for sensitive communications",
        examples: "*End-to-end encrypted messaging platform for security-sensitive communications, route information, and confidential transport coordination. Best for high-security requirements."
      },
      {
        id: "communication_timing",
        label: "⏰ Communication Timing Preferences",
        value: "communication_timing",
        description: "Specific timing and frequency preferences",
        examples: "*Business hours only (9:00-17:00 GMT), extended hours (8:00-20:00), custom hours, or 24/7 availability for emergencies. Includes time zone considerations for international clients."
      },
      {
        id: "priority_alerts",
        label: "⚡ Priority Alert Communications",
        value: "priority_alerts",
        description: "How to handle urgent transport coordination",
        examples: "*Important transport situations may override preferences for immediate contact via available methods. Protection Officer safety updates, schedule changes, and urgent coordination delivered immediately for service continuity."
      },
      {
        id: "privacy_minimal",
        label: "🔕 Privacy & Minimal Contact",
        value: "privacy_minimal",
        description: "Essential communications only with maximum privacy",
        examples: "*Protection Officer arrival notifications and priority communications only. Discrete, minimal interruption approach with strong privacy protection. Best for privacy-focused users and confidential transport needs."
      },
      {
        id: "no_communications",
        label: "❌ No Non-Essential Communications",
        value: "no_communications",
        description: "Protection Officer coordination only, no protection assignment communications",
        examples: "*Direct Protection Officer coordination only. No protection assignment confirmations, updates, or administrative communications. Priority alerts still delivered for safety and security purposes."
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer not to say",
        value: "prefer_not_to_say",
        description: "That's great. We'll adapt to your needs as we learn what works best for you.",
        examples: "*Our specialists will use standard professional communication methods while maintaining complete confidentiality about your preferred contact and communication preferences."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 8, errorMessage: "Please select 1-8 communication preferences" },
    helpText: "How would you like us to stay in touch? We'll only contact you when we need to.",
    stepDescription: "How should we keep in touch? Some people love texts, others prefer calls, and some want everything through their assistant. Tell us what works for you so we're not texting when you're in meetings or calling when you're asleep."
  },
  {
    id: 9,
    title: "Protection Profile Review",
    subtitle: "Complete your security assessment",
    question: "Please confirm your protection profile to unlock your security benefits.",
    type: "radio",
    options: [
      {
        id: "confirm_profile",
        label: "✅ Confirm Profile",
        value: "confirm_profile",
        description: "Profile is complete and accurate",
        examples: "*I confirm all information is correct and complete. Ready to proceed with personalized service recommendations. Authorize Armora to use this profile for service delivery."
      },
      {
        id: "need_modifications",
        label: "📝 Need Modifications",
        value: "need_modifications",
        description: "I'd like to review some answers",
        examples: "*I want to review and modify some of my responses. Take me back to edit specific sections. Save current progress and allow selective editing."
      },
      {
        id: "privacy_completion",
        label: "🔒 Complete with Maximum Privacy",
        value: "privacy_completion",
        description: "Complete setup with maximum privacy protection",
        examples: "*Proceed with service setup while maintaining the highest level of confidentiality. Our specialists will provide personalized consultation to understand your requirements. Complete discretion guaranteed throughout the process."
      }
    ],
    validation: { required: true, errorMessage: "Please confirm your profile to complete assessment" },
    helpText: "Almost there! Take a quick look to make sure everything's right before we configure your protection services.",
    stepDescription: "Take a quick look to make sure we've got everything right. This helps your Protection Officers prepare properly and ensures you get exactly the security service you're expecting. Think of it as your personal protection preferences saved for every assignment.",
    isLastStep: true,
    profileSummary: {
      showSummary: true,
      summaryCards: [
        {
          title: "📋 TRANSPORT PROFILE SUMMARY",
          fields: ["professionalProfile", "travelFrequency", "topPriorities"]
        },
        {
          title: "📍 COVERAGE SUMMARY", 
          fields: ["primaryAreas", "secondaryAreas"]
        },
        {
          title: "🔒 SECURITY & REQUIREMENTS",
          fields: ["safetyContact", "specialRequirements", "communicationPreferences"]
        }
      ]
    },
    legalConfirmations: {
      required: [
        {
          id: "accuracy_confirmation",
          text: "I confirm the information provided is accurate to the best of my knowledge",
          required: true
        },
        {
          id: "risk_assessment_understanding",
          text: "I understand this professional risk assessment helps provide enhanced security transport services",
          required: true
        },
        {
          id: "gdpr_consent",
          text: "I consent to data processing under GDPR Article 6(1)(f) - Legitimate Interests for service provision",
          required: true
        },
        {
          id: "data_rights_understanding",
          text: "I understand I can request data deletion or modification at any time",
          required: true
        },
        {
          id: "terms_agreement",
          text: "I have read and agree to the Terms of Service",
          required: true,
          link: "/terms-of-service"
        },
        {
          id: "privacy_policy_agreement", 
          text: "I have read and understand the Privacy Policy",
          required: true,
          link: "/privacy-policy"
        }
      ],
      optional: [
        {
          id: "research_participation",
          text: "I consent to service improvement research participation (Optional)",
          required: false,
          defaultChecked: false
        },
        {
          id: "industry_updates",
          text: "I consent to receiving security industry updates and insights (Optional)",
          required: false,
          defaultChecked: false
        },
        {
          id: "anonymized_research",
          text: "I consent to sharing anonymized data for industry safety research (Optional)",
          required: false,
          defaultChecked: false
        }
      ]
    },
    securityStatement: "This professional risk assessment is conducted as best practice within the security transport industry. Completion enables us to provide enhanced duty of care and operational efficiency. All information is stored securely and processed in accordance with UK GDPR requirements.",
    legalStatement: "By submitting this assessment, you acknowledge that: This is a voluntary professional service enhancement • No legal obligation exists to complete this assessment • Services remain available regardless of assessment completion • All data processing complies with UK Data Protection Act 2018 • You retain full rights over your personal data",
    serviceRecommendation: {
      enabled: true,
      confidenceThreshold: 85,
      previewFeatures: ["recommendedService", "keyFeatures", "coverageAreas", "estimatedValue"]
    }
  }
];

// Progressive Disclosure Step Generation Functions

/**
 * Generate Seven Ps Assessment Step based on risk level
 */
export function createSevenPsAssessmentStep(assessmentLevel: 'basic' | 'standard' | 'comprehensive'): QuestionnaireStep {
  const stepConfig = {
    basic: {
      title: "Basic Security Assessment (Seven Ps)",
      subtitle: "Essential security planning framework",
      question: "Complete the basic Seven Ps security assessment for enhanced protection planning.",
      description: "Basic Seven Ps framework covering essential protection elements: People, Places, Personality, and key security considerations."
    },
    standard: {
      title: "Standard Security Assessment (Seven Ps)",
      subtitle: "Comprehensive security planning framework",
      question: "Complete the standard Seven Ps security assessment for comprehensive protection protocols.",
      description: "Standard Seven Ps framework covering People, Places, Personality, Prejudices, Personal History, Political considerations, and Private Lifestyle for enhanced protection planning."
    },
    comprehensive: {
      title: "Comprehensive Security Assessment (Seven Ps)",
      subtitle: "Complete security planning framework",
      question: "Complete the comprehensive Seven Ps security assessment for maximum protection protocols.",
      description: "Comprehensive Seven Ps framework with detailed assessment of all security dimensions for critical protection requirements."
    }
  };

  const config = stepConfig[assessmentLevel];

  return {
    id: 2.6,
    title: config.title,
    subtitle: config.subtitle,
    question: config.question,
    type: "seven_ps_assessment",
    validation: {
      required: true,
      errorMessage: "Seven Ps security assessment is required for your protection level"
    },
    helpText: config.description,
    stepDescription: "The Seven Ps framework (People, Places, Personality, Prejudices, Personal History, Political, Private Lifestyle) provides comprehensive security assessment for professional close protection services."
  };
}

/**
 * Generate Enhanced Emergency Contacts Step
 */
export function createEnhancedEmergencyContactsStep(): QuestionnaireStep {
  return {
    id: 6.5,
    title: "Enhanced Emergency Contacts",
    subtitle: "Comprehensive emergency contact and medical information",
    question: "Please provide detailed emergency contact information including next of kin, medical contacts, and secondary contacts for enhanced security protocols.",
    type: "enhanced_emergency_contacts",
    validation: {
      required: true,
      errorMessage: "Enhanced emergency contacts are required for your security level"
    },
    helpText: "Enhanced security protocols require comprehensive emergency contact information including primary, secondary, medical, and decision-making contacts with full contact details and authorization levels.",
    stepDescription: "Your security assessment requires enhanced emergency contact protocols. This ensures we can coordinate appropriate response, medical care, and family communication during any security situations or emergencies."
  };
}

/**
 * Generate Risk Matrix Visualization Step
 */
export function createRiskMatrixStep(): QuestionnaireStep {
  return {
    id: 2.7,
    title: "Risk Assessment Matrix",
    subtitle: "Professional security risk visualization",
    question: "Review your personalized risk assessment matrix and recommended protection protocols.",
    type: "risk_matrix",
    validation: {
      required: false
    },
    helpText: "Your risk assessment has been calculated based on threat indicators, professional profile, and security requirements. This matrix shows your risk level and recommended protection services.",
    stepDescription: "Professional security risk matrix showing probability and impact assessment with specific protection recommendations tailored to your security profile."
  };
}

/**
 * Generate Medical Data Collection Step
 */
export function createMedicalDataStep(): QuestionnaireStep {
  return {
    id: 8.5,
    title: "Medical Information",
    subtitle: "Critical medical information for emergency response",
    question: "Please provide medical information necessary for emergency response protocols during protection services.",
    type: "input",
    validation: {
      required: true,
      errorMessage: "Medical information is required for critical security assessments"
    },
    helpText: "Critical security assessments require medical information to ensure appropriate emergency response, medical coordination, and proper care during protection services. This includes allergies, medications, conditions, and emergency procedures.",
    stepDescription: "Your security level requires medical information for emergency response protocols. This ensures our Protection Officers and emergency services can provide appropriate care and coordinate medical response if needed during assignments."
  };
}

// Note: Dynamic personalization functions have been moved to utils/dynamicPersonalization.ts

export const getQuestionsForUserType = (userType: string, userResponses?: Record<string, any>) => {
  // Get base questionnaire steps
  const baseSteps = [...questionnaireSteps];

  // If no responses yet, return base steps
  if (!userResponses) {
    return baseSteps;
  }

  // Calculate progressive steps based on risk assessment
  try {
    const assessmentPath = determineAssessmentPath(userResponses);
    const progressiveSteps = [...baseSteps];

    // Insert Seven Ps assessment step after threat assessment (step 2.5)
    if (assessmentPath.requiresSevenPs) {
      const sevenPsStep = createSevenPsAssessmentStep(assessmentPath.sevenPsLevel);
      const threatAssessmentIndex = progressiveSteps.findIndex(step => step.id === 2.5);
      if (threatAssessmentIndex !== -1) {
        progressiveSteps.splice(threatAssessmentIndex + 1, 0, sevenPsStep);
      }
    }

    // Insert enhanced emergency contacts after basic emergency contacts (step 6)
    if (assessmentPath.requiresEnhancedEmergencyContacts) {
      const enhancedContactsStep = createEnhancedEmergencyContactsStep();
      const emergencyContactsIndex = progressiveSteps.findIndex(step => step.id === 6);
      if (emergencyContactsIndex !== -1) {
        progressiveSteps.splice(emergencyContactsIndex + 1, 0, enhancedContactsStep);
      }
    }

    // Insert medical data collection for high-risk assessments
    if (assessmentPath.requiresMedicalData) {
      const medicalDataStep = createMedicalDataStep();
      const contactPrefsIndex = progressiveSteps.findIndex(step => step.id === 8);
      if (contactPrefsIndex !== -1) {
        progressiveSteps.splice(contactPrefsIndex + 1, 0, medicalDataStep);
      }
    }

    // Add risk matrix visualization step if threat assessment completed
    if (userResponses.step2_5 || userResponses.threatAssessment) {
      const riskMatrixStep = createRiskMatrixStep();
      const sevenPsIndex = progressiveSteps.findIndex(step => step.id === 2.6);
      const insertIndex = sevenPsIndex !== -1 ? sevenPsIndex + 1 :
                         progressiveSteps.findIndex(step => step.id === 2.5) + 1;
      progressiveSteps.splice(insertIndex, 0, riskMatrixStep);
    }

    return progressiveSteps;

  } catch (error) {
    console.warn('Progressive disclosure calculation failed, returning base steps:', error);
    return baseSteps;
  }
};
export const getTotalStepsForUserType = (userType: string, userResponses?: Record<string, any>) => {
  // Base questionnaire has 9 steps
  let totalSteps = 9;

  // If no responses provided, return base count
  if (!userResponses) {
    return totalSteps;
  }

  // Calculate additional steps based on risk assessment
  try {
    const assessmentPath = determineAssessmentPath(userResponses);

    // Add Seven Ps assessment step
    if (assessmentPath.requiresSevenPs) {
      totalSteps += 1;
    }

    // Add enhanced emergency contacts step
    if (assessmentPath.requiresEnhancedEmergencyContacts) {
      totalSteps += 1;
    }

    // Add medical data step for high-risk assessments
    if (assessmentPath.requiresMedicalData) {
      totalSteps += 1;
    }

    // Add risk matrix visualization step if threat assessment is completed
    if (userResponses.step2_5 || userResponses.threatAssessment) {
      totalSteps += 1;
    }

    return totalSteps;

  } catch (error) {
    console.warn('Dynamic step calculation failed, returning base count:', error);
    return 9;
  }
};
export const shouldShowConversionPrompt = (step: number) => false;
export const getConversionPromptForStep = (step: number) => null;
export const calculateProgress = (currentStep: number, totalSteps: number) => (currentStep / totalSteps) * 100;
export const validateStepData = (stepId: number, value: any, responses?: Record<string, any>) => {
  if (responses) {
    return validateProgressiveStepData(stepId, value, responses);
  }
  return { isValid: true };
};
export const getServiceRecommendation = (responses: Record<string, any>): string => {
  // Analyze responses to recommend appropriate service level
  const professionalProfile = responses.step1 || responses.professionalProfile;
  const serviceRequirements: string[] = responses.step3 || responses.serviceRequirements || [];
  const frequency = responses.step2 || responses.travelFrequency;
  const threatAssessment = responses.step2_5 || responses.threatAssessment;
  const sevenPsAssessment = responses.step2_6 || responses.sevenPsAssessment;
  const riskAssessment = responses.step2_5_riskAssessment || responses.riskAssessment;

  // Progressive disclosure-based recommendation
  try {
    const assessmentPath = determineAssessmentPath(responses);
    const protectionLevel = getProtectionLevelRecommendation(assessmentPath);

    // Map protection levels to service IDs
    const serviceMapping: Record<string, string> = {
      'Essential Protection': 'armora-standard',
      'Executive Shield': 'armora-executive',
      'Shadow Protocol': 'armora-shadow',
      'Shadow Protocol + Enhanced Response': 'armora-shadow'
    };

    const recommendedService = serviceMapping[protectionLevel];
    if (recommendedService) {
      return recommendedService;
    }
  } catch (error) {
    console.warn('Progressive service recommendation failed, using fallback logic:', error);
  }

  // Fallback logic - Enhanced with Seven Ps and threat assessment data

  // Critical threat indicators from threat assessment
  if (threatAssessment) {
    const criticalIndicators = [
      threatAssessment.hasReceivedThreats,
      threatAssessment.hasLegalProceedings,
      threatAssessment.hasPreviousIncidents
    ];

    if (criticalIndicators.some(indicator => indicator)) {
      return "armora-shadow";
    }
  }

  // Seven Ps assessment factors
  if (sevenPsAssessment) {
    const riskLevel = sevenPsAssessment.riskLevel;
    if (riskLevel === 'RED' || riskLevel === 'ORANGE') {
      return "armora-shadow";
    }
    if (riskLevel === 'YELLOW') {
      return "armora-executive";
    }
  }

  // Risk assessment matrix result
  if (riskAssessment) {
    const riskLevel = riskAssessment.level;
    if (riskLevel === 'RED' || riskLevel === 'ORANGE') {
      return "armora-shadow";
    }
    if (riskLevel === 'YELLOW') {
      return "armora-executive";
    }
  }

  // High-level professional profiles that typically need Executive or Shadow
  const executiveProfiles = ['executive', 'celebrity', 'diplomat', 'government'];
  const shadowProfiles = ['security_awareness', 'privacy_discretion'];

  // Check for executive indicators
  if (executiveProfiles.includes(professionalProfile)) {
    return serviceRequirements.includes('security_awareness') ? "armora-shadow" : "armora-executive";
  }

  // Check for security-focused requirements
  if (serviceRequirements.some((req: string) => shadowProfiles.includes(req))) {
    return "armora-shadow";
  }

  // Check for premium preferences
  if (serviceRequirements.includes('premium_comfort') || frequency === 'daily') {
    return "armora-executive";
  }

  // Default to standard
  return "armora-standard";
};

/**
 * Get the current risk level based on user responses
 */
export const getCurrentRiskLevel = (responses: Record<string, any>): 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' => {
  try {
    const assessmentPath = determineAssessmentPath(responses);
    return assessmentPath.riskLevel;
  } catch (error) {
    console.warn('Risk level calculation failed, defaulting to GREEN:', error);
    return 'GREEN';
  }
};

/**
 * Check if a specific step should be shown based on current responses
 */
export const shouldShowProgressiveStep = (stepId: number, responses: Record<string, any>): boolean => {
  const assessmentPath = determineAssessmentPath(responses);

  switch (stepId) {
    case 2.6: // Seven Ps Assessment
      return assessmentPath.requiresSevenPs;
    case 2.7: // Risk Matrix Visualization
      return !!(responses.step2_5 || responses.threatAssessment);
    case 6.5: // Enhanced Emergency Contacts
      return assessmentPath.requiresEnhancedEmergencyContacts;
    case 8.5: // Medical Data
      return assessmentPath.requiresMedicalData;
    default:
      return true; // Show all standard steps
  }
};

/**
 * Get the appropriate Seven Ps assessment level for current user
 */
export const getSevenPsLevel = (responses: Record<string, any>): 'basic' | 'standard' | 'comprehensive' => {
  const riskLevel = getCurrentRiskLevel(responses);
  return getSevenPsAssessmentLevel(riskLevel);
};

/**
 * Check if user needs immediate security consultation
 */
export const needsSecurityConsultation = (responses: Record<string, any>): boolean => {
  try {
    const assessmentPath = determineAssessmentPath(responses);
    return assessmentPath.riskLevel === 'RED' || assessmentPath.assessmentType === 'critical';
  } catch (error) {
    return false;
  }
};

/**
 * Get assessment completion percentage with progressive steps included
 */
export const getProgressiveCompletionPercentage = (currentStep: number, responses: Record<string, any>): number => {
  const totalSteps = getTotalStepsForUserType('any', responses);
  return Math.round((currentStep / totalSteps) * 100);
};

/**
 * Get next step ID in progressive flow
 */
export const getNextProgressiveStep = (currentStepId: number, responses: Record<string, any>): number => {
  const allSteps = getQuestionsForUserType('any', responses);
  const currentIndex = allSteps.findIndex(step => step.id === currentStepId);

  if (currentIndex !== -1 && currentIndex < allSteps.length - 1) {
    return allSteps[currentIndex + 1].id;
  }

  return currentStepId + 1; // Fallback to sequential numbering
};

/**
 * Get previous step ID in progressive flow
 */
export const getPreviousProgressiveStep = (currentStepId: number, responses: Record<string, any>): number => {
  const allSteps = getQuestionsForUserType('any', responses);
  const currentIndex = allSteps.findIndex(step => step.id === currentStepId);

  if (currentIndex > 0) {
    return allSteps[currentIndex - 1].id;
  }

  return currentStepId - 1; // Fallback to sequential numbering
};

/**
 * Validate progressive step data based on step type and risk level
 */
export const validateProgressiveStepData = (stepId: number, value: any, responses: Record<string, any>): { isValid: boolean; errorMessage?: string } => {
  // Enhanced validation based on progressive disclosure
  if (!shouldShowProgressiveStep(stepId, responses)) {
    return { isValid: true }; // Skip validation for steps that shouldn't be shown
  }

  switch (stepId) {
    case 2.5: // Threat Assessment
      if (!value || typeof value !== 'object') {
        return { isValid: false, errorMessage: 'Please complete the security threat assessment' };
      }
      break;

    case 2.6: // Seven Ps Assessment
      const sevenPsLevel = getSevenPsLevel(responses);
      if (sevenPsLevel === 'comprehensive' && (!value || Object.keys(value).length < 5)) {
        return { isValid: false, errorMessage: 'Comprehensive Seven Ps assessment requires detailed information' };
      }
      break;

    case 6.5: // Enhanced Emergency Contacts
      if (!value || !value.nextOfKin || !value.nextOfKin.name || !value.nextOfKin.primaryPhone) {
        return { isValid: false, errorMessage: 'Enhanced emergency contacts require next of kin information' };
      }
      break;

    case 8.5: // Medical Data
      if (!value || !value.emergencyProcedures) {
        return { isValid: false, errorMessage: 'Medical information is required for your security level' };
      }
      break;
  }

  return { isValid: true };
};

export const serviceData = {
  "armora-standard": {
    id: "armora-standard",
    name: "Essential Protection",
    description: "Professional security transport service",
    features: [
      "SIA Level 2 security-certified Protection Officers",
      "Eco-friendly Nissan Leaf EV fleet (discreet)",
      "Professional security protocols",
      "24/7 protection assignment availability",
      "Real-time safety monitoring",
      "Background-checked professionals",
      "Emergency response protocols"
    ],
    price: "£50/hour + £2.50/mile protection fees",
    confidence: 85,
    estimatedMonthly: "£400-800/month"
  },
  "armora-executive": {
    id: "armora-executive",
    name: "Executive Protection",
    description: "Premium security transport with enhanced amenities",
    features: [
      "Executive chauffeur service",
      "Premium vehicles (S-Class, 7-Series, A8)",
      "Enhanced security protocols",
      "Business facilities (WiFi, charging, privacy glass)",
      "Preferred Protection Officer assignment",
      "Airport meet & greet",
      "First aid trained Protection Officers",
      "SIA Close Protection Officers"
    ],
    price: "£75/hour + £2.50/mile security costs",
    confidence: 92,
    estimatedMonthly: "£600-1200/month"
  },
  "armora-shadow": {
    id: "armora-shadow",
    name: "Shadow Protocol",
    description: "Discrete security escort with trained protection officers",
    features: [
      "SIA Close Protection (CP) officers",
      "Unmarked discrete vehicles",
      "Advanced security protocols", 
      "Route security planning",
      "Counter-surveillance awareness",
      "Safety coordination protocols",
      "First aid trained Protection Officers"
    ],
    price: "£65/hour + £2.50/mile discrete coverage",
    confidence: 89,
    estimatedMonthly: "£520-1040/month",
    popular: true
  }
};

export default questionnaireSteps;