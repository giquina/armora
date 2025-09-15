import { PersonalizationData, ServiceLevel, User } from '../types';

export interface UserProfile {
  type: string;
  matchScore: number;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  certifications: string[];
  trustIndicators: string[];
  personalizedMessage: string;
  urgencyMessage?: string;
  socialProof: string;
}

export interface RecommendationData {
  service: ServiceLevel;
  profile: UserProfile;
  timeBasedMessage: string;
  availabilityInfo: {
    officersAvailable: number;
    estimatedArrival: string;
    isHighDemand: boolean;
  };
}

// Profile matching algorithm
export function analyzeUserProfile(questionnaireData: PersonalizationData | null, user: User | null): UserProfile {
  const profileSelection = questionnaireData?.profileSelection;

  if (!profileSelection || profileSelection === 'prefer_not_to_say' || profileSelection === 'general') {
    return getDefaultProfile();
  }

  const profileMap: Record<string, UserProfile> = {
    medical: {
      type: 'healthcare',
      matchScore: 96,
      title: 'Healthcare Professional Match',
      subtitle: 'Specialized for Medical Professionals',
      description: 'Designed for healthcare workers who understand the importance of reliability, discretion, and safety protocols.',
      benefits: [
        'Hospital protocol expertise - our CP Officers understand medical facility access',
        '24/7 availability for shift patterns and urgent medical calls',
        'Patient confidentiality compliance training',
        'Medical equipment transport capability',
        'Quiet environment for rest between shifts'
      ],
      certifications: ['Advanced Security Training (conflict de-escalation & threat awareness)', 'NHS Facility Access Trained', 'Medical Protocol Certified'],
      trustIndicators: ['Trusted by 200+ healthcare professionals', '4.9★ from medical staff', 'Zero missed shifts in 2024'],
      personalizedMessage: 'Your commitment to saving lives deserves transport that respects your dedication.',
      socialProof: '94% of healthcare professionals choose this service level',
    },
    executive: {
      type: 'corporate',
      matchScore: 94,
      title: 'Executive Professional Match',
      subtitle: 'Business Leadership Transport',
      description: 'Executive-level transport that understands the demands of business leadership and corporate responsibility.',
      benefits: [
        'Business district expertise and priority routes',
        'Meeting schedule coordination and punctuality guarantee',
        'In-vehicle Wi-Fi and charging stations for productivity',
        'Corporate billing and expense report integration',
        'Professional appearance and corporate etiquette training'
      ],
      certifications: ['Advanced Security Training (situation awareness & professional discretion)', 'Corporate Protocol Certified', 'Executive Protection Trained'],
      trustIndicators: ['Serving 150+ executives', 'On-time rate: 99.7%', 'Preferred by FTSE 250 companies'],
      personalizedMessage: 'Your leadership position requires transport that matches your professional standards.',
      socialProof: '91% of executives prefer Armora for business transport',
    },
    entrepreneur: {
      type: 'business',
      matchScore: 92,
      title: 'Entrepreneur & Business Owner Match',
      subtitle: 'Dynamic Business Transport',
      description: 'Flexible, reliable transport for the demands of building and running your business.',
      benefits: [
        'Flexible scheduling for dynamic business needs',
        'Investor meeting and presentation support',
        'Multi-stop efficiency for business meetings',
        'Professional image enhancement for client meetings',
        'Business networking opportunity awareness'
      ],
      certifications: ['Advanced Security Training (risk assessment & business environment awareness)', 'Business Professional Certified', 'Startup Hub Access Trained'],
      trustIndicators: ['Supporting 180+ entrepreneurs', 'Business growth reliability: 98%', 'Startup community trusted'],
      personalizedMessage: 'Your entrepreneurial drive deserves transport that adapts to your business needs.',
      socialProof: '89% of business owners choose professional security transport',
    },
    government: {
      type: 'public_sector',
      matchScore: 98,
      title: 'Government & Public Sector Match',
      subtitle: 'Protocol-Aware Official Transport',
      description: 'Government and public sector transport with full understanding of official protocols and security requirements.',
      benefits: [
        'Government building access expertise',
        'Protocol and security clearance understanding',
        'Confidential meeting and discussion privacy',
        'Official event coordination experience',
        'Emergency response and continuity planning'
      ],
      certifications: ['Enhanced Security Clearance', 'Government Protocol Trained', 'Official Building Access Certified'],
      trustIndicators: ['Serving 50+ government officials', 'Security clearance: Enhanced', 'Zero protocol breaches'],
      personalizedMessage: 'Your public service requires transport that understands official protocols and discretion.',
      socialProof: '97% of public officials choose enhanced security transport',
    },
    legal: {
      type: 'legal',
      matchScore: 95,
      title: 'Legal Professional Match',
      subtitle: 'Court and Chambers Transport',
      description: 'Legal profession transport with understanding of court schedules, client confidentiality, and professional requirements.',
      benefits: [
        'Court and chambers access expertise',
        'Client confidentiality and privilege protection',
        'Legal document transport security',
        'Punctuality guarantee for court appearances',
        'Professional dress code and appearance standards'
      ],
      certifications: ['Advanced Security Training (confidentiality & threat detection)', 'Legal Professional Protocol', 'Court Access Certified'],
      trustIndicators: ['Trusted by 120+ legal professionals', 'Court appearance reliability: 100%', 'Bar Association recommended'],
      personalizedMessage: 'Your legal practice demands transport that respects client privilege and court schedules.',
      socialProof: '93% of legal professionals require discretion and punctuality',
    },
    finance: {
      type: 'financial',
      matchScore: 93,
      title: 'Financial Services Match',
      subtitle: 'Market-Ready Professional Transport',
      description: 'Financial sector transport understanding market hours, client requirements, and professional standards.',
      benefits: [
        'Early market hours and late client meeting availability',
        'Financial district expertise and priority routing',
        'Client entertainment and event support',
        'Confidential financial discussion privacy',
        'Professional appearance matching industry standards'
      ],
      certifications: ['Advanced Security Training (crowd management & protective surveillance)', 'Financial District Access', 'Corporate Client Certified'],
      trustIndicators: ['Serving 100+ financial professionals', 'Market hours: 5AM-11PM', 'City of London preferred'],
      personalizedMessage: 'Your financial expertise deserves transport that understands market demands.',
      socialProof: '90% of financial professionals choose reliable security transport',
    },
    celebrity: {
      type: 'entertainment',
      matchScore: 99,
      title: 'Entertainment & Media Match',
      subtitle: 'Privacy-First Celebrity Transport',
      description: 'Entertainment industry transport with maximum discretion, privacy protection, and media awareness.',
      benefits: [
        'Paparazzi avoidance and discrete route planning',
        'Studio and venue access expertise',
        'Event premiere and appearance coordination',
        'Privacy protection and confidentiality agreements',
        'Emergency extraction and security protocols'
      ],
      certifications: ['Enhanced Security Training', 'Celebrity Protection Specialist', 'Media Evasion Certified'],
      trustIndicators: ['Protecting 25+ entertainment clients', 'Privacy incidents: Zero', 'Industry insider trusted'],
      personalizedMessage: 'Your public profile requires transport that prioritizes your privacy and safety.',
      socialProof: '99% of entertainment professionals require enhanced privacy protection',
    },
    high_profile: {
      type: 'vip',
      matchScore: 99,
      title: 'High-Profile Individual Match',
      subtitle: 'Maximum Security & Discretion',
      description: 'Elite protection for high-profile individuals requiring the highest levels of security and privacy.',
      benefits: [
        'Counter-surveillance and threat assessment',
        'Armored vehicle options and security modifications',
        'Close protection specialist coordination',
        'Route security analysis and alternative planning',
        'Emergency response and extraction protocols'
      ],
      certifications: ['Special Forces Training', 'VIP Protection Specialist', 'Counter-Surveillance Certified'],
      trustIndicators: ['Protecting high-profile clients', 'Threat assessments: Daily', 'Zero security incidents'],
      personalizedMessage: 'Your profile requires the highest level of professional security and discretion.',
      socialProof: '100% of high-profile clients choose maximum security transport',
    },
    family: {
      type: 'family',
      matchScore: 88,
      title: 'Family Security Match',
      subtitle: 'Safe Family Transport Solutions',
      description: 'Family-focused security transport with child safety expertise and family scheduling flexibility.',
      benefits: [
        'Child safety systems and car seat expertise',
        'School run and family activity coordination',
        'Family safety response protocols',
        'Multiple passenger configuration options',
        'Family-friendly driver training and background checks'
      ],
      certifications: ['Child Safety Certified', 'Family Transport Specialist', 'Enhanced Background Checks'],
      trustIndicators: ['Trusted by 300+ families', 'Child safety record: Perfect', 'School run reliability: 99%'],
      personalizedMessage: 'Your family\'s safety is our priority - transport you can trust with your loved ones.',
      socialProof: '85% of families choose professional security for peace of mind',
    },
    student: {
      type: 'student',
      matchScore: 85,
      title: 'Student Safety Match',
      subtitle: 'Safe Student Transport',
      description: 'Student-focused transport providing safe, reliable travel for education and social activities.',
      benefits: [
        'University campus access and late-night safety',
        'Student budget consideration and group options',
        'Library, social event, and home transport',
        'Student ID verification and campus protocols',
        'Safety contact notification systems'
      ],
      certifications: ['Student Safety Certified', 'Campus Access Trained', 'Youth Protection Trained'],
      trustIndicators: ['Serving 500+ students', 'Late-night safety: 100%', 'University partnership approved'],
      personalizedMessage: 'Your education journey deserves safe, reliable transport you can depend on.',
      socialProof: '78% of students choose professional transport for safety',
    }
  };

  return profileMap[profileSelection] || getDefaultProfile();
}

function getDefaultProfile(): UserProfile {
  return {
    type: 'general',
    matchScore: 85,
    title: 'Professional Transport Match',
    subtitle: 'Quality Security Transport',
    description: 'Professional security transport designed for discerning clients who value safety, reliability, and peace of mind.',
    benefits: [
      'SIA Level 2 security-certified professional drivers',
      'Real-time GPS tracking and journey monitoring',
      '24/7 response and support systems',
      'Background-checked and vetted security professionals',
      'Eco-friendly Nissan Leaf EV fleet with full safety systems'
    ],
    certifications: ['Advanced Security Training (situational awareness & protective protocols)', 'Professional Driver Certified', 'Safety Response Trained'],
    trustIndicators: ['Trusted by 1,000+ clients', 'Safety record: 100%', 'Reliability rating: 4.8/5'],
    personalizedMessage: 'Professional security transport that prioritizes your safety and peace of mind.',
    socialProof: '82% of clients choose security-aware transport for peace of mind',
  };
}

// Time-based messaging
export function getTimeBasedMessage(): string {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const isWeekend = day === 0 || day === 6;

  if (hour >= 5 && hour < 12) {
    return isWeekend
      ? '🌅 Weekend morning service - start your day securely'
      : '🌅 Morning service active - professional transport for your day ahead';
  } else if (hour >= 12 && hour < 17) {
    return isWeekend
      ? '☀️ Weekend afternoon coverage - reliable when you need it'
      : '☀️ Afternoon availability - seamless transport for business meetings';
  } else if (hour >= 17 && hour < 22) {
    return isWeekend
      ? '🌆 Evening service - safe transport for weekend activities'
      : '🌆 Evening service - secure transport for after-work commitments';
  } else {
    return isWeekend
      ? '🌙 Late-night weekend coverage - your safety is our priority'
      : '🌙 24/7 protection - enhanced security protocols for night transport';
  }
}

// Generate availability info with stable values to prevent re-render flashing
// Fixed: No more Math.random() calls that cause dashboard flashing
export function generateAvailabilityInfo() {
  const hour = new Date().getHours();
  const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);

  // Use deterministic values based on time instead of Math.random()
  const timeBasedVariation = hour % 3; // 0, 1, or 2 based on hour
  const officersAvailable = 3 + timeBasedVariation;
  const isHighDemand = isPeakHour || officersAvailable <= 3;

  // Use deterministic arrival times based on hour and demand
  const baseArrival = isHighDemand ? 7 : 4; // Base minutes
  const timeVariation = (hour % 4) + 1; // 1-4 minute variation
  const estimatedArrival = `${baseArrival + timeVariation} minutes`;

  return {
    officersAvailable,
    estimatedArrival,
    isHighDemand
  };
}

// Main recommendation engine
export function generateRecommendation(
  questionnaireData: PersonalizationData | null,
  user: User | null,
  services: ServiceLevel[]
): RecommendationData {
  const profile = analyzeUserProfile(questionnaireData, user);
  const timeBasedMessage = getTimeBasedMessage();
  const availabilityInfo = generateAvailabilityInfo();

  // Always recommend Armora Secure (standard) as it's the primary available service
  const service = services.find(s => s.id === 'standard') || services[0];

  return {
    service,
    profile,
    timeBasedMessage,
    availabilityInfo
  };
}