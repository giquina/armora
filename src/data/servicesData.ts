import { ServiceData } from '../components/Services/ServiceCard';

export const SERVICES_DATA: ServiceData[] = [
  {
    id: 'standard',
    icon: '🛡️',
    name: 'SafeRide Standard',
    tagline: 'Professional security-trained drivers for everyday journeys',
    vehicle: 'Nissan Leaf EV (Eco-friendly, discrete)',
    price: 'From £45/hour',
    rating: '⭐⭐⭐⭐⭐ 4.8',
    totalRides: '(2,847 rides)',
    collapsedFeatures: [
      'SIA-licensed security drivers',
      'Background verified & insured',
      'Professional door-to-door transport'
    ],
    collapsedReview: {
      snippet: 'Been using for 6 months now and honestly can\'t fault it',
      author: 'Emma, Marketing Manager'
    },
    personalizedMessage: 'Based on your profile as a [USER_PROFESSION], this service offers reliable protection without being flashy, available 24/7 for your schedule',
    whatYouGet: [
      'Door-to-door security driver service',
      '24/7 availability across London',
      'Government licensed security professionals',
      'Eco-friendly discrete vehicles',
      'Real-time journey monitoring'
    ],
    officerDescription: {
      general: 'All our security drivers hold both SIA security and private hire licenses, ensuring legal compliance and professional standards. Each driver undergoes enhanced DBS checks, defensive driving training, and conflict resolution certification. They\'re professional security-trained drivers providing safe transport.',
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
        text: 'Been using for 6 months now and honestly can\'t fault it. It\'s not over the top, just solid, reliable protection. My driver Amy is brilliant - professional but friendly, always on time, makes me feel safe without being dramatic about it. Exactly what I needed',
        author: 'Emma',
        role: 'Marketing Manager'
      },
      {
        rating: 5,
        text: 'Look I\'m not a CEO or celebrity, just wanted to feel safer commuting. This is perfect for normal people like me. Drivers are properly trained (you can tell) but it doesn\'t feel excessive. My guy Marcus even remembers I like Radio 4 in the mornings 😊',
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
        title: 'Healthcare Professional',
        situation: 'Doctor working late shifts at hospital',
        solution: 'Same trusted driver for every shift',
        result: 'My family loves knowing I have professional protection',
        userType: 'healthcare'
      },
      {
        title: 'Young Professional',
        situation: 'Marketing executive wanting to feel special',
        solution: 'Regular morning security driver service',
        result: 'I arrive at work feeling like a VIP every day',
        userType: 'business'
      },
      {
        title: 'International Student',
        situation: 'Studying in London, parents concerned',
        solution: 'Professional driver for evening classes',
        result: 'Parents thrilled I have my own security team',
        userType: 'student'
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
    name: 'SafeRide Executive',
    tagline: 'Premium security drivers for business professionals',
    vehicle: 'BMW 5 Series',
    price: 'From £95/hour',
    rating: '⭐⭐⭐⭐⭐ 4.9',
    totalRides: '(1,653 rides)',
    collapsedFeatures: [
      'Ex-military/police officers',
      'Advanced driving certified',
      'Corporate protection specialists'
    ],
    collapsedReview: {
      snippet: 'The difference is noticeable immediately',
      author: 'Richard, Investment Director'
    },
    personalizedMessage: 'As a [USER_ROLE], you\'ll appreciate the board-appropriate presentation, corporate confidentiality, and flexibility for last-minute changes',
    whatYouGet: [
      'Former military and police Close Protection',
      'Premium BMW vehicles maintained to luxury standards',
      'Corporate protocol and confidentiality training',
      'Priority booking and dedicated support',
      'Meeting point security assessments'
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
        text: 'The difference is noticeable immediately. My driver (ex-military) has this calm professionalism that just works in corporate settings. Knows when to chat, when to be silent. Car is always immaculate. Pulled up to a client meeting last week and they assumed I had a full-time chauffeur - that\'s the standard',
        author: 'Richard',
        role: 'Investment Director'
      },
      {
        rating: 5,
        text: 'Switched from standard to executive 3 months ago - game changer. When handling sensitive documents and confidential cases, you need drivers who understand discretion and security protocols. They\'re trained to handle weird hours and protect confidential communications.',
        author: 'Amanda',
        role: 'Law Firm Partner'
      },
      {
        rating: 5,
        text: 'It\'s the attention to detail tbh. My driver keeps bottled water in the car, has phone chargers for every type, even keeps an umbrella ready. Last month he coordinated with my PA to adjust pickup times without me asking. This is what executive service should be',
        author: 'Michael',
        role: 'Tech CEO'
      }
    ],
    caseStudies: [
      {
        title: 'Banking Executive',
        situation: 'Daily travel between City offices',
        solution: 'Dedicated Executive Protection Specialist',
        result: 'Clients impressed by my professional arrival every time',
        userType: 'finance'
      },
      {
        title: 'Law Firm Partner',
        situation: 'Needed appropriate transport for client meetings',
        solution: 'BMW with ex-military driver',
        result: 'Enhanced my professional image significantly',
        userType: 'legal'
      },
      {
        title: 'Tech CEO',
        situation: 'Multiple meetings across London daily',
        solution: 'Executive protection with premium vehicle',
        result: 'Can work during travel, arrive refreshed and prepared',
        userType: 'tech'
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
    name: 'Shadow Protocol',
    tagline: 'Elite Close Protection with complete discretion',
    vehicle: 'Unmarked vehicles (changes regularly)',
    price: 'From £125/hour',
    rating: '⭐⭐⭐⭐⭐ 5.0',
    totalRides: '(892 rides)',
    collapsedFeatures: [
      'Elite Close Protection team',
      'Counter-surveillance specialists',
      'Threat assessment certified'
    ],
    collapsedReview: {
      snippet: 'Can\'t say much but if you need invisible security',
      author: 'Public Figure'
    },
    personalizedMessage: 'For your high-profile situation, this provides complete discretion with specialist operatives and constantly varied routes',
    whatYouGet: [
      'Covert protection that blends into background',
      'Multiple vehicle options to avoid patterns',
      'Counter-surveillance capabilities',
      'Zero visible security presence',
      'Constantly varied routes'
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
        text: 'Can\'t say much for obvious reasons but if you need to move around without anyone knowing you have security, this is it. Different cars, different routes, but same elite level of protection. My driver spots things I\'d never notice and handles them before they become issues',
        author: 'Public Figure',
        role: 'Entertainment Industry'
      },
      {
        rating: 5,
        text: 'After needing more discrete protection, Shadow Protocol was perfect. Looks like a normal car service but the driver is anything but normal (in the best way). Complete peace of mind without the obvious security presence',
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
        title: 'Celebrity Discretion',
        situation: 'Public figure wanting normal life',
        solution: 'Unmarked vehicles, plain-clothes officers',
        result: 'Finally able to enjoy London like everyone else',
        userType: 'celebrity'
      },
      {
        title: 'High-Profile Executive',
        situation: 'Preferred complete privacy',
        solution: 'Covert specialist team, varied approaches',
        result: 'Complete discretion, exactly what I needed',
        userType: 'executive'
      },
      {
        title: 'International VIP',
        situation: 'Visiting London, needed invisible protection',
        solution: 'Full counter-surveillance protocols',
        result: 'Perfect trip, felt completely relaxed',
        userType: 'international'
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
    totalRides: '(456 rides)',
    collapsedFeatures: [
      'Diplomatic protection trained',
      'Executive chauffeur certified',
      'VIP security specialists'
    ],
    collapsedReview: {
      snippet: 'After receiving threats, I needed transport I could trust with my family\'s safety',
      author: 'Corporate Executive'
    },
    personalizedMessage: 'As a VIP client, receive enhanced security protection with diplomatic-level protocols and threat-aware professionals',
    whatYouGet: [
      'Top-tier security vehicles with advanced protection',
      'Trained security professionals',
      'Close protection team available',
      'Global security network access',
      'High-profile event security specialists'
    ],
    officerDescription: {
      general: 'Our VIP Protection Specialists are trained to diplomatic protection standards. They combine the highest levels of security with professional threat assessment capabilities. When you need enhanced security for high-risk situations while maintaining absolute protection, this is your service.',
      qualifications: [
        'Diplomatic protection trained',
        'VIP service certified',
        'Security vehicle specialist',
        'Protocol expert',
        'Global network access'
      ]
    },
    reviews: [
      {
        rating: 5,
        text: 'After receiving threats, I needed transport I could trust with my family\'s safety. These drivers are trained in threat assessment and evasive driving - not just chauffeurs. When you\'re dealing with serious security concerns, you need professionals who understand the risks.',
        author: 'Corporate Executive',
        role: 'Private Equity'
      },
      {
        rating: 5,
        text: 'My high-profile case attracted unwanted attention - I needed drivers trained in threat assessment and evasive driving techniques. When you\'re dealing with serious security concerns, you need professionals who understand the risks, not just luxury service.',
        author: 'Legal Counsel',
        role: 'Legal Services'
      },
      {
        rating: 5,
        text: 'Confidential client meetings require discretion and security protocols regular drivers don\'t have. When transporting sensitive documents and dealing with corporate acquisitions, you need professionals trained in confidentiality and threat awareness.',
        author: 'Investment Advisor',
        role: 'Financial Services'
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
    tagline: 'Personal Security Drivers for your vehicle',
    vehicle: 'Your own vehicle (any make/model)',
    price: 'From £55/hour',
    rating: '⭐⭐⭐⭐⭐ 4.7',
    totalRides: '(1,234 rides)',
    collapsedFeatures: [
      'Personal Security Drivers',
      'Fully insured any vehicle',
      'Discrete protection trained'
    ],
    collapsedReview: {
      snippet: 'Spent 80k on my Tesla - why ride in something else?',
      author: 'Thomas, Tesla Owner'
    },
    personalizedMessage: 'Perfect for someone who values their personal vehicle - keep your comfort and privacy with our protection',
    whatYouGet: [
      'Professional driver for YOUR car',
      'Fully insured to drive any vehicle',
      'Complete privacy - no company branding',
      'Returns your car exactly as received',
      'You relax while they handle everything'
    ],
    officerDescription: {
      general: 'Our Personal Security Drivers are fully licensed and insured to operate any vehicle. They arrive via their own transport, take exceptional care of your vehicle, and provide the same Close Protection standards while maintaining your personal comfort and privacy.',
      qualifications: [
        'Multi-vehicle licensed',
        'Personal Security Driver certified',
        'Comprehensive insurance coverage',
        'Vehicle care specialist',
        'Privacy protection trained'
      ]
    },
    reviews: [
      {
        rating: 5,
        text: 'Spent 80k on my Model S - why would I want to ride in something else?? This service is genius. Driver arrives, takes my keys, drives me in MY car with all my settings, my music, my everything. Then either waits or comes back later. Perfect solution',
        author: 'Thomas',
        role: 'Tesla Owner'
      },
      {
        rating: 5,
        text: 'Love love LOVE this option!! I have specific seat settings for my back and having someone else drive while I relax in my own space? Amazing. Also means I can leave stuff in the car without worrying. My driver Sarah is so careful with it too',
        author: 'Rebecca',
        role: 'Range Rover Sport Owner'
      },
      {
        rating: 5,
        text: 'Thought I\'d never trust anyone with my vintage Jag but these drivers are something else. Used it for a wedding - driver treated it better than I do 😅 He even knew about classic cars and we chatted about it after. Now use regularly when I want to enjoy events',
        author: 'William',
        role: 'Classic Car Collector'
      }
    ],
    caseStudies: [
      {
        title: 'Supercar Owner',
        situation: 'Ferrari owner wanting to enjoy events',
        solution: 'Security driver for their own vehicle',
        result: 'Can finally enjoy dinners without worrying about driving',
        userType: 'luxury'
      },
      {
        title: 'Family Car',
        situation: 'Parents needing driver for school runs',
        solution: 'Regular driver for family SUV',
        result: 'Kids love our driver, car stays familiar',
        userType: 'family'
      },
      {
        title: 'Modified Vehicle',
        situation: 'Customized car with special features',
        solution: 'Trained driver who respects modifications',
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
      special: '✅ Fully insured drivers',
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