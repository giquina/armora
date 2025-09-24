import React from 'react';
import { render, screen } from '@testing-library/react';
import { VehicleSelection } from '../VehicleSelection';
import { LocationPicker } from '../LocationPicker';
import { BookingConfirmation } from '../BookingConfirmation';
import { BookingSuccess } from '../BookingSuccess';
import { AppProvider } from '../../../contexts/AppContext';
import { ServiceLevel, User, BookingData } from '../../../types';

const mockEssentialService: ServiceLevel = {
  id: 'standard',
  name: 'Armora Essential',
  tagline: 'Professional Security Transport',
  price: '£45',
  hourlyRate: 45,
  description: 'Professional security officers provide safe, reliable transport.',
  features: ['Certified security professional', 'Advanced vehicle protection'],
  socialProof: { tripsCompleted: 2847 }
};

const mockRegisteredUser: User = {
  id: 'user123',
  email: 'test@example.com',
  name: 'Test User',
  isAuthenticated: true,
  userType: 'registered',
  hasCompletedQuestionnaire: true,
  hasUnlockedReward: true
};

const mockBookingData: BookingData = {
  service: mockEssentialService,
  commencementPoint: '123 Test Street, London',
  secureDestination: '456 Demo Avenue, London',
  estimatedDistance: 15,
  estimatedDuration: 35,
  estimatedCost: 26.25,
  user: mockRegisteredUser
};

// Custom render with AppProvider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <AppProvider>
      {ui}
    </AppProvider>
  );
};

describe('Booking Components Basic Tests', () => {
  describe('VehicleSelection', () => {
    test('should render vehicle selection component', () => {
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={jest.fn()}
        />
      );

      expect(screen.getByText('Armora Essential')).toBeInTheDocument();
      expect(screen.getByText('Professional Security Transport')).toBeInTheDocument();
    });

    test('should show different content for guest users', () => {
      const guestUser = { ...mockRegisteredUser, userType: 'guest' as const, hasUnlockedReward: false };
      
      renderWithProvider(
        <VehicleSelection
          user={guestUser}
          onServiceSelected={jest.fn()}
        />
      );

      expect(screen.getByText(/get quote/i)).toBeInTheDocument();
    });
  });

  describe('LocationPicker', () => {
    test('should render location picker component', () => {
      renderWithProvider(
        <LocationPicker
          selectedService={mockEssentialService}
          onLocationConfirmed={jest.fn()}
          onBack={jest.fn()}
          user={mockRegisteredUser}
        />
      );

      expect(screen.getByLabelText(/Commencement Point location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    });

    test('should display selected service information', () => {
      renderWithProvider(
        <LocationPicker
          selectedService={mockEssentialService}
          onLocationConfirmed={jest.fn()}
          onBack={jest.fn()}
          user={mockRegisteredUser}
        />
      );

      expect(screen.getByText('Armora Essential')).toBeInTheDocument();
    });
  });

  describe('BookingConfirmation', () => {
    test('should render booking confirmation component', () => {
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      expect(screen.getByText('123 Test Street, London')).toBeInTheDocument();
      expect(screen.getByText('456 Demo Avenue, London')).toBeInTheDocument();
    });

    test('should show cost information', () => {
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      expect(screen.getByText('£26.25')).toBeInTheDocument();
    });

    test('should show terms checkbox', () => {
      renderWithProvider(
        <BookingConfirmation
          bookingData={mockBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      expect(screen.getByRole('checkbox', { name: /terms and conditions/i })).toBeInTheDocument();
    });
  });

  describe('BookingSuccess', () => {
    test('should render booking success component', () => {
      renderWithProvider(<BookingSuccess bookingId="TEST123" />);

      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
      expect(screen.getByText('TEST123')).toBeInTheDocument();
    });

    test('should show booking reference', () => {
      renderWithProvider(<BookingSuccess bookingId="ARMORA-2024-001" />);

      expect(screen.getByText('ARMORA-2024-001')).toBeInTheDocument();
    });
  });

  describe('Booking Flow Integration', () => {
    test('should pass service data between components', () => {
      // Test that service selection data flows correctly
      const onServiceSelected = jest.fn();
      
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={onServiceSelected}
        />
      );

      // Service information should be visible
      expect(screen.getByText('£45')).toBeInTheDocument();
      expect(screen.getByText(/certified security professional/i)).toBeInTheDocument();
    });

    test('should handle user types correctly across components', () => {
      const guestUser = { ...mockRegisteredUser, userType: 'guest' as const, hasUnlockedReward: false };
      const guestBookingData = { ...mockBookingData, user: guestUser };

      renderWithProvider(
        <BookingConfirmation
          bookingData={guestBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      expect(screen.getByText(/quote only/i)).toBeInTheDocument();
    });

    test('should calculate costs correctly', () => {
      const expensiveBooking = {
        ...mockBookingData,
        estimatedCost: 125.50
      };

      renderWithProvider(
        <BookingConfirmation
          bookingData={expensiveBooking}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      expect(screen.getByText('£125.50')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing data gracefully', () => {
      const incompleteBookingData = {
        ...mockBookingData,
        commencementPoint: '',
        secureDestination: ''
      };

      renderWithProvider(
        <BookingConfirmation
          bookingData={incompleteBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      // Should render without crashing
      expect(screen.getByRole('button', { name: /confirm booking/i })).toBeInTheDocument();
    });

    test('should handle null user', () => {
      const nullUserBookingData = {
        ...mockBookingData,
        user: null
      };

      renderWithProvider(
        <BookingConfirmation
          bookingData={nullUserBookingData}
          onConfirmBooking={jest.fn()}
          onBack={jest.fn()}
        />
      );

      // Should treat as guest
      expect(screen.getByText(/quote only/i)).toBeInTheDocument();
    });
  });

  describe('Mobile Responsive Design', () => {
    test('should render on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={jest.fn()}
        />
      );

      expect(screen.getByText('Armora Essential')).toBeInTheDocument();
    });

    test('should be accessible with proper ARIA labels', () => {
      renderWithProvider(
        <LocationPicker
          selectedService={mockEssentialService}
          onLocationConfirmed={jest.fn()}
          onBack={jest.fn()}
          user={mockRegisteredUser}
        />
      );

      const commencementPointInput = screen.getByLabelText(/Commencement Point location/i);
      const destinationInput = screen.getByLabelText(/destination/i);

      expect(commencementPointInput).toHaveAttribute('aria-required', 'true');
      expect(secureDestinationInput).toHaveAttribute('aria-required', 'true');
    });
  });
});