// UK Venue Security Assessment - Seven Ps Methodology
import { QuestionnaireStep } from '../types';

// Comprehensive venue security questionnaire based on Seven Ps threat profiling
export const venueSecuritySteps: QuestionnaireStep[] = [
  {
    id: 1,
    title: "Event Type & Venue Assessment",
    subtitle: "Understanding your venue security requirements",
    question: "What type of event are you organizing?",
    type: "radio",
    options: [
      {
        id: "wedding",
        label: "💒 Wedding Reception or Ceremony",
        value: "wedding",
        description: "Need protection for your special day? We understand family dynamics, gift security, and alcohol service considerations for wedding celebrations.",
        examples: "*Select this for weddings, engagement parties, or matrimonial celebrations requiring discrete security presence."
      },
      {
        id: "corporate",
        label: "🏢 Corporate Event or Conference",
        value: "corporate",
        description: "Protecting executives and confidential information during business events? We handle boardroom meetings, product launches, and shareholder events.",
        examples: "*Select this for business conferences, AGMs, product launches, or executive gatherings."
      },
      {
        id: "private_party",
        label: "🎉 Private Party or Celebration",
        value: "private_party",
        description: "Hosting high-net-worth individuals or celebrities? We provide discrete protection for private gatherings and exclusive celebrations.",
        examples: "*Select this for birthday parties, anniversary celebrations, or exclusive social gatherings."
      },
      {
        id: "celebrity_event",
        label: "⭐ Celebrity or VIP Event",
        value: "celebrity_event",
        description: "Managing paparazzi threats and fan interactions? We specialize in red carpet events, premieres, and celebrity appearances.",
        examples: "*Select this for events featuring celebrities, influencers, or high-profile personalities."
      },
      {
        id: "charity_gala",
        label: "❤️ Charity Gala or Fundraiser",
        value: "charity_gala",
        description: "Protecting donors and auction items at fundraising events? We ensure safety while maintaining the welcoming atmosphere.",
        examples: "*Select this for charity auctions, fundraising dinners, or philanthropic events."
      },
      {
        id: "political_event",
        label: "🗳️ Political Event or Rally",
        value: "political_event",
        description: "Managing heightened security risks at political gatherings? We handle candidate protection and crowd management.",
        examples: "*Select this for political rallies, campaign events, or government functions."
      },
      {
        id: "sporting_event",
        label: "⚽ Sporting Event or Competition",
        value: "sporting_event",
        description: "Protecting athletes and managing crowd dynamics? We provide security for sports events and competitions.",
        examples: "*Select this for sports competitions, award ceremonies, or athletic events."
      },
      {
        id: "cultural_event",
        label: "🎭 Cultural or Arts Event",
        value: "cultural_event",
        description: "Securing art exhibitions and cultural gatherings? We protect valuable items and distinguished guests.",
        examples: "*Select this for gallery openings, cultural festivals, or arts exhibitions."
      },
      {
        id: "religious_gathering",
        label: "⛪ Religious or Spiritual Event",
        value: "religious_gathering",
        description: "Providing security for faith-based gatherings? We respect religious protocols while ensuring congregation safety.",
        examples: "*Select this for religious ceremonies, spiritual retreats, or faith community events."
      },
      {
        id: "product_launch",
        label: "🚀 Product Launch or Media Event",
        value: "product_launch",
        description: "Protecting intellectual property and executives during launches? We secure media events and product reveals.",
        examples: "*Select this for product launches, press conferences, or media announcements."
      },
      {
        id: "diplomatic",
        label: "🌍 Diplomatic or International Event",
        value: "diplomatic",
        description: "Coordinating with international security protocols? We handle diplomatic visits and international delegations.",
        examples: "*Select this for embassy events, diplomatic visits, or international business meetings."
      },
      {
        id: "other",
        label: "📋 Other Event Type",
        value: "other",
        description: "Have a unique event requiring specialized security assessment? We'll create a custom protection plan.",
        examples: "*Select this for any event type not listed above requiring professional security assessment."
      }
    ],
    validation: { required: true, errorMessage: "Please select your event type" },
    helpText: "Event type determines our security approach - weddings need discrete presence, while corporate events require confidentiality protocols.",
    isFirstStep: true,
    processOverview: {
      timeRequired: "12-15 minutes",
      benefits: [
        "Professional Seven Ps threat assessment",
        "UK market-standard pricing (£500-£1000/day)",
        "SIA Level 3 certified officer allocation",
        "Martyn's Law compliance verification",
        "Instant security requirement calculation"
      ],
      securityAssurance: "All venue assessments follow UK BS 8507 standards and comply with Terrorism Protection of Premises Act 2025."
    },
    stepDescription: "Different events have different security needs. A wedding focuses on family safety and gift protection, while a corporate event prioritizes executive security and confidential information. Tell us your event type so we can apply the right security framework."
  },
  {
    id: 2,
    title: "Principal Profile Assessment",
    subtitle: "Understanding who needs protection (Seven Ps: People)",
    question: "Who is the primary individual requiring protection at this event?",
    type: "radio",
    options: [
      {
        id: "corporate_executive",
        label: "👔 Corporate Executive or CEO",
        value: "corporate_executive",
        description: "Senior business leader requiring executive protection during the event? We understand corporate security protocols and confidentiality needs.",
        examples: "*Select this for CEOs, board members, or senior executives attending the event."
      },
      {
        id: "celebrity_performer",
        label: "🎬 Celebrity or Public Figure",
        value: "celebrity_performer",
        description: "Entertainment industry professional facing paparazzi and fan attention? We specialize in celebrity protection and media management.",
        examples: "*Select this for actors, musicians, TV personalities, or public figures."
      },
      {
        id: "political_figure",
        label: "🏛️ Political Figure or Government Official",
        value: "political_figure",
        description: "Elected official or government representative requiring specialized protection? We coordinate with official security protocols.",
        examples: "*Select this for MPs, councilors, government officials, or political candidates."
      },
      {
        id: "high_net_worth",
        label: "💎 High Net Worth Individual",
        value: "high_net_worth",
        description: "Ultra-wealthy individual facing kidnap/ransom risks? We provide discrete wealth protection and threat assessment.",
        examples: "*Select this for billionaires, major investors, or extremely wealthy individuals."
      },
      {
        id: "diplomat",
        label: "🌍 Diplomat or International Delegate",
        value: "diplomat",
        description: "Foreign diplomat or international representative? We coordinate with embassy security and understand diplomatic protocols.",
        examples: "*Select this for ambassadors, consuls, or international delegation members."
      },
      {
        id: "tech_entrepreneur",
        label: "💻 Tech Entrepreneur or Innovator",
        value: "tech_entrepreneur",
        description: "Technology leader with valuable intellectual property? We protect against corporate espionage and targeted threats.",
        examples: "*Select this for startup founders, tech CEOs, or innovation leaders."
      },
      {
        id: "sports_personality",
        label: "🏆 Sports Personality or Athlete",
        value: "sports_personality",
        description: "Professional athlete or sports figure requiring protection? We understand sports security and fan management.",
        examples: "*Select this for professional athletes, sports personalities, or team executives."
      },
      {
        id: "family_member",
        label: "👨‍👩‍👧‍👦 Family Member of High-Profile Individual",
        value: "family_member",
        description: "Protecting family members of prominent figures? We provide family security and understand extended threat vectors.",
        examples: "*Select this for spouses, children, or family members of high-profile individuals."
      },
      {
        id: "whistleblower",
        label: "🔍 Whistleblower or Protected Individual",
        value: "whistleblower",
        description: "Individual facing specific threats due to their actions or knowledge? We provide specialized protection for vulnerable persons.",
        examples: "*Select this for individuals with specific threat concerns or protection needs."
      },
      {
        id: "royalty_nobility",
        label: "👑 Royalty or Nobility",
        value: "royalty_nobility",
        description: "Member of royal family or nobility requiring protection? We understand ceremonial protocols and royal security standards.",
        examples: "*Select this for royal family members, nobles, or ceremonial figures."
      },
      {
        id: "religious_leader",
        label: "⛪ Religious Leader or Spiritual Figure",
        value: "religious_leader",
        description: "Faith leader facing religious or ideological threats? We provide respectful security while maintaining spiritual accessibility.",
        examples: "*Select this for religious leaders, spiritual guides, or faith community figures."
      },
      {
        id: "no_specific_principal",
        label: "🎪 General Event Security (No Specific Principal)",
        value: "no_specific_principal",
        description: "Event requires general security coverage without specific individual protection? We provide comprehensive venue security.",
        examples: "*Select this for general crowd control, venue security, or events without a specific protection target."
      },
      {
        id: "confidential",
        label: "🔒 Confidential (Cannot Disclose)",
        value: "confidential",
        description: "Principal identity must remain confidential? We provide top-tier protection while maintaining complete discretion.",
        examples: "*Select this when you cannot disclose the principal's identity for security reasons."
      }
    ],
    validation: { required: true, errorMessage: "Please select the principal profile" },
    helpText: "Understanding who needs protection helps us assess threat level and assign appropriate SIA-certified officers.",
    stepDescription: "The person you're protecting determines everything - a CEO needs corporate confidentiality, a celebrity needs paparazzi management, a diplomat needs international protocol awareness. Each profile has unique threat patterns we plan for."
  },
  {
    id: 3,
    title: "Venue Security Assessment",
    subtitle: "Location vulnerability analysis (Seven Ps: Places)",
    question: "Tell us about your venue and its security characteristics:",
    type: "checkbox",
    options: [
      {
        id: "indoor_venue",
        label: "🏢 Indoor Venue",
        value: "indoor_venue",
        description: "Event takes place inside a building with controlled access points and climate control.",
        examples: "*Hotels, conference centers, private clubs, restaurants, or indoor event spaces."
      },
      {
        id: "outdoor_venue",
        label: "🌳 Outdoor Venue",
        value: "outdoor_venue",
        description: "Event takes place outdoors requiring perimeter security and weather contingencies.",
        examples: "*Gardens, parks, estates, outdoor pavilions, or open-air venues."
      },
      {
        id: "mixed_venue",
        label: "🏡 Mixed Indoor/Outdoor Venue",
        value: "mixed_venue",
        description: "Event spans both indoor and outdoor areas requiring coordinated security coverage.",
        examples: "*Country clubs, hotels with gardens, estates with multiple buildings, or venues with terraces."
      },
      {
        id: "private_residence",
        label: "🏠 Private Residence",
        value: "private_residence",
        description: "Event at someone's home requiring residential security protocols and neighbor considerations.",
        examples: "*Private homes, estates, mansions, or personal residences hosting events."
      },
      {
        id: "commercial_venue",
        label: "🏪 Commercial Venue",
        value: "commercial_venue",
        description: "Business premises or commercial space with existing security infrastructure.",
        examples: "*Office buildings, retail spaces, commercial centers, or business facilities."
      },
      {
        id: "public_venue",
        label: "🏛️ Public or Government Building",
        value: "public_venue",
        description: "Government building or public facility with existing security protocols to coordinate with.",
        examples: "*Town halls, civic centers, government buildings, or public institutions."
      },
      {
        id: "historic_venue",
        label: "🏰 Historic or Heritage Venue",
        value: "historic_venue",
        description: "Historic building with preservation requirements and unique security challenges.",
        examples: "*Castles, historic houses, museums, heritage sites, or listed buildings."
      },
      {
        id: "waterside_venue",
        label: "🌊 Waterside or Marine Venue",
        value: "waterside_venue",
        description: "Venue near water requiring maritime security considerations and escape route planning.",
        examples: "*Yacht clubs, riverside venues, boat parties, or waterfront locations."
      },
      {
        id: "remote_venue",
        label: "🏔️ Remote or Rural Venue",
        value: "remote_venue",
        description: "Isolated location with limited emergency services access and communication challenges.",
        examples: "*Country estates, farms, remote venues, or locations with limited infrastructure."
      },
      {
        id: "transport_hub",
        label: "✈️ Transport Hub or Terminal",
        value: "transport_hub",
        description: "Airport, station, or transport facility with complex security coordination requirements.",
        examples: "*Airports, train stations, ports, or transport terminals hosting events."
      },
      {
        id: "high_profile_venue",
        label: "⭐ High-Profile or Iconic Venue",
        value: "high_profile_venue",
        description: "Famous or iconic location that attracts attention and requires enhanced security.",
        examples: "*Landmark buildings, famous hotels, iconic venues, or well-known locations."
      },
      {
        id: "multiple_venues",
        label: "🗺️ Multiple Venues",
        value: "multiple_venues",
        description: "Event spans multiple locations requiring coordinated security across different sites.",
        examples: "*Multi-location events, venue tours, or events with multiple simultaneous locations."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 4, errorMessage: "Please select 1-4 venue characteristics" },
    helpText: "Venue type affects our security approach - outdoor events need perimeter control, historic venues have preservation constraints.",
    stepDescription: "Every venue has unique security challenges. A hotel ballroom has different risks than a private garden party. We need to understand your venue's layout, access points, and limitations to plan effective protection."
  },
  {
    id: 4,
    title: "Event Scale & Attendance",
    subtitle: "Capacity and crowd assessment",
    question: "How many people will attend your event?",
    type: "radio",
    options: [
      {
        id: "intimate_gathering",
        label: "👥 Intimate Gathering (10-25 people)",
        value: "intimate_gathering",
        description: "Small, private gathering requiring discrete security presence and close protection focus.",
        examples: "*Family dinners, board meetings, private celebrations, or exclusive gatherings."
      },
      {
        id: "small_event",
        label: "🏠 Small Event (26-50 people)",
        value: "small_event",
        description: "Medium-sized gathering requiring controlled access and crowd awareness.",
        examples: "*Wedding receptions, corporate dinners, small conferences, or private parties."
      },
      {
        id: "medium_event",
        label: "🏢 Medium Event (51-150 people)",
        value: "medium_event",
        description: "Substantial gathering requiring structured security presence and crowd management.",
        examples: "*Large wedding receptions, company events, product launches, or medium conferences."
      },
      {
        id: "large_event",
        label: "🏟️ Large Event (151-300 people)",
        value: "large_event",
        description: "Major event requiring comprehensive security coordination and multiple officers.",
        examples: "*Large corporate events, major celebrations, conferences, or substantial gatherings."
      },
      {
        id: "major_event",
        label: "🎪 Major Event (301-500 people)",
        value: "major_event",
        description: "Significant event requiring advanced security planning and specialized crowd control.",
        examples: "*Major conferences, large galas, substantial corporate events, or significant celebrations."
      },
      {
        id: "mega_event",
        label: "🏛️ Mega Event (500+ people)",
        value: "mega_event",
        description: "Large-scale event requiring comprehensive security infrastructure and Martyn's Law compliance.",
        examples: "*Major conferences, large public events, festivals, or events requiring terrorist threat assessment."
      },
      {
        id: "variable_attendance",
        label: "📊 Variable Attendance",
        value: "variable_attendance",
        description: "Attendance numbers may fluctuate requiring flexible security arrangements.",
        examples: "*Open houses, networking events, or events with uncertain attendance figures."
      },
      {
        id: "confidential_numbers",
        label: "🔒 Confidential (Cannot Disclose)",
        value: "confidential_numbers",
        description: "Attendance numbers cannot be disclosed for security reasons.",
        examples: "*High-security events where attendance information is classified or confidential."
      }
    ],
    validation: { required: true, errorMessage: "Please select your expected attendance" },
    helpText: "Event size determines officer count - we use industry standard 1:75 ratios for general events, adjusting for threat level.",
    stepDescription: "Event size drives everything - officer count, equipment needs, and complexity. A 50-person dinner needs different security than a 500-person gala. We calculate the right level of coverage for your event scale."
  },
  {
    id: 5,
    title: "Threat Assessment",
    subtitle: "Security risk evaluation (Seven Ps: Personal History & Prejudices)",
    question: "Are there any specific security concerns or threats we should be aware of?",
    type: "checkbox",
    options: [
      {
        id: "previous_incidents",
        label: "⚠️ Previous Security Incidents",
        value: "previous_incidents",
        description: "Past security breaches, threats, or incidents involving the principal or venue.",
        examples: "*Previous stalking, harassment, security breaches, or threatening behavior."
      },
      {
        id: "business_disputes",
        label: "💼 Business or Legal Disputes",
        value: "business_disputes",
        description: "Ongoing commercial conflicts that could escalate during the event.",
        examples: "*Corporate litigation, business disputes, employment issues, or commercial conflicts."
      },
      {
        id: "media_attention",
        label: "📰 High Media Attention",
        value: "media_attention",
        description: "Event likely to attract significant press coverage or paparazzi attention.",
        examples: "*Celebrity events, major announcements, controversial topics, or newsworthy occasions."
      },
      {
        id: "political_sensitivity",
        label: "🗳️ Political Sensitivity",
        value: "political_sensitivity",
        description: "Event involves political figures or controversial political topics.",
        examples: "*Political rallies, government officials, controversial policies, or partisan events."
      },
      {
        id: "protest_risk",
        label: "📢 Protest or Demonstration Risk",
        value: "protest_risk",
        description: "Potential for organized protests or demonstrations during the event.",
        examples: "*Controversial topics, polarizing figures, sensitive issues, or activist attention."
      },
      {
        id: "stalking_harassment",
        label: "👁️ Stalking or Harassment Issues",
        value: "stalking_harassment",
        description: "Known individuals who pose ongoing harassment or stalking threats.",
        examples: "*Obsessive fans, rejected business partners, personal stalkers, or persistent harassers."
      },
      {
        id: "family_disputes",
        label: "👨‍👩‍👧‍👦 Family or Personal Disputes",
        value: "family_disputes",
        description: "Personal conflicts that could disrupt the event or threaten security.",
        examples: "*Divorce proceedings, family feuds, custody disputes, or personal vendettas."
      },
      {
        id: "extremist_threats",
        label: "⚡ Extremist or Ideological Threats",
        value: "extremist_threats",
        description: "Threats from extremist groups or individuals with ideological motivations.",
        examples: "*Religious extremism, political radicalism, ideological opposition, or hate groups."
      },
      {
        id: "criminal_elements",
        label: "🚔 Criminal Activity Concerns",
        value: "criminal_elements",
        description: "Potential involvement of organized crime or criminal elements.",
        examples: "*Organized crime connections, criminal associates, illegal activities, or underworld links."
      },
      {
        id: "kidnap_risk",
        label: "🚨 Kidnap or Ransom Risk",
        value: "kidnap_risk",
        description: "Principal assessed as high-value kidnap target requiring enhanced protection.",
        examples: "*Ultra-high net worth, family members of wealthy individuals, or kidnap-prone profiles."
      },
      {
        id: "international_threats",
        label: "🌍 International Security Concerns",
        value: "international_threats",
        description: "Threats from foreign actors, governments, or international criminal organizations.",
        examples: "*Foreign government surveillance, international business disputes, or cross-border threats."
      },
      {
        id: "cyber_threats",
        label: "💻 Cyber or Digital Threats",
        value: "cyber_threats",
        description: "Digital surveillance, hacking attempts, or cyber-enabled physical threats.",
        examples: "*Corporate espionage, digital stalking, location tracking, or tech-enabled threats."
      },
      {
        id: "no_specific_threats",
        label: "✅ No Specific Known Threats",
        value: "no_specific_threats",
        description: "No particular security concerns identified - standard protection protocols apply.",
        examples: "*General security as precaution, standard duty of care, or routine protection needs."
      },
      {
        id: "confidential_threats",
        label: "🔒 Confidential (Cannot Disclose)",
        value: "confidential_threats",
        description: "Specific threats exist but cannot be disclosed at this stage.",
        examples: "*Classified information, ongoing investigations, or sensitive security matters."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 6, errorMessage: "Please select relevant security concerns" },
    helpText: "Honest threat assessment is crucial for proper protection - we handle all information with complete confidentiality.",
    stepDescription: "We need to understand any specific risks to plan appropriate protection. This isn't about paranoia - it's professional threat assessment. Even selecting 'no specific threats' helps us calibrate the right security level."
  },
  {
    id: 6,
    title: "Privacy & Discretion Requirements",
    subtitle: "Confidentiality assessment (Seven Ps: Private Lifestyle & Personality)",
    question: "What level of privacy and discretion do you require?",
    type: "radio",
    options: [
      {
        id: "standard_discretion",
        label: "👔 Standard Professional Discretion",
        value: "standard_discretion",
        description: "Normal business confidentiality - professional but not covert security presence.",
        examples: "*Regular business events, standard corporate functions, or typical professional gatherings."
      },
      {
        id: "enhanced_privacy",
        label: "🔒 Enhanced Privacy Protection",
        value: "enhanced_privacy",
        description: "Higher privacy requirements with unmarked vehicles and discrete officer presence.",
        examples: "*Private celebrations, sensitive business meetings, or events requiring extra confidentiality."
      },
      {
        id: "maximum_discretion",
        label: "🕶️ Maximum Discretion Required",
        value: "maximum_discretion",
        description: "Completely covert protection - officers blend as guests, minimal visible security presence.",
        examples: "*Celebrity events, high-profile individuals, or situations requiring invisible protection."
      },
      {
        id: "low_profile_celebrity",
        label: "⭐ Celebrity Privacy (Low-Profile Event)",
        value: "low_profile_celebrity",
        description: "Celebrity requires protection but wants to maintain approachable image for guests.",
        examples: "*Charity events, family celebrations, or situations where celebrity wants normal interaction."
      },
      {
        id: "high_profile_protection",
        label: "🛡️ High-Profile Protection (Visible Security)",
        value: "high_profile_protection",
        description: "Obvious security presence acceptable - protection prioritized over discretion.",
        examples: "*Political events, major announcements, or situations where visible security is expected."
      },
      {
        id: "corporate_confidentiality",
        label: "💼 Corporate Confidentiality Focus",
        value: "corporate_confidentiality",
        description: "Business confidentiality and information security prioritized over personal privacy.",
        examples: "*Mergers, acquisitions, product launches, or confidential business discussions."
      },
      {
        id: "family_privacy",
        label: "👨‍👩‍👧‍👦 Family Privacy Protection",
        value: "family_privacy",
        description: "Family-focused discretion - protecting children and personal relationships.",
        examples: "*Family events, children present, or situations requiring family-sensitive approach."
      },
      {
        id: "diplomatic_protocol",
        label: "🌍 Diplomatic Privacy Standards",
        value: "diplomatic_protocol",
        description: "International diplomatic confidentiality and protocol requirements.",
        examples: "*Embassy events, diplomatic visits, or international delegation privacy needs."
      },
      {
        id: "witness_protection_level",
        label: "🔍 Witness Protection Level Privacy",
        value: "witness_protection_level",
        description: "Extreme privacy requirements with identity protection and location confidentiality.",
        examples: "*Individuals under threat, whistleblowers, or those requiring identity protection."
      },
      {
        id: "medical_privacy",
        label: "🏥 Medical Privacy Requirements",
        value: "medical_privacy",
        description: "Health-related confidentiality and medical information protection.",
        examples: "*Health conditions, medical equipment needs, or situations requiring medical confidentiality."
      }
    ],
    validation: { required: true, errorMessage: "Please select your privacy requirements" },
    helpText: "Privacy level determines our operational approach - from business-professional to completely covert protection.",
    stepDescription: "How visible should our security be? Some events need obvious protection to deter threats, others require officers who blend completely with guests. Your preference shapes our entire operational approach."
  },
  {
    id: 7,
    title: "Operational Requirements",
    subtitle: "Service delivery specifications",
    question: "What operational capabilities do you need for this event?",
    type: "checkbox",
    options: [
      {
        id: "advance_reconnaissance",
        label: "🔍 Advance Venue Reconnaissance (£200-£500)",
        value: "advance_reconnaissance",
        description: "Professional site survey and security planning visit before the event.",
        examples: "*Essential for proper security planning - identifies entry points, escape routes, and vulnerabilities."
      },
      {
        id: "close_protection_officers",
        label: "🛡️ SIA Level 3 Close Protection Officers",
        value: "close_protection_officers",
        description: "Specialized close protection officers (£500-£800/day) trained in personal protection.",
        examples: "*Advanced threat assessment, personal protection training, and emergency response certification."
      },
      {
        id: "door_supervision",
        label: "🚪 SIA Level 2 Door Supervision Officers",
        value: "door_supervision",
        description: "Entry control and crowd management officers (£150-£250/day) for general security.",
        examples: "*Access control, ID checking, crowd management, and basic security presence."
      },
      {
        id: "female_officers",
        label: "👩‍💼 Female Security Officers",
        value: "female_officers",
        description: "Female officers for cultural sensitivity or specific protection requirements.",
        examples: "*Religious events, cultural considerations, or personal preference for female protection."
      },
      {
        id: "team_coordination",
        label: "📱 Multi-Officer Team Coordination",
        value: "team_coordination",
        description: "Communication systems and coordination protocols for multiple officers.",
        examples: "*Radio systems, command structure, and coordinated response protocols."
      },
      {
        id: "vip_escort",
        label: "🚗 VIP Transport and Escort Services",
        value: "vip_escort",
        description: "Secure transport coordination and arrival/departure protection.",
        examples: "*Airport Commencement Points, secure vehicle escorts, and safe transport coordination."
      },
      {
        id: "perimeter_security",
        label: "🏰 Perimeter Security and Access Control",
        value: "perimeter_security",
        description: "Venue perimeter monitoring and controlled access point management.",
        examples: "*Entry checkpoints, perimeter patrols, and unauthorized access prevention."
      },
      {
        id: "crowd_management",
        label: "👥 Crowd Management and Flow Control",
        value: "crowd_management",
        description: "Guest flow management and crowd dynamics monitoring.",
        examples: "*Queue management, capacity control, and crowd behavior monitoring."
      },
      {
        id: "emergency_response",
        label: "🚨 Emergency Response Protocols",
        value: "emergency_response",
        description: "Medical emergency response and evacuation planning.",
        examples: "*First aid capability, emergency evacuation plans, and incident response protocols."
      },
      {
        id: "surveillance_countermeasures",
        label: "📹 Counter-Surveillance Awareness",
        value: "surveillance_countermeasures",
        description: "Detection of hostile surveillance and photography protection.",
        examples: "*Paparazzi management, unauthorized recording prevention, and surveillance detection."
      },
      {
        id: "bag_screening",
        label: "🎒 Bag and Item Screening",
        value: "bag_screening",
        description: "Security screening of guests and their belongings.",
        examples: "*Metal detection, bag searches, and prohibited item identification."
      },
      {
        id: "coordination_venue_staff",
        label: "🤝 Venue Staff Security Coordination",
        value: "coordination_venue_staff",
        description: "Integration with existing venue security and staff protocols.",
        examples: "*Liaison with venue management, staff briefings, and coordinated security approach."
      },
      {
        id: "minimal_requirements",
        label: "✅ Basic Security Presence Only",
        value: "minimal_requirements",
        description: "Standard security presence without specialized capabilities.",
        examples: "*General deterrent presence, basic crowd monitoring, and standard duty of care."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 8, errorMessage: "Please select 1-8 operational requirements" },
    helpText: "These operational capabilities shape your security plan and pricing - advance reconnaissance is highly recommended.",
    stepDescription: "What specific security capabilities do you need? Advance reconnaissance is like a fire drill - it helps us plan escape routes and spot problems before they happen. Each capability adds to the protection but also to the cost."
  },
  {
    id: 8,
    title: "Timeline & Contract Duration",
    subtitle: "Service delivery scheduling",
    question: "What is your event timeline and contract requirements?",
    type: "radio",
    options: [
      {
        id: "single_day_event",
        label: "📅 Single Day Event (12-hour minimum)",
        value: "single_day_event",
        description: "One-day event requiring 12-hour minimum security coverage.",
        examples: "*Wedding receptions, corporate events, single-day conferences, or one-off celebrations."
      },
      {
        id: "weekend_event",
        label: "🎪 Weekend Event (2-3 days)",
        value: "weekend_event",
        description: "Multi-day event spanning a weekend with continuous security coverage.",
        examples: "*Wedding weekends, multi-day conferences, festivals, or extended celebrations."
      },
      {
        id: "week_long_event",
        label: "📆 Week-Long Event (5-7 days)",
        value: "week_long_event",
        description: "Extended event requiring week-long security commitment (10-15% discount).",
        examples: "*Business conferences, international visits, extended celebrations, or multi-week events."
      },
      {
        id: "monthly_contract",
        label: "🗓️ Monthly Security Contract (15-20% discount)",
        value: "monthly_contract",
        description: "Ongoing monthly security arrangement with significant cost savings.",
        examples: "*Regular events, ongoing threat situations, or extended protection requirements."
      },
      {
        id: "seasonal_contract",
        label: "🌍 Seasonal or Quarterly Contract",
        value: "seasonal_contract",
        description: "Seasonal protection arrangement for regular events or ongoing requirements.",
        examples: "*Seasonal events, quarterly meetings, or periodic protection needs."
      },
      {
        id: "emergency_short_notice",
        label: "⚡ Emergency Short-Notice (20-30% premium)",
        value: "emergency_short_notice",
        description: "Last-minute security requirement within 48 hours (premium rates apply).",
        examples: "*Sudden threat escalation, last-minute events, or emergency protection needs."
      },
      {
        id: "advance_booking",
        label: "📋 Advance Assignment (30+ days notice)",
        value: "advance_booking",
        description: "Event planned well in advance allowing optimal preparation and planning.",
        examples: "*Planned events, scheduled conferences, or events with advance notice for proper preparation."
      },
      {
        id: "flexible_timeline",
        label: "🔄 Flexible Timeline Requirements",
        value: "flexible_timeline",
        description: "Variable timing requirements with flexible start/end times.",
        examples: "*Events with uncertain duration, flexible timing, or variable security needs."
      }
    ],
    validation: { required: true, errorMessage: "Please select your timeline requirements" },
    helpText: "Contract duration affects pricing - weekly contracts get 10-15% discounts, monthly arrangements 15-20% savings.",
    stepDescription: "How long do you need us? Single events are straightforward, but longer contracts save money and let us build better relationships with your team. Short notice costs more because we need to shuffle schedules."
  },
  {
    id: 9,
    title: "Budget & Service Level",
    subtitle: "Investment and service tier selection",
    question: "What is your budget range for professional venue security?",
    type: "radio",
    options: [
      {
        id: "budget_door_supervision",
        label: "💰 Budget Option: Door Supervision (£150-£250/day)",
        value: "budget_door_supervision",
        description: "SIA Level 2 door supervisors for basic crowd control and access management.",
        examples: "*Entry control, basic crowd management, ID checking, and general security presence."
      },
      {
        id: "standard_close_protection",
        label: "🛡️ Standard: Close Protection (£500-£600/day)",
        value: "standard_close_protection",
        description: "SIA Level 3 close protection officers for professional security services.",
        examples: "*Threat assessment, personal protection, emergency response, and professional security presence."
      },
      {
        id: "premium_close_protection",
        label: "⭐ Premium: Experienced Officers (£600-£800/day)",
        value: "premium_close_protection",
        description: "Experienced SIA Level 3 officers with advanced qualifications and proven track record.",
        examples: "*Advanced threat assessment, specialized training, proven experience, and enhanced capabilities."
      },
      {
        id: "elite_protection",
        label: "👑 Elite: Military Background (£800-£1000+/day)",
        value: "elite_protection",
        description: "Former military/police officers with specialized protection background (RMP, SAS, RaSP).",
        examples: "*Military training, specialized backgrounds, highest threat environments, and premium protection."
      },
      {
        id: "team_leader_premium",
        label: "🎖️ Team Leader Plus Specialists (£1000+/day)",
        value: "team_leader_premium",
        description: "Team leader with specialist support for complex multi-officer deployments.",
        examples: "*Command structure, multi-officer coordination, complex threat environments, and specialized teams."
      },
      {
        id: "diplomatic_specialist",
        label: "🌍 Diplomatic/VIP Specialist (Confidential Pricing)",
        value: "diplomatic_specialist",
        description: "Specialist officers for diplomatic protection and VIP assignments (pricing on application).",
        examples: "*Diplomatic experience, VIP backgrounds, specialized clearances, and confidential assignments."
      },
      {
        id: "custom_budget_requirements",
        label: "📊 Custom Budget Requirements",
        value: "custom_budget_requirements",
        description: "Specific budget constraints requiring tailored service recommendations.",
        examples: "*Custom service packages, budget-specific recommendations, or unique financial requirements."
      },
      {
        id: "price_on_application",
        label: "💼 Price on Application (Complex Requirements)",
        value: "price_on_application",
        description: "Complex requirements needing detailed assessment and custom pricing.",
        examples: "*Multi-venue events, extended contracts, specialized requirements, or complex security needs."
      }
    ],
    validation: { required: true, errorMessage: "Please select your budget range" },
    helpText: "UK close protection officers command £500-£1000 daily rates - significantly above basic security guards at £100-£150.",
    stepDescription: "What's your security investment level? Door supervisors handle crowd control, close protection officers provide individual-focused threat assessment. Former military officers cost more but bring specialized skills for high-threat situations."
  },
  {
    id: 10,
    title: "Compliance & Legal Requirements",
    subtitle: "Regulatory compliance verification",
    question: "Are there specific compliance requirements for your event?",
    type: "checkbox",
    options: [
      {
        id: "martyns_law_compliance",
        label: "🏛️ Martyn's Law Compliance (200+ capacity venues)",
        value: "martyns_law_compliance",
        description: "Terrorism Protection of Premises Act 2025 requirements for venues with 200+ capacity.",
        examples: "*Written security plans, risk assessments, senior manager accountability, and anti-terrorism measures."
      },
      {
        id: "bs8507_standards",
        label: "📋 BS 8507 Quality Standards",
        value: "bs8507_standards",
        description: "British Standard 8507 compliance for professional close protection services.",
        examples: "*Quality frameworks, documented procedures, confidentiality protocols, and professional standards."
      },
      {
        id: "gdpr_compliance",
        label: "🔒 GDPR Data Protection Compliance",
        value: "gdpr_compliance",
        description: "EU GDPR and UK Data Protection Act 2018 compliance for personal data handling.",
        examples: "*Data protection protocols, privacy safeguards, information security, and consent management."
      },
      {
        id: "sia_licensing_verification",
        label: "🆔 SIA License Verification Required",
        value: "sia_licensing_verification",
        description: "Verification of Security Industry Authority licensing for all officers.",
        examples: "*Current SIA licenses, qualification verification, training records, and professional certification."
      },
      {
        id: "insurance_verification",
        label: "🛡️ Insurance Coverage Verification",
        value: "insurance_verification",
        description: "Professional Indemnity, Public Liability, and Employers' Liability insurance verification.",
        examples: "*£2M+ Professional Indemnity, £2-5M Public Liability, £5M Employers' Liability coverage."
      },
      {
        id: "dbs_enhanced_checks",
        label: "✅ Enhanced DBS Checks Required",
        value: "dbs_enhanced_checks",
        description: "Enhanced Disclosure and Barring Service checks for all security personnel.",
        examples: "*Enhanced background checks, criminal record verification, and safeguarding clearances."
      },
      {
        id: "government_clearance",
        label: "🏛️ Government Security Clearance",
        value: "government_clearance",
        description: "SC (Security Check) or DV (Developed Vetting) clearance required for officers.",
        examples: "*Government events, diplomatic functions, or classified/sensitive venue requirements."
      },
      {
        id: "international_protocols",
        label: "🌍 International Security Protocols",
        value: "international_protocols",
        description: "Coordination with international security teams and diplomatic protocols.",
        examples: "*Embassy coordination, international delegation security, or diplomatic event protocols."
      },
      {
        id: "venue_specific_requirements",
        label: "🏢 Venue-Specific Compliance",
        value: "venue_specific_requirements",
        description: "Specific venue requirements, accreditations, or compliance protocols.",
        examples: "*Venue security procedures, access protocols, specific insurance requirements, or certification needs."
      },
      {
        id: "corporate_policies",
        label: "💼 Corporate Security Policies",
        value: "corporate_policies",
        description: "Compliance with corporate security policies and procedures.",
        examples: "*Company security standards, corporate protocols, internal procedures, or business requirements."
      },
      {
        id: "health_safety_requirements",
        label: "🏥 Health & Safety Compliance",
        value: "health_safety_requirements",
        description: "Health and Safety Executive (HSE) compliance and risk assessment requirements.",
        examples: "*Risk assessments, health and safety protocols, emergency procedures, and HSE compliance."
      },
      {
        id: "no_specific_compliance",
        label: "✅ Standard Compliance Sufficient",
        value: "no_specific_compliance",
        description: "Standard professional compliance requirements meet all needs.",
        examples: "*Basic SIA licensing, standard insurance, and normal professional standards sufficient."
      }
    ],
    validation: { required: true, minSelections: 1, maxSelections: 8, errorMessage: "Please select compliance requirements" },
    helpText: "Compliance requirements affect service delivery and costs - Martyn's Law applies to venues with 200+ capacity.",
    stepDescription: "What compliance boxes need ticking? Martyn's Law is mandatory for large venues, while government events need security clearances. We ensure all legal requirements are met before deployment."
  },
  {
    id: 11,
    title: "Assessment Complete",
    subtitle: "Venue security recommendation summary",
    question: "Review your venue security assessment and receive instant recommendations:",
    type: "radio",
    options: [
      {
        id: "proceed_with_recommendation",
        label: "✅ Proceed with Security Recommendation",
        value: "proceed_with_recommendation",
        description: "Generate professional venue security quote based on assessment.",
        examples: "*Receive instant pricing, officer allocation, and service recommendations based on your requirements."
      },
      {
        id: "review_requirements",
        label: "📝 Review Assessment Requirements",
        value: "review_requirements",
        description: "Review and modify assessment responses before generating quote.",
        examples: "*Go back and adjust responses, modify requirements, or change assessment criteria."
      },
      {
        id: "confidential_consultation",
        label: "🔒 Request Confidential Consultation",
        value: "confidential_consultation",
        description: "Arrange private consultation with senior security specialist.",
        examples: "*High-profile requirements, complex threats, or situations requiring personal consultation."
      },
      {
        id: "emergency_immediate_quote",
        label: "⚡ Emergency Immediate Quote Required",
        value: "emergency_immediate_quote",
        description: "Urgent security requirement needing immediate response (premium rates).",
        examples: "*Threat escalation, last-minute events, or urgent protection requirements."
      }
    ],
    validation: { required: true, errorMessage: "Please select how to proceed with your assessment" },
    helpText: "Your assessment generates instant recommendations - UK market rates £500-£1000/day for professional close protection.",
    isLastStep: true,
    stepDescription: "We've completed your professional threat assessment using the Seven Ps methodology. You'll now receive service recommendations, officer allocation, and pricing based on UK market standards for venue security.",
    serviceRecommendation: {
      enabled: true,
      confidenceThreshold: 90,
      previewFeatures: ["serviceLevel", "officerCount", "dailyRate", "complianceItems", "totalCost"]
    }
  }
];

// Venue security service recommendation logic
export const getVenueSecurityRecommendation = (responses: Record<string, any>): string => {
  const eventType = responses.step1 || responses.eventType;
  const principalProfile = responses.step2 || responses.principalProfile;
  const attendance = responses.step4 || responses.attendance;
  const threats = responses.step5 || responses.threats || [];
  const privacy = responses.step6 || responses.privacy;
  const budget = responses.step9 || responses.budget;

  // High-threat profiles requiring elite protection
  const eliteProfiles = ['celebrity_performer', 'political_figure', 'diplomat', 'high_net_worth', 'royalty_nobility'];
  const highThreatSituations = ['kidnap_risk', 'extremist_threats', 'international_threats', 'criminal_elements'];

  // Check for elite protection requirements
  if (eliteProfiles.includes(principalProfile) ||
      threats.some((threat: string) => highThreatSituations.includes(threat)) ||
      privacy === 'witness_protection_level') {
    return "venue-elite-protection";
  }

  // Check for close protection requirements
  const closeProtectionProfiles = ['corporate_executive', 'tech_entrepreneur', 'sports_personality'];
  const closeProtectionEvents = ['corporate', 'celebrity_event', 'political_event', 'diplomatic'];
  const mediumThreats = ['previous_incidents', 'business_disputes', 'media_attention', 'stalking_harassment'];

  if (closeProtectionProfiles.includes(principalProfile) ||
      closeProtectionEvents.includes(eventType) ||
      threats.some((threat: string) => mediumThreats.includes(threat)) ||
      ['enhanced_privacy', 'maximum_discretion'].includes(privacy) ||
      ['standard_close_protection', 'premium_close_protection'].includes(budget)) {
    return "venue-close-protection";
  }

  // Basic door supervision for low-risk events
  if (budget === 'budget_door_supervision' ||
      (eventType === 'wedding' && attendance === 'small_event') ||
      (threats.includes('no_specific_threats') && privacy === 'standard_discretion')) {
    return "venue-door-supervision";
  }

  // Default to close protection for professional assessment
  return "venue-close-protection";
};

// Calculate officer requirements based on 1:75 ratio for events
export const calculateOfficerRequirements = (responses: Record<string, any>) => {
  const attendance = responses.step4 || responses.attendance;
  const serviceLevel = getVenueSecurityRecommendation(responses);
  const threats = responses.step5 || responses.threats || [];

  // Base attendance numbers
  const attendanceMap = {
    'intimate_gathering': 20,
    'small_event': 40,
    'medium_event': 100,
    'large_event': 225,
    'major_event': 400,
    'mega_event': 750
  };

  const attendeeCount = attendanceMap[attendance as keyof typeof attendanceMap] || 100;

  // Base ratio: 1:75 for general events
  let baseOfficers = Math.ceil(attendeeCount / 75);

  // Adjust for threat level
  const highThreats = ['kidnap_risk', 'extremist_threats', 'criminal_elements'];
  if (threats.some((threat: string) => highThreats.includes(threat))) {
    baseOfficers = Math.ceil(attendeeCount / 10); // 1:10 for high-threat
  }

  // Minimum officers based on service level
  const minimumOfficers = {
    'venue-door-supervision': 1,
    'venue-close-protection': 2,
    'venue-elite-protection': 3
  };

  return Math.max(baseOfficers, minimumOfficers[serviceLevel as keyof typeof minimumOfficers] || 1);
};

export const venueSecurityServiceData = {
  "venue-door-supervision": {
    id: "venue-door-supervision",
    name: "Venue Door Supervision",
    description: "SIA Level 2 door supervision for crowd control and access management",
    dailyRate: 200,
    features: [
      "SIA Level 2 licensed door supervisors",
      "Crowd control and access management",
      "ID checking and entry control",
      "Basic incident response",
      "12-hour minimum coverage",
      "Professional uniform presentation",
      "Basic first aid capability"
    ],
    suitableFor: ["Small weddings", "Private parties", "Low-risk corporate events"],
    officerRequirements: {
      siaLevel: 2,
      specializations: ["Door Supervision", "Crowd Control"],
      minimumExperience: "1+ years"
    }
  },
  "venue-close-protection": {
    id: "venue-close-protection",
    name: "Venue Close Protection",
    description: "SIA Level 3 close protection officers for professional venue security",
    dailyRate: 650,
    features: [
      "SIA Level 3 Close Protection officers",
      "Threat assessment and planning",
      "Personal protection expertise",
      "Advanced security protocols",
      "Emergency response capability",
      "Discrete professional presence",
      "Communication coordination",
      "Advance reconnaissance available"
    ],
    suitableFor: ["Corporate events", "Celebrity functions", "Executive protection"],
    officerRequirements: {
      siaLevel: 3,
      specializations: ["Close Protection", "Threat Assessment", "Emergency Response"],
      minimumExperience: "3+ years"
    },
    isPopular: true
  },
  "venue-elite-protection": {
    id: "venue-elite-protection",
    name: "Elite Venue Protection",
    description: "Former military/police specialists for high-threat environments",
    dailyRate: 950,
    features: [
      "Former military/police background (RMP, SAS, RaSP)",
      "Specialized threat environments",
      "Advanced tactical training",
      "Counter-surveillance expertise",
      "Team leadership capability",
      "Emergency medical training",
      "Weapons detection expertise",
      "International protocol experience"
    ],
    suitableFor: ["High-profile VIPs", "Diplomatic events", "High-threat situations"],
    officerRequirements: {
      siaLevel: 3,
      specializations: ["Military Background", "Counter-Surveillance", "Tactical Response"],
      minimumExperience: "5+ years military/police + 3+ years CP"
    }
  }
};

export default venueSecuritySteps;