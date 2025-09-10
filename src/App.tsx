import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AppLayout } from './components/Layout/AppLayout';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import { WelcomePage } from './components/Auth/WelcomePage';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { GuestDisclaimer } from './components/Auth/GuestDisclaimer';
import { QuestionnaireFlow } from './components/Questionnaire/QuestionnaireFlow';
import AchievementUnlock from './components/Achievement/AchievementUnlock';
import { Dashboard } from './components/Dashboard';
import { SubscriptionOffer } from './components/Subscription/SubscriptionOffer';
import { VehicleSelection, LocationPicker, BookingConfirmation, BookingSuccess } from './components/Booking';
import { ServiceLevel, BookingData, LocationData } from './types';
import './styles/globals.css';

function BookingFlow() {
  const { state } = useApp();
  const [currentStep, setCurrentStep] = useState<'vehicle-selection' | 'location-picker' | 'booking-confirmation' | 'booking-success'>('vehicle-selection');
  const [selectedService, setSelectedService] = useState<ServiceLevel | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingId, setBookingId] = useState<string>('');

  const handleServiceSelected = (service: ServiceLevel) => {
    setSelectedService(service);
    setCurrentStep('location-picker');
  };

  const handleLocationConfirmed = (locationData: LocationData & { estimatedCost: number }) => {
    if (selectedService) {
      const bookingInfo: BookingData = {
        service: selectedService,
        pickup: locationData.pickup,
        destination: locationData.destination,
        estimatedDistance: locationData.estimatedDistance ?? 0,
        estimatedDuration: locationData.estimatedDuration ?? 0,
        estimatedCost: locationData.estimatedCost,
        user: state.user,
      };
      setBookingData(bookingInfo);
      setCurrentStep('booking-confirmation');
    }
  };

  const handleBookingConfirmed = (confirmedBookingId: string) => {
    setBookingId(confirmedBookingId);
    setCurrentStep('booking-success');
  };

  const handleBackToVehicleSelection = () => {
    setCurrentStep('vehicle-selection');
    setSelectedService(null);
  };

  const handleBackToLocationPicker = () => {
    setCurrentStep('location-picker');
  };

  switch (currentStep) {
    case 'vehicle-selection':
      return (
        <VehicleSelection
          user={state.user}
          onServiceSelected={handleServiceSelected}
        />
      );
    case 'location-picker':
      return selectedService ? (
        <LocationPicker
          selectedService={selectedService}
          onLocationConfirmed={handleLocationConfirmed}
          onBack={handleBackToVehicleSelection}
          user={state.user}
        />
      ) : null;
    case 'booking-confirmation':
      return bookingData ? (
        <BookingConfirmation
          bookingData={bookingData}
          onConfirmBooking={handleBookingConfirmed}
          onBack={handleBackToLocationPicker}
        />
      ) : null;
    case 'booking-success':
      return <BookingSuccess bookingId={bookingId} />;
    default:
      return (
        <VehicleSelection
          user={state.user}
          onServiceSelected={handleServiceSelected}
        />
      );
  }
}

function Profile() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Profile</h2>
      <p>User profile and settings coming soon...</p>
    </div>
  );
}

function AppRouter() {
  const { state, navigateToView } = useApp();
  const { currentView, user, questionnaireData } = state;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'splash':
        return <SplashScreen />;
      case 'welcome':
        return <WelcomePage />;
      case 'login':
        return <LoginForm />;
      case 'signup':
        return <SignupForm />;
      case 'guest-disclaimer':
        return <GuestDisclaimer />;
      case 'questionnaire':
        return <QuestionnaireFlow />;
      case 'achievement':
        return (
          <AchievementUnlock
            userType={user?.userType || 'guest'}
            completedQuestionnaire={questionnaireData || undefined}
            onContinueToDashboard={() => navigateToView('dashboard')}
            onCreateAccountUpgrade={() => navigateToView('signup')}
          />
        );
      case 'dashboard':
        return <Dashboard />;
      case 'subscription-offer':
        // Get selected service data from localStorage for pricing
        const selectedServiceId = localStorage.getItem('armora_selected_service');
        const servicePrice = selectedServiceId === 'standard' ? 45 : selectedServiceId === 'executive' ? 75 : selectedServiceId === 'shadow' ? 65 : 45;
        return <SubscriptionOffer selectedService={selectedServiceId || undefined} servicePrice={servicePrice} />;
      case 'booking':
        return <BookingFlow />;
      case 'profile':
        return <Profile />;
      default:
        return <SplashScreen />;
    }
  };

  // Don't wrap authentication screens, questionnaire, and achievement in AppLayout (they're full-screen)
  if (['splash', 'welcome', 'login', 'signup', 'guest-disclaimer', 'questionnaire', 'achievement'].includes(currentView)) {
    return renderCurrentView();
  }

  return (
    <AppLayout>
      {renderCurrentView()}
    </AppLayout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;