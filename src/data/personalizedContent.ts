export interface PersonalizedContent {
  title: string;
  example: string;
  withName: string;
  benefits: string[];
}

export interface ProfileContent {
  [step: string]: PersonalizedContent;
}

export interface PersonalizedContentMap {
  [profileKey: string]: ProfileContent;
}

export const profileKeyMap: { [key: string]: string } = {
  // Map actual questionnaire values to personalization content keys
  'executive': 'executive',                    // 🏢 Executive/Business Professional
  'entrepreneur': 'entrepreneur',              // 💼 Business Owner/Entrepreneur  
  'celebrity': 'entertainment',                // 🎭 Entertainment/Media Professional
  'athlete': 'sports',                        // ⚽ Sports Professional/Athlete
  'government': 'government',                 // 🏛️ Government/Public Sector Official
  'diplomat': 'delegation',                   // 🌍 International Delegation
  'medical': 'healthcare',                    // 🏥 Healthcare Professional
  'legal': 'legal',                          // ⚖️ Legal Professional
  'creative': 'creative',                    // 🎨 Creative Professional
  'academic': 'academic',                    // 🎓 Academic/Educational Professional
  'student': 'student',                      // 📚 Student
  'international_visitor': 'tourist',        // ✈️ International Visitor/Tourist
  'finance': 'financial',                    // 📊 Financial Services Professional
  'security': 'security',                   // 🛡️ Security/Law Enforcement
  'family': 'family',                       // 👨‍👩‍👧‍👦 Family/Personal Use
  'general': 'general',                     // 🚗 General Premium Transport
  'high_profile': 'vip',                    // 🔒 High-Profile Individual
  'prefer_not_to_say': 'default',           // ❓ Prefer not to say
  
  // Legacy mapping for backward compatibility (kept for any existing data)
  'Executive/Business Professional': 'executive',
  'Corporate Management': 'corporate',
  'Government/Public Sector Official': 'government',
  'Legal Professional': 'legal',
  'Healthcare Professional': 'healthcare',
  'Financial Services Professional': 'financial',
  'Entertainment/Media Professional': 'entertainment',
  'Academic/Educational Professional': 'academic',
  'Business Owner/Entrepreneur': 'entrepreneur',
  'Security/Law Enforcement Professional': 'security',
  'Family/Personal Use': 'family',
  'Tourist/Visitor to UK': 'tourist',
  'Student (University/College)': 'student',
  'High-Profile Individual': 'vip',
  'Private Household Staff': 'household',
  'Journalist/Media Personnel': 'journalist',
  'Event Organizer/Promoter': 'events',
  'Special Occasion (Wedding, etc)': 'special',
  'Sports Professional/Athlete': 'sports',
  'Creative Professional': 'creative',
  'International Delegation': 'delegation',
  'Other/General': 'general',
  'Prefer not to say': 'default'
};

export const personalizedContent: PersonalizedContentMap = {
  executive: {
    step2: {
      title: "Executive Protection Benefits",
      example: "Board members using our service get consistent security teams who understand corporate protocols. One FTSE 100 CEO's regular team now predicts security needs for shareholder meetings 30 minutes in advance and knows all secure entrances at major corporate offices.",
      withName: "[Name], as an executive, your regular team will learn your meeting patterns, preferred routes to the City, and establish relationships with security at your frequent destinations.",
      benefits: ["Dedicated teams", "Corporate protocol expertise", "Predictive security planning"]
    },
    step3: {
      title: "Executive Service Excellence",
      example: "Our executive protection teams master boardroom entrances, shareholder meeting logistics, and discrete communication during sensitive negotiations.",
      withName: "[Name], your security detail will seamlessly integrate with your corporate security team and maintain appropriate protocols during high-stakes meetings.",
      benefits: ["Boardroom access expertise", "Merger & acquisition discretion", "C-suite coordination"]
    },
    step4: {
      title: "Executive Coverage Network",
      example: "From Canary Wharf to Mayfair boardrooms, our teams know every corporate HQ's security procedures and private entrance locations across London.",
      withName: "[Name], we'll map your regular routes between offices, ensuring swift access through security at all your business locations.",
      benefits: ["City & Canary Wharf expertise", "Private entrance access", "Multi-site coordination"]
    },
    step5: {
      title: "Executive Special Requirements",
      example: "Our teams handle confidential document transport, coordinate with corporate aviation, and manage secure communication protocols during sensitive periods.",
      withName: "[Name], we'll establish protocols for earnings seasons, board meetings, and other sensitive corporate events requiring enhanced security.",
      benefits: ["Document security", "Aviation coordination", "Blackout period protocols"]
    },
    step6: {
      title: "Executive Priority Response",
      example: "Immediate response protocols for corporate crises, with teams trained in evacuation procedures and coordination with corporate security departments.",
      withName: "[Name], your priority protocols will integrate with your company's crisis management plan and security team.",
      benefits: ["Crisis response integration", "Evacuation expertise", "24/7 command center"]
    },
    step7: {
      title: "Executive Accessibility",
      example: "Discrete accommodations for any requirements, from mobility assistance to dietary restrictions during business travel.",
      withName: "[Name], we'll ensure all your specific requirements are met discretely and professionally across all venues.",
      benefits: ["Discrete accommodations", "Business travel support", "Venue accessibility"]
    },
    step8: {
      title: "Executive Communication",
      example: "Secure communication channels with end-to-end encryption, direct lines to management, and integration with executive assistants.",
      withName: "[Name], your EA will have direct coordination with our dispatch, ensuring seamless schedule management.",
      benefits: ["EA integration", "Encrypted communications", "Executive scheduling"]
    },
    step9: {
      title: "Executive Protection Summary",
      example: "Complete executive protection service with corporate protocol expertise, predictive security, and seamless integration with your business operations.",
      withName: "[Name], your personalized executive protection plan is ready, tailored to your corporate responsibilities and security requirements.",
      benefits: ["Full executive coverage", "Corporate integration", "Predictive security"]
    }
  },
  
  corporate: {
    step2: {
      title: "Corporate Leadership Benefits",
      example: "Senior managers receive officers familiar with business districts and client entertainment venues. One Fortune 500 director's team seamlessly handles transitions between office, client dinners, and airport runs.",
      withName: "[Name], your security team will adapt to your corporate schedule, managing both office commutes and client entertainment with equal professionalism.",
      benefits: ["Business district expertise", "Client meeting protocols", "Flexible scheduling"]
    },
    step3: {
      title: "Corporate Service Features",
      example: "Teams trained in business etiquette, client relationship management, and discrete presence during important negotiations.",
      withName: "[Name], your officers will maintain professional appearance standards and understand the importance of client impressions.",
      benefits: ["Business etiquette", "Client management", "Professional presentation"]
    },
    step4: {
      title: "Corporate Coverage Areas",
      example: "Coverage across all major business districts, from traditional City locations to emerging tech hubs in Shoreditch and King's Cross.",
      withName: "[Name], we'll establish efficient routes between your office and key client locations across London's business districts.",
      benefits: ["Business district coverage", "Client venue knowledge", "Tech hub access"]
    },
    step5: {
      title: "Corporate Special Services",
      example: "Late-night client entertainment, international visitor coordination, and seamless airport transfers for business travel.",
      withName: "[Name], we'll handle your client entertainment needs, from Michelin-starred restaurants to private member clubs.",
      benefits: ["Client entertainment", "Airport transfers", "International coordination"]
    },
    step6: {
      title: "Corporate Priority Protocols",
      example: "Rapid response for urgent client meetings, backup vehicles for critical presentations, and coordination with office security.",
      withName: "[Name], your priority protocols include priority response for time-sensitive business matters.",
      benefits: ["Priority response", "Backup vehicles", "Office coordination"]
    },
    step7: {
      title: "Corporate Accessibility",
      example: "Professional accommodations for any requirements, ensuring comfort and dignity in all business settings.",
      withName: "[Name], we'll ensure all your needs are met professionally across corporate venues and client locations.",
      benefits: ["Professional accommodations", "Venue assistance", "Discrete support"]
    },
    step8: {
      title: "Corporate Communication",
      example: "Direct lines for executive assistants, calendar integration, and professional communication protocols.",
      withName: "[Name], your team will coordinate directly with your office for seamless schedule management.",
      benefits: ["Office integration", "Calendar sync", "Professional protocols"]
    },
    step9: {
      title: "Corporate Protection Summary",
      example: "Comprehensive corporate security service with business district expertise and client relationship awareness.",
      withName: "[Name], your corporate protection plan combines security excellence with business professionalism.",
      benefits: ["Complete coverage", "Business focus", "Client awareness"]
    }
  },

  government: {
    step2: {
      title: "Government Security Benefits",
      example: "Civil servants get vetted officers with security clearance understanding. One Whitehall department head's team manages Westminster protocols, knows all government building entrances, and handles sensitive document transport.",
      withName: "[Name], as a government official, you'll have officers trained in official protocols, secure building access, and appropriate discretion levels.",
      benefits: ["Security clearance awareness", "Government building access", "Protocol expertise"]
    },
    step3: {
      title: "Government Service Standards",
      example: "Officers with enhanced vetting, understanding of official protocols, and experience with government security procedures.",
      withName: "[Name], your team will be familiar with parliamentary procedures, departmental protocols, and official security requirements.",
      benefits: ["Enhanced vetting", "Parliamentary knowledge", "Departmental protocols"]
    },
    step4: {
      title: "Government Coverage Network",
      example: "Complete coverage of Westminster, Whitehall, and all government facilities across Greater London and beyond.",
      withName: "[Name], we'll ensure swift access through security at all government buildings on your regular routes.",
      benefits: ["Westminster expertise", "Whitehall coverage", "Government facility access"]
    },
    step5: {
      title: "Government Special Requirements",
      example: "Secure document transport, red box handling procedures, and coordination with departmental security teams.",
      withName: "[Name], we'll establish protocols for handling official documents and coordinating with your departmental security.",
      benefits: ["Document security", "Red box protocols", "Security coordination"]
    },
    step6: {
      title: "Government Priority Response",
      example: "COBRA-level response protocols, coordination with Met Police, and established procedures for security incidents.",
      withName: "[Name], your priority protocols align with government security procedures and threat response levels.",
      benefits: ["COBRA protocols", "Met Police coordination", "Threat response"]
    },
    step7: {
      title: "Government Accessibility",
      example: "Full accessibility support across all government buildings and official venues, with discrete assistance.",
      withName: "[Name], we'll ensure appropriate support at all official venues while maintaining professional standards.",
      benefits: ["Building accessibility", "Official venue support", "Discrete assistance"]
    },
    step8: {
      title: "Government Communication",
      example: "Secure government-approved communication channels with appropriate encryption and protocol compliance.",
      withName: "[Name], all communications will meet government security standards and protocol requirements.",
      benefits: ["Secure channels", "Protocol compliance", "Government standards"]
    },
    step9: {
      title: "Government Protection Summary",
      example: "Complete government-grade protection with vetted officers, protocol expertise, and secure procedures.",
      withName: "[Name], your government protection plan meets all official requirements with appropriate security levels.",
      benefits: ["Government-grade security", "Full compliance", "Protocol expertise"]
    }
  },

  legal: {
    step2: {
      title: "Legal Professional Benefits",
      example: "Barristers get officers familiar with all London court locations and security procedures. One QC's regular team knows Royal Courts of Justice protocols, manages wig and gown transport, and ensures timely arrival for hearings.",
      withName: "[Name], in your legal practice, you'll have officers who understand court schedules, client confidentiality, and the importance of punctual court appearances.",
      benefits: ["Court protocol knowledge", "Document security", "Client confidentiality"]
    },
    step3: {
      title: "Legal Service Excellence",
      example: "Teams trained in court procedures, document handling, and maintaining absolute client confidentiality during sensitive cases.",
      withName: "[Name], your officers will understand the gravity of legal proceedings and maintain appropriate decorum at all venues.",
      benefits: ["Court expertise", "Case confidentiality", "Document handling"]
    },
    step4: {
      title: "Legal Coverage Network",
      example: "Coverage of all London courts, from the Royal Courts of Justice to specialist tribunals and arbitration centers.",
      withName: "[Name], we know every court entrance, chambers location, and legal venue across London's legal district.",
      benefits: ["Court locations", "Chambers access", "Tribunal expertise"]
    },
    step5: {
      title: "Legal Special Services",
      example: "Secure document transport between chambers and courts, client meeting discretion, and coordination with court security.",
      withName: "[Name], we'll handle sensitive case materials, ensure client meeting privacy, and manage court document logistics.",
      benefits: ["Document transport", "Client privacy", "Court coordination"]
    },
    step6: {
      title: "Legal Priority Protocols",
      example: "Priority response for urgent injunctions, last-minute hearings, and time-critical legal proceedings.",
      withName: "[Name], your priority protocols include immediate response for urgent court matters and injunction services.",
      benefits: ["Urgent hearing response", "Injunction support", "24/7 availability"]
    },
    step7: {
      title: "Legal Accessibility",
      example: "Full support across all court buildings, including assistance with legal materials and court dress.",
      withName: "[Name], we'll ensure you have appropriate support at all legal venues while maintaining professional standards.",
      benefits: ["Court accessibility", "Material assistance", "Professional support"]
    },
    step8: {
      title: "Legal Communication",
      example: "Confidential communication channels with chambers integration and appropriate client confidentiality protocols.",
      withName: "[Name], your clerks will have direct coordination with our dispatch for seamless diary management.",
      benefits: ["Chambers integration", "Confidential channels", "Clerk coordination"]
    },
    step9: {
      title: "Legal Protection Summary",
      example: "Complete legal professional protection with court expertise, document security, and absolute confidentiality.",
      withName: "[Name], your legal protection plan ensures punctual court attendance with complete confidentiality.",
      benefits: ["Full legal coverage", "Court expertise", "Complete confidentiality"]
    }
  },

  healthcare: {
    step2: {
      title: "Medical Professional Benefits",
      example: "Senior consultants get Protection Officers who understand on-call schedules and hospital protocols. One neurosurgeon's team manages urgent callouts, knows every London hospital's staff entrance, and handles equipment transport.",
      withName: "[Name], as a healthcare professional, your team will adapt to on-call schedules, know hospital protocols, and manage urgent medical callouts.",
      benefits: ["Hospital access knowledge", "On-call flexibility", "Medical priority understanding"]
    },
    step3: {
      title: "Healthcare Service Features",
      example: "Teams experienced with medical schedules, priority response, and discrete presence during patient consultations.",
      withName: "[Name], your officers understand medical urgency, patient confidentiality, and the unique demands of healthcare.",
      benefits: ["Medical urgency", "Patient confidentiality", "Healthcare protocols"]
    },
    step4: {
      title: "Healthcare Coverage Network",
      example: "Coverage of all major hospitals, private clinics, and medical facilities across London and home counties.",
      withName: "[Name], we know every hospital entrance, consultant parking area, and urgent care department across your practice locations.",
      benefits: ["Hospital coverage", "Clinic access", "Priority routes"]
    },
    step5: {
      title: "Healthcare Special Services",
      example: "Medical equipment transport, on-call response, and coordination with hospital security teams.",
      withName: "[Name], we'll handle medical equipment, respond to urgent calls, and coordinate with hospital security.",
      benefits: ["Equipment transport", "Priority response", "Hospital coordination"]
    },
    step6: {
      title: "Healthcare Priority Protocols",
      example: "Immediate response for medical priorities, with Protection Officers trained in priority blue-light cooperation.",
      withName: "[Name], your priority protocols include priority response for medical callouts and patient emergencies.",
      benefits: ["Medical priority response", "Blue-light cooperation", "Priority dispatch"]
    },
    step7: {
      title: "Healthcare Accessibility",
      example: "Full support for any requirements, with understanding of medical conditions and appropriate assistance.",
      withName: "[Name], we'll provide appropriate support with full understanding of medical needs and sensitivities.",
      benefits: ["Medical understanding", "Sensitive support", "Full accessibility"]
    },
    step8: {
      title: "Healthcare Communication",
      example: "Direct lines for on-call coordination, integration with hospital switchboards, and priority contact protocols.",
      withName: "[Name], your on-call coordinator will have direct access to our priority dispatch system.",
      benefits: ["On-call integration", "Hospital coordination", "Priority contacts"]
    },
    step9: {
      title: "Healthcare Protection Summary",
      example: "Complete medical professional protection with hospital expertise, priority response, and on-call flexibility.",
      withName: "[Name], your healthcare protection plan ensures reliable support for all medical responsibilities.",
      benefits: ["Medical coverage", "Priority ready", "Hospital expertise"]
    }
  },

  financial: {
    step2: {
      title: "Financial Services Benefits",
      example: "Investment bankers get teams familiar with trading hours and City protocols. One hedge fund manager's officers handle 4 AM market opening arrivals and know all Canary Wharf security procedures.",
      withName: "[Name], in financial services, your team will understand market hours, handle early starts, and navigate City security efficiently.",
      benefits: ["Trading hours adaptation", "Financial district expertise", "Corporate security protocols"]
    },
    step3: {
      title: "Financial Service Excellence",
      example: "Teams adapted to market hours, understanding of deal sensitivity, and experience with financial district protocols.",
      withName: "[Name], your officers understand deal confidentiality, market timing, and the pace of financial services.",
      benefits: ["Market timing", "Deal confidentiality", "Financial protocols"]
    },
    step4: {
      title: "Financial Coverage Network",
      example: "Complete coverage of the Square Mile, Canary Wharf, and emerging fintech hubs across London.",
      withName: "[Name], we know every trading floor entrance, dealing room location, and financial venue in the City.",
      benefits: ["City coverage", "Canary Wharf expertise", "Fintech hub access"]
    },
    step5: {
      title: "Financial Special Services",
      example: "Pre-market arrivals, late-night deal closings, and secure transport during sensitive transaction periods.",
      withName: "[Name], we'll accommodate market hours, handle deal roadshows, and maintain security during transactions.",
      benefits: ["Market hours", "Deal roadshows", "Transaction security"]
    },
    step6: {
      title: "Financial Priority Protocols",
      example: "Immediate response for market events, with backup vehicles for critical trading days and deal closings.",
      withName: "[Name], your priority protocols include priority response for market-critical situations.",
      benefits: ["Market event response", "Trading day priority", "Deal closing support"]
    },
    step7: {
      title: "Financial Accessibility",
      example: "Professional support across all financial venues, maintaining the pace and standards of the City.",
      withName: "[Name], we'll ensure seamless support at all financial venues while maintaining professional standards.",
      benefits: ["Venue support", "Professional standards", "City pace"]
    },
    step8: {
      title: "Financial Communication",
      example: "Secure channels for sensitive periods, integration with trading assistants, and compliance with financial regulations.",
      withName: "[Name], communications will meet financial regulatory standards with appropriate confidentiality.",
      benefits: ["Regulatory compliance", "Secure channels", "Assistant integration"]
    },
    step9: {
      title: "Financial Protection Summary",
      example: "Complete financial services protection with market hours flexibility and transaction confidentiality.",
      withName: "[Name], your financial protection plan accommodates market demands with complete security.",
      benefits: ["Market flexibility", "Complete security", "Transaction confidentiality"]
    }
  },

  entertainment: {
    step2: {
      title: "Entertainment Industry Benefits",
      example: "Performers get teams trained in venue protocols and crowd management. One West End star's regular Protection Officers know every stage door, handle paparazzi situations, and coordinate with venue security teams.",
      withName: "[Name], as an entertainer, your security team will be trained in discrete crowd management, venue protocols, and media interaction handling.",
      benefits: ["Venue expertise", "Paparazzi management", "Fan interaction protocols"]
    },
    step3: {
      title: "Entertainment Service Features",
      example: "Teams experienced with red carpets, stage doors, and discrete celebrity protection protocols.",
      withName: "[Name], your officers understand show business demands, fan dynamics, and media presence management.",
      benefits: ["Red carpet expertise", "Stage door protocols", "Celebrity protection"]
    },
    step4: {
      title: "Entertainment Coverage Network",
      example: "Coverage of all major venues, from West End theatres to O2 Arena, including studios and production facilities.",
      withName: "[Name], we know every venue entrance, VIP area, and backstage route across London's entertainment scene.",
      benefits: ["Venue coverage", "VIP access", "Backstage routes"]
    },
    step5: {
      title: "Entertainment Special Services",
      example: "Award ceremony logistics, tour management support, and coordination with venue and production security.",
      withName: "[Name], we'll handle premiere logistics, tour schedules, and coordinate with production security teams.",
      benefits: ["Premiere logistics", "Tour support", "Production coordination"]
    },
    step6: {
      title: "Entertainment Priority Protocols",
      example: "Rapid extraction from crowded venues, paparazzi evasion techniques, and fan incident management.",
      withName: "[Name], your priority protocols include crowd extraction, media evasion, and venue evacuation procedures.",
      benefits: ["Crowd extraction", "Media evasion", "Venue evacuation"]
    },
    step7: {
      title: "Entertainment Accessibility",
      example: "Discrete support at all venues, maintaining image while ensuring comfort and accessibility.",
      withName: "[Name], we'll provide discrete support at all venues while maintaining your public image.",
      benefits: ["Discrete support", "Image maintenance", "Venue accessibility"]
    },
    step8: {
      title: "Entertainment Communication",
      example: "Coordination with management, publicists, and venue security for seamless event execution.",
      withName: "[Name], your management team will have direct coordination with our specialized entertainment division.",
      benefits: ["Management coordination", "Publicist integration", "Venue liaison"]
    },
    step9: {
      title: "Entertainment Protection Summary",
      example: "Complete entertainment industry protection with venue expertise and media management capabilities.",
      withName: "[Name], your entertainment protection plan ensures safe, discrete coverage at all venues and events.",
      benefits: ["Industry expertise", "Complete coverage", "Media management"]
    }
  },

  academic: {
    step2: {
      title: "Academic Security Benefits",
      example: "University professors get officers familiar with campus layouts and academic schedules. One Oxford don's team knows college protocols, manages lecture tours, and handles conference travel.",
      withName: "[Name], in academia, your team will understand university protocols, manage conference schedules, and handle research-related travel.",
      benefits: ["Campus navigation", "Academic calendar awareness", "Conference logistics"]
    },
    step3: {
      title: "Academic Service Features",
      example: "Teams understanding academic schedules, research requirements, and the unique culture of university life.",
      withName: "[Name], your officers appreciate academic traditions, understand term schedules, and respect scholarly pursuits.",
      benefits: ["Academic understanding", "Term awareness", "Research respect"]
    },
    step4: {
      title: "Academic Coverage Network",
      example: "Coverage of all London universities, research facilities, and academic venues including conference centers.",
      withName: "[Name], we know every campus entrance, lecture hall location, and academic venue across London.",
      benefits: ["University coverage", "Research facilities", "Conference venues"]
    },
    step5: {
      title: "Academic Special Services",
      example: "Late library sessions, conference travel, research facility access, and visiting scholar coordination.",
      withName: "[Name], we'll accommodate late research hours, handle conference logistics, and coordinate visiting academic transport.",
      benefits: ["Research hours", "Conference travel", "Scholar coordination"]
    },
    step6: {
      title: "Academic Priority Protocols",
      example: "Response protocols for campus emergencies, with understanding of university security procedures.",
      withName: "[Name], your priority protocols integrate with campus security and university priority procedures.",
      benefits: ["Campus integration", "University protocols", "Priority coordination"]
    },
    step7: {
      title: "Academic Accessibility",
      example: "Support across all academic venues, from ancient college buildings to modern research facilities.",
      withName: "[Name], we'll ensure appropriate support at all academic venues, respecting institutional traditions.",
      benefits: ["Venue accessibility", "Traditional respect", "Modern facilities"]
    },
    step8: {
      title: "Academic Communication",
      example: "Coordination with departmental administrators, integration with academic calendars, and conference planning.",
      withName: "[Name], your department will have direct coordination for seamless academic schedule management.",
      benefits: ["Department integration", "Calendar coordination", "Conference planning"]
    },
    step9: {
      title: "Academic Protection Summary",
      example: "Complete academic protection with campus expertise and conference travel management.",
      withName: "[Name], your academic protection plan supports all scholarly activities with appropriate security.",
      benefits: ["Campus expertise", "Research support", "Conference coverage"]
    }
  },

  entrepreneur: {
    step2: {
      title: "Entrepreneur Protection Benefits",
      example: "Startup founders get flexible teams adapting to unpredictable schedules. One tech CEO's officers handle everything from investor meetings in Shoreditch to international airport runs at odd hours.",
      withName: "[Name], as a business owner, your security adapts to startup life - irregular hours, multiple meeting locations, and rapid schedule changes.",
      benefits: ["Schedule flexibility", "Multi-location coordination", "Investor meeting protocols"]
    },
    step3: {
      title: "Entrepreneur Service Features",
      example: "Teams adapted to startup pace, understanding of investor relations, and flexibility for rapid pivots.",
      withName: "[Name], your officers understand startup dynamics, pitch meeting importance, and the need for agility.",
      benefits: ["Startup flexibility", "Pitch support", "Agile response"]
    },
    step4: {
      title: "Entrepreneur Coverage Network",
      example: "Coverage from tech hubs in Shoreditch to investor offices in Mayfair, plus all London airports.",
      withName: "[Name], we cover all your business locations, from co-working spaces to investor offices across London.",
      benefits: ["Tech hub coverage", "Investor locations", "Airport access"]
    },
    step5: {
      title: "Entrepreneur Special Services",
      example: "Last-minute investor meetings, product launch events, and international business travel coordination.",
      withName: "[Name], we'll handle urgent investor calls, support product launches, and manage startup event logistics.",
      benefits: ["Investor meetings", "Launch events", "Travel coordination"]
    },
    step6: {
      title: "Entrepreneur Priority Protocols",
      example: "Immediate response for business-critical situations, with understanding of startup urgency.",
      withName: "[Name], your priority protocols prioritize business-critical meetings and time-sensitive opportunities.",
      benefits: ["Business priority", "Opportunity response", "Startup urgency"]
    },
    step7: {
      title: "Entrepreneur Accessibility",
      example: "Support at all business venues, from casual co-working spaces to formal boardrooms.",
      withName: "[Name], we'll provide appropriate support across all your diverse business environments.",
      benefits: ["Venue flexibility", "Environment adaptation", "Professional support"]
    },
    step8: {
      title: "Entrepreneur Communication",
      example: "Flexible communication adapting to startup pace, with integration options for various scheduling tools.",
      withName: "[Name], we'll integrate with your preferred scheduling tools and adapt to rapid changes.",
      benefits: ["Tool integration", "Flexible communication", "Rapid adaptation"]
    },
    step9: {
      title: "Entrepreneur Protection Summary",
      example: "Complete entrepreneur protection with maximum flexibility and business-focused security.",
      withName: "[Name], your entrepreneur protection plan provides agile security for all business ventures.",
      benefits: ["Maximum flexibility", "Business focus", "Agile security"]
    }
  },

  security: {
    step2: {
      title: "Security Professional Benefits",
      example: "Off-duty officers get peer-level protection from experienced colleagues. One Met police inspector uses our service for family transport, appreciating the professional understanding of threat assessment.",
      withName: "[Name], as a security professional, you'll work with peer-level officers who understand operational security and professional courtesy.",
      benefits: ["Peer-level expertise", "Operational security", "Professional protocols"]
    },
    step3: {
      title: "Security Service Standards",
      example: "Teams of experienced officers providing peer-level protection with full operational understanding.",
      withName: "[Name], your fellow professionals provide protection with complete understanding of security protocols.",
      benefits: ["Peer expertise", "Protocol knowledge", "Operational understanding"]
    },
    step4: {
      title: "Security Coverage Network",
      example: "Coverage across all areas with particular attention to threat assessment and route planning.",
      withName: "[Name], we provide coverage with professional-level threat assessment and tactical awareness.",
      benefits: ["Threat assessment", "Tactical planning", "Professional coverage"]
    },
    step5: {
      title: "Security Special Services",
      example: "Family protection, off-duty transport, and coordination with professional security networks.",
      withName: "[Name], we'll provide family protection and off-duty support with professional understanding.",
      benefits: ["Family protection", "Off-duty support", "Network coordination"]
    },
    step6: {
      title: "Security Priority Protocols",
      example: "Professional-level priority response with full understanding of threat escalation and procedures.",
      withName: "[Name], your priority protocols reflect professional standards and operational procedures.",
      benefits: ["Professional response", "Threat escalation", "Operational procedures"]
    },
    step7: {
      title: "Security Accessibility",
      example: "Support with full understanding of professional requirements and operational considerations.",
      withName: "[Name], we'll provide support with complete professional understanding and discretion.",
      benefits: ["Professional support", "Operational awareness", "Complete discretion"]
    },
    step8: {
      title: "Security Communication",
      example: "Secure professional channels with appropriate operational security and protocol compliance.",
      withName: "[Name], communications meet professional security standards with operational protocols.",
      benefits: ["Secure channels", "Professional standards", "Protocol compliance"]
    },
    step9: {
      title: "Security Protection Summary",
      example: "Peer-level protection from experienced professionals with complete operational understanding.",
      withName: "[Name], your security protection provides professional-grade coverage from fellow experts.",
      benefits: ["Peer-level service", "Professional expertise", "Operational excellence"]
    }
  },

  family: {
    step2: {
      title: "Family Protection Benefits",
      example: "Families get consistent teams trained in child safety protocols. One Kensington family's regular officers handle school runs, know car seat regulations, and manage children's activity schedules.",
      withName: "[Name], your family's security team will be trained in child protection, school run efficiency, and family logistics management.",
      benefits: ["Child safety expertise", "School run coordination", "Family-friendly officers"]
    },
    step3: {
      title: "Family Service Features",
      example: "Teams trained in child safety, family dynamics, and maintaining a friendly yet professional presence.",
      withName: "[Name], your officers understand family needs, child safety requirements, and activity scheduling.",
      benefits: ["Child safety", "Family dynamics", "Friendly presence"]
    },
    step4: {
      title: "Family Coverage Areas",
      example: "Coverage of all family destinations - schools, activities, shopping areas, and entertainment venues.",
      withName: "[Name], we cover all your family's regular routes, from school gates to activity centers across London.",
      benefits: ["School coverage", "Activity venues", "Family destinations"]
    },
    step5: {
      title: "Family Special Services",
      example: "School run management, activity coordination, and safe transport for children's friends.",
      withName: "[Name], we'll manage complex school runs, coordinate activities, and safely transport young Principals.",
      benefits: ["School runs", "Activity transport", "Friend inclusion"]
    },
    step6: {
      title: "Family Priority Protocols",
      example: "Child-focused priority procedures with immediate family notification and coordination.",
      withName: "[Name], your priority protocols prioritize child safety with immediate family coordination.",
      benefits: ["Child safety priority", "Family notification", "Coordinated response"]
    },
    step7: {
      title: "Family Accessibility",
      example: "Full support for all family members, including assistance with prams, car seats, and equipment.",
      withName: "[Name], we'll provide appropriate support for all family members and their equipment needs.",
      benefits: ["Family support", "Equipment assistance", "Child-friendly help"]
    },
    step8: {
      title: "Family Communication",
      example: "Family-friendly communication with parent coordination and appropriate child interaction.",
      withName: "[Name], we'll coordinate with all family members appropriately, maintaining clear communication.",
      benefits: ["Parent coordination", "Family updates", "Appropriate interaction"]
    },
    step9: {
      title: "Family Protection Summary",
      example: "Complete family protection with child safety expertise and family logistics management.",
      withName: "[Name], your family protection plan ensures safe, reliable transport for all family members.",
      benefits: ["Complete family coverage", "Child safety", "Reliable service"]
    }
  },

  tourist: {
    step2: {
      title: "Visitor Protection Benefits",
      example: "International visitors get officers knowledgeable about tourist areas and cultural considerations. One diplomatic family's team provides local insights while maintaining security awareness.",
      withName: "[Name], as a visitor to the UK, your officers will combine security expertise with local knowledge and cultural sensitivity.",
      benefits: ["Tourist area knowledge", "Cultural awareness", "Embassy location familiarity"]
    },
    step3: {
      title: "Visitor Service Features",
      example: "Teams providing local expertise, cultural awareness, and tourist secureDestination knowledge.",
      withName: "[Name], your officers offer local insights, tourist guidance, and cultural bridge-building.",
      benefits: ["Local expertise", "Tourist guidance", "Cultural bridging"]
    },
    step4: {
      title: "Visitor Coverage Network",
      example: "Coverage of all major tourist destinations, hotels, airports, and embassy districts.",
      withName: "[Name], we cover all visitor hotspots from Westminster to Windsor, plus all London airports.",
      benefits: ["Tourist destinations", "Hotel coverage", "Airport transfers"]
    },
    step5: {
      title: "Visitor Special Services",
      example: "Tourist itinerary support, shopping district navigation, and cultural site access assistance.",
      withName: "[Name], we'll support your UK visit with local knowledge, shopping assistance, and cultural insights.",
      benefits: ["Itinerary support", "Shopping assistance", "Cultural access"]
    },
    step6: {
      title: "Visitor Priority Protocols",
      example: "Multi-lingual support, embassy coordination, and international priority procedures.",
      withName: "[Name], your priority protocols include embassy liaison and international support coordination.",
      benefits: ["Embassy coordination", "Multi-lingual support", "International procedures"]
    },
    step7: {
      title: "Visitor Accessibility",
      example: "Support navigating UK systems and venues with cultural sensitivity and patience.",
      withName: "[Name], we'll help navigate UK venues and systems with patient, culturally-aware assistance.",
      benefits: ["Navigation support", "Cultural sensitivity", "Patient assistance"]
    },
    step8: {
      title: "Visitor Communication",
      example: "Multi-lingual options, international calling support, and time zone awareness.",
      withName: "[Name], we offer communication options suited to international visitors and time zones.",
      benefits: ["Language options", "International support", "Time zone flexibility"]
    },
    step9: {
      title: "Visitor Protection Summary",
      example: "Complete visitor protection combining security with local expertise and cultural awareness.",
      withName: "[Name], your UK visitor protection ensures safe, informed exploration of Britain.",
      benefits: ["Visitor security", "Local knowledge", "Cultural support"]
    }
  },

  student: {
    step2: {
      title: "Student Safety Benefits",
      example: "University students get affordable protection for late study sessions and social events. One LSE student's regular Protection Officer knows all campus buildings and provides safe late-night library returns.",
      withName: "[Name], as a student, you'll have officers who understand university life, exam pressures, and the need for safe, affordable transport.",
      benefits: ["Campus expertise", "Student budget consideration", "Late-night availability"]
    },
    step3: {
      title: "Student Service Features",
      example: "Budget-conscious service with understanding of student life, exam schedules, and social patterns.",
      withName: "[Name], your officers understand student budgets, exam stress, and the importance of reliable transport.",
      benefits: ["Budget awareness", "Exam understanding", "Social life balance"]
    },
    step4: {
      title: "Student Coverage Areas",
      example: "Coverage of all London universities, student areas, libraries, and popular social venues.",
      withName: "[Name], we cover all student areas from campus to Camden, libraries to late-night venues.",
      benefits: ["University coverage", "Student areas", "Social venues"]
    },
    step5: {
      title: "Student Special Services",
      example: "Late library runs, exam period support, and safe transport from social events.",
      withName: "[Name], we'll support your studies with late library runs, exam transport, and safe social returns.",
      benefits: ["Library runs", "Exam support", "Social safety"]
    },
    step6: {
      title: "Student Priority Protocols",
      example: "Rapid response for student emergencies with understanding of university support systems.",
      withName: "[Name], your priority protocols include campus security coordination and student support awareness.",
      benefits: ["Campus coordination", "Student support", "Rapid response"]
    },
    step7: {
      title: "Student Accessibility",
      example: "Affordable, accessible support understanding student needs and budget constraints.",
      withName: "[Name], we'll provide appropriate support within student budget considerations.",
      benefits: ["Affordable support", "Student understanding", "Budget respect"]
    },
    step8: {
      title: "Student Communication",
      example: "Flexible communication via preferred student channels with budget transparency.",
      withName: "[Name], we'll communicate via your preferred channels with clear, upfront pricing.",
      benefits: ["Flexible channels", "Price transparency", "Student-friendly"]
    },
    step9: {
      title: "Student Protection Summary",
      example: "Affordable student protection with campus expertise and social safety focus.",
      withName: "[Name], your student protection plan balances safety with budget for complete university coverage.",
      benefits: ["Student safety", "Budget balance", "Campus coverage"]
    }
  },

  vip: {
    step2: {
      title: "VIP Protection Benefits",
      example: "Public figures get teams trained in advanced protection and media management. One FTSE CEO's team coordinates with corporate security, manages public appearances, and maintains absolute discretion.",
      withName: "[Name], as a high-profile individual, your team will provide discrete, professional protection with media awareness and public appearance expertise.",
      benefits: ["Advanced protection protocols", "Media management", "Absolute discretion"]
    },
    step3: {
      title: "VIP Service Excellence",
      example: "Elite teams providing celebrity-level protection with media management and public appearance expertise.",
      withName: "[Name], your elite officers deliver red-carpet ready protection with complete discretion.",
      benefits: ["Elite protection", "Media expertise", "Public appearance support"]
    },
    step4: {
      title: "VIP Coverage Network",
      example: "Global coverage capabilities with primary focus on high-end London venues and private locations.",
      withName: "[Name], we provide coverage from Mayfair to Monaco, with expertise in exclusive venues worldwide.",
      benefits: ["Global capability", "Exclusive venues", "Private locations"]
    },
    step5: {
      title: "VIP Special Services",
      example: "Red carpet events, private jet coordination, and liaison with existing security details.",
      withName: "[Name], we'll coordinate private aviation, manage red carpet events, and integrate with your security team.",
      benefits: ["Aviation coordination", "Event management", "Security integration"]
    },
    step6: {
      title: "VIP Priority Protocols",
      example: "Advanced threat response with immediate extraction capabilities and media management.",
      withName: "[Name], your priority protocols include advanced threat response and discrete extraction procedures.",
      benefits: ["Advanced response", "Extraction capability", "Media control"]
    },
    step7: {
      title: "VIP Accessibility",
      example: "Discrete, dignified support maintaining image while ensuring comfort and accessibility.",
      withName: "[Name], we'll provide invisible support that maintains your public image perfectly.",
      benefits: ["Discrete support", "Image maintenance", "Dignified assistance"]
    },
    step8: {
      title: "VIP Communication",
      example: "Dedicated account management with 24/7 concierge-level service and encrypted communications.",
      withName: "[Name], you'll have dedicated management with encrypted channels and concierge service.",
      benefits: ["Dedicated management", "Encrypted channels", "Concierge service"]
    },
    step9: {
      title: "VIP Protection Summary",
      example: "Elite VIP protection with advanced protocols, media management, and absolute discretion.",
      withName: "[Name], your VIP protection delivers celebrity-level security with complete confidentiality.",
      benefits: ["Elite service", "Complete discretion", "Advanced protection"]
    }
  },

  household: {
    step2: {
      title: "Household Staff Benefits",
      example: "Estate staff get reliable transport between properties and for employer errands. One Belgravia butler's regular Protection Officer manages household logistics, supplier runs, and maintains employer confidentiality.",
      withName: "[Name], in household service, your transport will support estate logistics, maintain employer confidentiality, and adapt to household schedules.",
      benefits: ["Estate navigation", "Employer confidentiality", "Flexible scheduling"]
    },
    step3: {
      title: "Household Service Features",
      example: "Teams understanding household protocols, employer requirements, and the importance of discretion.",
      withName: "[Name], your officers understand household service standards, employer expectations, and estate protocols.",
      benefits: ["Service standards", "Employer awareness", "Estate protocols"]
    },
    step4: {
      title: "Household Coverage Network",
      example: "Coverage between London properties, country estates, and supplier locations across the UK.",
      withName: "[Name], we cover all estate locations from Mayfair to country properties and key suppliers.",
      benefits: ["Estate coverage", "Country properties", "Supplier routes"]
    },
    step5: {
      title: "Household Special Services",
      example: "Supplier collections, estate errands, staff transport, and employer family support.",
      withName: "[Name], we'll handle supplier runs, staff coordination, and support employer family needs.",
      benefits: ["Supplier runs", "Staff transport", "Family support"]
    },
    step6: {
      title: "Household Priority Protocols",
      example: "Immediate response for employer emergencies with appropriate household protocol awareness.",
      withName: "[Name], your priority protocols align with household procedures and employer requirements.",
      benefits: ["Employer priority", "Household alignment", "Protocol awareness"]
    },
    step7: {
      title: "Household Accessibility",
      example: "Support for all household duties with understanding of service standards and estate requirements.",
      withName: "[Name], we'll support all household needs with appropriate service standard awareness.",
      benefits: ["Service support", "Estate understanding", "Duty assistance"]
    },
    step8: {
      title: "Household Communication",
      example: "Coordination with estate management, butler's pantry, and household administration.",
      withName: "[Name], we'll coordinate with household management maintaining appropriate service protocols.",
      benefits: ["Estate coordination", "Management integration", "Service protocols"]
    },
    step9: {
      title: "Household Protection Summary",
      example: "Complete household staff support with estate expertise and employer confidentiality.",
      withName: "[Name], your household service plan ensures reliable support for all estate duties.",
      benefits: ["Estate support", "Complete confidentiality", "Reliable service"]
    }
  },

  journalist: {
    step2: {
      title: "Media Professional Benefits",
      example: "Journalists get officers who understand deadline pressures and assignment unpredictability. One BBC correspondent's team handles breaking news callouts and knows all London media venues.",
      withName: "[Name], as a media professional, your team will adapt to breaking news, manage equipment transport, and understand deadline pressures.",
      benefits: ["Deadline awareness", "Equipment handling", "News venue knowledge"]
    },
    step3: {
      title: "Media Service Features",
      example: "Teams adapted to news cycles, understanding of editorial deadlines, and equipment security.",
      withName: "[Name], your officers understand news urgency, editorial deadlines, and the importance of source protection.",
      benefits: ["News cycle adaptation", "Deadline respect", "Source confidentiality"]
    },
    step4: {
      title: "Media Coverage Network",
      example: "Coverage of all media venues, from Broadcasting House to press conference locations citywide.",
      withName: "[Name], we know every newsroom, broadcast studio, and press venue across London.",
      benefits: ["Media venue coverage", "Studio locations", "Press venues"]
    },
    step5: {
      title: "Media Special Services",
      example: "Breaking news response, equipment transport, and coordination with news desk schedules.",
      withName: "[Name], we'll respond to breaking news, handle broadcast equipment, and adapt to editorial changes.",
      benefits: ["Breaking news", "Equipment transport", "Editorial flexibility"]
    },
    step6: {
      title: "Media Priority Protocols",
      example: "Immediate response for breaking stories with understanding of news priority and deadlines.",
      withName: "[Name], your priority protocols prioritize breaking news and editorial deadlines.",
      benefits: ["News priority", "Breaking story response", "Deadline focus"]
    },
    step7: {
      title: "Media Accessibility",
      example: "Support at all news venues with equipment assistance and deadline awareness.",
      withName: "[Name], we'll provide support at all media venues with full equipment assistance.",
      benefits: ["Venue support", "Equipment help", "Deadline understanding"]
    },
    step8: {
      title: "Media Communication",
      example: "Integration with news desks, editorial coordination, and deadline-aware scheduling.",
      withName: "[Name], your news desk will have direct coordination for breaking story response.",
      benefits: ["News desk integration", "Editorial coordination", "Breaking news alerts"]
    },
    step9: {
      title: "Media Protection Summary",
      example: "Complete media professional support with deadline awareness and news venue expertise.",
      withName: "[Name], your media protection ensures you never miss a story with reliable, responsive transport.",
      benefits: ["Media coverage", "Deadline reliability", "News expertise"]
    }
  },

  events: {
    step2: {
      title: "Event Professional Benefits",
      example: "Event organizers get teams familiar with venue logistics and supplier coordination. One wedding planner's regular officers handle multiple venue visits, supplier collections, and client meetings.",
      withName: "[Name], as an event organizer, your team will understand venue logistics, handle supplier coordination, and manage event day pressures.",
      benefits: ["Venue expertise", "Supplier coordination", "Event timeline management"]
    },
    step3: {
      title: "Event Service Excellence",
      example: "Teams experienced with event timelines, vendor coordination, and high-pressure event days.",
      withName: "[Name], your officers understand event dynamics, vendor relationships, and timeline criticality.",
      benefits: ["Timeline expertise", "Vendor relations", "Event day focus"]
    },
    step4: {
      title: "Event Coverage Network",
      example: "Coverage of all London venues, supplier locations, and client meeting points.",
      withName: "[Name], we know every event venue, supplier warehouse, and client location across London.",
      benefits: ["Venue coverage", "Supplier locations", "Client venues"]
    },
    step5: {
      title: "Event Special Services",
      example: "Multi-venue coordination, supplier runs, client transport, and event day logistics.",
      withName: "[Name], we'll coordinate multiple venues, manage supplier collections, and handle event day transport.",
      benefits: ["Multi-venue support", "Supplier logistics", "Event transport"]
    },
    step6: {
      title: "Event Priority Protocols",
      example: "Rapid response for event emergencies with backup vehicle availability for critical moments.",
      withName: "[Name], your priority protocols include event day priority and backup vehicle availability.",
      benefits: ["Event priority", "Backup vehicles", "Crisis management"]
    },
    step7: {
      title: "Event Accessibility",
      example: "Support at all venues with equipment handling and guest assistance capabilities.",
      withName: "[Name], we'll provide venue support with full equipment and guest assistance.",
      benefits: ["Venue assistance", "Equipment handling", "Guest support"]
    },
    step8: {
      title: "Event Communication",
      example: "Coordination with event teams, vendor liaison, and real-time event day updates.",
      withName: "[Name], your event team will have direct coordination for seamless event execution.",
      benefits: ["Team coordination", "Vendor liaison", "Real-time updates"]
    },
    step9: {
      title: "Event Protection Summary",
      example: "Complete event professional support with venue expertise and supplier coordination.",
      withName: "[Name], your event protection ensures flawless execution with reliable logistics support.",
      benefits: ["Event expertise", "Flawless execution", "Logistics support"]
    }
  },

  special: {
    step2: {
      title: "Special Event Benefits",
      example: "Special events receive dedicated coordination and attention to detail. One couple's wedding team managed guest transport, venue coordination, and ensured perfect timing throughout the day.",
      withName: "[Name], for your special occasion, we'll provide meticulous planning, guest coordination, and ensure every detail is perfect.",
      benefits: ["Event coordination", "Guest management", "Special attention to detail"]
    },
    step3: {
      title: "Special Occasion Excellence",
      example: "Dedicated teams providing white-glove service for life's most important moments.",
      withName: "[Name], your special day receives our best officers providing impeccable service.",
      benefits: ["White-glove service", "Special attention", "Memorable moments"]
    },
    step4: {
      title: "Special Event Coverage",
      example: "Coverage for all event locations, from ceremonies to receptions and guest accommodations.",
      withName: "[Name], we'll cover all your event locations ensuring seamless transitions throughout your day.",
      benefits: ["Complete coverage", "Seamless transitions", "Guest coordination"]
    },
    step5: {
      title: "Special Event Services",
      example: "Guest shuttle services, VIP transport, photography location visits, and timeline management.",
      withName: "[Name], we'll manage guest transport, coordinate photo locations, and maintain your timeline.",
      benefits: ["Guest shuttles", "Photo coordination", "Timeline management"]
    },
    step6: {
      title: "Special Event Priority",
      example: "Contingency planning for weather, delays, and any unexpected situations on your special day.",
      withName: "[Name], your special day includes full contingency planning for any situation.",
      benefits: ["Contingency planning", "Weather backup", "Problem solving"]
    },
    step7: {
      title: "Special Event Accessibility",
      example: "Ensuring all guests, regardless of needs, can fully participate in your celebration.",
      withName: "[Name], we'll ensure every guest can comfortably enjoy your special occasion.",
      benefits: ["Guest inclusion", "Full accessibility", "Comfort assurance"]
    },
    step8: {
      title: "Special Event Communication",
      example: "Dedicated event coordinator with real-time updates and guest coordination.",
      withName: "[Name], you'll have a dedicated coordinator managing all transport details for your event.",
      benefits: ["Dedicated coordinator", "Guest updates", "Event management"]
    },
    step9: {
      title: "Special Event Summary",
      example: "Complete special occasion management ensuring your day is perfect in every detail.",
      withName: "[Name], your special event protection ensures a perfect, stress-free celebration.",
      benefits: ["Perfect execution", "Stress-free day", "Complete management"]
    }
  },

  sports: {
    step2: {
      title: "Athletic Professional Benefits",
      example: "Athletes get teams understanding training schedules and competition logistics. One Premier League player's officers handle training ground runs, match day logistics, and fan interaction management.",
      withName: "[Name], as an athlete, your team will adapt to training schedules, manage competition logistics, and handle fan interactions professionally.",
      benefits: ["Training schedule adaptation", "Venue expertise", "Fan management"]
    },
    step3: {
      title: "Athletic Service Features",
      example: "Teams adapted to training regimens, competition schedules, and sports venue protocols.",
      withName: "[Name], your officers understand athletic demands, recovery needs, and competition pressures.",
      benefits: ["Training awareness", "Recovery respect", "Competition focus"]
    },
    step4: {
      title: "Athletic Coverage Network",
      example: "Coverage of all training facilities, competition venues, and sports medicine centers.",
      withName: "[Name], we cover all sporting venues from training grounds to stadiums across the UK.",
      benefits: ["Training facilities", "Competition venues", "Medical centers"]
    },
    step5: {
      title: "Athletic Special Services",
      example: "Early morning training runs, competition day logistics, and equipment transport.",
      withName: "[Name], we'll handle early training sessions, manage competition days, and transport equipment safely.",
      benefits: ["Training support", "Competition logistics", "Equipment transport"]
    },
    step6: {
      title: "Athletic Priority Protocols",
      example: "Immediate response for sports injuries with direct routes to sports medicine facilities.",
      withName: "[Name], your priority protocols include sports injury response and medical facility access.",
      benefits: ["Injury response", "Medical access", "Rapid transport"]
    },
    step7: {
      title: "Athletic Accessibility",
      example: "Support for any physical requirements with understanding of athletic recovery needs.",
      withName: "[Name], we'll support your physical needs with full understanding of athletic requirements.",
      benefits: ["Physical support", "Recovery awareness", "Athletic understanding"]
    },
    step8: {
      title: "Athletic Communication",
      example: "Coordination with coaching staff, integration with training schedules, and competition planning.",
      withName: "[Name], your coaching team will have direct coordination for training and competition.",
      benefits: ["Coach coordination", "Schedule integration", "Competition planning"]
    },
    step9: {
      title: "Athletic Protection Summary",
      example: "Complete athletic support with training flexibility and competition expertise.",
      withName: "[Name], your athletic protection supports peak performance with reliable transport.",
      benefits: ["Performance support", "Training flexibility", "Competition ready"]
    }
  },

  creative: {
    step2: {
      title: "Creative Industry Benefits",
      example: "Artists and designers get officers who understand studio schedules and gallery events. One Shoreditch artist's team handles art transport, gallery openings, and maintains creative industry discretion.",
      withName: "[Name], as a creative professional, your team will understand unconventional schedules, handle valuable works, and respect creative processes.",
      benefits: ["Flexible scheduling", "Artwork handling", "Gallery venue knowledge"]
    },
    step3: {
      title: "Creative Service Features",
      example: "Teams respecting creative processes, understanding unconventional schedules, and artwork value.",
      withName: "[Name], your officers appreciate creative work, respect studio time, and understand art world dynamics.",
      benefits: ["Creative respect", "Studio awareness", "Art world understanding"]
    },
    step4: {
      title: "Creative Coverage Network",
      example: "Coverage of studios, galleries, creative spaces, and cultural venues across London.",
      withName: "[Name], we cover all creative spaces from East London studios to West End galleries.",
      benefits: ["Studio coverage", "Gallery access", "Cultural venues"]
    },
    step5: {
      title: "Creative Special Services",
      example: "Artwork transport, late studio sessions, gallery opening logistics, and supplier runs.",
      withName: "[Name], we'll transport artworks safely, support late creative sessions, and manage opening nights.",
      benefits: ["Art transport", "Late sessions", "Opening logistics"]
    },
    step6: {
      title: "Creative Priority Protocols",
      example: "Careful handling procedures for valuable works with understanding of creative deadlines.",
      withName: "[Name], your priority protocols include artwork protection and exhibition deadline priority.",
      benefits: ["Artwork protection", "Deadline priority", "Careful handling"]
    },
    step7: {
      title: "Creative Accessibility",
      example: "Support at all creative venues with equipment assistance and material handling.",
      withName: "[Name], we'll provide support at all creative spaces with appropriate material handling.",
      benefits: ["Venue support", "Material handling", "Equipment assistance"]
    },
    step8: {
      title: "Creative Communication",
      example: "Flexible communication respecting creative flow with gallery and studio coordination.",
      withName: "[Name], we'll respect your creative process while maintaining reliable communication.",
      benefits: ["Creative respect", "Gallery coordination", "Flexible contact"]
    },
    step9: {
      title: "Creative Protection Summary",
      example: "Complete creative professional support with artwork security and venue expertise.",
      withName: "[Name], your creative protection ensures safe transport for you and your valuable works.",
      benefits: ["Creative support", "Artwork security", "Venue expertise"]
    }
  },

  delegation: {
    step2: {
      title: "Diplomatic Protection Benefits",
      example: "Diplomatic groups receive protocol-aware teams with language capabilities. One UN delegation's security team coordinated multi-vehicle convoys, embassy visits, and maintained diplomatic protocols.",
      withName: "[Name], your delegation will receive protocol-trained officers, multi-vehicle coordination, and appropriate diplomatic considerations.",
      benefits: ["Diplomatic protocols", "Language capabilities", "Convoy coordination"]
    },
    step3: {
      title: "Delegation Service Standards",
      example: "Teams providing diplomatic-level service with protocol awareness and multi-vehicle coordination.",
      withName: "[Name], your delegation receives diplomatic-standard protection with full protocol compliance.",
      benefits: ["Diplomatic standards", "Protocol compliance", "Delegation management"]
    },
    step4: {
      title: "Delegation Coverage Network",
      example: "Coverage of embassies, international organizations, conference centers, and official residences.",
      withName: "[Name], we cover all diplomatic locations from embassy districts to UN facilities.",
      benefits: ["Embassy coverage", "International venues", "Official locations"]
    },
    step5: {
      title: "Delegation Special Services",
      example: "Multi-vehicle convoys, interpreter coordination, and diplomatic pouch handling procedures.",
      withName: "[Name], we'll coordinate convoy movements, manage interpreters, and handle diplomatic materials.",
      benefits: ["Convoy management", "Interpreter support", "Diplomatic handling"]
    },
    step6: {
      title: "Delegation Priority Protocols",
      example: "Diplomatic priority procedures with embassy coordination and international protocols.",
      withName: "[Name], your priority protocols include embassy liaison and diplomatic immunity awareness.",
      benefits: ["Embassy coordination", "Diplomatic procedures", "International protocols"]
    },
    step7: {
      title: "Delegation Accessibility",
      example: "Multi-lingual support with cultural awareness and international accessibility standards.",
      withName: "[Name], we provide culturally-sensitive support meeting international accessibility standards.",
      benefits: ["Multi-lingual support", "Cultural sensitivity", "International standards"]
    },
    step8: {
      title: "Delegation Communication",
      example: "Diplomatic communication channels with embassy integration and protocol compliance.",
      withName: "[Name], communications will meet diplomatic standards with appropriate protocol channels.",
      benefits: ["Diplomatic channels", "Embassy integration", "Protocol compliance"]
    },
    step9: {
      title: "Delegation Protection Summary",
      example: "Complete diplomatic protection with protocol expertise and international coordination.",
      withName: "[Name], your delegation protection ensures diplomatic-level service with full protocol compliance.",
      benefits: ["Diplomatic service", "Protocol expertise", "International coordination"]
    }
  },

  general: {
    step2: {
      title: "Personalized Security Benefits",
      example: "All clients receive customized security matching their unique needs. Regular users report their teams anticipate requirements and provide seamless protection.",
      withName: "[Name], we'll customize your security service to match your specific requirements and preferences.",
      benefits: ["Customized approach", "Adaptive service", "Personal preferences"]
    },
    step3: {
      title: "Comprehensive Service Features",
      example: "Professional teams adapting to your specific needs with flexible, reliable protection.",
      withName: "[Name], your officers will adapt to your unique requirements with professional flexibility.",
      benefits: ["Professional adaptation", "Flexible service", "Reliable protection"]
    },
    step4: {
      title: "Full Coverage Network",
      example: "Complete coverage across London and beyond, tailored to your specific travel patterns.",
      withName: "[Name], we'll provide coverage wherever you need to go, learning your preferred routes.",
      benefits: ["Complete coverage", "Route optimization", "Location flexibility"]
    },
    step5: {
      title: "Tailored Special Services",
      example: "Services customized to your specific needs, from business to personal requirements.",
      withName: "[Name], we'll tailor our services to match your exact requirements and preferences.",
      benefits: ["Customized services", "Personal adaptation", "Flexible support"]
    },
    step6: {
      title: "Responsive Priority Protocols",
      example: "Immediate response with protocols adapted to your specific concerns and requirements.",
      withName: "[Name], your priority protocols will be customized to address your specific concerns.",
      benefits: ["Immediate response", "Customized protocols", "Personal focus"]
    },
    step7: {
      title: "Universal Accessibility",
      example: "Full support for any requirements with professional, dignified assistance.",
      withName: "[Name], we'll provide appropriate support for all your accessibility needs.",
      benefits: ["Full support", "Professional assistance", "Dignified service"]
    },
    step8: {
      title: "Flexible Communication",
      example: "Communication options tailored to your preferences with convenient scheduling.",
      withName: "[Name], we'll communicate according to your preferences with maximum convenience.",
      benefits: ["Flexible options", "Convenient scheduling", "Personal preferences"]
    },
    step9: {
      title: "Complete Protection Summary",
      example: "Comprehensive protection service customized to your unique requirements and preferences.",
      withName: "[Name], your protection plan is fully customized to meet all your security needs.",
      benefits: ["Complete protection", "Full customization", "Personal service"]
    }
  },

  default: {
    step2: {
      title: "Professional Security Benefits",
      example: "Regular clients report their security teams learn their routines, anticipate needs, and provide seamless protection across all London venues.",
      withName: "[Name], your dedicated security team will learn your preferences and provide consistent, reliable protection.",
      benefits: ["Consistent teams", "Learned preferences", "Seamless protection"]
    },
    step3: {
      title: "Premium Service Features",
      example: "Professional teams providing discrete, reliable protection with attention to detail.",
      withName: "[Name], your officers provide premium service with complete professionalism.",
      benefits: ["Premium service", "Professional teams", "Attention to detail"]
    },
    step4: {
      title: "Comprehensive Coverage",
      example: "Full coverage across Greater London with expertise in all major districts and venues.",
      withName: "[Name], we provide comprehensive coverage across all your regular destinations.",
      benefits: ["Full coverage", "District expertise", "Venue knowledge"]
    },
    step5: {
      title: "Enhanced Services",
      example: "Additional services tailored to your specific security and convenience needs.",
      withName: "[Name], we'll provide enhanced services matching your specific requirements.",
      benefits: ["Enhanced options", "Tailored services", "Specific solutions"]
    },
    step6: {
      title: "Priority Response",
      example: "24/7 priority response with immediate dispatch and crisis management capabilities.",
      withName: "[Name], your priority protocols ensure immediate response whenever needed.",
      benefits: ["24/7 response", "Immediate dispatch", "Crisis management"]
    },
    step7: {
      title: "Full Accessibility",
      example: "Complete accessibility support with professional, respectful assistance.",
      withName: "[Name], we provide full accessibility support with dignity and professionalism.",
      benefits: ["Complete support", "Professional assistance", "Respectful service"]
    },
    step8: {
      title: "Professional Communication",
      example: "Clear, professional communication with flexible contact options.",
      withName: "[Name], we maintain professional communication through your preferred channels.",
      benefits: ["Clear communication", "Flexible options", "Professional standards"]
    },
    step9: {
      title: "Protection Summary",
      example: "Complete professional protection service with reliability and discretion.",
      withName: "[Name], your protection plan provides comprehensive security with professional excellence.",
      benefits: ["Complete protection", "Professional service", "Reliable security"]
    }
  }
};

export function getPersonalizedContent(
  profileSelection: string | undefined,
  currentStep: string,
  userName?: string
): PersonalizedContent {
  const profileKey = profileSelection ? 
    (profileKeyMap[profileSelection] || 'default') : 
    'default';
  
  // Debug logging to track mapping flow
  console.log('getPersonalizedContent:', {
    profileSelection,
    mappedProfileKey: profileKey,
    currentStep,
    hasUserName: !!userName,
    availableProfiles: Object.keys(personalizedContent)
  });
  
  const profileContent = personalizedContent[profileKey] || personalizedContent.default;
  const stepContent = profileContent[currentStep] || profileContent.step2;
  
  // Additional debug info
  console.log('Content resolution:', {
    profileKey,
    stepKey: currentStep,
    contentTitle: stepContent.title,
    fallbackUsed: profileKey === 'default' && profileSelection !== 'prefer_not_to_say'
  });
  
  if (userName && userName.trim()) {
    return {
      ...stepContent,
      withName: stepContent.withName.replace('[Name]', userName)
    };
  }
  
  return stepContent;
}