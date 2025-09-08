import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, ViewState, User, PersonalizationData, DeviceCapabilities } from '../types';

// Initial state
const initialState: AppState = {
  currentView: 'splash',
  user: null,
  questionnaireData: null,
  deviceCapabilities: {
    isOnline: navigator.onLine,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch: 'ontouchstart' in window,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    supportsInstallPrompt: 'serviceWorker' in navigator,
  },
  isLoading: false,
  error: null,
};

// Action types
type AppAction =
  | { type: 'SET_VIEW'; payload: ViewState }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_QUESTIONNAIRE_DATA'; payload: PersonalizationData }
  | { type: 'UPDATE_DEVICE_CAPABILITIES'; payload: Partial<DeviceCapabilities> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_APP' };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_QUESTIONNAIRE_DATA':
      return { ...state, questionnaireData: action.payload };
    case 'UPDATE_DEVICE_CAPABILITIES':
      return { 
        ...state, 
        deviceCapabilities: { ...state.deviceCapabilities, ...action.payload } 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_APP':
      return { ...initialState, deviceCapabilities: state.deviceCapabilities };
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Convenience actions
  navigateToView: (view: ViewState) => void;
  setUser: (user: User | null) => void;
  updateQuestionnaireData: (data: PersonalizationData) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  resetApp: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Convenience actions
  const navigateToView = (view: ViewState) => {
    // Skip questionnaire for returning users who already completed it
    if (view === 'questionnaire' && state.user?.hasCompletedQuestionnaire) {
      dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
      return;
    }
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const updateQuestionnaireData = (data: PersonalizationData) => {
    dispatch({ type: 'SET_QUESTIONNAIRE_DATA', payload: data });
    
    // If questionnaire is completed, mark user as completed
    if (data.completedAt && state.user) {
      const updatedUser = { 
        ...state.user, 
        hasCompletedQuestionnaire: true,
        hasUnlockedReward: state.user.userType !== 'guest'
      };
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const resetApp = () => {
    dispatch({ type: 'RESET_APP' });
  };

  // Monitor device capabilities
  useEffect(() => {
    const handleResize = () => {
      dispatch({
        type: 'UPDATE_DEVICE_CAPABILITIES',
        payload: {
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        },
      });
    };

    const handleOnlineStatus = () => {
      dispatch({
        type: 'UPDATE_DEVICE_CAPABILITIES',
        payload: { isOnline: navigator.onLine },
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Local storage persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('armora_user');
    const savedQuestionnaireData = localStorage.getItem('armora_questionnaire');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('armora_user');
      }
    }

    if (savedQuestionnaireData) {
      try {
        const questionnaireData = JSON.parse(savedQuestionnaireData);
        updateQuestionnaireData(questionnaireData);
      } catch (error) {
        console.error('Failed to parse saved questionnaire data:', error);
        localStorage.removeItem('armora_questionnaire');
      }
    }
  }, []);

  // Save user and questionnaire data to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('armora_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('armora_user');
    }
  }, [state.user]);

  useEffect(() => {
    if (state.questionnaireData) {
      localStorage.setItem('armora_questionnaire', JSON.stringify(state.questionnaireData));
    }
  }, [state.questionnaireData]);

  const value: AppContextType = {
    state,
    dispatch,
    navigateToView,
    setUser,
    updateQuestionnaireData,
    setError,
    clearError,
    setLoading,
    resetApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}