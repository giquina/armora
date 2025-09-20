# ARMORA SERVICE REQUIREMENTS & COMPLIANCE DOCUMENTATION
*SIA Licensing, Regional Coverage, and Regulatory Standards*

## EXECUTIVE SUMMARY

This document outlines the comprehensive service requirements, regulatory compliance standards, and operational specifications for Armora's nationwide security transport and personal protection services across England & Wales.

**Service Classification**: Professional Security Services (SIA Regulated)
**Geographic Scope**: England & Wales Nationwide Coverage
**Regulatory Authority**: Security Industry Authority (SIA)
**Service Standards**: Professional Close Protection and Security Transport

---

## 1. SIA LICENSING REQUIREMENTS

### 1.1 Security Industry Authority Compliance

#### Core License Categories Required
**SIA Level 2 Certification (Standard Protection Officers)**
- **License Type**: Door Supervision and Security Guarding
- **Training Requirements**: 30-hour certified training program
- **Background Check**: Enhanced DBS (Disclosure and Barring Service)
- **Validity Period**: 3 years with annual compliance review
- **Skills Assessment**: Physical intervention, emergency response, customer service

**SIA Level 3 Certification (Executive Protection Specialists)**
- **License Type**: Close Protection Operations
- **Training Requirements**: 140-hour certified training program
- **Background Check**: Enhanced DBS with security vetting
- **Validity Period**: 3 years with biannual skills assessment
- **Skills Assessment**: Threat assessment, route planning, emergency evacuation, firearms awareness

**SIA Level 3+ Certification (Shadow Protocol Specialists)**
- **License Type**: Close Protection with Specialist Endorsements
- **Training Requirements**: 200+ hour specialized training
- **Background Check**: Enhanced DBS with national security clearance
- **Validity Period**: 2 years with quarterly performance review
- **Skills Assessment**: Covert operations, advanced threat assessment, counter-surveillance

#### License Verification Process
```typescript
interface SIAVerification {
  licenseNumber: string;
  level: 'Level2' | 'Level3' | 'Level3Plus';
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  expiryDate: Date;
  endorsements: string[];
  verificationDate: Date;
}

// Real-time verification against SIA database
export const verifySIALicense = async (licenseNumber: string): Promise<SIAVerification>
```

### 1.2 Professional Standards Compliance

#### Enhanced DBS Requirements
- **Check Level**: Enhanced DBS certificate required for all officers
- **Update Service**: Annual DBS update service subscription
- **Barred Lists**: Children's and Adults' barred list checks
- **Renewal Timeline**: 3-year maximum between checks
- **Record Maintenance**: Secure storage of all certification documents

#### Ongoing Professional Development
- **Annual Training**: Minimum 16 hours continued professional development
- **Skill Updates**: Emergency response, first aid, conflict resolution
- **Security Briefings**: Monthly threat assessment and procedure updates
- **Performance Reviews**: Quarterly assessment with customer feedback integration

---

## 2. SERVICE AREA BOUNDARIES & COVERAGE

### 2.1 Geographic Service Regions

#### Primary Service Areas (Immediate Response)
**London & Greater London**
- **Coverage**: All 32 London boroughs plus City of London
- **Response Time**: 15 minutes average
- **Officer Availability**: 24/7 immediate deployment
- **Specialist Services**: Airport transfers, corporate protection, diplomatic services
- **Price Category**: Base rates (£65/£95/£125/£55 per hour)

**Major Cities (Premium Coverage)**
- **Cities**: Manchester, Birmingham, Leeds, Liverpool, Bristol, Cardiff
- **Coverage Radius**: 25-mile radius from city center
- **Response Time**: 30 minutes average
- **Officer Availability**: 18-hour coverage with emergency on-call
- **Price Adjustment**: -10% from London base rates

#### Secondary Service Areas (Extended Coverage)
**Regional Towns & Cities**
- **Coverage**: All towns with population >50,000
- **Response Time**: 2 hours maximum
- **Officer Availability**: 12-hour coverage with 24-hour emergency
- **Price Adjustment**: +15% from London base rates
- **Minimum Service**: 4-hour minimum engagement

**Rural & Remote Areas**
- **Coverage**: By arrangement with extended response time
- **Response Time**: 4 hours maximum
- **Officer Availability**: Emergency deployment only
- **Price Adjustment**: +25% from London base rates
- **Minimum Service**: 8-hour minimum engagement

#### Airport Specialist Services
**Major UK Airports**
- **Primary**: Heathrow, Gatwick, Manchester, Birmingham
- **Secondary**: Edinburgh, Bristol, Liverpool, Leeds Bradford
- **Specialist Training**: Airport security protocols, terminal procedures
- **Security Clearance**: Aviation security background checks
- **Price Premium**: +25% for airport specialist services

### 2.2 Service Boundary Enforcement

#### Geographic Validation System
```typescript
interface ServiceBoundary {
  region: 'england' | 'wales';
  county: string;
  serviceLevel: 'primary' | 'secondary' | 'extended' | 'unavailable';
  responseTime: number; // minutes
  priceMultiplier: number;
  specialistAvailable: boolean;
}

// Postcode-based service validation
export const validateServiceArea = (postcode: string): ServiceBoundary | null
```

#### Cross-Border Restrictions
- **Scotland**: No service provision (different licensing requirements)
- **Northern Ireland**: No service provision (separate regulatory framework)
- **Republic of Ireland**: No service provision (EU jurisdiction)
- **International Waters**: Service terminates at territorial boundaries

---

## 3. PRICING CALCULATION FORMULAS

### 3.1 Regional Pricing Structure

#### Base Rate Calculation
```typescript
interface ServiceTier {
  name: 'StandardProtection' | 'ExecutiveShield' | 'ShadowProtocol' | 'ClientVehicle';
  baseRate: number; // London rates
  minimumDuration: number; // hours
  officerLevel: 'Level2' | 'Level3' | 'Level3Plus';
}

const baseTiers: ServiceTier[] = [
  { name: 'StandardProtection', baseRate: 65, minimumDuration: 4, officerLevel: 'Level2' },
  { name: 'ExecutiveShield', baseRate: 95, minimumDuration: 6, officerLevel: 'Level3' },
  { name: 'ShadowProtocol', baseRate: 125, minimumDuration: 8, officerLevel: 'Level3Plus' },
  { name: 'ClientVehicle', baseRate: 55, minimumDuration: 4, officerLevel: 'Level2' }
];
```

#### Regional Price Multipliers
```typescript
const regionalMultipliers = {
  london: 1.0,           // Base rates
  majorCity: 0.9,        // -10% discount
  regional: 1.15,        // +15% premium
  rural: 1.25,           // +25% premium
  airport: 1.25          // +25% specialist premium
};

// Combined pricing calculation
export const calculateServiceCost = (
  tier: ServiceTier,
  region: ServiceBoundary,
  duration: number,
  isAirportService: boolean
): number => {
  const basePrice = tier.baseRate * Math.max(duration, tier.minimumDuration);
  const regionalPrice = basePrice * region.priceMultiplier;
  const airportPremium = isAirportService ? regionalPrice * 0.25 : 0;
  return regionalPrice + airportPremium;
};
```

### 3.2 Venue Protection Contract Pricing

#### PPO Contract Structure
```typescript
interface VenueContract {
  duration: 'day' | 'weekend' | 'month' | 'year';
  basePrice: number;
  officerCount: number; // 1-10 officers
  riskLevel: 'standard' | 'high-risk';
  location: ServiceBoundary;
}

const venueContractRates = {
  day: { basePrice: 450, coverage: 8 }, // hours
  weekend: { basePrice: 850, coverage: 48 }, // hours
  month: { basePrice: 12500, coverage: 720 }, // hours
  year: { basePrice: 135000, coverage: 8760 } // hours
};

// Venue protection pricing calculation
export const calculateVenueProtection = (contract: VenueContract): number => {
  const basePrice = venueContractRates[contract.duration].basePrice;
  const officerMultiplier = contract.officerCount;
  const riskMultiplier = contract.riskLevel === 'high-risk' ? 1.5 : 1.0;
  const locationMultiplier = contract.location.priceMultiplier;

  return basePrice * officerMultiplier * riskMultiplier * locationMultiplier;
};
```

---

## 4. COMPLIANCE MESSAGING REQUIREMENTS

### 4.1 Mandatory Regulatory Statements

#### SIA Registration Display
**Required Text**: "SIA Licensed Security Services - Registration: SIA-123456789"
**Placement**: All marketing materials, website footer, vehicle signage
**Font Requirements**: Minimum 12pt on print, minimum 14px on digital
**Visibility**: Must be clearly visible and legible on all platforms

#### Professional Standards Declaration
**Required Elements**:
- "All officers are SIA Level 2 or Level 3 certified"
- "Enhanced DBS background checks completed"
- "Professional indemnity insurance coverage"
- "24/7 emergency response capability"
- "Regulated by the Security Industry Authority"

#### Geographic Service Boundaries
**Required Disclaimer**: "Services available across England & Wales only. Response times vary by location. Specialist services available at major airports."
**Placement**: Service booking pages, pricing information, terms of service
**Update Frequency**: Quarterly review and annual confirmation

### 4.2 GDPR Compliance Messaging

#### Data Collection Statements
```typescript
const gdprCompliance = {
  dataMinimization: "We collect only essential information required for security services",
  lawfulBasis: "Processing based on legitimate interest for security service delivery",
  retentionPolicy: "Personal data retained for 7 years in line with security industry standards",
  subjectRights: "Full data subject rights including access, rectification, and erasure",
  internationalTransfers: "No international data transfers outside UK jurisdiction"
};
```

#### Privacy Notice Requirements
- **Collection Purpose**: Clear statement of why data is collected
- **Legal Basis**: Legitimate interest and contractual necessity
- **Retention Period**: 7 years for security-related records
- **Data Subject Rights**: Full GDPR rights with contact information
- **Complaint Process**: ICO complaint procedure information

---

## 5. REGIONAL SERVICE VARIATIONS

### 5.1 London Metropolitan Area

#### Service Excellence Standards
- **Response Time**: 15 minutes average, 30 minutes maximum
- **Officer Deployment**: Real-time GPS tracking and route optimization
- **Communication**: Secure encrypted radio and mobile communication
- **Vehicle Standards**: Professional unmarked vehicles with GPS tracking
- **Emergency Backup**: Multiple officer availability within 5-mile radius

#### Specialist London Services
- **Diplomatic Protection**: Embassy and consulate security services
- **Corporate Executive**: FTSE 100 company executive protection
- **High-Net-Worth**: Luxury residence and lifestyle protection
- **Event Security**: Premier venue and private event coverage

### 5.2 Major Cities Coverage

#### Adapted Service Model
- **Local Partnerships**: Regional security companies and training providers
- **Cultural Awareness**: Local area knowledge and cultural sensitivity
- **Response Networks**: Hub-and-spoke deployment model
- **Quality Assurance**: Monthly site visits and performance monitoring

#### Regional Specializations
- **Manchester**: Media and entertainment industry focus
- **Birmingham**: Manufacturing and corporate headquarters
- **Leeds**: Financial services and professional firms
- **Cardiff**: Government and public sector services

### 5.3 Rural and Remote Areas

#### Extended Response Model
- **Pre-Positioning**: Strategic officer placement for planned services
- **Local Recruitment**: Regional officer training and certification
- **Technology Support**: Enhanced GPS tracking and communication systems
- **Emergency Protocols**: Coordination with local emergency services

#### Service Limitations
- **Minimum Engagements**: 8-hour minimum for rural deployments
- **Advance Booking**: 48-hour minimum notice for non-emergency services
- **Weather Contingency**: Alternative arrangements for severe weather
- **Communication Coverage**: Satellite backup for remote area communication

---

## 6. PROFESSIONAL CERTIFICATION STANDARDS

### 6.1 Officer Training Requirements

#### Core Competency Framework
```typescript
interface OfficerCertification {
  siaLevel: 'Level2' | 'Level3' | 'Level3Plus';
  coreTraining: {
    conflictResolution: boolean;
    emergencyResponse: boolean;
    firstAid: boolean;
    customerService: boolean;
    communicationSkills: boolean;
  };
  specialistTraining: {
    threatAssessment?: boolean;
    routePlanning?: boolean;
    surveillanceDetection?: boolean;
    emergencyDriving?: boolean;
    firearmsSafety?: boolean;
  };
  continuingEducation: {
    hoursCompleted: number; // annually
    lastUpdate: Date;
    nextRequired: Date;
  };
}
```

#### Performance Standards
- **Customer Satisfaction**: Minimum 4.5/5.0 rating average
- **Incident Record**: Zero preventable security incidents
- **Professional Conduct**: Adherence to industry code of ethics
- **Technical Proficiency**: Annual skills assessment and certification
- **Communication Skills**: Professional interaction and reporting standards

### 6.2 Vehicle and Equipment Standards

#### Security Vehicle Requirements
- **Vehicle Category**: Professional unmarked vehicles
- **Safety Equipment**: First aid kit, emergency communication, GPS tracking
- **Security Features**: Tinted windows, reinforced locks, emergency lighting
- **Maintenance Standards**: Monthly safety inspections and certifications
- **Insurance Coverage**: Commercial vehicle and passenger liability

#### Communication Systems
- **Primary**: Encrypted radio communication with central dispatch
- **Secondary**: Secure mobile phone with emergency contacts
- **Emergency**: Panic button with automatic location transmission
- **Backup**: Satellite communication for remote area coverage

---

## 7. EMERGENCY RESPONSE PROTOCOLS

### 7.1 Incident Classification System

#### Response Categories
```typescript
type IncidentLevel = 'routine' | 'elevated' | 'high' | 'critical' | 'emergency';

interface IncidentResponse {
  level: IncidentLevel;
  responseTime: number; // minutes
  escalationProtocol: string[];
  emergencyServices: boolean;
  reportingRequirement: string;
}

const responseProtocols: Record<IncidentLevel, IncidentResponse> = {
  routine: { level: 'routine', responseTime: 30, escalationProtocol: ['supervisor'], emergencyServices: false, reportingRequirement: 'daily' },
  elevated: { level: 'elevated', responseTime: 15, escalationProtocol: ['supervisor', 'manager'], emergencyServices: false, reportingRequirement: 'immediate' },
  high: { level: 'high', responseTime: 10, escalationProtocol: ['supervisor', 'manager', 'director'], emergencyServices: false, reportingRequirement: 'immediate' },
  critical: { level: 'critical', responseTime: 5, escalationProtocol: ['all management', 'client'], emergencyServices: true, reportingRequirement: 'immediate' },
  emergency: { level: 'emergency', responseTime: 0, escalationProtocol: ['999', 'all management', 'client'], emergencyServices: true, reportingRequirement: 'immediate' }
};
```

### 7.2 24/7 Emergency Support

#### Command Center Operations
- **Location**: Central London with regional coordination points
- **Staffing**: 24/7 qualified security controllers with SIA certification
- **Communication**: Direct radio contact with all deployed officers
- **Coordination**: Real-time tracking and incident management systems
- **Emergency Services**: Direct liaison with police, ambulance, and fire services

#### Client Emergency Contacts
- **Primary**: 0800-ARMORA-HELP (24/7 toll-free emergency line)
- **Secondary**: response@armora.security (monitored 24/7)
- **Mobile**: Direct officer contact via secure messaging app
- **Emergency**: Automatic 999 emergency services escalation when required

---

## 8. REGULATORY COMPLIANCE MONITORING

### 8.1 SIA Compliance Auditing

#### Regular Compliance Checks
- **Monthly**: Officer license status verification
- **Quarterly**: Performance and conduct reviews
- **Annually**: Full SIA compliance audit
- **Ad-hoc**: Incident-triggered compliance investigations

#### Documentation Requirements
```typescript
interface ComplianceRecord {
  officerId: string;
  licenseVerification: {
    status: 'valid' | 'expired' | 'suspended';
    lastChecked: Date;
    nextCheck: Date;
  };
  trainingRecords: {
    coreTraining: Date;
    continuingEducation: number; // hours
    specialistCertifications: string[];
  };
  performanceMetrics: {
    clientSatisfaction: number;
    incidentRecord: string[];
    conductIssues: string[];
  };
}
```

### 8.2 Quality Assurance Framework

#### Service Quality Monitoring
- **Client Feedback**: Post-service satisfaction surveys
- **Mystery Shopping**: Anonymous service quality assessments
- **Performance Metrics**: Response times, incident handling, professionalism
- **Continuous Improvement**: Monthly service enhancement reviews

#### Compliance Reporting
- **SIA Reporting**: Annual compliance report to Security Industry Authority
- **Client Reporting**: Quarterly service performance reports
- **Incident Reporting**: Immediate reporting of any security-related incidents
- **Insurance Reporting**: Annual claims and risk assessment reports

---

**Document Version**: 1.0
**Last Updated**: September 20, 2025
**Next Review**: October 20, 2025
**Compliance Status**: APPROVED - Ready for SIA Submission

---

*This Service Requirements document ensures full compliance with UK security industry regulations and provides the operational framework for nationwide professional security services across England & Wales.*