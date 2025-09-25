# SIA_COMPLIANCE.md
## Complete SIA Compliance Guidelines for Armora

**Version:** 2.0.0
**Last Updated:** September 2025
**Status:** MANDATORY
**Purpose:** Single source of truth for all SIA compliance and language requirements

---

## 🚨 CRITICAL COMPLIANCE OVERVIEW

### What Armora IS (Legally):
**Armora provides SIA-licensed Close Protection Officers (CPOs) who deliver secure transport as an integrated element of their protective duties.**

### What Armora is NOT:
- ❌ Private Hire Vehicle (PHV) service
- ❌ Taxi or minicab service
- ❌ Ride-hailing platform
- ❌ Chauffeur service (unless specifically licensed)
- ❌ Transportation company

### Legal Framework:
- **Licensed Under:** SIA Close Protection licensing
- **NOT Licensed As:** PHV operator or taxi service
- **Regulatory Body:** Security Industry Authority (SIA)
- **NOT Regulated By:** Local PHV/taxi licensing authorities

---

## 📋 OFFICIAL SERVICE DEFINITION

### Secure Transport & Close Protection (Armora Legal Definition)

Armora does not provide standard "chauffeuring" or private hire taxi services. Instead, the platform coordinates **SIA-licensed Close Protection Officers (CPOs)** who additionally provide **secure transport** as part of their protective duties.

This service is defined as:

1. **Close Protection with Secure Transport**
   The safe conveyance of clients in vehicles by licensed operatives trained in both **protective security** and **professional driving standards**.

2. **Executive Protection Driving**
   Transport integrated with risk management, route planning, and client safety, going beyond the scope of private hire.

3. **Protective Mobility**
   Enabling clients to move securely between locations under the supervision of licensed Close Protection personnel.

This distinction ensures Armora is correctly aligned with **SIA regulatory categories** (Close Protection) rather than private hire operator regulations. The transport function is always delivered **as an integrated element of Close Protection**, not as a stand-alone chauffeuring service.

---

## 🔄 MANDATORY TERMINOLOGY REPLACEMENTS

### Core Service Terms

| ❌ NEVER USE | ✅ ALWAYS USE | Context |
|--------------|---------------|---------|
| Ride/Trip | Protection assignment | Service instance |
| Booking | Protection request | Service arrangement |
| Driver | Protection Officer / CPO | Service provider |
| Passenger | Principal | Client being protected |
| Taxi/Cab | Security vehicle | Transport method |
| Fare/Price | Protection fee / Service fee | Pricing |
| Pickup | Protection commencement | Start point |
| Dropoff | Secure destination | End point |
| Route | Security route | Path planning |
| Journey | Secure movement | Travel description |

### Interface & Code Terms

| ❌ FORBIDDEN | ✅ APPROVED | Usage |
|--------------|-------------|--------|
| pickupLocation | commencementPoint | Start location property |
| dropoffLocation | secureDestination | End location property |
| driverId | officerId | Professional identifier |
| passengerId | principalId | Client identifier |
| rideStatus | protectionStatus | Service state |
| bookingId | assignmentId | Service identifier |
| tripDuration | protectionDuration | Time measurement |
| fareAmount | serviceFee | Cost property |

### User Interface Text

| ❌ WRONG | ✅ CORRECT | Location |
|----------|------------|-----------|
| "Book a ride" | "Request protection" | Button text |
| "Your driver is arriving" | "Your protection officer is en route" | Status update |
| "Trip in progress" | "Protection detail active" | Active status |
| "Rate your ride" | "Rate your protection service" | Feedback prompt |
| "Cancel ride" | "Cancel assignment" | Cancellation |
| "Ride completed" | "Protection service completed" | Completion |
| "Find a driver" | "Request protection officer" | Search action |
| "Driver details" | "Officer credentials" | Professional info |

---

## 💬 LANGUAGE TONE BY APP SECTION

### PASSENGER APP (User-Friendly but SIA-Compliant)

#### Welcome & Onboarding
```
✅ "Welcome to Armora! Professional protection when you need it"
✅ "Let's get you protected safely"
✅ "Your security is our priority"
❌ "Book your next ride with us"
❌ "Premium taxi service"
```

#### Service Descriptions
```
✅ "Our protection officers keep you safe during your journey"
✅ "SIA-licensed professionals providing secure transport"
✅ "Protection services from £50/hour"
❌ "Professional drivers available 24/7"
❌ "Luxury transport service"
```

#### Status Updates
```
✅ "Your protection officer John is 5 minutes away!"
✅ "Protection started - you're in safe hands"
✅ "Thanks for choosing Armora protection"
❌ "Your driver is approaching"
❌ "Ride in progress"
```

### DRIVER APP (Professional Security Language)

#### Assignment Notifications
```
✅ "New protection assignment available - Principal requires immediate service"
✅ "Protection detail: Executive level, Central London"
✅ "Principal secured - proceed to destination"
❌ "New ride request"
❌ "Passenger pickup required"
```

#### Status Options
```
✅ "En route to principal"
✅ "Protection detail active"
✅ "Principal delivered to secure destination"
❌ "Heading to passenger"
❌ "Trip started"
```

---

## 📝 COMPONENT-SPECIFIC LANGUAGE

### Authentication Components
```typescript
// src/components/Auth/*
✅ "Sign up for protection services"
✅ "Login to your security account"
❌ "Create your rider account"
❌ "Driver login"
```

### Dashboard Components
```typescript
// src/components/Dashboard/*
✅ "Your Protection Dashboard"
✅ "Recent Assignments"
✅ "Protection Statistics"
❌ "Your Rides"
❌ "Trip History"
```

### Booking/Assignment Components
```typescript
// src/components/AssignmentsView/*
✅ "Protection Assignment Details"
✅ "Officer Information"
✅ "Security Route"
❌ "Booking Details"
❌ "Driver Info"
```

### Payment Components
```typescript
// src/components/Payment/*
✅ "Protection Service Fee"
✅ "Security Service Invoice"
❌ "Ride Fare"
❌ "Trip Cost"
```

---

## 💰 PRICING LANGUAGE

### Service Tiers (ALWAYS include "Protection")
```
✅ Essential Protection - £50/hour + £2.50/mile
✅ Executive Protection - £75/hour + £2.50/mile
✅ Shadow Protocol - £65/hour + £2.50/mile
❌ Standard Service - £50/hour
❌ Premium Tier - £75/hour
```

### Pricing Display
```
✅ "Protection fees from £50/hour"
✅ "Service fee: £150 (2 hours protection + mileage)"
❌ "Fare: £150"
❌ "Trip cost: £150"
```

---

## 🔍 CODE COMPLIANCE CHECKLIST

### TypeScript Interfaces
```typescript
// ✅ CORRECT
interface ProtectionAssignment {
  id: string;
  principalId: string;         // NOT passengerId
  officerId: string;            // NOT driverId
  commencementPoint: Location;  // NOT pickupLocation
  secureDestination: Location;  // NOT dropoffLocation
  protectionStatus: Status;     // NOT rideStatus
  serviceFee: number;           // NOT fare
}

// ❌ WRONG
interface Booking {
  passengerId: string;
  driverId: string;
  pickup: Location;
  dropoff: Location;
  tripStatus: Status;
  fare: number;
}
```

### API Endpoints
```typescript
// ✅ CORRECT
POST /api/protection/request
GET  /api/assignments/:id
PUT  /api/officers/status
GET  /api/protection/history

// ❌ WRONG
POST /api/rides/book
GET  /api/trips/:id
PUT  /api/drivers/location
GET  /api/bookings/history
```

### Component Naming
```typescript
// ✅ CORRECT
ProtectionRequestForm.tsx
OfficerDetailsCard.tsx
AssignmentStatusBar.tsx
SecurityRouteMap.tsx

// ❌ WRONG
BookingForm.tsx
DriverCard.tsx
TripStatus.tsx
RouteMap.tsx
```

---

## 📱 QUESTIONNAIRE COMPLIANCE

### Question Headers
```
✅ "Which professional category best describes your protection requirements?"
✅ "How often do you require professional protection services?"
❌ "What are your transport needs?"
❌ "How often do you need rides?"
```

### Option Descriptions
```
✅ "Executives requiring protection matching their status"
✅ "Families requiring comprehensive security coverage"
❌ "Premium transport for executives"
❌ "Family-friendly taxi service"
```

---

## 🚨 ENFORCEMENT & VALIDATION

### Pre-commit Hooks
```bash
# .husky/pre-commit
#!/bin/sh
# Check for forbidden terminology
FORBIDDEN="taxi|cab|ride|driver|passenger|fare|trip|pickup|dropoff|booking"
if grep -r -E "$FORBIDDEN" --include="*.ts" --include="*.tsx" src/; then
  echo "❌ SIA Compliance Error: Forbidden terminology found"
  echo "Check SIA_COMPLIANCE.md for approved terms"
  exit 1
fi
```

### GitHub Actions
```yaml
name: SIA Compliance Check
on: [push, pull_request]
jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check SIA Compliance
        run: |
          # List of forbidden terms
          FORBIDDEN="taxi|cab|ride|driver|passenger|fare|trip|pickup|dropoff"
          if grep -r -E "$FORBIDDEN" --include="*.ts" --include="*.tsx" src/; then
            echo "::error::SIA compliance violation - forbidden terminology found"
            exit 1
          fi
```

---

## ⚖️ LEGAL & REGULATORY NOTES

### Why This Matters
1. **Regulatory Compliance:** Using taxi terminology could trigger PHV licensing requirements
2. **Insurance Validity:** Our insurance covers close protection, not taxi services
3. **Legal Classification:** Misrepresentation could result in:
   - £5,000+ regulatory fines
   - Insurance claim denials
   - License revocation
   - Legal liability

### Key Distinctions

| Close Protection (Our Service) | PHV/Taxi (Not Our Service) |
|--------------------------------|-----------------------------|
| SIA licensed | Local authority licensed |
| Security focus | Transport focus |
| Protection officers | Drivers |
| Threat assessment | Route optimization |
| Principal safety | Passenger convenience |
| Security protocols | Transport efficiency |

---

## 📋 IMPLEMENTATION GUIDE

### For Developers
1. **Before coding:** Read this entire document
2. **During coding:** Reference terminology tables
3. **Before committing:** Run compliance checks
4. **In PR reviews:** Verify language compliance

### For Content Writers
1. **Always emphasize:** Protection and security
2. **Never mention:** Taxis, rides, or transport as primary service
3. **Focus on:** Professional officers and safety
4. **Highlight:** SIA licensing and security credentials

### For Customer Service
1. **Greet as:** "Armora Protection Services"
2. **Refer to:** Protection officers (not drivers)
3. **Discuss:** Security arrangements (not bookings)
4. **Emphasize:** Safety and professionalism

---

## ✅ FINAL COMPLIANCE CHECKLIST

Before ANY release:
- [ ] No taxi/cab/ride terminology in code
- [ ] All "driver" replaced with "protection officer"
- [ ] All "passenger" replaced with "principal"
- [ ] Service described as "protection" not "transport"
- [ ] Pricing shown as "protection fees"
- [ ] Interfaces use security terminology
- [ ] API endpoints use protection/assignment naming
- [ ] UI text emphasizes security over transport
- [ ] Questionnaire uses protection language
- [ ] Status messages use security terms

---

## 📞 COMPLIANCE CONTACTS

**Questions about terminology:** Check this document first
**Unclear cases:** Default to most security-focused option
**Updates needed:** Submit PR with justification

---

**REMEMBER:**
- We PROTECT people during their journeys
- We DON'T just transport them
- Every word must reinforce: **SECURITY FIRST, MOVEMENT SECOND**

---

**END OF SIA_COMPLIANCE.md**