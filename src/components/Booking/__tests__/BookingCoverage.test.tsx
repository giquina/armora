import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleSelection } from '../VehicleSelection';
import { LocationPicker } from '../LocationPicker';
import { BookingConfirmation } from '../BookingConfirmation';
import { BookingSuccess } from '../BookingSuccess';
import { AppProvider } from '../../../contexts/AppContext';
import { ServiceLevel, User, BookingData } from '../../../types';

// Mock data
const mockServices: ServiceLevel[] = [
  {
    id: 'standard',
    name: 'Armora Essential',
    tagline: 'Professional Security Transport',
    price: '£45',
    hourlyRate: 45,
    description: 'Professional security officers provide safe, reliable transport.',
    features: ['Certified security professional', 'Advanced vehicle protection'],
    socialProof: { assignmentsCompleted: 2847 }
  },
  {
    id: 'executive',
    name: 'Armora Executive',
    tagline: 'Premium VIP Protection',
    price: '£75',
    hourlyRate: 75,
    description: 'Executive-level security with premium transport.',
    features: ['Elite security detail', 'Premium reinforced vehicle'],
    isPopular: true,
    socialProof: { assignmentsCompleted: 1847, selectionRate: 67 }
  },
  {
    id: 'shadow',
    name: 'Armora Shadow',
    tagline: 'Discreet Protection',
    price: '£65',
    hourlyRate: 65,
    description: 'Discreet, low-profile security transport.',
    features: ['Discreet security officers', 'Unmarked vehicles'],
    socialProof: { assignmentsCompleted: 1547 }
  }
];

const mockUsers = {
  registered: {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    isAuthenticated: true,
    userType: 'registered' as const,
    hasCompletedQuestionnaire: true,
    hasUnlockedReward: true
  },
  guest: {
    email: 'guest@example.com',
    isAuthenticated: false,
    userType: 'guest' as const,
    hasCompletedQuestionnaire: false,
    hasUnlockedReward: false
  },
  google: {
    id: 'google123',
    email: 'google@example.com',
    name: 'Google User',
    isAuthenticated: true,
    userType: 'google' as const,
    hasCompletedQuestionnaire: true,
    hasUnlockedReward: true
  }
};

const mockBookingData: BookingData = {
  service: mockServices[0],
  Commencement Point: '123 Test Street, London',
  secureDestination: '456 Demo Avenue, London',
  estimatedDistance: 15,
  estimatedDuration: 35,
  estimatedCost: 26.25,
  user: mockUsers.registered
};

// Mock clipboard and geolocation
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: jest.fn(() => Promise.resolve()) },
  writable: true
});

Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn()
  },
  writable: true
});

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('Booking Components Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('VehicleSelection Coverage', () => {
    test('should handle service selection with all service types', async () => {
      const onServiceSelected = jest.fn();
      
      renderWithProvider(
        <VehicleSelection
          user={mockUsers.registered}
          onServiceSelected={onServiceSelected}
        />
      );

      // Test all service selections
      for (const service of mockServices) {
        const serviceCard = screen.getByTestId(`service-${service.id}`);
        await userEvent.click(serviceCard);
        expect(onServiceSelected).toHaveBeenCalledWith(
          expect.objectContaining({ id: service.id })
        );
        onServiceSelected.mockClear();
      }
    });

    test('should handle different user types correctly', () => {
      // Test registered user
      const { rerender } = renderWithProvider(
        <VehicleSelection
          user={mockUsers.registered}
          onServiceSelected={jest.fn()}
        />
      );
      expect(screen.getByText(/book now/i)).toBeInTheDocument();

      // Test guest user
      rerender(
        <AppProvider>
          <VehicleSelection
            user={mockUsers.guest}
            onServiceSelected={jest.fn()}
          />
        </AppProvider>
      );
      expect(screen.getByText(/get quote/i)).toBeInTheDocument();

      // Test Google user
      rerender(
        <AppProvider>
          <VehicleSelection
            user={mockUsers.google}
            onServiceSelected={jest.fn()}
          />
        </AppProvider>
      );
      expect(screen.getByText(/book now/i)).toBeInTheDocument();

      // Test null user
      rerender(
        <AppProvider>
          <VehicleSelection
            user={null}
            onServiceSelected={jest.fn()}
          />
        </AppProvider>
      );
      expect(screen.getByText(/get quote/i)).toBeInTheDocument();
    });

    test('should handle back navigation', async () => {
      const onBack = jest.fn();
      
      renderWithProvider(
        <VehicleSelection
          user={mockUsers.registered}
          onServiceSelected={jest.fn()}
          onBack={onBack}
        />
      );

      const backButton = screen.getByRole('button', { name: /back/i });
      await userEvent.click(backButton);
      expect(onBack).toHaveBeenCalled();
    });

    test('should display popular service badge', () => {
      renderWithProvider(
        <VehicleSelection
          user={mockUsers.registered}
          onServiceSelected={jest.fn()}
        />
      );

      expect(screen.getByText(/most popular/i)).toBeInTheDocument();
    });
  });

  describe('LocationPicker Coverage', () => {
    test('should handle location input and validation', async () => {
      const onLocationConfirmed = jest.fn();
      
      renderWithProvider(
        <LocationPicker
          selectedService={mockServices[0]}
          onLocationConfirmed={onLocationConfirmed}
          onBack={jest.fn()}
          user={mockUsers.registered}
        />
      );

      const commencementPointInput = screen.getByLabelText(/Commencement Point location/i);
      const destinationInput = screen.getByLabelText(/destination/i);
      const confirmButton = screen.getByRole('button', { name: /confirm location/i });

      // Test empty form validation
      await userEvent.click(confirmButton);
      expect(screen.getByText(/Commencement Point location is required/i)).toBeInTheDocument();
      expect(screen.getByText(/secureDestination is required/i)).toBeInTheDocument();

      // Test partial form validation
      await userEvent.type(commencementPointInput, 'Test Commencement Point');
      await userEvent.click(confirmButton);
      expect(screen.getByText(/secureDestination is required/i)).toBeInTheDocument();

      // Test complete form
      await userEvent.type(secureDestinationInput, 'Test destination');
      
      // Wait for estimate calculation
      await waitFor(() => {
        expect(screen.getByText(/estimated cost/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      await userEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(onLocationConfirmed).toHaveBeenCalledWith(
          expect.objectContaining({
            Commencement Point: 'Test Commencement Point',
            secureDestination: 'Test destination',
            estimatedCost: expect.any(Number)
          })
        );
      });
    });

    test('should handle geolocation functionality', async () => {
      const mockGetCurrentPosition = navigator.geolocation.getCurrentPosition as jest.Mock;
      
      renderWithProvider(
        <LocationPicker
          selectedService={mockServices[0]}
          onLocationConfirmed={jest.fn()}
          onBack={jest.fn()}
          user={mockUsers.registered}
        />
      );

      // Test successful geolocation
      mockGetCurrentPosition.mockImplementation((success) => {
        success({
          coords: { latitude: 51.5074, longitude: -0.1278, accuracy: 10 }
        });
      });

      const useLocationButton = screen.getByRole('button', { name: /use current location/i });
      await userEvent.click(useLocationButton);
      
      expect(mockGetCurrentPosition).toHaveBeenCalled();

      // Test geolocation error
      mockGetCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, message: 'Permission denied' });
      });

      await userEvent.click(useLocationButton);
      
      await waitFor(() => {
        expect(screen.getByText(/location access denied/i)).toBeInTheDocument();
      });
    });

    test('should clear input fields', async () => {
      renderWithProvider(
        <LocationPicker
          selectedService={mockServices[0]}
          onLocationConfirmed={jest.fn()}
          onBack={jest.fn()}
          user={mockUsers.registered}
        />
      );

      const commencementPointInput = screen.getByLabelText(/Commencement Point location/i);
      await userEvent.type(commencementPointInput, 'Test location');
      
      const clearButton = screen.getByRole('button', { name: /clear Commencement Point/i });
      await userEvent.click(clearButton);
      
      expect(commencementPointInput).toHaveValue('');
    });

    test('should handle different service levels for cost calculation', async () => {
      const { rerender } = renderWithProvider(
        <LocationPicker
          selectedService={mockServices[0]} // Essential
          onLocationConfirmed={jest.fn()}
          onBack={jest.fn()}
          user={mockUsers.registered}
        />
      );

      const commencementPointInput = screen.getByLabelText(/Commencement Point location/i);
      const destinationInput = screen.getByLabelText(/destination/i);

      await userEvent.type(commencementPointInput, 'Test Commencement Point');
      await userEvent.type(secureDestinationInput, 'Test destination');

      await waitFor(() => {
        expect(screen.getByText(/estimated cost/i)).toBeInTheDocument();
      });

      // Test Executive service (higher cost)
      rerender(
        <AppProvider>
          <LocationPicker
            selectedService={mockServices[1]} // Executive
            onLocationConfirmed={jest.fn()}
            onBack={jest.fn()}
            user={mockUsers.registered}
          />
        </AppProvider>
      );

      // Clear and re-enter to trigger calculation
      await userEvent.clear(commencementPointInput);
      await userEvent.clear(secureDestinationInput);
      await userEvent.type(commencementPointInput, 'Test Commencement Point');
      await userEvent.type(secureDestinationInput, 'Test destination');

      await waitFor(() => {
        expect(screen.getByText(/estimated cost/i)).toBeInTheDocument();
      });
    });
  });

  describe('BookingConfirmation Coverage', () => {
    test('should handle terms acceptance and booking confirmation', async () => {
      const onConfirmBooking = jest.fn().mockResolvedValue('TEST123');
      
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={onConfirmBooking}
          onBack={jest.fn()}
        />
      );

      const termsCheckbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
      const confirmButton = screen.getByRole('button', { name: /confirm booking/i });

      // Button should be disabled initially
      expect(confirmButton).toBeDisabled();

      // Accept terms
      await userEvent.click(termsCheckbox);
      expect(confirmButton).toBeEnabled();

      // Confirm booking
      await userEvent.click(confirmButton);
      expect(onConfirmBooking).toHaveBeenCalled();
    });

    test('should handle additional requirements', async () => {
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      const requirementsField = screen.getByLabelText(/additional requirements/i);
      await userEvent.type(requirementsField, 'Special instructions');
      
      expect(requirementsField).toHaveValue('Special instructions');
    });

    test('should show reward discount for eligible users', () => {
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      expect(screen.getByText(/50% reward applied/i)).toBeInTheDocument();
    });

    test('should handle guest user booking', () => {
      const guestBookingData = {
        ...mockBookingData,
        user: mockUsers.guest
      };

      renderWithProvider(
        <BookingConfirmation
          bookingData={guestBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      expect(screen.getByText(/quote only/i)).toBeInTheDocument();
    });

    test('should handle booking errors', async () => {
      const onConfirmBooking = jest.fn().mockRejectedValue(new Error('Payment failed'));
      
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={onConfirmBooking}
          onBack={jest.fn()}
        />
      );

      const termsCheckbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
      const confirmButton = screen.getByRole('button', { name: /confirm booking/i });

      await userEvent.click(termsCheckbox);
      await userEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/booking failed/i)).toBeInTheDocument();
      });
    });

    test('should handle loading state', async () => {
      const slowBooking = jest.fn(() => new Promise(resolve => 
        setTimeout(() => resolve('TEST123'), 1000)
      ));
      
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={slowBooking}
          onBack={jest.fn()}
        />
      );

      const termsCheckbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
      const confirmButton = screen.getByRole('button', { name: /confirm booking/i });

      await userEvent.click(termsCheckbox);
      await userEvent.click(confirmButton);

      expect(screen.getByText(/processing/i)).toBeInTheDocument();
      expect(confirmButton).toBeDisabled();
    });
  });

  describe('BookingSuccess Coverage', () => {
    test('should display booking information correctly', () => {
      renderWithProvider(<BookingSuccess bookingId="TEST123" />);

      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
      expect(screen.getByText('TEST123')).toBeInTheDocument();
    });

    test('should handle copy booking ID functionality', async () => {
      const mockWriteText = navigator.clipboard.writeText as jest.Mock;
      
      renderWithProvider(<BookingSuccess bookingId="COPY123" />);

      const copyButton = screen.getByRole('button', { name: /copy booking id/i });
      await userEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledWith('COPY123');
    });

    test('should handle clipboard copy failure', async () => {
      const mockWriteText = navigator.clipboard.writeText as jest.Mock;
      mockWriteText.mockRejectedValue(new Error('Clipboard access denied'));
      
      renderWithProvider(<BookingSuccess bookingId="FAIL123" />);

      const copyButton = screen.getByRole('button', { name: /copy booking id/i });
      await userEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/unable to copy/i)).toBeInTheDocument();
      });
    });

    test('should handle navigation actions', async () => {
      renderWithProvider(<BookingSuccess bookingId="NAV123" />);

      const trackButton = screen.getByRole('button', { name: /track booking/i });
      const bookAnotherButton = screen.getByRole('button', { name: /book another Protection Detail/i });
      const dashboardButton = screen.getByRole('button', { name: /view dashboard/i });

      expect(trackButton).toBeInTheDocument();
      expect(bookAnotherButton).toBeInTheDocument();
      expect(dashboardButton).toBeInTheDocument();

      // Test navigation clicks
      await userEvent.click(trackButton);
      await userEvent.click(bookAnotherButton);
      await userEvent.click(dashboardButton);
    });

    test('should handle share functionality', async () => {
      const mockShare = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', { value: mockShare, writable: true });
      
      renderWithProvider(<BookingSuccess bookingId="SHARE123" />);

      const shareButton = screen.getByRole('button', { name: /share booking/i });
      await userEvent.click(shareButton);

      expect(mockShare).toHaveBeenCalledWith({
        title: 'Armora Security Transport - Booking Confirmed',
        text: 'My Armora security transport booking is confirmed. Reference: SHARE123',
        url: window.location.href
      });
    });

    test('should handle different booking ID formats', () => {
      // Test empty booking ID
      const { rerender } = renderWithProvider(<BookingSuccess bookingId="" />);
      expect(screen.getByText(/reference unavailable/i)).toBeInTheDocument();

      // Test long booking ID
      rerender(<AppProvider><BookingSuccess bookingId="VERY-LONG-BOOKING-ID-123456789" /></AppProvider>);
      expect(screen.getByText('VERY-LONG-BOOKING-ID-123456789')).toBeInTheDocument();
    });
  });

  describe('Integration and Error Handling', () => {
    test('should handle missing data gracefully', () => {
      const incompleteBookingData = {
        ...mockBookingData,
        Commencement Point: '',
        secureDestination: '',
        service: undefined as any
      };

      expect(() => {
        renderWithProvider(
          <BookingConfirmation
            bookingData={incompleteBookingData}
            onConfirmBooking={jest.fn()}
            onBack={jest.fn()}
          />
        );
      }).not.toThrow();
    });

    test('should handle network timeouts', async () => {
      const timeoutError = jest.fn().mockRejectedValue(new Error('Network timeout'));
      
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={timeoutError}
          onBack={jest.fn()}
        />
      );

      const termsCheckbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
      const confirmButton = screen.getByRole('button', { name: /confirm booking/i });

      await userEvent.click(termsCheckbox);
      await userEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/network timeout/i)).toBeInTheDocument();
      });
    });

    test('should handle rapid user interactions', async () => {
      const onServiceSelected = jest.fn();
      
      renderWithProvider(
        <VehicleSelection
          user={mockUsers.registered}
          onServiceSelected={onServiceSelected}
        />
      );

      const standardCard = screen.getByTestId('service-standard');
      
      // Rapid clicks
      await userEvent.click(standardCard);
      await userEvent.click(standardCard);
      await userEvent.click(standardCard);

      // Should handle gracefully
      expect(onServiceSelected).toHaveBeenCalledTimes(3);
    });
  });
});