import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  saveQuestionnaireResponse,
} from "../lib/supabase"

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  preferred_protection_level?: 'essential' | 'executive' | 'shadow';
  security_requirements?: any;
  accessibility_needs?: any;
  emergency_contacts?: any[];
  account_type?: 'standard' | 'premium' | 'corporate';
  subscription_status?: 'active' | 'inactive' | 'cancelled';
  sia_verification_status?: 'pending' | 'verified' | 'failed';
  martyns_law_acknowledged?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  // Auth methods
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  // Profile methods
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Protection service methods
  saveQuestionnaire: (responses: any) => Promise<void>;
  acknowledgeMartynsLaw: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Always return a fallback in development to prevent app crashes
    console.warn('useAuth: AuthContext not found, returning mock implementation');
    return {
      user: null,
      session: null,
      profile: null,
      loading: false,
      error: null,
      signUp: async () => {},
      signIn: async () => {},
      signInWithGoogle: async () => {},
      signOut: async () => {},
      updateProfile: async () => {},
      refreshProfile: async () => {},
      saveQuestionnaire: async () => {},
      acknowledgeMartynsLaw: async () => {},
    } as AuthContextType;
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await getUserProfile(userId);
      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }

      // Handle auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in');
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          break;
        case 'USER_UPDATED':
          console.log('User updated');
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email
  const signUp = async (email: string, password: string, fullName?: string) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await signUpWithEmail(email, password, {
        full_name: fullName,
      });

      if (error) throw error;

      // Profile will be created automatically by database trigger
      // Update local state
      if (data.user) {
        setUser(data.user);
        if (data.session) {
          setSession(data.session);
        }
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email
  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        if (data.session) {
          setSession(data.session);
        }
        await fetchProfile(data.user.id);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const handleSignInWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // User state will be updated by onAuthStateChange listener
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await signOut();
      if (error) throw error;

      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);

      // Clear localStorage
      localStorage.removeItem('armoraUser');
      localStorage.removeItem('armoraQuestionnaireResponses');
      localStorage.removeItem('armoraBookingData');
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setError(null);
    setLoading(true);

    try {
      const { data, error } = await updateUserProfile(user.id, updates);

      if (error) throw error;

      setProfile(data);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  // Save questionnaire responses
  const saveQuestionnaire = async (responses: any) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setError(null);
    setLoading(true);

    try {
      const { error } = await saveQuestionnaireResponse(user.id, responses);

      if (error) throw error;

      // Update profile to mark questionnaire as completed
      await updateProfile({
        sia_verification_status: 'pending', // Trigger verification process
      });
    } catch (err: any) {
      console.error('Questionnaire save error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Acknowledge Martyn's Law
  const acknowledgeMartynsLaw = async () => {
    if (!user) {
      throw new Error('No user logged in');
    }

    await updateProfile({
      martyns_law_acknowledged: true,
    });
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    updateProfile,
    refreshProfile,
    saveQuestionnaire,
    acknowledgeMartynsLaw,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};