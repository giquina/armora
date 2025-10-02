# BookingSummary Component

## Overview
Transparent pricing breakdown component for the Principal App that displays fair marketplace pricing for protection services. Shows detailed fee breakdown including what the client pays and what the CPO receives.

## Features
- ✅ Calls `calculate-marketplace-fees` Edge Function for real-time pricing
- ✅ Shows transparent breakdown: Base Rate + Service Fee (20%) = Total
- ✅ Displays CPO earnings (85% of base rate)
- ✅ Explains platform fee (35% of base rate) for infrastructure and insurance
- ✅ Fallback to local calculation if Edge Function is unavailable
- ✅ Loading skeleton for better UX
- ✅ Responsive mobile-first design
- ✅ Dark mode support

## Usage

```tsx
import { BookingSummary } from '../components/BookingSummary';
import { ProtectionAssignmentData } from '../types';

function PaymentView({ protectionAssignmentData }: { protectionAssignmentData: ProtectionAssignmentData }) {
  return (
    <div>
      <h2>Review Your Booking</h2>
      <BookingSummary
        protectionAssignmentData={protectionAssignmentData}
        loading={false}
      />
      {/* Payment form, etc. */}
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `protectionAssignmentData` | `ProtectionAssignmentData` | Yes | Full booking data including service, cost, duration |
| `loading` | `boolean` | No | Show loading skeleton (default: false) |

## Pricing Model

The component displays Armora's transparent marketplace pricing:

1. **Base Rate**: Hourly rate for protection service (e.g., £65/hr for Essential)
2. **Service Fee (20%)**: Marketplace fee added to client's total
3. **Total**: What the Principal pays (Base Rate × 1.20)
4. **CPO Receives**: 85% of base rate
5. **Platform Fee**: 35% of base rate (for infrastructure, insurance, 24/7 support)

### Example Calculation
- Base Rate: £65/hr × 2 hours = £130
- Client Pays: £130 × 1.20 = £156 (Total)
- CPO Receives: £130 × 0.85 = £110.50
- Platform Fee: £130 × 0.35 = £45.50

Note: Client pays £156, but the breakdown shows £130 base + £26 service fee = £156 total.

## Edge Function Integration

Calls `/functions/v1/calculate-marketplace-fees` with:
```json
{
  "baseRate": 65,
  "hours": 2.0,
  "protectionLevel": "essential"
}
```

Returns:
```json
{
  "baseRate": 65,
  "hours": 2.0,
  "subtotal": 130,
  "clientPays": 156,
  "platformFee": 45.5,
  "cpoReceives": 110.5,
  "breakdown": {
    "clientMarkup": 0.20,
    "platformFeePercentage": 0.35,
    "cpoPercentage": 0.85
  }
}
```

## Styling

Uses CSS Modules with the following key classes:
- `.container` - Main wrapper with card styling
- `.breakdown` - Fee breakdown section
- `.cpoNote` - CPO earnings highlight box
- `.transparencyNote` - Commitment statement box

Follows Armora design system:
- Color variables from `/src/styles/variables.css`
- Mobile-first responsive design (320px+)
- 44px+ touch targets on mobile
- Dark mode support via media queries

## Integration Points

### Current Implementation
This component is standalone and ready for integration.

### Recommended Integration
Replace existing price breakdowns in:
1. `/src/components/ProtectionAssignment/PaymentIntegration.tsx` (lines 272-297)
2. `/src/components/ProtectionAssignment/WhereWhenView.tsx` (line 337)

### Example Integration in PaymentIntegration.tsx
```tsx
import { BookingSummary } from '../BookingSummary';

// Replace the existing price breakdown section (lines 268-340) with:
<BookingSummary
  protectionAssignmentData={protectionAssignmentData}
  loading={false}
/>
```

## Testing

### Manual Testing Checklist
- [ ] Loads successfully with valid data
- [ ] Shows loading skeleton when `loading={true}`
- [ ] Calls Edge Function and displays correct breakdown
- [ ] Falls back to local calculation if Edge Function fails
- [ ] Displays error banner when using fallback
- [ ] Calculates correct totals for all service levels
- [ ] Responsive on mobile (320px - 768px)
- [ ] Responsive on tablet (768px - 1024px)
- [ ] Dark mode styling works correctly

### Edge Cases
- [ ] Zero duration assignments
- [ ] Very long duration assignments (>24 hours)
- [ ] Edge Function timeout/error
- [ ] Missing environment variables
- [ ] Invalid service level

## Future Enhancements
- [ ] Add unit tests with Jest
- [ ] Add E2E tests with Playwright
- [ ] Support for multiple CPOs (team bookings)
- [ ] Support for recurring assignments
- [ ] Discount codes integration
- [ ] Corporate billing adjustments

## Related Files
- `/workspaces/armora/src/components/BookingSummary/BookingSummary.tsx` - Main component
- `/workspaces/armora/src/components/BookingSummary/BookingSummary.module.css` - Styles
- `/workspaces/armora/supabase/functions/calculate-marketplace-fees/index.ts` - Edge Function
- `/workspaces/armora/src/types/index.ts` - TypeScript types

## Support
For questions or issues, see:
- Project documentation: `/workspaces/armora/CLAUDE.md`
- SIA compliance guidelines: `/workspaces/armora/SIA_COMPLIANCE.md`
