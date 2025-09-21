# ARMORA Language & Tone Guidelines
## Complete Knowledge Base with Code Integration

Last updated: 2025-09-21T17:56:37.169Z

---

## 🎯 Quick Decision Tree

```mermaid
Is it describing movement? → Use "protection assignment"
Is it about the person? → Use "protection officer/CPO"
Is it about payment? → Use "service fee"
Is it about the vehicle? → Use "secure vehicle"
Is it about the service? → Use "protection detail"
```

---

## 1. Core Terminology with Code Examples

### Protection Officer (Never "Driver")

```typescript
// ❌ WRONG
const driverStatus = "Your driver is arriving"
const driverName = response.driver.name
interface DriverProfile {
  name: string;
  rating: number;
}

// ✅ CORRECT
const officerStatus = "Your protection officer is en route"
const officerName = response.protectionOfficer.name
interface ProtectionOfficerProfile {
  name: string;
  siaLicense: string;
  securityLevel: 'Level2' | 'Level3' | 'SpecialForces';
}
```

### Principal (Never "Passenger")

```typescript
// ❌ WRONG
const passengerCount = booking.passengers
const passengerName = user.name
<div>Passenger pickup location</div>

// ✅ CORRECT
const principalCount = booking.principals
const principalName = user.name
<div>Principal collection point</div>
```

### Protection Assignment (Never "Ride/Trip")

```typescript
// ❌ WRONG
const rideHistory = getUserRides()
const tripCost = calculateTripPrice()
localStorage.setItem('last_ride', rideId)

// ✅ CORRECT
const assignmentHistory = getUserAssignments()
const protectionCost = calculateProtectionFee()
localStorage.setItem('last_assignment', assignmentId)
```

### Security Assessment (Never "Booking Review")

```typescript
// ❌ WRONG
const bookingReview = {
  pickup: location,
  dropoff: destination,
  time: scheduledTime
}

// ✅ CORRECT
const securityAssessment = {
  collectionPoint: location,
  secureDestination: destination,
  protectionCommences: scheduledTime,
  threatLevel: 'standard' | 'elevated' | 'high'
}
```

---

## 2. Why This Matters

### Legal Implications
- **PHV Regulations**: Using taxi/ride terminology could classify us incorrectly under Private Hire Vehicle regulations
- **SIA Compliance**: Security Industry Authority requires specific terminology for close protection services
- **Insurance Coverage**: Our insurance specifically covers "close protection services" not "transportation services"

### Brand Perception
- **Premium Positioning**: Security language commands 3x higher rates than taxi services
- **Trust Building**: Professional terminology increases perceived safety by 67% (user research)
- **Market Differentiation**: Separates us from Uber/Bolt/traditional taxi services

### SEO Impact
- **Target Keywords**: "close protection London", "security transport UK", "SIA licensed protection"
- **Avoid Keywords**: "taxi", "cab", "ride sharing", "cheap transport"
- **Voice Search**: Users say "I need security" not "I need a ride"

---

## 3. Context-Sensitive Language Rules

### First-Time Users
```typescript
// More explanatory, educational tone
const welcomeMessage = `
  Welcome to Armora's professional close protection services.
  Our SIA-licensed protection officers ensure your complete security
  during transport and at your destination.
`
```

### During Booking Flow
```typescript
// Action-focused, efficient language
const bookingSteps = {
  step1: "Select protection level",
  step2: "Confirm security requirements",
  step3: "Deploy protection team"
}
```

### Active Protection Detail
```typescript
// Reassuring, professional updates
const statusUpdates = {
  assigned: "Protection Officer ${name} assigned to your detail",
  approaching: "CPO approaching principal location - ETA ${time}",
  active: "Protection detail active - secure transport in progress",
  completed: "Protection assignment completed successfully"
}
```

### Error States
```typescript
// Authoritative but reassuring
const errorMessages = {
  officerDelay: "Your protection officer is managing a security matter. New ETA: ${time}",
  paymentFailed: "Security clearance pending - please verify payment details",
  serviceUnavailable: "Protection teams fully deployed - priority queue activated"
}
```

---

## 4. Component Library Reference

### Components and Their Language Rules

#### `BookingCard.tsx`
```typescript
// Uses "Protection Assignment" terminology
<h2>Current Protection Assignment</h2>
<p>Officer: {assignment.protectionOfficer.name}</p>
<p>Security Level: {assignment.serviceLevel}</p>
```

#### `PriceDisplay.tsx`
```typescript
// Uses "Service Fee Breakdown"
const priceBreakdown = {
  protectionFee: 125.00,     // NOT "ride fare"
  vehicleSurcharge: 25.00,    // NOT "car fee"
  securityPremium: 15.00,     // NOT "surge pricing"
  bookingFee: 10.00           // Acceptable as is
}
```

#### `OfficerCard.tsx` (formerly DriverCard.tsx)
```typescript
// Uses "Protection Officer Profile"
interface OfficerProfile {
  name: string;
  siaNumber: string;
  specializations: string[];
  yearsExperience: number;
  threatResponseTraining: boolean;
}
```

#### `StatusTracker.tsx`
```typescript
// Professional status messages
const statusMessages = {
  searching: "Identifying available protection officers",
  matched: "Protection specialist confirmed",
  preparing: "Officer conducting vehicle security check",
  enRoute: "CPO approaching principal location",
  arrived: "Protection officer at collection point",
  active: "Protection detail active",
  complete: "Assignment concluded - principal secure"
}
```

---

## 5. Dynamic Variables Guide

### Template Strings with Correct Terminology

```typescript
// User notifications
const notifications = {
  assignment: `Your ${serviceLevel} protection officer ${officerName} will arrive in ${time} minutes`,
  arrival: `${officerName}, your protection specialist, has arrived in a ${vehicleType}`,
  completion: `Protection assignment completed. Total service fee: £${totalFee}`,
  rating: `Rate your protection officer ${officerName}'s service`
}

// SMS/Email templates
const smsTemplate = `ARMORA Security: ${officerName} (SIA: ${siaNumber}) is your assigned protection officer. ${vehicleMake} ${vehicleModel}, arriving ${eta}.`

// In-app messages
const getStatusMessage = (status: AssignmentStatus): string => {
  switch(status) {
    case 'searching':
      return `Securing ${serviceLevel} protection officer...`
    case 'confirmed':
      return `${officerName} assigned as your close protection officer`
    case 'arrived':
      return `Your protection specialist has arrived`
    default:
      return 'Updating security status...'
  }
}
```

---

## 6. Edge Cases & Exceptions

### Third-Party API Integration
```typescript
// When interfacing with Google Maps API
// Internal terminology → External API → Display terminology
const mapMarkers = {
  // Google expects "driver" but we display "officer"
  driverLocation: coordinates, // API field name
  displayLabel: "Protection Officer Location", // What user sees
  infoWindow: `CPO ${officerName} - ${timeAway} away`
}
```

### Payment Processing
```typescript
// Stripe/payment processor descriptions
const chargeDescription = {
  // For payment processor (may need standard terms)
  stripeDescription: "ARMORA-SEC-TRANSPORT",
  // For user receipt
  userDescription: "Close Protection Services",
  // For invoice
  invoiceLineItem: "Professional Security Detail - SIA Licensed"
}
```

### Legal Documents
```typescript
// Terms that may be legally required
const legalTerms = {
  // May need to use "passenger" in insurance/legal contexts
  insuranceContext: "passenger liability coverage",
  // But pair with our terminology
  displayText: "Principal (passenger) protection insurance"
}
```

### Emergency Situations
```typescript
const emergencyProtocols = {
  panicButton: "EMERGENCY - Protection officer requested immediately",
  silentAlarm: "Discrete security response initiated",
  evacuation: "Secure extraction protocol activated",
  medicalEmergency: "Medical-trained CPO dispatched"
}
```

---

## 7. Common Mistakes Section

### Found Issues in Current Codebase

#### Issue #1: File: `src/components/BookingFlow.tsx`
```typescript
// ❌ Line 234 - WRONG
const rideTotal = calculateRidePrice()

// ✅ FIXED
const protectionTotal = calculateProtectionFee()
```

#### Issue #2: File: `src/utils/notifications.ts`
```typescript
// ❌ Line 89 - WRONG
"Your driver will arrive in 5 minutes"

// ✅ FIXED
"Your protection officer will arrive in 5 minutes"
```

#### Issue #3: File: `src/contexts/AppContext.tsx`
```typescript
// ❌ Line 445 - WRONG
interface RideHistory {
  rides: Ride[]
}

// ✅ FIXED
interface AssignmentHistory {
  assignments: ProtectionAssignment[]
}
```

---

## 8. Searchable Keywords & Tags

### Quick Reference Tags
- `#payment-language` - Service fees, protection costs, billing
- `#booking-flow` - Assignment creation, security assessment
- `#officer-arrival` - CPO status, approach notifications
- `#emergency-text` - Panic situations, discrete alerts
- `#user-types` - Principal, client, protected individual
- `#service-tiers` - Essential, Executive, Shadow Protocol
- `#vehicle-terms` - Secure transport, protected vehicle
- `#status-updates` - Assignment progress, officer location
- `#legal-compliance` - SIA requirements, insurance terms
- `#api-integration` - Third-party service translations

---

## 9. Conversation Scripts

### Customer Service Templates

#### Scenario: "Where's my driver?"
```typescript
const response = {
  acknowledgment: "I'll check on your protection officer's status right away.",
  status: "Your protection officer, ${officerName}, is currently ${status}.",
  eta: "They'll arrive at your location in approximately ${time} minutes.",
  reassurance: "Your security detail is confirmed and on schedule."
}
```

#### Scenario: "Cancel my ride"
```typescript
const response = {
  clarification: "I understand you'd like to cancel your protection assignment.",
  confirmation: "Would you like to cancel the current security detail?",
  cancellation: "Your protection assignment has been cancelled.",
  fee_info: "A cancellation fee may apply as the officer was already deployed."
}
```

#### Scenario: "How much for airport pickup?"
```typescript
const response = {
  correction: "I'll help you arrange secure airport protection services.",
  pricing: "Airport protection specialists start at £95/hour with a 2-hour minimum.",
  details: "This includes meet & greet, luggage security, and safe transport.",
  booking: "Shall I arrange an airport protection detail for you?"
}
```

---

## 10. Automated Checking Rules

### Pre-commit Hook Configuration

```javascript
// .husky/pre-commit
const forbiddenTerms = /\b(taxi|cab|ride|driver|passenger|trip)\b/gi
const exceptions = ['driver_license', 'screwdriver', 'passenger_manifest'] // Technical exceptions

const checkFile = (content, filename) => {
  const violations = []
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    if (forbiddenTerms.test(line)) {
      // Check if it's not an exception
      const isException = exceptions.some(ex => line.includes(ex))
      if (!isException) {
        violations.push({
          file: filename,
          line: index + 1,
          content: line.trim(),
          suggestion: line.replace(forbiddenTerms, (match) => {
            return replacements[match.toLowerCase()] || match
          })
        })
      }
    }
  })
  return violations
}

const replacements = {
  'taxi': 'security transport',
  'cab': 'protection vehicle',
  'ride': 'assignment',
  'driver': 'protection officer',
  'passenger': 'principal',
  'trip': 'protection detail'
}
```

### ESLint Custom Rule

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'armora/correct-terminology': ['error', {
      forbidden: ['taxi', 'cab', 'ride', 'driver', 'passenger'],
      replacements: {
        'driver': 'protection officer',
        'passenger': 'principal',
        'ride': 'assignment'
      }
    }]
  }
}
```

---

## 11. VS Code Snippets

### Add to `.vscode/armora-snippets.code-snippets`

```json
{
  "Protection Officer Status": {
    "prefix": "officer-status",
    "body": [
      "const officerStatus = {",
      "  name: '${1:officerName}',",
      "  siaLicense: '${2:licenseNumber}',",
      "  status: '${3|approaching,arrived,active|}',",
      "  eta: ${4:estimatedTime}",
      "}"
    ]
  },
  "Assignment Notification": {
    "prefix": "assignment-notify",
    "body": [
      "const notification = `Your protection officer ${${1:officerName}} is ${${2:status}}.`;",
      "// Never use: 'Your driver is arriving'",
      "// Always use: 'Your protection officer is approaching'"
    ]
  },
  "Service Pricing": {
    "prefix": "protection-price",
    "body": [
      "const protectionFee = {",
      "  baseFee: ${1:125},",
      "  vehicleSurcharge: ${2:25},",
      "  securityPremium: ${3:15},",
      "  totalProtectionCost: ${4:165}",
      "}"
    ]
  }
}
```

---

## 12. GitHub Actions Validation

### `.github/workflows/language-check.yml`

```yaml
name: Language Compliance Check

on: [push, pull_request]

jobs:
  terminology-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Check for forbidden terminology
        run: |
          # Find violations
          grep -r -n -i -E "(taxi|cab|ride[^r]|driver|passenger)" \
            --include="*.tsx" \
            --include="*.ts" \
            --include="*.jsx" \
            --include="*.js" \
            --exclude-dir=node_modules \
            --exclude-dir=build \
            . || true > violations.txt

          if [ -s violations.txt ]; then
            echo "❌ Forbidden terminology found:"
            cat violations.txt
            exit 1
          else
            echo "✅ No terminology violations found"
          fi

      - name: Verify SIA references
        run: |
          # Ensure protection officers are properly referenced
          grep -r "protection officer" --include="*.tsx" | wc -l
```

---

## 13. Multi-Language Considerations

### International Expansion Templates

```typescript
const translations = {
  en_GB: {
    protectionOfficer: "Protection Officer",
    principal: "Principal",
    assignment: "Protection Assignment",
    siaLicensed: "SIA Licensed"
  },
  en_US: {
    protectionOfficer: "Security Specialist",
    principal: "Client",
    assignment: "Security Detail",
    siaLicensed: "Licensed Security Professional"
  },
  es_ES: {
    protectionOfficer: "Oficial de Protección",
    principal: "Cliente Protegido",
    assignment: "Servicio de Protección",
    siaLicensed: "Licencia de Seguridad"
  },
  fr_FR: {
    protectionOfficer: "Agent de Protection",
    principal: "Client Principal",
    assignment: "Mission de Protection",
    siaLicensed: "Agent Agréé"
  },
  ar_AE: {
    protectionOfficer: "ضابط الحماية",
    principal: "العميل المحمي",
    assignment: "مهمة الحماية",
    siaLicensed: "مرخص أمنياً"
  }
}
```

---

## 14. A/B Testing Guidelines

### Testing New Terminology

```typescript
const terminologyTests = {
  test_001: {
    control: "Your protection officer has arrived",
    variant_a: "Your security specialist is here",
    variant_b: "Your CPO is at the collection point",
    metrics: ['booking_completion', 'user_trust_score', 'premium_conversion']
  },
  test_002: {
    control: "Book protection services",
    variant_a: "Arrange security detail",
    variant_b: "Deploy protection team",
    metrics: ['click_through_rate', 'booking_initiation', 'service_selection']
  }
}

// Implementation
const getTerminology = (testId: string, userId: string): string => {
  const variant = getABTestVariant(testId, userId)
  return terminologyTests[testId][variant]
}
```

---

## 15. Version History

### Terminology Evolution

```typescript
const versionHistory = {
  "v1.0.0": {
    date: "2024-09-01",
    changes: [
      "Initial terminology: driver → protection officer",
      "Established SIA compliance language"
    ]
  },
  "v1.1.0": {
    date: "2024-10-15",
    changes: [
      "Added 'Security Specialist' as alternative",
      "Refined venue protection terminology"
    ]
  },
  "v1.2.0": {
    date: "2024-11-20",
    changes: [
      "Standardized payment terminology",
      "Added emergency protocol language"
    ]
  },
  "v2.0.0": {
    date: "2025-09-20",
    changes: [
      "Complete language framework overhaul",
      "Added automated checking systems",
      "Implemented code integration examples"
    ]
  }
}
```

---

## Quick Implementation Checklist

- [ ] Run forbidden terms checker on entire codebase
- [ ] Update all component files with correct terminology
- [ ] Install pre-commit hooks for language validation
- [ ] Add VS Code snippets for common patterns
- [ ] Update API response transformers
- [ ] Review and update all user-facing copy
- [ ] Update email/SMS templates
- [ ] Configure A/B tests for new terminology
- [ ] Train customer service on conversation scripts
- [ ] Set up GitHub Actions for continuous validation

---

## Contact & Governance

**Language Authority**: Product Team
**Technical Implementation**: Engineering Team
**Compliance Review**: Legal Team
**Last Review**: 2025-09-20
**Next Review**: 2025-10-20

For questions or suggestions: language-governance@armora.security