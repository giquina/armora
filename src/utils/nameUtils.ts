// Armora Security Transport - Name Display Utilities

import { User } from '../types';

/**
 * Get the display name for a user based on their preference
 */
export const getDisplayName = (user: User): string => {
  if (!user) return 'User';

  // If no name preference system is set up, fall back to existing name
  if (!user.legalName && !user.preferredName) {
    return user.name?.split(' ')[0] || 'User';
  }

  switch (user.nameDisplay) {
    case 'preferred':
      return user.preferredName || user.legalName?.first || user.name?.split(' ')[0] || 'User';

    case 'formal':
      if (user.title && user.legalName?.last) {
        return `${user.title} ${user.legalName.last}`;
      }
      // Fallback if no title or last name
      return user.name?.split(' ').pop() || 'User';

    case 'first':
      return user.legalName?.first || user.name?.split(' ')[0] || 'User';

    default:
      // Default to preferred name if available, otherwise first name
      return user.preferredName || user.legalName?.first || user.name?.split(' ')[0] || 'User';
  }
};

/**
 * Get a formal greeting for a user
 */
export const getFormalGreeting = (user: User): string => {
  const displayName = getDisplayName(user);
  return `Welcome back, ${displayName}`;
};

/**
 * Get the user's full legal name
 */
export const getFullLegalName = (user: User): string => {
  if (user.legalName) {
    return `${user.legalName.first} ${user.legalName.last}`;
  }
  return user.name || 'User';
};

/**
 * Parse a full name into first and last components
 */
export const parseFullName = (fullName: string): { first: string; last: string } => {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return { first: parts[0], last: '' };
  }

  const first = parts.slice(0, -1).join(' ');
  const last = parts[parts.length - 1];

  return { first, last };
};

/**
 * Get available title options
 */
export const getTitleOptions = (): Array<{ value: User['title']; label: string }> => [
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Mx.', label: 'Mx.' },
  { value: 'Dr.', label: 'Dr.' }
];

/**
 * Get display preference options
 */
export const getDisplayOptions = (): Array<{ value: User['nameDisplay']; label: string; description: string }> => [
  {
    value: 'preferred',
    label: 'Preferred Name',
    description: 'Use your chosen nickname or short name'
  },
  {
    value: 'formal',
    label: 'Formal Address',
    description: 'Use title and last name (e.g., Mr. Smith)'
  },
  {
    value: 'first',
    label: 'First Name',
    description: 'Use your legal first name'
  }
];