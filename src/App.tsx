import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
// import { AuthProvider } from './contexts/AuthContext'; // Removed for development
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
// Removed unused imports
import { AssignmentSuccess, WhereWhenView } from './components/ProtectionAssignment';
import { PaymentIntegration } from './components/ProtectionAssignment/PaymentIntegration';
import { ProtectionAssignmentErrorBoundary } from './components/ProtectionAssignment/ProtectionAssignmentErrorBoundary';
import { ServiceSelection } from './components/ServiceSelection/ServiceSelection';
import { AccountView } from './components/Account/AccountView';
// Removed top banner; recruitment is now a side widget on Account page
import { RecruitmentWidget } from './components/Global/RecruitmentWidget';
import { VenueProtectionWelcome } from './components/VenueProtection/VenueProtectionWelcome';
import { VenueSecurityQuestionnaire } from './components/VenueProtection/VenueSecurityQuestionnaire';
import { VenueProtectionSuccess } from './components/VenueProtection/VenueProtectionSuccess';
import { About } from './components/About/About';
import { CoverageAreas } from './components/CoverageAreas/CoverageAreas';
import { DevNavigationPanel } from './components/UI/DevNavigationPanel';
import { ServiceLevel, ProtectionAssignmentData, LocationData } from './types';
import './styles/globals.css';
import './styles/disable-infinite-animations.css'; /* CRITICAL FIX: Stop infinite animations causing flashing */
import './styles/booking-white-theme.css'; /* BOOKING WHITE THEME: Apply white background to booking pages only */

// Development tools for testing user scenarios removed due to chunk loading issues


function BookingFlow() {
  const { state } = useApp();

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
      context: bookingContext as 'immediate' | 'airport' | 'executive' | 'schedule' | 'event' | undefined
    };
  };

  const { serviceId: preSelectedServiceId, context: bookingContext } = getBookingContext();


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
      return <AssignmentSuccess assignmentId={bookingId} />;
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


function AppRouter() {
  const { state, navigateToView } = useApp();
  const { currentView, user, questionnaireData, assignmentState } = state;

  // Disable white theme; booking uses legacy dark UI now
  const isBookingTheme = false;

  // Achievement banner state
  const [showAchievementBanner, setShowAchievementBanner] = useState(false);

  // Auto-navigate to assignments page when there's an active assignment
  useEffect(() => {
    // Only auto-navigate if user is logged in and has completed onboarding
    // Skip auto-navigation in development mode to allow testing Dashboard
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (assignmentState?.hasActiveAssignment && user && currentView === 'home' && !isDevelopment) {
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
  }, [currentView, user?.hasCompletedQuestionnaire, user?.hasUnlockedReward, user?.userType]);
  
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
      case 'legacy-booking-view':
        // Redirect to new booking system
        return <BookingFlow />;
      case 'service-selection':
        return <ServiceSelection />;
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
      default:
        return <SplashScreen />;
    }
  };

  // Don't wrap authentication screens, questionnaire, and achievement in AppLayout (they're full-screen)
  if (['splash', 'welcome', 'login', 'signup', 'guest-disclaimer', 'questionnaire', 'achievement'].includes(currentView)) {
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
        {/* Development Navigation Panel - always available in development */}
        {process.env.NODE_ENV === 'development' && <DevNavigationPanel />}
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
      {/* Development Navigation Panel - always available in development */}
      {process.env.NODE_ENV === 'development' && <DevNavigationPanel />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <ProtectionAssignmentProvider>
        <AppRouter />
      </ProtectionAssignmentProvider>
    </AppProvider>
  );
}

export default App;