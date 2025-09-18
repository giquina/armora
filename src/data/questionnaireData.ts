// Close Protection Officer questionnaire data for SIA-licensed security services
import { QuestionnaireStep } from '../types';

// Complete 9-step Close Protection Officer questionnaire for Armora Security Services
export const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: 1,
    title: "🛡️ Tell us about yourself",
    subtitle: "Understanding your security needs",
    question: "Which best describes your security requirements?",
    type: "radio",
    options: [
      {
        id: "corporate_executive",
        label: "🏢 Corporate Executive",
        value: "corporate_executive",
        description: "Board-level executives requiring protection during sensitive negotiations, hostile takeovers, shareholder meetings, and corporate espionage situations. CPOs trained in corporate protocols and boardroom security.",
        examples: "\"Security needed for hostile takeover meetings?\" • \"Protection required during shareholder presentations?\" • \"Are corporate espionage threats a concern?\""
      },
      {
        id: "business_owner",
        label: "💼 Business Owner",
        value: "business_owner",
        description: "Entrepreneurs and SME owners facing competitor surveillance, acquisition threats, and targeted business crime. Flexible protection adapting to unpredictable schedules and varied threat profiles.",
        examples: "\"Back-to-back investor pitch meetings planned?\" • \"Are competitors conducting surveillance?\" • \"Major acquisition deals being negotiated?\""
      },
      {
        id: "entertainment_public_figure",
        label: "🎭 Entertainment/Public Figure",
        value: "entertainment_public_figure",
        description: "Celebrities, performers, and media personalities requiring protection from stalkers, paparazzi, and fan interactions. CPOs trained in crowd control and privacy management.",
        examples: "\"Do paparazzi follow you everywhere?\" • \"Red carpet premieres to attend?\" • \"Do fans wait outside your home daily?\""
      },
      {
        id: "sports_professional",
        label: "⚽ Sports Professional/Athlete",
        value: "sports_professional",
        description: "Athletes needing protection at training facilities, competitions, and public appearances. CPOs understand performance schedules and coordinate with team security.",
        examples: "\"Safe transport needed to training facilities?\" • \"Do fans crowd you after matches?\" • \"International competition travel required?\""
      },
      {
        id: "government_public_sector",
        label: "🏛️ Government/Public Sector",
        value: "government_public_sector",
        description: "Officials requiring CPOs with security clearance, understanding of government protocols, and coordination with police protection units.",
        examples: "\"Classified documents carried daily?\" • \"State ceremonies attended regularly?\" • \"Clearance-aware protection officers required?\""
      },
      {
        id: "international_delegation",
        label: "🌍 International Delegation",
        value: "international_delegation",
        description: "Foreign visitors and diplomatic missions requiring UK threat assessment, cultural security adaptation, and international protection coordination.",
        examples: "\"Part of an international delegation?\" • \"Serving in a diplomatic mission?\" • \"Visiting UK for foreign business?\""
      },
      {
        id: "healthcare_professional",
        label: "🏥 Healthcare Professional",
        value: "healthcare_professional",
        description: "Medical professionals requiring protection at hospitals, clinics, and conferences. CPOs trained in medical facility protocols and patient confidentiality.",
        examples: "\"Are you a doctor or surgeon?\" • \"Do you work on-call schedules?\" • \"Medical conferences to attend?\""
      },
      {
        id: "legal_professional",
        label: "⚖️ Legal Professional",
        value: "legal_professional",
        description: "Lawyers, barristers, and legal staff requiring court security, witness protection protocols, and secure document handling during sensitive cases.",
        examples: "\"Are you a lawyer or barrister?\" • \"Court appearances required?\" • \"Sensitive legal cases handled?\""
      },
      {
        id: "creative_professional",
        label: "🎨 Creative Professional",
        value: "creative_professional",
        description: "Artists, designers, and creators requiring studio security, intellectual property protection, and secure transport of valuable works.",
        examples: "\"Are you an artist or designer?\" • \"Do you create valuable works?\" • \"Gallery openings to attend?\""
      },
      {
        id: "academic_educational",
        label: "🎓 Academic/Educational",
        value: "academic_educational",
        description: "Professors and researchers requiring campus security, conference protection, and intellectual property safeguarding.",
        examples: "\"Are you a professor or researcher?\" • \"Do you work on campus?\" • \"Sensitive research conducted?\""
      },
      {
        id: "student",
        label: "👨‍🎓 Student",
        value: "student",
        description: "Students requiring late study session protection, exam period security, campus escort services, and library safety protocols.",
        examples: "\"Are you a university student?\" • \"Safe late-night library access needed?\" • \"Campus escort services required?\""
      },
      {
        id: "international_visitor",
        label: "🌐 International Visitor",
        value: "international_visitor",
        description: "Overseas clients requiring UK security orientation, threat landscape briefing, and protection while navigating unfamiliar environments.",
        examples: "\"Visiting UK as a tourist?\" • \"Here for business visits?\" • \"Unfamiliar with UK security?\""
      },
      {
        id: "financial_services",
        label: "💰 Financial Services",
        value: "financial_services",
        description: "Banking and finance professionals requiring protection from insider threats, secure data transport, and trading floor security protocols.",
        examples: "\"Do you work in banking or finance?\" • \"Do you work on trading floors?\" • \"Financial data security handled?\""
      },
      {
        id: "security_law_enforcement",
        label: "🛡️ Security/Law Enforcement",
        value: "security_law_enforcement",
        description: "Current or former security professionals requiring peer protection with tactical coordination and enhanced operational security.",
        examples: "\"Are you current or former police?\" • \"Military or security professional?\" • \"Off-duty protection needed?\""
      },
      {
        id: "family_protection",
        label: "👨‍👩‍👧‍👦 Family Protection",
        value: "family_protection",
        description: "Families requiring comprehensive protection including school run security, residential safety, and age-appropriate interaction with children.",
        examples: "\"Family protection needed?\" • \"School run security required?\" • \"Residential security for household needed?\""
      },
      {
        id: "general_premium_protection",
        label: "🔒 General Premium Protection",
        value: "general_premium_protection",
        description: "Clients requiring standard close protection without sector-specific protocols but with full SIA-licensed professional security.",
        examples: "\"General protection services needed?\" • \"No specific industry requirements?\" • \"None of the above categories apply?\""
      },
      {
        id: "high_profile_individual",
        label: "🔐 High-Profile Individual",
        value: "high_profile_individual",
        description: "Individuals facing specific, credible threats requiring maximum security including counter-surveillance and threat assessment.",
        examples: "\"Specific credible threats faced?\" • \"Maximum security required?\" • \"Counter-surveillance and advanced threat assessment needed?\""
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer Not to Say",
        value: "prefer_not_to_say",
        description: "Confidential threat assessment with security requirements discussed privately with senior protection coordinators.",
        examples: "\"Prefer to discuss requirements confidentially?\" • \"Cannot disclose role publicly?\" • \"Discretion about identity required?\""
      }
    ],
    validation: { required: true, errorMessage: "Please select your protection requirements" },
    helpText: "Our Close Protection Officers specialise in different threat environments and security protocols. Each sector has unique risks - corporate espionage, public exposure, targeted crime, or personal threats. We assign CPOs with specific experience in your sector's security challenges.",
    isFirstStep: true,
    processOverview: {
      timeRequired: "8-9 minutes",
      benefits: [
        "Personalized protection recommendations",
        "Matched with appropriate security level",
        "Optimized threat assessment and CPO selection",
        "Exclusive 50% discount on first security engagement"
      ],
      securityAssurance: "All responses are encrypted and used exclusively for security matching. Your safety is our priority."
    },
    stepDescription: "Tell us your sector so we can match you with the right CPOs. A CEO might need officers who understand corporate espionage, while a celebrity might prefer specialists in crowd control and paparazzi management. It's all about finding your perfect protection match."
  },
  {
    id: 2,
    title: "⏰ How often do you need security services?",
    subtitle: "Understanding your security patterns",
    question: "How often do you need security coverage?",
    type: "radio",
    options: [
      {
        id: "daily_protection_detail",
        label: "📅 Daily Protection Detail",
        value: "daily_protection_detail",
        description: "Full-time CPO coverage 5-7 days per week. Dedicated team familiar with your routines, contacts, and evolving threat landscape.",
        examples: "\"Protection needed 5+ times per week?\" • \"Daily high-risk schedules involved?\" • \"Continuous protection coverage required?\""
      },
      {
        id: "regular_business_protection",
        label: "🗓️ Regular Business Protection",
        value: "regular_business_protection",
        description: "CPO coverage 2-4 times weekly for predictable business activities, meetings, and regular threat exposure periods.",
        examples: "\"Protection needed 2-4 times per week?\" • \"Regular high-risk meetings scheduled?\" • \"Consistent threat exposure maintained?\""
      },
      {
        id: "weekly_security_schedule",
        label: "📆 Weekly Security Schedule",
        value: "weekly_security_schedule",
        description: "Protection services 1-2 times per week for standing appointments, regular events, or specific weekly exposures.",
        examples: "\"Protection needed 1-2 times per week?\" • \"Weekly high-profile events scheduled?\" • \"Moderate threat exposure maintained?\""
      },
      {
        id: "biweekly_protection",
        label: "🗓️ Biweekly Protection",
        value: "biweekly_protection",
        description: "Alternating week schedule for periodic security requirements aligned with business or personal cycles.",
        examples: "\"Protection needed every other week?\" • \"Bi-weekly risk periods experienced?\" • \"Cyclical threat patterns present?\""
      },
      {
        id: "monthly_security_coverage",
        label: "📅 Monthly Security Coverage",
        value: "monthly_security_coverage",
        description: "Protection for 1-3 specific occasions monthly such as board meetings, public appearances, or high-risk events.",
        examples: "\"Protection needed 1-3 times per month?\" • \"Monthly board meetings scheduled?\" • \"Regular but infrequent risk exposure?\""
      },
      {
        id: "quarterly_protection",
        label: "📊 Quarterly Protection",
        value: "quarterly_protection",
        description: "Seasonal security requirements every few months aligned with business quarters or periodic events.",
        examples: "\"Protection needed every few months?\" • \"Quarterly risk periods experienced?\" • \"Seasonal threat exposure present?\""
      },
      {
        id: "project_based_security",
        label: "🎯 Project-Based Security",
        value: "project_based_security",
        description: "Intensive CPO coverage during specific projects, deals, or time-limited operations requiring enhanced protection.",
        examples: "\"Intensive protection needed for specific periods?\" • \"Campaign or project-based threats faced?\" • \"Surge protection capability required?\""
      },
      {
        id: "event_security_only",
        label: "🎪 Event Security Only",
        value: "event_security_only",
        description: "Protection exclusively for galas, premieres, conferences, and public appearances with venue-specific security.",
        examples: "\"Only occasional event protection needed?\" • \"High-profile events attended irregularly?\" • \"Unpredictable security needs present?\""
      },
      {
        id: "unpredictable_variable",
        label: "❓ Unpredictable/Variable",
        value: "unpredictable_variable",
        description: "Irregular schedule requiring flexible CPO deployment based on emerging threats or last-minute requirements.",
        examples: "\"Cannot predict protection frequency?\" • \"Threat level fluctuates unpredictably?\" • \"Flexible on-demand security needed?\""
      },
      {
        id: "24_7_on_call_retainer",
        label: "🚨 24/7 On-Call Retainer",
        value: "24_7_on_call_retainer",
        description: "Guaranteed CPO availability within 1 hour notice, with monthly retainer for immediate deployment capability.",
        examples: "\"Guaranteed rapid response capability needed?\" • \"Immediate threat escalation risk present?\" • \"Emergency activation protocols required?\""
      },
      {
        id: "threat_activated_response",
        label: "⚠️ Threat-Activated Response",
        value: "threat_activated_response",
        description: "Protection services triggered by threat level escalation, with monitoring and rapid deployment when needed.",
        examples: "\"Protection activates based on threat levels?\" • \"Intelligence-driven security needed?\" • \"Threat-responsive protection required?\""
      },
      {
        id: "international_travel_only",
        label: "✈️ International Travel Only",
        value: "international_travel_only",
        description: "CPO protection specifically for overseas trips, airport transits, and foreign security coordination.",
        examples: "\"Protection only needed for international travel?\" • \"Heightened risk faced abroad?\" • \"Cross-border security coordination required?\""
      },
      {
        id: "seasonal_holiday_periods",
        label: "🏖️ Seasonal/Holiday Periods",
        value: "seasonal_holiday_periods",
        description: "Protection during specific seasons, holidays, or vacation periods with enhanced family security.",
        examples: "\"Seasonal protection only needed?\" • \"Holiday or seasonal threats faced?\" • \"Periodic security coverage required?\""
      },
      {
        id: "academic_term_time",
        label: "🎓 Academic Term-Time",
        value: "academic_term_time",
        description: "University calendar-based protection aligned with semester schedules and exam periods.",
        examples: "\"Are you a student needing term-time protection?\" • \"Academic year threats faced?\" • \"Campus-based protection cycles needed?\""
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer Not to Say",
        value: "prefer_not_to_say",
        description: "Frequency requirements discussed privately with security coordinators.",
        examples: "\"Prefer to keep protection patterns private?\" • \"Confidential scheduling required?\" • \"Discretionary activation protocols needed?\""
      }
    ],
    validation: { required: true, errorMessage: "Please select your protection frequency requirements" },
    helpText: "Protection frequency determines how we structure your security team. Regular clients receive dedicated CPOs who learn your patterns and identify anomalies. Occasional clients get event specialists. This is about maintaining consistent security coverage appropriate to your threat exposure.",
    stepDescription: "How often you need protection helps us serve you better. Daily clients get familiar CPOs who learn your routines and potential vulnerabilities. Occasional clients get our most flexible officers who excel with new environments. It's like having a regular bodyguard versus a specialist consultant."
  },
  {
    id: 3,
    title: "🔒 What's important for your security?",
    subtitle: "What matters most for your security",
    question: "What are your essential security priorities?",
    type: "checkbox",
    options: [
      {
        id: "maximum_confidentiality",
        label: "🔐 Maximum Confidentiality",
        value: "maximum_confidentiality",
        description: "Enhanced NDAs, zero information leakage, anonymous operations, and complete operational security including untraceable vehicles.",
        examples: "\"Is discretion paramount to your security needs?\" • \"Invisible protection required?\" • \"Undetectable security presence needed?\""
      },
      {
        id: "covert_protection",
        label: "🕴️ Covert Protection",
        value: "covert_protection",
        description: "CPOs blend as colleagues, assistants, or companions. No visible security presence while maintaining full protective capability.",
        examples: "\"Protection wanted without obvious security presence?\" • \"Covert security operations needed?\" • \"Undercover protection required?\""
      },
      {
        id: "ex_military_police_officers",
        label: "🪖 Ex-Military/Police Officers",
        value: "ex_military_police_officers",
        description: "CPOs with government service backgrounds including special forces, close protection units, or intelligence services.",
        examples: "\"Officers with military/police backgrounds required?\" • \"Tactical expertise needed?\" • \"Combat-experienced protection required?\""
      },
      {
        id: "visible_security_deterrent",
        label: "👮 Visible Security Deterrent",
        value: "visible_security_deterrent",
        description: "Obvious security presence designed to deter threats, establish perimeter control, and project protective capability.",
        examples: "\"Clearly visible security presence wanted?\" • \"Deterrent security display needed?\" • \"Obvious protection visibility required?\""
      },
      {
        id: "armoured_vehicle_capability",
        label: "🚗 Armoured Vehicle Capability",
        value: "armoured_vehicle_capability",
        description: "Access to B6/B7 ballistic-protected vehicles with bullet-resistant glass, reinforced panels, and emergency systems.",
        examples: "\"Armoured vehicle protection required?\" • \"Ballistic threats faced?\" • \"B6/B7 protection levels needed?\""
      },
      {
        id: "24_7_control_room",
        label: "📱 24/7 Control Room",
        value: "24_7_control_room",
        description: "Round-the-clock monitoring, threat intelligence updates, and immediate backup deployment from central command.",
        examples: "\"Continuous monitoring support needed?\" • \"24/7 surveillance required?\" • \"Constant threat awareness needed?\""
      },
      {
        id: "quick_response_times",
        label: "⚡ Quick response times",
        value: "quick_response_times",
        description: "Fast deployment and rapid response for immediate security needs.",
        examples: "\"Quick response capability needed?\" • \"Rapid deployment required?\" • \"Immediate threat response needed?\""
      },
      {
        id: "encrypted_communications",
        label: "📡 Encrypted Communications",
        value: "encrypted_communications",
        description: "Military-grade encrypted phones, secure messaging, and protected communication channels for all operations.",
        examples: "\"Secure communications required?\" • \"Encrypted coordination needed?\" • \"Protected communication channels required?\""
      },
      {
        id: "privacy_and_discretion",
        label: "👁️ Privacy and discretion",
        value: "privacy_and_discretion",
        description: "Officers trained in maintaining privacy and operating with complete discretion.",
        examples: "\"Are privacy and discretion important to you?\" • \"Confidentiality protection needed?\" • \"Information security required?\""
      },
      {
        id: "medical_response_capability",
        label: "🏥 Medical Response Capability",
        value: "medical_response_capability",
        description: "Trauma-trained CPOs with advanced first aid, emergency medical equipment, and hospital coordination.",
        examples: "\"Medical response training required?\" • \"First aid capability needed?\" • \"Emergency medical support required?\""
      },
      {
        id: "professional_appearance",
        label: "👔 Professional appearance",
        value: "professional_appearance",
        description: "Officers maintain professional, business-appropriate appearance.",
        examples: "\"Is professional appearance important to you?\" • \"Business-formal security needed?\" • \"Corporate-appropriate protection required?\""
      },
      {
        id: "family_friendly_officers",
        label: "👨‍👩‍👧‍👦 Family-friendly officers",
        value: "family_friendly_officers",
        description: "Officers experienced in working with families and children.",
        examples: "\"Family-friendly security officers needed?\" • \"Child-safe protection required?\" • \"Household-appropriate security needed?\""
      },
      {
        id: "female_security_officers",
        label: "👩 Female security officers available",
        value: "female_security_officers",
        description: "Female protection officers available when needed.",
        examples: "\"Do you prefer female security officers?\" • \"Female protection staff required?\" • \"Gender-specific security needed?\""
      },
      {
        id: "residential_security_integration",
        label: "🏠 Residential Security Integration",
        value: "residential_security_integration",
        description: "Home security assessments, residential sweeps, and integration with home security systems.",
        examples: "\"Home security coordination needed?\" • \"Residential protection integration required?\" • \"Household security management needed?\""
      },
      {
        id: "international_capability",
        label: "🌍 International Capability",
        value: "international_capability",
        description: "Cross-border protection coordination, international CPO networks, and global threat intelligence.",
        examples: "\"International protection coordination needed?\" • \"Cross-border security required?\" • \"Global protection management needed?\""
      },
      {
        id: "female_cpos_available",
        label: "👩 Female CPOs Available",
        value: "female_cpos_available",
        description: "Female protection officers for appropriate situations, cultural requirements, or client preference.",
        examples: "\"Female protection officers required?\" • \"Women-only security teams needed?\" • \"Cultural requirements for female staff?\""
      },
      {
        id: "multiple_officer_teams",
        label: "👥 Multiple Officer Teams",
        value: "multiple_officer_teams",
        description: "Team-based protection with multiple CPOs for high-threat situations or family coverage.",
        examples: "\"Multi-officer protection teams needed?\" • \"Team-based security required?\" • \"Coordinated protection details needed?\""
      },
      {
        id: "legal_liaison_services",
        label: "⚖️ Legal Liaison Services",
        value: "legal_liaison_services",
        description: "Direct coordination with police, legal compliance, and evidence gathering for prosecutions.",
        examples: "\"Do you testify in criminal cases?\" • \"Police coordination needed during court appearances?\" • \"Facing legal threats from opposing counsel?\""
      },
      {
        id: "secure_document_handling",
        label: "📄 Secure Document Handling",
        value: "secure_document_handling",
        description: "Protected transport of sensitive documents, secure briefcases, and confidential material management.",
        examples: "\"Do you carry merger documents to signings?\" • \"Secure transport of classified contracts needed?\" • \"Sensitive client files handled regularly?\""
      },
      {
        id: "corporate_billing_systems",
        label: "💳 Corporate Billing Systems",
        value: "corporate_billing_systems",
        description: "Integration with corporate accounts, purchase orders, and enterprise invoicing requirements.",
        examples: "\"Does your company handle all security expenses?\" • \"Itemized invoices needed for board reporting?\" • \"Do multiple departments share protection costs?\""
      },
      {
        id: "punctuality_critical",
        label: "⏰ Punctuality Critical",
        value: "punctuality_critical",
        description: "Time-sensitive operations with zero tolerance for delays and precision scheduling.",
        examples: "\"Cannot be late for board meetings?\" • \"Do court appearances require exact timing?\" • \"Would missing flights cost millions in deals?\""
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer Not to Say",
        value: "prefer_not_to_say",
        description: "Security requirements discussed privately with senior coordinators.",
        examples: "\"Prefer to keep specific requirements private?\" • \"Need flexible recommendations based on your patterns?\" • \"Require complete confidentiality throughout?\""
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 5, errorMessage: "Please select 1-5 protection priorities" },
    helpText: "Every security detail requires different capabilities. Some clients need invisible protection with CPOs posing as assistants. Others need visible deterrent with tactical presence. Our SIA-licensed officers provide threat assessment, surveillance detection, and emergency response - they are security professionals, not drivers.",
    stepDescription: "What protection capabilities matter most to you? Some prefer discrete officers who blend in, others want visible deterrent presence. Some need medical training, others value counter-surveillance skills. Your priorities help us assign CPOs who naturally match your security style."
  },
  {
    id: 4,
    title: "🗺️ Primary Protection Zones",
    subtitle: "Where do you need security most",
    question: "Where do you require primary protection coverage?",
    type: "checkbox",
    options: [
      {
        id: "greater_london_zone_1_central",
        label: "🏛️ Greater London - Zone 1 Central",
        value: "greater_london_zone_1_central",
        description: "Westminster, City, Mayfair, Knightsbridge high-threat urban zones requiring Metropolitan Police coordination.",
        examples: "\"Is your office in Canary Wharf?\" • \"Do you frequently visit Parliament?\" • \"Are Mayfair meetings your main risk?\""
      },
      {
        id: "manchester_business_districts",
        label: "🏭 Manchester Business Districts",
        value: "manchester_business_districts",
        description: "Commercial centres, MediaCity, industrial sites requiring Greater Manchester Police liaison.",
        examples: "\"Does your company have Manchester offices?\" • \"Do you attend MediaCity meetings monthly?\" • \"Is Manchester Airport your northern hub?\""
      },
      {
        id: "birmingham_commercial_zones",
        label: "🏙️ Birmingham Commercial Zones",
        value: "birmingham_commercial_zones",
        description: "Business quarters, conference centres, Birmingham Airport requiring West Midlands coordination.",
        examples: "\"Do you have quarterly Birmingham site visits?\" • \"Does Birmingham Airport connect your travels?\" • \"Are Midlands conferences regular events for you?\""
      },
      {
        id: "edinburgh_financial_district",
        label: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Edinburgh Financial District",
        value: "edinburgh_financial_district",
        description: "Scottish capital, financial institutions, government buildings requiring Police Scotland protocols.",
        examples: "\"Do you handle Scottish legal matters regularly?\" • \"Are Edinburgh financial meetings monthly for you?\" • \"Do government consultations require you to travel north?\""
      },
      {
        id: "glasgow_commercial_quarter",
        label: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Glasgow Commercial Quarter",
        value: "glasgow_commercial_quarter",
        description: "Scottish business hub, merchant districts, industrial zones with specific Scottish threat landscape.",
        examples: "\"Are Glasgow shipyard visits routine for you?\" • \"Do Scottish business partnerships need your attention?\" • \"Do industrial site inspections require your protection?\""
      },
      {
        id: "uk_airports_all",
        label: "✈️ UK Airports - All",
        value: "uk_airports_all",
        description: "Heathrow, Gatwick, Manchester, Birmingham requiring aviation security clearance and airside access.",
        examples: "\"Do you fly internationally 3 times monthly?\" • \"Do paparazzi target you at Heathrow?\" • \"Do your private jet transfers need secure handoffs?\""
      },
      {
        id: "entertainment_venues",
        label: "🎭 Entertainment Venues",
        value: "entertainment_venues",
        description: "West End theatres, O2 Arena, premier venues requiring crowd control and venue security coordination.",
        examples: "\"Do you attend West End premieres regularly?\" • \"Do O2 Arena events draw unwanted attention to you?\" • \"Does your private box access need discrete escort?\""
      },
      {
        id: "premium_hotels_5_star",
        label: "🏨 Premium Hotels - 5 Star",
        value: "premium_hotels_5_star",
        description: "Luxury hotel security protocols, VIP entrance procedures, and coordination with hotel security teams.",
        examples: "\"Is Claridge's your London base?\" • \"Are five-star hotels your client meeting venues?\" • \"Do your presidential suites need security sweeps?\""
      },
      {
        id: "government_buildings",
        label: "🏛️ Government Buildings",
        value: "government_buildings",
        description: "Parliament, ministries, courts requiring security clearance and coordination with police protection.",
        examples: "\"Are Parliament consultations routine for you?\" • \"Do your ministry meetings require clearance?\" • \"Do your court appearances need tactical escort?\""
      },
      {
        id: "multi_city_operations",
        label: "🚌 Multi-City Operations",
        value: "multi_city_operations",
        description: "Protection across multiple UK cities requiring coordinated teams and consistent protocols.",
        examples: "\"Do you have London-Edinburgh weekly business runs?\" • \"Do you attend multi-city board meeting circuits?\" • \"Does your national speaking tour require coordination?\""
      },
      {
        id: "university_cities",
        label: "🎓 University Cities",
        value: "university_cities",
        description: "Oxford, Cambridge, major campus locations requiring academic security protocols.",
        examples: "\"Do your Oxford lectures draw protesters?\" • \"Are your Cambridge research partnerships sensitive?\" • \"Do your university speaking engagements need crowd control?\""
      },
      {
        id: "international_zones",
        label: "🌐 International Zones",
        value: "international_zones",
        description: "Cross-border operations requiring international protection coordination and travel security.",
        examples: "\"Do you have cross-border meetings in EU capitals?\" • \"Do you attend international arbitration hearings?\" • \"Does your global summit attendance require advance teams?\""
      },
      {
        id: "high_security_facilities",
        label: "🔒 High-Security Facilities",
        value: "high_security_facilities",
        description: "Sensitive locations, data centres, research facilities requiring enhanced clearance.",
        examples: "\"Do your data centre inspections need clearance?\" • \"Do you visit defense contractor facilities?\" • \"Does your research lab access require vetting?\""
      },
      {
        id: "confidential_locations",
        label: "❓ Confidential Locations",
        value: "confidential_locations",
        description: "Undisclosed locations discussed privately with security coordinators.",
        examples: "\"Are your location details discussed privately?\" • \"Do your undisclosed venues require advance coordination?\" • \"Do your sensitive locations need compartmentalized planning?\""
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 8, errorMessage: "Please select 1-8 coverage areas" },
    helpText: "Different locations require different security protocols. City centres need urban tactics, airports require aviation security clearance, government buildings need vetted officers. This determines which regional CPO teams we deploy and their specific area expertise.",
    stepDescription: "Where you need protection helps us assign CPOs who really know those areas. They'll know the security risks, best secure routes, and which areas to avoid during high-threat periods. Local knowledge makes every protection detail more effective."
  },
  {
    id: 5,
    title: "📍 Additional coverage areas",
    subtitle: "Additional security considerations",
    question: "Are there any additional areas or situations we should know about?",
    type: "checkbox",
    options: [
      {
        id: "public_recognition",
        label: "📸 Public recognition situations",
        value: "public_recognition",
        description: "Help with privacy protection in public spaces.",
        examples: "\"Do paparazzi follow you to restaurants?\" • \"Do fans approach you at airports?\" • \"Do public events draw unwanted attention to you?\""
      },
      {
        id: "business_confidentiality",
        label: "🏢 Business confidentiality needs",
        value: "business_confidentiality",
        description: "Extra security for sensitive business activities.",
        examples: "\"Do your M&A negotiations need absolute secrecy?\" • \"Do your board meetings discuss sensitive strategy?\" • \"Is competitor intelligence a real threat to you?\""
      },
      {
        id: "legal_proceedings_security",
        label: "⚖️ Legal Proceedings Security",
        value: "legal_proceedings_security",
        description: "Court appearances, witness protection, or legal threats requiring judicial security coordination.",
        examples: "\"Are you involved in high-profile divorce proceedings?\" • \"Are you testifying against organized crime?\" • \"Do you face corporate litigation with threats?\""
      },
      {
        id: "medical_privacy_requirements",
        label: "🏥 Medical Privacy Requirements",
        value: "medical_privacy_requirements",
        description: "Hospital visits, medical conditions, or treatment requiring HIPAA-compliant security protocols.",
        examples: "\"Does your cancer treatment draw media attention?\" • \"Do your mental health clinic visits need discretion?\" • \"Do your specialist consultations require privacy?\""
      },
      {
        id: "international_threat_exposure",
        label: "🌍 International Threat Exposure",
        value: "international_threat_exposure",
        description: "Threats originating overseas, international travel risks, or cross-border security concerns.",
        examples: "\"Do you have business dealings with sanctioned countries?\" • \"Do you have foreign government surveillance concerns?\" • \"Do you fear international cartel retaliation?\""
      },
      {
        id: "witness_protection_protocols",
        label: "🛡️ Witness Protection Protocols",
        value: "witness_protection_protocols",
        description: "Official or unofficial witness security requiring anonymity and protection from retaliation.",
        examples: "\"Are you testifying in a major fraud case?\" • \"Are you a whistleblower facing corporate retaliation?\" • \"Are you an organized crime witness requiring anonymity?\""
      },
      {
        id: "domestic_situation_concerns",
        label: "🏠 Domestic Situation Concerns",
        value: "domestic_situation_concerns",
        description: "Family law issues, custody disputes, or domestic threats requiring sensitive handling.",
        examples: "\"Does your custody battle require child protection?\" • \"Is your ex-spouse making threats?\" • \"Do you need domestic restraining order enforcement?\""
      },
      {
        id: "financial_threat_exposure",
        label: "💰 Financial Threat Exposure",
        value: "financial_threat_exposure",
        description: "Kidnap/ransom risks, extortion attempts, or financial targeting requiring specialist protocols.",
        examples: "\"Do you face kidnap for ransom threat intelligence?\" • \"Are you experiencing extortion attempts from criminals?\" • \"Are you being targeted by organized groups due to high net worth?\""
      },
      {
        id: "activist_protest_targeting",
        label: "📢 Activist/Protest Targeting",
        value: "activist_protest_targeting",
        description: "Environmental, political, or social activism targeting requiring crowd control expertise.",
        examples: "\"Do environmental activists target your energy company?\" • \"Are there animal rights protests at your research facility?\" • \"Do political protesters disrupt your public events?\""
      },
      {
        id: "no_specific_threats",
        label: "✅ No Specific Threats",
        value: "no_specific_threats",
        description: "General protection without identified specific threats but maintaining security awareness.",
        examples: "\"Do you need general executive protection for peace of mind?\" • \"Do you have no specific threats but a high-profile lifestyle?\" • \"Do you want preventive security for family safety?\""
      },
      {
        id: "prefer_not_to_disclose",
        label: "❓ Prefer Not to Disclose",
        value: "prefer_not_to_disclose",
        description: "Threat information provided only to assigned CPO team under strict confidentiality.",
        examples: "\"Prefer confidential threat assessment?\" • \"Need flexible coverage recommendations?\" • \"Require discrete threat evaluation?\""
      }
    ],
    validation: { required: false },
    helpText: "Specific threats require specialized protection strategies. Media threats need privacy protocols, stalking requires counter-surveillance, corporate espionage needs information security. Additional zones may require specific clearances or protocols.",
    stepDescription: "Threat assessment helps us prepare appropriate countermeasures. Media attention requires different tactics than corporate espionage. Stalking needs different skills than witness protection. Understanding your specific security challenges helps us deploy the right specialist capabilities."
  },
  {
    id: 6,
    title: "🚨 Emergency & Safety Protocols",
    subtitle: "For your safety and protection coordination",
    question: "Who should we contact during security incidents or emergencies?",
    type: "checkbox",
    options: [
      {
        id: "primary_emergency_contact",
        label: "👪 Primary Emergency Contact",
        value: "primary_emergency_contact",
        description: "Immediate family member or trusted individual for urgent security decisions and emergency notifications.",
        examples: "\"Does your spouse need immediate notification?\" • \"Do your adult children coordinate family security?\" • \"Is your mother the emergency decision-maker?\""
      },
      {
        id: "corporate_security_team",
        label: "🏢 Corporate Security Team",
        value: "corporate_security_team",
        description: "Company security department for coordination with corporate protocols and internal threat management.",
        examples: "\"Does your Head of Security manage board protection?\" • \"Does your corporate security team handle executive threats?\" • \"Does your company protocol require security coordination?\""
      },
      {
        id: "family_security_coordinator",
        label: "👨‍👩‍👧‍👦 Family Security Coordinator",
        value: "family_security_coordinator",
        description: "Designated family member managing household security and coordinating family protection.",
        examples: "\"Does your eldest son manage family security decisions?\" • \"Does your family office coordinator handle protection?\" • \"Does your household manager oversee all security?\""
      },
      {
        id: "medical_emergency_contact",
        label: "🏥 Medical Emergency Contact",
        value: "medical_emergency_contact",
        description: "Preferred hospital, personal physician, or medical power of attorney for health emergencies.",
        examples: "\"Does your Harley Street cardiologist know your condition?\" • \"Does your private hospital have your medical records?\" • \"Does your medical insurance cover emergency transport?\""
      },
      {
        id: "legal_representative",
        label: "⚖️ Legal Representative",
        value: "legal_representative",
        description: "Solicitor or barrister for immediate legal consultation during security incidents or arrests.",
        examples: "\"Does your solicitor handle all legal emergencies?\" • \"Do you have a QC barrister for serious incidents?\" • \"Do you have a criminal defense lawyer on retainer?\""
      },
      {
        id: "executive_personal_assistant",
        label: "👤 Executive/Personal Assistant",
        value: "executive_personal_assistant",
        description: "PA or EA who manages schedule and can make security decisions on your behalf.",
        examples: "\"Does your PA manage your entire security schedule?\" • \"Does your executive assistant have security authority?\" • \"Does your personal manager coordinate all protection?\""
      },
      {
        id: "insurance_risk_management",
        label: "💼 Insurance/Risk Management",
        value: "insurance_risk_management",
        description: "Insurance company or risk manager for incident reporting and claim coordination.",
        examples: "\"Does Lloyd's of London cover your kidnap/ransom insurance?\" • \"Does your risk manager handle threat assessments?\" • \"Does your insurance broker specialize in executive protection?\""
      },
      {
        id: "diplomatic_consular_contact",
        label: "🏛️ Diplomatic/Consular Contact",
        value: "diplomatic_consular_contact",
        description: "Embassy or consulate for international incidents requiring diplomatic intervention.",
        examples: "\"Does the British Embassy handle your overseas incidents?\" • \"Do you have diplomatic protection liaison in Foreign Office?\" • \"Do you use consular services for international emergencies?\""
      },
      {
        id: "no_emergency_contact",
        label: "❌ No Emergency Contact",
        value: "no_emergency_contact",
        description: "Self-managed emergencies with no third-party notification required.",
        examples: "\"Prefer no emergency contact setup?\" • \"Self-manage all emergency decisions?\" • \"Accept limited emergency assistance capability?\""
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer Not to Say",
        value: "prefer_not_to_say",
        description: "Emergency protocols discussed privately with assigned CPO team.",
        examples: "\"Prefer standard emergency protocols?\" • \"Keep personal contacts confidential?\" • \"Require discrete emergency management?\""
      }
    ],
    validation: { required: false, minSelections: 0, maxSelections: 6, errorMessage: "Please select your emergency contact preferences" },
    helpText: "Professional protection requires clear emergency protocols. When threats materialize, we need authorized contacts who understand your security situation and can make rapid decisions. This includes medical emergencies, security breaches, and threat escalations.",
    stepDescription: "Having someone we can contact in security emergencies gives everyone better protection outcomes. Like having ICE contacts in your phone, but for your protection details. It's optional but recommended - emergency coordination can be critical during incidents."
  },
  {
    id: 7,
    title: "⚙️ Operational & Special Requirements",
    subtitle: "Any additional security needs",
    question: "Select any specific operational or special security requirements",
    type: "checkbox",
    options: [
      {
        id: "officers_in_business_attire",
        label: "👔 Officers in Business Attire",
        value: "officers_in_business_attire",
        description: "CPOs in formal business suits for boardrooms, corporate events, and professional environments.",
        examples: "\"Do your board meetings require suited CPOs?\" • \"Do your corporate events need formal appearance?\" • \"Do your banking environments demand business attire?\""
      },
      {
        id: "tactical_uniform_appearance",
        label: "🚔 Tactical/Uniform Appearance",
        value: "tactical_uniform_appearance",
        description: "Visible security uniform for maximum deterrent effect and clear security presence.",
        examples: "\"Does high-visibility security deter threats to you?\" • \"Does uniform presence reassure your staff?\" • \"Do you need tactical appearance for maximum deterrent?\""
      },
      {
        id: "plain_clothes_operations",
        label: "👤 Plain Clothes Operations",
        value: "plain_clothes_operations",
        description: "Casual dress allowing CPOs to blend with environment while maintaining concealed equipment.",
        examples: "\"Do you need invisible protection at social events?\" • \"Should protection blend in during your family outings?\" • \"Do you need undercover protection for shopping trips?\""
      },
      {
        id: "standard_executive_vehicles",
        label: "🚗 Standard Executive Vehicles",
        value: "standard_executive_vehicles",
        description: "Mercedes S-Class, BMW 7 Series, Audi A8 - premium vehicles without armor.",
        examples: "\"Do you use Mercedes S-Class for client meetings?\" • \"Do you need BMW 7 Series for corporate travel?\" • \"Do you prefer Audi A8 for discrete executive transport?\""
      },
      {
        id: "luxury_suvs_required",
        label: "🚙 Luxury SUVs Required",
        value: "luxury_suvs_required",
        description: "Range Rover, Mercedes GLS, BMW X7 for enhanced visibility and team deployment.",
        examples: "\"Do you need Range Rover for family protection details?\" • \"Do you require Mercedes GLS for team deployment?\" • \"Do you need BMW X7 for enhanced security presence?\""
      },
      {
        id: "armoured_vehicles_essential",
        label: "🛡️ Armoured Vehicles Essential",
        value: "armoured_vehicles_essential",
        description: "B6/B7 ballistic protection mandatory for all movements due to threat level.",
        examples: "\"Does your high threat level require armored transport?\" • \"Do you need B6 protection against small arms?\" • \"Do you need B7 defense against assault rifles?\""
      },
      {
        id: "electric_hybrid_vehicles",
        label: "🔋 Electric/Hybrid Vehicles",
        value: "electric_hybrid_vehicles",
        description: "Tesla, BMW iX, Mercedes EQS for environmental requirements or silent operations.",
        examples: "\"Do you need Tesla Model S for silent operations?\" • \"Do you need BMW iX for environmental commitment?\" • \"Do you have Mercedes EQS for zero emission requirements?\""
      },
      {
        id: "wheelchair_accessibility",
        label: "♿ Wheelchair Accessibility",
        value: "wheelchair_accessibility",
        description: "Modified vehicles and CPOs trained in mobility assistance and disability protocols.",
        examples: "\"Do you need modified vehicle for wheelchair transport?\" • \"Do you need CPOs trained in mobility assistance?\" • \"Do you require accessible entry/exit procedures?\""
      },
      {
        id: "medical_equipment_space",
        label: "🏥 Medical Equipment Space",
        value: "medical_equipment_space",
        description: "Oxygen, medication storage, medical devices requiring temperature control and power.",
        examples: "\"Does your oxygen concentrator require power?\" • \"Does your insulin storage need refrigeration?\" • \"Do you need life support equipment transport?\""
      },
      {
        id: "concealed_equipment_authority",
        label: "🔒 Concealed Equipment Authority",
        value: "concealed_equipment_authority",
        description: "CPOs carry concealed defensive equipment within legal parameters.",
        examples: "\"Do you authorize concealed protective equipment?\" • \"Do you permit defensive tools within legal limits?\" • \"Do you need enhanced protection capability?\""
      },
      {
        id: "body_armor_required",
        label: "🦺 Body Armor Required",
        value: "body_armor_required",
        description: "Stab vests or ballistic protection worn by CPOs based on threat assessment.",
        examples: "\"Does your high threat level require body armor?\" • \"Do you need stab vests for knife crime areas?\" • \"Do you need ballistic protection for firearms threats?\""
      },
      {
        id: "tactical_medical_kits",
        label: "🚑 Tactical Medical Kits",
        value: "tactical_medical_kits",
        description: "Trauma equipment, tourniquets, hemostatic agents for emergency medical response.",
        examples: "\"Do you need tourniquets for hemorrhage control?\" • \"Do you need trauma kits for gunshot wounds?\" • \"Do you need medical response for cardiac events?\""
      },
      {
        id: "rf_detection_equipment",
        label: "📡 RF Detection Equipment",
        value: "rf_detection_equipment",
        description: "Bug sweeping devices, signal detectors for counter-surveillance operations.",
        examples: "\"Do you need bug sweeping for corporate espionage?\" • \"Do you need signal detection for surveillance devices?\" • \"Do you need counter-surveillance equipment deployment?\""
      },
      {
        id: "night_vision_capability",
        label: "🌙 Night Vision Capability",
        value: "night_vision_capability",
        description: "Low-light equipment for evening operations and threat detection.",
        examples: "\"Does your evening event security require night vision?\" • \"Do you need low-light threat detection capability?\" • \"Do you need nighttime route reconnaissance?\""
      },
      {
        id: "language_requirements",
        label: "🗣️ Language Requirements",
        value: "language_requirements",
        description: "CPOs speaking specific languages for international operations or cultural needs.",
        examples: "\"Do you need Mandarin-speaking CPOs for Chinese clients?\" • \"Do you need Arabic language for Middle Eastern meetings?\" • \"Do you need French for diplomatic functions?\""
      },
      {
        id: "pet_accommodation",
        label: "🐕 Pet Accommodation",
        value: "pet_accommodation",
        description: "Security protocols for transporting animals with appropriate safety equipment.",
        examples: "\"Do you need guard dog transport with security detail?\" • \"Do you require service animal accommodation?\" • \"Do you need pet safety during protection operations?\""
      },
      {
        id: "child_safety_equipment",
        label: "👶 Child Safety Equipment",
        value: "child_safety_equipment",
        description: "Age-appropriate car seats, booster seats, and CPOs trained in child protection.",
        examples: "\"Do you need infant car seats for newborn protection?\" • \"Do you need booster seats for school-age children?\" • \"Do you need child protection specialist CPOs?\""
      },
      {
        id: "secure_cargo_capability",
        label: "📦 Secure Cargo Capability",
        value: "secure_cargo_capability",
        description: "Protected transport for valuable items, documents, or sensitive materials.",
        examples: "\"Do you need art collection transport security?\" • \"Do you need diamond courier protection service?\" • \"Do you need classified document secure transport?\""
      },
      {
        id: "mobile_office_requirements",
        label: "💼 Mobile Office Requirements",
        value: "mobile_office_requirements",
        description: "WiFi, privacy screens, secure communications for working during protection.",
        examples: "\"Do you need WiFi for working during transport?\" • \"Do you need privacy screens for confidential calls?\" • \"Do you need secure communications while traveling?\""
      },
      {
        id: "k9_unit_coordination",
        label: "🐕‍🦺 K9 Unit Coordination",
        value: "k9_unit_coordination",
        description: "Integration with dog units for explosive detection or enhanced security.",
        examples: "\"Do you need bomb detection dogs for venue sweeps?\" • \"Do you need explosive detection at events?\" • \"Do you need K9 units for enhanced security?\""
      },
      {
        id: "no_special_requirements",
        label: "❌ No Special Requirements",
        value: "no_special_requirements",
        description: "Standard operational protocols sufficient without special equipment.",
        examples: "\"Do you need no special equipment?\" • \"Are standard operational protocols sufficient for you?\" • \"Do you have basic protection requirements only?\""
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer Not to Say",
        value: "prefer_not_to_say",
        description: "Operational requirements discussed privately with CPO team.",
        examples: "\"Discuss requirements privately with CPO team?\" • \"Keep operational needs confidential?\" • \"Prefer discrete capability assessment?\""
      }
    ],
    validation: { required: false, minSelections: 0, maxSelections: 12, errorMessage: "Please select your operational requirements" },
    helpText: "Operational requirements affect how protection is delivered. Officer appearance determines infiltration capability, equipment affects response options, vehicle selection impacts evacuation possibilities. These are tactical decisions that shape your security posture.",
    stepDescription: "Operational setup affects your protection effectiveness. Officer appearance determines how well they blend or deter. Equipment choices affect response capabilities. Vehicle selection impacts evacuation options and threat resistance. These tactical choices shape your overall security profile."
  },
  {
    id: 8,
    title: "📡 Security Communications & Updates",
    subtitle: "How you'd like security coordination",
    question: "How should our 24/7 control room maintain security communications?",
    type: "checkbox",
    options: [
      {
        id: "encrypted_sms_updates",
        label: "📱 Encrypted SMS Updates",
        value: "encrypted_sms_updates",
        description: "End-to-end encrypted text messages for operational updates and position reports.",
        examples: "\"Do you need encrypted position updates every hour?\" • \"Do you need secure SMS for threat alerts?\" • \"Do you need military-grade messaging for operations?\""
      },
      {
        id: "secure_email_briefings",
        label: "📧 Secure Email Briefings",
        value: "secure_email_briefings",
        description: "PGP encrypted email for detailed briefings, threat assessments, and reports.",
        examples: "\"Do you need daily threat intelligence via secure email?\" • \"Do you need detailed operational reports?\" • \"Do you need PGP encrypted security documentation?\""
      },
      {
        id: "app_push_notifications",
        label: "🔔 App Push Notifications",
        value: "app_push_notifications",
        description: "Real-time alerts through encrypted Armora security app with biometric protection.",
        examples: "\"Do you need push alerts for immediate threats?\" • \"Do you need biometric app protection?\" • \"Do you need real-time position tracking updates?\""
      },
      {
        id: "direct_voice_emergency_only",
        label: "📞 Direct Voice - Emergency Only",
        value: "direct_voice_emergency_only",
        description: "Voice calls reserved for immediate threats requiring instant communication.",
        examples: "\"Do you need emergency voice line for active threats?\" • \"Do you need direct calls during security incidents?\" • \"Do you need immediate response hotline access?\""
      },
      {
        id: "signal_whatsapp_encrypted",
        label: "💬 Signal/WhatsApp Encrypted",
        value: "signal_whatsapp_encrypted",
        description: "Secure messaging platforms with disappearing messages and encryption.",
        examples: "\"Do you need Signal messages for routine updates?\" • \"Do you need WhatsApp coordination with disappearing messages?\" • \"Do you need secure messaging for operational chat?\""
      },
      {
        id: "through_executive_assistant",
        label: "👤 Through Executive Assistant",
        value: "through_executive_assistant",
        description: "All communications routed through PA/EA for filtering and management.",
        examples: "\"Does your PA filter all security communications?\" • \"Does your executive assistant manage updates?\" • \"Does your personal manager coordinate contact?\""
      },
      {
        id: "corporate_security_desk",
        label: "🏢 Corporate Security Desk",
        value: "corporate_security_desk",
        description: "Communications through company security department using corporate protocols.",
        examples: "\"Does corporate security desk handle coordination?\" • \"Do company protocols require security routing?\" • \"Does enterprise security team manage communication?\""
      },
      {
        id: "24_7_control_room_direct",
        label: "🎮 24/7 Control Room Direct",
        value: "24_7_control_room_direct",
        description: "Direct hotline to control room for immediate threat response and coordination.",
        examples: "\"Do you need emergency hotline for immediate threats?\" • \"Do you need 24/7 control room direct access?\" • \"Do you need instant coordination for incidents?\""
      },
      {
        id: "daily_security_briefings",
        label: "📊 Daily Security Briefings",
        value: "daily_security_briefings",
        description: "Scheduled daily reports on threat landscape, operations, and intelligence.",
        examples: "\"Do you need morning security briefing at 8am?\" • \"Do you need daily threat assessment reports?\" • \"Do you need intelligence updates every 24 hours?\""
      },
      {
        id: "weekly_threat_reports",
        label: "📈 Weekly Threat Reports",
        value: "weekly_threat_reports",
        description: "Comprehensive weekly analysis of security situation and risk assessment.",
        examples: "\"Do you need Monday morning threat analysis?\" • \"Do you need weekly risk assessment reports?\" • \"Do you need comprehensive security situation updates?\""
      },
      {
        id: "incident_alerts_only",
        label: "⚠️ Incident Alerts Only",
        value: "incident_alerts_only",
        description: "Communication only when security incidents occur, no routine updates.",
        examples: "\"Contact only during actual incidents?\" • \"Alert notifications for threats only?\" • \"No routine updates unless emergency?\""
      },
      {
        id: "silent_operations",
        label: "🔕 Silent Operations",
        value: "silent_operations",
        description: "Minimal communication except for critical security situations.",
        examples: "\"Silent operations with minimal contact needed?\" • \"Critical situations only communications?\" • \"Stealth approach with emergency alerts?\""
      },
      {
        id: "family_coordinator_updates",
        label: "👨‍👩‍👧‍👦 Family Coordinator Updates",
        value: "family_coordinator_updates",
        description: "Updates to designated family member managing household security.",
        examples: "\"Does your spouse coordinate family security?\" • \"Does family office manage household protection?\" • \"Does designated family member receive updates?\""
      },
      {
        id: "multiple_authorized_contacts",
        label: "👥 Multiple Authorized Contacts",
        value: "multiple_authorized_contacts",
        description: "Different contacts for different threat levels and situations.",
        examples: "\"Different contacts for different threat levels?\" • \"Multiple authorized decision makers?\" • \"Varied contacts for different situations?\""
      },
      {
        id: "prefer_not_to_say",
        label: "❓ Prefer Not to Say",
        value: "prefer_not_to_say",
        description: "Communication protocols established privately with CPO team.",
        examples: "\"Communication protocols established privately?\" • \"Prefer confidential communication setup?\" • \"Discrete coordination required?\""
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 8, errorMessage: "Please select 1-8 communication preferences" },
    helpText: "Protection operations require secure, reliable communications. Our control room monitors all active protection details, tracks threat intelligence, and coordinates emergency responses. Select your preferred channels for operational updates, threat alerts, and routine communications.",
    stepDescription: "How should we communicate during protection operations? Some prefer encrypted texts for updates, others want voice calls for emergencies only. Some need briefings through assistants, others want direct control room contact. Tell us what works for your security communications."
  },
  {
    id: 9,
    title: "📋 Security Service Agreement & Confirmation",
    subtitle: "Complete your close protection assessment",
    question: "Review and confirm your Close Protection Service Agreement",
    type: "radio",
    options: [
      {
        id: "confirm_security_agreement",
        label: "✅ Confirm Security Agreement",
        value: "confirm_security_agreement",
        description: "Security profile is complete and accurate",
        examples: "\"Does your protection profile accurately reflect security needs?\" • \"Ready for CPO team assignment and briefing?\" • \"Authorize immediate security service activation?\""
      },
      {
        id: "need_modifications",
        label: "📝 Need Modifications",
        value: "need_modifications",
        description: "I'd like to review some responses",
        examples: "\"Need to correct threat assessment details?\" • \"Want to modify communication preferences?\" • \"Need to update emergency contact information?\""
      },
      {
        id: "privacy_completion",
        label: "🔒 Complete with Maximum Privacy",
        value: "privacy_completion",
        description: "Complete setup with maximum confidentiality protection",
        examples: "\"Proceed with maximum confidentiality?\" • \"Require personalized private consultation?\" • \"Complete discretion guaranteed throughout?\""
      }
    ],
    validation: { required: true, errorMessage: "Please confirm your security profile to complete assessment" },
    helpText: "You are engaging SIA-licensed Close Protection Officers for professional security services under UK private security regulations. This is NOT a private hire vehicle service. CPOs provide threat assessment, personal protection, and secure movement as part of integrated security operations.",
    stepDescription: "Take a quick look to make sure we've got everything right. This helps your CPOs prepare properly and ensures you get exactly the protection you're expecting. Think of it as your personal security preferences saved for every protection detail.",
    isLastStep: true,
    profileSummary: {
      showSummary: true,
      summaryCards: [
        {
          title: "🛡️ PROTECTION PROFILE SUMMARY",
          fields: ["professionalProfile", "protectionFrequency", "topPriorities"]
        },
        {
          title: "📍 COVERAGE SUMMARY",
          fields: ["primaryZones", "threatAssessment"]
        },
        {
          title: "🔒 SECURITY & REQUIREMENTS",
          fields: ["emergencyProtocols", "operationalRequirements", "communicationPreferences"]
        }
      ]
    },
    legalConfirmations: {
      required: [
        {
          id: "security_service_understanding",
          text: "I understand this is a SECURITY SERVICE under SIA regulations",
          required: true
        },
        {
          id: "not_private_hire_acknowledgment",
          text: "I acknowledge this is NOT a private hire vehicle service",
          required: true
        },
        {
          id: "cpo_professionals_confirmation",
          text: "I confirm CPOs are SECURITY PROFESSIONALS, not drivers",
          required: true
        },
        {
          id: "secure_movement_incidental",
          text: "I accept secure movement is INCIDENTAL to protection duties",
          required: true
        },
        {
          id: "vehicles_security_assets",
          text: "I understand vehicles are SECURITY ASSETS, not taxis",
          required: true
        },
        {
          id: "pricing_security_expertise",
          text: "I acknowledge pricing reflects SECURITY EXPERTISE",
          required: true
        },
        {
          id: "cpo_refusal_authority",
          text: "I accept CPOs may refuse movement if security is compromised",
          required: true
        },
        {
          id: "threat_assessment_consent",
          text: "I consent to threat assessment and security data processing",
          required: true
        },
        {
          id: "operational_confidentiality",
          text: "I agree to maintain confidentiality of security operations",
          required: true
        },
        {
          id: "terms_conditions_acceptance",
          text: "I accept the Close Protection Service Terms & Conditions",
          required: true
        },
        {
          id: "false_booking_understanding",
          text: "I understand false booking attempts may be reported to police",
          required: true
        },
        {
          id: "legitimate_security_requirements",
          text: "I confirm I have legitimate security requirements",
          required: true
        }
      ],
      optional: []
    },
    securityStatement: "⚠️ IMPORTANT: Armora provides SIA-licensed Close Protection Officers for security services. Any movement is incidental to protection duties. This is NOT a private hire vehicle service and is NOT regulated as transportation. False bookings or misuse may be reported to authorities.",
    legalStatement: "By submitting this assessment, you acknowledge that: This is a professional security service under SIA regulations • CPOs are security professionals providing threat assessment and protection • Secure movement is incidental to protection duties • This is not a private hire vehicle service • All data processing complies with UK Data Protection Act 2018 • You retain full rights over your personal data",
    serviceRecommendation: {
      enabled: true,
      confidenceThreshold: 85,
      previewFeatures: ["recommendedService", "keyFeatures", "coverageAreas", "estimatedValue"]
    }
  }
];

// Service tier calculation logic
export const getServiceRecommendation = (responses: Record<string, any>): string => {
  const professionalProfile = responses.step1 || responses.professionalProfile;
  const protectionRequirements: string[] = responses.step3 || responses.protectionRequirements || [];
  const frequency = responses.step2 || responses.protectionFrequency;
  const threatAssessment: string[] = responses.step5 || responses.threatAssessment || [];

  // Armora Platinum - £150/hour + £3/mile
  const platinumProfiles = ['high_profile_individual'];
  const platinumRequirements = ['armoured_vehicle_capability', 'ex_military_police_officers', 'multiple_officer_teams'];
  const platinumThreats = ['financial_threat_exposure', 'international_threat_exposure', 'witness_protection_protocols'];

  if (platinumProfiles.includes(professionalProfile) ||
      protectionRequirements.some(req => platinumRequirements.includes(req)) ||
      (frequency === 'daily_protection_detail' && protectionRequirements.includes('ex_military_police_officers')) ||
      threatAssessment.some(threat => platinumThreats.includes(threat))) {
    return "armora-platinum";
  }

  // Armora Shadow - £95/hour + £2.50/mile
  const shadowProfiles = ['entertainment_public_figure'];
  const shadowRequirements = ['covert_protection', 'counter_surveillance_training'];
  const shadowThreats = ['media_paparazzi_exposure', 'stalking_harassment_situations'];

  if (shadowProfiles.includes(professionalProfile) ||
      protectionRequirements.some(req => shadowRequirements.includes(req)) ||
      threatAssessment.some(threat => shadowThreats.includes(threat))) {
    return "armora-shadow";
  }

  // Armora Executive - £75/hour + £2/mile
  const executiveProfiles = ['corporate_executive', 'business_owner'];
  const executiveRequirements = ['corporate_billing_systems', 'standard_executive_vehicles'];
  const executiveFrequency = ['regular_business_protection', 'daily_protection_detail'];

  if (executiveProfiles.includes(professionalProfile) ||
      protectionRequirements.some(req => executiveRequirements.includes(req)) ||
      executiveFrequency.includes(frequency)) {
    return "armora-executive";
  }

  // Default to Armora Protection - £45/hour + £1.50/mile
  return "armora-protection";
};

export const serviceData = {
  "armora-protection": {
    id: "armora-protection",
    name: "Armora Protection",
    description: "Professional close protection services",
    features: [
      "SIA-licensed Close Protection Officers",
      "Standard secure vehicles (unmarked)",
      "Professional security protocols",
      "24/7 protection availability",
      "Real-time threat monitoring",
      "Background-checked professionals",
      "Emergency response protocols"
    ],
    price: "£45/hour + £1.50/mile",
    confidence: 85,
    estimatedMonthly: "£360-720"
  },
  "armora-executive": {
    id: "armora-executive",
    name: "Armora Executive",
    description: "Premium close protection with enhanced capabilities",
    features: [
      "Senior SIA Close Protection Officers",
      "Executive vehicles (S-Class, 7-Series, A8)",
      "Enhanced security protocols",
      "Business facilities (WiFi, charging, privacy glass)",
      "Preferred CPO assignment",
      "Airport security coordination",
      "Medical response trained CPOs",
      "Corporate billing integration"
    ],
    price: "£75/hour + £2/mile",
    confidence: 92,
    estimatedMonthly: "£600-1200"
  },
  "armora-shadow": {
    id: "armora-shadow",
    name: "Armora Shadow",
    description: "Discrete close protection with specialized officers",
    features: [
      "Covert SIA Close Protection Officers",
      "Unmarked discrete vehicles",
      "Advanced counter-surveillance protocols",
      "Route security planning",
      "Media/paparazzi protection",
      "Stalking protection protocols",
      "Privacy protection specialists"
    ],
    price: "£95/hour + £2.50/mile",
    confidence: 89,
    estimatedMonthly: "£760-1520",
    popular: true
  },
  "armora-platinum": {
    id: "armora-platinum",
    name: "Armora Platinum",
    description: "Maximum security close protection",
    features: [
      "Ex-Military/Police Close Protection Officers",
      "Armoured vehicles (B6/B7 rated)",
      "Multi-officer protection teams",
      "24/7 control room monitoring",
      "Emergency extraction protocols",
      "Encrypted communications",
      "International coordination",
      "Threat intelligence briefings"
    ],
    price: "£150/hour + £3/mile",
    confidence: 95,
    estimatedMonthly: "£1200-2400"
  }
};

// Note: Dynamic personalization functions have been moved to utils/dynamicPersonalization.ts
export const getQuestionsForUserType = (userType: string) => questionnaireSteps;
export const getTotalStepsForUserType = (userType: string) => 9;
export const shouldShowConversionPrompt = (step: number) => false;
export const getConversionPromptForStep = (step: number) => null;
export const calculateProgress = (currentStep: number, totalSteps: number) => (currentStep / totalSteps) * 100;
export const validateStepData = (stepId: number, value: any) => ({ isValid: true });

export default questionnaireSteps;