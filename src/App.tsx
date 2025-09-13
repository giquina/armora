import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AppLayout } from './components/Layout/AppLayout';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import { WelcomePage } from './components/Auth/WelcomePage';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { GuestDisclaimer } from './components/Auth/GuestDisclaimer';
import { QuestionnaireFlow } from './components/Questionnaire/QuestionnaireFlow';
import AchievementUnlock from './components/Achievement/AchievementUnlock';
import AchievementBanner from './components/Achievement/AchievementBanner';
import { Dashboard } from './components/Dashboard';
import { SubscriptionOffer } from './components/Subscription/SubscriptionOffer';
import { VehicleSelection, LocationPicker, BookingConfirmation, BookingSuccess } from './components/Booking';
import { BookingErrorBoundary } from './components/Booking/BookingErrorBoundary';
import { ServiceLevel, BookingData, LocationData } from './types';
import './styles/globals.css';

// Development tools for testing user scenarios
if (process.env.NODE_ENV === 'development') {
  import('./utils/testUserScenarios');
}

function BookingFlow() {
  const { state } = useApp();
  const [currentStep, setCurrentStep] = useState<'vehicle-selection' | 'location-picker' | 'booking-confirmation' | 'booking-success'>('vehicle-selection');
  const [selectedService, setSelectedService] = useState<ServiceLevel | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingId, setBookingId] = useState<string>('');

  // Preserve booking state in localStorage for error recovery
  const preserveBookingState = () => {
    const stateToPreserve = {
      currentStep,
      selectedService,
      bookingData,
      bookingId,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('armora_booking_state', JSON.stringify(stateToPreserve));
  };

  // Recover booking state from localStorage
  const recoverBookingState = () => {
    try {
      const preserved = localStorage.getItem('armora_booking_state');
      if (preserved) {
        const state = JSON.parse(preserved);
        // Only recover if the state is less than 30 minutes old
        const stateAge = Date.now() - new Date(state.timestamp).getTime();
        if (stateAge < 30 * 60 * 1000) { // 30 minutes
          setCurrentStep(state.currentStep || 'vehicle-selection');
          setSelectedService(state.selectedService || null);
          setBookingData(state.bookingData || null);
          setBookingId(state.bookingId || '');
        }
      }
    } catch (error) {
      console.warn('Failed to recover booking state:', error);
    }
  };

  const handleServiceSelected = (service: ServiceLevel) => {
    setSelectedService(service);
    setCurrentStep('location-picker');
    preserveBookingState();
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
      preserveBookingState();
    }
  };

  const handleBookingConfirmed = (confirmedBookingId: string) => {
    setBookingId(confirmedBookingId);
    setCurrentStep('booking-success');
    // Clear preserved state after successful booking
    localStorage.removeItem('armora_booking_state');
  };

  const handleBackToVehicleSelection = () => {
    setCurrentStep('vehicle-selection');
    setSelectedService(null);
    preserveBookingState();
  };

  const handleBackToLocationPicker = () => {
    setCurrentStep('location-picker');
    preserveBookingState();
  };

  const handleErrorRetry = () => {
    // Attempt to recover state on retry
    recoverBookingState();
  };

  const handleErrorNavigateBack = () => {
    // Navigate back to previous step on error
    switch (currentStep) {
      case 'location-picker':
        setCurrentStep('vehicle-selection');
        break;
      case 'booking-confirmation':
        setCurrentStep('location-picker');
        break;
      default:
        setCurrentStep('vehicle-selection');
    }
  };

  const getPreservedState = () => ({
    selectedService,
    bookingData,
    bookingId,
  });

  switch (currentStep) {
    case 'vehicle-selection':
      return (
        <BookingErrorBoundary
          fallbackComponent="vehicle-selection"
          onRetry={handleErrorRetry}
          preservedState={getPreservedState()}
        >
          <VehicleSelection
            user={state.user}
            onServiceSelected={handleServiceSelected}
          />
        </BookingErrorBoundary>
      );
    case 'location-picker':
      return selectedService ? (
        <BookingErrorBoundary
          fallbackComponent="location-picker"
          onRetry={handleErrorRetry}
          onNavigateBack={handleErrorNavigateBack}
          preservedState={getPreservedState()}
        >
          <LocationPicker
            selectedService={selectedService}
            onLocationConfirmed={handleLocationConfirmed}
            onBack={handleBackToVehicleSelection}
            user={state.user}
          />
        </BookingErrorBoundary>
      ) : null;
    case 'booking-confirmation':
      return bookingData ? (
        <BookingErrorBoundary
          fallbackComponent="booking-confirmation"
          onRetry={handleErrorRetry}
          onNavigateBack={handleErrorNavigateBack}
          preservedState={getPreservedState()}
        >
          <BookingConfirmation
            bookingData={bookingData}
            onConfirmBooking={handleBookingConfirmed}
            onBack={handleBackToLocationPicker}
          />
        </BookingErrorBoundary>
      ) : null;
    case 'booking-success':
      return <BookingSuccess bookingId={bookingId} />;
    default:
      return (
        <BookingErrorBoundary
          fallbackComponent="vehicle-selection"
          onRetry={handleErrorRetry}
          preservedState={getPreservedState()}
        >
          <VehicleSelection
            user={state.user}
            onServiceSelected={handleServiceSelected}
          />
        </BookingErrorBoundary>
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
  
  // Achievement banner state
  const [showAchievementBanner, setShowAchievementBanner] = useState(false);
  
  // Show achievement banner after questionnaire completion for eligible users
  useEffect(() => {
    const shouldShowBanner = () => {
      // Don't show on splash, welcome, auth, or achievement views
      if (['splash', 'welcome', 'login', 'signup', 'guest-disclaimer', 'questionnaire', 'achievement'].includes(currentView)) {
        return false;
      }
      
      // Show banner for users who completed questionnaire and haven't made a booking yet
      if (user?.hasCompletedQuestionnaire && !user?.hasUnlockedReward) {
        const bannerDismissed = localStorage.getItem('armora_achievement_banner_dismissed');
        const firstBookingMade = localStorage.getItem('armora_first_booking_completed');
        
        // Don't show if user has made their first booking
        if (firstBookingMade) {
          return false;
        }
        
        // Show banner if not permanently dismissed
        if (!bannerDismissed) {
          return true;
        }
        
        // Even if dismissed, show again if it's been more than 3 days (to remind them)
        const dismissedTime = new Date(bannerDismissed).getTime();
        const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed > 3) {
          // Clear the dismissal so it shows again
          localStorage.removeItem('armora_achievement_banner_dismissed');
          return true;
        }
      }
      
      return false;
    };
    
    const showBanner = shouldShowBanner();
    setShowAchievementBanner(showBanner);
    
    // Record when banner is shown
    if (showBanner) {
      localStorage.setItem('armora_achievement_banner_shown', new Date().toISOString());
    }
  }, [currentView, user?.hasCompletedQuestionnaire, user?.hasUnlockedReward]);
  
  const handleClaimDiscount = () => {
    // Mark reward as unlocked
    if (user) {
      // Update user state (you'd normally call a context method here)
      localStorage.setItem('armora_user_reward_unlocked', 'true');
    }
    
    // Navigate to booking or show success
    navigateToView('booking');
    setShowAchievementBanner(false);
    
    // Record banner interaction
    localStorage.setItem('armora_achievement_banner_claimed', new Date().toISOString());
    
    // Clear any dismissal flags since user is actively claiming
    localStorage.removeItem('armora_achievement_banner_dismissed');
  };
  
  const handleDismissBanner = () => {
    setShowAchievementBanner(false);
    localStorage.setItem('armora_achievement_banner_dismissed', new Date().toISOString());
  };

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
    return (
      <>
        {renderCurrentView()}
        {showAchievementBanner && (
          <AchievementBanner
            isVisible={showAchievementBanner}
            onClaim={handleClaimDiscount}
            onDismiss={handleDismissBanner}
            userName={user?.name || 'Member'}
          />
        )}
      </>
    );
  }

  return (
    <>
      <AppLayout>
        {renderCurrentView()}
      </AppLayout>
      {showAchievementBanner && (
        <AchievementBanner
          isVisible={showAchievementBanner}
          onClaim={handleClaimDiscount}
          onDismiss={handleDismissBanner}
          userName={user?.name || 'Member'}
        />
      )}
    </>
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