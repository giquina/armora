# ARMORA CPO TRANSFORMATION COORDINATION

**Last Updated:** 2025-01-18 (Instance working on questionnaire & dashboard)

## COMPLETED WORK ✅

### Core Questionnaire System (FULLY TRANSFORMED)
- `/src/data/questionnaireData.ts` - Complete 9-step CPO questionnaire
- All 18 professional security sectors implemented
- Service tier calculation logic (Platinum £150/h, Executive £75/h, Shadow £95/h, Protection £45/h)
- Dynamic pricing modifiers and threat assessment
- Legal confirmations for SIA regulations

### UI Components Updated
- `/src/components/Auth/WelcomePage.tsx` - CPO security messaging
- Features now show: SIA-Licensed Officers, 24/7 Control Room, Executive Protection, etc.

## IN PROGRESS 🔄

### Dashboard Transformation
- **File:** `/src/components/Dashboard/Dashboard.tsx`
- **Status:** Partially updated, needs completion
- **Changes needed:** Service descriptions, button labels, contact info

## PENDING WORK 📋

### Critical Files Needing Transformation
1. **Booking Flow → Security Engagement Flow**
   - `/src/components/Booking/` directory
   - All booking references → security engagement
   - Button labels: "Book Now" → "Request Protection"

2. **Service Data Files**
   - `/src/data/servicesData.ts`
   - `/src/data/standardizedServices.ts`
   - Service descriptions need CPO focus

3. **Context Files**
   - `/src/contexts/AppContext.tsx`
   - `/src/contexts/BookingContext.tsx` → SecurityContext
   - Global state management terms

4. **Achievement System**
   - `/src/components/Achievement/` directory
   - Security-themed achievements

5. **Global Text Replacements**
   - Search for: transport, journey, driver, ride, booking, pickup, dropoff, trip, vehicle, chauffeur, passenger
   - Replace with: protection, security detail, officer/CPO, protection service, security engagement, secure movement, protection assignment, secure vehicle, protection officer, principal/client

## COORDINATION PROTOCOL

### Before Working on Any File:
1. Check this file for current status
2. Update the "IN PROGRESS" section with your file and timestamp
3. Commit changes when complete
4. Update this coordination file

### File Locking System:
```
[INSTANCE_ID] WORKING ON: [FILE_PATH] - Started: [TIMESTAMP]
```

### Current Locks:
- Instance_A: Dashboard transformation (started 2025-01-18)

## KEY TRANSFORMATIONS COMPLETED

### Service Tiers
- **Armora Platinum:** £150/hour + £3/mile (High-profile, armoured vehicles, ex-military CPOs)
- **Armora Executive:** £75/hour + £2/mile (Corporate executives, premium vehicles)
- **Armora Shadow:** £95/hour + £2.50/mile (Entertainment/public figures, covert protection)
- **Armora Protection:** £45/hour + £1.50/mile (Standard CPO services)

### Legal Framework
- All services now under SIA regulations
- Clear disclaimers: "NOT a private hire vehicle service"
- CPOs are "security professionals, not drivers"
- Movement is "incidental to protection duties"

## TESTING REQUIREMENTS

Before completion, ensure:
1. `npm run build` passes without TypeScript errors
2. All button labels updated throughout app
3. SIA licensing references on all pages
4. Security disclaimers prominent
5. No remaining transport/taxi terminology

---

**NEXT INSTANCE:** Please update this file before starting work and coordinate through git commits.