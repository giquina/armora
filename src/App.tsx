import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { BookingProvider } from './contexts/BookingContext';
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
import { ServicesPage } from './components/Services/ServicesPage';
import { BookingsView } from './components/BookingsView';
import { SubscriptionOffer } from './components/Subscription/SubscriptionOffer';
import { VehicleSelection, LocationPicker, BookingSuccess } from './components/Booking';
import { PaymentIntegration } from './components/Booking/PaymentIntegration';
import { BookingErrorBoundary } from './components/Booking/BookingErrorBoundary';
import { ServiceSelection } from './components/ServiceSelection/ServiceSelection';
import { FloatingActionButton, RecruitmentModal } from './components/Recruitment';
import { ReferralSection } from './components/Account/ReferralSection';
import { PPOVenueBooking } from './components/Account/PPOVenueBooking';
import { AccountView } from './components/Account/AccountView';
import { VenueProtectionWelcome } from './components/VenueProtection/VenueProtectionWelcome';
import { VenueSecurityQuestionnaire } from './components/VenueProtection/VenueSecurityQuestionnaire';
import { VenueProtectionSuccess } from './components/VenueProtection/VenueProtectionSuccess';
import { About } from './components/About/About';
import { ServiceLevel, BookingData, LocationData } from './types';
import { getAllServices } from './data/standardizedServices';
import './styles/globals.css';
import './styles/disable-infinite-animations.css'; /* CRITICAL FIX: Stop infinite animations causing flashing */

// Development tools for testing user scenarios
if (process.env.NODE_ENV === 'development') {
  import('./utils/testUserScenarios');
}

// Convert standardized services to legacy ServiceLevel format for compatibility
const convertToServiceLevel = (): ServiceLevel[] => {
  return getAllServices().map(service => ({
    id: service.id,
    name: service.name,
    tagline: service.tagline,
    price: service.priceDisplay,
    hourlyRate: service.hourlyRate,
    // Vehicle and capacity data - standardized for all services
    vehicle: service.id === 'standard' ? 'Nissan Leaf EV' :
             service.id === 'executive' ? 'BMW 5 Series' :
             service.id === 'client-vehicle' ? 'Your Personal Vehicle' : 'Armored BMW X5',
    capacity: service.id === 'client-vehicle' ? 'Any vehicle size' : '4 passengers',
    driverQualification: service.id === 'standard' || service.id === 'client-vehicle' ? 'SIA Level 2 Security Certified' :
                        service.id === 'executive' ? 'SIA Level 3 Security Certified' : 'Special Forces Trained',
    description: service.description,
    features: service.features.map(f => f.text) // Convert from {icon, text} to string array
  }));
};

function BookingFlow() {
  const { state, navigateToView } = useApp();

  // Check if we should start with location-first flow (from "Where to?" button)
  const [bookingFlow] = useState(() => localStorage.getItem('armora_booking_flow'));
  const initialStep = bookingFlow === 'location-first' ? 'location-picker' : 'vehicle-selection';

  const [currentStep, setCurrentStep] = useState<'vehicle-selection' | 'location-picker' | 'booking-confirmation' | 'booking-success'>(initialStep);
  const [selectedService, setSelectedService] = useState<ServiceLevel | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingId, setBookingId] = useState<string>('');

  const handleGuestSignUp = () => {
    navigateToView('signup');
  };

  // Check for pre-selected service from direct booking
  useEffect(() => {
    const preSelectedServiceId = localStorage.getItem('armora_selected_service');
    if (preSelectedServiceId && !selectedService) {
      // Get all services to find the selected one
      const services = convertToServiceLevel();
      const service = services.find(s => s.id === preSelectedServiceId);
      if (service) {
        setSelectedService(service);
        setCurrentStep('location-picker');
        console.log('[Booking] Pre-selected service found, skipping to location:', preSelectedServiceId);
      }
    }
  }, [selectedService]);

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

    // Check if we have pre-stored location data from location-first flow
    const storedLocationData = localStorage.getItem('armora_location_data');
    if (storedLocationData) {
      try {
        const locationData = JSON.parse(storedLocationData);
        // Move directly to booking confirmation with the stored location data
        const bookingInfo: BookingData = {
          service: service,
          pickup: locationData.pickup,
          destination: locationData.destination,
          estimatedDistance: locationData.estimatedDistance ?? 0,
          estimatedDuration: locationData.estimatedDuration ?? 0,
          estimatedCost: locationData.estimatedCost,
          user: state.user,
        };
        setBookingData(bookingInfo);
        setCurrentStep('booking-confirmation');
        localStorage.removeItem('armora_location_data'); // Clean up
      } catch (error) {
        console.warn('Failed to parse stored location data:', error);
        setCurrentStep('location-picker');
      }
    } else {
      setCurrentStep('location-picker');
    }

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
            onSignUp={handleGuestSignUp}
          />
        </BookingErrorBoundary>
      );
    case 'location-picker':
      // If no service selected and we're in location-first flow, handle it differently
      if (!selectedService && bookingFlow === 'location-first') {
        // Create a default service for location picker to work with
        const defaultService: ServiceLevel = {
          id: 'standard',
          name: 'Standard Protection',
          tagline: 'Professional security transport',
          price: '£65/hour',
          hourlyRate: 65,
          vehicle: 'Secure Vehicle',
          capacity: '4 passengers',
          driverQualification: 'SIA Level 2 Security Certified',
          description: 'Professional security transport service',
          features: ['SIA certified driver', 'Secure vehicle', 'GPS tracking']
        };

        return (
          <BookingErrorBoundary
            fallbackComponent="location-picker"
            onRetry={handleErrorRetry}
            onNavigateBack={() => {
              // Clear location-first flag and go back to dashboard
              localStorage.removeItem('armora_booking_flow');
              navigateToView('home');
            }}
            preservedState={getPreservedState()}
          >
            <LocationPicker
              selectedService={defaultService}
              onLocationConfirmed={(locationData) => {
                // Store location data and move to service selection
                localStorage.setItem('armora_location_data', JSON.stringify(locationData));
                setCurrentStep('vehicle-selection');
                localStorage.removeItem('armora_booking_flow'); // Clear the flag
              }}
              onBack={() => {
                localStorage.removeItem('armora_booking_flow');
                navigateToView('home');
              }}
              user={state.user}
            />
          </BookingErrorBoundary>
        );
      }

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
          <PaymentIntegration
            bookingData={bookingData}
            onBookingComplete={handleBookingConfirmed}
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
            onSignUp={handleGuestSignUp}
          />
        </BookingErrorBoundary>
      );
  }
}

function Profile() {
  const { state, navigateToView } = useApp();
  const { user } = state;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'var(--space-md)',
      paddingTop: 'var(--space-xl)', // Extra top padding since no header
      paddingBottom: 'calc(80px + var(--space-xl))', // Bottom nav height + extra space
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh'
    }}>
      {/* User Profile Header */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        marginBottom: 'var(--space-lg)',
        border: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'var(--font-xl)',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-sm) 0'
        }}>
          Account Settings
        </h1>
        {user && (
          <p style={{
            fontSize: 'var(--font-base)',
            color: 'var(--text-secondary)',
            margin: '0'
          }}>
            Welcome back, {user.name || 'Member'}
          </p>
        )}
      </div>

      {/* Services Menu */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        marginBottom: 'var(--space-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h3 style={{
          fontSize: 'var(--font-lg)',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-md) 0'
        }}>
          Services & Bookings
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)'
        }}>
          <button
            onClick={() => navigateToView('bookings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              width: '100%',
              padding: 'var(--space-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-base)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-quaternary)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            🚗 Transport History
          </button>
          <button
            onClick={() => navigateToView('venue-protection-welcome')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              width: '100%',
              padding: 'var(--space-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-base)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-quaternary)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            🛡️ Venue Security Services
          </button>
          <button
            onClick={() => navigateToView('about')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              width: '100%',
              padding: 'var(--space-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-base)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-quaternary)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            ℹ️ About Armora Security
          </button>
        </div>
      </div>

      {/* Referral Section */}
      <ReferralSection />

      {/* Personal Protection Officer Venue Booking */}
      <PPOVenueBooking isVisible={true} />

      {/* Placeholder sections for future features */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        marginBottom: 'var(--space-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h3 style={{
          fontSize: 'var(--font-lg)',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-md) 0'
        }}>
          Payment Methods
        </h3>
        <p style={{
          fontSize: 'var(--font-base)',
          color: 'var(--text-secondary)',
          margin: '0',
          fontStyle: 'italic'
        }}>
          Payment methods management coming soon...
        </p>
      </div>

      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        marginBottom: 'var(--space-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h3 style={{
          fontSize: 'var(--font-lg)',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-md) 0'
        }}>
          Settings & Preferences
        </h3>
        <p style={{
          fontSize: 'var(--font-base)',
          color: 'var(--text-secondary)',
          margin: '0',
          fontStyle: 'italic'
        }}>
          Account settings and preferences coming soon...
        </p>
      </div>

      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h3 style={{
          fontSize: 'var(--font-lg)',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-md) 0'
        }}>
          Help & Support
        </h3>
        <p style={{
          fontSize: 'var(--font-base)',
          color: 'var(--text-secondary)',
          margin: '0',
          fontStyle: 'italic'
        }}>
          Help center and support options coming soon...
        </p>
      </div>
    </div>
  );
}

function AppRouter() {
  const { state, navigateToView } = useApp();
  const { currentView, user, questionnaireData } = state;

  // Achievement banner state
  const [showAchievementBanner, setShowAchievementBanner] = useState(false);

  // Recruitment modal state
  const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);
  
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

  // Determine FAB visibility - only show on Home (dashboard) and Account (profile) tabs
  const shouldShowFab = (): boolean => {
    return !!(user && (currentView === 'home' || currentView === 'account'));
  };

  const handleOpenRecruitmentModal = () => {
    setIsRecruitmentModalOpen(true);
  };

  const handleCloseRecruitmentModal = () => {
    setIsRecruitmentModalOpen(false);
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
            onContinueToDashboard={() => navigateToView('home')}
            onCreateAccountUpgrade={() => navigateToView('signup')}
          />
        );
      case 'home':
        return <Dashboard />;
      case 'services':
        return <ServicesPage />;
      case 'subscription-offer':
        // Get selected service data from localStorage for pricing
        const selectedServiceId = localStorage.getItem('armora_selected_service');
        const servicePrice = selectedServiceId === 'standard' ? 45 : selectedServiceId === 'executive' ? 75 : selectedServiceId === 'shadow' ? 65 : 45;
        return <SubscriptionOffer selectedService={selectedServiceId || undefined} servicePrice={servicePrice} />;
      case 'booking':
        return <BookingFlow />;
      case 'service-selection':
        return <ServiceSelection />;
      case 'bookings':
      case 'rides':
        return <BookingsView />;
      case 'account':
        return <AccountView />;
      case 'about':
        return <About onBack={() => navigateToView('home')} />;
      case 'venue-protection-welcome':
        return <VenueProtectionWelcome />;
      case 'venue-security-questionnaire':
        return <VenueSecurityQuestionnaire />;
      case 'venue-protection-success':
        return <VenueProtectionSuccess />;
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
        <FloatingActionButton
          isVisible={Boolean(shouldShowFab())}
          onClick={handleOpenRecruitmentModal}
        />
        <RecruitmentModal
          isOpen={isRecruitmentModalOpen}
          onClose={handleCloseRecruitmentModal}
        />
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
      <FloatingActionButton
        isVisible={Boolean(shouldShowFab())}
        onClick={handleOpenRecruitmentModal}
      />
      <RecruitmentModal
        isOpen={isRecruitmentModalOpen}
        onClose={handleCloseRecruitmentModal}
      />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <BookingProvider>
        <AppRouter />
      </BookingProvider>
    </AppProvider>
  );
}

export default App;