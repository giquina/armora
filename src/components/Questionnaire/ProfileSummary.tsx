import React from 'react';
import styles from './ProfileSummary.module.css';

interface ProfileSummaryProps {
  userResponses: Record<string, any>;
  userName?: string;
}

interface ServiceRecommendation {
  name: string;
  tier: string;
  features: string;
  price: string;
  confidence: string;
}

export default function ProfileSummaryComponent({ userResponses, userName }: ProfileSummaryProps) {
  
  // Extract user data from responses
  const professionalProfile = userResponses?.step1_transportProfile || userResponses?.step1 || '';
  const frequency = userResponses?.step2 || '';
  const serviceRequirements = userResponses?.step3 || [];
  const primaryAreas = userResponses?.step4 || [];
  const secondaryAreas = userResponses?.step5 || [];
  const safetyContact = userResponses?.step6 || [];
  const specialRequirements = userResponses?.step7 || [];

  // Profile analysis functions
  const getProfileAnalysis = (profile: string): string => {
    const profiles: Record<string, string> = {
      'executive': 'Executive/C-Suite professional requiring high-level security protocols',
      'entrepreneur': 'Entrepreneur/Business Owner requiring flexible, reliable transport solutions',
      'celebrity': 'Public Figure/Celebrity requiring maximum privacy and discretion',
      'athlete': 'Professional Athlete requiring specialized transport for training and competitions',
      'government': 'Government Official requiring secure transport with enhanced protocols',
      'diplomat': 'Diplomatic Representative requiring protocol-compliant secure transport',
      'medical': 'Medical Professional requiring urgent and dependable transport services',
      'legal': 'Legal Professional requiring confidential and punctual transport',
      'creative': 'Creative Professional requiring flexible transport for industry activities',
      'academic': 'Academic Professional requiring reliable transport for educational commitments',
      'student': 'Student requiring safe and affordable transport for academic activities',
      'international_visitor': 'International Visitor requiring specialized guidance and secure transport',
      'prefer_not_to_say': 'Professional requiring customized security transport services'
    };
    return profiles[profile] || 'Professional requiring customized security transport services';
  };

  const getFrequencyAnalysis = (freq: string): { package: string; description: string } => {
    const frequencies: Record<string, { package: string; description: string }> = {
      'daily': { 
        package: 'Executive Priority Package', 
        description: 'daily commuting usage with same-day booking capabilities and priority driver assignment'
      },
      'weekly': { 
        package: 'Professional Regular Package', 
        description: 'weekly business usage with advance booking benefits and consistent service standards'
      },
      'monthly': { 
        package: 'VIP Occasions Package', 
        description: 'monthly special events with premium vehicle selection and enhanced service protocols'
      },
      'project_based': { 
        package: 'Project Intensive Package', 
        description: 'project-based intensive periods with flexible scheduling and dedicated support'
      },
      'priority': {
        package: 'Priority Response Package',
        description: 'on-call priority transport with immediate response capabilities and 24/7 availability'
      },
      'special_events': { 
        package: 'VIP Events Package', 
        description: 'special occasion transport with premium vehicles and specialized event protocols'
      },
      'seasonal': { 
        package: 'Seasonal Flexibility Package', 
        description: 'seasonal usage patterns with adaptable service levels and holiday scheduling'
      }
    };
    return frequencies[freq] || { 
      package: 'Customized Service Package', 
      description: 'flexible usage patterns with personalized service recommendations'
    };
  };

  const getPriorityAnalysis = (requirements: string[]): string => {
    if (!Array.isArray(requirements) || requirements.length === 0) {
      return 'standard security protocols and professional service delivery';
    }

    const priorityMap: Record<string, string> = {
      'privacy_discretion': 'discrete protection and confidential transport',
      'security_awareness': 'enhanced security protocols and threat awareness',
      'premium_comfort': 'premium comfort and executive amenities',
      'professional_service': 'professional etiquette and executive service standards',
      'reliability_tracking': 'punctual service and real-time coordination',
      'flexibility_coverage': 'flexible scheduling and comprehensive coverage',
      'specialized_needs': 'specialized accommodations and custom requirements'
    };

    const mappedPriorities = requirements
      .filter(req => priorityMap[req])
      .map(req => priorityMap[req])
      .slice(0, 3);

    if (mappedPriorities.length === 0) {
      return 'professional service delivery and standard security protocols';
    }

    if (mappedPriorities.length === 1) {
      return mappedPriorities[0];
    }

    if (mappedPriorities.length === 2) {
      return `${mappedPriorities[0]} and ${mappedPriorities[1]}`;
    }

    return `${mappedPriorities.slice(0, -1).join(', ')}, and ${mappedPriorities[mappedPriorities.length - 1]}`;
  };

  const getAreasAnalysis = (primary: string[], secondary: string[] = []): string => {
    const areaMap: Record<string, string> = {
      'central_london': 'Central London',
      'financial_district': 'Financial District',
      'government_quarter': 'Government Quarter',
      'west_end': 'West End',
      'greater_london': 'Greater London',
      'airport_transfers': 'Airport Transfers',
      'tourist_destinations': 'Tourist Destinations',
      'entertainment_events': 'Entertainment & Events',
      'premium_shopping': 'Premium Shopping',
      'healthcare_professional': 'Healthcare & Professional Services',
      'major_uk_cities': 'Major UK Cities',
      'university_business_towns': 'University & Business Towns',
      'scotland_wales': 'Scotland & Wales',
      'international_specialized': 'International & Specialized Venues'
    };

    const primaryMapped = Array.isArray(primary) ? 
      primary.map(area => areaMap[area] || area).filter(Boolean).slice(0, 3) : [];
    
    const secondaryMapped = Array.isArray(secondary) ? 
      secondary.map(area => areaMap[area] || area).filter(Boolean).slice(0, 2) : [];

    let coverage = '';
    if (primaryMapped.length > 0) {
      coverage = primaryMapped.join(', ');
      if (secondaryMapped.length > 0) {
        coverage += ` with specialized capabilities for ${secondaryMapped.join(' and ')}`;
      }
    } else {
      coverage = 'flexible coverage across your preferred locations';
    }

    return coverage;
  };

  const getServiceRecommendation = (): ServiceRecommendation => {
    // Determine service tier based on profile and requirements
    const executiveProfiles = ['executive', 'celebrity', 'diplomat', 'government'];
    const securityRequirements = Array.isArray(serviceRequirements) ? serviceRequirements : [];
    
    const needsHighSecurity = securityRequirements.includes('privacy_discretion') || 
                              securityRequirements.includes('security_awareness');
    const needsPremium = securityRequirements.includes('premium_comfort');
    const isFrequent = frequency === 'daily' || frequency === 'weekly';

    if (executiveProfiles.includes(professionalProfile) && needsHighSecurity) {
      return {
        name: 'Armora Shadow',
        tier: 'Discrete Security Driver',
        features: 'unmarked vehicles, SIA Close Protection officers, and counter-surveillance awareness',
        price: '£65/hour',
        confidence: 'highly recommended'
      };
    }

    if (executiveProfiles.includes(professionalProfile) || needsPremium || isFrequent) {
      return {
        name: 'Armora Executive',
        tier: 'Premium Security Transport',
        features: 'executive chauffeur service, premium vehicles, and enhanced security protocols',
        price: '£75/hour',
        confidence: 'recommended'
      };
    }

    return {
      name: 'Armora Standard',
      tier: 'Professional Security Transport',
      features: 'professional SIA-licensed drivers, premium vehicles, and standard security protocols',
      price: '£45/hour',
      confidence: 'suitable'
    };
  };

  // Generate analysis
  const profileAnalysis = getProfileAnalysis(professionalProfile);
  const frequencyAnalysis = getFrequencyAnalysis(frequency);
  const priorityAnalysis = getPriorityAnalysis(serviceRequirements);
  const areasAnalysis = getAreasAnalysis(primaryAreas, secondaryAreas);
  const serviceRecommendation = getServiceRecommendation();

  const userPrefix = userName ? `${userName}, ` : '';

  return (
    <div className={styles.profileSummaryContainer}>
      
      <section className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>👤</span>
          <h3>Professional Profile</h3>
        </div>
        <p className={styles.sectionContent}>
          {userPrefix}based on your responses, we've identified you as a {profileAnalysis} for your transport needs.
        </p>
      </section>

      <section className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>📅</span>
          <h3>Service Frequency</h3>
        </div>
        <p className={styles.sectionContent}>
          You anticipate {frequencyAnalysis.description}, which qualifies you for our {frequencyAnalysis.package}.
        </p>
      </section>

      <section className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>🛡️</span>
          <h3>Security Requirements</h3>
        </div>
        <p className={styles.sectionContent}>
          Your security priorities include {priorityAnalysis}, and we recommend our {serviceRecommendation.tier} to meet these requirements.
        </p>
      </section>

      <section className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>📍</span>
          <h3>Coverage Areas</h3>
        </div>
        <p className={styles.sectionContent}>
          Primary service coverage includes {areasAnalysis}.
        </p>
      </section>

      <section className={styles.recommendationSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>✨</span>
          <h3>Recommended Service</h3>
        </div>
        <div className={styles.recommendationContent}>
          <p className={styles.recommendationText}>
            Based on your profile, we recommend <strong>{serviceRecommendation.name}</strong> which provides {serviceRecommendation.features} tailored to your specific requirements.
          </p>
          <div className={styles.serviceDetails}>
            <div className={styles.servicePrice}>
              <span className={styles.priceLabel}>Starting from:</span>
              <span className={styles.priceValue}>{serviceRecommendation.price}</span>
            </div>
            <div className={styles.confidenceIndicator}>
              <span className={styles.confidenceLabel}>Match confidence:</span>
              <span className={styles.confidenceValue}>{serviceRecommendation.confidence}</span>
            </div>
          </div>
        </div>
      </section>

      {(safetyContact.length > 0 || specialRequirements.length > 0) && (
        <section className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>⚙️</span>
            <h3>Additional Requirements</h3>
          </div>
          <p className={styles.sectionContent}>
            We've noted your specific requirements for safety coordination and specialized accommodations to ensure optimal service delivery.
          </p>
        </section>
      )}

    </div>
  );
}