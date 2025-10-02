import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
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
import { ActiveProtectionPanel } from './components/ActiveProtection';
// Removed unused imports
import { ServiceSelection } from './components/ServiceSelection/ServiceSelection';
import { AccountView } from './components/Account/AccountView';
// Removed top banner; recruitment is now a side widget on Account page
import { RecruitmentWidget } from './components/Global/RecruitmentWidget';
import { VenueProtectionWelcome } from './components/VenueProtection/VenueProtectionWelcome';
import { VenueSecurityQuestionnaire } from './components/VenueProtection/VenueSecurityQuestionnaire';
import { VenueProtectionSuccess } from './components/VenueProtection/VenueProtectionSuccess';
import { About } from './components/About/About';
import { CoverageAreas } from './components/CoverageAreas/CoverageAreas';
import { ProtectionRequest, AssignmentConfirmed } from './components/ProtectionRequest';
import { PrivacyPolicy } from './components/Legal/PrivacyPolicy/PrivacyPolicy';
import { TermsOfService } from './components/Legal/TermsOfService/TermsOfService';
import { GDPRNotice } from './components/Legal/GDPRNotice/GDPRNotice';
import { SIACompliance } from './components/Legal/SIACompliance/SIACompliance';
import './styles/globals.css';
import './styles/disable-infinite-animations.css'; /* CRITICAL FIX: Stop infinite animations causing flashing */

// Development tools for testing user scenarios removed due to chunk loading issues



function AppRouter() {
  const { state, navigateToView } = useApp();
  const { currentView, user, questionnaireData, assignmentState } = state;

  // Achievement banner state
  const [showAchievementBanner, setShowAchievementBanner] = useState(false);

  // Auto-navigate to assignments page when there's an active assignment
  useEffect(() => {
    // Only auto-navigate if user is logged in and has completed onboarding
    // Skip auto-navigation in development mode to allow testing Dashboard
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (assignmentState?.hasActiveAssignment && user && currentView === 'home' && !isDevelopment) {
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

      // Show banner for NON-GUEST users who completed questionnaire and haven't made a protection assignment yet
      if (user?.hasCompletedQuestionnaire && !user?.hasUnlockedReward && user?.userType !== 'guest') {
        const bannerDismissed = localStorage.getItem('armora_achievement_banner_dismissed');
        const firstAssignmentMade = localStorage.getItem('armora_first_assignment_completed');

        // Don't show if user has made their first protection assignment
        if (firstAssignmentMade) {
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
    
    // Show success message (no navigation needed for assignment system)
    // navigateToView('protection-request'); // Removed - using new assignment system
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
      case 'protection-assignment':
      case 'legacy-assignment-view':
        // These views are no longer used - assignment system handles this
        return <Dashboard />;
      case 'service-selection':
        return <ServiceSelection />;
      case 'active':
        return <ActiveProtectionPanel isOpen={true} onClose={() => navigateToView('home')} isActive={true} />;
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
      case 'protection-request':
        return (
          <ProtectionRequest
            onAssignmentRequested={() => navigateToView('assignment-confirmed')}
          />
        );
      case 'assignment-confirmed':
        return (
          <AssignmentConfirmed
            onClose={() => navigateToView('home')}
            onTrackAssignment={() => navigateToView('hub')}
            onNewAssignment={() => navigateToView('protection-request')}
          />
        );
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'gdpr':
        return <GDPRNotice />;
      case 'sia':
        return <SIACompliance />;
      default:
        return <SplashScreen />;
    }
  };

  // If assignment is active, navigate to hub instead of showing old flow
  if (state.isAssignmentActive && currentView !== 'hub') {
    navigateToView('hub');
  }

  // Don't wrap authentication screens, questionnaire, achievement, and protection request in AppLayout (they're full-screen)
  if (['splash', 'welcome', 'login', 'signup', 'guest-disclaimer', 'questionnaire', 'achievement', 'protection-request', 'assignment-confirmed'].includes(currentView)) {
    return (
      <div>
        {renderCurrentView()}
        {showAchievementBanner && (
          <AchievementBanner
            isVisible={showAchievementBanner}
            onClaim={handleClaimDiscount}
            onDismiss={handleDismissBanner}
            userName={user?.name || 'Member'}
          />
        )}
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}

function App() {
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

