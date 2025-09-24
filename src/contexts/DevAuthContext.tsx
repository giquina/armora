import React, { createContext, useContext } from 'react';

// Development-only auth context that bypasses all authentication
const DevAuthContext = createContext<any>({
  user: null,
  profile: null,
  loading: false,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  updateProfile: () => Promise.resolve()
});

export function DevAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <DevAuthContext.Provider value={{
      user: null,
      profile: null,
      loading: false,
      signIn: () => Promise.resolve(),
      signUp: () => Promise.resolve(),
      signOut: () => Promise.resolve(),
      updateProfile: () => Promise.resolve()
    }}>
      {children}
    </DevAuthContext.Provider>
  );
}

export const useDevAuth = () => useContext(DevAuthContext);