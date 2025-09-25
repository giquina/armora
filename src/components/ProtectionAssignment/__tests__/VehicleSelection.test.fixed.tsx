import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleSelection } from '../VehicleSelection';
import { ServiceLevel, User } from '../../types';
import { AppProvider } from '../../contexts/AppContext';

const mockRegisteredUser: User = {
  id: 'user123',
  email: 'test@example.com',
  name: 'Test User',
  isAuthenticated: true,
  userType: 'registered',
  hasCompletedQuestionnaire: true,
  hasUnlockedReward: true
};

const mockGuestUser: User = {
  email: 'guest@example.com',
  isAuthenticated: false,
  userType: 'guest',
  hasCompletedQuestionnaire: false,
  hasUnlockedReward: false
};

const mockGoogleUser: User = {
  id: 'google123',
  email: 'google@example.com',
  name: 'Google User',
  isAuthenticated: true,
  userType: 'google',
  hasCompletedQuestionnaire: true,
  hasUnlockedReward: true
};

// Custom render with AppProvider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <AppProvider>
      {ui}
    </AppProvider>
  );
};

describe('VehicleSelection Component', () => {
  let mockOnServiceSelected: jest.Mock;
  let mockOnBack: jest.Mock;

  beforeEach(() => {
    mockOnServiceSelected = jest.fn();
    mockOnBack = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render all service levels', () => {
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={mockOnServiceSelected}
        />
      );

      expect(screen.getByText('Armora Essential')).toBeInTheDocument();
      expect(screen.getByText('Armora Executive')).toBeInTheDocument();
      expect(screen.getByText('Armora Shadow')).toBeInTheDocument();
    });

    test('should display service pricing correctly', () => {
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={mockOnServiceSelected}
        />
      );

      expect(screen.getByText('£50')).toBeInTheDocument(); // Essential
      expect(screen.getByText('£75')).toBeInTheDocument(); // Executive
      expect(screen.getByText('£65')).toBeInTheDocument(); // Shadow
    });

    test('should show service features and descriptions', () => {
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={mockOnServiceSelected}
        />
      );

      // Essential service features
      expect(screen.getByText('Professional Security Transport')).toBeInTheDocument();
      expect(screen.getByText('Certified security professional')).toBeInTheDocument();
      expect(screen.getByText('Advanced vehicle protection')).toBeInTheDocument();

      // Executive service features
      expect(screen.getByText('Elite security specialist')).toBeInTheDocument();
      expect(screen.getByText('Premium reinforced vehicle')).toBeInTheDocument();

      // Shadow service features
      expect(screen.getByText('Discrete protection service')).toBeInTheDocument();
      expect(screen.getByText('Personal security escort')).toBeInTheDocument();
    });
  });

  describe('User Type Behavior', () => {
    test('should show rewards for registered users', async () => {
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={mockOnServiceSelected}
        />
      );

      // Check for reward banner
      expect(screen.getByText(/50% off your first Assignment - reward applied!/i)).toBeInTheDocument();

      // Select a service to see the Book Now button
      const standardCard = screen.getByTestId('service-standard');
      await userEvent.click(standardCard);

      expect(screen.getByText(/book now/i)).toBeInTheDocument();
    });

    test('should show quote-only mode for guest users', async () => {
      renderWithProvider(
        <VehicleSelection
          user={mockGuestUser}
          onServiceSelected={mockOnServiceSelected}
        />
      );

      // Select a service to see the Get Quote button
      const standardCard = screen.getByTestId('service-standard');
      await userEvent.click(standardCard);

      expect(screen.getByText(/get quote/i)).toBeInTheDocument();
      expect(screen.queryByText(/50% rewards/i)).not.toBeInTheDocument();
    });
  });

  describe('Service Selection Interactions', () => {
    test('should call onServiceSelected when Essential service is clicked', async () => {
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={mockOnServiceSelected}
        />
      );

      const standardCard = screen.getByTestId('service-standard');
      await userEvent.click(standardCard);

      expect(mockOnServiceSelected).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'standard',
          name: 'Armora Essential',
          hourlyRate: 45
        })
      );
    });

    test('should handle keyboard navigation', async () => {
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={mockOnServiceSelected}
        />
      );

      const standardCard = screen.getByTestId('service-standard');
      standardCard.focus();
      
      fireEvent.keyDown(standardCard, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnServiceSelected).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'standard' })
      );
    });
  });

  describe('Navigation', () => {
    test('should call onBack when back button is clicked', async () => {
      renderWithProvider(
        <VehicleSelection
          user={mockRegisteredUser}
          onServiceSelected={mockOnServiceSelected}
          onBack={mockOnBack}
        />
      );

      const backButton = screen.getByRole('button', { name: /back/i });
      await userEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });
  });
});