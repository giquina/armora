// Minimal questionnaire data for basic app functionality
import { QuestionnaireStep } from '../types';


// Complete 9-step questionnaire for Armora Security Transport
export const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: 1,
    title: "Professional Profile",
    subtitle: "Help us understand your security requirements",
    question: "Which of these best describes you and your transport needs?",
    type: "radio",
    options: [
      {
        id: "executive",
        label: "🏢 Are you an executive or business professional?",
        value: "executive",
        description: "Do you need reliable transport for high-stakes meetings, corporate events, or daily commutes? We understand that in your world, time is money and first impressions matter.",
        examples: "*Choose this if you hold a senior position and need transport that reflects your professional status."
      },
      {
        id: "entrepreneur", 
        label: "💼 Are you a business owner or entrepreneur?",
        value: "entrepreneur",
        description: "Are you building your empire, meeting investors, or managing multiple ventures? Your transport needs are as dynamic as your business decisions.",
        examples: "*Choose this if you own a business or are self-employed with professional transport needs."
      },
      {
        id: "celebrity",
        label: "🎭 Are you in entertainment or media?",
        value: "celebrity",
        description: "Do you need discrete transport to studios, premieres, or appearances? Whether you're in front of the camera or behind the scenes, privacy and timing are everything.",
        examples: "*Choose this if you're an actor, musician, TV personality, producer, or media professional."
      },
      {
        id: "athlete",
        label: "⚽ Are you a sports professional or athlete?", 
        value: "athlete",
        description: "Do you need transport to training, competitions, or sports events? We understand the importance of arriving relaxed and focused on your performance.",
        examples: "*Choose this if you're an athlete, coach, or sports professional."
      },
      {
        id: "government",
        label: "🏛️ Are you a government or public sector official?",
        value: "government", 
        description: "Do your responsibilities require secure, punctual transport to sensitive locations? Whether it's council meetings, government buildings, or public events, we understand protocol matters.",
        examples: "*Choose this if you work in any level of government, civil service, or public administration."
      },
      {
        id: "diplomat",
        label: "🌍 Are you part of an international delegation?",
        value: "diplomat",
        description: "Are you coordinating transport for diplomatic visits, international business groups, or foreign delegations? Protocol and cultural sensitivity are paramount.",
        examples: "*Choose this if you're organizing or part of international group travel."
      },
      {
        id: "medical",
        label: "🏥 Are you a senior healthcare professional?",
        value: "medical",
        description: "Do you move between hospitals, clinics, or urgent calls? Perhaps you need reliable transport after exhausting shifts or for important medical conferences?",
        examples: "*Choose this if you're a doctor, surgeon, senior nurse, or healthcare administrator."
      },
      {
        id: "legal",
        label: "⚖️ Are you a legal professional?",
        value: "legal",
        description: "Do you need dependable transport between courts, chambers, and client meetings? We know your reputation depends on punctuality and maintaining client confidentiality.",
        examples: "*Choose this if you're a barrister, solicitor, judge, or other legal professional requiring discrete transport."
      },
      {
        id: "creative",
        label: "🎨 Are you a creative professional?",
        value: "creative",
        description: "Are you an artist, designer, or creative consultant moving between studios, galleries, or client presentations? Your creative energy shouldn't be wasted on travel stress.",
        examples: "*Choose this if you work in creative industries."
      },
      {
        id: "academic",
        label: "🎓 Are you an academic or educational professional?",
        value: "academic",
        description: "Do you travel between universities, conferences, or research facilities? Perhaps you're a visiting professor or education administrator who values intellectual conversation during commutes?",
        examples: "*Choose this if you work in education, research, or academic administration."
      },
      {
        id: "student",
        label: "📚 Are you a student?",
        value: "student",
        description: "Are you studying at university or college? Need safe transport for late library sessions, social events, or trips home? We understand student life has unique transport needs.",
        examples: "*Choose this if you're currently in full-time education."
      },
      {
        id: "international_visitor",
        label: "✈️ Are you visiting the UK?",
        value: "international_visitor",
        description: "Are you here for tourism, temporary work, or visiting family? Do you need reliable transport to explore safely without worrying about navigation or parking?",
        examples: "*Choose this if you're a tourist or temporary visitor to the UK."
      },
      {
        id: "finance",
        label: "📊 Are you a financial services professional?",
        value: "finance",
        description: "Do you work in banking, investment, or insurance? Are early morning market hours and late client dinners part of your routine? Your transport should match your professional standards.",
        examples: "*Choose this if you work in finance, banking, trading, or insurance at any level."
      },
      {
        id: "security",
        label: "🛡️ Are you in security or law enforcement?",
        value: "security",
        description: "Do you work in private security, police services, or military? You understand protocols and appreciate professional standards in transport services.",
        examples: "*Choose this if you're in any security, police, or military role requiring civilian transport."
      },
      {
        id: "family",
        label: "👨‍👩‍👧‍👦 Are you looking for secure family transport?",
        value: "family",
        description: "Do you need safe, reliable transport for your loved ones? Whether it's school runs, family outings, or airport transfers, your family's safety and comfort come first.",
        examples: "*Choose this if you're primarily booking for family activities and personal use."
      },
      {
        id: "general",
        label: "🚗 Are you looking for general premium transport?",
        value: "general",
        description: "Do you simply want reliable, comfortable transport without specific professional requirements? Sometimes you just need a dependable ride.",
        examples: "*Choose this if you need quality transport but don't fit other specific categories."
      },
      {
        id: "high_profile",
        label: "🔒 Are you a high-profile individual requiring maximum discretion?",
        value: "high_profile",
        description: "Is your privacy paramount? Do you need the highest level of discretion and security for your movements? We understand some clients need invisible excellence.",
        examples: "*Choose this if you require enhanced security measures and complete confidentiality."
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
    helpText: "Tell us about yourself so we can match you with the perfect transport experience. There are no wrong answers - just honest ones.",
    isFirstStep: true,
    processOverview: {
      timeRequired: "8-9 minutes",
      benefits: [
        "Personalized security recommendations",
        "Matched with appropriate protection level",
        "Optimized routing and driver selection",
        "Exclusive 50% discount on first booking"
      ],
      securityAssurance: "All responses are encrypted and used exclusively for service matching. Your privacy is our priority."
    },
    stepDescription: "Tell us what you do so we can match you with the right drivers. A CEO might need someone who understands business confidentiality, while a student might prefer a friendly driver who knows the best late-night food spots. It's all about finding your perfect match."
  },
  {
    id: 2,
    title: "Travel Frequency",
    subtitle: "Understanding your transport patterns",
    question: "How often will you need our services?",
    type: "radio",
    options: [
      {
        id: "daily",
        label: "📅 Do you need daily transport?",
        value: "daily",
        description: "Is secure transport part of your everyday routine? Whether it's your commute to work or multiple daily appointments, we'll become part of your daily life.",
        examples: "*Choose this if you need transport 5 or more times per week."
      },
      {
        id: "weekly",
        label: "🗓️ Do you need regular business transport?",
        value: "weekly",
        description: "Are you traveling for business several times a week? Client meetings, office visits, or regular business entertainment?",
        examples: "*Choose this if you need transport 2-4 times per week."
      },
      {
        id: "monthly",
        label: "📆 Do you need monthly transport?",
        value: "monthly",
        description: "Are your transport needs periodic? Monthly board meetings, regular check-ups, or social events?",
        examples: "*Choose this if you need transport 1-3 times per month."
      },
      {
        id: "project_based",
        label: "🎯 Do you have project-based transport needs?",
        value: "project_based",
        description: "Is your need temporary but intensive? Perhaps a film shoot, business project, or temporary assignment?",
        examples: "*Choose this if you need intensive transport for specific time periods."
      },
      {
        id: "unpredictable",
        label: "❓ Are your transport needs unpredictable?",
        value: "unpredictable",
        description: "Is your schedule too variable to predict? Last-minute meetings or spontaneous travel requirements?",
        examples: "*Choose this if you can't predict your transport frequency."
      },
      {
        id: "special_events",
        label: "🎪 Do you only need transport for special events?",
        value: "special_events",
        description: "Are you looking for transport just for important occasions? Galas, premieres, or special celebrations?",
        examples: "*Choose this if you only need occasional event transport."
      },
      {
        id: "seasonal",
        label: "🏦 Are you here for holiday or tourist purposes?",
        value: "seasonal",
        description: "Are you visiting the UK for leisure? Need reliable transport to explore without the stress of driving?",
        examples: "*Choose this if you're a tourist or holiday visitor."
      },
      {
        id: "weekly_appointments",
        label: "📅 Do you have weekly appointments?",
        value: "weekly_appointments",
        description: "Do you have regular weekly commitments? Perhaps standing meetings, medical appointments, or social engagements?",
        examples: "*Choose this if you need transport 1-2 times per week."
      },
      {
        id: "biweekly",
        label: "🗓️ Do you travel every other week?",
        value: "biweekly",
        description: "Is your schedule more spread out? Perhaps alternating between offices or bi-weekly business trips?",
        examples: "*Choose this if you need transport every other week."
      },
      {
        id: "quarterly",
        label: "📆 Do you travel quarterly?",
        value: "quarterly",
        description: "Are your transport needs tied to quarterly business cycles? Perhaps investor meetings or seasonal events?",
        examples: "*Choose this if you need transport every few months."
      },
      {
        id: "term_time",
        label: "🎓 Do you need term-time transport only?",
        value: "term_time",
        description: "Are your transport needs tied to the academic calendar? University terms or school schedules?",
        examples: "*Choose this if you're a student needing term-time transport."
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
    helpText: "Knowing your rhythm helps us be ready when you need us. Whether daily or occasionally, we adapt to your life.",
    stepDescription: "How often you travel helps us serve you better. Daily commuters get familiar drivers who learn your favorite routes and coffee order. Occasional riders get our most flexible drivers who are great with new destinations. It's like having a regular barista versus a helpful concierge."
  },
  {
    id: 3,
    title: "Service Requirements",
    subtitle: "What matters most to you",
    question: "What would make your journey perfect? Tell us everything that matters to you.",
    type: "checkbox",
    options: [
      {
        id: "privacy_discretion",
        label: "🔒 Is absolute privacy and confidentiality essential?",
        value: "privacy_discretion",
        description: "Do your conversations and destinations need to remain completely confidential? No questions asked?",
        examples: "*Select this if discretion is paramount to your needs."
      },
      {
        id: "security_awareness",
        label: "🛡️ Do you need security that blends in seamlessly?",
        value: "security_awareness",
        description: "Would you feel safer knowing trained professionals are watching over you without drawing unwanted attention to your movements?",
        examples: "*Select this if you want protection without the obvious security presence."
      },
      {
        id: "luxury_comfort",
        label: "🚗 Do you expect the best vehicles?",
        value: "luxury_comfort",
        description: "Is the vehicle itself part of your image? Do you need premium cars that make the right statement?",
        examples: "*Select this if vehicle quality and presentation matter to you."
      },
      {
        id: "professional_service",
        label: "👤 Is your driver's presentation crucial for your image?",
        value: "professional_service",
        description: "Do your drivers need to match your professional standards when meeting clients or arriving at important events?",
        examples: "*Select this if your driver's appearance reflects on your reputation."
      },
      {
        id: "reliability_tracking",
        label: "⏰ Is punctuality absolutely critical?",
        value: "reliability_tracking",
        description: "Can't afford to be late? Is your schedule so precise that every minute counts?",
        examples: "*Select this if being on time is non-negotiable for you."
      },
      {
        id: "flexibility_coverage",
        label: "📁 Do you need 24/7 availability?",
        value: "flexibility_coverage",
        description: "Are your hours unpredictable? Early flights, late meetings, or middle-of-the-night emergencies?",
        examples: "*Select this if you need round-the-clock service availability."
      },
      {
        id: "specialized_needs",
        label: "👥 Do you need group or family transport?",
        value: "specialized_needs",
        description: "Are you booking for multiple people? Need vehicles that accommodate your entire family or team?",
        examples: "*Select this if you regularly need multi-passenger transport."
      },
      {
        id: "communication_skills",
        label: "💬 Do you value excellent communication?",
        value: "communication_skills",
        description: "Do you need drivers who can engage professionally when needed but also respect when you need quiet time?",
        examples: "*Select this if driver communication skills matter to you."
      },
      {
        id: "route_knowledge",
        label: "🗺️ Do you need expert route planning?",
        value: "route_knowledge",
        description: "Want to avoid traffic, know shortcuts, or need someone who truly knows the city inside out?",
        examples: "*Select this if journey efficiency and route knowledge are important."
      },
      {
        id: "real_time_tracking",
        label: "📱 Do you want real-time tracking and updates?",
        value: "real_time_tracking",
        description: "Do you or your team need to track journeys, receive updates, or coordinate schedules digitally?",
        examples: "*Select this if you want full digital visibility of your transport."
      },
      {
        id: "trained_professionals",
        label: "🛡️ Do you prefer highly trained professional drivers?",
        value: "trained_professionals",
        description: "Would you feel more confident with drivers who have advanced professional training and situational awareness?",
        examples: "*Select this if you want drivers with enhanced professional qualifications."
      },
      {
        id: "payment_flexibility",
        label: "💳 Do you need flexible payment options?",
        value: "payment_flexibility",
        description: "Do you need corporate billing, multiple payment methods, or special invoicing arrangements?",
        examples: "*Select this if standard payment doesn't suit your needs."
      },
      {
        id: "multi_city_coverage",
        label: "🌍 Do you travel across multiple cities?",
        value: "multi_city_coverage",
        description: "Do you need consistent service whether you're in London, Manchester, or Edinburgh?",
        examples: "*Select this if you need nationwide coverage."
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer not to say",
        value: "prefer_not_to_say",
        description: "That's great. We'll adapt to your needs as we learn what works best for you.",
        examples: "*Our specialists will provide adaptable service recommendations based on your booking patterns while maintaining complete confidentiality about your specific requirements."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 5, errorMessage: "Please select 1-5 requirements" },
    helpText: "Pick what matters most to you (select 1-5 options). Every detail helps us create your perfect transport experience.",
    stepDescription: "What matters most to you? Some prefer chatty drivers, others want quiet rides. Some need help with luggage, others value privacy. Your preferences help us pick drivers who naturally match your style - no awkward rides."
  },
  {
    id: 4,
    title: "Primary Coverage Areas",
    subtitle: "Where do you need service most",
    question: "Where do you need us most? Tell us your regular locations.",
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
        label: "🏭 Do you regularly need transport in Manchester?",
        value: "financial_district",
        description: "Are you part of the Northern Powerhouse? From MediaCity to the business district, we cover all of Greater Manchester.",
        examples: "*Select this if Manchester is a regular destination."
      },
      {
        id: "government_quarter",
        label: "🏙️ Do you frequently travel to Birmingham?",
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
        description: "Are you constantly catching flights? Whether it's Heathrow at 5am or a late arrival at Gatwick, we'll get you there stress-free.",
        examples: "*Select this if you regularly need airport transfers."
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
        label: "🏨 Do you stay at luxury hotels?",
        value: "entertainment_events",
        description: "Are five-star hotels your second home? Do you need drivers who understand luxury hospitality standards?",
        examples: "*Select this if you regularly use high-end hotels."
      },
      {
        id: "luxury_shopping",
        label: "⚖️ Do you visit government buildings or courts?",
        value: "luxury_shopping",
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
    helpText: "Choose your regular haunts. We'll make sure we're always ready where you need us most.",
    stepDescription: "Where you travel helps us assign drivers who really know those areas. They'll know the quickest routes, best pickup spots, and even which areas to avoid during rush hour. Local knowledge makes every journey smoother."
  },
  {
    id: 5,
    title: "Secondary Coverage",
    subtitle: "Additional service areas",
    question: "Do any of these special locations or situations apply to you?",
    type: "checkbox",
    options: [
      {
        id: "london_suburbs",
        label: "✈️ Do you frequently fly from UK airports?",
        value: "london_suburbs",
        description: "Are you constantly catching flights? Whether it's Heathrow at 5am or a late arrival at Gatwick, we'll get you there stress-free.",
        examples: "*Select this if you regularly need airport transfers."
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
        label: "🏨 Do you stay at luxury hotels?",
        value: "private_aviation",
        description: "Are five-star hotels your second home? Do you need drivers who understand luxury hospitality standards?",
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
    helpText: "These are optional extras. Pick any that matter to your travel needs.",
    stepDescription: "Airports, hotels, event venues - these places have their own rules and tricks. Drivers familiar with these spots know exactly where to pick you up, which entrances to use, and how to skip the chaos. No more confusion at Terminal 3."
  },
  {
    id: 6,
    title: "Safety Contact",
    subtitle: "For your safety and peace of mind",
    question: "Who should we contact if needed? (This is optional but helps us serve you better)",
    type: "checkbox",
    options: [
      {
        id: "primary_safety_contact",
        label: "👪 Do you have someone who worries about your safety?",
        value: "primary_safety_contact",
        description: "Is there someone special who likes to know you've arrived safely? A partner, family member, or assistant who coordinates your life?",
        examples: "*Provide their details if you'd like us to keep them informed for safety coordination."
      },
      {
        id: "business_safety_contact",
        label: "🏢 Does your company have security protocols?",
        value: "business_safety_contact",
        description: "Does your organization have specific procedures we should follow? A security office or HR department we should coordinate with?",
        examples: "*Provide company contacts if corporate protocols apply to you."
      },
      {
        id: "medical_alert_information",
        label: "🏥 Medical Alert Information",
        value: "medical_alert_information",
        description: "Important medical information for safety coordination",
        examples: "*Critical medical alerts (allergies, medical devices, mobility assistance needs), preferred hospital, or medical insurance information for safety coordination."
      },
      {
        id: "security_coordination",
        label: "🛡️ Security Team Coordination",
        value: "security_coordination",
        description: "Corporate security or protection team contacts",
        examples: "*Company security office, personal protection team, or designated security coordinator who manages your security protocols and safety procedures."
      },
      {
        id: "communication_preferences",
        label: "📞 Priority Communication Preferences",
        value: "communication_preferences",
        description: "How you prefer to be contacted for urgent matters",
        examples: "*Preferred contact methods (phone, text, email), priority communication protocols, safe words for verification, or specific instructions for urgent situations."
      },
      {
        id: "family_notification",
        label: "👨‍👩‍👧‍👦 Family Notification Protocol",
        value: "family_notification",
        description: "Family members who should be informed of incidents",
        examples: "*Immediate family members, their contact details, notification preferences, and any specific family communication protocols for safety coordination."
      },
      {
        id: "no_safety_contact",
        label: "❌ No Safety Contact Required",
        value: "no_safety_contact",
        description: "I prefer not to provide safety contact information",
        examples: "*Skip safety contact setup. Note: This may limit our ability to provide immediate assistance or coordination during urgent situations."
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer not to say",
        value: "prefer_not_to_say",
        description: "That's great. We'll adapt to your needs as we learn what works best for you.",
        examples: "*Our specialists will use standard safety protocols while maintaining complete confidentiality about your personal contacts and safety preferences."
      }
    ],
    validation: { required: false, minSelections: 0, maxSelections: 6, errorMessage: "Please select your safety contact preferences" },
    helpText: "These details help us take better care of you. All information stays completely private.",
    stepDescription: "Having someone we can contact in emergencies gives everyone peace of mind. Like having ICE contacts in your phone, but for your journeys. It's optional but recommended - just in case you ever need help."
  },
  {
    id: 7,
    title: "Special Requirements",
    subtitle: "Any additional needs",
    question: "Is there anything special we should know to serve you perfectly?",
    type: "checkbox",
    options: [
      {
        id: "accessibility_needs",
        label: "♿ Accessibility Needs",
        value: "accessibility_needs",
        description: "Mobility, visual, hearing, and cognitive assistance",
        examples: "*Wheelchair Accessible Vehicle Required, Walking Aid Accommodation (canes, walkers, mobility scooters), Transfer Assistance Needed, Extended Time for Boarding/Alighting, Ground Floor Pickup Preferred, Accessible Pickup/Dropoff Points Only"
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
        description: "Multiple passengers and family needs",
        examples: "*Child Safety Seats Required (specify ages/weights), Family Group Transport (specify ages), Business Team Coordination, Multiple Vehicle Coordination, Security Detail Coordination, Group Communication Requirements"
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
        description: "Traveling with animals",
        examples: "*Small Pet Carrier (cats, small dogs), Large Dog Transport, Multiple Pet Transport, Pet Safety Equipment Required, Veterinary Documentation Assistance, Pet Comfort Amenities"
      },
      {
        id: "security_preferences",
        label: "🔒 Security Preferences",
        value: "security_preferences",
        description: "Privacy and security accommodations",
        examples: "*Discrete/Unmarked Vehicles Only, Female Driver/Security Preferred, Male Driver/Security Preferred, Same Driver Assignment Preferred, Route Confidentiality Required, Counter-Surveillance Awareness"
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
    helpText: "Tell us about anything that would make your journey more comfortable. We're here to help.",
    stepDescription: "Everyone's different. Maybe you travel with a wheelchair, maybe you have a service dog, or maybe you just need extra time getting in and out. Whatever you need, we'll make sure your driver is prepared and comfortable helping."
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
        description: "Text messages for booking confirmations and driver updates",
        examples: "*Real-time booking confirmations, driver arrival notifications, journey progress updates, and immediate security alerts delivered via SMS. Best for busy professionals who check messages frequently."
      },
      {
        id: "email_communication",
        label: "📧 Email Communications",
        value: "email_communication",
        description: "Detailed email confirmations and documentation",
        examples: "*Professional email communications with booking confirmations, detailed journey information, receipts, and comprehensive documentation. Best for formal business environments and record keeping."
      },
      {
        id: "app_notifications",
        label: "🔔 App Notifications",
        value: "app_notifications",
        description: "Push notifications through Armora Transport app",
        examples: "*Modern push notifications through our secure mobile app, including real-time tracking, driver updates, and booking management. Best for tech-savvy users seeking streamlined experience."
      },
      {
        id: "phone_calls",
        label: "📞 Phone Calls",
        value: "phone_calls",
        description: "Voice communication for important updates",
        examples: "*Direct phone calls from our operations team for important updates, booking confirmations, and security coordination. Best for senior executives preferring traditional business communication."
      },
      {
        id: "through_assistant",
        label: "👤 Through Personal Assistant",
        value: "through_assistant",
        description: "All communications via personal assistant or PA",
        examples: "*All transport communications directed through your personal assistant or PA, including booking coordination, updates, and scheduling. Best for C-level executives and high-profile individuals."
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
        examples: "*Important transport situations may override preferences for immediate contact via available methods. Driver safety updates, schedule changes, and urgent coordination delivered immediately for service continuity."
      },
      {
        id: "privacy_minimal",
        label: "🔕 Privacy & Minimal Contact",
        value: "privacy_minimal",
        description: "Essential communications only with maximum privacy",
        examples: "*Driver arrival notifications and priority communications only. Discrete, minimal interruption approach with strong privacy protection. Best for privacy-focused users and confidential transport needs."
      },
      {
        id: "no_communications",
        label: "❌ No Non-Essential Communications",
        value: "no_communications",
        description: "Driver coordination only, no booking communications",
        examples: "*Direct driver coordination only. No booking confirmations, updates, or administrative communications. Priority alerts still delivered for safety and security purposes."
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
    title: "Profile Review",
    subtitle: "Complete your security assessment",
    question: "Does everything look correct? You're almost ready for premium transport.",
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
    helpText: "Almost there! Take a quick look to make sure everything's right before we get started.",
    stepDescription: "Take a quick look to make sure we've got everything right. This helps your drivers prepare properly and ensures you get exactly the service you're expecting. Think of it as your personal travel preferences saved for every ride.",
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

// Note: Dynamic personalization functions have been moved to utils/dynamicPersonalization.ts

export const getQuestionsForUserType = (userType: string) => questionnaireSteps;
export const getTotalStepsForUserType = (userType: string) => 9;
export const shouldShowConversionPrompt = (step: number) => false;
export const getConversionPromptForStep = (step: number) => null;
export const calculateProgress = (currentStep: number, totalSteps: number) => (currentStep / totalSteps) * 100;
export const validateStepData = (stepId: number, value: any) => ({ isValid: true });
export const getServiceRecommendation = (responses: Record<string, any>): string => {
  // Analyze responses to recommend appropriate service level
  const professionalProfile = responses.step1 || responses.professionalProfile;
  const serviceRequirements: string[] = responses.step3 || responses.serviceRequirements || [];
  const frequency = responses.step2 || responses.travelFrequency;
  
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
  
  // Check for luxury preferences
  if (serviceRequirements.includes('luxury_comfort') || frequency === 'daily') {
    return "armora-executive";
  }
  
  // Default to standard
  return "armora-standard";
};

export const serviceData = {
  "armora-standard": {
    id: "armora-standard",
    name: "Armora Secure",
    description: "Professional security transport service",
    features: [
      "SIA Level 2 security-certified drivers",
      "Eco-friendly Nissan Leaf EV fleet (discreet)",
      "Professional security protocols",
      "24/7 booking availability",
      "Real-time safety monitoring",
      "Background-checked professionals",
      "Emergency response protocols"
    ],
    price: "£45/hour",
    confidence: 85,
    estimatedMonthly: "£360-720"
  },
  "armora-executive": {
    id: "armora-executive", 
    name: "Armora Executive",
    description: "Luxury security transport with enhanced amenities",
    features: [
      "Executive chauffeur service",
      "Luxury vehicles (S-Class, 7-Series, A8)",
      "Enhanced security protocols",
      "Business facilities (WiFi, charging, privacy glass)",
      "Preferred driver assignment",
      "Airport meet & greet",
      "First aid trained drivers",
      "SIA Close Protection Officers"
    ],
    price: "£75/hour",
    confidence: 92,
    estimatedMonthly: "£600-1200"
  },
  "armora-shadow": {
    id: "armora-shadow",
    name: "Armora Shadow", 
    description: "Discrete security escort with trained protection officers",
    features: [
      "SIA Close Protection (CP) officers",
      "Unmarked discrete vehicles",
      "Advanced security protocols", 
      "Route security planning",
      "Counter-surveillance awareness",
      "Safety coordination protocols",
      "First aid trained drivers"
    ],
    price: "£65/hour",
    confidence: 89,
    estimatedMonthly: "£520-1040",
    popular: true
  }
};

export default questionnaireSteps;