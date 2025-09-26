export const clerkConfig = {
  publishableKey: process.env.REACT_APP_CLERK_PUBLISHABLE_KEY,
  appearance: {
    elements: {
      formButtonPrimary: 'bg-black hover:bg-gray-800',
      card: 'shadow-lg',
    },
    variables: {
      colorPrimary: '#000000',
      colorText: '#1a1a1a',
    }
  }
}

// Protection service role helpers
export const userRoles = {
  PRINCIPAL: 'principal',
  PROTECTION_OFFICER: 'protection_officer',
  ADMIN: 'admin'
}