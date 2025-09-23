import { CPOProfile } from '../types/cpo';

// Mock data for 15 sample Close Protection Officers
export const mockCPOs: CPOProfile[] = [
  {
    id: 'cpo-001',
    firstName: 'James',
    lastName: 'Richardson',
    callSign: 'Shield',
    dateOfBirth: '1985-03-15',
    nationality: 'British',
    languages: ['English', 'French'],
    profilePhoto: '/api/placeholder/150/150',

    sia: {
      licenseNumber: 'SIA-16-012345',
      level: 'Level_3',
      expiryDate: '2026-03-15',
      verified: true,
      verificationDate: '2024-01-15',
      specialistSectors: ['Close Protection', 'Event Security']
    },

    yearsOfExperience: 12,

    militaryBackground: {
      hasMilitaryService: true,
      branch: 'Army',
      rank: 'Staff Sergeant',
      yearsOfService: 8,
      specializations: ['Infantry', 'Close Protection'],
      securityClearance: 'SC'
    },

    policeBackground: {
      hasPoliceService: false
    },

    specializations: [
      {
        type: 'VIP_Protection',
        yearsExperience: 8,
        certifications: ['Advanced Threat Assessment', 'Dignitary Protection'],
        notable: ['Protected senior government officials', 'International experience']
      },
      {
        type: 'Close_Protection',
        yearsExperience: 12,
        certifications: ['SIA Level 3', 'Advanced Driving'],
        notable: ['Over 500 successful assignments']
      },
      {
        type: 'Event_Security',
        yearsExperience: 6,
        certifications: ['Crowd Management', 'Risk Assessment']
      }
    ],

    certifications: [
      {
        name: 'Advanced Close Protection',
        issuingBody: 'Security Industry Authority',
        issueDate: '2023-01-15',
        expiryDate: '2026-01-15',
        certificateNumber: 'ACP-2023-001',
        level: 'Advanced'
      },
      {
        name: 'Emergency First Aid',
        issuingBody: 'British Red Cross',
        issueDate: '2024-01-10',
        expiryDate: '2027-01-10',
        certificateNumber: 'EFA-2024-012'
      }
    ],

    availability: {
      status: 'Available_Now',
      responseTime: 15,
      workingHours: {
        monday: { start: '06:00', end: '22:00', available: true },
        tuesday: { start: '06:00', end: '22:00', available: true },
        wednesday: { start: '06:00', end: '22:00', available: true },
        thursday: { start: '06:00', end: '22:00', available: true },
        friday: { start: '06:00', end: '22:00', available: true },
        saturday: { start: '08:00', end: '20:00', available: true },
        sunday: { start: '10:00', end: '18:00', available: true }
      }
    },

    currentLocation: {
      latitude: 51.5074,
      longitude: -0.1278,
      address: 'Central London',
      postcode: 'SW1A 1AA',
      city: 'London',
      region: 'Greater London'
    },

    coverageAreas: ['London', 'Surrey', 'Kent', 'Essex', 'Hertfordshire'],

    rating: 4.9,
    totalAssignments: 156,
    completedAssignments: 154,
    cancelledAssignments: 2,
    averageResponseTime: 12,
    reliabilityScore: 98,

    recentAssignments: [
      {
        id: 'assignment-001',
        principalId: 'principal-001',
        startDate: '2024-01-20',
        endDate: '2024-01-20',
        duration: 8,
        type: 'Executive Protection',
        rating: 5,
        feedback: 'Outstanding professionalism and attention to detail',
        location: 'London'
      }
    ],

    testimonials: [
      {
        principalName: 'Sarah M.',
        rating: 5,
        comment: 'James provided exceptional close protection services. Highly professional and discrete.',
        date: '2024-01-21',
        verified: true
      }
    ],

    vehicle: {
      make: 'BMW',
      model: '5 Series',
      year: 2023,
      color: 'Black',
      registration: 'SH23 LDX',
      type: 'Executive',
      capacity: 4,
      features: ['Bulletproof glass', 'Run-flat tyres', 'Emergency communications']
    },

    equipment: [
      'Two-way radio system',
      'First aid kit',
      'Threat assessment tools',
      'Emergency response equipment'
    ],

    operationalProcedures: [
      'Advance reconnaissance',
      'Route planning and alternatives',
      'Emergency evacuation protocols',
      'Threat level assessment'
    ],

    emergencyContacts: {
      primary: { name: 'Control Room', relationship: 'Operations', phone: '+44 20 7946 0958' },
      secondary: { name: 'Emergency Services', relationship: 'Emergency', phone: '999' }
    },

    hourlyRates: {
      essential: 85,
      executive: 110,
      shadow: 135
    },

    minimumEngagement: 4,
    travelAllowance: 25,

    isActive: true,
    isVerified: true,
    accountCreated: '2023-01-15',
    lastLogin: '2024-01-25T09:30:00Z',
    lastLocationUpdate: '2024-01-25T09:25:00Z',

    tags: ['military', 'experienced', 'vip', 'london'],
    internalRating: 95
  },

  {
    id: 'cpo-002',
    firstName: 'Victoria',
    lastName: 'Thompson',
    callSign: 'Guardian',
    dateOfBirth: '1988-07-22',
    nationality: 'British',
    languages: ['English', 'Spanish', 'Portuguese'],

    sia: {
      licenseNumber: 'SIA-16-067890',
      level: 'Level_3',
      expiryDate: '2025-12-10',
      verified: true,
      verificationDate: '2023-08-20',
      specialistSectors: ['Close Protection', 'Corporate Security']
    },

    yearsOfExperience: 9,

    militaryBackground: {
      hasMilitaryService: false
    },

    policeBackground: {
      hasPoliceService: true,
      force: 'Metropolitan Police',
      rank: 'Detective Constable',
      yearsOfService: 6,
      specializations: ['Armed Response', 'VIP Protection Unit'],
      crnumber: 'PC-2015-4567'
    },

    specializations: [
      {
        type: 'Corporate_Security',
        yearsExperience: 9,
        certifications: ['Corporate Risk Management', 'Executive Protection'],
        notable: ['FTSE 100 company experience']
      },
      {
        type: 'Close_Protection',
        yearsExperience: 7,
        certifications: ['SIA Level 3', 'Surveillance Detection']
      },
      {
        type: 'Counter_Surveillance',
        yearsExperience: 5,
        certifications: ['Technical Surveillance Countermeasures']
      }
    ],

    certifications: [
      {
        name: 'Corporate Security Management',
        issuingBody: 'Institute of Security Professionals',
        issueDate: '2022-06-15',
        expiryDate: '2025-06-15',
        certificateNumber: 'CSM-2022-089'
      }
    ],

    availability: {
      status: 'Available_Soon',
      nextAvailable: '2024-01-26T14:00:00Z',
      responseTime: 25,
      workingHours: {
        monday: { start: '07:00', end: '19:00', available: true },
        tuesday: { start: '07:00', end: '19:00', available: true },
        wednesday: { start: '07:00', end: '19:00', available: true },
        thursday: { start: '07:00', end: '19:00', available: true },
        friday: { start: '07:00', end: '19:00', available: true },
        saturday: { start: '09:00', end: '17:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false }
      }
    },

    currentLocation: {
      latitude: 51.4545,
      longitude: -0.9781,
      address: 'Reading Business District',
      postcode: 'RG1 2AB',
      city: 'Reading',
      region: 'Berkshire'
    },

    coverageAreas: ['Berkshire', 'Oxfordshire', 'Hampshire', 'London'],

    rating: 4.8,
    totalAssignments: 89,
    completedAssignments: 87,
    cancelledAssignments: 2,
    averageResponseTime: 22,
    reliabilityScore: 96,

    recentAssignments: [],
    testimonials: [
      {
        principalName: 'David K.',
        rating: 5,
        comment: 'Victoria\'s corporate security expertise is exceptional. Highly recommended.',
        date: '2024-01-18',
        verified: true
      }
    ],

    vehicle: {
      make: 'Audi',
      model: 'A6',
      year: 2022,
      color: 'Silver',
      registration: 'VT22 SEC',
      type: 'Executive',
      capacity: 4,
      features: ['Privacy glass', 'Advanced navigation', 'Emergency kit']
    },

    equipment: [
      'Covert surveillance detection equipment',
      'Corporate risk assessment tools',
      'Secure communications'
    ],

    operationalProcedures: [
      'Corporate threat assessment',
      'Executive travel security',
      'Venue security surveys'
    ],

    emergencyContacts: {
      primary: { name: 'Operations Centre', relationship: 'Control', phone: '+44 20 7946 0959' },
      secondary: { name: 'Police', relationship: 'Emergency', phone: '999' }
    },

    hourlyRates: {
      essential: 75,
      executive: 95,
      shadow: 120
    },

    minimumEngagement: 4,
    travelAllowance: 20,

    isActive: true,
    isVerified: true,
    accountCreated: '2023-03-22',
    lastLogin: '2024-01-25T11:15:00Z',
    lastLocationUpdate: '2024-01-25T11:10:00Z',

    tags: ['police', 'corporate', 'surveillance', 'female'],
    internalRating: 92
  },

  {
    id: 'cpo-003',
    firstName: 'Michael',
    lastName: 'Stevens',
    callSign: 'Hawk',
    dateOfBirth: '1982-11-08',
    nationality: 'British',
    languages: ['English', 'Arabic', 'German'],

    sia: {
      licenseNumber: 'SIA-16-034567',
      level: 'Level_4',
      expiryDate: '2026-08-30',
      verified: true,
      verificationDate: '2023-12-01',
      specialistSectors: ['Close Protection', 'Hostile Environment', 'Maritime Security']
    },

    yearsOfExperience: 18,

    militaryBackground: {
      hasMilitaryService: true,
      branch: 'Royal_Marines',
      rank: 'Colour Sergeant',
      yearsOfService: 12,
      specializations: ['Special Forces', 'Maritime Operations', 'Hostage Rescue'],
      securityClearance: 'Enhanced_DV'
    },

    policeBackground: {
      hasPoliceService: false
    },

    specializations: [
      {
        type: 'Hostile_Environment',
        yearsExperience: 15,
        certifications: ['Hostile Environment Training', 'Conflict Zone Operations'],
        notable: ['Afghanistan deployment', 'Iraq operations']
      },
      {
        type: 'Maritime_Security',
        yearsExperience: 10,
        certifications: ['Maritime Security Operations', 'Anti-Piracy'],
        notable: ['Gulf of Aden operations']
      },
      {
        type: 'VIP_Protection',
        yearsExperience: 12,
        certifications: ['Elite Protection Training'],
        notable: ['Protected heads of state']
      }
    ],

    certifications: [
      {
        name: 'Hostile Environment Training',
        issuingBody: 'Military Training Centre',
        issueDate: '2020-05-15',
        expiryDate: '2025-05-15',
        certificateNumber: 'HET-2020-003'
      },
      {
        name: 'Advanced Tactical Medicine',
        issuingBody: 'Special Forces Medical Unit',
        issueDate: '2023-03-20',
        certificateNumber: 'ATM-2023-017'
      }
    ],

    availability: {
      status: 'Available_Now',
      responseTime: 30,
      workingHours: {
        monday: { start: '24/7', end: '24/7', available: true },
        tuesday: { start: '24/7', end: '24/7', available: true },
        wednesday: { start: '24/7', end: '24/7', available: true },
        thursday: { start: '24/7', end: '24/7', available: true },
        friday: { start: '24/7', end: '24/7', available: true },
        saturday: { start: '24/7', end: '24/7', available: true },
        sunday: { start: '24/7', end: '24/7', available: true }
      }
    },

    currentLocation: {
      latitude: 53.4808,
      longitude: -2.2426,
      address: 'Manchester City Centre',
      postcode: 'M1 1AA',
      city: 'Manchester',
      region: 'Greater Manchester'
    },

    coverageAreas: ['Manchester', 'Lancashire', 'Merseyside', 'Yorkshire', 'International'],

    rating: 5.0,
    totalAssignments: 203,
    completedAssignments: 203,
    cancelledAssignments: 0,
    averageResponseTime: 25,
    reliabilityScore: 100,

    recentAssignments: [
      {
        id: 'assignment-003',
        principalId: 'principal-003',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        duration: 168,
        type: 'International VIP Protection',
        rating: 5,
        feedback: 'Exceptional service in challenging conditions',
        location: 'Dubai'
      }
    ],

    testimonials: [
      {
        principalName: 'Anonymous Principal',
        rating: 5,
        comment: 'Michael\'s expertise in hostile environments is unmatched. Complete peace of mind.',
        date: '2024-01-23',
        verified: true
      }
    ],

    vehicle: {
      make: 'Land Rover',
      model: 'Defender',
      year: 2023,
      color: 'Black',
      registration: 'MS23 TAC',
      type: 'Armored',
      capacity: 5,
      features: ['Armored plating', 'Run-flat tyres', 'Satellite communication', 'Medical kit']
    },

    equipment: [
      'Tactical communications suite',
      'Medical trauma kit',
      'Surveillance detection equipment',
      'Emergency extraction tools'
    ],

    operationalProcedures: [
      'Hostile environment assessment',
      'Emergency extraction protocols',
      'International security coordination',
      'Threat neutralization procedures'
    ],

    emergencyContacts: {
      primary: { name: 'Elite Operations', relationship: 'Command', phone: '+44 20 7946 0960' },
      secondary: { name: 'Emergency Response', relationship: 'Backup', phone: '+44 20 7946 0961' }
    },

    hourlyRates: {
      essential: 150,
      executive: 200,
      shadow: 250
    },

    minimumEngagement: 8,
    travelAllowance: 50,

    isActive: true,
    isVerified: true,
    accountCreated: '2022-11-15',
    lastLogin: '2024-01-25T07:45:00Z',
    lastLocationUpdate: '2024-01-25T07:40:00Z',

    tags: ['special-forces', 'international', 'hostile-environment', 'elite'],
    internalRating: 100
  },

  {
    id: 'cpo-004',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    dateOfBirth: '1990-05-14',
    nationality: 'British',
    languages: ['English', 'Italian'],

    sia: {
      licenseNumber: 'SIA-16-045678',
      level: 'Level_2',
      expiryDate: '2025-09-20',
      verified: true,
      verificationDate: '2024-01-10',
      specialistSectors: ['Residential Security', 'Event Security']
    },

    yearsOfExperience: 6,

    militaryBackground: {
      hasMilitaryService: false
    },

    policeBackground: {
      hasPoliceService: false
    },

    specializations: [
      {
        type: 'Residential_Security',
        yearsExperience: 6,
        certifications: ['Home Security Assessment', 'Family Protection']
      },
      {
        type: 'Event_Security',
        yearsExperience: 4,
        certifications: ['Event Risk Management']
      }
    ],

    certifications: [
      {
        name: 'Residential Security Management',
        issuingBody: 'Security Training Institute',
        issueDate: '2023-09-15',
        expiryDate: '2026-09-15',
        certificateNumber: 'RSM-2023-044'
      }
    ],

    availability: {
      status: 'Available_Now',
      responseTime: 20,
      workingHours: {
        monday: { start: '08:00', end: '18:00', available: true },
        tuesday: { start: '08:00', end: '18:00', available: true },
        wednesday: { start: '08:00', end: '18:00', available: true },
        thursday: { start: '08:00', end: '18:00', available: true },
        friday: { start: '08:00', end: '18:00', available: true },
        saturday: { start: '10:00', end: '16:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false }
      }
    },

    currentLocation: {
      latitude: 52.4862,
      longitude: -1.8904,
      address: 'Birmingham City Centre',
      postcode: 'B1 1AA',
      city: 'Birmingham',
      region: 'West Midlands'
    },

    coverageAreas: ['Birmingham', 'West Midlands', 'Warwickshire', 'Staffordshire'],

    rating: 4.7,
    totalAssignments: 67,
    completedAssignments: 65,
    cancelledAssignments: 2,
    averageResponseTime: 18,
    reliabilityScore: 94,

    recentAssignments: [],
    testimonials: [
      {
        principalName: 'Jennifer L.',
        rating: 5,
        comment: 'Sarah provided excellent residential security services for our family event.',
        date: '2024-01-19',
        verified: true
      }
    ],

    equipment: [
      'Home security assessment tools',
      'Event safety equipment',
      'Communication devices'
    ],

    operationalProcedures: [
      'Residential security surveys',
      'Family protection protocols',
      'Event safety planning'
    ],

    emergencyContacts: {
      primary: { name: 'Birmingham Control', relationship: 'Operations', phone: '+44 121 496 0962' },
      secondary: { name: 'Emergency Services', relationship: 'Emergency', phone: '999' }
    },

    hourlyRates: {
      essential: 65,
      executive: 85,
      shadow: 105
    },

    minimumEngagement: 3,
    travelAllowance: 15,

    isActive: true,
    isVerified: true,
    accountCreated: '2023-05-20',
    lastLogin: '2024-01-25T10:20:00Z',
    lastLocationUpdate: '2024-01-25T10:15:00Z',

    tags: ['residential', 'family', 'events', 'female'],
    internalRating: 88
  },

  {
    id: 'cpo-005',
    firstName: 'Robert',
    lastName: 'Clarke',
    callSign: 'Fortress',
    dateOfBirth: '1975-09-03',
    nationality: 'British',
    languages: ['English', 'Welsh'],

    sia: {
      licenseNumber: 'SIA-16-056789',
      level: 'Level_3',
      expiryDate: '2025-11-15',
      verified: true,
      verificationDate: '2023-06-30',
      specialistSectors: ['Diplomatic Protection', 'Government Security']
    },

    yearsOfExperience: 22,

    militaryBackground: {
      hasMilitaryService: true,
      branch: 'Army',
      rank: 'Warrant Officer Class 1',
      yearsOfService: 15,
      specializations: ['Infantry', 'Training Instruction'],
      securityClearance: 'DV'
    },

    policeBackground: {
      hasPoliceService: true,
      force: 'South Wales Police',
      rank: 'Inspector',
      yearsOfService: 5,
      specializations: ['Armed Response', 'Diplomatic Protection Group']
    },

    specializations: [
      {
        type: 'Diplomatic_Protection',
        yearsExperience: 18,
        certifications: ['Diplomatic Security Protocol', 'Government Protection'],
        notable: ['Protected foreign dignitaries', 'Embassy security']
      },
      {
        type: 'Close_Protection',
        yearsExperience: 22,
        certifications: ['Advanced Close Protection', 'Threat Assessment']
      }
    ],

    certifications: [
      {
        name: 'Diplomatic Protection Specialist',
        issuingBody: 'Foreign Office Security Department',
        issueDate: '2021-11-10',
        expiryDate: '2024-11-10',
        certificateNumber: 'DPS-2021-008'
      }
    ],

    availability: {
      status: 'On_Assignment',
      nextAvailable: '2024-01-28T09:00:00Z',
      currentAssignmentEndTime: '2024-01-27T18:00:00Z',
      responseTime: 45,
      workingHours: {
        monday: { start: '24/7', end: '24/7', available: true },
        tuesday: { start: '24/7', end: '24/7', available: true },
        wednesday: { start: '24/7', end: '24/7', available: true },
        thursday: { start: '24/7', end: '24/7', available: true },
        friday: { start: '24/7', end: '24/7', available: true },
        saturday: { start: '24/7', end: '24/7', available: true },
        sunday: { start: '24/7', end: '24/7', available: true }
      }
    },

    currentLocation: {
      latitude: 51.4816,
      longitude: -3.1791,
      address: 'Cardiff Bay',
      postcode: 'CF10 4AA',
      city: 'Cardiff',
      region: 'Wales'
    },

    coverageAreas: ['Wales', 'Cardiff', 'Newport', 'Swansea', 'London'],

    rating: 4.9,
    totalAssignments: 287,
    completedAssignments: 284,
    cancelledAssignments: 3,
    averageResponseTime: 40,
    reliabilityScore: 99,

    recentAssignments: [
      {
        id: 'assignment-005',
        principalId: 'principal-005',
        startDate: '2024-01-25',
        endDate: '2024-01-27',
        duration: 48,
        type: 'Diplomatic Protection',
        location: 'Cardiff'
      }
    ],

    testimonials: [
      {
        principalName: 'Ambassador K.',
        rating: 5,
        comment: 'Robert\'s diplomatic protection expertise is world-class. Highly recommended.',
        date: '2023-12-15',
        verified: true
      }
    ],

    vehicle: {
      make: 'Range Rover',
      model: 'Vogue',
      year: 2022,
      color: 'Black',
      registration: 'RC22 DIP',
      type: 'Executive',
      capacity: 5,
      features: ['Privacy glass', 'Advanced security features', 'Diplomatic plates']
    },

    equipment: [
      'Diplomatic security protocols',
      'Advanced threat detection',
      'Secure communications',
      'Protocol documentation'
    ],

    operationalProcedures: [
      'Diplomatic security protocols',
      'Embassy liaison procedures',
      'International threat assessment',
      'Government security coordination'
    ],

    emergencyContacts: {
      primary: { name: 'Cardiff Operations', relationship: 'Control', phone: '+44 29 2049 0963' },
      secondary: { name: 'Diplomatic Security', relationship: 'Command', phone: '+44 20 7946 0964' }
    },

    hourlyRates: {
      essential: 120,
      executive: 150,
      shadow: 180
    },

    minimumEngagement: 6,
    travelAllowance: 35,

    isActive: true,
    isVerified: true,
    accountCreated: '2022-08-10',
    lastLogin: '2024-01-25T14:30:00Z',
    lastLocationUpdate: '2024-01-25T14:25:00Z',

    tags: ['diplomatic', 'government', 'senior', 'wales'],
    internalRating: 96
  }
];

// Utility functions for mock data
export const getCPOById = (id: string): CPOProfile | undefined => {
  return mockCPOs.find(cpo => cpo.id === id);
};

export const getAvailableCPOs = (): CPOProfile[] => {
  return mockCPOs.filter(cpo =>
    cpo.isActive &&
    cpo.isVerified &&
    ['Available_Now', 'Available_Soon'].includes(cpo.availability.status)
  );
};

export const getCPOsBySpecialization = (specialization: string): CPOProfile[] => {
  return mockCPOs.filter(cpo =>
    cpo.isActive &&
    cpo.specializations.some(spec => spec.type === specialization)
  );
};

export const getTopRatedCPOs = (limit: number = 5): CPOProfile[] => {
  return mockCPOs
    .filter(cpo => cpo.isActive && cpo.isVerified)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getCPOsByLocation = (region: string): CPOProfile[] => {
  return mockCPOs.filter(cpo =>
    cpo.isActive &&
    cpo.coverageAreas.some(area =>
      area.toLowerCase().includes(region.toLowerCase())
    )
  );
};