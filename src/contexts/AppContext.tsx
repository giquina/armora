import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { AppState, ViewState, User, PersonalizationData, DeviceCapabilities, UserSubscription, SubscriptionTier, PremiumInterest, NotificationData, SafeAssignmentFundMetrics, CommunityImpactData, AssignmentState, Assignment, PanicAlert, INotificationItem } from '../types';
import {
  createProtectionAssignment,
  getProtectionAssignment,
  updateProtectionAssignment,
  subscribeToAssignmentUpdates,
  activateEmergency,
  deactivateEmergency,
  getSafeAssignmentFundStats,
} from "../lib/supabase"

// Initial state
const initialState: AppState = {
  currentView: 'splash',
  user: null,
  questionnaireData: null,
  deviceCapabilities: {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isMobile: typeof navigator !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : false,
    isTouch: typeof window !== 'undefined' ? 'ontouchstart' in window : false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 768,
    orientation: typeof window !== 'undefined' ? (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait') : 'landscape',
    supportsInstallPrompt: typeof navigator !== 'undefined' ? 'serviceWorker' in navigator : false,
  },
  subscription: null,
  selectedServiceForProtectionAssignment: undefined,
  userProfileSelection: undefined,
  safeAssignmentFundMetrics: null,
  communityImpactData: null,
  assignmentState: {
    currentAssignment: null,
    hasActiveAssignment: false,
    activeAssignmentId: null,
    panicAlertSent: false,
    panicAlertTimestamp: null,
    lastKnownLocation: null,
  },
  isLoading: false,
  error: null,
  notifications: [],
};

// Action types
type AppAction =
  | { type: 'SET_VIEW'; payload: ViewState }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_QUESTIONNAIRE_DATA'; payload: PersonalizationData }
  | { type: 'SET_USER_PROFILE_SELECTION'; payload: string | undefined }
  | { type: 'UPDATE_USER_QUESTIONNAIRE_COMPLETION' }
  | { type: 'UPDATE_DEVICE_CAPABILITIES'; payload: Partial<DeviceCapabilities> }
  | { type: 'SET_SUBSCRIPTION'; payload: UserSubscription | null }
  | { type: 'SET_SELECTED_SERVICE'; payload: string }
  | { type: 'SET_SAFE_RIDE_FUND_METRICS'; payload: SafeAssignmentFundMetrics | null }
  | { type: 'SET_COMMUNITY_IMPACT_DATA'; payload: CommunityImpactData | null }
  | { type: 'SET_ASSIGNMENT'; payload: Assignment | null }
  | { type: 'UPDATE_ASSIGNMENT_STATUS'; payload: { assignmentId: string; status: string } }
  | { type: 'SET_PANIC_ALERT_SENT'; payload: { sent: boolean; timestamp?: Date } }
  | { type: 'UPDATE_LAST_KNOWN_LOCATION'; payload: { lat: number; lng: number; address: string; timestamp: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_APP' }
  | { type: 'ADD_NOTIFICATION'; payload: INotificationItem }
  | { type: 'MARK_NOTIFICATION_READ'; payload: { id: string } }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'SET_NOTIFICATIONS'; payload: INotificationItem[] };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_QUESTIONNAIRE_DATA':
      return { ...state, questionnaireData: action.payload };
    case 'SET_USER_PROFILE_SELECTION':
      return { ...state, userProfileSelection: action.payload };
    case 'UPDATE_USER_QUESTIONNAIRE_COMPLETION':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          hasCompletedQuestionnaire: true,
          hasUnlockedReward: state.user.userType !== 'guest'
        } : state.user
      };
    case 'UPDATE_DEVICE_CAPABILITIES':
      return { 
        ...state, 
        deviceCapabilities: { ...state.deviceCapabilities, ...action.payload } 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload };
    case 'SET_SELECTED_SERVICE':
      return { ...state, selectedServiceForProtectionAssignment: action.payload };
    case 'SET_SAFE_RIDE_FUND_METRICS':
      return { ...state, safeAssignmentFundMetrics: action.payload };
    case 'SET_COMMUNITY_IMPACT_DATA':
      return { ...state, communityImpactData: action.payload };
    case 'SET_ASSIGNMENT':
      return {
        ...state,
        assignmentState: {
          ...state.assignmentState,
          currentAssignment: action.payload,
          hasActiveAssignment: action.payload?.status === 'active' || action.payload?.status === 'in_progress',
          activeAssignmentId: action.payload?.id || null,
        }
      };
    case 'UPDATE_ASSIGNMENT_STATUS':
      if (state.assignmentState.currentAssignment?.id === action.payload.assignmentId) {
        const updatedAssignment = {
          ...state.assignmentState.currentAssignment,
          status: action.payload.status as 'scheduled' | 'active' | 'in_progress' | 'completed' | 'cancelled',
        };
        return {
          ...state,
          assignmentState: {
            ...state.assignmentState,
            currentAssignment: updatedAssignment,
            hasActiveAssignment: action.payload.status === 'active' || action.payload.status === 'in_progress',
          }
        };
      }
      return state;
    case 'SET_PANIC_ALERT_SENT':
      return {
        ...state,
        assignmentState: {
          ...state.assignmentState,
          panicAlertSent: action.payload.sent,
          panicAlertTimestamp: action.payload.timestamp || null,
        }
      };
    case 'UPDATE_LAST_KNOWN_LOCATION':
      return {
        ...state,
        assignmentState: {
          ...state.assignmentState,
          lastKnownLocation: action.payload,
        }
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_APP':
      return { ...initialState, deviceCapabilities: state.deviceCapabilities };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...(state.notifications || [])] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: (state.notifications || []).map(n => n.id === action.payload.id ? { ...n, isRead: true } : n)
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return { ...state, notifications: (state.notifications || []).map(n => ({ ...n, isRead: true })) };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
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
  setUserProfileSelection: (profileSelection: string | undefined) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  resetApp: () => void;
  // Subscription actions
  setSubscription: (subscription: UserSubscription | null) => void;
  setSelectedService: (service: string) => void;
  startFreeTrial: (tier: SubscriptionTier) => Promise<void>;
  recordPremiumInterest: (data: PremiumInterest) => Promise<void>;
  sendOwnerNotification: (data: NotificationData) => Promise<boolean>;
  // Safe Assignment Fund actions
  updateSafeRideFundMetrics: (metrics: SafeAssignmentFundMetrics | null) => void;
  updateCommunityImpactData: (data: CommunityImpactData | null) => void;
  initializeSafeRideFundData: () => void;
  // Notifications
  addNotification: (n: Omit<INotificationItem, 'id' | 'timestamp'> & Partial<Pick<INotificationItem, 'id' | 'timestamp'>>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // Assignment actions
  createAssignment: (assignmentData: any) => Promise<Assignment>;
  updateAssignmentStatus: (assignmentId: string, status: string) => Promise<void>;
  activatePanicAlert: (location?: any) => Promise<void>;
  deactivatePanicAlert: () => Promise<void>;
  updateLastKnownLocation: (location: { lat: number; lng: number; address: string }) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Convenience actions
  const navigateToView = (view: ViewState) => {
    // Development mode: always allow questionnaire navigation for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    console.log('🔍 Navigation Debug:', {
      targetView: view,
      currentUser: state.user,
      hasCompletedQuestionnaire: state.user?.hasCompletedQuestionnaire,
      isDevelopment,
      willBypassSkip: isDevelopment && view === 'questionnaire'
    });
    
    // Skip questionnaire for returning users who already completed it (but not in development)
    if (view === 'questionnaire' && state.user?.hasCompletedQuestionnaire && !isDevelopment) {
      console.log('⚠️  Redirecting to dashboard - user has completed questionnaire');
      dispatch({ type: 'SET_VIEW', payload: 'home' });
      return;
    }
    
    console.log('✅ Navigating to:', view);
    dispatch({ type: 'SET_VIEW', payload: view });
    // Keep URL hash in sync for simple deep linking (e.g., #booking)
    try {
      if (typeof window !== 'undefined' && window.location.hash !== `#${view}`) {
        window.location.hash = view as string;
      }
    } catch (e) {
      // no-op if hash cannot be set (e.g., SSR or restricted env)
    }
  };

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const updateQuestionnaireData = useCallback((data: PersonalizationData) => {
    dispatch({ type: 'SET_QUESTIONNAIRE_DATA', payload: data });

    // Store profile selection for personalization
    if (data.profileSelection) {
      dispatch({ type: 'SET_USER_PROFILE_SELECTION', payload: data.profileSelection });
    }

    // If questionnaire is completed, mark user as completed
    if (data.completedAt) {
      dispatch({
        type: 'UPDATE_USER_QUESTIONNAIRE_COMPLETION'
      });
    }
  }, []); // Remove state.user dependency to prevent infinite loop
  // TypeScript update to force recompilation

  const setUserProfileSelection = (profileSelection: string | undefined) => {
    dispatch({ type: 'SET_USER_PROFILE_SELECTION', payload: profileSelection });
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

  // Initialize view from URL hash for simple deep linking support
  useEffect(() => {
    const applyHashView = () => {
      try {
        if (typeof window === 'undefined') return;
        const raw = window.location.hash || '';
        const hash = raw.startsWith('#') ? raw.slice(1) : raw;
        if (!hash) return;
        // Best-effort cast; invalid values will be handled by AppRouter's default case
        const nextView = hash as ViewState;
        // Avoid redundant dispatches
        if (state.currentView !== nextView) {
          dispatch({ type: 'SET_VIEW', payload: nextView });
        }
      } catch (e) {
        // Ignore malformed hashes
      }
    };

    applyHashView();
    window.addEventListener('hashchange', applyHashView);
    return () => window.removeEventListener('hashchange', applyHashView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscription actions
  const setSubscription = (subscription: UserSubscription | null) => {
    dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription });
  };

  const setSelectedService = (service: string) => {
    dispatch({ type: 'SET_SELECTED_SERVICE', payload: service });
  };

  const startFreeTrial = async (tier: SubscriptionTier) => {
    try {
      setLoading(true);
      const trialStart = new Date();
      const trialEnd = new Date(trialStart.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const trialSubscription: UserSubscription = {
        tier,
        status: 'trial',
        trialStartDate: trialStart,
        trialEndDate: trialEnd,
        isTrialActive: true,
        daysRemainingInTrial: 30,
        memberBenefits: {
          discountPercentage: tier === 'essential' ? 10 : tier === 'executive' ? 20 : 30,
          bookingFee: 0,
          priorityBooking: true,
          flexibleCancellation: true,
          dedicatedManager: tier !== 'essential',
          responseTime: tier === 'essential' ? '2 hours' : tier === 'executive' ? '45 minutes' : '30 minutes'
        }
      };

      setSubscription(trialSubscription);
      
      // Save to localStorage
      localStorage.setItem('armora_subscription', JSON.stringify(trialSubscription));
      
      // Send notification to owner
      await sendOwnerNotification({
        type: 'trial_signup',
        userEmail: state.user?.email || 'unknown@email.com',
        tier,
        timestamp: new Date()
      });

      console.log('🎉 Free trial started:', trialSubscription);
    } catch (error) {
      console.error('Error starting free trial:', error);
      setError('Failed to start free trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const recordPremiumInterest = async (data: PremiumInterest) => {
    try {
      setLoading(true);
      
      // Save interest to localStorage (in real app, would be API call)
      const existingInterests = JSON.parse(localStorage.getItem('armora_premium_interests') || '[]');
      existingInterests.push(data);
      localStorage.setItem('armora_premium_interests', JSON.stringify(existingInterests));
      
      // Send notification to owner
      await sendOwnerNotification({
        type: 'premium_interest',
        userEmail: data.userEmail,
        tier: data.tier,
        expectedUsage: data.expectedUsage,
        timestamp: new Date(),
        totalInterestCount: existingInterests.length
      });

      console.log('📧 Premium interest recorded:', data);
    } catch (error) {
      console.error('Error recording premium interest:', error);
      setError('Failed to record interest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOwnerNotification = async (data: NotificationData) => {
    try {
      // In real app, this would be an API call to send email
      // For now, we'll just log and simulate the notification
      
      console.log('📧 OWNER NOTIFICATION:', {
        to: 'owner@armora-transport.co.uk',
        subject: data.type === 'premium_interest' 
          ? `🚨 NEW ${data.tier?.toUpperCase()} INTEREST` 
          : data.type === 'trial_signup'
          ? '🎉 NEW TRIAL SIGNUP'
          : '✅ SUBSCRIPTION ACTIVATED',
        body: {
          userEmail: data.userEmail,
          tier: data.tier,
          expectedUsage: data.expectedUsage,
          timestamp: data.timestamp,
          totalInterestCount: data.totalInterestCount
        }
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error sending owner notification:', error);
      throw error;
    }
  };

  // Safe Assignment Fund actions
  const updateSafeRideFundMetrics = (metrics: SafeAssignmentFundMetrics | null) => {
    dispatch({ type: 'SET_SAFE_RIDE_FUND_METRICS', payload: metrics });
  };

  const updateCommunityImpactData = (data: CommunityImpactData | null) => {
    dispatch({ type: 'SET_COMMUNITY_IMPACT_DATA', payload: data });
  };

  const initializeSafeRideFundData = useCallback(async () => {
    // Only initialize for Essential subscribers
    if (state.subscription?.tier === 'essential') {
      const joinDate = state.subscription.startDate || new Date();
      const monthsSinceJoined = Math.max(1, Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));

      const metrics: SafeAssignmentFundMetrics = {
        personalRidesFunded: monthsSinceJoined,
        totalContributed: monthsSinceJoined * 4, // £4 per month
        currentStreak: monthsSinceJoined,
        monthlyContribution: 4,
        joinDate,
        nextMilestone: Math.ceil(monthsSinceJoined / 5) * 5,
        progressToNextMilestone: ((monthsSinceJoined % 5) || 5) / 5 * 100
      };

      updateSafeRideFundMetrics(metrics);
    }

    // Load community impact data from Supabase
    try {
      const { data: fundStats, error } = await getSafeAssignmentFundStats();

      if (!error && fundStats) {
        const communityData: CommunityImpactData = {
          totalMembers: 1247, // Could be calculated from profiles count
          monthlyAssignmentsFunded: 278, // Could be calculated from recent assignments
          totalAssignmentsFunded: fundStats.total_rides_provided || 3741,
          lastUpdated: new Date(fundStats.last_updated || new Date())
        };

        updateCommunityImpactData(communityData);
      } else {
        // Fallback to default data
        const communityData: CommunityImpactData = {
          totalMembers: 1247,
          monthlyAssignmentsFunded: 278,
          totalAssignmentsFunded: 3741,
          lastUpdated: new Date()
        };

        updateCommunityImpactData(communityData);
      }
    } catch (error) {
      console.error('Error loading Safe Assignment Fund stats:', error);
      // Use fallback data
      const communityData: CommunityImpactData = {
        totalMembers: 1247,
        monthlyAssignmentsFunded: 278,
        totalAssignmentsFunded: 3741,
        lastUpdated: new Date()
      };

      updateCommunityImpactData(communityData);
    }
  }, [state.subscription]);

  // Assignment management functions
  const createAssignment = useCallback(async (assignmentData: any): Promise<Assignment> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await createProtectionAssignment(assignmentData);
      if (error) throw error;

      // Update local state
      dispatch({ type: 'SET_ASSIGNMENT', payload: data });

      // Subscribe to real-time updates
      if (data.id) {
        subscribeToAssignmentUpdates(data.id, (payload) => {
          if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_ASSIGNMENT_STATUS',
              payload: {
                assignmentId: payload.new.id,
                status: payload.new.assignment_status
              }
            });
          }
        });
      }

      return data;
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAssignmentStatus = useCallback(async (assignmentId: string, status: string): Promise<void> => {
    try {
      const { error } = await updateProtectionAssignment(assignmentId, { assignment_status: status });
      if (error) throw error;

      // Update local state
      dispatch({
        type: 'UPDATE_ASSIGNMENT_STATUS',
        payload: { assignmentId, status }
      });
    } catch (error: any) {
      console.error('Error updating assignment status:', error);
      setError(error.message);
      throw error;
    }
  }, []);

  const activatePanicAlert = useCallback(async (location?: any): Promise<void> => {
    if (!state.user?.id) {
      throw new Error('User must be logged in to activate panic alert');
    }

    setLoading(true);
    setError(null);

    try {
      const currentLocation = location || state.assignmentState.lastKnownLocation;

      const { data, error } = await activateEmergency(
        state.user.id,
        currentLocation,
        state.assignmentState.activeAssignmentId || undefined
      );

      if (error) throw error;

      // Update local state
      dispatch({
        type: 'SET_PANIC_ALERT_SENT',
        payload: { sent: true, timestamp: new Date() }
      });

      // Add notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `emergency-${Date.now()}`,
          type: 'emergency',
          title: 'Emergency Alert Activated',
          message: 'Your panic alert has been sent. Emergency services are being contacted.',
          timestamp: new Date(),
          isRead: false,
          requiresAction: false,
        }
      });

      // Navigate to hub for real-time updates
      navigateToView('hub');

    } catch (error: any) {
      console.error('Error activating panic alert:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [state.user?.id, state.assignmentState, navigateToView]);

  const deactivatePanicAlert = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Find the latest emergency activation to deactivate
      // Note: This would need to be implemented with proper tracking
      // For now, just update local state
      dispatch({
        type: 'SET_PANIC_ALERT_SENT',
        payload: { sent: false }
      });

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `emergency-deactivated-${Date.now()}`,
          type: 'success',
          title: 'Emergency Alert Deactivated',
          message: 'Your panic alert has been successfully deactivated.',
          timestamp: new Date(),
          isRead: false,
          requiresAction: false,
        }
      });

    } catch (error: any) {
      console.error('Error deactivating panic alert:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLastKnownLocation = useCallback((location: { lat: number; lng: number; address: string }) => {
    dispatch({
      type: 'UPDATE_LAST_KNOWN_LOCATION',
      payload: {
        ...location,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Initialize Safe Assignment Fund data when subscription changes
  useEffect(() => {
    if (state.subscription?.tier === 'essential') {
      initializeSafeRideFundData();
    } else {
      updateSafeRideFundMetrics(null);
    }
  }, [state.subscription?.tier, initializeSafeRideFundData]); // Include callback dependency

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
    const savedNotifications = localStorage.getItem('armora_notifications');

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

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications) as any[];
        const normalized: INotificationItem[] = parsed.map((n: any) => ({
          id: n.id,
          type: n.type || 'info',
          title: n.title || 'Update',
          message: n.message || '',
          timestamp: n.timestamp ? new Date(n.timestamp) : new Date(),
          isRead: !!n.isRead,
          requiresAction: !!n.requiresAction,
          actionText: n.actionText,
        }));
        dispatch({ type: 'SET_NOTIFICATIONS', payload: normalized });
      } catch (e) {
        console.warn('Failed to parse saved notifications');
      }
    }
  }, [updateQuestionnaireData]);

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
    setUserProfileSelection,
    setError,
    clearError,
    setLoading,
    resetApp,
    setSubscription,
    setSelectedService,
    startFreeTrial,
    recordPremiumInterest,
    sendOwnerNotification,
    updateSafeRideFundMetrics,
    updateCommunityImpactData,
    initializeSafeRideFundData,
    addNotification: (n) => {
      const id = n.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const item: INotificationItem = {
        id,
        type: n.type || 'info',
        title: n.title || 'Update',
        message: n.message || '',
        timestamp: n.timestamp || new Date(),
        isRead: !!n.isRead,
        requiresAction: !!n.requiresAction,
        actionText: n.actionText,
        actionHandler: n.actionHandler,
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: item });
      try {
        const raw = localStorage.getItem('armora_notifications') || '[]';
        const parsed: any[] = JSON.parse(raw);
        parsed.unshift({ ...item, timestamp: item.timestamp.toISOString() });
        localStorage.setItem('armora_notifications', JSON.stringify(parsed));
      } catch {}
    },
    markNotificationRead: (id: string) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { id } });
      try {
        const raw = localStorage.getItem('armora_notifications') || '[]';
        const parsed: any[] = JSON.parse(raw);
        const updated = parsed.map(n => n.id === id ? { ...n, isRead: true } : n);
        localStorage.setItem('armora_notifications', JSON.stringify(updated));
      } catch {}
    },
    markAllNotificationsRead: () => {
      dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
      try {
        const raw = localStorage.getItem('armora_notifications') || '[]';
        const parsed: any[] = JSON.parse(raw);
        const updated = parsed.map(n => ({ ...n, isRead: true }));
        localStorage.setItem('armora_notifications', JSON.stringify(updated));
      } catch {}
    },
    // Assignment functions
    createAssignment,
    updateAssignmentStatus,
    activatePanicAlert,
    deactivatePanicAlert,
    updateLastKnownLocation,
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