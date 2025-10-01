# PaymentModal Component

A professional slide-up payment modal for the Armora protection booking system. Integrates with Stripe for secure payment processing.

## Features

- **Slide-up animation** from bottom (mobile-first design)
- **Backdrop with blur** for focus
- **Booking summary** with service details, route, time, and pricing
- **Stripe payment integration** with CardElement
- **Save card option** for future bookings
- **Discount display** for registered users with rewards
- **Error handling** with user-friendly messages
- **Responsive design** (mobile, tablet, desktop)
- **Accessibility** with ARIA labels, keyboard support (ESC to close)
- **Professional styling** matching Armora gold theme

## Usage

### Basic Implementation

```tsx
import { useState } from 'react';
import { PaymentModal } from './components/PaymentModal';

function ProtectionRequest() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId);
    setShowPaymentModal(false);
    // Navigate to success page or show confirmation
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Error is already displayed in modal, optionally log or track
  };

  return (
    <>
      <button onClick={handleProceedToPayment}>
        Proceed to Payment
      </button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingSummary={{
          serviceName: 'Executive Protection',
          journeyRoute: 'London Bridge → Heathrow Airport',
          commencementTime: 'Today at 14:30',
          totalPrice: 95.00,
          hasDiscount: true,
          originalPrice: 190.00
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </>
  );
}
```

### Integration with ProtectionRequest Component

```tsx
// In ProtectionRequest.tsx
import { useState } from 'react';
import { PaymentModal } from './components/PaymentModal';

export function ProtectionRequest({ onAssignmentRequested }: ProtectionRequestProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ... existing state ...

  const handleRequestProtection = () => {
    if (!isReadyToRequest || !selectedService) return;

    // Open payment modal instead of directly processing
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // Save assignment data with payment confirmation
    const assignmentData = {
      // ... existing assignment data ...
      paymentIntentId,
      paymentStatus: 'paid',
      paidAmount: finalFee,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('armora_assignment_data', JSON.stringify(assignmentData));
    setShowPaymentModal(false);
    onAssignmentRequested(); // Navigate to success/confirmation view
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // Keep modal open so user can retry
  };

  return (
    <div>
      {/* ... existing booking form ... */}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingSummary={{
          serviceName: selectedService?.name || '',
          journeyRoute: `${pickupLocation} → ${secureDestination}`,
          commencementTime: deploymentInfo || '',
          totalPrice: finalFee,
          hasDiscount: hasDiscount,
          originalPrice: hasDiscount ? originalFee : undefined
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
}
```

## Props

### PaymentModalProps

```typescript
interface PaymentModalProps {
  isOpen: boolean;              // Controls modal visibility
  onClose: () => void;          // Called when user closes modal (backdrop/ESC/Go Back)
  bookingSummary: {
    serviceName: string;        // e.g., "Executive Protection"
    journeyRoute: string;       // e.g., "London → Heathrow"
    commencementTime: string;   // e.g., "Today at 14:30" or "CPO deployment: 2-4 min"
    totalPrice: number;         // Final price in GBP (e.g., 95.00)
    hasDiscount: boolean;       // Whether discount is applied
    originalPrice?: number;     // Original price before discount (if applicable)
  };
  onPaymentSuccess: (paymentIntentId: string) => void;  // Called on successful payment
  onPaymentError: (error: string) => void;              // Called on payment error
}
```

## Styling

The component uses CSS Modules with the Armora design system:

- **Gold theme**: `#c9a961` for primary actions
- **Professional navy**: `#1a2332` for text
- **Smooth animations**: 350ms cubic-bezier transitions
- **Mobile-first**: Responsive breakpoints at 640px, 1024px
- **Safe areas**: Supports iPhone notch and home indicator

### Customization

To customize styles, edit `PaymentModal.module.css`:

```css
/* Example: Change primary button color */
.primaryButton {
  background: linear-gradient(135deg, #your-color 0%, #your-color-dark 100%);
}
```

## Payment Flow

1. User completes all 5 booking steps
2. Clicks "Proceed to Payment" button
3. PaymentModal slides up with booking summary
4. User enters card details via Stripe CardElement
5. Optionally checks "Save card for future bookings"
6. Clicks "Confirm & Pay £XX.XX"
7. Component creates payment intent via Supabase Edge Function
8. Stripe processes payment
9. On success: `onPaymentSuccess` called with payment intent ID
10. On error: Error displayed in modal, user can retry

## Error Handling

The component handles various error scenarios:

- **Authentication errors**: "Authentication required. Please sign in to continue."
- **Card errors**: Stripe-provided error messages (e.g., "Card declined")
- **Network errors**: "Failed to initialize payment. Please try again."
- **Validation errors**: "Please complete your card details"

Errors are displayed inline within the modal with a warning icon and user-friendly message.

## Accessibility

- **ARIA labels**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Keyboard support**: ESC key closes modal
- **Focus management**: Modal traps focus when open
- **Screen reader friendly**: Semantic HTML with proper labels

## Browser Support

- Chrome/Edge (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## Dependencies

- `@stripe/stripe-js`: Stripe SDK
- `@stripe/react-stripe-js`: React Stripe components
- Supabase client for authentication and Edge Functions

## Environment Variables

Required in `.env`:

```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Stripe publishable key
REACT_APP_SUPABASE_URL=https://...            # Supabase project URL
```

## Future Enhancements

- [ ] Apple Pay / Google Pay support (express checkout)
- [ ] Saved payment methods list
- [ ] 3D Secure authentication
- [ ] Payment retry mechanism with exponential backoff
- [ ] Loading skeleton for better UX
- [ ] Analytics tracking for payment events
