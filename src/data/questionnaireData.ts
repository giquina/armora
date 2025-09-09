// Minimal questionnaire data for basic app functionality
import { QuestionnaireStep } from '../types';


// Complete 9-step questionnaire for Armora Security Transport
export const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: 1,
    title: "Professional Profile",
    subtitle: "Help us understand your security requirements",
    question: "What best describes your professional role?",
    type: "radio",
    options: [
      {
        id: "executive",
        label: "Executive/C-Suite",
        value: "executive",
        description: "Senior business leaders requiring private transport for confidential meetings",
        examples: "Including CEOs, Directors, Board Members, and other senior executives - for business meetings, client presentations, corporate events, and similar professional activities. Our professional drivers understand the importance of confidentiality and provide a secure environment for sensitive business discussions during your journey."
      },
      {
        id: "entrepreneur", 
        label: "Entrepreneur/Business Owner",
        value: "entrepreneur",
        description: "Business owners with flexible schedules and important meetings",
        examples: "Including startup founders, business owners, investors, consultants, and other entrepreneurs - for investor meetings, networking events, business presentations, and similar opportunities. Our reliable service ensures you arrive on time and prepared for crucial business activities."
      },
      {
        id: "celebrity",
        label: "Public Figure/Celebrity",
        value: "celebrity",
        description: "Well-known individuals who value privacy and discretion",
        examples: "Including actors, musicians, TV personalities, influencers, and other public figures - for premieres, appearances, private events, and media activities. Our experienced team knows how to avoid unwanted attention and ensures your complete privacy during transport."
      },
      {
        id: "athlete",
        label: "Professional Athlete", 
        value: "athlete",
        description: "Sports professionals with training schedules and competitions",
        examples: "Including football players, Olympic athletes, tennis professionals, and other sports professionals - for training, competitions, sponsorship events, team activities, and related commitments. Our drivers understand the importance of punctuality for training and maintain optimal vehicle conditions for your comfort."
      },
      {
        id: "government",
        label: "Government Official",
        value: "government", 
        description: "Public servants requiring secure and reliable transport",
        examples: "Including Ministers, MPs, civil servants, councillors, and other government officials - for official duties, government meetings, public events, and administrative responsibilities. Our vetted drivers have security clearance and understand government requirements for safe document transport."
      },
      {
        id: "diplomat",
        label: "Diplomat/International Representative",
        value: "diplomat",
        description: "International officials with diplomatic status and security needs",
        examples: "Including ambassadors, embassy staff, trade representatives, consular officers, and other diplomatic personnel - for diplomatic meetings, official functions, international events, and embassy duties. Our professionally trained drivers understand diplomatic protocols and work with embassy security teams."
      },
      {
        id: "medical",
        label: "Medical Professional",
        value: "medical",
        description: "Healthcare professionals requiring urgent and dependable transport",
        examples: "Including doctors, surgeons, medical consultants, specialists, and other healthcare professionals - for hospital visits, emergency calls, medical conferences, patient consultations, and related medical duties. Our 24/7 service provides priority response for medical emergencies and maintains the highest hygiene standards."
      },
      {
        id: "legal",
        label: "Legal Professional",
        value: "legal",
        description: "Legal professionals requiring confidential and punctual transport",
        examples: "Including barristers, solicitors, judges, legal advisors, paralegals, and other legal professionals - for court appearances, client meetings, legal proceedings, law firm activities, and related legal matters. Our drivers understand the importance of punctuality for court sessions and ensure secure transport of sensitive legal documents."
      },
      {
        id: "creative",
        label: "Creative/Entertainment Professional",
        value: "creative",
        description: "Artists and performers with studio sessions and venue requirements",
        examples: "Including directors, producers, designers, performers, artists, musicians, and other creative professionals - for studio work, premieres, creative meetings, performances, exhibitions, and artistic events. Our flexible service adapts to creative industry schedules and safely transports valuable equipment when needed."
      },
      {
        id: "academic",
        label: "Academic/Educational Professional",
        value: "academic",
        description: "University and education professionals requiring reliable transport",
        examples: "Including professors, researchers, education executives, teachers, and other academic professionals - for conferences, university travel, academic events, research activities, and educational commitments. Our service understands academic schedules and provides a comfortable environment for preparation during your journey."
      },
      {
        id: "student",
        label: "Student/Academic Learner",
        value: "student",
        description: "Students requiring safe transport for campus and social activities",
        examples: "Including university students, graduate researchers, student leaders, international students, and other academic learners - for campus events, internships, late-night study sessions, academic activities, and student commitments. Our security-trained drivers provide safe transport when campus services aren't available, especially during late hours."
      },
      {
        id: "international_visitor",
        label: "International Visitor/Tourist",
        value: "international_visitor",
        description: "Foreign visitors requiring navigation assistance and secure transport",
        examples: "Including business travelers, VIP tourists, visiting delegations, cultural visitors, and other international guests - for sightseeing, business visits, cultural events, tourism activities, and travel needs. Our knowledgeable drivers provide local guidance and ensure safe navigation for visitors unfamiliar with the area."
      },
      {
        id: "prefer_not_to_say",
        label: "Prefer not to say",
        value: "prefer_not_to_say",
        description: "Skip this question while maintaining maximum privacy and service flexibility",
        examples: "Our security specialists will provide adaptable service recommendations based on your actual booking patterns while maintaining complete confidentiality about your professional background and specific requirements."
      }
    ],
    validation: { required: true, errorMessage: "Please select your professional profile" },
    helpText: "This helps us understand your specific security requirements.",
    isFirstStep: true,
    processOverview: {
      timeRequired: "2-3 minutes",
      benefits: [
        "Personalized security recommendations",
        "Matched with appropriate protection level",
        "Optimized routing and driver selection",
        "Exclusive 50% discount on first booking"
      ],
      securityAssurance: "All responses are encrypted and used exclusively for service matching. Your privacy is our priority."
    },
    stepDescription: "Select your professional category for personalized transport recommendations. We are a specialized taxi and private hire service - our SIA-licensed drivers provide both professional chauffeur services and trained security awareness for your protection."
  },
  {
    id: 2,
    title: "Travel Frequency",
    subtitle: "Understanding your transport patterns",
    question: "How frequently do you anticipate using our security transport services?",
    type: "radio",
    options: [
      {
        id: "daily",
        label: "Daily commuting and regular trips",
        value: "daily",
        description: "Consistent transport for busy professionals with predictable schedules",
        examples: "Including daily office commutes, regular meetings, business appointments, and other routine professional activities."
      },
      {
        id: "weekly",
        label: "Weekly for business or personal needs",
        value: "weekly",
        description: "Regular weekly commitments and important appointments",
        examples: "Including weekly conferences, court dates, investor meetings, networking events, and other scheduled professional obligations."
      },
      {
        id: "monthly",
        label: "Monthly for special occasions",
        value: "monthly",
        description: "Important events where professional image and security matter",
        examples: "Including board meetings, industry events, VIP occasions, private celebrations, and other significant professional commitments."
      },
      {
        id: "project_based",
        label: "Project-based or intensive periods",
        value: "project_based",
        description: "Transport during specific time periods or major undertakings",
        examples: "Including film shoots, conference seasons, campaign periods, major business deals, and other time-limited intensive activities."
      },
      {
        id: "emergency",
        label: "Emergency and last-minute needs",
        value: "emergency",
        description: "On-call transport for urgent and unexpected situations",
        examples: "Including medical emergencies, urgent business matters, security concerns, last-minute changes, and other immediate transport requirements."
      },
      {
        id: "special_events",
        label: "Special events and VIP occasions only",
        value: "special_events",
        description: "Exclusive transport for high-profile events and celebrations",
        examples: "Including premieres, award ceremonies, state functions, wedding celebrations, charity galas, and other special occasions."
      },
      {
        id: "seasonal",
        label: "Seasonal or holiday use",
        value: "seasonal",
        description: "Transport needs that vary by season or specific times",
        examples: "Including holiday periods, tourist visits, conference seasons, festival attendance, and other seasonal activities."
      },
      {
        id: "prefer_not_to_say",
        label: "Prefer not to say",
        value: "prefer_not_to_say",
        description: "Skip this question while maintaining maximum privacy and service flexibility",
        examples: "Our specialists will provide adaptable service recommendations based on your booking patterns while maintaining complete confidentiality."
      }
    ],
    validation: { required: true, errorMessage: "Please select your travel frequency requirements" },
    helpText: "This helps us understand your transport patterns for service planning and threat assessment frequency requirements.",
    stepDescription: "Understanding your frequency patterns allows us to optimize our service recommendations and ensure appropriate security protocols are in place for your specific needs."
  },
  {
    id: 3,
    title: "Service Requirements",
    subtitle: "What matters most to you",
    question: "Which security features are most important?",
    type: "checkbox",
    options: [
      {
        id: "privacy_discretion",
        label: "Privacy & Discretion",
        value: "privacy_discretion",
        description: "Low-profile service, confidential transport, unmarked vehicles",
        examples: "Professional drivers in business attire, unmarked premium vehicles, confidential route planning, privacy screens, and strict confidentiality agreements ensuring your business remains private."
      },
      {
        id: "security_awareness",
        label: "Security-Aware Service",
        value: "security_awareness",
        description: "Trained security drivers, secure routing, situational awareness",
        examples: "SIA-trained drivers with security awareness, intelligent route planning to avoid potential risks, knowledge of secure alternative routes, and proactive security measures during transport."
      },
      {
        id: "luxury_comfort",
        label: "Luxury & Comfort",
        value: "luxury_comfort",
        description: "Premium vehicles, executive amenities, business facilities",
        examples: "High-end Mercedes, BMW, Audi vehicles with leather interiors, climate control, WiFi connectivity, charging ports, privacy glass, and mobile office setup for working during travel."
      },
      {
        id: "professional_service",
        label: "Professional Service",
        value: "professional_service",
        description: "Uniformed drivers, executive etiquette, door service",
        examples: "Smartly dressed professional drivers, executive service training, door service, luggage assistance, multilingual capability, and maintaining professional demeanor throughout your journey."
      },
      {
        id: "reliability_tracking",
        label: "Reliability & Communication",
        value: "reliability_tracking",
        description: "On-time guarantee, live tracking, real-time updates",
        examples: "Guaranteed punctual arrivals, live GPS tracking accessible to you, automated notifications, journey progress updates, traffic monitoring, and real-time communication of any changes."
      },
      {
        id: "flexibility_coverage",
        label: "Flexibility & Coverage",
        value: "flexibility_coverage",
        description: "24/7 availability, multi-city service, airport transfers",
        examples: "Round-the-clock booking availability, service across major UK cities, seamless airport coordination, intercity transport, and consistent service standards regardless of location or time."
      },
      {
        id: "specialized_needs",
        label: "Specialized Requirements",
        value: "specialized_needs",
        description: "Group transport, accessibility, luggage handling, corporate billing",
        examples: "Large capacity vehicles, wheelchair accessibility, child safety seats, secure luggage handling, group coordination, corporate account setup, and flexible payment arrangements."
      },
      {
        id: "prefer_not_to_say",
        label: "Prefer not to say",
        value: "prefer_not_to_say",
        description: "Skip this question while maintaining maximum privacy and service flexibility",
        examples: "Our specialists will provide adaptable service recommendations based on your booking patterns while maintaining complete confidentiality about your specific requirements."
      }
    ],
    validation: { required: true, minSelections: 2, maxSelections: 5, errorMessage: "Please select 2-5 requirements" },
    helpText: "Select 2-5 most important features. There are no wrong answers - this helps us match appropriate service levels.",
    stepDescription: "Choose the security and service features that matter most to you. We'll use your selections to recommend the most suitable Armora service level and match you with appropriately trained drivers."
  },
  {
    id: 4,
    title: "Primary Coverage Areas",
    subtitle: "Where do you need service most",
    question: "Select your primary locations for secure transport:",
    type: "checkbox",
    options: [
      {
        id: "central_london",
        label: "Central London",
        value: "central_london",
        description: "Zone 1 - City, Westminster, Holborn, Covent Garden",
        examples: "Central London business district, financial heart, government quarter, and prime commercial areas with high security requirements."
      },
      {
        id: "financial_district",
        label: "Financial District",
        value: "financial_district",
        description: "Canary Wharf, Bank, Liverpool Street, Bishopsgate",
        examples: "Major banking centers, financial institutions, corporate headquarters, and business meetings requiring executive transport with security awareness."
      },
      {
        id: "government_quarter",
        label: "Government Quarter",
        value: "government_quarter",
        description: "Westminster, Whitehall, Parliament, Embassies",
        examples: "Government offices, diplomatic missions, parliamentary meetings, and official state functions requiring enhanced security protocols and discretion."
      },
      {
        id: "west_end",
        label: "West End",
        value: "west_end",
        description: "Mayfair, Marylebone, Fitzrovia, Soho",
        examples: "Premium shopping district, luxury hotels, high-end restaurants, private clubs, and exclusive venues for VIP clients and business entertainment."
      },
      {
        id: "greater_london",
        label: "Greater London",
        value: "greater_london",
        description: "Inner & Outer London - Zones 2-6, business parks, residential",
        examples: "Extended London areas including business parks, premium residential areas, and corporate facilities outside central London requiring secure transport."
      },
      {
        id: "airport_transfers",
        label: "Airport Transfers",
        value: "airport_transfers",
        description: "Heathrow, Gatwick, Stansted, Luton, City Airport, major stations",
        examples: "All major London airports and rail terminals with secure transport for business travelers, VIPs, and passengers requiring enhanced security measures."
      },
      {
        id: "tourist_destinations",
        label: "Tourist Destinations & Attractions",
        value: "tourist_destinations",
        description: "Royal palaces, historic sites, luxury tourist experiences",
        examples: "Buckingham Palace, Windsor Castle, Tower of London, British Museum, and premium day trips to Bath, Oxford, Stonehenge for VIP tourism experiences."
      },
      {
        id: "entertainment_events",
        label: "Entertainment & Events",
        value: "entertainment_events",
        description: "West End theaters, concerts, sporting events, premieres",
        examples: "Royal Albert Hall, O2 Arena, Wimbledon, Royal Ascot, film premieres, and exclusive entertainment venues requiring VIP transport and security awareness."
      },
      {
        id: "luxury_shopping",
        label: "Luxury Shopping & Leisure",
        value: "luxury_shopping",
        description: "Bond Street, Harrods, private clubs, fine dining",
        examples: "High-end shopping districts, exclusive members clubs, Michelin-starred restaurants, luxury spas, and premium leisure venues for discerning clients."
      },
      {
        id: "healthcare_professional",
        label: "Healthcare & Professional Services",
        value: "healthcare_professional",
        description: "Harley Street, private hospitals, legal chambers, consultancies",
        examples: "Private medical facilities, specialist clinics, legal chambers, consultancy firms, and professional services requiring confidential transport arrangements."
      },
      {
        id: "major_uk_cities",
        label: "Major UK Cities",
        value: "major_uk_cities",
        description: "Manchester, Birmingham, Leeds, Liverpool, and other business centers",
        examples: "Inter-city business travel to major UK commercial centers, airports, and business districts with coordinated secure transport across multiple cities."
      },
      {
        id: "university_business_towns",
        label: "University & Business Towns",
        value: "university_business_towns",
        description: "Oxford, Cambridge, Reading, Brighton - education and tech centers",
        examples: "Academic institutions, research centers, technology corridors, and professional towns requiring executive transport for education and business purposes."
      },
      {
        id: "scotland_wales",
        label: "Scotland & Wales",
        value: "scotland_wales",
        description: "Edinburgh, Glasgow, Cardiff - major centers and business districts",
        examples: "Cross-border transport to Scottish and Welsh business centers, government facilities, and major commercial areas with consistent security standards."
      },
      {
        id: "international_specialized",
        label: "International & Specialized",
        value: "international_specialized",
        description: "Dover ports, event venues, motorsport, royal venues",
        examples: "Channel ports, NEC Birmingham, Silverstone, Windsor, and specialized venues requiring coordinated transport with enhanced security protocols."
      },
      {
        id: "prefer_not_to_say",
        label: "Prefer not to say",
        value: "prefer_not_to_say",
        description: "For security, privacy, or confidentiality reasons",
        examples: "Our security specialists will provide flexible UK-wide coverage recommendations while maintaining complete confidentiality about your specific location requirements and movement patterns."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 8, errorMessage: "Please select 1-8 coverage areas" },
    helpText: "Select 1-8 areas where you most frequently need secure transport. We'll prioritize driver availability and security protocols in these locations.",
    stepDescription: "Choose the geographic areas where you most frequently require secure transport services. This helps us ensure appropriate driver coverage, security protocols, and local expertise in your priority locations."
  },
  {
    id: 5,
    title: "Secondary Coverage",
    subtitle: "Additional service areas",
    question: "Any additional areas you visit regularly?",
    type: "checkbox",
    options: [
      {
        id: "london_suburbs",
        label: "🏘️ London Suburbs",
        value: "london_suburbs",
        description: "Outer London areas",
        examples: "Outer London Boroughs - Zones 4-6, suburban residential areas, Commuter Towns - Surrounding Greater London, satellite towns, Residential Estates - Gated communities, private developments"
      },
      {
        id: "business_parks",
        label: "🏢 Business Parks",
        value: "business_parks",
        description: "Corporate campuses and offices",
        examples: "Technology Parks - Science parks, tech campuses, innovation centers, Corporate Headquarters - Multi-national offices, business complexes, Industrial Estates - Manufacturing sites, logistics centers, Research Facilities - R&D centers, pharmaceutical companies"
      },
      {
        id: "event_venues",
        label: "🎭 Event Venues",
        value: "event_venues",
        description: "Hotels, conference centers, theaters",
        examples: "Conference Centers - Exhibition halls, convention facilities, Luxury Hotels - 5-star properties, boutique hotels, private dining, Entertainment Venues - West End theaters, concert halls, galleries, Sports Facilities - Wimbledon, Wembley, racing venues, private boxes"
      },
      {
        id: "private_aviation",
        label: "✈️ Private Aviation",
        value: "private_aviation",
        description: "Business jets and specialized airport services",
        examples: "Private Jet Terminals - FBOs, business aviation facilities, Helicopter Services - Private helipads, charter helicopter access, Military Airfields - RAF bases with civilian VIP access, General Aviation - Private aircraft facilities, flying clubs"
      },
      {
        id: "healthcare_medical",
        label: "🏥 Healthcare & Medical",
        value: "healthcare_medical",
        description: "Private hospitals and specialist clinics",
        examples: "Private Hospitals - Harley Street, specialist medical centers, Consultant Clinics - Private healthcare, specialist appointments, Wellness Centers - Medical spas, health retreats, recovery facilities, Emergency Medical - Priority hospital access, urgent medical care"
      },
      {
        id: "educational_training",
        label: "🎓 Educational & Training",
        value: "educational_training",
        description: "Universities, schools, and professional development",
        examples: "Universities - Oxford, Cambridge, London universities, campus visits, Private Schools - Independent schools, international schools, Training Centers - Corporate training, professional development, Examination Centers - Professional certifications, testing facilities"
      },
      {
        id: "leisure_recreation",
        label: "⛳ Leisure & Recreation",
        value: "leisure_recreation",
        description: "Golf clubs, country estates, and exclusive venues",
        examples: "Golf Clubs - Private courses, exclusive clubs, tournament venues, Country Estates - Private estates, shooting parties, rural properties, Spa & Wellness - Luxury spas, health clubs, retreat centers, Sporting Clubs - Tennis clubs, sailing clubs, exclusive sports venues"
      },
      {
        id: "cultural_heritage",
        label: "🏛️ Cultural & Heritage",
        value: "cultural_heritage",
        description: "Museums, galleries, and historic venues",
        examples: "Museums & Galleries - Private viewings, cultural events, exhibitions, Historic Houses - National Trust properties, stately homes, castles, Royal Venues - Palace events, royal occasions, state functions, Cultural Events - Opera, ballet, classical concerts, art openings"
      },
      {
        id: "luxury_shopping_dining",
        label: "🛍️ Luxury Shopping & Dining",
        value: "luxury_shopping_dining",
        description: "High-end retail and exclusive dining experiences",
        examples: "Bond Street & Mayfair - Luxury shopping, designer boutiques, Private Members Clubs - Exclusive clubs, gentlemen's clubs, Michelin Restaurants - Fine dining, exclusive culinary experiences, Auction Houses - Sotheby's, Christie's, art and antique auctions"
      },
      {
        id: "security_government",
        label: "🔒 Security & Government",
        value: "security_government",
        description: "Specialized secure locations and official venues",
        examples: "Embassy District - Diplomatic missions, consular services, Government Buildings - Secure facilities, official meetings, Legal Chambers - Inns of Court, barristers' chambers, tribunals, Corporate Security - Secure corporate facilities, sensitive meetings"
      },
      {
        id: "none_required",
        label: "❌ None Required",
        value: "none_required",
        description: "If no additional coverage needed",
        examples: "I only need coverage in my primary areas, My requirements are fully covered by primary locations"
      },
      {
        id: "prefer_not_to_say",
        label: "Prefer not to say",
        value: "prefer_not_to_say",
        description: "Skip this question while maintaining maximum privacy and service flexibility",
        examples: "Our specialists will provide flexible coverage recommendations while maintaining complete confidentiality about your additional location requirements."
      }
    ],
    validation: { required: false },
    helpText: "Optional - helps us ensure coverage for all your needs. Select any specialized locations you might need. Airport transfers and event venues require enhanced security protocols.",
    stepDescription: "Select any additional areas where you might occasionally need secure transport. These optional selections help us ensure comprehensive coverage and appropriate security protocols for specialized locations."
  },
  {
    id: 6,
    title: "Emergency Contact",
    subtitle: "For your safety and peace of mind",
    question: "Who should we contact in an emergency?",
    type: "checkbox",
    options: [
      {
        id: "primary_emergency_contact",
        label: "Primary Emergency Contact",
        value: "primary_emergency_contact",
        description: "Main person to contact in case of emergency",
        examples: "Full name, relationship (spouse/partner, family member), primary phone number, and alternative contact method. This ensures rapid communication during any urgent situations."
      },
      {
        id: "business_emergency_contact",
        label: "Business Emergency Contact",
        value: "business_emergency_contact",
        description: "Corporate or professional emergency contact",
        examples: "Executive assistant, company security office, HR department, or corporate travel coordinator who can assist with business-related emergencies and decision-making."
      },
      {
        id: "medical_alert_information",
        label: "Medical Alert Information",
        value: "medical_alert_information",
        description: "Important medical information for emergency response",
        examples: "Critical medical alerts (allergies, medical devices, mobility assistance needs), preferred hospital, or medical insurance information for emergency medical situations."
      },
      {
        id: "security_coordination",
        label: "Security Team Coordination",
        value: "security_coordination",
        description: "Corporate security or protection team contacts",
        examples: "Company security office, personal protection team, or designated security coordinator who manages your security protocols and emergency response procedures."
      },
      {
        id: "communication_preferences",
        label: "Emergency Communication Preferences",
        value: "communication_preferences",
        description: "How you prefer to be contacted during emergencies",
        examples: "Preferred contact methods (phone, text, email), emergency communication protocols, safe words for verification, or specific instructions for emergency situations."
      },
      {
        id: "family_notification",
        label: "Family Notification Protocol",
        value: "family_notification",
        description: "Family members who should be informed of incidents",
        examples: "Immediate family members, their contact details, notification preferences, and any specific family communication protocols for emergency situations."
      },
      {
        id: "no_emergency_contact",
        label: "No Emergency Contact Required",
        value: "no_emergency_contact",
        description: "I prefer not to provide emergency contact information",
        examples: "Skip emergency contact setup. Note: This may limit our ability to provide immediate assistance or coordination during emergency situations."
      },
      {
        id: "prefer_not_to_say",
        label: "Prefer not to say",
        value: "prefer_not_to_say",
        description: "Skip this question while maintaining maximum privacy and service flexibility",
        examples: "Our specialists will use standard emergency protocols while maintaining complete confidentiality about your personal contacts and emergency preferences."
      }
    ],
    validation: { required: false, minSelections: 0, maxSelections: 6, errorMessage: "Please select your emergency contact preferences" },
    helpText: "Select the types of emergency contacts you'd like to set up. All information is encrypted and used only for emergency response coordination.",
    stepDescription: "Choose how we should handle emergency situations and who to contact if needed. This helps us provide appropriate emergency response coordination while respecting your privacy preferences."
  },
  {
    id: 7,
    title: "Special Requirements",
    subtitle: "Any additional needs",
    question: "Do you have any special requirements?",
    type: "checkbox",
    options: [
      {
        id: "accessibility_needs",
        label: "♿ Accessibility Needs",
        value: "accessibility_needs",
        description: "Mobility, visual, hearing, and cognitive assistance",
        examples: "Wheelchair Accessible Vehicle Required, Walking Aid Accommodation (canes, walkers, mobility scooters), Transfer Assistance Needed, Extended Time for Boarding/Alighting, Ground Floor Pickup Preferred, Accessible Pickup/Dropoff Points Only"
      },
      {
        id: "visual_hearing_support",
        label: "👁️ Visual & Hearing Support",
        value: "visual_hearing_support",
        description: "Communication and sensory assistance",
        examples: "Guide Dog Accommodation, Large Print Materials Needed, Audio Communication Preferred, Sign Language Interpretation, Written Communication Preferred, Hearing Loop Compatibility Required"
      },
      {
        id: "medical_considerations",
        label: "🏥 Medical Considerations",
        value: "medical_considerations",
        description: "Special medical requirements",
        examples: "Oxygen Equipment Transport, Medical Device Power Requirements, Temperature-Controlled Environment Needed, Medication Storage Requirements, Infection Control Protocols, Medical Equipment Transport"
      },
      {
        id: "language_preferences",
        label: "🗣️ Language Preferences",
        value: "language_preferences",
        description: "Communication in preferred language",
        examples: "English (Primary), Welsh (Cymraeg), French (Français), German (Deutsch), Spanish (Español), Mandarin (中文), Arabic (العربية), Other Language Required"
      },
      {
        id: "group_family_transport",
        label: "👥 Group & Family Transport",
        value: "group_family_transport",
        description: "Multiple passengers and family needs",
        examples: "Child Safety Seats Required (specify ages/weights), Family Group Transport (specify ages), Business Team Coordination, Multiple Vehicle Coordination, Security Detail Coordination, Group Communication Requirements"
      },
      {
        id: "luggage_equipment",
        label: "🧳 Luggage & Equipment",
        value: "luggage_equipment",
        description: "Special cargo and equipment handling",
        examples: "Oversized Items Regular Transport, Sports Equipment Transport, Musical Instruments, Art/Antique Transport, Technical Equipment, Secure Document Transport, Diplomatic Pouch Handling"
      },
      {
        id: "pet_transport",
        label: "🐕 Pet Transport",
        value: "pet_transport",
        description: "Traveling with animals",
        examples: "Small Pet Carrier (cats, small dogs), Large Dog Transport, Multiple Pet Transport, Pet Safety Equipment Required, Veterinary Documentation Assistance, Pet Comfort Amenities"
      },
      {
        id: "security_preferences",
        label: "🔒 Security Preferences",
        value: "security_preferences",
        description: "Privacy and security accommodations",
        examples: "Discrete/Unmarked Vehicles Only, Female Driver/Security Preferred, Male Driver/Security Preferred, Same Driver Assignment Preferred, Route Confidentiality Required, Counter-Surveillance Awareness"
      },
      {
        id: "business_facilities",
        label: "💼 Business Facilities",
        value: "business_facilities",
        description: "Work and communication needs",
        examples: "Mobile Office Setup, WiFi and Charging Required, Conference Call Capability, Privacy Glass/Partition, Quiet Environment Essential, Business Refreshments"
      },
      {
        id: "environment_comfort",
        label: "🌡️ Environment & Comfort",
        value: "environment_comfort",
        description: "Climate and comfort preferences",
        examples: "Climate-Controlled Environment, Allergy Management Protocols, Scent-Free Environment, Quiet/Low-Stimulation Environment, Dietary Restrictions (refreshments), Specific Vehicle Type Preference"
      },
      {
        id: "technology_requirements",
        label: "📱 Technology Requirements",
        value: "technology_requirements",
        description: "Communication and device needs",
        examples: "Mobile Signal Boosters, Multiple Device Charging, Satellite Communication, Emergency Communication Backup, Real-Time Tracking Privacy, Communication Blackout Periods"
      },
      {
        id: "no_special_requirements",
        label: "❌ No Special Requirements",
        value: "no_special_requirements",
        description: "Standard service is sufficient",
        examples: "I have no special requirements, Standard VIP service meets all my needs"
      },
      {
        id: "prefer_not_to_say",
        label: "Prefer not to say",
        value: "prefer_not_to_say",
        description: "Skip this question while maintaining maximum privacy and service flexibility",
        examples: "Our specialists will provide standard service arrangements while maintaining complete confidentiality about any specific requirements you may have."
      }
    ],
    validation: { required: false, minSelections: 0, maxSelections: 12, errorMessage: "Please select your special requirements" },
    helpText: "Select any accommodations or special requirements. We ensure all passengers receive appropriate support for comfortable transport.",
    stepDescription: "Choose any special requirements or accommodations needed for your transport. All information is encrypted and used only to ensure our drivers and vehicles are prepared to provide the best possible service for your specific needs."
  },
  {
    id: 8,
    title: "Contact Preferences",
    subtitle: "How you'd like to hear from us",
    question: "Preferred communication method:",
    type: "checkbox",
    options: [
      {
        id: "sms_updates",
        label: "SMS Updates",
        value: "sms_updates",
        description: "Text messages for booking confirmations and driver updates",
        examples: "Real-time booking confirmations, driver arrival notifications, journey progress updates, and immediate security alerts delivered via SMS. Best for busy professionals who check messages frequently."
      },
      {
        id: "email_communication",
        label: "Email Communications",
        value: "email_communication",
        description: "Detailed email confirmations and documentation",
        examples: "Professional email communications with booking confirmations, detailed journey information, receipts, and comprehensive documentation. Best for formal business environments and record keeping."
      },
      {
        id: "app_notifications",
        label: "App Notifications",
        value: "app_notifications",
        description: "Push notifications through Armora Transport app",
        examples: "Modern push notifications through our secure mobile app, including real-time tracking, driver updates, and booking management. Best for tech-savvy users seeking streamlined experience."
      },
      {
        id: "phone_calls",
        label: "Phone Calls",
        value: "phone_calls",
        description: "Voice communication for important updates",
        examples: "Direct phone calls from our operations team for important updates, booking confirmations, and security coordination. Best for senior executives preferring traditional business communication."
      },
      {
        id: "through_assistant",
        label: "Through Personal Assistant",
        value: "through_assistant",
        description: "All communications via personal assistant or PA",
        examples: "All transport communications directed through your personal assistant or PA, including booking coordination, updates, and scheduling. Best for C-level executives and high-profile individuals."
      },
      {
        id: "business_contact",
        label: "Business/Corporate Contact",
        value: "business_contact",
        description: "Communications through company contact",
        examples: "All communications routed through designated business contact, travel coordinator, or corporate security office. Ideal for company-managed transport arrangements and corporate protocols."
      },
      {
        id: "secure_messaging",
        label: "Secure Messaging Platform",
        value: "secure_messaging",
        description: "Encrypted messaging for sensitive communications",
        examples: "End-to-end encrypted messaging platform for security-sensitive communications, route information, and confidential transport coordination. Best for high-security requirements."
      },
      {
        id: "communication_timing",
        label: "Communication Timing Preferences",
        value: "communication_timing",
        description: "Specific timing and frequency preferences",
        examples: "Business hours only (9:00-17:00 GMT), extended hours (8:00-20:00), custom hours, or 24/7 availability for emergencies. Includes time zone considerations for international clients."
      },
      {
        id: "emergency_override",
        label: "Emergency Communication Protocol",
        value: "emergency_override",
        description: "How to handle urgent security situations",
        examples: "Emergency situations override all preferences with immediate contact via all available methods. Security alerts, driver safety updates, and urgent coordination delivered immediately regardless of timing preferences."
      },
      {
        id: "privacy_minimal",
        label: "Privacy & Minimal Contact",
        value: "privacy_minimal",
        description: "Essential communications only with maximum privacy",
        examples: "Driver arrival notifications and emergency communications only. Discrete, minimal interruption approach with strong privacy protection. Best for privacy-focused users and confidential transport needs."
      },
      {
        id: "no_communications",
        label: "No Non-Essential Communications",
        value: "no_communications",
        description: "Driver coordination only, no booking communications",
        examples: "Direct driver coordination only. No booking confirmations, updates, or administrative communications. Emergency alerts still delivered for safety and security purposes."
      },
      {
        id: "prefer_not_to_say",
        label: "Prefer not to say",
        value: "prefer_not_to_say",
        description: "Skip this question while maintaining maximum privacy and service flexibility",
        examples: "Our specialists will use standard professional communication methods while maintaining complete confidentiality about your preferred contact and communication preferences."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 8, errorMessage: "Please select 1-8 communication preferences" },
    helpText: "Select your preferred communication methods and settings. Clear communication is essential for effective security operations while respecting your privacy preferences.",
    stepDescription: "Choose how you'd like to receive transport communications, from booking confirmations to emergency alerts. Emergency situations will override preferences to ensure your safety and security coordination."
  },
  {
    id: 9,
    title: "Profile Review",
    subtitle: "Complete your security assessment",
    question: "Review and confirm your security transport profile:",
    type: "radio",
    options: [
      {
        id: "confirm_profile",
        label: "✅ Confirm Profile",
        value: "confirm_profile",
        description: "Profile is complete and accurate",
        examples: "I confirm all information is correct and complete. Ready to proceed with personalized service recommendations. Authorize Armora to use this profile for service delivery."
      },
      {
        id: "need_modifications",
        label: "📝 Need Modifications",
        value: "need_modifications",
        description: "I'd like to review some answers",
        examples: "I want to review and modify some of my responses. Take me back to edit specific sections. Save current progress and allow selective editing."
      },
      {
        id: "privacy_completion",
        label: "🔒 Complete with Maximum Privacy",
        value: "privacy_completion",
        description: "Complete setup with maximum privacy protection",
        examples: "Proceed with service setup while maintaining the highest level of confidentiality. Our specialists will provide personalized consultation to understand your requirements. Complete discretion guaranteed throughout the process."
      }
    ],
    validation: { required: true, errorMessage: "Please confirm your profile to complete assessment" },
    helpText: "Review your complete security profile. This comprehensive assessment ensures we deliver the most appropriate protection service.",
    stepDescription: "Your security transport profile is now complete. Review the summary below and confirm to access personalized service recommendations and begin booking premium VIP transport services.",
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
          fields: ["emergencyContact", "specialRequirements", "communicationPreferences"]
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
    name: "Armora Standard",
    description: "Professional security transport service",
    features: [
      "Professional SIA-licensed drivers",
      "Premium vehicles (Mercedes, BMW, Audi)",
      "Basic security protocols",
      "24/7 booking availability",
      "Real-time tracking"
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
      "Airport meet & greet"
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
      "Emergency response coordination"
    ],
    price: "£65/hour",
    confidence: 89,
    estimatedMonthly: "£520-1040",
    popular: true
  }
};

export default questionnaireSteps;