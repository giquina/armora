import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { DevAuthProvider } from './contexts/DevAuthContext';
import { ProtectionAssignmentProvider } from './contexts/ProtectionAssignmentContext';
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
import { Hub } from './components/Hub';
import { SubscriptionOffer } from './components/Subscription/SubscriptionOffer';
import { ProtectionAssignmentSuccess } from './components/ProtectionAssignment';
import { WhereWhenView } from './components/Booking';
import { PaymentIntegration } from './components/Booking/PaymentIntegration';
import { ProtectionAssignmentErrorBoundary } from './components/ProtectionAssignment/ProtectionAssignmentErrorBoundary';
import { ReferralSection } from './components/Account/ReferralSection';
import { PPOVenueBooking } from './components/Account/PPOVenueBooking';
import { AccountView } from './components/Account/AccountView';
// Removed top banner; recruitment is now a side widget on Account page
import { RecruitmentWidget } from './components/Global/RecruitmentWidget';
import { VenueProtectionWelcome } from './components/VenueProtection/VenueProtectionWelcome';
import { VenueSecurityQuestionnaire } from './components/VenueProtection/VenueSecurityQuestionnaire';
import { VenueProtectionSuccess } from './components/VenueProtection/VenueProtectionSuccess';
import { About } from './components/About/About';
import { CoverageAreas } from './components/CoverageAreas/CoverageAreas';
import { PanicButton } from './components/PanicButton/PanicButton';
import { SecurityAssessment } from './components/BookingFlow/SecurityAssessment';
import { TrackingMap, StatusUpdates } from './components/RealTimeTracking';
import { SubscriptionManager } from './components/Subscription';
import { TierComparison } from './components/ServiceTiers/TierComparison';
import { ServiceLevel, ProtectionAssignmentData, LocationData } from './types';
import { getAllServices } from './data/standardizedServices';
import './styles/globals.css';
import './styles/disable-infinite-animations.css'; /* CRITICAL FIX: Stop infinite animations causing flashing */
import './styles/booking-white-theme.css'; /* BOOKING WHITE THEME: Apply white background to booking pages only */

// Development tools for testing user scenarios removed due to chunk loading issues

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
             service.id === 'client-vehicle' ? 'Your Personal Vehicle' : 'Protected BMW X5',
    capacity: service.id === 'client-vehicle' ? 'Any vehicle size' : '4 Principals',
    driverQualification: service.id === 'standard' || service.id === 'client-vehicle' ? 'SIA Level 2 Security Certified' :
                        service.id === 'executive' ? 'SIA Level 3 Security Certified' : 'Special Forces Trained',
    description: service.description,
    features: service.features.map(f => f.text) // Convert from {icon, text} to string array
  }));
};

function BookingFlow() {
  const { state, navigateToView } = useApp();

  // New simplified flow: where-when -> booking-confirmation -> booking-success
  const [currentStep, setCurrentStep] = useState<'where-when' | 'booking-confirmation' | 'booking-success'>('where-when');
  const [protectionAssignmentData, setProtectionAssignmentData] = useState<ProtectionAssignmentData | null>(null);
  const [bookingId, setBookingId] = useState<string>('');

  // Detect booking context from localStorage or URL params
  const getBookingContext = (): { serviceId?: string; context?: 'immediate' | 'airport' | 'executive' | 'schedule' | 'event' } => {
    // Check for pre-selected service
    const preSelectedServiceId = localStorage.getItem('armora_selected_service');
    const bookingContext = localStorage.getItem('armora_booking_context');

    // Clean up the localStorage items after reading
    if (preSelectedServiceId) {
      localStorage.removeItem('armora_selected_service');
    }
    if (bookingContext) {
      localStorage.removeItem('armora_booking_context');
    }

    return {
      serviceId: preSelectedServiceId || undefined,
      context: bookingContext as any
    };
  };

  const { serviceId: preSelectedServiceId, context: bookingContext } = getBookingContext();

  const handleGuestSignUp = () => {
    navigateToView('signup');
  };

  // Handle WhereWhenView completion
  const handleWhereWhenComplete = (data: {
    selectedService: ServiceLevel;
    location: LocationData;
    scheduledTime?: Date;
    isImmediate: boolean;
  }) => {
    const protectionAssignmentInfo: ProtectionAssignmentData = {
      service: data.selectedService,
      commencementPoint: data.location.commencementPoint,
      secureDestination: data.location.secureDestination,
      estimatedDistance: data.location.estimatedDistance || 10,
      estimatedDuration: data.location.estimatedDuration || 30,
      estimatedCost: 130, // This would be calculated properly
      user: state.user,
      scheduledDateTime: data.scheduledTime?.toISOString(),
      isScheduled: !data.isImmediate
    };

    setProtectionAssignmentData(protectionAssignmentInfo);
    setCurrentStep('booking-confirmation');
    preserveBookingState();
  };

  // Preserve booking state in localStorage for error recovery
  const preserveBookingState = () => {
    const stateToPreserve = {
      currentStep,
      protectionAssignmentData,
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
          setCurrentStep(state.currentStep || 'where-when');
          setProtectionAssignmentData(state.protectionAssignmentData || null);
          setBookingId(state.bookingId || '');
        }
      }
    } catch (error) {
      console.warn('Failed to recover booking state:', error);
    }
  };


  const handleBookingConfirmed = (confirmedBookingId: string) => {
    setBookingId(confirmedBookingId);
    setCurrentStep('booking-success');
    // Clear preserved state after successful booking
    localStorage.removeItem('armora_booking_state');
  };


  const handleErrorRetry = () => {
    // Attempt to recover state on retry
    recoverBookingState();
  };

  const handleErrorNavigateBack = () => {
    // Navigate back to previous step on error
    switch (currentStep) {
      case 'booking-confirmation':
        setCurrentStep('where-when');
        break;
      default:
        setCurrentStep('where-when');
    }
  };

  const getPreservedState = () => ({
    protectionAssignmentData,
    bookingId,
  });

  switch (currentStep) {
    case 'where-when':
      return (
        <ProtectionAssignmentErrorBoundary
          fallbackComponent="where-when"
          onRetry={handleErrorRetry}
          preservedState={getPreservedState()}
        >
          <WhereWhenView
            onContinueToPayment={handleWhereWhenComplete}
            preSelectedServiceId={preSelectedServiceId}
            preSelectedContext={bookingContext}
          />
        </ProtectionAssignmentErrorBoundary>
      );
    case 'booking-confirmation':
      return protectionAssignmentData ? (
        <ProtectionAssignmentErrorBoundary
          fallbackComponent="assignment-confirmation"
          onRetry={handleErrorRetry}
          onNavigateBack={handleErrorNavigateBack}
          preservedState={getPreservedState()}
        >
          <PaymentIntegration
            protectionAssignmentData={protectionAssignmentData}
            onBookingComplete={handleBookingConfirmed}
            onBack={() => setCurrentStep('where-when')}
          />
        </ProtectionAssignmentErrorBoundary>
      ) : null;
    case 'booking-success':
      return <ProtectionAssignmentSuccess assignmentId={bookingId} />;
    default:
      return (
        <ProtectionAssignmentErrorBoundary
          fallbackComponent="where-when"
          onRetry={handleErrorRetry}
          preservedState={getPreservedState()}
        >
          <WhereWhenView
            onContinueToPayment={handleWhereWhenComplete}
            preSelectedServiceId={preSelectedServiceId}
            preSelectedContext={bookingContext}
          />
        </ProtectionAssignmentErrorBoundary>
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
            onClick={() => navigateToView('hub')}
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
            onClick={() => navigateToView('coverage-areas')}
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
            🗺️ Coverage Areas & Routes
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
  const { currentView, user, questionnaireData, assignmentState } = state;

  // Enable white theme for booking page only
  const isBookingTheme = currentView === 'booking';

  // Achievement banner state
  const [showAchievementBanner, setShowAchievementBanner] = useState(false);

  // Auto-navigate to assignments page when there's an active assignment
  useEffect(() => {
    // Only auto-navigate if user is logged in and has completed onboarding
    if (assignmentState?.hasActiveAssignment && user && currentView === 'home') {
      console.log('Active assignment detected, navigating to hub page');
      navigateToView('hub');
    }
  }, [assignmentState?.hasActiveAssignment, user, currentView, navigateToView]);

  // Show achievement banner after questionnaire completion for eligible users
  useEffect(() => {
    const shouldShowBanner = () => {
      // Don't show on splash, welcome, auth, or achievement views
      if (['splash', 'welcome', 'login', 'signup', 'guest-disclaimer', 'questionnaire', 'achievement'].includes(currentView)) {
        return false;
      }

      // Show banner for NON-GUEST users who completed questionnaire and haven't made a booking yet
      if (user?.hasCompletedQuestionnaire && !user?.hasUnlockedReward && user?.userType !== 'guest') {
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
    
    // Navigate to booking UI
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
      case 'hub':
      case 'Assignments':
        return <Hub />;
      case 'account':
        return <AccountView />;
      case 'about':
        return <About onBack={() => navigateToView('home')} />;
      case 'coverage-areas':
        return <CoverageAreas onBack={() => navigateToView('home')} />;
      case 'venue-protection-welcome':
        return <VenueProtectionWelcome />;
      case 'venue-security-questionnaire':
        return <VenueSecurityQuestionnaire />;
      case 'venue-protection-success':
        return <VenueProtectionSuccess />;
      case 'security-assessment':
        return <SecurityAssessment
          onComplete={(data) => console.log('Assessment complete', data)}
          onBack={() => navigateToView('home')}
        />;
      case 'tracking':
        return (
          <div style={{ padding: '20px' }}>
            <TrackingMap />
            <StatusUpdates />
          </div>
        );
      case 'subscription':
        return <SubscriptionManager />;
      case 'service-tiers':
        return <TierComparison onTierSelect={(tier) => console.log('Tier selected:', tier)} />;
      default:
        return <SplashScreen />;
    }
  };

  // Don't wrap authentication screens, questionnaire, achievement, and booking in AppLayout (they're full-screen)
  if (['splash', 'welcome', 'login', 'signup', 'guest-disclaimer', 'questionnaire', 'achievement', 'booking'].includes(currentView)) {
    return (
      <div className={isBookingTheme ? 'booking-white-theme' : ''}>
        {renderCurrentView()}
        {showAchievementBanner && (
          <AchievementBanner
            isVisible={showAchievementBanner}
            onClaim={handleClaimDiscount}
            onDismiss={handleDismissBanner}
            userName={user?.name || 'Member'}
          />
        )}
        {/* Global Panic Button - Always Available */}
        <PanicButton />
      </div>
    );
  }

  return (
    <div className={isBookingTheme ? 'booking-white-theme' : ''}>
      <AppLayout>
        {renderCurrentView()}
        {/* Show recruitment widget only on Account page */}
        {currentView === 'account' && <RecruitmentWidget />}
      </AppLayout>
      {showAchievementBanner && (
        <AchievementBanner
          isVisible={showAchievementBanner}
          onClaim={handleClaimDiscount}
          onDismiss={handleDismissBanner}
          userName={user?.name || 'Member'}
        />
      )}
      {/* Global Panic Button - Always Available */}
      <PanicButton />
    </div>
  );
}

function App() {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    return (
      <DevAuthProvider>
        <AppProvider>
          <ProtectionAssignmentProvider>
            <AppRouter />
          </ProtectionAssignmentProvider>
        </AppProvider>
      </DevAuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AppProvider>
        <ProtectionAssignmentProvider>
          <AppRouter />
        </ProtectionAssignmentProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;