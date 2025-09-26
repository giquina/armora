import React from 'react';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser
} from '@clerk/clerk-react';
import { useApp } from '../../contexts/AppContext';

interface ClerkAuthWrapperProps {
  children: React.ReactNode;
}

/**
 * ClerkAuthWrapper integrates Clerk authentication with Armora's existing auth system
 * Syncs Clerk users with Supabase profiles and manages user state
 */
export const ClerkAuthWrapper: React.FC<ClerkAuthWrapperProps> = ({ children }) => {
  const { user } = useUser();
  const { state, dispatch } = useApp();

  // Sync Clerk user with Armora user state
  React.useEffect(() => {
    if (user && !state.user) {
      // Create Armora user from Clerk user
      const armoraUser = {
        id: user.id,
        name: user.fullName || user.firstName || 'Member',
        email: user.primaryEmailAddress?.emailAddress || '',
        isAuthenticated: true,
        userType: 'registered' as const,
        hasCompletedQuestionnaire: false,
        hasUnlockedReward: false,
        subscriptionTier: 'guest' as const
      };

      dispatch({ type: 'SET_USER', payload: armoraUser });
      console.log('✅ Clerk user synced with Armora:', armoraUser);
    } else if (!user && state.user) {
      // Clear Armora user when Clerk user signs out
      dispatch({ type: 'SET_USER', payload: null });
      console.log('🔄 User signed out, clearing Armora state');
    }
  }, [user, state.user, dispatch]);


  return (
    <>
      {!user && (
        <>
          {/* Show existing auth flow when not signed in */}
          {children}
        </>
      )}

      {user && (
        <>
          {/* User is signed in - show main app */}
          {children}

          {/* Add UserButton in a non-intrusive way */}
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '50%',
            padding: '4px'
          }}>
            <UserButton
              afterSignOutUrl="/"
              showName={false}
              appearance={{
                elements: {
                  avatarBox: {
                    width: '32px',
                    height: '32px'
                  }
                }
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

/**
 * ClerkSignInButtons component for use in existing auth pages
 */
export const ClerkSignInButtons: React.FC = () => {
  const { user } = useUser();

  // Only show if not signed in
  if (user) return null;

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      marginTop: '16px'
    }}>
      <SignInButton mode="modal">
        <button style={{
          padding: '12px 24px',
          background: '#FFD700',
          color: '#1a1a2e',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          Sign In with Clerk
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button style={{
          padding: '12px 24px',
          background: 'transparent',
          color: '#FFD700',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          Sign Up with Clerk
        </button>
      </SignUpButton>
    </div>
  );
};

/**
 * Hook to check if Clerk is available
 */
export const useClerkAvailable = () => {
  return !!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
};