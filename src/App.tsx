import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AppLayout } from './components/Layout/AppLayout';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import { WelcomePage } from './components/Auth/WelcomePage';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { GuestDisclaimer } from './components/Auth/GuestDisclaimer';
// import { QuestionnaireFlow } from './components/Questionnaire/QuestionnaireFlow';
// import { AchievementUnlock } from './components/Achievement';
import { Dashboard } from './components/Dashboard';
import './styles/globals.css';

function BookingFlow() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Booking Flow</h2>
      <p>Vehicle selection and booking coming soon...</p>
    </div>
  );
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
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Security Assessment</h2>
            <p>Questionnaire coming soon...</p>
            <button onClick={() => navigateToView('dashboard')}>
              Continue to Dashboard
            </button>
          </div>
        );
      case 'achievement':
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Achievement Unlocked!</h2>
            <p>50% off your first ride!</p>
            <button onClick={() => navigateToView('dashboard')}>
              Continue to Dashboard
            </button>
          </div>
        );
      case 'dashboard':
        return <Dashboard />;
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