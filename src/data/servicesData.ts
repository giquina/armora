import { ServiceData } from '../components/Services/ServiceCard';

export const SERVICES_DATA: ServiceData[] = [
  {
    id: 'standard',
    icon: '🛡️',
    name: 'Essential Protection',
    tagline: 'Professional close protection for everyday security needs',
    vehicle: 'Secure transport vehicles • Professional appearance',
    price: 'From £50/hour + £2.50/mile',
    protectionRate: '£50',
    transportRate: '£2.50',
    rating: '⭐⭐⭐⭐⭐ 4.8',
    totalRides: '(2,847 protection details)',
    collapsedFeatures: [
      '1 SIA-Licensed Protection Officer',
      'Background verified & fully insured',
      '2-hour minimum service'
    ],
    collapsedReview: {
      snippet: 'Professional security without being over the top',
      author: 'Emma, Marketing Manager'
    },
    personalizedMessage: 'Based on your profile as a [USER_PROFESSION], this service provides reliable protection with a single officer, ideal for business meetings and personal security',
    whatYouGet: [
      'Single SIA-licensed Close Protection Officer',
      'Security assessment and route planning',
      'Door-to-door protection service',
      'Real-time tracking and 24/7 support',
      'Perfect for: Business meetings, property viewings, medical appointments'
    ],
    officerDescription: {
      general: 'All our Close Protection Officers hold both security and private hire licenses, ensuring legal compliance and professional standards. Each officer undergoes enhanced DBS checks, defensive driving training, and conflict resolution certification. They\'re not just transport - they\'re your personal security team.',
      qualifications: [
        'SIA Close Protection License',
        'Enhanced DBS checked',
        'Defensive driving certified',
        'Conflict resolution trained',
        'First aid qualified'
      ]
    },
    reviews: [
      {
        rating: 5,
        text: 'Been using for 6 months now and honestly can\'t fault it. It\'s not over the top, just solid, reliable protection. My officer Amy is brilliant - professional but friendly, always on time, makes me feel safe without being dramatic about it. Exactly what I needed',
        author: 'Emma',
        role: 'Marketing Manager'
      },
      {
        rating: 5,
        text: 'Look I\'m not a CEO or celebrity, just wanted to feel safer commuting. This is perfect for normal people like me. Officers are properly trained (you can tell) but it doesn\'t feel excessive. My guy Marcus even remembers I like Radio 4 in the mornings 😊',
        author: 'James',
        role: 'Teacher'
      },
      {
        rating: 5,
        text: 'Started using after wanting more security. What I love is it\'s not intimidating or obvious - just quietly professional. My family loves that I have my own security team now. Worth every penny for the peace of mind',
        author: 'Priya',
        role: 'Retail Manager'
      }
    ],
    caseStudies: [
      {
        title: 'Business Meeting in Central London',
        situation: 'Corporate executive needed protection for client meeting',
        solution: 'Single CPO provided door-to-door security with route briefing',
        result: 'Professional arrival, officer waited with vehicle during meeting, secure return journey',
        userType: 'business'
      },
      {
        title: 'Property Viewing in Unfamiliar Area',
        situation: 'High-value property viewing in unknown neighborhood',
        solution: 'CPO conducted area assessment and accompanied principal',
        result: 'Complete peace of mind viewing properties in any location',
        userType: 'property'
      },
      {
        title: 'Medical Appointment',
        situation: 'Private medical consultation requiring discretion',
        solution: 'Professional CPO with medical privacy protocols',
        result: 'Discreet protection maintained confidentiality throughout',
        userType: 'healthcare'
      }
    ],
    trustSignals: [
      '✅ 2,847 happy clients',
      '✅ 4.8★ average rating',
      '✅ 10 minute response time'
    ],
    stats: {
      clients: '2,847 happy clients',
      rating: '4.8★ average rating',
      responseTime: '10 minute response time'
    }
  },
  {
    id: 'executive',
    icon: '👔',
    name: 'Executive Protection',
    tagline: 'Enhanced security protocols for high-profile principals',
    vehicle: 'BMW 5 Series • Mercedes S-Class',
    price: 'From £75/hour + £3.50/mile',
    protectionRate: '£75',
    transportRate: '£3.50',
    rating: '⭐⭐⭐⭐⭐ 4.9',
    totalRides: '(1,653 protection details)',
    collapsedFeatures: [
      '1-2 SIA Protection Officers (scalable)',
      'Advance reconnaissance available',
      'Ex-military/police background'
    ],
    collapsedReview: {
      snippet: 'Advance planning and professional coordination',
      author: 'Richard, Investment Director'
    },
    personalizedMessage: 'As a [USER_ROLE], you\'ll appreciate the advance security planning, multiple officer coordination, and corporate-appropriate presentation',
    whatYouGet: [
      '1-2 Protection Officers (depending on requirements)',
      'Advance venue reconnaissance (24hrs prior)',
      'Premium vehicle fleet with enhanced security',
      'Coordinated team protection when needed',
      'Perfect for: VIP events, high-value meetings, public appearances'
    ],
    officerDescription: {
      general: 'Our Executive Protection Specialists come from military or law enforcement backgrounds with additional training in corporate security protocols. They understand boardroom confidentiality and maintain the professional image your position demands.',
      qualifications: [
        'Ex-military/police background',
        'Executive protection certified',
        'Corporate protocol trained',
        'Advanced driving qualification',
        'Confidentiality agreements'
      ]
    },
    reviews: [
      {
        rating: 5,
        text: 'The difference is noticeable immediately. My Protection Officer (ex-military) has this calm professionalism that just works in corporate settings. Knows when to chat, when to be silent. Car is always immaculate. Pulled up to a client meeting last week and they assumed I had a full-time chauffeur - that\'s the standard',
        author: 'Richard',
        role: 'Investment Director'
      },
      {
        rating: 5,
        text: 'Switched from standard to executive 3 months ago - game changer. The Protection Officers just \'get it\' if that makes sense? Conference calls in the car, sensitive documents, weird hours... never an issue. Also the BMW is SO much better for client impressions ngl',
        author: 'Amanda',
        role: 'Law Firm Partner'
      },
      {
        rating: 5,
        text: 'It\'s the attention to detail tbh. My Protection Officer keeps bottled water in the car, has phone chargers for every type, even keeps an umbrella ready. Last month he coordinated with my PA to adjust Commencement Point times without me asking. This is what executive service should be',
        author: 'Michael',
        role: 'Tech CEO'
      }
    ],
    caseStudies: [
      {
        title: 'High-Profile Restaurant Reservation',
        situation: 'VIP client requiring protection at public venue',
        solution: 'Advance reconnaissance 24hrs prior, 2-officer team deployed - one maintained vehicle security, second provided close protection inside',
        result: 'Coordinated security with flexible routing, professional protection throughout dining experience',
        userType: 'vip'
      },
      {
        title: 'Corporate Negotiations',
        situation: 'High-value business deal requiring enhanced security',
        solution: '2 CPOs with advance planning and route assessment',
        result: 'Security briefing before departure, coordinated team protection, impressive professional arrival',
        userType: 'corporate'
      },
      {
        title: 'Public Appearance',
        situation: 'Public figure attending high-visibility event',
        solution: 'Multiple officers coordinated entry and exit security',
        result: 'Seamless protection with advance route planning and flexible response',
        userType: 'public-figure'
      }
    ],
    trustSignals: [
      '✅ 500+ corporate executives',
      '✅ 4.9★ rating',
      '✅ Priority response guaranteed'
    ],
    stats: {
      clients: '500+ corporate executives',
      rating: '4.9★ rating',
      special: 'Priority response guaranteed'
    }
  },
  {
    id: 'shadow',
    icon: '🕴️',
    name: 'Shadow Protection',
    tagline: 'Covert protection with maximum scalability and discretion',
    vehicle: 'Unmarked vehicles • Plain clothes officers',
    price: 'From £65/hour + £3.00/mile',
    protectionRate: '£65',
    transportRate: '£3.00',
    rating: '⭐⭐⭐⭐⭐ 5.0',
    totalRides: '(892 protection details)',
    collapsedFeatures: [
      '1-6 Officers (fully scalable)',
      'Special Forces trained specialists',
      'Covert layered security protocols'
    ],
    collapsedReview: {
      snippet: 'Invisible protection that scales to threat level',
      author: 'High-Net-Worth Individual'
    },
    personalizedMessage: 'For elevated threat scenarios, Shadow Protection scales from solo covert work to coordinated multi-officer protection teams',
    whatYouGet: [
      '1-6 Protection Officers (scalable based on threat assessment)',
      'Plain clothes covert operations',
      'Layered perimeter security (20-30 meter distance)',
      'Coordinated radio contact between team members',
      'Perfect for: High-threat situations, complete anonymity, HNW individuals'
    ],
    officerDescription: {
      general: 'Shadow Protocol operatives are elite Close Protection specialists trained in covert operations. Coming from special forces and intelligence backgrounds, they provide maximum security with zero visibility. Perfect for those who need serious protection without anyone knowing.',
      qualifications: [
        'Special forces background',
        'Covert operations trained',
        'Counter-surveillance certified',
        'Intelligence sector experience',
        'Advanced threat assessment'
      ]
    },
    reviews: [
      {
        rating: 5,
        text: 'Can\'t say much for obvious reasons but if you need to move around without anyone knowing you have security, this is it. Different cars, different routes, but same elite level of protection. My Protection Officer spots things I\'d never notice and handles them before they become issues',
        author: 'Public Figure',
        role: 'Entertainment Industry'
      },
      {
        rating: 5,
        text: 'After needing more discrete protection, Shadow Protocol was perfect. Looks like a normal car service but the Protection Officer is anything but normal (in the best way). Complete peace of mind without the obvious security presence',
        author: 'Finance Executive',
        role: 'Banking'
      },
      {
        rating: 5,
        text: 'My clients need to move without attention. They switch up everything, use residential routes, have smart tactics... it\'s like having invisible protection. Expensive but literally nothing else comes close',
        author: 'Celebrity Manager',
        role: 'Talent Management'
      }
    ],
    caseStudies: [
      {
        title: 'Private Shopping in Mayfair',
        situation: 'HNW individual requiring invisible protection during shopping',
        solution: 'Lead CPO drove personal vehicle, 3 additional officers positioned 20-30m perimeter in plain clothes, coordinated radio contact, rotating positions',
        result: 'Layered covert security with zero visible presence, complete anonymity maintained',
        userType: 'hnw'
      },
      {
        title: 'Elevated Threat Assessment',
        situation: 'Principal with credible threat requiring maximum protection',
        solution: '6-officer team deployed with advance/follow vehicles, perimeter security, counter-surveillance protocols',
        result: 'Multi-layered protection adapted to threat level, principal felt completely secure',
        userType: 'threat'
      },
      {
        title: 'Private Occasion Requiring Anonymity',
        situation: 'Confidential meeting at sensitive location',
        solution: '4 covert officers with layered positioning, no visible security presence',
        result: 'Complete discretion maintained, security invisible to all parties',
        userType: 'confidential'
      }
    ],
    trustSignals: [
      '✅ 100% discretion maintained',
      '✅ 5.0★ perfect rating',
      '✅ Zero visibility guarantee'
    ],
    stats: {
      special: '⚠️ Assessment required',
      rating: '100% discretion maintained',
      clients: '5.0★ perfect rating'
    }
  },
  {
    id: 'luxury',
    icon: '💎',
    name: 'Luxury Elite',
    tagline: 'VIP Protection Specialists with luxury vehicles',
    vehicle: 'Bentley/Rolls Royce/S-Class Mercedes',
    price: 'From £200/hour',
    rating: '⭐⭐⭐⭐⭐ 5.0',
    totalRides: '(456 services)',
    collapsedFeatures: [
      'Diplomatic protection trained',
      'Executive chauffeur certified',
      'VIP security specialists'
    ],
    collapsedReview: {
      snippet: 'When you need to make an impression AND stay safe',
      author: 'International Investor'
    },
    personalizedMessage: 'As a VIP client, enjoy red carpet specialist service with diplomatic-level protocols and absolute luxury',
    whatYouGet: [
      'Top-tier luxury vehicles only',
      'White glove service standard',
      'Close protection team available',
      'Global service network access',
      'Red carpet and special event specialists'
    ],
    officerDescription: {
      general: 'Our VIP Protection Specialists are trained to diplomatic protection standards. They combine the highest levels of security with impeccable luxury service. When you need to arrive like royalty while maintaining absolute security, this is your service.',
      qualifications: [
        'Diplomatic protection trained',
        'VIP service certified',
        'Luxury vehicle specialist',
        'Protocol expert',
        'Global network access'
      ]
    },
    reviews: [
      {
        rating: 5,
        text: 'When you need to make an impression AND stay safe, nothing touches this. Pulled up to the Savoy in the Bentley, Protection Officer in full uniform, handled everything flawlessly. It\'s not just transport, it\'s an experience. My clients are always impressed',
        author: 'International Investor',
        role: 'Private Equity'
      },
      {
        rating: 5,
        text: 'Used for my wedding and wow... just wow. 3 cars, perfectly coordinated, Protection Officers who knew exactly how to handle guests, media, everything. They even had champagne and tissues ready for the emotional moments 🥺 Made the day even more special',
        author: 'Celebrity',
        role: 'Entertainment'
      },
      {
        rating: 5,
        text: 'The only service I trust for palace events. Protection Officers understand protocol, cars are beyond pristine, and the security is subtle but absolute. Simply the best',
        author: 'Royal Family Friend',
        role: 'Aristocracy'
      }
    ],
    caseStudies: [
      {
        title: 'Royal Wedding',
        situation: '500-guest celebration needing coordination',
        solution: 'Fleet of Bentleys with protection teams',
        result: 'Felt like royalty on our special day',
        userType: 'luxury'
      },
      {
        title: 'Film Premiere',
        situation: 'Red carpet event requiring premium arrival',
        solution: 'Rolls Royce with diplomatic protection',
        result: 'Made the perfect entrance, everyone was impressed',
        userType: 'entertainment'
      },
      {
        title: 'State Dinner',
        situation: 'Embassy event requiring appropriate transport',
        solution: 'S-Class with diplomatic trained team',
        result: 'Arrived with complete confidence and style',
        userType: 'diplomatic'
      }
    ],
    trustSignals: [
      '✅ Perfect 5.0★ rating',
      '✅ Diplomatic grade service',
      '✅ Global network available'
    ],
    stats: {
      special: '✨ Diplomatic grade service',
      clients: 'Perfect 5.0★ rating',
      rating: 'Global network available'
    }
  },
  {
    id: 'personal-vehicle',
    icon: '🔑',
    name: 'Personal Vehicle Service',
    tagline: 'Personal Security Protection Officers for your vehicle',
    vehicle: 'Your own vehicle (any make/model)',
    price: 'From £55/hour',
    rating: '⭐⭐⭐⭐⭐ 4.7',
    totalRides: '(1,234 services)',
    collapsedFeatures: [
      'Personal Protection Officers',
      'Fully insured any vehicle',
      'Discrete protection trained'
    ],
    collapsedReview: {
      snippet: 'Spent 80k on my Tesla - why Assignment in something else?',
      author: 'Thomas, Tesla Owner'
    },
    personalizedMessage: 'Perfect for someone who values their personal vehicle - keep your comfort and privacy with our protection',
    whatYouGet: [
      'Professional Protection Officer for YOUR car',
      'Fully insured to drive any vehicle',
      'Complete privacy - no company branding',
      'Returns your car exactly as received',
      'You relax while they handle everything'
    ],
    officerDescription: {
      general: 'Our Personal Security Protection Officers are fully licensed and insured to operate any vehicle. They arrive via their own transport, take exceptional care of your vehicle, and provide the same Close Protection standards while maintaining your personal comfort and privacy.',
      qualifications: [
        'Multi-vehicle licensed',
        'Personal Security Protection Officer certified',
        'Comprehensive insurance coverage',
        'Vehicle care specialist',
        'Privacy protection trained'
      ]
    },
    reviews: [
      {
        rating: 5,
        text: 'Spent 80k on my Model S - why would I want to Assignment in something else?? This service is genius. Protection Officer arrives, takes my keys, drives me in MY car with all my settings, my music, my everything. Then either waits or comes back later. Perfect solution',
        author: 'Thomas',
        role: 'Tesla Owner'
      },
      {
        rating: 5,
        text: 'Love love LOVE this option!! I have specific seat settings for my back and having someone else drive while I relax in my own space? Amazing. Also means I can leave stuff in the car without worrying. My Protection Officer Sarah is so careful with it too',
        author: 'Rebecca',
        role: 'Range Rover Sport Owner'
      },
      {
        rating: 5,
        text: 'Thought I\'d never trust anyone with my vintage Jag but these Protection Officers are something else. Used it for a wedding - Protection Officer treated it better than I do 😅 He even knew about classic cars and we chatted about it after. Now use regularly when I want to enjoy events',
        author: 'William',
        role: 'Classic Car Collector'
      }
    ],
    caseStudies: [
      {
        title: 'Supercar Owner',
        situation: 'Ferrari owner wanting to enjoy events',
        solution: 'Security Protection Officer for their own vehicle',
        result: 'Can finally enjoy dinners without worrying about driving',
        userType: 'luxury'
      },
      {
        title: 'Family Car',
        situation: 'Parents needing Protection Officer for school runs',
        solution: 'Regular Protection Officer for family SUV',
        result: 'Kids love our Protection Officer, car stays familiar',
        userType: 'family'
      },
      {
        title: 'Modified Vehicle',
        situation: 'Customized car with special features',
        solution: 'Trained Protection Officer who respects modifications',
        result: 'They understand my car is special to me',
        userType: 'enthusiast'
      }
    ],
    trustSignals: [
      '✅ Any vehicle covered',
      '✅ Fully insured service',
      '✅ Maximum privacy guaranteed'
    ],
    stats: {
      special: '✅ Fully insured Protection Officers',
      clients: 'Any vehicle covered',
      rating: 'Maximum privacy guaranteed'
    }
  }
];

// Helper function to get recommended service based on user profile
export function getRecommendedService(questionnaireData?: any): string | null {
  if (!questionnaireData) return null;

  const questionnaireBased = questionnaireData.recommendedService;
  if (questionnaireBased === 'armora-shadow') return 'shadow';
  if (questionnaireBased === 'armora-executive') return 'executive';
  if (questionnaireBased === 'armora-luxury') return 'luxury';
  if (questionnaireBased === 'armora-standard' || questionnaireBased === 'armora-secure') return 'standard';

  return 'standard'; // Default fallback
}

// Helper function to get service by ID
export function getServiceById(id: string): ServiceData | undefined {
  return SERVICES_DATA.find(service => service.id === id);
}

// Helper function to get dynamic case studies based on user profile
export function getDynamicCaseStudies(service: ServiceData, userProfile?: string): typeof service.caseStudies {
  if (!userProfile) return service.caseStudies;

  // Find case studies that match the user's profile
  const matchingCaseStudies = service.caseStudies.filter(cs =>
    cs.userType === userProfile.toLowerCase() ||
    (userProfile.toLowerCase().includes('business') && cs.userType === 'business') ||
    (userProfile.toLowerCase().includes('tech') && cs.userType === 'tech') ||
    (userProfile.toLowerCase().includes('finance') && cs.userType === 'finance')
  );

  // If we have matching case studies, prioritize them
  if (matchingCaseStudies.length > 0) {
    const remaining = service.caseStudies.filter(cs => !matchingCaseStudies.includes(cs));
    return [...matchingCaseStudies, ...remaining].slice(0, 3);
  }

  return service.caseStudies;
}